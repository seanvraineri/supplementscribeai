import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Test authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Auth error', 
        details: authError.message 
      }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'No user found' 
      }, { status: 401 });
    }

    // Test database access
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, full_name')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      profile: profile || null,
      profileError: profileError?.message || null,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Server error', 
      details: error.message 
    }, { status: 500 });
  }
} 