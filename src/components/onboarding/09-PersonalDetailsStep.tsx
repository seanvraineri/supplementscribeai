"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { motion } from 'framer-motion';
import { MapPin, Package } from 'lucide-react';

export function PersonalDetailsStep() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<OnboardingData>();
  const gender = watch('gender');
  const subscriptionTier = watch('subscription_tier');
  const fullName = watch('fullName');
  
  // Pre-fill shipping name with full name when it changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (subscriptionTier === 'full') {
      setValue('shipping_name', name, { shouldValidate: true });
    }
  };
  
  const needsShipping = subscriptionTier === 'full';
  
  return (
    <div className="space-y-6 w-full max-w-lg mx-auto text-left">
      {/* Personal Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-dark-secondary">Full Name</label>
            <input 
              {...register('fullName')}
              onChange={handleNameChange}
              placeholder="Your name"
              className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
            />
            {errors.fullName && (
              <p className="text-red-400 text-xs">{errors.fullName.message}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-dark-secondary">Age</label>
            <input 
              {...register('age')}
              type="number" 
              placeholder="Age" 
              className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
            />
            {errors.age && (
              <p className="text-red-400 text-xs">{errors.age.message}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-secondary">Gender</label>
          <div className="grid grid-cols-3 gap-2">
            {['male', 'female', 'other'].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setValue('gender', g, { shouldValidate: true, shouldDirty: true })}
                className={`py-2.5 rounded-lg border-2 transition-all text-sm font-medium
                  ${gender === g
                    ? 'bg-dark-accent/10 border-dark-accent text-dark-accent'
                    : 'bg-dark-panel border-dark-border text-dark-secondary hover:border-dark-border/70'
                  }`
                }
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
          {errors.gender && (
            <p className="text-red-400 text-xs">{errors.gender.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-dark-secondary">Height</label>
            <div className="flex items-center gap-2">
              <input 
                {...register('height_ft')}
                type="number" 
                placeholder="5" 
                className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
              />
              <span className="text-sm text-dark-secondary">ft</span>
            </div>
            {errors.height_ft && (
              <p className="text-red-400 text-xs">{errors.height_ft.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-dark-secondary">&nbsp;</label>
            <div className="flex items-center gap-2">
              <input 
                {...register('height_in')}
                type="number" 
                placeholder="8" 
                className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
              />
              <span className="text-sm text-dark-secondary">in</span>
            </div>
            {errors.height_in && (
              <p className="text-red-400 text-xs">{errors.height_in.message}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-dark-secondary">Weight</label>
          <div className="flex items-center gap-2">
            <input 
              {...register('weight_lbs')}
              type="number" 
              placeholder="150" 
              className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
            />
            <span className="text-sm text-dark-secondary">lbs</span>
          </div>
          {errors.weight_lbs && (
            <p className="text-red-400 text-xs">{errors.weight_lbs.message}</p>
          )}
        </div>
      </div>

      {/* Shipping Address (only for complete package) */}
      {needsShipping && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 pt-4 border-t border-dark-border">
            <Package className="w-5 h-5 text-dark-accent" />
            <h3 className="text-lg font-semibold text-dark-primary">Shipping Address</h3>
          </div>
          <p className="text-sm text-dark-secondary">
            📦 Your supplements will be delivered to this address monthly
          </p>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-dark-secondary">Full Name</label>
              <input 
                {...register('shipping_name')}
                placeholder="Name for delivery"
                className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
              />
              {errors.shipping_name && (
                <p className="text-red-400 text-xs">{errors.shipping_name.message}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-dark-secondary">Street Address</label>
              <input 
                {...register('shipping_address1')}
                placeholder="123 Main Street"
                className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
              />
              {errors.shipping_address1 && (
                <p className="text-red-400 text-xs">{errors.shipping_address1.message}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-dark-secondary">Apartment, Suite, etc. (Optional)</label>
              <input 
                {...register('shipping_address2')}
                placeholder="Apt 4B"
                className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-dark-secondary">City</label>
                <input 
                  {...register('shipping_city')}
                  placeholder="New York"
                  className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
                />
                {errors.shipping_city && (
                  <p className="text-red-400 text-xs">{errors.shipping_city.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-dark-secondary">State</label>
                <input 
                  {...register('shipping_state')}
                  placeholder="NY"
                  className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
                />
                {errors.shipping_state && (
                  <p className="text-red-400 text-xs">{errors.shipping_state.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-dark-secondary">ZIP Code</label>
                <input 
                  {...register('shipping_postal_code')}
                  placeholder="10001"
                  className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
                />
                {errors.shipping_postal_code && (
                  <p className="text-red-400 text-xs">{errors.shipping_postal_code.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-dark-secondary">Country</label>
                <div className="grid grid-cols-1 gap-2">
                  {['US', 'CA'].map(country => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => setValue('shipping_country', country, { shouldValidate: true, shouldDirty: true })}
                      className={`py-2.5 rounded-lg border-2 transition-all text-sm font-medium
                        ${watch('shipping_country') === country
                          ? 'bg-dark-accent/10 border-dark-accent text-dark-accent'
                          : 'bg-dark-panel border-dark-border text-dark-secondary hover:border-dark-border/70'
                        }`
                      }
                    >
                      {country === 'US' ? 'United States' : 'Canada'}
                    </button>
                  ))}
                </div>
                {errors.shipping_country && (
                  <p className="text-red-400 text-xs">{errors.shipping_country.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-dark-secondary">Phone Number (Optional)</label>
              <input 
                {...register('shipping_phone')}
                type="tel"
                placeholder="(555) 123-4567"
                className="w-full px-4 py-2.5 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all"
              />
              <p className="text-xs text-dark-secondary">
                For delivery notifications and updates
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="!mt-6 bg-dark-panel/50 border border-dark-border rounded-lg p-3">
        <p className="text-dark-secondary text-sm font-medium text-center">
          {needsShipping 
            ? "Personal details used for precise dosage calculations. Shipping address used for supplement delivery."
            : "Used for precise dosage calculations."
          }
        </p>
      </div>
    </div>
  );
} 