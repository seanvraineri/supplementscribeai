import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('ai-health-analysis', {
      body: body
    });

    if (error) {
      console.error('Edge function error:', error);
      return NextResponse.json(
        { error: 'Failed to generate AI analysis', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 