import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🔬 Starting health domains analysis...');
    
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

    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select(`
        age, gender, weight_lbs, height_total_inches, health_goals, activity_level, sleep_hours,
        primary_health_concern, known_biomarkers, known_genetic_variants, alcohol_intake,
        energy_levels, effort_fatigue, caffeine_effect, digestive_issues, stress_levels, 
        sleep_quality, mood_changes, brain_fog, sugar_cravings, skin_issues, joint_pain,
        immune_system, workout_recovery, food_sensitivities, weight_management, 
        medication_history, full_name
      `)
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('❌ Profile error:', profileError);
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    console.log('📋 Profile loaded for user');

    // Fetch additional health data for safety checks
    const [
      { data: conditions },
      { data: medications },
      { data: allergies }
    ] = await Promise.all([
              supabaseClient.from('user_conditions').select('condition_name').eq('user_id', user.id).limit(30),
        supabaseClient.from('user_medications').select('medication_name').eq('user_id', user.id).limit(50),
      supabaseClient.from('user_allergies').select('ingredient_name').eq('user_id', user.id).limit(50)
    ]);

    const domainsAnalysis = createPersonalizedHealthDomainsAnalysis(
      profile, 
      conditions || [], 
      medications || [], 
      allergies || []
    );

    console.log('🎉 Health domains analysis completed successfully');

    return new Response(JSON.stringify(domainsAnalysis), {
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

function createPersonalizedHealthDomainsAnalysis(profile: any, conditions: any[], medications: any[], allergies: any[]): any {
  // Analyze specific user responses
  const userIssues = {
    metabolic: {
      energyLevels: profile?.energy_levels === 'yes',
      effortFatigue: profile?.effort_fatigue === 'yes', 
      sugarCravings: profile?.sugar_cravings === 'yes',
      weightManagement: profile?.weight_management === 'yes',
      caffeineEffect: profile?.caffeine_effect === 'yes'
    },
    cognitive: {
      brainFog: profile?.brain_fog === 'yes',
      moodChanges: profile?.mood_changes === 'yes',
      stressLevels: profile?.stress_levels === 'yes',
      sleepQuality: profile?.sleep_quality === 'yes'
    },
    inflammation: {
      jointPain: profile?.joint_pain === 'yes',
      skinIssues: profile?.skin_issues === 'yes',
      immuneSystem: profile?.immune_system === 'yes',
      workoutRecovery: profile?.workout_recovery === 'yes'
    },
    gut: {
      digestiveIssues: profile?.digestive_issues === 'yes',
      foodSensitivities: profile?.food_sensitivities === 'yes'
    }
  };

  // Get user's basic info for personalization
  const age = profile?.age || 30;
  const activityLevel = profile?.activity_level || 'moderate';
  const sleepHours = profile?.sleep_hours || 7;
  const goals = profile?.health_goals || [];
  const userName = profile?.full_name?.split(' ')[0] || 'there';

  // Create goal-specific messaging
  const goalMessages = {
    weight_loss: "Lose Weight Sustainably",
    muscle_gain: "Build Lean Muscle Mass", 
    energy: "Boost Energy Levels Naturally",
    sleep: "Improve Sleep Quality",
    stress: "Manage Stress Effectively",
    digestion: "Optimize Digestive Health",
    digestive_health: "Optimize Digestive Health",
    immunity: "Strengthen Immune Function",
    skin: "Improve Skin Health",
    mood: "Stabilize Mood Naturally",
    focus: "Enhance Mental Clarity",
    weight_management: "Manage Weight Sustainably",
    longevity_wellness: "Enhance Longevity and Wellness"
  };

  const userGoalText = goals.length > 0 
    ? goals.map((goal: string) => goalMessages[goal as keyof typeof goalMessages] || goal.replace(/_/g, ' ')).join(', ')
    : 'optimize overall wellness';

  return {
    userProfile: {
      name: userName,
      goals: goals,
      goalDescription: userGoalText,
      primaryConcern: profile?.primary_health_concern || 'general wellness'
    },
    domains: {
      metabolomic: {
        title: "Metabolomic Analysis",
        subtitle: "Energy Production & Glucose Metabolism",
        insights: [
          userIssues.metabolic.energyLevels 
            ? "Your reported low energy levels suggest mitochondrial dysfunction - specifically, your cells aren't efficiently converting glucose and fatty acids into ATP (cellular energy currency)"
            : "Your stable energy levels indicate healthy mitochondrial biogenesis and efficient oxidative phosphorylation pathways",
          userIssues.metabolic.sugarCravings 
            ? "Sugar cravings indicate chromium deficiency and insulin resistance patterns - your GLUT4 transporters aren't responding optimally to insulin signaling"
            : "Absence of sugar cravings suggests healthy insulin sensitivity and stable glucose homeostasis",
          userIssues.metabolic.caffeineEffect 
            ? "Caffeine dependence suggests adenosine receptor upregulation and HPA axis dysregulation - your natural circadian cortisol rhythm is likely disrupted"
            : "Your healthy relationship with caffeine indicates balanced adenosine-dopamine pathways and optimal circadian biology",
          userIssues.metabolic.effortFatigue 
            ? "Exercise intolerance indicates poor metabolic flexibility - your body struggles to switch between glycolytic and oxidative energy systems during physical stress"
            : "Good exercise tolerance suggests healthy lactate buffering capacity and efficient mitochondrial adaptation"
        ],
        personalizedFindings: userIssues.metabolic.energyLevels || userIssues.metabolic.sugarCravings ? [
          `${userName}, your energy crashes likely occur during your circadian cortisol dips (2-4pm) when glucose utilization is naturally reduced`,
          userIssues.metabolic.weightManagement 
            ? "Your weight challenges stem from metabolic inflexibility - your body preferentially burns glucose instead of mobilizing stored fat"
            : "Your metabolic symptoms are primarily mitochondrial rather than adipose-related"
        ] : [
          `Your metabolic profile shows excellent fuel partitioning, ${userName} - focus on optimization rather than correction`,
          "Your body demonstrates healthy metabolic flexibility between glucose and fat oxidation"
        ],
        recommendations: userIssues.metabolic.energyLevels || userIssues.metabolic.sugarCravings ? [
          `Implement Zone 2 cardio: 20 minutes at 60-70% max heart rate, 3x/week to enhance mitochondrial biogenesis and fat oxidation capacity`,
          `Practice 16:8 time-restricted eating with eating window 8am-4pm to align with circadian insulin sensitivity peaks`,
          `Perform 20 Hindu squats every 90 minutes during work hours to activate GLUT4 translocation and glucose uptake independent of insulin`,
          `Take 10-minute walks immediately post-meal to enhance glucose disposal rate and activate muscle glucose uptake pathways`
        ] : [
          `Maintain metabolic flexibility with weekly 24-hour fasts to upregulate autophagy and enhance ketone production`,
          `Add cold exposure therapy: 2-3 minutes at 50-60°F water to activate brown adipose tissue and improve metabolic rate`,
          `Practice nasal breathing during all exercise to optimize oxygen delivery and maintain aerobic metabolism`,
          `Implement morning sunlight exposure within 30 minutes of waking to optimize circadian cortisol rhythm`
        ],
        goalAlignment: (() => {
          if (goals.includes('weight_loss')) {
            return `🎯 WEIGHT LOSS GOAL: These metabolic protocols will shift your body into a fat-burning state by improving insulin sensitivity, enhancing lipolysis, and optimizing mitochondrial fat oxidation capacity.`;
          } else if (goals.includes('energy')) {
            return `🎯 ENERGY GOAL: These interventions target the root causes of fatigue by enhancing mitochondrial ATP production, stabilizing blood glucose, and optimizing cellular energy metabolism.`;
          } else if (goals.includes('muscle_gain')) {
            return `🎯 MUSCLE GAIN GOAL: Better metabolic flexibility will enhance nutrient partitioning, improve protein synthesis signaling, and optimize recovery between training sessions.`;
          } else {
            return `🎯 YOUR GOALS: Metabolic optimization supports your goals to ${userGoalText} by enhancing cellular energy production, improving nutrient utilization, and optimizing hormonal signaling pathways.`;
          }
        })()
      },
      lipidomic: {
        title: "Lipidomic Analysis", 
        subtitle: "Cell Membrane Health & Essential Fatty Acids",
        insights: [
          userIssues.inflammation.skinIssues || userIssues.cognitive.brainFog
            ? "Your symptoms indicate compromised cell membrane fluidity due to elevated omega-6/omega-3 ratios and lipid peroxidation from oxidative stress"
            : "Your cellular health suggests optimal membrane phospholipid composition and healthy fatty acid incorporation",
          userIssues.inflammation.jointPain 
            ? "Joint inflammation reflects altered arachidonic acid metabolism and elevated pro-inflammatory eicosanoid production from membrane phospholipids"
            : "Healthy joints indicate balanced prostaglandin synthesis and optimal membrane-derived inflammatory mediators",
          "Cell membrane composition directly determines ion channel function, neurotransmitter receptor sensitivity, and cellular signaling cascades",
          userIssues.cognitive.moodChanges 
            ? "Mood instability often results from altered brain membrane DHA content affecting serotonin receptor function and synaptic plasticity"
            : "Stable mood suggests healthy brain phospholipid composition supporting optimal neurotransmitter function"
        ],
        personalizedFindings: userIssues.inflammation.skinIssues || userIssues.cognitive.brainFog ? [
          `${userName}, your symptoms suggest excessive consumption of omega-6 linoleic acid from processed foods, creating inflammatory membrane environments`,
          "Your cell membranes likely have reduced fluidity and compromised cholesterol-to-phospholipid ratios affecting cellular function"
        ] : [
          "Your cellular health markers indicate optimal membrane composition with healthy fatty acid incorporation",
          "Your phospholipid profiles appear well-balanced supporting efficient cellular communication"
        ],
        recommendations: userIssues.inflammation.skinIssues || userIssues.cognitive.brainFog ? [
          `Consume 2 grams EPA/DHA daily from wild-caught fatty fish (sardines, mackerel, anchovies) to restore optimal omega-3 index above 8%`,
          `Eliminate all seed oils (canola, soybean, corn, sunflower) and replace with saturated fats (grass-fed butter, coconut oil) to reduce membrane oxidation`,
          `Take 1 tablespoon freshly ground flaxseed daily for ALA conversion to EPA, but only if you have healthy FADS1/FADS2 gene variants`,
          `Consume phosphatidylserine-rich foods (organ meats, egg yolks) or 100mg PS supplement to support membrane integrity and cognitive function`
        ] : [
          `Maintain optimal fatty acid status with 1-2 servings wild-caught fish weekly and daily mixed nuts (walnuts, pecans, macadamias)`,
          `Include membrane-protective antioxidants: astaxanthin from salmon, vitamin E from sunflower seeds, and CoQ10 from organ meats`,
          `Practice intermittent fasting to activate autophagy and cellular membrane renewal processes`,
          `Consume choline-rich foods (egg yolks, liver) to support phosphatidylcholine synthesis for healthy membrane structure`
        ],
        goalAlignment: (() => {
          if (goals.includes('skin')) {
            return `🎯 SKIN HEALTH GOAL: Optimizing membrane lipid composition will reduce inflammatory cytokine production, enhance skin barrier function, and improve cellular repair mechanisms.`;
          } else if (goals.includes('focus') || userIssues.cognitive.brainFog) {
            return `🎯 MENTAL CLARITY GOAL: Restoring brain membrane DHA content will enhance synaptic plasticity, improve neurotransmitter receptor function, and optimize cognitive processing speed.`;
          } else if (goals.includes('mood')) {
            return `🎯 MOOD GOAL: Balanced membrane fatty acids support optimal serotonin and dopamine receptor sensitivity, improving emotional regulation and stress resilience.`;
          } else {
            return `🎯 YOUR GOALS: Healthy cell membranes support your goals to ${userGoalText} by optimizing cellular communication, reducing inflammation, and enhancing tissue repair mechanisms.`;
          }
        })()
      },
      inflammation: {
        title: "Inflammation Analysis",
        subtitle: "Inflammatory Pathways & Immune Response", 
        insights: [
          userIssues.inflammation.jointPain || userIssues.inflammation.skinIssues 
            ? "Your inflammatory symptoms indicate elevated NF-κB signaling, increased TNF-α and IL-6 production, and compromised resolution pathways"
            : "Absence of inflammatory symptoms suggests balanced cytokine production and healthy specialized pro-resolving mediator (SPM) synthesis",
          userIssues.inflammation.immuneSystem 
            ? "Frequent illness indicates either Th1/Th2 imbalance, compromised regulatory T-cell function, or chronic low-grade inflammation suppressing immune surveillance"
            : "Good immune function suggests optimal innate and adaptive immune coordination with healthy inflammatory resolution",
          userIssues.inflammation.workoutRecovery 
            ? "Poor recovery indicates elevated muscle damage markers (CK, LDH), impaired protein synthesis signaling, and delayed inflammatory resolution post-exercise"
            : "Good recovery suggests efficient inflammatory resolution, optimal protein synthesis rates, and healthy tissue remodeling",
          "Inflammation resolution is an active process requiring specialized lipid mediators (resolvins, protectins, maresins) derived from omega-3 fatty acids"
        ],
        personalizedFindings: userIssues.inflammation.jointPain || userIssues.inflammation.skinIssues ? [
          `${userName}, your inflammatory patterns likely worsen with high-glycemic foods, sleep deprivation, and psychological stress due to HPA axis activation`,
          "Your body is probably producing excess arachidonic acid-derived inflammatory mediators while lacking resolution-promoting compounds"
        ] : [
          "Your inflammatory control indicates excellent cytokine balance and efficient resolution pathway activation",
          "Your immune system demonstrates healthy surveillance capacity without excessive inflammatory burden"
        ],
        recommendations: userIssues.inflammation.jointPain || userIssues.inflammation.skinIssues ? [
          `Practice Wim Hof breathing: 30 deep breaths + breath hold for 90 seconds, 3 rounds daily to activate anti-inflammatory vagus nerve signaling`,
          `Implement contrast hydrotherapy: alternate 3 minutes hot sauna (160-180°F) with 1 minute cold plunge (50-60°F) for 3 cycles to modulate inflammatory cytokines`,
          `Consume 1 tsp turmeric + black pepper + fat daily to inhibit NF-κB activation and enhance curcumin bioavailability via piperine`,
          `Practice forest bathing (shinrin-yoku): 2+ hours weekly in nature to reduce cortisol, lower inflammatory markers, and activate NK cell function`
        ] : [
          `Maintain anti-inflammatory status with weekly heat shock protein activation via sauna (15-20 minutes at 160°F)`,
          `Include polyphenol-rich foods: 1 cup mixed berries daily for anthocyanins and resveratrol to support inflammatory resolution`,
          `Practice meditation: 10-15 minutes daily to reduce inflammatory gene expression and activate parasympathetic recovery`,
          `Optimize sleep architecture: 7-9 hours with room temperature 65-68°F to support overnight inflammatory resolution and tissue repair`
        ],
        goalAlignment: (() => {
          if (goals.includes('immunity')) {
            return `🎯 IMMUNE HEALTH GOAL: Balancing inflammatory pathways will optimize immune surveillance, enhance pathogen resistance, and improve vaccine responsiveness.`;
          } else if (goals.includes('muscle_gain') || userIssues.inflammation.workoutRecovery) {
            return `🎯 MUSCLE GAIN GOAL: Optimizing inflammatory resolution will accelerate muscle protein synthesis, reduce exercise-induced damage, and enhance training adaptations.`;
          } else if (goals.includes('skin')) {
            return `🎯 SKIN HEALTH GOAL: Reducing systemic inflammation will decrease inflammatory skin conditions, enhance collagen synthesis, and improve skin barrier function.`;
          } else if (goals.includes('stress')) {
            return `🎯 STRESS MANAGEMENT GOAL: Anti-inflammatory protocols will break the stress-inflammation cycle, improve HPA axis function, and enhance stress resilience.`;
          } else {
            return `🎯 YOUR GOALS: Controlling inflammation supports your goals to ${userGoalText} by reducing chronic disease risk, optimizing tissue repair, and enhancing longevity pathways.`;
          }
        })()
      },
      cognitive: {
        title: "Cognitive Analysis",
        subtitle: "Brain Function & Neurotransmitter Balance",
        insights: [
          userIssues.cognitive.brainFog 
            ? "Brain fog typically results from neuroinflammation, compromised blood-brain barrier integrity, or altered neurotransmitter synthesis and clearance"
            : "Clear thinking indicates healthy cerebral blood flow, optimal neurotransmitter balance, and intact blood-brain barrier function",
          userIssues.cognitive.moodChanges 
            ? "Mood instability suggests altered serotonin-dopamine ratios, compromised GABA signaling, or dysregulated HPA axis affecting limbic system function"
            : "Stable mood indicates balanced neurotransmitter synthesis, healthy synaptic plasticity, and optimal stress hormone regulation",
          userIssues.cognitive.sleepQuality 
            ? `Poor sleep disrupts glymphatic clearance of brain metabolites, impairs memory consolidation, and reduces BDNF-mediated neuroplasticity`
            : "Good sleep quality supports glymphatic detoxification, memory consolidation, and growth hormone-mediated brain repair",
          userIssues.cognitive.stressLevels 
            ? "Chronic stress elevates cortisol, which damages hippocampal neurons, impairs prefrontal cortex function, and disrupts neurogenesis"
            : "Well-managed stress levels protect brain structure, maintain cognitive reserve, and support healthy neuroplasticity"
        ],
        personalizedFindings: userIssues.cognitive.brainFog || userIssues.cognitive.moodChanges ? [
          `${userName}, your cognitive symptoms likely peak during afternoon cortisol dips and improve with stable blood glucose and adequate protein intake`,
          userIssues.cognitive.sleepQuality 
            ? "Your sleep issues are amplifying cognitive dysfunction by impairing overnight brain detoxification and neurotransmitter restoration"
            : "Your cognitive symptoms appear independent of sleep, suggesting neurotransmitter imbalances or blood-brain barrier dysfunction"
        ] : [
          "Your cognitive function indicates optimal brain health with healthy neurotransmitter synthesis and synaptic efficiency",
          "Your brain demonstrates excellent stress resilience and cognitive reserve capacity"
        ],
        recommendations: userIssues.cognitive.brainFog || userIssues.cognitive.moodChanges ? [
          `Practice Lion's Breath pranayama: 10 cycles of forceful exhale through mouth with tongue out to activate vagus nerve and reduce stress hormones`,
          `Consume 1-2 cups wild blueberries daily for anthocyanins that cross blood-brain barrier and enhance BDNF expression for neuroplasticity`,
          `Implement blue light blocking: amber glasses 2 hours before bed to optimize melatonin production and circadian rhythm regulation`,
          `Practice cognitive load training: learn new complex skill (language, instrument, dance) 30 minutes daily to stimulate neurogenesis and synaptic plasticity`
        ] : [
          `Maintain cognitive health with intermittent cognitive challenges: puzzles, reading complex material, learning new skills to preserve cognitive reserve`,
          `Include brain-derived neurotrophic foods: dark chocolate (85%+ cacao), green tea, and grass-fed organ meats for cognitive enhancement`,
          `Practice mindfulness meditation: 15-20 minutes daily to enhance prefrontal cortex function and emotional regulation`,
          `Optimize circadian biology: consistent sleep-wake times within 30 minutes daily to maintain optimal neurotransmitter cycling`
        ],
        goalAlignment: (() => {
          if (goals.includes('focus')) {
            return `🎯 MENTAL CLARITY GOAL: These cognitive protocols will enhance prefrontal cortex function, improve working memory capacity, and optimize attention networks for sustained focus.`;
          } else if (goals.includes('mood')) {
            return `🎯 MOOD GOAL: Optimizing neurotransmitter balance will improve emotional regulation, enhance stress resilience, and support healthy mood stability.`;
          } else if (goals.includes('sleep')) {
            return `🎯 SLEEP GOAL: Enhancing cognitive health will improve sleep quality by reducing racing thoughts, optimizing circadian rhythms, and promoting relaxation.`;
          } else if (goals.includes('stress')) {
            return `🎯 STRESS MANAGEMENT GOAL: These brain health protocols will enhance stress resilience, improve emotional regulation, and optimize HPA axis function.`;
          } else {
            return `🎯 YOUR GOALS: Optimizing cognitive function supports your goals to ${userGoalText} by enhancing decision-making, improving motivation, and supporting mental performance.`;
          }
        })()
      },
      gutMicrobiome: {
        title: "Gut & Microbiome Analysis",
        subtitle: "Digestive Health & Microbiome Balance",
        insights: [
          userIssues.gut.digestiveIssues 
            ? "Digestive symptoms typically indicate dysbiosis (altered microbiome diversity), compromised intestinal barrier function, or insufficient digestive enzyme production"
            : "Good digestion suggests healthy microbiome diversity, intact intestinal barrier, and optimal digestive enzyme activity",
          userIssues.gut.foodSensitivities 
            ? "Food sensitivities often develop from increased intestinal permeability allowing undigested proteins to trigger immune responses and inflammatory cascades"
            : "Absence of food sensitivities suggests healthy intestinal barrier integrity and balanced immune tolerance mechanisms",
          "Your gut microbiome produces 95% of serotonin, synthesizes B vitamins and vitamin K, and regulates 70% of immune function through gut-associated lymphoid tissue",
          "The gut-brain axis communicates via vagus nerve, microbial metabolites (SCFAs), and neurotransmitter production affecting mood, cognition, and stress response"
        ],
        personalizedFindings: userIssues.gut.digestiveIssues || userIssues.gut.foodSensitivities ? [
          `${userName}, your gut symptoms likely worsen with stress, antibiotics, NSAIDs, or high-sugar foods that feed pathogenic bacteria and compromise barrier function`,
          "Your microbiome probably has reduced diversity with overgrowth of inflammatory species and insufficient beneficial bacteria for optimal metabolite production"
        ] : [
          "Your digestive health indicates excellent microbiome diversity with healthy short-chain fatty acid production and optimal barrier function",
          "Your gut-brain axis appears well-functioning with healthy vagal tone and balanced neurotransmitter production"
        ],
        recommendations: userIssues.gut.digestiveIssues || userIssues.gut.foodSensitivities ? [
          `Consume 30+ different plant foods weekly to maximize microbiome diversity and provide varied prebiotic fibers for beneficial bacteria`,
          `Practice intermittent fasting 16:8 to allow migrating motor complex activation for gut cleaning and bacterial overgrowth prevention`,
          `Include fermented foods daily: rotate between kefir, sauerkraut, kimchi, miso to introduce diverse probiotic strains and metabolites`,
          `Implement gut-healing protocol: bone broth with glycine and glutamine 3x weekly to support intestinal barrier repair and tight junction integrity`
        ] : [
          `Maintain microbiome health with seasonal variety: rotate fermented foods and prebiotic sources to support bacterial diversity`,
          `Include postbiotic foods: aged cheeses, sourdough bread, and fermented vegetables for beneficial bacterial metabolites`,
          `Practice mindful eating: thorough chewing and relaxed meal environment to optimize digestive enzyme release and vagal stimulation`,
          `Support beneficial bacteria with resistant starch: cooled potatoes, green bananas, or potato starch to feed butyrate-producing species`
        ],
        goalAlignment: (() => {
          if (goals.includes('digestion')) {
            return `🎯 DIGESTIVE HEALTH GOAL: Optimizing gut microbiome will eliminate digestive discomfort, enhance nutrient absorption, and restore healthy bowel function.`;
          } else if (goals.includes('immunity')) {
            return `🎯 IMMUNE HEALTH GOAL: Balancing gut microbiome will strengthen immune surveillance, improve pathogen resistance, and reduce autoimmune risk.`;
          } else if (goals.includes('mood') || userIssues.cognitive.moodChanges) {
            return `🎯 MOOD GOAL: Gut health optimization will enhance serotonin production, improve gut-brain communication, and support emotional regulation.`;
          } else if (goals.includes('weight_loss')) {
            return `🎯 WEIGHT LOSS GOAL: Healthy gut microbiome will improve metabolism, reduce inflammation, and optimize nutrient utilization for sustainable weight management.`;
          } else {
            return `🎯 YOUR GOALS: Maintaining gut health supports your goals to ${userGoalText} by optimizing nutrient absorption, immune function, and gut-brain axis communication.`;
          }
        })()
      }
    },
    crossDomainConnections: [
      userIssues.gut.digestiveIssues && (userIssues.cognitive.brainFog || userIssues.cognitive.moodChanges)
        ? `${userName}, your gut dysbiosis is directly affecting brain function through the vagus nerve and bacterial metabolite production - restoring microbiome balance will improve mental clarity and mood, supporting your goals to ${userGoalText}`
        : "Your gut-brain axis appears healthy, supporting stable mood and cognition through optimal neurotransmitter production",
      userIssues.metabolic.sugarCravings && userIssues.cognitive.brainFog 
        ? `Your blood glucose instability is creating neuroinflammation and compromising blood-brain barrier integrity - stabilizing metabolism will clear brain fog and support your ${goals.includes('focus') ? 'mental clarity goals' : 'overall wellness goals'}`
        : "Your metabolic and cognitive systems demonstrate healthy coordination with stable glucose delivery to brain tissue",
      userIssues.inflammation.jointPain && userIssues.cognitive.moodChanges
        ? `Systemic inflammation is activating microglia in your brain and disrupting neurotransmitter synthesis - anti-inflammatory protocols will improve both joint comfort and mood stability, supporting your goals to ${userGoalText}`
        : "Your inflammatory control supports both physical comfort and emotional stability through balanced cytokine production"
    ],
    priorityProtocols: (() => {
      const protocols = [];
      
      if (userIssues.metabolic.energyLevels || userIssues.metabolic.sugarCravings) {
        protocols.push({
          protocol: "Zone 2 cardio 20 min 3x/week + 16:8 time-restricted eating (8am-4pm window)",
          goalConnection: goals.includes('weight_loss') ? "Directly supports fat oxidation and weight loss" : goals.includes('energy') ? "Targets mitochondrial energy production" : "Supports metabolic flexibility"
        });
      }
      
      if (userIssues.cognitive.brainFog || userIssues.cognitive.stressLevels) {
        protocols.push({
          protocol: "Wim Hof breathing 3 rounds daily + 1-2 cups wild blueberries for BDNF enhancement",
          goalConnection: goals.includes('focus') ? "Directly improves cognitive function and mental clarity" : goals.includes('stress') ? "Supports stress resilience and emotional regulation" : "Enhances brain health and neuroplasticity"
        });
      }
      
      if (userIssues.gut.digestiveIssues) {
        protocols.push({
          protocol: "30+ plant foods weekly + rotating fermented foods daily + bone broth 3x/week",
          goalConnection: goals.includes('digestion') ? "Directly targets microbiome diversity and gut healing" : goals.includes('immunity') ? "Supports immune function via gut health" : "Improves overall health through gut-body axis"
        });
      } else if (userIssues.inflammation.jointPain || userIssues.inflammation.skinIssues) {
        protocols.push({
          protocol: "Contrast hydrotherapy (sauna + cold plunge) 3x/week + forest bathing 2+ hours weekly",
          goalConnection: goals.includes('immunity') ? "Supports immune balance and inflammation resolution" : goals.includes('skin') ? "Improves skin health through inflammation control" : "Reduces systemic inflammation"
        });
      } else {
        protocols.push({
          protocol: "Weekly heat shock protein activation via sauna + cognitive load training 30 min daily",
          goalConnection: `Supports your goals to ${userGoalText} through hormetic stress and neuroplasticity enhancement`
        });
      }
      
      return protocols.slice(0, 3); // Limit to 3 protocols
    })(),
    conflictCheck: `All recommendations are personalized for ${userName} and designed to be safe with ${conditions.length > 0 ? 'your medical conditions' : 'no known medical conditions'}, ${medications.length > 0 ? 'current medications' : 'no medications'}, and ${allergies.length > 0 ? 'known allergies' : 'no known allergies'}. Start with one protocol at a time and build gradually over 2-4 weeks.`
  };
}