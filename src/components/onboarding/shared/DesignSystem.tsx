"use client";

import { ReactNode } from 'react';

// Custom SVG Icons (Premium, not emoji)
export const Icons = {
  Energy: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Brain: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v15A2.5 2.5 0 0 0 9.5 22h5a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 14.5 2h-5z" stroke="currentColor" strokeWidth="2"/>
      <path d="m9 9 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Sleep: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Wellness: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Digestion: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" stroke="currentColor" strokeWidth="2"/>
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Athletic: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.5 12L11 7.5L16.5 13L22 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 19h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Longevity: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Weight: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12h18m-9-9v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Custom: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  // Activity Level Icons
  Sedentary: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 20h18M7 20V10l3-3V4h4v3l3 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  LightlyActive: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8V4l-4-2-4 2v4M8 14l4 2 4-2M12 22v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ModeratelyActive: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 2l8 4v8l-8 4-8-4V6l8-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  VeryActive: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ExtremelyActive: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.5 12L11 7.5L16.5 13L22 7.5M2 19h20M12 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // Sleep Icons
  Sleep5: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Sleep6: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 9v3l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Sleep7: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
    </svg>
  ),
  Sleep8: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  Sleep9: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 8h8v8H8z" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  // Alcohol Icons
  Never: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="m15 9-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Rarely: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12V7a7 7 0 0 1 14 0v5M9 21h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Occasionally: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12V7a7 7 0 0 1 14 0v5M3 12h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Moderately: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12V7a7 7 0 0 1 14 0v5M3 12h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7zM12 15v2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Regularly: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12V7a7 7 0 0 1 14 0v5M3 12h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7zM8 15v2M12 15v2M16 15v2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// Premium Button Component
interface PremiumButtonProps {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'none';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  autoAdvance?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
}

export function PremiumButton({ 
  children, 
  onClick, 
  selected = false, 
  variant = 'primary',
  size = 'md',
  className = '',
  autoAdvance = false,
  icon,
  disabled = false
}: PremiumButtonProps) {
  const baseStyles = "group relative overflow-hidden transition-all duration-300 ease-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  
  const variants = {
    primary: selected 
      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-2 border-transparent shadow-lg shadow-blue-500/25" 
      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md",
    secondary: selected
      ? "bg-gradient-to-r from-green-500 to-teal-600 text-white border-2 border-transparent shadow-lg shadow-green-500/25"
      : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-green-300 hover:shadow-md",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-transparent shadow-lg hover:shadow-xl",
    none: "bg-gradient-to-r from-orange-500 to-red-500 text-white border-2 border-transparent shadow-lg hover:shadow-xl"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-4 text-base rounded-xl",
    lg: "px-8 py-6 text-lg rounded-2xl"
  };
  
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    if (autoAdvance) {
      // Add small delay for visual feedback before auto-advance
      setTimeout(() => {
        const nextButton = document.querySelector('[data-next-step]') as HTMLButtonElement;
        nextButton?.click();
      }, 800);
    }
  };
  
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      <div className="relative flex items-center justify-center gap-3">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="font-semibold">{children}</span>
        {selected && <Icons.Check />}
      </div>
    </button>
  );
}

// Premium Input Component
interface PremiumInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  onEnter?: () => void;
  className?: string;
  maxLength?: number;
}

export function PremiumInput({ 
  value, 
  onChange, 
  placeholder, 
  label, 
  onEnter,
  className = '',
  maxLength
}: PremiumInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-lg font-semibold text-gray-800">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          onKeyPress={(e) => e.key === 'Enter' && onEnter?.()}
          className={`w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${className}`}
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-200"></div>
      </div>
    </div>
  );
}

// Premium Tag Component
interface PremiumTagProps {
  children: ReactNode;
  onRemove?: () => void;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

export function PremiumTag({ children, onRemove, color = 'blue' }: PremiumTagProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };
  
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${colors[color]} transition-all duration-200 hover:shadow-sm`}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-current hover:text-red-600 transition-colors duration-200"
        >
          <Icons.X />
        </button>
      )}
    </span>
  );
}

// Progress Dots Component
interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  return (
    <div className="flex justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i < currentStep 
              ? 'bg-green-500 w-6' 
              : i === currentStep 
                ? 'bg-blue-500 w-4' 
                : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

// Step Container Component
interface StepContainerProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
}

export function StepContainer({ 
  children, 
  title, 
  subtitle, 
  currentStep, 
  totalSteps,
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  showBack = true
}: StepContainerProps) {
  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Progress Dots - More Compact */}
      <div className="flex-shrink-0 pt-4 pb-2">
        <ProgressDots currentStep={currentStep} totalSteps={totalSteps} />
      </div>
      
      {/* Title Section - More Compact */}
      <div className="flex-shrink-0 text-center px-4 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{title}</h1>
        {subtitle && (
          <p className="text-base text-gray-600">{subtitle}</p>
        )}
      </div>
      
      {/* Content Area - Fixed Height with Better Spacing */}
      <div className="flex-1 px-4 flex items-start justify-center min-h-0">
        <div className="w-full max-w-2xl h-full flex flex-col">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100 flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
      
      {/* Navigation - More Compact */}
      <div className="flex-shrink-0 px-4 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          {onNext && (
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
                !nextDisabled
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {nextLabel}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}