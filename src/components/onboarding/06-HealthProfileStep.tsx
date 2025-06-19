"use client";

import { useFormContext, useFieldArray } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

type FieldName = "allergies" | "conditions" | "medications";

interface DynamicFieldArrayProps {
  name: FieldName;
  label: string;
  placeholder: string;
}

function DynamicFieldArray({ name, label, placeholder }: DynamicFieldArrayProps) {
  const { control, register, formState: { errors } } = useFormContext<OnboardingData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="font-semibold text-dark-primary">{label}</label>
        <button
          type="button"
          onClick={() => append({ value: '' })}
          className="flex items-center gap-1.5 text-sm text-dark-accent hover:text-cyan-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <input
                {...register(`${name}.${index}.value` as const)}
                placeholder={placeholder}
                className="flex-1 w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
              />
              <button type="button" onClick={() => remove(index)} className="p-2 text-dark-secondary hover:text-red-500 transition-colors rounded-full hover:bg-dark-panel">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {fields.length === 0 && (
           <p className="text-sm text-dark-secondary/70 text-left px-4">None added.</p>
        )}
      </div>
    </div>
  );
}


export function HealthProfileStep() {
  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <DynamicFieldArray
        name="allergies"
        label="Allergies"
        placeholder="e.g., shellfish, nuts, dairy"
      />
      <DynamicFieldArray
        name="conditions"
        label="Medical Conditions"
        placeholder="e.g., diabetes, high blood pressure"
      />
      <DynamicFieldArray
        name="medications"
        label="Current Medications"
        placeholder="e.g., metformin, lisinopril"
      />
       <div className="!mt-8 bg-dark-panel/50 border border-dark-border rounded-lg p-3">
        <p className="text-dark-secondary text-sm font-medium text-center">
          This helps us avoid interactions and select safe supplements for you.
        </p>
      </div>
    </div>
  );
} 