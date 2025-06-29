import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        details: userError 
      }, { status: 401 });
    }
    
    // Test minimal profile save
    const minimalProfile = {
      id: user.id,
      full_name: 'Test User',
      age: 30,
      updated_at: new Date().toISOString()
    };
    
    console.log('Testing minimal profile save:', minimalProfile);
    
    const { error: minimalError } = await supabase
      .from('user_profiles')
      .upsert(minimalProfile, { onConflict: 'id' });
    
    if (minimalError) {
      console.error('Minimal profile save failed:', minimalError);
      return NextResponse.json({ 
        error: 'Minimal profile save failed',
        details: minimalError,
        code: minimalError.code,
        message: minimalError.message,
        hint: minimalError.hint
      }, { status: 500 });
    }
    
    // Test with more fields
    const fullProfile = {
      id: user.id,
      full_name: 'Test User',
      age: 30,
      gender: 'male',
      height_total_inches: 70,
      weight_lbs: 170,
      health_goals: ['energy', 'focus'],
      subscription_tier: 'full',
      activity_level: 'moderate',
      sleep_hours: 7,
      alcohol_intake: 'moderate',
      dietary_preference: 'omnivore',
      primary_health_concern: 'Test concern',
      shipping_name: 'Test User',
      shipping_address_line1: '123 Test St',
      shipping_city: 'Test City',
      shipping_state: 'CA',
      shipping_postal_code: '12345',
      shipping_country: 'US',
      shipping_phone: '1234567890',
      energy_levels: 'yes',
      effort_fatigue: 'no',
      caffeine_effect: 'yes',
      digestive_issues: 'no',
      stress_levels: 'yes',
      sleep_quality: 'no',
      mood_changes: 'no',
      brain_fog: 'yes',
      sugar_cravings: 'no',
      skin_issues: 'no',
      joint_pain: 'no',
      immune_system: 'yes',
      workout_recovery: 'no',
      food_sensitivities: 'no',
      weight_management: 'yes',
      medication_history: 'no',
      referral_code: 'TEST' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Testing full profile save:', fullProfile);
    
    const { error: fullError } = await supabase
      .from('user_profiles')
      .upsert(fullProfile, { onConflict: 'id' });
    
    if (fullError) {
      console.error('Full profile save failed:', fullError);
      return NextResponse.json({ 
        error: 'Full profile save failed',
        details: fullError,
        code: fullError.code,
        message: fullError.message,
        hint: fullError.hint,
        failedFields: Object.keys(fullProfile)
      }, { status: 500 });
    }
    
    // Get the saved profile to verify
    const { data: savedProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (fetchError) {
      return NextResponse.json({ 
        error: 'Failed to fetch saved profile',
        details: fetchError 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Profile save test completed successfully',
      savedProfile,
      userId: user.id
    });
    
  } catch (error) {
    console.error('Test profile save error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 