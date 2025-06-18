"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { Icons, PremiumButton } from './shared/DesignSystem';

const SLEEP_OPTIONS = [
  { 
    value: 5, 
    label: '5 hours or less', 
    icon: Icons.Sleep5, 
    color: 'red',
    feedback: 'Your body needs more rest for optimal health and recovery',
    status: 'concern'
  },
  { 
    value: 6, 
    label: '6 hours', 
    icon: Icons.Sleep6, 
    color: 'orange',
    feedback: 'Close to optimal, but most adults benefit from a bit more sleep',
    status: 'okay'
  },
  { 
    value: 7, 
    label: '7 hours', 
    icon: Icons.Sleep7, 
    color: 'green',
    feedback: 'Excellent! This is in the optimal range for most adults',
    status: 'great'
  },
  { 
    value: 8, 
    label: '8 hours', 
    icon: Icons.Sleep8, 
    color: 'green',
    feedback: 'Perfect! You\'re getting quality restorative sleep',
    status: 'perfect'
  },
  { 
    value: 9, 
    label: '8+ hours', 
    icon: Icons.Sleep9, 
    color: 'blue',
    feedback: 'Amazing! You prioritize sleep for peak performance',
    status: 'excellent'
  }
];

export function SleepHoursStep() {
  const form = useFormContext<OnboardingData>();
  const selectedHours = form.watch('sleep_hours');
  
  const selectSleepHours = (hours: number) => {
    form.setValue('sleep_hours', hours, { shouldValidate: true });
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SLEEP_OPTIONS.map(option => (
          <PremiumButton
            key={option.value}
            onClick={() => selectSleepHours(option.value)}
            selected={selectedHours === option.value}
            variant={option.status === 'concern' ? 'none' : option.status === 'okay' ? 'secondary' : 'primary'}
            size="md"
            autoAdvance={true}
            icon={<option.icon />}
            className="flex-col text-center py-4 h-auto"
          >
            <div className="font-semibold text-sm mt-2">{option.label}</div>
          </PremiumButton>
        ))}
      </div>
      
      {selectedHours && (
        <div className={`text-center rounded-lg p-4 border ${
          SLEEP_OPTIONS.find(o => o.value === selectedHours)?.status === 'concern' 
            ? 'bg-orange-50 border-orange-200'
            : SLEEP_OPTIONS.find(o => o.value === selectedHours)?.status === 'okay'
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-green-50 border-green-200'
        }`}>
          <p className={`text-base font-semibold mb-1 ${
            SLEEP_OPTIONS.find(o => o.value === selectedHours)?.status === 'concern' 
              ? 'text-orange-800'
              : SLEEP_OPTIONS.find(o => o.value === selectedHours)?.status === 'okay'
              ? 'text-yellow-800'
              : 'text-green-800'
          }`}>
            {SLEEP_OPTIONS.find(o => o.value === selectedHours)?.feedback}
          </p>
        </div>
      )}
    </div>
  );
} 