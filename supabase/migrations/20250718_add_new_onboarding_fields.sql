-- Add all missing fields from the new frictionless onboarding flow to the user_profiles table

-- Add the 9 missing lifestyle assessment fields (yes/no questions)
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS digestive_issues text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS stress_levels text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS mood_changes text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS sugar_cravings text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS skin_issues text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS immune_system text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS workout_recovery text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS food_sensitivities text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS weight_management text;

-- Add the custom health goal field
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS custom_health_goal text;

-- Add comments for documentation to explain the purpose of each new column
COMMENT ON COLUMN public.user_profiles.digestive_issues IS 'Lifestyle assessment (yes/no): Do you experience digestive discomfort regularly?';
COMMENT ON COLUMN public.user_profiles.stress_levels IS 'Lifestyle assessment (yes/no): Do you feel stressed or anxious frequently?';
COMMENT ON COLUMN public.user_profiles.mood_changes IS 'Lifestyle assessment (yes/no): Do you experience mood swings or irritability?';
COMMENT ON COLUMN public.user_profiles.sugar_cravings IS 'Lifestyle assessment (yes/no): Do you crave sugar or processed foods?';
COMMENT ON COLUMN public.user_profiles.skin_issues IS 'Lifestyle assessment (yes/no): Do you have skin problems (acne, dryness, sensitivity)?';
COMMENT ON COLUMN public.user_profiles.immune_system IS 'Lifestyle assessment (yes/no): Do you get sick more often than you''d like?';
COMMENT ON COLUMN public.user_profiles.workout_recovery IS 'Lifestyle assessment (yes/no): Do you take longer to recover from workouts?';
COMMENT ON COLUMN public.user_profiles.food_sensitivities IS 'Lifestyle assessment (yes/no): Do certain foods make you feel unwell?';
COMMENT ON COLUMN public.user_profiles.weight_management IS 'Lifestyle assessment (yes/no): Is it difficult to maintain a healthy weight?';
COMMENT ON COLUMN public.user_profiles.custom_health_goal IS 'Stores the user''s custom-entered health goal text from the onboarding flow.';

-- No RLS changes are needed because the existing policies on user_profiles already cover all columns for the authenticated user. 