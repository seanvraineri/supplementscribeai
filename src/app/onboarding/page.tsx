'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, type OnboardingData } from '@/lib/schemas';
import { DemographicsStep } from '@/components/onboarding/DemographicsStep';
import { HealthProfileStep } from '@/components/onboarding/HealthProfileStep';
import { HealthGoalsStep } from '@/components/onboarding/HealthGoalsStep';
import { ReviewStep } from '@/components/onboarding/ReviewStep';
import { submitOnboardingForm } from './actions';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

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
    }
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof OnboardingData)[] | undefined = undefined;
    switch (step) {
      case 1:
        fieldsToValidate = ['fullName', 'age', 'gender', 'height_ft', 'height_in', 'weight_lbs'];
        break;
      case 2:
        fieldsToValidate = ['allergies', 'conditions', 'medications'];
        break;
      case 3:
        fieldsToValidate = ['healthGoals'];
        break;
      default:
        break;
    }
    const isValid = fieldsToValidate ? await form.trigger(fieldsToValidate) : true;

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: OnboardingData) => {
    const result = await submitOnboardingForm(data);
    if (result?.error) {
      console.error(result.error);
    } else {
      // Handle success (e.g., redirect or show success message)
      console.log('Onboarding complete:', result);
    }
  };

  const totalSteps = 4;

  const renderStep = () => {
    switch (step) {
      case 1:
        return <DemographicsStep />;
      case 2:
        return <HealthProfileStep />;
      case 3:
        return <HealthGoalsStep />;
      case 4:
        return <ReviewStep />;
      default:
        return null;
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

            {renderStep()}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button type="button" onClick={prevStep} variant="outline">
                  Back
                </Button>
              )}
              {step < totalSteps ? (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Next
                </Button>
              ) : (
                <Button type="submit" className="ml-auto">
                  Submit
                </Button>
              )}
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
} 