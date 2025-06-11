-- Alter the user_profiles table to replace date_of_birth with age
ALTER TABLE public.user_profiles
DROP COLUMN IF EXISTS date_of_birth;

ALTER TABLE public.user_profiles
ADD COLUMN age INTEGER;

COMMENT ON COLUMN public.user_profiles.age IS 'The age of the user.'; 