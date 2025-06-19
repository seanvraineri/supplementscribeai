'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, type OnboardingData } from '@/lib/schemas';

// Import new frictionless onboarding components
import { HealthGoalsStep } from '@/components/onboarding/01-HealthGoalsStep';
import { LifestyleAssessment, LIFESTYLE_QUESTIONS } from '@/components/onboarding/02-LifestyleAssessment';
import { ActivityLevelStep } from '@/components/onboarding/03-ActivityLevelStep';
import { SleepHoursStep } from '@/components/onboarding/04-SleepHoursStep';
import { AlcoholStep } from '@/components/onboarding/05-AlcoholStep';
import { HealthProfileStep } from '@/components/onboarding/06-HealthProfileStep';
import { PrimaryConcernStep } from '@/components/onboarding/07-PrimaryConcernStep';
import { OptionalDataStep } from '@/components/onboarding/08-OptionalDataStep';
import { PersonalDetailsStep } from '@/components/onboarding/09-PersonalDetailsStep';
import { ReviewStep } from '@/components/onboarding/10-ReviewStep';
import { StepContainer } from '@/components/onboarding/shared/DesignSystem';

import { saveOnboardingData } from './actions';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, Brain, Heart, FileText, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  active: boolean;
}

// Step titles and subtitles
const STEP_INFO = [
  {
    title: "Health Goals",
    subtitle: "Select all that apply - we'll create a personalized plan"
  },
  {
    title: "Lifestyle Assessment",
    subtitle: "A few quick questions to understand you better"
  },
  {
    title: "Activity Level",
    subtitle: "This helps us customize your supplement needs"
  },
  {
    title: "Sleep Habits",
    subtitle: "On average, how many hours do you sleep per night?"
  },
  {
    title: "Alcohol Consumption",
    subtitle: "This affects supplement absorption and recommendations"
  },
  {
    title: "Health Profile",
    subtitle: "Help us ensure your supplements are safe and effective for you"
  },
  {
    title: "Primary Health Concern",
    subtitle: "This helps us prioritize your recommendations"
  },
  {
    title: "Optional Health Data",
    subtitle: "Only if you happen to know any of these details"
  },
  {
    title: "Personal Details",
    subtitle: "Just a few final details to complete your profile"
  },
  {
    title: "Review & Submit",
    subtitle: "One final look before we generate your plan"
  }
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    {
      id: 'profile',
      title: 'Saving Profile',
      description: 'Securely storing your health information and preferences',
      icon: <User className="h-5 w-5" />,
      completed: false,
      active: false
    },
    {
      id: 'analyze',
      title: 'Health Analysis',
      description: 'AI-powered analysis of your health patterns and symptoms',
      icon: <Brain className="h-5 w-5" />,
      completed: false,
      active: false
    },
    {
      id: 'plan',
      title: 'Personalized Plan',
      description: 'Creating your custom 6-supplement protocol',
      icon: <Sparkles className="h-5 w-5" />,
      completed: false,
      active: false
    },
    {
      id: 'health-score',
      title: 'Health Score',
      description: 'Generating your AI-powered health assessment',
      icon: <Brain className="h-5 w-5" />,
      completed: false,
      active: false
    },
    {
      id: 'complete',
      title: 'Ready!',
      description: 'Your personalized health plan is ready',
      icon: <Heart className="h-5 w-5" />,
      completed: false,
      active: false
    }
  ]);
  const router = useRouter();

  const updateProcessingStep = (stepId: string, completed: boolean = false, active: boolean = true) => {
    setProcessingSteps(prev => prev.map(step => ({
      ...step,
      completed: step.id === stepId ? completed : step.completed,
      active: step.id === stepId ? active : (step.completed ? false : step.active)
    })));
  };

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      age: '' as any,
      gender: undefined,
      height_ft: '' as any,
      height_in: '' as any,
      weight_lbs: '' as any,
      healthGoals: [],
      customHealthGoal: '',
      allergies: [],
      conditions: [],
      medications: [],
      activity_level: undefined,
      sleep_hours: '' as any,
      alcohol_intake: undefined,
      // New 16 lifestyle questions
      energy_levels: undefined,
      effort_fatigue: undefined,
      caffeine_effect: undefined,
      digestive_issues: undefined,
      stress_levels: undefined,
      sleep_quality: undefined,
      mood_changes: undefined,
      brain_fog: undefined,
      sugar_cravings: undefined,
      skin_issues: undefined,
      joint_pain: undefined,
      immune_system: undefined,
      workout_recovery: undefined,
      food_sensitivities: undefined,
      weight_management: undefined,
      medication_history: undefined,
      // Backwards compatibility fields
      anxiety_level: undefined,
      stress_resilience: undefined,
      sleep_aids: undefined,
      bloating: undefined,
      digestion_speed: undefined,
      anemia_history: undefined,
      bruising_bleeding: undefined,
      belly_fat: undefined,
      primary_health_concern: '',
      known_biomarkers: '',
      known_genetic_variants: '',
    }
  });
  
  const steps = [
    { id: 1, component: HealthGoalsStep, title: 'Health Goals', fields: ['healthGoals', 'customHealthGoal'] },
    { id: 2, component: () => <div>Lifestyle Assessment</div>, title: 'Lifestyle Assessment', fields: ['energy_levels', 'effort_fatigue', 'caffeine_effect', 'digestive_issues', 'stress_levels', 'sleep_quality', 'mood_changes', 'brain_fog', 'sugar_cravings', 'skin_issues', 'joint_pain', 'immune_system', 'workout_recovery', 'food_sensitivities', 'weight_management', 'medication_history'] },
    { id: 3, component: ActivityLevelStep, title: 'Activity Level', fields: ['activity_level'] },
    { id: 4, component: SleepHoursStep, title: 'Sleep Hours', fields: ['sleep_hours'] },
    { id: 5, component: AlcoholStep, title: 'Alcohol Intake', fields: ['alcohol_intake'] },
    { id: 6, component: HealthProfileStep, title: 'Health Profile', fields: ['allergies', 'conditions', 'medications'] },
    { id: 7, component: PrimaryConcernStep, title: 'Primary Concern', fields: ['primary_health_concern'] },
    { id: 8, component: OptionalDataStep, title: 'Optional Data', fields: ['known_biomarkers', 'known_genetic_variants'] },
    { id: 9, component: PersonalDetailsStep, title: 'Personal Details', fields: ['fullName', 'age', 'gender', 'height_ft', 'height_in', 'weight_lbs'] },
    { id: 10, component: ReviewStep, title: 'Review & Submit', fields: [] }
  ];

  const totalSteps = steps.length;
  
  // Ensure step is within valid bounds
  const validStep = Math.max(1, Math.min(step, totalSteps));
  const CurrentStepComponent = steps[validStep - 1].component;

  const nextStep = async () => {
    if (step >= totalSteps) return;
    
    const currentStepConfig = steps[step - 1];
    const fieldsToValidate = currentStepConfig.fields as (keyof OnboardingData)[] | undefined;
    
    const isValid = fieldsToValidate && fieldsToValidate.length > 0 
      ? await form.trigger(fieldsToValidate) 
      : true;

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: OnboardingData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting frictionless onboarding data:', data);
      
      // Step 1: Save Profile
      updateProcessingStep('profile', false, true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Analysis
      updateProcessingStep('profile', true, false);
      updateProcessingStep('analyze', false, true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 3: Plan Generation
      updateProcessingStep('analyze', true, false);
      updateProcessingStep('plan', false, true);
      
      // Call the actual save function
      const result = await saveOnboardingData(data);
      
      if (result?.error) {
        console.error('Onboarding error:', result.error);
        alert(`Error saving profile: ${result.error}`);
        setIsSubmitting(false); // Reset on error
        return;
      }

      // Step 4: Generate Health Score
      updateProcessingStep('plan', true, false);
      updateProcessingStep('health-score', false, true);
      
      // Generate health score automatically after successful onboarding
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('🎯 Generating initial health score after onboarding completion...');
          const healthScoreResponse = await supabase.functions.invoke('health-score', {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
          
          if (healthScoreResponse.error) {
            console.error('❌ Health score generation failed:', healthScoreResponse.error);
            // Don't block onboarding completion if health score fails
          } else {
            console.log('✅ Health score generated and saved successfully!');
            console.log('Health score data:', healthScoreResponse.data);
          }
        } else {
          console.error('❌ No session found for health score generation');
        }
      } catch (error) {
        console.error('❌ Health score generation error:', error);
        // Don't block onboarding completion if health score fails
      }
      
      // Step 5: Complete
      updateProcessingStep('health-score', true, false);
      updateProcessingStep('complete', true, false);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Frictionless onboarding completed successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      alert('An error occurred while saving your information. Please try again.');
      setIsSubmitting(false); // Reset on error
    }
  };

  const LoadingAnimation = () => (
    <div className="max-w-md w-full p-8 mx-auto">
        <div className="space-y-4">
          {processingSteps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                step.completed 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : step.active 
                  ? 'bg-dark-accent/10 border-dark-accent/20' 
                  : 'bg-dark-panel border-dark-border'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`p-2 rounded-full ${
                step.completed 
                  ? 'bg-green-500 text-white' 
                  : step.active 
                  ? 'bg-dark-accent text-white animate-pulse' 
                  : 'bg-dark-border text-dark-secondary'
              }`}>
                {step.completed ? <CheckCircle className="h-5 w-5" /> : step.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-dark-primary">{step.title}</h3>
                <p className="text-sm text-dark-secondary">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
  );
  
  // For lifestyle assessment, show current question progress
  const isLifestyleStep = step === 2;
  const stepInfo = STEP_INFO[step - 1];

  let displayTitle = stepInfo.title;
  let displaySubtitle = stepInfo.subtitle;

  if (isLifestyleStep) {
    const currentQuestion = LIFESTYLE_QUESTIONS[currentSubStep - 1];
    if (currentQuestion) {
      displayTitle = currentQuestion.question;
      displaySubtitle = `Question ${currentSubStep} of 16`;
    }
  }
  
  const handleBack = () => {
    if (isLifestyleStep && currentSubStep > 1) {
      setCurrentSubStep((prev: number) => prev - 1);
    } else if (step > 1) {
      prevStep();
    }
  };
  
  const handleNext = () => {
    if (isLifestyleStep) {
       if (currentSubStep < 16) {
          setCurrentSubStep((prev: number) => prev + 1);
        } else {
          setCurrentSubStep(1); // Reset for next time
          nextStep();
        }
    } else if (step < totalSteps) {
      nextStep();
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const stepContent = (() => {
    switch (step) {
      case 1:
        return <HealthGoalsStep onNext={handleNext} />;
      case 2:
        return <LifestyleAssessment 
          currentSubStep={currentSubStep} 
          onSubStepComplete={handleNext} 
          totalSubSteps={16}
        />;
      case 3:
        return <ActivityLevelStep onNext={handleNext} />;
      case 4:
        return <SleepHoursStep onNext={handleNext} />;
      case 5:
        return <AlcoholStep onNext={handleNext} />;
      case 6:
        return <HealthProfileStep />;
      case 7:
        return <PrimaryConcernStep />;
      case 8:
        return <OptionalDataStep />;
      case 9:
        return <PersonalDetailsStep />;
      case 10:
        return <ReviewStep />;
      default:
        return null;
    }
  })();
  
  const canGoBack = !isSubmitting && (step > 1 || (isLifestyleStep && currentSubStep > 1));
  const isLastStep = step === totalSteps;

  const getNextLabel = () => {
    if (isLastStep) return form.formState.isSubmitting ? 'Creating Plan...' : 'Submit & Create My Plan';
    if ([1, 6, 7, 8, 9].includes(step)) return 'Continue';
    return 'Next';
  }

  return (
    <div className="font-sans antialiased bg-dark-background text-dark-primary">
      <div className="fixed top-0 left-0 right-0 p-6 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Health Assessment</h1>
            <span className="text-sm font-mono text-dark-secondary">
              {!isSubmitting ? `STEP ${step.toString().padStart(2, '0')}/${totalSteps.toString().padStart(2, '0')}` : 'GENERATING PLAN'}
            </span>
          </div>
          <div className="w-full bg-dark-panel rounded-full h-2">
            <motion.div 
              className="bg-dark-accent h-2 rounded-full"
              animate={{ width: isSubmitting ? '100%' : `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
      
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-screen">
          <StepContainer
            title={isSubmitting ? 'Creating Your Personalized Plan' : displayTitle}
            subtitle={isSubmitting ? 'Analyzing your health data and generating recommendations...' : displaySubtitle}
            onBack={canGoBack ? handleBack : undefined}
            onNext={handleNext}
            nextLabel={getNextLabel()}
            nextDisabled={form.formState.isSubmitting}
            isLastStep={isLastStep}
            showNextButton={!isSubmitting && ![2, 3, 4, 5].includes(step)}
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <LoadingAnimation key="loading" />
              ) : (
                <motion.div
                  key={step + (isLifestyleStep ? `-${currentSubStep}`: '')}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {stepContent}
                </motion.div>
              )}
            </AnimatePresence>
          </StepContainer>
        </form>
      </FormProvider>
    </div>
  );
} 
