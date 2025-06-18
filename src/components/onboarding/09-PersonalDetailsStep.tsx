"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';

export function PersonalDetailsStep() {
  const form = useFormContext<OnboardingData>();
  
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {/* Name & Age */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input 
              {...form.register('fullName')}
              placeholder="Your name"
              className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-500" 
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Age</label>
            <input 
              {...form.register('age')}
              type="number" 
              placeholder="Age" 
              className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-500" 
            />
          </div>
        </div>
        
        {/* Gender */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Gender</label>
          <div className="grid grid-cols-3 gap-2">
            {['male', 'female', 'other'].map(gender => (
              <button
                key={gender}
                type="button"
                onClick={() => form.setValue('gender', gender as any)}
                className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                  form.watch('gender') === gender
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Height */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Height</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <input 
                {...form.register('height_ft')}
                type="number" 
                placeholder="5" 
                className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-500" 
              />
              <span className="text-sm text-gray-500">ft</span>
            </div>
            <div className="flex items-center gap-2">
              <input 
                {...form.register('height_in')}
                type="number" 
                placeholder="8" 
                className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-500" 
              />
              <span className="text-sm text-gray-500">in</span>
            </div>
          </div>
        </div>
        
        {/* Weight */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Weight</label>
          <div className="flex items-center gap-2">
            <input 
              {...form.register('weight_lbs')}
              type="number" 
              placeholder="150" 
              className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-500" 
            />
            <span className="text-sm text-gray-500">lbs</span>
          </div>
        </div>
      </div>
      
      {/* Compact Info */}
      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
        <p className="text-green-700 text-sm font-medium">
          ✓ Used for precise dosage calculations
        </p>
      </div>
    </div>
  );
} 