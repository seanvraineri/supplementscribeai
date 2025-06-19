"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { motion } from 'framer-motion';
import { Circle, GlassWater, Wine, Beer } from 'lucide-react';

const ALCOHOL_OPTIONS = [
  { 
    value: 'never', 
    label: 'None',
    description: "I do not drink alcohol.",
    icon: Circle 
  },
  { 
    value: 'occasionally', 
    label: 'Occasionally',
    description: "1-2 drinks per week.",
    icon: GlassWater
  },
  { 
    value: 'moderately', 
    label: 'Moderately',
    description: "3-5 drinks per week.",
    icon: Wine
  },
  { 
    value: 'regularly', 
    label: 'Regularly',
    description: "5+ drinks per week.",
    icon: Beer
  },
];

interface AlcoholStepProps {
  onNext: () => void;
}

export function AlcoholStep({ onNext }: AlcoholStepProps) {
  const form = useFormContext<OnboardingData>();
  const selectedIntake = form.watch('alcohol_intake');
  
  const handleSelect = (intake: string) => {
    form.setValue('alcohol_intake', intake, { shouldValidate: true, shouldDirty: true });
    setTimeout(() => onNext(), 200);
  };
  
  return (
    <div className="space-y-3 w-full max-w-md mx-auto">
      {ALCOHOL_OPTIONS.map((option, index) => {
        const isSelected = selectedIntake === option.value;
        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
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
            <option.icon className={`w-6 h-6 transition-colors ${isSelected ? 'text-dark-accent' : 'text-dark-secondary'}`} />
            <div className="flex-1">
              <h3 className="font-semibold text-dark-primary text-base">
                {option.label}
              </h3>
              <p className="text-sm text-dark-secondary">
                {option.description}
              </p>
            </div>
          </motion.button>
        )
      })}
    </div>
  );
} 