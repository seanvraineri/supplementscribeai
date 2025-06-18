"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';

export function PrimaryConcernStep() {
  const form = useFormContext<OnboardingData>();
  const concern = form.watch('primary_health_concern') || '';
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-dark-primary">What's your main health concern?</h2>
        <p className="text-dark-secondary mt-2">This helps us prioritize your supplement plan</p>
      </div>
      
      <div className="space-y-4">
        <textarea
          {...form.register('primary_health_concern')}
          rows={4}
          placeholder="e.g., Low energy throughout the day, brain fog affecting work, poor sleep quality, digestive issues..."
          className="w-full p-4 border border-dark-border rounded-lg resize-none bg-dark-background text-dark-primary placeholder-dark-secondary focus:ring-2 focus:ring-dark-accent focus:border-dark-accent"
          maxLength={500}
        />
        <div className="flex justify-between items-center text-sm text-dark-secondary">
          <span>Be as specific as possible for better recommendations</span>
          <span>{concern.length}/500</span>
        </div>
        
        {/* Common Examples */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-dark-secondary">Common concerns:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Low energy throughout the day",
              "Brain fog and concentration issues", 
              "Poor sleep quality and insomnia",
              "Digestive problems and bloating",
              "Mood swings and anxiety",
              "Joint pain and inflammation",
              "Stubborn weight that won't budge",
              "Frequent colds and low immunity"
            ].map(example => (
              <button
                key={example}
                type="button"
                onClick={() => form.setValue('primary_health_concern', example, { shouldValidate: true })}
                className="text-left p-2 rounded-lg bg-dark-surface border border-dark-border hover:border-dark-accent/50 transition-all text-sm text-dark-secondary hover:text-dark-primary"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 