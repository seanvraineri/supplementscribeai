// Import the comprehensive health database
let healthDatabase: any;

try {
  // Use a simple dynamic require that works in both environments
  if (typeof window === 'undefined') {
    // Server-side
    healthDatabase = require('./health_database_final.json');
  } else {
    // Client-side - will be handled by webpack
    healthDatabase = require('./health_database_final.json');
  }
} catch (error) {
  console.warn('Failed to load health database, using fallback:', error);
  healthDatabase = { biomarkers: [], snps: [] };
}

export const toggleSetItem = (set: Set<number>, item: number): Set<number> => {
  const newSet = new Set(set);
  if (newSet.has(item)) {
    newSet.delete(item);
  } else {
    newSet.add(item);
  }
  return newSet;
};

export const cleanBiomarkerName = (markerName: string) => {
  // Remove underscores and convert to proper case
  return markerName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const cleanSnpName = (snpId: string, geneName: string) => {
  const cleanSnp = snpId?.replace(/[^a-z0-9]/gi, '').toLowerCase() || '';
  const cleanGene = geneName?.replace(/[^a-z0-9]/gi, '').toLowerCase() || '';
  return cleanSnp || cleanGene || 'unknown';
};

export const getBiomarkerReferenceRange = (markerName: string) => {
  const marker = markerName.toLowerCase();
  
  if (marker.includes('vitamin_d') || marker.includes('25_oh')) return '30-100 ng/mL';
  if (marker.includes('b12')) return '300-900 pg/mL';
  if (marker.includes('ferritin')) return '15-200 ng/mL';
  if (marker.includes('crp')) return '<3.0 mg/L';
  if (marker.includes('hba1c')) return '<5.7%';
  
  return 'Varies by lab';
};

export const interpretBiomarker = (marker: any) => {
  const name = marker.marker_name?.toLowerCase() || '';
  const value = parseFloat(marker.value || '0');
  const displayName = formatBiomarkerName(name);
  
  // LDL Cholesterol - Fixed ranges
  if (name.includes('ldl') || name.includes('ldl_c') || name.includes('ldl cholesterol')) {
    if (value < 70) return { status: 'Optimal', color: 'green', impact: 'Excellent cardiovascular protection. Maintain current lifestyle.' };
    if (value < 100) return { status: 'Near Optimal', color: 'green', impact: 'Good cardiovascular health. Continue heart-healthy habits.' };
    if (value < 130) return { status: 'Borderline High', color: 'orange', impact: 'Elevated cardiovascular risk. Lifestyle changes recommended.' };
    if (value < 160) return { status: 'High', color: 'red', impact: 'Significant cardiovascular risk. Medical intervention may be needed.' };
    return { status: 'Very High', color: 'red', impact: 'Very high cardiovascular risk. Immediate medical attention recommended.' };
  }

  // HDL Cholesterol - Gender-specific ranges
  if (name.includes('hdl') || name.includes('hdl_c') || name.includes('hdl cholesterol')) {
    if (value < 40) return { status: 'Low', color: 'red', impact: 'Increased cardiovascular risk. HDL is protective - higher is better.' };
    if (value < 50) return { status: 'Borderline Low', color: 'orange', impact: 'Suboptimal HDL levels. Consider lifestyle modifications.' };
    if (value < 60) return { status: 'Normal', color: 'green', impact: 'Adequate HDL levels for cardiovascular protection.' };
    return { status: 'High (Protective)', color: 'green', impact: 'Excellent HDL levels providing strong cardiovascular protection.' };
  }

  // Total Cholesterol - Updated ranges
  if (name.includes('cholesterol_total') || name.includes('total cholesterol') || (name.includes('cholesterol') && !name.includes('hdl') && !name.includes('ldl'))) {
    if (value < 200) return { status: 'Desirable', color: 'green', impact: 'Optimal total cholesterol level for cardiovascular health.' };
    if (value < 240) return { status: 'Borderline High', color: 'orange', impact: 'Moderately elevated. Lifestyle changes recommended.' };
    return { status: 'High', color: 'red', impact: 'High cholesterol increases cardiovascular risk. Medical evaluation recommended.' };
  }

  // Triglycerides - Accurate ranges
  if (name.includes('triglycerides') || name.includes('trigs')) {
    if (value < 150) return { status: 'Normal', color: 'green', impact: 'Healthy triglyceride levels supporting cardiovascular health.' };
    if (value < 200) return { status: 'Borderline High', color: 'orange', impact: 'Mildly elevated. Reduce refined carbs and increase omega-3s.' };
    if (value < 500) return { status: 'High', color: 'red', impact: 'Significantly elevated. Lifestyle changes and possible medication needed.' };
    return { status: 'Very High', color: 'red', impact: 'Dangerously high. Immediate medical attention required.' };
  }

  // Total/HDL Cholesterol Ratio - Fixed calculation and ranges
  if (name.includes('cholesterol_hdl_ratio') || name.includes('hdl_ratio') || name.includes('total/hdl')) {
    if (value < 3.5) return { status: 'Excellent', color: 'green', impact: 'Optimal cholesterol ratio indicating low cardiovascular risk.' };
    if (value < 4.5) return { status: 'Good', color: 'green', impact: 'Good cholesterol ratio with moderate cardiovascular protection.' };
    if (value < 5.0) return { status: 'Borderline', color: 'orange', impact: 'Elevated ratio suggesting increased cardiovascular risk.' };
    return { status: 'High Risk', color: 'red', impact: 'High ratio indicating significant cardiovascular risk. Medical evaluation needed.' };
  }

  // Vitamin D - Clinical ranges
  if (name.includes('vitamin_d') || name.includes('25_oh') || name.includes('vitamin d')) {
    if (value < 20) return { status: 'Deficient', color: 'red', impact: 'Severe deficiency. High-dose supplementation needed (4000-6000 IU daily).' };
    if (value < 30) return { status: 'Insufficient', color: 'orange', impact: 'Suboptimal levels. Supplement with 2000-4000 IU vitamin D3 daily.' };
    if (value < 50) return { status: 'Sufficient', color: 'green', impact: 'Adequate levels for basic health. Consider optimizing to 40-60 ng/mL.' };
    if (value < 80) return { status: 'Optimal', color: 'green', impact: 'Excellent vitamin D status supporting immune and bone health.' };
    return { status: 'High', color: 'orange', impact: 'Very high levels. Reduce supplementation and monitor calcium.' };
  }

  // Vitamin B12 - Updated ranges
  if (name.includes('vitamin_b12') || name.includes('b12') || name.includes('cobalamin')) {
    if (value < 200) return { status: 'Deficient', color: 'red', impact: 'B12 deficiency. Supplement with methylcobalamin 2000-5000 mcg daily.' };
    if (value < 400) return { status: 'Low', color: 'orange', impact: 'Suboptimal B12. Consider methylcobalamin 1000-2000 mcg daily.' };
    if (value < 900) return { status: 'Normal', color: 'green', impact: 'Adequate B12 levels supporting neurological and blood health.' };
    return { status: 'High', color: 'green', impact: 'Excellent B12 levels. Continue current intake if supplementing.' };
  }

  // C-Reactive Protein (CRP) - Cardiovascular risk ranges
  if (name.includes('crp') || name.includes('c_reactive') || name.includes('hs_crp')) {
    if (value < 1.0) return { status: 'Low Risk', color: 'green', impact: 'Low inflammation and cardiovascular risk.' };
    if (value < 3.0) return { status: 'Moderate Risk', color: 'orange', impact: 'Moderate inflammation. Anti-inflammatory lifestyle recommended.' };
    if (value < 10.0) return { status: 'High Risk', color: 'red', impact: 'High inflammation indicating increased cardiovascular risk.' };
    return { status: 'Very High', color: 'red', impact: 'Very high inflammation. Rule out infection or inflammatory conditions.' };
  }

  // TSH - Functional ranges
  if (name.includes('tsh') || name.includes('thyroid_stimulating')) {
    if (value < 0.5) return { status: 'Low', color: 'orange', impact: 'Possible hyperthyroidism. Evaluate thyroid function further.' };
    if (value < 2.5) return { status: 'Optimal', color: 'green', impact: 'Excellent thyroid function supporting optimal metabolism.' };
    if (value < 4.5) return { status: 'Normal', color: 'green', impact: 'Normal thyroid function within standard reference range.' };
    if (value < 10.0) return { status: 'Elevated', color: 'orange', impact: 'Subclinical hypothyroidism. Monitor and consider treatment.' };
    return { status: 'High', color: 'red', impact: 'Hypothyroidism. Thyroid hormone replacement likely needed.' };
  }

  // HbA1c - Diabetes ranges
  if (name.includes('hba1c') || name.includes('a1c') || name.includes('hemoglobin_a1c')) {
    if (value < 5.7) return { status: 'Normal', color: 'green', impact: 'Excellent glucose control and low diabetes risk.' };
    if (value < 6.5) return { status: 'Prediabetes', color: 'orange', impact: 'Prediabetes range. Lifestyle changes can prevent diabetes.' };
    if (value < 7.0) return { status: 'Diabetes (Good Control)', color: 'orange', impact: 'Diabetes with good control. Continue current management.' };
    if (value < 8.0) return { status: 'Diabetes (Fair Control)', color: 'red', impact: 'Diabetes with fair control. Optimize treatment plan.' };
    return { status: 'Diabetes (Poor Control)', color: 'red', impact: 'Diabetes with poor control. Immediate intervention needed.' };
  }

  // Fasting Glucose - Updated ranges
  if (name.includes('glucose') || name.includes('fasting_glucose')) {
    if (value < 100) return { status: 'Normal', color: 'green', impact: 'Healthy glucose metabolism and low diabetes risk.' };
    if (value < 126) return { status: 'Prediabetes', color: 'orange', impact: 'Impaired fasting glucose. Lifestyle changes recommended.' };
    return { status: 'Diabetes', color: 'red', impact: 'Diabetes range. Medical evaluation and treatment needed.' };
  }

  // Ferritin - Gender-specific ranges
  if (name.includes('ferritin')) {
    if (value < 15) return { status: 'Deficient', color: 'red', impact: 'Iron deficiency. Iron supplementation and dietary changes needed.' };
    if (value < 30) return { status: 'Low', color: 'orange', impact: 'Low iron stores. Increase iron-rich foods and consider supplementation.' };
    if (value < 150) return { status: 'Normal', color: 'green', impact: 'Adequate iron stores supporting healthy blood and energy.' };
    if (value < 300) return { status: 'High Normal', color: 'green', impact: 'Upper normal iron stores. Monitor for iron overload.' };
    return { status: 'High', color: 'red', impact: 'Iron overload possible. Evaluate for hemochromatosis or inflammation.' };
  }

  // Default interpretation with proper formatting
  return { 
    status: 'Normal', 
    color: 'green', 
    impact: `${displayName} levels appear to be within normal range. Continue monitoring as part of regular health maintenance.` 
  };
};

export const interpretSNP = (snp: any) => {
  const gene = snp.gene_name || '';
  const genotype = snp.genotype || snp.allele || '';
  const rsid = snp.snp_id || snp.rsid || '';

  // MTHFR C677T (rs1801133)
  if (gene.includes('MTHFR') || rsid === 'rs1801133') {
    if (genotype === 'TT' || genotype === 'T/T') {
      return { 
        impact: 'Significantly reduced MTHFR enzyme activity (70% reduction)', 
        symptoms: 'Impaired folate metabolism, elevated homocysteine risk', 
        severity: 'High', 
        color: 'red',
        recommendations: ['Methylfolate (5-MTHF) 800-1000 mcg daily', 'Avoid synthetic folic acid', 'Methylcobalamin B12 1000+ mcg daily']
      };
    }
    if (genotype === 'CT' || genotype === 'C/T') {
      return { 
        impact: 'Moderately reduced MTHFR enzyme activity (30-40% reduction)', 
        symptoms: 'Mildly impaired folate metabolism', 
        severity: 'Moderate', 
        color: 'orange',
        recommendations: ['Methylfolate (5-MTHF) 400-800 mcg daily', 'Limit synthetic folic acid', 'Include B12 and B6']
      };
    }
    return { 
      impact: 'Normal MTHFR enzyme function', 
      symptoms: 'Standard folate metabolism', 
      severity: 'Normal', 
      color: 'green',
      recommendations: ['Standard folate intake through diet', 'Include folate-rich foods']
    };
  }

  // COMT Val158Met (rs4680)
  if (gene.includes('COMT') || rsid === 'rs4680') {
    if (genotype === 'AA' || genotype === 'A/A') {
      return { 
        impact: 'Slower dopamine breakdown (Met/Met variant)', 
        symptoms: 'Higher baseline dopamine, stress sensitivity, better working memory', 
        severity: 'Moderate', 
        color: 'orange',
        recommendations: ['Avoid stimulants', 'Stress management crucial', 'Magnesium glycinate 400mg', 'Theanine for calm focus']
      };
    }
    if (genotype === 'GG' || genotype === 'G/G') {
      return { 
        impact: 'Faster dopamine breakdown (Val/Val variant)', 
        symptoms: 'Lower baseline dopamine, stress resilient, may need more stimulation', 
        severity: 'Moderate', 
        color: 'yellow',
        recommendations: ['Tyrosine 500-1000mg daily', 'Green tea or coffee beneficial', 'Regular exercise important', 'Rhodiola for stress support']
      };
    }
    return { 
      impact: 'Balanced dopamine metabolism (Val/Met variant)', 
      symptoms: 'Moderate stress response and working memory', 
      severity: 'Normal', 
      color: 'green',
      recommendations: ['Balanced approach to stimulants', 'Regular exercise', 'Adequate sleep']
    };
  }

  // APOE (rs429358 + rs7412)
  if (gene.includes('APOE') || rsid === 'rs429358' || rsid === 'rs7412') {
    if (genotype.includes('E4') || genotype === 'TT' || genotype === 'T/T') {
      return { 
        impact: 'APOE4 variant - increased Alzheimer\'s and cardiovascular risk', 
        symptoms: 'Higher inflammation, altered lipid metabolism, cognitive risk', 
        severity: 'Significant', 
        color: 'red',
        recommendations: ['Omega-3 EPA/DHA 2-3g daily', 'Mediterranean diet', 'Regular aerobic exercise', 'Curcumin 1000mg', 'Avoid head trauma']
      };
    }
    if (genotype.includes('E2') || genotype === 'CC' || genotype === 'C/C') {
      return { 
        impact: 'APOE2 variant - protective against Alzheimer\'s', 
        symptoms: 'Lower cardiovascular risk, better cognitive aging', 
        severity: 'Protective', 
        color: 'green',
        recommendations: ['Maintain healthy lifestyle', 'Regular exercise', 'Balanced nutrition']
      };
    }
    return { 
      impact: 'APOE3 variant - standard Alzheimer\'s and cardiovascular risk', 
      symptoms: 'Normal cognitive aging expected', 
      severity: 'Normal', 
      color: 'green',
      recommendations: ['Standard brain health protocols', 'Regular exercise', 'Healthy diet']
    };
  }

  // CYP1A2 (rs762551)
  if (gene.includes('CYP1A2') || rsid === 'rs762551') {
    if (genotype === 'AA' || genotype === 'A/A') {
      return { 
        impact: 'Slow caffeine metabolizer', 
        symptoms: 'Caffeine sensitivity, prolonged stimulation, anxiety risk', 
        severity: 'Moderate', 
        color: 'orange',
        recommendations: ['Limit caffeine to <100mg daily', 'Avoid caffeine after 12pm', 'Consider theanine with coffee', 'Monitor anxiety levels']
      };
    }
    return { 
      impact: 'Fast caffeine metabolizer', 
      symptoms: 'Normal caffeine tolerance, quick metabolism', 
      severity: 'Normal', 
      color: 'green',
      recommendations: ['Normal caffeine intake acceptable', 'Up to 400mg daily generally safe', 'Monitor individual response']
    };
  }

  // VDR (Vitamin D Receptor)
  if (gene.includes('VDR')) {
    if (genotype === 'TT' || genotype === 'T/T' || genotype === 'AA' || genotype === 'A/A') {
      return { 
        impact: 'Altered vitamin D receptor function', 
        symptoms: 'May need higher vitamin D levels for optimal function', 
        severity: 'Moderate', 
        color: 'orange',
        recommendations: ['Target vitamin D levels 50-80 ng/mL', 'Higher dose vitamin D3 may be needed', 'Include vitamin K2', 'Regular monitoring']
      };
    }
    return { 
      impact: 'Normal vitamin D receptor function', 
      symptoms: 'Standard vitamin D metabolism', 
      severity: 'Normal', 
      color: 'green',
      recommendations: ['Standard vitamin D supplementation', 'Target 30-50 ng/mL', 'Include vitamin K2']
    };
  }

  // COMPREHENSIVE FALLBACK ANALYSIS BY GENE FAMILY
  // Instead of showing "Unknown", provide valuable insights based on gene function
  
  // Detoxification genes (CYP family)
  if (gene.includes('CYP') || rsid.includes('cyp')) {
    return {
      impact: 'Cytochrome P450 enzyme variant affecting drug and toxin metabolism',
      symptoms: 'May influence medication effectiveness and detoxification capacity',
      severity: 'Moderate',
      color: 'orange',
      recommendations: ['Discuss medication dosing with healthcare provider', 'Support liver detoxification with cruciferous vegetables', 'Consider milk thistle supplementation', 'Avoid excessive alcohol and toxin exposure']
    };
  }

  // Methylation genes (MTHFR family, CBS, etc.)
  if (gene.includes('MTH') || gene.includes('CBS') || gene.includes('BHMT')) {
    return {
      impact: 'Methylation pathway variant affecting folate and B-vitamin metabolism',
      symptoms: 'May influence homocysteine levels and methylation capacity',
      severity: 'Moderate',
      color: 'orange',
      recommendations: ['Methylated B-vitamins (B12, folate, B6)', 'Monitor homocysteine levels', 'Limit synthetic folic acid', 'Include choline-rich foods']
    };
  }

  // Neurotransmitter genes
  if (gene.includes('COMT') || gene.includes('MAO') || gene.includes('DAT') || gene.includes('DRD')) {
    return {
      impact: 'Neurotransmitter metabolism variant affecting dopamine, serotonin, or norepinephrine',
      symptoms: 'May influence mood, stress response, and cognitive function',
      severity: 'Moderate',
      color: 'yellow',
      recommendations: ['Stress management techniques', 'Regular exercise for neurotransmitter balance', 'Consider adaptogenic herbs', 'Monitor caffeine sensitivity']
    };
  }

  // Inflammation and immune genes
  if (gene.includes('TNF') || gene.includes('IL') || gene.includes('NF') || gene.includes('TLR')) {
    return {
      impact: 'Immune and inflammatory response variant',
      symptoms: 'May influence inflammation levels and immune system function',
      severity: 'Moderate',
      color: 'orange',
      recommendations: ['Anti-inflammatory diet rich in omega-3s', 'Curcumin and quercetin supplementation', 'Regular moderate exercise', 'Stress reduction practices']
    };
  }

  // Cardiovascular genes
  if (gene.includes('ACE') || gene.includes('AGT') || gene.includes('APOE') || gene.includes('LDLR')) {
    return {
      impact: 'Cardiovascular health variant affecting blood pressure, cholesterol, or heart function',
      symptoms: 'May influence cardiovascular disease risk and lipid metabolism',
      severity: 'Moderate',
      color: 'orange',
      recommendations: ['Heart-healthy Mediterranean diet', 'Regular cardiovascular exercise', 'Monitor blood pressure and lipids', 'Omega-3 fatty acids 2-3g daily']
    };
  }

  // Antioxidant and oxidative stress genes
  if (gene.includes('SOD') || gene.includes('CAT') || gene.includes('GPX') || gene.includes('GST')) {
    return {
      impact: 'Antioxidant enzyme variant affecting oxidative stress protection',
      symptoms: 'May influence cellular protection against free radical damage',
      severity: 'Moderate',
      color: 'orange',
      recommendations: ['Antioxidant-rich foods (berries, dark leafy greens)', 'Vitamin C and E supplementation', 'N-acetylcysteine for glutathione support', 'Limit exposure to environmental toxins']
    };
  }

  // Hormone metabolism genes
  if (gene.includes('ESR') || gene.includes('AR') || gene.includes('SHBG') || gene.includes('CYP17') || gene.includes('CYP19')) {
    return {
      impact: 'Hormone metabolism variant affecting estrogen, testosterone, or other hormones',
      symptoms: 'May influence hormone balance and related health outcomes',
      severity: 'Moderate',
      color: 'orange',
      recommendations: ['Support healthy hormone balance with cruciferous vegetables', 'Regular exercise for hormone optimization', 'Consider DIM or I3C supplementation', 'Monitor hormone levels with healthcare provider']
    };
  }

  // Final fallback with actionable advice
  return { 
    impact: `${gene || 'This'} genetic variant may influence various biological processes`,
    symptoms: 'Individual effects vary based on genotype and environmental factors',
    severity: 'Moderate',
    color: 'blue',
    recommendations: [
      'Maintain a nutrient-dense, anti-inflammatory diet',
      'Regular exercise and stress management',
      'Consider comprehensive genetic counseling',
      'Monitor relevant biomarkers with healthcare provider',
      'Stay updated on emerging research for this variant'
    ]
  };
};

// COMPREHENSIVE BIOMARKER DATABASE
const BIOMARKER_DATABASE: Record<string, any> = {
  'vitamin_d_25_oh': {
    name: 'Vitamin D (25-OH)',
    description: 'Essential for bone health, immune function, muscle strength, and cardiovascular health.',
    referenceRanges: {
      optimal: { min: 40, max: 80, unit: 'ng/mL' },
      sufficient: { min: 30, max: 100, unit: 'ng/mL' },
      insufficient: { min: 20, max: 30, unit: 'ng/mL' },
      deficient: { min: 0, max: 20, unit: 'ng/mL' },
      excessive: { min: 100, max: 999, unit: 'ng/mL' }
    },
    symptoms: {
      low: ['Fatigue', 'Muscle weakness', 'Bone pain', 'Frequent infections', 'Depression'],
      high: ['Kidney stones', 'Hypercalcemia', 'Nausea', 'Vomiting']
    },
    recommendations: {
      deficient: ['Supplement with 4000-6000 IU vitamin D3 daily', 'Take with fat-containing meal', 'Include vitamin K2 (200 mcg)', 'Retest in 8-12 weeks'],
      insufficient: ['Supplement with 2000-4000 IU vitamin D3 daily', 'Increase sun exposure (15-20 minutes daily)', 'Include vitamin K2 (100-200 mcg)', 'Retest in 3 months'],
      optimal: ['Maintain 2000-4000 IU vitamin D3 daily', 'Regular sun exposure 3-4x weekly', 'Continue vitamin K2 supplementation', 'Monitor every 6-12 months'],
      excessive: ['Discontinue vitamin D supplementation immediately', 'Increase water intake', 'Monitor calcium levels', 'Retest in 6-8 weeks']
    }
  },
  'vitamin_b12': {
    name: 'Vitamin B12',
    description: 'Essential for DNA synthesis, red blood cell formation, and nervous system function.',
    referenceRanges: {
      optimal: { min: 500, max: 900, unit: 'pg/mL' },
      normal: { min: 300, max: 900, unit: 'pg/mL' },
      low: { min: 200, max: 300, unit: 'pg/mL' },
      deficient: { min: 0, max: 200, unit: 'pg/mL' }
    },
    symptoms: {
      low: ['Fatigue', 'Weakness', 'Memory problems', 'Tingling in hands/feet', 'Pale skin']
    },
    recommendations: {
      deficient: ['Methylcobalamin 2000-5000 mcg daily', 'Consider sublingual or injection forms', 'Include B-complex', 'Consume B12-rich foods: liver, sardines'],
      low: ['Methylcobalamin 1000-2000 mcg daily', 'Include B12-rich foods regularly', 'Consider digestive support', 'Retest in 3 months'],
      optimal: ['Maintain through animal foods: grass-fed beef, wild salmon', 'If vegetarian: methylcobalamin 500-1000 mcg daily', 'Monitor annually if over 50']
    }
  },
  'ferritin': {
    name: 'Ferritin',
    description: 'Iron storage protein reflecting total body iron stores.',
    referenceRanges: {
      optimal_men: { min: 50, max: 200, unit: 'ng/mL' },
      optimal_women: { min: 30, max: 150, unit: 'ng/mL' },
      normal_men: { min: 20, max: 300, unit: 'ng/mL' },
      normal_women: { min: 15, max: 200, unit: 'ng/mL' },
      low: { min: 0, max: 30, unit: 'ng/mL' },
      high: { min: 300, max: 999, unit: 'ng/mL' }
    },
    symptoms: {
      low: ['Fatigue', 'Weakness', 'Cold hands/feet', 'Brittle nails', 'Hair loss'],
      high: ['Joint pain', 'Fatigue', 'Abdominal pain', 'Heart problems']
    },
    recommendations: {
      low: ['Iron bisglycinate 25-50 mg daily', 'Take with vitamin C (500 mg)', 'Consume heme iron: red meat, liver, oysters', 'Avoid tea/coffee within 2 hours'],
      high: ['Investigate underlying causes', 'Avoid iron supplements', 'Consider blood donation', 'Anti-inflammatory diet'],
      optimal: ['Maintain through heme sources', 'Include vitamin C with meals', 'Monitor annually']
    }
  },
  'hs_crp': {
    name: 'High-Sensitivity C-Reactive Protein',
    description: 'Marker of systemic inflammation and cardiovascular risk.',
    referenceRanges: {
      low_risk: { min: 0, max: 1.0, unit: 'mg/L' },
      moderate_risk: { min: 1.0, max: 3.0, unit: 'mg/L' },
      high_risk: { min: 3.0, max: 10.0, unit: 'mg/L' },
      very_high: { min: 10.0, max: 999, unit: 'mg/L' }
    },
    symptoms: {
      high: ['Fatigue', 'Joint pain', 'Increased infection risk']
    },
    recommendations: {
      high_risk: ['Omega-3 fatty acids 3-4g EPA/DHA daily', 'Curcumin 1000 mg with piperine', 'Anti-inflammatory foods', 'Regular exercise', 'Stress management'],
      moderate_risk: ['Omega-3 fatty acids 2-3g daily', 'Increase anti-inflammatory foods', 'Regular exercise'],
      low_risk: ['Maintain anti-inflammatory lifestyle', 'Continue regular exercise']
    }
  }
};

// COMPREHENSIVE SNP DATABASE
const SNP_DATABASE: Record<string, any> = {
  'rs1801133': {
    gene: 'MTHFR',
    name: 'MTHFR C677T',
    description: 'Affects folate metabolism and methylation capacity.',
    variants: {
      'CC': {
        effect: 'Normal MTHFR enzyme function',
        impact: 'Standard folate metabolism',
        risk: 'Standard',
        recommendations: ['Standard folate intake through diet', 'Include folate-rich foods: leafy greens, legumes']
      },
      'CT': {
        effect: 'Reduced MTHFR enzyme activity (30-40%)',
        impact: 'Mildly impaired folate metabolism',
        risk: 'Mild',
        recommendations: ['Methylfolate (5-MTHF) 400-800 mcg daily', 'Limit synthetic folic acid', 'Include B12 and B6']
      },
      'TT': {
        effect: 'Significantly reduced MTHFR enzyme activity (70%)',
        impact: 'Severely impaired folate metabolism and methylation',
        risk: 'High',
        recommendations: ['Methylfolate (5-MTHF) 800-1000 mcg daily', 'Avoid synthetic folic acid completely', 'Methylcobalamin B12 1000-2000 mcg daily', 'P5P B6 25-50 mg daily']
      }
    }
  },
  'rs1801131': {
    gene: 'MTHFR',
    name: 'MTHFR A1298C',
    description: 'Affects BH4 cofactor production and neurotransmitter synthesis.',
    variants: {
      'AA': {
        effect: 'Normal MTHFR enzyme function',
        impact: 'Standard neurotransmitter production',
        risk: 'Standard',
        recommendations: ['Standard B-vitamin intake', 'Balanced diet with adequate protein']
      },
      'AC': {
        effect: 'Mildly reduced enzyme activity',
        impact: 'Slightly impaired neurotransmitter synthesis',
        risk: 'Mild',
        recommendations: ['B-complex with methylated forms', 'Support neurotransmitter production with tyrosine']
      },
      'CC': {
        effect: 'Reduced enzyme activity affecting BH4 production',
        impact: 'Impaired neurotransmitter synthesis',
        risk: 'Moderate',
        recommendations: ['Methylated B-vitamins', 'BH4 cofactor support', 'Tyrosine 500-1000 mg daily', 'Magnesium glycinate 400 mg']
      }
    }
  }
};

// AI ANALYSIS FUNCTIONS - These call the Supabase Edge Function
const getAIBiomarkerAnalysis = async (markerName: string, value: string, unit: string, userConditions: any[] = [], userAllergies: any[] = []) => {
  try {
    // Ensure value is a string
    const stringValue = String(value || '');
    
    const response = await fetch('/api/ai-health-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'biomarker',
        markerName,
        value: stringValue,
        unit,
        userConditions,
        userAllergies
      }),
    });

    if (!response.ok) {
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI biomarker analysis failed:', error);
    return {
      name: markerName,
      description: `${markerName} is an important health biomarker.`,
      currentValue: `${String(value)} ${unit}`,
      currentRange: 'Analysis unavailable',
      referenceRange: 'Varies by lab',
      symptoms: [],
      recommendations: [
        'Consult with your healthcare provider for interpretation',
        'Maintain a balanced, nutrient-dense diet',
        'Regular physical activity',
        'Adequate sleep and stress management'
      ],
      riskLevel: 'Unknown'
    };
  }
};

const getAISNPAnalysis = async (snpId: string, geneName: string, genotype: string, userConditions: any[] = [], userAllergies: any[] = []) => {
  try {
    // Ensure genotype is a string
    const stringGenotype = String(genotype || '');
    
    const response = await fetch('/api/ai-health-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'snp',
        snpId,
        geneName,
        genotype: stringGenotype,
        userConditions,
        userAllergies
      }),
    });

    if (!response.ok) {
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI SNP analysis failed:', error);
    return {
      gene: geneName || 'Unknown',
      name: `${geneName || 'Unknown'} ${snpId || ''}`,
      description: 'This genetic variant may influence various biological processes. AI analysis temporarily unavailable.',
      genotype: String(genotype || ''),
      effect: 'Effects not well-characterized in our current database',
      impact: 'Unknown',
      riskLevel: 'Unknown',
      recommendations: [
        'Maintain a comprehensive healthy lifestyle approach',
        'Focus on nutrient-dense, anti-inflammatory diet',
        'Regular physical activity appropriate for your fitness level',
        'Adequate sleep and stress management',
        'Consider working with a genetic counselor for detailed interpretation',
        'Stay updated on emerging research for this genetic variant',
        'Focus on modifiable lifestyle factors rather than genetic predisposition',
        'Consider comprehensive genetic testing for broader health insights'
      ],
      functionalImpact: 'Unknown'
    };
  }
};

// ENHANCED EDUCATION FUNCTIONS - Using comprehensive database with AI fallback
export const getBiomarkerEducation = async (markerName: string, value: string, unit: string, userConditions: any[] = [], userAllergies: any[] = []) => {
  // Handle null/empty values early - convert to string first
  const stringValue = String(value || '');
  if (!stringValue || stringValue.trim() === '' || stringValue === 'null' || stringValue === 'undefined') {
    return {
      name: markerName,
      description: 'No value available for analysis.',
      currentValue: 'Not provided',
      currentRange: 'Unknown',
      referenceRange: 'Not available',
      symptoms: [],
      recommendations: ['Upload lab results to get personalized analysis'],
      riskLevel: 'Unknown'
    };
  }
  
  // First try to find match in comprehensive database
  const referenceData = findBiomarkerMatch(markerName);
  
  if (referenceData) {
    const numericValue = parseFloat(stringValue);
    
    // Handle invalid numeric values
    if (isNaN(numericValue)) {
      return {
        name: referenceData.name,
        description: `${referenceData.name} is an important health biomarker.`,
        currentValue: `${stringValue} ${unit}`,
        currentRange: 'Invalid Value',
        referenceRange: `Optimal: ${referenceData.optimal_range[0]}-${referenceData.optimal_range[1]} ${referenceData.unit}`,
        symptoms: [],
        recommendations: ['Please verify the lab value is entered correctly'],
        riskLevel: 'Unknown'
      };
    }
    
    const optimalRange = referenceData.optimal_range || [0, 999999];
    const [minOptimal, maxOptimal] = optimalRange;
    
    // Determine status based on optimal range
    let status = 'optimal';
    let analysis = null;
    let statusColor = 'green';
    let riskLevel = 'Low';
    
    if (numericValue < minOptimal) {
      status = 'low';
      analysis = referenceData.low;
      statusColor = 'orange';
      riskLevel = 'Medium';
    } else if (numericValue > maxOptimal) {
      status = 'high';
      analysis = referenceData.high;
      statusColor = 'red';
      riskLevel = 'High';
    } else {
      // Value is in optimal range
      analysis = referenceData.low; // Use low data structure but with optimal messaging
      statusColor = 'green';
      riskLevel = 'Low';
    }
    
    // Build comprehensive response
    const response = {
      name: referenceData.name,
      description: analysis?.description || `${referenceData.name} is an important health biomarker. Your current level is ${status === 'optimal' ? 'within the optimal range' : status}.`,
      currentValue: `${stringValue} ${unit}`,
      currentRange: status.charAt(0).toUpperCase() + status.slice(1),
      referenceRange: `Optimal: ${minOptimal}-${maxOptimal} ${referenceData.unit}`,
      symptoms: status === 'optimal' ? [] : (analysis?.lifestyle_recommendations || []).slice(0, 4),
      recommendations: status === 'optimal' 
        ? [
            `Maintain current levels through healthy lifestyle`,
            `Continue regular monitoring`,
            `Keep up current diet and exercise routine`
          ]
        : [
            ...(analysis?.supplement_recommendations || []).slice(0, 4),
            ...(analysis?.lifestyle_recommendations || []).slice(0, 3)
          ].slice(0, 6),
      riskLevel: riskLevel,
      statusColor: statusColor
    };
    
    return response;
  }
  
  // Fallback to AI analysis if no match found
  return await getAIBiomarkerAnalysis(markerName, stringValue, unit, userConditions, userAllergies);
};

export const getSNPEducation = async (snpId: string, geneName: string, genotype: string, userConditions: any[] = [], userAllergies: any[] = []) => {
  // Handle null/empty values early - convert to string first
  const stringGenotype = String(genotype || '');
  if (!stringGenotype || stringGenotype.trim() === '' || stringGenotype === 'null' || stringGenotype === 'undefined') {
    return {
      gene: geneName || 'Unknown',
      name: `${geneName || 'Unknown'} ${snpId || ''}`,
      description: 'No genotype data available for analysis.',
      genotype: 'Not provided',
      effect: 'Unknown',
      impact: 'Cannot determine impact without genotype data',
      riskLevel: 'Unknown',
      recommendations: ['Upload genetic test results to get personalized analysis'],
      functionalImpact: 'Unknown'
    };
  }

  // First try to find match in comprehensive database
  const referenceData = findSnpMatch(snpId, geneName);
  
  if (referenceData && referenceData.variants) {
    // Normalize genotype for matching (handle C/T, CT, C;T variations)
    const normalizedGenotype = stringGenotype.toUpperCase().replace(/[^ACGT]/g, '').split('').sort().join('');
    
    // Find matching variant data
    let variantData = referenceData.variants.find((v: any) => {
      const variantGenotype = v.genotype.toUpperCase().replace(/[^ACGT]/g, '').split('').sort().join('');
      return variantGenotype === normalizedGenotype;
    });

    // If no exact match, try direct genotype match
    if (!variantData) {
      variantData = referenceData.variants.find((v: any) => 
        v.genotype.toUpperCase() === stringGenotype.toUpperCase()
      );
    }
    
    if (variantData) {
      // Build comprehensive response
      const allRecommendations = [
        ...(variantData.lifestyle_recommendations || []),
        ...(variantData.dietary_recommendations || []),
        ...(variantData.supplement_recommendations || [])
      ];

      return {
        gene: geneName || referenceData.name?.split(' ')[0] || 'Unknown',
        name: referenceData.name || `${geneName} ${snpId}`,
        description: `${referenceData.impact || 'This genetic variant affects various biological processes.'} Your genotype (${stringGenotype}) indicates: ${variantData.effect}`,
        genotype: stringGenotype,
        effect: variantData.effect,
        impact: referenceData.impact,
        riskLevel: variantData.risk_level || 'Unknown',
        recommendations: allRecommendations.slice(0, 8),
        functionalImpact: variantData.effect,
        riskColor: variantData.risk_level === 'Low' ? 'green' : 
                  variantData.risk_level === 'Medium' ? 'orange' : 'red'
      };
    }
  }
  
  // Fallback to AI analysis if no match found
  return await getAISNPAnalysis(snpId, geneName, stringGenotype, userConditions, userAllergies);
};

// Flexible biomarker name matching - handles various lab naming conventions
export const findBiomarkerMatch = (userBiomarkerName: string) => {
  const cleanUserName = userBiomarkerName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '');

  // COMPREHENSIVE DATABASE-TO-JSON MAPPING
  // This maps the exact database field names to JSON biomarker names
  const EXACT_DATABASE_MAPPINGS: Record<string, string> = {
    // Cholesterol Panel
    'cholesteroltotal': 'Total Cholesterol',
    'totalcholesterol': 'Total Cholesterol', 
    'cholesterol': 'Total Cholesterol',
    'chol': 'Total Cholesterol',
    
    'hdlc': 'HDL Cholesterol',
    'hdlcholesterol': 'HDL Cholesterol',
    'hdl': 'HDL Cholesterol',
    
    'ldlc': 'LDL Cholesterol', 
    'ldlcholesterol': 'LDL Cholesterol',
    'ldl': 'LDL Cholesterol',
    
    'nonhdlcholesterol': 'LDL Cholesterol', // Non-HDL often maps to LDL for analysis
    'nonhdl': 'LDL Cholesterol',
    
    'triglycerides': 'Triglycerides',
    'trigs': 'Triglycerides',
    'tg': 'Triglycerides',
    
    // Vitamins
    'vitamind25oh': 'Vitamin D',
    'vitamind': 'Vitamin D',
    'vitd': 'Vitamin D',
    'vit25oh': 'Vitamin D',
    '25ohd': 'Vitamin D',
    '25hydroxyvitamind': 'Vitamin D',
    'calcidiol': 'Vitamin D',
    
    'vitaminb12': 'Vitamin B12',
    'b12': 'Vitamin B12',
    'cobalamin': 'Vitamin B12',
    'methylcobalamin': 'Vitamin B12',
    'cyanocobalamin': 'Vitamin B12',
    
    'folate': 'Folate (Serum)',
    'folicacid': 'Folate (Serum)',
    'serumfolate': 'Folate (Serum)',
    'vitaminb9': 'Folate (Serum)',
    'b9': 'Folate (Serum)',
    
    // Inflammatory Markers
    'hscrp': 'C-Reactive Protein (CRP)',
    'crp': 'C-Reactive Protein (CRP)',
    'creactiveprotein': 'C-Reactive Protein (CRP)',
    'highsensitivitycrp': 'C-Reactive Protein (CRP)',
    'cprotein': 'C-Reactive Protein (CRP)',
    
    // Thyroid
    'tsh': 'TSH (Thyroid Stimulating Hormone)',
    'thyroidstimulatinghormone': 'TSH (Thyroid Stimulating Hormone)',
    'thyrotropin': 'TSH (Thyroid Stimulating Hormone)',
    
    'freet3': 'Free T3 (Triiodothyronine)',
    't3free': 'Free T3 (Triiodothyronine)',
    'triiodothyronine': 'Free T3 (Triiodothyronine)',
    
    'freet4': 'Free T4 (Thyroxine)',
    't4free': 'Free T4 (Thyroxine)',
    'thyroxine': 'Free T4 (Thyroxine)',
    
    'reverset3': 'Reverse T3',
    'rt3': 'Reverse T3',
    
    // Metabolic Markers
    'hba1c': 'HbA1c (Hemoglobin A1c)',
    'hemoglobina1c': 'HbA1c (Hemoglobin A1c)',
    'glycatedhemoglobin': 'HbA1c (Hemoglobin A1c)',
    'a1c': 'HbA1c (Hemoglobin A1c)',
    'hgba1c': 'HbA1c (Hemoglobin A1c)',
    
    'glucose': 'Fasting Glucose',
    'fastingglucose': 'Fasting Glucose',
    'bloodglucose': 'Fasting Glucose',
    'serumglucose': 'Fasting Glucose',
    'glu': 'Fasting Glucose',
    
    'insulin': 'Insulin',
    'fastinginsulin': 'Insulin',
    'seruminsulin': 'Insulin',
    
    // Liver Function
    'alt': 'ALT (Alanine Aminotransferase)',
    'alanineaminotransferase': 'ALT (Alanine Aminotransferase)',
    'sgpt': 'ALT (Alanine Aminotransferase)',
    
    'ast': 'AST (Aspartate Aminotransferase)',
    'aspartateaminotransferase': 'AST (Aspartate Aminotransferase)',
    'sgot': 'AST (Aspartate Aminotransferase)',
    
    'ggt': 'GGT (Gamma-Glutamyl Transferase)',
    'gammaglutamyltransferase': 'GGT (Gamma-Glutamyl Transferase)',
    
    'bilirubin': 'Bilirubin (Total)',
    'totalbilirubin': 'Bilirubin (Total)',
    'bili': 'Bilirubin (Total)',
    
    'albumin': 'Albumin',
    'serumalbumin': 'Albumin',
    'alb': 'Albumin',
    
    // Kidney Function
    'creatinine': 'Creatinine',
    'serumcreatinine': 'Creatinine',
    'creat': 'Creatinine',
    
    'bun': 'BUN (Blood Urea Nitrogen)',
    'bloodureanitrogen': 'BUN (Blood Urea Nitrogen)',
    'urea': 'BUN (Blood Urea Nitrogen)',
    
    'egfr': 'eGFR (Estimated Glomerular Filtration Rate)',
    'estimatedglomerularfiltrationrate': 'eGFR (Estimated Glomerular Filtration Rate)',
    'gfr': 'eGFR (Estimated Glomerular Filtration Rate)',
    
    'uricacid': 'Uric Acid',
    'urate': 'Uric Acid',
    
    // Electrolytes & Minerals
    'calcium': 'Calcium',
    'serumcalcium': 'Calcium',
    'ca': 'Calcium',
    
    'magnesium': 'Magnesium',
    'serummagnesium': 'Magnesium',
    'mg': 'Magnesium',
    
    'phosphorus': 'Phosphorus',
    'phosphate': 'Phosphorus',
    'phos': 'Phosphorus',
    
    'sodium': 'Sodium',
    'na': 'Sodium',
    
    'potassium': 'Potassium',
    'k': 'Potassium',
    
    'chloride': 'Chloride',
    'cl': 'Chloride',
    
    'co2': 'CO2 (Carbon Dioxide)',
    'carbondioxide': 'CO2 (Carbon Dioxide)',
    'bicarbonate': 'CO2 (Carbon Dioxide)',
    
    // Iron Studies
    'ferritin': 'Ferritin',
    'serumferritin': 'Ferritin',
    'storediron': 'Ferritin',
    
    // Complete Blood Count
    'wbc': 'WBC (White Blood Cell Count)',
    'whitebloodcellcount': 'WBC (White Blood Cell Count)',
    'leukocytes': 'WBC (White Blood Cell Count)',
    'wbccount': 'WBC (White Blood Cell Count)',
    
    'rbc': 'RBC (Red Blood Cell Count)',
    'redbloodcellcount': 'RBC (Red Blood Cell Count)',
    'erythrocytes': 'RBC (Red Blood Cell Count)',
    'rbccount': 'RBC (Red Blood Cell Count)',
    
    'hemoglobin': 'Hemoglobin',
    'hgb': 'Hemoglobin',
    'hb': 'Hemoglobin',
    
    'hematocrit': 'Hematocrit',
    'hct': 'Hematocrit',
    
    'mcv': 'MCV (Mean Corpuscular Volume)',
    'meancorpuscularvolume': 'MCV (Mean Corpuscular Volume)',
    
    'mch': 'MCH (Mean Corpuscular Hemoglobin)',
    'meancorpuscularhemoglobin': 'MCH (Mean Corpuscular Hemoglobin)',
    
    'mchc': 'MCHC (Mean Corpuscular Hemoglobin Concentration)',
    'meancorpuscularhemoglobinconcentration': 'MCHC (Mean Corpuscular Hemoglobin Concentration)',
    
    'rdw': 'RDW (Red Cell Distribution Width)',
    'redcelldistributionwidth': 'RDW (Red Cell Distribution Width)',
    
    'plateletcount': 'Platelet Count',
    'platelets': 'Platelet Count',
    'plt': 'Platelet Count',
    
    'mpv': 'MPV (Mean Platelet Volume)',
    'meanplateletvolume': 'MPV (Mean Platelet Volume)',
    
    // Hormones
    'testosterone': 'Testosterone (Total)',
    'totaltestosterone': 'Testosterone (Total)',
    'testtotal': 'Testosterone (Total)',
    
    'freetestosterone': 'Free Testosterone',
    'testfree': 'Free Testosterone',
    
    'estradiol': 'Estradiol (E2)',
    'e2': 'Estradiol (E2)',
    'estrogen': 'Estradiol (E2)',
    
    'progesterone': 'Progesterone',
    'prog': 'Progesterone',
    
    'dheas': 'DHEA-S (Dehydroepiandrosterone Sulfate)',
    'dehydroepiandrosteronsulfate': 'DHEA-S (Dehydroepiandrosterone Sulfate)',
    'dhea': 'DHEA-S (Dehydroepiandrosterone Sulfate)',
    
    'cortisol': 'Cortisol (Morning)',
    'morningcortisol': 'Cortisol (Morning)',
    'cortisolam': 'Cortisol (Morning)',
    
    'igf1': 'IGF-1 (Insulin-like Growth Factor 1)',
    'insulinlikegrowthfactor1': 'IGF-1 (Insulin-like Growth Factor 1)',
    
    // Other Vitamins & Minerals
    'vitamina': 'Vitamin A (Retinol)',
    'retinol': 'Vitamin A (Retinol)',
    'vita': 'Vitamin A (Retinol)',
    
    'vitamine': 'Vitamin E (Alpha-tocopherol)',
    'alphatocopherol': 'Vitamin E (Alpha-tocopherol)',
    'vite': 'Vitamin E (Alpha-tocopherol)',
    
    'vitamink': 'Vitamin K',
    'vitk': 'Vitamin K',
    
    'vitaminc': 'Vitamin C (Ascorbic Acid)',
    'ascorbicacid': 'Vitamin C (Ascorbic Acid)',
    'vitc': 'Vitamin C (Ascorbic Acid)',
    
    'biotin': 'Biotin (B7)',
    'vitaminb7': 'Biotin (B7)',
    'b7': 'Biotin (B7)',
    
    'zinc': 'Zinc',
    'serumzinc': 'Zinc',
    'zn': 'Zinc',
    
    'copper': 'Copper',
    'serumcopper': 'Copper',
    'cu': 'Copper',
    
    'selenium': 'Selenium',
    'se': 'Selenium',
    
    'homocysteine': 'Homocysteine',
    'hcy': 'Homocysteine',
    'homocys': 'Homocysteine',
    
    // Protein Markers
    'totalprotein': 'Total Protein',
    'protein': 'Total Protein',
    'serumprotein': 'Total Protein',
    
    'globulin': 'Globulin',
    'serumglobulin': 'Globulin',
    
    // Advanced Lipid Markers
    'lipoproteina': 'Lipoprotein(a)',
    'lpa': 'Lipoprotein(a)',
    
    'apoa1': 'ApoA1',
    'apolipoproteinai': 'ApoA1',
    
    'apob': 'ApoB',
    'apolipoproteinb': 'ApoB',
    
    // Inflammatory Markers
    'esr': 'ESR (Erythrocyte Sedimentation Rate)',
    'erythrocytesedimentationrate': 'ESR (Erythrocyte Sedimentation Rate)',
    'sedrate': 'ESR (Erythrocyte Sedimentation Rate)',
    
    'interleukin6': 'Interleukin-6 (IL-6)',
    'il6': 'Interleukin-6 (IL-6)',
    
    'tnfalpha': 'TNF-alpha',
    'tumornecrosisfactoralpha': 'TNF-alpha',
    
    // Cardiac Markers
    'troponini': 'Troponin I',
    'troponin': 'Troponin I',
    
    'ckmb': 'CK-MB',
    'creatinekinasemb': 'CK-MB',
    
    'bnp': 'BNP (B-type Natriuretic Peptide)',
    'btypenatriureticpeptide': 'BNP (B-type Natriuretic Peptide)',
    
    'ntprobnp': 'NT-proBNP',
    'nterminalprobnp': 'NT-proBNP'
  };

  // Try exact mapping first
  if (EXACT_DATABASE_MAPPINGS[cleanUserName]) {
    const mappedName = EXACT_DATABASE_MAPPINGS[cleanUserName];
    const match = healthDatabase.biomarkers.find((biomarker: any) => 
      biomarker.name === mappedName
    );
    if (match) return match;
  }

  // Try partial matching for variations
  for (const [dbName, jsonName] of Object.entries(EXACT_DATABASE_MAPPINGS)) {
    if (cleanUserName.includes(dbName) || dbName.includes(cleanUserName)) {
      const match = healthDatabase.biomarkers.find((biomarker: any) => 
        biomarker.name === jsonName
      );
      if (match) return match;
    }
  }

  // Fallback: direct name matching in JSON
  const match = healthDatabase.biomarkers.find((biomarker: any) => {
    const refName = biomarker.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return refName.includes(cleanUserName) || cleanUserName.includes(refName);
  });

  return match || null;
};

// Flexible SNP matching
export const findSnpMatch = (userSnpId: string, userGeneName?: string) => {
  const cleanSnpId = userSnpId?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
  const cleanGeneName = userGeneName?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';

  // COMPREHENSIVE SNP MAPPING
  const SNP_MAPPINGS: Record<string, string> = {
    // MTHFR variants
    'rs1801133': 'rs1801133',
    'mthfrc677t': 'rs1801133',
    'mthfr677': 'rs1801133',
    'c677t': 'rs1801133',
    
    // COMT variants  
    'rs4680': 'rs4680',
    'comtval158met': 'rs4680',
    'comt158': 'rs4680',
    'val158met': 'rs4680',
    
    // CYP1A2 variants
    'rs762551': 'rs762551',
    'cyp1a2': 'rs762551',
    
    // Add more common SNP mappings
    'rs1801131': 'rs1801131', // MTHFR A1298C
    'rs1799853': 'rs1799853', // CYP2C9
    'rs1057910': 'rs1057910', // CYP2C9
    'rs4244285': 'rs4244285', // CYP2C19
    'rs28399504': 'rs28399504', // CYP2C19
    'rs776746': 'rs776746',   // CYP3A5
    'rs2032582': 'rs2032582', // ABCB1
    'rs1045642': 'rs1045642', // ABCB1
    'rs1128503': 'rs1128503', // ABCB1
  };

  // Try exact rsID match first
  const mappedRsId = SNP_MAPPINGS[cleanSnpId] || cleanSnpId;
  let match = healthDatabase.snps.find((snp: any) => 
    snp.rsid?.toLowerCase().replace(/[^a-z0-9]/g, '') === mappedRsId
  );

  if (match) return match;

  // Try gene name matching
  if (cleanGeneName) {
    match = healthDatabase.snps.find((snp: any) => {
      const snpGeneName = snp.name?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
      return snpGeneName.includes(cleanGeneName) || cleanGeneName.includes(snpGeneName);
    });
  }

  // Try partial matching with common gene names
  const geneNameMappings: Record<string, string> = {
    'mthfr': 'MTHFR',
    'comt': 'COMT', 
    'cyp1a2': 'CYP1A2',
    'cyp2c9': 'CYP2C9',
    'cyp2c19': 'CYP2C19',
    'cyp3a5': 'CYP3A5',
    'abcb1': 'ABCB1'
  };

  if (cleanGeneName && geneNameMappings[cleanGeneName]) {
    const mappedGeneName = geneNameMappings[cleanGeneName];
    match = healthDatabase.snps.find((snp: any) => 
      snp.name?.includes(mappedGeneName) || snp.gene?.includes(mappedGeneName)
    );
  }

  return match || null;
};

// Enhanced biomarker name formatting with medical terminology
export const formatBiomarkerName = (markerName: string): string => {
  const cleanName = markerName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Comprehensive biomarker name mapping for professional display
  const BIOMARKER_DISPLAY_NAMES: Record<string, string> = {
    // Cholesterol Panel
    'cholesteroltotal': 'Total Cholesterol',
    'totalcholesterol': 'Total Cholesterol',
    'cholesterol': 'Total Cholesterol',
    'chol': 'Total Cholesterol',
    
    'hdlc': 'HDL Cholesterol',
    'hdlcholesterol': 'HDL Cholesterol', 
    'hdl': 'HDL Cholesterol',
    
    'ldlc': 'LDL Cholesterol',
    'ldlcholesterol': 'LDL Cholesterol',
    'ldl': 'LDL Cholesterol',
    
    'cholesterolhdlratio': 'Total/HDL Cholesterol Ratio',
    'totalhdlratio': 'Total/HDL Cholesterol Ratio',
    'cholhdlratio': 'Total/HDL Cholesterol Ratio',
    'hdlratio': 'Total/HDL Cholesterol Ratio',
    
    'nonhdlcholesterol': 'Non-HDL Cholesterol',
    'nonhdl': 'Non-HDL Cholesterol',
    
    'triglycerides': 'Triglycerides',
    'trigs': 'Triglycerides',
    'tg': 'Triglycerides',
    
    // Vitamins
    'vitamind25oh': 'Vitamin D',
    'vitamind': 'Vitamin D',
    'vitd': 'Vitamin D',
    'vit25oh': 'Vitamin D',
    '25ohd': 'Vitamin D',
    '25hydroxyvitamind': 'Vitamin D',
    'calcidiol': 'Vitamin D',
    
    'vitaminb12': 'Vitamin B12',
    'b12': 'Vitamin B12',
    'cobalamin': 'Vitamin B12',
    'methylcobalamin': 'Vitamin B12',
    'cyanocobalamin': 'Vitamin B12',
    
    'folate': 'Folate (Serum)',
    'folicacid': 'Folate (Serum)',
    'serumfolate': 'Folate (Serum)',
    'vitaminb9': 'Folate (Serum)',
    'b9': 'Folate (Serum)',
    
    // Inflammatory Markers
    'hscrp': 'C-Reactive Protein (hs-CRP)',
    'crp': 'C-Reactive Protein (CRP)',
    'creactiveprotein': 'C-Reactive Protein (CRP)',
    'highsensitivitycrp': 'C-Reactive Protein (hs-CRP)',
    'cprotein': 'C-Reactive Protein (CRP)',
    
    // Thyroid
    'tsh': 'TSH (Thyroid Stimulating Hormone)',
    'thyroidstimulatinghormone': 'TSH (Thyroid Stimulating Hormone)',
    'thyrotropin': 'TSH (Thyroid Stimulating Hormone)',
    
    'freet3': 'Free T3 (Triiodothyronine)',
    't3free': 'Free T3 (Triiodothyronine)',
    'triiodothyronine': 'Free T3 (Triiodothyronine)',
    't3': 'Free T3 (Triiodothyronine)',
    
    'freet4': 'Free T4 (Thyroxine)',
    't4free': 'Free T4 (Thyroxine)',
    'thyroxine': 'Free T4 (Thyroxine)',
    't4': 'Free T4 (Thyroxine)',
    
    'reverset3': 'Reverse T3',
    'rt3': 'Reverse T3',
    
    // Metabolic Markers
    'hba1c': 'HbA1c (Hemoglobin A1c)',
    'hemoglobina1c': 'HbA1c (Hemoglobin A1c)',
    'glycatedhemoglobin': 'HbA1c (Hemoglobin A1c)',
    'a1c': 'HbA1c (Hemoglobin A1c)',
    'hgba1c': 'HbA1c (Hemoglobin A1c)',
    
    'glucose': 'Fasting Glucose',
    'fastingglucose': 'Fasting Glucose',
    'bloodglucose': 'Fasting Glucose',
    'serumglucose': 'Fasting Glucose',
    'glu': 'Fasting Glucose',
    
    'insulin': 'Fasting Insulin',
    'fastinginsulin': 'Fasting Insulin',
    'seruminsulin': 'Fasting Insulin',
    
    // Liver Function
    'alt': 'ALT (Alanine Aminotransferase)',
    'alanineaminotransferase': 'ALT (Alanine Aminotransferase)',
    'sgpt': 'ALT (Alanine Aminotransferase)',
    
    'ast': 'AST (Aspartate Aminotransferase)',
    'aspartateaminotransferase': 'AST (Aspartate Aminotransferase)',
    'sgot': 'AST (Aspartate Aminotransferase)',
    
    'ggt': 'GGT (Gamma-Glutamyl Transferase)',
    'gammaglutamyltransferase': 'GGT (Gamma-Glutamyl Transferase)',
    
    'alp': 'Alkaline Phosphatase',
    'alkalinephosphatase': 'Alkaline Phosphatase',
    'alkphos': 'Alkaline Phosphatase',
    
    'bilirubin': 'Total Bilirubin',
    'totalbilirubin': 'Total Bilirubin',
    'tbili': 'Total Bilirubin',
    
    'directbilirubin': 'Direct Bilirubin',
    'conjugatedbilirubin': 'Direct Bilirubin',
    'dbili': 'Direct Bilirubin',
    
    // Kidney Function
    'creatinine': 'Creatinine',
    'serumcreatinine': 'Creatinine',
    'creat': 'Creatinine',
    
    'bun': 'BUN (Blood Urea Nitrogen)',
    'bloodureanitrogen': 'BUN (Blood Urea Nitrogen)',
    'urea': 'BUN (Blood Urea Nitrogen)',
    
    'egfr': 'eGFR (Estimated Glomerular Filtration Rate)',
    'estimatedgfr': 'eGFR (Estimated Glomerular Filtration Rate)',
    'gfr': 'eGFR (Estimated Glomerular Filtration Rate)',
    
    // Complete Blood Count
    'wbc': 'White Blood Cell Count',
    'whitebloodcells': 'White Blood Cell Count',
    'leukocytes': 'White Blood Cell Count',
    
    'rbc': 'Red Blood Cell Count',
    'redbloodcells': 'Red Blood Cell Count',
    'erythrocytes': 'Red Blood Cell Count',
    
    'hemoglobin': 'Hemoglobin',
    'hgb': 'Hemoglobin',
    'hb': 'Hemoglobin',
    
    'hematocrit': 'Hematocrit',
    'hct': 'Hematocrit',
    
    'platelets': 'Platelet Count',
    'plt': 'Platelet Count',
    'thrombocytes': 'Platelet Count',
    
    // Iron Studies
    'ferritin': 'Ferritin',
    'serumiron': 'Serum Iron',
    'iron': 'Serum Iron',
    'tibc': 'TIBC (Total Iron Binding Capacity)',
    'totaliron': 'TIBC (Total Iron Binding Capacity)',
    'transferrinsaturation': 'Transferrin Saturation',
    'tsat': 'Transferrin Saturation',
    
    // Hormones
    'testosterone': 'Total Testosterone',
    'totaltestosterone': 'Total Testosterone',
    'freetestosterone': 'Free Testosterone',
    'bioavailabletestosterone': 'Bioavailable Testosterone',
    
    'estradiol': 'Estradiol (E2)',
    'e2': 'Estradiol (E2)',
    'estrogen': 'Estradiol (E2)',
    
    'progesterone': 'Progesterone',
    'prog': 'Progesterone',
    
    'cortisol': 'Cortisol',
    'morningcortisol': 'Morning Cortisol',
    'amcortisol': 'Morning Cortisol',
    
    'dheas': 'DHEA-S (Dehydroepiandrosterone Sulfate)',
    'dhea': 'DHEA-S (Dehydroepiandrosterone Sulfate)',
    'dehydroepiandrosterone': 'DHEA-S (Dehydroepiandrosterone Sulfate)',
    
    'shbg': 'SHBG (Sex Hormone Binding Globulin)',
    'sexhormonebindingglobulin': 'SHBG (Sex Hormone Binding Globulin)',
    
    // Electrolytes
    'sodium': 'Sodium',
    'na': 'Sodium',
    'potassium': 'Potassium',
    'k': 'Potassium',
    'chloride': 'Chloride',
    'cl': 'Chloride',
    'co2': 'CO2 (Carbon Dioxide)',
    'carbondioxide': 'CO2 (Carbon Dioxide)',
    'bicarbonate': 'CO2 (Carbon Dioxide)',
    
    'calcium': 'Calcium',
    'ca': 'Calcium',
    'magnesium': 'Magnesium',
    'mg': 'Magnesium',
    'phosphorus': 'Phosphorus',
    'phos': 'Phosphorus',
    
    // Cardiac Markers
    'troponin': 'Troponin I',
    'troponi': 'Troponin I',
    'ck': 'Creatine Kinase (CK)',
    'creatinekinase': 'Creatine Kinase (CK)',
    'ckmb': 'CK-MB',
    'bnp': 'BNP (B-type Natriuretic Peptide)',
    'ntprobnp': 'NT-proBNP',
    
    // Lipid Advanced
    'apolipoproteinb': 'Apolipoprotein B',
    'apob': 'Apolipoprotein B',
    'apolipoproteinai': 'Apolipoprotein A-I',
    'apoa1': 'Apolipoprotein A-I',
    'lipoproteinlittlea': 'Lipoprotein(a)',
    'lpa': 'Lipoprotein(a)',
    
    // Diabetes/Metabolic
    'cpeptide': 'C-Peptide',
    'fructosamine': 'Fructosamine',
    'microalbumin': 'Microalbumin',
    'albumin': 'Albumin',
    'proteinuria': 'Protein (Urine)',
    
    // Autoimmune/Inflammatory
    'ana': 'ANA (Antinuclear Antibodies)',
    'antinuclearantibodies': 'ANA (Antinuclear Antibodies)',
    'rheumatoidfactor': 'Rheumatoid Factor',
    'rf': 'Rheumatoid Factor',
    'esr': 'ESR (Erythrocyte Sedimentation Rate)',
    'sedrate': 'ESR (Erythrocyte Sedimentation Rate)',
    
    // Tumor Markers
    'psa': 'PSA (Prostate Specific Antigen)',
    'prostatespecificantigen': 'PSA (Prostate Specific Antigen)',
    'cea': 'CEA (Carcinoembryonic Antigen)',
    'ca125': 'CA 125',
    'ca199': 'CA 19-9',
    'afp': 'AFP (Alpha-Fetoprotein)',
    
    // Nutrients
    'zinc': 'Zinc',
    'copper': 'Copper',
    'selenium': 'Selenium',
    'vitaminc': 'Vitamin C',
    'vitamine': 'Vitamin E',
    'vitamink': 'Vitamin K',
    'vitaminb1': 'Vitamin B1 (Thiamine)',
    'vitaminb6': 'Vitamin B6 (Pyridoxine)',
    'biotin': 'Biotin',
    'niacin': 'Niacin (Vitamin B3)',
    'riboflavin': 'Riboflavin (Vitamin B2)',
    
    // Amino Acids
    'homocysteine': 'Homocysteine',
    'methylmalonicacid': 'Methylmalonic Acid',
    'mma': 'Methylmalonic Acid'
  };
  
  // Return mapped name or format the original name
  return BIOMARKER_DISPLAY_NAMES[cleanName] || 
         markerName.replace(/_/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase())
                  .replace(/\bHdl\b/g, 'HDL')
                  .replace(/\bLdl\b/g, 'LDL')
                  .replace(/\bTsh\b/g, 'TSH')
                  .replace(/\bCrp\b/g, 'CRP')
                  .replace(/\bAlt\b/g, 'ALT')
                  .replace(/\bAst\b/g, 'AST')
                  .replace(/\bGgt\b/g, 'GGT')
                  .replace(/\bBun\b/g, 'BUN')
                  .replace(/\bWbc\b/g, 'WBC')
                  .replace(/\bRbc\b/g, 'RBC')
                  .replace(/\bHba1c\b/g, 'HbA1c')
                  .replace(/\bEgfr\b/g, 'eGFR')
                  .replace(/\bShbg\b/g, 'SHBG')
                  .replace(/\bDhea\b/g, 'DHEA')
                  .replace(/\bPsa\b/g, 'PSA')
                  .replace(/\bAna\b/g, 'ANA')
                  .replace(/\bEsr\b/g, 'ESR');
}; 