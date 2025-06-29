'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, type OnboardingData } from '@/lib/schemas';

// Import new frictionless onboarding components
import { HealthGoalsStep } from '@/components/onboarding/01-HealthGoalsStep';
import { SubscriptionTierStep } from '@/components/onboarding/02-SubscriptionTierStep';
import { LifestyleAssessment, LIFESTYLE_QUESTIONS } from '@/components/onboarding/02-LifestyleAssessment';
import { ActivityLevelStep } from '@/components/onboarding/03-ActivityLevelStep';
import { SleepHoursStep } from '@/components/onboarding/04-SleepHoursStep';
import { AlcoholStep } from '@/components/onboarding/05-AlcoholStep';
import { DietaryPreferenceStep } from '@/components/onboarding/06-DietaryPreferenceStep';
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
import { CheckCircle, Sparkles, Brain, Heart, FileText, User, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { logger } from '@/lib/logger';
import { StripeCheckoutModal } from '@/components/payment/StripeCheckoutModal';
import { UpsellModal } from '@/components/payment/UpsellModal';

// Fallback health score creation function
async function createFallbackHealthScore(supabase: any, userId: string, onboardingData: any) {
  logger.step('Creating fallback health score');
  
  // Simple scoring based on onboarding data
  let score = 75; // Start with average
  const concerns: string[] = [];
  const strengths: string[] = [];
  const recommendations: string[] = [];
  
  // Count lifestyle issues (Yes answers = problems)
  const lifestyleIssues = [
    'energy_levels', 'effort_fatigue', 'digestive_issues', 'stress_levels',
    'mood_changes', 'sugar_cravings', 'skin_issues', 'joint_pain',
    'brain_fog', 'sleep_quality', 'workout_recovery', 'food_sensitivities',
    'weight_management', 'caffeine_effect', 'immune_system', 'medication_history'
  ];
  
  let issueCount = 0;
  lifestyleIssues.forEach(issue => {
    if (onboardingData[issue] === 'yes') {
      issueCount++;
      concerns.push(issue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    } else if (onboardingData[issue] === 'no') {
      strengths.push(`Good ${issue.replace(/_/g, ' ')}`);
    }
  });
  
  // Adjust score based on issues
  score -= (issueCount * 3); // Subtract 3 points per issue
  
  // Add basic recommendations
  if (issueCount > 0) {
    recommendations.push('Focus on improving sleep quality and stress management');
    recommendations.push('Consider a balanced diet rich in whole foods');
    recommendations.push('Maintain regular physical activity appropriate for your fitness level');
  }
  
  if (onboardingData.sleep_hours < 7) {
    score -= 5;
    recommendations.push('Aim for 7-9 hours of sleep per night');
  }
  
  if (onboardingData.activity_level === 'sedentary') {
    score -= 5;
    recommendations.push('Gradually increase daily physical activity');
  }
  
  // Ensure score is within bounds
  score = Math.max(30, Math.min(95, score));
  
  const fallbackData = {
    user_id: userId,
    health_score: score,
    score_breakdown: {
      lifestyleHabits: Math.max(10, 25 - Math.floor(issueCount * 1.5)),
      symptomBurden: Math.max(10, 25 - Math.floor(issueCount * 1.2)),
      physicalWellness: Math.max(10, 25 - Math.floor(issueCount * 1.0)),
      riskFactors: Math.max(15, 25 - Math.floor(issueCount * 0.8))
    },
    analysis_summary: `Based on your health assessment, you have a health score of ${score}/100. ${issueCount > 5 ? 'There are several areas for improvement' : issueCount > 2 ? 'Some areas could benefit from attention' : 'You have a solid foundation for good health'}.`,
    strengths: strengths.slice(0, 5),
    concerns: concerns.slice(0, 5),
    recommendations: recommendations,
    score_explanation: `Score calculated based on ${lifestyleIssues.length} lifestyle factors assessed. ${issueCount} areas identified for improvement.`
  };
  
  const { error } = await supabase
    .from('user_health_scores')
    .insert(fallbackData);
  
  if (error) {
    logger.error('Failed to save fallback health score', error);
    throw error;
  }
  
  logger.success('Fallback health score saved successfully');
  return fallbackData;
}

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
    title: "Choose Your Plan",
    subtitle: "Select how you'd like to experience SupplementScribe"
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
    title: "Dietary Preference",
    subtitle: "This helps us tailor your nutrition plan to your dietary needs"
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
    subtitle: "Sharing this helps us create an even more precise plan for you."
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
  const router = useRouter();
  const [isCheckingCompletion, setIsCheckingCompletion] = useState(true);

  // Check if onboarding is already completed and redirect to dashboard
  useEffect(() => {
    const checkCompletion = async () => {
      try {
        const { createBrowserClient } = await import('@supabase/ssr');
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if they have AI-generated content (meaning onboarding is DONE)
          const { data: plan } = await supabase
            .from('supplement_plans')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (plan) {
            // They have a supplement plan = onboarding is complete, redirect to dashboard
            console.log('User has completed onboarding with AI content, redirecting to dashboard');
            router.push('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.log('Check error:', error);
      }
      
      setIsCheckingCompletion(false);
    };
    
    checkCompletion();
  }, [router]);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingOnboardingData, setPendingOnboardingData] = useState<OnboardingData | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Upsell modal state - for Software Only users
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [customerName, setCustomerName] = useState('');

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
      id: 'health-domains',
      title: 'Health Analysis',
      description: 'Analyzing your health domains and patterns',
      icon: <Heart className="h-5 w-5" />,
      completed: false,
      active: false
    },
    {
      id: 'diet-plan',
      title: 'Diet Plan',
      description: 'Creating your personalized whole food diet',
      icon: <FileText className="h-5 w-5" />,
      completed: false,
      active: false
    },
    {
      id: 'complete',
      title: 'Complete',
      description: 'Your personalized health protocol is ready!',
      icon: <CheckCircle className="h-5 w-5" />,
      completed: false,
      active: false
    }
  ]);

  const updateProcessingStep = (stepId: string, completed: boolean = false, active: boolean = true) => {
    setProcessingSteps(prev => prev.map(step => ({
      ...step,
      completed: step.id === stepId ? completed : step.completed,
      active: step.id === stepId ? active : (step.completed ? false : step.active)
    })));
  };

  // ANIMATION TRIGGER - This makes the steps actually animate!
  useEffect(() => {
    if (!isSubmitting) return;

    console.log('🎬 Starting loading animation');
    let mounted = true;
    let currentStepIndex = 0;
    const stepDuration = 6000; // 6 seconds per step

    // Start the first step immediately
    if (mounted && processingSteps.length > 0) {
      updateProcessingStep(processingSteps[0].id, false, true);
    }

    const interval = setInterval(() => {
      if (!mounted) return;
      
      if (currentStepIndex < processingSteps.length - 1) {
        // Complete current step
        updateProcessingStep(processingSteps[currentStepIndex].id, true, false);
        
        // Move to next step
        currentStepIndex++;
        updateProcessingStep(processingSteps[currentStepIndex].id, false, true);
        console.log(`🎬 Animation step ${currentStepIndex + 1}/${processingSteps.length}`);
      } else {
        // All steps complete
        clearInterval(interval);
        updateProcessingStep(processingSteps[currentStepIndex].id, true, false);
        console.log('🎬 Animation complete');
      }
    }, stepDuration);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [isSubmitting, processingSteps.length]); // Safe dependencies

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
      subscription_tier: 'full',
      allergies: [],
      conditions: [],
      medications: [],
      activity_level: undefined,
      sleep_hours: '' as any,
      alcohol_intake: undefined,
      dietary_preference: undefined,
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
    { id: 2, component: SubscriptionTierStep, title: 'Choose Your Plan', fields: ['subscription_tier'] },
    { id: 3, component: () => <div>Lifestyle Assessment</div>, title: 'Lifestyle Assessment', fields: ['energy_levels', 'effort_fatigue', 'caffeine_effect', 'digestive_issues', 'stress_levels', 'sleep_quality', 'mood_changes', 'brain_fog', 'sugar_cravings', 'skin_issues', 'joint_pain', 'immune_system', 'workout_recovery', 'food_sensitivities', 'weight_management', 'medication_history'] },
    { id: 4, component: ActivityLevelStep, title: 'Activity Level', fields: ['activity_level'] },
    { id: 5, component: SleepHoursStep, title: 'Sleep Hours', fields: ['sleep_hours'] },
    { id: 6, component: AlcoholStep, title: 'Alcohol Intake', fields: ['alcohol_intake'] },
    { id: 7, component: DietaryPreferenceStep, title: 'Dietary Preference', fields: ['dietary_preference'] },
    { id: 8, component: HealthProfileStep, title: 'Health Profile', fields: ['allergies', 'conditions', 'medications'] },
    { id: 9, component: PrimaryConcernStep, title: 'Primary Concern', fields: ['primary_health_concern'] },
    { id: 10, component: OptionalDataStep, title: 'Optional Data', fields: ['known_biomarkers', 'known_genetic_variants'] },
    { id: 11, component: PersonalDetailsStep, title: 'Personal Details', fields: ['fullName', 'age', 'gender', 'height_ft', 'height_in', 'weight_lbs'] },
    { id: 12, component: ReviewStep, title: 'Review & Submit', fields: [] }
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
      logger.info('Saving onboarding data first', { 
        hasHealthGoals: data.healthGoals?.length > 0,
        subscriptionTier: data.subscription_tier 
      });
      
      // Save onboarding data to Supabase first
      const result = await saveOnboardingData(data);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save onboarding data');
      }
      
      logger.success('Onboarding data saved');
      
      // Store data for later use
      setPendingOnboardingData(data);
      setCustomerName(data.fullName || 'there');
      
      // UPSELL LOGIC: Show upsell modal for Software Only users
      if (data.subscription_tier === 'software_only') {
        logger.info('Software Only user - showing upsell modal');
        setShowUpsellModal(true);
      } else {
        logger.info('Complete Package user - going straight to payment');
        setShowPaymentModal(true);
      }
      
      setIsSubmitting(false);
      
    } catch (error: any) {
      logger.error('Failed to save onboarding data', error);
      setIsSubmitting(false);
      // Show error to user
      alert('Failed to save your information. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    console.log('🎉 PAYMENT SUCCESS - Starting flow');
    
    // Payment successful - close modal IMMEDIATELY
    setShowPaymentModal(false);
    setShowUpsellModal(false); // Ensure all modals are closed
    setPaymentCompleted(true);
    logger.success('Payment completed successfully');
    
    // Small delay to ensure modal is fully closed on mobile
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // IMMEDIATELY start AI generation - no waiting!
    setIsSubmitting(true);
    console.log('🔄 Loading animation started');
    
    try {
      logger.info('Starting AI generation immediately after payment');
      console.log('🤖 Calling AI generation functions...');
      
      // Import and call the AI generation function directly
      const { generateAIContentAfterPayment } = await import('./actions');
      const result = await generateAIContentAfterPayment();
      
      console.log('🤖 AI generation result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate plan');
      }
      
      logger.success('AI generation completed, redirecting to dashboard');
      console.log('✅ AI generation successful - preparing redirect');
      
      // Mark onboarding as completed with more permanent cookie
      sessionStorage.setItem('onboarding_completed', 'true');
      localStorage.setItem('onboarding_completed', 'true');
      // Set cookie with longer expiration and SameSite=Lax for mobile compatibility
      document.cookie = 'onboarding_completed=true; path=/; max-age=3600; SameSite=Lax';
      
      console.log('🚀 Redirecting to dashboard NOW!');
      
      // Ensure profile exists before redirect (critical for mobile)
      try {
        const { createBrowserClient } = await import('@supabase/ssr');
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        
        // Quick check to ensure profile exists
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.log('Profile check error, but continuing:', error);
          } else {
            console.log('✅ Profile confirmed to exist');
          }
        }
      } catch (e) {
        console.log('Profile check failed, but continuing:', e);
      }
      
      // Longer delay for mobile to ensure everything is synced
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Force close any remaining modals and clear body styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      
      // Mobile-friendly redirect approach with bypass parameter
      const dashboardUrl = '/dashboard?from=onboarding-complete';
      
      // FORCE IMMEDIATE REDIRECT - same approach for mobile and desktop
      console.log('🚀 Forcing immediate redirect to dashboard');
      
      // Method 1: Replace current history entry (no back button)
      window.location.replace(dashboardUrl);
      
      // Method 2: If replace doesn't work, use href (creates history entry)
      setTimeout(() => {
        if (window.location.pathname !== '/dashboard') {
          console.log('Replace failed, using href redirect');
          window.location.href = dashboardUrl;
        }
      }, 100);
      
      // Method 3: Final fallback with router
      setTimeout(async () => {
        if (window.location.pathname !== '/dashboard') {
          try {
            await router.push(dashboardUrl);
          } catch (e) {
            console.log('All redirects attempted');
          }
        }
      }, 200);
      
    } catch (err: any) {
      console.error('❌ AI generation failed:', err);
      logger.error('AI generation failed', err);
      setIsSubmitting(false);
      
      // Ensure body styles are reset on error
      document.body.style.overflow = '';
      document.body.style.position = '';
      
      alert('Failed to generate your plan. Please try again or contact support.');
    }
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setPendingOnboardingData(null);
  };

  // Upsell modal handlers
  const handleUpgradeToComplete = async () => {
    logger.info('User chose to upgrade to Complete Package');
    
    // Update the subscription tier in the pending data
    if (pendingOnboardingData) {
      const updatedData = { ...pendingOnboardingData, subscription_tier: 'full' };
      setPendingOnboardingData(updatedData);
      
      // Update the form data as well
      form.setValue('subscription_tier', 'full');
      
      // CRITICAL: Update the subscription tier in the database immediately
      try {
        const { updateSubscriptionTier } = await import('./actions');
        const result = await updateSubscriptionTier('full');
        if (!result.success) {
          logger.error('Failed to update subscription tier in database', result.error);
        } else {
          logger.success('Subscription tier updated in database to full');
        }
      } catch (error) {
        logger.error('Error updating subscription tier', error instanceof Error ? error : { message: String(error) });
      }
    }
    
    // Close upsell modal and show payment modal
    setShowUpsellModal(false);
    setShowPaymentModal(true);
  };

  const handleContinueWithSoftware = () => {
    logger.info('User chose to continue with Software Only');
    
    // Close upsell modal and show payment modal with original Software Only plan
    setShowUpsellModal(false);
    setShowPaymentModal(true);
  };

  const handleUpsellClose = () => {
    // If they close the upsell modal, default to continuing with Software Only
    handleContinueWithSoftware();
  };

  const onFinalSubmit = async () => {
    // This should only be called from the last step
    // It triggers the normal form submission which saves data and shows payment modal
    form.handleSubmit(onSubmit)();
  };

  // Move LoadingAnimation outside to be accessible throughout component
  const LoadingAnimation = () => (
    <div className="max-w-md w-full p-8 mx-auto">
      <h2 className="text-2xl font-bold text-dark-primary text-center mb-8">
        Creating Your Personalized Plan
      </h2>
      <div className="space-y-4">
        {processingSteps.map((step, index) => (
          <motion.div
            key={`${step.id}-${index}`}
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
  const isLifestyleStep = step === 3;
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
      onFinalSubmit();
    }
  };

  const stepContent = (() => {
    switch (step) {
      case 1:
        return <HealthGoalsStep onNext={handleNext} />;
      case 2:
        return <SubscriptionTierStep onNext={handleNext} />;
      case 3:
        return <LifestyleAssessment 
          currentSubStep={currentSubStep} 
          onSubStepComplete={handleNext} 
          totalSubSteps={16}
        />;
      case 4:
        return <ActivityLevelStep onNext={handleNext} />;
      case 5:
        return <SleepHoursStep onNext={handleNext} />;
      case 6:
        return <AlcoholStep onNext={handleNext} />;
      case 7:
        return <DietaryPreferenceStep onNext={handleNext} />;
      case 8:
        return <HealthProfileStep />;
      case 9:
        return <PrimaryConcernStep />;
      case 10:
        return <OptionalDataStep />;
      case 11:
        return <PersonalDetailsStep />;
      case 12:
        return <ReviewStep />;
      default:
        return null;
    }
  })();
  
  const canGoBack = !isSubmitting && (step > 1 || (isLifestyleStep && currentSubStep > 1));
  const isLastStep = step === totalSteps;

  const getNextLabel = () => {
    if (isLastStep) {
      if (form.formState.isSubmitting) return 'Processing...';
      return 'Complete & Pay';
    }
    if ([1, 2, 7, 8, 9, 10, 11].includes(step)) return 'Continue';
    return 'Next';
  }

  // Show loading while checking completion
  if (isCheckingCompletion) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-dark-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="font-sans antialiased bg-dark-background text-dark-primary">
        <div className="fixed top-0 left-0 right-0 p-4 sm:p-6 z-10 bg-dark-background/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h1 className="text-lg sm:text-xl font-bold">Health Assessment</h1>
              <span className="text-xs sm:text-sm font-mono text-dark-secondary">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-screen">
            <StepContainer
              title={isSubmitting ? 'Creating Your Personalized Plan' : displayTitle}
              subtitle={isSubmitting ? 'Analyzing your health data and generating recommendations...' : displaySubtitle}
              onBack={canGoBack ? handleBack : undefined}
              onNext={handleNext}
              nextLabel={getNextLabel()}
              nextDisabled={form.formState.isSubmitting}
              isLastStep={isLastStep}
              showNextButton={!isSubmitting && ![2, 3, 4, 5, 6, 7].includes(step)}
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
      {/* Show loading animation overlay when processing after payment */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-dark-background/95 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <LoadingAnimation />
        </motion.div>
      )}
      
      {showPaymentModal && pendingOnboardingData && (
        <StripeCheckoutModal
          isOpen={showPaymentModal}
          onClose={handlePaymentClose}
          selectedTier={pendingOnboardingData.subscription_tier}
          onboardingData={pendingOnboardingData}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
      
      {/* Upsell Modal - Only for Software Only users */}
      <UpsellModal
        isOpen={showUpsellModal}
        onClose={handleUpsellClose}
        onUpgrade={handleUpgradeToComplete}
        onContinueWithSoftware={handleContinueWithSoftware}
        customerName={customerName}
      />
    </div>
  );
} 
