"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { motion } from 'framer-motion';
import { Briefcase, Zap, Dumbbell, Wind, Sun } from 'lucide-react';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', description: 'Desk job, minimal exercise', icon: Briefcase },
  { value: 'lightly_active', label: 'Lightly Active', description: '1-3 days light exercise', icon: Sun },
  { value: 'moderately_active', label: 'Moderately Active', description: '3-5 days moderate exercise', icon: Zap },
  { value: 'very_active', label: 'Very Active', description: '6-7 days intense exercise', icon: Dumbbell },
  { value: 'extremely_active', label: 'Extremely Active', description: 'Athlete or physical job', icon: Wind },
];

interface ActivityLevelStepProps {
  onNext: () => void;
}

export function ActivityLevelStep({ onNext }: ActivityLevelStepProps) {
  const form = useFormContext<OnboardingData>();
  const selectedLevel = form.watch('activity_level');
  
  const handleSelect = (level: string) => {
    form.setValue('activity_level', level, { shouldValidate: true, shouldDirty: true });
    setTimeout(() => onNext(), 200);
  };
  
  return (
    <div className="space-y-3 w-full max-w-md mx-auto">
      {ACTIVITY_LEVELS.map((level, index) => {
        const isSelected = selectedLevel === level.value;
        return (
          <motion.button
            key={level.value}
            type="button"
            onClick={() => handleSelect(level.value)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 flex items-center gap-4
              ${isSelected
                ? 'bg-dark-accent/10 border-dark-accent'
                : 'bg-dark-panel border-dark-border hover:border-dark-border/70'
              }`
            }
          >
            <level.icon className={`w-6 h-6 transition-colors ${isSelected ? 'text-dark-accent' : 'text-dark-secondary'}`} />
            <div className="flex-1">
              <h3 className="font-semibold text-dark-primary text-base">
                {level.label}
              </h3>
              <p className="text-sm text-dark-secondary">
                {level.description}
              </p>
            </div>
          </motion.button>
        )
      })}
    </div>
  );
} 