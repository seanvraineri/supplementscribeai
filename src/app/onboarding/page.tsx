'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, type OnboardingData } from '@/lib/schemas';

// Import new frictionless onboarding components
import { HealthGoalsStep } from '@/components/onboarding/01-HealthGoalsStep';
import { LifestyleAssessment } from '@/components/onboarding/02-LifestyleAssessment';
import { ActivityLevelStep } from '@/components/onboarding/03-ActivityLevelStep';
import { SleepHoursStep } from '@/components/onboarding/04-SleepHoursStep';
import { AlcoholStep } from '@/components/onboarding/05-AlcoholStep';
import { HealthProfileStep } from '@/components/onboarding/06-HealthProfileStep';
import { PrimaryConcernStep } from '@/components/onboarding/07-PrimaryConcernStep';
import { OptionalDataStep } from '@/components/onboarding/08-OptionalDataStep';
import { PersonalDetailsStep } from '@/components/onboarding/09-PersonalDetailsStep';
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
    title: "What are your health goals?",
    subtitle: "Select all that apply - we'll create a personalized plan"
  },
  {
    title: "Quick lifestyle check",
    subtitle: "Just a few yes/no questions to understand you better"
  },
  {
    title: "What's your activity level?",
    subtitle: "This helps us customize your supplement needs"
  },
  {
    title: "How many hours do you sleep?",
    subtitle: "On average per night"
  },
  {
    title: "How often do you drink alcohol?",
    subtitle: "This affects supplement absorption and recommendations"
  },
  {
    title: "Health profile",
    subtitle: "Help us ensure your supplements are safe for you"
  },
  {
    title: "What's your primary health concern?",
    subtitle: "This helps us prioritize your recommendations"
  },
  {
    title: "Optional: Specific health data",
    subtitle: "Only if you happen to know any of these"
  },
  {
    title: "Almost done!",
    subtitle: "Just a few personal details to complete your profile"
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
      energy_levels: undefined,
      effort_fatigue: undefined,
      caffeine_effect: undefined,
      brain_fog: undefined,
      anxiety_level: undefined,
      stress_resilience: undefined,
      medication_history: undefined,
      sleep_quality: undefined,
      sleep_aids: undefined,
      bloating: undefined,
      digestion_speed: undefined,
      anemia_history: undefined,
      joint_pain: undefined,
      bruising_bleeding: undefined,
      belly_fat: undefined,
      primary_health_concern: '',
      known_biomarkers: '',
      known_genetic_variants: '',
    }
  });
  
  const steps = [
    { id: 1, component: HealthGoalsStep, title: 'Health Goals', fields: ['healthGoals'] },
    { id: 2, component: () => <div>Lifestyle Assessment</div>, title: 'Lifestyle Assessment', fields: ['energy_levels', 'effort_fatigue', 'caffeine_effect', 'brain_fog', 'anxiety_level', 'stress_resilience', 'medication_history', 'sleep_quality', 'sleep_aids', 'bloating', 'digestion_speed', 'anemia_history', 'joint_pain', 'bruising_bleeding', 'belly_fat'] },
    { id: 3, component: ActivityLevelStep, title: 'Activity Level', fields: ['activity_level'] },
    { id: 4, component: SleepHoursStep, title: 'Sleep Hours', fields: ['sleep_hours'] },
    { id: 5, component: AlcoholStep, title: 'Alcohol Intake', fields: ['alcohol_intake'] },
    { id: 6, component: HealthProfileStep, title: 'Health Profile', fields: ['allergies', 'conditions', 'medications'] },
    { id: 7, component: PrimaryConcernStep, title: 'Primary Concern', fields: ['primary_health_concern'] },
    { id: 8, component: OptionalDataStep, title: 'Optional Data', fields: ['known_biomarkers', 'known_genetic_variants'] },
    { id: 9, component: PersonalDetailsStep, title: 'Personal Details', fields: ['fullName', 'age', 'gender', 'height_ft', 'height_in', 'weight_lbs'] },
  ];

  const totalSteps = steps.length;
  
  // Ensure step is within valid bounds
  const validStep = Math.max(1, Math.min(step, totalSteps));
  const CurrentStepComponent = steps[validStep - 1].component;

  const nextStep = async () => {
    if (step >= totalSteps) return;
    
    const currentStepConfig = steps[step - 1];
    const fieldsToValidate = currentStepConfig.fields as (keyof OnboardingData)[] | undefined;
    
    // Skip validation for optional step
    const isValid = (step === 8) ? true : fieldsToValidate ? await form.trigger(fieldsToValidate) : true;

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
      
      // Step 4: Complete
      updateProcessingStep('plan', true, false);
      updateProcessingStep('complete', true, false);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (result?.error) {
        console.error('Onboarding error:', result.error);
        alert(`Error saving profile: ${result.error}`);
      } else {
        console.log('✅ Frictionless onboarding completed successfully!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      alert('An error occurred while saving your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  const LoadingScreen = () => (
    <div className="min-h-screen bg-dark-background flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-dark-primary mb-2">Creating Your Personalized Plan</h2>
          <p className="text-dark-secondary">Analyzing your health data and generating recommendations...</p>
        </div>
        
        <div className="space-y-4">
          {processingSteps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                step.completed 
                  ? 'bg-green-50 border-green-200' 
                  : step.active 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-dark-surface border-dark-border'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`p-2 rounded-full ${
                step.completed 
                  ? 'bg-green-500 text-white' 
                  : step.active 
                  ? 'bg-blue-500 text-white animate-pulse' 
                  : 'bg-dark-border text-dark-secondary'
              }`}>
                {step.completed ? <CheckCircle className="h-5 w-5" /> : step.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-dark-primary">{step.title}</h3>
                <p className="text-sm text-dark-secondary">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isSubmitting) {
    return <LoadingScreen />;
  }

  const renderStep = () => {
    const stepInfo = STEP_INFO[step - 1];
    
    if (!stepInfo) return null;
    
    const stepContent = (() => {
      switch (step) {
        case 1:
          return <HealthGoalsStep />;
        case 2:
          return <LifestyleAssessment 
            currentSubStep={currentSubStep} 
            onSubStepComplete={() => {
              if (currentSubStep < 16) {
                setCurrentSubStep((prev: number) => prev + 1);
              } else {
                // Lifestyle assessment complete, move to next step
                setCurrentSubStep(1);
                nextStep();
              }
            }} 
            totalSubSteps={16}
          />;
        case 3:
          return <ActivityLevelStep />;
        case 4:
          return <SleepHoursStep />;
        case 5:
          return <AlcoholStep />;
        case 6:
          return <HealthProfileStep />;
        case 7:
          return <PrimaryConcernStep />;
        case 8:
          return <OptionalDataStep />;
        case 9:
          return <PersonalDetailsStep />;
        default:
          return null;
      }
    })();
    
    // For lifestyle assessment, show current question progress
    const isLifestyleStep = step === 2;
    const displayTitle = isLifestyleStep ? `Question ${currentSubStep} of 16` : stepInfo.title;
    const displaySubtitle = isLifestyleStep ? "Quick yes/no - helps us personalize your plan" : stepInfo.subtitle;
    const displayCurrentStep = isLifestyleStep ? currentSubStep : step;
    const displayTotalSteps = isLifestyleStep ? 16 : totalSteps;
    
    // Navigation handlers
    const handleBack = () => {
      if (isLifestyleStep && currentSubStep > 1) {
        setCurrentSubStep((prev: number) => prev - 1);
      } else if (step > 1) {
        prevStep();
      }
    };
    
    const handleNext = () => {
      if (step < totalSteps) {
        nextStep();
      } else {
        form.handleSubmit(onSubmit)();
      }
    };
    
    const canGoBack = step > 1 || (isLifestyleStep && currentSubStep > 1);
    const canProceed = step < totalSteps || !isSubmitting;
    const nextLabel = step === totalSteps ? (isSubmitting ? 'Creating Plan...' : 'Complete Setup') : 'Continue';
    
    return (
      <StepContainer
        title={displayTitle}
        subtitle={displaySubtitle}
        currentStep={displayCurrentStep}
        totalSteps={displayTotalSteps}
        onBack={canGoBack ? handleBack : undefined}
        onNext={!isLifestyleStep ? handleNext : undefined}
        nextLabel={nextLabel}
        nextDisabled={!canProceed}
        showBack={canGoBack}
      >
        {stepContent}
      </StepContainer>
    );
  };

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="max-w-2xl mx-auto p-6">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-dark-primary">Health Assessment</h1>
            <span className="text-sm text-dark-secondary">
              Step {step} of {totalSteps}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-dark-border rounded-full h-3">
            <div 
              className="bg-dark-accent h-3 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {renderStep()}
            </form>
          </Form>
        </FormProvider>
      </div>
    </div>
  );
} 
