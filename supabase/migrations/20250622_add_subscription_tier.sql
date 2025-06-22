-- Add subscription tier to user_profiles table
-- This enables software-only vs full subscription differentiation

-- Add the subscription_tier column with safe defaults
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'full' 
CHECK (subscription_tier IN ('full', 'software_only'));

-- Add helpful comment
COMMENT ON COLUMN public.user_profiles.subscription_tier IS 'Subscription type: full (software + supplements) or software_only (software access only)';

-- Create index for efficient queries (optional but good practice)
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier ON public.user_profiles(subscription_tier);

-- No RLS changes needed - existing policies cover all columns automatically
-- Existing policy: "Enable all for authenticated users on user_profiles" covers this new column 