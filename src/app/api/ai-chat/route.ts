import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // Parse the request body to get message and conversation_id
    const { message, conversation_id } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      headers: {
        Authorization: authHeader,
      },
      body: {
        message,
        conversation_id
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      return NextResponse.json({ 
        error: error.message || 'Failed to process chat message' 
      }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
} 