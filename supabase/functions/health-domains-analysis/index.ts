import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { checkRateLimit, getRateLimitHeaders } from '../rate-limiter/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🔬 Starting AI-powered health domains analysis...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    console.log('✅ User authenticated:', user.id);

    // 🚧 RATE LIMITING: 5 health domain analyses per hour per user
    const rateLimit = checkRateLimit(`health-domains-analysis:${user.id}`, 5, 60);
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded. Please wait before generating another health domains analysis.'
      }), {
        status: 429,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          ...getRateLimitHeaders(rateLimit.remainingRequests, rateLimit.resetTime),
        },
      });
    }

    // 🔍 CHECK FOR EXISTING RECENT ANALYSIS (within last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existingAnalysis } = await supabaseClient
      .from('user_health_domains_analysis')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: false })
      .limit(1);

    if (existingAnalysis && existingAnalysis.length > 0) {
      console.log('📋 Returning existing recent health domains analysis');
      return new Response(JSON.stringify(existingAnalysis[0].analysis_data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 🔍 FETCH COMPREHENSIVE USER DATA (following generate-plan pattern exactly)
    console.log('📋 Fetching comprehensive user health data...');
    const [
      { data: profile, error: profileError },
      { data: allergies, error: allergiesError },
      { data: conditions, error: conditionsError },
      { data: medications, error: medicationsError },
      { data: biomarkers, error: biomarkersError },
      { data: rawSnps, error: snpsError },
      { data: supplementPlan, error: planError },
      { data: symptomPatterns, error: patternsError }
    ] = await Promise.all([
      supabaseClient.from('user_profiles').select(`
        full_name, age, gender, weight_lbs, height_total_inches, health_goals, activity_level, sleep_hours,
        primary_health_concern, known_biomarkers, known_genetic_variants, alcohol_intake,
        energy_levels, effort_fatigue, caffeine_effect, digestive_issues, stress_levels, 
        sleep_quality, mood_changes, brain_fog, sugar_cravings, skin_issues, joint_pain,
        immune_system, workout_recovery, food_sensitivities, weight_management, 
        medication_history, anxiety_level, stress_resilience, bloating
      `).eq('id', user.id).single(),
      supabaseClient.from('user_allergies').select('ingredient_name').eq('user_id', user.id),
      supabaseClient.from('user_conditions').select('condition_name').eq('user_id', user.id),
      supabaseClient.from('user_medications').select('medication_name').eq('user_id', user.id),
      supabaseClient.from('user_biomarkers').select('*').eq('user_id', user.id).limit(500),
      supabaseClient.from('user_snps').select('*').eq('user_id', user.id).limit(1000),
      supabaseClient.from('supplement_plans').select('plan_details').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
      supabaseClient.from('user_symptom_patterns').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
    ]);

    if (profileError || !profile) {
      console.error('❌ Profile error:', profileError);
      return new Response(JSON.stringify({ error: 'Profile not found. Please complete onboarding first.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    console.log('📊 Data fetched successfully');

    // 🧬 ENRICH SNP DATA (following generate-plan pattern)
    let enrichedSnps: any[] = [];
    if (rawSnps && rawSnps.length > 0) {
      const snpIds = [...new Set(rawSnps.map((snp: any) => snp.supported_snp_id).filter(Boolean))];
      if (snpIds.length > 0) {
        const { data: supportedSnps } = await supabaseClient
          .from('supported_snps')
          .select('id, rsid, gene')
          .in('id', snpIds);

        enrichedSnps = rawSnps.map((userSnp: any) => ({
          ...userSnp,
          supported_snps: supportedSnps?.find((s: any) => s.id === userSnp.supported_snp_id)
        })).filter((snp: any) => snp.supported_snps);
      }
    }

    // 🤖 GENERATE AI-POWERED HEALTH DOMAINS ANALYSIS
    console.log('🤖 Generating AI-powered health domains analysis with o3...');
    
    const analysisData = await generateAIHealthDomainsAnalysis({
      profile: profile || {},
      allergies: allergies || [],
      conditions: conditions || [],
      medications: medications || [],
      biomarkers: biomarkers || [],
      snps: enrichedSnps || [],
      supplementPlan: supplementPlan?.[0]?.plan_details || null,
      symptomPatterns: symptomPatterns || []
    });

    // 💾 STORE ANALYSIS RESULTS
    console.log('💾 Storing health domains analysis results...');
    
    // First, ensure the table exists (in case migration didn't run)
    try {
      await supabaseClient.rpc('exec', {
        query: `
          CREATE TABLE IF NOT EXISTS public.user_health_domains_analysis (
              id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
              user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
              analysis_data jsonb NOT NULL,
              created_at timestamp with time zone DEFAULT now() NOT NULL,
              updated_at timestamp with time zone DEFAULT now() NOT NULL
          );
          
          -- Create indexes if they don't exist
          CREATE INDEX IF NOT EXISTS idx_user_health_domains_analysis_user_id 
          ON public.user_health_domains_analysis(user_id);
          
          CREATE INDEX IF NOT EXISTS idx_user_health_domains_analysis_created_at 
          ON public.user_health_domains_analysis(user_id, created_at DESC);
          
          -- Enable RLS if not already enabled
          ALTER TABLE public.user_health_domains_analysis ENABLE ROW LEVEL SECURITY;
          
          -- Create policy if it doesn't exist
          DO $$ 
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE tablename = 'user_health_domains_analysis' 
              AND policyname = 'user_health_domains_analysis_policy'
            ) THEN
              CREATE POLICY "user_health_domains_analysis_policy" ON public.user_health_domains_analysis
              FOR ALL
              USING (auth.uid() = user_id) 
              WITH CHECK (auth.uid() = user_id);
            END IF;
          END $$;
          
          -- Grant permissions
          GRANT ALL ON public.user_health_domains_analysis TO authenticated;
        `
      });
    } catch (tableError) {
      console.log('Table creation check completed (may already exist):', tableError);
    }
    
    const { data: storedAnalysis, error: storeError } = await supabaseClient
      .from('user_health_domains_analysis')
      .insert({
        user_id: user.id,
        analysis_data: analysisData
      })
      .select()
      .single();

    if (storeError) {
      console.error('❌ Failed to store analysis:', storeError);
      // Return the analysis even if storage fails
      return new Response(JSON.stringify(analysisData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Health domains analysis completed and stored successfully');

    return new Response(JSON.stringify(analysisData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('💥 Health domains analysis error:', error);
    return new Response(JSON.stringify({ 
      error: `Server error: ${error.message}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function generateAIHealthDomainsAnalysis(userData: any) {
  const { profile, allergies, conditions, medications, biomarkers, snps, supplementPlan, symptomPatterns } = userData;
  
  // 🧬 EXTRACT USER CONTEXT FOR HYPER-PERSONALIZATION
  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const age = profile?.age || 30;
  const gender = profile?.gender || 'not specified';
  const weight = profile?.weight_lbs;
  const height = profile?.height_total_inches;
  const bmi = weight && height ? (weight / Math.pow(height / 12, 2) * 703).toFixed(1) : null;
  const goals = profile?.health_goals || [];
  const primaryConcern = profile?.primary_health_concern || '';

  // 🔬 BUILD COMPREHENSIVE HEALTH CONTEXT
  let healthContext = `=== COMPREHENSIVE HEALTH PROFILE FOR ${firstName.toUpperCase()} ===\n\n`;
  
  // Personal Details
  healthContext += `🧑 PERSONAL PROFILE:\n`;
  healthContext += `• Name: ${firstName}\n`;
  healthContext += `• Age: ${age} years old\n`;
  healthContext += `• Gender: ${gender}\n`;
  healthContext += `• BMI: ${bmi || 'Not available'}\n`;
  healthContext += `• Primary Health Concern: "${primaryConcern}"\n`;
  healthContext += `• Health Goals: ${goals.join(', ') || 'General wellness'}\n\n`;

  // Lifestyle Assessment (16 questions)
  healthContext += `🎯 LIFESTYLE ASSESSMENT RESPONSES:\n`;
  const lifestyleQuestions = [
    { key: 'energy_levels', question: 'Often feels tired or low energy', response: profile?.energy_levels },
    { key: 'effort_fatigue', question: 'Physical activity feels more difficult than it should', response: profile?.effort_fatigue },
    { key: 'caffeine_effect', question: 'Relies on caffeine to get through the day', response: profile?.caffeine_effect },
    { key: 'digestive_issues', question: 'Experiences digestive discomfort regularly', response: profile?.digestive_issues },
    { key: 'stress_levels', question: 'Feels stressed or anxious frequently', response: profile?.stress_levels },
    { key: 'sleep_quality', question: 'Has trouble falling asleep or staying asleep', response: profile?.sleep_quality },
    { key: 'mood_changes', question: 'Experiences mood swings or emotional instability', response: profile?.mood_changes },
    { key: 'brain_fog', question: 'Has difficulty concentrating or mental clarity issues', response: profile?.brain_fog },
    { key: 'sugar_cravings', question: 'Craves sugary or processed foods regularly', response: profile?.sugar_cravings },
    { key: 'skin_issues', question: 'Has ongoing skin problems or breakouts', response: profile?.skin_issues },
    { key: 'joint_pain', question: 'Experiences joint pain or stiffness', response: profile?.joint_pain },
    { key: 'immune_system', question: 'Gets sick frequently or has trouble fighting off illness', response: profile?.immune_system },
    { key: 'workout_recovery', question: 'Takes longer than expected to recover from exercise', response: profile?.workout_recovery },
    { key: 'food_sensitivities', question: 'Suspects certain foods cause negative reactions', response: profile?.food_sensitivities },
    { key: 'weight_management', question: 'Struggles with maintaining or losing weight', response: profile?.weight_management },
    { key: 'medication_history', question: 'Currently takes or has history with ADHD/anxiety medications', response: profile?.medication_history }
  ];

  const positiveResponses = lifestyleQuestions.filter(q => q.response === 'yes');
  const totalIssues = positiveResponses.length;

  healthContext += `Total Issues Identified: ${totalIssues}/16\n`;
  positiveResponses.forEach(q => {
    healthContext += `• ✅ YES: ${q.question}\n`;
  });
  healthContext += `\n`;

  // Medical Information
  if (conditions.length > 0) {
    healthContext += `🏥 MEDICAL CONDITIONS:\n`;
    conditions.forEach((c: any) => healthContext += `• ${c.condition_name}\n`);
    healthContext += `\n`;
  }

  if (medications.length > 0) {
    healthContext += `💊 CURRENT MEDICATIONS:\n`;
    medications.forEach((m: any) => healthContext += `• ${m.medication_name}\n`);
    healthContext += `\n`;
  }

  if (allergies.length > 0) {
    healthContext += `⚠️ ALLERGIES & SENSITIVITIES:\n`;
    allergies.forEach((a: any) => healthContext += `• ${a.ingredient_name}\n`);
    healthContext += `\n`;
  }

  // AI-Detected Symptom Patterns (CRITICAL for consistency)
  if (symptomPatterns && symptomPatterns.length > 0) {
    healthContext += `🧬 AI-DETECTED ROOT CAUSE PATTERNS (${symptomPatterns.length} patterns):\n`;
    symptomPatterns.forEach((pattern: any) => {
      const symptoms = Array.isArray(pattern.symptoms_involved) ? pattern.symptoms_involved.join(' + ') : pattern.symptoms_involved;
      const recommendations = Array.isArray(pattern.recommendations) ? pattern.recommendations.join(', ') : pattern.recommendations;
      healthContext += `• ${pattern.pattern_name} (${pattern.confidence_score}% confidence)\n`;
      healthContext += `  └─ Symptoms: ${symptoms}\n`;
      healthContext += `  └─ Root Cause: ${pattern.explanation}\n`;
      healthContext += `  └─ Recommendations: ${recommendations}\n`;
    });
    healthContext += `\n`;
  }

  // Biomarker Data
  if (biomarkers.length > 0) {
    healthContext += `🔬 LABORATORY BIOMARKERS (${biomarkers.length} markers):\n`;
    biomarkers.slice(0, 20).forEach((b: any) => {
      healthContext += `• ${b.marker_name}: ${b.value} ${b.unit || ''} (Ref: ${b.reference_range || 'N/A'})\n`;
    });
    if (biomarkers.length > 20) {
      healthContext += `... and ${biomarkers.length - 20} more biomarkers\n`;
    }
    healthContext += `\n`;
  }

  // Genetic Data
  if (snps.length > 0) {
    healthContext += `🧬 GENETIC VARIANTS (${snps.length} SNPs):\n`;
    snps.slice(0, 15).forEach((snp: any) => {
      const rsid = snp.supported_snps?.rsid || snp.snp_id || 'Unknown';
      const gene = snp.supported_snps?.gene || snp.gene_name || 'Unknown';
      healthContext += `• ${rsid} (${gene}): ${snp.genotype}\n`;
    });
    if (snps.length > 15) {
      healthContext += `... and ${snps.length - 15} more genetic variants\n`;
    }
    healthContext += `\n`;
  }

  // Current Supplement Plan Context
  if (supplementPlan) {
    healthContext += `💊 CURRENT SUPPLEMENT PROTOCOL:\n`;
    if (supplementPlan.recommendations && supplementPlan.recommendations.length > 0) {
      supplementPlan.recommendations.forEach((supp: any, idx: number) => {
        healthContext += `${idx + 1}. ${supp.name}: ${supp.dosage} (${supp.timing})\n`;
      });
    }
    healthContext += `\n`;
  }

  // 🤖 GENERATE AI ANALYSIS WITH O3
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `${healthContext}

=== AI HEALTH DOMAINS ANALYSIS TASK ===

You are an expert functional medicine practitioner and health analyst specializing in personalized health optimization. Your task is to create a comprehensive health domains analysis for ${firstName} that will be displayed in their health dashboard.

CRITICAL REQUIREMENTS:
1. This must be EXTREMELY PERSONALIZED using ${firstName}'s exact data above
2. Reference their SPECIFIC symptoms, biomarkers, genetics, and AI-detected patterns
3. Use their EXACT NAME (${firstName}) throughout for personalization
4. Connect everything to their SPECIFIC GOALS: ${goals.join(', ') || 'general wellness'}
5. Consider their AGE (${age}), GENDER (${gender}), and HEALTH CONTEXT
6. Be CONSISTENT with their AI-detected symptom patterns if available
7. Provide ACTIONABLE, SPECIFIC recommendations not generic advice

ANALYSIS STRUCTURE:
Analyze across these 5 health domains with DEEP PERSONALIZATION:

1. METABOLOMIC ANALYSIS (Energy Production & Glucose Metabolism)
2. LIPIDOMIC ANALYSIS (Cell Membrane Health & Essential Fatty Acids) 
3. INFLAMMATION ANALYSIS (Inflammatory Pathways & Immune Response)
4. COGNITIVE ANALYSIS (Brain Function & Neurotransmitter Balance)
5. GUT & MICROBIOME ANALYSIS (Digestive Health & Microbiome Balance)

For EACH domain, provide:
- WHY THIS MATTERS: Explain the science in compelling terms
- PERSONALIZED INSIGHTS: Use ${firstName}'s specific data and symptoms
- SPECIFIC FINDINGS: Reference their exact biomarkers, symptoms, genetics
- TARGETED RECOMMENDATIONS: 3-4 specific, actionable protocols
- GOAL ALIGNMENT: How this directly supports their goals: ${goals.join(', ') || 'wellness'}

ADDITIONAL SECTIONS:
- CROSS-DOMAIN CONNECTIONS: How their specific issues connect across domains
- PRIORITY PROTOCOLS: Top 3 most important interventions for ${firstName}
- SAFETY NOTES: Considerations for their conditions/medications

TONE: Professional but engaging, like a world-class functional medicine doctor who deeply understands ${firstName}'s unique health profile.

OUTPUT FORMAT: Return a valid JSON object with this exact structure:

{
  "userProfile": {
    "name": "${firstName}",
    "personalHealthStory": "Brief compelling narrative about ${firstName}'s health situation",
    "goals": [array of their goals],
    "goalDescription": "Description of what they want to achieve",
    "primaryConcern": "${primaryConcern}",
    "totalIssueCount": ${totalIssues},
    "riskLevel": "HIGH PRIORITY/MODERATE ATTENTION/OPTIMIZATION FOCUS"
  },
  "domains": {
    "metabolomic": {
      "title": "Metabolomic Analysis",
      "subtitle": "Energy Production & Glucose Metabolism", 
      "significance": "Why this analysis matters explanation",
      "insights": [array of 3-4 personalized insights using ${firstName}'s data],
      "personalizedFindings": [array of 2-3 specific findings about ${firstName}],
      "recommendations": [array of 3-4 specific actionable protocols for ${firstName}],
      "goalAlignment": "How this supports ${firstName}'s specific goals"
    },
    "lipidomic": { /* same structure */ },
    "inflammation": { /* same structure */ },
    "cognitive": { /* same structure */ },
    "gutMicrobiome": { /* same structure */ }
  },
  "crossDomainConnections": [array of 2-3 connections between ${firstName}'s issues],
  "priorityProtocols": [
    {
      "protocol": "Specific protocol description",
      "goalConnection": "How this directly supports ${firstName}'s goals"
    }
  ],
  "conflictCheck": "Safety considerations for ${firstName}'s medications/conditions"
}

BEGIN ANALYSIS FOR ${firstName}:`;

  console.log('🤖 Calling o3 model for health domains analysis...');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'o3-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert functional medicine practitioner and health analyst. Provide comprehensive, personalized health domain analysis based on user data. Always return valid JSON format as specified.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_completion_tokens: 6000,
      reasoning_effort: 'medium',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ OpenAI API error:', errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const analysisContent = data.choices[0].message.content;

  try {
    const analysisResult = JSON.parse(analysisContent);
    console.log('✅ Successfully parsed AI analysis response');
    return analysisResult;
  } catch (parseError) {
    console.error('❌ Failed to parse AI response as JSON:', parseError);
    console.error('Raw response:', analysisContent);
    
    // Fallback: return structured response with raw content
    return {
      userProfile: {
        name: firstName,
        personalHealthStory: `${firstName} is a ${age}-year-old ${gender} with ${totalIssues}/16 lifestyle health issues.`,
        goals: goals,
        goalDescription: goals.join(', ') || 'general wellness optimization',
        primaryConcern: primaryConcern,
        totalIssueCount: totalIssues,
        riskLevel: totalIssues > 8 ? 'HIGH PRIORITY' : totalIssues > 4 ? 'MODERATE ATTENTION' : 'OPTIMIZATION FOCUS'
      },
      error: 'AI response parsing failed',
      rawResponse: analysisContent
    };
  }
} 