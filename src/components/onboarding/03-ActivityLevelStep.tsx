"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { Icons, PremiumButton } from './shared/DesignSystem';

const ACTIVITY_LEVELS = [
  { 
    value: 'sedentary', 
    label: 'Sedentary', 
    description: 'Desk job, minimal exercise', 
    icon: Icons.Sedentary,
    details: 'Less than 30 minutes of activity per day'
  },
  { 
    value: 'lightly_active', 
    label: 'Lightly Active', 
    description: '1-3 days light exercise', 
    icon: Icons.LightlyActive,
    details: 'Light walks, occasional gym visits'
  },
  { 
    value: 'moderately_active', 
    label: 'Moderately Active', 
    description: '3-5 days moderate exercise', 
    icon: Icons.ModeratelyActive,
    details: 'Regular workouts, sports, cycling'
  },
  { 
    value: 'very_active', 
    label: 'Very Active', 
    description: '6-7 days intense exercise', 
    icon: Icons.VeryActive,
    details: 'Daily intense training, competitive sports'
  },
  { 
    value: 'extremely_active', 
    label: 'Extremely Active', 
    description: 'Professional athlete level', 
    icon: Icons.ExtremelyActive,
    details: 'Multiple daily sessions, elite training'
  }
];

export function ActivityLevelStep() {
  const form = useFormContext<OnboardingData>();
  const selectedLevel = form.watch('activity_level');
  
  const selectActivityLevel = (level: string) => {
    form.setValue('activity_level', level, { shouldValidate: true });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {ACTIVITY_LEVELS.map(level => (
          <PremiumButton
            key={level.value}
            onClick={() => selectActivityLevel(level.value)}
            selected={selectedLevel === level.value}
            size="md"
            autoAdvance={true}
            icon={<level.icon />}
            className="w-full text-left justify-start h-auto py-4"
          >
            <div className="flex-1 ml-3">
              <div className="font-bold text-base">{level.label}</div>
              <div className="text-sm opacity-75 mt-1">{level.description}</div>
            </div>
          </PremiumButton>
        ))}
      </div>
      
      {selectedLevel && (
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <div className="text-blue-600 text-2xl mb-2">
            <Icons.Check />
          </div>
          <p className="text-lg font-semibold text-blue-800">
            Perfect! We'll tailor your supplements for a {' '}
            {ACTIVITY_LEVELS.find(l => l.value === selectedLevel)?.label.toLowerCase()} lifestyle
          </p>
          <p className="text-sm text-blue-600 mt-2">
            {selectedLevel === 'extremely_active' 
              ? "Elite athletes need specialized nutrition - we've got you covered!"
              : selectedLevel === 'very_active'
              ? "High performance requires premium support - expect advanced recommendations!"
              : selectedLevel === 'moderately_active'
              ? "Great balance! We'll optimize your recovery and performance."
              : selectedLevel === 'lightly_active'
              ? "Every step counts! We'll support your wellness journey."
              : "We'll help you build energy and motivation to get more active!"
            }
          </p>
        </div>
      )}
    </div>
  );
} 