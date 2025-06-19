"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { motion } from 'framer-motion';

export function PersonalDetailsStep() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<OnboardingData>();
  const gender = watch('gender');
  
  return (
    <div className="space-y-4 w-full max-w-md mx-auto text-left">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-dark-secondary">Full Name</label>
          <input 
            {...register('fullName')}
            placeholder="Your name"
            className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-dark-secondary">Age</label>
          <input 
            {...register('age')}
            type="number" 
            placeholder="Age" 
            className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-secondary">Gender</label>
        <div className="grid grid-cols-3 gap-2">
          {['male', 'female', 'other'].map(g => (
            <button
              key={g}
              type="button"
              onClick={() => setValue('gender', g, { shouldValidate: true, shouldDirty: true })}
              className={`py-2.5 rounded-lg border-2 transition-all text-sm font-medium
                ${gender === g
                  ? 'bg-dark-accent/10 border-dark-accent text-dark-accent'
                  : 'bg-dark-panel border-dark-border text-dark-secondary hover:border-dark-border/70'
                }`
              }
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-dark-secondary">Height</label>
          <div className="flex items-center gap-2">
            <input 
              {...register('height_ft')}
              type="number" 
              placeholder="5" 
              className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
            />
            <span className="text-sm text-dark-secondary">ft</span>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-dark-secondary">&nbsp;</label>
          <div className="flex items-center gap-2">
            <input 
              {...register('height_in')}
              type="number" 
              placeholder="8" 
              className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
            />
            <span className="text-sm text-dark-secondary">in</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-1">
        <label className="text-sm font-medium text-dark-secondary">Weight</label>
        <div className="flex items-center gap-2">
          <input 
            {...register('weight_lbs')}
            type="number" 
            placeholder="150" 
            className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
          />
          <span className="text-sm text-dark-secondary">lbs</span>
        </div>
      </div>
      
      <div className="!mt-6 bg-dark-panel/50 border border-dark-border rounded-lg p-3">
        <p className="text-dark-secondary text-sm font-medium text-center">
          Used for precise dosage calculations.
        </p>
      </div>
    </div>
  );
} 