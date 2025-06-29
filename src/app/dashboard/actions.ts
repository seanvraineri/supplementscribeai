'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';

export async function cancelSubscription() {
  try {
    logger.step('Canceling subscription');
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to cancel subscription.' };
    }

    // Update user profile to set subscription_tier to null or 'cancelled'
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ 
        subscription_tier: null,
        subscription_cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (profileError) {
      logger.error('Error canceling subscription', profileError);
      return { success: false, error: 'Failed to cancel subscription. Please try again.' };
    }

    // Cancel any pending orders
    const { error: ordersError } = await supabase
      .from('supplement_orders')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('status', 'pending');

    if (ordersError) {
      logger.warn('Error canceling pending orders', ordersError);
      // Don't fail the cancellation if this fails
    }

    logger.success('Subscription cancelled successfully');
    
    // Revalidate the dashboard page to reflect changes
    revalidatePath('/dashboard');
    
    return {
      success: true,
      message: 'Your subscription has been cancelled. You will no longer receive monthly shipments.'
    };

  } catch (error: any) {
    logger.error('Error in cancelSubscription', error instanceof Error ? error : { message: String(error) });
    return {
      success: false,
      error: error.message || 'An unexpected error occurred while canceling your subscription.',
    };
  }
} 