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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Demographics</h3>
        <p className="text-sm text-muted-foreground">
          Tell us a little about yourself.
        </p>
      </div>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Jane Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="30" {...field} />
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
              <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FormLabel className="col-span-3">Height</FormLabel>
        <FormField
          control={form.control}
          name="height_ft"
          render={({ field }) => (
            <FormItem className="col-span-1">
               <FormControl>
                <div className="flex items-center">
                  <Input type="number" placeholder="5" {...field} className="rounded-r-none" />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-background text-sm">
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
            <FormItem className="col-span-1">
              <FormControl>
                <div className="flex items-center">
                  <Input type="number" placeholder="10" {...field} className="rounded-r-none" />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-background text-sm">
                    in
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
       <FormField
        control={form.control}
        name="weight_lbs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Weight (lbs)</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Input type="number" placeholder="150" {...field} className="rounded-r-none" />
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-background text-sm">
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