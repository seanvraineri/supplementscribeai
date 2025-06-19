"use client";

import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { OnboardingData } from '@/lib/schemas';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sunrise, Sunset, Zap } from 'lucide-react';

const SLEEP_OPTIONS = [
  { value: 5, label: '5 hours or less', icon: Zap },
  { value: 6, label: '6 hours', icon: Moon },
  { value: 7, label: '7 hours', icon: Sunrise },
  { value: 8, label: '8 hours', icon: Sunset },
  { value: 9, label: '8+ hours', icon: Sunset },
];

const SLEEP_FEEDBACK: { [key: number]: { message: string; type: 'warning' | 'info' | 'success' } } = {
  5: { message: 'This is a critical area for improvement. We will focus on sleep-enhancing nutrients.', type: 'warning' },
  6: { message: 'Close to optimal, but most adults benefit from a bit more sleep.', type: 'info' },
  7: { message: 'A good target for many. We will help you optimize sleep quality.', type: 'success' },
  8: { message: 'Excellent! This is the gold standard for restorative sleep.', type: 'success' },
  9: { message: 'Great! We will focus on maximizing sleep quality and recovery.', type: 'success' },
};

interface SleepHoursStepProps {
  onNext: () => void;
}

export function SleepHoursStep({ onNext }: SleepHoursStepProps) {
  const form = useFormContext<OnboardingData>();
  const selectedHours = form.watch('sleep_hours');
  const [feedback, setFeedback] = useState<{ message: string; type: string } | null>(null);

  useEffect(() => {
    if (selectedHours && SLEEP_FEEDBACK[selectedHours]) {
      setFeedback(SLEEP_FEEDBACK[selectedHours]);
    } else {
      setFeedback(null);
    }
  }, [selectedHours]);

  const handleSelect = (hours: number) => {
    form.setValue('sleep_hours', hours, { shouldValidate: true, shouldDirty: true });
    setTimeout(() => onNext(), 200);
  };
  
  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="grid grid-cols-3 gap-3 mb-6">
        {SLEEP_OPTIONS.map((option, index) => {
          const isSelected = selectedHours === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-lg border-2 text-center transition-all duration-200
                ${isSelected
                  ? 'bg-dark-accent/10 border-dark-accent'
                  : 'bg-dark-panel border-dark-border hover:border-dark-border/70'
                }`
              }
            >
              <option.icon className={`w-6 h-6 mx-auto mb-2 transition-colors ${isSelected ? 'text-dark-accent' : 'text-dark-secondary'}`} />
              <p className="font-semibold text-dark-primary text-sm">{option.label}</p>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`w-full p-3 rounded-lg border text-sm
              ${feedback.type === 'warning' ? 'bg-red-500/10 border-red-500/50 text-red-300' : ''}
              ${feedback.type === 'info' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-300' : ''}
              ${feedback.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-300' : ''}
            `}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 