"use client";

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Heart, Brain, Zap } from 'lucide-react';

export function PrimaryHealthConcernStep() {
  const form = useFormContext();

  const exampleConcerns = [
    {
      icon: <Heart className="w-5 h-5 text-red-400" />,
      text: "My LDL cholesterol is 180 mg/dL and I'm worried about heart disease"
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      text: "My testosterone is only 250 ng/dL and I feel exhausted all the time"
    },
    {
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      text: "I have severe brain fog and memory issues, worried about early dementia"
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
      text: "Rapid hair loss and my doctor says my iron and B12 are borderline low"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-dark-accent/20 rounded-full">
            <AlertTriangle className="w-8 h-8 text-dark-accent" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-dark-primary mb-3 tracking-tight">
          What's Your Main Health Concern?
        </h3>
        <p className="text-lg text-dark-secondary font-medium max-w-2xl mx-auto">
          This is the <strong className="text-dark-accent">most important question</strong>. 
          Tell us your primary health concern so our AI never misses what matters most to you.
        </p>
      </div>

      {/* Examples Section */}
      <div className="bg-dark-background/50 border border-dark-border rounded-2xl p-6">
        <h4 className="text-sm font-semibold text-dark-primary mb-4 flex items-center">
          <span className="w-2 h-2 bg-dark-accent rounded-full mr-2"></span>
          Examples of what to include:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exampleConcerns.map((example, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-dark-panel/50 rounded-xl border border-dark-border/50">
              {example.icon}
              <p className="text-sm text-dark-secondary leading-relaxed">{example.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Input */}
      <FormField
        control={form.control}
        name="primary_health_concern"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-dark-primary tracking-wide">
              Describe Your Primary Health Concern <span className="text-red-400">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Textarea
                  placeholder="Example: My recent blood work shows my LDL cholesterol is 195 mg/dL (should be under 100) and my family has a history of heart disease. I'm also experiencing fatigue and want to address this naturally before considering medication..."
                  {...field}
                  className="min-h-[120px] p-6 text-base bg-dark-background border-2 border-dark-border rounded-2xl focus:border-dark-accent focus:ring-4 focus:ring-dark-accent/20 transition-all duration-300 placeholder:text-dark-secondary/60 hover:border-dark-accent/50 text-dark-primary resize-none"
                  maxLength={500}
                />
                <div className="absolute bottom-3 right-3 text-xs text-dark-secondary">
                  {field.value?.length || 0}/500
                </div>
              </div>
            </FormControl>
            <FormMessage />
            <div className="mt-2 text-sm text-dark-secondary">
              💡 <strong>Pro tip:</strong> Include specific lab values, symptoms, family history, or concerns. 
              The more specific you are, the better our AI can help you.
            </div>
          </FormItem>
        )}
      />

      {/* Importance Callout */}
      <div className="bg-gradient-to-r from-dark-accent/10 to-purple-500/10 border border-dark-accent/30 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-dark-accent/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-dark-accent" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-dark-primary mb-2">
              Why This Matters
            </h4>
            <p className="text-dark-secondary leading-relaxed">
              This ensures our AI prioritizes your specific concern above everything else when creating your supplement plan. 
              Even if our automated parsing misses something, <strong className="text-dark-accent">we'll never miss what you tell us here</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 