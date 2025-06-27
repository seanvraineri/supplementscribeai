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

🎯 ULTRA-HYPER-PERSONALIZED ANALYSIS FOR ${firstName.toUpperCase()}**:

🔥 **IMPOSSIBLE-TO-REPLICATE ANALYSIS MISSION:**
You are creating analysis so SPECIFIC and PERSONALIZED that it's impossible for generic ChatGPT to replicate. You have access to ${firstName}'s EXACT onboarding data, supplement plan, biomarkers, and genetics - use EVERY piece of data to create mind-blowing insights.

**🎯 EXACT DATA INTEGRATION** - Use these precise details:
- Age: ${age} years old (not generic age ranges)
- Gender: ${gender} (gender-specific insights)
- BMI: ${bmi || 'not available'} (exact body composition context)
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

**🎯 NATURAL NAME USAGE**:
- Use "${firstName}" naturally in conversation, not repetitively
- Vary with "you" and "your" most of the time
- Only use the name when it adds personalization value
- Avoid starting every sentence with their name
- Make it sound like talking to a friend, not a medical chart

**🎯 GOALS INTEGRATION**:
Primary goals: ${goals.join(', ') || 'general wellness optimization'}
- Connect every insight to their specific goals
- Show how recommendations support their objectives
- Make it clear this is designed for THEIR success

ANALYSIS DOMAINS - ULTRA-PERSONALIZED FOR ${firstName}:

1. ${firstName}'S METABOLOMIC BLUEPRINT (Energy Production & Glucose Metabolism)
2. ${firstName}'S LIPIDOMIC SIGNATURE (Cell Membrane Health & Essential Fatty Acids) 
3. ${firstName}'S INFLAMMATION PROFILE (Inflammatory Pathways & Immune Response)
4. ${firstName}'S COGNITIVE ARCHITECTURE (Brain Function & Neurotransmitter Balance)
5. ${firstName}'S GUT ECOSYSTEM (Digestive Health & Microbiome Balance)

For EACH domain, provide ULTRA-SPECIFIC analysis:
- WHY THIS MATTERS TO ${firstName}: Explain the science for ${firstName}'s exact situation
- ${firstName}'S PERSONALIZED INSIGHTS: Use ${firstName}'s specific data and symptoms
- SPECIFIC FINDINGS ABOUT ${firstName}: Reference ${firstName}'s exact biomarkers, symptoms, genetics
- TARGETED PROTOCOLS FOR ${firstName}: 3-4 specific, actionable protocols designed for ${firstName}
- DAILY TIPS ${firstName} CAN START TODAY: Practical actions ${firstName} can implement immediately
- SAFETY FOR ${firstName}: Precautions specific to ${firstName}'s allergies/conditions/medications
- HOW THIS SUPPORTS ${firstName}'S GOALS: Direct connection to ${firstName}'s exact goals

ADDITIONAL ULTRA-PERSONALIZED SECTIONS:
- ${firstName}'S CROSS-DOMAIN CONNECTIONS: How ${firstName}'s specific issues connect
- ${firstName}'S PRIORITY PROTOCOLS: Top 3 most important interventions for ${firstName}
- ${firstName}'S DAILY ACTION PLAN: Morning/afternoon/evening actions for ${firstName}
- SAFETY WARNINGS FOR ${firstName}: Critical interactions ${firstName} must avoid

TONE: Like a world-class functional medicine doctor who has studied ${firstName} for months and knows ${firstName}'s body intimately. Every sentence should make ${firstName} think "How does this AI know me so well?"

OUTPUT FORMAT: Return a valid JSON object with this exact structure:

**OUTPUT STRUCTURE** - Ultra-personalized JSON:
{
  "energyBlueprint": {
    "title": "Your Energy Blueprint",
    "insights": "Explain their energy patterns using their exact symptoms and data. Use natural conversation - 'you' and 'your' primarily, with their name only when it adds personal touch. Focus on WHY they experience their specific energy issues.",
    "actionableTips": "Daily energy optimization strategies tailored to their exact profile",
    "safetyConsiderations": "Any precautions specific to their allergies/conditions/medications"
  },
  "brainChemistryProfile": {
    "title": "Your Brain Chemistry Profile", 
    "insights": "Analyze their cognitive/mood symptoms using their exact data. Be conversational and natural - avoid repetitive name usage. Explain the underlying mechanisms in relatable terms.",
    "actionableTips": "Brain optimization strategies for their specific symptoms",
    "safetyConsiderations": "Safety notes for their profile"
  },
  "inflammatorySignature": {
    "title": "Your Inflammatory Signature",
    "insights": "Connect their inflammation-related symptoms to their profile. Use natural language - mostly 'you/your' with occasional name use for personalization.",
    "actionableTips": "Anti-inflammatory strategies for their specific pattern",
    "safetyConsiderations": "Safety considerations for their conditions"
  },
  "digestiveEcosystem": {
    "title": "Your Digestive Ecosystem",
    "insights": "Analyze their digestive symptoms and connections. Keep it conversational and natural - avoid overusing their name.",
    "actionableTips": "Gut health optimization for their specific issues",
    "safetyConsiderations": "Digestive safety notes"
  },
  "hormoneProfile": {
    "title": "Your Hormone Profile",
    "insights": "Age/gender-specific hormone analysis based on their symptoms. Use natural conversation style.",
    "actionableTips": "Hormone balance strategies for their profile",
    "safetyConsiderations": "Hormone-related safety considerations"
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
- Use ${firstName}'s name minimum 20 times throughout the analysis
- Reference ${firstName}'s exact symptoms, not generic ones
- Explain WHY ${firstName} experiences each specific symptom
- Connect ${firstName}'s current supplements to their symptoms
- Make every insight impossible to replicate without ${firstName}'s exact data
- Create "Holy sh*t, this knows me better than I know myself" moments

🎯 SAFETY REMINDER: Every recommendation must be safe for ${firstName}'s allergies (${allergies.map((a: any) => a.ingredient_name).join(', ') || 'none'}), conditions (${conditions.map((c: any) => c.condition_name).join(', ') || 'none'}), and medications (${medications.map((m: any) => m.medication_name).join(', ') || 'none'}).

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