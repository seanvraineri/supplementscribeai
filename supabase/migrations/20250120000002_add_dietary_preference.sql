-- Add dietary preference field to user_profiles table
-- This enables personalized diet plans based on user's dietary restrictions/preferences

ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS dietary_preference text;

-- Add constraint to ensure only valid dietary preferences are stored
ALTER TABLE public.user_profiles ADD CONSTRAINT dietary_preference_check 
CHECK (dietary_preference IN ('omnivore', 'vegetarian', 'paleo', 'keto', 'vegan', 'celiac'));

-- Add documentation comment
COMMENT ON COLUMN public.user_profiles.dietary_preference IS 'User dietary preference for personalized nutrition plans: omnivore, vegetarian, paleo, keto, vegan, or celiac';

-- No RLS policy changes needed - existing user_profiles policies already cover all columns 