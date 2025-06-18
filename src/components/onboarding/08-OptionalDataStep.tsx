"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { Icons, PremiumInput } from './shared/DesignSystem';

export function OptionalDataStep() {
  const form = useFormContext<OnboardingData>();
  
  return (
    <div className="space-y-4">
      {/* Blood Test Numbers */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Blood Test Numbers</h3>
        
        <PremiumInput
          value={form.watch('known_biomarkers') || ''}
          onChange={(value) => form.setValue('known_biomarkers', value, { shouldValidate: true })}
          placeholder="e.g., Vitamin D: 18 ng/mL, B12: 250 pg/mL"
          className="text-sm"
        />
      </div>
      
      {/* Genetic Variants */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Genetic Variants</h3>
        
        <PremiumInput
          value={form.watch('known_genetic_variants') || ''}
          onChange={(value) => form.setValue('known_genetic_variants', value, { shouldValidate: true })}
          placeholder="e.g., MTHFR C677T, COMT Val158Met"
          className="text-sm"
        />
      </div>
      
      {/* Compact Info */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
        <p className="text-blue-700 text-sm font-medium">
          💡 Optional but helps us create a more precise plan
        </p>
      </div>
    </div>
  );
} 