import { createClient } from 'jsr:@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============= HYPER-PERSONALIZATION LAYER FOR PRODUCT ANALYSIS =============

interface ProductHyperPersonalization {
  geneticCompatibility: GeneticCompatibility[];
  biomarkerAlignment: BiomarkerAlignment[];
  personalizedDosing: PersonalizedDosing[];
  safetyAssessment: SafetyAssessment[];
  productOptimization: ProductOptimization[];
  categorySpecificAnalysis: CategorySpecificAnalysis;
}

interface GeneticCompatibility {
  gene: string;
  rsid: string;
  genotype: string;
  ingredientInteraction: string;
  compatibilityScore: number; // 0-100
  recommendation: string;
  mechanismExplanation: string;
}

interface BiomarkerAlignment {
  marker: string;
  currentValue: number;
  targetRange: string;
  productRelevance: string;
  dosageRecommendation: string;
  expectedImpact: string;
}

interface PersonalizedDosing {
  ingredient: string;
  productDose: string;
  personalizedDose: string;
  reasoning: string;
  adjustmentFactor: string;
}

interface SafetyAssessment {
  type: 'allergy' | 'medication' | 'condition' | 'genetic';
  concern: string;
  severity: 'critical' | 'moderate' | 'mild';
  recommendation: string;
}

interface ProductOptimization {
  category: string;
  currentForm: string;
  optimalForm: string;
  reasoning: string;
  alternativeRecommendation?: string;
}

interface CategorySpecificAnalysis {
  productCategory: 'supplement' | 'skincare' | 'topical' | 'food' | 'beverage';
  categorySpecificFactors: string[];
  usageGuidance: string[];
  expectedResults: string[];
}

// Product category detection
function detectProductCategory(productContent: string): CategorySpecificAnalysis {
  const content = productContent.toLowerCase();
  
  if (content.includes('cream') || content.includes('lotion') || content.includes('serum') || 
      content.includes('moisturizer') || content.includes('tallow') || content.includes('balm') ||
      content.includes('skincare') || content.includes('topical')) {
    return {
      productCategory: 'skincare',
      categorySpecificFactors: [
        'Skin barrier function',
        'Comedogenic potential', 
        'Absorption rate',
        'Irritation risk',
        'pH compatibility'
      ],
      usageGuidance: [
        'Patch test recommended before full application',
        'Apply to clean, slightly damp skin for better absorption',
        'Start with small amounts to assess tolerance'
      ],
      expectedResults: [
        'Improved skin barrier function',
        'Enhanced moisture retention',
        'Reduced inflammation and irritation'
      ]
    };
  }
  
  if (content.includes('capsule') || content.includes('tablet') || content.includes('supplement') ||
      content.includes('vitamin') || content.includes('mineral') || content.includes('mg') ||
      content.includes('mcg') || content.includes('iu')) {
    return {
      productCategory: 'supplement',
      categorySpecificFactors: [
        'Bioavailability',
        'Absorption timing',
        'Food interactions',
        'Genetic metabolism',
        'Dosage optimization'
      ],
      usageGuidance: [
        'Take with appropriate meal timing for optimal absorption',
        'Consider genetic variants affecting metabolism',
        'Monitor for interactions with medications'
      ],
      expectedResults: [
        'Improved nutrient status',
        'Enhanced metabolic function',
        'Targeted health benefits'
      ]
    };
  }
  
  // Default to supplement category
  return {
    productCategory: 'supplement',
    categorySpecificFactors: ['General health support', 'Nutrient optimization'],
    usageGuidance: ['Follow product instructions', 'Consult healthcare provider'],
    expectedResults: ['General health improvement']
  };
}

// Build hyper-personalized product analysis
function buildProductHyperPersonalization(
  productContent: string,
  profile: any,
  biomarkers: any[],
  snps: any[],
  conditions: any[],
  medications: any[],
  allergies: any[]
): ProductHyperPersonalization {
  
  const categoryAnalysis = detectProductCategory(productContent);
  
  // Genetic compatibility analysis
  const geneticCompatibility: GeneticCompatibility[] = snps
    .filter(snp => snp.supported_snps?.gene && snp.genotype)
    .map(snp => analyzeGeneticProductCompatibility(snp, productContent, categoryAnalysis))
    .filter(result => result !== null) as GeneticCompatibility[];
  
  // Biomarker alignment analysis
  const biomarkerAlignment: BiomarkerAlignment[] = biomarkers
    .map(biomarker => analyzeBiomarkerProductAlignment(biomarker, productContent, categoryAnalysis))
    .filter(result => result !== null) as BiomarkerAlignment[];
  
  // Personalized dosing recommendations
  const personalizedDosing: PersonalizedDosing[] = generatePersonalizedDosing(
    productContent, profile, geneticCompatibility, categoryAnalysis
  );
  
  // Safety assessment
  const safetyAssessment: SafetyAssessment[] = [
    ...analyzeAllergyRisks(allergies, productContent),
    ...analyzeMedicationInteractions(medications, productContent),
    ...analyzeConditionCompatibility(conditions, productContent),
    ...analyzeGeneticSafety(geneticCompatibility)
  ];
  
  // Product optimization suggestions
  const productOptimization: ProductOptimization[] = generateProductOptimizations(
    productContent, geneticCompatibility, biomarkerAlignment, categoryAnalysis
  );
  
  return {
    geneticCompatibility,
    biomarkerAlignment,
    personalizedDosing,
    safetyAssessment,
    productOptimization,
    categorySpecificAnalysis: categoryAnalysis
  };
}

// Analyze genetic compatibility with product ingredients
function analyzeGeneticProductCompatibility(
  snp: any, 
  productContent: string, 
  categoryAnalysis: CategorySpecificAnalysis
): GeneticCompatibility | null {
  const gene = snp.supported_snps.gene;
  const genotype = snp.genotype;
  const content = productContent.toLowerCase();
  
  // MTHFR variants - critical for B-vitamin forms
  if (gene === 'MTHFR' && (genotype.includes('T') || genotype === 'CT' || genotype === 'TT')) {
    if (content.includes('folic acid') || content.includes('cyanocobalamin')) {
      return {
        gene,
        rsid: snp.supported_snps.rsid,
        genotype,
        ingredientInteraction: 'Suboptimal B-vitamin forms detected',
        compatibilityScore: 35,
        recommendation: 'Requires methylated forms (methylfolate, methylcobalamin)',
        mechanismExplanation: 'MTHFR variants reduce ability to convert synthetic forms to active forms'
      };
    }
    if (content.includes('methylfolate') || content.includes('methylcobalamin') || content.includes('5-mthf')) {
      return {
        gene,
        rsid: snp.supported_snps.rsid,
        genotype,
        ingredientInteraction: 'Optimal methylated B-vitamin forms present',
        compatibilityScore: 95,
        recommendation: 'Excellent genetic compatibility',
        mechanismExplanation: 'Methylated forms bypass MTHFR enzyme limitations'
      };
    }
  }
  
  // COMT variants - affects dopamine metabolism and magnesium needs
  if (gene === 'COMT' && genotype.includes('A')) {
    if (content.includes('magnesium')) {
      return {
        gene,
        rsid: snp.supported_snps.rsid,
        genotype,
        ingredientInteraction: 'Beneficial magnesium support for dopamine metabolism',
        compatibilityScore: 85,
        recommendation: 'Supports optimal dopamine clearance',
        mechanismExplanation: 'Slow COMT variants benefit from magnesium for neurotransmitter balance'
      };
    }
  }
  
  // VDR variants - affects vitamin D needs
  if (gene === 'VDR' && content.includes('vitamin d')) {
    const hasVariant = genotype !== 'CC' && genotype !== 'GG'; // Simplified variant detection
    return {
      gene,
      rsid: snp.supported_snps.rsid,
      genotype,
      ingredientInteraction: hasVariant ? 'May need higher vitamin D doses' : 'Standard vitamin D dosing appropriate',
      compatibilityScore: hasVariant ? 75 : 85,
      recommendation: hasVariant ? 'Consider higher dosing based on genetic variant' : 'Standard dosing suitable',
      mechanismExplanation: 'VDR variants affect vitamin D receptor sensitivity and metabolism'
    };
  }
  
  return null;
}

// Analyze biomarker alignment with product
function analyzeBiomarkerProductAlignment(
  biomarker: any, 
  productContent: string, 
  categoryAnalysis: CategorySpecificAnalysis
): BiomarkerAlignment | null {
  const markerName = biomarker.marker_name.toLowerCase();
  const value = biomarker.value;
  const content = productContent.toLowerCase();
  
  // Vitamin D analysis
  if (markerName.includes('vitamin d') || markerName.includes('25-oh')) {
    if (content.includes('vitamin d')) {
      const isLow = value < 30;
      return {
        marker: biomarker.marker_name,
        currentValue: value,
        targetRange: '40-60 ng/mL optimal',
        productRelevance: isLow ? 'Directly addresses deficiency' : 'Supports maintenance',
        dosageRecommendation: isLow ? 'Higher dose needed (4000-6000 IU)' : 'Maintenance dose (2000-3000 IU)',
        expectedImpact: isLow ? 'Significant improvement expected' : 'Maintains optimal levels'
      };
    }
  }
  
  // B12 analysis
  if (markerName.includes('b12') || markerName.includes('cobalamin')) {
    if (content.includes('b12') || content.includes('cobalamin')) {
      const isLow = value < 400;
      return {
        marker: biomarker.marker_name,
        currentValue: value,
        targetRange: '500-900 pg/mL optimal',
        productRelevance: isLow ? 'Critical for addressing deficiency' : 'Supports optimal levels',
        dosageRecommendation: isLow ? 'High dose needed (1000-2000 mcg)' : 'Maintenance dose (500-1000 mcg)',
        expectedImpact: isLow ? 'Major improvement in energy and cognition' : 'Maintains neurological function'
      };
    }
  }
  
  // Iron/Ferritin analysis
  if (markerName.includes('ferritin') || markerName.includes('iron')) {
    if (content.includes('iron')) {
      const isLow = value < 30;
      const isHigh = value > 150;
      if (isHigh) {
        return {
          marker: biomarker.marker_name,
          currentValue: value,
          targetRange: '30-150 ng/mL',
          productRelevance: 'CONTRAINDICATED - iron levels already elevated',
          dosageRecommendation: 'AVOID iron supplementation',
          expectedImpact: 'Could worsen iron overload'
        };
      }
      return {
        marker: biomarker.marker_name,
        currentValue: value,
        targetRange: '50-150 ng/mL optimal',
        productRelevance: isLow ? 'Essential for addressing deficiency' : 'Monitor levels',
        dosageRecommendation: isLow ? 'Therapeutic dose with vitamin C' : 'Low dose or avoid',
        expectedImpact: isLow ? 'Improved energy and oxygen transport' : 'Risk of excess'
      };
    }
  }
  
  return null;
}

// Generate personalized dosing recommendations
function generatePersonalizedDosing(
  productContent: string,
  profile: any,
  geneticCompatibility: GeneticCompatibility[],
  categoryAnalysis: CategorySpecificAnalysis
): PersonalizedDosing[] {
  const dosing: PersonalizedDosing[] = [];
  const weight = profile.weight_lbs || 150;
  const age = profile.age || 30;
  const gender = profile.gender || 'unknown';
  
  // Weight-based vitamin D dosing
  if (productContent.toLowerCase().includes('vitamin d')) {
    const weightBasedDose = Math.round(weight * 40); // 40 IU per pound
    dosing.push({
      ingredient: 'Vitamin D3',
      productDose: 'Check product label',
      personalizedDose: `${weightBasedDose} IU daily`,
      reasoning: `Based on ${weight} lbs body weight`,
      adjustmentFactor: 'Weight-based calculation (40 IU per pound)'
    });
  }
  
  // Age-specific magnesium dosing
  if (productContent.toLowerCase().includes('magnesium')) {
    const ageFactor = age > 50 ? 1.2 : 1.0;
    const genderFactor = gender === 'male' ? 1.1 : 1.0;
    const baseDose = 400;
    const personalizedDose = Math.round(baseDose * ageFactor * genderFactor);
    
    dosing.push({
      ingredient: 'Magnesium',
      productDose: 'Check product label',
      personalizedDose: `${personalizedDose}mg daily`,
      reasoning: `Adjusted for age (${age}) and gender (${gender})`,
      adjustmentFactor: `Age factor: ${ageFactor}, Gender factor: ${genderFactor}`
    });
  }
  
  return dosing;
}

// Analyze allergy risks
function analyzeAllergyRisks(allergies: any[], productContent: string): SafetyAssessment[] {
  const risks: SafetyAssessment[] = [];
  const content = productContent.toLowerCase();
  
  allergies.forEach(allergy => {
    const allergen = allergy.ingredient_name.toLowerCase();
    if (content.includes(allergen)) {
      risks.push({
        type: 'allergy',
        concern: `Contains known allergen: ${allergy.ingredient_name}`,
        severity: 'critical',
        recommendation: 'AVOID - Contains known allergen'
      });
    }
  });
  
  return risks;
}

// Analyze medication interactions
function analyzeMedicationInteractions(medications: any[], productContent: string): SafetyAssessment[] {
  const interactions: SafetyAssessment[] = [];
  const content = productContent.toLowerCase();
  
  medications.forEach(med => {
    const medication = med.medication_name.toLowerCase();
    
    // Common interactions
    if (medication.includes('warfarin') && (content.includes('vitamin k') || content.includes('vitamin e'))) {
      interactions.push({
        type: 'medication',
        concern: `Vitamin K/E may interact with ${med.medication_name}`,
        severity: 'critical',
        recommendation: 'Consult physician before use - may affect blood clotting'
      });
    }
    
    if (medication.includes('levothyroxine') && content.includes('iron')) {
      interactions.push({
        type: 'medication',
        concern: `Iron may reduce ${med.medication_name} absorption`,
        severity: 'moderate',
        recommendation: 'Take iron 4+ hours apart from thyroid medication'
      });
    }
  });
  
  return interactions;
}

// Analyze condition compatibility
function analyzeConditionCompatibility(conditions: any[], productContent: string): SafetyAssessment[] {
  const assessments: SafetyAssessment[] = [];
  const content = productContent.toLowerCase();
  
  conditions.forEach(condition => {
    const conditionName = condition.condition_name.toLowerCase();
    
    if (conditionName.includes('hemochromatosis') && content.includes('iron')) {
      assessments.push({
        type: 'condition',
        concern: `Iron supplementation contraindicated with ${condition.condition_name}`,
        severity: 'critical',
        recommendation: 'AVOID - Iron overload condition present'
      });
    }
    
    if (conditionName.includes('kidney') && content.includes('magnesium')) {
      assessments.push({
        type: 'condition',
        concern: `Magnesium may accumulate with ${condition.condition_name}`,
        severity: 'moderate',
        recommendation: 'Consult nephrologist before use'
      });
    }
  });
  
  return assessments;
}

// Analyze genetic safety concerns
function analyzeGeneticSafety(geneticCompatibility: GeneticCompatibility[]): SafetyAssessment[] {
  return geneticCompatibility
    .filter(gc => gc.compatibilityScore < 50)
    .map(gc => ({
      type: 'genetic' as const,
      concern: `${gc.gene} variant: ${gc.ingredientInteraction}`,
      severity: gc.compatibilityScore < 30 ? 'critical' as const : 'moderate' as const,
      recommendation: gc.recommendation
    }));
}

// Generate product optimization suggestions
function generateProductOptimizations(
  productContent: string,
  geneticCompatibility: GeneticCompatibility[],
  biomarkerAlignment: BiomarkerAlignment[],
  categoryAnalysis: CategorySpecificAnalysis
): ProductOptimization[] {
  const optimizations: ProductOptimization[] = [];
  const content = productContent.toLowerCase();
  
  // B-vitamin form optimization
  if (content.includes('folic acid') || content.includes('cyanocobalamin')) {
    const hasMTHFR = geneticCompatibility.some(gc => gc.gene === 'MTHFR' && gc.compatibilityScore < 50);
    if (hasMTHFR) {
      optimizations.push({
        category: 'B-Vitamin Forms',
        currentForm: 'Synthetic forms (folic acid, cyanocobalamin)',
        optimalForm: 'Methylated forms (methylfolate, methylcobalamin)',
        reasoning: 'MTHFR variants require pre-methylated forms for optimal utilization',
        alternativeRecommendation: 'Look for products with 5-MTHF and methylcobalamin'
      });
    }
  }
  
  // Magnesium form optimization
  if (content.includes('magnesium oxide')) {
    optimizations.push({
      category: 'Magnesium Form',
      currentForm: 'Magnesium oxide (poor absorption)',
      optimalForm: 'Magnesium glycinate or citrate',
      reasoning: 'Chelated forms have superior bioavailability and less GI upset',
      alternativeRecommendation: 'Choose magnesium glycinate for better absorption'
    });
  }
  
  return optimizations;
}

// Enhanced AI prompt with hyper-personalization
function createHyperPersonalizedPrompt(
  productContent: string,
  healthProfile: any,
  hyperPersonalization: ProductHyperPersonalization
): string {
  const profile = healthProfile.basicInfo;
  const genetics = healthProfile.genetics;
  const biomarkers = healthProfile.biomarkers;
  
  return `You are a clinical geneticist and personalized medicine specialist analyzing this specific product for this individual user.

CRITICAL: This analysis is for educational purposes only. Include appropriate disclaimers.

USER PROFILE:
- Age: ${profile.age || 'Not specified'}
- Weight: ${profile.weightLbs || 'Not specified'} lbs  
- Gender: ${profile.gender || 'Not specified'}
- Health Goals: ${healthProfile.healthGoals?.join(', ') || 'Not specified'}

LIFESTYLE ASSESSMENT (16 symptoms):
${Object.entries(healthProfile.healthMetrics).filter(([key, value]) => {
  const isMainQuestion = key.includes('Levels') || key.includes('Fatigue') || key.includes('Quality') || 
                        key.includes('Issues') || key.includes('System') || key.includes('Recovery') ||
                        key.includes('Management') || key.includes('Cravings') || key.includes('Changes') ||
                        key.includes('Pain') || key.includes('Effect') || key.includes('Fog') || key.includes('History');
  return isMainQuestion && !key.includes('Details') && value === 'yes';
}).map(([key, value]) => {
  const detailKey = key + 'Details';
  const details = healthProfile.healthMetrics[detailKey];
  return `• ${key.replace(/([A-Z])/g, ' $1').trim()}: YES${details ? `\n  💬 Details: "${details}"` : ''}`;
}).join('\n')}

${Object.entries(healthProfile.healthMetrics).filter(([key, value]) => key.includes('Details') && value).length > 0 ? 
`\n🔍 SYMPTOM PATTERN ANALYSIS REQUIRED:
Analyze the user-provided details above for:
- TIMING patterns (morning fatigue, 3pm crashes, after meals)
- TRIGGER patterns (stress, foods, weather, activity)
- CONNECTION patterns (symptoms that occur together)
- SEVERITY patterns (frequency, duration, life impact)
Use these patterns to determine if this product addresses their specific symptom patterns!` : ''}

GENETIC ANALYSIS (${genetics.length} variants analyzed):
${genetics.length > 0 ? genetics.map(g => 
  `• ${g.rsid} (${g.gene}): ${g.genotype}`
).join('\n') : 'No genetic data available - base analysis on profile and biomarkers'}

BIOMARKER STATUS (${biomarkers.length} markers):
${biomarkers.length > 0 ? biomarkers.map(b => 
  `• ${b.displayName}: ${b.value} ${b.unit} (Ref: ${b.referenceRange})`
).join('\n') : 'No biomarker data available'}

ALLERGIES: ${healthProfile.allergies?.join(', ') || 'None reported'}
CONDITIONS: ${healthProfile.conditions?.join(', ') || 'None reported'}  
MEDICATIONS: ${healthProfile.medications?.join(', ') || 'None reported'}

AI-DETECTED ROOT CAUSE PATTERNS (${healthProfile.symptomPatterns?.length || 0} patterns):
${healthProfile.symptomPatterns && healthProfile.symptomPatterns.length > 0 ? 
  healthProfile.symptomPatterns.map(p => 
    `• ${p.pattern_name} (${p.confidence_score}% confidence): ${Array.isArray(p.symptoms_involved) ? p.symptoms_involved.join(' + ') : p.symptoms_involved} → Recommended: ${Array.isArray(p.recommendations) ? p.recommendations.join(', ') : p.recommendations}`
  ).join('\n') :
  'No AI-detected symptom patterns available - these are generated from supplement plan analysis'
}

HYPER-PERSONALIZED ANALYSIS RESULTS:
${hyperPersonalization.geneticCompatibility.length > 0 ? 
  `GENETIC COMPATIBILITY:\n${hyperPersonalization.geneticCompatibility.map(gc => 
    `• ${gc.gene} (${gc.genotype}): ${gc.recommendation} (Score: ${gc.compatibilityScore}/100)`
  ).join('\n')}` : 'No genetic compatibility issues identified'}

${hyperPersonalization.biomarkerAlignment.length > 0 ?
  `BIOMARKER ALIGNMENT:\n${hyperPersonalization.biomarkerAlignment.map(ba =>
    `• ${ba.marker}: ${ba.productRelevance} - ${ba.dosageRecommendation}`
  ).join('\n')}` : 'No specific biomarker considerations'}

${hyperPersonalization.safetyAssessment.length > 0 ?
  `SAFETY CONCERNS:\n${hyperPersonalization.safetyAssessment.map(sa =>
    `• ${sa.type.toUpperCase()}: ${sa.concern} (${sa.severity}) - ${sa.recommendation}`
  ).join('\n')}` : 'No safety concerns identified'}

PRODUCT CATEGORY: ${hyperPersonalization.categorySpecificAnalysis.productCategory}

PRODUCT TO ANALYZE:
${productContent.substring(0, 6000)}

SCORING REQUIREMENTS - USE FULL 0-100 RANGE:
- 90-100: Perfect genetic/biomarker match, optimal forms, addresses specific needs
- 80-89: Very good compatibility, minor optimization opportunities  
- 70-79: Good compatibility, some suboptimal forms or missing elements
- 60-69: Moderate compatibility, several optimization needs
- 50-59: Below average, significant form/dosing issues
- 40-49: Poor compatibility, major genetic/biomarker mismatches
- 30-39: Very poor, contraindicated forms or dangerous interactions
- 20-29: Dangerous, multiple contraindications
- 0-19: Extremely dangerous, severe contraindications

RESPONSE FORMAT (JSON only, no markdown):
{
  "productName": "exact product name from content",
  "brand": "brand name", 
  "overallScore": number (0-100, be realistic and use full range),
  "summary": "1-2 sentences focusing on genetic/biomarker compatibility for THIS user",
  "pros": [
    "Specific benefits based on their genetic variants and biomarker levels",
    "Reference actual ingredients and dosages from the product",
    "Explain WHY it's good for their specific genetics/biomarkers"
  ],
  "cons": [
    "Specific concerns based on genetic contraindications and biomarker interactions", 
    "Reference actual ingredients by name and explain the issue",
    "Mention specific missing nutrients they need based on their variants",
    "Include dosage concerns for their weight/age/genetics"
  ],
  "warnings": [
    "Critical genetic or biomarker-based safety warnings",
    "Specific allergen or medication interaction alerts",
    "Any dangerous contraindications"
  ]
}

CRITICAL REQUIREMENTS:
1. Reference ACTUAL ingredients from the product by name and dosage
2. Explain WHY specific forms are good/bad for their genetics
3. Be specific about missing nutrients they need
4. Include weight-based dosing recommendations when relevant
5. Score harshly for genetic mismatches (MTHFR + folic acid = low score)
6. Score highly for perfect genetic matches (MTHFR + methylfolate = high score)
7. Include legal disclaimer language in warnings if needed

LEGAL DISCLAIMER: Include in warnings: "This analysis is for educational purposes only and not medical advice. Consult healthcare providers before making supplement decisions."`;
}

serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('User auth error:', userError);
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Parse request body
    const { productUrl } = await req.json();

    if (!productUrl) {
      return new Response(JSON.stringify({ error: 'Product URL is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Validate URL format
    try {
      new URL(productUrl);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL format' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Get API keys from Supabase secrets
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      throw new Error('Firecrawl API key not configured');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Scrape product page using Firecrawl
    console.log('Scraping product page:', productUrl);
    let productContent;
    try {
      const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: productUrl,
          pageOptions: {
            onlyMainContent: true,
            includeHtml: false,
          },
        }),
      });

      if (!firecrawlResponse.ok) {
        const errorData = await firecrawlResponse.text();
        console.error('Firecrawl error:', errorData);
        throw new Error(`Firecrawl API error: ${firecrawlResponse.status}`);
      }

      const firecrawlData = await firecrawlResponse.json();
      productContent = firecrawlData.data?.content;

      if (!productContent) {
        throw new Error('Could not extract product content from page');
      }
    } catch (error: any) {
      console.error('Error scraping product page:', error);
      return new Response(JSON.stringify({ 
        error: `Failed to scrape product page: ${error.message}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Fetch comprehensive user health data
    console.log('Fetching user health data for:', user.id);
    const [
      { data: profile, error: profileError },
      { data: biomarkers, error: biomarkersError },
      { data: rawSnps, error: snpsError },
      { data: allergies, error: allergiesError },
      { data: conditions, error: conditionsError },
      { data: medications, error: medicationsError },
      { data: okCapsuleProducts, error: productsError },
      { data: symptomPatterns, error: patternsError }
    ] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', user.id).single(),
      supabase.from('user_biomarkers').select('*').eq('user_id', user.id).limit(500),
      supabase.from('user_snps').select('*').eq('user_id', user.id).limit(1000),
              supabase.from('user_allergies').select('*').eq('user_id', user.id).limit(50),
              supabase.from('user_conditions').select('*').eq('user_id', user.id).limit(30),
        supabase.from('user_medications').select('*').eq('user_id', user.id).limit(50),
      supabase.from('products').select('supplement_name, brand, product_name, product_url').eq('brand', 'OK Capsule'),
      supabase.from('user_symptom_patterns').select('pattern_type, pattern_name, confidence_score, symptoms_involved, root_causes, pattern_description, recommendations').eq('user_id', user.id).order('confidence_score', { ascending: false })
    ]);

    // Fetch supported SNPs data separately for manual joining
    const { data: allSupportedSnps, error: supportedSnpsError } = await supabase
      .from('supported_snps')
      .select('id, rsid, gene');

    // Create a lookup map for supported SNPs
    const snpLookup = new Map();
    if (allSupportedSnps) {
      allSupportedSnps.forEach(snp => {
        snpLookup.set(snp.id, { rsid: snp.rsid, gene: snp.gene });
      });
    }

    // Manually join the SNP data
    const enrichedSnps = rawSnps?.map(userSnp => ({
      ...userSnp,
      supported_snps: snpLookup.get(userSnp.supported_snp_id) || null
    })) || [];

    // Handle potential data errors gracefully
    const userProfile = profile || {};
    const userBiomarkers = biomarkers || [];
    const userSnps = enrichedSnps || [];
    const userAllergies = allergies || [];
    const userConditions = conditions || [];
    const userMedications = medications || [];
    const availableProducts = okCapsuleProducts || [];
    const userSymptomPatterns = symptomPatterns || [];

    // ✨ BUILD HYPER-PERSONALIZED PRODUCT ANALYSIS
    const hyperPersonalization = buildProductHyperPersonalization(
      productContent,
      userProfile,
      userBiomarkers,
      userSnps,
      userConditions,
      userMedications,
      userAllergies
    );

    // Create comprehensive health profile for AI analysis
    const healthProfile = {
      basicInfo: {
        age: userProfile.age,
        gender: userProfile.gender,
        heightInches: userProfile.height_total_inches,
        weightLbs: userProfile.weight_lbs,
        activityLevel: userProfile.activity_level
      },
      healthGoals: userProfile.health_goals || [],
      healthMetrics: {
        sleepHours: userProfile.sleep_hours,
        energyLevels: userProfile.energy_levels,
        energyLevelsDetails: userProfile.energy_levels_details,
        effortFatigue: userProfile.effort_fatigue,
        effortFatigueDetails: userProfile.effort_fatigue_details,
        caffeineEffect: userProfile.caffeine_effect,
        caffeineEffectDetails: userProfile.caffeine_effect_details,
        brainFog: userProfile.brain_fog,
        brainFogDetails: userProfile.brain_fog_details,
        anxietyLevel: userProfile.anxiety_level,
        stressResilience: userProfile.stress_resilience,
        stressLevels: userProfile.stress_levels,
        stressLevelsDetails: userProfile.stress_levels_details,
        sleepQuality: userProfile.sleep_quality,
        sleepQualityDetails: userProfile.sleep_quality_details,
        moodChanges: userProfile.mood_changes,
        moodChangesDetails: userProfile.mood_changes_details,
        sleepAids: userProfile.sleep_aids,
        bloating: userProfile.bloating,
        anemiaHistory: userProfile.anemia_history,
        digestionSpeed: userProfile.digestion_speed,
        digestiveIssues: userProfile.digestive_issues,
        digestiveIssuesDetails: userProfile.digestive_issues_details,
        foodSensitivities: userProfile.food_sensitivities,
        foodSensitivitiesDetails: userProfile.food_sensitivities_details,
        sugarCravings: userProfile.sugar_cravings,
        sugarCravingsDetails: userProfile.sugar_cravings_details,
        lowNutrients: userProfile.low_nutrients || [],
        bruisingBleeding: userProfile.bruising_bleeding,
        bellyFat: userProfile.belly_fat,
        jointPain: userProfile.joint_pain,
        jointPainDetails: userProfile.joint_pain_details,
        skinIssues: userProfile.skin_issues,
        skinIssuesDetails: userProfile.skin_issues_details,
        immuneSystem: userProfile.immune_system,
        immuneSystemDetails: userProfile.immune_system_details,
        workoutRecovery: userProfile.workout_recovery,
        workoutRecoveryDetails: userProfile.workout_recovery_details,
        weightManagement: userProfile.weight_management,
        weightManagementDetails: userProfile.weight_management_details,
        medicationHistory: userProfile.medication_history,
        medicationHistoryDetails: userProfile.medication_history_details
      },
      biomarkers: userBiomarkers.map(b => {
        const prettify = (raw: string | null) => {
          if (!raw) return 'Unknown Marker';
          const overrides: Record<string, string> = {
            'vitamin_d_25_oh': 'Vitamin D, 25-OH',
            'ldl_c': 'LDL Cholesterol',
            'hdl_c': 'HDL Cholesterol',
            'hs_crp': 'hs-CRP',
            'hba1c': 'Hemoglobin A1c'
          };
          if (overrides[raw.toLowerCase()]) return overrides[raw.toLowerCase()];
          return raw.replace(/_/g, ' ').replace(/\b([a-z])/g, (m) => m.toUpperCase());
        };

        return {
          name: b.marker_name,
          displayName: prettify(b.marker_name),
          value: b.value,
          unit: b.unit,
          referenceRange: b.reference_range,
          comment: b.comment
        };
      }),
      genetics: userSnps.map(s => ({
        rsid: s.supported_snps?.rsid || s.snp_id || s.rsid,
        gene: s.supported_snps?.gene || s.gene_name || s.gene,
        genotype: s.genotype,
        comment: s.comment
      })).filter(g => g.rsid && g.gene),
      allergies: userAllergies.map(a => a.ingredient_name),
      conditions: userConditions.map(c => c.condition_name),
      medications: userMedications.map(m => m.medication_name),
      symptomPatterns: userSymptomPatterns,
      okCapsuleAlternatives: availableProducts.map(p => ({
        supplementName: p.supplement_name,
        productName: p.product_name,
        url: p.product_url
      }))
    };

    // Generate enhanced AI analysis with hyper-personalization
    console.log('Generating hyper-personalized AI analysis...');
    try {
      const enhancedPrompt = createHyperPersonalizedPrompt(
        productContent,
        healthProfile,
        hyperPersonalization
      );

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',

          messages: [
            {
              role: 'system',
              content: enhancedPrompt
            }
          ],
        }),
      });

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const completion = await openaiResponse.json();
      let aiResponse = completion.choices?.[0]?.message?.content;
      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Clean up AI response - remove markdown code blocks if present
      aiResponse = aiResponse.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();

      // Parse AI response
      let analysis;
      try {
        analysis = JSON.parse(aiResponse);
      } catch (parseError) {
        console.error('AI response parsing error:', parseError);
        console.error('Raw AI response:', aiResponse);
        throw new Error('Failed to parse AI analysis');
      }

      // Validate response structure
      const requiredFields = ['productName', 'overallScore', 'summary', 'pros', 'cons'];
      for (const field of requiredFields) {
        if (!(field in analysis)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Ensure arrays are properly formatted
      analysis.pros = Array.isArray(analysis.pros) ? analysis.pros : [];
      analysis.cons = Array.isArray(analysis.cons) ? analysis.cons : [];
      analysis.warnings = Array.isArray(analysis.warnings) ? analysis.warnings : [];

      // Add legal disclaimer if not present
      if (!analysis.warnings.some((w: string) => w.includes('educational purposes'))) {
        analysis.warnings.unshift('This analysis is for educational purposes only and not medical advice. Consult healthcare providers before making supplement decisions.');
      }

      // Save to product check history
      try {
        const { error: historyError } = await supabase
          .from('product_check_history')
          .insert({
            user_id: user.id,
            product_url: productUrl,
            product_name: analysis.productName,
            brand: analysis.brand,
            overall_score: analysis.overallScore,
            analysis_summary: analysis.summary,
            pros: analysis.pros,
            cons: analysis.cons,
            warnings: analysis.warnings,
            full_analysis: analysis
          });

        if (historyError) {
          console.error('Failed to save product check history:', historyError);
        }
      } catch (historyError) {
        console.error('Error saving to history:', historyError);
      }

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error: any) {
      console.error('AI analysis error:', error);
      return new Response(JSON.stringify({ 
        error: `Failed to analyze product: ${error.message}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

  } catch (error: any) {
    console.error('Product check error:', error);
    return new Response(JSON.stringify({ 
      error: `Server error: ${error.message}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 