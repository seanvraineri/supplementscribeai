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
        <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">What are your health goals?</h3>
        <p className="text-lg text-gray-600 font-light">
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
                              ? 'border-[#7DE1F4] bg-gradient-to-br from-[#7DE1F4]/10 to-[#86A8E7]/10 shadow-lg' 
                              : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white/80'
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
                              className="mr-4 w-7 h-7 rounded-lg border-2 data-[state=checked]:bg-[#7DE1F4] data-[state=checked]:border-[#7DE1F4]"
                            />
                            <div className="flex-1">
                              <FormLabel className="text-base font-semibold text-gray-900 cursor-pointer group-hover:text-gray-700 transition-colors duration-200 leading-snug">
                                {item.label}
                              </FormLabel>
                            </div>
                            <div className="w-6"></div>
                            {isSelected && (
                              <div className="absolute top-3 right-3 w-3 h-3 bg-[#7DE1F4] rounded-full animate-pulse"></div>
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

      <div className="space-y-6 pt-8 border-t border-gray-100">
        <div className="text-center">
          <FormLabel className="text-xl font-bold text-gray-900 tracking-tight">Add Custom Goals</FormLabel>
          <p className="text-sm text-gray-600 font-light mt-2">Have specific goals not listed above? Add them here.</p>
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
                      className="h-14 px-6 pr-14 text-lg bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-[#7DE1F4] focus:ring-4 focus:ring-[#7DE1F4]/20 transition-all duration-300 placeholder:text-gray-400 hover:border-gray-300"
                    />
                  </div>
                </FormControl>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-all duration-200 flex items-center justify-center group"
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
        className="group w-full flex items-center justify-center p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#7DE1F4] bg-white/50 hover:bg-gradient-to-br hover:from-[#7DE1F4]/5 hover:to-[#86A8E7]/5 transition-all duration-300 text-gray-600 hover:text-gray-900"
      >
        <PlusCircle className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-medium">Add Custom Goal</span>
      </button>
    </div>
  )
} 