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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DemographicsStep() {
  const form = useFormContext();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-dark-primary mb-3 tracking-tight">Tell us about yourself</h3>
        <p className="text-lg text-dark-secondary font-medium">
          This helps us create your personalized supplement plan
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-dark-primary tracking-wide">Full Name</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  placeholder="Enter your full name" 
                  {...field} 
                  className="h-14 px-6 text-lg bg-dark-background border-2 border-dark-border rounded-2xl focus:border-dark-accent focus:ring-4 focus:ring-dark-accent/20 transition-all duration-300 placeholder:text-dark-secondary/60 hover:border-dark-accent/50 text-dark-primary"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-dark-primary tracking-wide">Age</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="25" 
                    {...field} 
                    className="h-14 px-6 text-lg bg-dark-background border-2 border-dark-border rounded-2xl focus:border-dark-accent focus:ring-4 focus:ring-dark-accent/20 transition-all duration-300 placeholder:text-dark-secondary/60 hover:border-dark-accent/50 text-dark-primary"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-dark-primary tracking-wide">Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-14 px-6 text-lg bg-dark-background border-2 border-dark-border rounded-2xl focus:border-dark-accent focus:ring-4 focus:ring-dark-accent/20 transition-all duration-300 hover:border-dark-accent/50 text-dark-primary">
                    <SelectValue placeholder="Select gender" className="text-dark-secondary/60" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-dark-panel border-dark-border">
                  <SelectItem value="male" className="text-dark-primary hover:bg-dark-border">Male</SelectItem>
                  <SelectItem value="female" className="text-dark-primary hover:bg-dark-border">Female</SelectItem>
                  <SelectItem value="other" className="text-dark-primary hover:bg-dark-border">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say" className="text-dark-primary hover:bg-dark-border">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div>
        <FormLabel className="text-base font-semibold text-dark-primary tracking-wide mb-4 block">Height</FormLabel>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="height_ft"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="number" 
                      placeholder="5" 
                      {...field} 
                      className="h-14 px-6 pr-12 text-lg bg-dark-background border-2 border-dark-border rounded-2xl focus:border-dark-accent focus:ring-4 focus:ring-dark-accent/20 transition-all duration-300 placeholder:text-dark-secondary/60 hover:border-dark-accent/50 text-dark-primary"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-secondary font-medium">
                      ft
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height_in"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="number" 
                      placeholder="10" 
                      {...field} 
                      className="h-14 px-6 pr-12 text-lg bg-dark-background border-2 border-dark-border rounded-2xl focus:border-dark-accent focus:ring-4 focus:ring-dark-accent/20 transition-all duration-300 placeholder:text-dark-secondary/60 hover:border-dark-accent/50 text-dark-primary"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-secondary font-medium">
                      in
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="weight_lbs"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-dark-primary tracking-wide">Weight</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="150" 
                  {...field} 
                  className="h-14 px-6 pr-16 text-lg bg-dark-background border-2 border-dark-border rounded-2xl focus:border-dark-accent focus:ring-4 focus:ring-dark-accent/20 transition-all duration-300 placeholder:text-dark-secondary/60 hover:border-dark-accent/50 text-dark-primary"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-secondary font-medium">
                  lbs
                </span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 