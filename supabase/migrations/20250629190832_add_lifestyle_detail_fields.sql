-- Add optional detail fields for each lifestyle question
-- These fields allow users to provide additional context when they answer "yes" to a lifestyle question

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS energy_levels_details TEXT,
ADD COLUMN IF NOT EXISTS effort_fatigue_details TEXT,
ADD COLUMN IF NOT EXISTS caffeine_effect_details TEXT,
ADD COLUMN IF NOT EXISTS digestive_issues_details TEXT,
ADD COLUMN IF NOT EXISTS stress_levels_details TEXT,
ADD COLUMN IF NOT EXISTS sleep_quality_details TEXT,
ADD COLUMN IF NOT EXISTS mood_changes_details TEXT,
ADD COLUMN IF NOT EXISTS brain_fog_details TEXT,
ADD COLUMN IF NOT EXISTS sugar_cravings_details TEXT,
ADD COLUMN IF NOT EXISTS skin_issues_details TEXT,
ADD COLUMN IF NOT EXISTS joint_pain_details TEXT,
ADD COLUMN IF NOT EXISTS immune_system_details TEXT,
ADD COLUMN IF NOT EXISTS workout_recovery_details TEXT,
ADD COLUMN IF NOT EXISTS food_sensitivities_details TEXT,
ADD COLUMN IF NOT EXISTS weight_management_details TEXT,
ADD COLUMN IF NOT EXISTS medication_history_details TEXT;

-- Add comments to explain the purpose of these fields
COMMENT ON COLUMN public.user_profiles.energy_levels_details IS 'Optional details about energy/fatigue patterns';
COMMENT ON COLUMN public.user_profiles.effort_fatigue_details IS 'Optional details about physical activity difficulties';
COMMENT ON COLUMN public.user_profiles.caffeine_effect_details IS 'Optional details about caffeine dependency';
COMMENT ON COLUMN public.user_profiles.digestive_issues_details IS 'Optional details about digestive problems';
COMMENT ON COLUMN public.user_profiles.stress_levels_details IS 'Optional details about stress/anxiety triggers';
COMMENT ON COLUMN public.user_profiles.sleep_quality_details IS 'Optional details about sleep issues';
COMMENT ON COLUMN public.user_profiles.mood_changes_details IS 'Optional details about mood patterns';
COMMENT ON COLUMN public.user_profiles.brain_fog_details IS 'Optional details about concentration issues';
COMMENT ON COLUMN public.user_profiles.sugar_cravings_details IS 'Optional details about cravings';
COMMENT ON COLUMN public.user_profiles.skin_issues_details IS 'Optional details about skin problems';
COMMENT ON COLUMN public.user_profiles.joint_pain_details IS 'Optional details about joint pain';
COMMENT ON COLUMN public.user_profiles.immune_system_details IS 'Optional details about illness frequency';
COMMENT ON COLUMN public.user_profiles.workout_recovery_details IS 'Optional details about recovery times';
COMMENT ON COLUMN public.user_profiles.food_sensitivities_details IS 'Optional details about food reactions';
COMMENT ON COLUMN public.user_profiles.weight_management_details IS 'Optional details about weight challenges';
COMMENT ON COLUMN public.user_profiles.medication_history_details IS 'Optional details about medication responses'; 