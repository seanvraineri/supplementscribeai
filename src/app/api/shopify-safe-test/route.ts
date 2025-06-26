export async function GET() {
  try {
    // SAFETY CHECK: Ensure we have the required environment variables
    if (!process.env.SHOPIFY_STORE_NAME || !process.env.SHOPIFY_ACCESS_TOKEN) {
      return Response.json({
        status: '⚠️ CONFIGURATION ERROR',
        error: 'Missing environment variables',
        message: 'Please check your .env.local file',
        required: ['SHOPIFY_STORE_NAME', 'SHOPIFY_ACCESS_TOKEN']
      }, { status: 400 });
    }

    // SAFE: Only testing basic connection - NO DATA MODIFICATION
    const shopifyUrl = `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/shop.json`;
    
    const response = await fetch(shopifyUrl, {
      method: 'GET', // READ-ONLY operation
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN!,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return Response.json({
        status: '❌ CONNECTION FAILED',
        error: `HTTP ${response.status}: ${response.statusText}`,
        message: 'Check your access token and store name',
        shopifyUrl: shopifyUrl.replace(process.env.SHOPIFY_ACCESS_TOKEN!, '[HIDDEN]'),
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    const data = await response.json();
    
    return Response.json({
      status: '✅ CONNECTION SUCCESS',
      shop: {
        name: data.shop.name,
        domain: data.shop.domain,
        email: data.shop.email,
        currency: data.shop.currency,
        plan: data.shop.plan_name
      },
      message: 'Shopify API connection successful! Ready for supplement ordering.',
      timestamp: new Date().toISOString(),
      safety: {
        operation: 'READ-ONLY',
        dataModified: false,
        ordersCreated: false
      }
    });

  } catch (error: any) {
    return Response.json({
      status: '❌ SYSTEM ERROR',
      error: error.message,
      message: 'Connection failed - check your credentials and network',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 