import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Debug: Log cookies
    const cookies = request.headers.get('cookie');
    console.log('Test auth - Received cookies:', cookies ? 'Present' : 'None');
    
    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    return new Response(JSON.stringify({ 
      authenticated: !!user,
      user_id: user?.id || null,
      error: authError?.message || null,
      has_cookies: !!cookies
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Test auth error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 