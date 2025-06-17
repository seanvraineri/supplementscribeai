-- Add primary_health_concern field to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS primary_health_concern text;

-- Add comment for documentation
COMMENT ON COLUMN public.user_profiles.primary_health_concern IS 'User''s main health concern or goal - mandatory field to ensure AI never misses critical issues';

-- No RLS changes needed - existing user_profiles policies already cover this column 