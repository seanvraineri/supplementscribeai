import { createClient } from 'jsr:@supabase/supabase-js@2';

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
  citations: string[];
  product?: {
    id: string;
    brand: string;
    product_name: string;
    product_url: string;
    price: number;
  };
}

// Supplement interaction matrix to prevent conflicting recommendations
const SUPPLEMENT_INTERACTIONS: Record<string, string[]> = {
  'Easy Iron': ['Calcium Citrate', 'Zinc', 'Magnesium'],
  'Calcium Citrate': ['Easy Iron', 'Zinc', 'Magnesium'],
  'Zinc': ['Easy Iron', 'Calcium Citrate', 'Chromium'],
  'Magnesium': ['Easy Iron', 'Calcium Citrate'],
  'Chromium': ['Zinc'],
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
      supabase.from('user_profiles').select('*').eq('id', userId).single(),
      supabase.from('user_allergies').select('ingredient_name').eq('user_id', userId),
      supabase.from('user_conditions').select('condition_name').eq('user_id', userId),
      supabase.from('user_medications').select('medication_name').eq('user_id', userId),
      supabase.from('user_biomarkers').select('marker_name, value, unit, reference_range').eq('user_id', userId),
      supabase.from('user_snps').select('*').eq('user_id', userId),
      // FILTER TO ONLY YOUR SUPPLEMENTS
      supabase.from('products').select('id, supplement_name, brand, product_name, product_url, price').eq('brand', 'OK Capsule')
    ]);

    // Check for critical errors
    const dataFetchError = allergiesError || conditionsError || medicationsError || biomarkersError || snpsError || productsError;
    if (dataFetchError) {
      console.error('Data fetching error:', dataFetchError);
      return new Response(JSON.stringify({ error: 'Failed to fetch health profile or product data.', details: dataFetchError }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
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
        model: 'gpt-4o',
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
        max_tokens: 4000,
        temperature: 0.1, // Lower temperature for more consistent results
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
      planDetails.recommendations = resolveInteractions(planDetails.recommendations, availableProducts);
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

    return new Response(JSON.stringify({ 
      success: true, 
      plan: planDetails,
      message: 'Ultimate personalized 6-supplement pack generated',
      personalization_tier: personalizationTier,
      debug: {
        userId,
        profileExists: !!profile,
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

  prompt += `\n=== PATIENT PROFILE ===\n`;

  // Demographics
  if (profile.age) prompt += `Age: ${profile.age} years\n`;
  if (profile.gender) prompt += `Gender: ${profile.gender}\n`;
  if (profile.weight_lbs) prompt += `Weight: ${profile.weight_lbs} lbs\n`;
  if (profile.activity_level) prompt += `Activity: ${profile.activity_level}\n`;

  // Health goals and symptoms
  if (profile.health_goals && profile.health_goals.length > 0) {
    prompt += `\n🎯 Health Goals: ${profile.health_goals.join(', ')}\n`;
  }

  // Key symptoms
  const symptoms = [];
  if (profile.brain_fog && profile.brain_fog !== 'none') symptoms.push(`Brain fog: ${profile.brain_fog}`);
  if (profile.sleep_quality && profile.sleep_quality !== 'excellent') symptoms.push(`Sleep: ${profile.sleep_quality}`);
  if (profile.energy_levels && profile.energy_levels !== 'high') symptoms.push(`Energy: ${profile.energy_levels}`);
  if (profile.anxiety_level && profile.anxiety_level !== 'none') symptoms.push(`Anxiety: ${profile.anxiety_level}`);
  if (profile.joint_pain && profile.joint_pain !== 'none') symptoms.push(`Joint pain: ${profile.joint_pain}`);
  if (profile.bloating && profile.bloating !== 'none') symptoms.push(`Digestive: ${profile.bloating}`);

  if (symptoms.length > 0) {
    prompt += `\n🔍 Key Symptoms: ${symptoms.join(' | ')}\n`;
  }

  // Health history
  if (healthHistory.conditions.length > 0) {
    prompt += `\n🏥 Conditions: ${healthHistory.conditions.join(', ')}\n`;
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

  // Genetic data (if available)
  if (geneticData.length > 0) {
    prompt += `\n=== GENETIC PROFILE (${geneticData.length} variants) ===\n`;
    
    // Show key genetic variants
    const keyVariants = geneticData.slice(0, 12);
    keyVariants.forEach((snp: any) => {
      if (snp.supported_snps?.rsid && snp.supported_snps?.gene) {
        prompt += `• ${snp.supported_snps.rsid} (${snp.supported_snps.gene}): ${snp.genotype}\n`;
      }
    });
    
    if (geneticData.length > 12) {
      prompt += `... and ${geneticData.length - 12} additional variants\n`;
    }
  }

  prompt += `

🎯 ULTIMATE PERSONALIZATION REQUIREMENTS:

1. **EXACTLY 6 SUPPLEMENTS** - Count them before responding
2. **ZERO INTERACTIONS** - No supplements that interfere with each other
3. **HOLISTIC APPROACH** - Work together synergistically
4. **MAXIMUM PERSONALIZATION** - Based on all available data
5. **YOUR CATALOG ONLY** - Use only the supplements listed above

🎯 PRIORITIZATION HIERARCHY (MANDATORY ORDER):
1. DEFICIENT BIOMARKERS (🔴) - Address these FIRST and FOREMOST
2. GENETIC VARIANTS - Support genetic predispositions  
3. SEVERE SYMPTOMS - Target reported health issues
4. HEALTH GOALS - Support stated objectives
5. FOUNDATIONAL WELLNESS - Fill remaining slots

CRITICAL: If someone has deficient biomarkers, those supplements MUST be included before anything else.

PERSONALIZATION STRATEGY FOR ${tier}:`;

  switch (tier) {
    case 'PRECISION_MEDICINE':
      prompt += `
- Prioritize genetic variants (MTHFR → methylfolate, COMT → magnesium, etc.)
- Address biomarker deficiencies with precision
- Use genetic data for supplement form selection
- Target metabolic pathways based on genetics
- CITE SPECIFIC GENETIC VARIANTS AND BIOMARKER VALUES in your reasoning`;
      break;
    case 'BIOMARKER_FOCUSED':
      prompt += `
- Correct deficiencies shown in lab work first
- Target inflammatory markers if elevated
- Address metabolic imbalances
- Focus on nutrient optimization
- CITE SPECIFIC BIOMARKER VALUES AND RANGES in your reasoning`;
      break;
    case 'SYMPTOM_TARGETED':
      prompt += `
- Address primary symptoms and health concerns
- Target brain fog, sleep, energy, anxiety, etc.
- Support stated health goals
- Consider lifestyle factors
- CITE SPECIFIC SYMPTOMS AND HEALTH GOALS in your reasoning`;
      break;
    case 'FOUNDATIONAL_WELLNESS':
      prompt += `
- Provide essential nutrients for optimal health
- Consider age/gender-specific needs
- Focus on prevention and general wellness
- Target common population deficiencies
- CITE SPECIFIC AGE, GENDER, AND LIFESTYLE FACTORS in your reasoning`;
      break;
  }

  prompt += `

🔥 CRITICAL PERSONALIZATION INSTRUCTIONS:
- Each "reason" field MUST be deeply personal, empathetic, and healing-focused
- Write as if you're a caring health coach who truly understands their struggle
- Connect their specific data to how they FEEL and what they're experiencing
- Explain HOW this supplement will specifically help THEM feel better
- Use warm, supportive language that shows you care about their wellbeing
- Make them feel seen, understood, and hopeful about their health journey

REASONING EXAMPLES:
- Biomarkers: "Your Vitamin D level of 18 ng/mL explains so much about what you've been experiencing. This severe deficiency is likely contributing to your brain fog, low energy, and difficulty with weight management. By bringing your Vitamin D to optimal levels (30-50 ng/mL), you should start feeling more mentally clear, energetic, and motivated to reach your health goals. This isn't just a number - it's the key to unlocking the vibrant energy you deserve."

- Genetics: "Your MTHFR A1298C variant means your body has been working extra hard to process folate, which explains why you might feel mentally foggy or fatigued. This methylated B-complex bypasses your genetic limitation, giving your brain and nervous system the exact form of B vitamins they can actually use. Think of it as giving your body the right key for the lock - suddenly everything works better."

- Symptoms: "Your severe brain fog and poor sleep quality are deeply connected. This magnesium will help calm your nervous system, allowing for deeper, more restorative sleep. When you sleep better, your brain fog lifts, your energy returns, and you'll feel like yourself again. You deserve to wake up feeling refreshed and mentally sharp."

🚨 ANTI-HALLUCINATION REQUIREMENTS:
- ONLY use biomarker values that are explicitly listed above
- ONLY reference genetic variants that are explicitly shown above
- NEVER make up or assume biomarker values not provided
- NEVER reference genetic variants not in the data
- If no biomarker data: focus on symptoms and demographics only
- If no genetic data: focus on biomarkers and symptoms only
- NEVER cite studies or values that aren't real

Provide EXACTLY 6 recommendations in this JSON format:

{
  "recommendations": [
    {
      "supplement": "Exact name from your catalog",
      "dosage": "SPECIFIC DOSAGE with units (e.g., '5000 IU daily', '400 mg daily', '2 capsules daily', '1000 mg daily')",
      "timing": "Optimal timing for this person's lifestyle/symptoms",
      "reason": "DEEPLY PERSONAL, empathetic explanation that connects their specific data to how they FEEL and how this supplement will help them feel better. Write as a caring health coach who truly understands their struggle and wants to help them heal and thrive. Make them feel seen, understood, and hopeful.",
      "confidence_score": 90,
      "notes": "Caring, supportive guidance specific to this individual's journey",
      "citations": ["Relevant scientific citation"]
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

CRITICAL: Provide ONLY the JSON response. Count your recommendations - must be exactly 6. Make every explanation uniquely personal to THIS individual.`;

  return prompt;
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
        
        // Ensure required fields
        if (!rec.citations || !Array.isArray(rec.citations)) {
          rec.citations = ["Personalized recommendation based on health profile"];
        }
        
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
        timing: "with meals",
        reason: "Foundational wellness support - AI parsing failed",
        confidence_score: 60,
        citations: ["Fallback recommendation - consult healthcare provider"],
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
          timing: "with meals",
          reason: "Foundational wellness support",
          confidence_score: 70,
          citations: ["General wellness recommendation"],
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
        timing: "with meals",
        reason: "Additional wellness support to complete your 6-supplement pack",
        confidence_score: 65,
        citations: ["Complementary wellness support"],
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

function resolveInteractions(recommendations: any[], products: any[]): any[] {
  const resolved = [...recommendations];
  const interactionCheck = validateNoInteractions(resolved);
  
  if (!interactionCheck.valid) {
    // Remove conflicting supplements and replace with alternatives
    const conflictingSupps = new Set<string>();
    
    interactionCheck.conflicts.forEach(conflict => {
      const [supp1, supp2] = conflict.split(' conflicts with ');
      conflictingSupps.add(supp1);
      conflictingSupps.add(supp2);
    });
    
    // Remove one supplement from each conflict (keep higher confidence)
    const toRemove: number[] = [];
    conflictingSupps.forEach(conflictSupp => {
      const index = resolved.findIndex(r => r.supplement === conflictSupp);
      if (index !== -1 && !toRemove.includes(index)) {
        toRemove.push(index);
      }
    });
    
    // Remove conflicting supplements (keep only first one found)
    if (toRemove.length > 0) {
      toRemove.sort((a, b) => b - a); // Remove from end to avoid index issues
      toRemove.slice(1).forEach(index => { // Keep first, remove others
        resolved.splice(index, 1);
      });
    }
    
    // Fill back to 6 with non-conflicting alternatives
    const currentSupps = resolved.map(r => r.supplement.toLowerCase());
    const availableAlternatives = products.filter(p => 
      !currentSupps.includes(p.supplement_name.toLowerCase()) &&
      !hasInteractionWithCurrent(p.supplement_name, resolved)
    );
    
    const needed = 6 - resolved.length;
    const alternatives = availableAlternatives.slice(0, needed);
    
    alternatives.forEach(alt => {
      resolved.push({
        supplement: alt.supplement_name,
        dosage: getStandardDosage(alt.supplement_name),
        timing: "with meals",
        reason: "Alternative selection to avoid supplement interactions",
        confidence_score: 60,
        citations: ["Interaction-free alternative"],
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