import { z } from 'zod';

export const onboardingSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters long." }),
  age: z.coerce.number().int().positive({ message: "Please enter a valid age." }).min(1, { message: "Age must be at least 1." }),
  gender: z.string().min(1, { message: "Please select a gender." }),
  height_ft: z.coerce.number().int().positive({ message: "Please enter a valid height." }),
  height_in: z.coerce.number().int().min(0).max(11, { message: "Inches must be between 0 and 11." }),
  weight_lbs: z.coerce.number().int().positive({ message: "Please enter a valid weight." }),
  healthGoals: z.array(z.string()).optional(),
  customHealthGoals: z.array(z.object({ value: z.string().min(1, "Please enter a goal or remove this field.") })).optional(),
  allergies: z.array(z.object({ value: z.string().min(1, "Please enter an allergy or remove this field.") })).optional(),
  conditions: z.array(z.object({ value: z.string().min(1, "Please enter a condition or remove this field.") })).optional(),
  medications: z.array(z.object({ value: z.string().min(1, "Please enter a medication or remove this field.") })).optional(),
});

export type OnboardingData = z.infer<typeof onboardingSchema>; 