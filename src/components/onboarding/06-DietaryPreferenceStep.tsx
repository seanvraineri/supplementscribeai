"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { motion } from 'framer-motion';
import { Beef, Carrot, Fish, Zap, Leaf, Wheat } from 'lucide-react';

const DIETARY_PREFERENCES = [
  { value: 'omnivore', label: 'Omnivore', description: 'I eat all types of food including meat and plants', icon: Beef },
  { value: 'vegetarian', label: 'Vegetarian', description: 'I avoid meat but eat dairy and eggs', icon: Carrot },
  { value: 'paleo', label: 'Paleo', description: 'I focus on whole foods, avoiding grains and processed foods', icon: Fish },
  { value: 'keto', label: 'Keto', description: 'I follow a low-carb, high-fat diet', icon: Zap },
  { value: 'vegan', label: 'Vegan', description: 'I avoid all animal products', icon: Leaf },
  { value: 'celiac', label: 'Celiac/Gluten-Free', description: 'I must avoid gluten due to celiac disease or sensitivity', icon: Wheat },
];

interface DietaryPreferenceStepProps {
  onNext: () => void;
}

export function DietaryPreferenceStep({ onNext }: DietaryPreferenceStepProps) {
  const form = useFormContext<OnboardingData>();
  const selectedPreference = form.watch('dietary_preference');
  
  const handleSelect = (preference: string) => {
    form.setValue('dietary_preference', preference, { shouldValidate: true, shouldDirty: true });
    setTimeout(() => onNext(), 200);
  };
  
  return (
    <div className="space-y-3 w-full max-w-md mx-auto">
      {DIETARY_PREFERENCES.map((preference, index) => {
        const isSelected = selectedPreference === preference.value;
        return (
          <motion.button
            key={preference.value}
            type="button"
            onClick={() => handleSelect(preference.value)}
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
            <preference.icon className={`w-6 h-6 transition-colors ${isSelected ? 'text-dark-accent' : 'text-dark-secondary'}`} />
            <div className="flex-1">
              <h3 className="font-semibold text-dark-primary text-base">
                {preference.label}
              </h3>
              <p className="text-sm text-dark-secondary">
                {preference.description}
              </p>
            </div>
          </motion.button>
        )
      })}
    </div>
  );
} 