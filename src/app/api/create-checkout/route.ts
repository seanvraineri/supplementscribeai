import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_DOMAIN = 'uswxpu-zg.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Product variant IDs for checkout sessions
const PRODUCT_VARIANTS = {
  'software_only': 'gid://shopify/ProductVariant/42844557606995', // $19.99/month - Software Only
  'full': 'gid://shopify/ProductVariant/42844560490579', // $75/month - Complete Package
};

export async function POST(request: NextRequest) {
  try {
    console.log('Creating checkout session with Cart API...');
    
    const { tier, returnUrl } = await request.json();
    console.log('Tier:', tier, 'Return URL:', returnUrl);

    if (!STOREFRONT_ACCESS_TOKEN) {
      console.error('Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN');
      return NextResponse.json({ error: 'Missing Shopify configuration' }, { status: 500 });
    }

    if (!tier || !PRODUCT_VARIANTS[tier as keyof typeof PRODUCT_VARIANTS]) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const variantId = PRODUCT_VARIANTS[tier as keyof typeof PRODUCT_VARIANTS];
    console.log('Using variant ID:', variantId);

    // Create cart and get checkout URL using Cart API
    const cartMutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        lines: [
          {
            merchandiseId: variantId,
            quantity: 1
          }
        ]
      }
    };

    console.log('Making Shopify Cart API request...');
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: cartMutation,
        variables: variables,
      }),
    });

    console.log('Shopify response status:', response.status);
    const data = await response.json();
    console.log('Shopify response data:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return NextResponse.json({ 
        error: 'Shopify API error',
        details: data.errors 
      }, { status: 500 });
    }

    if (data.data.cartCreate.userErrors && data.data.cartCreate.userErrors.length > 0) {
      console.error('Cart creation errors:', data.data.cartCreate.userErrors);
      return NextResponse.json({ 
        error: 'Failed to create cart',
        details: data.data.cartCreate.userErrors 
      }, { status: 500 });
    }

    const cart = data.data.cartCreate.cart;
    if (!cart || !cart.checkoutUrl) {
      console.error('No cart or checkout URL returned');
      return NextResponse.json({ error: 'Failed to create checkout URL' }, { status: 500 });
    }

    // Create checkout URL (redirect will be handled by Shopify redirect theme)
    const checkoutUrl = `${cart.checkoutUrl}&skip_shop_pay=true`;
    console.log('Checkout session URL created:', checkoutUrl);

    return NextResponse.json({ 
      success: true,
      checkoutUrl: checkoutUrl,
      cartId: cart.id,
      totalAmount: cart.cost.totalAmount.amount
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 