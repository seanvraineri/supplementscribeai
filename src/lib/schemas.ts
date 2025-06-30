import { z } from 'zod';

export const onboardingSchema = z.object({
  // Personal Details (Step 9 - Final)
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters long." }),
  age: z.coerce.number().int().positive({ message: "Please enter a valid age." }).min(1, { message: "Age must be at least 1." }),
  gender: z.string().min(1, { message: "Please select a gender." }),
  height_ft: z.coerce.number().int().positive({ message: "Please enter a valid height." }),
  height_in: z.coerce.number().int().min(0).max(11, { message: "Inches must be between 0 and 11." }),
  weight_lbs: z.coerce.number().int().positive({ message: "Please enter a valid weight." }),
  
  // Step 1: Health Goals
  healthGoals: z.array(z.string()).min(1, { message: "Please select at least one health goal." }),
  customHealthGoal: z.string().optional(),
  
  // Step 2: Subscription Tier
  subscription_tier: z.string({ required_error: "Please select a subscription plan." }),
  
  // Shipping Address - REQUIRED FOR ALL USERS to enable upselling
  shipping_name: z.string().min(2, { message: "Full name is required." }),
  shipping_address_line1: z.string().min(5, { message: "Street address is required." }),
  shipping_address_line2: z.string().optional(),
  shipping_city: z.string().min(2, { message: "City is required." }),
  shipping_state: z.string().min(2, { message: "State is required." }),
  shipping_postal_code: z.string().min(5, { message: "ZIP code is required." }),
  shipping_country: z.string().min(2, { message: "Country is required." }),
  shipping_phone: z.string().min(10, { message: "Phone number is required for delivery notifications." }),
  
  // Step 2: Lifestyle Assessment (16 Yes/No Questions)
  energy_levels: z.string().optional(),
  effort_fatigue: z.string().optional(),
  caffeine_effect: z.string().optional(),
  digestive_issues: z.string().optional(),
  stress_levels: z.string().optional(),
  sleep_quality: z.string().optional(),
  mood_changes: z.string().optional(),
  brain_fog: z.string().optional(),
  sugar_cravings: z.string().optional(),
  skin_issues: z.string().optional(),
  joint_pain: z.string().optional(),
  immune_system: z.string().optional(),
  workout_recovery: z.string().optional(),
  food_sensitivities: z.string().optional(),
  weight_management: z.string().optional(),
  medication_history: z.string().optional(),
  
  // Optional detail fields for lifestyle questions (when user answers "yes")
  energy_levels_details: z.string().max(500).optional(),
  effort_fatigue_details: z.string().max(500).optional(),
  caffeine_effect_details: z.string().max(500).optional(),
  digestive_issues_details: z.string().max(500).optional(),
  stress_levels_details: z.string().max(500).optional(),
  sleep_quality_details: z.string().max(500).optional(),
  mood_changes_details: z.string().max(500).optional(),
  brain_fog_details: z.string().max(500).optional(),
  sugar_cravings_details: z.string().max(500).optional(),
  skin_issues_details: z.string().max(500).optional(),
  joint_pain_details: z.string().max(500).optional(),
  immune_system_details: z.string().max(500).optional(),
  workout_recovery_details: z.string().max(500).optional(),
  food_sensitivities_details: z.string().max(500).optional(),
  weight_management_details: z.string().max(500).optional(),
  medication_history_details: z.string().max(500).optional(),
  
  // Keeping old fields for backwards compatibility but they won't be used in new flow
  anxiety_level: z.string().optional(),
  stress_resilience: z.string().optional(),
  sleep_aids: z.string().optional(),
  bloating: z.string().optional(),
  digestion_speed: z.string().optional(),
  anemia_history: z.string().optional(),
  bruising_bleeding: z.string().optional(),
  belly_fat: z.string().optional(),
  
  // Step 3: Activity Level
  activity_level: z.string({ required_error: "Please select an activity level." }),
  
  // Step 4: Sleep Hours
  sleep_hours: z.coerce.number().int().min(4, "Please enter a valid number of hours (4-12).").max(12, "Please enter a valid number of hours (4-12)."),
  
  // Step 5: Alcohol Intake
  alcohol_intake: z.string({ required_error: "Please select your alcohol intake." }),
  
  // Step 6: Dietary Preference
  dietary_preference: z.string({ required_error: "Please select your dietary preference." }),
  
  // Step 7: Health Profile (Allergies, Conditions, Medications)
  allergies: z.array(z.object({ value: z.string().min(1, "Please enter an allergy or remove this field.") })).optional(),
  conditions: z.array(z.object({ value: z.string().min(1, "Please enter a condition or remove this field.") })).optional(),
  medications: z.array(z.object({ value: z.string().min(1, "Please enter a medication or remove this field.") })).optional(),
  
  // Step 8: Primary Health Concern
  primary_health_concern: z.string()
    .min(10, { message: "Please describe your main health concern in at least 10 characters." })
    .max(500, { message: "Please keep your concern under 500 characters." }),
  
  // Step 9: Optional Health Data
  known_biomarkers: z.string().optional(),
  known_genetic_variants: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.healthGoals.includes('custom') && (!data.customHealthGoal || data.customHealthGoal.trim().length < 3)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please enter your custom goal (minimum 3 characters).",
      path: ["customHealthGoal"],
    });
  }
});

export type OnboardingData = z.infer<typeof onboardingSchema>; 