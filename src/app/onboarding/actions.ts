'use server';

import { createClient } from '@/lib/supabase/server';
import { onboardingSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateReferralCode } from '@/lib/referral-utils';
import { logger } from '@/lib/logger';

export async function saveOnboardingData(formData: unknown) {
  try {
    logger.step('Saving onboarding data');
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to submit this form.',
      };
    }

    const result = onboardingSchema.safeParse(formData);

    if (!result.success) {
      logger.error('Form validation failed', { errors: result.error.flatten() });
      return { success: false, error: 'Invalid form data provided.' };
    }

    const {
      fullName,
      age,
      gender,
      height_ft,
      height_in,
      weight_lbs,
      healthGoals,
      customHealthGoal,
      subscription_tier,
      // Shipping Address Fields - CRITICAL for upselling
      shipping_name,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_state,
      shipping_postal_code,
      shipping_country,
      shipping_phone,
      allergies,
      conditions,
      medications,
      activity_level,
      sleep_hours,
      alcohol_intake,
      dietary_preference, // 🚨 CRITICAL FIX: Add missing dietary_preference
      // 16 Lifestyle Assessment Questions (Yes/No)
      energy_levels,
      effort_fatigue,
      caffeine_effect,
      digestive_issues,
      stress_levels,
      sleep_quality,
      mood_changes,
      brain_fog,
      sugar_cravings,
      skin_issues,
      joint_pain,
      immune_system,
      workout_recovery,
      food_sensitivities,
      weight_management,
      medication_history, // ADHD/Anxiety meds question
      primary_health_concern,
      known_biomarkers,
      known_genetic_variants,
    } = result.data;

    const height_total_inches = (height_ft * 12) + height_in;
    
    // Combine health goals (excluding 'custom' placeholder) and add custom goal if provided
    const combinedHealthGoals = healthGoals.filter(goal => goal !== 'custom');
    if (customHealthGoal && customHealthGoal.trim()) {
      combinedHealthGoals.push(customHealthGoal.trim());
    }

    // Generate unique referral code for this user
    let userReferralCode = generateReferralCode();
    
    // Ensure uniqueness by checking database
    let codeExists = true;
    let attempts = 0;
    while (codeExists && attempts < 10) {
      const { data: existingCode } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('referral_code', userReferralCode)
        .single();
      
      if (!existingCode) {
        codeExists = false;
      } else {
        userReferralCode = generateReferralCode();
        attempts++;
      }
    }

    // Handle referral tracking (who referred this user)
    let referredByCode = null;
    try {
      // Note: We can't access localStorage from server actions,
      // so we'll need to pass this from the client if needed
      // For now, we'll handle this in a future update
    } catch (error) {
      logger.debug('No referral code found');
    }
    
    // Log the data types for debugging
    logger.info('Profile data types', {
      age: typeof age,
      height_total_inches: typeof height_total_inches,
      weight_lbs: typeof weight_lbs,
      sleep_hours: typeof sleep_hours,
      healthGoals: Array.isArray(combinedHealthGoals) ? 'array' : typeof combinedHealthGoals,
      userReferralCode: userReferralCode
    });
    
    // Upsert Profile Data with new fields
    const profileData: any = {
      id: user.id,
      full_name: fullName,
      age: age,
      gender: gender,
      height_total_inches: height_total_inches,
      weight_lbs: weight_lbs,
      health_goals: combinedHealthGoals,
      subscription_tier,
      
      // Shipping Address Fields - CRITICAL for upselling and order fulfillment
      shipping_name,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_state,
      shipping_postal_code,
      shipping_country: shipping_country || 'US', // Default to US if not provided
      shipping_phone,

      activity_level,
      sleep_hours,
      alcohol_intake,
      dietary_preference: dietary_preference || 'omnivore', // Default to omnivore if not provided
      // 16 Lifestyle Assessment Questions (Yes/No)
      energy_levels,
      effort_fatigue,
      caffeine_effect,
      digestive_issues,
      stress_levels,
      sleep_quality,
      mood_changes,
      brain_fog,
      sugar_cravings,
      skin_issues,
      joint_pain,
      immune_system,
      workout_recovery,
      food_sensitivities,
      weight_management,
      medication_history, // ADHD/Anxiety meds question
      primary_health_concern,
      known_biomarkers,
      known_genetic_variants,
      
      // Referral system fields
      referral_code: userReferralCode,
      referred_by_code: referredByCode,
      
      updated_at: new Date().toISOString(),
    };

    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'id' });

    if (profileError) {
      logger.error('Error upserting profile', {
        error: profileError,
        code: profileError.code,
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        userId: user.id
      });
      
      // Provide more specific error messages based on the error type
      if (profileError.code === '23502') {
        return { success: false, error: `Missing required field: ${profileError.details}` };
      } else if (profileError.code === '42703') {
        return { success: false, error: `Database column missing: ${profileError.message}` };
      } else if (profileError.code === '23514') {
        return { success: false, error: `Invalid value for field: ${profileError.details}` };
      }
      
      return { success: false, error: `Failed to save profile: ${profileError.message}` };
    }
    
    // Clear and re-insert allergies, conditions, medications
    const { error: deleteAllergiesError } = await supabase.from('user_allergies').delete().eq('user_id', user.id);
    const { error: deleteConditionsError } = await supabase.from('user_conditions').delete().eq('user_id', user.id);
    const { error: deleteMedicationsError } = await supabase.from('user_medications').delete().eq('user_id', user.id);

    if (deleteAllergiesError || deleteConditionsError || deleteMedicationsError) {
      logger.error('Error clearing old data', { deleteAllergiesError, deleteConditionsError, deleteMedicationsError });
      return { success: false, error: 'Failed to clear existing health profile data.' };
    }

    // Insert allergies
    if (allergies?.length) {
      const allergyInserts = allergies.filter(a => a.value.trim()).map(a => ({ user_id: user.id, ingredient_name: a.value }));
      if (allergyInserts.length > 0) {
        const { error: allergyError } = await supabase.from('user_allergies').insert(allergyInserts);
        if (allergyError) {
          logger.error('Error inserting allergies', allergyError);
          return { success: false, error: 'Failed to save allergy information.' };
        }
      }
    }

    // Insert conditions
    if (conditions?.length) {
      const conditionInserts = conditions.filter(c => c.value.trim()).map(c => ({ user_id: user.id, condition_name: c.value }));
      if (conditionInserts.length > 0) {
        const { error: conditionError } = await supabase.from('user_conditions').insert(conditionInserts);
        if (conditionError) {
          logger.error('Error inserting conditions', conditionError);
          return { success: false, error: 'Failed to save medical condition information.' };
        }
      }
    }

    // Insert medications
    if (medications?.length) {
      const medicationInserts = medications.filter(m => m.value.trim()).map(m => ({ user_id: user.id, medication_name: m.value }));
      if (medicationInserts.length > 0) {
        const { error: medicationError } = await supabase.from('user_medications').insert(medicationInserts);
        if (medicationError) {
          logger.error('Error inserting medications', medicationError);
          return { success: false, error: 'Failed to save medication information.' };
        }
      }
    }

    // ✅ SUCCESS: Onboarding data saved - AI functions now called AFTER payment
    logger.success('Onboarding data saved successfully! AI functions will be called after payment.');
    
    // 🚧 PAYMENT GATE: AI functions moved to payment success handler
    // The generate-plan and health-domains-analysis functions are now called
    // in the payment success page AFTER payment is confirmed

    // Revalidate and redirect to dashboard
    revalidatePath('/dashboard');
    
    return {
      success: true,
      message: 'Profile saved successfully! Your personalized supplement plan is being generated.',
    };

  } catch (error: any) {
    logger.error('Error in saveOnboardingData', error instanceof Error ? error : { message: String(error) });
    return {
      success: false,
      error: error.message || 'An unexpected error occurred.',
    };
  }
}

// NEW FUNCTION: Generate AI content after payment
export async function generateAIContentAfterPayment() {
  const supabase = await createClient();
  
  try {
    // Get user session token for authenticated edge function call
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No session token available for plan generation');
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No user found');
    }

    logger.info('Checking for user profile', { userId: user.id });

    // Check if user profile exists (it should, since we saved it before payment)
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('subscription_tier, full_name')
      .eq('id', user.id)
      .single();

    if (profileError) {
      logger.error('Profile query error', profileError);
      throw new Error(`Database error: ${profileError.message}`);
    }

    if (!profile) {
      logger.error('No profile found for user', { userId: user.id });
      
      // Let's try to see if there are ANY profiles for this user
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id);
      
      logger.error('All profiles check', { allProfiles, allProfilesError });
      
      throw new Error('User profile not found. Please complete onboarding first.');
    }

    logger.success('User profile found', { 
      fullName: profile.full_name, 
      subscriptionTier: profile.subscription_tier 
    });

    // Shipping address is already saved during onboarding before payment
    // No need to update it here since we save onboarding data to Supabase first

    logger.step('🚀 PARALLEL EXECUTION: Generating ALL AI content simultaneously');
    
    // 🎯 RUN ALL 4 AI FUNCTIONS IN PARALLEL FOR MAXIMUM SPEED
    const aiGenerationPromises = [
      // 1. Generate supplement plan
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-plan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }).then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Generate Plan: ${errorText}`);
        }
        return { function: 'generate-plan', success: true };
      }).catch(error => ({ function: 'generate-plan', success: false, error: error.message })),

      // 2. Generate health domains analysis
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/health-domains-analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }).then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Health Domains: ${errorText}`);
        }
        return { function: 'health-domains-analysis', success: true };
      }).catch(error => ({ function: 'health-domains-analysis', success: false, error: error.message })),

      // 3. Generate health score
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/health-score`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }).then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Health Score: ${errorText}`);
        }
        return { function: 'health-score', success: true };
      }).catch(error => ({ function: 'health-score', success: false, error: error.message })),

      // 4. Generate diet plan
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-diet-plan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }).then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Diet Plan: ${errorText}`);
        }
        return { function: 'generate-diet-plan', success: true };
      }).catch(error => ({ function: 'generate-diet-plan', success: false, error: error.message }))
    ];

    // Wait for ALL functions to complete (successful or failed)
    const results = await Promise.allSettled(aiGenerationPromises);
    
    // Process results and log outcomes
    let successCount = 0;
    let failureCount = 0;
    const failedFunctions: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const functionResult = result.value;
        if (functionResult.success) {
          successCount++;
          logger.success(`✅ ${functionResult.function} completed successfully`);
        } else {
          failureCount++;
          failedFunctions.push(functionResult.function);
          logger.error(`❌ ${functionResult.function} failed: ${'error' in functionResult ? functionResult.error : 'Unknown error'}`);
        }
      } else {
        failureCount++;
        const functionNames = ['generate-plan', 'health-domains-analysis', 'health-score', 'generate-diet-plan'];
        failedFunctions.push(functionNames[index]);
        logger.error(`❌ ${functionNames[index]} promise rejected: ${result.reason}`);
      }
    });

    // Log summary
    logger.success(`🎯 PARALLEL EXECUTION COMPLETE: ${successCount}/4 functions successful`);
    
    if (failureCount > 0) {
      logger.warn(`⚠️ ${failureCount} functions failed: ${failedFunctions.join(', ')}`);
      logger.info('Dashboard will show fallback messages for failed functions');
    }

    // Consider it successful if at least the supplement plan generated
    // (since that's the core feature users pay for)
    const planResult = results[0];
    const planSuccessful = planResult.status === 'fulfilled' && 
                          (planResult.value as any).success === true;

    if (!planSuccessful) {
      logger.error('❌ CRITICAL: Supplement plan generation failed - this is the core paid feature');
      throw new Error('Failed to generate supplement plan - the core feature you paid for');
    }

    return { 
      success: true, 
      successfulFunctions: successCount,
      failedFunctions: failedFunctions,
      message: `AI content generation completed: ${successCount}/4 functions successful`
    };

  } catch (error: any) {
    logger.error('Error generating AI content', error instanceof Error ? error : { message: String(error) });
    return { 
      success: false, 
      error: error.message || 'Failed to generate AI content' 
    };
  }
}

// MINIMAL FUNCTION: Update subscription tier when user upgrades via upsell modal
export async function updateSubscriptionTier(newTier: 'full' | 'software_only') {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    logger.info('Updating subscription tier after upsell', { userId: user.id, newTier });

    const { error } = await supabase
      .from('user_profiles')
      .update({ subscription_tier: newTier })
      .eq('id', user.id);

    if (error) {
      logger.error('Failed to update subscription tier', error);
      return { success: false, error: error.message };
    }

    logger.success(`Subscription tier updated successfully to ${newTier}`);
    return { success: true };
  } catch (error: any) {
    logger.error('Error updating subscription tier', error);
    return { success: false, error: error.message };
  }
} 