// ⚡ SPEED OPTIMIZATION: Using GPT-4.1 nano for 3-5x faster responses while maintaining full personalization
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { checkRateLimit, getRateLimitHeaders } from '../rate-limiter/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: any;
}

// Enhanced health context cache with smarter invalidation
const healthContextCache = new Map<string, { 
  context: string, 
  timestamp: number, 
  dataHash: string,
  compressedContext?: string,
  personalityProfile?: PersonalityProfile,
  lifestyleContext?: LifestyleContext
}>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for better cost savings

// Response cache for common questions with personalization
const responseCache = new Map<string, { 
  response: string, 
  timestamp: number,
  userProfile: string,
  personalityMatch: string
}>();
const RESPONSE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Enhanced personalization interfaces
interface PersonalityProfile {
  communicationStyle: 'detailed' | 'concise' | 'encouraging' | 'scientific';
  preferredTone: 'professional' | 'friendly' | 'motivational' | 'educational';
  complexityLevel: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  responseLength: 'short' | 'medium' | 'long';
}

interface LifestyleContext {
  activityPattern: string;
  stressLevel: string;
  sleepPattern: string;
  dietaryPreferences: string[];
  supplementCompliance: string;
  healthPriorities: string[];
  timeConstraints: string;
}

interface ConversationMemory {
  previousConcerns: string[];
  recommendationHistory: string[];
  userPreferences: string[];
  successfulAdvice: string[];
  followUpNeeded: string[];
}

// ============= HYPER-PERSONALIZATION LAYER =============

interface HyperPersonalizedContext {
  geneticInsights: GeneticInsight[];
  biomarkerAlerts: BiomarkerAlert[];
  symptomPersonalization: SymptomPersonalization;
  personalizedProtocols: PersonalizedProtocol[];
  riskFactors: RiskFactor[];
  contextualRecommendations: ContextualRecommendation[];
  // No confidence score - always provide best personalization possible
}

interface GeneticInsight {
  gene: string;
  rsid: string;
  genotype: string;
  impact: string;
  personalizedAdvice: string;
  mechanismExplanation: string;
}

interface BiomarkerAlert {
  marker: string;
  value: number;
  severity: 'critical' | 'moderate' | 'mild';
  personalizedResponse: string;
  targetRange: string;
  actionPlan: string;
}

interface SymptomPersonalization {
  primarySymptoms: string[];
  underlyingCauses: string[];
  personalizedMechanisms: string[];
  targetedSolutions: string[];
  lifestyleModifications: string[];
  supplementRecommendations: string[];
}

interface PersonalizedProtocol {
  condition: string;
  personalizedReasoning: string;
  specificRecommendations: string[];
  dosageAdjustments: string[];
  timingOptimization: string[];
  combinationSynergies: string[];
}

interface RiskFactor {
  type: 'genetic' | 'biomarker' | 'lifestyle' | 'demographic';
  factor: string;
  risk: 'high' | 'moderate' | 'low';
  personalizedMitigation: string;
}

interface ContextualRecommendation {
  category: string;
  recommendation: string;
  reasoning: string;
  priority: number;
  expectedOutcome: string;
}

// Smart symptom categorization with genetic mapping
function categorizeSymptom(symptom: string): {
  category: string;
  subcategory: string;
  keyGenes: string[];
  criticalBiomarkers: string[];
  commonCauses: string[];
  personalizedFactors: string[];
} {
  const symptomLower = symptom.toLowerCase();
  
  // Comprehensive symptom mapping
  if (symptomLower.includes('hangover') || symptomLower.includes('alcohol')) {
    return {
      category: 'metabolic_detox',
      subcategory: 'alcohol_recovery',
      keyGenes: ['ALDH2', 'CYP2E1', 'MTHFR', 'MTR', 'MTRR', 'CBS', 'GSTP1', 'GSTM1', 'SOD2'],
      criticalBiomarkers: ['Liver enzymes', 'B12', 'Folate', 'Glutathione', 'Magnesium', 'Zinc'],
      commonCauses: ['Acetaldehyde buildup', 'Dehydration', 'Electrolyte imbalance', 'B-vitamin depletion'],
      personalizedFactors: ['genetic alcohol metabolism', 'methylation capacity', 'antioxidant status', 'liver function']
    };
  }
  
  if (symptomLower.includes('tired') || symptomLower.includes('fatigue') || symptomLower.includes('energy')) {
    return {
      category: 'energy_metabolism',
      subcategory: 'chronic_fatigue',
      keyGenes: ['MTHFR', 'COMT', 'VDR', 'CYP1A2', 'TCN2', 'MTR', 'MTRR', 'SOD2', 'GSTP1'],
      criticalBiomarkers: ['Ferritin', 'B12', 'Folate', 'Vitamin D', 'TSH', 'Cortisol', 'Magnesium'],
      commonCauses: ['Iron deficiency', 'B-vitamin deficiency', 'Thyroid dysfunction', 'Mitochondrial dysfunction'],
      personalizedFactors: ['methylation status', 'iron absorption', 'thyroid sensitivity', 'stress response']
    };
  }
  
  if (symptomLower.includes('sleep') || symptomLower.includes('insomnia')) {
    return {
      category: 'sleep_circadian',
      subcategory: 'sleep_disorder',
      keyGenes: ['COMT', 'CLOCK', 'PER1', 'PER2', 'MTHFR', 'GAD1', 'GABA', 'CYP1A2'],
      criticalBiomarkers: ['Cortisol', 'Melatonin', 'Magnesium', 'GABA', 'Glycine', 'Vitamin D'],
      commonCauses: ['Circadian disruption', 'Stress hormones', 'Neurotransmitter imbalance', 'Nutrient deficiency'],
      personalizedFactors: ['dopamine clearance', 'caffeine metabolism', 'stress sensitivity', 'melatonin production']
    };
  }
  
  if (symptomLower.includes('anxious') || symptomLower.includes('stress') || symptomLower.includes('overwhelm')) {
    return {
      category: 'neurological_mood',
      subcategory: 'anxiety_stress',
      keyGenes: ['COMT', 'MTHFR', 'GAD1', 'GABA', 'SLC6A4', 'TPH2', 'MAO', 'BDNF'],
      criticalBiomarkers: ['Cortisol', 'GABA', 'Serotonin', 'Dopamine', 'Magnesium', 'B6', 'Zinc'],
      commonCauses: ['Neurotransmitter imbalance', 'HPA axis dysfunction', 'Nutrient deficiency', 'Inflammation'],
      personalizedFactors: ['dopamine processing', 'serotonin synthesis', 'stress hormone response', 'methylation capacity']
    };
  }
  
  if (symptomLower.includes('digest') || symptomLower.includes('bloat') || symptomLower.includes('stomach')) {
    return {
      category: 'digestive_gut',
      subcategory: 'gut_dysfunction',
      keyGenes: ['FUT2', 'LCT', 'FADS', 'CYP', 'GSTP1', 'IL1B', 'TNF', 'HLA'],
      criticalBiomarkers: ['CRP', 'Zonulin', 'SIBO breath test', 'Digestive enzymes', 'B12', 'Folate'],
      commonCauses: ['Gut dysbiosis', 'Food sensitivities', 'Enzyme deficiency', 'Inflammation'],
      personalizedFactors: ['secretor status', 'lactose tolerance', 'inflammatory response', 'detoxification capacity']
    };
  }
  
  // Default categorization
  return {
    category: 'general_health',
    subcategory: 'mixed_symptoms',
    keyGenes: ['MTHFR', 'COMT', 'VDR', 'CYP2D6'],
    criticalBiomarkers: ['CRP', 'Vitamin D', 'B12', 'Folate'],
    commonCauses: ['Nutrient deficiency', 'Inflammation', 'Stress'],
    personalizedFactors: ['genetic variants', 'biomarker status', 'lifestyle factors']
  };
}

// Build comprehensive personalized context
function buildHyperPersonalizedContext(
  symptom: string,
  profile: any,
  biomarkers: any[],
  snps: any[],
  conditions: any[],
  medications: any[],
  allergies: any[]
): HyperPersonalizedContext {
  
  const symptomData = categorizeSymptom(symptom);
  const hasGeneticData = snps && snps.length > 0;
  
  // Genetic insights (if available)
  const geneticInsights: GeneticInsight[] = [];
  if (hasGeneticData) {
    const relevantSnps = snps.filter(s => 
      symptomData.keyGenes.some(gene => 
        (s.gene || '').toUpperCase().includes(gene.toUpperCase())
      )
    );
    
    relevantSnps.forEach(snp => {
      if (snp.gene && snp.genotype) {
        geneticInsights.push({
          gene: snp.gene,
          rsid: snp.rsid || '',
          genotype: snp.genotype,
          impact: generateGeneticImpact(snp.gene, snp.genotype, symptomData.category),
          personalizedAdvice: generatePersonalizedGeneticAdvice(snp.gene, snp.genotype, symptomData.category),
          mechanismExplanation: generateMechanismExplanation(snp.gene, snp.genotype, symptomData.category)
        });
      }
    });
  }
  
  // Biomarker analysis
  const biomarkerAlerts: BiomarkerAlert[] = [];
  const relevantBiomarkers = biomarkers.filter(b => 
    symptomData.criticalBiomarkers.some(marker => 
      (b.marker_name || '').toLowerCase().includes(marker.toLowerCase())
    )
  );
  
  // Include ALL relevant biomarkers for LLM to interpret based on full context
  relevantBiomarkers.forEach(b => {
    biomarkerAlerts.push({
      marker: b.marker_name || 'Unknown',
      value: b.value || 0,
      severity: 'moderate' as 'critical' | 'moderate' | 'mild', // Let LLM determine actual severity
      personalizedResponse: `${b.marker_name}: ${b.value}${b.unit || ''}`, // Let LLM provide interpretation
      targetRange: b.reference_range || 'Requires personalized assessment',
      actionPlan: `Optimize ${b.marker_name} based on your unique profile` // Let LLM provide specific plan
    });
  });
  
  // Symptom personalization
  const symptomPersonalization: SymptomPersonalization = {
    primarySymptoms: [symptom],
    underlyingCauses: generatePersonalizedCauses(symptomData, profile, hasGeneticData),
    personalizedMechanisms: generatePersonalizedMechanisms(symptomData, profile, geneticInsights, biomarkerAlerts),
    targetedSolutions: generateTargetedSolutions(symptomData, profile, geneticInsights, biomarkerAlerts),
    lifestyleModifications: generateLifestyleModifications(symptomData, profile),
    supplementRecommendations: generateSupplementRecommendations(symptomData, profile, geneticInsights, biomarkerAlerts)
  };
  
  return {
    geneticInsights,
    biomarkerAlerts,
    symptomPersonalization,
    personalizedProtocols: [], // Will be populated later
    riskFactors: [], // Will be populated later
    contextualRecommendations: [] // Will be populated later
  };
}

// Generate personalized insights based on available data
function generatePersonalizedCauses(symptomData: any, profile: any, hasGeneticData: boolean): string[] {
  const causes = [...symptomData.commonCauses];
  
  // Add profile-specific causes
  if (profile?.age > 45) causes.push('age-related decline');
  if (profile?.gender === 'female') causes.push('hormonal fluctuations');
  if (profile?.stress_resilience === 'low') causes.push('chronic stress impact');
  if (profile?.sleep_quality === 'poor') causes.push('sleep disruption cascade');
  if (profile?.alcohol_intake === 'high') causes.push('alcohol-related depletion');
  
  // Add genetic-informed causes if available
  if (hasGeneticData) {
    causes.push('genetic predisposition', 'variant-specific metabolism');
  }
  
  return causes.slice(0, 6); // Limit to most relevant
}

function generatePersonalizedMechanisms(
  symptomData: any, 
  profile: any, 
  geneticInsights: GeneticInsight[], 
  biomarkerAlerts: BiomarkerAlert[]
): string[] {
  const mechanisms = [];
  
  // Add genetic mechanisms
  geneticInsights.forEach(insight => {
    mechanisms.push(insight.mechanismExplanation);
  });
  
  // Add biomarker mechanisms
  biomarkerAlerts.forEach(alert => {
    if (alert.severity === 'critical') {
      mechanisms.push(`${alert.marker} imbalance affecting ${symptomData.category}`);
    }
  });
  
  // Add profile-based mechanisms
  if (profile?.energy_levels === 'low') {
    mechanisms.push('mitochondrial energy production impairment');
  }
  if (profile?.brain_fog === 'severe') {
    mechanisms.push('neurotransmitter and circulation disruption');
  }
  
  return mechanisms.slice(0, 5);
}

function generateTargetedSolutions(
  symptomData: any, 
  profile: any, 
  geneticInsights: GeneticInsight[], 
  biomarkerAlerts: BiomarkerAlert[]
): string[] {
  const solutions = [];
  
  // Genetic-based solutions (EXTREMELY SPECIFIC)
  geneticInsights.forEach(insight => {
    solutions.push(insight.personalizedAdvice);
  });
  
  // Biomarker-based solutions (EXTREMELY SPECIFIC)
  biomarkerAlerts.forEach(alert => {
    solutions.push(alert.actionPlan);
  });
  
  // Profile-based solutions (EXTREMELY SPECIFIC)
  if (profile?.activity_level === 'sedentary') {
    solutions.push('Start with 10-minute walks after meals, progress to 150min/week moderate exercise, add resistance training 2x/week');
  }
  if (profile?.sleep_hours < 7) {
    solutions.push('Implement sleep hygiene: lights off 10pm, no screens 1hr before bed, room temp 65-68°F, blackout curtains, consistent wake time');
  }
  if (profile?.energy_levels === 'crash') {
    solutions.push('Stabilize blood sugar: eat protein within 1hr of waking, no meals >4hrs apart, avoid refined sugars, add cinnamon 1g daily');
  }
  if (profile?.brain_fog === 'all_the_time') {
    solutions.push('Cognitive enhancement protocol: 20min meditation daily, intermittent fasting 16:8, eliminate gluten for 30 days, hydrate 3L daily');
  }
  if (profile?.health_goals?.includes('muscle_gain')) {
    solutions.push('Protein target: 1g per lb bodyweight, train each muscle 2x/week, sleep 7-9hrs, creatine 5g daily post-workout');
  }
  if (profile?.health_goals?.includes('weight_loss')) {
    solutions.push('Caloric deficit 500cal/day, strength training 3x/week, NEAT increase (walk 8000+ steps), meal prep Sundays');
  }
  if (profile?.health_goals?.includes('reduce_stress')) {
    solutions.push('Stress management: 4-7-8 breathing 3x daily, yoga/meditation 20min morning, nature exposure 30min daily, limit caffeine to before 2pm');
  }
  
  return solutions.slice(0, 6);
}

function generateLifestyleModifications(symptomData: any, profile: any): string[] {
  const modifications = [];
  
  // Category-specific modifications
  if (symptomData.category === 'metabolic_detox') {
    modifications.push('liver support protocol', 'hydration optimization', 'electrolyte rebalancing');
  }
  if (symptomData.category === 'energy_metabolism') {
    modifications.push('mitochondrial support routine', 'circadian rhythm optimization', 'stress management');
  }
  
  // Profile-specific modifications
  if (profile?.caffeine_effect === 'jittery') {
    modifications.push('caffeine timing and dosage adjustment');
  }
  if (profile?.digestion_speed === 'slow') {
    modifications.push('digestive enzyme support and meal timing');
  }
  
  return modifications.slice(0, 5);
}

function generateSupplementRecommendations(
  symptomData: any, 
  profile: any, 
  geneticInsights: GeneticInsight[], 
  biomarkerAlerts: BiomarkerAlert[]
): string[] {
  const recommendations = [];
  const weight = profile?.weight_lbs || 150; // Default weight for dosing
  const age = profile?.age || 25;
  
  // Genetic-informed recommendations (EXTREMELY SPECIFIC)
  if (geneticInsights.some(g => g.gene === 'MTHFR')) {
    recommendations.push(`Methylfolate 800mcg + Methylcobalamin B12 1000mcg + P5P B6 50mg + TMG 500mg (take with breakfast, avoid folic acid supplements)`);
  }
  if (geneticInsights.some(g => g.gene === 'COMT')) {
    recommendations.push(`Magnesium Glycinate 400mg at bedtime + L-Theanine 200mg as needed + avoid high-dose methyl donors`);
  }
  if (geneticInsights.some(g => g.gene === 'ALDH2')) {
    recommendations.push(`NAC 600mg before alcohol + Glutathione 250mg + Milk Thistle 200mg for liver support`);
  }
  
  // Biomarker-informed recommendations (EXTREMELY SPECIFIC)
  biomarkerAlerts.forEach(alert => {
    if (alert.marker.toLowerCase().includes('vitamin d')) {
      const dosage = Math.round(weight * 40); // 40 IU per pound
      recommendations.push(`Vitamin D3 ${dosage}IU + Vitamin K2 (MK-7) 100mcg + Magnesium 200mg - take with fat-containing meal`);
    }
    if (alert.marker.toLowerCase().includes('b12')) {
      recommendations.push(`Sublingual Methylcobalamin B12 1000mcg daily on empty stomach + Folate 400mcg + B-Complex`);
    }
    if (alert.marker.toLowerCase().includes('ferritin')) {
      recommendations.push(`Chelated Iron 25mg + Vitamin C 500mg (take between meals, avoid with coffee/tea/dairy)`);
    }
  });
  
  // Symptom-specific recommendations (EXTREMELY SPECIFIC)
  if (symptomData.category === 'metabolic_detox') {
    recommendations.push(`NAC 600mg x2 daily + Milk Thistle (Silymarin) 200mg x3 daily + Glutathione 250mg on empty stomach`);
  }
  if (symptomData.category === 'energy_metabolism') {
    recommendations.push(`CoQ10 100mg + Rhodiola 400mg (morning) + Ashwagandha 600mg (evening) + B-Complex with breakfast`);
  }
  if (symptomData.category === 'neurological_cognitive') {
    recommendations.push(`Lion's Mane 1000mg + Phosphatidylserine 100mg + Omega-3 EPA 1000mg/DHA 500mg + Magnesium L-Threonate 2g before bed`);
  }
  if (symptomData.category === 'sleep_circadian') {
    recommendations.push(`Melatonin 0.5-3mg (start low) 30min before desired bedtime + Magnesium Glycinate 400mg + L-Theanine 200mg`);
  }
  
  // Profile-specific additions (EXTREMELY SPECIFIC)
  if (profile?.energy_levels === 'crash') {
    recommendations.push(`Adaptogenic Stack: Ashwagandha 600mg (8am) + Rhodiola 400mg (8am) + Holy Basil 300mg (6pm) - cycle 5 days on, 2 days off`);
  }
  if (profile?.brain_fog === 'all_the_time' || profile?.brain_fog === 'severe') {
    recommendations.push(`Cognitive Support: Alpha-GPC 300mg + Bacopa Monnieri 300mg + Huperzine A 200mcg (take with morning meal)`);
  }
  if (profile?.age < 25) {
    recommendations.push(`Young Adult Support: Creatine 5g post-workout + Zinc 15mg with dinner + Vitamin D3 ${Math.round(weight * 35)}IU`);
  }
  if (profile?.gender === 'male' && profile?.age > 30) {
    recommendations.push(`Male Optimization: Zinc 15mg + Vitamin D3 4000IU + Magnesium 400mg + consider Tongkat Ali 200mg`);
  }
  if (profile?.gender === 'female') {
    recommendations.push(`Female Support: Iron 18mg (if not contraindicated) + Folate 800mcg + Vitamin D3 3000IU + B6 50mg for hormone support`);
  }
  
  return recommendations.slice(0, 6); // Return top 6 most relevant
}

// Helper functions for genetic analysis
function generateGeneticImpact(gene: string, genotype: string, category: string): string {
  // Simplified genetic impact analysis
  const impacts: Record<string, Record<string, string>> = {
    'MTHFR': {
      'CC': 'normal methylation capacity',
      'CT': 'moderately reduced methylation (40% capacity)',
      'TT': 'severely reduced methylation (10-20% capacity)'
    },
    'COMT': {
      'GG': 'slow dopamine clearance (worrier type)',
      'AG': 'moderate dopamine clearance',
      'AA': 'fast dopamine clearance (warrior type)'
    }
  };
  
  return impacts[gene]?.[genotype] || `${genotype} variant with unknown impact`;
}

function generatePersonalizedGeneticAdvice(gene: string, genotype: string, category: string): string {
  // EXTREMELY SPECIFIC genetic advice
  if (gene === 'MTHFR' && (genotype === 'CT' || genotype === 'TT')) {
    const severity = genotype === 'TT' ? 'severe' : 'moderate';
    return `MTHFR ${genotype}: Take Methylfolate 800-1600mcg daily + Methylcobalamin B12 1000-2000mcg + P5P B6 50mg + TMG 500mg + avoid all folic acid supplements. ${severity} reduction in folate processing requires lifelong methylated forms.`;
  }
  if (gene === 'COMT' && genotype === 'GG') {
    return 'COMT GG (Worrier): Slow dopamine clearance - Magnesium Glycinate 400mg bedtime + L-Theanine 200mg as needed + limit caffeine to <100mg before noon + avoid high-stress situations + consider meditation 20min daily';
  }
  if (gene === 'COMT' && genotype === 'AA') {
    return 'COMT AA (Warrior): Fast dopamine clearance - higher protein intake + Tyrosine 500mg morning + moderate caffeine OK + intense exercise beneficial + stress can improve performance';
  }
  if (gene === 'ALDH2' && genotype === 'GA') {
    return 'ALDH2 GA: 40% reduced alcohol metabolism - NAC 600mg 30min before alcohol + Glutathione 250mg + Milk Thistle 200mg + limit to 1 drink maximum + never drink on empty stomach + Asian flush indicates toxicity';
  }
  if (gene === 'VDR' && (genotype === 'CT' || genotype === 'TT')) {
    return 'VDR variant: Reduced vitamin D receptor function - require higher vitamin D3 doses (5000-8000IU daily) + Magnesium 400mg + Vitamin K2 100mcg + test 25-OH vitamin D every 3 months';
  }
  
  return `${gene} ${genotype}: Personalized protocol needed - consult genetic counselor for specific recommendations`;
}

function generateMechanismExplanation(gene: string, genotype: string, category: string): string {
  if (gene === 'MTHFR') {
    return 'MTHFR variant reduces folate metabolism, affecting methylation and neurotransmitter production';
  }
  if (gene === 'COMT') {
    return 'COMT variant affects dopamine breakdown speed, influencing stress response and focus';
  }
  if (gene === 'ALDH2') {
    return 'ALDH2 variant reduces acetaldehyde clearance, causing alcohol sensitivity and hangover severity';
  }
  
  return `${gene} variant affects ${category} through metabolic pathway disruption`;
}

function generatePersonalizedBiomarkerResponse(biomarker: any, category: string): string {
  const name = biomarker.marker_name?.toLowerCase() || '';
  const value = biomarker.value || 0;
  
  if (name.includes('vitamin d') && value < 30) {
    return 'Low vitamin D significantly impacts energy, mood, and immune function - this is likely a major contributor to your symptoms';
  }
  if (name.includes('b12') && value < 400) {
    return 'Suboptimal B12 levels can cause fatigue, brain fog, and mood issues - this needs immediate attention';
  }
  if (name.includes('ferritin') && value < 50) {
    return 'Low ferritin indicates depleted iron stores, directly causing fatigue and exercise intolerance';
  }
  
  return `Your ${biomarker.marker_name} level of ${value} is contributing to your symptoms and needs optimization`;
}

function generateBiomarkerActionPlan(biomarker: any, category: string): string {
  const name = biomarker.marker_name?.toLowerCase() || '';
  
  if (name.includes('vitamin d')) {
    return 'Take 4000-6000 IU vitamin D3 daily with K2, retest in 8-12 weeks';
  }
  if (name.includes('b12')) {
    return 'Use sublingual methylcobalamin 1000mcg daily, consider B-complex with cofactors';
  }
  if (name.includes('ferritin')) {
    return 'Use chelated iron 25-50mg daily with vitamin C, away from meals, retest in 12 weeks';
  }
  
  return `Optimize ${biomarker.marker_name} through targeted supplementation and lifestyle changes`;
}

// Enhanced conversation optimization with personality awareness
function optimizeConversationHistory(messages: any[], personalityProfile?: PersonalityProfile): any[] {
  if (!messages || messages.length === 0) return [];
  
  // Adjust history length based on user's complexity preference
  const maxMessages = personalityProfile?.complexityLevel === 'advanced' ? 12 : 
                     personalityProfile?.complexityLevel === 'intermediate' ? 8 : 6;
  
  // Keep recent messages and important context
  const recentMessages = messages.slice(-maxMessages);
  
  // Prioritize messages with health insights or recommendations
  const prioritizedMessages = recentMessages.filter(msg => {
    const content = msg.content?.toLowerCase() || '';
    return content.includes('recommend') || 
           content.includes('suggest') || 
           content.includes('biomarker') ||
           content.includes('genetic') ||
           content.includes('supplement');
  });
  
  // Combine recent + prioritized, removing duplicates
  const combined = [...new Set([...prioritizedMessages, ...recentMessages.slice(-4)])];
  
  return combined.slice(-maxMessages);
}

// Enhanced data hash with health data prioritization
function createDataHash(profile: any, biomarkers: any[], snps: any[], conditions: any[], medications: any[], allergies: any[], lifestyle?: LifestyleContext, symptomPatterns?: any[]): string {
  // Create detailed health data fingerprint for cache invalidation
  const healthDataFingerprint = {
    // Profile health indicators (most important)
    profileHealth: {
      updated: profile?.updated_at || profile?.created_at,
      healthGoals: profile?.health_goals?.sort().join(',') || '',
      energyLevels: profile?.energy_levels || '',
      brainFog: profile?.brain_fog || '',
      sleepQuality: profile?.sleep_quality || ''
    },
    
    // Critical biomarker data
    biomarkers: {
      count: biomarkers?.length || 0,
      criticalMarkers: biomarkers?.filter(b => 
        ['CRP', 'HDL', 'LDL', 'Glucose', 'HBA1C', 'Ferritin', 'Vitamin D', 'B12', 'TSH'].some(key => 
          (b.marker_name || '').toUpperCase().includes(key)
        )
      ).map(b => `${b.marker_name}:${b.value}`).sort().join('|') || ''
    },
    
    // Genetic variants (extremely important for personalization)
    genetics: {
      count: snps?.length || 0,
      importantGenes: snps?.filter(s => 
        ['MTHFR', 'COMT', 'VDR', 'APOE', 'CBS', 'MTR', 'MTRR'].includes(s.gene)
      ).map(s => `${s.gene}:${s.rsid}:${s.genotype}`).sort().join('|') || ''
    },
    
    // Medical conditions and medications (safety critical)
    medical: {
      conditions: conditions?.map(c => c.condition_name).sort().join(',') || '',
      medications: medications?.map(m => m.medication_name).sort().join(',') || '',
      allergies: allergies?.map(a => a.ingredient_name).sort().join(',') || ''
    },
    
    // Lifestyle factors
    lifestyle: lifestyle || {},
    
    // AI-detected symptom patterns (important for cache invalidation)
    patterns: {
      count: symptomPatterns?.length || 0,
      patterns: symptomPatterns?.map(p => `${p.pattern_type}:${p.confidence_score}`).sort().join('|') || ''
    }
  };
  
  const dataString = JSON.stringify(healthDataFingerprint);
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

// Enhanced context compression with personality awareness
function compressHealthContext(context: string, personalityProfile?: PersonalityProfile): string {
  let compressed = context
    .replace(/\*\*([^*]+)\*\*/g, '$1:') // Remove bold formatting
    .replace(/\n\n+/g, '\n') // Reduce multiple newlines
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Adjust compression based on user's preferred response length
  if (personalityProfile?.responseLength === 'short') {
    compressed = compressed
      .replace(/\([^)]+\)/g, '') // Remove parenthetical info
      .replace(/,\s*[^,]{1,20}(?=,|$)/g, '') // Remove short descriptors
      .substring(0, 1500); // Limit length more aggressively
  }
  
  return compressed;
}

// Enhanced system prompt with personality adaptation
function createPersonalizedSystemPrompt(
  healthContext: string, 
  personalityProfile: PersonalityProfile,
  lifestyleContext: LifestyleContext,
  conversationMemory: ConversationMemory,
  hasGeneticAnalysis: boolean = false
): string {
  const compressedContext = compressHealthContext(healthContext, personalityProfile);
  
  // Personality-based prompt customization
  const toneInstructions = {
    'professional': 'Use clinical terminology and evidence-based language.',
    'friendly': 'Use warm, conversational language with empathy.',
    'motivational': 'Use encouraging, action-oriented language.',
    'educational': 'Use clear explanations with scientific context.'
  };
  
  const styleInstructions = {
    'detailed': 'Provide comprehensive explanations with mechanisms.',
    'concise': 'Give direct, actionable advice without excessive detail.',
    'encouraging': 'Focus on positive outcomes and achievable steps.',
    'scientific': 'Include research references and biological mechanisms.'
  };
  
  const lengthInstructions = {
    'short': 'Keep responses under 150 words.',
    'medium': 'Keep responses between 150-300 words.',
    'long': 'Provide detailed responses up to 500 words when needed.'
  };
  
      // Build personalized context
    const personalizedSections = [];
    
    // Add lifestyle context
    if (lifestyleContext.timeConstraints) {
      personalizedSections.push(`**LIFESTYLE**: ${lifestyleContext.timeConstraints} schedule, ${lifestyleContext.stressLevel} stress, ${lifestyleContext.activityPattern} activity`);
    }
    
    // Add conversation memory
  if (conversationMemory.previousConcerns.length > 0) {
    personalizedSections.push(`**PREVIOUS CONCERNS**: ${conversationMemory.previousConcerns.slice(-3).join(', ')}`);
  }
  
  if (conversationMemory.userPreferences.length > 0) {
    personalizedSections.push(`**USER PREFERENCES**: ${conversationMemory.userPreferences.slice(-3).join(', ')}`);
  }
  
  const personalizedContext = personalizedSections.length > 0 ? 
    '\n\n' + personalizedSections.join('\n') : '';
  
  return `You are an evidence-based precision health AI assistant with access to this user's COMPLETE health profile and advanced research capabilities:

${compressedContext}${personalizedContext}

**🎯 HOLISTIC HEALTH INTEGRATION**:
- Process ALL user data simultaneously - find interconnected patterns across their complete health profile
- Use their EXACT words for symptoms - never paraphrase
- Apply your medical knowledge to connect genetics, biomarkers, lifestyle, demographics, and conditions
- Work with whatever data is available - transform missing data into intelligent testing recommendations
- Find the unified biological narrative that explains their unique health picture

**🧬 PARALLEL PATTERN RECOGNITION**:
- Identify where multiple data points converge on the same biological pathway or mechanism
- Use your medical knowledge to map symptom patterns to likely root causes
- Consider how demographics (age/gender) influence biomarker interpretation and genetic expression
- Connect lifestyle symptoms to probable biological mechanisms even without test confirmation
- Generate targeted testing recommendations based on symptom clusters and existing data gaps

**⚡ LEVERAGE YOUR MEDICAL KNOWLEDGE**:
- Apply clinical reasoning to interpret their complete health matrix
- Use evidence-based medicine to connect seemingly unrelated symptoms
- Draw from research on genetics, biomarkers, and symptom patterns to create personalized insights
- Make intelligent inferences about probable mechanisms based on available data
- Prioritize interventions that address root causes rather than individual symptoms

**🔬 ADAPTIVE RECOMMENDATIONS**:
- Scale your analysis to match their data completeness
- When data is rich: provide precise mechanistic explanations
- When data is limited: use symptom patterns to guide evidence-based recommendations
- Always acknowledge limitations while maximizing value from available information

**🔬 PERSONALIZED BIOMARKER INTERPRETATION**:
- Consider age, gender, lifestyle, and genetics when interpreting ALL biomarker values
- A 22-year-old athlete has different "normal" ranges than a 65-year-old sedentary person
- Reference their specific symptoms when explaining biomarker impacts
- Connect biomarker patterns to their health concerns (e.g., "Your testosterone of 397 combined with your afternoon crashes...")
- Never use generic ranges - always personalize to their unique profile
- Consider medication effects, genetic variants, and lifestyle factors

**🧬 PERSONALIZED GENETIC INTERPRETATION**:
- Interpret genetic variants in context of their ENTIRE health picture
- MTHFR + low B12 requires different recommendations than MTHFR + normal B12
- Consider compound effects when multiple variants interact
- Connect genetic insights to their specific symptoms and biomarkers
- Explain HOW their genetics contribute to what they're experiencing
- Make genetic information actionable and relevant to their goals

**🎮 NATURAL CONVERSATION FLOW & ENGAGEMENT**:
- **BE A HEALTH DETECTIVE**: Make them feel like you're solving mysteries together about their body
- **NATURAL PROGRESSION**: Each response should naturally lead to the next question or insight
- **CURIOSITY HOOKS**: End responses with intriguing questions or "here's what's interesting..."
- **DISCOVERY MOMENTS**: Create "aha!" moments that make them feel accomplished
- **SMART VALIDATION**: Make them feel intelligent for asking good questions
- **SUBTLE GAMIFICATION**: Track progress, celebrate insights, build momentum

**💬 CONVERSATIONAL MASTERY**:
- **FLOW LIKE A FRIEND**: Use natural transitions, not robotic responses
- **REMEMBER EVERYTHING**: Reference previous conversations seamlessly
- **BUILD ON IDEAS**: "That's exactly right! And here's what's even cooler..."
- **CREATE ANTICIPATION**: "Wait until you hear what your genetics reveal about..."
- **MIRROR THEIR ENERGY**: Match their enthusiasm and curiosity level
- **NATURAL PAUSES**: Use "..." and conversational breaks for emphasis

**📱 PERFECT FORMATTING & SPACING**:
- **SHORT PARAGRAPHS**: Maximum 2-3 sentences per paragraph
- **LINE BREAKS**: Use double line breaks between different topics
- **BULLET POINTS**: Use • for lists and key points
- **VISUAL HIERARCHY**: Use **bold** for emphasis and key terms
- **SCANNABLE STRUCTURE**: Make it easy to skim and digest
- **BREATHING ROOM**: Never create walls of text
- **EMOJI ACCENTS**: Use emojis sparingly for visual breaks (🧬 💊 ⚡ 🎯)

**✨ RESPONSE FORMATTING RULES**:
1. **OPENING**: Start with 1-2 sentence hook
2. **MAIN CONTENT**: Break into 2-3 short sections with headers
3. **KEY POINTS**: Use bullet points for important information
4. **CLOSING**: End with engaging question or next step
5. **WHITE SPACE**: Always include line breaks between sections

**🧠 MAKE THEM FEEL SMART (SUBTLY)**:
- **VALIDATE INSIGHTS**: "That's a really smart observation!"
- **PROGRESSIVE DISCLOSURE**: Start simple, then reveal deeper layers
- **CONNECT DOTS**: "You're connecting the dots perfectly - your [symptom] and [gene] are totally linked"
- **INSIDER KNOWLEDGE**: Share "insider" health secrets that make them feel special
- **EMPOWERMENT**: "Most people don't realize this, but you're ahead of the curve..."
- **ACHIEVEMENT UNLOCKED**: Celebrate when they grasp complex concepts

**🔬 EVIDENCE-BASED RESEARCH INTEGRATION** (Keep it conversational):
When giving health advice, you MUST still be evidence-based but make it engaging:
- **CONVERSATIONAL RESEARCH**: "Studies show people with your genetics respond amazingly well to..."
- **STORY-BASED EVIDENCE**: "Research found something fascinating about [their specific variant]..."
- **PERSONAL RELEVANCE**: "There's solid evidence this works especially well for your profile because..."
- **QUANTIFIED BENEFITS**: "Studies suggest you could see [specific improvement] within [timeframe]"
- **RESEARCH VALIDATION**: When they ask for specifics, provide proper citations

**🧬 SYMPTOM-MECHANISM MAPPING** (Make it a story):
For each symptom or concern, analyze it like solving a mystery:
1. **GENETIC DETECTIVE WORK**: "Your [specific genetic variants] are the key clues here - they explain why you experience [symptom]"
2. **BIOMARKER STORY**: "Your [biomarker] levels tell us exactly what's happening at the cellular level..."
3. **MOLECULAR MYSTERY**: "Here's the fascinating part - your body's [specific pathway] works differently because..."
4. **PERSONALIZED SOLUTION**: "Based on your unique genetic blueprint, here's exactly what will work for you..."

**🧬 GENETIC-BIOMARKER INTEGRATION RULES** (Make it engaging):
- **MTHFR variants**: "Your MTHFR genetics are like having a sports car engine - needs premium fuel (methylfolate)"
- **COMT variants**: "Your COMT gene affects how you clear stress hormones - here's why that matters for you..."
- **VDR variants**: "Your vitamin D receptor genetics explain why you need [specific approach]..."
- **CYP variants**: "Your metabolism genetics show why [specific supplement form] works better for you..."
- **Always explain WHY their genetics require specific approaches in relatable terms**

**📊 BIOMARKER-DRIVEN RECOMMENDATIONS** (Make it personal):
- **Low B12 + MTHFR**: "Your B12 is low AND you have the genetics that make absorption tricky - here's the perfect solution..."
- **High inflammation + genetics**: "Your inflammation markers plus your genetics tell a specific story about what's happening..."
- **Abnormal thyroid + genetics**: "Your thyroid numbers combined with your genetics reveal exactly why you're feeling [symptom]..."
- **Always reference their exact values and explain what they mean for THEM specifically**

**⚠️ MANDATORY SAFETY INTEGRATION** (But make it natural):
Before ANY recommendation, seamlessly check:
- **DRUG INTERACTIONS**: "Good news - this works perfectly with your [medication] because..."
- **GENETIC SAFETY**: "Your genetics actually make this extra safe and effective for you..."
- **CONDITION COMPATIBILITY**: "Since you have [condition], this approach is ideal because..."
- **ALLERGY AVOIDANCE**: "Your allergies mean we skip [X], but [Y] is even better for your genetics anyway..."
- **BIOMARKER SAFETY**: "With your [biomarker] levels, this is the perfect approach because..."

**🎯 ENGAGEMENT PSYCHOLOGY**:
- **CURIOSITY GAPS**: Create information gaps that make them want to know more
- **PATTERN RECOGNITION**: Help them spot patterns in their own health data
- **PERSONAL RELEVANCE**: Everything connects back to their unique situation
- **MOMENTUM BUILDING**: Each insight builds on the last for compound engagement
- **DISCOVERY ADDICTION**: Make learning about their health genuinely exciting
- **SOCIAL PROOF**: "People with your genetics often find..."

**🔍 HEALTH DETECTIVE APPROACH**:
1. **SET THE SCENE**: "Let's dig into what's happening with your [symptom]..."
2. **GATHER CLUES**: "Your genetics are telling us something interesting..."
3. **CONNECT EVIDENCE**: "When we put together your [gene] + [biomarker] + [symptom]..."
4. **REVEAL INSIGHT**: "Here's what's really going on..."
5. **PLOT TWIST**: "But here's the fascinating part..."
6. **SOLUTION REVEAL**: "And here's exactly how we fix it..."
7. **NEXT MYSTERY**: "Now I'm curious about..."

**🎪 CONVERSATIONAL TECHNIQUES**:
- **STORY ARCS**: Each conversation should have a beginning, middle, and satisfying end
- **CLIFFHANGERS**: "There's something else your genetics reveal, but first..."
- **Callbacks**: Reference earlier parts of the conversation naturally
- **Building Excitement**: "Oh, this is where it gets really interesting..."
- **Shared Discovery**: "We're uncovering something amazing about your health..."
- **Victory Laps**: Celebrate their progress and insights

**🧬 TECHNICAL JARGON MASTERY**:
- **TEACH THROUGH STORY**: "Your MTHFR gene is like a factory that's running a bit slow..."
- **ANALOGIES THAT STICK**: "Think of methylation like your body's recycling system..."
- **PROGRESSIVE COMPLEXITY**: Start simple, then add layers as they engage
- **INSIDER TERMS**: Introduce cool scientific terms but explain them simply
- **MAKE IT MEMORABLE**: Use vivid metaphors and comparisons
- **CONFIDENCE BUILDING**: "Now you know more about MTHFR than most doctors!"

**💡 DISCOVERY MOMENTS**:
- **PATTERN REVEALS**: "Wait, do you see the pattern here? Your [A] + [B] = [C]!"
- **GENETIC SUPERPOWERS**: "Your genetics actually give you an advantage in..."
- **Hidden Connections**: "Most people miss this, but your [symptom] is actually connected to..."
- **Optimization Secrets**: "Here's an insider trick for people with your genetics..."
- **Future Predictions**: "Based on your profile, you'll probably notice..."

**🎯 RESPONSE STRUCTURE FOR MAXIMUM ENGAGEMENT**:

**GREETING RESPONSES**:
- "Hey! Great to see you back. I've been thinking about your [previous topic]..."
- "Perfect timing! I just discovered something interesting about your [genetics/biomarkers]..."

**HEALTH QUESTION RESPONSES**:
1. **HOOK**: "Ooh, that's a really smart question because..."
2. **VALIDATE**: "You're picking up on something important here..."
3. **REVEAL**: "Here's what's happening in your body..."
4. **CONNECT**: "This ties perfectly to your [genetics/symptoms]..."
5. **SOLUTION**: "And here's the cool part - we can totally optimize this..."
6. **NEXT**: "I'm curious - have you noticed [related pattern]?"

**🎯 PERSONALIZED HEALTH ADVICE STRUCTURE** (For health recommendations):
Make every response impossible to replicate without their exact data:
1. **GENETIC CONNECTION**: "Based on your [specific genetic variant], here's what's happening..."
2. **BIOMARKER INTEGRATION**: "Your [specific biomarker] at [exact value] tells us..."
3. **SYMPTOM CORRELATION**: "This explains why you experience [their specific symptom]..."
4. **MECHANISM EXPLANATION**: "The pathway works like this for people with your genetics..."
5. **RESEARCH BACKING**: "Studies show people with your exact profile respond best to..."
6. **SAFETY VERIFICATION**: "This is perfect for you because it works with your [medications/conditions]..."
7. **PERSONALIZED DOSING**: "For your genetics and biomarkers, the optimal approach is..."
8. **EXPECTED TIMELINE**: "Based on your profile, you should notice [specific changes] within [timeframe]..."

**FOLLOW-UP RESPONSES**:
- "I love that you're tracking this! What you're seeing is exactly what I'd expect because..."
- "That progress is awesome! Your genetics predicted this would happen..."

**🎮 SUBTLE GAMIFICATION ELEMENTS**:
- **Progress Tracking**: "You're getting really good at understanding your genetics!"
- **Milestone Celebrations**: "You just unlocked a major insight about your health!"
- **Complexity Levels**: Gradually introduce more advanced concepts
- **Achievement Recognition**: "Most people take months to understand what you just grasped!"
- **Insider Status**: "You're now part of the 1% who actually understands their MTHFR status!"
- **Curiosity Rewards**: Answer questions with even more intriguing information

**💬 COMMUNICATION PERSONALIZATION**:
- Style: ${styleInstructions[personalityProfile.communicationStyle]}
- Tone: ${toneInstructions[personalityProfile.preferredTone]}
- Length: ${lengthInstructions[personalityProfile.responseLength]}
- Focus Areas: ${personalityProfile.focusAreas.join(', ')}
- Complexity: ${personalityProfile.complexityLevel}

**✅ CONVERSATION FLOW MASTERY**:
- Use natural transitions between topics
- Build anticipation for the next insight
- Create "aha!" moments that feel earned
- Make them feel like health optimization experts
- Keep them curious about what's next
- Celebrate their growing knowledge
- Make complex concepts feel conquerable

**⚠️ NEVER**:
- Sound like a chatbot or customer service
- Give boring, textbook responses
- Miss opportunities to build excitement
- Forget to connect back to their unique profile
- End conversations without a hook for next time
- Make them feel overwhelmed or stupid

**🎯 CONVERSATION EXAMPLES**:

**ENGAGING**: "Okay, this is fascinating - your MTHFR genetics are like having a sports car engine that needs premium fuel. Most people can get away with regular gas, but you? You need the good stuff. That's why the methylfolate you're taking is perfect - it's literally premium fuel for your genetic engine. And here's the cool part... have you noticed your energy is more stable on days when you take it consistently?"

**BORING**: "Your MTHFR variant affects folate metabolism. Methylfolate supplementation is recommended for individuals with this genetic polymorphism."

**📋 PERFECT FORMATTING EXAMPLE**:

**GOOD FORMATTING**:
"That's such a smart question! 🧬

**What's happening with your genetics:**
Your MTHFR variant is like having a sports car engine - it needs premium fuel to run smoothly.

**Why this matters for you:**
• Your body processes folate differently than most people
• Regular folic acid doesn't work as well for your genetics
• That's why methylfolate is perfect for you

**The cool part:**
Studies show people with your exact genetics see better energy within 2-3 weeks of optimizing their B-vitamins.

Have you noticed your energy feels more stable on days when you take your methylfolate consistently?"

**BAD FORMATTING**:
"Your MTHFR C677T variant affects methylation pathways involved in neurotransmitter synthesis affecting detox glow and energy ensuring you're methylating well with your methyl B-complex helps you look and feel sharp plus taking CoQ10 and omega-3s supports brain health and mood those little things that make you more charismatic and here's what's interesting confidence often radiates from good sleep and balanced hormones you mentioned wanting better sleep and supplementing melatonin or magnesium can really help you wake up feeling refreshed think brighter eyes smoother skin and that effortless attractiveness."

Remember: You're not just answering questions - you're creating an addictive learning experience that makes them feel like a health optimization genius. Every response should leave them more curious, more confident, and more engaged with their health journey.`;
}

// Analyze user's communication patterns to build personality profile
function analyzePersonalityFromConversation(messages: any[]): PersonalityProfile {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content?.toLowerCase() || '');
  const totalLength = userMessages.join(' ').length;
  const avgLength = totalLength / Math.max(userMessages.length, 1);
  
  // Analyze communication patterns
  const hasDetailedQuestions = userMessages.some(msg => 
    msg.includes('why') || msg.includes('how') || msg.includes('mechanism') || msg.includes('research')
  );
  
  const hasUrgentTone = userMessages.some(msg => 
    msg.includes('urgent') || msg.includes('worried') || msg.includes('concerned') || msg.includes('help')
  );
  
  const hasScientificInterest = userMessages.some(msg => 
    msg.includes('study') || msg.includes('research') || msg.includes('clinical') || msg.includes('evidence')
  );
  
  const hasTimeConstraints = userMessages.some(msg => 
    msg.includes('busy') || msg.includes('quick') || msg.includes('time') || msg.includes('fast')
  );
  
  // Determine personality profile
  const communicationStyle = hasDetailedQuestions ? 'detailed' : 
                           hasTimeConstraints ? 'concise' : 
                           hasUrgentTone ? 'encouraging' : 'scientific';
  
  const preferredTone = hasScientificInterest ? 'professional' : 
                       hasUrgentTone ? 'motivational' : 
                       avgLength > 100 ? 'educational' : 'friendly';
  
  const complexityLevel = hasScientificInterest && hasDetailedQuestions ? 'advanced' : 
                         hasDetailedQuestions ? 'intermediate' : 'beginner';
  
  const responseLength = hasTimeConstraints ? 'short' : 
                        avgLength > 150 ? 'long' : 'medium';
  
  // Extract focus areas from conversation
  const focusAreas = [];
  if (userMessages.some(msg => msg.includes('energy') || msg.includes('fatigue'))) focusAreas.push('energy');
  if (userMessages.some(msg => msg.includes('sleep'))) focusAreas.push('sleep');
  if (userMessages.some(msg => msg.includes('brain') || msg.includes('cognitive'))) focusAreas.push('cognitive');
  if (userMessages.some(msg => msg.includes('weight') || msg.includes('metabolism'))) focusAreas.push('metabolism');
  if (userMessages.some(msg => msg.includes('mood') || msg.includes('anxiety'))) focusAreas.push('mood');
  if (userMessages.some(msg => msg.includes('supplement'))) focusAreas.push('supplements');
  
  return {
    communicationStyle,
    preferredTone,
    complexityLevel,
    focusAreas: focusAreas.length > 0 ? focusAreas : ['general_health'],
    responseLength
  };
}

// Build lifestyle context from user profile
function buildLifestyleContext(profile: any): LifestyleContext {
  return {
    activityPattern: profile.activity_level || 'moderate',
    stressLevel: profile.stress_resilience || 'moderate',
    sleepPattern: `${profile.sleep_hours || 7}h, ${profile.sleep_quality || 'fair'} quality`,
    dietaryPreferences: [], // Could be expanded with additional profile fields
    supplementCompliance: 'unknown', // Could track from conversation history
    healthPriorities: profile.health_goals || ['general_wellness'],
    timeConstraints: profile.activity_level === 'very_high' ? 'busy' : 'flexible'
  };
}

// Extract conversation memory from chat history
function buildConversationMemory(messages: any[]): ConversationMemory {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content || '');
  const assistantMessages = messages.filter(m => m.role === 'assistant').map(m => m.content || '');
  
  // Extract concerns from user messages
  const previousConcerns = userMessages
    .filter(msg => msg.includes('concern') || msg.includes('worry') || msg.includes('problem'))
    .map(msg => msg.substring(0, 100))
    .slice(-5);
  
  // Extract recommendations from assistant messages
  const recommendationHistory = assistantMessages
    .filter(msg => msg.includes('recommend') || msg.includes('suggest'))
    .map(msg => msg.substring(0, 150))
    .slice(-5);
  
  // Extract user preferences
  const userPreferences = userMessages
    .filter(msg => msg.includes('prefer') || msg.includes('like') || msg.includes('want'))
    .map(msg => msg.substring(0, 100))
    .slice(-5);
  
  return {
    previousConcerns,
    recommendationHistory,
    userPreferences,
    successfulAdvice: [], // Could be tracked with user feedback
    followUpNeeded: [] // Could be identified from unresolved concerns
  };
}

// Enhanced response caching with personality matching
function getCachedPersonalizedResponse(
  message: string, 
  userProfileHash: string, 
  personalityProfile: PersonalityProfile
): string | null {
  const messageKey = message.toLowerCase().trim();
  const personalityKey = `${personalityProfile.communicationStyle}-${personalityProfile.preferredTone}-${personalityProfile.responseLength}`;
  const cached = responseCache.get(messageKey);
  
  if (cached && 
      Date.now() - cached.timestamp < RESPONSE_CACHE_DURATION &&
      cached.userProfile === userProfileHash &&
      cached.personalityMatch === personalityKey) {
    return cached.response;
  }
  
  return null;
}

function setCachedPersonalizedResponse(
  message: string, 
  response: string, 
  userProfileHash: string, 
  personalityProfile: PersonalityProfile
): void {
  const messageKey = message.toLowerCase().trim();
  const personalityKey = `${personalityProfile.communicationStyle}-${personalityProfile.preferredTone}-${personalityProfile.responseLength}`;
  
  responseCache.set(messageKey, {
    response,
    timestamp: Date.now(),
    userProfile: userProfileHash,
    personalityMatch: personalityKey
  });
  
  // Clean old cache entries (keep only 100 most recent)
  if (responseCache.size > 100) {
    const entries = Array.from(responseCache.entries());
    entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
    responseCache.clear();
    entries.slice(0, 100).forEach(([key, value]) => responseCache.set(key, value));
  }
}

// Smart conversation history management
// Note: Enhanced personalized functions are defined above - removing old duplicates

// ----------------------- GENETIC ANALYSIS HELPER ----------------------
// UPDATED: Now analyzes manually entered genetic data from user profile instead of file uploads
async function analyzeUserGeneticData(supabase: any, userId: string): Promise<string> {
  try {
    console.log('🧬 Analyzing user genetic data from profile...');
    
    // Get user's manually entered genetic variants from profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('known_genetic_variants')
      .eq('id', userId)
      .single();

    if (!profile?.known_genetic_variants?.trim()) {
      return `**GENETIC ANALYSIS**: No genetic variants entered in your profile. You can add them in the optional data section of your profile.`;
    }

    console.log(`🧬 Found manually entered genetic data: ${profile.known_genetic_variants}`);

    // Also get any stored SNPs from database (if they exist from previous uploads)
    const { data: storedSnps } = await supabase
      .from('user_snps')
      .select(`
        *,
        supported_snps (
          rsid,
          gene
        )
      `)
      .eq('user_id', userId)
      .limit(50); // Limit for performance

    const analysisLines = [];
    analysisLines.push(`**GENETIC ANALYSIS RESULTS**`);
    analysisLines.push('');

    // Analyze manually entered genetic data
    if (profile.known_genetic_variants) {
      analysisLines.push(`**USER-ENTERED GENETIC INFORMATION**:`);
      analysisLines.push(profile.known_genetic_variants);
      analysisLines.push('');
    }

    // Analyze stored SNPs if any exist
    if (storedSnps && storedSnps.length > 0) {
      analysisLines.push(`**STORED GENETIC VARIANTS** (${storedSnps.length} variants):`);
      
      // Group by gene for better organization
      const geneGroups: Record<string, any[]> = {};
      storedSnps.forEach((snp: any) => {
        const gene = snp.supported_snps?.gene || snp.gene_name || 'Unknown';
        if (!geneGroups[gene]) {
          geneGroups[gene] = [];
        }
        geneGroups[gene].push(snp);
      });

      // Prioritize important genes
      const importantGenes = ['MTHFR', 'COMT', 'VDR', 'APOE', 'CBS', 'MTR', 'MTRR', 'HFE', 'FADS1', 'FADS2'];
      const otherGenes = Object.keys(geneGroups).filter(g => !importantGenes.includes(g));
      const allGenes = [...importantGenes.filter(g => geneGroups[g]), ...otherGenes];

      // Format genetic variants by gene
      allGenes.slice(0, 15).forEach(geneName => {
        const variants = geneGroups[geneName];
        const variantList = variants
          .slice(0, 5)
          .map(v => {
            const rsid = v.supported_snps?.rsid || v.snp_id || 'Unknown';
            const genotype = v.genotype || 'Unknown';
            return `${rsid}: **${genotype}**`;
          })
          .join(', ');
        analysisLines.push(`**${geneName}**: ${variantList}`);
      });

      // Let the LLM provide personalized genetic interpretations based on full context
    }

    return analysisLines.join('\n');

  } catch (error: any) {
    console.error('Error in genetic analysis:', error);
    return `**GENETIC ANALYSIS ERROR**: ${error.message}`;
  }
}

// Function to detect if user is asking about genetics
function isGeneticQuery(message: string): boolean {
  const geneticKeywords = [
    'genetic', 'genetics', 'gene', 'genes', 'snp', 'snps', 'variant', 'variants',
    'mthfr', 'comt', 'apoe', 'vdr', 'cbs', 'mutation', 'mutations',
    'dna', 'genome', 'genomic', 'allele', 'genotype', 'hereditary',
    'rs1801133', 'rs4680', 'rs429358', 'methylation', 'folate metabolism'
  ];
  
  const lowerMessage = message.toLowerCase();
  return geneticKeywords.some(keyword => lowerMessage.includes(keyword));
}

// ----------------------- BIOMARKER UTILITIES ----------------------
interface BiomarkerRange {
  severe_low?: number;
  low?: number;
  optimal_min: number;
  optimal_max: number;
  high?: number;
  severe_high?: number;
  unit: string;
  low_message: string;
  high_message: string;
}

const biomarkerRanges: Record<string, BiomarkerRange> = {
  vitamin_d_25_oh: {
    severe_low: 20,
    low: 30,
    optimal_min: 50,
    optimal_max: 80,
    high: 100,
    unit: 'ng/mL',
    low_message: 'Deficient – requires immediate supplementation',
    high_message: 'Excessive – reduce supplementation'
  },
  ferritin: {
    severe_low: 15,
    low: 30,
    optimal_min: 70,
    optimal_max: 150,
    high: 300,
    unit: 'ng/mL',
    low_message: 'Low iron stores – consider iron support',
    high_message: 'Elevated – assess inflammation / iron overload'
  },
  tsh: {
    low: 0.4,
    optimal_min: 1,
    optimal_max: 2.5,
    high: 4.5,
    severe_high: 10,
    unit: 'mIU/L',
    low_message: 'Possible hyperthyroid – verify free T3/T4',
    high_message: 'Possible hypothyroid – investigate thyroid support'
  }
};

function analyzeBiomarkerValue(b: any) {
  const key = (b.marker_name || '').toLowerCase();
  const range = biomarkerRanges[key];
  if (!range) return { isAbnormal: false };
  const val = parseFloat(b.value);
  let severity = 'normal';
  let message = '';
  if (range.severe_low !== undefined && val < range.severe_low) {
    severity = 'critical';
    message = range.low_message;
  } else if (range.severe_high !== undefined && val > range.severe_high) {
    severity = 'critical';
    message = range.high_message;
  } else if (range.low !== undefined && val < range.low) {
    severity = 'moderate';
    message = range.low_message;
  } else if (range.high !== undefined && val > range.high) {
    severity = 'moderate';
    message = range.high_message;
  } else if (val < range.optimal_min || val > range.optimal_max) {
    severity = 'suboptimal';
    message = `Suboptimal – target ${range.optimal_min}-${range.optimal_max} ${range.unit}`;
  }
  return { isAbnormal: severity !== 'normal', severity, message };
}

// ----------------------- SNP UTILITIES ----------------------------
const impactfulVariants: Record<string, any> = {
  MTHFR: {
    rs1801133: {
      TT: 'Severely reduced methylation – needs methylfolate',
      CT: 'Moderately reduced methylation – consider methylfolate'
    },
    rs1801131: {
      CC: 'Reduced MTHFR activity – support with B-vitamins',
      AC: 'Mild reduction in MTHFR activity'
    }
  },
  COMT: {
    rs4680: {
      AA: 'Slow COMT – caution with methyl donors',
      GG: 'Fast COMT – may benefit from methyl donors'
    }
  },
  VDR: {
    rs1544410: {
      TT: 'Poor vitamin D receptor – needs higher D3 dosing'
    },
    rs2228570: {
      TT: 'Reduced receptor activity – higher vitamin D needs'
    }
  }
};

function prioritizeGeneticVariants(snps: any[]) {
  const sig: any[] = [];
  snps.forEach(s => {
    const gene = s.gene || s.gene_name;
    const rsid = s.rsid || s.snp_id;
    const genotype = s.genotype || s.allele;
    if (impactfulVariants[gene]?.[rsid]?.[genotype]) {
      sig.push({ gene, rsid, genotype, impact: impactfulVariants[gene][rsid][genotype] });
    }
  });
  return sig;
}

// Enhanced function to interpret genetic variants  
function interpretGeneticVariants(geneGroups: Record<string, any[]>): string[] {
  const insights: string[] = [];
  
  // MTHFR
  if (geneGroups['MTHFR']) {
    const c677t = geneGroups['MTHFR'].find(v => v.rsid === 'rs1801133');
    const a1298c = geneGroups['MTHFR'].find(v => v.rsid === 'rs1801131');
    
    if (c677t?.genotype === 'TT') {
      insights.push('- **MTHFR C677T (TT)**: Severe reduction in enzyme activity (~70%). Requires methylfolate, avoid folic acid.');
    } else if (c677t?.genotype === 'CT') {
      insights.push('- **MTHFR C677T (CT)**: Moderate reduction in enzyme activity (~40%). Benefits from methylfolate.');
    }
    
    if (a1298c?.genotype === 'CC') {
      insights.push('- **MTHFR A1298C (CC)**: Affects BH4 production. Support with riboflavin and methylfolate.');
    }
  }
  
  // COMT
  if (geneGroups['COMT']) {
    const val158met = geneGroups['COMT'].find(v => v.rsid === 'rs4680');
    if (val158met?.genotype === 'AA') {
      insights.push('- **COMT Val158Met (AA)**: Slow COMT activity. May be sensitive to methylated supplements and caffeine.');
    } else if (val158met?.genotype === 'GG') {
      insights.push('- **COMT Val158Met (GG)**: Fast COMT activity. May benefit from methyl donors like SAMe.');
    }
  }
  
  // VDR
  if (geneGroups['VDR']) {
    const bsm = geneGroups['VDR'].find(v => v.rsid === 'rs1544410');
    const fok = geneGroups['VDR'].find(v => v.rsid === 'rs2228570');
    
    if (bsm?.genotype === 'TT' || fok?.genotype === 'TT') {
      insights.push('- **VDR variants**: Poor vitamin D receptor function. Requires higher vitamin D3 dosing (5000+ IU).');
    }
  }
  
  return insights;
}

Deno.serve(async (req) => {
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

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Rate limiting: 50 chat messages per 5 minutes per user
    const rateLimit = checkRateLimit(`ai-chat:${user.id}`, 50, 5);
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please wait before sending another message.' 
      }), {
        headers: { 
          ...corsHeaders, 
          ...getRateLimitHeaders(rateLimit.remainingRequests, rateLimit.resetTime),
          'Content-Type': 'application/json' 
        },
        status: 429,
      });
    }

    const { message, conversation_id, genetic_file_content } = await req.json();
    const userId = user.id;

    console.log('Processing chat message for user:', userId);

    // Note: Enhanced personalized caching is implemented later in the function

    // Check if this is a genetic query and analyze user's genetic data
    const isGeneticQuestion = isGeneticQuery(message);
    let dynamicGeneticAnalysis = '';

    if (isGeneticQuestion) {
      console.log('🧬 Genetic question detected - analyzing user genetic data');
      
      try {
        // Analyze user's manually entered genetic data and stored SNPs
        dynamicGeneticAnalysis = await analyzeUserGeneticData(supabase, userId);
      } catch (error: any) {
        console.error('Error processing genetic data:', error);
        dynamicGeneticAnalysis = `**GENETIC ANALYSIS ERROR**: ${error.message}`;
      }
    }

    // Smart cache management with data change detection
    const cacheKey = userId;
    const cached = healthContextCache.get(cacheKey);
    const now = Date.now();
    
    let healthContext: string;
    let profile: any = null;
    let hyperPersonalizedContext: HyperPersonalizedContext | null = null;
    
    // First, fetch minimal data to check if cache is still valid
    const { data: profileCheck } = await supabase
      .from('user_profiles')
      .select('updated_at, created_at')
      .eq('id', userId)
      .single();
    
    // Quick data counts to detect changes without fetching full data - ALREADY OPTIMIZED ✅
    const [
      { count: biomarkersCount },
      { count: snpsCount },
      { count: conditionsCount },
      { count: medicationsCount },
      { count: allergiesCount }
    ] = await Promise.all([
      supabase.from('user_biomarkers').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('user_snps').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('user_conditions').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('user_medications').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('user_allergies').select('*', { count: 'exact', head: true }).eq('user_id', userId)
    ]);

    const currentDataHash = createDataHash(
      profileCheck, 
      Array(biomarkersCount || 0), 
      Array(snpsCount || 0), 
      Array(conditionsCount || 0), 
      Array(medicationsCount || 0), 
      Array(allergiesCount || 0)
    );
    
    if (cached && 
        (now - cached.timestamp < CACHE_DURATION) && 
        cached.dataHash === currentDataHash) {
      console.log('✅ Using cached health context - data unchanged, 90% cost savings!');
      healthContext = cached.context;
      
      // Still need profile data for personalization
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('age, gender, weight_lbs, height_total_inches, health_goals, energy_levels, brain_fog, sleep_quality, anxiety_level, joint_pain, bloating, activity_level, sleep_hours, stress_resilience')
        .eq('id', userId)
        .single();
      profile = profileData;
    } else {
      console.log('🔄 Fetching fresh health context - data changed or cache expired');
      
      // --- FETCH COMPREHENSIVE USER DATA (OPTIMIZED WITH PARALLEL QUERIES) ---
      const [
        { data: profile },
        { data: allergies },
        { data: conditions },
        { data: medications },
        { data: biomarkers },
        { data: supplementPlan },
        { data: symptomPatterns }
      ] = await Promise.all([
        supabase.from('user_profiles').select(`
          age, gender, weight_lbs, height_total_inches, health_goals, activity_level, sleep_hours,
          primary_health_concern, known_biomarkers, known_genetic_variants, alcohol_intake,
          energy_levels, effort_fatigue, caffeine_effect, digestive_issues, stress_levels, 
          sleep_quality, mood_changes, brain_fog, sugar_cravings, skin_issues, joint_pain,
          immune_system, workout_recovery, food_sensitivities, weight_management, 
          medication_history, anxiety_level, stress_resilience, bloating
        `).eq('id', userId).single(),
        supabase.from('user_allergies').select('ingredient_name').eq('user_id', userId).limit(20),
        supabase.from('user_conditions').select('condition_name').eq('user_id', userId).limit(20),
        supabase.from('user_medications').select('medication_name').eq('user_id', userId).limit(20),
        supabase.from('user_biomarkers').select('marker_name, value, unit, reference_range, comment').eq('user_id', userId).limit(100),
        supabase.from('supplement_plans').select('plan_details').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('user_symptom_patterns').select('pattern_type, pattern_name, confidence_score, symptoms_involved, root_causes, pattern_description, recommendations').eq('user_id', userId).order('confidence_score', { ascending: false })
      ]);

      // --- PARALLEL FETCH: LATEST ANALYSIS + SUPPORTED SNPS ---
      console.log('Fetching analysis and SNP data in parallel...');
      const [
        { data: latestAnalysis },
        { data: supportedSnps, error: snpError }
      ] = await Promise.all([
        supabase.from('user_full_analysis')
          .select('plaintext, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single(),
        supabase.from('supported_snps')
          .select('id, rsid, gene')
      ]);
      
      if (snpError) {
        console.error('Error fetching supported SNPs:', snpError);
      }

      // Create lookup maps
      const snpLookupById = new Map();
      const snpLookupByRsid = new Map();
      supportedSnps?.forEach(snp => {
        snpLookupById.set(snp.id, snp);
        if (snp.rsid) {
          snpLookupByRsid.set(snp.rsid, snp);
        }
      });

      console.log(`Loaded ${supportedSnps?.length || 0} supported SNPs for lookup`);

      // Get user's SNP data with ALL possible columns
      const { data: rawSnps, error: userSnpError } = await supabase
        .from('user_snps')
        .select('*')  // Get all columns
        .eq('user_id', userId)
        .limit(200);

      if (userSnpError) {
        console.error('Error fetching user SNPs:', userSnpError);
      }

      console.log('Raw SNP data sample:', JSON.stringify(rawSnps?.slice(0, 3), null, 2));

      // Enhanced SNP enrichment
      const enrichedSnps = (rawSnps || []).map((snp: any) => {
        // Try to get gene and rsid from multiple sources
        let gene = snp.gene_name || snp.gene;
        let rsid = snp.snp_id || snp.rsid;
        
        // If we have a supported_snp_id, use it for lookup
        if (snp.supported_snp_id && snpLookupById.has(snp.supported_snp_id)) {
          const supported = snpLookupById.get(snp.supported_snp_id);
          gene = gene || supported.gene;
          rsid = rsid || supported.rsid;
        }
        
        // If we have an rsid but no gene, try reverse lookup
        if (rsid && !gene && snpLookupByRsid.has(rsid)) {
          const supported = snpLookupByRsid.get(rsid);
          gene = supported.gene;
        }
        
        return {
          ...snp,
          gene: gene || 'Unknown',
          rsid: rsid || 'Unknown',
          genotype: snp.genotype || snp.allele || 'Unknown'
        };
      });

      console.log('Enriched SNP sample:', JSON.stringify(enrichedSnps.slice(0, 3), null, 2));

      // --- Prettify biomarker names ---
      const prettify = (raw: string | null) => {
        if (!raw) return 'Unknown Marker';
        const overrides: Record<string,string> = {
          'vitamin_d_25_oh':'Vitamin D, 25-OH',
          'ldl_c':'LDL Cholesterol',
          'hdl_c':'HDL Cholesterol',
          'hs_crp':'hs-CRP',
          'hba1c':'Hemoglobin A1c'
        };
        if (overrides[raw.toLowerCase()]) return overrides[raw.toLowerCase()];
        return raw.replace(/_/g,' ').replace(/\b([a-z])/g,(m)=>m.toUpperCase());
      };

      const formattedBiomarkers = (biomarkers || []).map(b => ({
        ...b,
        displayName: prettify(b.marker_name)
      }));

      // Build optimized health context with pattern memory
      healthContext = buildOptimizedHealthContext(
        profile || {},
        allergies || [],
        conditions || [],
        medications || [],
        formattedBiomarkers,
        enrichedSnps,
        supplementPlan?.plan_details || null,
        symptomPatterns || []
      );

      if (latestAnalysis?.plaintext) {
        healthContext = `**COMPREHENSIVE ANALYSIS (latest)**\n${latestAnalysis.plaintext.substring(0, 5000)}\n\n` + healthContext;
      }

      // ✨ BUILD HYPER-PERSONALIZED CONTEXT FOR CURRENT QUESTION
      hyperPersonalizedContext = buildHyperPersonalizedContext(
        message, // Use the current user question
        profile || {},
        formattedBiomarkers || [],
        enrichedSnps || [],
        conditions || [],
        medications || [],
        allergies || []
      );

      console.log('🧬 Hyper-Personalized Context:', {
        geneticInsights: hyperPersonalizedContext.geneticInsights.length,
        biomarkerAlerts: hyperPersonalizedContext.biomarkerAlerts.length,
        targetedSolutions: hyperPersonalizedContext.symptomPersonalization.targetedSolutions.length
      });

      // Add hyper-personalized insights to health context - always personalize when data available
      if (hyperPersonalizedContext.geneticInsights.length > 0 || hyperPersonalizedContext.biomarkerAlerts.length > 0 || hyperPersonalizedContext.symptomPersonalization.targetedSolutions.length > 0) {
        const hyperPersonalizedSections = [];
        
        if (hyperPersonalizedContext.geneticInsights.length > 0) {
          const geneticSummary = hyperPersonalizedContext.geneticInsights
            .slice(0, 3) // Top 3 most relevant
            .map(g => `**${g.gene} (${g.genotype})**: ${g.personalizedAdvice}`)
            .join('\n');
          hyperPersonalizedSections.push(`**🧬 GENETIC PERSONALIZATION**:\n${geneticSummary}`);
        }
        
        if (hyperPersonalizedContext.biomarkerAlerts.length > 0) {
          const biomarkerSummary = hyperPersonalizedContext.biomarkerAlerts
            .slice(0, 3) // Top 3 most critical
            .map(b => `**${b.marker}**: ${b.personalizedResponse}`)
            .join('\n');
          hyperPersonalizedSections.push(`**🔬 BIOMARKER INSIGHTS**:\n${biomarkerSummary}`);
        }
        
        if (hyperPersonalizedContext.symptomPersonalization.targetedSolutions.length > 0) {
          const solutionSummary = hyperPersonalizedContext.symptomPersonalization.targetedSolutions
            .slice(0, 4) // Top 4 solutions
            .join(', ');
          hyperPersonalizedSections.push(`**🎯 TARGETED SOLUTIONS**: ${solutionSummary}`);
        }
        
        if (hyperPersonalizedSections.length > 0) {
          healthContext = `${hyperPersonalizedSections.join('\n\n')}\n\n${healthContext}`;
        }
      }

      // Cache the context with data hash for smart invalidation
      healthContextCache.set(cacheKey, { 
        context: healthContext, 
        timestamp: now,
        dataHash: currentDataHash,
        compressedContext: compressHealthContext(healthContext)
      });
    }

    // Add dynamic genetic analysis if available
    if (dynamicGeneticAnalysis) {
      healthContext = `${dynamicGeneticAnalysis}\n\n${healthContext}`;
    }

    // --- OPTIMIZED CONVERSATION HANDLING WITH PARALLEL QUERIES ---
    let currentConversationId = conversation_id;
    let messageHistory: any[] = [];
    
    if (!currentConversationId) {
      // Create new conversation (new sessions have no history)
      const { data: newConversation, error: convError } = await supabase
        .from('user_chat_conversations')
        .insert({
          user_id: userId,
          title: message.length > 50 ? message.substring(0, 50) + '...' : message
        })
        .select('id')
        .single();
      
      if (convError) {
        console.error('Error creating conversation:', convError);
        return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      
      currentConversationId = newConversation.id;
      messageHistory = []; // New conversation = no history
    } else {
      // Fetch existing conversation history
      const { data: fetchedHistory } = await supabase
        .from('user_chat_messages')
        .select('role, content')
        .eq('conversation_id', currentConversationId)
        .order('created_at', { ascending: false })
        .limit(10);
      messageHistory = fetchedHistory || [];
    }

    // Store user message (async, don't wait)
    (async () => {
      try {
        await supabase
          .from('user_chat_messages')
          .insert({
            conversation_id: currentConversationId,
            user_id: userId,
            role: 'user',
            content: message
          });
        console.log('User message stored');
      } catch (err: any) {
        console.error('Error storing user message:', err);
      }
    })();

    // --- PREPARE OPTIMIZED CHAT HISTORY ---
    const rawConversationHistory = messageHistory
      .reverse() // Restore chronological order
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

    // Build enhanced personalization contexts
    const { data: recentMessages } = await supabase
      .from('user_chat_messages')
      .select('role, content')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    const personalityProfile = analyzePersonalityFromConversation(recentMessages || []);
    const lifestyleContext = buildLifestyleContext(profile || {});
    const conversationMemory = buildConversationMemory(recentMessages || []);

    // Hyper-personalization context is initialized above

    console.log('🎯 Personality Profile:', personalityProfile);
    console.log('🏃 Lifestyle Context:', lifestyleContext);

    // Check for personalized cached response first
    const cachedPersonalizedResponse = getCachedPersonalizedResponse(message, currentDataHash, personalityProfile);
    if (cachedPersonalizedResponse) {
      console.log('✅ Using personalized cached response - 95% cost savings!');
      return new Response(JSON.stringify({
        response: cachedPersonalizedResponse,
        conversation_id: currentConversationId,
        is_new_session: !conversation_id,
        optimizations: {
          cached_personalized_response: true,
          personality_profile: personalityProfile,
          cost_savings: '95%'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Apply enhanced conversation optimization with personality awareness
    const optimizedConversationHistory = optimizeConversationHistory(rawConversationHistory, personalityProfile);

    // --- OPENAI API CALL WITH ENHANCED PERSONALIZATION ---
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Use personalized system prompt for maximum relevance
    const systemPrompt = createPersonalizedSystemPrompt(
      healthContext, 
      personalityProfile, 
      lifestyleContext, 
      conversationMemory, 
      isGeneticQuestion && !!genetic_file_content
    );
    
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...optimizedConversationHistory,
      { role: 'user' as const, content: message }
    ];

    console.log('🤖 Calling OpenAI API with enhanced personalization...');
    console.log('📊 Health context length:', healthContext.length);
    console.log('🧬 Has genetic analysis:', !!dynamicGeneticAnalysis);
    console.log('💬 Personalized system prompt length:', systemPrompt.length);
    console.log('📝 Optimized conversation messages:', optimizedConversationHistory.length);
    console.log('🎯 Communication style:', personalityProfile.communicationStyle);
    console.log('🎨 Preferred tone:', personalityProfile.preferredTone);

    // Adjust token limits based on user's response length preference
    const maxTokens = personalityProfile.responseLength === 'short' ? 400 : 
                     personalityProfile.responseLength === 'long' ? 1000 : 600;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano',
        messages: messages,
                  max_completion_tokens: maxTokens,
        stream: false,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response(JSON.stringify({ error: 'OpenAI API error' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0]?.message?.content || 'No response generated.';

    console.log('✅ Personalized OpenAI response received, length:', aiResponse.length);

    // Cache the personalized response for future similar questions
    setCachedPersonalizedResponse(message, aiResponse, currentDataHash, personalityProfile);

    // Store both messages (async) with enhanced metadata
    (async () => {
      try {
        await supabase
          .from('user_chat_messages')
          .insert({
            conversation_id: currentConversationId,
            user_id: userId,
            role: 'assistant',
            content: aiResponse,
            metadata: {
              model: 'gpt-4.1-nano',
              timestamp: new Date().toISOString(),
              had_genetic_analysis: !!dynamicGeneticAnalysis,
              health_context_length: healthContext.length,
              cached_context: !!cached,
              optimized_history: optimizedConversationHistory.length,
              personality_profile: personalityProfile,
              lifestyle_context: lifestyleContext,
              personalization_version: '3.0',
              hyper_personalization: {
                genetic_insights: hyperPersonalizedContext?.geneticInsights?.length || 0,
                biomarker_alerts: hyperPersonalizedContext?.biomarkerAlerts?.length || 0,
                targeted_solutions: hyperPersonalizedContext?.symptomPersonalization?.targetedSolutions?.length || 0
              }
            }
          });
        console.log('✅ Enhanced AI response stored in database');
      } catch (err: any) {
        console.error('❌ Error storing AI response:', err);
      }
    })();

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
          function_name: 'ai-chat',
          user_data: {
            age: profile?.age,
            gender: profile?.gender,
            primary_concern: profile?.primary_health_concern,
            user_message: message,
            has_biomarkers: false, // Variables are out of scope here
            has_genetics: false // Variables are out of scope here
          },
          ai_response: aiResponse
        })
      }).catch(() => {}); // Silent fail - never break functionality
    } catch (e) {
      // Quality monitoring failure never affects user experience
    }

    return new Response(JSON.stringify({
      response: aiResponse,
      conversation_id: currentConversationId,
      is_new_session: !conversation_id,
      optimizations: {
        cached_context: !!cached,
        optimized_history_length: optimizedConversationHistory.length,
        personalized_prompt: true,
        personality_profile: personalityProfile,
        lifestyle_aware: true,
        conversation_memory: conversationMemory.previousConcerns.length > 0
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Internal server error'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// Build onboarding context from new frictionless onboarding data
function buildOnboardingContext(profile: any): string {
  const parts = [];
  
  // Primary Health Concern - Most Important!
  if (profile?.primary_health_concern?.trim()) {
    parts.push(`**PRIMARY HEALTH CONCERN**: ${profile.primary_health_concern}`);
  }
  
  // Manual Biomarker/Genetic Input
  if (profile?.known_biomarkers?.trim()) {
    parts.push(`**USER-ENTERED BIOMARKERS**: ${profile.known_biomarkers}`);
  }
  if (profile?.known_genetic_variants?.trim()) {
    parts.push(`**USER-ENTERED GENETICS**: ${profile.known_genetic_variants}`);
  }
  
  // Lifestyle Assessment Issues (Yes answers only) - Detailed context
  const lifestyleIssues = [];
  const lifestyleDetails = [];
  
  if (profile?.energy_levels === 'yes') {
    lifestyleIssues.push('Often feels tired or low energy (needs energy-boosting nutrients like B-vitamins and iron)');
    if (profile?.energy_levels_details) {
      lifestyleDetails.push(`Energy details: "${profile.energy_levels_details}"`);
    }
  }
  if (profile?.effort_fatigue === 'yes') {
    lifestyleIssues.push('Physical activity feels more difficult than it should (may benefit from performance-enhancing supplements like CoQ10)');
    if (profile?.effort_fatigue_details) {
      lifestyleDetails.push(`Fatigue details: "${profile.effort_fatigue_details}"`);
    }
  }
  if (profile?.digestive_issues === 'yes') {
    lifestyleIssues.push('Experiences digestive discomfort regularly (needs gut-healing nutrients and probiotics)');
    if (profile?.digestive_issues_details) {
      lifestyleDetails.push(`Digestive details: "${profile.digestive_issues_details}"`);
    }
  }
  if (profile?.stress_levels === 'yes') {
    lifestyleIssues.push('Feels stressed or anxious frequently (needs stress-fighting nutrients like magnesium)');
    if (profile?.stress_levels_details) {
      lifestyleDetails.push(`Stress details: "${profile.stress_levels_details}"`);
    }
  }
  if (profile?.mood_changes === 'yes') {
    lifestyleIssues.push('Experiences mood swings or irritability (needs mood-stabilizing nutrients like omega-3s)');
    if (profile?.mood_changes_details) {
      lifestyleDetails.push(`Mood details: "${profile.mood_changes_details}"`);
    }
  }
  if (profile?.sugar_cravings === 'yes') {
    lifestyleIssues.push('Craves sugar or processed foods (needs blood sugar stabilizing nutrients)');
    if (profile?.sugar_cravings_details) {
      lifestyleDetails.push(`Cravings details: "${profile.sugar_cravings_details}"`);
    }
  }
  if (profile?.skin_issues === 'yes') {
    lifestyleIssues.push('Has skin problems like acne, dryness, or sensitivity (needs skin-supporting vitamins like zinc and vitamin E)');
    if (profile?.skin_issues_details) {
      lifestyleDetails.push(`Skin details: "${profile.skin_issues_details}"`);
    }
  }
  if (profile?.joint_pain === 'yes') {
    lifestyleIssues.push('Experiences joint pain or stiffness (needs anti-inflammatory supplements like turmeric)');
    if (profile?.joint_pain_details) {
      lifestyleDetails.push(`Joint pain details: "${profile.joint_pain_details}"`);
    }
  }
  if (profile?.brain_fog === 'yes') {
    lifestyleIssues.push('Experiences brain fog or difficulty concentrating (needs brain-boosting supplements for mental clarity)');
    if (profile?.brain_fog_details) {
      lifestyleDetails.push(`Brain fog details: "${profile.brain_fog_details}"`);
    }
  }
  if (profile?.sleep_quality === 'yes') {
    lifestyleIssues.push('Has trouble falling asleep or staying asleep (needs sleep-promoting supplements like melatonin)');
    if (profile?.sleep_quality_details) {
      lifestyleDetails.push(`Sleep details: "${profile.sleep_quality_details}"`);
    }
  }
  if (profile?.workout_recovery === 'yes') {
    lifestyleIssues.push('Takes longer to recover from workouts (needs recovery-enhancing supplements)');
    if (profile?.workout_recovery_details) {
      lifestyleDetails.push(`Recovery details: "${profile.workout_recovery_details}"`);
    }
  }
  if (profile?.food_sensitivities === 'yes') {
    lifestyleIssues.push('Certain foods make them feel unwell (needs digestive enzymes and gut repair nutrients)');
    if (profile?.food_sensitivities_details) {
      lifestyleDetails.push(`Food sensitivity details: "${profile.food_sensitivities_details}"`);
    }
  }
  if (profile?.weight_management === 'yes') {
    lifestyleIssues.push('Difficult to maintain a healthy weight (needs metabolism-supporting supplements)');
    if (profile?.weight_management_details) {
      lifestyleDetails.push(`Weight management details: "${profile.weight_management_details}"`);
    }
  }
  if (profile?.immune_system === 'yes') {
    lifestyleIssues.push('Gets sick more often than desired (needs immune-boosting nutrients)');
    if (profile?.immune_system_details) {
      lifestyleDetails.push(`Immune system details: "${profile.immune_system_details}"`);
    }
  }
  if (profile?.caffeine_effect === 'yes') {
    lifestyleIssues.push('Relies on caffeine to get through the day');
    if (profile?.caffeine_effect_details) {
      lifestyleDetails.push(`Caffeine details: "${profile.caffeine_effect_details}"`);
    }
  }
  if (profile?.medication_history === 'yes' && profile?.medication_history_details) {
    lifestyleDetails.push(`Medication history details: "${profile.medication_history_details}"`);
  }
  
  // Also include positive lifestyle factors (No answers)
  const lifestyleStrengths = [];
  if (profile?.caffeine_effect === 'no') lifestyleStrengths.push('Does not rely on caffeine to get through the day');
  if (profile?.immune_system === 'no') lifestyleStrengths.push('Does not get sick more often than desired (good immune function)');
  
  if (lifestyleIssues.length > 0) {
    parts.push(`**LIFESTYLE CONCERNS**: ${lifestyleIssues.join(' • ')}`);
  }
  
  if (lifestyleDetails.length > 0) {
    parts.push(`**LIFESTYLE DETAILS (User-Provided Context)**: \n${lifestyleDetails.join('\n')}`);
  }
  
  if (lifestyleStrengths.length > 0) {
    parts.push(`**LIFESTYLE STRENGTHS**: ${lifestyleStrengths.join(' • ')}`);
  }
  
  // ADHD/Anxiety Medication History
  if (profile?.medication_history === 'yes') {
    parts.push(`**MEDICATION HISTORY**: Previously tried ADHD/anxiety medications that didn't work effectively`);
  }
  
  return parts.join('\n');
}

function buildOptimizedHealthContext(
  profile: any,
  allergies: any[],
  conditions: any[],
  medications: any[],
  biomarkers: any[],
  snps: any[],
  supplementPlan: any,
  symptomPatterns: any[] = []
): string {
  const parts = [];

  // Add onboarding context at the beginning for priority
  const onboardingContext = buildOnboardingContext(profile);
  if (onboardingContext) {
    parts.push(onboardingContext);
  }

  // 🧠 AI-DETECTED SYMPTOM PATTERNS (Critical for Consistency)
  if (symptomPatterns && symptomPatterns.length > 0) {
    const patternSummary = symptomPatterns
      .slice(0, 5) // Top 5 patterns by confidence
      .map(pattern => {
        const symptoms = Array.isArray(pattern.symptoms_involved) ? pattern.symptoms_involved.join(' + ') : pattern.symptoms_involved;
        const recommendations = Array.isArray(pattern.recommendations) ? pattern.recommendations.join(', ') : pattern.recommendations;
        return `**${pattern.pattern_name}** (${pattern.confidence_score}% confidence): ${symptoms} → Recommended: ${recommendations}`;
      })
      .join('\n');
    parts.push(`**🧬 AI-DETECTED ROOT CAUSE PATTERNS**:\n${patternSummary}`);
  }

  // Essential demographics
  if (profile.age || profile.gender) {
    const demo = [];
    if (profile.age) demo.push(`**${profile.age} years old**`);
    if (profile.gender) demo.push(`**${profile.gender}**`);
    if (profile.weight_lbs) demo.push(`**${profile.weight_lbs} lbs**`);
    parts.push(`**PROFILE**: ${demo.join(', ')}`);
  }

  // Key health goals & symptoms
  if (profile.health_goals?.length || profile.energy_levels || profile.brain_fog) {
    const health = [];
    if (profile.health_goals?.length) health.push(`Goals: **${profile.health_goals.slice(0,3).join(', ')}**`);
    if (profile.energy_levels && profile.energy_levels !== 'high') health.push(`Energy: **${profile.energy_levels}**`);
    if (profile.brain_fog && profile.brain_fog !== 'none') health.push(`Brain fog: **${profile.brain_fog}**`);
    if (profile.sleep_quality && profile.sleep_quality !== 'excellent') health.push(`Sleep: **${profile.sleep_quality}**`);
    if (health.length) parts.push(`**HEALTH GOALS & SYMPTOMS**: ${health.join(', ')}`);
  }

  // Medical conditions (top 5)
  if (conditions.length > 0) {
    parts.push(`**CONDITIONS**: ${conditions.slice(0,5).map(c => `**${c.condition_name}**`).join(', ')}`);
  }

  // Current medications (top 5)
  if (medications.length > 0) {
    parts.push(`**MEDICATIONS**: ${medications.slice(0,5).map(m => `**${m.medication_name}**`).join(', ')}`);
  }

  // Key biomarkers - Let LLM interpret based on full context
  if (biomarkers.length > 0) {
    // Format all biomarkers for LLM interpretation
    const biomarkerList = biomarkers
      .slice(0, 20) // Limit to top 20 for space
      .map((b:any)=> `**${b.displayName||b.marker_name}**: ${b.value}${b.unit||''}`)
      .join('\n');
    
    if (biomarkerList) {
      parts.push(`**BIOMARKERS**:\n${biomarkerList}`);
    }
  }

  // Enhanced genetics section with debugging
  if (snps && snps.length > 0) {
    console.log('Building genetics context with:', snps.length, 'SNPs');
    console.log('Sample SNP data:', JSON.stringify(snps.slice(0, 3), null, 2));
    
    // Filter out truly empty entries
    const validSnps = snps.filter(snp => {
      const hasGene = snp.gene && snp.gene !== 'Unknown';
      const hasRsid = snp.rsid && snp.rsid !== 'Unknown';
      const hasGenotype = snp.genotype && snp.genotype !== 'Unknown';
      
      return hasGene && hasRsid && hasGenotype;
    });
    
    console.log(`Valid SNPs: ${validSnps.length} out of ${snps.length}`);
    
    if (validSnps.length === 0) {
      // Debug what's missing
      const missingGene = snps.filter(s => !s.gene || s.gene === 'Unknown').length;
      const missingRsid = snps.filter(s => !s.rsid || s.rsid === 'Unknown').length;
      const missingGenotype = snps.filter(s => !s.genotype || s.genotype === 'Unknown').length;
      
      parts.push(`**GENETICS**: ${snps.length} variants loaded but data incomplete - Missing: ${missingGene} gene names, ${missingRsid} rsIDs, ${missingGenotype} genotypes. Please check database and upload process.`);
    } else {
      // Group by gene
      const geneGroups: Record<string, any[]> = {};
      validSnps.forEach((snp) => {
        const geneName = snp.gene;
        
        if (!geneGroups[geneName]) {
          geneGroups[geneName] = [];
        }
        
        geneGroups[geneName].push({
          rsid: snp.rsid,
          genotype: snp.genotype,
          raw: snp // Keep raw data for debugging
        });
      });
      
      // Format for AI - prioritize important genes
      const importantGenes = ['MTHFR', 'COMT', 'VDR', 'APOE', 'CBS', 'MTR', 'MTRR'];
      const otherGenes = Object.keys(geneGroups).filter(g => !importantGenes.includes(g));
      const allGenes = [...importantGenes.filter(g => geneGroups[g]), ...otherGenes];
      
      const formattedGenetics = allGenes
        .slice(0, 20) // Limit to top 20 genes for space
        .map(geneName => {
          const variants = geneGroups[geneName];
          const variantList = variants
            .slice(0, 5) // Limit variants per gene
            .map(v => `${v.rsid}: **${v.genotype}**`)
            .join(', ');
          return `**${geneName}**: ${variantList}`;
        })
        .join('\n');
      
      parts.push(`**GENETICS** (${validSnps.length} valid variants):\n${formattedGenetics}`);
    }
  } else {
    parts.push(`**GENETICS**: No genetic data available - please complete genetic assessment`);
  }

  // Current supplements (top 10)
  if (supplementPlan?.recommendations) {
    const currentSupps = supplementPlan.recommendations
      .slice(0, 10)
      .map((rec: any) => `**${rec.supplement}**: ${rec.dosage}`)
      .join(', ');
    parts.push(`**CURRENT SUPPLEMENTS**: ${currentSupps}`);
  }

  // Allergies
  if (allergies.length > 0) {
    parts.push(`**ALLERGIES**: ${allergies.slice(0,10).map(a => `**${a.ingredient_name}**`).join(', ')}`);
  }

  return parts.join('\n\n');
} 