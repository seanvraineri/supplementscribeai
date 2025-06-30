"use client";

import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { OnboardingData } from '@/lib/schemas';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const LIFESTYLE_QUESTIONS = [
  {
    key: 'energy_levels' as keyof OnboardingData,
    question: 'Do you often feel tired or low energy?',
    note: 'Helps us identify energy-boosting nutrients like B-vitamins and iron',
    placeholder: 'e.g., "Crash after lunch around 2pm every day"'
  },
  {
    key: 'effort_fatigue' as keyof OnboardingData,
    question: 'Does physical activity feel more difficult than it should?',
    note: 'Guides us to performance-enhancing supplements like CoQ10',
    placeholder: 'e.g., "Get winded walking up stairs, muscles feel heavy"'
  },
  {
    key: 'caffeine_effect' as keyof OnboardingData,
    question: 'Do you rely on caffeine to get through the day?',
    note: 'Helps us find natural energy alternatives to reduce dependence',
    placeholder: 'e.g., "Need 3-4 cups of coffee, crash without it"'
  },
  {
    key: 'digestive_issues' as keyof OnboardingData,
    question: 'Do you experience digestive discomfort regularly?',
    note: 'Directs us to gut-healing nutrients and probiotics',
    placeholder: 'e.g., "Bloating after meals, worse with dairy"'
  },
  {
    key: 'stress_levels' as keyof OnboardingData,
    question: 'Do you feel stressed or anxious frequently?',
    note: 'Identifies need for stress-fighting nutrients like magnesium',
    placeholder: 'e.g., "Work stress causes racing thoughts at night"'
  },
  {
    key: 'sleep_quality' as keyof OnboardingData,
    question: 'Do you have trouble falling asleep or staying asleep?',
    note: 'Helps us select sleep-promoting supplements like melatonin',
    placeholder: 'e.g., "Wake up at 3am and can\'t fall back asleep"'
  },
  {
    key: 'mood_changes' as keyof OnboardingData,
    question: 'Do you experience mood swings or irritability?',
    note: 'Guides us to mood-stabilizing nutrients like omega-3s',
    placeholder: 'e.g., "Irritable in afternoons, worse before meals"'
  },
  {
    key: 'brain_fog' as keyof OnboardingData,
    question: 'Do you experience brain fog or difficulty concentrating?',
    note: 'Helps us choose brain-boosting supplements for mental clarity',
    placeholder: 'e.g., "Can\'t focus after lunch, forget words"'
  },
  {
    key: 'sugar_cravings' as keyof OnboardingData,
    question: 'Do you crave sugar or processed foods?',
    note: 'Identifies need for blood sugar stabilizing nutrients',
    placeholder: 'e.g., "Intense cravings at 3pm and after dinner"'
  },
  {
    key: 'skin_issues' as keyof OnboardingData,
    question: 'Do you have skin problems (acne, dryness, sensitivity)?',
    note: 'Directs us to skin-supporting vitamins like zinc and vitamin E',
    placeholder: 'e.g., "Dry patches in winter, breakouts during stress"'
  },
  {
    key: 'joint_pain' as keyof OnboardingData,
    question: 'Do you experience joint pain or stiffness?',
    note: 'Helps us include anti-inflammatory supplements like turmeric',
    placeholder: 'e.g., "Knees hurt in morning, better with movement"'
  },
  {
    key: 'immune_system' as keyof OnboardingData,
    question: 'Do you get sick more often than you\'d like?',
    note: 'Guides us to immune-boosting nutrients like vitamin C and D',
    placeholder: 'e.g., "Catch every cold that goes around the office"'
  },
  {
    key: 'workout_recovery' as keyof OnboardingData,
    question: 'Do you take longer to recover from workouts?',
    note: 'Helps us select recovery-enhancing supplements',
    placeholder: 'e.g., "Sore for 3-4 days after moderate exercise"'
  },
  {
    key: 'food_sensitivities' as keyof OnboardingData,
    question: 'Do certain foods make you feel unwell?',
    note: 'Identifies need for digestive enzymes and gut repair nutrients',
    placeholder: 'e.g., "Gluten causes bloating, dairy causes congestion"'
  },
  {
    key: 'weight_management' as keyof OnboardingData,
    question: 'Is it difficult to maintain a healthy weight?',
    note: 'Guides us to metabolism-supporting supplements',
    placeholder: 'e.g., "Gain weight easily, hard to lose despite diet"'
  },
  {
    key: 'medication_history' as keyof OnboardingData,
    question: 'Have you ever been prescribed ADHD/Anxiety meds AND they haven\'t worked?',
    note: 'Helps us identify nutrients that may enhance medication effectiveness',
    placeholder: 'e.g., "Tried Adderall but felt jittery with no focus improvement"'
  }
];

interface LifestyleAssessmentProps {
  onNext: () => void;
  onBack?: () => void;
}

export function LifestyleAssessment({ onNext, onBack }: LifestyleAssessmentProps) {
  const form = useFormContext<OnboardingData>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showTextArea, setShowTextArea] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<'yes' | 'no' | null>(null);
  
  const currentQuestion = LIFESTYLE_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === LIFESTYLE_QUESTIONS.length - 1;
  
  // Load previous answer when navigating between questions
  useEffect(() => {
    const savedAnswer = form.watch(currentQuestion.key);
    if (savedAnswer === 'yes' || savedAnswer === 'no') {
      setSelectedAnswer(savedAnswer as 'yes' | 'no');
      setShowTextArea(savedAnswer === 'yes');
    } else {
      setSelectedAnswer(null);
      setShowTextArea(false);
    }
  }, [currentQuestionIndex, currentQuestion.key, form]);

  const handleAnswer = (answer: 'yes' | 'no') => {
    setSelectedAnswer(answer);
    form.setValue(currentQuestion.key, answer, { shouldValidate: true });
    
    if (answer === 'yes') {
      setShowTextArea(true);
    } else {
      setShowTextArea(false);
      // Clear the details field if answer is 'no'
      const detailsKey = `${currentQuestion.key}_details` as keyof OnboardingData;
      form.setValue(detailsKey, '', { shouldValidate: true });
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const canProceed = selectedAnswer !== null;
  
  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Question */}
          <h3 className="text-xl sm:text-2xl font-medium text-dark-primary text-center">
            {currentQuestion.question}
          </h3>
          
          {/* Help text */}
          <p className="text-sm text-dark-secondary text-center">
            💡 {currentQuestion.note}
          </p>
          
          {/* Yes/No buttons */}
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => handleAnswer('yes')}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 min-w-[120px] ${
                selectedAnswer === 'yes'
                  ? 'bg-dark-accent text-white shadow-lg shadow-cyan-500/20 scale-105'
                  : 'bg-dark-panel text-dark-primary border border-dark-border hover:border-dark-accent hover:scale-102'
              }`}
            >
              Yes
            </button>
            
            <button
              type="button"
              onClick={() => handleAnswer('no')}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 min-w-[120px] ${
                selectedAnswer === 'no'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50 scale-105'
                  : 'bg-dark-panel text-dark-primary border border-dark-border hover:border-red-500/50 hover:scale-102'
              }`}
            >
              No
            </button>
          </div>
          
          {/* Text area that appears when Yes is clicked */}
          <AnimatePresence>
            {showTextArea && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <textarea
                  className="w-full p-4 bg-dark-background border border-dark-border rounded-lg text-dark-primary placeholder-dark-secondary focus:border-dark-accent focus:outline-none transition-colors resize-none text-sm"
                  placeholder={`Optional: ${currentQuestion.placeholder}`}
                  rows={3}
                  maxLength={500}
                  style={{ fontSize: '16px' }}
                  {...form.register(`${currentQuestion.key}_details` as keyof OnboardingData)}
                />
                <div className="text-xs text-dark-secondary mt-1 text-right">
                  {(form.watch(`${currentQuestion.key}_details` as keyof OnboardingData) as string)?.length || 0}/500
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Navigation buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={handlePrevious}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-dark-secondary hover:text-dark-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              {currentQuestionIndex === 0 && onBack ? 'Back' : 'Previous'}
            </button>
            
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              className={`inline-flex items-center gap-2 px-6 py-3 text-base rounded-full font-medium transition-all duration-200 transform ${
                canProceed 
                  ? 'bg-dark-accent text-white shadow-lg hover:shadow-cyan-500/50 hover:scale-105' 
                  : 'bg-dark-border text-dark-secondary cursor-not-allowed'
              }`}
            >
              {isLastQuestion ? 'Continue' : 'Next'}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 