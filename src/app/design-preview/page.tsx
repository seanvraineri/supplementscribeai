'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Removed Supabase client - using mock data only
import ReactMarkdown from 'react-markdown';
import { 
  Dna, 
  FileText, 
  User, 
  BarChart3, 
  MessageSquare, 
  Settings,
  Home,
  Pill,
  Activity, 
  Brain, 
  ChevronRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Info,
  LogOut,
  Search,
  ExternalLink,
  BookOpen,
  Star,
  TrendingUp,
  MessageCircle,
  Zap,
  Moon,
  Heart,
  Leaf,
  AlertOctagon,
  Cloud,
  Sun,
  Bone,
  CloudLightning,
  Edit3,
  Check,
  Target,
  Shield,
  Network,
  Send,
  Apple,
  Clock,
  ChefHat,
  Users,
  Menu,
  X,
  CreditCard,
  Package
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SVGProps } from 'react';
import SymptomModal from '@/components/SymptomModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  cleanBiomarkerName,
  formatBiomarkerName,
  cleanSnpName,
  getBiomarkerReferenceRange,
  interpretBiomarker,
  interpretSNP,
} from '@/lib/analysis-helpers';
  // import { useEducationData } from '@/hooks/useEducationData';
import { useComprehensiveAnalysis } from '@/hooks/useComprehensiveAnalysis';
import { useEnhancedAnalysis } from '@/hooks/useEnhancedAnalysis';
import BiomarkerCard from '@/components/BiomarkerCard';
import SnpCard from '@/components/SnpCard';
import HealthScoreCard from '@/components/HealthScoreCard';
import { generateReferralUrl, generateSignupUrl } from '@/lib/referral-utils';
import ShareGraphics from '@/components/ShareGraphics';
// Removed DynamicTracker - using mock data only


// Removed createClient - using mock data only

type TabType = 'dashboard' | 'supplement-plan' | 'diet-groceries' | 'analysis' | 'tracking' | 'ai-chat' | 'product-checker' | 'study-buddy' | 'settings';

const MindIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3a7 7 0 0 0-7 7v3a5 5 0 0 0 5 5h3a4 4 0 0 0 4-4v-1"/>
    <circle cx="12" cy="10" r="2"/>
    <path d="M15 7h.01"/>
  </svg>
);

// New Dark Animated Gradient for the Dashboard
const DashboardGradient = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden bg-dark-background">
    <motion.div
      className="absolute"
      style={{ top: '20%', left: '10%', width: '800px', height: '800px' }}
      animate={{
        backgroundImage: [
          "radial-gradient(circle, rgba(0, 191, 255, 0.08), rgba(13, 13, 13, 0) 60%)",
          "radial-gradient(circle, rgba(0, 191, 255, 0.05), rgba(13, 13, 13, 0) 70%)",
        ],
      }}
      transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    />
    <motion.div
      className="absolute"
      style={{ bottom: '10%', right: '5%', width: '600px', height: '600px' }}
      animate={{
        backgroundImage: [
          "radial-gradient(circle, rgba(0, 191, 255, 0.04), rgba(13, 13, 13, 0) 65%)",
          "radial-gradient(circle, rgba(0, 191, 255, 0.07), rgba(13, 13, 13, 0) 55%)",
        ],
      }}
      transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 5 }}
    />
  </div>
);

// Key biomarkers and SNPs template for comprehensive analysis
const KEY_BIOMARKERS = [
  'glucose', 'hba1c', 'insulin', 'triglycerides', 'cholesterol', 'ldl', 'hdl',
  'testosterone', 'free_testosterone', 'estradiol', 'dhea', 'cortisol', 'shbg',
  'vitamin_d', 'vitamin_b12', 'folate', 'magnesium', 'zinc', 'iron', 'ferritin',
  'homocysteine', 'crp', 'tsh', 'free_t3', 'free_t4', 'vitamin_b6', 'omega_3'
];

const KEY_SNPS = [
  'MTHFR', 'COMT', 'APOE', 'FTO', 'VDR', 'FADS1', 'FADS2', 'CYP1A1', 'CYP1B1', 
  'MTR', 'MTRR', 'BDNF', 'TOMM40', 'MC4R', 'PPARG', 'TCF7L2', 'CYP2R1', 'GC'
];

// MOCK DATA FOR DESIGN PREVIEW
const MOCK_USER = {
  id: 'demo-user',
  email: 'alex.thompson@gmail.com'
};

const MOCK_PROFILE = {
  full_name: 'Alex Thompson',
  health_score: 73,
  subscription_tier: 'full',
  referral_code: 'ALEX2025',
  age: 34,
  gender: 'female',
  primary_health_concern: 'chronic fatigue and brain fog affecting work performance'
};

const MOCK_PLAN = {
  recommendations: [
    {
      supplement: 'Methyl B-Complex',
      brand: 'SupplementScribe',
      reason: `Alex, your MTHFR A1298C variant (rs1801131) means your body has been struggling to process regular B vitamins, which explains so much about your chronic fatigue and brain fog. This methylated B-complex bypasses your genetic limitation, providing the exact activated forms your cells desperately need. With your B12 at only 245 pg/mL (optimal is 500+), this will help restore your energy production pathways and clear that mental fog you've been fighting. Many of our users with MTHFR variants report feeling "like themselves again" within 2-3 weeks.`,
      dosage: '1 capsule daily',
      timing: 'Take with your daily pack at breakfast',
      note: 'This is the cornerstone of your recovery - your genetics have been working against you, but we are about to change that.',
      interactions: [],
      product_id: 'Methyl B-Complex'
    },
    {
      supplement: 'Omega 3',
      brand: 'SupplementScribe',
      reason: `Your omega-3 index of 3.1% is critically low (optimal is 8-12%), which is directly contributing to your inflammation markers and brain fog. This high-quality EPA/DHA blend will reduce your systemic inflammation, support your neurotransmitter production, and help stabilize your mood swings. With your CRP at 4.2 mg/L indicating significant inflammation, omega-3s are essential for bringing your body back into balance. Most importantly, they'll help your brain cells communicate properly again.`,
      dosage: '2000 mg daily',
      timing: 'Take with your daily pack at breakfast',
      note: 'Essential for reducing inflammation and supporting brain health - expect clearer thinking within 4-6 weeks.',
      interactions: [],
      product_id: 'Omega 3'
    },
    {
      supplement: 'Magnesium',
      brand: 'SupplementScribe',
      reason: `Your magnesium at 1.6 mg/dL is below optimal (1.8-2.4), and this deficiency is likely why you're experiencing poor sleep quality, anxiety, and muscle tension. Magnesium is involved in over 300 enzymatic reactions in your body, including energy production and nervous system regulation. For someone with your COMT Val158Met variant, magnesium is especially critical as it helps regulate dopamine and norepinephrine. This will help calm your overactive stress response and finally give you the restorative sleep your body needs.`,
      dosage: '400 mg daily',
      timing: 'Take with your daily pack at breakfast',
      note: 'The master mineral for relaxation and energy - most people notice better sleep within the first week.',
      interactions: [],
      product_id: 'Magnesium'
    },
    {
      supplement: 'Vitamin D',
      brand: 'SupplementScribe',
      reason: `Your vitamin D level of 22 ng/mL is significantly deficient (optimal is 40-60), which explains your fatigue, mood issues, and weakened immune system. This deficiency is affecting every cell in your body, from energy production to mood regulation. With your family history of autoimmune conditions and your current inflammatory state, optimizing vitamin D is crucial for immune system balance. Studies show that correcting vitamin D deficiency can improve energy levels by up to 50% in chronically fatigued individuals.`,
      dosage: '5000 IU daily',
      timing: 'Take with your daily pack at breakfast',
      note: 'Critical for energy, mood, and immune function - you should feel more energetic within 3-4 weeks.',
      interactions: [],
      product_id: 'Vitamin D'
    },
    {
      supplement: 'CoQ10',
      brand: 'SupplementScribe',
      reason: `Your chronic fatigue pattern suggests mitochondrial dysfunction - your cells' power plants aren't producing energy efficiently. CoQ10 is essential for cellular energy production, and with your elevated oxidative stress markers, it will also provide powerful antioxidant protection. This is especially important given your brain fog and physical exhaustion. Clinical studies show CoQ10 can improve energy levels by 30-40% in people with chronic fatigue. Think of this as upgrading your cellular batteries.`,
      dosage: '100 mg daily',
      timing: 'Take with your daily pack at breakfast',
      note: 'Powers up your cellular energy factories - expect gradual but significant energy improvements.',
      interactions: [],
      product_id: 'CoQ10'
    },
    {
      supplement: 'Ashwagandha',
      brand: 'SupplementScribe',
      reason: `Your cortisol patterns and chronic stress are keeping your body in constant "fight or flight" mode, which is exhausting your energy reserves and disrupting your sleep. Ashwagandha is a powerful adaptogen that will help normalize your stress response, reduce anxiety, and improve your resilience. With your COMT variant making you more sensitive to stress, this herb will help buffer those effects. Studies show ashwagandha can reduce cortisol by 30% and significantly improve sleep quality - exactly what your overtaxed system needs.`,
      dosage: '300 mg daily',
      timing: 'Take with your daily pack at breakfast',
      note: 'Natures stress shield - helps your body adapt and recover from chronic stress.',
      interactions: [],
      product_id: 'Ashwagandha'
    }
  ],
  total_monthly_cost: 179.94,
  personalization_tier: 'Ultra-Precision 6-Pack',
  safety_analysis: 'No interactions detected. Safe to take with your current medications. Monitor energy levels as they improve - you may need less caffeine.',
  expected_timeline: 'This personalized pack addresses your root causes: MTHFR methylation issues, critically low omega-3s, vitamin D deficiency, and chronic inflammation. Take your complete daily pack with breakfast for optimal absorption and compliance.'
};

const MOCK_DIET_PLAN = {
  grocery_list: {
    proteins: [
      { item: 'Wild-caught salmon (2 lbs)', reason: 'High EPA/DHA to support your omega-3 deficiency and reduce neuroinflammation' },
      { item: 'Grass-fed ground beef (1 lb)', reason: 'Rich in CoQ10, B12, and iron - supports energy production pathways' },
      { item: 'Organic pasture-raised eggs (18 count)', reason: 'Choline for brain function, complete amino acids for neurotransmitter synthesis' },
      { item: 'Hemp seeds (1 bag)', reason: 'Magnesium, complete protein, and anti-inflammatory gamma-linolenic acid' }
    ],
    vegetables: [
      { item: 'Organic spinach (3 bunches)', reason: 'Folate, magnesium, and iron - crucial for your MTHFR variant and energy metabolism' },
      { item: 'Broccoli sprouts (2 containers)', reason: 'Sulforaphane activates Nrf2 pathway, supporting detoxification and reducing brain fog' },
      { item: 'Sweet potatoes (5 lbs)', reason: 'Complex carbs for stable blood sugar, beta-carotene for immune support' },
      { item: 'Organic kale (2 bunches)', reason: 'Vitamin K, folate, and antioxidants - supports methylation pathways' }
    ],
    fruits: [
      { item: 'Wild blueberries (3 cups)', reason: 'Anthocyanins cross blood-brain barrier, improving cognitive function and memory' },
      { item: 'Avocados (6 pieces)', reason: 'Monounsaturated fats support hormone production and nutrient absorption' },
      { item: 'Pomegranate (2 pieces)', reason: 'Punicalagins reduce inflammation and support mitochondrial function' }
    ],
    fats: [
      { item: 'Extra virgin olive oil (500ml)', reason: 'Oleic acid reduces inflammation, supports brain health and hormone production' },
      { item: 'Coconut oil (jar)', reason: 'MCTs provide quick brain fuel, support ketone production for mental clarity' },
      { item: 'Raw almonds (1 lb)', reason: 'Vitamin E, magnesium, and healthy fats - support cardiovascular and cognitive health' }
    ],
    seasonings: [
      { item: 'Turmeric powder', reason: 'Curcumin reduces neuroinflammation, supports joint health and cognitive function' },
      { item: 'Fresh ginger root', reason: 'Gingerols improve circulation, reduce inflammation, support digestive health' },
      { item: 'Himalayan pink salt', reason: 'Trace minerals support electrolyte balance and adrenal function' }
    ],
    beverages: [
      { item: 'Green tea (organic)', reason: 'L-theanine + caffeine improve focus without jitters, EGCG supports brain health' },
      { item: 'Bone broth (grass-fed)', reason: 'Collagen, minerals, and amino acids support gut health and joint function' }
    ]
  },
  meal_suggestions: {
    breakfast: [{
      name: 'Brain-Boosting Omega Scramble',
      ingredients: ['3 pasture-raised eggs', '1 cup spinach', '1/4 avocado', '1 tbsp hemp seeds', '1 tsp turmeric'],
      benefits: 'Provides choline for neurotransmitters, folate for methylation, healthy fats for hormone production',
      prep_time: '5 minutes',
      cook_time: '8 minutes', 
      servings: '1',
      instructions: [
        'Heat coconut oil in pan over medium heat',
        'Sauté spinach until wilted (2 minutes)',
        'Scramble eggs with turmeric until creamy',
        'Top with avocado and hemp seeds'
      ],
      micronutrients: {
        primary_nutrients: ['Choline (180mg)', 'Folate (120mcg)', 'Omega-3 (450mg)', 'Magnesium (85mg)'],
        nutrient_density_score: '9.2/10',
        key_vitamins: ['B12', 'Folate', 'Vitamin K', 'Vitamin E'],
        key_minerals: ['Magnesium', 'Iron', 'Zinc', 'Selenium'],
        bioactive_compounds: ['Curcumin', 'Lutein', 'Alpha-linolenic acid'],
        synergistic_effects: 'Fats enhance fat-soluble vitamin absorption, turmeric + black pepper increase curcumin bioavailability'
      }
    }],
    lunch: [{
      name: 'Anti-Inflammatory Salmon Power Bowl',
      ingredients: ['6oz wild salmon', '1 cup quinoa', '1 cup broccoli sprouts', '1/2 cup blueberries', '2 tbsp olive oil', 'lemon'],
      benefits: 'High EPA/DHA for brain health, sulforaphane for detox, antioxidants for cellular protection',
      prep_time: '15 minutes',
      cook_time: '20 minutes',
      servings: '1',
      instructions: [
        'Cook quinoa in bone broth for extra minerals',
        'Grill salmon with lemon and herbs',
        'Massage kale with olive oil and lemon',
        'Combine all ingredients, top with hemp seeds'
      ],
      micronutrients: {
        primary_nutrients: ['EPA (1200mg)', 'DHA (800mg)', 'Sulforaphane (40mg)', 'Anthocyanins (180mg)'],
        nutrient_density_score: '9.8/10',
        key_vitamins: ['B12', 'Vitamin D', 'Vitamin C', 'Folate'],
        key_minerals: ['Selenium', 'Iodine', 'Magnesium', 'Potassium'],
        bioactive_compounds: ['Sulforaphane', 'Anthocyanins', 'Astaxanthin'],
        synergistic_effects: 'Omega-3s enhance antioxidant absorption, vitamin C increases iron bioavailability'
      }
    }],
    dinner: [{
      name: 'Mitochondrial Recovery Steak & Sweet Potato',
      ingredients: ['6oz grass-fed beef', '1 medium roasted sweet potato', '1 cup sautéed kale', '1 tbsp grass-fed butter'],
      benefits: 'CoQ10 for energy production, beta-carotene for immune function, iron for oxygen transport',
      prep_time: '10 minutes',
      cook_time: '25 minutes',
      servings: '1',
      instructions: [
        'Roast sweet potato at 400°F for 45 minutes',
        'Season steak with sea salt and herbs',
        'Sauté kale with garlic in coconut oil',
        'Let steak rest 5 minutes before serving'
      ],
      micronutrients: {
        primary_nutrients: ['CoQ10 (8mg)', 'Heme Iron (4mg)', 'Beta-carotene (12mg)', 'B12 (2.8mcg)'],
        nutrient_density_score: '9.5/10',
        key_vitamins: ['B12', 'B6', 'Niacin', 'Vitamin A'],
        key_minerals: ['Iron', 'Zinc', 'Selenium', 'Potassium'],
        bioactive_compounds: ['Carnosine', 'Creatine', 'Taurine'],
        synergistic_effects: 'Vitamin C from kale enhances iron absorption, fats improve carotenoid uptake'
      }
    }],
    snacks: [{
      name: 'Cognitive Enhancement Trail Mix',
      ingredients: ['1/4 cup raw almonds', '2 tbsp pumpkin seeds', '1 tbsp dark chocolate chips (85% cacao)', '1 tsp coconut flakes'],
      benefits: 'Magnesium for relaxation, zinc for cognitive function, flavonoids for brain blood flow',
      prep_time: '2 minutes',
      cook_time: '0 minutes',
      servings: '1',
      instructions: [
        'Combine all ingredients in small bowl',
        'Eat mindfully, chewing thoroughly'
      ],
      micronutrients: {
        primary_nutrients: ['Magnesium (95mg)', 'Zinc (2.3mg)', 'Flavonoids (120mg)', 'Vitamin E (7mg)'],
        nutrient_density_score: '8.7/10',
        key_vitamins: ['Vitamin E', 'Thiamine', 'Riboflavin'],
        key_minerals: ['Magnesium', 'Zinc', 'Copper', 'Manganese'],
        bioactive_compounds: ['Flavonoids', 'Phenolic acids', 'Phytosterols'],
        synergistic_effects: 'Fats enhance fat-soluble vitamin absorption, minerals work synergistically'
      }
    }]
  },
  micronutrient_analysis: {
    key_nutrients: [
      { 
        nutrient: 'Omega-3 Fatty Acids (EPA/DHA)', 
        sources: ['Wild salmon', 'Hemp seeds', 'Walnuts'], 
        health_benefits: 'Reduces neuroinflammation, improves cognitive function, supports mood regulation',
        why_you_need_it: 'Your omega-3 index of 3.1% is severely deficient. This diet provides 2.5g daily to reach optimal levels.'
      },
      { 
        nutrient: 'Methylated Folate', 
        sources: ['Spinach', 'Broccoli sprouts', 'Avocado'], 
        health_benefits: 'Supports DNA methylation, neurotransmitter synthesis, energy production',
        why_you_need_it: 'Your MTHFR variant reduces folate metabolism. These foods provide bioactive forms your body can use.'
      },
      { 
        nutrient: 'Magnesium', 
        sources: ['Hemp seeds', 'Spinach', 'Almonds'], 
        health_benefits: 'Muscle relaxation, sleep quality, energy production, stress response',
        why_you_need_it: 'Your low magnesium (1.6 mg/dL) explains muscle tension and sleep issues. This diet provides 450mg daily.'
      }
    ],
    nutrient_synergies: [
      { 
        combination: 'Vitamin C + Iron', 
        benefit: 'Increases iron absorption by 300%', 
        foods_involved: ['Kale with grass-fed beef', 'Broccoli with hemp seeds']
      },
      { 
        combination: 'Healthy Fats + Carotenoids', 
        benefit: 'Enhances vitamin A absorption by 500%', 
        foods_involved: ['Avocado with sweet potato', 'Olive oil with spinach']
      }
    ],
    supplement_synergy: { 
      explanation: 'This diet amplifies your supplement protocol by providing cofactors for optimal absorption and metabolism.',
      examples: ['Magnesium-rich foods enhance B-vitamin utilization', 'Omega-3 foods work synergistically with CoQ10 for mitochondrial function']
    }
  },
  general_notes: 'This precision nutrition plan targets your specific deficiencies and genetic variants. Focus on organic, grass-fed, and wild-caught options for maximum nutrient density. Meal timing optimizes circadian rhythm and supplement absorption.',
  contraindications: 'No food restrictions based on your health profile. Monitor energy levels and adjust portions as needed.'
};

const MOCK_BIOMARKERS = [
  { 
    name: 'Vitamin D (25-OH)', 
    value: '22 ng/mL', 
    range: '30-100 ng/mL', 
    status: 'Deficient',
    analysis: 'Clinical deficiency explaining fatigue, immune issues, and mood changes. Requires aggressive supplementation.',
    health_impact: 'Affects 3,000+ genes, immune function, bone health, and neurotransmitter synthesis',
    recommendation: '5000 IU D3 + K2 daily, retest in 8 weeks'
  },
  { 
    name: 'Omega-3 Index', 
    value: '3.1%', 
    range: '>8% optimal', 
    status: 'Severely Low',
    analysis: 'Critical deficiency linked to neuroinflammation and cognitive decline. Explains brain fog and mood issues.',
    health_impact: 'Increased risk of depression, cognitive decline, and cardiovascular disease',
    recommendation: 'High-dose EPA/DHA supplementation + fatty fish 3x/week'
  },
  { 
    name: 'Magnesium (RBC)', 
    value: '1.6 mg/dL', 
    range: '1.8-2.4 mg/dL', 
    status: 'Low',
    analysis: 'Cellular magnesium deficiency explains muscle tension, sleep issues, and stress sensitivity.',
    health_impact: 'Affects 300+ enzymatic reactions, sleep quality, and stress response',
    recommendation: 'Magnesium glycinate 400mg before bed, increase magnesium-rich foods'
  },
  { 
    name: 'Vitamin B12', 
    value: '285 pg/mL', 
    range: '300-900 pg/mL', 
    status: 'Low Normal',
    analysis: 'Borderline low B12 with MTHFR variant suggests functional deficiency despite normal levels.',
    health_impact: 'Critical for energy production, neurological function, and DNA synthesis',
    recommendation: 'Methylcobalamin form preferred due to genetic variants'
  },
  { 
    name: 'Folate (Serum)', 
    value: '8.2 ng/mL', 
    range: '3-20 ng/mL', 
    status: 'Normal',
    analysis: 'Normal levels but MTHFR variant reduces utilization by 40%. Functional deficiency likely.',
    health_impact: 'Essential for methylation, neurotransmitter synthesis, and DNA repair',
    recommendation: 'Methylfolate supplementation bypasses genetic bottleneck'
  },
  { 
    name: 'Iron (Ferritin)', 
    value: '28 ng/mL', 
    range: '15-200 ng/mL', 
    status: 'Low Normal',
    analysis: 'Low-normal ferritin explains fatigue and exercise intolerance. Optimal levels 50-100 for energy.',
    health_impact: 'Affects oxygen transport, energy production, and cognitive function',
    recommendation: 'Iron-rich foods + vitamin C, monitor for improvement'
  },
  { 
    name: 'Cortisol (AM)', 
    value: '18.2 μg/dL', 
    range: '6-23 μg/dL', 
    status: 'High Normal',
    analysis: 'Elevated morning cortisol indicates chronic stress and HPA axis dysfunction.',
    health_impact: 'Chronic elevation leads to fatigue, immune suppression, and metabolic issues',
    recommendation: 'Adaptogenic herbs, stress management, circadian rhythm optimization'
  },
  { 
    name: 'Thyroid (TSH)', 
    value: '3.8 mIU/L', 
    range: '0.4-4.0 mIU/L', 
    status: 'High Normal',
    analysis: 'Upper range TSH suggests subclinical hypothyroidism contributing to fatigue and brain fog.',
    health_impact: 'Affects metabolism, energy production, and cognitive function',
    recommendation: 'Monitor T3/T4, support with selenium and iodine'
  }
];

const MOCK_SNPS = [
  { 
    gene: 'MTHFR C677T', 
    variant: 'CT (Heterozygous)', 
    impact: 'Moderate',
    analysis: 'Reduces MTHFR enzyme activity by 40%, impairing folate metabolism and methylation. Explains fatigue and mood issues.',
    health_implications: 'Increased risk of depression, fatigue, cardiovascular disease, and pregnancy complications',
    action_required: 'Avoid folic acid, use methylfolate instead. Increase B-vitamin rich foods.',
    supplement_guidance: 'Methylfolate 800mcg + methylcobalamin essential'
  },
  { 
    gene: 'COMT Val158Met', 
    variant: 'AA (Met/Met)', 
    impact: 'High',
    analysis: 'Slow COMT enzyme breaks down dopamine 4x slower, causing dopamine accumulation and stress sensitivity.',
    health_implications: 'Enhanced focus under low stress but poor performance under pressure. Caffeine sensitivity.',
    action_required: 'Limit caffeine, avoid high-stress situations, use magnesium for relaxation.',
    supplement_guidance: 'Magnesium glycinate, avoid stimulating supplements'
  },
  { 
    gene: 'APOE', 
    variant: 'ε3/ε3', 
    impact: 'Low',
    analysis: 'Standard APOE variant with normal Alzheimer\'s risk and cholesterol metabolism.',
    health_implications: 'No increased neurological risk, standard dietary recommendations apply.',
    action_required: 'Maintain healthy lifestyle, focus on other genetic variants.',
    supplement_guidance: 'Standard omega-3 and antioxidant protocols'
  },
  { 
    gene: 'VDR Bsm1', 
    variant: 'AA', 
    impact: 'Moderate',
    analysis: 'Altered vitamin D receptor function requires higher vitamin D levels for optimal health.',
    health_implications: 'Increased vitamin D requirements, higher risk of deficiency-related conditions.',
    action_required: 'Maintain vitamin D levels >50 ng/mL, regular sun exposure.',
    supplement_guidance: 'Higher dose vitamin D3 (5000+ IU) with K2'
  },
  { 
    gene: 'FTO', 
    variant: 'AT', 
    impact: 'Moderate',
    analysis: 'Fat mass and obesity gene variant increases hunger signals and slows satiety.',
    health_implications: 'Higher obesity risk, requires mindful eating and protein optimization.',
    action_required: 'High-protein meals, intermittent fasting, regular exercise.',
    supplement_guidance: 'Chromium for blood sugar, fiber for satiety'
  }
];

// COMPREHENSIVE MOCK DATA FOR OTHER FEATURES
const MOCK_PRODUCT_ANALYSIS = {
  productName: "Nature's Bounty Multivitamin",
  brand: "Nature's Bounty",
  overallScore: 31,
  summary: 'Generic formula that could actually worsen your symptoms due to incompatible nutrient forms',
  safety_score: 45,
  effectiveness_score: 22,
  personalization_score: 15,
  recommendation: 'NOT RECOMMENDED',
  key_findings: [
    'Contains FOLIC ACID - toxic for your MTHFR variant',
    'Uses cyanocobalamin B12 - your body cannot convert this form',
    'Iron included despite no deficiency - increases oxidative stress',
    'Synthetic vitamin forms have <30% absorption rate'
  ],
  pros: [
    'Widely available at most stores',
    'Inexpensive at $8.99/bottle',
    'Contains some vitamin D (though only 1000 IU)',
    'Has basic minerals like zinc and selenium',
    'Third-party tested for contaminants'
  ],
  cons: [
    'CRITICAL: Contains folic acid which your MTHFR A1298C variant CANNOT process - will accumulate as toxic unmetabolized folic acid (UMFA)',
    'Uses cyanocobalamin B12 instead of methylcobalamin - useless for your deficiency, requires conversion your body cannot perform',
    'ZERO omega-3s - completely ignores your critically low 3.1% omega-3 index causing brain fog',
    'Contains iron when you don\'t need it - will worsen oxidative stress and fatigue',
    '"Fairy dusting" doses - most nutrients below therapeutic levels (only 60mg magnesium when you need 400mg)',
    'Synthetic dl-alpha-tocopherol instead of natural vitamin E - 50% less bioavailable',
    'One-size-fits-all approach ignores your COMT variant - could trigger anxiety',
    'Missing critical nutrients: no CoQ10 for energy, no adaptogens for stress, no methylfolate'
  ],
  warnings: [
    'DO NOT TAKE THIS with your MTHFR variant - folic acid will block methylfolate receptors',
    'Iron content may cause digestive upset and worsen fatigue through oxidative stress',
    'Will interfere with your personalized supplements - competing for same absorption pathways'
  ],
  genetic_compatibility: [
    {
      gene: 'MTHFR A1298C',
      compatibility: 'DANGEROUS',
      reason: 'Folic acid is TOXIC for MTHFR variants - blocks methylation pathways'
    },
    {
      gene: 'COMT Val158Met', 
      compatibility: 'INCOMPATIBLE',
      reason: 'Generic B-vitamin ratios may worsen anxiety and overstimulation'
    }
  ],
  biomarker_alignment: [
    {
      marker: 'Vitamin D (22 ng/mL)',
      relevance: 'INSUFFICIENT',
      impact: 'Only 1000 IU when you need 5000 IU to correct deficiency'
    },
    {
      marker: 'B12 (245 pg/mL)',
      relevance: 'WRONG FORM',
      impact: 'Cyanocobalamin requires conversion - useless for your deficiency'
    },
    {
      marker: 'Omega-3 Index (3.1%)',
      relevance: 'IGNORED',
      impact: 'Contains ZERO omega-3s - brain fog will persist'
    },
    {
      marker: 'Magnesium (1.6 mg/dL)',
      relevance: 'INADEQUATE',
      impact: 'Only 60mg oxide form (4% absorption) when you need 400mg glycinate'
    }
  ],
  safety_concerns: [
    {
      type: 'GENETIC INCOMPATIBILITY',
      severity: 'SEVERE',
      description: 'Folic acid accumulation with MTHFR variant linked to cancer risk'
    },
    {
      type: 'NUTRIENT COMPETITION',
      severity: 'HIGH',
      description: 'Cheap forms compete with your quality supplements for absorption'
    },
    {
      type: 'OXIDATIVE STRESS',
      severity: 'MODERATE',
      description: 'Unnecessary iron will increase free radical damage'
    }
  ],
  personalized_recommendations: [
    'DO NOT take this product - it will worsen your symptoms',
    'Your MTHFR variant makes this actively harmful, not just ineffective',
    'Stick with your personalized methylated supplements',
    'Generic multivitamins ignore 100% of your genetic data',
    'You\'re literally paying to make yourself feel worse'
  ],
  shocking_facts: [
    '92% of people with MTHFR variants feel WORSE on standard multivitamins',
    'Folic acid can mask B12 deficiency while neurological damage progresses',
    'Generic multivitamins have a 78% discontinuation rate due to no perceived benefit',
    'Your personalized stack is 12x more bioavailable than this generic formula'
  ],
  disclaimer: 'This analysis is based on your personal health data and is for informational purposes only. Always consult with your healthcare provider before making changes to your supplement regimen.'
};

const MOCK_STUDY_ANALYSIS = {
  title: 'Assessing Effects of l-Methylfolate in Depression Management: Results of a Real-World Patient Experience Trial',
  journal: 'Primary Care Companion for CNS Disorders',
  year: 2013,
  study_type: 'Real-world prospective trial',
  participants: 554,
  duration: '90 days',
  pmid: 'PMC3869616',
  relevanceScore: 10,
  personalizedSummary: 'Alex, this study is EXTRAORDINARILY relevant to your profile. The researchers studied 554 patients with treatment-resistant depression who were given L-methylfolate supplementation. Your MTHFR C677T variant (which you carry) was specifically identified in this research as a key factor that makes L-methylfolate supplementation dramatically more effective. The study found that patients like you, with genetic variants affecting folate metabolism, showed remarkable improvements that standard antidepressants alone could not achieve.',
  personalizedExplanation: `This is not just another depression study - this is essentially a blueprint for your exact genetic situation. Here is what makes this groundbreaking for your profile:

▪ GENETIC VALIDATION: You carry the MTHFR C677T variant (heterozygous), which reduces your MTHFR enzyme activity by approximately 35%

▪ This study specifically showed that people with your exact genetic profile have impaired ability to convert regular folic acid into the active L-methylfolate form your brain desperately needs

▪ THE CHRONIC FATIGUE CONNECTION: The study found that patients with MTHFR variants often experience chronic fatigue because their brains cannot efficiently produce the neurotransmitters (serotonin, dopamine, norepinephrine) needed for energy and mood regulation

▪ This directly explains your persistent fatigue symptoms that have been plaguing you

▪ YOUR PERSONALIZED SOLUTION: Based on your current supplement plan including 15mg L-methylfolate, you are already implementing the exact intervention this study proved most effective

▪ The researchers found this dosage led to a 58.2% reduction in depression scores and significant energy improvements in 90 days

What is happening at the molecular level in your cells:
▪ Step 1: Your MTHFR C677T variant creates a "bottleneck" in folate metabolism
▪ Step 2: This leads to elevated homocysteine (inflammatory marker) and reduced methylation capacity  
▪ Step 3: Reduced methylation impairs neurotransmitter synthesis, causing fatigue and mood issues
▪ Step 4: L-methylfolate bypasses your genetic bottleneck, restoring normal brain chemistry

▪ THE BREAKTHROUGH MOMENT: This study proves your chronic fatigue is not "in your head" or due to stress - it is a direct result of your genetic variant preventing proper folate utilization

▪ You have been fighting an uphill battle with suboptimal brain chemistry, but L-methylfolate changes everything`,
  keyFindings: [
    '67.9% of patients responded to L-methylfolate treatment (≥50% symptom reduction)',
    '45.7% achieved complete remission of depression symptoms',
    'Average 8.5-point reduction in depression scores (58.2% improvement)',
    '90.8% compliance rate - people actually took it consistently unlike other supplements',
    'Significant improvements in work/home/social functioning within 90 days',
    'Up to 70% of depressed patients have MTHFR variants that compromise folic acid conversion',
    'L-methylfolate bypasses genetic bottlenecks and crosses blood-brain barrier efficiently',
    'Higher bioavailability compared to regular folic acid supplements',
    'Most effective dose was 15mg daily - exactly what your plan includes',
    'Patients with MTHFR variants showed 2.3x better response rates than those without variants',
    'Energy levels improved in 78% of participants with chronic fatigue symptoms',
    'Cognitive function (focus, memory, mental clarity) improved in 71% of patients'
  ],
  actionableRecommendations: [
    'Continue Your Current L-Methylfolate Dosage: Your 15mg daily dose matches exactly what this study found most effective. The research validates your current supplementation strategy.',
    'Monitor Your Homocysteine Levels: The study emphasizes that people with your variant should track homocysteine as a biomarker. Elevated levels indicate your methylation pathway needs support. Target: <7 μmol/L.',
    'Expect Gradual Improvements: The study showed most patients experienced significant benefits within 90 days. Your chronic fatigue should improve as your brain neurotransmitter production normalizes.',
    'Consider Additional Testing: The research suggests testing for inflammatory markers (CRP, IL-6) as these can further impair methylation in people with MTHFR variants.',
    'Track Your Progress: Use the app to monitor energy levels, mood, and cognitive function as the study showed measurable improvements in all these areas.',
    'Optimize Timing: Take L-methylfolate in the morning with your B-complex for maximum neurotransmitter synthesis during peak cortisol hours.',
    'Support with Cofactors: Ensure adequate B12 (methylcobalamin), B6 (P5P), and magnesium as these work synergistically with L-methylfolate.'
  ],
  methodology_quality: 'HIGH',
  limitations: [
    '▪ Real-world study design means less controlled than randomized trials',
    '▪ Self-reported outcomes rather than objective biomarkers',
    '▪ No long-term follow-up beyond 90 days',
    '▪ Selection bias - participants volunteered for the study',
    '▪ No placebo control group (though previous studies with placebo showed similar results)'
  ],
  clinical_significance: 'This study essentially proves that your personalized supplement plan is scientifically optimized for your genetic makeup. You are not just taking supplements randomly - you are implementing a precision medicine approach backed by real-world clinical evidence. The fact that 554 real patients with your exact genetic profile experienced dramatic improvements validates that your chronic fatigue has a clear biological cause and solution.',
  bottomLine: 'This research validates that L-methylfolate at 15mg daily can be life-changing for people with your MTHFR variant. The 67.9% response rate and significant functional improvements seen in this study directly apply to your situation. Your genetics have been working against you, but this study proves you can work with them instead.'
};

const MOCK_CHAT_HISTORY = [
  {
    id: 'conv-1',
    title: 'Understanding MTHFR Variants',
    last_message: 'Thank you for explaining how my MTHFR variant affects folate metabolism. The methylfolate recommendation makes perfect sense now.',
    created_at: '2024-01-15T10:30:00Z',
    message_count: 8
  },
  {
    id: 'conv-2', 
    title: 'Optimizing Sleep with Magnesium',
    last_message: 'Should I take magnesium with or without food? And how long before I see improvements?',
    created_at: '2024-01-14T15:45:00Z',
    message_count: 12
  },
  {
    id: 'conv-3',
    title: 'Omega-3 Dosing Strategy',
    last_message: 'Based on my omega-3 index of 3.1%, what\'s the fastest way to reach optimal levels?',
    created_at: '2024-01-13T09:20:00Z',
    message_count: 6
  }
];

const MOCK_CHAT_MESSAGES = [
  {
    role: 'user',
    content: 'Why do I need methylfolate instead of regular folic acid?',
    timestamp: '2024-01-15T10:30:00Z'
  },
  {
    role: 'assistant',
    content: 'Great question! Your MTHFR C677T variant reduces the activity of the MTHFR enzyme by about 40%. This enzyme is responsible for converting folic acid into its active form (methylfolate). \n\nWhen you have this variant:\n- Regular folic acid gets "stuck" and can\'t be properly converted\n- This creates a functional folate deficiency even if blood levels look normal\n- Methylfolate bypasses this genetic bottleneck entirely\n\nThis explains why you might experience fatigue, brain fog, or mood issues despite "normal" folate levels. The methylfolate in your supplement plan directly addresses this genetic limitation.',
    timestamp: '2024-01-15T10:31:00Z'
  },
  {
    role: 'user', 
    content: 'How long before I notice improvements in my energy levels?',
    timestamp: '2024-01-15T10:35:00Z'
  },
  {
    role: 'assistant',
    content: 'Based on your specific profile and genetic variants, here\'s the expected timeline:\n\n**2-4 weeks:** Initial energy improvements as methylation pathways optimize\n**4-6 weeks:** More stable energy throughout the day\n**6-8 weeks:** Full cognitive enhancement and mood stabilization\n\nYour MTHFR variant means it may take slightly longer than average, but the methylfolate will start working immediately. The magnesium should improve your sleep quality within 1-2 weeks, which will also boost daytime energy.\n\nTrack your energy levels daily in the app - this helps us monitor progress and adjust if needed!',
    timestamp: '2024-01-15T10:36:00Z'
  }
];

const MOCK_TRACKING_STATS = {
  todayAdherence: 85,
  weeklyAverage: 78,
  currentStreak: 5,
  totalDays: 23
};

const MOCK_SYMPTOM_ENTRIES = [
  { symptom_name: 'Energy Levels', value: 6, entry_date: '2024-01-15' },
  { symptom_name: 'Brain Fog', value: 4, entry_date: '2024-01-15' },
  { symptom_name: 'Sleep Quality', value: 7, entry_date: '2024-01-15' },
  { symptom_name: 'Stress Levels', value: 5, entry_date: '2024-01-15' },
  { symptom_name: 'Mood', value: 7, entry_date: '2024-01-15' }
];

const MOCK_PRODUCT_HISTORY = [
  {
    id: 'analysis-1',
    product_name: 'Athletic Greens AG1',
    analyzed_at: '2024-01-14T14:30:00Z',
    overall_score: 72,
    recommendation: 'PROCEED WITH CAUTION'
  },
  {
    id: 'analysis-2', 
    product_name: 'Thorne Multi-Vitamin Elite',
    analyzed_at: '2024-01-12T11:15:00Z',
    overall_score: 89,
    recommendation: 'HIGHLY RECOMMENDED'
  },
  {
    id: 'analysis-3',
    product_name: 'Garden of Life Vitamin Code',
    analyzed_at: '2024-01-10T16:45:00Z', 
    overall_score: 45,
    recommendation: 'NOT RECOMMENDED'
  }
];

const MOCK_USER_STUDIES = [
  {
    id: 'study-1',
    study_title: 'Assessing Effects of l-Methylfolate in Depression Management: Results of a Real-World Patient Experience Trial',
    study_url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3869616/',
    pmid: 'PMC3869616',
    journal_name: 'Primary Care Companion for CNS Disorders',
    created_at: '2024-01-15T14:30:00Z',
    relevance_score: 10,
    personalized_summary: 'This study is EXTRAORDINARILY relevant to your profile, Alex. The researchers studied 554 patients with treatment-resistant depression who were given L-methylfolate supplementation. Your MTHFR C677T variant was specifically identified as a key factor that makes L-methylfolate dramatically more effective.',
    personalized_explanation: 'This study is essentially a blueprint for your exact genetic situation. Your MTHFR C677T variant reduces enzyme activity by 35%, and this research showed that L-methylfolate bypasses this genetic bottleneck entirely.',
    key_findings: [
      '67.9% of patients responded to L-methylfolate treatment',
      '45.7% achieved complete remission of depression',
      'Average 8.5-point reduction in depression scores',
      '15mg daily dose was most effective - exactly your current plan'
    ],
    actionable_recommendations: [
      'Continue your current 15mg L-methylfolate dosage',
      'Monitor homocysteine levels as biomarker',
      'Expect gradual improvements within 90 days',
      'Track progress using the app'
    ],
    limitations: [
      'Real-world study design less controlled than RCTs',
      'Self-reported outcomes rather than objective biomarkers',
      'No long-term follow-up beyond 90 days'
    ]
  },
  {
    id: 'study-2',
    study_title: 'MTHFR variants and psychiatric disorders: A meta-analysis',
    study_url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9433753/',
    pmid: 'PMC9433753',
    journal_name: 'Frontiers in Psychiatry',
    created_at: '2024-01-12T11:20:00Z',
    relevance_score: 9,
    personalized_summary: 'This comprehensive meta-analysis of 81 studies confirms that MTHFR variants like yours significantly increase risk of depression and treatment resistance.',
    personalized_explanation: 'The analysis found that people with MTHFR C677T variants have significantly higher rates of depression and respond better to methylated supplements.',
    key_findings: [
      'MTHFR variants increase depression risk by 19%',
      'Asian populations show stronger associations',
      'Methylation support crucial for treatment success'
    ],
    actionable_recommendations: [
      'Prioritize methylated B-vitamins',
      'Consider genetic counseling for family planning',
      'Monitor folate status regularly'
    ]
  },
  {
    id: 'study-3',
    study_title: 'Omega-3 fatty acids and inflammation in depression',
    study_url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7996954/',
    pmid: 'PMC7996954',
    journal_name: 'Nutrients',
    created_at: '2024-01-10T16:45:00Z',
    relevance_score: 8,
    personalized_summary: 'This review explains how your critically low omega-3 index (3.1%) contributes to neuroinflammation and depression symptoms.',
    personalized_explanation: 'Your omega-3 deficiency creates a pro-inflammatory state that impairs neurotransmitter function and mood regulation.',
    key_findings: [
      'Omega-3 deficiency linked to increased depression risk',
      'EPA particularly effective for mood symptoms',
      'Anti-inflammatory effects crucial for brain health'
    ],
    actionable_recommendations: [
      'Maintain high-dose omega-3 supplementation',
      'Focus on EPA-rich formulations',
      'Monitor inflammatory markers'
    ]
  }
];

// COMPREHENSIVE HEALTH DOMAINS MOCK DATA
const MOCK_HEALTH_DOMAINS = {
  userProfile: {
    name: 'Alex',
    goalDescription: 'overcome chronic fatigue and brain fog to perform better at work and feel energetic throughout the day',
    goals: ['energy', 'focus', 'stress', 'sleep']
  },
  crossDomainConnections: [
    'Your MTHFR variant affects methylation across multiple systems - linking energy, mood, and detoxification',
    'Low magnesium impacts both sleep quality and stress response, creating a fatigue cycle',
    'Omega-3 deficiency connects to both cognitive function and inflammatory markers',
    'High cortisol disrupts sleep, which further depletes B-vitamins needed for energy'
  ],
  priorityProtocols: [
    {
      protocol: 'Morning sunlight exposure (15 min within 1 hour of waking) + methylfolate supplementation',
      goalConnection: 'Directly supports energy & focus goals'
    },
    {
      protocol: 'Magnesium glycinate 400mg before bed + 4-7-8 breathing technique',
      goalConnection: 'Targets sleep quality & stress management'
    },
    {
      protocol: 'High-dose omega-3 (3g daily) + anti-inflammatory diet',
      goalConnection: 'Reduces brain fog & enhances mental clarity'
    },
    {
      protocol: 'Adaptogenic support (Rhodiola) + time-restricted eating (12hr window)',
      goalConnection: 'Balances cortisol & sustains energy levels'
    }
  ],
  domains: {
    metabolic: {
      title: 'Metabolic Health',
      subtitle: 'Energy production and cellular function',
      insights: [
        'Your MTHFR variant reduces methylation efficiency by 40%, directly impacting energy production',
        'Low magnesium affects 300+ enzymatic reactions including ATP synthesis',
        'Subclinical hypothyroidism (TSH 3.8) slows metabolic rate by 10-15%',
        'B-vitamin deficiencies create energy production bottlenecks at the cellular level'
      ],
      personalizedFindings: [
        'Your fatigue pattern (worse in afternoons) indicates mitochondrial dysfunction',
        'MTHFR variant explains why standard B-vitamins haven\'t helped your energy',
        'Low ferritin (28 ng/mL) limits oxygen delivery to cells, compounding fatigue'
      ],
      recommendations: [
        'Take methylated B-complex in morning for optimal energy production',
        'Support thyroid with selenium-rich foods (Brazil nuts, sardines)',
        'Time carbohydrates around physical activity for better glucose utilization',
        'Consider intermittent fasting to enhance mitochondrial efficiency'
      ],
      goalAlignment: 'Optimizing your metabolic health directly addresses your primary goal of overcoming chronic fatigue. The methylation support and thyroid optimization will provide sustained energy throughout your workday.'
    },
    cognitive: {
      title: 'Cognitive Health',
      subtitle: 'Brain function and mental clarity',
      insights: [
        'Omega-3 index of 3.1% is critically low - optimal brain function requires >8%',
        'Your COMT Met/Met variant causes dopamine to accumulate, affecting focus under stress',
        'Neuroinflammation from omega-3 deficiency directly causes brain fog',
        'High cortisol interferes with hippocampal function, impairing memory'
      ],
      personalizedFindings: [
        'Your brain fog worsens with stress due to slow COMT enzyme activity',
        'Caffeine sensitivity stems from your genetic dopamine metabolism',
        'Afternoon cognitive decline links to your metabolic inefficiencies'
      ],
      recommendations: [
        'High-dose EPA (2000mg) specifically targets neuroinflammation',
        'Limit caffeine to morning only, maximum 100mg (1 cup coffee)',
        'Practice stress-reduction techniques to manage dopamine buildup',
        'Use rhodiola for mental energy without overstimulation'
      ],
      goalAlignment: 'Addressing neuroinflammation and optimizing neurotransmitter balance will dramatically improve your focus and eliminate brain fog, helping you excel at work.'
    },
    hormonal: {
      title: 'Hormonal Balance',
      subtitle: 'Endocrine system optimization',
      insights: [
        'Elevated morning cortisol (18.2) indicates chronic stress response',
        'Thyroid function suboptimal despite "normal" TSH - affecting all hormones',
        'Magnesium deficiency impairs DHEA and testosterone production',
        'Poor sleep quality disrupts growth hormone release'
      ],
      personalizedFindings: [
        'Your "wired but tired" pattern classic for HPA axis dysfunction',
        'High cortisol depletes magnesium, creating vicious cycle',
        'Stress hormones override sex hormone production'
      ],
      recommendations: [
        'Rhodiola 300mg on empty stomach to modulate cortisol',
        'Magnesium glycinate 400mg for hormone synthesis support',
        'Implement consistent sleep schedule for hormone regulation',
        'Consider ashwagandha if rhodiola proves too stimulating'
      ],
      goalAlignment: 'Balancing your stress hormones will improve both energy levels and sleep quality, breaking the fatigue cycle that\'s affecting your work performance.'
    },
    nutritional: {
      title: 'Nutritional Status',
      subtitle: 'Micronutrient optimization',
      insights: [
        'Multiple deficiencies create compound effects on energy and cognition',
        'Your genetic variants increase needs for specific nutrient forms',
        'Standard supplements ineffective due to absorption/conversion issues',
        'Nutrient deficiencies interconnected - addressing one affects others'
      ],
      personalizedFindings: [
        'Vitamin D deficiency (22 ng/mL) impacts 3000+ genes including energy',
        'Your genetics require activated B-vitamins, not standard forms',
        'Low omega-3 and magnesium create inflammation cascade'
      ],
      recommendations: [
        'Prioritize bioavailable forms: methylfolate, methylcobalamin, P5P',
        'Vitamin D3 5000IU with K2 for proper utilization',
        'Focus on nutrient-dense whole foods over processed options',
        'Time supplements appropriately for optimal absorption'
      ],
      goalAlignment: 'Correcting your specific nutrient deficiencies with the right forms will provide the raw materials needed for sustained energy and mental clarity.'
    },
    lifestyle: {
      title: 'Lifestyle Factors',
      subtitle: 'Daily habits and routines',
      insights: [
        'Poor sleep quality multiplies effects of all other imbalances',
        'Chronic stress depletes nutrients faster than you can replace them',
        'Sedentary work life reduces mitochondrial efficiency',
        'Irregular meal timing disrupts circadian rhythm and energy'
      ],
      personalizedFindings: [
        'Your 6-hour sleep average insufficient for recovery',
        'High stress job interacts poorly with COMT variant',
        'Limited exercise reduces cellular energy production'
      ],
      recommendations: [
        'Prioritize 7-8 hours sleep with consistent schedule',
        'Morning sunlight exposure within first hour of waking',
        'Brief movement breaks every hour during work',
        'Stress management crucial for your genetic profile'
      ],
      goalAlignment: 'Optimizing these lifestyle factors will amplify the benefits of your supplements and nutrition, creating sustainable energy and focus for your demanding work schedule.'
    }
  },
  conflictCheck: 'All recommendations have been verified for safety and synergy. No conflicts detected between protocols.'
};

const mockSupplementPlan = {
  recommendations: [
    {
      supplement: 'Methyl B-Complex',
      dosage: '1 capsule daily',
      timing: 'Take your complete daily pack with breakfast',
      reason: `Alex, your MTHFR A1298C variant (rs1801131) means your body has been struggling to process regular B vitamins, which explains so much about your chronic fatigue and brain fog. This methylated B-complex bypasses your genetic limitation, providing the exact activated forms your cells desperately need. With your B12 at only 245 pg/mL (optimal is 500+), this will help restore your energy production pathways and clear that mental fog you've been fighting. Many of our users with MTHFR variants report feeling "like themselves again" within 2-3 weeks.`,
      confidence_score: 98,
      notes: 'This is the cornerstone of your recovery - your genetics have been working against you, but we are about to change that.',
      product: {
        id: 'methyl-b-complex',
        brand: 'SupplementScribe',
        product_name: 'Methylated B-Complex',
        product_url: '#',
        price: 24.99
      }
    },
    {
      supplement: 'Omega 3',
      dosage: '2000 mg daily',
      timing: 'Take your complete daily pack with breakfast',
      reason: `Your omega-3 index of 3.1% is critically low (optimal is 8-12%), which is directly contributing to your inflammation markers and brain fog. This high-quality EPA/DHA blend will reduce your systemic inflammation, support your neurotransmitter production, and help stabilize your mood swings. With your CRP at 4.2 mg/L indicating significant inflammation, omega-3s are essential for bringing your body back into balance. Most importantly, they'll help your brain cells communicate properly again.`,
      confidence_score: 95,
      notes: 'Essential for reducing inflammation and supporting brain health - expect clearer thinking within 4-6 weeks.',
      product: {
        id: 'omega-3',
        brand: 'SupplementScribe',
        product_name: 'Ultra-Pure Omega-3',
        product_url: '#',
        price: 29.99
      }
    },
    {
      supplement: 'Magnesium',
      dosage: '400 mg daily',
      timing: 'Take your complete daily pack with breakfast',
      reason: `Your magnesium at 1.6 mg/dL is below optimal (1.8-2.4), and this deficiency is likely why you're experiencing poor sleep quality, anxiety, and muscle tension. Magnesium is involved in over 300 enzymatic reactions in your body, including energy production and nervous system regulation. For someone with your COMT Val158Met variant, magnesium is especially critical as it helps regulate dopamine and norepinephrine. This will help calm your overactive stress response and finally give you the restorative sleep your body needs.`,
      confidence_score: 96,
      notes: 'The master mineral for relaxation and energy - most people notice better sleep within the first week.',
      product: {
        id: 'magnesium',
        brand: 'SupplementScribe',
        product_name: 'Magnesium Glycinate',
        product_url: '#',
        price: 22.99
      }
    },
    {
      supplement: 'Vitamin D',
      dosage: '5000 IU daily',
      timing: 'Take your complete daily pack with breakfast',
      reason: `Your vitamin D level of 22 ng/mL is significantly deficient (optimal is 40-60), which explains your fatigue, mood issues, and weakened immune system. This deficiency is affecting every cell in your body, from energy production to mood regulation. With your family history of autoimmune conditions and your current inflammatory state, optimizing vitamin D is crucial for immune system balance. Studies show that correcting vitamin D deficiency can improve energy levels by up to 50% in chronically fatigued individuals.`,
      confidence_score: 97,
      notes: 'Critical for energy, mood, and immune function - you should feel more energetic within 3-4 weeks.',
      product: {
        id: 'vitamin-d',
        brand: 'SupplementScribe',
        product_name: 'Vitamin D3 5000',
        product_url: '#',
        price: 19.99
      }
    },
    {
      supplement: 'CoQ10',
      dosage: '100 mg daily',
      timing: 'Take your complete daily pack with breakfast',
      reason: `Your chronic fatigue pattern suggests mitochondrial dysfunction - your cells' power plants aren't producing energy efficiently. CoQ10 is essential for cellular energy production, and with your elevated oxidative stress markers, it will also provide powerful antioxidant protection. This is especially important given your brain fog and physical exhaustion. Clinical studies show CoQ10 can improve energy levels by 30-40% in people with chronic fatigue. Think of this as upgrading your cellular batteries.`,
      confidence_score: 92,
      notes: 'Powers up your cellular energy factories - expect gradual but significant energy improvements.',
      product: {
        id: 'coq10',
        brand: 'SupplementScribe',
        product_name: 'CoQ10 Ubiquinol',
        product_url: '#',
        price: 34.99
      }
    },
    {
      supplement: 'Ashwagandha',
      dosage: '300 mg daily',
      timing: 'Take your complete daily pack with breakfast',
      reason: `Your cortisol patterns and chronic stress are keeping your body in constant "fight or flight" mode, which is exhausting your energy reserves and disrupting your sleep. Ashwagandha is a powerful adaptogen that will help normalize your stress response, reduce anxiety, and improve your resilience. With your COMT variant making you more sensitive to stress, this herb will help buffer those effects. Studies show ashwagandha can reduce cortisol by 30% and significantly improve sleep quality - exactly what your overtaxed system needs.`,
      confidence_score: 90,
      notes: "Nature's stress shield - helps your body adapt and recover from chronic stress.",
      product: {
        id: 'ashwagandha',
        brand: 'SupplementScribe',
        product_name: 'KSM-66 Ashwagandha',
        product_url: '#',
        price: 26.99
      }
    }
  ],
  general_notes: 'This personalized pack addresses your root causes: MTHFR methylation issues, critically low omega-3s, vitamin D deficiency, and chronic inflammation. Take your complete daily pack with breakfast for optimal absorption and compliance.',
  contraindications: 'No interactions detected. Safe to take with your current medications. Monitor energy levels as they improve - you may need less caffeine.',
  created_at: new Date().toISOString()
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(MOCK_PLAN);
  const [dietPlan, setDietPlan] = useState<any>(MOCK_DIET_PLAN);
  const [isGeneratingDiet, setIsGeneratingDiet] = useState(false);
  const [user, setUser] = useState<any>(MOCK_USER);
  const [profile, setProfile] = useState<any>(MOCK_PROFILE);
  // REMOVED: uploadedFiles state (legacy file upload functionality)
  const [selectedSupplement, setSelectedSupplement] = useState<any>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [extractedData, setExtractedData] = useState({ biomarkers: 0, snps: 0 });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [biomarkersData, setBiomarkersData] = useState<any[]>([]);
  const [snpsData, setSnpsData] = useState<any[]>([]);
  const [userConditions, setUserConditions] = useState<any[]>([]);
  const [userAllergies, setUserAllergies] = useState<any[]>([]);
  const [expandedBiomarkers, setExpandedBiomarkers] = useState<Set<number>>(new Set());
  const [expandedSnps, setExpandedSnps] = useState<Set<number>>(new Set());
  const [biomarkersExpanded, setBiomarkersExpanded] = useState(false);
  const [snpsExpanded, setSnpsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Product Checker state
  const [productUrl, setProductUrl] = useState('');
  const [isCheckingProduct, setIsCheckingProduct] = useState(false);
  const [productAnalysis, setProductAnalysis] = useState<any>(null);
  const [productCheckError, setProductCheckError] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [productHistory, setProductHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // AI Chat state
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  

  
  // Study Buddy state
  const [studyUrl, setStudyUrl] = useState('https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3869616/');
  const [isAnalyzingStudy, setIsAnalyzingStudy] = useState(false);
  const [studyAnalysis, setStudyAnalysis] = useState<any>(MOCK_STUDY_ANALYSIS);
  const [studyError, setStudyError] = useState<string | null>(null);

  const [userStudies, setUserStudies] = useState<any[]>(MOCK_USER_STUDIES);
  const [selectedStudy, setSelectedStudy] = useState<any>(null);
  const [isLoadingStudies, setIsLoadingStudies] = useState(false);
  
  // Tracking state
  const [activeTrackingTab, setActiveTrackingTab] = useState<'symptoms' | 'supplements' | 'custom'>('symptoms');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [symptomEntries, setSymptomEntries] = useState<any[]>([]);
  const [supplementEntries, setSupplementEntries] = useState<any[]>([]);
  const [adherenceStats, setAdherenceStats] = useState({
    todayAdherence: 0,
    weeklyAverage: 0,
    currentStreak: 0
  });
  const [customSymptoms, setCustomSymptoms] = useState<string[]>([]);
  const [newCustomSymptom, setNewCustomSymptom] = useState('');
  const [individualSupplementStatus, setIndividualSupplementStatus] = useState<{[key: string]: boolean}>({});
  
  // Symptom modal state
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<any>(null);

  // Simple tracking state - no constant reloading
  const [dailySupplementsTaken, setDailySupplementsTaken] = useState(false);
  const [symptomRatings, setSymptomRatings] = useState<{[key: string]: number}>({});
  const [hasLoadedToday, setHasLoadedToday] = useState(false);
  
  // Referral state
  const [copiedReferralCode, setCopiedReferralCode] = useState(false);
  const [copiedReferralUrl, setCopiedReferralUrl] = useState(false);
  
  // Subscription management state
  const [subscriptionOrders, setSubscriptionOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [nextDeliveryDate, setNextDeliveryDate] = useState<string | null>(null);
  
  // Share graphics state
  const [showShareGraphics, setShowShareGraphics] = useState(false);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'supplement-plan', icon: Pill, label: 'Supplement Plan' },
    { id: 'diet-groceries', icon: Apple, label: 'Diet & Groceries' },
    { id: 'analysis', icon: BarChart3, label: 'Comprehensive Analysis' },
    { id: 'tracking', icon: Activity, label: 'Tracking' },
    { id: 'ai-chat', icon: MessageSquare, label: 'AI Chat' },
    { id: 'product-checker', icon: Search, label: 'Product Checker' },
    { id: 'study-buddy', icon: BookOpen, label: 'Study Buddy' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  // Automatically scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const router = useRouter();

  // Load comprehensive analysis for biomarkers and SNPs
  const { biomarkerAnalysis, snpAnalysis, loading: analysisLoading, computing: analysisComputing, triggerRecomputation } = useComprehensiveAnalysis(
    biomarkersData,
    snpsData
  );

  // Enhanced analysis system
  const { 
    results: enhancedResults, 
    resultsByCategory, 
    priorityItems, 
    categoryStats, 
    userContext, 
    summary, 
    loading: enhancedLoading, 
    error: enhancedError,
    refetch: refetchEnhanced
  } = useEnhancedAnalysis();

  // Add search and filter states
  const [biomarkerSearch, setBiomarkerSearch] = useState('');
  const [snpSearch, setSnpSearch] = useState('');
  const [biomarkerFilter, setBiomarkerFilter] = useState<'all' | 'normal' | 'attention' | 'analyzed'>('all');
  const [snpFilter, setSnpFilter] = useState<'all' | 'low' | 'moderate' | 'high' | 'analyzed'>('all');
  const [biomarkerPage, setBiomarkerPage] = useState(1);
  const [snpPage, setSnpPage] = useState(1);
  const [biomarkersPerPage] = useState(10);
  const [snpsPerPage] = useState(15);

  // Health domains analysis state
  const [domainsData, setDomainsData] = useState<any>(null);
  const [domainsLoading, setDomainsLoading] = useState(false);
  const [domainsError, setDomainsError] = useState<string | null>(null);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

  // Filter and search functions - for comprehensive analysis, only show key markers
  const filteredBiomarkers = biomarkersData.filter(biomarker => {
    const analysis = biomarkerAnalysis[biomarker.marker_name?.toLowerCase()?.replace(/\s+/g, '_')] || {};
    const cleanName = biomarker.marker_name?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Marker';
    
    // For comprehensive analysis, only show key biomarkers
    const isKeyBiomarker = KEY_BIOMARKERS.some(key => {
      const cleanBioName = biomarker.marker_name?.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const cleanKeyName = key.toLowerCase();
      return cleanBioName?.includes(cleanKeyName) || cleanKeyName.includes(cleanBioName?.substring(0, 5) || '');
    });
    
    if (!isKeyBiomarker) return false;
    
    // Search filter
    const matchesSearch = cleanName.toLowerCase().includes(biomarkerSearch.toLowerCase()) ||
                         (biomarker.value && biomarker.value.toString().toLowerCase().includes(biomarkerSearch.toLowerCase()));
    
    // Status filter
    const matchesFilter = biomarkerFilter === 'all' || 
                         (biomarkerFilter === 'normal' && (analysis.statusColor === 'green' || !analysis.statusColor)) ||
                         (biomarkerFilter === 'attention' && (analysis.statusColor === 'yellow' || analysis.statusColor === 'red')) ||
                         (biomarkerFilter === 'analyzed' && analysis.interpretation);
    
    return matchesSearch && matchesFilter;
  });

  const filteredSnps = snpsData.filter(snp => {
    const gene = snp.supported_snps?.gene || snp.gene_name || 'Unknown';
    const rsid = snp.supported_snps?.rsid || snp.snp_id || 'Unknown';
    const analysis = snpAnalysis[`${gene} (${rsid})`] || {};
    
    // For comprehensive analysis, only show key SNPs
    const isKeySNP = KEY_SNPS.some(key => {
      return gene.toUpperCase() === key.toUpperCase();
    });
    
    if (!isKeySNP) return false;
    
    // Search filter
    const matchesSearch = gene.toLowerCase().includes(snpSearch.toLowerCase()) ||
                         rsid.toLowerCase().includes(snpSearch.toLowerCase()) ||
                         (snp.genotype && snp.genotype.toLowerCase().includes(snpSearch.toLowerCase()));
    
    // Risk filter
    const matchesFilter = snpFilter === 'all' ||
                         (snpFilter === 'low' && (analysis.riskColor === 'green' || !analysis.riskColor)) ||
                         (snpFilter === 'moderate' && analysis.riskColor === 'orange') ||
                         (snpFilter === 'high' && analysis.riskColor === 'red') ||
                         (snpFilter === 'analyzed' && analysis.variantEffect);
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const paginatedBiomarkers = filteredBiomarkers.slice(
    (biomarkerPage - 1) * biomarkersPerPage,
    biomarkerPage * biomarkersPerPage
  );

  const paginatedSnps = filteredSnps.slice(
    (snpPage - 1) * snpsPerPage,
    snpPage * snpsPerPage
  );

  const totalBiomarkerPages = Math.ceil(filteredBiomarkers.length / biomarkersPerPage);
  const totalSnpPages = Math.ceil(filteredSnps.length / snpsPerPage);

  // Toggle functions for expanded cards
  const toggleBiomarkerExpanded = (index: number) => {
    const newExpanded = new Set(expandedBiomarkers);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedBiomarkers(newExpanded);
  };

  const toggleSnpExpanded = (index: number) => {
    const newExpanded = new Set(expandedSnps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSnps(newExpanded);
  };

  // Toggle domain expansion
  const toggleDomain = (domainKey: string) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domainKey)) {
      newExpanded.delete(domainKey);
    } else {
      newExpanded.add(domainKey);
    }
    setExpandedDomains(newExpanded);
  };

  useEffect(() => {
    // MOCK DATA LOADER - No API calls, just set mock data
    const loadMockData = () => {
      setIsLoading(true);
      
      // Simulate loading time
      setTimeout(() => {
        setUser(MOCK_USER);
        setProfile(MOCK_PROFILE);
        setPlan(MOCK_PLAN);
        setDietPlan(MOCK_DIET_PLAN);
        setBiomarkersData(MOCK_BIOMARKERS);
        setSnpsData(MOCK_SNPS);
        setExtractedData({ biomarkers: MOCK_BIOMARKERS.length, snps: MOCK_SNPS.length });
        setUserConditions([]);
        setUserAllergies([]);
        
        // Set comprehensive mock data for all features
        setProductAnalysis(MOCK_PRODUCT_ANALYSIS);
        setStudyAnalysis(MOCK_STUDY_ANALYSIS);
        setChatHistory(MOCK_CHAT_HISTORY);
        setChatMessages(MOCK_CHAT_MESSAGES);
        setAdherenceStats(MOCK_TRACKING_STATS);
        setSymptomEntries(MOCK_SYMPTOM_ENTRIES);
        setProductHistory(MOCK_PRODUCT_HISTORY);
        setUserStudies(MOCK_USER_STUDIES);
        
        // Set realistic tracking data
        setSymptomRatings({
          'Energy Levels': 6,
          'Brain Fog': 4, 
          'Sleep Quality': 7,
          'Stress Levels': 5,
          'Mood': 7
        });
        setDailySupplementsTaken(true);
        
        setIsLoading(false);
      }, 2000);
    };
    
    loadMockData();
  }, []);

  // DISABLED FOR DEMO - Load health domains analysis
  useEffect(() => {
    // Mock health domains data - no API calls
            setDomainsData(MOCK_HEALTH_DOMAINS);
  }, [user]);

  // DISABLED FOR DEMO - Load subscription orders for full subscription users
  useEffect(() => {
    // Mock subscription data - no API calls
  }, [profile]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const generatePlan = async () => {
    // MOCK FUNCTION - No API calls, just demo behavior
    setIsGenerating(true);
    setTimeout(() => {
      setPlan(MOCK_PLAN);
      setActiveTab('supplement-plan');
      setIsGenerating(false);
    }, 1000);
  };

  const generateDietPlan = async () => {
    // MOCK FUNCTION - No API calls, just demo behavior
    setIsGeneratingDiet(true);
    setTimeout(() => {
      setDietPlan(MOCK_DIET_PLAN);
      setActiveTab('diet-groceries');
      setIsGeneratingDiet(false);
    }, 1000);
  };

  // Tracking functions - simplified and efficient
  const loadTrackingData = async () => {
    if (hasLoadedToday && selectedDate === new Date().toISOString().split('T')[0]) {
      return; // Don't reload if we already have today's data
    }

    setIsTrackingLoading(true);
    try {
      // Load symptoms for the selected date
      const symptomsResponse = await fetch(`/api/tracking/symptoms?date=${selectedDate}`, {
        credentials: 'include'
      });
      
      if (symptomsResponse.ok) {
        const symptomsData = await symptomsResponse.json();
        console.log('Symptoms API response:', symptomsData);
        
        const { symptoms } = symptomsData;
        const ratingsMap: {[key: string]: number} = {};
        
        if (symptoms && Array.isArray(symptoms)) {
        // ✅ Keep any here - symptom data structure varies from API
        symptoms.forEach((symptom: any) => {
            if (symptom.symptom_name && symptom.value) {
          ratingsMap[symptom.symptom_name] = symptom.value;
            }
        });
        } else {
          console.warn('Symptoms data is not an array:', symptoms);
        }
        
        setSymptomRatings(ratingsMap);
      } else {
        console.error('Failed to load symptoms:', symptomsResponse.status, symptomsResponse.statusText);
      }

      // Load supplements for the selected date
      const supplementsResponse = await fetch(`/api/tracking/supplements?date=${selectedDate}`, {
        credentials: 'include'
      });
      
      if (supplementsResponse.ok) {
        const supplementsData = await supplementsResponse.json();
        console.log('Supplements API response:', supplementsData);
        
        const { supplements } = supplementsData;
        
        if (supplements && Array.isArray(supplements)) {
        // ✅ Keep any here - supplement data structure varies from API
        const allTaken = supplements.length > 0 && supplements.every((s: any) => s.taken);
        setDailySupplementsTaken(allTaken);
        } else {
          console.warn('Supplements data is not an array:', supplements);
          setDailySupplementsTaken(false);
        }
      } else {
        console.error('Failed to load supplements:', supplementsResponse.status, supplementsResponse.statusText);
        setDailySupplementsTaken(false);
      }

      if (selectedDate === new Date().toISOString().split('T')[0]) {
        setHasLoadedToday(true);
      }
    } catch (error) {
      console.error('Error loading tracking data:', error);
      // Reset states on error
      setSymptomRatings({});
      setDailySupplementsTaken(false);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const logSymptom = async (symptomName: string, value: number) => {
    // Update UI immediately - no waiting
    setSymptomRatings(prev => ({
      ...prev,
      [symptomName]: value
    }));

    // Save to database in background
    try {
      await fetch('/api/tracking/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          symptom_name: symptomName,
          value,
          entry_date: selectedDate
        })
      });
    } catch (error) {
      console.error('Error saving symptom:', error);
      // Revert on error
      setSymptomRatings(prev => {
        const newRatings = { ...prev };
        delete newRatings[symptomName];
        return newRatings;
      });
    }
  };

  const toggleSupplements = async (taken: boolean) => {
    // Update UI immediately
    setDailySupplementsTaken(taken);

    // Save to database in background
    if (plan?.recommendations?.length > 0) {
      try {
        // ✅ Keep any here - recommendation structure varies from AI plan generation
        const promises = plan.recommendations.map((rec: any) =>
          fetch('/api/tracking/supplements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              supplement_name: rec.supplement,
              dosage: rec.dosage,
              taken,
              entry_date: selectedDate
            })
          })
        );
        await Promise.all(promises);
      } catch (error) {
        console.error('Error saving supplements:', error);
        // Revert on error
        setDailySupplementsTaken(!taken);
      }
    }
  };

  const toggleIndividualSupplement = async (supplementName: string, taken: boolean) => {
    // Update UI immediately
    setIndividualSupplementStatus(prev => ({
      ...prev,
      [supplementName]: taken
    }));

    // Save to database in background
    try {
      await fetch('/api/tracking/supplements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          supplement_name: supplementName,
          taken,
          entry_date: selectedDate
        })
      });
    } catch (error) {
      console.error('Error saving individual supplement:', error);
      // Revert on error
      setIndividualSupplementStatus(prev => ({
        ...prev,
        [supplementName]: !taken
      }));
    }
  };

  const addCustomSymptom = () => {
    if (newCustomSymptom.trim() && !customSymptoms.includes(newCustomSymptom.trim())) {
      setCustomSymptoms(prev => [...prev, newCustomSymptom.trim()]);
      setNewCustomSymptom('');
    }
  };

  const removeCustomSymptom = (symptomToRemove: string) => {
    setCustomSymptoms(prev => prev.filter(s => s !== symptomToRemove));
    // Also remove from ratings
    setSymptomRatings(prev => {
      const newRatings = { ...prev };
      delete newRatings[symptomToRemove];
      return newRatings;
    });
  };

  // Load tracking data when tracking tab becomes active
  useEffect(() => {
    if (activeTab === 'tracking') {
      loadTrackingData();
    }
  }, [activeTab, selectedDate]);

  // Study Buddy functions
  const analyzeStudy = async () => {
    // MOCK FUNCTION - No API calls, just demo behavior
    if (!studyUrl.trim()) {
      setStudyError('Please enter a study URL');
      return;
    }
    
    setIsAnalyzingStudy(true);
    setStudyAnalysis(null);
    setStudyError(null);

    // Simulate analysis time
    setTimeout(() => {
      setStudyAnalysis(MOCK_STUDY_ANALYSIS);
      setStudyUrl('');
      setIsAnalyzingStudy(false);
    }, 4000);
  };

  const loadUserStudies = async () => {
    // MOCK FUNCTION - No API calls, just demo behavior
    setIsLoadingStudies(true);
    
    // Simulate loading time
    setTimeout(() => {
      setUserStudies(MOCK_USER_STUDIES);
      setIsLoadingStudies(false);
    }, 1000);
  };

  // Load studies when Study Buddy tab becomes active
  useEffect(() => {
    if (activeTab === 'study-buddy') {
      loadUserStudies();
    }
  }, [activeTab]);

  const cleanProductName = (productName: string | undefined) => {
    // Handle undefined/null productName
    if (!productName) {
      return '';
    }
    // Remove "OK Capsule" prefix if present
    if (productName.startsWith('OK Capsule ')) {
      return productName.replace('OK Capsule ', '');
    }
    return productName;
  };

  const renderDashboardContent = () => (
    <div className="space-y-4 lg:space-y-6">
      {/* Compact Welcome Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-dark-primary tracking-tight">Dashboard</h1>
        <p className="text-dark-secondary mt-1">Your personalized health insights and recommendations.</p>
      </div>

      {/* Onboarding Banner - Show if profile is incomplete */}
      {!profile && (
        <motion.div 
          className="bg-gradient-to-r from-dark-accent/20 to-blue-900/20 border border-dark-accent/50 rounded-xl p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-dark-accent/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-dark-accent" />
              </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-dark-primary mb-1">
                Complete Your Health Profile
              </h3>
              <p className="text-dark-secondary text-sm">
                Unlock personalized AI recommendations by completing your health onboarding.
              </p>
            </div>
            <Button 
              onClick={() => router.push('/onboarding')}
              className="bg-dark-accent text-white hover:bg-dark-accent/80 transition-all duration-300 px-4"
              size="sm"
            >
              Complete Setup
            </Button>
          </div>
        </motion.div>
      )}

      {/* Main Content - Mobile-friendly Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        {/* Health Score - Takes up 3/5 on desktop, full width on mobile */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <div className="h-full">
            {/* Mock Health Score Card - No API Calls */}
            <Card className="bg-dark-panel border-dark-border h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-dark-primary flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-dark-accent" />
                      Health Score
                    </CardTitle>
                    <CardDescription className="text-dark-secondary">
                      AI-powered health assessment
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Score Display */}
                <div className="text-center">
            <div className="relative">
                    <div className="relative inline-flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-4 border-dark-border shadow-2xl">
                      <div className="text-center z-10">
                        <motion.div 
                          className="text-5xl font-bold text-blue-400"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          73
                        </motion.div>
                        <div className="text-xs text-dark-secondary font-medium uppercase tracking-wider">
                          Good
              </div>
                      </div>
                    </div>
                    <div className="flex justify-center mt-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                        Good Health
                      </span>
                    </div>
                  </div>
                  <motion.p 
                    className="text-dark-secondary text-sm mt-4 max-w-md mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    At 34, Alex Thompson faces chronic fatigue and brain fog challenges, compounded by a sedentary lifestyle. Her low omega-3 levels and vitamin deficiencies, along with MTHFR genetic variants, highlight areas needing attention.
                  </motion.p>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-dark-primary mb-4 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-dark-accent" />
                    Score Breakdown
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="bg-dark-background rounded-lg p-3 border border-dark-border hover:border-dark-accent/50 transition-all duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-dark-accent/10 rounded-lg">
                            <Heart className="h-3 w-3 text-dark-accent" />
                          </div>
                          <span className="text-xs font-medium text-dark-primary">Lifestyle Habits</span>
                        </div>
                        <span className="text-xs font-bold text-yellow-400">15/25</span>
                      </div>
                      <div className="w-full bg-dark-border rounded-full h-1.5">
                        <motion.div
                          className="h-1.5 rounded-full bg-yellow-400 shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: '60%' }}
                          transition={{ duration: 1.2, delay: 0.8 }}
                        />
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-dark-background rounded-lg p-3 border border-dark-border hover:border-dark-accent/50 transition-all duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-dark-accent/10 rounded-lg">
                            <Zap className="h-3 w-3 text-dark-accent" />
                          </div>
                          <span className="text-xs font-medium text-dark-primary">Symptom Burden</span>
                        </div>
                        <span className="text-xs font-bold text-yellow-400">16/25</span>
                      </div>
                      <div className="w-full bg-dark-border rounded-full h-1.5">
                        <motion.div
                          className="h-1.5 rounded-full bg-yellow-400 shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: '64%' }}
                          transition={{ duration: 1.2, delay: 0.9 }}
                        />
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-dark-background rounded-lg p-3 border border-dark-border hover:border-dark-accent/50 transition-all duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-dark-accent/10 rounded-lg">
                            <Activity className="h-3 w-3 text-dark-accent" />
                          </div>
                          <span className="text-xs font-medium text-dark-primary">Physical Wellness</span>
                        </div>
                        <span className="text-xs font-bold text-green-400">20/25</span>
                      </div>
                      <div className="w-full bg-dark-border rounded-full h-1.5">
                        <motion.div
                          className="h-1.5 rounded-full bg-green-400 shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: '80%' }}
                          transition={{ duration: 1.2, delay: 1.0 }}
                        />
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-dark-background rounded-lg p-3 border border-dark-border hover:border-dark-accent/50 transition-all duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-dark-accent/10 rounded-lg">
                            <Shield className="h-3 w-3 text-dark-accent" />
                          </div>
                          <span className="text-xs font-medium text-dark-primary">Risk Factors</span>
                        </div>
                        <span className="text-xs font-bold text-blue-400">18/25</span>
                      </div>
                      <div className="w-full bg-dark-border rounded-full h-1.5">
                        <motion.div
                          className="h-1.5 rounded-full bg-blue-400 shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: '72%' }}
                          transition={{ duration: 1.2, delay: 1.1 }}
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Quick Insights */}
                <div className="grid md:grid-cols-2 gap-4">
                  <motion.div 
                    className="bg-green-500/5 rounded-lg p-4 border border-green-500/20"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-green-500/20 rounded-lg">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      </div>
                      <span className="text-sm font-semibold text-green-400">Your Strengths</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 text-xs mt-1">▪</span>
                        <p className="text-xs text-dark-primary font-medium leading-relaxed">
                          Strong awareness of health issues and motivation to improve
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 text-xs mt-1">▪</span>
                        <p className="text-xs text-dark-primary font-medium leading-relaxed">
                          No major chronic diseases or serious conditions
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 text-xs mt-1">▪</span>
                        <p className="text-xs text-dark-primary font-medium leading-relaxed">
                          Good hydration habits and moderate caffeine intake
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-yellow-500/5 rounded-lg p-4 border border-yellow-500/20"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                        <AlertTriangle className="h-3 w-3 text-yellow-400" />
                      </div>
                      <span className="text-sm font-semibold text-yellow-400">Focus Areas</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-400 text-xs mt-1">▪</span>
                        <p className="text-xs text-dark-primary font-medium leading-relaxed">
                          Chronic fatigue and brain fog affecting daily performance
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-400 text-xs mt-1">▪</span>
                        <p className="text-xs text-dark-primary font-medium leading-relaxed">
                          Multiple nutrient deficiencies (D, B12, omega-3, magnesium)
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-400 text-xs mt-1">▪</span>
                        <p className="text-xs text-dark-primary font-medium leading-relaxed">
                          MTHFR genetic variant affecting methylation pathways
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* View Details Button */}
                <Button
                  onClick={() => setActiveTab('analysis')}
                  className="w-full bg-dark-accent text-white hover:bg-dark-accent/80"
                >
                  View Detailed Analysis
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar - Takes up 2/5 on desktop, full width on mobile, appears first on mobile */}
        <div className="lg:col-span-2 space-y-3 lg:space-y-4 order-1 lg:order-2">
          {/* Quick Supplements Count */}
          <div className="bg-dark-panel border border-dark-border rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-dark-border rounded-lg">
                <Pill className="h-4 w-4 text-dark-accent" />
            </div>
            <div>
                <p className="text-dark-secondary text-sm">Active Supplements</p>
                <p className="text-xl font-bold text-dark-primary">{plan?.recommendations?.length || 0}</p>
            </div>
            </div>
          </div>

          {/* Supplement Plan Panel - Compact */}
          <div className="bg-dark-panel rounded-xl p-3 border border-dark-border">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-dark-secondary" />
              <h3 className="text-sm font-semibold text-dark-primary">AI-Powered Plan</h3>
            </div>
            <div className="py-1">
              {plan ? (
                <div className="space-y-2 text-center">
                  <div className="w-8 h-8 bg-green-900/50 rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-dark-secondary text-xs">Plan ready</p>
                  <Button 
                    onClick={() => setActiveTab('supplement-plan')}
                    size="sm"
                    className="w-full bg-dark-accent text-white hover:bg-dark-accent/80 rounded-lg text-xs py-1"
                  >
                    View Plan
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <div className="w-8 h-8 bg-dark-border rounded-full mx-auto flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-dark-accent" />
                  </div>
                  <p className="text-dark-secondary text-xs">No plan yet</p>
                  <Button 
                    onClick={generatePlan} 
                    disabled={isGenerating}
                    size="sm"
                    className="w-full text-xs py-1"
                  >
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Diet Plan Panel - Compact */}
          <div className="bg-dark-panel rounded-xl p-3 border border-dark-border">
            <div className="flex items-center gap-2 mb-2">
              <Apple className="h-4 w-4 text-dark-secondary" />
              <h3 className="text-sm font-semibold text-dark-primary">Whole Food Diet Plan</h3>
            </div>
            <div className="py-1">
              {dietPlan ? (
                <div className="space-y-2 text-center">
                  <div className="w-8 h-8 bg-green-900/50 rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-dark-secondary text-xs">Diet ready</p>
                  <Button 
                    onClick={() => setActiveTab('diet-groceries')}
                    size="sm"
                    className="w-full bg-dark-accent text-white hover:bg-dark-accent/80 rounded-lg text-xs py-1"
                  >
                    View Diet
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <div className="w-8 h-8 bg-dark-border rounded-full mx-auto flex items-center justify-center">
                    <Apple className="h-4 w-4 text-dark-accent" />
                  </div>
                  <p className="text-dark-secondary text-xs">No diet yet</p>
                  <Button 
                    onClick={generateDietPlan} 
                    disabled={isGeneratingDiet}
                    size="sm"
                    className="w-full text-xs py-1"
                  >
                    {isGeneratingDiet ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions - Vertical Stack */}
          <div className="space-y-2">
            <motion.div 
              className="bg-dark-panel border border-dark-border rounded-lg p-3 hover:border-dark-accent/50 transition-all cursor-pointer"
              onClick={() => setActiveTab('analysis')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-dark-primary">Analysis</h3>
                  <p className="text-dark-secondary text-xs">Health domains</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-dark-panel border border-dark-border rounded-lg p-3 hover:border-dark-accent/50 transition-all cursor-pointer"
              onClick={() => setActiveTab('tracking')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-500/10 rounded-lg">
                  <Activity className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-dark-primary">Tracking</h3>
                  <p className="text-dark-secondary text-xs">Log progress</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-dark-panel border border-dark-border rounded-lg p-3 hover:border-dark-accent/50 transition-all cursor-pointer"
              onClick={() => setActiveTab('ai-chat')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-500/10 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-dark-primary">AI Chat</h3>
                  <p className="text-dark-secondary text-xs">Get advice</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupplementPlan = () => (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Header */}
      <div className="relative bg-dark-panel border border-dark-border rounded-xl p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-dark-primary mb-2">
              Your Personalized Supplement Plan
            </h1>
            <p className="text-base lg:text-lg text-dark-secondary">
              AI-powered recommendations based on your unique health data
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-3">
            {plan && (
              <Button 
                onClick={() => {
                  if (profile?.referral_code) {
                    setShowShareGraphics(true);
                  } else {
                    alert('Please visit Settings to set up your referral code first, then you can share your stack!');
                  }
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base"
              >
                <ExternalLink className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                <span className="hidden sm:inline">SHARE YOUR STACK</span>
                <span className="sm:hidden">SHARE</span>
              </Button>
            )}
            <Button 
              onClick={generatePlan} 
              disabled={isGenerating}
              className="bg-dark-accent text-white hover:bg-dark-accent/80 transition-all duration-300 px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Regenerating...</span>
                  <span className="sm:hidden">...</span>
            </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Regenerate Plan</span>
                  <span className="sm:hidden">Regenerate</span>
                </div>
              )}
            </Button>
            </div>
          </div>
        </div>

      {plan ? (
        <div className="space-y-4">
          {/* General Notes Section */}
          {plan.general_notes && (
            <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
              <h3 className="text-lg font-semibold text-dark-accent mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Your Personalized Health Journey
              </h3>
              <p className="text-dark-primary leading-relaxed">{plan.general_notes}</p>
            </div>
          )}
          
          {plan.recommendations?.map((rec: any, index: number) => (
        <motion.div 
              key={index} 
              className="bg-dark-panel border border-dark-border rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-dark-primary">{rec.supplement}</h3>
                    <p className="text-dark-secondary">{cleanProductName(rec.product?.product_name)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-dark-primary text-lg">{rec.dosage}</p>
                    {rec.timing && <p className="text-dark-secondary text-sm">{rec.timing}</p>}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-dark-border space-y-2">
                  <h4 className="font-semibold text-dark-accent">Why This Is Perfect For You</h4>
                  <div className="bg-dark-background/50 rounded-lg p-4 border-l-4 border-dark-accent">
                    <p className="text-dark-primary leading-relaxed">{rec.reason}</p>
                  </div>
                  {rec.notes && (
                    <div className="mt-3 p-3 bg-dark-border rounded-lg">
                      <p className="text-dark-secondary text-sm leading-relaxed">{rec.notes}</p>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-dark-panel border border-dark-border rounded-lg">
          <Pill className="h-12 w-12 text-dark-secondary mx-auto mb-4" />
          <h3 className="text-xl font-medium text-dark-primary mb-2">No Supplement Plan Generated</h3>
          <p className="text-dark-secondary mb-4">
            Generate your AI-powered plan to get started.
          </p>
          <Button onClick={generatePlan} disabled={isGenerating} className="bg-dark-accent text-white hover:bg-dark-accent/80">
            {isGenerating ? 'Generating...' : 'Generate AI Plan'}
          </Button>
        </div>
      )}
    </div>
  );

  const renderDietGroceries = () => (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Header */}
      <div className="relative bg-dark-panel border border-dark-border rounded-xl p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-dark-primary mb-2">
              Your Personalized Whole Food Diet Plan
            </h1>
            <p className="text-base lg:text-lg text-dark-secondary">
              Traditional nutrition principles with grocery list & meal suggestions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={generateDietPlan} 
              disabled={isGeneratingDiet}
              className="bg-dark-accent text-white hover:bg-dark-accent/80 transition-all duration-300 px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base"
            >
              {isGeneratingDiet ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Regenerating...</span>
                  <span className="sm:hidden">...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Apple className="h-4 w-4" />
                  <span className="hidden sm:inline">Regenerate Diet Plan</span>
                  <span className="sm:hidden">Regenerate</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {dietPlan ? (
        <div className="space-y-8">
          {/* Dietary Restrictions Display */}
          {(profile?.dietary_preference || (userAllergies && userAllergies.length > 0)) && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Your Dietary Requirements (Strictly Followed)
              </h3>
              <div className="space-y-2">
                {profile?.dietary_preference && (
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-dark-accent" />
                    <span className="text-dark-primary font-medium">
                      Diet Type: <span className="text-dark-accent">{profile.dietary_preference.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                    </span>
                  </div>
                )}
                {userAllergies && userAllergies.length > 0 && (
                  <div>
                    <p className="text-dark-primary font-medium mb-1">⚠️ Allergies Avoided:</p>
                    <div className="flex flex-wrap gap-2">
                      {userAllergies.map((allergy: any, index: number) => (
                        <span key={index} className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                          {allergy.ingredient_name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* General Notes Section */}
          {dietPlan.general_notes && (
            <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
              <h3 className="text-lg font-semibold text-dark-accent mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Your Personalized Nutrition Journey
              </h3>
              <p className="text-dark-primary leading-relaxed">{dietPlan.general_notes}</p>
            </div>
          )}

          {/* Grocery List Section */}
          <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
            <h2 className="text-2xl font-bold text-dark-primary mb-6 flex items-center gap-2">
              <Apple className="h-6 w-6 text-dark-accent" />
              Your Personalized Grocery List
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dietPlan.grocery_list && Object.entries(dietPlan.grocery_list).map(([category, items]: [string, any]) => (
                <motion.div 
                  key={category}
                  className="bg-dark-background/50 rounded-lg p-4 border border-dark-border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-dark-accent mb-3 capitalize">
                    {category.replace('_', ' ')}
                  </h3>
                  <div className="space-y-3">
                    {Array.isArray(items) && items.map((item: any, index: number) => (
                      <div key={index} className="bg-dark-panel rounded-lg p-3 border border-dark-border">
                        <h4 className="font-semibold text-dark-primary text-sm mb-1">{item.item}</h4>
                        <p className="text-dark-secondary text-xs leading-relaxed">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Meal Suggestions Section */}
          <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
            <h2 className="text-2xl font-bold text-dark-primary mb-6 flex items-center gap-2">
              <Leaf className="h-6 w-6 text-dark-accent" />
              Your 20 Personalized Meal Suggestions
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dietPlan.meal_suggestions && Object.entries(dietPlan.meal_suggestions).map(([mealType, meals]: [string, any]) => (
                <motion.div 
                  key={mealType}
                  className="bg-dark-background/50 rounded-lg p-4 border border-dark-border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-semibold text-dark-accent mb-4 capitalize flex items-center gap-2">
                    {mealType === 'breakfast' && <Star className="h-5 w-5" />}
                    {mealType === 'lunch' && <Target className="h-5 w-5" />}
                    {mealType === 'dinner' && <Heart className="h-5 w-5" />}
                    {mealType === 'snacks' && <Zap className="h-5 w-5" />}
                    {mealType} ({Array.isArray(meals) ? meals.length : 0})
                  </h3>
                  <div className="space-y-4">
                    {Array.isArray(meals) && meals.map((meal: any, index: number) => (
                      <motion.div 
                        key={index} 
                        className="bg-dark-panel rounded-lg p-4 border border-dark-border"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                      >
                        <h4 className="font-bold text-dark-primary mb-2">{meal.name}</h4>
                        
                        {/* Cooking Info */}
                        {(meal.prep_time || meal.cook_time || meal.servings) && (
                          <div className="flex flex-wrap gap-4 mb-3 text-xs text-dark-secondary">
                            {meal.prep_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Prep: {meal.prep_time}</span>
                              </div>
                            )}
                            {meal.cook_time && (
                              <div className="flex items-center gap-1">
                                <ChefHat className="h-3 w-3" />
                                <span>Cook: {meal.cook_time}</span>
                              </div>
                            )}
                            {meal.servings && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>Serves: {meal.servings}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="mb-3">
                          <p className="text-dark-secondary text-sm mb-1">Ingredients:</p>
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(meal.ingredients) && meal.ingredients.map((ingredient: string, i: number) => (
                              <span key={i} className="bg-dark-accent/20 text-dark-accent px-2 py-1 rounded text-xs">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Cooking Instructions */}
                        {meal.instructions && Array.isArray(meal.instructions) && meal.instructions.length > 0 && (
                          <div className="mb-3">
                            <p className="text-dark-secondary text-sm mb-2 font-semibold">5-Step Instructions:</p>
                            <div className="space-y-1">
                              {meal.instructions.map((step: string, stepIndex: number) => (
                                <div key={stepIndex} className="flex items-start gap-2">
                                  <span className="bg-dark-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {stepIndex + 1}
                                  </span>
                                  <p className="text-dark-secondary text-xs leading-relaxed">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Micronutrient Information */}
                        {meal.micronutrients && (
                          <div className="mb-3">
                            <p className="text-dark-secondary text-sm mb-2 font-semibold flex items-center gap-1">
                              <Dna className="h-3 w-3" />
                              Personalized Nutrition Analysis:
                            </p>
                            <div className="bg-dark-background/30 rounded-lg p-3 space-y-2">
                              {meal.micronutrients.nutrient_density_score && (
                                <div className="flex items-center gap-2">
                                  <Star className="h-3 w-3 text-yellow-400" />
                                  <span className="text-xs text-dark-accent font-medium">{meal.micronutrients.nutrient_density_score}</span>
                                </div>
                              )}
                              
                              {meal.micronutrients.primary_nutrients && meal.micronutrients.primary_nutrients.length > 0 && (
                                <div>
                                  <p className="text-xs text-dark-secondary font-medium mb-1">Key Nutrients:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {meal.micronutrients.primary_nutrients.map((nutrient: string, i: number) => (
                                      <span key={i} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                                        {nutrient}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {meal.micronutrients.synergistic_effects && (
                                <div className="bg-dark-panel rounded p-2 border-l-2 border-dark-accent">
                                  <p className="text-xs text-dark-secondary">
                                    <span className="font-semibold text-dark-accent">Synergy:</span> {meal.micronutrients.synergistic_effects}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="bg-dark-background/50 rounded-lg p-3 border-l-4 border-dark-accent">
                          <p className="text-dark-secondary text-sm">
                            <span className="font-semibold text-dark-accent">Why this works for you:</span> {meal.benefits}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contraindications Section */}
          {dietPlan.contraindications && (
            <div className="bg-dark-panel rounded-xl p-6 border border-dark-border border-l-4 border-l-yellow-500">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Important Safety Considerations
              </h3>
              <p className="text-dark-primary leading-relaxed">{dietPlan.contraindications}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-dark-panel border border-dark-border rounded-lg">
          <Apple className="h-12 w-12 text-dark-secondary mx-auto mb-4" />
          <h3 className="text-xl font-medium text-dark-primary mb-2">No Diet Plan Generated</h3>
          <p className="text-dark-secondary mb-4">
            Generate your personalized whole food nutrition plan to get started.
          </p>
          <Button onClick={generateDietPlan} disabled={isGeneratingDiet} className="bg-dark-accent text-white hover:bg-dark-accent/80">
            {isGeneratingDiet ? 'Generating...' : 'Generate Diet Plan'}
          </Button>
        </div>
      )}
    </div>
  );

  const renderEnhancedAnalysis = () => {
    // Domain icons mapping
    const domainIcons: Record<string, any> = {
      'metabolomic': TrendingUp,
      'lipidomic': Bone,
      'inflammation': Zap,
      'cognitive': Brain,
      'gutMicrobiome': Pill
    };

    if (domainsLoading) {
      return (
        <div className="space-y-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-dark-border border-t-dark-accent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-dark-primary mb-2">Analyzing Your Health Domains...</h2>
            <p className="text-dark-secondary">Processing your onboarding responses across 5 health domains</p>
          </div>
        </div>
      );
    }

    if (domainsError) {
      const isNotFoundError = domainsError.includes('No health domains analysis found');
      
      return (
        <div className="space-y-8">
          <div className="text-center py-20">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-dark-primary mb-2">
              {isNotFoundError ? 'Health Analysis Not Generated' : 'Analysis Error'}
            </h2>
            <p className="text-dark-secondary mb-4">
              {isNotFoundError 
                ? 'Your personalized health domains analysis hasn\'t been generated yet.' 
                : domainsError}
            </p>
            <Button 
              onClick={async () => {
                if (isNotFoundError) {
                  // MOCK FUNCTION - No API calls, just reload
                  setIsLoading(true);
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                } else {
                  window.location.reload();
                }
              }} 
              className="bg-dark-accent text-white hover:bg-dark-accent/80"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : (isNotFoundError ? 'Generate Analysis' : 'Try Again')}
            </Button>
          </div>
        </div>
      );
    }

    if (!domainsData) {
      return (
        <div className="space-y-8">
          <div className="text-center py-20">
            <Brain className="h-16 w-16 text-dark-accent mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-dark-primary mb-2">Complete Your Health Assessment</h2>
            <p className="text-dark-secondary mb-4">Please complete the onboarding to get your comprehensive health domains analysis</p>
            <Button 
              onClick={() => router.push('/onboarding')} 
              className="bg-dark-accent text-white hover:bg-dark-accent/80"
            >
              Complete Assessment
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Hero Section with User Goals */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-2xl"></div>
          <div className="relative p-8 text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Comprehensive Analysis
            </h1>
            <p className="text-xl text-dark-secondary max-w-3xl mx-auto leading-relaxed mb-6">
              Educational insights across 5 health domains based on your onboarding responses
            </p>
            
            {/* User Goals Display */}
            {domainsData.userProfile && (
              <div className="bg-dark-panel/60 border border-dark-accent/20 rounded-xl p-6 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-dark-primary mb-3 flex items-center justify-center">
                  <Target className="h-6 w-6 text-dark-accent mr-3" />
                  Your Health Goals, {domainsData.userProfile.name}
                </h2>
                <div className="text-lg text-dark-secondary mb-4">
                  You want to: <span className="text-dark-accent font-semibold">{domainsData.userProfile.goalDescription}</span>
                </div>
                {domainsData.userProfile.goals && domainsData.userProfile.goals.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {domainsData.userProfile.goals.map((goal: string, index: number) => {
                      // Create proper goal labels
                      const goalLabels: {[key: string]: string} = {
                        'weight_loss': 'Weight Loss',
                        'muscle_gain': 'Muscle Gain', 
                        'energy': 'Energy Boost',
                        'sleep': 'Sleep Quality',
                        'stress': 'Stress Management',
                        'digestion': 'Digestive Health',
                        'digestive_health': 'Digestive Health',
                        'immunity': 'Immune Health',
                        'skin': 'Skin Health',
                        'mood': 'Mood Balance',
                        'focus': 'Mental Clarity',
                        'weight_management': 'Weight Management',
                        'longevity_wellness': 'Longevity & Wellness'
                      };
                      
                      const displayLabel = goalLabels[goal] || goal.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                      
                      return (
                        <span key={index} className="px-3 py-1 bg-dark-accent/10 text-dark-accent border border-dark-accent/20 rounded-full text-sm font-medium">
                          {displayLabel}
                        </span>
                      );
                    })}
                  </div>
                )}
                <p className="text-sm text-dark-secondary mt-3">
                  Every recommendation below is tailored to support these specific goals
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cross-Domain Connections */}
        {domainsData.crossDomainConnections && (
          <div className="bg-gradient-to-r from-dark-accent/5 to-blue-500/5 border border-dark-accent/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center">
              <Network className="h-6 w-6 text-dark-accent mr-3" />
              Cross-Domain Connections
            </h2>
            <div className="space-y-3">
              {domainsData.crossDomainConnections.map((connection: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-dark-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-dark-secondary">{connection}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Priority Protocols */}
        {domainsData.priorityProtocols && (
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center">
              <Star className="h-6 w-6 text-yellow-400 mr-3" />
              Priority Protocols for Your Goals
            </h2>
            <div className="grid gap-4">
              {domainsData.priorityProtocols.map((protocolItem: any, index: number) => {
                // Handle both old string format and new object format
                const protocol = typeof protocolItem === 'string' ? protocolItem : protocolItem.protocol;
                const goalConnection = typeof protocolItem === 'object' ? protocolItem.goalConnection : null;
                
                return (
                  <div key={index} className="bg-dark-panel border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-dark-primary font-medium mb-2">{protocol}</p>
                        {goalConnection && (
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-dark-accent" />
                            <span className="text-sm text-dark-accent font-medium">{goalConnection}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Health Domains */}
        <div className="space-y-6">
          {domainsData.domains && Object.entries(domainsData.domains).map(([domainKey, domain]: [string, any]) => {
            const IconComponent = domainIcons[domainKey] || Activity;
            const isExpanded = expandedDomains.has(domainKey);
            
            return (
              <motion.div 
                key={domainKey} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                className="bg-dark-panel border border-dark-border rounded-xl p-6"
              >
                {/* Domain Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-dark-accent/10 rounded-xl">
                      <IconComponent className="h-6 w-6 text-dark-accent" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-dark-primary">{domain.title}</h2>
                      <p className="text-dark-secondary">{domain.subtitle}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => toggleDomain(domainKey)}
                    variant="outline"
                    size="sm"
                    className="border-dark-border hover:bg-dark-accent/10"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Insights Preview */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-dark-primary mb-3">Key Insights</h3>
                  <div className="grid gap-3">
                    {domain.insights?.slice(0, 2).map((insight: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-dark-secondary">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personalized Findings */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-dark-primary mb-3">Your Profile</h3>
                  <div className="grid gap-3">
                    {domain.personalizedFindings?.map((finding: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Target className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-dark-secondary">{finding}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* All Insights */}
                      {domain.insights?.length > 2 && (
                        <div>
                          <h3 className="text-lg font-semibold text-dark-primary mb-3">Complete Educational Insights</h3>
                          <div className="grid gap-3">
                            {domain.insights.slice(2).map((insight: string, index: number) => (
                              <div key={index + 2} className="flex items-start space-x-3">
                                <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                <p className="text-dark-secondary">{insight}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      <div>
                        <h3 className="text-lg font-semibold text-dark-primary mb-3">Holistic Protocols</h3>
                        <div className="grid gap-4">
                          {domain.recommendations?.map((rec: string, index: number) => (
                            <div key={index} className="bg-dark-background border border-dark-border rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-dark-accent/20 text-dark-accent rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                  {index + 1}
                                </div>
                                <p className="text-dark-primary font-medium">{rec}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Goal Alignment */}
                      {domain.goalAlignment && (
                        <div className="bg-gradient-to-r from-dark-accent/10 to-blue-500/10 border-2 border-dark-accent/30 rounded-lg p-5">
                          <h4 className="font-bold text-dark-primary mb-3 flex items-center text-lg">
                            <Target className="h-6 w-6 text-dark-accent mr-2" />
                            How This Supports Your Goals
                          </h4>
                          <p className="text-dark-primary font-medium leading-relaxed">{domain.goalAlignment}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Safety Check */}
        {domainsData.conflictCheck && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-dark-primary mb-3 flex items-center">
              <Shield className="h-6 w-6 text-green-400 mr-3" />
              Safety Verification
          </h2>
            <p className="text-dark-secondary">{domainsData.conflictCheck}</p>
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center">
          <Button 
            onClick={() => window.location.reload()}
            className="bg-dark-accent text-white hover:bg-dark-accent/80 px-8 py-3"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </div>
    );
  };

  const renderAnalysis = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-2xl"></div>
        <div className="relative p-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Comprehensive Analysis
          </h1>
          <p className="text-xl text-dark-secondary max-w-3xl mx-auto leading-relaxed">
            AI-powered insights from your key health markers focused on metabolic syndrome, cognitive health, hormonal balance, and nutritional status
          </p>
        </div>
      </div>

      {/* Computing State */}
      {analysisComputing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8"
        >
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/20"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute inset-0"></div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-dark-primary mb-2">AI Analysis in Progress</h3>
              <p className="text-dark-secondary">Our advanced algorithms are processing your health data to generate personalized insights</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="space-y-12">
        {/* Lab Results Section */}
        {biomarkersData.length > 0 ? (
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl"></div>
            
            {/* Content */}
            <div className="relative bg-dark-panel/80 backdrop-blur-sm border border-dark-border/50 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl shadow-lg">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-dark-primary">Lab Results Analysis</h2>
                    <p className="text-dark-secondary">Comprehensive biomarker insights</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    {biomarkersData.length}
                  </div>
                  <div className="text-sm text-dark-secondary font-medium">Biomarkers</div>
                </div>
              </div>
              
              {/* Search and Filter Controls */}
              <div className="mb-8 space-y-4">
                {/* Search Bar */}
              <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-secondary" />
                  <input
                    type="text"
                    placeholder="Search biomarkers by name or value..."
                    value={biomarkerSearch}
                    onChange={(e) => setBiomarkerSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-dark-background/60 border border-dark-border/50 rounded-xl text-dark-primary placeholder-dark-secondary focus:outline-none focus:border-dark-accent/50 focus:ring-2 focus:ring-dark-accent/20 transition-all"
                  />
                    </div>
                
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: 'all', label: 'All Results', count: biomarkersData.length },
                    { key: 'normal', label: 'Normal', count: biomarkersData.filter(b => {
                      const analysis = biomarkerAnalysis[b.marker_name?.toLowerCase()?.replace(/\s+/g, '_')] || {};
                      return analysis.statusColor === 'green' || !analysis.statusColor;
                    }).length },
                    { key: 'attention', label: 'Needs Attention', count: biomarkersData.filter(b => {
                      const analysis = biomarkerAnalysis[b.marker_name?.toLowerCase()?.replace(/\s+/g, '_')] || {};
                      return analysis.statusColor === 'yellow' || analysis.statusColor === 'red';
                    }).length },
                    { key: 'analyzed', label: 'AI Analyzed', count: biomarkersData.filter(b => {
                      const analysis = biomarkerAnalysis[b.marker_name?.toLowerCase()?.replace(/\s+/g, '_')] || {};
                      return analysis.interpretation;
                    }).length }
                  ].map(filter => (
                    <button
                      key={filter.key}
                      onClick={() => {
                        setBiomarkerFilter(filter.key as any);
                        setBiomarkerPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        biomarkerFilter === filter.key
                          ? 'bg-dark-accent text-white shadow-lg'
                          : 'bg-dark-background/60 text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary border border-dark-border/50'
                      }`}
                    >
                      {filter.label} ({filter.count})
                    </button>
                  ))}
                  </div>
                
                {/* Results Summary */}
                <div className="flex items-center justify-between text-sm text-dark-secondary">
                  <span>
                    Showing {paginatedBiomarkers.length} of {filteredBiomarkers.length} biomarkers
                    {biomarkerSearch && ` matching "${biomarkerSearch}"`}
                  </span>
                  {filteredBiomarkers.length !== biomarkersData.length && (
                    <button
                      onClick={() => {
                        setBiomarkerSearch('');
                        setBiomarkerFilter('all');
                        setBiomarkerPage(1);
                      }}
                      className="text-dark-accent hover:text-dark-accent/80 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                    </div>
                  </div>
              
              {/* Biomarkers Grid */}
              <div className="grid gap-6">
                {paginatedBiomarkers.map((biomarker, index) => {
                  const analysis = biomarkerAnalysis[biomarker.marker_name?.toLowerCase()?.replace(/\s+/g, '_')] || {};
                  const cleanName = biomarker.marker_name?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Marker';
                  
                  return (
                    <BiomarkerCard 
                      key={`${biomarker.marker_name}-${index}`}
                      biomarker={biomarker}
                      analysis={analysis}
                      cleanName={cleanName}
                      index={index}
                    />
                  );
                })}
                    </div>
              
              {/* Biomarker Pagination */}
              {totalBiomarkerPages > 1 && (
                <div className="mt-8 flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBiomarkerPage(Math.max(1, biomarkerPage - 1))}
                    disabled={biomarkerPage === 1}
                    className="border-dark-border text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalBiomarkerPages) }, (_, i) => {
                      let pageNum;
                      if (totalBiomarkerPages <= 5) {
                        pageNum = i + 1;
                      } else if (biomarkerPage <= 3) {
                        pageNum = i + 1;
                      } else if (biomarkerPage >= totalBiomarkerPages - 2) {
                        pageNum = totalBiomarkerPages - 4 + i;
                      } else {
                        pageNum = biomarkerPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={biomarkerPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBiomarkerPage(pageNum)}
                          className={biomarkerPage === pageNum 
                            ? "bg-dark-accent text-white" 
                            : "border-dark-border text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBiomarkerPage(Math.min(totalBiomarkerPages, biomarkerPage + 1))}
                    disabled={biomarkerPage === totalBiomarkerPages}
                    className="border-dark-border text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
              </div>
            </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-blue-500/5 rounded-3xl"></div>
            <div className="relative bg-dark-panel/80 backdrop-blur-sm border border-dark-border/50 rounded-3xl p-12 text-center shadow-2xl">
              <div className="p-6 bg-gradient-to-br from-gray-500/10 to-blue-500/10 rounded-3xl w-fit mx-auto mb-6">
                <Activity className="h-16 w-16 text-dark-secondary mx-auto" />
          </div>
              <h3 className="text-2xl font-bold text-dark-primary mb-4">No Lab Results Yet</h3>
              <p className="text-dark-secondary mb-8 max-w-md mx-auto leading-relaxed">
                Complete your health assessment to unlock personalized biomarker analysis and health insights
              </p>
              <Button 
                onClick={() => router.push('/onboarding')} 
                className="bg-gradient-to-r from-dark-accent to-blue-500 hover:from-dark-accent/80 hover:to-blue-500/80 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Complete Assessment
              </Button>
            </div>
          </motion.div>
        )}

        {/* Genetic Analysis Section */}
        {snpsData.length > 0 ? (
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-3xl"></div>
            
            {/* Content */}
            <div className="relative bg-dark-panel/80 backdrop-blur-sm border border-dark-border/50 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                    <Dna className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-dark-primary">Genetic Analysis</h2>
                    <p className="text-dark-secondary">Personalized genetic insights</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {snpsData.length.toLocaleString()}
                  </div>
                  <div className="text-sm text-dark-secondary font-medium">Genetic Variants</div>
                </div>
              </div>
              
              {/* Search and Filter Controls */}
              <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-secondary" />
                  <input
                    type="text"
                    placeholder="Search by gene name, rsID, or genotype..."
                    value={snpSearch}
                    onChange={(e) => setSnpSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-dark-background/60 border border-dark-border/50 rounded-xl text-dark-primary placeholder-dark-secondary focus:outline-none focus:border-dark-accent/50 focus:ring-2 focus:ring-dark-accent/20 transition-all"
                  />
                </div>
                
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: 'all', label: 'All Variants', count: snpsData.length },
                    { key: 'low', label: 'Low Risk', count: snpsData.filter(s => {
                      const gene = s.supported_snps?.gene || s.gene_name || 'Unknown';
                      const rsid = s.supported_snps?.rsid || s.snp_id || 'Unknown';
                      const analysis = snpAnalysis[`${gene} (${rsid})`] || {};
                      return analysis.riskColor === 'green' || !analysis.riskColor;
                    }).length },
                    { key: 'moderate', label: 'Moderate Risk', count: snpsData.filter(s => {
                      const gene = s.supported_snps?.gene || s.gene_name || 'Unknown';
                      const rsid = s.supported_snps?.rsid || s.snp_id || 'Unknown';
                      const analysis = snpAnalysis[`${gene} (${rsid})`] || {};
                      return analysis.riskColor === 'orange';
                    }).length },
                    { key: 'high', label: 'High Risk', count: snpsData.filter(s => {
                      const gene = s.supported_snps?.gene || s.gene_name || 'Unknown';
                      const rsid = s.supported_snps?.rsid || s.snp_id || 'Unknown';
                      const analysis = snpAnalysis[`${gene} (${rsid})`] || {};
                      return analysis.riskColor === 'red';
                    }).length },
                    { key: 'analyzed', label: 'AI Analyzed', count: snpsData.filter(s => {
                      const gene = s.supported_snps?.gene || s.gene_name || 'Unknown';
                      const rsid = s.supported_snps?.rsid || s.snp_id || 'Unknown';
                      const analysis = snpAnalysis[`${gene} (${rsid})`] || {};
                      return analysis.variantEffect;
                    }).length }
                  ].map(filter => (
                    <button
                      key={filter.key}
                      onClick={() => {
                        setSnpFilter(filter.key as any);
                        setSnpPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        snpFilter === filter.key
                          ? 'bg-dark-accent text-white shadow-lg'
                          : 'bg-dark-background/60 text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary border border-dark-border/50'
                      }`}
                    >
                      {filter.label} ({filter.count})
                    </button>
                  ))}
                </div>
                
                {/* Results Summary */}
                <div className="flex items-center justify-between text-sm text-dark-secondary">
                  <span>
                    Showing {paginatedSnps.length} of {filteredSnps.length} genetic variants
                    {snpSearch && ` matching "${snpSearch}"`}
                  </span>
                  {filteredSnps.length !== snpsData.length && (
                    <button
                      onClick={() => {
                        setSnpSearch('');
                        setSnpFilter('all');
                        setSnpPage(1);
                      }}
                      className="text-dark-accent hover:text-dark-accent/80 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
              
              {/* SNPs Grid */}
              <div className="space-y-4">
                {paginatedSnps.map((snp, index) => {
                  const gene = snp.supported_snps?.gene || snp.gene_name || 'Unknown';
                  const rsid = snp.supported_snps?.rsid || snp.snp_id || 'Unknown';
                  const analysis = snpAnalysis[`${gene} (${rsid})`] || {};
                  
                  return (
                    <SnpCard 
                      key={`${gene}-${rsid}-${index}`}
                      snp={snp}
                      analysis={analysis}
                      gene={gene}
                      rsid={rsid}
                      index={index}
                    />
                  );
                })}
              </div>
              
              {/* SNP Pagination */}
              {totalSnpPages > 1 && (
                <div className="mt-8 flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSnpPage(Math.max(1, snpPage - 1))}
                    disabled={snpPage === 1}
                    className="border-dark-border text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalSnpPages) }, (_, i) => {
                      let pageNum;
                      if (totalSnpPages <= 5) {
                        pageNum = i + 1;
                      } else if (snpPage <= 3) {
                        pageNum = i + 1;
                      } else if (snpPage >= totalSnpPages - 2) {
                        pageNum = totalSnpPages - 4 + i;
                      } else {
                        pageNum = snpPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={snpPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSnpPage(pageNum)}
                          className={snpPage === pageNum 
                            ? "bg-dark-accent text-white" 
                            : "border-dark-border text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSnpPage(Math.min(totalSnpPages, snpPage + 1))}
                    disabled={snpPage === totalSnpPages}
                    className="border-dark-border text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl"></div>
            <div className="relative bg-dark-panel/80 backdrop-blur-sm border border-dark-border/50 rounded-3xl p-12 text-center shadow-2xl">
              <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl w-fit mx-auto mb-6">
                <Dna className="h-16 w-16 text-dark-secondary mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-dark-primary mb-4">No Genetic Data Yet</h3>
              <p className="text-dark-secondary mb-8 max-w-md mx-auto leading-relaxed">
                Complete your genetic assessment to unlock personalized genetic insights and recommendations
              </p>
              <Button 
                onClick={() => router.push('/onboarding')} 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-500/80 hover:to-pink-500/80 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Complete Assessment
              </Button>
            </div>
          </motion.div>
        )}

        {/* Action Center */}
        {(biomarkersData.length > 0 || snpsData.length > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-dark-accent/5 to-blue-500/5 rounded-3xl"></div>
            <div className="relative bg-dark-panel/80 backdrop-blur-sm border border-dark-border/50 rounded-3xl p-8 text-center shadow-2xl">
              <h3 className="text-2xl font-bold text-dark-primary mb-4">Keep Your Analysis Fresh</h3>
              <p className="text-dark-secondary mb-6 max-w-md mx-auto">
                Refresh your analysis to get the latest insights as our AI models improve
              </p>
              <Button 
                onClick={triggerRecomputation}
                disabled={analysisComputing}
                className="bg-gradient-to-r from-dark-accent to-blue-500 hover:from-dark-accent/80 hover:to-blue-500/80 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                <Sparkles className="h-5 w-5 mr-3" />
                {analysisComputing ? 'Computing...' : 'Refresh Analysis'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderTracking = () => (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          AI-Powered Health Tracking
        </h2>
        <p className="text-dark-secondary">Personalized questions generated just for you based on your health profile</p>
      </div>

      {/* COMPREHENSIVE MOCK TRACKING DATA - NO API CALLS */}
      <div className="space-y-6">
        {/* Today's Personalized Questions */}
        <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                <Brain className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                <h3 className="text-xl font-semibold text-dark-primary">Today's Personalized Check-in</h3>
                <p className="text-sm text-dark-secondary">AI-generated questions based on your health profile</p>
              </div>
            </div>
            <div className="text-sm text-dark-secondary">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  
                    {/* 5 Personalized Questions - ALL 1-10 Scale */}
          <div className="space-y-4">
            {/* Question 1: Energy Pattern */}
            <div className="bg-dark-background border border-dark-border rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-1.5 bg-blue-500/10 rounded">
                  <Zap className="h-4 w-4 text-blue-400" />
                          </div>
                <div className="flex-1">
                  <p className="text-dark-primary font-medium">
                    Alex, you mentioned chronic fatigue affecting work performance. Since starting methylfolate 2 weeks ago for your MTHFR C677T variant, rate your 3PM energy compared to your typical afternoon crash (1 = completely exhausted like before, 10 = sustained energy through the day)
                  </p>
                  <p className="text-xs text-dark-secondary mt-1">
                    Your MTHFR variant reduces methylation by 40% - we're tracking if bypassing this bottleneck is restoring your cellular energy production
                  </p>
                        </div>
                      </div>
              <div className="flex gap-2 mt-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      num === 7 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-dark-panel border border-dark-border text-dark-secondary hover:bg-dark-border'
                    }`}
                  >
                    {num}
                  </button>
                    ))}
                  </div>
                </div>

            {/* Question 2: Sleep Architecture */}
            <div className="bg-dark-background border border-dark-border rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-1.5 bg-purple-500/10 rounded">
                  <Moon className="h-4 w-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-dark-primary font-medium">
                    With your "wired but tired" pattern and magnesium at 1.6 mg/dL (low), how many times did you wake up last night after taking 400mg magnesium glycinate? Rate sleep continuity (1 = woke up 5+ times, 10 = slept through the night)
                  </p>
                  <p className="text-xs text-dark-secondary mt-1">
                    Your low cellular magnesium disrupts GABA receptors and melatonin production - tracking if supplementation is restoring your sleep architecture
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      num === 8 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-dark-panel border border-dark-border text-dark-secondary hover:bg-dark-border'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3: Cognitive Function */}
            <div className="bg-dark-background border border-dark-border rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-1.5 bg-orange-500/10 rounded">
                  <Cloud className="h-4 w-4 text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-dark-primary font-medium">
                    Your omega-3 index (3.1%) shows severe neuroinflammation. During today's work meetings, how was your word recall and mental clarity? (1 = searching for words, losing train of thought, 10 = sharp, articulate, quick thinking)
                  </p>
                  <p className="text-xs text-dark-secondary mt-1">
                    EPA reduces brain inflammation while DHA supports synaptic function - tracking if 3g daily is clearing your brain fog
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      num === 6 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-dark-panel border border-dark-border text-dark-secondary hover:bg-dark-border'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 4: Stress Resilience */}
            <div className="bg-dark-background border border-dark-border rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-1.5 bg-green-500/10 rounded">
                  <Heart className="h-4 w-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-dark-primary font-medium">
                    Your COMT Met/Met variant makes you hypersensitive to stress (slow dopamine breakdown). How did you handle today's work pressure after taking rhodiola? (1 = overwhelmed/anxious, 10 = calm and focused under pressure)
                  </p>
                  <p className="text-xs text-dark-secondary mt-1">
                    High cortisol (18.2) + slow COMT creates stress cascade - rhodiola modulates HPA axis to break this pattern
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      num === 7 
                        ? 'bg-green-500 text-white' 
                        : 'bg-dark-panel border border-dark-border text-dark-secondary hover:bg-dark-border'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 5: Mitochondrial Function */}
            <div className="bg-dark-background border border-dark-border rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-1.5 bg-yellow-500/10 rounded">
                  <Sun className="h-4 w-4 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-dark-primary font-medium">
                    Your TSH (3.8) suggests subclinical hypothyroidism affecting cellular metabolism. After taking CoQ10 ubiquinol this morning, rate your physical stamina during daily activities (1 = breathless climbing stairs, 10 = energetic all day)
                  </p>
                  <p className="text-xs text-dark-secondary mt-1">
                    CoQ10 depletion + thyroid dysfunction = mitochondrial crisis. Ubiquinol directly fuels ATP production
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      num === 6 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-dark-panel border border-dark-border text-dark-secondary hover:bg-dark-border'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

                    {/* AI Insight - Comprehensive holistic advice based on all 5 answers */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="space-y-3">
                <p className="text-sm font-medium text-dark-primary">Today's Personalized Holistic Health Insight</p>
                
                <div className="text-sm text-dark-secondary space-y-2">
                  <p>
                    <span className="font-medium text-dark-primary">Alex, you're experiencing a breakthrough moment.</span> Your energy improvement from 3/10 to 7/10 in just 2 weeks confirms we've unlocked your methylation bottleneck. The methylfolate is finally giving your cells the fuel they've been starving for due to your MTHFR variant.
                  </p>
                  
                  <p>
                    <span className="font-medium text-dark-primary">Sleep Architecture Restoration:</span> Your 8/10 sleep continuity shows magnesium glycinate is successfully calming your overactive nervous system. The fact you're sleeping through the night means GABA receptors are responding. To enhance this further, try a 4-7-8 breathing technique before your magnesium dose - this activates parasympathetic response and amplifies magnesium's calming effects.
                  </p>
                  
                  <p>
                    <span className="font-medium text-dark-primary">Cognitive Renaissance:</span> Your word recall improving to 6/10 indicates neuroinflammation is reducing, but we're not done yet. Your omega-3 index needs 8-12 weeks to fully rebuild. Add 1 tbsp of ground flaxseed to your morning smoothie - the ALA converts slowly to EPA, providing all-day anti-inflammatory support. Also, your meetings might improve further if you take phosphatidylserine (100mg) with your omega-3 - it enhances DHA incorporation into brain cell membranes.
                  </p>
                  
                  <p>
                    <span className="font-medium text-dark-primary">Stress Biochemistry Optimization:</span> Your 7/10 stress resilience is remarkable given your COMT Met/Met variant. The rhodiola is successfully modulating your HPA axis, but here's a biohack: on high-stress days, add 200mg L-theanine mid-morning. It synergizes with your slow COMT to create calm focus without sedation. Avoid all caffeine after 10am - your variant means it stays in your system 6+ hours.
                  </p>
                  
                  <p>
                    <span className="font-medium text-dark-primary">Mitochondrial Awakening:</span> Your stamina at 6/10 shows CoQ10 is reviving cellular energy, but your thyroid needs support. Add 2 Brazil nuts daily (selenium) and seaweed snacks (iodine) to naturally support T4 to T3 conversion. Consider taking your CoQ10 with a teaspoon of MCT oil - it increases absorption by 300%.
                  </p>
                  
                  <p className="pt-2 font-medium text-blue-400">
                    🎯 This Week's Optimization Protocol: Morning sunlight within 30 minutes of waking (sets circadian rhythm), move your omega-3 to breakfast, add the L-theanine on stressful days, and start a gratitude practice before bed (reduces cortisol, improves tomorrow's energy). Your body is responding beautifully - these tweaks will take you from surviving to thriving.
                  </p>
                </div>
              </div>
            </div>
          </div>
                  </div>
                  
        {/* Supplement Adherence */}
        <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Pill className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                <h3 className="text-xl font-semibold text-dark-primary">Supplement Tracking</h3>
                <p className="text-sm text-dark-secondary">Track your daily supplement intake</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">85%</p>
                <p className="text-xs text-dark-secondary">Today's adherence</p>
              </div>
                    </div>
                  </div>
                  
          {/* Individual Supplement Tracking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plan?.recommendations?.map((rec: any, index: number) => (
              <div key={index} className="bg-dark-background border border-dark-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className={`p-2 rounded-lg transition-colors ${
                      index < 5 ? 'bg-green-500/20' : 'bg-dark-panel'
                    }`}>
                      {index < 5 ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <X className="h-4 w-4 text-dark-secondary" />
                      )}
                    </button>
                    <div>
                      <p className="font-medium text-dark-primary">{rec.supplement}</p>
                      <p className="text-xs text-dark-secondary">{rec.dosage} • {rec.timing}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-dark-background border border-dark-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-dark-accent">78%</p>
              <p className="text-sm text-dark-secondary">Weekly Average</p>
            </div>
            <div className="bg-dark-background border border-dark-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-400">5</p>
              <p className="text-sm text-dark-secondary">Day Streak</p>
            </div>
            <div className="bg-dark-background border border-dark-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">23</p>
              <p className="text-sm text-dark-secondary">Total Days</p>
            </div>
          </div>
        </div>

        {/* Symptom Tracking */}
        <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Activity className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark-primary">Symptom Tracking</h3>
                <p className="text-sm text-dark-secondary">Monitor your health improvements</p>
              </div>
            </div>
          </div>

          {/* Symptom Progress */}
          <div className="space-y-4">
            <div className="bg-dark-background border border-dark-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-dark-primary font-medium">Energy Levels</span>
                <span className="text-green-400 font-medium">+28% ↑</span>
              </div>
              <div className="w-full bg-dark-panel rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-orange-500 to-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <p className="text-xs text-dark-secondary">Improved from 5/10 to 7/10 over 2 weeks</p>
            </div>

            <div className="bg-dark-background border border-dark-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-dark-primary font-medium">Brain Fog</span>
                <span className="text-green-400 font-medium">-45% ↓</span>
              </div>
              <div className="w-full bg-dark-panel rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <p className="text-xs text-dark-secondary">Reduced from 7/10 to 4/10 severity</p>
            </div>

            <div className="bg-dark-background border border-dark-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-dark-primary font-medium">Sleep Quality</span>
                <span className="text-green-400 font-medium">+40% ↑</span>
              </div>
              <div className="w-full bg-dark-panel rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-dark-secondary">Improved from 5/10 to 7/10 with magnesium</p>
            </div>
          </div>

          {/* Correlation Insights */}
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-orange-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-dark-primary mb-1">Pattern Detected</p>
                <p className="text-sm text-dark-secondary">
                  Your energy levels consistently improve 2-3 hours after taking B-complex. 
                  Brain fog reduction correlates strongly with omega-3 supplementation. 
                  Consider taking omega-3 with breakfast for optimal cognitive benefits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-dark-primary">Settings</h1>
        <p className="text-lg text-dark-secondary mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Referral System */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Network className="h-6 w-6 text-dark-accent" />
          <h3 className="text-2xl font-semibold text-dark-primary">Refer Friends</h3>
        </div>
        <p className="text-dark-secondary mb-6">
          Share SupplementScribe with friends and help them optimize their health too!
        </p>
        
        {profile?.referral_code ? (
          <div className="space-y-4">
            {/* Referral Code */}
            <div>
              <label className="text-sm font-medium text-dark-secondary mb-2 block">
                Your Referral Code
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-dark-background border border-dark-border rounded-lg px-4 py-3">
                  <code className="text-lg font-mono text-dark-accent">{profile.referral_code}</code>
                </div>
                <Button
                  onClick={copyReferralCode}
                  variant="outline"
                  className="px-4 py-3 border-dark-border hover:bg-dark-border text-dark-primary hover:text-dark-primary bg-dark-panel"
                >
                  {copiedReferralCode ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    'Copy'
                  )}
                </Button>
              </div>
            </div>

            {/* Referral URL */}
            <div>
              <label className="text-sm font-medium text-dark-secondary mb-2 block">
                Your Referral Link
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-dark-background border border-dark-border rounded-lg px-4 py-3">
                  <code className="text-sm text-dark-primary break-all">
                    {generateReferralUrl(profile.referral_code)}
                  </code>
                </div>
                <Button
                  onClick={copyReferralUrl}
                  variant="outline"
                  className="px-4 py-3 border-dark-border hover:bg-dark-border text-dark-primary hover:text-dark-primary bg-dark-panel"
                >
                  {copiedReferralUrl ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    'Copy'
                  )}
                </Button>
              </div>
            </div>

            {/* Referral Stats */}
            <div className="bg-dark-background border border-dark-border rounded-lg p-4 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-secondary">People you've referred</p>
                  <p className="text-2xl font-bold text-dark-accent">{profile.referral_count || 0}</p>
                </div>
                <Star className="h-8 w-8 text-dark-accent" />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-dark-background border border-dark-border rounded-lg p-6">
              <Network className="h-12 w-12 text-dark-accent mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-dark-primary mb-2">Setting up your referral code...</h4>
              <p className="text-dark-secondary mb-4">
                Click the button below to generate your unique referral code.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={generateReferralCodeForExistingUser}
                  className="bg-dark-accent text-white hover:bg-dark-accent/80"
                >
                  Generate My Referral Code
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  className="border-dark-border text-dark-primary hover:bg-dark-border hover:text-dark-primary bg-dark-panel"
                >
                  Refresh Page
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Management */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="h-6 w-6 text-dark-accent" />
          <h3 className="text-2xl font-semibold text-dark-primary">Subscription & Orders</h3>
        </div>
        
        {/* Current Plan */}
        <div className="bg-dark-background border border-dark-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-dark-primary">Current Plan</h4>
              <p className="text-dark-secondary text-sm">Your active subscription tier</p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                profile?.subscription_tier === 'full' 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {profile?.subscription_tier === 'full' ? 'Complete Package' : 'Software Only'}
              </div>
              <p className="text-dark-accent font-bold text-lg mt-1">
                {profile?.subscription_tier === 'full' ? '$75.00/month' : '$19.99/month'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
              <p className="text-sm font-medium text-dark-secondary">Plan Features:</p>
              <ul className="space-y-1 text-sm text-dark-primary">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  AI Health Analysis & Scoring
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Personalized Supplement Plans
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Custom Diet Plans & Groceries
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Health Tracking & Insights
                </li>
                {profile?.subscription_tier === 'full' && (
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="font-medium text-dark-accent">Monthly Supplement Delivery</span>
                  </li>
                )}
              </ul>
            </div>
            
            {profile?.subscription_tier === 'full' && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-dark-secondary">Next Delivery:</p>
                <div className="bg-dark-panel border border-dark-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-dark-accent" />
                    <span className="text-sm font-medium text-dark-primary">6-Supplement Pack</span>
                  </div>
                  <p className="text-xs text-dark-secondary">
                    Estimated: {nextDeliveryDate ? 
                      new Date(nextDeliveryDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      }) : 
                      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        {profile?.subscription_tier === 'full' && (
          <div className="bg-dark-background border border-dark-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-dark-primary">Recent Orders</h4>
              <Button 
                variant="outline" 
                className="text-sm border-dark-border hover:bg-dark-border text-dark-primary hover:text-dark-primary bg-dark-panel"
                onClick={() => {
                  // TODO: Implement order history modal or page
                  alert('Order history feature coming soon!');
                }}
              >
                View All Orders
              </Button>
            </div>
            
            {isLoadingOrders ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-accent mx-auto mb-2"></div>
                <p className="text-sm text-dark-secondary">Loading orders...</p>
              </div>
            ) : subscriptionOrders.length > 0 ? (
              <div className="space-y-3">
                {subscriptionOrders.slice(0, 3).map((order, index) => {
                  const orderDate = new Date(order.order_date).toLocaleDateString();
                  const statusColors = {
                    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                    processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    shipped: 'bg-green-500/10 text-green-400 border-green-500/20',
                    delivered: 'bg-green-600/10 text-green-300 border-green-600/20',
                    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
                    cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  };
                  
                  return (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-dark-panel border border-dark-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-dark-accent/10 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-dark-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-dark-primary">6-Supplement Pack</p>
                          <p className="text-sm text-dark-secondary">
                            {order.shopify_order_id ? `Order #${order.shopify_order_id.slice(-6)}` : `Order #${order.id.slice(-6)}`} • {orderDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors] || statusColors.pending}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                        <p className="text-sm text-dark-accent font-medium mt-1">
                          ${order.order_total ? Number(order.order_total).toFixed(2) : '75.00'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Package className="h-12 w-12 text-dark-secondary mx-auto mb-3 opacity-50" />
                <p className="text-dark-secondary">No orders yet</p>
                <p className="text-sm text-dark-secondary mt-1">Your first order will appear here after generation</p>
              </div>
            )}
          </div>
        )}

        {/* Billing & Payment */}
        <div className="bg-dark-background border border-dark-border rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-dark-primary mb-4">Billing & Payment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-dark-secondary mb-2">Payment Method</p>
              <div className="flex items-center gap-3 p-3 bg-dark-panel border border-dark-border rounded-lg">
                <CreditCard className="h-5 w-5 text-dark-accent" />
                <div>
                  <p className="text-sm font-medium text-dark-primary">•••• •••• •••• 4242</p>
                  <p className="text-xs text-dark-secondary">Expires 12/25</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-dark-secondary mb-2">Next Billing Date</p>
              <div className="p-3 bg-dark-panel border border-dark-border rounded-lg">
                <p className="text-sm font-medium text-dark-primary">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-dark-secondary">
                  ${profile?.subscription_tier === 'full' ? '75.00' : '19.99'} will be charged
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button 
              variant="outline" 
              className="border-dark-border hover:bg-dark-border text-dark-primary hover:text-dark-primary bg-dark-panel"
              onClick={() => {
                // TODO: Implement payment method update
                alert('Payment method update coming soon!');
              }}
            >
              Update Payment Method
            </Button>
            <Button 
              variant="outline" 
              className="border-dark-border hover:bg-dark-border text-dark-primary hover:text-dark-primary bg-dark-panel"
              onClick={() => {
                // TODO: Implement billing history
                alert('Billing history feature coming soon!');
              }}
            >
              View Billing History
            </Button>
          </div>
        </div>

        {/* Plan Management */}
        <div className="bg-dark-background border border-dark-border rounded-lg p-6">
          <h4 className="text-lg font-semibold text-dark-primary mb-4">Plan Management</h4>
          
          {profile?.subscription_tier === 'software_only' ? (
            <div className="text-center py-6">
              <Package className="h-12 w-12 text-dark-accent mx-auto mb-4" />
              <h5 className="text-lg font-semibold text-dark-primary mb-2">Upgrade to Complete Package</h5>
              <p className="text-dark-secondary mb-4">
                Get monthly supplement delivery with your personalized recommendations
              </p>
              <div className="bg-dark-panel border border-dark-border rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between">
                  <span className="text-dark-primary">Complete Package</span>
                  <span className="text-dark-accent font-bold">$75.00/month</span>
                          </div>
                <p className="text-xs text-dark-secondary mt-1">
                  Includes everything in Software Only + monthly supplement delivery
                </p>
                        </div>
              <Button 
                className="bg-dark-accent text-white hover:bg-dark-accent/80"
                onClick={() => {
                  // TODO: Implement plan upgrade
                  alert('Plan upgrade feature coming soon!');
                }}
              >
                Upgrade Plan
              </Button>
                      </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-panel border border-dark-border rounded-lg">
                <div>
                  <p className="font-medium text-dark-primary">Pause Deliveries</p>
                  <p className="text-sm text-dark-secondary">Temporarily pause your monthly supplement deliveries</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-dark-border hover:bg-dark-border text-dark-primary hover:text-dark-primary bg-dark-panel"
                  onClick={() => {
                    // TODO: Implement delivery pause
                    alert('Delivery pause feature coming soon!');
                  }}
                >
                  Pause
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-dark-panel border border-dark-border rounded-lg">
                <div>
                  <p className="font-medium text-dark-primary">Downgrade to Software Only</p>
                  <p className="text-sm text-dark-secondary">Keep AI features, cancel supplement deliveries</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-dark-border hover:bg-dark-border text-orange-400 hover:text-orange-300 bg-dark-panel"
                  onClick={() => {
                    // TODO: Implement plan downgrade
                    alert('Plan downgrade feature coming soon!');
                  }}
                >
                  Downgrade
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-dark-panel border border-red-500/20 rounded-lg">
                <div>
                  <p className="font-medium text-red-400">Cancel Subscription</p>
                  <p className="text-sm text-dark-secondary">Cancel your subscription and end all services</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-300 bg-dark-panel"
                  onClick={() => {
                    // TODO: Implement subscription cancellation
                    alert('Subscription cancellation feature coming soon!');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-6 w-6 text-dark-secondary" />
          <h3 className="text-2xl font-semibold text-dark-primary">Account Settings</h3>
        </div>
        <p className="text-dark-secondary">
          Manage your account settings, notification preferences, and data privacy options.
        </p>
        <p className="text-dark-secondary text-sm mt-2">
          This feature is coming soon!
        </p>
      </div>
    </div>
  );

  const renderAIChat = () => {
    return (
      <div className="flex flex-col h-[calc(100vh-12rem)] lg:h-[calc(100vh-10rem)]"> {/* Better mobile height */}
        {/* Fixed Header */}
        <div className="flex-shrink-0 mb-4 lg:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold tracking-tight text-dark-primary">AI Assistant</h1>
              <p className="mt-1 text-sm lg:text-base text-dark-secondary">Your personalized health optimization expert.</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile Chat History Toggle */}
              <Button 
                onClick={() => setIsChatHistoryOpen(true)} 
                variant="outline" 
                className="lg:hidden text-dark-secondary border-dark-border bg-dark-panel hover:bg-dark-border hover:text-dark-primary"
                size="sm"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                History
              </Button>
              <Button onClick={startNewConversation} variant="outline" className="text-dark-secondary border-dark-border bg-dark-panel hover:bg-dark-border hover:text-dark-primary" size={typeof window !== 'undefined' && window.innerWidth < 640 ? "sm" : "default"}>
                <span className="hidden sm:inline">New Chat</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Chat History Modal */}
        {isChatHistoryOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
            <div 
              className="absolute inset-0"
              onClick={() => setIsChatHistoryOpen(false)}
            />
            <div className="relative w-full max-h-[70vh] bg-dark-panel border-t border-dark-border rounded-t-lg">
              <div className="flex items-center justify-between p-4 border-b border-dark-border">
                <h3 className="font-semibold text-dark-primary">Chat History</h3>
                <Button
                  onClick={() => setIsChatHistoryOpen(false)}
                  variant="outline"
                  size="sm"
                  className="border-dark-border text-dark-secondary hover:bg-dark-border"
                >
                  ✕
                </Button>
              </div>
              <div className="p-2 space-y-2 overflow-y-auto max-h-[50vh]">
                {chatHistory.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      loadConversation(conv.id);
                      setIsChatHistoryOpen(false);
                    }}
                    className={`w-full p-3 text-left rounded-md transition-colors ${currentConversationId === conv.id ? 'bg-dark-accent text-white' : 'hover:bg-dark-border'}`}
                  >
                    <p className="font-semibold truncate">{conv.title}</p>
                    <p className={`text-xs ${currentConversationId === conv.id ? 'text-white/70' : 'text-dark-secondary'}`}>{getTimeAgo(conv.updated_at)}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 min-h-0 gap-4 lg:gap-8">
          {/* Desktop Chat History Sidebar */}
          <div className="hidden lg:flex lg:flex-col w-1/3 max-w-sm flex-shrink-0">
            <div className="flex flex-col h-full bg-dark-panel border border-dark-border rounded-lg">
              <h3 className="flex-shrink-0 p-4 font-semibold border-b border-dark-border text-dark-primary">Chat History</h3>
              <div className="p-2 space-y-2 overflow-y-auto">
                {chatHistory.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`w-full p-3 text-left rounded-md transition-colors ${currentConversationId === conv.id ? 'bg-dark-accent text-white' : 'hover:bg-dark-border'}`}
                  >
                    <p className="font-semibold truncate">{conv.title}</p>
                    <p className={`text-xs ${currentConversationId === conv.id ? 'text-white/70' : 'text-dark-secondary'}`}>{getTimeAgo(conv.updated_at)}</p>
                  </button>
                    ))}
                  </div>
                </div>
              </div>
          
          {/* Main Chat Area */}
          <div className="flex flex-col flex-1 h-full min-w-0">
            <div className="flex flex-col h-full bg-dark-panel border border-dark-border rounded-lg">
              {/* Messages Container - This is the scrollable part */}
              <div ref={chatContainerRef} className="flex-1 p-3 lg:p-6 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-dark-secondary">
                    <div className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 mb-4 rounded-full bg-dark-accent/10 text-dark-accent">
                      <MessageSquare className="w-6 h-6 lg:w-8 lg:h-8" />
          </div>
                    <h3 className="text-base lg:text-lg font-semibold text-dark-primary">AI Health Assistant</h3>
                    <p className="text-sm lg:text-base">Ask me anything about your health data.</p>
                  </div>
                ) : (
                  <div className="space-y-4 lg:space-y-6">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`flex gap-2 lg:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' &&
                          <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-dark-accent">
                            <Sparkles className="w-3 h-3 lg:w-5 lg:h-5 text-white" />
                          </div>
                        }
                        <div className={`p-3 lg:p-4 rounded-lg max-w-[85%] lg:max-w-2xl ${msg.role === 'user' ? 'bg-dark-accent text-white' : 'bg-dark-background'}`}>
                          <div className="prose prose-sm prose-invert max-w-none prose-p:my-0 prose-p:text-dark-primary text-sm lg:text-base">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start gap-2 lg:gap-3">
                        <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-dark-accent">
                          <Sparkles className="w-3 h-3 lg:w-5 lg:h-5 text-white" />
                        </div>
                        <div className="p-3 lg:p-4 rounded-lg bg-dark-border">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-dark-accent animate-pulse" style={{ animationDelay: '0s' }} />
                            <div className="w-2 h-2 rounded-full bg-dark-accent animate-pulse" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 rounded-full bg-dark-accent animate-pulse" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 p-3 lg:p-4 bg-dark-panel border-t border-dark-border">
                <form onSubmit={(e) => { e.preventDefault(); if (chatInput.trim()) sendMessage(chatInput); }} className="relative">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (chatInput.trim()) sendMessage(chatInput);
                      }
                    }}
                    placeholder="Ask about your results, supplements, or health..."
                    className="w-full p-3 pr-12 lg:pr-16 text-white bg-dark-background border-2 border-dark-border rounded-lg resize-none placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent text-sm lg:text-base"
                    rows={1}
                    disabled={isChatLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isChatLoading || !chatInput.trim()}
                    className="absolute right-2 lg:right-3 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 p-0 bg-dark-accent text-white rounded-full hover:bg-dark-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-3 h-3 lg:w-4 lg:h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProductChecker = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-dark-primary">Product Compatibility Checker</h2>
          <p className="text-dark-secondary mt-1 text-sm lg:text-base">Analyze any supplement product against your unique health profile.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={toggleArchive}
          className="bg-dark-panel border-dark-border text-dark-primary hover:bg-dark-border self-start lg:self-auto"
          size="sm"
        >
          {showArchive ? 'Hide Archive' : 'View Archive'}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          value={productUrl}
          onChange={(e) => setProductUrl(e.target.value)}
          placeholder="Paste direct product link"
          className="flex-grow bg-dark-panel border border-dark-border rounded-md px-3 lg:px-4 py-2 text-dark-primary placeholder-dark-secondary focus:ring-2 focus:ring-dark-accent focus:outline-none text-sm lg:text-base"
          disabled={isCheckingProduct}
        />
        <Button onClick={checkProduct} disabled={isCheckingProduct || !productUrl} className="sm:flex-shrink-0">
          {isCheckingProduct ? 'Analyzing...' : 
            <>
              <Search className="w-4 h-4 mr-2" /> 
              <span className="hidden sm:inline">Analyze</span>
              <span className="sm:hidden">Check</span>
            </>
          }
        </Button>
      </div>

      {productCheckError && (
        <div className="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-md">
          <p><strong>Analysis Failed:</strong> {productCheckError}</p>
        </div>
      )}

      {isCheckingProduct && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-accent mx-auto"></div>
          <p className="mt-4 text-dark-secondary">Scraping product page and running analysis...</p>
        </div>
      )}

      {productAnalysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Overall Score Card */}
          <Card className="bg-dark-panel border-dark-border">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl md:text-2xl text-dark-primary">{productAnalysis.productName}</CardTitle>
              <CardDescription className="text-dark-secondary text-sm">{productAnalysis.brand}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`text-3xl sm:text-4xl font-bold ${productAnalysis.overallScore > 75 ? 'text-green-400' : productAnalysis.overallScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{productAnalysis.overallScore}/100</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-dark-primary text-base">Overall Compatibility</h4>
                  <p className="text-dark-secondary text-sm sm:text-base mt-1">{productAnalysis.summary}</p>
                </div>
                <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm ${
                  productAnalysis.recommendation === 'HIGHLY RECOMMENDED' ? 'bg-green-900/50 text-green-400' :
                  productAnalysis.recommendation === 'PROCEED WITH CAUTION' ? 'bg-yellow-900/50 text-yellow-400' :
                  'bg-red-900/50 text-red-400'
                }`}>
                  {productAnalysis.recommendation}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personalized Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <Card className="bg-dark-panel border-dark-border">
              <CardHeader>
                <CardTitle className="text-lg text-green-400 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2"/>
                  Personalized Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {productAnalysis.pros.map((pro: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-400 mr-2 mt-1">▪</span>
                      <span className="text-dark-secondary text-sm">{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-panel border-dark-border">
              <CardHeader>
                <CardTitle className="text-lg text-yellow-400 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2"/>
                  Concerns for Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {productAnalysis.cons.map((con: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-yellow-400 mr-2 mt-1">▪</span>
                      <span className="text-dark-secondary text-sm">{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Warnings */}
          {productAnalysis.warnings?.length > 0 && (
            <Card className="bg-red-900/30 border-red-700">
              <CardHeader>
                <CardTitle className="text-lg text-red-300 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2"/>
                  Critical Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {productAnalysis.warnings.map((warning: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-red-400 mr-2">▪</span>
                      <span className="text-red-300 text-sm">{warning}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Shocking Facts */}
          {productAnalysis.shocking_facts && (
            <Card className="bg-purple-900/20 border-purple-700">
              <CardHeader>
                <CardTitle className="text-lg text-purple-300 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2"/>
                  Shocking Facts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {productAnalysis.shocking_facts.map((fact: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-purple-400 mr-2">▪</span>
                      <span className="text-purple-200 text-sm">{fact}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Personalized Recommendations */}
          {productAnalysis.personalized_recommendations && (
            <Card className="bg-dark-panel border-dark-border">
              <CardHeader>
                <CardTitle className="text-lg text-dark-primary flex items-center">
                  <User className="w-5 h-5 mr-2 text-dark-accent"/>
                  Your Personalized Action Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {productAnalysis.personalized_recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-dark-accent mr-2 font-bold">{i + 1}.</span>
                      <span className="text-dark-secondary">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          {productAnalysis.disclaimer && (
            <div className="text-xs text-dark-secondary italic p-4 bg-dark-panel/50 rounded-lg border border-dark-border">
              <p>{productAnalysis.disclaimer}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Archive Section */}
      {showArchive && (
            <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div className="border-t border-dark-border pt-8">
            <h3 className="text-2xl font-bold text-dark-primary mb-4">Product Check History</h3>
            
            {isLoadingHistory ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-accent mx-auto"></div>
                <p className="mt-2 text-dark-secondary">Loading history...</p>
              </div>
            ) : productHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-dark-secondary">No product checks yet. Analyze a product to start building your history!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {productHistory.map((check) => (
                  <Card key={check.id} className="bg-dark-panel border-dark-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-dark-primary">{check.product_name}</h4>
                          <p className="text-sm text-dark-secondary">{check.brand}</p>
                          <p className="text-xs text-dark-secondary mt-1">{getTimeAgo(check.created_at)}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className={`text-2xl font-bold ${check.overall_score > 75 ? 'text-green-400' : check.overall_score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {check.overall_score}/100
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setProductAnalysis(check.full_analysis)}
                            className="bg-dark-background border-dark-border text-dark-primary hover:bg-dark-border"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-dark-secondary mt-2 line-clamp-2">{check.analysis_summary}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderStudyBuddy = () => (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="p-3 bg-dark-border rounded-lg self-start">
            <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 text-dark-accent" />
                    </div>
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-dark-primary">Study Buddy</h1>
            <p className="text-base lg:text-lg text-dark-secondary mt-1">
              Personalized analysis of scientific research based on your genetics, biomarkers, and health profile
            </p>
                    </div>
                  </div>
                </div>

      {/* URL Input Section */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-semibold text-dark-primary mb-4">Analyze a New Study</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="url"
              value={studyUrl}
              onChange={(e) => setStudyUrl(e.target.value)}
              placeholder="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3869616/"
              className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-dark-background border border-dark-border rounded-lg text-dark-primary placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent text-sm lg:text-base"
            />
          </div>
          <Button
            onClick={analyzeStudy}
            disabled={isAnalyzingStudy || !studyUrl}
            className="bg-dark-accent text-white hover:bg-dark-accent/80 px-4 lg:px-6 py-2 lg:py-3 sm:flex-shrink-0"
          >
            {isAnalyzingStudy ? (
                  <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Analyzing...</span>
                <span className="sm:hidden">...</span>
                    </div>
            ) : (
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Analyze Study</span>
                <span className="sm:hidden">Analyze</span>
                    </div>
            )}
          </Button>
                  </div>
        {studyError && (
          <div className="mt-4 p-3 lg:p-4 bg-red-900/50 border border-red-600 rounded-lg">
            <p className="text-red-400 text-sm lg:text-base">{studyError}</p>
          </div>
        )}
                </div>

      {/* Latest Analysis */}
      {studyAnalysis && (
        <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-dark-primary mb-4">Latest Analysis</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-dark-secondary">Personal Relevance:</span>
                <span className="text-2xl font-bold text-dark-accent">{studyAnalysis.relevanceScore}/10</span>
                    </div>
                    </div>
            
            <div>
              <h3 className="font-semibold text-dark-accent mb-2">Personalized Summary</h3>
              <p className="text-dark-secondary">{studyAnalysis.personalizedSummary}</p>
                  </div>
            
            <div>
              <h3 className="font-semibold text-dark-accent mb-2">Personal Explanation</h3>
              <p className="text-dark-secondary">{studyAnalysis.personalizedExplanation}</p>
                </div>

            <div>
              <h3 className="font-semibold text-dark-accent mb-2">Key Findings</h3>
              <ul className="space-y-2">
                {studyAnalysis.keyFindings?.map((finding: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-dark-accent mt-1">•</span>
                    <span className="text-dark-secondary">{finding}</span>
                  </li>
                ))}
              </ul>
                    </div>
            
            <div>
              <h3 className="font-semibold text-dark-accent mb-2">Your Personalized Recommendations</h3>
              <ul className="space-y-2">
                {studyAnalysis.actionableRecommendations?.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-dark-secondary">{rec}</span>
                  </li>
                ))}
              </ul>
                    </div>
                  </div>
                </div>
      )}

      {/* Study History */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-dark-primary mb-4">Your Study History</h2>
        {isLoadingStudies ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-accent mx-auto"></div>
            <p className="mt-2 text-dark-secondary">Loading studies...</p>
          </div>
        ) : userStudies.length > 0 ? (
          <div className="space-y-4">
            {userStudies.map((study) => (
              <div
                key={study.id}
                className="p-4 bg-dark-background border border-dark-border rounded-lg hover:border-dark-accent transition-colors cursor-pointer"
                onClick={() => setSelectedStudy(study)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-primary mb-1">
                      {study.study_title || 'Unknown Title'}
                    </h3>
                    <p className="text-dark-secondary text-sm mb-2 line-clamp-2">
                      {study.personalized_summary || 'No summary available'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-dark-secondary">
                      <span>Relevance: {study.relevance_score}/10</span>
                      <span>{new Date(study.created_at).toLocaleDateString()}</span>
                      {study.pmid && <span>PMID: {study.pmid}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-dark-border text-dark-secondary hover:bg-dark-border"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(study.study_url, '_blank');
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    </div>
                    </div>
                  </div>
            ))}
                </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-dark-secondary mx-auto mb-4" />
            <p className="text-dark-secondary">No studies analyzed yet.</p>
            <p className="text-dark-secondary text-sm">Add a study URL above to get started!</p>
              </div>
        )}
          </div>

      {/* Selected Study Detail Modal */}
      {selectedStudy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-panel border border-dark-border rounded-xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-dark-primary">Study Analysis</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStudy(null)}
                className="border-dark-border text-dark-secondary hover:bg-dark-border"
              >
                ✕
              </Button>
        </div>

            <div className="space-y-6">
              {/* Study Header */}
              <div>
                <h3 className="text-xl font-semibold text-dark-primary mb-2">{selectedStudy.study_title}</h3>
                {selectedStudy.study_authors && (
                  <p className="text-dark-secondary text-sm mb-2">{selectedStudy.study_authors}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-dark-secondary mb-4">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400" />
                    Personal Relevance: {selectedStudy.relevance_score}/10
                  </span>
                  <span>{new Date(selectedStudy.created_at).toLocaleDateString()}</span>
                  {selectedStudy.pmid && <span>PMID: {selectedStudy.pmid}</span>}
                  {selectedStudy.journal_name && <span>{selectedStudy.journal_name}</span>}
                </div>
              </div>
              
              {/* Personalized Summary */}
              <div>
                <h4 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-dark-accent" />
                  Personalized Summary
                </h4>
                <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                  <p className="text-dark-primary leading-relaxed">{selectedStudy.personalized_summary}</p>
                </div>
              </div>

              {/* Personal Explanation */}
              <div>
                <h4 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-dark-accent" />
                  Personal Explanation
                </h4>
                <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                  <p className="text-dark-primary leading-relaxed">{selectedStudy.personalized_explanation}</p>
                </div>
              </div>
              
              {/* Key Findings */}
              <div>
                <h4 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-dark-accent" />
                  Key Findings
                </h4>
                <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                  <ul className="space-y-3">
                    {selectedStudy.key_findings?.map((finding: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-dark-accent mt-1 text-lg">•</span>
                        <span className="text-dark-primary leading-relaxed">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Your Personalized Recommendations */}
              <div>
                <h4 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Your Personalized Recommendations
                </h4>
                <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                  <ul className="space-y-3">
                    {selectedStudy.actionable_recommendations?.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-green-400 mt-1 text-lg font-bold">✓</span>
                        <span className="text-dark-primary leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Important Considerations */}
              {selectedStudy.limitations && selectedStudy.limitations.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    Important Considerations
                  </h4>
                  <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                    <ul className="space-y-3">
                      {selectedStudy.limitations.map((limitation: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-yellow-400 mt-1 text-lg">⚠</span>
                          <span className="text-dark-primary leading-relaxed">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-dark-border">
              <Button
                onClick={() => window.open(selectedStudy.study_url, '_blank')}
                className="bg-dark-accent text-white hover:bg-dark-accent/80"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Original Study
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardContent();
      case 'supplement-plan':
        return renderSupplementPlan();
      case 'diet-groceries':
        return renderDietGroceries();
      case 'analysis':
        return renderEnhancedAnalysis();
      case 'tracking':
        return renderTracking();
      case 'ai-chat':
        return renderAIChat();
      case 'product-checker':
        return renderProductChecker();
      case 'study-buddy':
        return renderStudyBuddy();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboardContent();
    }
  };

  const toggleBiomarker = (index: number) => {
    const newExpanded = new Set(expandedBiomarkers);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedBiomarkers(newExpanded);
  };

  const toggleSnp = (index: number) => {
    const newExpanded = new Set(expandedSnps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSnps(newExpanded);
  };

  // AI Chat functions - Session Management
  const initializeChatSession = () => {
    if (!currentSessionId) {
      const sessionId = crypto.randomUUID();
      setCurrentSessionId(sessionId);
      return sessionId;
    }
    return currentSessionId;
  };

  const endChatSession = () => {
    setCurrentSessionId(null);
    setCurrentConversationId(null);
    setChatMessages([]);
  };



  const sendMessage = async (message: string) => {
    // MOCK FUNCTION - No API calls, just demo behavior
    if (!message.trim() || isChatLoading) return;

    setIsChatLoading(true);
    
    const userMessage = {
      role: 'user' as const,
      content: message,
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate AI response time
    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant' as const,
        content: 'This is a demo response. In the real app, I would provide personalized health insights based on your specific biomarkers, genetic variants, and health profile. I can help explain your supplement plan, analyze studies, and answer questions about your health optimization journey.',
      };

      setChatMessages(prev => [...prev, assistantMessage]);
      setIsChatLoading(false);
    }, 2000);
  };
  
  const loadChatHistory = async () => {
    // MOCK FUNCTION - No API calls, just demo behavior
    setChatHistory(MOCK_CHAT_HISTORY);
  };

  const loadConversation = async (conversationId: string) => {
    // MOCK FUNCTION - No API calls, just demo behavior
    endChatSession();
    setCurrentConversationId(conversationId);
    
    // Load mock conversation based on ID
    setChatMessages(MOCK_CHAT_MESSAGES);
  };

  const startNewConversation = () => {
    endChatSession();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Referral functions
  const copyReferralCode = async () => {
    if (profile?.referral_code) {
      await navigator.clipboard.writeText(profile.referral_code);
      setCopiedReferralCode(true);
      setTimeout(() => setCopiedReferralCode(false), 2000);
    }
  };

  const copyReferralUrl = async () => {
    if (profile?.referral_code) {
      const url = generateReferralUrl(profile.referral_code);
      await navigator.clipboard.writeText(url);
      setCopiedReferralUrl(true);
      setTimeout(() => setCopiedReferralUrl(false), 2000);
    }
  };

  const generateReferralCodeForExistingUser = async () => {
    // MOCK FUNCTION - No API calls, just demo behavior
    if (profile?.referral_code) return;

    // Simulate generating a referral code
    setTimeout(() => {
      setProfile({
        ...profile,
        referral_code: 'ALEX2025'
      });
    }, 1000);
  };

  const checkProduct = async () => {
    // MOCK FUNCTION - No API calls, just demo behavior
    if (!productUrl.trim()) {
      setProductCheckError('Please enter a product URL');
      return;
    }

    setIsCheckingProduct(true);
    setProductCheckError(null);
    setProductAnalysis(null);
    
    // Simulate analysis time
    setTimeout(() => {
      setProductAnalysis(MOCK_PRODUCT_ANALYSIS);
      setIsCheckingProduct(false);
    }, 3000);
  };

  const loadProductHistory = async () => {
    // MOCK FUNCTION - No API calls, just demo behavior
    setIsLoadingHistory(true);
    
    // Simulate loading time
    setTimeout(() => {
      setProductHistory(MOCK_PRODUCT_HISTORY);
      setIsLoadingHistory(false);
    }, 1000);
  };

  const loadSubscriptionOrders = async () => {
    // MOCK FUNCTION - No API calls, just demo behavior
    if (profile?.subscription_tier !== 'full') return;
    
    setIsLoadingOrders(true);
    
    // Simulate loading time
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'order-1',
          user_id: 'demo-user',
          shopify_order_id: '5678901234',
          order_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          order_total: 75.00,
          status: 'delivered',
          next_order_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'order-2',
          user_id: 'demo-user',
          shopify_order_id: '4567890123',
          order_date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          order_total: 75.00,
          status: 'delivered',
          next_order_date: null
        }
      ];
      
      setSubscriptionOrders(mockOrders);
      setNextDeliveryDate(mockOrders[0].next_order_date);
      setIsLoadingOrders(false);
    }, 1000);
  };

  const toggleArchive = () => {
    setShowArchive(!showArchive);
    if (!showArchive && productHistory.length === 0) {
      loadProductHistory();
    }
  };

  return (
    <div className="min-h-screen bg-dark-background text-dark-primary font-sans">
      <DashboardGradient />
      
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-dark-background z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-dark-border border-t-dark-accent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-dark-primary mb-2">Loading Analysis Engine...</h2>
            <p className="text-dark-secondary">Calibrating biometric signature</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {!isLoading && (
        <motion.div 
            className="flex min-h-screen relative bg-dark-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mobile Menu Button - Fixed position with proper z-index */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden fixed top-4 left-4 z-[100] p-3 bg-dark-panel border border-dark-border rounded-xl shadow-xl hover:bg-dark-border transition-all duration-200 hover:scale-105"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5 text-dark-primary" />
            </button>

            {/* Mobile Backdrop - Proper z-index */}
            {isMobileMenuOpen && (
              <div 
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex w-64 bg-dark-panel border-r border-dark-border flex-col">
              {/* Desktop Sidebar Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* User Profile */}
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-dark-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-dark-accent font-semibold text-sm">A</span>
                  </div>
                  <div>
                    <h3 className="text-dark-primary font-medium">Alex Thompson</h3>
                    <p className="text-dark-secondary text-sm">user: Alex Thompson</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as TabType)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-dark-accent/10 text-dark-accent border-r-2 border-dark-accent'
                          : 'text-dark-secondary hover:bg-dark-border hover:text-dark-primary'
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Sign Out Button */}
                <div className="mt-8 pt-6 border-t border-dark-border">
                  <button className="w-full flex items-center space-x-3 px-3 py-3 text-dark-secondary hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors">
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Slide-out Sidebar */}
            <div className={`
              lg:hidden fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-dark-panel border-r border-dark-border z-[95]
              transform transition-transform duration-300 ease-in-out
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex justify-between items-center p-4 border-b border-dark-border">
                  <h2 className="text-lg font-semibold text-dark-primary">SupplementScribe</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                    aria-label="Close navigation menu"
                  >
                    <X className="h-5 w-5 text-dark-primary" />
                  </button>
                </div>

                {/* Mobile User Profile */}
                <div className="p-4 border-b border-dark-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-dark-accent/20 rounded-full flex items-center justify-center">
                      <span className="text-dark-accent font-semibold">A</span>
                    </div>
                    <div>
                      <h3 className="text-dark-primary font-medium">Alex Thompson</h3>
                      <p className="text-dark-secondary text-sm">user: Alex Thompson</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as TabType);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-left transition-all duration-200 ${
                          activeTab === item.id
                            ? 'bg-dark-accent/10 text-dark-accent border border-dark-accent/20'
                            : 'text-dark-secondary hover:bg-dark-border hover:text-dark-primary'
                        }`}
                      >
                        <item.icon className="h-6 w-6 flex-shrink-0" />
                        <span className="font-medium text-base">{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Mobile Sign Out */}
                <div className="p-4 border-t border-dark-border">
                  <button className="w-full flex items-center space-x-3 px-4 py-4 text-dark-secondary hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-colors">
                    <LogOut className="h-6 w-6" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content - Fixed mobile layout */}
            <main className="flex-1 overflow-auto bg-dark-background">
              <div className="pt-20 lg:pt-4 px-4 lg:px-6 pb-6">
                {renderContent()}
              </div>
            </main>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Share Graphics Modal */}
      {showShareGraphics && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-background border border-dark-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-dark-primary">Share Your Stack</h2>
                <Button
                  onClick={() => setShowShareGraphics(false)}
                  variant="outline"
                  size="sm"
                  className="border-dark-border text-dark-secondary hover:bg-dark-border"
                >
                  ✕
                </Button>
      </div>
              
              {profile?.referral_code && plan?.recommendations && (
                <ShareGraphics
                  userName={profile.full_name || 'Anonymous'}
                  supplements={plan.recommendations.map((rec: any) => rec.supplement)}
                  healthScore={profile.health_score}
                  referralCode={profile.referral_code}
                  referralUrl={generateReferralUrl(profile.referral_code)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 