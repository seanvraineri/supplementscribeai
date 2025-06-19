import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Firecrawl API key will be loaded from environment variables

Deno.serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Log incoming request details for debugging
    console.log('Analyze study request received');
    console.log('Authorization header present:', !!req.headers.get('Authorization'));
    console.log('Content-Type:', req.headers.get('Content-Type'));
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    console.log('Supabase client created, attempting to get user...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('User auth error details:', userError);
      return new Response(JSON.stringify({ 
        error: 'Authentication failed', 
        details: userError.message,
        code: userError.code || 'unknown'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    if (!user) {
      console.error('No user found after auth check');
      return new Response(JSON.stringify({ error: 'User not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    console.log('User authenticated successfully:', user.id);

    // Parse request body
    const { studyUrl } = await req.json();

    if (!studyUrl) {
      return new Response(JSON.stringify({ error: 'Study URL is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Validate URL format
    try {
      new URL(studyUrl);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL format' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Get API keys from environment variables
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      throw new Error('Firecrawl API key not configured');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Scrape study content using Firecrawl (following your exact pattern)
    console.log('Scraping study page:', studyUrl);
    let studyContent;
    try {
      const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: studyUrl,
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
      studyContent = firecrawlData.data?.content;

      if (!studyContent) {
        throw new Error('Could not extract study content from page');
      }
    } catch (error: any) {
      console.error('Error scraping study page:', error);
      return new Response(JSON.stringify({ 
        error: `Failed to scrape study page: ${error.message}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Fetch comprehensive user health data (following your pattern exactly)
    console.log('Fetching user health data for:', user.id);
    const [
      { data: profile, error: profileError },
      { data: biomarkers, error: biomarkersError },
      { data: snps, error: snpsError },
      { data: allergies, error: allergiesError },
      { data: conditions, error: conditionsError },
      { data: medications, error: medicationsError }
    ] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', user.id).single(),
      supabase.from('user_biomarkers').select('*').eq('user_id', user.id).limit(500),
      supabase.from('user_snps').select('*').eq('user_id', user.id).limit(1000),
              supabase.from('user_allergies').select('*').eq('user_id', user.id).limit(50),
              supabase.from('user_conditions').select('*').eq('user_id', user.id).limit(30),
        supabase.from('user_medications').select('*').eq('user_id', user.id).limit(50)
    ]);

    // Log data counts for debugging
    console.log('Data fetched counts:', {
      profile: profile ? 'found' : 'none',
      biomarkers: biomarkers?.length || 0,
      snps: snps?.length || 0,
      allergies: allergies?.length || 0,
      conditions: conditions?.length || 0,
      medications: medications?.length || 0
    });

    // Log first few biomarkers for debugging  
    if (biomarkers && biomarkers.length > 0) {
      console.log('Sample biomarkers:', biomarkers.slice(0, 5).map(b => ({ 
        name: b.marker_name, 
        value: b.value, 
        unit: b.unit 
      })));
    }

    // Fetch supported SNPs data separately for manual joining
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

    // Manually join the SNP data
    const enrichedSnps = snps?.map(userSnp => ({
      ...userSnp,
      supported_snps: snpLookup.get(userSnp.supported_snp_id) || null
    })) || [];

    // Log first few enriched SNPs for debugging (after creation)
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

    // Handle potential data errors gracefully (following your pattern)
    const userProfile = profile || {};
    const userBiomarkers = biomarkers || [];
    const userSnps = enrichedSnps || []; // Use enriched SNPs with gene data
    const userAllergies = allergies || [];
    const userConditions = conditions || [];
    const userMedications = medications || [];

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
       if (profile?.energy_levels === 'yes') lifestyleIssues.push('Often feels tired or low energy (needs energy-boosting nutrients like B-vitamins and iron)');
       if (profile?.effort_fatigue === 'yes') lifestyleIssues.push('Physical activity feels more difficult than it should (may benefit from performance-enhancing supplements like CoQ10)');
       if (profile?.digestive_issues === 'yes') lifestyleIssues.push('Experiences digestive discomfort regularly (needs gut-healing nutrients and probiotics)');
       if (profile?.stress_levels === 'yes') lifestyleIssues.push('Feels stressed or anxious frequently (needs stress-fighting nutrients like magnesium)');
       if (profile?.mood_changes === 'yes') lifestyleIssues.push('Experiences mood swings or irritability (needs mood-stabilizing nutrients like omega-3s)');
       if (profile?.sugar_cravings === 'yes') lifestyleIssues.push('Craves sugar or processed foods (needs blood sugar stabilizing nutrients)');
       if (profile?.skin_issues === 'yes') lifestyleIssues.push('Has skin problems like acne, dryness, or sensitivity (needs skin-supporting vitamins like zinc and vitamin E)');
       if (profile?.joint_pain === 'yes') lifestyleIssues.push('Experiences joint pain or stiffness (needs anti-inflammatory supplements like turmeric)');
       if (profile?.brain_fog === 'yes') lifestyleIssues.push('Experiences brain fog or difficulty concentrating (needs brain-boosting supplements for mental clarity)');
       if (profile?.sleep_quality === 'yes') lifestyleIssues.push('Has trouble falling asleep or staying asleep (needs sleep-promoting supplements like melatonin)');
       if (profile?.workout_recovery === 'yes') lifestyleIssues.push('Takes longer to recover from workouts (needs recovery-enhancing supplements)');
       if (profile?.food_sensitivities === 'yes') lifestyleIssues.push('Certain foods make them feel unwell (needs digestive enzymes and gut repair nutrients)');
       if (profile?.weight_management === 'yes') lifestyleIssues.push('Difficult to maintain a healthy weight (needs metabolism-supporting supplements)');
       
       // Also include positive lifestyle factors (No answers)
       const lifestyleStrengths = [];
       if (profile?.caffeine_effect === 'no') lifestyleStrengths.push('Does not rely on caffeine to get through the day');
       if (profile?.immune_system === 'no') lifestyleStrengths.push('Does not get sick more often than desired (good immune function)');
       
       if (lifestyleIssues.length > 0) {
         parts.push(`**LIFESTYLE CONCERNS**: ${lifestyleIssues.join(' • ')}`);
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

    // Create comprehensive health profile for AI analysis (following your structure)
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
      })),
      allergies: userAllergies.map(a => a.ingredient_name),
      conditions: userConditions.map(c => c.condition_name),
      medications: userMedications.map(m => m.medication_name)
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
          temperature: 0.3,
          messages: [
            {
              role: 'system',
              content: `You are a world-class personalized research consultant who transforms scientific studies into PREMIUM HEALTH CONSULTATIONS worth $5,000+. Your mission: "What does this study mean for ME personally?"

🎯 CORE MISSION: Create a consultation so personalized and insightful it feels like a precision health analysis specifically crafted for this individual user.

📋 RESPONSE FORMAT - Return JSON with this EXACT structure (CRITICAL - do not add fields):
{
  "titleExtracted": "study title if found",
  "authorsExtracted": "authors if found", 
  "journalExtracted": "journal name if found",
  "pmidExtracted": "PMID if found",
  "relevanceScore": number between 1-10,
  "personalizedSummary": "Compelling 2-3 sentences using their first name and specific health details that makes them feel this analysis was created just for them",
  "personalizedExplanation": "In-depth explanation connecting study findings directly to their biomarkers, genetics, symptoms, and goals with specific actionable insights",
  "keyFindings": ["In-depth study findings with detailed explanations of statistical significance, effect sizes, mechanisms of action, and specific implications for your health profile. Each finding should be comprehensive and educational."],
  "actionableRecommendations": ["Specific prioritized actions YOU should take based on this research and your unique profile, with expected outcomes and timeframes"],
  "limitations": ["Important considerations specific to YOUR situation, including any safety concerns based on your medications and conditions"]
}

🔥 HYPER-PERSONALIZATION REQUIREMENTS:

**OPENING IMPACT**: Start personalizedSummary with their first name and most relevant health concern
Example: "Sarah, given your concerns about brain fog and your MTHFR variant, this study on methylfolate is particularly significant for you because..."

**ENHANCED KEY FINDINGS REQUIREMENTS**:
Each key finding must include:
- The specific study result with statistical data (p-values, effect sizes, confidence intervals)
- The biological mechanism explaining HOW this works
- Personal relevance to their specific health profile
- Clinical significance vs statistical significance
- Comparison to other research in the field
- Specific implications for their symptoms/conditions
Example: "The study demonstrated a statistically significant 23% improvement in cognitive performance (p=0.003, 95% CI: 15-31%). This works by increasing phosphocreatine in brain tissue, enhancing cellular energy production. For someone like you experiencing brain fog and fatigue, this mechanism directly addresses the cellular energy deficit that may be contributing to your symptoms. The effect size (Cohen's d = 0.7) indicates a clinically meaningful improvement that you would likely notice in daily activities."

**SCIENTIFIC DEPTH WITH ACCESSIBILITY**: 
- Include specific statistics when available (p-values, effect sizes, confidence intervals)
- Translate complex terms: "The study showed a statistically significant 23% improvement (p<0.05) in cognitive function, which for someone experiencing brain fog like you means..."
- Reference study methodology: "This randomized controlled trial with 200 participants - the gold standard of research - found..."

**BIOMARKER INTEGRATION**: 
If they have biomarker data, be SPECIFIC:
- "Your vitamin D level of 25 ng/mL puts you in the deficient category that this study focused on"
- "The participants with testosterone levels similar to yours (300-400 ng/dL) showed the most dramatic improvements"
- "Your elevated inflammatory markers suggest you'd be in the high-response group"

**GENETIC INTEGRATION**:
If they have genetic data, connect it directly:
- "Your MTHFR C677T variant means you have reduced folate metabolism, making this folate study especially relevant"
- "People with your COMT Val158Met genotype typically respond better to the dosages used in this study"

**SYMPTOM-STUDY CONNECTION**:
Connect their reported symptoms to study outcomes:
- "Since you report experiencing fatigue and brain fog, the 40% improvement in cognitive clarity seen in this study could translate to significant daily improvements for you"
- "Your sleep quality issues align perfectly with this study's focus, and participants with similar sleep scores saw remarkable improvements"

**DEMOGRAPHIC RELEVANCE**:
- "As a 32-year-old active male, you're similar to 68% of the study participants who saw the best results"
- "The study included people in your exact age range and activity level, making these findings highly applicable to your situation"

**CONFIDENCE & STATISTICAL CONTEXT**:
- "The large sample size (n=500) and 12-month duration make these results highly reliable for someone with your profile"
- "The effect size was large (Cohen's d = 0.8), suggesting clinically meaningful benefits for people like you"

**ACTIONABLE PRIORITIZATION**:
Rank recommendations by:
1. Safety for their specific conditions/medications
2. Likelihood of benefit based on their profile  
3. Ease of implementation
4. Expected timeline for results

**PERSONAL HEALTH STORY**:
Create a compelling narrative: "Your health journey with [primary concern] combined with [specific biomarkers/genetics] puts you in a unique position to benefit from this research because..."

**RISK-BENEFIT PERSONALIZATION**:
- Consider their medications: "Since you're taking [medication], the study's findings suggest this intervention is both safe and synergistic"
- Address their conditions: "Given your history of [condition], this intervention appears not only safe but potentially therapeutic"
- Reference their goals: "This aligns perfectly with your goal of [specific goal] and could accelerate your progress"

**IMPLEMENTATION ROADMAP**:
- "Based on your profile, start with [specific dosage] for [timeframe]"
- "Monitor your [specific symptom/biomarker] to track progress"
- "You should expect to see improvements in [specific areas] within [realistic timeframe]"

**WOW FACTOR ELEMENTS**:
- Surprising connections: "Interestingly, this study also found benefits for [unexpected area] which could help with your [related concern]"
- Predictive insights: "Based on your profile characteristics, you have a high likelihood of responding well to this intervention"
- Comparison context: "You share key characteristics with the participants who responded best in this study"

🎯 ENHANCED LANGUAGE REQUIREMENTS:
- Use their first name throughout (extract from full_name field)
- Reference specific symptoms they've reported with empathy
- Connect to their stated health goals with enthusiasm
- Be encouraging but scientifically rigorous
- Focus on actionable insights they can implement immediately
- Make them feel like this analysis was created specifically for them by a world-class expert
- Balance scientific credibility with accessibility
- Use confident, authoritative language that inspires trust

🚨 CRITICAL SAFETY & PERSONALIZATION RULES:
- NEVER mention genetic variants or biomarkers not in their actual data
- ALWAYS consider their medical conditions and medications in recommendations
- Reference their primary health concern prominently if relevant to the study  
- Make recommendations specific to their reported symptoms and goals
- Flag any potential interactions with their current medications
- Never recommend anything they're allergic to
- If study isn't highly relevant, be honest but find applicable insights
- Ensure all recommendations are safe for their specific health profile
- Only reference data that's actually in their profile

Remember: If they have limited data, focus on demographics, symptoms, and health goals. Make every sentence feel personally crafted for them by a premium health consultant.`
            },
                          {
                role: 'user',
                content: `PERSONALIZED RESEARCH ANALYSIS REQUEST

=== YOUR PERSONAL DETAILS ===
• Name: ${userProfile.full_name || 'User'}
• First Name: ${userProfile.full_name?.split(' ')[0] || 'User'}

=== YOUR ONBOARDING HEALTH ASSESSMENT ===
${healthProfile.onboardingContext || 'No onboarding data available'}

=== YOUR GENETIC PROFILE ===
${healthProfile.genetics.length > 0 ? 
  `You have ${healthProfile.genetics.length} genetic variants in your profile:\n` +
  healthProfile.genetics.map(g => `• ${g.rsid} (${g.gene}): ${g.genotype} ${g.comment ? '- ' + g.comment : ''}`).join('\n') :
  'No genetic testing data available in your profile.'
}

=== YOUR BIOMARKER PROFILE ===
${healthProfile.biomarkers.length > 0 ? 
  `You have ${healthProfile.biomarkers.length} lab values in your profile:\n` +
  healthProfile.biomarkers.map((b: any) => `• ${b.displayName || b.name}: ${b.value} ${b.unit} (Reference: ${b.referenceRange || 'Not specified'}) ${b.comment ? '- ' + b.comment : ''}`).join('\n') :
  'No laboratory testing data available in your profile.'
}

=== YOUR HEALTH CONTEXT ===
• Age: ${healthProfile.basicInfo.age || 'Not specified'}
• Gender: ${healthProfile.basicInfo.gender || 'Not specified'}
• Activity Level: ${healthProfile.basicInfo.activityLevel || 'Not specified'}
• Health Goals: ${healthProfile.healthGoals.length > 0 ? healthProfile.healthGoals.join(', ') : 'Not specified'}

=== 🚨 CRITICAL MEDICAL INFORMATION ===
• Medical Conditions: ${healthProfile.conditions.length > 0 ? healthProfile.conditions.join(', ') : 'None reported'}
• Current Medications: ${healthProfile.medications.length > 0 ? healthProfile.medications.join(', ') : 'None reported'}
• Known Allergies: ${healthProfile.allergies.length > 0 ? healthProfile.allergies.join(', ') : 'None reported'}

=== YOUR CURRENT SYMPTOMS ===
• Brain Fog: ${healthProfile.healthMetrics.brainFog || 'Not reported'}
• Sleep Quality: ${healthProfile.healthMetrics.sleepQuality || 'Not reported'}  
• Energy Levels: ${healthProfile.healthMetrics.energyLevels || 'Not reported'}
• Anxiety Level: ${healthProfile.healthMetrics.anxietyLevel || 'Not reported'}
• Joint Pain: ${healthProfile.healthMetrics.jointPain || 'Not reported'}

=== STUDY TO ANALYZE ===
URL: ${studyUrl}

STUDY CONTENT:
${studyContent.substring(0, 12000)}

=== ANALYSIS INSTRUCTIONS ===
Please analyze this study specifically for this user. Focus on:

1. **Relevance**: How relevant is this study to their specific health profile, genetics, and biomarkers?
2. **Personal Context**: What do the study findings mean for someone with their specific genetic variants and lab values?
3. **Medical Safety Assessment**: How do their medical conditions and medications affect the study's applicability?
4. **Practical Application**: What specific actions should they take based on this research?
5. **Important Considerations**: What limitations or cautions apply to their specific situation?

🚨 **CRITICAL SAFETY REQUIREMENTS**:
- Always consider their medical conditions when interpreting study results
- Flag any potential interactions with their current medications
- Never recommend supplements/interventions they're allergic to
- Adjust recommendations based on their specific health conditions

Remember: Only reference genetic variants and biomarker values that are actually in their profile. If they have limited data, focus on their demographics, symptoms, and health goals instead.`
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

      // Clean up AI response - remove markdown code blocks if present
      aiResponse = aiResponse.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();

      // Parse AI response
      let analysis;
      try {
        analysis = JSON.parse(aiResponse);
      } catch (parseError) {
        console.error('AI response parsing error:', parseError);
        console.error('Raw AI response:', aiResponse);
        throw new Error('Failed to parse AI analysis');
      }

      // Validate and fix response structure with defaults
      console.log('Raw AI analysis fields:', Object.keys(analysis));
      
      // Provide defaults for missing fields instead of throwing errors
      if (!analysis.relevanceScore) {
        console.warn('Missing relevanceScore, defaulting to 5');
        analysis.relevanceScore = 5;
      }
      
      if (!analysis.personalizedSummary) {
        console.warn('Missing personalizedSummary, using default');
        analysis.personalizedSummary = 'Analysis completed - see detailed explanation below.';
      }
      
      if (!analysis.personalizedExplanation) {
        console.warn('Missing personalizedExplanation, using default');
        analysis.personalizedExplanation = 'Detailed analysis of this study in relation to your health profile.';
      }

      // Ensure arrays are properly formatted with defaults
      analysis.keyFindings = Array.isArray(analysis.keyFindings) ? analysis.keyFindings : ['Key findings from the study'];
      analysis.actionableRecommendations = Array.isArray(analysis.actionableRecommendations) ? analysis.actionableRecommendations : ['Recommendations based on study findings'];
      analysis.limitations = Array.isArray(analysis.limitations) ? analysis.limitations : [];
      
      console.log('Validated analysis structure:', {
        hasTitle: !!analysis.titleExtracted,
        hasAuthors: !!analysis.authorsExtracted,
        relevanceScore: analysis.relevanceScore,
        summaryLength: analysis.personalizedSummary?.length || 0,
        findingsCount: analysis.keyFindings?.length || 0,
        recommendationsCount: analysis.actionableRecommendations?.length || 0
      });

      // Extract PMID from URL if available
      const pmidMatch = studyUrl.match(/pmid[\/=](\d+)/i) || studyUrl.match(/\/(\d+)\/?$/);
      const pmid = analysis.pmidExtracted || (pmidMatch ? pmidMatch[1] : null);

      // Validate and clean data before database insertion
      const cleanedAnalysis = {
        titleExtracted: analysis.titleExtracted || 'Unknown Title',
        authorsExtracted: analysis.authorsExtracted || '',
        journalExtracted: analysis.journalExtracted || '',
        pmidExtracted: pmid,
        relevanceScore: Math.max(1, Math.min(10, Math.floor(Number(analysis.relevanceScore) || 5))), // Ensure integer 1-10
        personalizedSummary: analysis.personalizedSummary || 'No summary available',
        keyFindings: Array.isArray(analysis.keyFindings) ? analysis.keyFindings : [],
        personalizedExplanation: analysis.personalizedExplanation || 'No explanation available',
        actionableRecommendations: Array.isArray(analysis.actionableRecommendations) ? analysis.actionableRecommendations : [],
        limitations: Array.isArray(analysis.limitations) ? analysis.limitations : []
      };

      console.log('Cleaned analysis data:', {
        title: cleanedAnalysis.titleExtracted,
        relevanceScore: cleanedAnalysis.relevanceScore,
        keyFindingsCount: cleanedAnalysis.keyFindings.length,
        recommendationsCount: cleanedAnalysis.actionableRecommendations.length
      });

      // Save to user studies history
      try {
        const insertData = {
          user_id: user.id,
          study_url: studyUrl,
          study_title: cleanedAnalysis.titleExtracted,
          study_authors: cleanedAnalysis.authorsExtracted,
          journal_name: cleanedAnalysis.journalExtracted,
          pmid: pmid,
          relevance_score: cleanedAnalysis.relevanceScore,
          personalized_summary: cleanedAnalysis.personalizedSummary,
          key_findings: cleanedAnalysis.keyFindings,
          personalized_explanation: cleanedAnalysis.personalizedExplanation,
          actionable_recommendations: cleanedAnalysis.actionableRecommendations,
          limitations: cleanedAnalysis.limitations,
          full_analysis: analysis // Keep original analysis as JSON
        };

        console.log('Attempting to insert study data:', {
          user_id: insertData.user_id,
          study_url: insertData.study_url,
          relevance_score: insertData.relevance_score,
          title_length: insertData.study_title?.length || 0
        });

        const { data: savedStudy, error: historyError } = await supabase
          .from('user_studies')
          .insert(insertData)
          .select()
          .single();

        if (historyError) {
          console.error('Failed to save study analysis:', historyError);
          console.error('Insert data that failed:', JSON.stringify(insertData, null, 2));
          // Don't throw error, just log it - we can still return the analysis
        } else {
          console.log('Successfully saved study analysis:', savedStudy?.id);
        }

        // ALSO persist long-form analysis for chat memory (plaintext)
        try {
          const plainTextAnalysis = `${cleanedAnalysis.personalizedSummary}\n\n${cleanedAnalysis.personalizedExplanation}\n\nRecommendations:\n${cleanedAnalysis.actionableRecommendations.join('\n')}`;
          
          await supabase.from('user_full_analysis').insert({
            user_id: user.id,
            plaintext: plainTextAnalysis.slice(0, 15000) // safety limit
          });
          
          console.log('Successfully saved full analysis for chat memory');
        } catch(memoryError) {
          console.error('Error saving full analysis for chat memory:', memoryError);
        }

      } catch (historyError) {
        console.error('Error saving to history:', historyError);
        // Don't throw error, just log it - we can still return the analysis
      }

      // Return the cleaned analysis to the frontend
      return new Response(JSON.stringify(cleanedAnalysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error: any) {
      console.error('AI analysis error:', error);
      return new Response(JSON.stringify({ 
        error: `Failed to analyze study: ${error.message}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

  } catch (error: any) {
    console.error('Study analysis error:', error);
    return new Response(JSON.stringify({ 
      error: `Server error: ${error.message}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 