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
  
  // Step 2: Lifestyle Assessment (Yes/No Questions)
  energy_levels: z.string(),
  effort_fatigue: z.string(),
  caffeine_effect: z.string(),
  brain_fog: z.string(),
  anxiety_level: z.string(),
  stress_resilience: z.string(),
  medication_history: z.string(), // New field for ADHD/anxiety medication question
  sleep_quality: z.string(),
  sleep_aids: z.string(),
  bloating: z.string(),
  digestion_speed: z.string(),
  anemia_history: z.string(),
  joint_pain: z.string(),
  bruising_bleeding: z.string(),
  belly_fat: z.string(),
  
  // Step 3: Activity Level
  activity_level: z.string({ required_error: "Please select an activity level." }),
  
  // Step 4: Sleep Hours
  sleep_hours: z.coerce.number().int().min(4).max(12, "Please enter a valid number of hours (4-12)."),
  
  // Step 5: Alcohol Intake
  alcohol_intake: z.string({ required_error: "Please select your alcohol intake." }),
  
  // Step 6: Health Profile (Allergies, Conditions, Medications)
  allergies: z.array(z.object({ value: z.string().min(1, "Please enter an allergy or remove this field.") })).optional(),
  conditions: z.array(z.object({ value: z.string().min(1, "Please enter a condition or remove this field.") })).optional(),
  medications: z.array(z.object({ value: z.string().min(1, "Please enter a medication or remove this field.") })).optional(),
  
  // Step 7: Primary Health Concern
  primary_health_concern: z.string()
    .min(10, { message: "Please describe your main health concern in at least 10 characters." })
    .max(500, { message: "Please keep your concern under 500 characters." }),
  
  // Step 8: Optional Health Data
  known_biomarkers: z.string().optional(),
  known_genetic_variants: z.string().optional(),
});

export type OnboardingData = z.infer<typeof onboardingSchema>; 