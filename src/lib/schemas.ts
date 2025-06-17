import { z } from 'zod';

export const onboardingSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters long." }),
  age: z.coerce.number().int().positive({ message: "Please enter a valid age." }).min(1, { message: "Age must be at least 1." }),
  gender: z.string().min(1, { message: "Please select a gender." }),
  height_ft: z.coerce.number().int().positive({ message: "Please enter a valid height." }),
  height_in: z.coerce.number().int().min(0).max(11, { message: "Inches must be between 0 and 11." }),
  weight_lbs: z.coerce.number().int().positive({ message: "Please enter a valid weight." }),
  
  // NEW: Primary Health Concern - MANDATORY
  primary_health_concern: z.string()
    .min(10, { message: "Please describe your main health concern in at least 10 characters." })
    .max(500, { message: "Please keep your concern under 500 characters." }),
  
  healthGoals: z.array(z.string()).optional(),
  customHealthGoals: z.array(z.object({ value: z.string().min(1, "Please enter a goal or remove this field.") })).optional(),
  allergies: z.array(z.object({ value: z.string().min(1, "Please enter an allergy or remove this field.") })).optional(),
  conditions: z.array(z.object({ value: z.string().min(1, "Please enter a condition or remove this field.") })).optional(),
  medications: z.array(z.object({ value: z.string().min(1, "Please enter a medication or remove this field.") })).optional(),
  activity_level: z.string({ required_error: "Please select an activity level." }),
  sleep_hours: z.coerce.number().int().min(0, "Please enter a valid number of hours.").max(24, "Please enter a valid number of hours."),
  alcohol_intake: z.string({ required_error: "Please select your alcohol intake." }),
  
  // Data preference
  data_preference: z.enum(['upload', 'questionnaire']),
  lab_reports: z.any().optional(),
  genetic_reports: z.any().optional(),

  // Optional Lifestyle Questionnaire
  energy_levels: z.string({ required_error: "This field is required." }),
  effort_fatigue: z.string({ required_error: "This field is required." }),
  caffeine_effect: z.string({ required_error: "This field is required." }),
  brain_fog: z.string({ required_error: "This field is required." }),
  anxiety_level: z.string({ required_error: "This field is required." }),
  stress_resilience: z.string({ required_error: "This field is required." }),
  sleep_quality: z.string({ required_error: "This field is required." }),
  sleep_aids: z.string({ required_error: "This field is required." }),
  bloating: z.string({ required_error: "This field is required." }),
  anemia_history: z.string({ required_error: "This field is required." }),
  digestion_speed: z.string({ required_error: "This field is required." }),
  low_nutrients: z.array(z.string()).min(1, "Please make a selection."),
  bruising_bleeding: z.string({ required_error: "This field is required." }),
  belly_fat: z.string({ required_error: "This field is required." }),
  joint_pain: z.string({ required_error: "This field is required." }),
});

export type OnboardingData = z.infer<typeof onboardingSchema>; 