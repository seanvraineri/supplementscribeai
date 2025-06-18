"use client";

import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { OnboardingData } from '@/lib/schemas';
import { Icons, PremiumButton, PremiumInput, PremiumTag } from './shared/DesignSystem';

const HEALTH_GOALS = [
  { id: 'energy_performance', label: 'Boost Energy & Performance', icon: Icons.Energy },
  { id: 'cognitive_focus', label: 'Enhance Focus & Memory', icon: Icons.Brain },
  { id: 'sleep_recovery', label: 'Improve Sleep & Recovery', icon: Icons.Sleep },
  { id: 'stress_mood', label: 'Better Stress & Mood', icon: Icons.Wellness },
  { id: 'digestive_health', label: 'Optimize Digestion', icon: Icons.Digestion },
  { id: 'athletic_performance', label: 'Athletic Performance', icon: Icons.Athletic },
  { id: 'longevity_wellness', label: 'Longevity & Wellness', icon: Icons.Longevity },
  { id: 'weight_management', label: 'Weight Management', icon: Icons.Weight },
  { id: 'custom', label: 'Custom Goal', icon: Icons.Custom }
];

export function HealthGoalsStep() {
  const form = useFormContext<OnboardingData>();
  const watchedGoals = form.watch('healthGoals') || [];
  
  const toggleGoal = (goalId: string) => {
    const currentGoals = form.getValues('healthGoals') || [];
    const updatedGoals = currentGoals.includes(goalId)
      ? currentGoals.filter((id: string) => id !== goalId)
      : [...currentGoals, goalId];
    
    form.setValue('healthGoals', updatedGoals, { shouldValidate: true });
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {HEALTH_GOALS.map((goal) => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`p-3 rounded-xl border-2 transition-all text-left ${
              watchedGoals.includes(goal.id)
                ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${
                watchedGoals.includes(goal.id) ? 'bg-blue-100' : 'bg-white'
              }`}>
                <goal.icon />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  {goal.label}
                </h3>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {watchedGoals.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-green-600 font-medium">
            ✓ {watchedGoals.length} goal{watchedGoals.length > 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
} 