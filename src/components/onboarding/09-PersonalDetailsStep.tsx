"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { motion } from 'framer-motion';
import { MapPin, Package, User } from 'lucide-react';

export function PersonalDetailsStep() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<OnboardingData>();
  const gender = watch('gender');
  const subscriptionTier = watch('subscription_tier');
  const fullName = watch('fullName');
  
  // Pre-fill shipping name with full name when it changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('shipping_name', name, { shouldValidate: true });
  };
  
  const needsShipping = true; // Collect address for ALL users to enable upselling
  
  return (
    <div className="space-y-8 w-full max-w-2xl mx-auto text-left px-4 sm:px-0">
      {/* Personal Details Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-dark-border">
          <User className="w-5 h-5 text-dark-accent" />
          <h3 className="text-lg font-semibold text-dark-primary">Personal Information</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-secondary">Full Name</label>
              <input 
                {...register('fullName')}
                onChange={handleNameChange}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all text-base"
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs">{errors.fullName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-secondary">Age</label>
              <input 
                {...register('age')}
                type="number" 
                placeholder="Age" 
                className="w-full px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all text-base"
              />
              {errors.age && (
                <p className="text-red-400 text-xs">{errors.age.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-dark-secondary">Gender</label>
            <div className="grid grid-cols-3 gap-3">
              {['male', 'female', 'other'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setValue('gender', g, { shouldValidate: true, shouldDirty: true })}
                  className={`py-3 rounded-lg border-2 transition-all text-sm font-medium min-h-[44px]
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-secondary">Height</label>
              <div className="flex items-center gap-2">
                <input 
                  {...register('height_ft')}
                  type="number" 
                  placeholder="5" 
                  className="w-full px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all text-base"
                />
                <span className="text-sm text-dark-secondary">ft</span>
              </div>
              {errors.height_ft && (
                <p className="text-red-400 text-xs">{errors.height_ft.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-secondary">&nbsp;</label>
              <div className="flex items-center gap-2">
                <input 
                  {...register('height_in')}
                  type="number" 
                  placeholder="8" 
                  className="w-full px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all text-base"
                />
                <span className="text-sm text-dark-secondary">in</span>
              </div>
              {errors.height_in && (
                <p className="text-red-400 text-xs">{errors.height_in.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-secondary">Weight</label>
            <div className="flex items-center gap-2">
              <input 
                {...register('weight_lbs')}
                type="number" 
                placeholder="150" 
                className="w-full px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all text-base"
              />
              <span className="text-sm text-dark-secondary">lbs</span>
            </div>
            {errors.weight_lbs && (
              <p className="text-red-400 text-xs">{errors.weight_lbs.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Address Section */}
      {needsShipping && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-dark-border">
            <Package className="w-5 h-5 text-dark-accent" />
            <h3 className="text-lg font-semibold text-dark-primary">Shipping Address</h3>
          </div>
          
          <div className="bg-dark-panel/30 p-4 rounded-lg border border-dark-border">
            <p className="text-sm text-dark-secondary">
              {subscriptionTier === 'full' 
                ? "📦 Your supplements will be delivered to this address monthly"
                : "📍 We'll save this for future supplement delivery if you upgrade"
              }
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-secondary">Full Name</label>
              <input 
                {...register('shipping_name')}
                placeholder="Name for delivery"
                className="w-full px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all text-base"
              />
              {errors.shipping_name && (
                <p className="text-red-400 text-xs">{errors.shipping_name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-secondary">Street Address</label>
              <input 
                {...register('shipping_address_line1')}
                placeholder="123 Main Street"
                className="w-full px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all text-base"
              />
              {errors.shipping_address_line1 && (
                <p className="text-red-400 text-xs">{errors.shipping_address_line1.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-secondary">Apartment, Suite, etc. (Optional)</label>
              <input 
                {...register('shipping_address_line2')}
                placeholder="Apt 4B"
                className="w-full px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all text-base"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-secondary">City</label>
                <input 
                  {...register('shipping_city')}
                  placeholder="New York"
                  className="w-full px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all text-base"
                />
                {errors.shipping_city && (
                  <p className="text-red-400 text-xs">{errors.shipping_city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-secondary">State</label>
                <input 
                  {...register('shipping_state')}
                  placeholder="NY"
                  className="w-full px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all text-base"
                />
                {errors.shipping_state && (
                  <p className="text-red-400 text-xs">{errors.shipping_state.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-secondary">ZIP Code</label>
                <input 
                  {...register('shipping_postal_code')}
                  placeholder="10001"
                  className="w-full px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all text-base"
                />
                {errors.shipping_postal_code && (
                  <p className="text-red-400 text-xs">{errors.shipping_postal_code.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-secondary">Country</label>
                <select
                  {...register('shipping_country')}
                  defaultValue="US"
                  className="w-full px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all text-base appearance-none cursor-pointer"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                </select>
                {errors.shipping_country && (
                  <p className="text-red-400 text-xs">{errors.shipping_country.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-secondary">Phone Number *</label>
              <div className="relative">
                <input 
                  {...register('shipping_phone')}
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 bg-dark-panel border-2 border-dark-border rounded-lg placeholder:text-dark-secondary/60 focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/30 transition-all text-base"
                />
              </div>
              {errors.shipping_phone && (
                <p className="text-red-400 text-xs">{errors.shipping_phone.message}</p>
              )}
              <p className="text-xs text-dark-secondary">
                Required for delivery notifications and updates
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="bg-dark-panel/50 border border-dark-border rounded-lg p-4">
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