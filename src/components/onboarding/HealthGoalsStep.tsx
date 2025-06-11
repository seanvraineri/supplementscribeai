"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { OnboardingData } from "@/lib/schemas"
import { useFieldArray } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle, XCircle } from "lucide-react"

const healthGoalOptions = [
  { id: "increase_energy", label: "Increase Energy" },
  { id: "improve_sleep", label: "Improve Sleep" },
  { id: "support_immunity", label: "Support Immunity" },
  { id: "enhance_focus", label: "Enhance Focus & Cognitive Function" },
  { id: "muscle_gain", label: "Muscle Gain & Athletic Performance" },
  { id: "weight_loss", label: "Weight Loss & Management" },
  { id: "reduce_stress", label: "Reduce Stress & Anxiety" },
  { id: "improve_digestion", label: "Improve Digestion" },
]

export function HealthGoalsStep() {
  const form = useFormContext<OnboardingData>()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Health Goals</h3>
        <p className="text-sm text-muted-foreground">
          What are you hoping to achieve? Select all that apply.
        </p>
      </div>
      <FormField
        control={form.control}
        name="healthGoals"
        render={() => (
          <FormItem className="space-y-3">
            {healthGoalOptions.map((item) => (
              <FormField
                key={item.id}
                control={form.control}
                name="healthGoals"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.label)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), item.label])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== item.label
                                  )
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4 pt-4">
        <FormLabel>Custom Goals</FormLabel>
        <CustomGoalsSection />
      </div>
    </div>
  )
}

function CustomGoalsSection() {
  const { control } = useFormContext<OnboardingData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "customHealthGoals",
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <FormField
          control={control}
          key={field.id}
          name={`customHealthGoals.${index}.value`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={index !== 0 ? "sr-only" : ""}>
                Custom Goal
              </FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input {...field} placeholder="e.g., Improve skin health" />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <XCircle className="h-5 w-5" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ value: "" })}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Custom Goal
      </Button>
    </div>
  )
} 