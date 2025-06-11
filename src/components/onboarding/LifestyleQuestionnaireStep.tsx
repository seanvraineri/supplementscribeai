"use client";

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingData } from '@/lib/schemas';

const lowNutrientOptions = [
  { id: "vitamin_d", label: "Vitamin D" },
  { id: "magnesium", label: "Magnesium" },
  { id: "b12", label: "B12" },
  { id: "not_sure", label: "Not sure" },
];

export function LifestyleQuestionnaireStep() {
  const form = useFormContext<OnboardingData>();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Lifestyle Questionnaire</h3>
        <p className="text-sm text-muted-foreground">
          This optional questionnaire helps us create a baseline supplement plan.
        </p>
      </div>

      {/* Section 1: Energy & Fatigue */}
      <div className="space-y-4">
        <h4 className="font-semibold">🧬 SECTION 1: Energy & Fatigue</h4>
        <FormField
          control={form.control}
          name="energy_levels"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>How would you describe your daily energy levels?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="low" /></FormControl><FormLabel className="font-normal">Low all day</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="crash" /></FormControl><FormLabel className="font-normal">Okay in the morning, crash in afternoon</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="consistent" /></FormControl><FormLabel className="font-normal">Pretty consistent</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="high" /></FormControl><FormLabel className="font-normal">High energy most of the time</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="effort_fatigue"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you feel physically or mentally wiped after moderate effort?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="often" /></FormControl><FormLabel className="font-normal">Yes, often</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="sometimes" /></FormControl><FormLabel className="font-normal">Sometimes</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="rarely" /></FormControl><FormLabel className="font-normal">Rarely</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="caffeine_effect"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you feel better after caffeine or stimulants?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes — noticeably</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="somewhat" /></FormControl><FormLabel className="font-normal">Somewhat</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="no_difference" /></FormControl><FormLabel className="font-normal">No difference</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="no_caffeine" /></FormControl><FormLabel className="font-normal">I don't consume caffeine</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Section 2: Mood, Focus, Stress */}
      <div className="space-y-4">
        <h4 className="font-semibold">🧠 SECTION 2: Mood, Focus, Stress</h4>
        <FormField
          control={form.control}
          name="brain_fog"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you struggle with brain fog or difficulty concentrating?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="all_the_time" /></FormControl><FormLabel className="font-normal">All the time</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="occasionally" /></FormControl><FormLabel className="font-normal">Occasionally</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="rarely" /></FormControl><FormLabel className="font-normal">Rarely</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="never" /></FormControl><FormLabel className="font-normal">Never</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="anxiety_level"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you often feel anxious or overwhelmed without clear reason?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="sometimes" /></FormControl><FormLabel className="font-normal">Sometimes</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stress_resilience"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>How well do you handle stress?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="poorly" /></FormControl><FormLabel className="font-normal">Poorly, I get overwhelmed easily</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="average" /></FormControl><FormLabel className="font-normal">Average, I can handle moderate stress</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="well" /></FormControl><FormLabel className="font-normal">Well, I'm resilient to stress</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Section 3: Sleep */}
      <div className="space-y-4">
        <h4 className="font-semibold">😴 SECTION 3: Sleep</h4>
        <FormField
          control={form.control}
          name="sleep_quality"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>How would you rate your sleep quality?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="poor" /></FormControl><FormLabel className="font-normal">Poor, I wake up tired</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="average" /></FormControl><FormLabel className="font-normal">Average, it's okay most nights</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="good" /></FormControl><FormLabel className="font-normal">Good, I wake up refreshed</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sleep_aids"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you use any aids (e.g., melatonin, prescriptions) to help you sleep?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="sometimes" /></FormControl><FormLabel className="font-normal">Sometimes</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Section 4: Digestion & Gut Health */}
      <div className="space-y-4">
        <h4 className="font-semibold">🍎 SECTION 4: Digestion & Gut Health</h4>
        <FormField
          control={form.control}
          name="bloating"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you experience frequent bloating or gas after meals?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="often" /></FormControl><FormLabel className="font-normal">Yes, often</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="sometimes" /></FormControl><FormLabel className="font-normal">Sometimes</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="rarely" /></FormControl><FormLabel className="font-normal">Rarely or never</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="digestion_speed"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>How would you describe your digestion?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="fast" /></FormControl><FormLabel className="font-normal">Tends to be fast (loose stools)</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="slow" /></FormControl><FormLabel className="font-normal">Tends to be slow (constipation)</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="normal" /></FormControl><FormLabel className="font-normal">It's pretty regular and normal</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Section 5: Physical & Body */}
      <div className="space-y-4">
        <h4 className="font-semibold">💪 SECTION 5: Physical & Body</h4>
        <FormField
          control={form.control}
          name="anemia_history"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you have a history of iron deficiency or anemia?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="not_sure" /></FormControl><FormLabel className="font-normal">Not sure</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="low_nutrients"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Are you aware of any low nutrient levels (e.g., Vitamin D, B12)?</FormLabel>
              </div>
              {lowNutrientOptions.map((item) => (
                <FormItem
                  key={item.id}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(item.id)}
                      onCheckedChange={(checked) => {
                        const currentValue = field.value || [];
                        if (checked) {
                          if (item.id === 'not_sure') {
                            field.onChange(['not_sure']);
                          } else {
                            const newValue = currentValue.filter((v: string) => v !== 'not_sure');
                            field.onChange([...newValue, item.id]);
                          }
                        } else {
                          field.onChange(
                            currentValue.filter((value: string) => value !== item.id)
                          );
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {item.label}
                  </FormLabel>
                </FormItem>
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="joint_pain"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you experience frequent joint pain or stiffness?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="bruising_bleeding"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you bruise or bleed easily?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="belly_fat"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you have stubborn belly fat?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
} 