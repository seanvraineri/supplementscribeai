"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { OnboardingData } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, XCircle } from "lucide-react";
import React from "react";

const presetOptions = {
  allergies: ["Peanuts", "Shellfish", "Dairy", "Gluten", "Soy"],
  conditions: ["High Blood Pressure", "High Cholesterol", "Diabetes", "Arthritis", "Asthma"],
  medications: ["Lisinopril", "Metformin", "Atorvastatin (Lipitor)", "Amlodipine", "Albuterol"],
};

type FieldName = "allergies" | "conditions" | "medications";

interface HealthProfileSectionProps {
  name: FieldName;
  title: string;
  description: string;
  placeholder: string;
}

const HealthProfileSection: React.FC<HealthProfileSectionProps> = ({ name, title, description, placeholder }) => {
  const form = useFormContext<OnboardingData>();
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name,
  });

  const fieldValue = form.watch(name) || [];
  const hasNone = fieldValue.length === 1 && fieldValue[0].value === "None";

  const handleNoneChange = (checked: boolean) => {
    if (checked) {
      replace([{ value: "None" }]);
    } else {
      replace([]);
    }
  };
  
  const handlePresetClick = (value: string) => {
    const currentValues = (form.getValues(name) || []).map((item: {value: string}) => item.value);
    
    // If 'None' is selected, clear it before adding the new item
    if (currentValues.includes("None")) {
      replace([{ value }]);
    } else if (!currentValues.includes(value)) {
      append({ value });
    }
  };

  const handleAppend = () => {
    const currentValues = (form.getValues(name) || []).map((item: {value: string}) => item.value);
    // If 'None' is selected, clear it before adding the new item
    if (currentValues.includes("None")) {
      replace([{ value: "" }])
    } else {
      append({ value: "" });
    }
  }

  return (
    <div className="space-y-8 bg-dark-panel/50 border border-dark-border rounded-3xl p-8 shadow-lg">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-dark-primary mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-dark-secondary font-medium">{description}</p>
      </div>

      {/* None checkbox */}
      <label className={`group relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${hasNone ? 'border-emerald-400 bg-emerald-500/10 shadow-md' : 'border-dark-border bg-dark-background hover:border-dark-accent/50'}` }>
        <Checkbox
          checked={hasNone}
          onCheckedChange={handleNoneChange}
          className="mr-4 w-6 h-6 rounded-lg border-2 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
        />
        <span className="text-base font-semibold text-dark-primary">I have no {title.toLowerCase()}</span>
      </label>

      {!hasNone && (
       <div className="space-y-6">
          {/* Preset Chips */}
          <div>
            <FormLabel className="text-base font-semibold text-dark-primary tracking-wide">Common {title}</FormLabel>
            <div className="flex flex-wrap gap-3 pt-3">
              {presetOptions[name].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handlePresetClick(option)}
                  className="px-4 py-2 rounded-full border-2 border-dark-border bg-dark-background hover:border-dark-accent hover:bg-dark-accent/10 transition-all duration-300 text-sm font-medium text-dark-primary"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {fields.map((field, index) => {
            // Do not render the input if the value is "None"
            if (field.value === "None") return null;
            
            return (
              <FormField
                control={form.control}
                key={field.id}
                name={`${name}.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={index !== 0 ? "sr-only" : ""}>Custom {title}</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder={placeholder}
                          className="h-14 px-6 text-lg bg-dark-background border-2 border-dark-border rounded-2xl focus:border-dark-accent focus:ring-4 focus:ring-dark-accent/20 transition-all duration-300 placeholder:text-dark-secondary/60 hover:border-dark-accent/50 text-dark-primary"
                        />
                      </FormControl>
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <XCircle className="h-5 w-5" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          })}
          {/* Add custom button */}
          <button
            type="button"
            onClick={handleAppend}
            className="group w-full flex items-center justify-center p-4 rounded-2xl border-2 border-dashed border-dark-border hover:border-dark-accent bg-dark-background hover:bg-dark-accent/5 transition-all duration-300 text-dark-secondary hover:text-dark-primary"
          >
            <PlusCircle className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Add Custom {title}</span>
          </button>
       </div>
      )}
    </div>
  );
};


export function AllergiesStep() {
  return (
    <div className="space-y-8">
      <HealthProfileSection
        name="allergies"
        title="Allergies"
        description="Select any allergies you have or add a custom one."
        placeholder="e.g., Bee stings"
      />
      <HealthProfileSection
        name="conditions"
        title="Medical Conditions"
        description="Select any conditions you have or add a custom one."
        placeholder="e.g., Hypothyroidism"
      />
      <HealthProfileSection
        name="medications"
        title="Medications"
        description="Select any medications you take or add a custom one."
        placeholder="e.g., Ibuprofen"
      />
    </div>
  );
} 