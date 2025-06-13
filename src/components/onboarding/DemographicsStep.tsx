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
        <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Tell us about yourself</h3>
        <p className="text-lg text-gray-600 font-light">
          This helps us create your personalized supplement plan
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-gray-700 tracking-wide">Full Name</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  placeholder="Enter your full name" 
                  {...field} 
                  className="h-14 px-6 text-lg bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-[#7DE1F4] focus:ring-4 focus:ring-[#7DE1F4]/20 transition-all duration-300 placeholder:text-gray-400 hover:border-gray-300 text-gray-900"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7DE1F4]/5 to-[#86A8E7]/5 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
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
              <FormLabel className="text-base font-semibold text-gray-700 tracking-wide">Age</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="25" 
                    {...field} 
                    className="h-14 px-6 text-lg bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-[#7DE1F4] focus:ring-4 focus:ring-[#7DE1F4]/20 transition-all duration-300 placeholder:text-gray-400 hover:border-gray-300 text-gray-900"
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
              <FormLabel className="text-base font-semibold text-gray-700 tracking-wide">Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-14 px-6 text-lg bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-[#7DE1F4] focus:ring-4 focus:ring-[#7DE1F4]/20 transition-all duration-300 hover:border-gray-300">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-2xl">
                    <SelectItem value="male" className="rounded-xl hover:bg-blue-50 focus:bg-blue-50 py-3 px-4 text-base">Male</SelectItem>
                    <SelectItem value="female" className="rounded-xl hover:bg-blue-50 focus:bg-blue-50 py-3 px-4 text-base">Female</SelectItem>
                    <SelectItem value="other" className="rounded-xl hover:bg-blue-50 focus:bg-blue-50 py-3 px-4 text-base">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say" className="rounded-xl hover:bg-blue-50 focus:bg-blue-50 py-3 px-4 text-base">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-6">
        <FormLabel className="text-base font-semibold text-gray-700 tracking-wide">Height</FormLabel>
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
                      className="h-14 px-6 pr-12 text-lg bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-[#7DE1F4] focus:ring-4 focus:ring-[#7DE1F4]/20 transition-all duration-300 placeholder:text-gray-400 hover:border-gray-300 text-gray-900"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
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
                      className="h-14 px-6 pr-12 text-lg bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-[#7DE1F4] focus:ring-4 focus:ring-[#7DE1F4]/20 transition-all duration-300 placeholder:text-gray-400 hover:border-gray-300 text-gray-900"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
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
            <FormLabel className="text-base font-semibold text-gray-700 tracking-wide">Weight</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="150" 
                  {...field} 
                  className="h-14 px-6 pr-16 text-lg bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-[#7DE1F4] focus:ring-4 focus:ring-[#7DE1F4]/20 transition-all duration-300 placeholder:text-gray-400 hover:border-gray-300 text-gray-900"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
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