-- Add affiliate commission tracking for manual payouts
-- This tracks who referred whom and how much commission they earned

CREATE TABLE affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Who gets the commission
  affiliate_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  affiliate_referral_code VARCHAR(8) NOT NULL,
  
  -- Who they referred
  referred_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  referred_user_email TEXT NOT NULL,
  
  -- Payment details
  subscription_tier TEXT NOT NULL CHECK (subscription_tier IN ('software_only', 'full')),
  monthly_revenue DECIMAL(10,2) NOT NULL, -- $19.99 or $75.00
  commission_rate DECIMAL(5,4) DEFAULT 0.30, -- 30% commission
  commission_amount DECIMAL(10,2) NOT NULL,
  
  -- Stripe payment info (for reference)
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  
  -- Manual payout tracking
  payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid', 'cancelled')),
  payout_date TIMESTAMPTZ,
  payout_method TEXT, -- 'paypal', 'venmo', 'zelle', 'check', etc.
  payout_reference TEXT, -- Transaction ID or reference
  payout_notes TEXT,
  
  -- Prevent duplicate commissions for same referral
  UNIQUE(referred_user_id)
);

-- Indexes for performance
CREATE INDEX idx_affiliate_commissions_affiliate ON affiliate_commissions(affiliate_user_id);
CREATE INDEX idx_affiliate_commissions_status ON affiliate_commissions(payout_status);
CREATE INDEX idx_affiliate_commissions_date ON affiliate_commissions(created_at);
CREATE INDEX idx_affiliate_commissions_referral_code ON affiliate_commissions(affiliate_referral_code);

-- RLS policies
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own commission records
CREATE POLICY "Users can view their own commissions" ON affiliate_commissions
  FOR SELECT USING (affiliate_user_id = auth.uid());

-- Only service role can insert/update commission records
CREATE POLICY "Service role can manage commissions" ON affiliate_commissions
  FOR ALL USING (auth.role() = 'service_role');

-- Add comment for documentation
COMMENT ON TABLE affiliate_commissions IS 'Tracks affiliate commissions for manual payout processing'; 