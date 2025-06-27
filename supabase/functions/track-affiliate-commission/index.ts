import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CommissionTrackingRequest {
  userId: string;
  subscriptionTier: string; // 'software_only' or 'full'
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? 'http://127.0.0.1:54321',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
    );

    const { userId, subscriptionTier, stripeSubscriptionId, stripeCustomerId }: CommissionTrackingRequest = await req.json();

    console.log('Tracking commission for user:', userId, 'tier:', subscriptionTier);

    // Get user profile to check if they were referred
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('referred_by_code, email, full_name')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      console.log('No user profile found or error:', profileError);
      return new Response(JSON.stringify({ 
        success: false,
        message: 'User profile not found' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Check if user was referred
    if (!userProfile.referred_by_code) {
      console.log('User was not referred, no commission to track');
      return new Response(JSON.stringify({ 
        success: true,
        message: 'No referral code found, no commission to track' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find the affiliate who referred this user
    const { data: affiliate, error: affiliateError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, referral_code, referral_count')
      .eq('referral_code', userProfile.referred_by_code)
      .single();

    if (affiliateError || !affiliate) {
      console.error('Affiliate not found for referral code:', userProfile.referred_by_code);
      return new Response(JSON.stringify({ 
        success: false,
        message: 'Affiliate not found' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Calculate commission amounts
    const monthlyRevenue = subscriptionTier === 'full' ? 75.00 : 19.99;
    const commissionRate = 0.30; // 30%
    const commissionAmount = monthlyRevenue * commissionRate;

    // Check if commission already exists for this user
    const { data: existingCommission } = await supabase
      .from('affiliate_commissions')
      .select('id')
      .eq('referred_user_id', userId)
      .single();

    if (existingCommission) {
      console.log('Commission already exists for this user');
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Commission already tracked for this user' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create commission record
    const commissionData = {
      affiliate_user_id: affiliate.id,
      affiliate_referral_code: affiliate.referral_code,
      referred_user_id: userId,
      referred_user_email: userProfile.email || `user-${userId}@supplementscribe.ai`,
      subscription_tier: subscriptionTier,
      monthly_revenue: monthlyRevenue,
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_customer_id: stripeCustomerId,
      payout_status: 'pending'
    };

    const { data: commission, error: commissionError } = await supabase
      .from('affiliate_commissions')
      .insert(commissionData)
      .select()
      .single();

    if (commissionError) {
      console.error('Failed to create commission record:', commissionError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Failed to create commission record',
        details: commissionError
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Update affiliate's referral count
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        referral_count: (affiliate.referral_count || 0) + 1 
      })
      .eq('id', affiliate.id);

    if (updateError) {
      console.error('Failed to update referral count:', updateError);
      // Don't fail the request for this
    }

    console.log('✅ Commission tracked successfully:', {
      affiliate: affiliate.full_name,
      referralCode: affiliate.referral_code,
      referredUser: userProfile.full_name,
      tier: subscriptionTier,
      commissionAmount: commissionAmount
    });

    return new Response(JSON.stringify({ 
      success: true,
      commission: {
        id: commission.id,
        affiliate_name: affiliate.full_name,
        affiliate_email: affiliate.email,
        referral_code: affiliate.referral_code,
        referred_user: userProfile.full_name,
        referred_email: userProfile.email,
        subscription_tier: subscriptionTier,
        monthly_revenue: monthlyRevenue,
        commission_amount: commissionAmount,
        created_at: commission.created_at
      },
      message: `Commission of $${commissionAmount.toFixed(2)} tracked for ${affiliate.full_name}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in track-affiliate-commission function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Internal server error',
      stack: error.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 