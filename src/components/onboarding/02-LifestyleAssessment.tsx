"use client";

import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { OnboardingData } from '@/lib/schemas';
import { PremiumButton, ProgressDots } from './shared/DesignSystem';

const LIFESTYLE_QUESTIONS = [
  {
    key: 'energy_levels' as keyof OnboardingData,
    question: 'Do you often feel tired or low energy?',
    note: 'Helps us identify energy-boosting nutrients like B-vitamins and iron'
  },
  {
    key: 'effort_fatigue' as keyof OnboardingData,
    question: 'Does physical activity feel more difficult than it should?',
    note: 'Guides us to performance-enhancing supplements like CoQ10'
  },
  {
    key: 'caffeine_effect' as keyof OnboardingData,
    question: 'Do you rely on caffeine to get through the day?',
    note: 'Helps us find natural energy alternatives to reduce dependence'
  },
  {
    key: 'digestive_issues' as keyof OnboardingData,
    question: 'Do you experience digestive discomfort regularly?',
    note: 'Directs us to gut-healing nutrients and probiotics'
  },
  {
    key: 'stress_levels' as keyof OnboardingData,
    question: 'Do you feel stressed or anxious frequently?',
    note: 'Identifies need for stress-fighting nutrients like magnesium'
  },
  {
    key: 'sleep_quality' as keyof OnboardingData,
    question: 'Do you have trouble falling asleep or staying asleep?',
    note: 'Helps us select sleep-promoting supplements like melatonin'
  },
  {
    key: 'mood_changes' as keyof OnboardingData,
    question: 'Do you experience mood swings or irritability?',
    note: 'Guides us to mood-stabilizing nutrients like omega-3s'
  },
  {
    key: 'brain_fog' as keyof OnboardingData,
    question: 'Do you experience brain fog or difficulty concentrating?',
    note: 'Helps us choose brain-boosting supplements for mental clarity'
  },
  {
    key: 'sugar_cravings' as keyof OnboardingData,
    question: 'Do you crave sugar or processed foods?',
    note: 'Identifies need for blood sugar stabilizing nutrients'
  },
  {
    key: 'skin_issues' as keyof OnboardingData,
    question: 'Do you have skin problems (acne, dryness, sensitivity)?',
    note: 'Directs us to skin-supporting vitamins like zinc and vitamin E'
  },
  {
    key: 'joint_pain' as keyof OnboardingData,
    question: 'Do you experience joint pain or stiffness?',
    note: 'Helps us include anti-inflammatory supplements like turmeric'
  },
  {
    key: 'immune_system' as keyof OnboardingData,
    question: 'Do you get sick more often than you\'d like?',
    note: 'Guides us to immune-boosting nutrients like vitamin C and D'
  },
  {
    key: 'workout_recovery' as keyof OnboardingData,
    question: 'Do you take longer to recover from workouts?',
    note: 'Helps us select recovery-enhancing supplements'
  },
  {
    key: 'food_sensitivities' as keyof OnboardingData,
    question: 'Do certain foods make you feel unwell?',
    note: 'Identifies need for digestive enzymes and gut repair nutrients'
  },
  {
    key: 'weight_management' as keyof OnboardingData,
    question: 'Is it difficult to maintain a healthy weight?',
    note: 'Guides us to metabolism-supporting supplements'
  },
  {
    key: 'medication_history' as keyof OnboardingData,
    question: 'Have you ever been prescribed ADHD/Anxiety meds AND they haven\'t worked?',
    note: 'Helps us identify nutrients that may enhance medication effectiveness'
  }
];

interface LifestyleAssessmentProps {
  currentSubStep: number;
  onSubStepComplete: () => void;
  totalSubSteps: number;
}

export function LifestyleAssessment({ 
  currentSubStep, 
  onSubStepComplete, 
  totalSubSteps 
}: LifestyleAssessmentProps) {
  const form = useFormContext<OnboardingData>();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const currentQuestion = LIFESTYLE_QUESTIONS[currentSubStep - 1];
  
  const handleAnswer = (answer: 'yes' | 'no') => {
    form.setValue(currentQuestion.key, answer, { shouldValidate: true });
    
    // Add smooth transition
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
      onSubStepComplete();
    }, 200);
  };
  
  if (!currentQuestion) return null;
  
  return (
    <div className={`text-center space-y-4 transition-all duration-200 ${
      isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
    }`}>
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          {currentQuestion.question}
        </h2>
        
        {/* Personalization note */}
        <div className="bg-blue-50 rounded-lg p-2.5 mb-3">
          <p className="text-sm text-blue-700 font-medium">
            💡 {currentQuestion.note}
          </p>
        </div>
      </div>
      
      <div className="flex gap-3 justify-center">
        <PremiumButton
          onClick={() => handleAnswer('yes')}
          variant="primary"
          size="md"
          className="px-10 py-3 text-base font-bold"
          disabled={isTransitioning}
        >
          Yes
        </PremiumButton>
        
        <PremiumButton
          onClick={() => handleAnswer('no')}
          variant="secondary"
          size="md"
          className="px-10 py-3 text-base font-bold"
          disabled={isTransitioning}
        >
          No
        </PremiumButton>
      </div>
      
      {/* Progress indicator */}
      <div className="text-xs text-gray-400">
        {currentSubStep} of {totalSubSteps}
      </div>
    </div>
  );
} 