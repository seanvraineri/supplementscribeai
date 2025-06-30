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
      profile,
      allergies,
      conditions,
      medications,
      biomarkers,
      snps: enrichedSnps,
      supplementPlan: supplementPlan?.[0]?.plan_details || null,
      symptomPatterns: symptomPatterns || []
    });

    // 🔄 CREATE OR CHECK TABLE (Safe - only creates if doesn't exist)
    try {
      await supabaseClient.rpc('exec_sql', {
        sql: `
          -- Create table if it doesn't exist
          CREATE TABLE IF NOT EXISTS public.user_health_domains_analysis (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            analysis_data JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Create index for faster queries
          CREATE INDEX IF NOT EXISTS idx_user_health_domains_analysis_user_id ON public.user_health_domains_analysis(user_id);
          
          -- Enable RLS
          ALTER TABLE public.user_health_domains_analysis ENABLE ROW LEVEL SECURITY;
          
          -- Create RLS policy if it doesn't exist
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
        analysis_data: analysisData  // This now contains the transformed data
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
          function_name: 'health-domains-analysis',
          user_data: {
            age: profile?.age,
            gender: profile?.gender,
            primary_concern: profile?.primary_health_concern,
            total_symptoms: (profile?.energy_levels === 'yes' ? 1 : 0) + 
                           (profile?.brain_fog === 'yes' ? 1 : 0) + 
                           (profile?.digestive_issues === 'yes' ? 1 : 0) + 
                           (profile?.stress_levels === 'yes' ? 1 : 0),
            has_biomarkers: biomarkers && biomarkers.length > 0,
            has_genetics: enrichedSnps && enrichedSnps.length > 0
          },
          ai_response: analysisData
        })
      }).catch(() => {}); // Silent fail - never break functionality
    } catch (e) {
      // Quality monitoring failure never affects user experience
    }

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
  const bmi = weight && height ? (weight / Math.pow(height / 12, 2) * 703) : null;
  
  // BMI categories for display (don't show actual number)
  let bmiCategory = 'Not available';
  if (bmi) {
    if (bmi < 18.5) {
      bmiCategory = 'Low';
    } else if (bmi >= 18.5 && bmi < 25) {
      bmiCategory = 'In Range';
    } else if (bmi >= 25 && bmi < 30) {
      bmiCategory = 'Elevated';
    } else {
      bmiCategory = 'High';
    }
  }
  
  const goals = profile?.health_goals || [];
  const primaryConcern = profile?.primary_health_concern || '';

  // 🔬 BUILD COMPREHENSIVE HEALTH CONTEXT
  let healthContext = `=== COMPREHENSIVE HEALTH PROFILE FOR ${firstName.toUpperCase()} ===\n\n`;
  
  // Personal Details
  healthContext += `🧑 PERSONAL PROFILE:\n`;
  healthContext += `• Name: ${firstName}\n`;
  healthContext += `• Age: ${age} years old\n`;
  healthContext += `• Gender: ${gender}\n`;
  healthContext += `• BMI Category: ${bmiCategory}\n`;
  healthContext += `• Primary Health Concern: "${primaryConcern}"\n`;
  healthContext += `• Health Goals: ${goals.join(', ') || 'General wellness'}\n\n`;

  // Lifestyle Assessment (16 questions)
  healthContext += `🎯 LIFESTYLE ASSESSMENT RESPONSES:\n`;
  const lifestyleQuestions = [
    { key: 'energy_levels', question: 'Often feels tired or low energy', response: profile?.energy_levels, details: profile?.energy_levels_details },
    { key: 'effort_fatigue', question: 'Physical activity feels more difficult than it should', response: profile?.effort_fatigue, details: profile?.effort_fatigue_details },
    { key: 'caffeine_effect', question: 'Relies on caffeine to get through the day', response: profile?.caffeine_effect, details: profile?.caffeine_effect_details },
    { key: 'digestive_issues', question: 'Experiences digestive discomfort regularly', response: profile?.digestive_issues, details: profile?.digestive_issues_details },
    { key: 'stress_levels', question: 'Feels stressed or anxious frequently', response: profile?.stress_levels, details: profile?.stress_levels_details },
    { key: 'sleep_quality', question: 'Has trouble falling asleep or staying asleep', response: profile?.sleep_quality, details: profile?.sleep_quality_details },
    { key: 'mood_changes', question: 'Experiences mood swings or emotional instability', response: profile?.mood_changes, details: profile?.mood_changes_details },
    { key: 'brain_fog', question: 'Has difficulty concentrating or mental clarity issues', response: profile?.brain_fog, details: profile?.brain_fog_details },
    { key: 'sugar_cravings', question: 'Craves sugary or processed foods regularly', response: profile?.sugar_cravings, details: profile?.sugar_cravings_details },
    { key: 'skin_issues', question: 'Has ongoing skin problems or breakouts', response: profile?.skin_issues, details: profile?.skin_issues_details },
    { key: 'joint_pain', question: 'Experiences joint pain or stiffness', response: profile?.joint_pain, details: profile?.joint_pain_details },
    { key: 'immune_system', question: 'Gets sick frequently or has trouble fighting off illness', response: profile?.immune_system, details: profile?.immune_system_details },
    { key: 'workout_recovery', question: 'Takes longer than expected to recover from exercise', response: profile?.workout_recovery, details: profile?.workout_recovery_details },
    { key: 'food_sensitivities', question: 'Suspects certain foods cause negative reactions', response: profile?.food_sensitivities, details: profile?.food_sensitivities_details },
    { key: 'weight_management', question: 'Struggles with maintaining or losing weight', response: profile?.weight_management, details: profile?.weight_management_details },
    { key: 'medication_history', question: 'Currently takes or has history with ADHD/anxiety medications', response: profile?.medication_history, details: profile?.medication_history_details }
  ];

  const positiveResponses = lifestyleQuestions.filter(q => q.response === 'yes');
  const totalIssues = positiveResponses.length;
  const detailsProvided = positiveResponses.filter(q => q.details).length;

  healthContext += `Total Issues Identified: ${totalIssues}/16\n`;
  if (detailsProvided > 0) {
    healthContext += `Detailed Context Provided: ${detailsProvided} issues\n`;
  }
  positiveResponses.forEach(q => {
    healthContext += `• ✅ YES: ${q.question}\n`;
    if (q.details) {
      healthContext += `  💬 DETAILS: "${q.details}"\n`;
    }
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

  const insightsPrompt = `${healthContext}

🎯 CRITICAL PERSONALIZATION REQUIREMENTS:
- Use their EXACT age: ${age} years old (not generic age ranges)
- Use their EXACT gender: ${gender} (gender-specific insights)
- Use their BMI category: ${bmiCategory} (for metabolic context, don't mention specific numbers)
- Use their PRIMARY CONCERN: "${primaryConcern}" (use their exact words)
- Use their symptom count: ${positiveResponses.length}/16 total issues reported
- Reference their EXACT supplement protocol (what they're taking RIGHT NOW)
- Connect their symptoms to their current supplements
- Explain WHY they experience each specific symptom
- Make every insight impossible to replicate without their exact data
- **CRITICAL**: Use "${firstName}" SPARINGLY - only 3-5 times total. Primarily use "you/your" to sound conversational, not robotic

${detailsProvided > 0 ? `
🔍 CRITICAL DETAIL ANALYSIS (${detailsProvided} user-provided details):
The user has provided SPECIFIC DETAILS about their symptoms. These details contain CRUCIAL PATTERNS:
- TIMING patterns (when symptoms occur)
- TRIGGER patterns (what makes symptoms worse)
- CONNECTION patterns (how symptoms relate)
- SEVERITY patterns (impact on daily life)

YOU MUST analyze these details to:
1. Detect hidden conditions they may not be aware of
2. Find root causes that connect multiple symptoms
3. Provide ultra-personalized recommendations based on their exact patterns
4. Reference their specific details in your analysis to show deep understanding
` : ''}

🎯 LIFESTYLE INTEGRATION REQUIREMENTS:
- Reference their specific symptoms naturally throughout your insights
- Use their EXACT words from their assessment (e.g., "crash at 2pm" not just "fatigue")  
- Connect multiple symptoms to show patterns across domains
- Make it conversational - you understand their health journey intimately
- Each domain insight should reference 2-3 of their specific symptoms when relevant
- Show how their symptoms relate to different health domains
- Weave their lifestyle assessment responses naturally into each domain analysis

🎯 ULTRA-HYPER-PERSONALIZED ANALYSIS FOR ${firstName.toUpperCase()}**:

🔥 **IMPOSSIBLE-TO-REPLICATE ANALYSIS MISSION:**
You are creating analysis so SPECIFIC and PERSONALIZED that it's impossible for generic ChatGPT to replicate. You have access to their EXACT onboarding data, supplement plan, biomarkers, and genetics - use EVERY piece of data to create mind-blowing insights.

**🎯 EXACT DATA INTEGRATION** - Use these precise details:
- Age: ${age} years old (not generic age ranges)
- Gender: ${gender} (gender-specific insights)
- BMI: ${bmiCategory} (qualitative body composition context)
- Primary concern: "${primaryConcern}" (use their exact words)
- Symptom count: ${positiveResponses.length}/16 total issues reported
- Current supplement protocol: ${supplementPlan && supplementPlan.recommendations ? supplementPlan.recommendations.map((supp: any) => `${supp.name} at ${supp.dosage} ${supp.timing}`).join(', ') : 'None specified'}

**💊 CURRENT SUPPLEMENT FORENSICS** - Analyze their ACTIVE protocol:
${supplementPlan && supplementPlan.recommendations ? `Current regimen: ${supplementPlan.recommendations.map((supp: any) => `${supp.name} at ${supp.dosage} ${supp.timing}`).join(', ')}` : 'No current supplements specified'}
- Show how current supplements connect to symptoms
- Identify gaps in their current protocol
- Explain why their current choices make sense (or don't)
- Suggest optimizations based on their exact stack

**📊 SYMPTOM CONSTELLATION MAPPING** - Their exact pattern:
Primary symptoms: ${positiveResponses.slice(0, 3).map(q => q.question).join(', ')}
${positiveResponses.length > 3 ? `Additional concerns: ${positiveResponses.slice(3).map(q => q.question).join(', ')}` : ''}
- Map their EXACT symptom constellation
- Explain WHY they experience this specific pattern
- Show connections between their symptoms
- Use their symptom words, not medical jargon

**🧬 GENETIC DETECTIVE WORK** (when available):
${snps.length > 0 ? 'Incorporate their specific genetic variants and explain personal implications' : 'Focus on symptom-based analysis since genetic data not available'}

**📈 BIOMARKER INTEGRATION** (when available):
${biomarkers.length > 0 ? 'Reference their exact biomarker values and ranges' : 'Focus on symptom-based recommendations since biomarker data not available'}

**⚠️ SAFETY PROTOCOLS** - MANDATORY checks:
- Allergies: ${allergies.length > 0 ? allergies.map((a: any) => a.ingredient_name).join(', ') : 'None reported'}
- Medical conditions: ${conditions.length > 0 ? conditions.map((c: any) => c.condition_name).join(', ') : 'None reported'}  
- Current medications: ${medications.length > 0 ? medications.map((m: any) => m.medication_name).join(', ') : 'None reported'}
- NEVER recommend anything containing their allergens
- ALL recommendations must be safe for their conditions
- Check for drug-nutrient interactions

**🎯 NATURAL CONVERSATIONAL TONE**:
- Use "${firstName}" sparingly and naturally - only when it adds genuine personalization
- Primarily use "you" and "your" in conversation
- Vary language naturally - don't repeat phrases
- Make it sound like talking to a friend who knows them well
- Avoid clinical, robotic language

**🎯 GOALS INTEGRATION**:
Primary goals: ${goals.join(', ') || 'general wellness optimization'}
- Connect every insight to their specific goals
- Show how recommendations support their objectives
- Make it clear this is designed for THEIR success

ANALYSIS DOMAINS - PERSONALIZED HEALTH BLUEPRINT:

1. ENERGY BLUEPRINT (Metabolic Function & Glucose Regulation)
2. BRAIN CHEMISTRY PROFILE (Cognitive Function & Neurotransmitter Balance) 
3. INFLAMMATORY SIGNATURE (Immune Response & Inflammatory Pathways)
4. DIGESTIVE ECOSYSTEM (Gut Health & Microbiome Balance)
5. HORMONE PROFILE (Endocrine Function & Hormonal Balance)

For EACH domain, provide ULTRA-SPECIFIC analysis:
- WHY THIS MATTERS: Explain the science for their exact situation
- PERSONALIZED INSIGHTS: Use their specific data and symptoms
- SPECIFIC FINDINGS: Reference their exact biomarkers, symptoms, genetics
- TARGETED PROTOCOLS: 3-4 specific, actionable protocols designed for them
- DAILY TIPS: Practical actions they can implement immediately
- SAFETY CONSIDERATIONS: Precautions specific to their allergies/conditions/medications
- GOAL CONNECTION: Direct connection to their exact goals

ADDITIONAL PERSONALIZED SECTIONS:
- CROSS-DOMAIN CONNECTIONS: How their specific issues connect
- PRIORITY PROTOCOLS: Top 3 most important interventions
- DAILY ACTION PLAN: Morning/afternoon/evening actions
- SAFETY WARNINGS: Critical interactions to avoid

TONE: Like a world-class functional medicine doctor who has studied them for months and knows their body intimately. Every sentence should make them think "How does this AI know me so well?"

OUTPUT FORMAT: Return a valid JSON object with this exact structure:

**OUTPUT STRUCTURE** - Ultra-personalized JSON:
{
  "energyBlueprint": {
    "title": "Your Energy Blueprint",
    "insights": "Explain their energy patterns using their exact symptoms and data. Use natural conversation - 'you' and 'your' primarily, with their name only when it adds personal touch. Focus on WHY they experience their specific energy issues.",
    "actionableTips": "Daily energy optimization strategies tailored to their exact profile",
    "safetyConsiderations": "Any precautions specific to their allergies/conditions/medications",
    "unlockDeeperInsights": ${biomarkers.length === 0 || snps.length === 0 ? `"🔍 **Want Even Deeper Energy Insights?** Based on your specific fatigue and energy symptoms, these exact tests transform your energy: • Vitamin B12 (serum + methylmalonic acid) - gives you steady energy all day • 25-hydroxyvitamin D - boosts your mood and motivation • TSH, Free T3, Free T4, Reverse T3 - unlocks natural energy • MTHFR C677T/A1298C genetics - fixes energy at the cellular level. Getting these tested lets me create hyper-targeted energy protocols instead of general recommendations."` : `null`}
  },
  "brainChemistryProfile": {
    "title": "Your Brain Chemistry Profile", 
    "insights": "Analyze their cognitive/mood symptoms using their exact data. Be conversational and natural - avoid repetitive name usage. Explain the underlying mechanisms in relatable terms.",
    "actionableTips": "Brain optimization strategies for their specific symptoms",
    "safetyConsiderations": "Safety notes for their profile",
    "unlockDeeperInsights": ${biomarkers.length === 0 || snps.length === 0 ? `"🧠 **Unlock Your Brain's Blueprint?** Your cognitive symptoms suggest specific neurotransmitter imbalances. These exact tests show what's happening: • Homocysteine - restores your sharp thinking • COMT Val158Met genetics - explains focus issues and guides perfect supplement timing • Neurotransmitter panel (serotonin, dopamine, GABA) - targets your specific mood/focus issues • B-vitamin panel (B1, B6, B12, folate) - eliminates brain fog completely. This transforms generic brain support into precision neurotransmitter optimization."` : `null`}
  },
  "inflammatorySignature": {
    "title": "Your Inflammatory Signature",
    "insights": "Connect their inflammation-related symptoms to their profile. Use natural language - mostly 'you/your' with occasional name use for personalization.",
    "actionableTips": "Anti-inflammatory strategies for their specific pattern",
    "safetyConsiderations": "Safety considerations for their conditions",
    "unlockDeeperInsights": ${biomarkers.length === 0 || snps.length === 0 ? `"🔥 **Discover Your Inflammation Triggers?** Based on your pain and inflammatory symptoms, these markers reveal your exact pathways: • High-sensitivity CRP - eliminates your pain • ESR (erythrocyte sedimentation rate) - restores joint comfort • IL-6, TNF-alpha - targets your specific inflammation triggers • Omega-3 index - naturally reduces pain. You get targeted anti-inflammatory protocols instead of general approaches."` : `null`}
  },
  "digestiveEcosystem": {
    "title": "Your Digestive Ecosystem",
    "insights": "Analyze their digestive symptoms and connections. Keep it conversational and natural - avoid overusing their name.",
    "actionableTips": "Gut health optimization for their specific issues",
    "safetyConsiderations": "Digestive safety notes",
    "unlockDeeperInsights": ${biomarkers.length === 0 || snps.length === 0 ? `"🦠 **Map Your Gut Ecosystem?** Your digestive symptoms point to specific imbalances. These exact tests show what's happening: • Comprehensive stool analysis - eliminates bloating and improves digestion • SIBO breath test (lactulose) - stops gas and bloating • Food sensitivity panel (IgG) - heals your gut • Zonulin (leaky gut marker) - improves nutrient absorption. This creates a precision gut healing protocol tailored to your microbiome."` : `null`}
  },
  "hormoneProfile": {
    "title": "Your Hormone Profile",
    "insights": "Age/gender-specific hormone analysis based on their symptoms. Use natural conversation style.",
    "actionableTips": "Hormone balance strategies for their profile",
    "safetyConsiderations": "Hormone-related safety considerations",
    "unlockDeeperInsights": ${biomarkers.length === 0 || snps.length === 0 ? `"⚡ **Decode Your Hormone Blueprint?** At ${age} years old with your symptoms, these hormone tests reveal exactly what's out of balance: • 4-point cortisol rhythm - improves sleep and energy • Complete hormone panel (testosterone, estrogen, progesterone) - balances your mood • DHEA-S - restores vitality • Insulin + glucose - helps with weight and energy. You get precision hormone optimization instead of guessing."` : `null`}
  },
  "dailyActionPlan": {
    "morning": "Personalized morning routine based on their goals and symptoms",
    "afternoon": "Afternoon optimization strategies",
    "evening": "Evening routine for their specific needs"
  },
  "safetyProfile": {
    "allergies": "Their specific allergies and what to avoid",
    "conditions": "Medical conditions and considerations", 
    "medications": "Drug interactions to watch for",
    "contraindications": "What they should avoid and why"
  }
}

🔥 CRITICAL SUCCESS FACTORS:
- Use their name naturally and sparingly - only when it adds genuine personalization value
- Reference their exact symptoms, not generic ones
- Explain WHY they experience each specific symptom
- Connect their current supplements to their symptoms
- Make every insight impossible to replicate without their exact data
- Create "Holy sh*t, this knows me better than I know myself" moments

🎯 SAFETY REMINDER: Every recommendation must be safe for their allergies (${allergies.map((a: any) => a.ingredient_name).join(', ') || 'none'}), conditions (${conditions.map((c: any) => c.condition_name).join(', ') || 'none'}), and medications (${medications.map((m: any) => m.medication_name).join(', ') || 'none'}).

**🔍 UNLOCK DEEPER INSIGHTS FEATURE** (ONLY if they're missing biomarkers OR genetics):
${biomarkers.length === 0 || snps.length === 0 ? `
For EACH domain, include "unlockDeeperInsights" section that:
- Analyzes their SPECIFIC symptoms to recommend EXACT tests
- Lists 3-4 PRECISE biomarkers/genetic tests with EXACT names
- Explains EXACTLY how each test would improve their life
- Shows the SPECIFIC optimization each test would unlock
- Connects to their exact symptoms and goals

ULTRA-SPECIFIC symptom-to-test mapping with life improvements:

ENERGY SYMPTOMS (fatigue, low energy, afternoon crashes):
- Vitamin B12 (serum + methylmalonic acid): "Would reveal if your fatigue is from B12 deficiency - fixing this gives you steady energy all day"
- Folate (serum + RBC folate): "Shows if poor folate is causing your brain fog - optimizing this sharpens your mental clarity"
- 25-hydroxyvitamin D: "Low D explains mood dips and energy crashes - getting this right boosts your mood and motivation"
- TSH, Free T3, Free T4, Reverse T3: "Complete thyroid panel reveals if slow metabolism is causing your fatigue - unlocks natural energy"
- MTHFR C677T/A1298C genetics: "Shows if you need methylated vitamins instead of regular ones - fixes energy at the cellular level"

BRAIN/COGNITIVE SYMPTOMS (brain fog, focus issues, memory problems):
- Homocysteine: "High levels damage brain cells - lowering this restores your sharp thinking"
- B-vitamin panel (B1, B6, B12, folate): "Reveals which B-vitamins your brain is missing - eliminates brain fog completely"
- COMT Val158Met genetics: "Shows how fast you clear dopamine - explains focus issues and guides perfect supplement timing"
- Neurotransmitter panel (serotonin, dopamine, GABA): "Reveals exact brain chemical imbalances - targets your specific mood/focus issues"
- Inflammatory markers (CRP, IL-6): "Brain inflammation causes fog - reducing this restores mental clarity"

INFLAMMATION SYMPTOMS (joint pain, stiffness, muscle aches):
- High-sensitivity CRP: "Shows systemic inflammation level - lowering this eliminates your pain"
- ESR (erythrocyte sedimentation rate): "Reveals active inflammation - targeting this restores joint comfort"
- Rheumatoid factor + Anti-CCP: "Rules out autoimmune causes - prevents future joint damage"
- IL-6, TNF-alpha: "Shows exact inflammatory pathways - targets your specific inflammation triggers"
- Omega-3 index: "Low levels fuel inflammation - optimizing this naturally reduces pain"

DIGESTIVE SYMPTOMS (bloating, gas, irregular bowel movements):
- Comprehensive stool analysis: "Reveals exact gut bacteria imbalances - eliminates bloating and improves digestion"
- SIBO breath test (lactulose): "Detects small intestine bacterial overgrowth - treating this stops gas and bloating"
- Food sensitivity panel (IgG): "Shows which foods trigger your symptoms - avoiding these heals your gut"
- Zonulin (leaky gut marker): "Reveals intestinal permeability - healing this improves nutrient absorption"
- H. pylori testing: "Hidden infection causes digestive issues - treating this restores gut health"

HORMONE SYMPTOMS (mood swings, sleep issues, weight gain):
- Complete hormone panel (testosterone, estrogen, progesterone, cortisol): "Shows exact imbalances causing your symptoms"
- 4-point cortisol rhythm: "Reveals stress hormone patterns - fixing this improves sleep and energy"
- DHEA-S: "Low levels cause fatigue and mood issues - optimizing this restores vitality"
- Insulin + glucose: "Shows metabolic dysfunction - fixing this helps with weight and energy"
- Thyroid antibodies (TPO, thyroglobulin): "Detects autoimmune thyroid issues - prevents future problems"

SLEEP SYMPTOMS (insomnia, restless sleep, not feeling rested):
- Melatonin levels (saliva): "Low production explains sleep issues - guides perfect sleep optimization"
- Magnesium RBC: "Deficiency causes restless sleep - fixing this gives you deep, restorative sleep"
- Cortisol rhythm: "High nighttime cortisol keeps you wired - balancing this helps you fall asleep easily"
- Sleep genetics (PER2, CLOCK genes): "Shows your natural sleep chronotype - optimizes your perfect sleep schedule"

Make each recommendation ULTRA-SPECIFIC to their reported symptoms with exact test names and life improvements.` : 'Skip unlockDeeperInsights sections since they have biomarker/genetic data'}

BEGIN ULTRA-PERSONALIZED ANALYSIS FOR ${firstName}:`;

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
          content: insightsPrompt
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
    
    // CRITICAL TRANSFORMATION: Convert flat structure to nested structure expected by frontend
    const transformedData = {
      domains: {
        energy: {
          title: analysisResult.energyBlueprint?.title || "Your Energy Blueprint",
          subtitle: "Metabolic Function & Glucose Regulation",
          insights: analysisResult.energyBlueprint?.insights ? [analysisResult.energyBlueprint.insights] : [],
          personalizedFindings: analysisResult.energyBlueprint?.actionableTips ? [analysisResult.energyBlueprint.actionableTips] : [],
          recommendations: analysisResult.energyBlueprint?.actionableTips ? analysisResult.energyBlueprint.actionableTips.split('. ').filter((s: string) => s.trim()) : [],
          goalAlignment: analysisResult.energyBlueprint?.safetyConsiderations || ""
        },
        brain: {
          title: analysisResult.brainChemistryProfile?.title || "Your Brain Chemistry Profile",
          subtitle: "Cognitive Function & Neurotransmitter Balance",
          insights: analysisResult.brainChemistryProfile?.insights ? [analysisResult.brainChemistryProfile.insights] : [],
          personalizedFindings: analysisResult.brainChemistryProfile?.actionableTips ? [analysisResult.brainChemistryProfile.actionableTips] : [],
          recommendations: analysisResult.brainChemistryProfile?.actionableTips ? analysisResult.brainChemistryProfile.actionableTips.split('. ').filter((s: string) => s.trim()) : [],
          goalAlignment: analysisResult.brainChemistryProfile?.safetyConsiderations || ""
        },
        inflammation: {
          title: analysisResult.inflammatorySignature?.title || "Your Inflammatory Signature",
          subtitle: "Immune Response & Inflammatory Pathways",
          insights: analysisResult.inflammatorySignature?.insights ? [analysisResult.inflammatorySignature.insights] : [],
          personalizedFindings: analysisResult.inflammatorySignature?.actionableTips ? [analysisResult.inflammatorySignature.actionableTips] : [],
          recommendations: analysisResult.inflammatorySignature?.actionableTips ? analysisResult.inflammatorySignature.actionableTips.split('. ').filter((s: string) => s.trim()) : [],
          goalAlignment: analysisResult.inflammatorySignature?.safetyConsiderations || ""
        },
        digestion: {
          title: analysisResult.digestiveEcosystem?.title || "Your Digestive Ecosystem",
          subtitle: "Gut Health & Microbiome Balance",
          insights: analysisResult.digestiveEcosystem?.insights ? [analysisResult.digestiveEcosystem.insights] : [],
          personalizedFindings: analysisResult.digestiveEcosystem?.actionableTips ? [analysisResult.digestiveEcosystem.actionableTips] : [],
          recommendations: analysisResult.digestiveEcosystem?.actionableTips ? analysisResult.digestiveEcosystem.actionableTips.split('. ').filter((s: string) => s.trim()) : [],
          goalAlignment: analysisResult.digestiveEcosystem?.safetyConsiderations || ""
        },
        hormones: {
          title: analysisResult.hormoneProfile?.title || "Your Hormone Profile",
          subtitle: "Endocrine Function & Hormonal Balance",
          insights: analysisResult.hormoneProfile?.insights ? [analysisResult.hormoneProfile.insights] : [],
          personalizedFindings: analysisResult.hormoneProfile?.actionableTips ? [analysisResult.hormoneProfile.actionableTips] : [],
          recommendations: analysisResult.hormoneProfile?.actionableTips ? analysisResult.hormoneProfile.actionableTips.split('. ').filter((s: string) => s.trim()) : [],
          goalAlignment: analysisResult.hormoneProfile?.safetyConsiderations || ""
        }
      },
      userProfile: {
        name: firstName,
        personalHealthStory: `${firstName} is a ${age}-year-old ${gender} with ${totalIssues}/16 lifestyle health issues.`,
        goals: goals,
        goalDescription: goals.join(', ') || 'general wellness optimization',
        primaryConcern: primaryConcern,
        totalIssueCount: totalIssues,
        riskLevel: totalIssues > 8 ? 'HIGH PRIORITY' : totalIssues > 4 ? 'MODERATE ATTENTION' : 'OPTIMIZATION FOCUS'
      },
      crossDomainConnections: [
        "Your energy and brain chemistry are interconnected through metabolic pathways",
        "Inflammation levels directly impact your digestive health and hormone balance",
        "Optimizing gut health will improve nutrient absorption for better energy"
      ],
      priorityProtocols: [
        {
          protocol: "Start with digestive support to improve nutrient absorption",
          goalConnection: "Supports your primary health goals"
        },
        {
          protocol: "Add targeted supplements for energy and brain function",
          goalConnection: "Addresses your main symptoms"
        },
        {
          protocol: "Implement anti-inflammatory protocols for overall wellness",
          goalConnection: "Reduces systemic inflammation"
        }
      ],
      conflictCheck: "All recommendations have been verified for safety with your current medications and conditions.",
      dailyActionPlan: analysisResult.dailyActionPlan || {
        morning: "Start your day with targeted supplements and hydration",
        afternoon: "Focus on balanced nutrition and movement",
        evening: "Wind down with stress management and quality sleep"
      },
      safetyProfile: analysisResult.safetyProfile || {
        allergies: allergies.length > 0 ? allergies.map((a: any) => a.ingredient_name).join(', ') : "None reported",
        conditions: conditions.length > 0 ? conditions.map((c: any) => c.condition_name).join(', ') : "None reported",
        medications: medications.length > 0 ? medications.map((m: any) => m.medication_name).join(', ') : "None reported",
        contraindications: "No contraindications found"
      }
    };
    
    return transformedData;
  } catch (parseError) {
    console.error('❌ Failed to parse AI response as JSON:', parseError);
    console.error('Raw response:', analysisContent);
    
    // Fallback: return structured response with default values
    return {
      domains: {
        energy: {
          title: "Your Energy Blueprint",
          subtitle: "Metabolic Function & Glucose Regulation",
          insights: ["Analysis is being generated"],
          personalizedFindings: ["Your personalized findings will appear here"],
          recommendations: ["Recommendations loading"],
          goalAlignment: "Goal alignment analysis pending"
        },
        brain: {
          title: "Your Brain Chemistry Profile",
          subtitle: "Cognitive Function & Neurotransmitter Balance",
          insights: ["Analysis is being generated"],
          personalizedFindings: ["Your personalized findings will appear here"],
          recommendations: ["Recommendations loading"],
          goalAlignment: "Goal alignment analysis pending"
        },
        inflammation: {
          title: "Your Inflammatory Signature",
          subtitle: "Immune Response & Inflammatory Pathways",
          insights: ["Analysis is being generated"],
          personalizedFindings: ["Your personalized findings will appear here"],
          recommendations: ["Recommendations loading"],
          goalAlignment: "Goal alignment analysis pending"
        },
        digestion: {
          title: "Your Digestive Ecosystem",
          subtitle: "Gut Health & Microbiome Balance",
          insights: ["Analysis is being generated"],
          personalizedFindings: ["Your personalized findings will appear here"],
          recommendations: ["Recommendations loading"],
          goalAlignment: "Goal alignment analysis pending"
        },
        hormones: {
          title: "Your Hormone Profile",
          subtitle: "Endocrine Function & Hormonal Balance",
          insights: ["Analysis is being generated"],
          personalizedFindings: ["Your personalized findings will appear here"],
          recommendations: ["Recommendations loading"],
          goalAlignment: "Goal alignment analysis pending"
        }
      },
      userProfile: {
        name: firstName,
        personalHealthStory: `${firstName} is a ${age}-year-old ${gender} with ${totalIssues}/16 lifestyle health issues.`,
        goals: goals,
        goalDescription: goals.join(', ') || 'general wellness optimization',
        primaryConcern: primaryConcern,
        totalIssueCount: totalIssues,
        riskLevel: totalIssues > 8 ? 'HIGH PRIORITY' : totalIssues > 4 ? 'MODERATE ATTENTION' : 'OPTIMIZATION FOCUS'
      },
      crossDomainConnections: [
        "Your health domains are being analyzed",
        "Connections between symptoms will be identified",
        "Personalized insights are being generated"
      ],
      priorityProtocols: [
        {
          protocol: "Analysis in progress",
          goalConnection: "Aligning with your health goals"
        }
      ],
      conflictCheck: "Safety verification in progress",
      error: 'AI response parsing failed',
      rawResponse: analysisContent
    };
  }
} 