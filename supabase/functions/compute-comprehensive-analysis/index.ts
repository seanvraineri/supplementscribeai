import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Key biomarkers and SNPs we care about - focused on metabolic syndrome, Alzheimer's, supplementation, and sexual health
const KEY_BIOMARKERS = [
  // Metabolic Syndrome
  'glucose', 'fasting_glucose', 'hba1c', 'hemoglobin_a1c',
  'insulin', 'homa_ir', 'triglycerides', 'cholesterol_total', 'ldl', 'hdl',
  'apolipoprotein_b', 'apolipoprotein_a1', 'lipoprotein_a',
  
  // Inflammation (linked to metabolic syndrome and Alzheimer's)
  'crp', 'c_reactive_protein', 'hs_crp', 'esr', 'interleukin_6',
  
  // Sexual Health & Hormones
  'testosterone', 'free_testosterone', 'estradiol', 'estrogen',
  'progesterone', 'dhea', 'dhea_s', 'cortisol', 'shbg',
  'lh', 'fsh', 'prolactin',
  
  // Key Vitamins & Nutrients (supplementation focus)
  'vitamin_d', 'vitamin_b12', 'folate', 'vitamin_b6',
  'magnesium', 'zinc', 'iron', 'ferritin', 'omega_3',
  
  // Alzheimer's/Cognitive Health
  'homocysteine', 'vitamin_e', 'coq10',
  
  // Liver function (metabolic health)
  'alt', 'ast', 'ggt',
  
  // Thyroid (metabolic function)
  'tsh', 'free_t3', 'free_t4', 'reverse_t3'
];

const KEY_SNPS = [
  // Methylation & B-vitamin processing
  'MTHFR', 'COMT', 'MTR', 'MTRR',
  
  // Alzheimer's risk
  'APOE', 'BDNF', 'TOMM40',
  
  // Metabolic function
  'FTO', 'MC4R', 'PPARG', 'TCF7L2',
  
  // Hormone metabolism
  'CYP1A1', 'CYP1B1', 'COMT',
  
  // Vitamin D processing
  'VDR', 'CYP2R1', 'GC',
  
  // Omega-3 processing
  'FADS1', 'FADS2'
];

// Function to check if a biomarker is in our key list
function isKeyBiomarker(markerName: string): boolean {
  const cleanName = markerName.toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  
  return KEY_BIOMARKERS.some(key => {
    const cleanKey = key.toLowerCase();
    return cleanName.includes(cleanKey) || cleanKey.includes(cleanName);
  });
}

// Function to check if a SNP is in our key list
function isKeySNP(gene: string, rsid: string): boolean {
  const cleanGene = gene.toUpperCase();
  return KEY_SNPS.includes(cleanGene);
}

// Simplified health database - using basic biomarker analysis
// TODO: Replace with proper database integration or API call
const healthDB = {
  biomarkers: [
    {
      name: "glucose",
      optimal_range: [70, 100],
      unit: "mg/dL",
      impact: "Blood sugar regulation and energy metabolism",
      low: {
        description: "Low glucose levels may indicate hypoglycemia or metabolic issues.",
        lifestyle_recommendations: ["Eat regular balanced meals", "Include complex carbohydrates"],
        supplement_recommendations: ["Consider chromium supplementation"]
      },
      high: {
        description: "Elevated glucose levels may indicate insulin resistance or diabetes risk.",
        lifestyle_recommendations: ["Reduce refined sugar intake", "Increase physical activity", "Focus on low glycemic foods"],
        supplement_recommendations: ["Consider berberine", "Alpha-lipoic acid supplementation"]
      }
    },
    {
      name: "cholesterol_total",
      optimal_range: [150, 200],
      unit: "mg/dL", 
      impact: "Cardiovascular health and hormone production",
      low: {
        description: "Very low cholesterol may affect hormone production.",
        lifestyle_recommendations: ["Include healthy fats in diet"],
        supplement_recommendations: ["Omega-3 fatty acids"]
      },
      high: {
        description: "Elevated cholesterol increases cardiovascular disease risk.",
        lifestyle_recommendations: ["Reduce saturated fats", "Increase fiber intake", "Regular exercise"],
        supplement_recommendations: ["Plant sterols", "Red yeast rice"]
      }
    },
    {
      name: "vitamin_d",
      optimal_range: [30, 100],
      unit: "ng/mL",
      impact: "Bone health, immune function, and mood regulation",
      low: {
        description: "Vitamin D deficiency affects bone health and immune function.",
        lifestyle_recommendations: ["Increase sun exposure", "Include vitamin D rich foods"],
        supplement_recommendations: ["Vitamin D3 supplementation 1000-4000 IU daily"]
      },
      high: {
        description: "Vitamin D levels are optimal for health.",
        lifestyle_recommendations: ["Maintain current sun exposure"],
        supplement_recommendations: []
      }
    }
  ],
  snps: [
    {
      name: "MTHFR",
      rsid: "rs1801133",
      impact: "Folate metabolism and methylation processes",
      variants: [
        {
          genotype: "CC",
          risk_level: "Low",
          effect: "Normal MTHFR enzyme function",
          lifestyle_recommendations: ["Standard folate intake sufficient"],
          dietary_recommendations: ["Include leafy greens"],
          supplement_recommendations: []
        },
        {
          genotype: "CT",
          risk_level: "Medium", 
          effect: "Reduced MTHFR enzyme activity (~65% function)",
          lifestyle_recommendations: ["Focus on methylated B vitamins"],
          dietary_recommendations: ["Increase folate-rich foods"],
          supplement_recommendations: ["Methylfolate supplementation"]
        },
        {
          genotype: "TT",
          risk_level: "High",
          effect: "Significantly reduced MTHFR enzyme activity (~30% function)",
          lifestyle_recommendations: ["Avoid folic acid supplements", "Focus on methylated forms"],
          dietary_recommendations: ["High folate diet essential"],
          supplement_recommendations: ["Methylfolate and methylcobalamin"]
        }
      ]
    }
  ]
};

console.log('✅ Health database loaded successfully with', healthDB.biomarkers.length, 'biomarkers and', healthDB.snps.length, 'SNPs');

// Enhanced biomarker analysis with comprehensive health information
function generateEnhancedBiomarkerAnalysis(biomarker: any) {
  const name = biomarker.marker_name?.toLowerCase() || '';
  const value = parseFloat(biomarker.value || '0');
  const unit = biomarker.unit || '';
  const displayName = formatBiomarkerName(name);

  // Get comprehensive analysis
  const analysis = getComprehensiveBiomarkerAnalysis(name, value, unit);
  
  return {
    name: displayName,
    description: analysis.description,
    currentValue: `${value} ${unit}`,
    referenceRange: analysis.referenceRange,
    status: analysis.status,
    statusColor: analysis.statusColor,
    interpretation: analysis.interpretation,
    recommendations: analysis.recommendations,
    symptoms: analysis.symptoms,
    whatItDoes: analysis.whatItDoes,
    inRangeStatus: analysis.inRangeStatus,
    actionPlan: analysis.actionPlan
  };
}

// Enhanced SNP analysis with comprehensive genetic information
function generateEnhancedSNPAnalysis(snp: any) {
  const gene = snp.supported_snps?.gene || snp.gene_name || 'Unknown';
  const rsid = snp.supported_snps?.rsid || snp.snp_id || 'Unknown';
  const genotype = snp.genotype || 'Unknown';
  
  // Get comprehensive analysis
  const analysis = getComprehensiveSNPAnalysis(gene, rsid, genotype);
  
  return {
    name: `${gene} (${rsid})`,
    description: analysis.description,
    genotype: genotype,
    variantEffect: analysis.variantEffect,
    functionalImpact: analysis.functionalImpact,
    riskLevel: analysis.riskLevel,
    riskColor: analysis.riskColor,
    recommendations: analysis.recommendations,
    whatItDoes: analysis.whatItDoes,
    variantStatus: analysis.variantStatus,
    actionPlan: analysis.actionPlan
  };
}

// Comprehensive biomarker analysis function
function getComprehensiveBiomarkerAnalysis(name: string, value: number, unit: string) {
  const biomarker = (healthDB.biomarkers as any[]).find(b => b.name.toLowerCase() === name.toLowerCase());
  if (!biomarker) {
    return {
      description: `${name} is an important health biomarker. Reference information not found in database.`,
      referenceRange: 'N/A',
      status: 'Unknown',
      statusColor: 'blue',
      interpretation: 'No reference data – value recorded for tracking.',
      recommendations: [],
      actionPlan: 'Discuss this result with your healthcare provider for personalised guidance.'
    };
  }

  const [lowRef, highRef] = biomarker.optimal_range;
  let status = 'Optimal';
  let statusColor = 'green';
  let section = null;
  if (value < lowRef) {
    status = 'Low';
    statusColor = 'orange';
    section = biomarker.low;
  } else if (value > highRef) {
    status = 'High';
    statusColor = 'orange';
    section = biomarker.high;
  }

  const recommendations: string[] = [];
  const symptoms: string[] = [];
  if (section) {
    recommendations.push(...(section.lifestyle_recommendations || []));
    recommendations.push(...(section.supplement_recommendations || []));
    if (section.symptom_recommendations) symptoms.push(...section.symptom_recommendations);
  }

  const description = section?.description || `Your ${biomarker.name} level is within the optimal range, supporting healthy physiological function.`;

  const inRangeStatus = status === 'Optimal' ? '✅ Within optimal range' : status === 'Low' ? '⚠️ Below optimal' : '⚠️ Above optimal';

  return {
    description,
    referenceRange: `Optimal: ${lowRef}-${highRef} ${biomarker.unit}`,
    status,
    statusColor,
    interpretation: description,
    whatItDoes: biomarker.impact || `${biomarker.name} is a key biomarker involved in overall wellness.`,
    recommendations,
    symptoms,
    inRangeStatus,
    actionPlan: status === 'Optimal' ? 'Maintain your healthy habits to keep levels within range.' : 'Follow the recommendations above and retest in 8-12 weeks.'
  };
}

// Comprehensive SNP analysis function
function getComprehensiveSNPAnalysis(gene: string, rsid: string, genotype: string) {
  const snp = (healthDB.snps as any[]).find(s => s.rsid === rsid || s.name.toLowerCase() === gene.toLowerCase());
  if (!snp) {
    return {
      description: 'Genetic variant not found in reference database.',
      riskLevel: 'Unknown',
      riskColor: 'blue',
      recommendations: [],
      variantStatus: 'Information unavailable'
    };
  }
  const variant = (snp.variants as any[]).find(v => v.genotype === genotype.toUpperCase());
  if (!variant) {
    return {
      description: 'No specific data for your genotype; standard healthy lifestyle advised.',
      riskLevel: 'Unknown',
      riskColor: 'blue',
      whatItDoes: snp.impact,
      recommendations: [],
      variantStatus: 'Genotype data not in database'
    };
  }

  const riskColorMap: any = { High: 'red', Medium: 'orange', Low: 'green' };
  const recommendations = [
    ...variant.lifestyle_recommendations,
    ...variant.dietary_recommendations,
    ...variant.supplement_recommendations
  ];

  return {
    description: variant.effect,
    variantEffect: variant.effect,
    functionalImpact: snp.impact,
    riskLevel: variant.risk_level,
    riskColor: riskColorMap[variant.risk_level] || 'blue',
    variantStatus: variant.risk_level === 'Low' ? '✅ Normal variant' : variant.risk_level === 'Medium' ? '⚠️ Moderate impact' : '❌ High impact',
    whatItDoes: snp.impact,
    recommendations,
    actionPlan: 'Implement the above recommendations and monitor related biomarkers/health outcomes.'
  };
}

// Helper function to format biomarker names
function formatBiomarkerName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔍 Starting comprehensive analysis...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // service role client for privileged DB operations (bypasses RLS for upsert)
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth
    console.log('👤 Getting user from auth...');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      console.error('❌ Auth error:', userError);
      throw new Error('Unauthorized')
    }
    console.log('✅ User authenticated:', user.id);
    
    // Get user's biomarkers - only most recent for each marker
    console.log('🧪 Fetching user biomarkers...');
    const { data: allBiomarkers, error: biomarkersError } = await supabaseClient
      .from('user_biomarkers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (biomarkersError) {
      console.error('❌ Biomarkers fetch error:', biomarkersError);
      throw biomarkersError
    }
    
    // Deduplicate biomarkers - keep only the most recent for each marker name
    const biomarkerMap = new Map();
    if (allBiomarkers) {
      for (const biomarker of allBiomarkers) {
        const markerName = biomarker.marker_name?.toLowerCase().trim();
        if (markerName && !biomarkerMap.has(markerName)) {
          biomarkerMap.set(markerName, biomarker);
        }
      }
    }
    const biomarkers = Array.from(biomarkerMap.values());
    console.log(`✅ Biomarkers deduplicated: ${allBiomarkers?.length || 0} total → ${biomarkers.length} unique`);
    
    // Get user's SNPs with supported SNP data - only most recent for each SNP
    console.log('🧬 Fetching user SNPs...');
    const { data: allSNPs, error: snpsError } = await supabaseClient
      .from('user_snps')
      .select(`*, supported_snps ( gene, rsid )`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (snpsError) {
      console.error('❌ SNPs fetch error:', snpsError);
      throw snpsError
    }
    
    // Deduplicate SNPs - keep only the most recent for each rsid
    const snpMap = new Map();
    if (allSNPs) {
      for (const snp of allSNPs) {
        const rsid = snp.rsid || snp.snp_id || snp.supported_snps?.rsid;
        if (rsid && !snpMap.has(rsid)) {
          snpMap.set(rsid, snp);
        }
      }
    }
    const snps = Array.from(snpMap.values());
    console.log(`✅ SNPs deduplicated: ${allSNPs?.length || 0} total → ${snps.length} unique`);

    // CREATE SIMPLE ANALYSIS RESULTS
    console.log('🔬 Creating simple analysis results...');
    
    const analysisRows = [];
    
    // Process biomarkers - prioritize key biomarkers, but include others if needed
    if (biomarkers && biomarkers.length > 0) {
      const keyBiomarkers = biomarkers.filter(biomarker => 
        isKeyBiomarker(biomarker.marker_name || '')
      );
      
      // If user has very few key biomarkers, include some additional common ones
      let biomarkersToAnalyze = keyBiomarkers;
      if (keyBiomarkers.length < 5) {
        // Add some common biomarkers if user doesn't have many key ones
        const additionalBiomarkers = biomarkers
          .filter(b => !keyBiomarkers.includes(b))
          .slice(0, Math.max(0, 10 - keyBiomarkers.length));
        biomarkersToAnalyze = [...keyBiomarkers, ...additionalBiomarkers];
        console.log(`📊 User has only ${keyBiomarkers.length} key biomarkers, adding ${additionalBiomarkers.length} additional ones`);
      }
      
      console.log(`🎯 Analyzing biomarkers: ${biomarkers.length} total → ${keyBiomarkers.length} key → ${biomarkersToAnalyze.length} final`);
      
      for (const biomarker of biomarkersToAnalyze) {
        analysisRows.push({
          user_id: user.id,
          analysis_type: 'biomarker',
          item_id: `${biomarker.marker_name}_${biomarker.id}`,
          analysis_data: generateEnhancedBiomarkerAnalysis(biomarker)
        });
      }
    }
    
    // Process SNPs - prioritize key SNPs, but include others if needed
    if (snps && snps.length > 0) {
      const keySNPs = snps.filter(snp => {
        const gene = snp.supported_snps?.gene || snp.gene_name || '';
        const rsid = snp.supported_snps?.rsid || snp.snp_id || snp.rsid || '';
        return isKeySNP(gene, rsid);
      });
      
      // If user has very few key SNPs, include some additional ones
      let snpsToAnalyze = keySNPs;
      if (keySNPs.length < 3) {
        // Add some additional SNPs if user doesn't have many key ones
        const additionalSNPs = snps
          .filter(s => !keySNPs.includes(s))
          .slice(0, Math.max(0, 8 - keySNPs.length));
        snpsToAnalyze = [...keySNPs, ...additionalSNPs];
        console.log(`📊 User has only ${keySNPs.length} key SNPs, adding ${additionalSNPs.length} additional ones`);
      }
      
      console.log(`🎯 Analyzing SNPs: ${snps.length} total → ${keySNPs.length} key → ${snpsToAnalyze.length} final`);
      
      for (const snp of snpsToAnalyze) {
        analysisRows.push({
          user_id: user.id,
          analysis_type: 'snp',
          item_id: `${snp.rsid}_${snp.id}`,
          analysis_data: generateEnhancedSNPAnalysis(snp)
        });
      }
    }
    
    console.log('✅ Analysis results created:', analysisRows.length, 'items');
    
    // INSERT INTO DATABASE
    if (analysisRows.length > 0) {
      console.log('💾 Inserting analysis results...');
      
      const { error: insertError } = await supabaseService
        .from('user_comprehensive_analysis')
        .upsert(analysisRows, { 
          onConflict: 'user_id,analysis_type,item_id',
          ignoreDuplicates: false 
        });

      if (insertError) {
        console.error('❌ Insert failed:', insertError);
        throw insertError;
      }
      
      console.log('✅ Analysis results saved successfully');
    } else {
      console.log('⚠️ No data to analyze');
    }

    console.log('🎉 Comprehensive analysis completed');
    
    // Calculate filtered counts
    const keyBiomarkerCount = biomarkers ? biomarkers.filter(b => isKeyBiomarker(b.marker_name || '')).length : 0;
    const keySNPCount = snps ? snps.filter(s => {
      const gene = s.supported_snps?.gene || s.gene_name || '';
      const rsid = s.supported_snps?.rsid || s.snp_id || s.rsid || '';
      return isKeySNP(gene, rsid);
    }).length : 0;
    
    return new Response(
      JSON.stringify({
        success: true,
        totalBiomarkers: biomarkers?.length || 0,
        totalSNPs: snps?.length || 0,
        keyBiomarkers: keyBiomarkerCount,
        keySNPs: keySNPCount,
        analysisCount: analysisRows.length,
        message: `Analyzed ${keyBiomarkerCount} key biomarkers and ${keySNPCount} key SNPs (filtered from ${biomarkers?.length || 0} biomarkers and ${snps?.length || 0} SNPs)`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('💥 Comprehensive analysis error:', error);
    console.error('Error details:', {
      name: (error as any)?.name,
      message: (error as any)?.message,
      stack: (error as any)?.stack
    });
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Failed to generate comprehensive analysis',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}) 