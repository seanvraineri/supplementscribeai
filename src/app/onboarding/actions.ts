'use server';

import { createClient } from '@/lib/supabase/server';
import { onboardingSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function submitOnboardingForm(formData: unknown) {
  const supabase = createClient();

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
    // This should ideally not happen if client-side validation is working
    return { success: false, error: 'Invalid form data provided.' };
  }

  const { fullName, age, gender, height_ft, height_in, weight_lbs, healthGoals, customHealthGoals, allergies, conditions, medications } = result.data;

  // Combine preset and custom health goals
  const combinedHealthGoals = [
    ...(healthGoals || []),
    ...(customHealthGoals?.map(g => g.value).filter(Boolean) || [])
  ];

  // Calculate total height in inches
  const height_total_inches = (height_ft * 12) + height_in;

  // 1. Update the user_profiles table
  const { error: profileError } = await supabase
    .from('user_profiles')
    .update({
      full_name: fullName,
      age: age,
      gender: gender,
      height_total_inches: height_total_inches,
      weight_lbs: weight_lbs,
      health_goals: combinedHealthGoals,
    })
    .eq('id', user.id);

  if (profileError) {
    console.error('Error updating profile:', profileError);
    return { success: false, error: 'Failed to save profile information.' };
  }

  // Clear existing lists before inserting new ones
  const { error: deleteError } = await supabase.from('user_allergies').delete().eq('user_id', user.id);
  const { error: deleteConditionsError } = await supabase.from('user_conditions').delete().eq('user_id', user.id);
  const { error: deleteMedicationsError } = await supabase.from('user_medications').delete().eq('user_id', user.id);

  if (deleteError || deleteConditionsError || deleteMedicationsError) {
    console.error('Error clearing user lists:', { deleteError, deleteConditionsError, deleteMedicationsError });
    return { success: false, error: 'Failed to update lists.' };
  }

  // 2. Insert into user_allergies table
  if (allergies && allergies.length > 0) {
    const allergyInserts = allergies
      .filter(a => a.value.trim() !== '')
      .map(allergy => ({
        user_id: user.id,
        ingredient_name: allergy.value,
    }));
    if (allergyInserts.length > 0) {
      const { error: allergiesError } = await supabase.from('user_allergies').insert(allergyInserts);
      if (allergiesError) {
        console.error('Error inserting allergies:', allergiesError);
        return { success: false, error: 'Failed to save allergy information.' };
      }
    }
  }

  // 3. Insert into user_conditions table
  if (conditions && conditions.length > 0) {
    const conditionInserts = conditions
      .filter(c => c.value.trim() !== '')
      .map(condition => ({
        user_id: user.id,
        condition_name: condition.value,
    }));
    if (conditionInserts.length > 0) {
      const { error: conditionsError } = await supabase.from('user_conditions').insert(conditionInserts);
      if (conditionsError) {
        console.error('Error inserting conditions:', conditionsError);
        return { success: false, error: 'Failed to save condition information.' };
      }
    }
  }

  // 4. Insert into user_medications table
  if (medications && medications.length > 0) {
    const medicationInserts = medications
      .filter(m => m.value.trim() !== '')
      .map(medication => ({
        user_id: user.id,
        medication_name: medication.value,
    }));
    if (medicationInserts.length > 0) {
      const { error: medicationsError } = await supabase.from('user_medications').insert(medicationInserts);
      if (medicationsError) {
        console.error('Error inserting medications:', medicationsError);
        return { success: false, error: 'Failed to save medication information.' };
      }
    }
  }

  revalidatePath('/onboarding');
  redirect('/'); // Redirect to the homepage after successful submission
} 