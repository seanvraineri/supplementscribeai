import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, supplementPlanId, supplements } = await request.json();

    console.log('Testing order creation with data:', {
      userId,
      supplementPlanId,
      supplements
    });

    // Use local Supabase for testing
    const isLocal = process.env.NODE_ENV === 'development';
    const supabaseUrl = isLocal ? 'http://127.0.0.1:54321' : process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = isLocal ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('Using Supabase URL:', supabaseUrl);

    // Call the Supabase Edge Function
    const response = await fetch(`${supabaseUrl}/functions/v1/create-shopify-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        userId,
        supplementPlanId,
        supplements
      })
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Order creation test completed',
        result
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Order creation failed',
        details: result
      }, { status: response.status });
    }

  } catch (error: any) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
} 