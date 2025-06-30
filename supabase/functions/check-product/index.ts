import { createClient } from 'jsr:@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Firecrawl API key will be loaded from environment variables

serve(async (req) => {
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

    // Parse request body
    const { productUrl } = await req.json();

    if (!productUrl) {
      return new Response(JSON.stringify({ error: 'Product URL is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Validate URL format
    try {
      new URL(productUrl);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL format' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Get Firecrawl API key from Supabase secrets
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      throw new Error('Firecrawl API key not configured');
    }

    // Get OpenAI API key from Supabase secrets
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Scrape product page using Firecrawl
    console.log('Scraping product page:', productUrl);
    let productContent;
    try {
      const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: productUrl,
          pageOptions: {
            onlyMainContent: true,
            includeHtml: false,
          },
        }),
      });

      if (!firecrawlResponse.ok) {
        const errorData = await firecrawlResponse.text();
        console.error('Firecrawl error:', errorData);
        throw new Error(`Firecrawl API error: ${firecrawlResponse.status}`);
      }

      const firecrawlData = await firecrawlResponse.json();
      productContent = firecrawlData.data?.content;

      if (!productContent) {
        throw new Error('Could not extract product content from page');
      }
    } catch (error: any) {
      console.error('Error scraping product page:', error);
      return new Response(JSON.stringify({ 
        error: `Failed to scrape product page: ${error.message}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Fetch comprehensive user health data
    console.log('Fetching user health data for:', user.id);
    const [
      { data: profile, error: profileError },
      { data: biomarkers, error: biomarkersError },
      { data: rawSnps, error: snpsError },
      { data: allergies, error: allergiesError },
      { data: conditions, error: conditionsError },
      { data: medications, error: medicationsError },
      { data: okCapsuleProducts, error: productsError }
    ] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', user.id).single(),
      supabase.from('user_biomarkers').select('*').eq('user_id', user.id).limit(500),
      supabase.from('user_snps').select('*').eq('user_id', user.id).limit(1000),
              supabase.from('user_allergies').select('*').eq('user_id', user.id).limit(50),
              supabase.from('user_conditions').select('*').eq('user_id', user.id).limit(30),
        supabase.from('user_medications').select('*').eq('user_id', user.id).limit(50),
      supabase.from('products').select('supplement_name, brand, product_name, product_url').eq('brand', 'OK Capsule')
    ]);

    // Log data counts for debugging
    console.log('Data fetched counts:', {
      profile: profile ? 'found' : 'none',
      biomarkers: biomarkers?.length || 0,
      rawSnps: rawSnps?.length || 0,
      allergies: allergies?.length || 0,
      conditions: conditions?.length || 0,
      medications: medications?.length || 0,
      products: okCapsuleProducts?.length || 0
    });

    // Fetch supported SNPs data separately for manual joining (same as other functions)
    const { data: allSupportedSnps, error: supportedSnpsError } = await supabase
      .from('supported_snps')
      .select('id, rsid, gene');
    
    console.log('Supported SNPs count:', allSupportedSnps?.length);
    console.log('Supported SNPs error:', supportedSnpsError);

    // Create a lookup map for supported SNPs
    const snpLookup = new Map();
    if (allSupportedSnps) {
      allSupportedSnps.forEach(snp => {
        snpLookup.set(snp.id, { rsid: snp.rsid, gene: snp.gene });
      });
    }

    // Manually join the SNP data (same logic as other functions)
    const enrichedSnps = rawSnps?.map(userSnp => ({
      ...userSnp,
      supported_snps: snpLookup.get(userSnp.supported_snp_id) || null
    })) || [];

    // Log first few enriched SNPs for debugging
    if (enrichedSnps && enrichedSnps.length > 0) {
      console.log('Enriched SNPs count:', enrichedSnps.length);
      console.log('Sample enriched SNPs:', enrichedSnps.slice(0, 5).map(s => ({ 
        rsid: s.supported_snps?.rsid, 
        gene: s.supported_snps?.gene, 
        genotype: s.genotype,
        supported_snp_id: s.supported_snp_id,
        has_gene_data: !!s.supported_snps
      })));
    }

    // Handle potential data errors gracefully
    const userProfile = profile || {};
    const userBiomarkers = biomarkers || [];
    const userSnps = enrichedSnps || []; // Use enriched SNPs with gene data
    const userAllergies = allergies || [];
    const userConditions = conditions || [];
    const userMedications = medications || [];
    const availableProducts = okCapsuleProducts || [];

    // Build onboarding context from new frictionless onboarding data
    function buildOnboardingContext(profile: any): string {
      const parts = [];
      
      // Primary Health Concern - Most Important!
      if (profile?.primary_health_concern?.trim()) {
        parts.push(`**PRIMARY HEALTH CONCERN**: ${profile.primary_health_concern}`);
      }
      
      // Manual Biomarker/Genetic Input
      if (profile?.known_biomarkers?.trim()) {
        parts.push(`**USER-ENTERED BIOMARKERS**: ${profile.known_biomarkers}`);
      }
      if (profile?.known_genetic_variants?.trim()) {
        parts.push(`**USER-ENTERED GENETICS**: ${profile.known_genetic_variants}`);
      }
      
      // Lifestyle Assessment Issues (Yes answers only) - Detailed context
      const lifestyleIssues = [];
      const lifestyleDetails = [];
      
      if (profile?.energy_levels === 'yes') {
        lifestyleIssues.push('Often feels tired or low energy (needs energy-boosting nutrients like B-vitamins and iron)');
        if (profile?.energy_levels_details) {
          lifestyleDetails.push(`Energy details: "${profile.energy_levels_details}"`);
        }
      }
      if (profile?.effort_fatigue === 'yes') {
        lifestyleIssues.push('Physical activity feels more difficult than it should (may benefit from performance-enhancing supplements like CoQ10)');
        if (profile?.effort_fatigue_details) {
          lifestyleDetails.push(`Fatigue details: "${profile.effort_fatigue_details}"`);
        }
      }
      if (profile?.digestive_issues === 'yes') {
        lifestyleIssues.push('Experiences digestive discomfort regularly (needs gut-healing nutrients and probiotics)');
        if (profile?.digestive_issues_details) {
          lifestyleDetails.push(`Digestive details: "${profile.digestive_issues_details}"`);
        }
      }
      if (profile?.stress_levels === 'yes') {
        lifestyleIssues.push('Feels stressed or anxious frequently (needs stress-fighting nutrients like magnesium)');
        if (profile?.stress_levels_details) {
          lifestyleDetails.push(`Stress details: "${profile.stress_levels_details}"`);
        }
      }
      if (profile?.mood_changes === 'yes') {
        lifestyleIssues.push('Experiences mood swings or irritability (needs mood-stabilizing nutrients like omega-3s)');
        if (profile?.mood_changes_details) {
          lifestyleDetails.push(`Mood details: "${profile.mood_changes_details}"`);
        }
      }
      if (profile?.sugar_cravings === 'yes') {
        lifestyleIssues.push('Craves sugar or processed foods (needs blood sugar stabilizing nutrients)');
        if (profile?.sugar_cravings_details) {
          lifestyleDetails.push(`Cravings details: "${profile.sugar_cravings_details}"`);
        }
      }
      if (profile?.skin_issues === 'yes') {
        lifestyleIssues.push('Has skin problems like acne, dryness, or sensitivity (needs skin-supporting vitamins like zinc and vitamin E)');
        if (profile?.skin_issues_details) {
          lifestyleDetails.push(`Skin details: "${profile.skin_issues_details}"`);
        }
      }
      if (profile?.joint_pain === 'yes') {
        lifestyleIssues.push('Experiences joint pain or stiffness (needs anti-inflammatory supplements like turmeric)');
        if (profile?.joint_pain_details) {
          lifestyleDetails.push(`Joint pain details: "${profile.joint_pain_details}"`);
        }
      }
      if (profile?.brain_fog === 'yes') {
        lifestyleIssues.push('Experiences brain fog or difficulty concentrating (needs brain-boosting supplements for mental clarity)');
        if (profile?.brain_fog_details) {
          lifestyleDetails.push(`Brain fog details: "${profile.brain_fog_details}"`);
        }
      }
      if (profile?.sleep_quality === 'yes') {
        lifestyleIssues.push('Has trouble falling asleep or staying asleep (needs sleep-promoting supplements like melatonin)');
        if (profile?.sleep_quality_details) {
          lifestyleDetails.push(`Sleep details: "${profile.sleep_quality_details}"`);
        }
      }
      if (profile?.workout_recovery === 'yes') {
        lifestyleIssues.push('Takes longer to recover from workouts (needs recovery-enhancing supplements)');
        if (profile?.workout_recovery_details) {
          lifestyleDetails.push(`Recovery details: "${profile.workout_recovery_details}"`);
        }
      }
      if (profile?.food_sensitivities === 'yes') {
        lifestyleIssues.push('Certain foods make them feel unwell (needs digestive enzymes and gut repair nutrients)');
        if (profile?.food_sensitivities_details) {
          lifestyleDetails.push(`Food sensitivity details: "${profile.food_sensitivities_details}"`);
        }
      }
      if (profile?.weight_management === 'yes') {
        lifestyleIssues.push('Difficult to maintain a healthy weight (needs metabolism-supporting supplements)');
        if (profile?.weight_management_details) {
          lifestyleDetails.push(`Weight management details: "${profile.weight_management_details}"`);
        }
      }
      if (profile?.immune_system === 'yes') {
        lifestyleIssues.push('Gets sick more often than desired (needs immune-boosting nutrients)');
        if (profile?.immune_system_details) {
          lifestyleDetails.push(`Immune system details: "${profile.immune_system_details}"`);
        }
      }
      if (profile?.caffeine_effect === 'yes') {
        lifestyleIssues.push('Relies on caffeine to get through the day');
        if (profile?.caffeine_effect_details) {
          lifestyleDetails.push(`Caffeine details: "${profile.caffeine_effect_details}"`);
        }
      }
      if (profile?.medication_history === 'yes' && profile?.medication_history_details) {
        lifestyleDetails.push(`Medication history details: "${profile.medication_history_details}"`);
      }
      
      // Also include positive lifestyle factors (No answers)
      const lifestyleStrengths = [];
      if (profile?.caffeine_effect === 'no') lifestyleStrengths.push('Does not rely on caffeine to get through the day');
      if (profile?.immune_system === 'no') lifestyleStrengths.push('Does not get sick more often than desired (good immune function)');
      
      if (lifestyleIssues.length > 0) {
        parts.push(`**LIFESTYLE CONCERNS**: ${lifestyleIssues.join(' • ')}`);
      }
      
      if (lifestyleDetails.length > 0) {
        parts.push(`**LIFESTYLE DETAILS (User-Provided Context)**: \n${lifestyleDetails.join('\n')}`);
      }
      
      if (lifestyleStrengths.length > 0) {
        parts.push(`**LIFESTYLE STRENGTHS**: ${lifestyleStrengths.join(' • ')}`);
      }
      
      // ADHD/Anxiety Medication History
      if (profile?.medication_history === 'yes') {
        parts.push(`**MEDICATION HISTORY**: Previously tried ADHD/anxiety medications that didn't work effectively`);
      }
      
      return parts.join('\n');
    }

    // Create comprehensive health profile for AI analysis
    const onboardingContext = buildOnboardingContext(userProfile);
    const healthProfile = {
      onboardingContext,
      basicInfo: {
        age: userProfile.age,
        gender: userProfile.gender,
        heightInches: userProfile.height_total_inches,
        weightLbs: userProfile.weight_lbs,
        activityLevel: userProfile.activity_level
      },
      healthGoals: userProfile.health_goals || [],
      healthMetrics: {
        sleepHours: userProfile.sleep_hours,
        energyLevels: userProfile.energy_levels,
        effortFatigue: userProfile.effort_fatigue,
        caffeineEffect: userProfile.caffeine_effect,
        brainFog: userProfile.brain_fog,
        anxietyLevel: userProfile.anxiety_level,
        stressResilience: userProfile.stress_resilience,
        sleepQuality: userProfile.sleep_quality,
        sleepAids: userProfile.sleep_aids,
        bloating: userProfile.bloating,
        anemiaHistory: userProfile.anemia_history,
        digestionSpeed: userProfile.digestion_speed,
        lowNutrients: userProfile.low_nutrients || [],
        bruisingBleeding: userProfile.bruising_bleeding,
        bellyFat: userProfile.belly_fat,
        jointPain: userProfile.joint_pain
      },
      biomarkers: userBiomarkers.map(b => {
        // Simple prettifier: snake_case or all-caps to Title Case
        const prettify = (raw: string | null) => {
          if (!raw) return 'Unknown Marker';
          // Custom overrides for very common markers
          const overrides: Record<string, string> = {
            'vitamin_d_25_oh': 'Vitamin D, 25-OH',
            'ldl_c': 'LDL Cholesterol',
            'hdl_c': 'HDL Cholesterol',
            'hs_crp': 'hs-CRP',
            'hba1c': 'Hemoglobin A1c'
          };
          if (overrides[raw.toLowerCase()]) return overrides[raw.toLowerCase()];
          // Generic snake_case ➔ Title Case
          return raw.replace(/_/g, ' ')  // snake ➔ space
                    .replace(/\b([a-z])/g, (m) => m.toUpperCase());
        };

        return {
          name: b.marker_name,
          displayName: prettify(b.marker_name),
          value: b.value,
          unit: b.unit,
          referenceRange: b.reference_range,
          comment: b.comment
        };
      }),
      genetics: userSnps.map(s => ({
        rsid: s.supported_snps?.rsid || s.snp_id || s.rsid,
        gene: s.supported_snps?.gene || s.gene_name || s.gene,
        genotype: s.genotype,
        comment: s.comment
      })).filter(g => g.rsid && g.gene), // Only include SNPs with complete data
      allergies: userAllergies.map(a => a.ingredient_name),
      conditions: userConditions.map(c => c.condition_name),
      medications: userMedications.map(m => m.medication_name),
      okCapsuleAlternatives: availableProducts.map(p => ({
        supplementName: p.supplement_name,
        productName: p.product_name,
        url: p.product_url
      }))
    };

    // Generate AI analysis
    console.log('Generating AI analysis...');
    try {
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',

          messages: [
            {
              role: 'system',
              content: `You are a FAIR but CRITICAL supplement evaluation specialist. Your job is to analyze THIS SPECIFIC PRODUCT fairly - judge it for what it claims to be, not what it's missing.

🎯 FAIRNESS PRINCIPLES:
1. **PRODUCT-FOCUSED**: Only evaluate ingredients that ARE in this product
2. **FAIR SCOPE**: Don't penalize a zinc supplement for not having vitamin D 
3. **CRITICAL BUT FAIR**: Be tough on quality, forms, and dosing within the product's intended scope
4. **USER-SPECIFIC**: Focus on how THIS product works for THIS user's specific health profile

📋 RESPONSE FORMAT - Return JSON with this exact structure:
{
  "productName": "extracted product name",
  "brand": "extracted brand name", 
  "overallScore": number between 0-100,
  "summary": "brief 1-2 sentence summary of how well this product fits the user's needs",
  "pros": ["specific benefits of THIS product for this user"],
  "cons": ["legitimate concerns about THIS product for this user"],
  "warnings": ["important safety considerations for this user"]
}

⚖️ FAIR ANALYSIS FRAMEWORK:

**WHAT TO SCORE ON**:
✅ Ingredient forms (methylated vs synthetic for MTHFR users)
✅ Dosing appropriateness for user's needs and genetics
✅ Quality of ingredients actually present
✅ Addresses user's reported symptoms/biomarkers  
✅ Safety with user's medications/conditions
✅ Synergy between ingredients that ARE included
✅ Third-party testing and manufacturing quality

**WHAT NOT TO PENALIZE**:
❌ Don't dock points because user needs vitamin D but product is a B-complex
❌ Don't criticize for not being a multivitamin if it's a targeted supplement
❌ Don't penalize missing nutrients outside the product's scope
❌ Don't expect every product to address every health concern

🎯 USER-SPECIFIC PERSONALIZATION:

**PRIMARY HEALTH CONCERNS**: How well does THIS product address their stated primary concern?
**REPORTED SYMPTOMS**: Does THIS product contain ingredients that may help their specific symptoms?
**BIOMARKERS**: Do the ingredients and doses in THIS product make sense for their lab values?
**GENETIC VARIANTS**: Are the ingredient forms in THIS product optimal for their genetics?
**ALLERGIES/CONDITIONS**: Any safety concerns with THIS product for their conditions?
**CURRENT MEDICATIONS**: Any interactions with THIS product?

📊 FAIR SCORING SYSTEM (0-100):

**EXCELLENT (85-95)**: 
- Ingredient forms perfectly matched to user's genetics
- Dosing ideal for their biomarker levels and symptoms
- High-quality ingredients with good bioavailability
- Directly addresses their primary health concerns
- No safety concerns for their profile

**VERY GOOD (75-84)**:
- Most ingredients in good forms for user
- Appropriate dosing for their needs  
- Quality ingredients from reputable source
- Addresses some of their health concerns
- Minor optimization opportunities

**GOOD (65-74)**:
- Decent ingredient forms, some suboptimal
- Reasonable dosing, could be better optimized
- Standard quality ingredients
- Somewhat relevant to their health profile
- No major red flags

**FAIR (50-64)**:
- Mix of good and poor ingredient forms
- Dosing may be too high/low for user
- Average quality ingredients
- Limited relevance to their specific needs
- Some minor concerns

**POOR (30-49)**:
- Suboptimal ingredient forms for user's genetics
- Inappropriate dosing for their needs
- Lower quality ingredients or forms
- Doesn't address their main concerns well
- Some safety or efficacy concerns

**VERY POOR (15-29)**:
- Contains forms contraindicated for user
- Dangerous dosing for their profile
- Poor quality or problematic ingredients
- Could worsen their conditions
- Safety concerns present

**DANGEROUS (0-14)**:
- Contains known allergens for user
- Severe contraindications with genetics/meds
- Could cause serious adverse effects
- Extremely poor quality or contamination risk

🔥 CRITICAL ANALYSIS REQUIREMENTS:

**BE SPECIFIC**: Reference actual ingredient names, doses, and forms from the product
**BE PERSONAL**: Explain why each pro/con applies to THIS user specifically
**BE FAIR**: Don't expect the product to be something it's not
**BE HONEST**: If the product isn't a good fit, say so clearly
**BE HELPFUL**: Suggest what to look for instead if the product isn't suitable

Remember: Judge the product for what it IS, not what it ISN'T. Be critical within its intended scope, but fair about its purpose.`
            },
            {
              role: 'user',
              content: `COMPREHENSIVE USER HEALTH PROFILE:

=== ONBOARDING HEALTH ASSESSMENT ===
${healthProfile.onboardingContext || 'No onboarding data available'}

=== GENETIC VARIANTS & IMPLICATIONS ===
${healthProfile.genetics.length > 0 ? 
  healthProfile.genetics.map(g => `• ${g.rsid} (${g.gene}): ${g.genotype} - ${g.comment || 'No specific notes'}`).join('\n') :
  'No genetic data available'
}

Key Genetic Considerations:
${healthProfile.genetics.length > 0 ? 
  `- Total variants analyzed: ${healthProfile.genetics.length}
- MTHFR variants: ${healthProfile.genetics.filter(g => g.gene?.includes('MTHFR')).length > 0 ? 'Present - may need methylated forms of folate/B12' : 'None detected'}
- COMT variants: ${healthProfile.genetics.filter(g => g.gene?.includes('COMT')).length > 0 ? 'Present - may affect dopamine metabolism, consider magnesium' : 'None detected'}
- APOE variants: ${healthProfile.genetics.filter(g => g.gene?.includes('APOE')).length > 0 ? 'Present - may benefit from omega-3 and antioxidants' : 'None detected'}` :
  'No genetic variants to consider for supplement interactions'
}

=== LABORATORY BIOMARKERS & RANGES ===
${healthProfile.biomarkers.length > 0 ? 
  healthProfile.biomarkers.map((b: any) => `• **${b.displayName || b.name}**: ${b.value} ${b.unit} (Reference: ${b.referenceRange}) ${b.comment ? '- ' + b.comment : ''}`).join('\n') :
  'No laboratory data available'
}

Critical Biomarker Analysis:
${healthProfile.biomarkers.length > 0 ? 
  `- Total biomarkers: ${healthProfile.biomarkers.length}
- Vitamin D status: ${healthProfile.biomarkers.find(b => b.name?.toLowerCase().includes('vitamin d') || b.name?.toLowerCase().includes('25-oh'))?.value || 'Not tested'}
- B12 levels: ${healthProfile.biomarkers.find(b => b.name?.toLowerCase().includes('b12') || b.name?.toLowerCase().includes('cobalamin'))?.value || 'Not tested'}
- Iron status: ${healthProfile.biomarkers.find(b => b.name?.toLowerCase().includes('iron') || b.name?.toLowerCase().includes('ferritin'))?.value || 'Not tested'}
- Inflammatory markers: ${healthProfile.biomarkers.find(b => b.name?.toLowerCase().includes('crp') || b.name?.toLowerCase().includes('esr'))?.value || 'Not tested'}` :
  'No biomarker deficiencies to address'
}

=== 🚨 CRITICAL MEDICAL SAFETY INFORMATION ===
Medical Conditions: ${healthProfile.conditions.length > 0 ? healthProfile.conditions.join(', ') : 'None reported'}
Current Medications: ${healthProfile.medications.length > 0 ? healthProfile.medications.join(', ') : 'None reported'}
Known Allergies: ${healthProfile.allergies.length > 0 ? healthProfile.allergies.join(', ') : 'None reported'}

⚠️ **SAFETY PRIORITY**: These conditions, medications, and allergies MUST be the PRIMARY consideration in your analysis. Product safety comes before everything else.

=== SYMPTOM PROFILE ===
Primary Health Goals: ${healthProfile.healthGoals.length > 0 ? healthProfile.healthGoals.join(', ') : 'Not specified'}
Brain Fog: ${healthProfile.healthMetrics.brainFog || 'Not reported'}
Sleep Quality: ${healthProfile.healthMetrics.sleepQuality || 'Not reported'}
Energy Levels: ${healthProfile.healthMetrics.energyLevels || 'Not reported'}
Anxiety Level: ${healthProfile.healthMetrics.anxietyLevel || 'Not reported'}
Joint Pain: ${healthProfile.healthMetrics.jointPain || 'Not reported'}
Digestive Issues: ${healthProfile.healthMetrics.bloating || 'Not reported'}

=== PRODUCT TO ANALYZE ===
${productContent.substring(0, 8000)}

🚨 CRITICAL ANALYSIS INSTRUCTIONS (SAFETY FIRST):
1. **MEDICAL SAFETY SCREENING**: FIRST check for any allergens, medication interactions, or contraindications with their medical conditions
2. **INGREDIENT FORM ANALYSIS**: Examine EXACT ingredient forms in THIS SPECIFIC PRODUCT (methylcobalamin vs cyanocobalamin, methylfolate vs folic acid, etc.)
3. **GENETIC COMPATIBILITY**: For each major ingredient IN THIS PRODUCT, determine if the form is optimal/suboptimal/contraindicated for user's variants
4. **DOSAGE ASSESSMENT**: Evaluate if THIS PRODUCT'S dosing is appropriate for user's genetic metabolism (fast/slow metabolizers)
5. **BIOMARKER ALIGNMENT**: Check if THIS PRODUCT'S ingredients address user's specific deficiencies at therapeutic levels
6. **CONDITION-SPECIFIC CONSIDERATIONS**: How do their medical conditions affect product suitability?

HYPER-SPECIFIC CONS & CONSIDERATIONS REQUIREMENTS:
- Reference ACTUAL ingredients in the product by name and dosage
- Explain WHY specific ingredient forms are problematic for user's genetics
- Mention specific missing nutrients the user needs based on their variants
- Reference actual dosages and whether they're too high/low for user's metabolism
- Be specific about ingredient interactions with user's medications/conditions
- Mention specific beneficial ingredients that are present and why they help

EXAMPLES OF HYPER-SPECIFIC FEEDBACK:
❌ GENERIC: "Does not provide methylated B vitamins"
✅ SPECIFIC: "Contains cyanocobalamin (500mcg) instead of methylcobalamin, which may be poorly utilized with your MTHFR C677T variant"

❌ GENERIC: "May interact with medications"  
✅ SPECIFIC: "The 400mg magnesium oxide may reduce absorption of your levothyroxine if taken within 4 hours"

❌ GENERIC: "Lacks vitamin D"
✅ SPECIFIC: "No vitamin D3 included despite your VDR Taq1 variant suggesting higher needs (current unknown status)"

SCORING MUST REFLECT ACTUAL COMPATIBILITY - BE HARSH ON MISMATCHES!`
            }
          ],
        }),
      });

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const completion = await openaiResponse.json();
      let aiResponse = completion.choices?.[0]?.message?.content;
      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Parse AI response
      let analysis;
      try {
        // First try direct JSON parsing
        analysis = JSON.parse(aiResponse);
      } catch (parseError) {
        console.error('Initial JSON parse failed, attempting to extract JSON from response...');
        console.error('Raw AI response:', aiResponse);
        
        // Try to extract JSON from markdown code blocks or other formatting
        const jsonMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
          try {
            analysis = JSON.parse(jsonMatch[1]);
            console.log('Successfully extracted JSON from code block');
          } catch (secondParseError) {
            console.error('Failed to parse extracted JSON:', jsonMatch[1]);
            // Create fallback response
            analysis = {
              productName: 'Unknown Product',
              brand: 'Unknown Brand',
              overallScore: 50,
              summary: 'Analysis failed due to parsing error. Please try again.',
              pros: ['Unable to analyze due to technical error'],
              cons: ['Analysis parsing failed - please retry'],
              warnings: ['This analysis is for educational purposes only and not medical advice. Consult healthcare providers before making supplement decisions.']
            };
          }
        } else {
          // Try to find JSON object in the response
          const jsonObjectMatch = aiResponse.match(/\{[\s\S]*\}/);
          if (jsonObjectMatch) {
            try {
              analysis = JSON.parse(jsonObjectMatch[0]);
              console.log('Successfully extracted JSON object from response');
            } catch (thirdParseError) {
              console.error('Failed to parse extracted JSON object:', jsonObjectMatch[0]);
              // Create fallback response
              analysis = {
                productName: 'Unknown Product',
                brand: 'Unknown Brand',
                overallScore: 50,
                summary: 'Analysis failed due to parsing error. Please try again.',
                pros: ['Unable to analyze due to technical error'],
                cons: ['Analysis parsing failed - please retry'],
                warnings: ['This analysis is for educational purposes only and not medical advice. Consult healthcare providers before making supplement decisions.']
              };
            }
          } else {
            // Create a fallback response if no JSON found
            console.error('No JSON found in AI response, creating fallback');
            analysis = {
              productName: 'Unknown Product',
              brand: 'Unknown Brand',
              overallScore: 50,
              summary: 'Analysis failed due to parsing error. Please try again.',
              pros: ['Unable to analyze due to technical error'],
              cons: ['Analysis parsing failed - please retry'],
              warnings: ['This analysis is for educational purposes only and not medical advice. Consult healthcare providers before making supplement decisions.']
            };
          }
        }
      }

      // Validate response structure
      const requiredFields = ['productName', 'overallScore', 'summary', 'pros', 'cons'];
      for (const field of requiredFields) {
        if (!(field in analysis)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Ensure arrays are properly formatted
      analysis.pros = Array.isArray(analysis.pros) ? analysis.pros : [];
      analysis.cons = Array.isArray(analysis.cons) ? analysis.cons : [];
      analysis.warnings = Array.isArray(analysis.warnings) ? analysis.warnings : [];

      // Save to product check history
      try {
        const { error: historyError } = await supabase
          .from('product_check_history')
          .insert({
            user_id: user.id,
            product_url: productUrl,
            product_name: analysis.productName,
            brand: analysis.brand,
            overall_score: analysis.overallScore,
            analysis_summary: analysis.summary,
            pros: analysis.pros,
            cons: analysis.cons,
            warnings: analysis.warnings,
            full_analysis: analysis
          });

        if (historyError) {
          console.error('Failed to save product check history:', historyError);
          // Don't fail the request, just log the error
        }
      } catch (historyError) {
        console.error('Error saving to history:', historyError);
        // Continue with the response even if history save fails
      }

      // 🔍 QUALITY MONITORING (Zero Risk - Never Breaks Functionality)
      try {
        const qualityJudgeUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/quality-judge`;
        fetch(qualityJudgeUrl, {
          method: 'POST',
          headers: {
            'Authorization': req.headers.get('Authorization') || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            function_name: 'check-product',
            user_data: {
              age: userProfile?.age,
              gender: userProfile?.gender,
              product_url: productUrl,
              has_allergies: userAllergies && userAllergies.length > 0,
              has_conditions: userConditions && userConditions.length > 0,
              has_biomarkers: userBiomarkers && userBiomarkers.length > 0,
              has_genetics: userSnps && userSnps.length > 0
            },
            ai_response: analysis
          })
        }).catch(() => {}); // Silent fail - never break functionality
      } catch (e) {
        // Quality monitoring failure never affects user experience
      }

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error: any) {
      console.error('AI analysis error:', error);
      return new Response(JSON.stringify({ 
        error: `Failed to analyze product: ${error.message}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

  } catch (error: any) {
    console.error('Product check error:', error);
    return new Response(JSON.stringify({ 
      error: `Server error: ${error.message}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 