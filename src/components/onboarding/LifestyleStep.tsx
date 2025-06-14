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
      <div className="text-center">
        <h3 className="text-3xl font-bold text-dark-primary mb-3 tracking-tight">Lifestyle</h3>
        <p className="text-lg text-dark-secondary font-medium">
          Tell us a bit about your lifestyle.
        </p>
      </div>

      <FormField
        control={form.control}
        name="activity_level"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel className="text-lg font-semibold text-dark-primary">Your activity level (1 = sedentary, 5 = very active)</FormLabel>
            <FormControl>
                <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-5 gap-4"
                >
                  {["1","2","3","4","5"].map((val)=> (
                    <FormItem key={val} className="h-full">
                      <FormControl>
                        <label className={`group cursor-pointer flex items-center justify-center h-20 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${field.value===val ? 'border-dark-accent bg-dark-accent/10 shadow-lg':'border-dark-border bg-dark-background hover:border-dark-accent/50'}` }>
                          <RadioGroupItem value={val} className="hidden" />
                          <span className="text-2xl font-bold text-dark-primary group-hover:text-dark-primary select-none">{val}</span>
                        </label>
                      </FormControl>
                    </FormItem>
                  ))}
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
            <FormLabel className="text-lg font-semibold text-dark-primary">On average, how many hours do you sleep per night?</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="number" 
                  {...field} 
                  placeholder="e.g., 7" 
                  className="h-14 px-6 pr-14 text-lg bg-dark-background border-2 border-dark-border rounded-2xl focus:border-dark-accent focus:ring-4 focus:ring-dark-accent/20 transition-all duration-300 placeholder:text-dark-secondary/60 hover:border-dark-accent/50 text-dark-primary"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-secondary font-medium">hrs</span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="alcohol_intake"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel className="text-lg font-semibold text-dark-primary">How many alcoholic beverages do you consume per week?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  {val:'0',label:'0'},
                  {val:'1-2',label:'1 to 2'},
                  {val:'3-5',label:'3 to 5'},
                  {val:'6+',label:'6+'}
                ].map(({val,label})=>(
                  <FormItem key={val} className="h-full">
                    <FormControl>
                      <label className={`group cursor-pointer flex items-center justify-center h-14 rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${field.value===val?'border-dark-accent bg-dark-accent/10 shadow-md':'border-dark-border bg-dark-background hover:border-dark-accent/50'}` }>
                        <RadioGroupItem value={val} className="hidden" />
                        <span className="text-base font-semibold text-dark-primary group-hover:text-dark-primary select-none">{label}</span>
                      </label>
                    </FormControl>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 