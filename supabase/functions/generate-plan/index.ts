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
      supabase.from('products').select('id, supplement_name, brand, product_name, product_url, price')
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
      productsCount: products?.length || 0
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

    // Log the actual data being used for recommendations
    console.log('Health data for recommendations:', {
      labDataCount: labData.length,
      geneticDataCount: geneticData.length,
      hasUserProfile: Object.keys(userProfile).length > 0,
      healthHistoryItems: Object.values(healthHistory).flat().length,
      questionnaireFields: Object.keys(userProfile).filter(key => userProfile[key] !== null && userProfile[key] !== undefined).length
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

    // Create comprehensive prompt with product database
    const prompt = createSupplementPrompt(userProfile, healthHistory, labData, geneticData, availableProducts);
    console.log('Generated prompt, calling OpenAI...');

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert clinical nutritionist and supplement specialist. 

CRITICAL REQUIREMENTS:
1. EXACTLY 8-12 recommendations (count them before responding)
2. Use biomarkers AND genetics AND symptoms equally
3. Match supplements from the provided product database
4. Include scientific citations for each recommendation
5. Consider all health data provided - don't focus only on genetics

Your response must be valid JSON with exactly 8-12 items in the recommendations array.

PRIORITIZE IN THIS ORDER:
1. Address any biomarker deficiencies first (vitamin D, B12, iron, etc.)
2. Target genetic variants (MTHFR, COMT, APOE, etc.)  
3. Address reported symptoms (brain fog, sleep issues, joint pain, etc.)
4. Support stated health goals
5. Add foundational supplements for overall health

Available data includes ${labData.length} biomarkers, ${geneticData.length} genetic variants, and comprehensive questionnaire responses.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.2,
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

    // Validate recommendation count with error handling
    try {
      const recCount = planDetails.recommendations?.length || 0;
      if (recCount < 8 || recCount > 12) {
        console.error(`VALIDATION WARNING: Got ${recCount} recommendations, expected 8-12`);
        console.log('AI response preview:', aiRecommendations.substring(0, 500));
        
        // Don't fail the request, just log the warning and continue
        // The user will still get their recommendations even if count is off
      } else {
        console.log(`✅ Validation passed: ${recCount} recommendations`);
      }
    } catch (validationError: any) {
      console.error('Validation error (non-fatal):', validationError);
      // Continue processing even if validation fails
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
      message: 'Personalized supplement plan generated with product recommendations',
      debug: {
        userId,
        profileExists: !!profile,
        healthDataCounts: {
          allergies: healthHistory.allergies.length,
          conditions: healthHistory.conditions.length,
          medications: healthHistory.medications.length,
          biomarkers: labData.length,
          snps: geneticData.length,
          availableProducts: availableProducts.length
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

function createSupplementPrompt(profile: any, healthHistory: any, labData: any[], geneticData: any[], products: any[]): string {
  let prompt = `PATIENT HEALTH PROFILE ANALYSIS

Please analyze the following comprehensive health profile and provide 8-12 evidence-based supplement recommendations with specific scientific citations.

=== PATIENT DEMOGRAPHICS ===\n`;

  if (profile.age) prompt += `Age: ${profile.age} years\n`;
  if (profile.gender) prompt += `Gender: ${profile.gender}\n`;
  if (profile.weight_lbs) prompt += `Weight: ${profile.weight_lbs} lbs\n`;
  if (profile.height_total_inches) prompt += `Height: ${profile.height_total_inches} inches\n`;
  if (profile.activity_level) prompt += `Activity Level: ${profile.activity_level}\n`;

  // Simplified questionnaire data
  prompt += `\n=== HEALTH PROFILE ===\n`;
  
  // Key concerns only
  const concerns = [];
  if (profile.health_goals && profile.health_goals.length > 0) concerns.push(`Goals: ${profile.health_goals.join(', ')}`);
  if (profile.brain_fog && profile.brain_fog !== 'none') concerns.push(`Brain fog: ${profile.brain_fog}`);
  if (profile.sleep_quality && profile.sleep_quality !== 'excellent') concerns.push(`Sleep: ${profile.sleep_quality}`);
  if (profile.energy_levels && profile.energy_levels !== 'high') concerns.push(`Energy: ${profile.energy_levels}`);
  if (profile.anxiety_level && profile.anxiety_level !== 'none') concerns.push(`Anxiety: ${profile.anxiety_level}`);
  if (profile.joint_pain && profile.joint_pain !== 'none') concerns.push(`Joint pain: ${profile.joint_pain}`);
  if (profile.bloating && profile.bloating !== 'none') concerns.push(`Digestive: ${profile.bloating}`);
  
  if (concerns.length > 0) {
    prompt += concerns.join(' | ') + '\n';
  }
  
  // Important history
  if (profile.low_nutrients && profile.low_nutrients.length > 0) {
    prompt += `Previous deficiencies: ${profile.low_nutrients.join(', ')}\n`;
  }

  // Health History Analysis
  if (healthHistory.conditions.length > 0) {
    prompt += `\n=== MEDICAL CONDITIONS ===\n`;
    healthHistory.conditions.forEach((condition: string) => {
      prompt += `• ${condition}\n`;
    });
  }

  if (healthHistory.medications.length > 0) {
    prompt += `\n=== CURRENT MEDICATIONS ===\n`;
    healthHistory.medications.forEach((medication: string) => {
      prompt += `• ${medication}\n`;
    });
  }

  if (healthHistory.allergies.length > 0) {
    prompt += `\n=== ALLERGIES & SENSITIVITIES ===\n`;
    healthHistory.allergies.forEach((allergy: string) => {
      prompt += `• ${allergy}\n`;
    });
  }

  // Laboratory Data Analysis
  if (labData.length > 0) {
    prompt += `\n=== LABORATORY BIOMARKERS ===\n`;
    
    // Show only the first 20 most important biomarkers to save tokens
    const importantMarkers = labData.slice(0, 20);
    importantMarkers.forEach((marker: any) => {
      prompt += `• ${marker.marker_name}: ${marker.value} ${marker.unit || ''}\n`;
    });
    
    if (labData.length > 20) {
      prompt += `... and ${labData.length - 20} additional biomarkers available\n`;
    }
  }

  // Genetic Analysis
  if (geneticData.length > 0) {
    prompt += `\n=== GENETIC POLYMORPHISMS ===\n`;
    
    // Show only the first 15 most important SNPs to save tokens
    const importantSNPs = geneticData.slice(0, 15);
    importantSNPs.forEach((snp: any) => {
      prompt += `• ${snp.supported_snps?.rsid} (${snp.supported_snps?.gene}): ${snp.genotype}\n`;
    });
    
    if (geneticData.length > 15) {
      prompt += `... and ${geneticData.length - 15} additional genetic variants available\n`;
    }
    
    // Simplified genetic analysis
    prompt += `\n=== KEY GENETIC INSIGHTS ===\n`;
    const mthfrVar = geneticData.find(s => s.supported_snps?.gene?.includes('MTHFR'));
    const comtVar = geneticData.find(s => s.supported_snps?.gene?.includes('COMT'));
    const apoeVar = geneticData.find(s => s.supported_snps?.gene?.includes('APOE'));
    
    if (mthfrVar) prompt += `🧬 MTHFR variant - recommend methylfolate\n`;
    if (comtVar) prompt += `🧬 COMT variant - consider magnesium\n`;
    if (apoeVar) prompt += `🧬 APOE variant - emphasize omega-3\n`;
  }

  // Available Products
  prompt += `\n=== AVAILABLE SUPPLEMENT PRODUCTS ===\n`;
  prompt += `${products.length} supplements available including: `;
  
  // Show just the supplement names, not full details
  const supplementNames = products.slice(0, 20).map((product: any) => product.supplement_name);
  prompt += supplementNames.join(', ');
  
  if (products.length > 20) {
    prompt += `, and ${products.length - 20} more...`;
  }
  prompt += `\n`;

  prompt += `

MANDATORY REQUIREMENTS:
======================
1. Provide EXACTLY 8-12 supplement recommendations (not 5, not 15 - count them!)
2. Use biomarkers, genetics, symptoms, and questionnaire data equally
3. Address specific deficiencies found in lab results
4. Consider genetic variants for supplement selection
5. Target reported symptoms (brain fog, sleep, anxiety, etc.)
6. Only use supplements from the available products list above

CRITICAL INSTRUCTION:
Before finalizing your response, count your recommendations. You MUST have between 8-12 items.

Based on the comprehensive health profile above, provide EXACTLY 8-12 personalized supplement recommendations. Each recommendation must be directly tied to the patient's specific biomarkers, genetic variants, or health profile data.

PRIORITIZE IN THIS ORDER:
1. Address any biomarker deficiencies first (vitamin D, B12, iron, etc.)
2. Target genetic variants (MTHFR, COMT, APOE, etc.)  
3. Address reported symptoms (brain fog, sleep issues, joint pain, etc.)
4. Support stated health goals
5. Add foundational supplements for overall health

Provide recommendations in the following JSON format:

{
  "recommendations": [
    {
      "supplement": "Exact supplement name from available products list",
      "dosage": "Specific dosage recommendation (e.g., 2000 IU daily, 400mg twice daily)",
      "timing": "Optimal timing instructions (e.g., with breakfast, before bed, on empty stomach)",
      "reason": "Detailed personalized explanation based on their specific health profile",
      "confidence_score": 85,
      "interactions": ["Specific medication interactions if any"],
      "notes": "Important clinical considerations, contraindications, or monitoring needs",
      "citations": [
        "Specific scientific citation supporting this recommendation",
        "Additional relevant research citation if applicable"
      ]
    }
  ],
  "general_notes": "Overall clinical considerations and implementation strategy",
  "contraindications": "Important warnings specific to this patient's profile"
}

=== ANALYSIS GUIDELINES ===

1. **Genetic Considerations**: 
   - MTHFR variants → recommend methylated folate forms
   - COMT variants → consider magnesium for stress/anxiety
   - APOE variants → emphasize omega-3 and antioxidants

2. **Biomarker Analysis**:
   - Low vitamin D → D3 supplementation
   - Elevated inflammatory markers → omega-3, curcumin
   - Iron deficiency → iron with vitamin C
   - B12 deficiency → methylcobalamin

3. **Symptom-Based Recommendations**:
   - Brain fog → B-complex, omega-3, magnesium
   - Sleep issues → magnesium glycinate, melatonin, L-theanine
   - Anxiety/stress → ashwagandha, magnesium, GABA
   - Joint pain → curcumin, omega-3, glucosamine
   - Bloating/digestion → probiotics, digestive enzymes, zinc
   - Energy/fatigue → CoQ10, B-complex, iron (if deficient)
   - Caffeine sensitivity → L-theanine, B vitamins
   - Bruising/bleeding → vitamin C, vitamin K, bioflavonoids

4. **Health Goals Alignment**:
   - Weight management → chromium, green tea extract, fiber
   - Athletic performance → creatine, protein, BCAAs
   - Anti-aging → antioxidants, resveratrol, NAD+ precursors
   - Immune support → vitamin C, zinc, elderberry
   - Cognitive health → phosphatidylserine, lion's mane, bacopa

5. **Drug Interactions**:
   - Warfarin interactions with vitamin K, fish oil
   - Statin interactions with CoQ10 recommendations
   - Antacid effects on mineral absorption

6. **Clinical Citations**:
   - Include specific journal references where possible
   - Reference established clinical guidelines
   - Cite meta-analyses and systematic reviews

7. **Dosage Precision**:
   - Age-appropriate dosing
   - Body weight considerations
   - Therapeutic vs maintenance doses

CRITICAL: You must recommend EXACTLY 8-12 supplements, use only supplements from the available products list, and provide specific scientific citations for each recommendation.

Provide ONLY the JSON response, no additional text.`;

  return prompt;
}

function parseAIRecommendations(aiResponse: string, products: any[]): any {
  try {
    // Create a map of supplement names to products for easy lookup
    const productMap = new Map();
    products.forEach(product => {
      productMap.set(product.supplement_name.toLowerCase(), product);
    });

    const cleanedResponse = aiResponse.trim();
    let jsonResponse;
    
    // Handle cases where the AI might include extra text
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonResponse = JSON.parse(jsonMatch[0]);
    } else {
      jsonResponse = JSON.parse(cleanedResponse);
    }

    // Match recommendations with actual products
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
        
        // Ensure citations array exists
        if (!rec.citations || !Array.isArray(rec.citations)) {
          rec.citations = ["Clinical recommendation based on health profile analysis"];
        }
        
        return rec;
      });
    }
    
    return jsonResponse;
  } catch (error) {
    console.error('Failed to parse AI response as JSON:', error);
    
    // Fallback with sample products
    const fallbackProducts = products.slice(0, 8);
    
    return {
      recommendations: fallbackProducts.map((product: any, index: number) => ({
        supplement: product.supplement_name,
        dosage: "As directed on label",
        timing: "with meals",
        reason: "AI recommendation parsing failed, providing basic recommendation based on available products",
        confidence_score: 50,
        citations: ["Fallback recommendation - consult healthcare provider"],
        product: {
          id: product.id,
          brand: product.brand,
          product_name: product.product_name,
          product_url: product.product_url,
          price: product.price
        }
      })),
      general_notes: "AI response could not be parsed. Please regenerate recommendations.",
      contraindications: "Please consult with a healthcare provider before starting any supplements."
    };
  }
} 