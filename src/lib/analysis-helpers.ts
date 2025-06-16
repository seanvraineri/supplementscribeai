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
  return markerName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
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
  
  if (name.includes('vitamin_d') || name.includes('25_oh')) {
    if (value < 20) return { status: 'Deficient', color: 'red', impact: 'Severe deficiency increasing disease risk.' };
    if (value < 30) return { status: 'Insufficient', color: 'orange', impact: 'Suboptimal levels affecting immune function.' };
    if (value > 100) return { status: 'Excessive', color: 'orange', impact: 'Potentially toxic levels.' };
    return { status: 'Optimal', color: 'green', impact: 'Good levels for bone and immune health.' };
  }
  if (name.includes('b12')) {
    if (value < 200) return { status: 'Deficient', color: 'red', impact: 'Severe deficiency causing anemia and neurological issues.' };
    if (value < 300) return { status: 'Low', color: 'orange', impact: 'Suboptimal levels affecting energy and cognition.' };
    return { status: 'Optimal', color: 'green', impact: 'Adequate levels for energy and nerve function.' };
  }
  if (name.includes('ferritin')) {
    if (value < 30) return { status: 'Deficient', color: 'red', impact: 'Low iron stores causing fatigue, weakness, and hair loss.' };
    if (value > 150) return { status: 'Elevated', color: 'orange', impact: 'High iron may indicate inflammation or hemochromatosis.' };
    return { status: 'Optimal', color: 'green', impact: 'Adequate iron stores for energy and oxygen transport.' };
  }
  if (name.includes('crp')) {
    if (value > 3.0) return { status: 'High Risk', color: 'red', impact: 'High inflammation, increasing cardiovascular and chronic disease risk.' };
    if (value > 1.0) return { status: 'Average Risk', color: 'orange', impact: 'Moderate inflammation, lifestyle changes recommended.' };
    return { status: 'Optimal', color: 'green', impact: 'Low inflammation, indicating good cardiovascular health.' };
  }
  return { status: 'Normal', color: 'green', impact: 'Within standard reference range.' };
};

export const interpretSNP = (snp: any) => {
  const gene = snp.gene_name || '';
  const genotype = snp.genotype || snp.allele || '';

  if (gene.includes('MTHFR')) {
    if (genotype.includes('T') || genotype.includes('C')) {
      return { impact: 'Affects folate metabolism.', symptoms: 'May need methylfolate.', severity: 'Moderate', color: 'orange' };
    }
    return { impact: 'Normal folate metabolism.', symptoms: 'No significant impact.', severity: 'Normal', color: 'green' };
  }
  if (gene.includes('COMT')) {
      if (genotype.includes('A') || genotype.includes('T')) {
        return { impact: 'Slower dopamine breakdown.', symptoms: 'Sensitive to stress and stimulants.', severity: 'Moderate', color: 'yellow' };
      }
      return { impact: 'Faster dopamine breakdown.', symptoms: 'Handles stress well.', severity: 'Normal', color: 'green' };
  }
  if (gene.includes('APOE')) {
      if (genotype.includes('E4')) {
        return { impact: 'Increased Alzheimer\'s risk.', symptoms: 'Focus on brain health protocols.', severity: 'Significant', color: 'red' };
      }
      return { impact: 'Standard Alzheimer\'s risk.', symptoms: 'Normal cognitive aging expected.', severity: 'Normal', color: 'green' };
  }
  return { impact: 'Standard genetic profile.', symptoms: 'No specific interventions required based on this gene.', severity: 'Normal', color: 'green' };
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
    // Import Supabase client dynamically to avoid SSR issues
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: analysis, error } = await supabase.functions.invoke('ai-health-analysis', {
      body: {
        type: 'biomarker',
        name: markerName,
        value,
        unit,
        userConditions,
        userAllergies,
      },
    });

    if (error) {
      throw new Error('AI analysis failed');
    }

    return analysis;
  } catch (error) {
    console.error('AI biomarker analysis failed:', error);
    return {
      name: markerName,
      description: 'This biomarker provides important health information. AI analysis temporarily unavailable.',
      currentValue: `${value} ${unit}`,
      currentRange: 'unknown',
      referenceRange: 'Consult lab reference ranges',
      symptoms: ['Symptoms vary depending on the specific biomarker and individual factors'],
      recommendations: [
        'Maintain a balanced, nutrient-dense diet with whole foods',
        'Engage in regular physical activity (150+ minutes moderate exercise weekly)',
        'Ensure adequate sleep (7-9 hours nightly)',
        'Manage stress through meditation, yoga, or other relaxation techniques',
        'Stay adequately hydrated (8-10 glasses water daily)',
        'Consider comprehensive micronutrient testing',
        'Work with a healthcare provider familiar with functional medicine',
        'Monitor this biomarker regularly to track trends over time'
      ],
      riskLevel: 'Unknown'
    };
  }
};

const getAISNPAnalysis = async (snpId: string, geneName: string, genotype: string, userConditions: any[] = [], userAllergies: any[] = []) => {
  try {
    // Import Supabase client dynamically to avoid SSR issues
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: analysis, error } = await supabase.functions.invoke('ai-health-analysis', {
      body: {
        type: 'snp',
        name: snpId,
        gene: geneName,
        genotype,
        userConditions,
        userAllergies,
      },
    });

    if (error) {
      throw new Error('AI analysis failed');
    }

    return analysis;
  } catch (error) {
    console.error('AI SNP analysis failed:', error);
    return {
      gene: geneName || 'Unknown',
      name: `${geneName} ${snpId}` || 'Unknown Genetic Variant',
      description: 'This genetic variant may influence various biological processes. AI analysis temporarily unavailable.',
      genotype: genotype,
      effect: 'Effects of this genetic variant are not well-characterized in our current database',
      impact: 'Impact varies based on individual factors, lifestyle, and other genetic variants',
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

// MAIN EDUCATION FUNCTIONS - These are called by the React components
export const getBiomarkerEducation = async (markerName: string, value: string, unit: string, userConditions: any[] = [], userAllergies: any[] = []) => {
  // For now, all biomarkers will use AI analysis via Supabase Edge Function
  return await getAIBiomarkerAnalysis(markerName, value, unit, userConditions, userAllergies);
};

export const getSNPEducation = async (snpId: string, geneName: string, genotype: string, userConditions: any[] = [], userAllergies: any[] = []) => {
  // For now, all SNPs will use AI analysis via Supabase Edge Function
  return await getAISNPAnalysis(snpId, geneName, genotype, userConditions, userAllergies);
}; 