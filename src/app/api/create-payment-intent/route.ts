import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
  try {
    const { tier, shippingAddress } = await req.json();
    
    // Determine which price ID to use
    const priceId = tier === 'complete' 
      ? process.env.STRIPE_COMPLETE_PACKAGE_PRICE_ID 
      : process.env.STRIPE_SOFTWARE_ONLY_PRICE_ID;

    // Get the price to determine the amount
    const price = await stripe.prices.retrieve(priceId!);
    
    if (!price.unit_amount) {
      throw new Error('Price not found');
    }

    // Create payment intent for one-time payment
    // Note: For subscriptions, you'd typically create a subscription instead
    const paymentIntentData: Stripe.PaymentIntentCreateParams = {
      amount: price.unit_amount,
      currency: 'usd',
      metadata: {
        tier: tier,
        priceId: priceId!,
      },
    };

    // Add shipping information if provided (for complete package)
    if (shippingAddress && tier === 'complete') {
      paymentIntentData.shipping = {
        name: shippingAddress.name,
        address: {
          line1: shippingAddress.address.line1,
          line2: shippingAddress.address.line2 || undefined,
          city: shippingAddress.address.city,
          state: shippingAddress.address.state,
          postal_code: shippingAddress.address.postal_code,
          country: shippingAddress.address.country,
        },
      };

      // Store phone number in metadata if provided
      if (shippingAddress.phone) {
        paymentIntentData.metadata!.shipping_phone = shippingAddress.phone;
      }

      // Add shipping address to metadata for later use in fulfillment
      paymentIntentData.metadata!.shipping_address = JSON.stringify(shippingAddress);
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
} 