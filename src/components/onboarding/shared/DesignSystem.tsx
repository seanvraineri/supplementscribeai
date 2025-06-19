"use client";

import React, { ReactNode, ComponentType } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Custom SVG Icons (Premium, not emoji)
const IconWrapper = (IconComponent: ComponentType<React.SVGProps<SVGSVGElement>>) => {
  const WrappedIcon = ({ className, ...props }: { className?: string } & React.SVGProps<SVGSVGElement>) => (
    <IconComponent className={`w-6 h-6 ${className}`} {...props} />
  );
  WrappedIcon.displayName = `IconWrapper(${IconComponent.displayName || IconComponent.name || 'Component'})`;
  return WrappedIcon;
};

export const Icons = {
  Energy: IconWrapper((props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M13 3L7 14h7l-1 8 6-11H9l1-8z"/></svg>
  )),
  Brain: IconWrapper((props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.5 2A2.5 2.5 0 0112 4.5v1a2.5 2.5 0 01-2.5 2.5h-1A2.5 2.5 0 016 5.5v-1A2.5 2.5 0 018.5 2h1zM14.5 2A2.5 2.5 0 0117 4.5v1a2.5 2.5 0 01-2.5 2.5h-1A2.5 2.5 0 0111 5.5v-1A2.5 2.5 0 0113.5 2h1zM6 10a2.5 2.5 0 00-2.5 2.5v4A2.5 2.5 0 006 19h12a2.5 2.5 0 002.5-2.5v-4A2.5 2.5 0 0018 10h-1a2.5 2.5 0 01-2.5-2.5v-1A2.5 2.5 0 0012 4a2.5 2.5 0 00-2.5 2.5v1A2.5 2.5 0 017 10H6z"/></svg>
  )),
  Sleep: IconWrapper((props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
  )),
  Wellness: IconWrapper((props) => (
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
  )),
  Digestion: IconWrapper((props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
  )),
  Athletic: IconWrapper((props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  )),
  Longevity: IconWrapper((props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6v6l4 2"/></svg>
  )),
  Weight: IconWrapper((props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 8v8m-4-4h8"/></svg>
  )),
  Custom: IconWrapper((props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
  )),
  Check: IconWrapper((props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6L9 17l-5-5"/></svg>
  )),
  X: IconWrapper((props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6L6 18M6 6l12 12"/></svg>
  )),
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
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isLastStep?: boolean;
  showNextButton?: boolean;
}

export function StepContainer({ 
  children, 
  title, 
  subtitle, 
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  isLastStep = false,
  showNextButton = true
}: StepContainerProps) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-1 flex items-center justify-center pt-24 pb-24 px-6">
        <div className="w-full max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold text-dark-primary mb-2">{title}</h2>
            {subtitle && <p className="text-base text-dark-secondary mb-8">{subtitle}</p>}
          </motion.div>
          {children}
        </div>
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 p-6 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-4 py-2 text-dark-secondary hover:text-dark-primary transition-colors rounded-md hover:bg-dark-panel"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
            </div>
            
            <div>
            {showNextButton && onNext && (
              <button
                onClick={onNext}
                disabled={nextDisabled}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105
                  ${!nextDisabled
                    ? 'bg-dark-accent text-dark-background shadow-lg hover:shadow-cyan-500/50'
                    : 'bg-dark-panel text-dark-secondary cursor-not-allowed'
                  }`
                }
              >
                {nextLabel}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </button>
            )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}