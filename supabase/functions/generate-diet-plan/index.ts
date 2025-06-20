import { createClient } from 'jsr:@supabase/supabase-js@2';
import { checkRateLimit, getRateLimitHeaders } from '../rate-limiter/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DietPlan {
  grocery_list: {
    proteins: { item: string; reason: string }[];
    vegetables: { item: string; reason: string }[];
    fruits: { item: string; reason: string }[];
    fats: { item: string; reason: string }[];
    seasonings: { item: string; reason: string }[];
    beverages: { item: string; reason: string }[];
  };
  meal_suggestions: {
    breakfast: { name: string; ingredients: string[]; benefits: string }[];
    lunch: { name: string; ingredients: string[]; benefits: string }[];
    dinner: { name: string; ingredients: string[]; benefits: string }[];
    snacks: { name: string; ingredients: string[]; benefits: string }[];
  };
  general_notes: string;
  contraindications: string;
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

    // Rate limiting: 8 diet plan generations per 5 minutes per user (conservative for GPT-4o)
    const rateLimit = checkRateLimit(`generate-diet-plan:${user.id}`, 8, 5);
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please wait before generating another diet plan.' 
      }), {
        headers: { 
          ...corsHeaders, 
          ...getRateLimitHeaders(rateLimit.remainingRequests, rateLimit.resetTime),
          'Content-Type': 'application/json' 
        },
        status: 429,
      });
    }

    // --- Data Fetching (same pipeline as supplement plan) ---
    const userId = user.id;

    const [
      { data: profile, error: profileError },
      { data: allergies, error: allergiesError },
      { data: conditions, error: conditionsError },
      { data: medications, error: medicationsError },
      { data: biomarkers, error: biomarkersError },
      { data: snps, error: snpsError }
    ] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', userId).single(),
      supabase.from('user_allergies').select('ingredient_name').eq('user_id', userId).limit(50),
      supabase.from('user_conditions').select('condition_name').eq('user_id', userId).limit(30),
      supabase.from('user_medications').select('medication_name').eq('user_id', userId).limit(50),
      supabase.from('user_biomarkers').select('marker_name, value, unit, reference_range').eq('user_id', userId).limit(500),
      supabase.from('user_snps').select('*').eq('user_id', userId).limit(1000)
    ]);

    // Check for critical errors
    const dataFetchError = profileError || allergiesError || conditionsError || medicationsError || biomarkersError || snpsError;
    if (dataFetchError) {
      console.error('Data fetching error:', dataFetchError);
      return new Response(JSON.stringify({ error: 'Failed to fetch health profile data.', details: dataFetchError }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log('Diet plan data fetch summary:', {
      profileExists: !!profile,
      allergiesCount: allergies?.length || 0,
      conditionsCount: conditions?.length || 0,
      medicationsCount: medications?.length || 0,
      biomarkersCount: biomarkers?.length || 0,
      snpsCount: snps?.length || 0
    });

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

    // --- Data Consolidation ---
    const userProfile = profile || {};
    
    const healthHistory = {
      allergies: allergies?.map(a => a.ingredient_name) || [],
      conditions: conditions?.map(c => c.condition_name) || [],
      medications: medications?.map(m => m.medication_name) || [],
    };
    
    const labData = biomarkers || [];
    const geneticData = enrichedSnps || [];

    // Determine personalization tier
    const personalizationTier = determinePersonalizationTier(labData, geneticData, userProfile);
    console.log(`Using personalization tier for diet plan: ${personalizationTier}`);

    // --- OpenAI API Call ---
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Create whole food diet prompt
    const prompt = createDietPrompt(userProfile, healthHistory, labData, geneticData, personalizationTier);
    console.log('Generated whole food diet prompt, calling OpenAI GPT-4o...');

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
            content: getDietSystemPrompt(personalizationTier, labData.length, geneticData.length)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 5000,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate diet plan from OpenAI' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const openaiData = await openaiResponse.json();
    console.log('Received OpenAI diet plan response');
    console.log('OpenAI response structure:', JSON.stringify(openaiData, null, 2));
    
    const aiDietPlan = openaiData.choices[0]?.message?.content;
    console.log('Extracted AI diet plan content:', aiDietPlan ? 'Content received' : 'No content');

    if (!aiDietPlan) {
      console.error('No diet plan received from OpenAI');
      console.error('Full OpenAI response:', JSON.stringify(openaiData, null, 2));
      return new Response(JSON.stringify({ error: 'No diet plan generated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log('Parsing AI diet plan...');
    // Parse AI response
    const planDetails = parseDietPlan(aiDietPlan);
    console.log('Successfully parsed diet plan');

    // Store the diet plan in the database
    console.log('Attempting to store diet plan for user:', userId);
    const { error: insertError } = await supabase
      .from('diet_plans')
      .insert({
        user_id: userId,
        plan_details: planDetails,
      });

    if (insertError) {
      console.error('Failed to store diet plan:', insertError);
      return new Response(JSON.stringify({ 
        error: 'Failed to store diet plan.', 
        details: insertError 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log('Successfully stored diet plan');

    return new Response(JSON.stringify({ 
      success: true, 
      plan: planDetails,
      message: 'Personalized whole food diet plan generated',
      personalization_tier: personalizationTier
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-diet-plan function:', error);
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
    return 'PRECISION_NUTRITION'; // Tier 1: Full genetic + biomarker data
  } else if (labData.length > 0) {
    return 'BIOMARKER_NUTRITION'; // Tier 2: Biomarker data only
  } else if (profile && hasRichAssessmentData(profile)) {
    return 'SYMPTOM_NUTRITION'; // Tier 3: Rich symptom/questionnaire data
  } else {
    return 'FOUNDATIONAL_NUTRITION'; // Tier 4: Demographics only
  }
}

function hasRichAssessmentData(profile: any): boolean {
  // Check if user has completed comprehensive health assessment
  const assessmentFields = [
    'sleep_hours', 'energy_levels', 'effort_fatigue', 'caffeine_effect', 'brain_fog',
    'anxiety_level', 'stress_resilience', 'sleep_quality', 'sleep_aids', 'bloating',
    'anemia_history', 'digestion_speed', 'low_nutrients', 'bruising_bleeding',
    'belly_fat', 'joint_pain', 'digestive_issues', 'stress_levels', 'mood_changes',
    'sugar_cravings', 'skin_issues', 'immune_system', 'workout_recovery',
    'food_sensitivities', 'weight_management', 'primary_health_concern'
  ];
  
  const completedFields = assessmentFields.filter(field => 
    profile[field] && profile[field] !== '' && profile[field] !== null
  ).length;
  
  // Consider it "rich" if they've completed at least 8 assessment questions
  return completedFields >= 8;
}

function getDietSystemPrompt(tier: string, biomarkerCount: number, geneticCount: number): string {
  const basePrompt = `You are a deeply caring, empathetic nutritionist who specializes in traditional whole food nutrition. You have a gift for making people feel truly seen, understood, and hopeful about their health journey.

🎯 ULTIMATE MISSION: Create a personalized whole food grocery list + exactly 20 meal suggestions (5 breakfast, 5 lunch, 5 dinner, 5 snacks) with DEEPLY PERSONAL explanations

WHOLE FOOD PRINCIPLES (NON-NEGOTIABLE):
- ZERO seed oils (canola, soybean, corn, vegetable oil, sunflower oil)
- Grass-fed/pasture-raised animal products ONLY
- Wild-caught fish ONLY
- Traditional healthy fats: grass-fed butter, tallow, coconut oil, olive oil
- Organic vegetables and fruits
- NO processed foods
- NO artificial ingredients

PERSONALIZATION TIER: ${tier}
Available Data: ${biomarkerCount} biomarkers, ${geneticCount} genetic variants

🔥 CRITICAL PERSONALIZATION REQUIREMENTS:
- Every "reason" field must reference their SPECIFIC biomarkers, genetics, or symptoms
- Connect food choices to how they FEEL and their daily struggles
- Explain HOW this specific food will help THEIR unique body
- Write as if you're speaking directly to them about their health journey
- Make them feel understood and hopeful
- Use their exact biomarker values when available
- Reference their specific genetic variants when available

MEAL INGREDIENT REQUIREMENT:
- ALL meal ingredients MUST come from the grocery list you create
- No ingredients in meals that aren't in the grocery list

FORMATTING REQUIREMENTS:
- Use proper title case for all food names (e.g., "Grass-Fed Beef", "Wild-Caught Salmon", "Organic Spinach")
- Keep food names consistent and professional looking
- Use hyphens for compound descriptors (e.g., "Grass-Fed", "Wild-Caught", "Free-Range")
- Capitalize each major word in food items for clean UI alignment

🚨 CRITICAL FORMATTING RULE: ALL grocery list "item" fields MUST use Title Case:
- ❌ WRONG: "grass-fed beef", "wild-caught salmon", "spinach"
- ✅ CORRECT: "Grass-Fed Beef", "Wild-Caught Salmon", "Organic Spinach"
- ❌ WRONG: "pasture-raised eggs", "bell peppers"
- ✅ CORRECT: "Pasture-Raised Eggs", "Bell Peppers"

Your response must be valid JSON with exactly this structure:
{
  "grocery_list": {
    "proteins": [{"item": "...", "reason": "deeply personal explanation"}],
    "vegetables": [{"item": "...", "reason": "deeply personal explanation"}],
    "fruits": [{"item": "...", "reason": "deeply personal explanation"}],
    "fats": [{"item": "...", "reason": "deeply personal explanation"}],
    "seasonings": [{"item": "...", "reason": "deeply personal explanation"}],
    "beverages": [{"item": "...", "reason": "deeply personal explanation"}]
  },
  "meal_suggestions": {
    "breakfast": [{"name": "...", "ingredients": ["from grocery list"], "benefits": "deeply personal explanation"}],
    "lunch": [{"name": "...", "ingredients": ["from grocery list"], "benefits": "deeply personal explanation"}],
    "dinner": [{"name": "...", "ingredients": ["from grocery list"], "benefits": "deeply personal explanation"}],
    "snacks": [{"name": "...", "ingredients": ["from grocery list"], "benefits": "deeply personal explanation"}]
  },
  "general_notes": "warm, encouraging message about how this plan will help them",
  "contraindications": "Traditional whole food safety considerations"
}

EXACTLY 5 meals in each category (breakfast, lunch, dinner, snacks) = 20 total meals.`;

  switch (tier) {
    case 'PRECISION_NUTRITION':
      return basePrompt + `

🧬 PRECISION NUTRITION APPROACH:
- Connect their genetic variants to their food sensitivities and needs
- Explain how their genetics affect nutrient absorption and metabolism
- Show how traditional whole foods work WITH their unique genetics
- Address biomarker deficiencies with specific food recommendations
- Make them feel hopeful about optimizing their genetic expression through food`;

    case 'BIOMARKER_NUTRITION':
      return basePrompt + `

🔬 BIOMARKER-FOCUSED NUTRITION:
- Connect their lab results to their daily energy and symptoms
- Explain how nutrient deficiencies affect their quality of life
- Show how traditional whole foods will optimize their biomarkers
- Paint a hopeful picture of how they'll feel when levels improve
- Address each deficiency with targeted food recommendations`;

    case 'SYMPTOM_NUTRITION':
      return basePrompt + `

🎯 SYMPTOM-TARGETED NUTRITION:
- Acknowledge their symptoms and how they affect daily life
- Connect traditional whole foods to symptom relief and energy improvement
- Show understanding of their health goals and struggles
- Provide hope through targeted nutrition
- Address their specific health concerns with food solutions`;

    case 'FOUNDATIONAL_NUTRITION':
      return basePrompt + `

🌟 FOUNDATIONAL NUTRITION:
- Acknowledge their commitment to optimal health
- Connect age and lifestyle factors to nutritional needs
- Provide foundational whole food nutrition for their life stage
- Focus on prevention and vitality through whole foods
- Support their wellness journey with encouraging guidance`;

    default:
      return basePrompt;
  }
}

function createDietPrompt(profile: any, healthHistory: any, labData: any[], geneticData: any[], tier: string): string {
  let prompt = `🥩 PERSONALIZED WHOLE FOOD NUTRITION PLAN

MISSION: Create grocery list + exactly 20 meal suggestions (5 breakfast, 5 lunch, 5 dinner, 5 snacks)

PERSONALIZATION TIER: ${tier}

=== PATIENT PROFILE ===\n`;

  // Demographics
  if (profile.age) prompt += `Age: ${profile.age} years\n`;
  if (profile.gender) prompt += `Gender: ${profile.gender}\n`;
  if (profile.weight_lbs) prompt += `Weight: ${profile.weight_lbs} lbs\n`;
  if (profile.height_total_inches) prompt += `Height: ${profile.height_total_inches} inches\n`;
  if (profile.activity_level) prompt += `Activity: ${profile.activity_level}\n`;

  // 🚨 DIETARY PREFERENCE - ABSOLUTE TOP PRIORITY
  if (profile.dietary_preference) {
    prompt += `\n🍽️ DIETARY PREFERENCE (ABSOLUTE TOP PRIORITY - NON-NEGOTIABLE):\n`;
    prompt += `"${profile.dietary_preference.toUpperCase()}"\n`;
    prompt += `\n⚠️ CRITICAL: This is NON-NEGOTIABLE. Every single food item and meal MUST align with their ${profile.dietary_preference} dietary requirements. This overrides ALL other considerations.\n`;
  }

  // Primary health concern
  if (profile.primary_health_concern) {
    prompt += `\n🚨 PRIMARY HEALTH CONCERN (TOP PRIORITY):\n`;
    prompt += `"${profile.primary_health_concern}"\n`;
    prompt += `\n⚠️ CRITICAL: This is their MAIN concern. Your nutrition plan MUST address this.\n`;
  }

  // Health goals
  if (profile.health_goals && profile.health_goals.length > 0) {
    prompt += `\n🎯 Health Goals:\n`;
    profile.health_goals.forEach((goal: string) => {
      prompt += `• ${goal}\n`;
    });
  }

  // === ALL 16 ASSESSMENT QUESTIONS ===
  prompt += `\n=== 📋 COMPREHENSIVE HEALTH ASSESSMENT ===\n`;
  
  // Sleep & Energy
  if (profile.sleep_hours) prompt += `Sleep Hours: ${profile.sleep_hours} hours/night\n`;
  if (profile.energy_levels) prompt += `Energy Levels: ${profile.energy_levels}\n`;
  if (profile.effort_fatigue) prompt += `Effort/Fatigue: ${profile.effort_fatigue}\n`;
  if (profile.sleep_quality) prompt += `Sleep Quality: ${profile.sleep_quality}\n`;
  if (profile.sleep_aids) prompt += `Sleep Aids: ${profile.sleep_aids}\n`;
  
  // Mental/Cognitive
  if (profile.caffeine_effect) prompt += `Caffeine Effect: ${profile.caffeine_effect}\n`;
  if (profile.brain_fog) prompt += `Brain Fog: ${profile.brain_fog}\n`;
  if (profile.anxiety_level) prompt += `Anxiety Level: ${profile.anxiety_level}\n`;
  if (profile.stress_resilience) prompt += `Stress Resilience: ${profile.stress_resilience}\n`;
  if (profile.stress_levels) prompt += `Stress Levels: ${profile.stress_levels}\n`;
  if (profile.mood_changes) prompt += `Mood Changes: ${profile.mood_changes}\n`;
  
  // Digestive & Metabolic
  if (profile.bloating) prompt += `Bloating: ${profile.bloating}\n`;
  if (profile.digestion_speed) prompt += `Digestion Speed: ${profile.digestion_speed}\n`;
  if (profile.digestive_issues) prompt += `Digestive Issues: ${profile.digestive_issues}\n`;
  if (profile.food_sensitivities) prompt += `Food Sensitivities: ${profile.food_sensitivities}\n`;
  if (profile.sugar_cravings) prompt += `Sugar Cravings: ${profile.sugar_cravings}\n`;
  if (profile.weight_management) prompt += `Weight Management: ${profile.weight_management}\n`;
  if (profile.belly_fat) prompt += `Belly Fat: ${profile.belly_fat}\n`;
  
  // Physical Health
  if (profile.anemia_history) prompt += `Anemia History: ${profile.anemia_history}\n`;
  if (profile.bruising_bleeding) prompt += `Bruising/Bleeding: ${profile.bruising_bleeding}\n`;
  if (profile.joint_pain) prompt += `Joint Pain: ${profile.joint_pain}\n`;
  if (profile.skin_issues) prompt += `Skin Issues: ${profile.skin_issues}\n`;
  if (profile.immune_system) prompt += `Immune System: ${profile.immune_system}\n`;
  if (profile.workout_recovery) prompt += `Workout Recovery: ${profile.workout_recovery}\n`;
  
  // Nutrient Deficiencies
  if (profile.low_nutrients && profile.low_nutrients.length > 0) {
    prompt += `Low Nutrients: ${profile.low_nutrients.join(', ')}\n`;
  }
  
  // Custom goals
  if (profile.custom_health_goal) prompt += `Custom Health Goal: "${profile.custom_health_goal}"\n`;

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

  // Laboratory data
  if (labData.length > 0) {
    prompt += `\n=== 🚨 BIOMARKER DATA (PERSONALIZE HEAVILY) ===\n`;
    labData.slice(0, 15).forEach((marker: any) => {
      prompt += `• ${marker.marker_name}: ${marker.value} ${marker.unit || ''} (ref: ${marker.reference_range || 'optimal range'})\n`;
    });
    if (labData.length > 15) {
      prompt += `... and ${labData.length - 15} additional biomarkers\n`;
    }
  }

  // Genetic data
  if (geneticData.length > 0) {
    prompt += `\n=== 🧬 GENETIC VARIANTS (PERSONALIZE HEAVILY) ===\n`;
    geneticData.slice(0, 10).forEach((snp: any) => {
      const rsid = snp.supported_snps?.rsid || 'Unknown';
      const gene = snp.supported_snps?.gene || 'Unknown';
      prompt += `• ${rsid} (${gene}): ${snp.genotype}\n`;
    });
    if (geneticData.length > 10) {
      prompt += `... and ${geneticData.length - 10} additional variants\n`;
    }
  }

  prompt += `\n🔥 CRITICAL INSTRUCTIONS:\n- 🍽️ DIETARY PREFERENCE COMPLIANCE: If they specified a dietary preference, EVERY food item must comply 100% - this is NON-NEGOTIABLE\n- Reference their SPECIFIC biomarker values in reasoning (e.g., \"Your Vitamin D level of 22 ng/mL...\")\n- Connect genetic variants to food choices (e.g., \"Your MTHFR variant means...\")\n- USE ALL 16 ASSESSMENT QUESTIONS above - address their sleep, energy, stress, digestion, etc.\n- Connect their symptoms to specific foods (e.g., \"Your brain fog + bloating suggests...\")\n- Reference their exact responses (e.g., \"Since you sleep only 5 hours...\")\n- Explain HOW each food will help THEIR specific body and concerns\n- Make every explanation deeply personal and caring\n- ALL meal ingredients must come from your grocery list\n- Provide EXACTLY 5 meals in each category (20 total)\n- Use only traditional whole foods (no seed oils, grass-fed only, etc.)\n- 🚨 MANDATORY: Use Title Case for ALL grocery list items\n\nProvide ONLY the JSON response with grocery list first, then exactly 20 personalized meals.`;

  return prompt;
}

function parseDietPlan(aiResponse: string): any {
  try {
    // Clean the response to extract JSON
    let cleanResponse = aiResponse.trim();
    
    // Remove any markdown code blocks
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    const parsed = JSON.parse(cleanResponse);
    
    // Validate structure
    if (!parsed.grocery_list || !parsed.meal_suggestions) {
      throw new Error('Invalid diet plan structure');
    }
    
    // Validate meal counts
    const breakfast = parsed.meal_suggestions.breakfast || [];
    const lunch = parsed.meal_suggestions.lunch || [];
    const dinner = parsed.meal_suggestions.dinner || [];
    const snacks = parsed.meal_suggestions.snacks || [];
    
    console.log(`Meal counts: Breakfast: ${breakfast.length}, Lunch: ${lunch.length}, Dinner: ${dinner.length}, Snacks: ${snacks.length}`);
    
    return parsed;
    
  } catch (error) {
    console.error('Error parsing diet plan:', error);
    console.error('Raw AI response:', aiResponse);
    
    // Return a fallback structure
    return {
      grocery_list: {
        proteins: [{ item: "Grass-fed ground beef", reason: "High-quality protein source" }],
        vegetables: [{ item: "Organic spinach", reason: "Nutrient-dense leafy green" }],
        fruits: [{ item: "Organic blueberries", reason: "Antioxidant-rich fruit" }],
        fats: [{ item: "Grass-fed butter", reason: "Traditional healthy fat" }],
        seasonings: [{ item: "Sea salt", reason: "Natural mineral source" }],
        beverages: [{ item: "Filtered water", reason: "Essential hydration" }]
      },
      meal_suggestions: {
        breakfast: [{ name: "Simple scrambled eggs", ingredients: ["eggs", "butter"], benefits: "Basic nutrition" }],
        lunch: [{ name: "Beef salad", ingredients: ["beef", "spinach"], benefits: "Protein and greens" }],
        dinner: [{ name: "Grilled meat", ingredients: ["beef"], benefits: "Evening protein" }],
        snacks: [{ name: "Berries", ingredients: ["blueberries"], benefits: "Healthy snack" }]
      },
      general_notes: "A basic whole food nutrition plan. Please regenerate for more personalization.",
      contraindications: "Avoid seed oils and processed foods."
    };
  }
} 