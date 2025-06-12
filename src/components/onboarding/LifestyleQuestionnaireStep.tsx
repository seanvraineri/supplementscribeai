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
import React, { useEffect } from 'react';

const lowNutrientOptions = [
  { id: "vitamin_d", label: "Vitamin D" },
  { id: "magnesium", label: "Magnesium" },
  { id: "b12", label: "B12" },
  { id: "not_sure", label: "Not sure" },
];

/** Reusable card radio group with auto-scroll */
interface CardOption { value:string; label:string }
interface CardRadioProps { fieldName: keyof OnboardingData; options: CardOption[]; question: string; stepId: string }

function CardRadioGroup({ fieldName, options, question, stepId }: CardRadioProps) {
  const form = useFormContext<OnboardingData>();
  const field = form.register(fieldName as any);
  const current = form.watch(fieldName as any);

  const handleSelect = (val:string)=>{
    form.setValue(fieldName as any,val,{shouldDirty:true, shouldValidate:true});
    const next = document.querySelector(`[data-step="${stepId}"]`)?.nextElementSibling as HTMLElement | null;
    if(next){
      setTimeout(()=> next.scrollIntoView({behavior:'smooth',block:'center'}),100);
    }
  };

  return (
    <div className="space-y-6" data-step={stepId}>
      <FormLabel className="text-lg font-semibold text-gray-800">{question}</FormLabel>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {options.map(opt=>{
          const selected = current===opt.value;
          return (
            <button type="button" key={opt.value} onClick={()=>handleSelect(opt.value)}
              className={`group w-full flex items-center justify-center h-16 rounded-2xl border-2 transition-all duration-300 text-center px-4 leading-snug ${selected?'border-[#86A8E7] bg-gradient-to-br from-[#86A8E7]/10 to-[#C29FFF]/10 shadow-md':'border-gray-200 bg-white/60 hover:border-gray-300'}`}> 
              <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 select-none">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LifestyleQuestionnaireStep() {
  const form = useFormContext<OnboardingData>();

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Lifestyle Assessment</h3>
        <p className="text-lg text-gray-600 font-light">
          This helps us create a more precise supplement plan for you
        </p>
      </div>

      {/* ENERGY LEVELS CARD GROUP */}
      <CardRadioGroup 
        fieldName="energy_levels" 
        question="How would you describe your daily energy levels?" 
        stepId="q-energy" 
        options={[
          { value:'low',label:'Low all day'},
          { value:'crash',label:'Morning ok, afternoon crash'},
          { value:'consistent',label:'Pretty consistent'},
          { value:'high',label:'High most of the time'},
        ]}
      />

      <CardRadioGroup 
        fieldName="effort_fatigue" 
        question="Do you feel physically or mentally wiped after moderate effort?" 
        stepId="q-fatigue" 
        options={[
          {value:'often',label:'Yes, often'},
          {value:'sometimes',label:'Sometimes'},
          {value:'rarely',label:'Rarely'},
          {value:'no',label:'No'},
        ]}
      />

      <CardRadioGroup 
        fieldName="caffeine_effect" 
        question="Do you feel better after caffeine or stimulants?" 
        stepId="q-caffeine" 
        options={[
          {value:'yes',label:'Yes — noticeably'},
          {value:'somewhat',label:'Somewhat'},
          {value:'no_difference',label:'No difference'},
          {value:'no_caffeine',label:"I don't consume caffeine"},
        ]}
      />

      {/* Mood, Focus, Stress */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="brain_fog"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you struggle with brain fog or difficulty concentrating?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'all_the_time', label: 'All the time' },
                    { value: 'occasionally', label: 'Occasionally' },
                    { value: 'rarely', label: 'Rarely' },
                    { value: 'never', label: 'Never' }
                  ].map(opt => (
                    <FormItem key={opt.value} className="h-full">
                      <FormControl>
                        <label className={`group cursor-pointer flex items-center justify-center h-16 rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${field.value===opt.value ? 'border-[#86A8E7] bg-gradient-to-br from-[#86A8E7]/10 to-[#C29FFF]/10 shadow-md' : 'border-gray-200 bg-white/60 hover:border-gray-300'}` }>
                          <RadioGroupItem value={opt.value} className="hidden" />
                          <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 select-none text-center px-2 leading-snug">{opt.label}</span>
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
        <CardRadioGroup
          fieldName="anxiety_level"
          question="Do you often feel anxious or overwhelmed without clear reason?"
          stepId="q-anxiety"
          options={[{value:'yes',label:'Yes'},{value:'sometimes',label:'Sometimes'},{value:'no',label:'No'}]}
        />
        <CardRadioGroup
          fieldName="stress_resilience"
          question="How well do you handle stress?"
          stepId="q-stress"
          options={[
            {value:'poorly',label:'Overwhelmed easily'},
            {value:'average',label:'Average'},
            {value:'well',label:'Resilient to stress'},
          ]}
        />
      </div>

      {/* Sleep */}
      <div className="space-y-4">
        <CardRadioGroup
          fieldName="sleep_quality"
          question="How would you rate your sleep quality?"
          stepId="q-sleep"
          options={[
            {value:'poor',label:'Poor'},
            {value:'average',label:'Average'},
            {value:'good',label:'Good'},
          ]}
        />
        <CardRadioGroup
          fieldName="sleep_aids"
          question="Do you use any aids to help you sleep?"
          stepId="q-sleepaids"
          options={[{value:'yes',label:'Yes'}, {value:'sometimes',label:'Sometimes'}, {value:'no',label:'No'}]}
        />
      </div>

      {/* Digestion & Gut Health */}
      <div className="space-y-4">
        <CardRadioGroup
          fieldName="bloating"
          question="Do you experience frequent bloating or gas after meals?"
          stepId="q-bloating"
          options={[{value:'often',label:'Often'},{value:'sometimes',label:'Sometimes'},{value:'rarely',label:'Rarely or never'}]}
        />
        <CardRadioGroup
          fieldName="digestion_speed"
          question="How would you describe your digestion speed?"
          stepId="q-digestion"
          options={[{value:'fast',label:'Fast'},{value:'slow',label:'Slow'},{value:'normal',label:'Normal'}]}
        />
      </div>

      {/* Physical & Body */}
      <div className="space-y-4">
        <CardRadioGroup
          fieldName="anemia_history"
          question="Do you have a history of iron deficiency or anemia?"
          stepId="q-anemia"
          options={[{value:'yes',label:'Yes'},{value:'no',label:'No'},{value:'not_sure',label:'Not sure'}]}
        />
        
        <FormField
          control={form.control}
          name="low_nutrients"
          render={({ field }) => (
            <FormItem className="space-y-6">
              <FormLabel className="text-lg font-semibold text-gray-800">Are you aware of any low nutrient levels (e.g., Vitamin D, B12)?</FormLabel>
              <div className="flex flex-wrap gap-3">
                {lowNutrientOptions.map(opt=>{
                  const selected = field.value?.includes(opt.id);
                  const handleClick = () => {
                    const current = field.value||[];
                    if(selected){
                      field.onChange(current.filter((v:string)=>v!==opt.id));
                    } else {
                      if(opt.id==='not_sure'){
                        field.onChange(['not_sure']);
                      } else {
                        const newVals = current.filter((v:string)=>v!=='not_sure');
                        field.onChange([...newVals,opt.id]);
                      }
                    }
                  };
                  return (
                    <button key={opt.id} type="button" onClick={handleClick}
                      className={`px-5 py-3 rounded-full border-2 transition-all duration-300 text-sm font-medium select-none ${selected?'border-[#7DE1F4] bg-gradient-to-br from-[#7DE1F4]/10 to-[#86A8E7]/10 shadow':'border-gray-200 bg-white/60 hover:border-gray-300'}`}> 
                      {opt.label}
                    </button>
                  )
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <CardRadioGroup
          fieldName="joint_pain"
          question="Do you experience frequent joint pain or stiffness?"
          stepId="q-joint"
          options={[{value:'yes',label:'Yes'},{value:'no',label:'No'}]}
        />
         <CardRadioGroup
          fieldName="bruising_bleeding"
          question="Do you bruise or bleed easily?"
          stepId="q-bruise"
          options={[{value:'yes',label:'Yes'},{value:'no',label:'No'}]}
        />
         <CardRadioGroup
          fieldName="belly_fat"
          question="Do you have stubborn belly fat?"
          stepId="q-belly"
          options={[{value:'yes',label:'Yes'},{value:'no',label:'No'}]}
        />
      </div>
    </div>
  );
} 