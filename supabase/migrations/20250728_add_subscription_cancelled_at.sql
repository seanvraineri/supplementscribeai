-- Add subscription_cancelled_at column to track when users cancel their subscription
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS subscription_cancelled_at TIMESTAMP WITH TIME ZONE;

-- Add index for efficient queries on cancelled subscriptions
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_cancelled_at 
ON public.user_profiles(subscription_cancelled_at) 
WHERE subscription_cancelled_at IS NOT NULL; 