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
              content: `You are an expert scientific research analyst and personalized medicine specialist. Your role is to analyze scientific research studies and provide CLEAR, EASY-TO-UNDERSTAND interpretations based on the user's actual genetic variants, biomarkers, and health profile.

CRITICAL REQUIREMENTS:
1. **NO HALLUCINATION**: Only reference genetic variants (SNPs) that are ACTUALLY in the user's data
2. **CLEAR EXPLANATIONS**: Write in simple, understandable language - avoid complex medical jargon
3. **ACTUAL DATA ONLY**: Only mention biomarker values that are actually provided
4. **PRACTICAL FOCUS**: Emphasize actionable recommendations and real-world applications

RESPONSE FORMAT - Return JSON with this exact structure:
{
  "titleExtracted": "study title if found",
  "authorsExtracted": "authors if found", 
  "journalExtracted": "journal name if found",
  "pmidExtracted": "PMID if found",
  "relevanceScore": number between 1-10,
  "personalizedSummary": "2-3 sentences explaining what this study means for the user specifically, mentioning their actual genetic variants or biomarkers if relevant",
  "personalizedExplanation": "Clear explanation of how this study relates to their specific health profile, using simple language",
  "keyFindings": ["main findings from the study with context for this user"],
  "actionableRecommendations": ["specific, practical recommendations with dosages/protocols when appropriate"],
  "limitations": ["important considerations or limitations specific to this user"]
}

PERSONALIZATION RULES:
- IF the user has genetic data: Look for SNPs that are actually relevant to the study topic and mention them specifically
- IF the user has biomarker data: Reference their actual lab values when discussing related parameters
- IF the user has limited data: Focus on demographics, symptoms, and general health context
- ALWAYS make it feel personal and relevant, even with limited data

GENETIC ANALYSIS GUIDELINES:
- Only mention SNPs that are ACTUALLY in their genetic profile
- Explain genetic variants in simple terms (e.g., "slower metabolizer" vs "reduced enzyme activity")
- Connect genetic variants to practical outcomes (e.g., "may need higher doses" or "increased risk of side effects")

BIOMARKER ANALYSIS GUIDELINES:
- Only reference lab values that are actually provided
- Compare their values to study ranges when relevant
- Explain what abnormal values mean in simple terms

SCORING CRITERIA (1-10):
- 1-3: Not relevant to user's health profile or goals
- 4-6: Somewhat relevant, general population insights
- 7-8: Relevant to user's specific health conditions or demographics  
- 9-10: Highly relevant to user's specific genetic variants, biomarkers, or health goals

LANGUAGE STYLE:
- Use "you" and "your" to make it personal
- Explain complex concepts in simple terms
- Focus on practical implications
- Be encouraging and actionable`
            },
                          {
                role: 'user',
                content: `PERSONALIZED RESEARCH ANALYSIS REQUEST

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
• Medical Conditions: ${healthProfile.conditions.length > 0 ? healthProfile.conditions.join(', ') : 'None reported'}
• Current Medications: ${healthProfile.medications.length > 0 ? healthProfile.medications.join(', ') : 'None reported'}

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
3. **Practical Application**: What specific actions should they take based on this research?
4. **Important Considerations**: What limitations or cautions apply to their specific situation?

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