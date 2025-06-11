"use client";

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
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

  const [hasNone, setHasNone] = React.useState(false);

  const handleNoneChange = (checked: boolean) => {
    setHasNone(checked);
    if (checked) {
      replace([]); // Clear the array
    }
  };
  
  const handlePresetClick = (value: string) => {
    // Prevent adding if it already exists
    if (!fields.some(field => (field as { value: string }).value === value)) {
      append({ value });
      setHasNone(false);
    }
  };

  const handleAppend = () => {
    append({ value: "" });
    setHasNone(false);
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
        <FormControl>
          <Checkbox checked={hasNone} onCheckedChange={handleNoneChange} />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel>None</FormLabel>
        </div>
      </FormItem>
      
      {!hasNone && (
        <div className="space-y-4">
          <div>
            <FormLabel>Common {title}</FormLabel>
            <div className="flex flex-wrap gap-2 pt-2">
              {presetOptions[name].map((option) => (
                <Button key={option} type="button" variant="outline" size="sm" onClick={() => handlePresetClick(option)}>
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`${name}.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={index !== 0 ? "sr-only" : ""}>Custom {title}</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input {...field} placeholder={placeholder} />
                    </FormControl>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <XCircle className="h-5 w-5" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="button" variant="outline" size="sm" onClick={handleAppend}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Custom
          </Button>
        </div>
      )}
    </div>
  );
};


export function HealthProfileStep() {
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