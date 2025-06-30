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
    breakfast: { 
      name: string; 
      ingredients: string[]; 
      benefits: string;
      prep_time: string;
      cook_time: string;
      servings: string;
      instructions: string[];
      micronutrients: {
        primary_nutrients: string[];
        nutrient_density_score: string;
        key_vitamins: string[];
        key_minerals: string[];
        bioactive_compounds: string[];
        synergistic_effects: string;
      };
    }[];
    lunch: { 
      name: string; 
      ingredients: string[]; 
      benefits: string;
      prep_time: string;
      cook_time: string;
      servings: string;
      instructions: string[];
      micronutrients: {
        primary_nutrients: string[];
        nutrient_density_score: string;
        key_vitamins: string[];
        key_minerals: string[];
        bioactive_compounds: string[];
        synergistic_effects: string;
      };
    }[];
    dinner: { 
      name: string; 
      ingredients: string[]; 
      benefits: string;
      prep_time: string;
      cook_time: string;
      servings: string;
      instructions: string[];
      micronutrients: {
        primary_nutrients: string[];
        nutrient_density_score: string;
        key_vitamins: string[];
        key_minerals: string[];
        bioactive_compounds: string[];
        synergistic_effects: string;
      };
    }[];
    snacks: { 
      name: string; 
      ingredients: string[]; 
      benefits: string;
      prep_time: string;
      cook_time: string;
      servings: string;
      instructions: string[];
      micronutrients: {
        primary_nutrients: string[];
        nutrient_density_score: string;
        key_vitamins: string[];
        key_minerals: string[];
        bioactive_compounds: string[];
        synergistic_effects: string;
      };
    }[];
  };
  micronutrient_analysis: {
    key_nutrients: { nutrient: string; sources: string[]; health_benefits: string; why_you_need_it: string }[];
    nutrient_synergies: { combination: string; benefit: string; foods_involved: string[] }[];
    supplement_synergy: { explanation: string; examples: string[] };
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
      supabase.from('user_profiles').select('*').eq('id', userId).maybeSingle(),
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

    console.log('Diet plan data fetch summary:', {
      profileExists: !!profile,
      allergiesCount: allergies?.length || 0,
      conditionsCount: conditions?.length || 0,
      medicationsCount: medications?.length || 0,
      biomarkersCount: biomarkers?.length || 0,
      snpsCount: snps?.length || 0
    });

    // 🚨 CRITICAL SAFETY LOG: Debug dietary constraints
    console.log('🚨 DIETARY SAFETY CHECK:', {
      userId: userId,
      dietaryPreference: profile?.dietary_preference || 'NONE SET (DANGEROUS!)',
      allergies: allergies?.map(a => a.ingredient_name) || [],
      profileData: !!profile ? 'Profile exists' : 'NO PROFILE (ERROR!)'
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
            content: getDietSystemPrompt(
              personalizationTier, 
              labData.length, 
              geneticData.length,
              userProfile.dietary_preference,
              healthHistory.allergies
            )
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 16000,
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
    console.log('Raw AI response:', aiDietPlan);
    
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
      message: 'Diet plan generated successfully',
      data: planDetails
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error in generate-diet-plan:', error);
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred while generating your diet plan.',
      details: error.message 
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

function getDietSystemPrompt(tier: string, biomarkerCount: number, geneticCount: number, dietaryPreference?: string, allergies?: string[]): string {
  let dietaryConstraints = '';
  
  // Create ABSOLUTE dietary constraints based on diet type
  if (dietaryPreference) {
    dietaryConstraints = `\n🚨🚨🚨 ABSOLUTE DIETARY CONSTRAINTS (OVERRIDE EVERYTHING) 🚨🚨🚨\n`;
    switch (dietaryPreference.toLowerCase()) {
      case 'vegan':
        dietaryConstraints += `❌ ABSOLUTELY NO: Meat, poultry, fish, eggs, dairy, honey, or ANY animal products
✅ ONLY: Plant-based foods, vegetables, fruits, legumes, nuts, seeds, grains (if no other restrictions)`;
        break;
      case 'vegetarian':
        dietaryConstraints += `❌ ABSOLUTELY NO: Meat, poultry, fish, or ANY foods containing these
✅ ALLOWED: Eggs, dairy, plant-based foods, vegetables, fruits, legumes, nuts, seeds`;
        break;
      case 'celiac':
        dietaryConstraints += `❌ ABSOLUTELY NO: Wheat, barley, rye, or ANY foods containing gluten
❌ NO: Bread, pasta, cereals, beer, or processed foods with hidden gluten
✅ ONLY: Certified gluten-free grains (rice, quinoa), meats, vegetables, fruits`;
        break;
      case 'keto':
        dietaryConstraints += `❌ EXTREMELY LIMITED: Carbohydrates (max 20-30g net carbs per day)
❌ AVOID: Grains, sugar, most fruits (except small amounts of berries), starchy vegetables
✅ FOCUS: High-fat meats, fish, eggs, cheese, nuts, seeds, low-carb vegetables, healthy fats`;
        break;
      case 'paleo':
        dietaryConstraints += `❌ ABSOLUTELY NO: Grains, legumes, dairy, processed foods, refined sugar
✅ ONLY: Grass-fed meats, wild fish, eggs, vegetables, fruits, nuts, seeds`;
        break;
      case 'omnivore':
        dietaryConstraints += `✅ Can eat all food groups following whole food principles
⚠️ Still must avoid any specific allergies listed below`;
        break;
    }
    dietaryConstraints += '\n\n';
  }
  
  // Add allergy constraints
  if (allergies && allergies.length > 0) {
    dietaryConstraints += `🚨🚨🚨 LIFE-THREATENING ALLERGIES (ABSOLUTE AVOIDANCE) 🚨🚨🚨\n`;
    dietaryConstraints += `❌ NEVER INCLUDE: ${allergies.join(', ')}\n`;
    dietaryConstraints += `❌ NEVER INCLUDE foods that contain or may contain these allergens\n`;
    dietaryConstraints += `❌ Check ALL ingredients for hidden allergens\n`;
    dietaryConstraints += `⚠️ This is a SAFETY issue - NO EXCEPTIONS\n\n`;
  }

  const basePrompt = `You are a deeply caring, empathetic nutritionist who specializes in traditional whole food nutrition. You have a gift for making people feel truly seen, understood, and hopeful about their health journey.
${dietaryConstraints}
🎯 ULTIMATE MISSION: Create a personalized whole food grocery list + EXACTLY 20 meal suggestions (MUST BE: 5 breakfast, 5 lunch, 5 dinner, 5 snacks - NO LESS) with DEEPLY PERSONAL explanations

🚨🚨🚨 CRITICAL MEAL COUNT REQUIREMENT 🚨🚨🚨
You MUST provide EXACTLY:
- 5 breakfast recipes (not 1, not 3, EXACTLY 5)
- 5 lunch recipes (not 1, not 3, EXACTLY 5)
- 5 dinner recipes (not 1, not 3, EXACTLY 5)
- 5 snack recipes (not 1, not 3, EXACTLY 5)
TOTAL: 20 recipes (if you provide less than 20, the system will fail)

WHOLE FOOD PRINCIPLES (NON-NEGOTIABLE):
- ZERO seed oils (canola, soybean, corn, vegetable oil, sunflower oil)
- Grass-fed/pasture-raised animal products ONLY (if allowed by diet type)
- Wild-caught fish ONLY (if allowed by diet type)
- Traditional healthy fats: grass-fed butter, tallow, coconut oil, olive oil (if allowed by diet type)
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

🚨 CRITICAL ANTI-HALLUCINATION REQUIREMENTS:
- ALL meal ingredients MUST come from the grocery list you create - NO EXCEPTIONS
- Before writing any meal, CHECK that every ingredient is in your grocery list
- If an ingredient isn't in your grocery list, ADD IT to the grocery list first
- Use EXACT SAME SPELLING and formatting for ingredients between grocery list and meals
- NO ingredient can appear in a meal that isn't in the grocery list
- VALIDATE every meal against your grocery list before finalizing

🚨 COOKING INSTRUCTIONS ANTI-HALLUCINATION RULES:
- EXACTLY 5 steps per recipe - no more, no less
- Each step must be ACTIONABLE and SPECIFIC (include amounts, temperatures, timing)
- NO vague instructions like "cook until done" - specify exact times/temperatures
- Use REALISTIC cooking methods (no specialized equipment unless specified in grocery list)
- Include actual measurements (1 tbsp, 2 cups, 350°F, 15 minutes, etc.)
- Steps should flow logically: prep → cook → finish → serve
- NO fictional cooking techniques or impossible timing

🚨 MICRONUTRIENT PERSONALIZATION RULES (CRITICAL):
- NEVER use generic micronutrient info - ALWAYS connect to THEIR specific health data
- Reference their EXACT biomarker values (e.g., "Your Vitamin D level of 22 ng/mL...")
- Connect nutrients to their SPECIFIC symptoms (e.g., "Iron addresses YOUR fatigue")
- Use their genetic variants when explaining nutrient needs (e.g., "Your MTHFR variant...")
- Make nutrient density scores personal (e.g., "9.2/10 for YOUR energy needs")
- Explain synergistic effects for THEIR body (e.g., "enhances absorption for YOUR deficiency")
- NO generic statements like "good for immune system" - say "boosts YOUR weak immune system"
- Include approximate amounts from the meal (e.g., "Vitamin C: ~80mg from bell peppers")

MEAL INGREDIENT VALIDATION PROCESS:
1. Create complete grocery list first
2. For each meal, check EVERY ingredient against the grocery list
3. If ingredient missing from grocery list, ADD IT to the appropriate category
4. Use identical spelling/formatting between grocery list and meal ingredients
5. Double-check that no meal contains ingredients not in grocery list

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
    "breakfast": [
      {"name": "Breakfast 1", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Breakfast 2", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Breakfast 3", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Breakfast 4", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Breakfast 5", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}}
    ],
    "lunch": [
      {"name": "Lunch 1", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Lunch 2", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Lunch 3", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Lunch 4", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Lunch 5", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}}
    ],
    "dinner": [
      {"name": "Dinner 1", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Dinner 2", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Dinner 3", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Dinner 4", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Dinner 5", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}}
    ],
    "snacks": [
      {"name": "Snack 1", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Snack 2", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Snack 3", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Snack 4", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}},
      {"name": "Snack 5", "ingredients": ["..."], "benefits": "...", "prep_time": "...", "cook_time": "...", "servings": "...", "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."], "micronutrients": {"primary_nutrients": ["..."], "nutrient_density_score": "...", "key_vitamins": ["..."], "key_minerals": ["..."], "bioactive_compounds": ["..."], "synergistic_effects": "..."}}
    ]
  },
  "micronutrient_analysis": {
    "key_nutrients": [
      {
        "nutrient": "Vitamin C", 
        "sources": ["Bell Peppers", "Citrus Fruits"], 
        "health_benefits": "Immune support, collagen synthesis", 
        "why_you_need_it": "Based on your frequent illness and skin issues, you need extra immune support"
      }
    ],
    "nutrient_synergies": [
      {
        "combination": "Vitamin C + Iron", 
        "benefit": "Enhanced iron absorption", 
        "foods_involved": ["Bell Peppers", "Grass-Fed Beef"]
      }
    ],
    "supplement_synergy": {
      "explanation": "Your diet provides nutrients abundant in food while your 6-supplement pack covers nutrients hard to get from food",
      "examples": ["Healthy fats in your diet enhance Vitamin D absorption from your supplement"]
    }
  },
  "general_notes": "warm, encouraging message about how this plan will help them",
  "contraindications": "Traditional whole food safety considerations"
}

🚨🚨🚨 FINAL CRITICAL REQUIREMENT 🚨🚨🚨
You MUST provide EXACTLY 5 meals in each category:
- breakfast array MUST contain 5 complete meal objects
- lunch array MUST contain 5 complete meal objects  
- dinner array MUST contain 5 complete meal objects
- snacks array MUST contain 5 complete meal objects
TOTAL = 20 meals (NOT 4, NOT 8, NOT 12 - EXACTLY 20)

If you provide less than 20 meals, the response will be rejected and regenerated.

⚠️ REMEMBER: Dietary preference and allergies OVERRIDE all other considerations. Check every single food item against the constraints at the top of this prompt.`;

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

🚨🚨🚨 CRITICAL SAFETY CONSTRAINTS (MUST CHECK FIRST) 🚨🚨🚨`;

  // 🚨 DIETARY PREFERENCE - ABSOLUTE TOP PRIORITY
  if (profile.dietary_preference) {
    prompt += `\n\n🍽️ DIETARY PREFERENCE: ${profile.dietary_preference.toUpperCase()}\n`;
    prompt += `⚠️ CRITICAL: This is NON-NEGOTIABLE. Every single food item and meal MUST align with their ${profile.dietary_preference} dietary requirements.\n`;
  }

  // 🚨 ALLERGIES - LIFE-THREATENING PRIORITY
  if (healthHistory.allergies && healthHistory.allergies.length > 0) {
    prompt += `\n⚠️ LIFE-THREATENING ALLERGIES:\n`;
    healthHistory.allergies.forEach((allergy: string) => {
      prompt += `❌ NEVER INCLUDE: ${allergy}\n`;
    });
    prompt += `⚠️ This is a SAFETY issue - check ALL ingredients for these allergens\n`;
  }

  prompt += `\n=== PATIENT PROFILE ===\n`;

  // Demographics
  if (profile.age) prompt += `Age: ${profile.age} years\n`;
  if (profile.gender) prompt += `Gender: ${profile.gender}\n`;
  if (profile.weight_lbs) prompt += `Weight: ${profile.weight_lbs} lbs\n`;
  if (profile.height_total_inches) prompt += `Height: ${profile.height_total_inches} inches\n`;
  if (profile.activity_level) prompt += `Activity: ${profile.activity_level}\n`;

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
  if (profile.energy_levels) {
    prompt += `Energy Levels: ${profile.energy_levels}\n`;
    if (profile.energy_levels_details) prompt += `  💬 Details: "${profile.energy_levels_details}"\n`;
  }
  if (profile.effort_fatigue) {
    prompt += `Effort/Fatigue: ${profile.effort_fatigue}\n`;
    if (profile.effort_fatigue_details) prompt += `  💬 Details: "${profile.effort_fatigue_details}"\n`;
  }
  if (profile.sleep_quality) {
    prompt += `Sleep Quality: ${profile.sleep_quality}\n`;
    if (profile.sleep_quality_details) prompt += `  💬 Details: "${profile.sleep_quality_details}"\n`;
  }
  if (profile.sleep_aids) prompt += `Sleep Aids: ${profile.sleep_aids}\n`;
  
  // Mental/Cognitive
  if (profile.caffeine_effect) {
    prompt += `Caffeine Effect: ${profile.caffeine_effect}\n`;
    if (profile.caffeine_effect_details) prompt += `  💬 Details: "${profile.caffeine_effect_details}"\n`;
  }
  if (profile.brain_fog) {
    prompt += `Brain Fog: ${profile.brain_fog}\n`;
    if (profile.brain_fog_details) prompt += `  💬 Details: "${profile.brain_fog_details}"\n`;
  }
  if (profile.anxiety_level) prompt += `Anxiety Level: ${profile.anxiety_level}\n`;
  if (profile.stress_resilience) prompt += `Stress Resilience: ${profile.stress_resilience}\n`;
  if (profile.stress_levels) {
    prompt += `Stress Levels: ${profile.stress_levels}\n`;
    if (profile.stress_levels_details) prompt += `  💬 Details: "${profile.stress_levels_details}"\n`;
  }
  if (profile.mood_changes) {
    prompt += `Mood Changes: ${profile.mood_changes}\n`;
    if (profile.mood_changes_details) prompt += `  💬 Details: "${profile.mood_changes_details}"\n`;
  }
  
  // Digestive & Metabolic
  if (profile.bloating) prompt += `Bloating: ${profile.bloating}\n`;
  if (profile.digestion_speed) prompt += `Digestion Speed: ${profile.digestion_speed}\n`;
  if (profile.digestive_issues) {
    prompt += `Digestive Issues: ${profile.digestive_issues}\n`;
    if (profile.digestive_issues_details) prompt += `  💬 Details: "${profile.digestive_issues_details}"\n`;
  }
  if (profile.food_sensitivities) {
    prompt += `Food Sensitivities: ${profile.food_sensitivities}\n`;
    if (profile.food_sensitivities_details) prompt += `  💬 Details: "${profile.food_sensitivities_details}"\n`;
  }
  if (profile.sugar_cravings) {
    prompt += `Sugar Cravings: ${profile.sugar_cravings}\n`;
    if (profile.sugar_cravings_details) prompt += `  💬 Details: "${profile.sugar_cravings_details}"\n`;
  }
  if (profile.weight_management) {
    prompt += `Weight Management: ${profile.weight_management}\n`;
    if (profile.weight_management_details) prompt += `  💬 Details: "${profile.weight_management_details}"\n`;
  }
  if (profile.belly_fat) prompt += `Belly Fat: ${profile.belly_fat}\n`;
  
  // Physical Health
  if (profile.anemia_history) prompt += `Anemia History: ${profile.anemia_history}\n`;
  if (profile.bruising_bleeding) prompt += `Bruising/Bleeding: ${profile.bruising_bleeding}\n`;
  if (profile.joint_pain) {
    prompt += `Joint Pain: ${profile.joint_pain}\n`;
    if (profile.joint_pain_details) prompt += `  💬 Details: "${profile.joint_pain_details}"\n`;
  }
  if (profile.skin_issues) {
    prompt += `Skin Issues: ${profile.skin_issues}\n`;
    if (profile.skin_issues_details) prompt += `  💬 Details: "${profile.skin_issues_details}"\n`;
  }
  if (profile.immune_system) {
    prompt += `Immune System: ${profile.immune_system}\n`;
    if (profile.immune_system_details) prompt += `  💬 Details: "${profile.immune_system_details}"\n`;
  }
  if (profile.workout_recovery) {
    prompt += `Workout Recovery: ${profile.workout_recovery}\n`;
    if (profile.workout_recovery_details) prompt += `  💬 Details: "${profile.workout_recovery_details}"\n`;
  }
  if (profile.medication_history) {
    prompt += `Medication History: ${profile.medication_history}\n`;
    if (profile.medication_history_details) prompt += `  💬 Details: "${profile.medication_history_details}"\n`;
  }
  
  // Nutrient Deficiencies
  if (profile.low_nutrients && profile.low_nutrients.length > 0) {
    prompt += `Low Nutrients: ${profile.low_nutrients.join(', ')}\n`;
  }
  
  // Custom goals
  if (profile.custom_health_goal) prompt += `Custom Health Goal: "${profile.custom_health_goal}"\n`;

  // Health history (excluding allergies which are at the top)
  if (healthHistory.conditions.length > 0) {
    prompt += `\n🏥 Conditions: ${healthHistory.conditions.join(', ')}\n`;
  }
  if (healthHistory.medications.length > 0) {
    prompt += `💊 Medications: ${healthHistory.medications.join(', ')}\n`;
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

  prompt += `\n=== 🎯 DIET PLAN STRATEGY (Complement the 6-Supplement Pack) ===\n`;
  prompt += `Your diet plan should focus on nutrients that ARE abundant in food and work synergistically with their supplement pack:\n\n`;
  
  prompt += `🥗 FOCUS ON FOOD-ABUNDANT NUTRIENTS (NOT in supplement pack):\n`;
  prompt += `• Vitamin C - Citrus fruits, berries, bell peppers, leafy greens\n`;
  prompt += `• Vitamin E - Nuts, seeds, avocados, olive oil\n`;
  prompt += `• Potassium - Bananas, potatoes, spinach, avocados\n`;
  prompt += `• Folate - Leafy greens, legumes (if no MTHFR issues)\n`;
  prompt += `• Fiber - Vegetables, fruits, nuts, seeds\n`;
  prompt += `• Antioxidants - Colorful vegetables, berries, herbs, spices\n`;
  prompt += `• Polyphenols - Green tea, berries, dark chocolate, herbs\n\n`;
  
  prompt += `🔗 SYNERGY WITH SUPPLEMENT PACK:\n`;
  prompt += `• Healthy fats enhance Vitamin D absorption (from their supplement)\n`;
  prompt += `• Vitamin C foods enhance iron absorption (if they take Easy Iron)\n`;
  prompt += `• Magnesium-rich foods support their Magnesium supplement\n`;
  prompt += `• Prebiotic foods feed their probiotic supplements\n\n`;
  
  prompt += `🎯 STRATEGY: Create a diet plan that provides nutrients abundant in food while supporting the absorption and effectiveness of their 6-supplement pack.\n\n`;

  prompt += `🔥 CRITICAL INSTRUCTIONS (IN ORDER OF PRIORITY):\n1. 🚨 ALLERGIES: NEVER include any allergen listed above - this is LIFE-THREATENING\n2. 🍽️ DIETARY PREFERENCE: EVERY food must comply with their ${profile.dietary_preference || 'specified'} diet - NO EXCEPTIONS\n3. Reference their SPECIFIC biomarker values in reasoning (e.g., \"Your Vitamin D level of 22 ng/mL...\")\n4. Connect genetic variants to food choices (e.g., \"Your MTHFR variant means...\")\n5. USE ALL 16 ASSESSMENT QUESTIONS above - address their sleep, energy, stress, digestion, etc.\n6. Connect their symptoms to specific foods (e.g., \"Your brain fog + bloating suggests...\")\n7. Reference their exact responses (e.g., \"Since you sleep only 5 hours...\")\n8. Explain HOW each food will help THEIR specific body and concerns\n9. Make every explanation deeply personal and caring\n10. ALL meal ingredients must come from your grocery list\n11. Provide EXACTLY 5 meals in each category (20 total)\n12. Use only traditional whole foods (no seed oils, grass-fed only if diet allows, etc.)\n13. 🚨 MANDATORY: Use Title Case for ALL grocery list items\n14. 🎯 FOCUS ON FOOD-ABUNDANT NUTRIENTS that complement their supplement pack\n\n🔍 PATTERN DETECTION FROM USER DETAILS:\nIf the user provided details about their symptoms (marked with 💬), analyze these for:\n- TIMING patterns (morning fatigue, 3pm crashes, after meals, etc.)\n- TRIGGER patterns (stress, certain foods, weather, activity)\n- CONNECTION patterns (symptoms that occur together)\n- SEVERITY patterns (frequency, duration, impact on life)\nUse these patterns to make ultra-personalized food recommendations!\n\n🧬 MICRONUTRIENT ANALYSIS REQUIREMENTS:\n- Identify 6-8 KEY NUTRIENTS they're getting from this diet plan\n- For each nutrient, explain WHY THEY SPECIFICALLY need it based on their symptoms/biomarkers/genetics\n- Show which foods in your grocery list provide each nutrient\n- Identify 3-4 powerful nutrient synergies (e.g., Vitamin C + Iron for better absorption)\n- Explain how their diet works WITH their 6-supplement pack (not against it)\n- Make it personal - connect nutrients to their specific health concerns\n- Example: \"Vitamin C from your bell peppers will help with your frequent illness and skin issues\"\n\nProvide ONLY the JSON response with grocery list first, then exactly 20 personalized meals, then micronutrient analysis.`;

  return prompt;
}

function parseDietPlan(aiResponse: string): any {
  try {
    // Clean the response to extract JSON
    let cleanResponse = aiResponse.trim();
    
    // Log response length for debugging
    console.log(`AI response length: ${cleanResponse.length} characters`);
    
    // Check if response appears truncated
    if (!cleanResponse.endsWith('}') && !cleanResponse.endsWith('```')) {
      console.warn('⚠️ Response appears truncated - does not end with } or ```');
      console.log('Last 200 characters:', cleanResponse.slice(-200));
    }
    
    // Remove any markdown code blocks
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Final check for proper JSON ending
    if (!cleanResponse.trim().endsWith('}')) {
      console.warn('⚠️ Cleaned response does not end with }, attempting to parse anyway');
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
    
    // Ensure micronutrient analysis exists
    if (!parsed.micronutrient_analysis) {
      console.warn('No micronutrient analysis in AI response, adding default structure');
      parsed.micronutrient_analysis = {
        key_nutrients: [],
        nutrient_synergies: [],
        supplement_synergy: {
          explanation: "Your diet provides nutrients abundant in food while your supplement pack covers nutrients difficult to obtain from food alone.",
          examples: []
        }
      };
    }
    
    return parsed;
    
  } catch (error) {
    console.error('Error parsing diet plan:', error);
    console.error('Raw AI response:', aiResponse);
    
    // Return a fallback structure
    return {
      grocery_list: {
        proteins: [{ item: "Grass-Fed Ground Beef", reason: "High-quality protein source" }],
        vegetables: [{ item: "Organic Spinach", reason: "Nutrient-dense leafy green" }],
        fruits: [{ item: "Organic Blueberries", reason: "Antioxidant-rich fruit" }],
        fats: [{ item: "Grass-Fed Butter", reason: "Traditional healthy fat" }],
        seasonings: [{ item: "Sea Salt", reason: "Natural mineral source" }],
        beverages: [{ item: "Filtered Water", reason: "Essential hydration" }]
      },
      meal_suggestions: {
        breakfast: [{ name: "Simple Scrambled Eggs", ingredients: ["Grass-Fed Butter"], benefits: "Basic nutrition" }],
        lunch: [{ name: "Beef Salad", ingredients: ["Grass-Fed Ground Beef", "Organic Spinach"], benefits: "Protein and greens" }],
        dinner: [{ name: "Grilled Beef", ingredients: ["Grass-Fed Ground Beef"], benefits: "Evening protein" }],
        snacks: [{ name: "Fresh Berries", ingredients: ["Organic Blueberries"], benefits: "Healthy snack" }]
      },
      micronutrient_analysis: {
        key_nutrients: [
          {
            nutrient: "Iron",
            sources: ["Grass-Fed Ground Beef", "Organic Spinach"],
            health_benefits: "Oxygen transport, energy production",
            why_you_need_it: "Essential for preventing fatigue and supporting energy levels"
          }
        ],
        nutrient_synergies: [
          {
            combination: "Iron + Vitamin C",
            benefit: "Enhanced iron absorption",
            foods_involved: ["Grass-Fed Ground Beef", "Organic Spinach"]
          }
        ],
        supplement_synergy: {
          explanation: "Your diet provides food-abundant nutrients while your supplement pack covers nutrients difficult to obtain from food alone.",
          examples: ["Healthy fats enhance vitamin absorption from supplements"]
        }
      },
      general_notes: "A basic whole food nutrition plan. Please regenerate for more personalization.",
      contraindications: "Avoid seed oils and processed foods."
    };
  }
} 