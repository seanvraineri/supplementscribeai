-- Add referral system to SupplementScribe AI
-- Simple Supabase-compatible migration

-- Add referral fields to existing user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS referral_code VARCHAR(8) UNIQUE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS referred_by_code VARCHAR(8);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

-- Family plan fields (no payment logic - just grouping for future)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS family_admin_id UUID REFERENCES user_profiles(id);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS family_size INTEGER DEFAULT 1;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code ON user_profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_user_profiles_referred_by ON user_profiles(referred_by_code);

-- RLS policies are already covered by existing user_profiles policies
-- Users can only access their own referral data automatically 