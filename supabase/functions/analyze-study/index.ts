import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FIRECRAWL_API_KEY = 'fc-79599254e22f4e608cfe3102ed4b817e';

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
      supabase.from('user_biomarkers').select('*').eq('user_id', user.id),
      supabase.from('user_snps').select('*').eq('user_id', user.id),
      supabase.from('user_allergies').select('*').eq('user_id', user.id),
      supabase.from('user_conditions').select('*').eq('user_id', user.id),
      supabase.from('user_medications').select('*').eq('user_id', user.id)
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

    // Create comprehensive health profile for AI analysis (following your structure)
    const healthProfile = {
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
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    try {
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          temperature: 0.3,
          messages: [
            {
              role: 'system',
              content: `You are an expert scientific research analyst and personalized medicine specialist with deep expertise in pharmacogenomics, nutrigenomics, biomarkers, and clinical research interpretation.

Your role is to analyze scientific research studies and provide HIGHLY PERSONALIZED interpretations based on individual genetic variants, biomarker levels, and health profiles.

CRITICAL ANALYSIS REQUIREMENTS:
1. MANDATORY GENETIC ANALYSIS: You MUST identify and discuss specific genetic variants (SNPs) that relate to the study topic
2. MANDATORY BIOMARKER CORRELATION: You MUST reference actual lab values and biomarker levels when available
3. ULTRA-PERSONALIZED INSIGHTS: Every recommendation must be tied to specific genetic or biomarker data
4. MECHANISTIC EXPLANATIONS: Explain HOW their genetics influence the study outcomes
5. PRECISION RECOMMENDATIONS: Give dosage, timing, and implementation specifics based on their variants

Return your response as a JSON object with this exact structure:
{
  "titleExtracted": "study title if found",
  "authorsExtracted": "authors if found", 
  "journalExtracted": "journal name if found",
  "pmidExtracted": "PMID if found",
  "relevanceScore": number between 1-10,
  "personalizedSummary": "2-3 sentence summary specifically mentioning their genetic variants and/or biomarker levels",
  "keyFindings": ["main findings from the study with genetic/biomarker context"],
  "personalizedExplanation": "detailed explanation mentioning specific SNPs, genes, and biomarker levels",
  "actionableRecommendations": ["specific recommendations with dosages/protocols based on their genetics"],
  "limitations": ["genetic or biomarker-specific limitations for this user"]
}

MANDATORY PERSONALIZATION RULES:
- ALWAYS mention specific SNPs (rs numbers) when relevant to the study topic
- ALWAYS reference their actual biomarker values when discussing lab parameters
- For vitamin D studies: Look for VDR, CYP2R1, CYP24A1, GC (vitamin D binding protein) variants
- For methylation studies: Reference MTHFR, COMT, AHCY variants
- For inflammation studies: Look for IL-6, TNF-alpha, CRP genetic variants
- For oxidative stress: Reference SOD, GPX, CAT genetic variants
- For detox studies: Look for CYP450, GST, NAT variants
- For cardiovascular: Reference APOE, PCSK9, LDL-R variants
- For neurotransmitters: Look for COMT, MAO-A, SERT variants

GENETIC INTERPRETATION PRIORITIES:
1. Fast vs slow metabolizers based on CYP450 variants
2. High vs low activity enzymes (COMT, MAO, etc.)
3. Vitamin receptor sensitivity (VDR, etc.)
4. Methylation capacity (MTHFR status)
5. Inflammatory response patterns

BIOMARKER CORRELATION REQUIREMENTS:
- Compare study reference ranges to their actual values
- Explain if they're above/below optimal ranges mentioned in study
- Suggest monitoring frequencies based on their levels
- Recommend target ranges specific to their genetics

ULTRA-SPECIFIC RECOMMENDATIONS:
- Dosage modifications based on genetic variants
- Timing recommendations based on chronotype genes
- Form recommendations (methylated vs standard)
- Monitoring protocols based on their risk variants
- Lifestyle modifications based on genetic predispositions

SCORING CRITERIA (1-10):
- Genetic Specificity (50%): How many relevant SNPs are discussed
- Biomarker Integration (30%): Use of their actual lab values
- Actionable Precision (20%): Specificity of recommendations

CRITICAL: If genetic or biomarker data is provided, you MUST reference specific variants and values. Generic advice without mentioning their actual SNPs or lab values is unacceptable.`
            },
            {
              role: 'user',
              content: `ULTRA-PERSONALIZED RESEARCH ANALYSIS REQUEST

=== CRITICAL USER GENETIC PROFILE ===
TOTAL GENETIC VARIANTS: ${healthProfile.genetics.length}
${healthProfile.genetics.length > 0 ? 
  healthProfile.genetics.map(g => `• ${g.rsid} (${g.gene}): **${g.genotype}** ${g.comment ? '- ' + g.comment : ''}`).join('\n') :
  'No genetic data available - CANNOT provide personalized genetic insights'
}

=== CRITICAL USER BIOMARKER PROFILE ===
TOTAL BIOMARKERS: ${healthProfile.biomarkers.length}
${healthProfile.biomarkers.length > 0 ? 
  healthProfile.biomarkers.map((b: any) => `• **${b.displayName || b.name}**: ${b.value} ${b.unit} (Reference: ${b.referenceRange}) ${b.comment ? '- ' + b.comment : ''}`).join('\n') :
  'No laboratory data available - CANNOT provide biomarker-specific insights'
}

=== USER HEALTH CONTEXT ===
Demographics: ${healthProfile.basicInfo.age ? `${healthProfile.basicInfo.age} years old` : 'Age unknown'}, ${healthProfile.basicInfo.gender || 'Gender unknown'}
PRIMARY HEALTH GOALS: ${healthProfile.healthGoals.length > 0 ? healthProfile.healthGoals.join(', ') : 'Not specified'}
MEDICAL CONDITIONS: ${healthProfile.conditions.length > 0 ? healthProfile.conditions.join(', ') : 'None reported'}
CURRENT MEDICATIONS: ${healthProfile.medications.length > 0 ? healthProfile.medications.join(', ') : 'None reported'}

=== CURRENT SYMPTOM PROFILE ===
• Brain Fog: ${healthProfile.healthMetrics.brainFog || 'Not reported'}
• Sleep Quality: ${healthProfile.healthMetrics.sleepQuality || 'Not reported'}  
• Energy Levels: ${healthProfile.healthMetrics.energyLevels || 'Not reported'}
• Anxiety Level: ${healthProfile.healthMetrics.anxietyLevel || 'Not reported'}
• Joint Pain: ${healthProfile.healthMetrics.jointPain || 'Not reported'}
• Activity Level: ${healthProfile.basicInfo.activityLevel || 'Not reported'}

=== SCIENTIFIC STUDY TO ANALYZE ===
Source URL: ${studyUrl}

STUDY CONTENT:
${studyContent.substring(0, 12000)}

=== MANDATORY ANALYSIS REQUIREMENTS ===
1. **GENETIC SPECIFICITY**: You MUST identify and discuss specific SNPs (rs numbers) that relate to this study
2. **BIOMARKER CORRELATION**: You MUST reference their actual lab values when available
3. **MECHANISTIC INSIGHTS**: Explain HOW their genetic variants affect the study outcomes
4. **PRECISION DOSING**: Provide specific dosages/protocols based on their genetic variants
5. **RISK STRATIFICATION**: Identify genetic risk factors specific to this study's topic

=== ANALYSIS FOCUS AREAS ===
- Search for genetic variants related to the study's main topic (metabolism, receptors, enzymes)
- Compare their biomarker values to study population ranges
- Identify genetic variants that may increase or decrease study intervention effectiveness
- Provide genotype-specific recommendations for dosing, timing, monitoring
- Highlight any genetic contraindications or enhanced benefits

**CRITICAL**: Your analysis MUST reference specific genetic variants (rs numbers) and actual biomarker values. Generic advice is not acceptable for this ultra-personalized analysis.`
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