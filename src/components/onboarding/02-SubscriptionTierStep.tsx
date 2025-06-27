"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { motion } from 'framer-motion';
import { Package, Brain, CheckCircle, Truck, CreditCard } from 'lucide-react';

interface SubscriptionTierStepProps {
  onNext: () => void;
}

const SUBSCRIPTION_TIERS = [
  {
    value: 'full',
    title: 'Complete Package',
    subtitle: 'Software + Monthly Supplements',
    price: '$75',
    period: '/month',
    icon: Package,
    features: [
      'Personalized supplement recommendations',
      'Monthly supplement delivery',
      'Continuous plan optimization',
      'Progress tracking & analytics',
      'Priority support'
    ],
    description: 'Everything you need for optimal health',
    gradient: 'from-dark-accent/20 to-blue-500/20',
    recommended: true
  },
  {
    value: 'software_only',
    title: 'Software Only',
    subtitle: 'Just the Intelligence',
    price: '$9.99',
    originalPrice: '$19.99',
    period: 'first month',
    regularPeriod: 'then $19.99/month',
    icon: Brain,
    features: [
      'Personalized supplement recommendations',
      'Progress tracking & analytics',
      'Plan optimization',
      'Health insights',
      'Standard support'
    ],
    description: '50% off first month • Cancel anytime',
    gradient: 'from-gray-500/20 to-slate-500/20',
    recommended: false,
    hasIntroPrice: true
  }
];

export function SubscriptionTierStep({ onNext }: SubscriptionTierStepProps) {
  const form = useFormContext<OnboardingData>();
  const selectedTier = form.watch('subscription_tier');
  
  const handleSelect = (tier: string) => {
    form.setValue('subscription_tier', tier, { shouldValidate: true, shouldDirty: true });
    setTimeout(() => onNext(), 400);
  };
  
  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Tier Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {SUBSCRIPTION_TIERS.map((tier, index) => {
          const isSelected = selectedTier === tier.value;
          const IconComponent = tier.icon;
          
          return (
            <motion.div
              key={tier.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
              className="relative"
            >
              {/* Recommended Badge */}
              {tier.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-dark-accent text-dark-background px-4 py-1 rounded-full text-sm font-semibold">
                    Recommended
                  </span>
                </div>
              )}
              
              <motion.button
                type="button"
                onClick={() => handleSelect(tier.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden
                  ${isSelected
                    ? 'bg-dark-panel border-dark-accent shadow-lg shadow-dark-accent/20'
                    : 'bg-dark-panel border-dark-border hover:border-dark-border/70 hover:shadow-lg'
                  }`
                }
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-50`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-dark-accent/20' : 'bg-dark-border/50'}`}>
                        <IconComponent className={`w-6 h-6 ${isSelected ? 'text-dark-accent' : 'text-dark-secondary'}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-dark-primary">
                          {tier.title}
                        </h3>
                        <p className="text-sm text-dark-secondary">
                          {tier.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-dark-accent rounded-full p-1"
                      >
                        <CheckCircle className="w-5 h-5 text-dark-background" />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="mb-4">
                    {tier.hasIntroPrice ? (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg text-dark-secondary line-through">{tier.originalPrice}</span>
                          <span className="text-3xl font-bold text-green-400">{tier.price}</span>
                          <span className="text-sm text-dark-secondary">{tier.period}</span>
                        </div>
                        <div className="text-sm text-dark-primary mb-1">{tier.regularPeriod}</div>
                      </>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-dark-primary">{tier.price}</span>
                        <span className="text-dark-secondary">{tier.period}</span>
                      </div>
                    )}
                    <p className="text-sm text-dark-secondary mt-1">{tier.description}</p>
                  </div>
                  
                  {/* Features */}
                  <div className="space-y-2">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-dark-accent' : 'text-dark-secondary'}`} />
                        <span className="text-sm text-dark-primary">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Additional Info for Software Only */}
                  {tier.value === 'software_only' && (
                    <div className="mt-4 space-y-3">
                      <div className="p-3 bg-dark-background/50 rounded-lg">
                        <p className="text-xs text-dark-secondary">
                          💡 You'll get the same personalized recommendations - just source your own supplements
                        </p>
                      </div>
                      <div className="p-3 bg-dark-accent/10 border border-dark-accent/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-dark-primary">Add Monthly Supplements</p>
                            <p className="text-xs text-dark-secondary">Upgrade anytime from your dashboard</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-dark-accent">+$75/month</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>
      
      {/* Bottom Note */}
      <div className="text-center mt-6">
        <p className="text-sm text-dark-secondary">
          You can upgrade or downgrade your plan anytime from your dashboard
        </p>
      </div>
    </div>
  );
} 