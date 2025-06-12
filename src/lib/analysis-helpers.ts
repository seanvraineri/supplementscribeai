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
    const name = markerName.toLowerCase();
    const nameMap: { [key: string]: string } = {
        'cholesterol_total': 'Total Cholesterol', 'cholesterol_ldl': 'LDL Cholesterol',
        'cholesterol_hdl': 'HDL Cholesterol', 'hdl_c': 'HDL Cholesterol', 'ldl_c': 'LDL Cholesterol',
        'non_hdl_cholesterol': 'Non-HDL Cholesterol', 'cholesterol_hdl_ratio': 'Total/HDL Ratio',
        'triglycerides': 'Triglycerides', 'glucose': 'Blood Glucose', 'glucose_fasting': 'Fasting Glucose',
        'hemoglobin_a1c': 'Hemoglobin A1C', 'hba1c': 'Hemoglobin A1C', 'crp': 'C-Reactive Protein',
        'c_reactive_protein': 'C-Reactive Protein', 'vitamin_d': 'Vitamin D', '25_oh_vitamin_d': 'Vitamin D (25-OH)',
        'vitamin_b12': 'Vitamin B12', 'b12': 'Vitamin B12', 'folate': 'Folate', 'ferritin': 'Ferritin',
        'iron': 'Iron', 'tsh': 'TSH', 't4': 'Thyroxine (T4)', 't3': 'Triiodothyronine (T3)', 'magnesium': 'Magnesium',
        'zinc': 'Zinc', 'calcium': 'Calcium', 'phosphorus': 'Phosphorus', 'albumin': 'Albumin', 'total_protein': 'Total Protein',
        'alt': 'ALT', 'ast': 'AST', 'bun': 'BUN', 'creatinine': 'Creatinine', 'egfr': 'eGFR', 'uric_acid': 'Uric Acid',
        'homocysteine': 'Homocysteine', 'insulin': 'Insulin', 'cortisol': 'Cortisol', 'testosterone': 'Testosterone',
        'estradiol': 'Estradiol', 'progesterone': 'Progesterone', 'dhea_s': 'DHEA-S', 'igf_1': 'IGF-1', 'psa': 'PSA'
    };
    if (nameMap[name]) return nameMap[name];
    return markerName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  export const cleanSnpName = (snpId: string, geneName: string) => {
    if (snpId === 'rs1801133' && geneName.includes('MTHFR')) return `${snpId} - MTHFR C677T`;
    if (snpId === 'rs1801131' && geneName.includes('MTHFR')) return `${snpId} - MTHFR A1298C`;
    if (snpId === 'rs4680' && geneName.includes('COMT')) return `${snpId} - COMT Val158Met`;
    return `${snpId} - ${geneName}`;
  };
  
  export const getBiomarkerReferenceRange = (markerName: string) => {
    const name = markerName.toLowerCase();
    if (name.includes('vitamin d')) return '30-100 ng/mL';
    if (name.includes('b12')) return '300-900 pg/mL';
    if (name.includes('ferritin')) return 'M: 12-300, F: 12-150 ng/mL';
    if (name.includes('crp')) return '<3.0 mg/L';
    if (name.includes('cholesterol_total')) return '<200 mg/dL';
    if (name.includes('hdl')) return '>40 mg/dL';
    if (name.includes('ldl')) return '<100 mg/dL';
    if (name.includes('triglycerides')) return '<150 mg/dL';
    if (name.includes('glucose')) return '70-99 mg/dL';
    if (name.includes('hba1c')) return '<5.7%';
    if (name.includes('tsh')) return '0.4-4.0 mIU/L';
    return 'See lab reference';
  };
  
  export const interpretBiomarker = (marker: any) => {
    const name = marker.marker_name?.toLowerCase() || '';
    const value = parseFloat(marker.value) || 0;
  
    if (name.includes('vitamin d')) {
      if (value < 20) return { status: 'Deficient', color: 'red', impact: 'Severe deficiency affecting bone health, immune function, and mood.' };
      if (value < 30) return { status: 'Insufficient', color: 'orange', impact: 'May cause fatigue, bone pain, and frequent infections.' };
      return { status: 'Optimal', color: 'green', impact: 'Good levels support bone health, immunity, and mood.' };
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
    // Add more interpretations here...
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
    // Add more interpretations here...
    return { impact: 'Standard genetic profile.', symptoms: 'No specific interventions required based on this gene.', severity: 'Normal', color: 'green' };
  }; 