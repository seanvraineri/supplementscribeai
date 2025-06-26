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
  
  // Shipping Address (only required for complete package)
  shipping_name: z.string().optional(),
  shipping_address1: z.string().optional(),
  shipping_address2: z.string().optional(),
  shipping_city: z.string().optional(),
  shipping_state: z.string().optional(),
  shipping_postal_code: z.string().optional(),
  shipping_country: z.string().optional(),
  shipping_phone: z.string().optional(),
  
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
  
  // Validate shipping address for complete package
  if (data.subscription_tier === 'full') {
    if (!data.shipping_name || data.shipping_name.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Full name is required for supplement delivery.",
        path: ["shipping_name"],
      });
    }
    if (!data.shipping_address1 || data.shipping_address1.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Street address is required for supplement delivery.",
        path: ["shipping_address1"],
      });
    }
    if (!data.shipping_city || data.shipping_city.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "City is required for supplement delivery.",
        path: ["shipping_city"],
      });
    }
    if (!data.shipping_state || data.shipping_state.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "State is required for supplement delivery.",
        path: ["shipping_state"],
      });
    }
    if (!data.shipping_postal_code || data.shipping_postal_code.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ZIP code is required for supplement delivery.",
        path: ["shipping_postal_code"],
      });
    }
    if (!data.shipping_country || data.shipping_country.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Country is required for supplement delivery.",
        path: ["shipping_country"],
      });
    }
  }
});

export type OnboardingData = z.infer<typeof onboardingSchema>; 