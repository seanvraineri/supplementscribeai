"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { Icons, PremiumButton } from './shared/DesignSystem';

const ALCOHOL_OPTIONS = [
  { 
    value: 'never', 
    label: 'Never', 
    icon: Icons.Never, 
    description: 'I don\'t drink alcohol',
    feedback: 'Excellent choice! This supports optimal nutrient absorption',
    impact: 'Maximum supplement effectiveness and liver health',
    variant: 'success' as const
  },
  { 
    value: 'rarely', 
    label: 'Rarely', 
    icon: Icons.Rarely, 
    description: 'Few times a year',
    feedback: 'Great moderation! Minimal impact on nutrient absorption',
    impact: 'Excellent supplement compatibility',
    variant: 'primary' as const
  },
  { 
    value: 'occasionally', 
    label: 'Occasionally', 
    icon: Icons.Occasionally, 
    description: '1-2 times per month',
    feedback: 'Good balance! We\'ll optimize your B-vitamins and liver support',
    impact: 'Minor adjustments for optimal results',
    variant: 'primary' as const
  },
  { 
    value: 'moderately', 
    label: 'Moderately', 
    icon: Icons.Moderately, 
    description: '1-2 times per week',
    feedback: 'We\'ll enhance B-vitamins, magnesium, and liver support',
    impact: 'Targeted nutrients for alcohol metabolism',
    variant: 'secondary' as const
  },
  { 
    value: 'regularly', 
    label: 'Regularly', 
    icon: Icons.Regularly, 
    description: '3+ times per week',
    feedback: 'Important to support your liver and nutrient levels',
    impact: 'Comprehensive support for liver function and nutrient depletion',
    variant: 'none' as const
  }
];

export function AlcoholStep() {
  const form = useFormContext<OnboardingData>();
  const selectedIntake = form.watch('alcohol_intake');
  
  const selectAlcoholIntake = (intake: string) => {
    form.setValue('alcohol_intake', intake, { shouldValidate: true });
  };
  
  const selectedOption = ALCOHOL_OPTIONS.find(option => option.value === selectedIntake);
  
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {ALCOHOL_OPTIONS.map(option => (
          <PremiumButton
            key={option.value}
            onClick={() => selectAlcoholIntake(option.value)}
            selected={selectedIntake === option.value}
            variant={option.variant}
            size="md"
            autoAdvance={true}
            icon={<option.icon />}
            className="w-full text-left justify-start h-auto py-4"
          >
            <div className="flex-1 ml-3">
              <div className="font-bold text-base">{option.label}</div>
              <div className="text-sm opacity-75 mt-1">{option.description}</div>
            </div>
          </PremiumButton>
        ))}
      </div>
      
      {selectedOption && (
        <div className={`text-center rounded-lg p-4 border ${
          selectedOption.variant === 'success' 
            ? 'bg-green-50 border-green-200'
            : selectedOption.variant === 'primary'
            ? 'bg-blue-50 border-blue-200'
            : selectedOption.variant === 'secondary'
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-orange-50 border-orange-200'
        }`}>
          <p className={`text-base font-semibold mb-1 ${
            selectedOption.variant === 'success' 
              ? 'text-green-800'
              : selectedOption.variant === 'primary'
              ? 'text-blue-800'
              : selectedOption.variant === 'secondary'
              ? 'text-yellow-800'
              : 'text-orange-800'
          }`}>
            {selectedOption.feedback}
          </p>
          <p className={`text-sm ${
            selectedOption.variant === 'success' 
              ? 'text-green-600'
              : selectedOption.variant === 'primary'
              ? 'text-blue-600'
              : selectedOption.variant === 'secondary'
              ? 'text-yellow-600'
              : 'text-orange-600'
          }`}>
            {selectedOption.impact}
          </p>
        </div>
      )}
    </div>
  );
} 