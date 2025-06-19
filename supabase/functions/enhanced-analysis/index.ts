import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ✅ 2. SIMPLE BIOMARKER INTERPRETATION - Only for markers we actually know
function interpretBiomarker(name: string, value: number, unit: string, referenceRange?: string) {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '_')
  
  // Comprehensive biomarker interpretation database
  const knownBiomarkers: Record<string, {
    displayName: string,
    optimalRange: { min: number, max: number },
    unit: string,
    category: string,
    insights: {
      low: { why: string, lifestyle: string, supplement: string },
      high: { why: string, lifestyle: string, supplement: string },
      optimal: { why: string, lifestyle: string, supplement: string }
    }
  }> = {
    // CARDIOVASCULAR MARKERS
    'crp': {
      displayName: 'C-Reactive Protein',
      optimalRange: { min: 0, max: 1.0 },
      unit: 'mg/L',
      category: 'inflammation',
      insights: {
        low: {
          why: 'Low CRP indicates minimal inflammation, which is excellent for cardiovascular health.',
          lifestyle: 'Continue anti-inflammatory diet and regular exercise.',
          supplement: 'Maintain omega-3 intake for continued anti-inflammatory support.'
        },
        high: {
          why: 'Elevated CRP indicates systemic inflammation, increasing cardiovascular and chronic disease risk.',
          lifestyle: 'Eliminate processed foods, increase omega-3 rich fish, add 30min daily walking.',
          supplement: 'Omega-3 (2000mg EPA/DHA), curcumin (500mg), consider vitamin D if deficient.'
        },
        optimal: {
          why: 'Your CRP is in the optimal range, indicating low systemic inflammation.',
          lifestyle: 'Continue current anti-inflammatory lifestyle practices.',
          supplement: 'Maintain omega-3 and antioxidant intake for continued support.'
        }
      }
    },
    'cholesterol_total': {
      displayName: 'Total Cholesterol',
      optimalRange: { min: 150, max: 200 },
      unit: 'mg/dL',
      category: 'cardiovascular',
      insights: {
        low: {
          why: 'Very low cholesterol may indicate poor nutrient absorption or underlying health issues.',
          lifestyle: 'Include healthy fats like avocados, nuts, olive oil in your diet.',
          supplement: 'Consider CoQ10 and ensure adequate fat-soluble vitamin intake.'
        },
        high: {
          why: 'Elevated total cholesterol increases cardiovascular disease risk.',
          lifestyle: 'Reduce saturated fats, increase fiber intake, exercise 150min/week.',
          supplement: 'Plant sterols (2g/day), red yeast rice, or berberine may help.'
        },
        optimal: {
          why: 'Your total cholesterol is in a healthy range for cardiovascular protection.',
          lifestyle: 'Continue heart-healthy diet with regular physical activity.',
          supplement: 'Omega-3 and CoQ10 support continued cardiovascular health.'
        }
      }
    },
    'hdl_c': {
      displayName: 'HDL Cholesterol',
      optimalRange: { min: 50, max: 999 },
      unit: 'mg/dL',
      category: 'cardiovascular',
      insights: {
        low: {
          why: 'Low HDL cholesterol reduces your body\'s ability to remove harmful cholesterol from arteries.',
          lifestyle: 'Increase aerobic exercise, reduce refined carbs, add healthy fats.',
          supplement: 'Niacin (under medical supervision), omega-3, consider berberine.'
        },
        high: {
          why: 'High HDL cholesterol is protective against cardiovascular disease.',
          lifestyle: 'Continue current exercise routine and healthy fat intake.',
          supplement: 'Maintain omega-3 and antioxidant support.'
        },
        optimal: {
          why: 'Your HDL cholesterol provides good cardiovascular protection.',
          lifestyle: 'Continue regular exercise and healthy fat consumption.',
          supplement: 'Omega-3 and antioxidants support continued HDL function.'
        }
      }
    },
    'ldl_c': {
      displayName: 'LDL Cholesterol',
      optimalRange: { min: 0, max: 100 },
      unit: 'mg/dL',
      category: 'cardiovascular',
      insights: {
        low: {
          why: 'Very low LDL is generally protective against cardiovascular disease.',
          lifestyle: 'Continue current heart-healthy lifestyle practices.',
          supplement: 'Maintain omega-3 and antioxidant support for continued protection.'
        },
        high: {
          why: 'Elevated LDL cholesterol is a major risk factor for heart disease and stroke.',
          lifestyle: 'Reduce saturated fats, increase soluble fiber, exercise 150min/week.',
          supplement: 'Plant sterols (2g/day), berberine (500mg 2x/day), red yeast rice.'
        },
        optimal: {
          why: 'Your LDL cholesterol is in the optimal range for cardiovascular protection.',
          lifestyle: 'Continue heart-healthy diet with regular physical activity.',
          supplement: 'Omega-3 and CoQ10 support continued cardiovascular health.'
        }
      }
    },
    'triglycerides': {
      displayName: 'Triglycerides',
      optimalRange: { min: 0, max: 100 },
      unit: 'mg/dL',
      category: 'metabolic',
      insights: {
        low: {
          why: 'Low triglycerides indicate excellent metabolic health and insulin sensitivity.',
          lifestyle: 'Continue current low-carb or metabolically healthy eating pattern.',
          supplement: 'Maintain current supplement regimen supporting metabolic health.'
        },
        high: {
          why: 'Elevated triglycerides indicate insulin resistance and increased cardiovascular risk.',
          lifestyle: 'Reduce refined carbs and sugars, increase protein and healthy fats.',
          supplement: 'Omega-3 (2-4g/day), berberine (500mg 2x/day), chromium picolinate.'
        },
        optimal: {
          why: 'Your triglycerides indicate good metabolic health and insulin sensitivity.',
          lifestyle: 'Continue balanced macronutrient intake with regular exercise.',
          supplement: 'Omega-3 and chromium support continued metabolic health.'
        }
      }
    },
    'homocysteine': {
      displayName: 'Homocysteine',
      optimalRange: { min: 0, max: 7 },
      unit: 'μmol/L',
      category: 'cardiovascular',
      insights: {
        low: {
          why: 'Low homocysteine indicates excellent methylation and cardiovascular protection.',
          lifestyle: 'Continue current B-vitamin rich diet and healthy lifestyle.',
          supplement: 'Maintain B-complex for continued methylation support.'
        },
        high: {
          why: 'Elevated homocysteine increases cardiovascular disease and stroke risk.',
          lifestyle: 'Increase leafy greens, reduce alcohol, manage stress levels.',
          supplement: 'Methylated B-complex (B6, B12, folate), betaine, TMG.'
        },
        optimal: {
          why: 'Your homocysteine levels indicate good methylation and cardiovascular health.',
          lifestyle: 'Continue B-vitamin rich foods and regular exercise.',
          supplement: 'B-complex supports continued optimal methylation.'
        }
      }
    },

    // METABOLIC MARKERS - COMPREHENSIVE DIABETES & METABOLIC SYNDROME PREVENTION
    'glucose': {
      displayName: 'Fasting Glucose',
      optimalRange: { min: 70, max: 85 },
      unit: 'mg/dL',
      category: 'metabolic',
      insights: {
        low: {
          why: 'Low fasting glucose may indicate reactive hypoglycemia, adrenal dysfunction, or excessive insulin sensitivity. This can lead to energy crashes, brain fog, and increased cortisol production.',
          lifestyle: 'Eat protein-rich breakfast within 1 hour of waking. Include healthy fats with each meal. Avoid intermittent fasting >14 hours. Consider 5-6 smaller meals vs 3 large ones.',
          supplement: 'Chromium picolinate 200mcg 2x/day, alpha-lipoic acid 300mg before meals, B-complex for adrenal support, magnesium glycinate 400mg evening.'
        },
        high: {
          why: 'Elevated fasting glucose (>85 mg/dL) is the earliest sign of insulin resistance and metabolic dysfunction. Even "normal" levels >90 mg/dL triple diabetes risk over 10 years. This damages blood vessels, accelerates aging, and increases Alzheimer\'s risk by 65%.',
          lifestyle: 'IMMEDIATE ACTION: Eliminate all refined carbs, sugars, and processed foods. Implement time-restricted eating (16:8). Walk 10-15 minutes after every meal. Strength training 3x/week. Sleep 7-9 hours nightly. Manage stress with meditation/yoga.',
          supplement: 'Berberine 500mg 2x/day before meals (as effective as metformin), chromium picolinate 400mcg/day, alpha-lipoic acid 600mg 2x/day, cinnamon extract 500mg 2x/day, inositol 2g 2x/day, bitter melon extract 500mg 3x/day.'
        },
        optimal: {
          why: 'Optimal fasting glucose (70-85 mg/dL) indicates excellent insulin sensitivity and metabolic health. This protects against diabetes, cardiovascular disease, and cognitive decline while promoting longevity.',
          lifestyle: 'MAINTAIN: Continue low-glycemic diet with protein at each meal. Regular exercise including both cardio and resistance training. Consistent sleep schedule. Stress management practices.',
          supplement: 'Maintenance: Chromium 200mcg/day, alpha-lipoic acid 300mg/day, magnesium 400mg evening, omega-3 2g/day for continued insulin sensitivity.'
        }
      }
    },
    'hba1c': {
      displayName: 'Hemoglobin A1C',
      optimalRange: { min: 4.0, max: 5.2 },
      unit: '%',
      category: 'metabolic',
      insights: {
        low: {
          why: 'Very low HbA1c (<4.5%) may indicate hypoglycemia, rapid red blood cell turnover, or iron deficiency. While generally protective, ensure adequate glucose availability for brain function.',
          lifestyle: 'Monitor for hypoglycemic symptoms. Include complex carbs around workouts. Ensure adequate iron and B12 status. Consider continuous glucose monitoring if symptomatic.',
          supplement: 'Iron bisglycinate if ferritin <50, B-complex for red blood cell health, vitamin C 1000mg for iron absorption, CoQ10 100mg for cellular energy.'
        },
        high: {
          why: 'Elevated HbA1c indicates chronic glucose elevation and glycation damage. Even "normal" levels >5.5% increase diabetes risk 5-fold and accelerate aging through advanced glycation end products (AGEs). This damages proteins, DNA, and blood vessels.',
          lifestyle: 'URGENT INTERVENTION: Strict low-carb diet (<50g net carbs/day). Intermittent fasting 16:8 minimum. High-intensity interval training 3x/week. Resistance training 3x/week. Prioritize sleep quality and stress reduction. Monitor glucose with continuous glucose monitor.',
          supplement: 'Berberine 500mg 3x/day, alpha-lipoic acid 600mg 2x/day, chromium 400mcg/day, cinnamon 1000mg 2x/day, bitter melon 500mg 3x/day, gymnema sylvestre 400mg 2x/day, carnosine 500mg 2x/day (anti-AGE).'
        },
        optimal: {
          why: 'Optimal HbA1c (4.5-5.2%) indicates excellent glucose control and minimal glycation damage. This is associated with longevity, cognitive protection, and reduced chronic disease risk.',
          lifestyle: 'MAINTAIN EXCELLENCE: Continue metabolically healthy eating pattern. Regular exercise combining cardio and strength. Consistent sleep hygiene. Stress management practices.',
          supplement: 'Maintenance: Alpha-lipoic acid 300mg/day, chromium 200mcg/day, carnosine 500mg/day for anti-aging, omega-3 2g/day.'
        }
      }
    },
    'insulin': {
      displayName: 'Fasting Insulin',
      optimalRange: { min: 2, max: 5 },
      unit: 'μIU/mL',
      category: 'metabolic',
      insights: {
        low: {
          why: 'Very low insulin (<2 μIU/mL) indicates excellent insulin sensitivity but monitor for adequate insulin production. This is generally protective against metabolic disease and aging.',
          lifestyle: 'Continue current metabolically healthy practices. Ensure adequate protein intake for muscle maintenance. Monitor for signs of insulin deficiency if diabetic.',
          supplement: 'Maintain muscle mass with protein 1.2-1.6g/kg body weight, creatine 5g/day, vitamin D 2000-4000 IU/day.'
        },
        high: {
          why: 'Elevated fasting insulin (>5 μIU/mL) is the earliest and most sensitive marker of insulin resistance, often appearing 10-20 years before diabetes diagnosis. High insulin drives fat storage, inflammation, and accelerates aging through mTOR activation.',
          lifestyle: 'CRITICAL INTERVENTION: Implement extended fasting (24-48 hours weekly under supervision). Strict ketogenic diet (<20g carbs/day) for 3-6 months. High-intensity exercise 4-5x/week. Cold exposure therapy. Prioritize deep sleep and stress reduction.',
          supplement: 'Berberine 500mg 3x/day, metformin alternative protocol: inositol 4g/day, alpha-lipoic acid 600mg 2x/day, chromium 400mcg/day, vanadium 10mg/day, bitter melon 1000mg 2x/day, green tea extract 500mg 3x/day.'
        },
        optimal: {
          why: 'Optimal insulin (2-5 μIU/mL) indicates excellent insulin sensitivity and metabolic flexibility. This protects against diabetes, obesity, cardiovascular disease, and promotes healthy aging.',
          lifestyle: 'GOLD STANDARD: Continue insulin-sensitizing lifestyle. Maintain muscle mass through resistance training. Practice metabolic flexibility with occasional fasting.',
          supplement: 'Optimization: Alpha-lipoic acid 300mg/day, chromium 200mcg/day, magnesium 400mg/day, omega-3 2g/day for continued insulin sensitivity.'
        }
      }
    },
    'leptin': {
      displayName: 'Leptin',
      optimalRange: { min: 2, max: 10 },
      unit: 'ng/mL',
      category: 'metabolic',
      insights: {
        low: {
          why: 'Low leptin may indicate insufficient fat stores or leptin deficiency, leading to increased appetite and metabolic slowdown.',
          lifestyle: 'Ensure adequate healthy fat intake (30-35% of calories). Include omega-3 rich foods. Avoid extreme calorie restriction. Prioritize sleep quality.',
          supplement: 'Omega-3 2-3g/day, zinc 15mg/day, vitamin D 3000-5000 IU/day, adequate protein 1.2-1.6g/kg body weight.'
        },
        high: {
          why: 'Elevated leptin (>10 ng/mL) indicates leptin resistance - your brain can\'t "hear" the satiety signal. This drives overeating, metabolic dysfunction, and is strongly linked to obesity, diabetes, and cardiovascular disease.',
          lifestyle: 'RESET LEPTIN SENSITIVITY: Intermittent fasting 16:8 minimum, weekly 24-hour fasts. Eliminate processed foods, sugar, and refined carbs. High-protein breakfast. Cold exposure therapy. Prioritize 8+ hours sleep in complete darkness.',
          supplement: 'Leptin sensitivity protocol: Alpha-lipoic acid 600mg 2x/day, fish oil 3g/day, zinc 30mg/day, chromium 400mcg/day, green tea extract 500mg 3x/day, forskolin 250mg 2x/day.'
        },
        optimal: {
          why: 'Optimal leptin levels indicate proper appetite regulation and metabolic health. Your brain effectively receives satiety signals, supporting healthy weight maintenance.',
          lifestyle: 'MAINTAIN: Continue balanced eating patterns. Regular meal timing. Adequate sleep. Stress management. Regular exercise.',
          supplement: 'Maintenance: Omega-3 2g/day, zinc 15mg/day, vitamin D 2000-3000 IU/day.'
        }
      }
    },
    'adiponectin': {
      displayName: 'Adiponectin',
      optimalRange: { min: 10, max: 30 },
      unit: 'μg/mL',
      category: 'metabolic',
      insights: {
        low: {
          why: 'Low adiponectin (<10 μg/mL) indicates metabolic dysfunction and increased risk of diabetes, cardiovascular disease, and inflammation. Adiponectin enhances insulin sensitivity and has anti-inflammatory effects.',
          lifestyle: 'BOOST ADIPONECTIN: Regular aerobic exercise 150+ min/week. Mediterranean diet rich in omega-3s. Weight loss if overweight. Adequate sleep 7-9 hours. Stress reduction practices.',
          supplement: 'Adiponectin boosters: Fish oil 3g/day, magnesium 400mg/day, EGCG (green tea) 400mg 2x/day, resveratrol 500mg/day, curcumin 1000mg/day, berberine 500mg 2x/day.'
        },
        high: {
          why: 'High adiponectin (>30 μg/mL) is generally protective but very high levels may indicate underlying inflammation or autoimmune conditions.',
          lifestyle: 'Monitor for underlying inflammatory conditions. Continue healthy lifestyle practices. Ensure adequate protein and healthy fats.',
          supplement: 'Anti-inflammatory support: Omega-3 2g/day, vitamin D 2000-3000 IU/day, curcumin 500mg/day.'
        },
        optimal: {
          why: 'Optimal adiponectin levels (10-30 μg/mL) indicate excellent metabolic health, insulin sensitivity, and anti-inflammatory status. This is protective against diabetes and cardiovascular disease.',
          lifestyle: 'EXCELLENCE: Continue current healthy lifestyle. Regular exercise, balanced nutrition, adequate sleep, stress management.',
          supplement: 'Maintenance: Omega-3 2g/day, magnesium 400mg/day, vitamin D 2000-3000 IU/day.'
        }
      }
    },

    // THYROID MARKERS
    'tsh': {
      displayName: 'Thyroid Stimulating Hormone',
      optimalRange: { min: 0.5, max: 2.5 },
      unit: 'mIU/L',
      category: 'hormonal',
      insights: {
        low: {
          why: 'Low TSH may indicate hyperthyroidism, affecting metabolism and heart rate.',
          lifestyle: 'Reduce stimulants, manage stress, ensure adequate sleep.',
          supplement: 'L-carnitine, magnesium, avoid iodine excess, consider selenium.'
        },
        high: {
          why: 'Elevated TSH indicates hypothyroidism, affecting metabolism, energy, and mood.',
          lifestyle: 'Reduce goitrogenic foods, manage stress, ensure adequate sleep.',
          supplement: 'Iodine (if deficient), selenium, tyrosine, zinc, vitamin D.'
        },
        optimal: {
          why: 'Your TSH levels indicate healthy thyroid function and metabolism.',
          lifestyle: 'Continue balanced diet with adequate iodine and selenium.',
          supplement: 'Selenium and iodine support continued thyroid health.'
        }
      }
    },
    'free_t4': {
      displayName: 'Free T4',
      optimalRange: { min: 1.0, max: 1.8 },
      unit: 'ng/dL',
      category: 'hormonal',
      insights: {
        low: {
          why: 'Low free T4 indicates hypothyroidism, affecting metabolism and energy.',
          lifestyle: 'Reduce stress, ensure adequate sleep, avoid excessive soy.',
          supplement: 'Iodine (if deficient), selenium, tyrosine, zinc.'
        },
        high: {
          why: 'Elevated free T4 may indicate hyperthyroidism, affecting heart rate and metabolism.',
          lifestyle: 'Reduce stimulants, manage stress, avoid excessive iodine.',
          supplement: 'L-carnitine, magnesium, selenium for thyroid regulation.'
        },
        optimal: {
          why: 'Your free T4 levels indicate healthy thyroid hormone production.',
          lifestyle: 'Continue balanced diet with adequate nutrients for thyroid health.',
          supplement: 'Selenium and iodine support continued thyroid function.'
        }
      }
    },
    'free_t3': {
      displayName: 'Free T3',
      optimalRange: { min: 3.0, max: 4.2 },
      unit: 'pg/mL',
      category: 'hormonal',
      insights: {
        low: {
          why: 'Low free T3 indicates poor T4 to T3 conversion, affecting energy and metabolism.',
          lifestyle: 'Reduce stress, ensure adequate sleep, include selenium-rich foods.',
          supplement: 'Selenium, zinc, tyrosine, consider T3 support nutrients.'
        },
        high: {
          why: 'Elevated free T3 may indicate hyperthyroidism or excessive T3 conversion.',
          lifestyle: 'Reduce stimulants, manage stress, monitor heart rate.',
          supplement: 'L-carnitine, magnesium, selenium for thyroid balance.'
        },
        optimal: {
          why: 'Your free T3 levels indicate healthy thyroid hormone activity.',
          lifestyle: 'Continue balanced diet supporting thyroid health.',
          supplement: 'Selenium and zinc support continued T3 production.'
        }
      }
    },

    // NUTRIENT MARKERS
    'vitamin_d': {
      displayName: 'Vitamin D (25-OH)',
      optimalRange: { min: 40, max: 80 },
      unit: 'ng/mL',
      category: 'nutrient-processing',
      insights: {
        low: {
          why: 'Low vitamin D affects immune function, bone health, and mood regulation.',
          lifestyle: 'Increase sun exposure (15-20min daily), add vitamin D rich foods.',
          supplement: 'Vitamin D3 4000-5000 IU daily with K2, retest in 3 months.'
        },
        high: {
          why: 'Very high vitamin D levels may indicate over-supplementation.',
          lifestyle: 'Reduce sun exposure if excessive, check supplement dosing.',
          supplement: 'Reduce or pause vitamin D supplementation, ensure adequate K2 and magnesium.'
        },
        optimal: {
          why: 'Excellent vitamin D levels support immune function, bone health, and mood.',
          lifestyle: 'Maintain current sun exposure and dietary habits.',
          supplement: 'Maintenance dose 1000-2000 IU daily, especially in winter.'
        }
      }
    },
    'vitamin_b12': {
      displayName: 'Vitamin B12',
      optimalRange: { min: 500, max: 1000 },
      unit: 'pg/mL',
      category: 'nutrient-processing',
      insights: {
        low: {
          why: 'Low B12 affects energy, nerve function, and methylation processes.',
          lifestyle: 'Include B12-rich foods (meat, fish, eggs), consider absorption issues.',
          supplement: 'Methylcobalamin B12 1000-2000mcg daily, consider sublingual form.'
        },
        high: {
          why: 'Very high B12 may indicate over-supplementation or absorption issues.',
          lifestyle: 'Review B12 supplement dosing, monitor for underlying conditions.',
          supplement: 'Reduce B12 supplementation, ensure balanced B-complex.'
        },
        optimal: {
          why: 'Your B12 levels support healthy energy production and nerve function.',
          lifestyle: 'Continue B12-rich foods and current supplementation.',
          supplement: 'Maintain B12 intake through food or moderate supplementation.'
        }
      }
    },
    'folate': {
      displayName: 'Folate',
      optimalRange: { min: 10, max: 20 },
      unit: 'ng/mL',
      category: 'nutrient-processing',
      insights: {
        low: {
          why: 'Low folate affects DNA synthesis, methylation, and cardiovascular health.',
          lifestyle: 'Increase leafy greens, legumes, avoid alcohol excess.',
          supplement: 'Methylfolate 400-800mcg daily, avoid synthetic folic acid.'
        },
        high: {
          why: 'Very high folate may mask B12 deficiency or indicate over-supplementation.',
          lifestyle: 'Review folate supplement dosing, ensure adequate B12.',
          supplement: 'Balance folate with B12, consider methylated forms.'
        },
        optimal: {
          why: 'Your folate levels support healthy DNA synthesis and methylation.',
          lifestyle: 'Continue folate-rich foods and balanced supplementation.',
          supplement: 'Maintain folate through leafy greens and B-complex.'
        }
      }
    },
    'ferritin': {
      displayName: 'Ferritin',
      optimalRange: { min: 50, max: 150 },
      unit: 'ng/mL',
      category: 'nutrient-processing',
      insights: {
        low: {
          why: 'Low ferritin indicates iron deficiency, affecting energy and oxygen transport.',
          lifestyle: 'Include iron-rich foods, combine with vitamin C, avoid tea/coffee with meals.',
          supplement: 'Iron bisglycinate 25-50mg daily with vitamin C, retest in 3 months.'
        },
        high: {
          why: 'Elevated ferritin may indicate iron overload, inflammation, or liver issues.',
          lifestyle: 'Reduce iron-rich foods, avoid iron supplements, increase antioxidants.',
          supplement: 'Avoid iron supplements, consider milk thistle, curcumin for liver support.'
        },
        optimal: {
          why: 'Your ferritin levels indicate healthy iron stores and oxygen transport.',
          lifestyle: 'Continue balanced diet with moderate iron intake.',
          supplement: 'Maintain iron through food sources, avoid excess supplementation.'
        }
      }
    },

    // LIVER FUNCTION
    'alt': {
      displayName: 'ALT (Alanine Transaminase)',
      optimalRange: { min: 0, max: 25 },
      unit: 'U/L',
      category: 'detoxification',
      insights: {
        low: {
          why: 'Low ALT indicates excellent liver health and minimal liver stress.',
          lifestyle: 'Continue current liver-healthy lifestyle practices.',
          supplement: 'Maintain antioxidant support for continued liver health.'
        },
        high: {
          why: 'Elevated ALT indicates liver stress or damage from toxins, medications, or inflammation.',
          lifestyle: 'Reduce alcohol, avoid processed foods, increase antioxidant-rich foods.',
          supplement: 'Milk thistle, NAC, alpha-lipoic acid, turmeric for liver support.'
        },
        optimal: {
          why: 'Your ALT levels indicate healthy liver function and minimal stress.',
          lifestyle: 'Continue liver-healthy diet with minimal alcohol and processed foods.',
          supplement: 'Milk thistle and antioxidants support continued liver health.'
        }
      }
    },
    'ast': {
      displayName: 'AST (Aspartate Transaminase)',
      optimalRange: { min: 0, max: 25 },
      unit: 'U/L',
      category: 'detoxification',
      insights: {
        low: {
          why: 'Low AST indicates excellent liver and muscle health.',
          lifestyle: 'Continue current healthy lifestyle practices.',
          supplement: 'Maintain antioxidant support for continued health.'
        },
        high: {
          why: 'Elevated AST may indicate liver stress, muscle damage, or heart issues.',
          lifestyle: 'Reduce alcohol, manage exercise intensity, increase antioxidants.',
          supplement: 'CoQ10, magnesium, milk thistle, NAC for tissue protection.'
        },
        optimal: {
          why: 'Your AST levels indicate healthy liver and muscle function.',
          lifestyle: 'Continue balanced exercise and liver-healthy diet.',
          supplement: 'CoQ10 and antioxidants support continued tissue health.'
        }
      }
    }
  }

  const biomarker = knownBiomarkers[cleanName]
  if (!biomarker) {
    // Don't analyze unknown biomarkers - just return basic info
    return null
  }

  let status: 'optimal' | 'borderline' | 'concerning'
  let insight: typeof biomarker.insights.optimal

  if (value < biomarker.optimalRange.min) {
    status = value < (biomarker.optimalRange.min * 0.8) ? 'concerning' : 'borderline'
    insight = biomarker.insights.low
  } else if (value > biomarker.optimalRange.max) {
    status = value > (biomarker.optimalRange.max * 1.2) ? 'concerning' : 'borderline'
    insight = biomarker.insights.high
  } else {
    status = 'optimal'
    insight = biomarker.insights.optimal
  }

  return {
    markerType: 'biomarker' as const,
    name: cleanName,
    displayName: biomarker.displayName,
    userValue: `${value} ${unit}`,
    referenceRange: referenceRange || `${biomarker.optimalRange.min} - ${biomarker.optimalRange.max} ${biomarker.unit}`,
    status,
    whyItMatters: insight.why,
    recommendations: {
      lifestyle: insight.lifestyle,
      supplement: insight.supplement
    },
    evidenceLevel: 'strong' as const,
    category: biomarker.category
  }
}

// ✅ APOE SPECIAL INTERPRETATION - Combines rs429358 and rs7412 for proper ε2/ε3/ε4 analysis
function interpretAPOE(snps: any[]) {
  // Find APOE SNPs
  const rs429358 = snps.find(s => s.snp_id === 'apoe_rs429358' || s.snp_id === 'rs429358')
  const rs7412 = snps.find(s => s.snp_id === 'apoe_rs7412' || s.snp_id === 'rs7412')
  
  if (!rs429358 || !rs7412) {
    console.log('Missing APOE SNPs for complete analysis')
    return null
  }

  console.log(`APOE Analysis: rs429358=${rs429358.genotype}, rs7412=${rs7412.genotype}`)

  // Determine APOE status based on both SNPs
  // rs429358: TT=ε3/ε3, CT=ε3/ε4, CC=ε4/ε4
  // rs7412: CC=ε3/ε3, CT=ε2/ε3, TT=ε2/ε2
  
  let apoeStatus = ''
  let riskLevel = 'optimal'
  let why = ''
  let lifestyle = ''
  let supplement = ''

  // Determine APOE genotype combination
  if (rs429358.genotype === 'TT' && rs7412.genotype === 'CC') {
    // ε3/ε3 - Normal/Average risk
    apoeStatus = 'ε3/ε3 (Normal Risk)'
    riskLevel = 'optimal'
    why = 'Your APOE ε3/ε3 genotype represents the most common variant with average Alzheimer\'s risk. This is the "neutral" genotype - neither protective nor high-risk. You have normal amyloid clearance and lipid metabolism.'
    lifestyle = 'BRAIN OPTIMIZATION: Maintain brain-healthy lifestyle with Mediterranean diet, regular exercise (150+ min/week), cognitive challenges, social engagement, quality sleep (7-9 hours), and stress management.'
    supplement = 'BRAIN MAINTENANCE: DHA 1000-2000mg/day, curcumin 500mg/day, lion\'s mane 500mg/day, phosphatidylserine 100mg/day, B-complex for cognitive support.'
  } else if (rs429358.genotype === 'CT' && rs7412.genotype === 'CC') {
    // ε3/ε4 - Moderate increased risk
    apoeStatus = 'ε3/ε4 (Moderate Risk)'
    riskLevel = 'concerning'
    why = 'Your APOE ε3/ε4 genotype increases Alzheimer\'s risk by approximately 3x compared to ε3/ε3. You have one copy of the ε4 variant, which affects amyloid clearance and increases neuroinflammation. Early intervention is crucial.'
    lifestyle = 'NEUROPROTECTION PROTOCOL: Strict Mediterranean/ketogenic hybrid diet. Eliminate sugar, processed foods, trans fats. Exercise 150+ min/week including resistance training. Prioritize 7-9 hours deep sleep. Manage stress with meditation. Cognitive training/learning new skills. Social engagement. Avoid head trauma.'
    supplement = 'MODERATE BRAIN PROTECTION: DHA 2000mg/day, curcumin 1000mg/day, lion\'s mane 1000mg/day, phosphatidylserine 200mg/day, PQQ 20mg/day, CoQ10 100mg/day, resveratrol 500mg/day.'
  } else if (rs429358.genotype === 'CC' && rs7412.genotype === 'CC') {
    // ε4/ε4 - High risk
    apoeStatus = 'ε4/ε4 (High Risk)'
    riskLevel = 'concerning'
    why = 'Your APOE ε4/ε4 genotype increases Alzheimer\'s risk by 10-15x compared to ε3/ε3. You have two copies of the ε4 variant, significantly affecting amyloid clearance, lipid metabolism, and neuroinflammation. Aggressive prevention is essential.'
    lifestyle = 'INTENSIVE NEUROPROTECTION: Strict ketogenic diet with MCT oil. Eliminate all sugar, processed foods, trans fats. Exercise 200+ min/week including HIIT and resistance training. Prioritize 8-9 hours deep sleep. Daily meditation/stress management. Intensive cognitive training. Strong social engagement. Avoid all head trauma.'
    supplement = 'COMPREHENSIVE BRAIN PROTECTION: DHA 3000mg/day, curcumin 1000mg 2x/day, lion\'s mane 1000mg 2x/day, phosphatidylserine 300mg/day, PQQ 20mg/day, CoQ10 200mg/day, resveratrol 500mg/day, bacopa monnieri 300mg/day, huperzine A 200mcg/day.'
  } else if (rs7412.genotype === 'CT' || rs7412.genotype === 'TT') {
    // ε2 carrier - Protective but may have lipid issues
    apoeStatus = rs7412.genotype === 'CT' ? 'ε2/ε3 (Protective)' : 'ε2/ε2 (Highly Protective)'
    riskLevel = 'optimal'
    why = `Your APOE ${apoeStatus.split(' ')[0]} genotype provides significant protection against Alzheimer\'s disease (40-60% reduced risk). However, ε2 carriers may have triglyceride sensitivity and need to monitor lipid metabolism.`
    lifestyle = 'BRAIN OPTIMIZATION + LIPID MONITORING: Continue brain-healthy Mediterranean diet with careful carb monitoring. Regular exercise, cognitive challenges, social engagement. Monitor triglycerides closely and limit refined carbs.'
    supplement = 'BRAIN MAINTENANCE + LIPID SUPPORT: DHA 1000mg/day, curcumin 500mg/day, lion\'s mane 500mg/day, omega-3 2-3g/day for lipids, niacin (under supervision if triglycerides elevated).'
  } else {
    // Mixed or unusual combinations
    apoeStatus = 'Mixed Genotype'
    riskLevel = 'optimal'
    why = 'Your APOE genotype combination is less common. Continue general brain-healthy practices.'
    lifestyle = 'BRAIN OPTIMIZATION: Maintain brain-healthy lifestyle with Mediterranean diet, regular exercise, cognitive challenges, and social engagement.'
    supplement = 'BRAIN MAINTENANCE: DHA 1000mg/day, curcumin 500mg/day, lion\'s mane 500mg/day, B-complex for cognitive support.'
  }

  return {
    markerType: 'snp' as const,
    name: 'APOE_combined',
    displayName: `APOE Status: ${apoeStatus}`,
    userValue: `rs429358: ${rs429358.genotype}, rs7412: ${rs7412.genotype}`,
    status: riskLevel as 'optimal' | 'concerning',
    whyItMatters: why,
    recommendations: {
      lifestyle: lifestyle,
      supplement: supplement
    },
    evidenceLevel: 'strong' as const,
    category: 'cognitive-stress'
  }
}

// ✅ 2. SIMPLE SNP INTERPRETATION - Only for SNPs we actually know
function interpretSNP(geneName: string, rsId: string, genotype: string) {
  // Skip individual APOE SNPs - they'll be handled by the combined function
  if (rsId === 'apoe_rs429358' || rsId === 'apoe_rs7412' || rsId === 'rs429358' || rsId === 'rs7412') {
    return null
  }

  // Create multiple possible keys to match database variations
  const cleanGeneName = geneName.toLowerCase().replace(/[^a-z0-9]/g, '')
  const cleanRsId = rsId.toLowerCase()
  
  // Try multiple key patterns to match database format
  const possibleKeys = [
    cleanRsId, // Direct match like 'apoe_rs429358', 'comt_v158m'
    `${cleanGeneName}_${cleanRsId}`, // gene_rsid format
    cleanRsId.replace(/^rs/, ''), // Remove 'rs' prefix
    cleanRsId.replace(/.*_rs/, ''), // Extract rsid after '_rs'
    cleanRsId.replace(/.*rs/, ''), // Extract rsid after 'rs'
  ]
  
  console.log(`Trying to match SNP: ${geneName} ${rsId} with keys:`, possibleKeys)
  
  // Comprehensive SNP interpretation database with actual database keys
  const knownSNPs: Record<string, {
    displayName: string,
    category: string,
    riskGenotypes: string[],
    insights: {
      risk: { why: string, lifestyle: string, supplement: string },
      normal: { why: string, lifestyle: string, supplement: string }
    }
  }> = {
    'comt_v158m': {
      displayName: 'COMT Val158Met (Dopamine Metabolism)',
      category: 'cognitive-stress',
      riskGenotypes: ['AA', 'Met/Met'],
      insights: {
        risk: {
          why: 'COMT slow variant (Met/Met) reduces dopamine breakdown by 75%, causing dopamine accumulation in prefrontal cortex. This can improve working memory but increases stress sensitivity, anxiety, and pain perception.',
          lifestyle: 'DOPAMINE OPTIMIZATION: Avoid overstimulation and high-stress environments. Practice stress management daily (meditation, yoga). Consistent sleep schedule. Moderate caffeine intake.',
          supplement: 'DOPAMINE BALANCE: Magnesium glycinate 400mg evening, L-theanine 200mg 2x/day, GABA 500mg evening, avoid tyrosine/L-DOPA supplements, rhodiola 300mg morning.'
        },
        normal: {
          why: 'Your COMT genotype allows efficient dopamine metabolism and stress response, providing better stress resilience.',
          lifestyle: 'COGNITIVE OPTIMIZATION: Continue balanced stress management and cognitive challenges.',
          supplement: 'COGNITIVE SUPPORT: Magnesium 400mg/day, B-complex, rhodiola 200mg, omega-3 2g/day.'
        }
      }
    },
    'rs4680': {
      displayName: 'COMT Val158Met (Dopamine Metabolism)',
      category: 'cognitive-stress',
      riskGenotypes: ['AA'],
      insights: {
        risk: {
          why: 'COMT slow variant (Met/Met) reduces dopamine breakdown by 75%, causing dopamine accumulation in prefrontal cortex. This can improve working memory but increases stress sensitivity, anxiety, and pain perception.',
          lifestyle: 'DOPAMINE OPTIMIZATION: Avoid overstimulation and high-stress environments. Practice stress management daily (meditation, yoga). Consistent sleep schedule. Moderate caffeine intake.',
          supplement: 'DOPAMINE BALANCE: Magnesium glycinate 400mg evening, L-theanine 200mg 2x/day, GABA 500mg evening, avoid tyrosine/L-DOPA supplements, rhodiola 300mg morning.'
        },
        normal: {
          why: 'Your COMT genotype allows efficient dopamine metabolism and stress response, providing better stress resilience.',
          lifestyle: 'COGNITIVE OPTIMIZATION: Continue balanced stress management and cognitive challenges.',
          supplement: 'COGNITIVE SUPPORT: Magnesium 400mg/day, B-complex, rhodiola 200mg, omega-3 2g/day.'
        }
      }
    },
    'mthfr_c677t': {
      displayName: 'MTHFR C677T',
      category: 'nutrient-processing',
      riskGenotypes: ['GA', 'AA', 'CT', 'TT'],
      insights: {
        risk: {
          why: 'MTHFR C677T variant reduces folate metabolism efficiency by 30-70%, affecting methylation, homocysteine levels, and cardiovascular health. This increases risk for heart disease, stroke, and neural tube defects.',
          lifestyle: 'METHYLATION SUPPORT: Increase leafy greens (spinach, kale), avoid folic acid fortified foods, manage stress levels, limit alcohol consumption, ensure adequate sleep.',
          supplement: 'METHYLATION PROTOCOL: Methylfolate 800-1000mcg/day, methylcobalamin B12 1000mcg/day, betaine (TMG) 1000mg/day, P5P (B6) 50mg/day, avoid synthetic folic acid completely.'
        },
        normal: {
          why: 'Your MTHFR C677T genotype allows normal folate metabolism and methylation, supporting healthy homocysteine levels and cardiovascular function.',
          lifestyle: 'METHYLATION OPTIMIZATION: Continue balanced diet with adequate folate-rich foods and B-vitamins.',
          supplement: 'METHYLATION MAINTENANCE: Standard B-complex with folate, ensure adequate B12 and B6 intake.'
        }
      }
    },
    'mthfr_a1298c': {
      displayName: 'MTHFR A1298C',
      category: 'nutrient-processing',
      riskGenotypes: ['GT', 'TT', 'CT', 'CC'],
      insights: {
        risk: {
          why: 'MTHFR A1298C variant affects neurotransmitter synthesis (serotonin, dopamine, norepinephrine) and methylation. This can increase risk for depression, anxiety, ADHD, and mood disorders.',
          lifestyle: 'NEUROTRANSMITTER SUPPORT: Focus on stress management, adequate sleep 7-9 hours, B-vitamin rich foods, regular exercise, meditation/mindfulness practices.',
          supplement: 'NEUROTRANSMITTER PROTOCOL: Methylated B-complex, SAMe 400mg/day, magnesium glycinate 400mg/day, omega-3 2g/day, consider 5-MTHF 400-800mcg/day.'
        },
        normal: {
          why: 'Your MTHFR A1298C genotype supports normal neurotransmitter synthesis and methylation, promoting stable mood and cognitive function.',
          lifestyle: 'MOOD OPTIMIZATION: Continue balanced diet with adequate B-vitamins and stress management practices.',
          supplement: 'MOOD MAINTENANCE: Standard B-complex, magnesium 400mg/day, omega-3 2g/day for continued neurotransmitter health.'
        }
      }
    },
    'rs1801131': {
      displayName: 'MTHFR A1298C',
      category: 'nutrient-processing',
      riskGenotypes: ['GT', 'TT', 'CT', 'CC'],
      insights: {
        risk: {
          why: 'MTHFR A1298C variant affects neurotransmitter synthesis (serotonin, dopamine, norepinephrine) and methylation. This can increase risk for depression, anxiety, ADHD, and mood disorders.',
          lifestyle: 'NEUROTRANSMITTER SUPPORT: Focus on stress management, adequate sleep 7-9 hours, B-vitamin rich foods, regular exercise, meditation/mindfulness practices.',
          supplement: 'NEUROTRANSMITTER PROTOCOL: Methylated B-complex, SAMe 400mg/day, magnesium glycinate 400mg/day, omega-3 2g/day, consider 5-MTHF 400-800mcg/day.'
        },
        normal: {
          why: 'Your MTHFR A1298C genotype supports normal neurotransmitter synthesis and methylation, promoting stable mood and cognitive function.',
          lifestyle: 'MOOD OPTIMIZATION: Continue balanced diet with adequate B-vitamins and stress management practices.',
          supplement: 'MOOD MAINTENANCE: Standard B-complex, magnesium 400mg/day, omega-3 2g/day for continued neurotransmitter health.'
        }
      }
    },
    'maoa_rs6323': {
      displayName: 'MAOA Warrior Gene (Aggression/Stress)',
      category: 'cognitive-stress',
      riskGenotypes: ['TT'],
      insights: {
        risk: {
          why: 'Low-activity MAOA variant ("warrior gene") reduces breakdown of dopamine, norepinephrine, and serotonin. This can increase aggression, impulsivity, and stress reactivity, especially with childhood trauma or high stress.',
          lifestyle: 'EMOTIONAL REGULATION: Prioritize stress management and emotional regulation techniques. Regular meditation/mindfulness. Avoid alcohol and stimulants. Consistent sleep schedule. Regular exercise for mood regulation. Therapy for emotional processing.',
          supplement: 'MOOD STABILIZATION: Magnesium glycinate 400mg 2x/day, L-theanine 200mg 2x/day, GABA 500mg evening, omega-3 3g/day, vitamin D 3000-5000 IU/day, avoid tyrosine supplements.'
        },
        normal: {
          why: 'Your MAOA genotype supports normal neurotransmitter metabolism and emotional regulation, providing better stress resilience and mood stability.',
          lifestyle: 'EMOTIONAL WELLNESS: Continue balanced stress management and emotional health practices. Regular exercise and social connection.',
          supplement: 'MOOD SUPPORT: Omega-3 2g/day, magnesium 400mg/day, B-complex for neurotransmitter support, vitamin D 2000-3000 IU/day.'
        }
      }
    },
    'vdr_bsm': {
      displayName: 'VDR Vitamin D Receptor (BsmI)',
      category: 'nutrient-processing',
      riskGenotypes: ['TT', 'CT'],
      insights: {
        risk: {
          why: 'VDR BsmI variant may reduce vitamin D receptor sensitivity, affecting bone health, immune function, and calcium absorption.',
          lifestyle: 'Prioritize sun exposure 15-20 min daily, vitamin D-rich foods (fatty fish, egg yolks), bone-loading exercise (resistance training, walking).',
          supplement: 'Higher vitamin D3 doses (3000-5000 IU) with K2 MK-7 100mcg, magnesium 400mg, calcium 500mg if dietary intake low.'
        },
        normal: {
          why: 'Your VDR BsmI genotype supports normal vitamin D receptor function and calcium metabolism.',
          lifestyle: 'Continue moderate sun exposure and vitamin D-rich foods.',
          supplement: 'Standard vitamin D3 (1000-2000 IU) with K2 for bone health.'
        }
      }
    },
    'vdr_taq': {
      displayName: 'VDR Vitamin D Receptor (TaqI)',
      category: 'nutrient-processing',
      riskGenotypes: ['AA', 'GA'],
      insights: {
        risk: {
          why: 'VDR TaqI variant may affect vitamin D metabolism and bone mineral density, increasing osteoporosis risk.',
          lifestyle: 'Emphasize weight-bearing exercise, adequate calcium and magnesium intake, regular sun exposure.',
          supplement: 'Vitamin D3 3000-4000 IU with K2 MK-7, magnesium glycinate 400mg, boron 3mg for bone health.'
        },
        normal: {
          why: 'Your VDR TaqI genotype supports normal vitamin D metabolism and bone health.',
          lifestyle: 'Continue balanced approach to bone health with exercise and nutrition.',
          supplement: 'Standard vitamin D3 (2000 IU) with K2 and magnesium.'
        }
      }
    },
    'vdr_fok': {
      displayName: 'VDR Vitamin D Receptor (FokI)',
      category: 'nutrient-processing',
      riskGenotypes: ['AA'],
      insights: {
        risk: {
          why: 'VDR FokI variant produces less efficient vitamin D receptor protein, potentially affecting immune function and bone health.',
          lifestyle: 'Prioritize consistent sun exposure, vitamin D-rich foods, immune-supporting lifestyle practices.',
          supplement: 'Higher vitamin D3 doses (4000-5000 IU) with K2, zinc 15mg, vitamin C 1000mg for immune support.'
        },
        normal: {
          why: 'Your VDR FokI genotype supports efficient vitamin D receptor function.',
          lifestyle: 'Continue balanced vitamin D exposure and immune-healthy practices.',
          supplement: 'Standard vitamin D3 (2000-3000 IU) with K2 and immune support nutrients.'
        }
      }
    }
  }

  // Try to find a match with any of the possible keys
  let matchedSNP = null
  let matchedKey = ''
  
  for (const key of possibleKeys) {
    if (knownSNPs[key]) {
      matchedSNP = knownSNPs[key]
      matchedKey = key
      break
    }
  }

  if (!matchedSNP) {
    console.log(`❌ No interpretation found for SNP: ${geneName} ${rsId}`)
    return null
  }

  console.log(`✅ Found interpretation for SNP: ${geneName} ${rsId} using key: ${matchedKey}`)

  const isRisk = matchedSNP.riskGenotypes.includes(genotype.toUpperCase())
  const insight = isRisk ? matchedSNP.insights.risk : matchedSNP.insights.normal

  return {
    markerType: 'snp' as const,
    name: `${geneName}_${rsId}`,
    displayName: matchedSNP.displayName,
    userValue: genotype,
    status: isRisk ? 'concerning' as const : 'optimal' as const,
    whyItMatters: insight.why,
    recommendations: {
      lifestyle: insight.lifestyle,
      supplement: insight.supplement
    },
    evidenceLevel: 'strong' as const,
    category: matchedSNP.category
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    console.log('Auth check:', { user: !!user, userId: user?.id, userError })
    
    if (!user) {
      console.log('No user found, returning 401')
      return new Response(JSON.stringify({ error: 'Unauthorized', details: userError?.message }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ✅ 1. REQUIRED INPUTS - Extract all data
    console.log('Fetching data for user:', user.id)
    
    const [biomarkersResult, snpsResult, profileResult, conditionsResult, medicationsResult, allergiesResult] = await Promise.all([
      supabaseClient.from('user_biomarkers').select('*').eq('user_id', user.id).limit(500),
      supabaseClient.from('user_snps').select('*').eq('user_id', user.id).limit(1000),
      supabaseClient.from('user_profiles').select('age, sex, goals, conditions, medications, allergies').eq('user_id', user.id).single(),
              supabaseClient.from('user_conditions').select('*').eq('user_id', user.id).limit(30),
        supabaseClient.from('user_medications').select('*').eq('user_id', user.id).limit(50),
              supabaseClient.from('user_allergies').select('*').eq('user_id', user.id).limit(50)
    ])

    console.log('Data fetched:', {
      biomarkers: biomarkersResult.data?.length || 0,
      snps: snpsResult.data?.length || 0,
      biomarkersError: biomarkersResult.error,
      snpsError: snpsResult.error
    })

    const biomarkers = biomarkersResult.data || []
    const snps = snpsResult.data || []
    const profile = profileResult.data || {}
    const conditions = conditionsResult.data || []
    const medications = medicationsResult.data || []
    const allergies = allergiesResult.data || []

    // Process only known biomarkers and SNPs
    const results: any[] = []

    // Process biomarkers - only analyze ones we know
    console.log('Processing biomarkers...')
    for (const biomarker of biomarkers) {
      if (biomarker.value && biomarker.marker_name) {
        const result = interpretBiomarker(
          biomarker.marker_name,
          parseFloat(biomarker.value),
          biomarker.unit || '',
          biomarker.reference_range
        )
        if (result) { // Only add if we have interpretation
          results.push(result)
          console.log(`Analyzed biomarker: ${biomarker.marker_name} = ${biomarker.value}`)
        }
      }
    }

    // Process SNPs - only analyze ones we know
    console.log('Processing SNPs...')
    
    // First, handle APOE combined analysis
    const apoeResult = interpretAPOE(snps)
    if (apoeResult) {
      results.push(apoeResult)
      console.log(`✅ Analyzed APOE combined: ${apoeResult.userValue}`)
    }
    
    // Then process other SNPs
    for (const snp of snps) {
      if (snp.gene_name && snp.snp_id && snp.genotype) {
        console.log(`Checking SNP: ${snp.gene_name} ${snp.snp_id} = ${snp.genotype}`)
        const result = interpretSNP(snp.gene_name, snp.snp_id, snp.genotype)
        if (result) { // Only add if we have interpretation
          results.push(result)
          console.log(`✅ Analyzed SNP: ${snp.gene_name} ${snp.snp_id} = ${snp.genotype}`)
        } else {
          console.log(`❌ No interpretation for: ${snp.gene_name} ${snp.snp_id}`)
        }
      }
    }

    console.log(`Total analyzed: ${results.length} markers`)

    // Organize by category
    const resultsByCategory: Record<string, any[]> = {}
    for (const result of results) {
      if (!resultsByCategory[result.category]) {
        resultsByCategory[result.category] = []
      }
      resultsByCategory[result.category].push(result)
    }

    // Get priority items (concerning status)
    const priorityItems = results.filter(r => r.status === 'concerning')

    // Category stats
    const categoryStats = Object.entries(resultsByCategory).map(([category, items]) => ({
      category,
      total: items.length,
      concerning: items.filter(i => i.status === 'concerning').length,
      borderline: items.filter(i => i.status === 'borderline').length,
      optimal: items.filter(i => i.status === 'optimal').length
    }))

    // User context for personalization
    const userContext = {
      age: (profile as any)?.age,
      sex: (profile as any)?.sex,
      goals: (profile as any)?.goals,
      hasConditions: conditions.length > 0,
      hasMedications: medications.length > 0,
      hasAllergies: allergies.length > 0,
      totalBiomarkers: biomarkers.length,
      totalSNPs: snps.length
    }

    const response = {
      results,
      resultsByCategory,
      priorityItems,
      categoryStats,
      userContext,
      summary: {
        totalAnalyzed: results.length,
        concerningCount: priorityItems.length,
        categoriesAnalyzed: Object.keys(resultsByCategory).length
      }
    }

    console.log('Returning response:', {
      totalResults: results.length,
      categories: Object.keys(resultsByCategory),
      priorityCount: priorityItems.length
    })

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Enhanced analysis error:', error)
    return new Response(JSON.stringify({ 
      error: 'Analysis failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}) 