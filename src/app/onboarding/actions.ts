'use server';

import { createClient } from '@/lib/supabase/server';
import { onboardingSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateReferralCode } from '@/lib/referral-utils';

export async function saveOnboardingData(formData: unknown) {
  try {
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
      console.error('Form validation failed:', result.error.flatten());
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
      allergies,
      conditions,
      medications,
      activity_level,
      sleep_hours,
      alcohol_intake,
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
      console.log('No referral code found');
    }
    
    // Upsert Profile Data with new fields
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        age: age,
        gender: gender,
        height_total_inches: height_total_inches,
        weight_lbs: weight_lbs,
        health_goals: combinedHealthGoals,

        activity_level,
        sleep_hours,
        alcohol_intake,
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
      }, { onConflict: 'id' });

    if (profileError) {
      console.error('Error upserting profile:', profileError);
      return { success: false, error: 'Failed to save profile information.' };
    }
    
    // Clear and re-insert allergies, conditions, medications
    const { error: deleteAllergiesError } = await supabase.from('user_allergies').delete().eq('user_id', user.id);
    const { error: deleteConditionsError } = await supabase.from('user_conditions').delete().eq('user_id', user.id);
    const { error: deleteMedicationsError } = await supabase.from('user_medications').delete().eq('user_id', user.id);

    if (deleteAllergiesError || deleteConditionsError || deleteMedicationsError) {
      console.error('Error clearing old data:', { deleteAllergiesError, deleteConditionsError, deleteMedicationsError });
      return { success: false, error: 'Failed to clear existing health profile data.' };
    }

    // Insert allergies
    if (allergies?.length) {
      const allergyInserts = allergies.filter(a => a.value.trim()).map(a => ({ user_id: user.id, ingredient_name: a.value }));
      if (allergyInserts.length > 0) {
        const { error: allergyError } = await supabase.from('user_allergies').insert(allergyInserts);
        if (allergyError) {
          console.error('Error inserting allergies:', allergyError);
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
          console.error('Error inserting conditions:', conditionError);
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
          console.error('Error inserting medications:', medicationError);
          return { success: false, error: 'Failed to save medication information.' };
        }
      }
    }

    // ✅ SUCCESS: Generate supplement plan immediately
    console.log('🎉 Frictionless onboarding complete! Generating supplement plan...');
    
    try {
      // Get user session token for authenticated edge function call
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        // Call generate-plan function with user's access token
        const planResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-plan`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!planResponse.ok) {
          console.error('Failed to generate plan:', await planResponse.text());
          // Don't fail the onboarding if plan generation fails
        } else {
          console.log('✅ Supplement plan generated successfully');
        }
      } else {
        console.error('No session token available for plan generation');
      }
    } catch (planError) {
      console.error('Error generating plan:', planError);
      // Don't fail the onboarding if plan generation fails
    }

    // Revalidate and redirect to dashboard
    revalidatePath('/dashboard');
    
    return {
      success: true,
      message: 'Profile saved successfully! Your personalized supplement plan is being generated.',
    };

  } catch (error: any) {
    console.error('Error in saveOnboardingData:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred.',
    };
  }
} 