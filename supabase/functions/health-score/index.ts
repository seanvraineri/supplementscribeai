import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { checkRateLimit, getRateLimitHeaders } from '../rate-limiter/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Rate limiting: 20 health score calculations per 5 minutes per user
    const rateLimit = checkRateLimit(`health-score:${user.id}`, 20, 5);
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please wait before requesting another health score.' 
      }), {
        headers: { 
          ...corsHeaders, 
          ...getRateLimitHeaders(rateLimit.remainingRequests, rateLimit.resetTime),
          'Content-Type': 'application/json' 
        },
        status: 429,
      });
    }

    // Fetch user's complete onboarding profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select(`
        full_name, age, gender, weight_lbs, height_total_inches, health_goals, activity_level, sleep_hours,
        primary_health_concern, known_biomarkers, known_genetic_variants, alcohol_intake,
        energy_levels, effort_fatigue, caffeine_effect, digestive_issues, stress_levels, 
        sleep_quality, mood_changes, brain_fog, sugar_cravings, skin_issues, joint_pain,
        immune_system, workout_recovery, food_sensitivities, weight_management, 
        medication_history
      `)
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Fetch additional health data
    const [
      { data: conditions },
      { data: medications },
      { data: allergies }
    ] = await Promise.all([
              supabaseClient.from('user_conditions').select('condition_name').eq('user_id', user.id).limit(30),
        supabaseClient.from('user_medications').select('medication_name').eq('user_id', user.id).limit(50),
      supabaseClient.from('user_allergies').select('ingredient_name').eq('user_id', user.id).limit(50)
    ]);

    // Build comprehensive health analysis prompt
    const healthAnalysisPrompt = buildHealthAnalysisPrompt(profile, conditions || [], medications || [], allergies || []);

    // Call OpenAI API for health score analysis
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

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
            content: `You are a personalized health analyst for ${profile.full_name || 'this individual'}. Analyze their specific onboarding health assessment and provide a hyper-personalized health score.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON, no markdown formatting
2. Be ULTRA-REALISTIC in scoring - most people with multiple lifestyle issues should score 60-75
3. Address ${profile.full_name || 'them'} by name and reference their exact age (${profile.age}) and primary concern
4. Create a "health story" that connects their symptoms and issues logically
5. Make scoring harsh but fair - someone with 6+ issues should NOT score above 70

Return JSON with this exact structure:
{
  "healthScore": number between 0-100,
  "scoreBreakdown": {
    "lifestyleHabits": number 0-25,
    "symptomBurden": number 0-25, 
    "physicalWellness": number 0-25,
    "riskFactors": number 0-25
  },
  "summary": "2-3 sentence summary of overall health status based on their onboarding responses",
  "strengths": ["specific positive health factors from their responses"],
  "concerns": ["specific areas needing attention from their responses"],
  "topRecommendations": ["5-7 HIGHLY SPECIFIC supplement and lifestyle recommendations based on their exact issues"],
  "scoreExplanation": "detailed explanation of how the score was calculated from their onboarding data"
}

PERSONALIZATION REQUIREMENTS:
- Reference ${profile.full_name || 'the user'}'s exact age (${profile.age}) and primary concern: "${profile.primary_health_concern}"
- Connect their symptoms into a coherent health narrative
- Make recommendations feel like they're written specifically for their situation
- Use realistic scoring - someone with multiple "yes" answers has real health challenges

RECOMMENDATION REQUIREMENTS:
- Be EXTREMELY specific with holistic lifestyle recommendations ONLY
- NO SUPPLEMENTS - focus on exercise, diet, habits, and natural wellness practices
- Provide specific exercises (e.g., "Do 20 bodyweight squats every morning upon waking")
- Give precise dietary changes (e.g., "Add 1 cup blueberries to breakfast for antioxidants")
- Include specific foods to avoid (e.g., "Eliminate processed sugar and refined carbs for 30 days")
- Provide exact lifestyle modifications (e.g., "Take a 10-minute cold shower every morning")
- Focus on root cause solutions through natural methods
- NO mentions of healthcare providers, doctors, or medical consultations
- Base ALL recommendations on their specific "yes" answers from the lifestyle assessment

SCORING CATEGORIES (based on onboarding data):

**1. LIFESTYLE HABITS (25 points):**
- Sleep quality and hours (sleep_quality, sleep_hours)
- Activity level (activity_level) 
- Alcohol intake (alcohol_intake)
- Caffeine dependence (caffeine_effect)
- Stress management (stress_levels)

**2. SYMPTOM BURDEN (25 points):**
- Energy and fatigue (energy_levels, effort_fatigue)
- Cognitive function (brain_fog)
- Mood stability (mood_changes)
- Digestive health (digestive_issues, food_sensitivities)
- Physical discomfort (joint_pain, skin_issues)

**3. PHYSICAL WELLNESS (25 points):**
- Recovery and fitness (workout_recovery)
- Immune function (immune_system)
- Weight management (weight_management)
- Metabolic health (sugar_cravings)
- Age-appropriate health metrics

**4. RISK FACTORS (25 points):**
- Medical conditions and medications
- Primary health concern severity
- Medication history (ADHD/anxiety meds effectiveness)
- Age and demographic factors
- Known health issues

SCORING GUIDELINES (ENCOURAGING & RETENTION-FOCUSED):
- 95-100: Exceptional health (0-2 areas for optimization)
- 85-94: Great health (3-5 areas for optimization) 
- 75-84: Good health (6-8 areas for optimization)
- 65-74: Fair health (9-11 areas for optimization)
- 55-64: Needs attention (12+ areas for optimization)

Count "yes" answers as areas for optimization, not problems.
Count "no" answers as health strengths to celebrate.
Most users will score 80-90. Focus on progress potential and encouragement.

SPECIFIC HOLISTIC RECOMMENDATION MAPPING (use these for their "yes" answers):
- Digestive issues → "Eat 1 cup fermented vegetables daily + chew each bite 30 times + avoid eating 3 hours before bed"
- Stress/anxiety → "Practice 4-7-8 breathing (4 count in, 7 hold, 8 out) for 10 minutes morning and evening + take 20-minute nature walks daily"
- Mood changes → "Get 15 minutes direct sunlight within 1 hour of waking + eliminate processed sugar completely + do 50 jumping jacks when feeling low"
- Sugar cravings → "Eat 1 tbsp raw almonds when craving hits + drink 16oz water first + avoid all artificial sweeteners and refined carbs"
- Skin issues → "Eliminate dairy and gluten for 30 days + drink 3 liters water daily + do 5-minute face massage with cold water each morning"
- Joint pain → "Do 10-minute morning joint mobility routine + take 15-minute ice baths 3x/week + eliminate nightshade vegetables for 4 weeks"
- Brain fog → "Do 20 burpees every 2 hours + eliminate gluten for 4 weeks + practice 10-minute meditation daily using breath focus"
- Sleep issues → "No screens 2 hours before bed + sleep in completely dark room + do 50 bodyweight squats 4 hours before bedtime"
- Workout recovery → "Take 10-minute ice baths within 2 hours post-workout + eat 1 cup tart cherries before bed + do 15-minute gentle yoga daily"
- Food sensitivities → "Eliminate top 8 allergens for 21 days + eat only single-ingredient foods + chew each bite 40 times minimum"
- Weight management → "16:8 intermittent fasting + 30-minute strength training 3x/week + walk 10,000 steps daily + no eating after 7pm"
- Caffeine dependence → "Replace afternoon coffee with 20 push-ups + drink green tea only before noon + do 5-minute cold exposure daily"
- Immune issues → "Get 20 minutes direct sunlight daily + eat 5 different colored vegetables + do 30 seconds cold shower finish daily"
- Low energy → "Do 100 jumping jacks upon waking + eliminate all processed foods + take 20-minute power naps between 1-3pm"
- Fatigue with exercise → "Start with 5-minute walks + eat iron-rich foods (spinach, pumpkin seeds) daily + ensure 8+ hours sleep nightly"

Make recommendations ULTRA-SPECIFIC with exact dosages, timing, and protocols based on their actual issues.`
          },
          {
            role: 'user',
            content: healthAnalysisPrompt
          }
        ],
        max_tokens: 1500,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to analyze health data' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const openaiData = await openaiResponse.json();
    let aiResponse = openaiData.choices[0]?.message?.content || '';

    // Parse AI response
    let healthAnalysis;
    try {
      // Clean up response - remove any markdown formatting
      aiResponse = aiResponse.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      healthAnalysis = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw AI response:', aiResponse);
      
      // Fallback response based on simple analysis
      healthAnalysis = createFallbackHealthScore(profile);
    }

    // Validate and ensure all required fields exist
    healthAnalysis.healthScore = Math.max(0, Math.min(100, healthAnalysis.healthScore || 65));
    healthAnalysis.scoreBreakdown = healthAnalysis.scoreBreakdown || { 
      lifestyleHabits: 16, 
      symptomBurden: 16, 
      physicalWellness: 16, 
      riskFactors: 17 
    };
    healthAnalysis.strengths = Array.isArray(healthAnalysis.strengths) ? healthAnalysis.strengths : [];
    healthAnalysis.concerns = Array.isArray(healthAnalysis.concerns) ? healthAnalysis.concerns : [];
    healthAnalysis.topRecommendations = Array.isArray(healthAnalysis.topRecommendations) ? healthAnalysis.topRecommendations : [];

    // Save health score to database for tracking
    try {
      await supabaseClient
        .from('user_health_scores')
        .insert({
          user_id: user.id,
          health_score: healthAnalysis.healthScore,
          score_breakdown: healthAnalysis.scoreBreakdown,
          analysis_summary: healthAnalysis.summary,
          strengths: healthAnalysis.strengths,
          concerns: healthAnalysis.concerns,
          recommendations: healthAnalysis.topRecommendations,
          score_explanation: healthAnalysis.scoreExplanation
        });
    } catch (dbError) {
      console.error('Failed to save health score:', dbError);
      // Don't fail the request if database save fails
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
          function_name: 'health-score',
          user_data: {
            age: profile?.age,
            gender: profile?.gender,
            primary_concern: profile?.primary_health_concern,
            total_symptoms: [profile?.energy_levels, profile?.brain_fog, profile?.digestive_issues, profile?.stress_levels, profile?.mood_changes].filter(s => s === 'yes').length,
            has_conditions: conditions && conditions.length > 0,
            has_medications: medications && medications.length > 0
          },
          ai_response: healthAnalysis
        })
      }).catch(() => {}); // Silent fail - never break functionality
    } catch (e) {
      // Quality monitoring failure never affects user experience
    }

    return new Response(JSON.stringify(healthAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Health score analysis error:', error);
    return new Response(JSON.stringify({ 
      error: `Server error: ${error.message}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

function buildHealthAnalysisPrompt(profile: any, conditions: any[], medications: any[], allergies: any[]): string {
  // Count lifestyle issues (Yes answers = problems)
  const lifestyleIssues = [];
  const lifestyleStrengths = [];
  
  if (profile?.energy_levels === 'yes') lifestyleIssues.push('Often feels tired or low energy');
  if (profile?.effort_fatigue === 'yes') lifestyleIssues.push('Physical activity feels more difficult than it should');
  if (profile?.digestive_issues === 'yes') lifestyleIssues.push('Experiences digestive discomfort regularly');
  if (profile?.stress_levels === 'yes') lifestyleIssues.push('Feels stressed or anxious frequently');
  if (profile?.mood_changes === 'yes') lifestyleIssues.push('Experiences mood swings or irritability');
  if (profile?.sugar_cravings === 'yes') lifestyleIssues.push('Craves sugar or processed foods');
  if (profile?.skin_issues === 'yes') lifestyleIssues.push('Has skin problems (acne, dryness, sensitivity)');
  if (profile?.joint_pain === 'yes') lifestyleIssues.push('Experiences joint pain or stiffness');
  if (profile?.brain_fog === 'yes') lifestyleIssues.push('Experiences brain fog or difficulty concentrating');
  if (profile?.sleep_quality === 'yes') lifestyleIssues.push('Has trouble falling asleep or staying asleep');
  if (profile?.workout_recovery === 'yes') lifestyleIssues.push('Takes longer to recover from workouts');
  if (profile?.food_sensitivities === 'yes') lifestyleIssues.push('Certain foods make them feel unwell');
  if (profile?.weight_management === 'yes') lifestyleIssues.push('Difficult to maintain a healthy weight');
  if (profile?.caffeine_effect === 'yes') lifestyleIssues.push('Relies on caffeine to get through the day');
  if (profile?.immune_system === 'yes') lifestyleIssues.push('Gets sick more often than desired');
  if (profile?.medication_history === 'yes') lifestyleIssues.push('Previously tried ADHD/anxiety medications that did not work effectively');
  
  // Count positive factors (No answers = good)
  if (profile?.energy_levels === 'no') lifestyleStrengths.push('Good energy levels');
  if (profile?.stress_levels === 'no') lifestyleStrengths.push('Good stress management');
  if (profile?.sleep_quality === 'no') lifestyleStrengths.push('Good sleep quality');
  if (profile?.caffeine_effect === 'no') lifestyleStrengths.push('Does not rely on caffeine');
  if (profile?.immune_system === 'no') lifestyleStrengths.push('Good immune function');
  if (profile?.joint_pain === 'no') lifestyleStrengths.push('No joint pain issues');
  if (profile?.brain_fog === 'no') lifestyleStrengths.push('Good cognitive function');
  if (profile?.mood_changes === 'no') lifestyleStrengths.push('Stable mood');
  
  return `PERSONALIZED HEALTH ANALYSIS FOR ${profile.full_name?.toUpperCase() || 'USER'}

=== PERSONAL PROFILE ===
• Name: ${profile.full_name || 'Not provided'}
• Age: ${profile.age || 'Not specified'} years old
• Gender: ${profile.gender || 'Not specified'}
• Height: ${profile.height_total_inches ? Math.floor(profile.height_total_inches / 12) + "'" + (profile.height_total_inches % 12) + '"' : 'Not specified'}
• Weight: ${profile.weight_lbs ? profile.weight_lbs + ' lbs' : 'Not specified'}

=== ${profile.full_name?.toUpperCase() || 'USER'}'S PRIMARY HEALTH STORY ===
Main Concern: "${profile.primary_health_concern || 'General wellness optimization'}"

${profile.age && profile.age > 40 ? `At ${profile.age} years old, age-related factors may be contributing to health challenges.` : profile.age && profile.age < 30 ? `At ${profile.age}, this is an optimal time to establish strong health foundations.` : `At ${profile.age || 'this'} age, focusing on sustainable health practices is key.`}

=== LIFESTYLE HABITS ASSESSMENT ===
• Activity Level: ${profile.activity_level || 'Not specified'}
• Sleep Hours: ${profile.sleep_hours || 'Not specified'} hours per night
• Alcohol Intake: ${profile.alcohol_intake || 'Not specified'}

=== LIFESTYLE REALITY CHECK ===
Total Health Issues: ${lifestyleIssues.length}/16 (Higher count = more concerning)
Total Positive Factors: ${lifestyleStrengths.length}/16

${lifestyleIssues.length > 10 ? `💪 FOCUS AREAS: ${profile.full_name || 'User'} has ${lifestyleIssues.length} areas to optimize - great opportunity for transformation!` : 
  lifestyleIssues.length > 6 ? `✨ ROOM FOR GROWTH: ${profile.full_name || 'User'} has ${lifestyleIssues.length} areas to enhance - you're ahead of most people!` :
  lifestyleIssues.length > 3 ? `🌟 SOLID FOUNDATION: ${profile.full_name || 'User'} has ${lifestyleIssues.length} areas to fine-tune - excellent baseline health!` :
  `🏆 OUTSTANDING: ${profile.full_name || 'User'} has minimal areas for improvement - you're in the top tier!`}

=== SPECIFIC ISSUES IDENTIFIED ===
${lifestyleIssues.length > 0 ? lifestyleIssues.map(issue => `• ${issue}`).join('\n') : '• No significant lifestyle issues reported'}

=== POSITIVE HEALTH FACTORS ===
${lifestyleStrengths.length > 0 ? lifestyleStrengths.map(strength => `• ${strength}`).join('\n') : '• Limited lifestyle strengths identified'}

=== HEALTH GOALS ===
${profile.health_goals?.length > 0 ? profile.health_goals.join(', ') : 'Not specified'}

=== MEDICAL INFORMATION ===
• Medical Conditions: ${conditions.length > 0 ? conditions.map(c => c.condition_name).join(', ') : 'None reported'}
• Current Medications: ${medications.length > 0 ? medications.map(m => m.medication_name).join(', ') : 'None reported'}
• Known Allergies: ${allergies.length > 0 ? allergies.map(a => a.ingredient_name).join(', ') : 'None reported'}

=== OPTIONAL HEALTH DATA ===
• User-Entered Biomarkers: ${profile.known_biomarkers || 'None provided'}
• User-Entered Genetic Variants: ${profile.known_genetic_variants || 'None provided'}

**PERSONALIZED SCORING FOR ${profile.full_name?.toUpperCase() || 'THIS USER'}:**
- Current issue count (${lifestyleIssues.length}) suggests encouraging score should be: ${
  lifestyleIssues.length > 10 ? '70-80' : 
  lifestyleIssues.length > 6 ? '80-87' :
  lifestyleIssues.length > 3 ? '85-93' : '90-100'
}
- Age factor (${profile.age}): ${profile.age && profile.age > 50 ? 'Reduce score by 5-10 points' : profile.age && profile.age < 25 ? 'Can add 5 points' : 'Neutral factor'}
- Primary concern severity: ${profile.primary_health_concern ? 'Significant concern requiring attention' : 'No major specific concern'}

**SCORING BREAKDOWN:**
1. **Lifestyle Habits (25 points)**: Sleep, activity, alcohol, caffeine, stress
2. **Symptom Burden (25 points)**: Count of "yes" answers (problems) - more issues = lower score
3. **Physical Wellness (25 points)**: Recovery, immune function, weight management, energy
4. **Risk Factors (25 points):**
   - Age, conditions, medications, primary concern severity

**KEY CONSIDERATIONS:**
- ${lifestyleIssues.length} out of 16 lifestyle issues identified (higher count = lower score)
- ${lifestyleStrengths.length} out of 16 positive factors identified (higher count = higher score)
- Primary concern: ${profile.primary_health_concern ? 'Significant concern identified' : 'No major concern specified'}
- Age factor: ${profile.age ? (profile.age > 50 ? 'Older adult' : profile.age > 30 ? 'Middle-aged adult' : 'Young adult') : 'Unknown'}
- Activity level: ${profile.activity_level || 'Unknown'}

FOCUS ON ENCOURAGEMENT: Give scores that motivate users to take action. ${profile.full_name || 'This person'} has real potential for optimization and growth.`;
}

function createFallbackHealthScore(profile: any): any {
  // Simple fallback scoring if AI parsing fails
  let score = 100; // Start from perfect health baseline
  
  // Count lifestyle issues (Yes answers) and build specific holistic recommendations
  const issueMapping = {
    energy_levels: "Do 100 jumping jacks upon waking + eliminate all processed foods + take 20-minute power naps between 1-3pm",
    effort_fatigue: "Start with 5-minute walks daily + eat iron-rich foods (spinach, pumpkin seeds) + ensure 8+ hours sleep nightly",
    digestive_issues: "Eat 1 cup fermented vegetables daily + chew each bite 30 times + avoid eating 3 hours before bed",
    stress_levels: "Practice 4-7-8 breathing (4 count in, 7 hold, 8 out) for 10 minutes morning and evening + take 20-minute nature walks daily",
    mood_changes: "Get 15 minutes direct sunlight within 1 hour of waking + eliminate processed sugar completely + do 50 jumping jacks when feeling low",
    sugar_cravings: "Eat 1 tbsp raw almonds when craving hits + drink 16oz water first + avoid all artificial sweeteners and refined carbs",
    skin_issues: "Eliminate dairy and gluten for 30 days + drink 3 liters water daily + do 5-minute face massage with cold water each morning",
    joint_pain: "Do 10-minute morning joint mobility routine + take 15-minute ice baths 3x/week + eliminate nightshade vegetables for 4 weeks",
    brain_fog: "Do 20 burpees every 2 hours + eliminate gluten for 4 weeks + practice 10-minute meditation daily using breath focus",
    sleep_quality: "No screens 2 hours before bed + sleep in completely dark room + do 50 bodyweight squats 4 hours before bedtime",
    workout_recovery: "Take 10-minute ice baths within 2 hours post-workout + eat 1 cup tart cherries before bed + do 15-minute gentle yoga daily",
    food_sensitivities: "Eliminate top 8 allergens for 21 days + eat only single-ingredient foods + chew each bite 40 times minimum",
    weight_management: "16:8 intermittent fasting + 30-minute strength training 3x/week + walk 10,000 steps daily + no eating after 7pm",
    caffeine_effect: "Replace afternoon coffee with 20 push-ups + drink green tea only before noon + do 5-minute cold exposure daily",
    immune_system: "Get 20 minutes direct sunlight daily + eat 5 different colored vegetables + do 30 seconds cold shower finish daily",
    medication_history: "Practice 20-minute meditation daily + do 30-minute strength training 3x/week + eliminate caffeine and alcohol for 30 days"
  };

  const userIssues: string[] = [];
  const recommendations: string[] = [];
  const concerns: string[] = [];
  const strengths: string[] = [];

  // Check each issue and build personalized recommendations
  Object.entries(issueMapping).forEach(([field, recommendation]) => {
    if (profile?.[field] === 'yes') {
      userIssues.push(field);
      recommendations.push(recommendation);
      concerns.push(field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    } else if (profile?.[field] === 'no') {
      strengths.push(`Good ${field.replace(/_/g, ' ')}`);
    }
  });

  const issueCount = userIssues.length;
  
  // Adjust score based on issues
  score -= issueCount * 1.5; // Reduce penalty (was 3 points per issue)
  
  // Age adjustment
  if (profile?.age > 50) score -= 5;
  if (profile?.age < 25) score += 5;
  
  // Activity level adjustment
  if (profile?.activity_level === 'very_active') score += 5;
  if (profile?.activity_level === 'sedentary') score -= 5;
  
  score = Math.max(50, Math.min(95, score)); // Keep within reasonable bounds
  
  return {
    healthScore: score,
    scoreBreakdown: {
      lifestyleHabits: Math.max(15, 25 - Math.floor(issueCount * 0.6)),
      symptomBurden: Math.max(15, 25 - Math.floor(issueCount * 0.8)),
      physicalWellness: Math.max(18, 25 - Math.floor(issueCount * 0.4)),
      riskFactors: Math.max(18, 25 - (profile?.age > 50 ? 2 : 0))
    },
    summary: `Health score of ${score} based on ${issueCount} areas for optimization. ${issueCount > 8 ? 'Great opportunity for transformation with targeted improvements.' : issueCount > 4 ? 'Solid foundation with several areas to enhance.' : 'Excellent baseline health with minimal areas for fine-tuning.'}`,
    strengths: strengths.length > 0 ? strengths.slice(0, 4) : ["Completed comprehensive health assessment"],
    concerns: concerns.length > 0 ? concerns.slice(0, 4) : ["No major lifestyle concerns identified"],
    topRecommendations: recommendations.length > 0 ? recommendations.slice(0, 6) : [
      "Implement 16:8 intermittent fasting for metabolic optimization",
      "Walk 10,000 steps daily and do 30-minute strength training 3x/week",
      "Get 15 minutes direct sunlight within 1 hour of waking daily",
      "Practice 10 minutes of meditation daily for stress management",
      "Eliminate all processed foods and refined sugars from your diet",
      "Do 5-minute cold exposure (cold shower finish) every morning"
    ],
    scoreExplanation: `Score calculated based on ${issueCount} lifestyle areas for optimization from your 16-question assessment, activity level (${profile?.activity_level || 'unknown'}), and age factors. Each area identified provides opportunity for improvement, while positive lifestyle factors increase your score.`
  };
} 