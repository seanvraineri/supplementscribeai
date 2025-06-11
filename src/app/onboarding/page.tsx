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
  const CurrentStepComponent = steps[step - 1].component;

  const nextStep = async () => {
    const currentStepConfig = steps[step - 1];
    
    if (currentStepConfig.id === 6) {
       setStep(s => s + 1);
       return;
    }

    const fieldsToValidate = currentStepConfig.fields as (keyof OnboardingData)[] | undefined;
    const isValid = fieldsToValidate ? await form.trigger(fieldsToValidate) : true;

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h1 className="text-2xl font-bold text-center mb-6 text-card-foreground">Your Health Profile</h1>
            
            <div className="w-full bg-muted rounded-full h-2.5 mb-8">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
            </div>

            <CurrentStepComponent onNext={() => setStep(s => s + 1)} />

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button type="button" onClick={prevStep} variant="outline" disabled={isSubmitting}>
                  Back
                </Button>
              )}
              {step < totalSteps ? (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Next
                </Button>
              ) : (
                <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
} 