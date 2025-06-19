"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';

const BIOMARKER_EXAMPLES = ["Vitamin D", "Iron", "B12", "Magnesium", "Cholesterol", "HbA1c"];
const GENETIC_EXAMPLES = ["MTHFR", "COMT", "APOE", "Factor V Leiden"];

interface GuidedInputProps {
  name: "known_biomarkers" | "known_genetic_variants";
  placeholder: string;
  examples: string[];
}

function GuidedInput({ name, placeholder, examples }: GuidedInputProps) {
  const { register, getValues, setValue } = useFormContext<OnboardingData>();

  const addExample = (example: string) => {
    const currentValue = getValues(name) || "";
    const newValue = currentValue ? `${currentValue}, ${example}` : example;
    setValue(name, newValue, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="space-y-3 text-left">
      <textarea
        {...register(name)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 bg-dark-background border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all resize-none"
      />
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-dark-secondary mt-1.5 mr-1">e.g.</span>
        {examples.map(example => (
          <button
            key={example}
            type="button"
            onClick={() => addExample(example)}
            className="text-left px-2.5 py-1 rounded-md bg-dark-panel border border-dark-border hover:border-dark-accent/50 transition-all text-xs text-dark-secondary hover:text-dark-primary"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  )
}

export function OptionalDataStep() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <Accordion type="multiple" className="w-full space-y-3">
        <AccordionItem value="item-1" className="bg-dark-panel border border-dark-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-semibold text-dark-primary">
            Have recent blood work?
          </AccordionTrigger>
          <AccordionContent>
            <GuidedInput
              name="known_biomarkers"
              placeholder="Copy and paste results here, or list them one by one, e.g., Vitamin D: 25 ng/mL, Iron: 50 ug/dL"
              examples={BIOMARKER_EXAMPLES}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="bg-dark-panel border border-dark-border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline font-semibold text-dark-primary">
            Have a genetic report?
          </AccordionTrigger>
          <AccordionContent>
            <GuidedInput
              name="known_genetic_variants"
              placeholder="e.g., MTHFR C677T, COMT Val158Met"
              examples={GENETIC_EXAMPLES}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
       <div className="!mt-6 bg-dark-panel/50 border border-dark-border rounded-lg p-3">
        <p className="text-dark-secondary text-sm font-medium text-center">
          Optional, but helps us create an even more precise plan.
        </p>
      </div>
    </div>
  );
} 