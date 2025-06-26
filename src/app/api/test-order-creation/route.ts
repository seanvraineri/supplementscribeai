import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, supplementPlanId, supplements } = await request.json();

    console.log('Testing order creation with data:', {
      userId,
      supplementPlanId,
      supplements
    });

    // Call the Supabase Edge Function
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-shopify-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
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