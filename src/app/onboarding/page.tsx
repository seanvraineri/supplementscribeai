'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, type OnboardingData } from '@/lib/schemas';
import { DemographicsStep } from '@/components/onboarding/DemographicsStep';
import { AllergiesStep } from '@/components/onboarding/AllergiesStep';
import { HealthGoalsStep } from '@/components/onboarding/HealthGoalsStep';
import { LifestyleStep } from '@/components/onboarding/LifestyleStep';
import { LifestyleQuestionnaireStep } from '@/components/onboarding/LifestyleQuestionnaireStep';
import { DataUploadStep } from '@/components/onboarding/DataUploadStep';
import { ReviewStep } from '@/components/onboarding/ReviewStep';
import { saveOnboardingData } from './actions';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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
      customHealthGoals: [],
      allergies: [],
      conditions: [],
      medications: [],
      activity_level: undefined,
      sleep_hours: '' as any,
      alcohol_intake: undefined,
      data_preference: 'upload',
      energy_levels: undefined,
      effort_fatigue: undefined,
      caffeine_effect: undefined,
      brain_fog: undefined,
      anxiety_level: undefined,
      stress_resilience: undefined,
      sleep_quality: undefined,
      sleep_aids: undefined,
      bloating: undefined,
      anemia_history: undefined,
      digestion_speed: undefined,
      low_nutrients: [],
      bruising_bleeding: undefined,
      belly_fat: undefined,
      joint_pain: undefined,
    }
  });
  
  const steps = [
    { id: 1, component: DemographicsStep, fields: ['fullName', 'age', 'gender', 'height_ft', 'height_in', 'weight_lbs'] },
    { id: 2, component: AllergiesStep, fields: ['allergies', 'conditions', 'medications'] },
    { id: 3, component: HealthGoalsStep, fields: ['healthGoals', 'customHealthGoals'] },
    { id: 4, component: LifestyleStep, fields: ['activity_level', 'sleep_hours', 'alcohol_intake'] },
    { id: 5, component: LifestyleQuestionnaireStep, fields: [
      'energy_levels', 'effort_fatigue', 'caffeine_effect', 
      'brain_fog', 'anxiety_level', 'stress_resilience', 'sleep_quality', 'sleep_aids', 'bloating', 
      'anemia_history', 'digestion_speed', 'low_nutrients', 'bruising_bleeding', 'belly_fat', 'joint_pain'
    ]},
    { id: 6, component: DataUploadStep, fields: [] },
    { id: 7, component: ReviewStep, fields: [] },
  ];

  const totalSteps = steps.length;
  
  // Ensure step is within valid bounds
  const validStep = Math.max(1, Math.min(step, totalSteps));
  const CurrentStepComponent = steps[validStep - 1].component;

  const nextStep = async () => {
    if (step >= totalSteps) return; // Prevent going beyond last step
    
    const currentStepConfig = steps[step - 1];
    
    if (currentStepConfig.id === 6) {
       setStep(s => Math.min(s + 1, totalSteps));
       return;
    }

    const fieldsToValidate = currentStepConfig.fields as (keyof OnboardingData)[] | undefined;
    const isValid = fieldsToValidate ? await form.trigger(fieldsToValidate) : true;

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data: OnboardingData) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting onboarding data:', data);
      const result = await saveOnboardingData(data);
      if (result?.error) {
        console.error('Onboarding error:', result.error);
        alert(`Error saving profile: ${result.error}`);
      } else {
        console.log('Onboarding complete, redirecting to dashboard');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while saving your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-4 font-sans antialiased">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent"></div>
      
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-gray-100/50 w-full max-w-3xl">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Your Health Profile
              </h1>
              <p className="text-lg text-gray-600 font-light">
                Step {validStep} of {totalSteps} • Let's personalize your supplement plan
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="relative w-full bg-gray-100 rounded-full h-3 mb-12 overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#7DE1F4] to-[#86A8E7] rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${(validStep / totalSteps) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full"></div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
              <CurrentStepComponent onNext={() => setStep(s => Math.min(s + 1, totalSteps))} />
            </div>

            {/* Skip optional link */}
            {validStep === 5 && (
              <div className="text-right mt-4">
                <button type="button" className="text-sm text-gray-500 hover:text-gray-700 underline" onClick={() => setStep(Math.min(step + 1, totalSteps))}>
                  Skip this step
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
              {validStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="group inline-flex items-center px-6 py-3 rounded-full text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              {validStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="group inline-flex items-center bg-gradient-to-r from-[#7DE1F4] to-[#86A8E7] text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-[#7DE1F4]/25 relative overflow-hidden"
                >
                  <span className="relative z-10">Continue</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#86A8E7] to-[#C29FFF] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl transition-all duration-500 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  <span className="relative z-10">
                    {isSubmitting ? 'Creating Your Plan...' : 'Complete Profile'}
                  </span>
                  {isSubmitting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 animate-pulse"></div>
                  )}
                  {!isSubmitting && (
                    <svg className="w-5 h-5 ml-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
} 