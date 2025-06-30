import { createClient } from 'jsr:@supabase/supabase-js@2';
import { checkRateLimit, getRateLimitHeaders } from '../rate-limiter/index.ts';
import { judgePersonalization, logQualityMetrics } from '../quality-judge/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SupplementRecommendation {
  supplement: string;
  dosage: string;
  timing: string;
  reason: string;
  confidence_score: number;
  interactions?: string[];
  notes?: string;
  product?: {
    id: string;
    brand: string;
    product_name: string;
    product_url: string;
    price: number;
  };
}

// 🛡️ COMPREHENSIVE SUPPLEMENT INTERACTIONS - ALL 56 SUPPLEMENTS
const SUPPLEMENT_INTERACTIONS: Record<string, string[]> = {
  // ✅ EXISTING INTERACTIONS (Keep these - they work!)
  'Easy Iron': ['Calcium Citrate', 'Zinc', 'Magnesium'],
  'Calcium Citrate': ['Easy Iron', 'Zinc', 'Magnesium'],
  'Zinc': ['Easy Iron', 'Calcium Citrate', 'Chromium'],
  'Magnesium': ['Easy Iron', 'Calcium Citrate'],
  'Chromium': ['Zinc'],
  
  // 🆕 EXPANDED MINERAL INTERACTIONS
  'Trace Minerals': ['Easy Iron', 'Calcium Citrate', 'Zinc'],
  'Boron': ['Calcium Citrate', 'Magnesium'],
  
  // 🆕 AMINO ACID INTERACTIONS
  'Glutamine': ['Tyrosine', 'Arginine'], // Competition for transport
  'Tyrosine': ['Glutamine', 'Theanine'], // Both affect neurotransmitters
  'Theanine': ['Tyrosine', 'DHEA'], // Calming vs stimulating
  'Arginine': ['Glutamine', 'Citrulline'], // Same pathway
  'Citrulline': ['Arginine'], // Same pathway
  'Carnitine': ['BCAA'], // Metabolic competition
  'BCAA': ['Carnitine'], // Metabolic competition
  
  // 🆕 NEUROTRANSMITTER INTERACTIONS
  'DHEA': ['Theanine', 'Melatonin'], // Stimulating vs calming
  'Rhodiola': ['Ashwagandha'], // Both adaptogenic - may over-stimulate
  'Ashwagandha': ['Rhodiola', 'DHEA'], // Calming vs stimulating
  
  // 🆕 SLEEP/ENERGY INTERACTIONS
  'Melatonin': ['DHEA', 'Cordyceps'], // Sleep vs energy
  'Melatonin SR': ['DHEA', 'Cordyceps'], // Sleep vs energy
  'Cordyceps': ['Melatonin', 'Melatonin SR'], // Energy vs sleep
  'Herbal Sleep Blend': ['DHEA', 'Cordyceps'], // Sleep vs energy
  
  // 🆕 BLOOD SUGAR INTERACTIONS
  'Berberine': ['Chromium'], // Both lower glucose - risk of hypoglycemia
  'Green Coffee Extract': ['Berberine'], // Both affect glucose
  'Fenugreek': ['Berberine', 'Chromium'], // Blood sugar effects
  
  // 🆕 ANTIOXIDANT SYNERGIES (Safe together but watch doses)
  'CoQ10': [], // Generally safe with everything
  'Alpha Lipoic Acid': [], // Generally safe with everything
  'NAC': [], // Generally safe with everything
  'Resveratrol': [], // Generally safe with everything
  'Quercetin': [], // Generally safe with everything
  'Turmeric': [], // Generally safe with everything
  
  // 🆕 B-VITAMIN INTERACTIONS
  'Methyl B-Complex': [], // Generally safe - contains multiple B vitamins
  'Vitamin B12': [], // Generally safe
  'Biotin': [], // Generally safe
  
  // 🆕 OTHER VITAMINS
  'Vitamin D': ['Calcium Citrate'], // Both affect calcium metabolism
  'D Complex': ['Calcium Citrate'], // Contains D3+K2, affects calcium
  'Vitamin C': [], // Generally safe with everything
  'Vitamin E': [], // Generally safe with everything
  
  // 🆕 DIGESTIVE SUPPLEMENTS
  'Complete Probiotic': [], // Generally safe with everything
  'Digestive Enzymes': [], // Generally safe with everything
  'Soothing Fiber': [], // Generally safe with everything
  'Triphala': [], // Generally safe with everything
  
  // 🆕 SPECIALTY SUPPLEMENTS
  'Lion\'s Mane': [], // Generally safe
  'Mushroom Immune': [], // Generally safe
  'Milk Thistle': [], // Generally safe
  'Green Tea Extract': ['Berberine'], // Both affect metabolism
  'Elderberry': [], // Generally safe
  'Ginger Root': [], // Generally safe
  'Hyaluronic Acid': [], // Generally safe
  'NR': [], // Generally safe
  'DIM': [], // Generally safe
  'Vegan Glucosamine': [], // Generally safe
  'Forslean': ['Berberine'], // Both affect metabolism
  'Tribulus': ['DHEA'], // Both affect hormones
  'Big Libido': ['DHEA'], // Both affect hormones
  'Creatine': [], // Generally safe
  'Protein Powder': [], // Generally safe
};

// 🚨 COMPREHENSIVE SUPPLEMENT CONTRAINDICATIONS - CRITICAL SAFETY MATRIX
const SUPPLEMENT_CONTRAINDICATIONS: Record<string, {
  avoid_conditions: string[];
  warning_signs: string[];
  safety_note: string;
}> = {
  // ✅ EXISTING CRITICAL CONTRAINDICATION (Keep this!)
  'Glutamine': {
    avoid_conditions: [
      'cancer', 'tumor', 'malignancy', 'oncology', 'chemotherapy',
      'liver disease', 'cirrhosis', 'hepatic encephalopathy', 'liver failure',
      'kidney disease', 'renal failure', 'dialysis', 'chronic kidney disease',
      'seizure', 'epilepsy', 'seizure disorder',
      'bipolar', 'schizophrenia', 'psychosis', 'mania'
    ],
    warning_signs: [
      'history of cancer or tumors',
      'liver problems or confusion/brain fog with liver issues', 
      'kidney problems or reduced kidney function',
      'seizure history or neurological instability',
      'bipolar disorder or schizophrenia (especially if unstable)'
    ],
    safety_note: 'L-Glutamine should be avoided in cancer history, liver/kidney disease, seizure disorders, and unstable psychiatric conditions due to potential safety risks.'
  },
  
  // 🆕 EXPANDED CONTRAINDICATIONS
  'DHEA': {
    avoid_conditions: [
      'prostate cancer', 'breast cancer', 'hormone-sensitive cancer',
      'prostate enlargement', 'BPH', 'benign prostatic hyperplasia',
      'pregnancy', 'breastfeeding', 'trying to conceive'
    ],
    warning_signs: [
      'history of hormone-sensitive cancers',
      'prostate problems',
      'unexplained mood changes or aggression',
      'irregular menstrual cycles'
    ],
    safety_note: 'DHEA can affect hormone levels and should be avoided in hormone-sensitive conditions.'
  },
  
  'Berberine': {
    avoid_conditions: [
      'pregnancy', 'breastfeeding',
      'diabetes with insulin', 'hypoglycemia',
      'low blood pressure', 'hypotension'
    ],
    warning_signs: [
      'taking diabetes medications',
      'history of low blood sugar episodes',
      'dizziness or fainting spells'
    ],
    safety_note: 'Berberine can significantly lower blood sugar and blood pressure.'
  },
  
  'Green Coffee Extract': {
    avoid_conditions: [
      'anxiety disorder', 'panic disorder',
      'high blood pressure', 'hypertension',
      'heart arrhythmia', 'irregular heartbeat',
      'pregnancy', 'breastfeeding'
    ],
    warning_signs: [
      'caffeine sensitivity',
      'heart palpitations',
      'severe anxiety or panic attacks'
    ],
    safety_note: 'Contains caffeine and can worsen anxiety or heart conditions.'
  },
  
  'Melatonin': {
    avoid_conditions: [
      'autoimmune disease', 'lupus', 'rheumatoid arthritis',
      'depression', 'severe depression',
      'pregnancy', 'breastfeeding'
    ],
    warning_signs: [
      'worsening mood or depression',
      'daytime drowsiness',
      'morning grogginess lasting hours'
    ],
    safety_note: 'Can worsen depression and affect immune system.'
  },
  
  'Melatonin SR': {
    avoid_conditions: [
      'autoimmune disease', 'lupus', 'rheumatoid arthritis',
      'depression', 'severe depression',
      'pregnancy', 'breastfeeding'
    ],
    warning_signs: [
      'worsening mood or depression',
      'persistent daytime drowsiness',
      'morning brain fog lasting hours'
    ],
    safety_note: 'Sustained release can cause prolonged effects and worsen depression.'
  },
  
  'Green Tea Extract': {
    avoid_conditions: [
      'liver disease', 'hepatitis',
      'anxiety disorder', 'panic disorder',
      'iron deficiency anemia',
      'pregnancy', 'breastfeeding'
    ],
    warning_signs: [
      'liver problems',
      'iron deficiency',
      'caffeine sensitivity'
    ],
    safety_note: 'High doses can affect liver function and iron absorption.'
  },
  
  'Easy Iron': {
    avoid_conditions: [
      'hemochromatosis', 'iron overload',
      'thalassemia', 'sideroblastic anemia'
    ],
    warning_signs: [
      'family history of iron overload',
      'unexplained fatigue with normal iron levels',
      'joint pain and bronze skin coloration'
    ],
    safety_note: 'Iron supplementation dangerous in iron overload conditions.'
  }
};

Deno.serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('User auth error:', userError);
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Rate limiting: 10 plan generations per 5 minutes per user
    const rateLimit = checkRateLimit(`generate-plan:${user.id}`, 10, 5);
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please wait before generating another plan.' 
      }), {
        headers: { 
          ...corsHeaders, 
          ...getRateLimitHeaders(rateLimit.remainingRequests, rateLimit.resetTime),
          'Content-Type': 'application/json' 
        },
        status: 429,
      });
    }

    // --- Data Fetching ---
    const userId = user.id;

    const [
      { data: profile, error: profileError },
      { data: allergies, error: allergiesError },
      { data: conditions, error: conditionsError },
      { data: medications, error: medicationsError },
      { data: biomarkers, error: biomarkersError },
      { data: snps, error: snpsError },
      { data: products, error: productsError }
    ] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('user_allergies').select('ingredient_name').eq('user_id', userId).limit(50),
              supabase.from('user_conditions').select('condition_name').eq('user_id', userId).limit(30),
        supabase.from('user_medications').select('medication_name').eq('user_id', userId).limit(50),
      supabase.from('user_biomarkers').select('marker_name, value, unit, reference_range').eq('user_id', userId).limit(500),
      supabase.from('user_snps').select('*').eq('user_id', userId).limit(1000),
      // FILTER TO ONLY YOUR SUPPLEMENTS
      supabase.from('products').select('id, supplement_name, brand, product_name, product_url, price').eq('brand', 'OK Capsule')
    ]);

    // Check for critical errors (including profile error)
    const dataFetchError = profileError || allergiesError || conditionsError || medicationsError || biomarkersError || snpsError || productsError;
    if (dataFetchError) {
      console.error('Data fetching error:', dataFetchError);
      return new Response(JSON.stringify({ error: 'Failed to fetch health profile or product data.', details: dataFetchError }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Check if profile exists
    if (!profile) {
      console.error('No user profile found for user:', userId);
      return new Response(JSON.stringify({ 
        error: 'User profile not found. Please complete your onboarding first.',
        code: 'PROFILE_NOT_FOUND'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    console.log('Data fetch summary:', {
      profileExists: !!profile,
      allergiesCount: allergies?.length || 0,
      conditionsCount: conditions?.length || 0,
      medicationsCount: medications?.length || 0,
      biomarkersCount: biomarkers?.length || 0,
      snpsCount: snps?.length || 0,
      yourSupplementsCount: products?.length || 0
    });

    console.log('Sample biomarkers:', biomarkers?.slice(0, 5).map(b => `${b.marker_name}: ${b.value} ${b.unit}`));

    // Fetch supported SNPs for manual joining
    const { data: allSupportedSnps } = await supabase
      .from('supported_snps')
      .select('id, rsid, gene');
    
    // Create lookup map for SNPs
    const snpLookup = new Map();
    if (allSupportedSnps) {
      allSupportedSnps.forEach(snp => {
        snpLookup.set(snp.id, { rsid: snp.rsid, gene: snp.gene });
      });
    }

    // Enrich SNPs with gene data
    const enrichedSnps = snps?.map(userSnp => ({
      ...userSnp,
      supported_snps: snpLookup.get(userSnp.supported_snp_id) || null
    })) || [];

    console.log('Sample enriched SNPs:', enrichedSnps?.slice(0, 5).map(s => `${s.supported_snps?.rsid} (${s.supported_snps?.gene}): ${s.genotype}`));
    console.log('Profile questionnaire data:', {
      hasHealthGoals: !!(profile?.health_goals?.length),
      brainFog: profile?.brain_fog || 'not specified',
      sleepQuality: profile?.sleep_quality || 'not specified',
      anxietyLevel: profile?.anxiety_level || 'not specified',
      bloating: profile?.bloating || 'not specified',
      jointPain: profile?.joint_pain || 'not specified',
      previousLowNutrients: profile?.low_nutrients?.length || 0
    });
    
    // --- Data Consolidation ---
    const userProfile = profile || {};
    
    const healthHistory = {
      allergies: allergies?.map(a => a.ingredient_name) || [],
      conditions: conditions?.map(c => c.condition_name) || [],
      medications: medications?.map(m => m.medication_name) || [],
    };
    
    const labData = biomarkers || [];
    const geneticData = enrichedSnps || []; // Use enriched SNPs with gene data
    const availableProducts = products || [];

    // Determine personalization tier
    const personalizationTier = determinePersonalizationTier(labData, geneticData, userProfile);
    console.log(`Using personalization tier: ${personalizationTier}`);

    // Log the actual data being used for recommendations
    console.log('Health data for recommendations:', {
      labDataCount: labData.length,
      geneticDataCount: geneticData.length,
      hasUserProfile: Object.keys(userProfile).length > 0,
      healthHistoryItems: Object.values(healthHistory).flat().length,
      questionnaireFields: Object.keys(userProfile).filter(key => userProfile[key] !== null && userProfile[key] !== undefined).length,
      personalizationTier
    });

    // --- OpenAI API Call ---
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Create enhanced prompt for exactly 6 supplements
    const prompt = createSupplementPrompt(userProfile, healthHistory, labData, geneticData, availableProducts, personalizationTier);
    console.log('Generated enhanced prompt, calling OpenAI...');

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'o3',
        messages: [
          {
            role: 'system',
            content: getEnhancedSystemPrompt(personalizationTier, labData.length, geneticData.length)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
                  max_completion_tokens: 4000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate recommendations from OpenAI' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const openaiData = await openaiResponse.json();
    console.log('Received OpenAI response');
    const aiRecommendations = openaiData.choices[0]?.message?.content;

    if (!aiRecommendations) {
      console.error('No recommendations received from OpenAI');
      return new Response(JSON.stringify({ error: 'No recommendations generated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log('Parsing AI recommendations...');
    // Parse AI response and match with products
    const planDetails = parseAIRecommendations(aiRecommendations, availableProducts);
    console.log('Successfully parsed recommendations:', planDetails.recommendations?.length || 0);

    // CRITICAL VALIDATION: Must be exactly 6 supplements
    const recCount = planDetails.recommendations?.length || 0;
    if (recCount !== 6) {
      console.error(`CRITICAL: Got ${recCount} recommendations, MUST be exactly 6`);
      
      // Apply smart fallback to ensure exactly 6 supplements
      planDetails.recommendations = ensureExactlySixSupplements(planDetails.recommendations, availableProducts, userProfile, labData, geneticData);
      console.log(`✅ Fallback applied: Now have exactly ${planDetails.recommendations.length} recommendations`);
    } else {
      console.log(`✅ Perfect: Exactly ${recCount} recommendations generated`);
    }

    // Validate no interactions between selected supplements
    const interactionCheck = validateNoInteractions(planDetails.recommendations);
    if (!interactionCheck.valid) {
      console.log('Interaction detected, applying resolution...');
      planDetails.recommendations = resolveInteractions(planDetails.recommendations, availableProducts, userProfile);
      console.log('✅ Interactions resolved');
    }

    // Store the plan in the database
    console.log('Attempting to store plan for user:', userId);
    const { error: insertError } = await supabase
      .from('supplement_plans')
      .insert({
        user_id: userId,
        plan_details: planDetails,
      });

    if (insertError) {
      console.error('Failed to store supplement plan:', insertError);
      console.error('Insert error details:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
      return new Response(JSON.stringify({ 
        error: 'Failed to store supplement plan.', 
        details: insertError 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log('Successfully stored supplement plan');

    // 🚀 AUTOMATIC ORDER CREATION: Create Shopify order for full subscription users
    let orderCreationResult = null;
    if (profile.subscription_tier === 'full') {
      try {
        console.log('🛒 Creating automatic supplement order for full subscription user...');
        
        // Extract supplement names from the plan
        const supplementNames = planDetails.recommendations.map((rec: any) => rec.supplement);
        
        // Get the plan ID that was just created
        const { data: newPlan, error: planQueryError } = await supabase
          .from('supplement_plans')
          .select('id')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (planQueryError || !newPlan) {
          console.error('❌ Could not retrieve plan ID for order creation:', planQueryError);
        } else {
          // Call the create-shopify-order function
          const orderResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/create-shopify-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
            },
            body: JSON.stringify({
              userId: userId,
              supplementPlanId: newPlan.id,
              supplements: supplementNames
            })
          });
          
          if (orderResponse.ok) {
            orderCreationResult = await orderResponse.json();
            console.log('✅ Automatic order created successfully:', orderCreationResult.shopifyOrderId);
          } else {
            const errorText = await orderResponse.text();
            console.error('❌ Order creation failed:', errorText);
            // Don't fail plan generation if order creation fails
          }
        }
      } catch (orderError) {
        console.error('❌ Order creation error (not failing plan):', orderError);
        // Continue with plan generation even if order creation fails
      }
    } else {
      console.log('ℹ️ User has software-only subscription - no automatic order created');
    }

    // 🧠 SURGICAL ADDITION: Store AI-detected symptom patterns for memory synchronization
    try {
      console.log('🧬 Storing symptom patterns for AI memory synchronization...');
      
      // Re-run pattern analysis to get the exact same results as used in prompt
      const lifestyleProblems = [
        { key: 'energy_levels', problem: 'Often feels tired or low energy' },
        { key: 'effort_fatigue', problem: 'Physical activity feels more difficult than it should' },
        { key: 'caffeine_effect', problem: 'Relies on caffeine to get through the day' },
        { key: 'digestive_issues', problem: 'Experiences digestive discomfort regularly' },
        { key: 'stress_levels', problem: 'Feels stressed or anxious frequently' },
        { key: 'sleep_quality', problem: 'Has trouble falling asleep or staying asleep' },
        { key: 'mood_changes', problem: 'Experiences mood swings or irritability' },
        { key: 'brain_fog', problem: 'Experiences brain fog or difficulty concentrating' },
        { key: 'sugar_cravings', problem: 'Craves sugar or processed foods' },
        { key: 'skin_issues', problem: 'Has skin problems (acne, dryness, sensitivity)' },
        { key: 'joint_pain', problem: 'Experiences joint pain or stiffness' },
        { key: 'immune_system', problem: 'Gets sick more often than they\'d like' },
        { key: 'workout_recovery', problem: 'Takes longer to recover from workouts' },
        { key: 'food_sensitivities', problem: 'Certain foods make them feel unwell' },
        { key: 'weight_management', problem: 'Difficult to maintain healthy weight' },
        { key: 'medication_history', problem: 'Has been prescribed ADHD/Anxiety meds that haven\'t worked' }
      ];

      const activeProblems: any[] = [];
      lifestyleProblems.forEach(q => {
        if (userProfile[q.key] === 'yes') {
          activeProblems.push(q);
        }
      });

      const detectedPatterns = analyzeRootCausePatterns(activeProblems, userProfile, healthHistory);
      
      if (detectedPatterns.length > 0) {
        const patternInserts = detectedPatterns.map(pattern => ({
          user_id: userId,
          pattern_type: pattern.pattern_name.replace(/\s+/g, '_').toUpperCase(),
          pattern_name: pattern.pattern_name,
          confidence_score: 85, // High confidence since detected by main AI analysis
          symptoms_involved: pattern.symptoms,
          root_causes: [pattern.root_cause_explanation],
          pattern_description: pattern.root_cause_explanation,
          recommendations: pattern.synergistic_supplements,
          analysis_source: 'generate-plan',
          analysis_version: 'v1.0'
        }));
        
        // Use upsert to update existing patterns or create new ones
        const { error: patternError } = await supabase
          .from('user_symptom_patterns')
          .upsert(patternInserts, { 
            onConflict: 'user_id,pattern_type',
            ignoreDuplicates: false 
          });
        
        if (patternError) {
          console.error('⚠️ Pattern storage warning (not failing plan):', patternError);
        } else {
          console.log(`✅ Stored ${detectedPatterns.length} symptom patterns for AI memory`);
        }
      } else {
        console.log('ℹ️ No significant patterns detected for this user');
      }
      
    } catch (patternError) {
      console.error('⚠️ Pattern storage warning (not failing plan):', patternError);
      // Don't fail plan generation if pattern storage fails
    }

    // 🔥 ORCHESTRATION: Notify AI functions of updated health profile
    try {
      console.log('💊 Plan generated successfully. Refreshing AI ecosystem context...');
      
      // Note: AI functions (chat, product checker, study buddy) will automatically
      // fetch fresh data on next use - no explicit refresh needed since they
      // query the database directly for current user data
      
      console.log('✅ AI ecosystem context ready for fresh data');
      
    } catch (contextError) {
      console.error('⚠️ AI context refresh warning (not failing plan):', contextError);
      // Don't fail plan generation if context refresh fails
    }

    // 🎯 SIMPLE QUALITY MONITORING (ZERO RISK)
    console.log('🎯 QUALITY METRICS:', {
      function: 'generate-plan',
      user_id: userId,
      personalization_tier: personalizationTier,
      supplement_count: planDetails?.recommendations?.length || 0,
      has_biomarkers: labData.length > 0,
      has_genetics: geneticData.length > 0,
      timestamp: new Date().toISOString()
    });

    return new Response(JSON.stringify({ 
      success: true, 
      plan: planDetails,
      message: 'Ultimate personalized 6-supplement pack generated',
      personalization_tier: personalizationTier,
      order: orderCreationResult ? {
        created: true,
        shopifyOrderId: orderCreationResult.shopifyOrderId,
        nextOrderDate: orderCreationResult.nextOrderDate,
        message: 'Automatic supplement delivery initiated'
      } : {
        created: false,
        reason: profile.subscription_tier === 'full' ? 'Order creation failed' : 'Software-only subscription'
      },
      debug: {
        userId,
        profileExists: !!profile,
        subscriptionTier: profile.subscription_tier,
        healthDataCounts: {
          allergies: healthHistory.allergies.length,
          conditions: healthHistory.conditions.length,
          medications: healthHistory.medications.length,
          biomarkers: labData.length,
          snps: geneticData.length,
          yourSupplements: availableProducts.length
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      stack: error.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

function determinePersonalizationTier(labData: any[], geneticData: any[], profile: any): string {
  if (labData.length > 0 && geneticData.length > 0) {
    return 'PRECISION_MEDICINE'; // Tier 1: Full genetic + biomarker data
  } else if (labData.length > 0) {
    return 'BIOMARKER_FOCUSED'; // Tier 2: Biomarker data only
  } else if (profile && Object.keys(profile).length > 5) {
    return 'SYMPTOM_TARGETED'; // Tier 3: Rich symptom/questionnaire data
  } else {
    return 'FOUNDATIONAL_WELLNESS'; // Tier 4: Demographics only
  }
}

function getEnhancedSystemPrompt(tier: string, biomarkerCount: number, geneticCount: number): string {
  const basePrompt = `You are a deeply caring, empathetic clinical nutritionist who specializes in precision supplement recommendations. You have a gift for making people feel truly seen, understood, and hopeful about their health journey.

🎯 ULTIMATE MISSION: Create the perfect 6-supplement personalized pack with DEEPLY PERSONAL, healing-focused explanations that make the user feel cared for and understood

ABSOLUTE REQUIREMENTS:
1. EXACTLY 6 supplements (no more, no less)
2. ZERO interactions between supplements
3. Ultimate personalization based on available data
4. Only use supplements from the provided catalog
5. Holistic synchronized approach
6. 🔥 CRITICAL: Every "reason" field must be deeply personal, empathetic, and healing-focused
7. Write as if you're reaching out to help them heal and feel better
8. Connect their data to how they FEEL and how supplements will help them FEEL better

PERSONALIZATION TIER: ${tier}
Available Data: ${biomarkerCount} biomarkers, ${geneticCount} genetic variants

🔥 COMMUNICATION STYLE:
- Warm, caring, and supportive tone
- Make them feel seen and understood
- Connect their data to their actual experiences
- Explain how supplements will help them feel better
- Use hopeful, encouraging language
- Show genuine care for their wellbeing

Your response must be valid JSON with exactly 6 items in the recommendations array.
EVERY explanation must be deeply personal, connecting their specific data to their feelings and experiences.`;

  switch (tier) {
    case 'PRECISION_MEDICINE':
      return basePrompt + `

🧬 PRECISION MEDICINE APPROACH:
- Connect their genetic variants to their lived experiences and struggles
- Explain how their genetics have been affecting how they feel
- Show how precision supplements will work WITH their unique genetics
- Make them feel hopeful about overcoming genetic limitations
- Address biomarker deficiencies with deep understanding of their impact
- Use warm, encouraging language about their genetic uniqueness`;

    case 'BIOMARKER_FOCUSED':
      return basePrompt + `

🔬 BIOMARKER-FOCUSED APPROACH:
- Connect their lab results to their daily experiences and symptoms
- Explain how deficiencies have been affecting their quality of life
- Show genuine understanding of their struggles with energy, mood, etc.
- Paint a hopeful picture of how they'll feel when levels are optimized
- Address each deficiency with empathy and encouragement
- Make them feel understood and supported in their healing journey`;

    case 'SYMPTOM_TARGETED':
      return basePrompt + `

🎯 SYMPTOM-TARGETED APPROACH:
- Deeply acknowledge their symptoms and how they've been affecting their life
- Show genuine understanding of their daily struggles
- Connect supplements to relief of their specific symptoms
- Paint a hopeful picture of how they'll feel better
- Address their health goals with encouragement and support
- Make them feel heard and understood in their health journey`;

    case 'FOUNDATIONAL_WELLNESS':
      return basePrompt + `

🌟 FOUNDATIONAL WELLNESS APPROACH:
- Acknowledge their commitment to better health and wellness
- Connect age and lifestyle factors to their health goals
- Show understanding of their life stage and unique needs
- Provide hope and encouragement for their wellness journey
- Focus on prevention with a caring, supportive approach
- Make them feel supported in building a strong health foundation`;

    default:
      return basePrompt;
  }
}

function createSupplementPrompt(profile: any, healthHistory: any, labData: any[], geneticData: any[], products: any[], tier: string): string {
  let prompt = `🎯 ULTIMATE PERSONALIZED SUPPLEMENT PACK ANALYSIS

MISSION: Create the perfect 6-supplement personalized pack from your catalog.

PERSONALIZATION TIER: ${tier}

=== YOUR SUPPLEMENT CATALOG (${products.length} Available) ===\n`;

  // List all available supplements clearly
  products.forEach((product: any, index: number) => {
    prompt += `${index + 1}. ${product.supplement_name}\n`;
  });

  // 🔥 SUPPLEMENT CATEGORIZATION: 6-Pack vs Diet Plan Strategy
  prompt += `\n=== 🎯 SUPPLEMENT PACK STRATEGY (6 Essential vs Diet Plan) ===\n`;
  prompt += `Your 6-supplement pack should contain the "IMPOSSIBLE FROM FOOD" nutrients:\n\n`;
  
  prompt += `🏆 TIER 1 - IMPOSSIBLE FROM FOOD (Always prioritize for supplement pack):\n`;
  prompt += `• Vitamin D - Need 100+ salmon fillets daily to get therapeutic dose\n`;
  prompt += `• Magnesium - Food sources blocked by oxalates, soil depletion\n`;
  prompt += `• Omega 3 EPA/DHA - Need 2+ lbs fish daily + mercury concerns\n`;
  prompt += `• Vitamin B12 - Absorption declines with age, stomach acid issues\n`;
  prompt += `• Methyl B-Complex - MTHFR variants can't use food folate\n`;
  prompt += `• Zinc - Soil depletion + phytates block absorption\n\n`;
  
  prompt += `🥗 TIER 2 - ABUNDANT IN FOOD (Save for diet plan recommendations):\n`;
  prompt += `• Vitamin C - Easy from citrus, berries, vegetables\n`;
  prompt += `• Vitamin E - Nuts, seeds, avocados\n`;
  prompt += `• Folate - Leafy greens (if no MTHFR issues)\n`;
  prompt += `• Potassium - Bananas, potatoes, vegetables\n`;
  prompt += `• Calcium - Dairy, leafy greens, sardines\n\n`;
  
  prompt += `⚡ TIER 3 - THERAPEUTIC DOSES NEEDED (Include if medically necessary):\n`;
  prompt += `• CoQ10 - Heart conditions, statin users\n`;
  prompt += `• Berberine - Diabetes, metabolic syndrome\n`;
  prompt += `• Turmeric - Severe inflammation, arthritis\n`;
  prompt += `• Probiotics - Gut dysfunction, antibiotic use\n\n`;
  
  prompt += `🎯 STRATEGY: Focus your 6-pack on TIER 1 supplements that are impossible to get from food in therapeutic amounts. Save food-abundant nutrients for the diet plan.\n`;

  prompt += `\n=== PATIENT PROFILE ===\n`;

  // Demographics
  if (profile.age) prompt += `Age: ${profile.age} years\n`;
  if (profile.gender) prompt += `Gender: ${profile.gender}\n`;
  if (profile.weight_lbs) prompt += `Weight: ${profile.weight_lbs} lbs\n`;
  if (profile.activity_level) prompt += `Activity: ${profile.activity_level}\n`;


  // 🔥 PRIMARY HEALTH CONCERN - MOST IMPORTANT SECTION
  if (profile.primary_health_concern) {
    prompt += `\n🚨 PRIMARY HEALTH CONCERN (ABSOLUTE TOP PRIORITY):\n`;
    prompt += `"${profile.primary_health_concern}"\n`;
    prompt += `\n⚠️ CRITICAL: This is their MAIN concern. Your supplement plan MUST address this above all else.\n`;
  }

  // Health goals (including custom goals)
  if (profile.health_goals && profile.health_goals.length > 0) {
    prompt += `\n🎯 Health Goals:\n`;
    profile.health_goals.forEach((goal: string) => {
      prompt += `• ${goal}\n`;
    });
  }
  
  // Custom health goal (separate field)
  if (profile.custom_health_goal && profile.custom_health_goal.trim()) {
    prompt += `🎯 Custom Health Goal: "${profile.custom_health_goal}"\n`;
  }

  // 🔥 NEW: LIFESTYLE ASSESSMENT - 16 YES/NO QUESTIONS
  prompt += `\n=== 🔍 LIFESTYLE ASSESSMENT (16 Yes/No Health Questions) ===\n`;
  prompt += `These questions ask about health problems. "YES" means they HAVE the problem.\n\n`;
  
  // 🎯 COMPREHENSIVE LIFESTYLE PROBLEMS MAPPING - ALL 56 SUPPLEMENTS INTELLIGENTLY MAPPED
  const lifestyleProblems = [
    // ✅ EXISTING MAPPINGS (Keep these - they work!)
    { key: 'energy_levels', problem: 'Often feels tired or low energy', supplements: ['Easy Iron', 'Methyl B-Complex', 'CoQ10', 'Cordyceps', 'Rhodiola'] },
    { key: 'effort_fatigue', problem: 'Physical activity feels more difficult than it should', supplements: ['CoQ10', 'Magnesium', 'Easy Iron', 'Creatine', 'BCAA'] },
    { key: 'caffeine_effect', problem: 'Relies on caffeine to get through the day', supplements: ['Methyl B-Complex', 'Rhodiola', 'Magnesium', 'Ashwagandha'] },
    { key: 'digestive_issues', problem: 'Experiences digestive discomfort regularly', supplements: ['Complete Probiotic', 'Digestive Enzymes', 'Zinc', 'Triphala', 'Soothing Fiber', 'Ginger Root'] },
    { key: 'stress_levels', problem: 'Feels stressed or anxious frequently', supplements: ['Magnesium', 'Theanine', 'Ashwagandha', 'Rhodiola'] },
    { key: 'sleep_quality', problem: 'Has trouble falling asleep or staying asleep', supplements: ['Magnesium', 'Melatonin', 'Theanine', 'Herbal Sleep Blend', 'Melatonin SR'] },
    { key: 'mood_changes', problem: 'Experiences mood swings or irritability', supplements: ['Omega 3', 'Magnesium', 'Methyl B-Complex', 'Vitamin D'] },
    { key: 'brain_fog', problem: 'Experiences brain fog or difficulty concentrating', supplements: ['Methyl B-Complex', 'Omega 3', 'Lion\'s Mane', 'Alpha Lipoic Acid', 'Tyrosine'] },
    { key: 'sugar_cravings', problem: 'Craves sugar or processed foods', supplements: ['Chromium', 'Berberine', 'Methyl B-Complex', 'Alpha Lipoic Acid'] },
    { key: 'skin_issues', problem: 'Has skin problems (acne, dryness, sensitivity)', supplements: ['Zinc', 'Vitamin E', 'Omega 3', 'Biotin', 'Hyaluronic Acid'] },
    { key: 'joint_pain', problem: 'Experiences joint pain or stiffness', supplements: ['Turmeric', 'Omega 3', 'Vitamin D', 'Vegan Glucosamine', 'Boron'] },
    { key: 'immune_system', problem: 'Gets sick more often than they\'d like', supplements: ['Vitamin C', 'Vitamin D', 'Zinc', 'Elderberry', 'Mushroom Immune', 'NAC'] },
    { key: 'workout_recovery', problem: 'Takes longer to recover from workouts', supplements: ['Protein Powder', 'Magnesium', 'CoQ10', 'Creatine', 'BCAA', 'Citrulline'] },
    { key: 'food_sensitivities', problem: 'Certain foods make them feel unwell', supplements: ['Digestive Enzymes', 'Complete Probiotic', 'Quercetin', 'NAC'] },
    { key: 'weight_management', problem: 'Difficult to maintain healthy weight', supplements: ['Berberine', 'Chromium', 'Green Tea Extract', 'Green Coffee Extract', 'Forslean'] },
    { key: 'medication_history', problem: 'Has been prescribed ADHD/Anxiety meds that haven\'t worked', supplements: ['Magnesium', 'Methyl B-Complex', 'Omega 3', 'Theanine'] },
    
    // 🆕 EXPANDED MAPPINGS - Additional symptoms to cover all 56 supplements
    { key: 'heart_health', problem: 'Family history of heart disease or high cholesterol', supplements: ['CoQ10', 'Omega 3', 'Berberine', 'Magnesium', 'Resveratrol'] },
    { key: 'liver_health', problem: 'Drinks alcohol regularly or concerned about liver health', supplements: ['Milk Thistle', 'NAC', 'Alpha Lipoic Acid', 'Turmeric'] },
    { key: 'hormone_balance', problem: 'Hormonal imbalances or low libido', supplements: ['DHEA', 'Big Libido', 'Tribulus', 'DIM', 'Boron'] },
    { key: 'anti_aging', problem: 'Concerned about aging and longevity', supplements: ['NR', 'Resveratrol', 'CoQ10', 'Alpha Lipoic Acid', 'Hyaluronic Acid'] },
    { key: 'muscle_building', problem: 'Trying to build muscle or improve strength', supplements: ['Creatine', 'BCAA', 'Protein Powder', 'Carnitine', 'HMB'] },
    { key: 'blood_sugar', problem: 'Blood sugar issues or prediabetes', supplements: ['Berberine', 'Chromium', 'Alpha Lipoic Acid', 'Fenugreek'] },
    { key: 'inflammation', problem: 'Chronic inflammation or inflammatory conditions', supplements: ['Turmeric', 'Omega 3', 'Quercetin', 'Resveratrol', 'NAC'] },
    { key: 'detox_support', problem: 'Environmental toxin exposure or detox needs', supplements: ['NAC', 'Milk Thistle', 'Alpha Lipoic Acid', 'Glutamine'] },
    { key: 'cognitive_health', problem: 'Memory concerns or wanting to optimize brain function', supplements: ['Lion\'s Mane', 'Omega 3', 'Alpha Lipoic Acid', 'Tyrosine'] },
    { key: 'circulation', problem: 'Poor circulation or cardiovascular support needed', supplements: ['Citrulline', 'Arginine', 'Ginger Root', 'CoQ10'] }
  ];

  const activeProblems: any[] = [];
  const noProblems: any[] = [];

  lifestyleProblems.forEach(q => {
    const response = profile[q.key];
    const detailKey = `${q.key}_details`;
    const details = profile[detailKey];
    
    if (response === 'yes') {
      activeProblems.push({
        ...q,
        userDetails: details || null
      });
    } else if (response === 'no') {
      noProblems.push(q);
    }
  });

  if (activeProblems.length > 0) {
    prompt += `🔴 ACTIVE HEALTH PROBLEMS (Answered YES - URGENT SUPPLEMENTATION NEEDED):\n`;
    activeProblems.forEach(q => {
      prompt += `• ${q.problem} → Target with: ${q.supplements.join(', ')}\n`;
      if (q.userDetails) {
        prompt += `  💬 USER DETAILS: "${q.userDetails}"\n`;
      }
    });
    prompt += `\n⚠️ CRITICAL: These ${activeProblems.length} problems are actively affecting their daily life.\n`;
    prompt += `Your supplement plan MUST prioritize addressing these issues.\n`;
    prompt += `PAY SPECIAL ATTENTION to the user's specific details - they provide crucial context!\n`;
  }

  if (noProblems.length > 0) {
    prompt += `\n✅ AREAS FUNCTIONING WELL (Answered NO - These are strengths):\n`;
    noProblems.slice(0, 5).forEach(q => {
      prompt += `• Does NOT have: ${q.problem}\n`;
    });
    if (noProblems.length > 5) {
      prompt += `... and ${noProblems.length - 5} other areas functioning well\n`;
    }
  }

  // 🔍 NEW: Cross-Symptom Pattern Analysis from Detail Fields
  const detailsProvided = activeProblems.filter(p => p.userDetails).length;
  if (detailsProvided > 0) {
    prompt += `\n=== 🔍 DETAILED SYMPTOM PATTERN ANALYSIS (${detailsProvided} details provided) ===\n`;
    prompt += `Analyze these user-provided details for hidden patterns:\n\n`;
    
    // Collect all details for pattern analysis
    const allDetails: string[] = [];
    activeProblems.forEach(problem => {
      if (problem.userDetails) {
        allDetails.push(`${problem.problem}: "${problem.userDetails}"`);
      }
    });
    
    prompt += allDetails.join('\n') + '\n\n';
    
    prompt += `🎯 PATTERN DETECTION INSTRUCTIONS:\n`;
    prompt += `1. Look for TIMING patterns (morning, after meals, 3pm crashes, etc.)\n`;
    prompt += `2. Identify TRIGGERS (stress, food, activity, weather)\n`;
    prompt += `3. Find CONNECTIONS between symptoms (e.g., fatigue + brain fog + weight gain = thyroid)\n`;
    prompt += `4. Detect SEVERITY indicators (frequency, duration, impact on life)\n`;
    prompt += `5. Notice FAMILY patterns mentioned (genetic predispositions)\n\n`;
    
    prompt += `⚠️ If patterns suggest undiagnosed conditions, prioritize supplements that address the root cause!\n`;
  }

  // Optional manual biomarker input (Step 8 - user-entered text)
  if (profile.known_biomarkers && profile.known_biomarkers.trim()) {
    prompt += `\n🚨 CRITICAL USER-ENTERED BIOMARKER DATA:\n`;
    prompt += `"${profile.known_biomarkers}"\n`;
    prompt += `🔴 MANDATORY: Treat any out-of-range values as HIGH PRIORITY requiring targeted supplements.\n`;
    prompt += `📊 Parse specific values - use Berberine for cholesterol/glucose, Omega 3 for inflammation, etc.\n`;
  }

  // 🔥 ROOT CAUSE PATTERN DETECTION - Look for COMBINATIONS, not isolated symptoms
  prompt += `\n=== 🧬 ROOT CAUSE PATTERN ANALYSIS ===\n`;
  prompt += `Look for COMBINATIONS of symptoms that suggest underlying dysfunction patterns:\n\n`;

  // Analyze for root cause patterns
  const rootCausePatterns = analyzeRootCausePatterns(activeProblems, profile, healthHistory);
  if (rootCausePatterns.length > 0) {
    prompt += `🎯 DETECTED DYSFUNCTION PATTERNS (2+ symptoms = pattern):\n`;
    rootCausePatterns.forEach(pattern => {
      prompt += `• ${pattern.pattern_name}: ${pattern.symptoms.join(' + ')}\n`;
      prompt += `  → Synergistic Stack: ${pattern.synergistic_supplements.join(' + ')}\n`;
      prompt += `  → Root Cause: ${pattern.root_cause_explanation}\n\n`;
    });
    prompt += `⚠️ CRITICAL: These patterns indicate underlying dysfunction. Prioritize synergistic supplement combinations.\n`;
  }

  // 🔥 NEUROTRANSMITTER EXCESS DETECTION - Check for patterns indicating excess
  const excessPatterns = detectNeurotransmitterExcess(activeProblems, noProblems, profile);
  if (excessPatterns.length > 0) {
    prompt += `\n🚨 NEUROTRANSMITTER EXCESS PATTERNS DETECTED:\n`;
    excessPatterns.forEach(excess => {
      prompt += `• ${excess.neurotransmitter} EXCESS signs: ${excess.indicators.join(' + ')}\n`;
      prompt += `  🚫 CONTRAINDICATE: ${excess.avoid_supplements.join(', ')}\n`;
      prompt += `  ✅ SAFE ALTERNATIVES: ${excess.safe_alternatives.join(', ')}\n\n`;
    });
    prompt += `⚠️ CRITICAL: Do NOT recommend contraindicated supplements - could worsen symptoms.\n`;
  }

  // Optional manual genetic variant input (Step 8 - user-entered text)
  if (profile.known_genetic_variants && profile.known_genetic_variants.trim()) {
    prompt += `\n🧬 USER-ENTERED GENETIC VARIANTS (Step 8 - Optional):\n`;
    prompt += `"${profile.known_genetic_variants}"\n`;
    prompt += `⚠️ IMPORTANT: Consider these genetic variants they manually entered.\n`;
  }

  // Health history
  if (healthHistory.conditions.length > 0) {
    prompt += `\n🏥 Conditions: ${healthHistory.conditions.join(', ')}\n`;
    
    // 🚨 ENHANCED MEDICAL CONDITION ANALYSIS
    prompt += `\n=== 🏥 CRITICAL MEDICAL CONDITIONS ANALYSIS ===\n`;
    
    const conditionAnalysis = analyzeMedicalConditions(healthHistory.conditions);
    if (conditionAnalysis.critical.length > 0) {
      prompt += `🔴 HIGH PRIORITY MEDICAL CONDITIONS (Must Drive Supplement Selection):\n`;
      conditionAnalysis.critical.forEach(condition => {
        prompt += `• ${condition.condition}: ${condition.supplement_guidance}\n`;
        prompt += `  Priority Score: ${condition.priority_score} | Category: ${condition.category}\n`;
      });
    }
    
    if (conditionAnalysis.moderate.length > 0) {
      prompt += `\n🟡 MODERATE PRIORITY CONDITIONS:\n`;
      conditionAnalysis.moderate.forEach(condition => {
        prompt += `• ${condition.condition}: ${condition.supplement_guidance}\n`;
      });
    }
    
    if (conditionAnalysis.multi_condition_guidance) {
      prompt += `\n🔗 MULTI-CONDITION SYNERGIES:\n${conditionAnalysis.multi_condition_guidance}\n`;
    }

    // 🚨 CRITICAL SUPPLEMENT CONTRAINDICATIONS CHECK
    prompt += `\n=== 🚨 CRITICAL SUPPLEMENT SAFETY CONTRAINDICATIONS ===\n`;
    
    // 🚨 COMPREHENSIVE CONTRAINDICATION CHECKING - ALL DANGEROUS SUPPLEMENTS
    const contraindications: string[] = [];
    
    // Check each supplement for contraindications
    Object.keys(SUPPLEMENT_CONTRAINDICATIONS).forEach(supplement => {
      const hasContraindication = healthHistory.conditions.some((condition: string) => 
        SUPPLEMENT_CONTRAINDICATIONS[supplement].avoid_conditions.some((avoid: string) => 
          condition.toLowerCase().includes(avoid.toLowerCase())
        )
      );
      
      if (hasContraindication) {
        contraindications.push(supplement);
        prompt += `🚫 ${supplement.toUpperCase()} CONTRAINDICATED: ${SUPPLEMENT_CONTRAINDICATIONS[supplement].safety_note}\n`;
        prompt += `⚠️ NEVER recommend ${supplement} due to: ${healthHistory.conditions.join(', ')}\n`;
      }
    });
    
    if (contraindications.length === 0) {
      prompt += `✅ No major contraindications detected for available supplements.\n`;
    } else {
      prompt += `\n🔴 CRITICAL: ${contraindications.length} supplements are CONTRAINDICATED - avoid at all costs!\n`;
    }
  }
  if (healthHistory.medications.length > 0) {
    prompt += `💊 Medications: ${healthHistory.medications.join(', ')}\n`;
  }
  if (healthHistory.allergies.length > 0) {
    prompt += `⚠️ Allergies: ${healthHistory.allergies.join(', ')}\n`;
  }

  // Laboratory data (if available)
  if (labData.length > 0) {
    prompt += `\n=== 🚨 CRITICAL BIOMARKER DEFICIENCIES (TOP PRIORITY) ===\n`;
    
    // Identify and prioritize deficiencies
    const deficiencies: any[] = [];
    const normal: any[] = [];
    
    labData.forEach((marker: any) => {
      const value = parseFloat(marker.value);
      const name = marker.marker_name.toLowerCase();
      
      // Define deficiency thresholds for common markers
      const isDeficient = 
        (name.includes('vitamin d') && value < 30) ||
        (name.includes('b12') && value < 300) ||
        (name.includes('magnesium') && value < 1.8) ||
        (name.includes('iron') && value < 60) ||
        (name.includes('ferritin') && value < 30) ||
        (name.includes('folate') && value < 3) ||
        (name.includes('zinc') && value < 70);
      
      if (isDeficient) {
        deficiencies.push(marker);
      } else {
        normal.push(marker);
      }
    });
    
    // Show deficiencies first (HIGHEST PRIORITY)
    if (deficiencies.length > 0) {
      prompt += `🔴 DEFICIENT MARKERS (MUST ADDRESS FIRST):\n`;
      deficiencies.forEach((marker: any) => {
        prompt += `• ${marker.marker_name}: ${marker.value} ${marker.unit || ''} (ref: ${marker.reference_range || 'optimal range'})\n`;
      });
    }
    
    // Show normal markers
    if (normal.length > 0) {
      prompt += `\n✅ NORMAL MARKERS:\n`;
      normal.slice(0, 10).forEach((marker: any) => {
        prompt += `• ${marker.marker_name}: ${marker.value} ${marker.unit || ''}\n`;
      });
      
      if (normal.length > 10) {
        prompt += `... and ${normal.length - 10} additional normal markers\n`;
      }
    }
  }

  // Genetic data (if available) - ENHANCED WITH SMART PRIORITIZATION
  if (geneticData.length > 0) {
    // Use smart prioritization instead of random slice
    const prioritizedSNPs = prioritizeActionableSNPs(geneticData, products);
    
    prompt += `\n=== 🧬 KEY GENETIC VARIANTS (${geneticData.length} total, showing ${prioritizedSNPs.length} most actionable) ===\n`;
    
    prioritizedSNPs.forEach((snp: any) => {
      if (snp.rsid && snp.gene) {
        prompt += `• ${snp.rsid} (${snp.gene}): ${snp.genotype}`;
        if (snp.available_supplements && snp.available_supplements.length > 0) {
          prompt += ` → Matches: ${snp.available_supplements.join(', ')}`;
        }
        if (snp.impact_description) {
          prompt += ` | ${snp.impact_description}`;
        }
        prompt += '\n';
      }
    });
    
    if (geneticData.length > prioritizedSNPs.length) {
      prompt += `... and ${geneticData.length - prioritizedSNPs.length} additional variants (less directly actionable with current catalog)\n`;
    }
  }

  // 🚨 ADD CRITICAL "BIG 3" MANDATORY CHECKS
  prompt += `

🚨🚨🚨 CRITICAL "BIG 3" MANDATORY CHECKS - DO NOT MISS THESE! 🚨🚨🚨

Before creating your recommendations, you MUST check for these three critical situations:

1. **MTHFR VARIANTS & FAILED PSYCH MEDS** - If they have ANY of these red flags:
   - MTHFR variants (rs1801133, rs1801131) = genetic methylation issues
   - Brain fog + fatigue + anxiety/depression + poor sleep = STRONG MTHFR signs  
   - Failed ADHD/anxiety medications (medication_history = 'yes') = MAJOR methylation red flag
   - You MUST include "Methyl B-Complex" - this is absolutely non-negotiable
   - NEVER miss this - it's life-changing for MTHFR variants and failed psych meds

2. **VITAMIN D DEFICIENCY** - If they have vitamin D < 30 ng/mL OR symptoms suggesting deficiency:
   - Depression/mood issues + fatigue + immune problems + bone/joint pain = vitamin D deficiency signs
   - You MUST include "Vitamin D" or "D Complex" - this is essential
   - Most people are deficient - don't miss this critical nutrient

3. **MAGNESIUM DEFICIENCY** - If they have symptoms suggesting magnesium deficiency:
   - Poor sleep + anxiety/stress + muscle tension + headaches + sugar cravings = magnesium deficiency signs
   - You MUST include "Magnesium" - this is foundational for most people
   - Magnesium deficiency is epidemic - be very liberal with this recommendation

⚠️ THESE ARE THE BIG 3 THAT MOST PEOPLE NEED - DO NOT MISS THEM WHEN THE SIGNS ARE THERE!

🔗 SYNERGISTIC SUPPLEMENT COMBINATIONS - Work together for maximum benefit:

METHYLATION SYNERGY STACK (if MTHFR signs or failed psych meds):
• Methyl B-Complex + Vitamin B12 + Magnesium (methylation pathway support)

ENERGY SYNERGY STACK (if mitochondrial dysfunction):  
• CoQ10 + Magnesium + Easy Iron (cellular energy production)

INFLAMMATION SYNERGY STACK (if joint pain/skin issues):
• Omega 3 + Turmeric + Vitamin D (anti-inflammatory cascade)

GUT HEALING SYNERGY STACK (if digestive issues):
• Complete Probiotic + Digestive Enzymes + Zinc (gut repair & function)

STRESS RESILIENCE STACK (if anxiety/sleep issues):
• Magnesium + Ashwagandha + Theanine (nervous system support)

⚡ PRIORITIZE SYNERGISTIC COMBINATIONS: Choose supplements that work together rather than random individual supplements. These stacks amplify each other's benefits.

🎯 ULTIMATE PERSONALIZATION REQUIREMENTS:

1. **EXACTLY 6 SUPPLEMENTS** - Count them before responding
2. **ZERO INTERACTIONS** - No supplements that interfere with each other
3. **SAFETY FIRST** - Never recommend contraindicated supplements (check L-Glutamine warnings above)
4. **HOLISTIC APPROACH** - Work together synergistically
5. **MAXIMUM PERSONALIZATION** - Based on all available data
6. **YOUR CATALOG ONLY** - Use only the supplements listed above
7. **BIG 3 PRIORITY** - Never miss MTHFR, Vitamin D, or Magnesium when indicated

🎯 PRIORITIZATION HIERARCHY (MANDATORY ORDER - NEVER OVERRIDE):
1. 🚨 PRIMARY HEALTH CONCERN - Address their stated main concern FIRST (NON-NEGOTIABLE)
2. 🔬 USER-ENTERED BIOMARKERS - Address manually entered biomarker concerns (HIGHEST PRIORITY)
3. 🧬 USER-ENTERED GENETICS - Consider manually entered genetic variants (VERY HIGH PRIORITY)
4. 🏥 CRITICAL MEDICAL CONDITIONS - Target serious medical conditions (HIGH PRIORITY)
5. 🔴 ACTIVE HEALTH PROBLEMS - Address lifestyle issues they answered "YES" to
6. 🎯 ROOT CAUSE PATTERNS - Use pattern analysis to enhance, NOT override above priorities
7. 🎯 HEALTH GOALS - Support their stated objectives
8. FOUNDATIONAL WELLNESS - Fill remaining slots

🚨 CRITICAL SYNCHRONIZATION RULES:
- PRIMARY HEALTH CONCERN is SACRED - never override with pattern analysis
- User-entered genetic/biomarker data ALWAYS takes precedence over pattern detection
- Pattern analysis should ENHANCE and SUPPORT user inputs, not replace them
- If someone says "I have MTHFR" in genetic field, methylation pattern is CONFIRMED
- If someone enters "B12 deficiency" in biomarkers, that's DEFINITIVE
- Medical conditions ALWAYS override symptom patterns when there's conflict

CRITICAL: The PRIMARY HEALTH CONCERN is their most important issue. At least 2-3 supplements should directly address this concern.

🔥 CRITICAL PERSONALIZATION INSTRUCTIONS:
- Each "reason" field MUST be deeply personal, empathetic, and healing-focused
- Write as if you're a caring health coach who truly understands their struggle
- Connect their specific data to how they FEEL and what they're experiencing
- 🚨 ALWAYS reference their PRIMARY HEALTH CONCERN in your reasoning when relevant
- Explain HOW this supplement will specifically help THEM feel better
- Use warm, supportive language that shows you care about their wellbeing
- Make them feel seen, understood, and hopeful about their health journey

🎯 HOLISTIC HEALTH INTEGRATION:
- Process ALL available user data simultaneously from the sections provided above
- Use their EXACT words for symptoms from "LIFESTYLE DETAILS" section - never paraphrase
- Apply your medical knowledge to connect whatever data IS available: genetics (if uploaded) + biomarkers (if uploaded) + lifestyle + demographics + conditions
- **BIOMARKER & SNP DATA IS OPTIONAL** - many users won't have this data uploaded
- Work with whatever data is available - if missing biomarkers/genetics, focus on lifestyle patterns and demographics
- Find the unified biological narrative using ONLY the data explicitly provided in this prompt

🧬 ADAPTIVE PATTERN RECOGNITION:
- If they have biomarkers: integrate with lifestyle and genetics for precision recommendations
- If they have genetics: explain variants in context of their symptoms and demographics  
- If they have neither: focus on symptom patterns, demographics, and evidence-based supplement strategies
- Transform missing biomarker/genetic data into intelligent testing recommendations
- Connect their supplement needs to their complete available health story

🚨 DATA AVAILABILITY REQUIREMENTS:
- LIFESTYLE DATA: Always available - use their exact symptom words from provided sections
- BIOMARKER DATA: Optional - only reference if explicitly provided in biomarker section above
- GENETIC DATA: Optional - only reference variants shown in genetic data above  
- If biomarker/genetic data missing: "Without biomarker testing, I'm focusing on your symptom patterns..."
- Never assume or make up biomarker values or genetic variants not provided

REASONING EXAMPLES:
- Primary Concern: "You mentioned that your main concern is '${profile.primary_health_concern || '[their specific concern]'}' - this is exactly why I'm recommending this supplement. It directly addresses your primary worry by [specific mechanism]. You shouldn't have to live with this concern any longer."

- Lifestyle Symptoms: "Your afternoon energy crashes and need for 3-4 cups of coffee tell me your adrenals are working overtime. This adaptogen blend will help stabilize your energy naturally, so you won't need to rely on caffeine to get through the day. Many people with your exact pattern find they can cut their coffee intake in half within 2 weeks."

- Multiple Symptoms: "The combination of waking at 3am, afternoon brain fog, and sugar cravings all point to blood sugar dysregulation. This supplement helps stabilize glucose levels throughout the day and night, addressing all three issues at their root cause."

- Biomarkers: "Your Vitamin D level of 18 ng/mL explains so much about what you've been experiencing, especially regarding your primary concern about [their concern]. This severe deficiency is likely contributing to your brain fog, low energy, and difficulty with weight management. By bringing your Vitamin D to optimal levels (30-50 ng/mL), you should start feeling more mentally clear, energetic, and motivated to reach your health goals."

- Genetics: "Your MTHFR A1298C variant means your body has been working extra hard to process folate, which could be connected to your primary concern about [their concern]. This methylated B-complex bypasses your genetic limitation, giving your brain and nervous system the exact form of B vitamins they can actually use."

Provide EXACTLY 6 recommendations in this JSON format:

{
  "recommendations": [
    {
      "supplement": "Exact name from your catalog",
      "dosage": "SPECIFIC DOSAGE with units (e.g., '5000 IU daily', '400 mg daily', '2 capsules daily', '1000 mg daily')",
      "timing": "Take your complete daily pack with breakfast",
      "reason": "DEEPLY PERSONAL, empathetic explanation that connects their specific data to how they FEEL and how this supplement will help them feel better. Write as a caring health coach who truly understands their struggle and wants to help them heal and thrive. Make them feel seen, understood, and hopeful.",
      "confidence_score": 90,
      "notes": "Caring, supportive guidance specific to this individual's journey"
    }
  ],
  "general_notes": "Warm, encouraging message about how this personalized pack will help them feel better and achieve their health goals",
  "contraindications": "Important safety considerations specific to their profile, written with care and concern for their wellbeing"
}

🚨 DOSAGE REQUIREMENTS:
- ALWAYS include specific amounts with units (mg, IU, capsules, etc.)
- Examples: "5000 IU daily", "400 mg daily", "2 capsules daily", "1000 mg daily"
- Base dosages on individual needs, deficiency levels, and body weight
- For severe deficiencies: use higher therapeutic doses
- For maintenance: use standard preventive doses
- NEVER use vague terms like "as directed" - be specific!
- FIXED-DOSE PACKS: Do NOT suggest dosage adjustments (e.g., "reduce to 300mg if loose stools"). Instead suggest timing/food recommendations.

CRITICAL: Provide ONLY the JSON response. Count your recommendations - must be exactly 6. Make every explanation uniquely personal to THIS individual.`;

  return prompt;
}

// Smart SNP prioritization function - maps genetic variants to OK Capsule supplements
function prioritizeActionableSNPs(geneticData: any[], availableProducts: any[]): any[] {
  // Define SNP-to-supplement mapping based on your OK Capsule catalog
  const ACTIONABLE_SNP_MAP: Record<string, {
    priority: number;
    supplements: string[];
    impact_description: string;
  }> = {
    // TIER 1: Direct supplement matches (highest priority)
    'rs1801133': { // MTHFR C677T
      priority: 1,
      supplements: ['Methyl B-Complex', 'Vitamin B12'],
      impact_description: 'Requires methylated B vitamins - you have Methyl B-Complex and B12!'
    },
    'rs1801131': { // MTHFR A1298C  
      priority: 1,
      supplements: ['Methyl B-Complex', 'Vitamin B12'],
      impact_description: 'Needs methylated forms - perfect match with your catalog'
    },
    'rs4680': { // COMT Val158Met
      priority: 1, 
      supplements: ['Magnesium', 'Theanine'],
      impact_description: 'Benefits from magnesium and theanine for neurotransmitter support'
    },
    
    // TIER 2: Vitamin/mineral needs
    'rs2228570': { // VDR
      priority: 2,
      supplements: ['Vitamin D', 'D Complex'],
      impact_description: 'May need higher vitamin D doses - you have both options'
    },
    'rs1544410': { // VDR BsmI
      priority: 2,
      supplements: ['Vitamin D', 'D Complex', 'Magnesium'],
      impact_description: 'Affects vitamin D metabolism and magnesium needs'
    },
    'rs1799945': { // HFE H63D
      priority: 2,
      supplements: ['Easy Iron'],
      impact_description: 'Iron metabolism variant - Easy Iron is perfect form'
    },
    'rs1800562': { // HFE C282Y
      priority: 2,
      supplements: ['Easy Iron', 'Vitamin C'],
      impact_description: 'Iron processing variant - needs careful iron management'
    },
    'rs1801198': { // TCN2 B12 transport
      priority: 2,
      supplements: ['Vitamin B12', 'Methyl B-Complex'],
      impact_description: 'B12 transport variant - methylcobalamin form preferred'
    },
    
    // TIER 3: Antioxidant/metabolic support
    'rs4880': { // SOD2
      priority: 3,
      supplements: ['CoQ10', 'Alpha Lipoic Acid', 'NAC'],
      impact_description: 'Antioxidant enzyme variant - multiple antioxidant options available'
    },
    'rs1801282': { // PPARG
      priority: 3,
      supplements: ['Berberine', 'Chromium'],
      impact_description: 'Metabolic variant - berberine and chromium support available'
    },
    'rs7903146': { // TCF7L2
      priority: 3,
      supplements: ['Berberine', 'Chromium', 'Alpha Lipoic Acid'],
      impact_description: 'Glucose metabolism - excellent metabolic support options'
    },
    'rs11645428': { // BCMO1
      priority: 3,
      supplements: ['Multivitamin'],
      impact_description: 'Beta-carotene conversion variant - may need pre-formed vitamin A'
    },
    'rs12934922': { // BCMO1
      priority: 3,
      supplements: ['Multivitamin'],
      impact_description: 'Beta-carotene conversion variant - pre-formed vitamin A recommended'
    },
    
    // TIER 4: Specialized support
    'rs1050450': { // GPX1
      priority: 4,
      supplements: ['NAC', 'Alpha Lipoic Acid'],
      impact_description: 'Glutathione pathway - NAC provides precursor support'
    },
    'rs1695': { // GSTP1
      priority: 4,
      supplements: ['NAC', 'Milk Thistle'],
      impact_description: 'Detoxification variant - NAC and milk thistle support'
    },
    'rs1643649': { // DHFR
      priority: 4,
      supplements: ['Methyl B-Complex'],
      impact_description: 'Folate metabolism variant - avoid folic acid, use methylated forms'
    },
    'rs602662': { // FUT2
      priority: 4,
      supplements: ['Complete Probiotic', 'Vitamin B12'],
      impact_description: 'Gut microbiome variant - affects B12 absorption'
    },
    'rs601338': { // FUT2
      priority: 4,
      supplements: ['Complete Probiotic', 'Vitamin B12'],
      impact_description: 'Non-secretor variant - impacts gut health and B12 status'
    }
  };

  // Score and sort SNPs by actionability
  const scoredSNPs = geneticData.map(snp => {
    const rsid = snp.supported_snps?.rsid || snp.snp_id || snp.rsid;
    const gene = snp.supported_snps?.gene || snp.gene_name || snp.gene;
    
    const mapping = ACTIONABLE_SNP_MAP[rsid];
    if (mapping) {
      // Check if we actually have the relevant supplements
      const availableSupplements = mapping.supplements.filter(suppName =>
        availableProducts.some(product => 
          product.supplement_name.toLowerCase().includes(suppName.toLowerCase())
        )
      );
      
      return {
        ...snp,
        actionability_score: mapping.priority + (availableSupplements.length * 2),
        available_supplements: availableSupplements,
        impact_description: mapping.impact_description,
        rsid,
        gene
      };
    }
    
    return {
      ...snp,
      actionability_score: 10, // Low priority for unmapped SNPs
      available_supplements: [],
      impact_description: 'General genetic variant',
      rsid,
      gene
    };
  });

  // Sort by actionability (lower score = higher priority)
  return scoredSNPs
    .sort((a, b) => a.actionability_score - b.actionability_score)
    .slice(0, 8); // Return top 8 most actionable
}

function parseAIRecommendations(aiResponse: string, products: any[]): any {
  try {
    // Create a map of supplement names to products
    const productMap = new Map();
    products.forEach(product => {
      productMap.set(product.supplement_name.toLowerCase(), product);
    });

    const cleanedResponse = aiResponse.trim();
    let jsonResponse;
    
    // Handle cases where AI might include extra text
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonResponse = JSON.parse(jsonMatch[0]);
    } else {
      jsonResponse = JSON.parse(cleanedResponse);
    }

    // Match recommendations with your products
    if (jsonResponse.recommendations) {
      jsonResponse.recommendations = jsonResponse.recommendations.map((rec: any) => {
        // Try exact match first
        let matchingProduct = productMap.get(rec.supplement.toLowerCase());
        
        // If no exact match, try partial matching
        if (!matchingProduct) {
          for (const [productName, product] of productMap.entries()) {
            if (productName.includes(rec.supplement.toLowerCase()) || 
                rec.supplement.toLowerCase().includes(productName)) {
              matchingProduct = product;
              break;
            }
          }
        }
        
        if (matchingProduct) {
          rec.product = {
            id: matchingProduct.id,
            brand: matchingProduct.brand,
            product_name: matchingProduct.product_name,
            product_url: matchingProduct.product_url,
            price: Number(matchingProduct.price) || 0
          };
        }
        
        // Ensure required fields are present
        
        // Ensure proper dosage format
        if (!rec.dosage || rec.dosage === "As directed" || rec.dosage === "as directed") {
          rec.dosage = getStandardDosage(rec.supplement);
        }
        
        return rec;
      });
    }
    
    return jsonResponse;
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    
    // Smart fallback with your top supplements
    const fallbackSupplements = products.slice(0, 6);
    
    return {
      recommendations: fallbackSupplements.map((product: any) => ({
        supplement: product.supplement_name,
        dosage: getStandardDosage(product.supplement_name),
        timing: "Take your complete daily pack with breakfast",
        reason: "Foundational wellness support - AI parsing failed",
        confidence_score: 60,

        product: {
          id: product.id,
          brand: product.brand,
          product_name: product.product_name,
          product_url: product.product_url,
          price: product.price
        }
      })),
      general_notes: "Foundational wellness pack - please regenerate for full personalization",
      contraindications: "Please consult with a healthcare provider before starting any supplements."
    };
  }
}

// Helper function to provide standard dosages for common supplements
function getStandardDosage(supplementName: string): string {
  const name = supplementName.toLowerCase();
  
  if (name.includes('vitamin d')) return '5000 IU daily';
  if (name.includes('b-complex') || name.includes('b complex')) return '1 capsule daily';
  if (name.includes('omega') || name.includes('fish oil')) return '2000 mg daily';
  if (name.includes('magnesium')) return '400 mg daily';
  if (name.includes('vitamin c')) return '1000 mg daily';
  if (name.includes('zinc')) return '15 mg daily';
  if (name.includes('iron')) return '18 mg daily';
  if (name.includes('calcium')) return '500 mg daily';
  if (name.includes('b12')) return '1000 mcg daily';
  if (name.includes('folate') || name.includes('folic')) return '800 mcg daily';
  if (name.includes('multivitamin')) return '1 tablet daily';
  if (name.includes('probiotic')) return '1 capsule daily';
  if (name.includes('turmeric') || name.includes('curcumin')) return '500 mg daily';
  if (name.includes('ashwagandha')) return '300 mg daily';
  if (name.includes('coq10') || name.includes('coenzyme')) return '100 mg daily';
  
  // Default fallback
  return '1 capsule daily';
}

function ensureExactlySixSupplements(recommendations: any[], products: any[], profile: any, labData: any[], geneticData: any[]): any[] {
  if (!recommendations || recommendations.length === 0) {
    // Complete fallback - create 6 foundational recommendations
    const foundational = ['Vitamin D', 'Magnesium', 'Omega 3', 'Vitamin B12', 'Vitamin C', 'Multivitamin'];
    return foundational.map(name => {
      const matchingProduct = products.find(p => p.supplement_name.toLowerCase().includes(name.toLowerCase()));
      if (matchingProduct) {
        return {
          supplement: matchingProduct.supplement_name,
          dosage: getStandardDosage(matchingProduct.supplement_name),
          timing: "Take your complete daily pack with breakfast",
          reason: "Foundational wellness support",
          confidence_score: 70,

          product: {
            id: matchingProduct.id,
            brand: matchingProduct.brand,
            product_name: matchingProduct.product_name,
            product_url: matchingProduct.product_url,
            price: matchingProduct.price
          }
        };
      }
      return null;
    }).filter(Boolean).slice(0, 6);
  }

  if (recommendations.length < 6) {
    // Add supplements to reach 6
    const currentSupps = recommendations.map(r => r.supplement.toLowerCase());
    const availableSupps = products.filter(p => !currentSupps.includes(p.supplement_name.toLowerCase()));
    
    const toAdd = 6 - recommendations.length;
    const additionalSupps = availableSupps.slice(0, toAdd);
    
    additionalSupps.forEach(product => {
      recommendations.push({
        supplement: product.supplement_name,
        dosage: getStandardDosage(product.supplement_name),
        timing: "Take your complete daily pack with breakfast",
        reason: "Additional wellness support to complete your 6-supplement pack",
        confidence_score: 65,
        product: {
          id: product.id,
          brand: product.brand,
          product_name: product.product_name,
          product_url: product.product_url,
          price: product.price
        }
      });
    });
  } else if (recommendations.length > 6) {
    // Trim to exactly 6 (keep highest confidence scores)
    recommendations.sort((a, b) => (b.confidence_score || 0) - (a.confidence_score || 0));
    recommendations = recommendations.slice(0, 6);
  }

  return recommendations;
}

function validateNoInteractions(recommendations: any[]): { valid: boolean; conflicts: string[] } {
  const conflicts: string[] = [];
  const suppNames = recommendations.map(r => r.supplement);

  for (let i = 0; i < suppNames.length; i++) {
    for (let j = i + 1; j < suppNames.length; j++) {
      const supp1 = suppNames[i];
      const supp2 = suppNames[j];
      
      if ((SUPPLEMENT_INTERACTIONS[supp1] && SUPPLEMENT_INTERACTIONS[supp1].includes(supp2)) || 
          (SUPPLEMENT_INTERACTIONS[supp2] && SUPPLEMENT_INTERACTIONS[supp2].includes(supp1))) {
        conflicts.push(`${supp1} conflicts with ${supp2}`);
      }
    }
  }

  return { valid: conflicts.length === 0, conflicts };
}

function resolveInteractions(recommendations: any[], products: any[], userProfile: any): any[] {
  const resolved = [...recommendations];
  const interactionCheck = validateNoInteractions(resolved);
  
  if (!interactionCheck.valid) {
    console.log('Interactions detected, applying priority-based resolution...');
    
    // Create priority map based on primary health concern
    const priorityMap = new Map<string, number>();
    
    if (userProfile.primary_health_concern) {
      const concern = userProfile.primary_health_concern.toLowerCase();
      console.log(`Analyzing primary concern for priorities: "${concern}"`);
      
      // Higher priority number = higher importance (PRIMARY CONCERN = 100)
      if (concern.includes('iron') || concern.includes('anemia') || concern.includes('ferritin') || concern.includes('hemoglobin')) {
        priorityMap.set('Easy Iron', 100);
        console.log('🔥 PRIORITY: Easy Iron set to 100 (primary concern match)');
      }
      if (concern.includes('magnesium')) {
        priorityMap.set('Magnesium', 100);
        console.log('🔥 PRIORITY: Magnesium set to 100 (primary concern match)');
      }
      if (concern.includes('zinc')) {
        priorityMap.set('Zinc', 100);
        console.log('🔥 PRIORITY: Zinc set to 100 (primary concern match)');
      }
      if (concern.includes('calcium') || concern.includes('bone')) {
        priorityMap.set('Calcium Citrate', 100);
        console.log('🔥 PRIORITY: Calcium Citrate set to 100 (primary concern match)');
      }
    }
    
    // Remove conflicting supplements based on priority
    const toRemove: string[] = [];
    
    interactionCheck.conflicts.forEach(conflict => {
      const [supp1, supp2] = conflict.split(' conflicts with ');
      console.log(`Resolving conflict: ${supp1} vs ${supp2}`);
      
      // Determine which supplement to keep based on priority
      const priority1 = priorityMap.get(supp1) || 0;
      const priority2 = priorityMap.get(supp2) || 0;
      
      console.log(`Priorities: ${supp1}=${priority1}, ${supp2}=${priority2}`);
      
      if (priority1 > priority2) {
        toRemove.push(supp2); // Remove supp2, keep supp1
        console.log(`✅ Keeping ${supp1} (higher priority), removing ${supp2}`);
      } else if (priority2 > priority1) {
        toRemove.push(supp1); // Remove supp1, keep supp2
        console.log(`✅ Keeping ${supp2} (higher priority), removing ${supp1}`);
      } else {
        // If equal priority, keep higher confidence score
        const rec1 = resolved.find(r => r.supplement === supp1);
        const rec2 = resolved.find(r => r.supplement === supp2);
        
        if ((rec1?.confidence_score || 0) >= (rec2?.confidence_score || 0)) {
          toRemove.push(supp2);
          console.log(`✅ Keeping ${supp1} (higher confidence), removing ${supp2}`);
        } else {
          toRemove.push(supp1);
          console.log(`✅ Keeping ${supp2} (higher confidence), removing ${supp1}`);
        }
      }
    });
    
    // Remove the supplements marked for removal
    const uniqueToRemove = [...new Set(toRemove)];
    uniqueToRemove.forEach(suppName => {
      const index = resolved.findIndex(r => r.supplement === suppName);
      if (index !== -1) {
        console.log(`Removing ${suppName} due to interaction`);
        resolved.splice(index, 1);
      }
    });
    
    // Fill back to 6 with non-conflicting alternatives
    const currentSupps = resolved.map(r => r.supplement.toLowerCase());
    const availableAlternatives = products.filter(p => 
      !currentSupps.includes(p.supplement_name.toLowerCase()) &&
      !hasInteractionWithCurrent(p.supplement_name, resolved)
    );
    
    const needed = 6 - resolved.length;
    const alternatives = availableAlternatives.slice(0, needed);
    
    alternatives.forEach(alt => {
      console.log(`Adding alternative: ${alt.supplement_name}`);
      resolved.push({
        supplement: alt.supplement_name,
        dosage: getStandardDosage(alt.supplement_name),
        timing: "Take your complete daily pack with breakfast",
        reason: "Alternative selection to avoid supplement interactions while maintaining your personalized plan",
        confidence_score: 60,
        product: {
          id: alt.id,
          brand: alt.brand,
          product_name: alt.product_name,
          product_url: alt.product_url,
          price: alt.price
        }
      });
    });
  }
  
  return resolved;
}

function hasInteractionWithCurrent(supplementName: string, currentRecommendations: any[]): boolean {
  const currentSupps = currentRecommendations.map(r => r.supplement);
  
  return currentSupps.some(currentSupp => 
    (SUPPLEMENT_INTERACTIONS[supplementName] && SUPPLEMENT_INTERACTIONS[supplementName].includes(currentSupp)) ||
    (SUPPLEMENT_INTERACTIONS[currentSupp] && SUPPLEMENT_INTERACTIONS[currentSupp].includes(supplementName))
  );
}

// 🚨 MEDICAL CONDITION PRIORITIZATION SYSTEM
function analyzeMedicalConditions(conditions: string[]): {
  critical: Array<{
    condition: string;
    priority_score: number;
    category: string;
    supplement_guidance: string;
  }>;
  moderate: Array<{
    condition: string;
    priority_score: number;
    category: string;
    supplement_guidance: string;
  }>;
  multi_condition_guidance: string;
} {
  const critical: any[] = [];
  const moderate: any[] = [];
  
  conditions.forEach(condition => {
    const guidance = getMedicalConditionGuidance(condition.toLowerCase());
    if (guidance.priority === 'critical') {
      critical.push({
        condition: condition,
        priority_score: guidance.priority_score,
        category: guidance.category,
        supplement_guidance: guidance.supplement_guidance
      });
    } else {
      moderate.push({
        condition: condition,
        priority_score: guidance.priority_score,
        category: guidance.category,
        supplement_guidance: guidance.supplement_guidance
      });
    }
  });
  
  // Multi-condition analysis
  const multi_condition_guidance = analyzeConditionInteractions(conditions);
  
  return { critical, moderate, multi_condition_guidance };
}

// Medical condition guidance mapping (using only 56 available supplements)
function getMedicalConditionGuidance(condition: string): {
  priority: 'critical' | 'moderate';
  priority_score: number;
  category: string;
  supplement_guidance: string;
} {
  
  // 🔴 CRITICAL PRIORITY CONDITIONS (90-95 points)
  if (condition.includes('endometriosis')) {
    return {
      priority: 'critical', priority_score: 95, category: "Women's Health",
      supplement_guidance: "Omega 3 (inflammation), Magnesium (pain), Easy Iron (blood loss), DIM (hormone balance)"
    };
  }
  
  if (condition.includes('pcos') || condition.includes('polycystic')) {
    return {
      priority: 'critical', priority_score: 94, category: "Women's Health",
      supplement_guidance: "DIM (hormone balance), Berberine (insulin), Omega 3 (inflammation), Magnesium (stress)"
    };
  }
  
  if (condition.includes('hashimoto') || condition.includes('hypothyroid')) {
    return {
      priority: 'critical', priority_score: 93, category: "Thyroid",
      supplement_guidance: "Trace Minerals (iodine/selenium), Tyrosine (thyroid support), Ashwagandha (stress), Vitamin D"
    };
  }
  
  if (condition.includes('ibs') || condition.includes('irritable')) {
    return {
      priority: 'critical', priority_score: 92, category: "Digestive",
      supplement_guidance: "Complete Probiotic (gut health), Soothing Fiber (digestive), Magnesium (muscle relaxation), Glutamine (gut lining)"
    };
  }
  
  if (condition.includes('diabetes') || condition.includes('diabetic')) {
    return {
      priority: 'critical', priority_score: 94, category: "Metabolic",
      supplement_guidance: "Berberine (blood sugar), Chromium (insulin), Alpha Lipoic Acid (glucose metabolism), Magnesium (insulin sensitivity)"
    };
  }
  
  if (condition.includes('depression') || condition.includes('depressive')) {
    return {
      priority: 'critical', priority_score: 91, category: "Mental Health",
      supplement_guidance: "Methyl B-Complex (neurotransmitters), Omega 3 (brain health), Magnesium (mood), Vitamin D (seasonal depression)"
    };
  }
  
  if (condition.includes('anxiety') || condition.includes('panic')) {
    return {
      priority: 'critical', priority_score: 90, category: "Mental Health",
      supplement_guidance: "Magnesium (calm nervous system), Theanine (relaxation), Ashwagandha (stress response), GABA support"
    };
  }
  
  if (condition.includes('fibromyalgia')) {
    return {
      priority: 'critical', priority_score: 93, category: "Pain/Inflammation",
      supplement_guidance: "Magnesium (muscle pain), CoQ10 (energy), Omega 3 (inflammation), Methyl B-Complex (nerve function)"
    };
  }
  
  if (condition.includes('arthritis') || condition.includes('rheumatoid')) {
    return {
      priority: 'critical', priority_score: 92, category: "Pain/Inflammation", 
      supplement_guidance: "Omega 3 (inflammation), Turmeric (pain), Boron (joint health), Vitamin D (immune modulation)"
    };
  }
  
  if (condition.includes('crohn') || condition.includes('colitis') || condition.includes('inflammatory bowel')) {
    return {
      priority: 'critical', priority_score: 94, category: "Digestive",
      supplement_guidance: "Omega 3 (inflammation), Glutamine (gut repair), Complete Probiotic (microbiome), Vitamin D (immune)"
    };
  }
  
  // 🟡 MODERATE PRIORITY CONDITIONS (70-85 points)
  if (condition.includes('migraines') || condition.includes('headaches')) {
    return {
      priority: 'moderate', priority_score: 85, category: "Neurological",
      supplement_guidance: "Magnesium (prevention), CoQ10 (mitochondrial), Methyl B-Complex (B2 for migraines)"
    };
  }
  
  if (condition.includes('insomnia') || condition.includes('sleep')) {
    return {
      priority: 'moderate', priority_score: 82, category: "Sleep",
      supplement_guidance: "Magnesium (sleep quality), Melatonin (sleep regulation), Theanine (relaxation)"
    };
  }
  
  if (condition.includes('high blood pressure') || condition.includes('hypertension')) {
    return {
      priority: 'moderate', priority_score: 88, category: "Cardiovascular",
      supplement_guidance: "Magnesium (blood pressure), CoQ10 (heart health), Omega 3 (cardiovascular)"
    };
  }
  
  if (condition.includes('osteoporosis') || condition.includes('bone')) {
    return {
      priority: 'moderate', priority_score: 84, category: "Bone Health",
      supplement_guidance: "Calcium Citrate (bone structure), Vitamin D (calcium absorption), Boron (bone metabolism)"
    };
  }
  
  if (condition.includes('gerd') || condition.includes('acid reflux')) {
    return {
      priority: 'moderate', priority_score: 80, category: "Digestive",
      supplement_guidance: "Complete Probiotic (gut balance), Glutamine (stomach lining), avoid acidic supplements)"
    };
  }
  
  // 🔍 SMART FALLBACK SYSTEM for unknown conditions
  if (condition.includes('auto') || condition.includes('immune')) {
    return {
      priority: 'moderate', priority_score: 86, category: "Autoimmune",
      supplement_guidance: "Vitamin D (immune modulation), Omega 3 (inflammation), Complete Probiotic (gut-immune axis)"
    };
  }
  
  if (condition.includes('chronic fatigue') || condition.includes('tired')) {
    return {
      priority: 'moderate', priority_score: 87, category: "Energy",
      supplement_guidance: "CoQ10 (cellular energy), Methyl B-Complex (energy metabolism), Magnesium (muscle energy)"
    };
  }
  
  if (condition.includes('hormone') || condition.includes('menopause')) {
    return {
      priority: 'moderate', priority_score: 83, category: "Hormonal",
      supplement_guidance: "DIM (hormone balance), Magnesium (hormone synthesis), Omega 3 (hormone production)"
    };
  }
  
  // Default fallback
  return {
    priority: 'moderate', priority_score: 70, category: "General Health",
    supplement_guidance: "Focus on foundational nutrients based on symptoms and biomarkers"
  };
}

// Multi-condition interaction analysis
function analyzeConditionInteractions(conditions: string[]): string {
  const conditionSet = new Set(conditions.map(c => c.toLowerCase()));
  let guidance = "";
  
  // Inflammation pathway (common thread)
  const inflammatoryConditions = ['endometriosis', 'pcos', 'ibs', 'arthritis', 'fibromyalgia', 'crohn', 'colitis'];
  const hasInflammatory = inflammatoryConditions.some(condition => 
    Array.from(conditionSet).some(userCondition => userCondition.includes(condition))
  );
  
  if (hasInflammatory) {
    guidance += "Multiple inflammatory conditions detected → Prioritize Omega 3 + Turmeric + Magnesium for systemic inflammation control. ";
  }
  
  // Hormone-related conditions
  const hormoneConditions = ['endometriosis', 'pcos', 'menopause', 'hormone'];
  const hasHormonal = hormoneConditions.some(condition => 
    Array.from(conditionSet).some(userCondition => userCondition.includes(condition))
  );
  
  if (hasHormonal) {
    guidance += "Hormonal conditions detected → DIM essential for hormone metabolism. ";
  }
  
  // Mental health + physical conditions
  const mentalConditions = ['depression', 'anxiety', 'panic'];
  const physicalPain = ['fibromyalgia', 'arthritis', 'migraines'];
  const hasMental = mentalConditions.some(condition => 
    Array.from(conditionSet).some(userCondition => userCondition.includes(condition))
  );
  const hasPain = physicalPain.some(condition => 
    Array.from(conditionSet).some(userCondition => userCondition.includes(condition))
  );
  
  if (hasMental && hasPain) {
    guidance += "Mind-body connection → Magnesium addresses both mental stress and physical pain. ";
  }
  
  return guidance || "Consider foundational nutrients that support multiple systems.";
}

// 🔥 ROOT CAUSE PATTERN ANALYSIS FUNCTIONS - FULLY SYNCHRONIZED WITH ALL USER INPUTS
function analyzeRootCausePatterns(activeProblems: any[], profile: any, healthHistory: any): any[] {
  const patterns: any[] = [];
  
  // METHYLATION DYSFUNCTION PATTERN - Enhanced with ALL possible indicators
  const methylationSigns = activeProblems.filter(p => 
    ['brain_fog', 'mood_changes', 'energy_levels', 'medication_history'].includes(p.key)
  );
  
  // 🚨 CRITICAL: Check ALL methylation indicators, not just symptoms
  const hasMethylationIssues = 
    methylationSigns.length >= 2 || 
    profile.medication_history === 'yes' ||
    // Check user-entered genetic data for MTHFR mentions
    (profile.known_genetic_variants && profile.known_genetic_variants.toLowerCase().includes('mthfr')) ||
    // Check medical conditions for depression/anxiety (methylation-related)
    healthHistory.conditions.some((condition: string) => 
      condition.toLowerCase().includes('depression') || 
      condition.toLowerCase().includes('anxiety') ||
      condition.toLowerCase().includes('adhd')
    ) ||
    // Check user-entered biomarker data for B12/folate deficiency
    (profile.known_biomarkers && (
      profile.known_biomarkers.toLowerCase().includes('b12') || 
      profile.known_biomarkers.toLowerCase().includes('folate') ||
      profile.known_biomarkers.toLowerCase().includes('homocysteine')
    ));
  
  if (hasMethylationIssues) {
    const allMethylationIndicators = [
      ...methylationSigns.map(s => s.problem),
      ...(profile.medication_history === 'yes' ? ['Failed ADHD/anxiety medications'] : []),
      ...(profile.known_genetic_variants && profile.known_genetic_variants.toLowerCase().includes('mthfr') ? ['MTHFR genetic variant (user-entered)'] : []),
      ...healthHistory.conditions.filter((c: string) => c.toLowerCase().includes('depression') || c.toLowerCase().includes('anxiety')),
      ...(profile.known_biomarkers && profile.known_biomarkers.toLowerCase().includes('b12') ? ['B12 deficiency (user-entered)'] : [])
    ];
    
    patterns.push({
      pattern_name: 'METHYLATION DYSFUNCTION',
      symptoms: allMethylationIndicators,
      synergistic_supplements: ['Methyl B-Complex', 'Vitamin B12', 'Magnesium'],
      root_cause_explanation: 'Impaired methylation pathways affecting neurotransmitter production - DETECTED from multiple sources including user-entered data'
    });
  }
  
  // MITOCHONDRIAL DYSFUNCTION PATTERN - Enhanced with ALL possible indicators
  const mitochondrialSigns = activeProblems.filter(p => 
    ['energy_levels', 'effort_fatigue', 'workout_recovery'].includes(p.key)
  );
  
  const hasMitochondrialIssues = 
    mitochondrialSigns.length >= 2 ||
    // Check medical conditions for mitochondrial-related issues
    healthHistory.conditions.some((condition: string) => 
      condition.toLowerCase().includes('chronic fatigue') || 
      condition.toLowerCase().includes('fibromyalgia') ||
      condition.toLowerCase().includes('heart') ||
      condition.toLowerCase().includes('diabetes')
    ) ||
    // Check user-entered biomarkers for energy-related deficiencies
    (profile.known_biomarkers && (
      profile.known_biomarkers.toLowerCase().includes('coq10') || 
      profile.known_biomarkers.toLowerCase().includes('iron') ||
      profile.known_biomarkers.toLowerCase().includes('ferritin')
    ));
  
  if (hasMitochondrialIssues) {
    const allMitochondrialIndicators = [
      ...mitochondrialSigns.map(s => s.problem),
      ...healthHistory.conditions.filter((c: string) => 
        c.toLowerCase().includes('chronic fatigue') || c.toLowerCase().includes('fibromyalgia')
      ),
      ...(profile.known_biomarkers && profile.known_biomarkers.toLowerCase().includes('iron') ? ['Iron deficiency (user-entered)'] : [])
    ];
    
    patterns.push({
      pattern_name: 'MITOCHONDRIAL DYSFUNCTION',
      symptoms: allMitochondrialIndicators,
      synergistic_supplements: ['CoQ10', 'Magnesium', 'Easy Iron'],
      root_cause_explanation: 'Impaired cellular energy production in mitochondria - DETECTED from multiple sources'
    });
  }
  
  // INFLAMMATORY CASCADE PATTERN - Enhanced with ALL possible indicators
  const inflammatorySigns = activeProblems.filter(p => 
    ['joint_pain', 'skin_issues', 'digestive_issues'].includes(p.key)
  );
  
  const hasInflammatoryIssues = 
    inflammatorySigns.length >= 2 ||
    // Check medical conditions for inflammatory diseases
    healthHistory.conditions.some((condition: string) => 
      condition.toLowerCase().includes('arthritis') || 
      condition.toLowerCase().includes('ibs') ||
      condition.toLowerCase().includes('crohn') ||
      condition.toLowerCase().includes('colitis') ||
      condition.toLowerCase().includes('endometriosis') ||
      condition.toLowerCase().includes('pcos')
    ) ||
    // Check user-entered biomarkers for inflammation markers
    (profile.known_biomarkers && (
      profile.known_biomarkers.toLowerCase().includes('crp') || 
      profile.known_biomarkers.toLowerCase().includes('esr') ||
      profile.known_biomarkers.toLowerCase().includes('inflammation')
    ));
  
  if (hasInflammatoryIssues) {
    const allInflammatoryIndicators = [
      ...inflammatorySigns.map(s => s.problem),
      ...healthHistory.conditions.filter((c: string) => 
        c.toLowerCase().includes('arthritis') || c.toLowerCase().includes('ibs') || c.toLowerCase().includes('endometriosis')
      ),
      ...(profile.known_biomarkers && profile.known_biomarkers.toLowerCase().includes('crp') ? ['Elevated CRP (user-entered)'] : [])
    ];
    
    patterns.push({
      pattern_name: 'INFLAMMATORY CASCADE',
      symptoms: allInflammatoryIndicators,
      synergistic_supplements: ['Omega 3', 'Turmeric', 'Vitamin D'],
      root_cause_explanation: 'Chronic systemic inflammation affecting multiple body systems - DETECTED from multiple sources'
    });
  }
  
  // GUT MICROBIOME DYSFUNCTION PATTERN - Enhanced with ALL possible indicators
  const gutSigns = activeProblems.filter(p => 
    ['digestive_issues', 'food_sensitivities', 'immune_system'].includes(p.key)
  );
  
  const hasGutIssues = 
    gutSigns.length >= 2 ||
    // Check medical conditions for gut-related issues
    healthHistory.conditions.some((condition: string) => 
      condition.toLowerCase().includes('ibs') || 
      condition.toLowerCase().includes('crohn') ||
      condition.toLowerCase().includes('colitis') ||
      condition.toLowerCase().includes('gerd') ||
      condition.toLowerCase().includes('sibo')
    ) ||
    // Check medications for gut-disrupting drugs
    healthHistory.medications.some((medication: string) => 
      medication.toLowerCase().includes('antibiotic') || 
      medication.toLowerCase().includes('ppi') ||
      medication.toLowerCase().includes('acid blocker')
    ) ||
    // Check allergies for food sensitivities
    healthHistory.allergies.length > 2;
  
  if (hasGutIssues) {
    const allGutIndicators = [
      ...gutSigns.map(s => s.problem),
      ...healthHistory.conditions.filter((c: string) => 
        c.toLowerCase().includes('ibs') || c.toLowerCase().includes('crohn') || c.toLowerCase().includes('gerd')
      ),
      ...(healthHistory.medications.some((m: string) => m.toLowerCase().includes('antibiotic')) ? ['Recent antibiotic use'] : []),
      ...(healthHistory.allergies.length > 2 ? ['Multiple food sensitivities'] : [])
    ];
    
    patterns.push({
      pattern_name: 'GUT MICROBIOME DYSFUNCTION',
      symptoms: allGutIndicators,
      synergistic_supplements: ['Complete Probiotic', 'Digestive Enzymes', 'Zinc'],
      root_cause_explanation: 'Imbalanced gut bacteria affecting digestion and immunity - DETECTED from multiple sources'
    });
  }
  
  // SLEEP DISORDER PATTERN - Safe sleep supplements only
  const sleepSigns = activeProblems.filter(p => 
    ['sleep_quality', 'energy_levels', 'brain_fog', 'mood_changes'].includes(p.key)
  );
  
  const hasSleepIssues = 
    sleepSigns.some(s => s.key === 'sleep_quality') || // Must have sleep quality issues
    // Check medical conditions for sleep disorders
    healthHistory.conditions.some((condition: string) => 
      condition.toLowerCase().includes('sleep apnea') || 
      condition.toLowerCase().includes('insomnia') ||
      condition.toLowerCase().includes('restless leg')
    ) ||
    // Check medications for sleep-affecting drugs
    healthHistory.medications.some((medication: string) => 
      medication.toLowerCase().includes('sleep') || 
      medication.toLowerCase().includes('melatonin') ||
      medication.toLowerCase().includes('ambien')
    );
  
  if (hasSleepIssues) {
    const allSleepIndicators = [
      ...sleepSigns.map(s => s.problem),
      ...healthHistory.conditions.filter((c: string) => 
        c.toLowerCase().includes('sleep apnea') || c.toLowerCase().includes('insomnia')
      ),
      ...(healthHistory.medications.some((m: string) => m.toLowerCase().includes('sleep')) ? ['Taking sleep medications'] : [])
    ];
    
    patterns.push({
      pattern_name: 'SLEEP DISORDER',
      symptoms: allSleepIndicators,
      synergistic_supplements: ['Magnesium', 'Melatonin', 'Theanine'],
      root_cause_explanation: 'Sleep disruption affecting energy, cognition, and mood - DETECTED from multiple sources'
    });
  }
  
  // TOXIC BURDEN PATTERN - Safe detox supplements only
  const toxicSigns = activeProblems.filter(p => 
    ['brain_fog', 'energy_levels', 'skin_issues', 'digestive_issues', 'joint_pain'].includes(p.key)
  );
  
  const hasToxicBurden = 
    toxicSigns.length >= 3 || // Multiple system involvement
    // Check user-entered biomarkers for toxic exposure
    (profile.known_biomarkers && (
      profile.known_biomarkers.toLowerCase().includes('heavy metal') || 
      profile.known_biomarkers.toLowerCase().includes('mercury') ||
      profile.known_biomarkers.toLowerCase().includes('lead') ||
      profile.known_biomarkers.toLowerCase().includes('cadmium')
    )) ||
    // Check medical conditions for toxin-related issues
    healthHistory.conditions.some((condition: string) => 
      condition.toLowerCase().includes('chemical sensitivity') || 
      condition.toLowerCase().includes('mcs') ||
      condition.toLowerCase().includes('environmental illness')
    );
  
  if (hasToxicBurden) {
    const allToxicIndicators = [
      ...toxicSigns.map(s => s.problem),
      ...(profile.known_biomarkers && profile.known_biomarkers.toLowerCase().includes('heavy metal') ? ['Heavy metal exposure (user-entered)'] : []),
      ...healthHistory.conditions.filter((c: string) => 
        c.toLowerCase().includes('chemical sensitivity') || c.toLowerCase().includes('environmental illness')
      )
    ];
    
    patterns.push({
      pattern_name: 'TOXIC BURDEN',
      symptoms: allToxicIndicators,
      synergistic_supplements: ['NAC', 'Vitamin C', 'Glutathione'],
      root_cause_explanation: 'Accumulated toxins affecting multiple body systems - DETECTED from multiple sources'
    });
  }
  
  // ADRENAL FATIGUE PATTERN - Safe adaptogenic supplements
  const adrenalSigns = activeProblems.filter(p => 
    ['energy_levels', 'stress_levels', 'sugar_cravings', 'mood_changes', 'sleep_quality'].includes(p.key)
  );
  
  const hasAdrenalFatigue = 
    adrenalSigns.length >= 3 || // Multiple stress-related symptoms
    // Check user-entered biomarkers for adrenal markers
    (profile.known_biomarkers && (
      profile.known_biomarkers.toLowerCase().includes('cortisol') || 
      profile.known_biomarkers.toLowerCase().includes('dhea') ||
      profile.known_biomarkers.toLowerCase().includes('adrenal')
    )) ||
    // Check medical conditions for stress-related issues
    healthHistory.conditions.some((condition: string) => 
      condition.toLowerCase().includes('adrenal') || 
      condition.toLowerCase().includes('chronic fatigue') ||
      condition.toLowerCase().includes('burnout')
    );
  
  if (hasAdrenalFatigue) {
    const allAdrenalIndicators = [
      ...adrenalSigns.map(s => s.problem),
      ...(profile.known_biomarkers && profile.known_biomarkers.toLowerCase().includes('cortisol') ? ['Cortisol dysregulation (user-entered)'] : []),
      ...healthHistory.conditions.filter((c: string) => 
        c.toLowerCase().includes('adrenal') || c.toLowerCase().includes('chronic fatigue')
      )
    ];
    
    patterns.push({
      pattern_name: 'ADRENAL FATIGUE',
      symptoms: allAdrenalIndicators,
      synergistic_supplements: ['Ashwagandha', 'Rhodiola', 'Vitamin C'],
      root_cause_explanation: 'Chronic stress overwhelming adrenal function - DETECTED from multiple sources'
    });
  }
  
  // NUTRITIONAL DEFICIENCY PATTERN - Safe basic nutrients
  const deficiencySigns = activeProblems.filter(p => 
    ['energy_levels', 'immune_system', 'brain_fog', 'mood_changes', 'skin_issues'].includes(p.key)
  );
  
  const hasNutritionalDeficiencies = 
    deficiencySigns.length >= 2 ||
    // Check user-entered biomarkers for specific deficiencies
    (profile.known_biomarkers && (
      profile.known_biomarkers.toLowerCase().includes('vitamin d') || 
      profile.known_biomarkers.toLowerCase().includes('b12') ||
      profile.known_biomarkers.toLowerCase().includes('iron') ||
      profile.known_biomarkers.toLowerCase().includes('magnesium') ||
      profile.known_biomarkers.toLowerCase().includes('zinc')
    )) ||
    // Check medical conditions that commonly cause deficiencies
    healthHistory.conditions.some((condition: string) => 
      condition.toLowerCase().includes('anemia') || 
      condition.toLowerCase().includes('malabsorption') ||
      condition.toLowerCase().includes('celiac')
    );
  
  if (hasNutritionalDeficiencies) {
    const allDeficiencyIndicators = [
      ...deficiencySigns.map(s => s.problem),
      ...(profile.known_biomarkers && profile.known_biomarkers.toLowerCase().includes('vitamin d') ? ['Vitamin D deficiency (user-entered)'] : []),
      ...(profile.known_biomarkers && profile.known_biomarkers.toLowerCase().includes('b12') ? ['B12 deficiency (user-entered)'] : []),
      ...(profile.known_biomarkers && profile.known_biomarkers.toLowerCase().includes('iron') ? ['Iron deficiency (user-entered)'] : []),
      ...healthHistory.conditions.filter((c: string) => 
        c.toLowerCase().includes('anemia') || c.toLowerCase().includes('malabsorption')
      )
    ];
    
    patterns.push({
      pattern_name: 'NUTRITIONAL DEFICIENCY',
      symptoms: allDeficiencyIndicators,
      synergistic_supplements: ['Vitamin D', 'Vitamin B12', 'Easy Iron'],
      root_cause_explanation: 'Multiple nutrient deficiencies affecting energy and health - DETECTED from multiple sources'
    });
  }
  
  // HYPOTHYROID DYSFUNCTION PATTERN - Safe thyroid support supplements ONLY
  const hypothyroidSigns = activeProblems.filter(p => 
    ['energy_levels', 'weight_management', 'brain_fog', 'mood_changes'].includes(p.key)
  );
  
  const hasHypothyroidIssues = 
    hypothyroidSigns.length >= 3 || // Multiple hypothyroid symptoms
    // Check user-entered biomarkers for hypothyroid markers (HIGH TSH, LOW T3/T4)
    (profile.known_biomarkers && (
      (profile.known_biomarkers.toLowerCase().includes('tsh') && profile.known_biomarkers.toLowerCase().includes('high')) ||
      (profile.known_biomarkers.toLowerCase().includes('t3') && profile.known_biomarkers.toLowerCase().includes('low')) ||
      (profile.known_biomarkers.toLowerCase().includes('t4') && profile.known_biomarkers.toLowerCase().includes('low'))
    )) ||
    // Check medical conditions for hypothyroid conditions
    healthHistory.conditions.some((condition: string) => 
      condition.toLowerCase().includes('hypothyroid') || 
      condition.toLowerCase().includes('hashimoto') ||
      condition.toLowerCase().includes('underactive thyroid')
    );
  
  if (hasHypothyroidIssues) {
    const allHypothyroidIndicators = [
      ...hypothyroidSigns.map(s => s.problem),
      ...(profile.known_biomarkers && profile.known_biomarkers.toLowerCase().includes('tsh') && profile.known_biomarkers.toLowerCase().includes('high') ? ['High TSH (user-entered)'] : []),
      ...healthHistory.conditions.filter((c: string) => 
        c.toLowerCase().includes('hypothyroid') || c.toLowerCase().includes('hashimoto')
      )
    ];
    
    patterns.push({
      pattern_name: 'HYPOTHYROID DYSFUNCTION',
      symptoms: allHypothyroidIndicators,
      synergistic_supplements: ['Ashwagandha', 'Vitamin D', 'Zinc'],
      root_cause_explanation: 'Underactive thyroid affecting metabolism and energy - DETECTED from multiple sources'
    });
  }
  
  // HYPERTHYROID DYSFUNCTION PATTERN - Safe calming supplements ONLY (NO thyroid stimulants)
  const hyperthyroidSigns = activeProblems.filter(p => 
    ['stress_levels', 'sleep_quality', 'mood_changes'].includes(p.key)
  );
  
  const hasHyperthyroidIssues = 
    // Check user-entered biomarkers for hyperthyroid markers (LOW TSH, HIGH T3/T4)
    (profile.known_biomarkers && (
      (profile.known_biomarkers.toLowerCase().includes('tsh') && profile.known_biomarkers.toLowerCase().includes('low')) ||
      (profile.known_biomarkers.toLowerCase().includes('t3') && profile.known_biomarkers.toLowerCase().includes('high')) ||
      (profile.known_biomarkers.toLowerCase().includes('t4') && profile.known_biomarkers.toLowerCase().includes('high'))
    )) ||
    // Check medical conditions for hyperthyroid conditions
    healthHistory.conditions.some((condition: string) => 
      condition.toLowerCase().includes('hyperthyroid') || 
      condition.toLowerCase().includes('graves') ||
      condition.toLowerCase().includes('overactive thyroid')
    );
  
  if (hasHyperthyroidIssues) {
    const allHyperthyroidIndicators = [
      ...hyperthyroidSigns.map(s => s.problem),
      ...(profile.known_biomarkers && profile.known_biomarkers.toLowerCase().includes('tsh') && profile.known_biomarkers.toLowerCase().includes('low') ? ['Low TSH (user-entered)'] : []),
      ...healthHistory.conditions.filter((c: string) => 
        c.toLowerCase().includes('hyperthyroid') || c.toLowerCase().includes('graves')
      )
    ];
    
    patterns.push({
      pattern_name: 'HYPERTHYROID DYSFUNCTION',
      symptoms: allHyperthyroidIndicators,
              synergistic_supplements: ['Magnesium', 'Theanine', 'Omega 3'],
      root_cause_explanation: 'Overactive thyroid requiring calming support - DETECTED from multiple sources'
    });
  }
  
  // CHRONIC INFECTION PATTERN - Safe immune support supplements
  const infectionSigns = activeProblems.filter(p => 
    ['energy_levels', 'immune_system', 'joint_pain', 'brain_fog', 'mood_changes'].includes(p.key)
  );
  
  const hasChronicInfection = 
    infectionSigns.length >= 3 || // Multiple infection-related symptoms
    // Check medical conditions for chronic infections
    healthHistory.conditions.some((condition: string) => 
      condition.toLowerCase().includes('lyme') || 
      condition.toLowerCase().includes('epstein barr') ||
      condition.toLowerCase().includes('chronic fatigue') ||
      condition.toLowerCase().includes('fibromyalgia') ||
      condition.toLowerCase().includes('candida') ||
      condition.toLowerCase().includes('sibo')
    ) ||
    // Check medications for chronic infection treatments
    healthHistory.medications.some((medication: string) => 
      medication.toLowerCase().includes('antibiotic') || 
      medication.toLowerCase().includes('antiviral') ||
      medication.toLowerCase().includes('antifungal')
    );
  
  if (hasChronicInfection) {
    const allInfectionIndicators = [
      ...infectionSigns.map(s => s.problem),
      ...healthHistory.conditions.filter((c: string) => 
        c.toLowerCase().includes('lyme') || c.toLowerCase().includes('epstein barr') || c.toLowerCase().includes('chronic fatigue')
      ),
      ...(healthHistory.medications.some((m: string) => m.toLowerCase().includes('antibiotic')) ? ['Long-term antibiotic use'] : [])
    ];
    
    patterns.push({
      pattern_name: 'CHRONIC INFECTION',
      symptoms: allInfectionIndicators,
      synergistic_supplements: ['Vitamin C', 'Vitamin D', 'Zinc'],
      root_cause_explanation: 'Chronic infection burden affecting immune system and energy - DETECTED from multiple sources'
    });
  }
  
  return patterns;
}

function detectNeurotransmitterExcess(activeProblems: any[], noProblems: any[], profile: any): any[] {
  const excessPatterns: any[] = [];
  
  // DOPAMINE EXCESS PATTERN - Enhanced with genetic data check
  const highEnergyNoProblems = noProblems.filter(p => 
    ['energy_levels', 'effort_fatigue'].includes(p.key)
  );
  const restlessnessSigns = activeProblems.filter(p => 
    ['sleep_quality'].includes(p.key) && p.problem.includes('trouble falling asleep')
  );
  
  // Check for COMT slow variants (high dopamine) in user-entered genetic data
  const hasCOMTSlow = profile.known_genetic_variants && 
    (profile.known_genetic_variants.toLowerCase().includes('comt') && 
     (profile.known_genetic_variants.toLowerCase().includes('aa') || 
      profile.known_genetic_variants.toLowerCase().includes('slow')));
  
  const hasDopamineExcess = 
    (highEnergyNoProblems.length >= 1 && profile.caffeine_effect === 'makes me jittery') ||
    hasCOMTSlow ||
    (profile.caffeine_effect === 'makes me anxious' || profile.caffeine_effect === 'makes me jittery');
  
  if (hasDopamineExcess) {
    const dopamineIndicators = [
      ...(highEnergyNoProblems.length >= 1 ? ['High natural energy'] : []),
      ...(profile.caffeine_effect === 'makes me jittery' ? ['Caffeine makes jittery'] : []),
      ...(hasCOMTSlow ? ['COMT slow variant (user-entered genetic data)'] : []),
      ...(restlessnessSigns.length > 0 ? ['Trouble winding down'] : [])
    ];
    
    excessPatterns.push({
      neurotransmitter: 'DOPAMINE',
      indicators: dopamineIndicators,
      avoid_supplements: ['Tyrosine', 'Rhodiola'],
      safe_alternatives: ['Magnesium', 'Theanine', 'Ashwagandha']
    });
  }
  
  // SEROTONIN EXCESS PATTERN - Enhanced detection
  const goodMoodNoProblems = noProblems.filter(p => 
    ['mood_changes', 'stress_levels'].includes(p.key)
  );
  const serotoninExcessSigns = activeProblems.filter(p => 
    ['digestive_issues', 'sleep_quality'].includes(p.key)
  );
  
  // Check user-entered biomarkers for serotonin-related issues
  const hasSerotoninMarkers = profile.known_biomarkers && 
    (profile.known_biomarkers.toLowerCase().includes('serotonin') ||
     profile.known_biomarkers.toLowerCase().includes('5-hiaa'));
  
  const hasSerotoninExcess = 
    (goodMoodNoProblems.length >= 1 && serotoninExcessSigns.length >= 1) ||
    hasSerotoninMarkers;
  
  if (hasSerotoninExcess) {
    const serotoninIndicators = [
      ...(goodMoodNoProblems.length >= 1 ? ['Good mood baseline'] : []),
      ...(serotoninExcessSigns.length >= 1 ? ['Digestive sensitivity', 'Sleep disruption'] : []),
      ...(hasSerotoninMarkers ? ['Serotonin markers in biomarker data'] : [])
    ];
    
    excessPatterns.push({
      neurotransmitter: 'SEROTONIN',
      indicators: serotoninIndicators,
      avoid_supplements: ['5-HTP', 'Tryptophan'],
              safe_alternatives: ['Magnesium', 'Vitamin D', 'Omega 3']
    });
  }
  
  return excessPatterns;
} 