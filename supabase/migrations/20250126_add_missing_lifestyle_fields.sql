-- Add missing lifestyle assessment fields for new onboarding flow
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS digestive_issues text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS stress_levels text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS mood_changes text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS sugar_cravings text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS skin_issues text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS immune_system text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS workout_recovery text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS food_sensitivities text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS weight_management text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS custom_health_goal text;

-- Add comments for documentation
COMMENT ON COLUMN public.user_profiles.digestive_issues IS 'Lifestyle assessment: Do you experience digestive discomfort regularly? (yes/no)';
COMMENT ON COLUMN public.user_profiles.stress_levels IS 'Lifestyle assessment: Do you feel stressed or anxious frequently? (yes/no)';
COMMENT ON COLUMN public.user_profiles.mood_changes IS 'Lifestyle assessment: Do you experience mood swings or irritability? (yes/no)';
COMMENT ON COLUMN public.user_profiles.sugar_cravings IS 'Lifestyle assessment: Do you crave sugar or processed foods? (yes/no)';
COMMENT ON COLUMN public.user_profiles.skin_issues IS 'Lifestyle assessment: Do you have skin problems? (yes/no)';
COMMENT ON COLUMN public.user_profiles.immune_system IS 'Lifestyle assessment: Do you get sick more often than you would like? (yes/no)';
COMMENT ON COLUMN public.user_profiles.workout_recovery IS 'Lifestyle assessment: Do you take longer to recover from workouts? (yes/no)';
COMMENT ON COLUMN public.user_profiles.food_sensitivities IS 'Lifestyle assessment: Do certain foods make you feel unwell? (yes/no)';
COMMENT ON COLUMN public.user_profiles.weight_management IS 'Lifestyle assessment: Is it difficult to maintain a healthy weight? (yes/no)';
COMMENT ON COLUMN public.user_profiles.custom_health_goal IS 'Custom health goal entered by user (optional)';

-- No RLS changes needed - existing user_profiles policies already cover these columns 