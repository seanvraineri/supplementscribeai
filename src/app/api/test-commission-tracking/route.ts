import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, subscriptionTier } = await request.json();

    console.log('Testing commission tracking with data:', {
      userId,
      subscriptionTier
    });

    // Call the Supabase Edge Function
    const response = await fetch(`http://127.0.0.1:54321/functions/v1/track-affiliate-commission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0`
      },
      body: JSON.stringify({
        userId,
        subscriptionTier,
        stripeSubscriptionId: 'sub_test123',
        stripeCustomerId: 'cus_test123'
      })
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Commission tracking test completed',
        result
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Commission tracking failed',
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