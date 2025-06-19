"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { motion } from 'framer-motion';

const COMMON_CONCERNS = [
  "Low energy throughout the day",
  "Brain fog and concentration issues", 
  "Poor sleep quality and insomnia",
  "Digestive problems and bloating",
  "Mood swings and anxiety",
  "Joint pain and inflammation",
  "Stubborn weight that won't budge",
  "Frequent colds and low immunity"
];

export function PrimaryConcernStep() {
  const { register, setValue, watch } = useFormContext<OnboardingData>();
  const concern = watch('primary_health_concern');

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <div className="relative">
        <textarea
          {...register('primary_health_concern')}
          placeholder="e.g., Low energy throughout the day, brain fog affecting work, poor sleep quality, digestive issues..."
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all resize-none"
        />
        <p className="absolute bottom-3 right-3 text-xs text-dark-secondary font-mono">
          {concern?.length || 0}/500
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-dark-secondary text-left">Common concerns (click to use):</p>
        <div className="grid grid-cols-2 gap-2">
          {COMMON_CONCERNS.map((example, index) => (
            <motion.button
              key={example}
              type="button"
              onClick={() => setValue('primary_health_concern', example, { shouldValidate: true, shouldDirty: true })}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full text-left px-3 py-2 rounded-md bg-dark-panel border border-dark-border hover:border-dark-accent/50 transition-all text-xs text-dark-secondary hover:text-dark-primary"
            >
              {example}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
} 