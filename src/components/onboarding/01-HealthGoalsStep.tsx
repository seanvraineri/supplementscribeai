"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { Icons } from './shared/DesignSystem';
import { motion, AnimatePresence } from 'framer-motion';

const STANDARD_HEALTH_GOALS = [
  { id: 'energy_performance', label: 'Boost Energy & Performance', icon: Icons.Energy },
  { id: 'cognitive_focus', label: 'Enhance Focus & Memory', icon: Icons.Brain },
  { id: 'sleep_recovery', label: 'Improve Sleep & Recovery', icon: Icons.Sleep },
  { id: 'stress_mood', label: 'Better Stress & Mood', icon: Icons.Wellness },
  { id: 'digestive_health', label: 'Optimize Digestion', icon: Icons.Digestion },
  { id: 'athletic_performance', label: 'Athletic Performance', icon: Icons.Athletic },
  { id: 'longevity_wellness', label: 'Longevity & Wellness', icon: Icons.Longevity },
  { id: 'weight_management', label: 'Weight Management', icon: Icons.Weight },
];

const CUSTOM_GOAL = { id: 'custom', label: 'Custom Goal', icon: Icons.Custom };

interface HealthGoalsStepProps {
  onNext: () => void;
}

export function HealthGoalsStep({ onNext }: HealthGoalsStepProps) {
  const form = useFormContext<OnboardingData>();
  const watchedGoals = form.watch('healthGoals') || [];
  const isCustomSelected = watchedGoals.includes('custom');
  
  const toggleGoal = (goalId: string) => {
    const currentGoals = form.getValues('healthGoals') || [];
    const updatedGoals = currentGoals.includes(goalId)
      ? currentGoals.filter((id: string) => id !== goalId)
      : [...currentGoals, goalId];
    
    form.setValue('healthGoals', updatedGoals, { shouldValidate: true, shouldDirty: true });
    
    if (goalId === 'custom' && !updatedGoals.includes('custom')) {
      form.setValue('customHealthGoal', '', { shouldValidate: true });
    }
  };
  
  return (
    <div className="space-y-3 w-full max-w-lg mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {STANDARD_HEALTH_GOALS.map((goal, index) => {
          const isSelected = watchedGoals.includes(goal.id);
          return (
            <motion.button
              key={goal.id}
              type="button"
              onClick={() => toggleGoal(goal.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200
                ${isSelected
                  ? 'bg-dark-accent/10 border-dark-accent'
                  : 'bg-dark-panel border-dark-border hover:border-dark-border/70'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${isSelected ? 'bg-dark-accent/20' : 'bg-dark-background'}`}>
                  <goal.icon className={`w-5 h-5 ${isSelected ? 'text-dark-accent' : 'text-dark-secondary'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-dark-primary text-sm leading-tight">
                    {goal.label}
                  </h3>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <motion.button
          key={CUSTOM_GOAL.id}
          type="button"
          onClick={() => toggleGoal(CUSTOM_GOAL.id)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200
            ${isCustomSelected
              ? 'bg-dark-accent/10 border-dark-accent'
              : 'bg-dark-panel border-dark-border hover:border-dark-border/70'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md ${isCustomSelected ? 'bg-dark-accent/20' : 'bg-dark-background'}`}>
              <CUSTOM_GOAL.icon className={`w-5 h-5 ${isCustomSelected ? 'text-dark-accent' : 'text-dark-secondary'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-dark-primary text-sm leading-tight">
                {CUSTOM_GOAL.label}
              </h3>
            </div>
          </div>
      </motion.button>
      
      <AnimatePresence>
        {isCustomSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full"
          >
            <input
              {...form.register('customHealthGoal')}
              placeholder="Describe your custom health goal..."
              className="w-full mt-3 px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {watchedGoals.length > 0 && (
        <div className="text-center pt-2">
          <p className="text-sm text-dark-accent font-medium">
            {watchedGoals.length} goal{watchedGoals.length > 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
} 