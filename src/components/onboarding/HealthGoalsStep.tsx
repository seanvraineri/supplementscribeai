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
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-dark-primary mb-3 tracking-tight">What are your health goals?</h3>
        <p className="text-lg text-dark-secondary font-medium">
          Select all that apply to personalize your supplement plan
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="healthGoals"
        render={() => (
          <FormItem className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthGoalOptions.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="healthGoals"
                  render={({ field }) => {
                    const isSelected = field.value?.includes(item.id);
                    return (
                      <FormItem key={item.id} className="h-full">
                        <FormControl>
                          <label className={`group relative flex items-center justify-between p-6 sm:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg h-full min-h-[96px] ${
                            isSelected 
                              ? 'border-dark-accent bg-dark-accent/10 shadow-lg' 
                              : 'border-dark-border bg-dark-background hover:border-dark-accent/50 hover:bg-dark-accent/5'
                          }`}>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    )
                              }}
                              className="mr-4 w-7 h-7 rounded-lg border-2 data-[state=checked]:bg-dark-accent data-[state=checked]:border-dark-accent"
                            />
                            <div className="flex-1">
                              <FormLabel className="text-base font-semibold text-dark-primary cursor-pointer group-hover:text-dark-primary transition-colors duration-200 leading-snug">
                                {item.label}
                              </FormLabel>
                            </div>
                            <div className="w-6"></div>
                            {isSelected && (
                              <div className="absolute top-3 right-3 w-3 h-3 bg-dark-accent rounded-full animate-pulse"></div>
                            )}
                          </label>
                        </FormControl>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-6 pt-8 border-t border-dark-border">
        <div className="text-center">
          <FormLabel className="text-xl font-bold text-dark-primary tracking-tight">Add Custom Goals</FormLabel>
          <p className="text-sm text-dark-secondary font-medium mt-2">Have specific goals not listed above? Add them here.</p>
        </div>
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
              <div className="flex items-center gap-3">
                <FormControl>
                  <div className="relative flex-1">
                    <Input 
                      {...field} 
                      placeholder="e.g., Improve skin health" 
                      className="h-14 px-6 pr-14 text-lg bg-dark-background border-2 border-dark-border rounded-2xl focus:border-dark-accent focus:ring-4 focus:ring-dark-accent/20 transition-all duration-300 placeholder:text-dark-secondary/60 hover:border-dark-accent/50 text-dark-primary"
                    />
                  </div>
                </FormControl>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 flex items-center justify-center group border border-red-500/20"
                >
                  <XCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="sr-only">Remove</span>
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <button
        type="button"
        onClick={() => append({ value: "" })}
        className="group w-full flex items-center justify-center p-4 rounded-2xl border-2 border-dashed border-dark-border hover:border-dark-accent bg-dark-background hover:bg-dark-accent/5 transition-all duration-300 text-dark-secondary hover:text-dark-primary"
      >
        <PlusCircle className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-medium">Add Custom Goal</span>
      </button>
    </div>
  )
} 