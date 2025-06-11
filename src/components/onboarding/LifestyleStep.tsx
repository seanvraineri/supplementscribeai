"use client";

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function LifestyleStep() {
  const form = useFormContext();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Lifestyle</h3>
        <p className="text-sm text-muted-foreground">
          Tell us a bit about your lifestyle.
        </p>
      </div>

      <FormField
        control={form.control}
        name="activity_level"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>On a scale of 1-5, how active are you? (1 = sedentary, 5 = very active)</FormLabel>
            <FormControl>
                <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="1" /></FormControl>
                        <FormLabel className="font-normal">1</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="2" /></FormControl>
                        <FormLabel className="font-normal">2</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="3" /></FormControl>
                        <FormLabel className="font-normal">3</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="4" /></FormControl>
                        <FormLabel className="font-normal">4</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="5" /></FormControl>
                        <FormLabel className="font-normal">5</FormLabel>
                    </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sleep_hours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>On average, how many hours do you sleep per night?</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="alcohol_intake"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>How many alcoholic beverages do you consume per week?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl><RadioGroupItem value="0" /></FormControl>
                  <FormLabel className="font-normal">0</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl><RadioGroupItem value="1-2" /></FormControl>
                  <FormLabel className="font-normal">1-2</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl><RadioGroupItem value="3-5" /></FormControl>
                  <FormLabel className="font-normal">3-5</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl><RadioGroupItem value="6+" /></FormControl>
                  <FormLabel className="font-normal">6+</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 