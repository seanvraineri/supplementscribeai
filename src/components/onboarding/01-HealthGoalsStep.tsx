"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { Icons } from './shared/DesignSystem';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

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

export const HealthGoalsStep = ({ onNext }: HealthGoalsStepProps) => {
  const form = useFormContext<OnboardingData>();
  const selectedGoals = form.watch('healthGoals') || [];
  const customGoal = form.watch('customHealthGoal');
  
  const toggleGoal = (goalId: string) => {
    const current = selectedGoals || [];
    const updated = current.includes(goalId) 
      ? current.filter(g => g !== goalId)
      : [...current, goalId];
    
    form.setValue('healthGoals', updated, { shouldValidate: true });
  };

  const canContinue = selectedGoals.length > 0 || customGoal;
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {STANDARD_HEALTH_GOALS.map((goal) => (
            <motion.button
              key={goal.id}
              type="button"
              onClick={() => toggleGoal(goal.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * STANDARD_HEALTH_GOALS.indexOf(goal), ease: "easeOut" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`min-h-[72px] p-4 rounded-lg border-2 text-left transition-all duration-200
              ${selectedGoals.includes(goal.id)
                  ? 'bg-dark-accent/10 border-dark-accent'
                  : 'bg-dark-panel border-dark-border hover:border-dark-border/70'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 flex items-center justify-center rounded-md flex-shrink-0 ${selectedGoals.includes(goal.id) ? 'bg-dark-accent/20' : 'bg-dark-background'}`}>
                  <goal.icon className={`w-5 h-5 ${selectedGoals.includes(goal.id) ? 'text-dark-accent' : 'text-dark-secondary'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-dark-primary text-sm leading-tight">
                    {goal.label}
                  </h3>
                </div>
              </div>
            </motion.button>
        ))}
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
          className={`w-full min-h-[72px] p-4 rounded-lg border-2 text-left transition-all duration-200
          ${selectedGoals.includes('custom')
              ? 'bg-dark-accent/10 border-dark-accent'
              : 'bg-dark-panel border-dark-border hover:border-dark-border/70'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center rounded-md flex-shrink-0 ${selectedGoals.includes('custom') ? 'bg-dark-accent/20' : 'bg-dark-background'}`}>
              <CUSTOM_GOAL.icon className={`w-5 h-5 ${selectedGoals.includes('custom') ? 'text-dark-accent' : 'text-dark-secondary'}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-dark-primary text-sm leading-tight">
                {CUSTOM_GOAL.label}
              </h3>
            </div>
          </div>
      </motion.button>
      
      <AnimatePresence>
        {selectedGoals.includes('custom') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full"
          >
            <textarea
              className="w-full p-3 sm:p-4 bg-dark-panel border border-dark-border rounded-lg text-dark-primary placeholder-dark-secondary focus:border-dark-accent focus:outline-none transition-colors resize-none text-sm sm:text-base"
              placeholder="E.g., Manage ADHD symptoms, support thyroid function..."
              rows={3}
              {...form.register('customHealthGoal')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mt-8">
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className={`min-h-[48px] inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full font-medium transition-all transform hover:scale-105 ${
            canContinue 
              ? 'bg-dark-accent text-white shadow-lg hover:shadow-cyan-500/50' 
              : 'bg-dark-border text-dark-secondary cursor-not-allowed'
          }`}
        >
          Continue
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}; 