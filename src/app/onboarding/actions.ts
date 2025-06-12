'use server';

import { createClient } from '@/lib/supabase/server';
import { onboardingSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
      customHealthGoals,
      allergies,
      conditions,
      medications,
      activity_level,
      sleep_hours,
      alcohol_intake,
      energy_levels,
      effort_fatigue,
      caffeine_effect,
      brain_fog,
      anxiety_level,
      stress_resilience,
      sleep_quality,
      sleep_aids,
      bloating,
      anemia_history,
      digestion_speed,
      low_nutrients,
      bruising_bleeding,
      belly_fat,
      joint_pain,
    } = result.data;

    const height_total_inches = (height_ft * 12) + height_in;
    const combinedHealthGoals = [
      ...(healthGoals || []),
      ...(customHealthGoals?.map(g => g.value).filter(Boolean) || [])
    ];
    
    // Upsert Profile Data
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id, // Important for upsert
        full_name: fullName,
        age: age,
        gender: gender,
        height_total_inches: height_total_inches,
        weight_lbs: weight_lbs,
        health_goals: combinedHealthGoals,
        activity_level,
        sleep_hours,
        alcohol_intake,
        energy_levels,
        effort_fatigue,
        caffeine_effect,
        brain_fog,
        anxiety_level,
        stress_resilience,
        sleep_quality,
        sleep_aids,
        bloating,
        anemia_history,
        digestion_speed,
        low_nutrients,
        bruising_bleeding,
        belly_fat,
        joint_pain,
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

    revalidatePath('/onboarding');
    revalidatePath('/dashboard');

    return { success: true };

  } catch (error) {
    console.error('Unexpected error in saveOnboardingData:', error);
    return { success: false, error: 'An unexpected error occurred while saving your profile.' };
  }
} 