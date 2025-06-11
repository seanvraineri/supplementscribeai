-- Alter the user_profiles table to add height, weight, and gender using imperial units
ALTER TABLE public.user_profiles
ADD COLUMN gender TEXT,
ADD COLUMN height_total_inches INTEGER,
ADD COLUMN weight_lbs INTEGER;

COMMENT ON COLUMN public.user_profiles.gender IS 'User-reported gender.';
COMMENT ON COLUMN public.user_profiles.height_total_inches IS 'User height in total inches (e.g., 5''10" = 70).';
COMMENT ON COLUMN public.user_profiles.weight_lbs IS 'User weight in pounds.'; 