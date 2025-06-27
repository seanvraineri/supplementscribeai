# 🤝 AFFILIATE COMMISSION SYSTEM - IMPLEMENTATION PLAN

## 🎯 **GOAL: Manual Commission Payouts for Referrals**

You want to manually pay commissions to affiliates when their referrals subscribe. Here's what we need to build:

---

## 📊 **COMMISSION TRACKING TABLE**

```sql
-- Add to migration: 20250202_add_commission_tracking.sql
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
  subscription_tier TEXT NOT NULL, -- 'software_only' or 'full'
  monthly_revenue DECIMAL(10,2) NOT NULL, -- $19.99 or $75.00
  commission_rate DECIMAL(5,4) DEFAULT 0.30, -- 30% commission
  commission_amount DECIMAL(10,2) NOT NULL,
  
  -- Stripe payment info
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  
  -- Payout tracking
  payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid', 'cancelled')),
  payout_date TIMESTAMPTZ,
  payout_method TEXT, -- 'paypal', 'venmo', 'zelle', 'check'
  payout_reference TEXT, -- PayPal transaction ID, etc.
  payout_notes TEXT,
  
  -- Indexes
  UNIQUE(referred_user_id) -- One commission per referred user
);

CREATE INDEX idx_affiliate_commissions_affiliate ON affiliate_commissions(affiliate_user_id);
CREATE INDEX idx_affiliate_commissions_status ON affiliate_commissions(payout_status);
CREATE INDEX idx_affiliate_commissions_date ON affiliate_commissions(created_at);
```

---

## 🔄 **COMMISSION TRACKING WORKFLOW**

### 1. **User Signs Up with Referral Code**
```typescript
// In signup process
if (referralCode) {
  // Save referred_by_code to user_profiles
  await supabase.from('user_profiles').update({
    referred_by_code: referralCode
  }).eq('id', newUserId);
}
```

### 2. **User Completes Payment**
```typescript
// After successful Stripe payment
const commissionData = {
  affiliate_user_id: referrerUserId,
  affiliate_referral_code: referralCode,
  referred_user_id: newUserId,
  referred_user_email: userEmail,
  subscription_tier: tier, // 'software_only' or 'full'
  monthly_revenue: tier === 'full' ? 75.00 : 19.99,
  commission_rate: 0.30, // 30%
  commission_amount: tier === 'full' ? 22.50 : 5.997,
  stripe_subscription_id: subscriptionId,
  stripe_customer_id: customerId
};

await supabase.from('affiliate_commissions').insert(commissionData);
```

### 3. **Update Referrer's Count**
```typescript
// Increment referral_count for the affiliate
await supabase.from('user_profiles')
  .update({ 
    referral_count: referralCount + 1 
  })
  .eq('referral_code', referralCode);
```

---

## 💰 **COMMISSION RATES**

| Plan | Monthly Price | Commission Rate | Commission Amount |
|------|---------------|-----------------|-------------------|
| Software Only | $19.99 | 30% | **$5.997** |
| Complete Package | $75.00 | 30% | **$22.50** |

**Annual Potential:**
- Software Only: $5.997 × 12 = **$71.96/year per referral**
- Complete Package: $22.50 × 12 = **$270/year per referral**

---

## 🎛️ **ADMIN DASHBOARD FOR MANUAL PAYOUTS**

### Commission Management Page (`/admin/commissions`)
```typescript
// Display pending commissions
const { data: pendingCommissions } = await supabase
  .from('affiliate_commissions')
  .select(`
    *,
    affiliate:user_profiles!affiliate_user_id(full_name, email),
    referred:user_profiles!referred_user_id(full_name, email)
  `)
  .eq('payout_status', 'pending')
  .order('created_at', { ascending: false });
```

**Features:**
- ✅ View all pending commissions
- ✅ Filter by affiliate, date, amount
- ✅ Mark as paid with payout details
- ✅ Export for accounting
- ✅ Send payout confirmation emails

---

## 📧 **AUTOMATED NOTIFICATIONS**

### 1. **Commission Earned Email** (to affiliate)
```
🎉 You earned a $22.50 commission!

John Doe just subscribed using your referral code SUPP87A9.

Commission Details:
- Plan: Complete Package ($75/month)
- Your Commission: $22.50 (30%)
- Status: Pending Payout

We'll process your payout within 7 business days.
```

### 2. **Payout Confirmation Email** (to affiliate)
```
💰 Commission Payout Sent!

We've sent your $22.50 commission via PayPal.

Transaction ID: 7X123456789
Date: January 15, 2025

Thanks for spreading the word about SupplementScribe!
```

---

## 🔧 **IMPLEMENTATION STEPS**

### Week 1: Database & Tracking
1. ✅ Create `affiliate_commissions` table
2. ✅ Add commission tracking to signup flow
3. ✅ Add commission creation to payment success

### Week 2: Admin Interface
1. ✅ Build admin commission dashboard
2. ✅ Add manual payout marking
3. ✅ Export functionality

### Week 3: Automation & Polish
1. ✅ Automated commission emails
2. ✅ Payout confirmation emails
3. ✅ Analytics & reporting

---

## 📈 **AFFILIATE ANALYTICS**

### Affiliate Dashboard Additions:
```typescript
// Show commission earnings
const { data: commissions } = await supabase
  .from('affiliate_commissions')
  .select('*')
  .eq('affiliate_user_id', userId);

const totalEarned = commissions
  .filter(c => c.payout_status === 'paid')
  .reduce((sum, c) => sum + c.commission_amount, 0);

const pendingEarnings = commissions
  .filter(c => c.payout_status === 'pending')
  .reduce((sum, c) => sum + c.commission_amount, 0);
```

**Display:**
- 💰 Total Earned: $127.50
- ⏳ Pending: $45.00
- 👥 Active Referrals: 8
- 📊 Monthly Recurring: $180

---

## 🎯 **READY TO IMPLEMENT?**

This gives you:
1. **Complete commission tracking** in Supabase
2. **Manual payout system** for your preferred method
3. **Automated notifications** to keep affiliates happy
4. **Admin dashboard** for easy management
5. **Analytics** to track performance

**Next Step:** Create the database migration and start tracking commissions immediately! 