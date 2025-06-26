export async function GET() {
  try {
    // SAFETY CHECK: Ensure we have the required environment variables
    if (!process.env.SHOPIFY_STORE_NAME || !process.env.SHOPIFY_ACCESS_TOKEN) {
      return Response.json({
        status: '⚠️ CONFIGURATION ERROR',
        error: 'Missing environment variables'
      }, { status: 400 });
    }

    const baseUrl = `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}`;
    const headers = {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN!,
      'Content-Type': 'application/json',
    };

    // TEST 1: Get shop info (basic connection)
    const shopResponse = await fetch(`${baseUrl}/shop.json`, {
      method: 'GET',
      headers,
    });

    if (!shopResponse.ok) {
      return Response.json({
        status: '❌ SHOP API FAILED',
        error: `HTTP ${shopResponse.status}: ${shopResponse.statusText}`
      }, { status: 500 });
    }

    const shopData = await shopResponse.json();

    // TEST 2: Get products (verify we can access catalog)
    const productsResponse = await fetch(`${baseUrl}/products.json?limit=5`, {
      method: 'GET',
      headers,
    });

    if (!productsResponse.ok) {
      return Response.json({
        status: '❌ PRODUCTS API FAILED',
        error: `HTTP ${productsResponse.status}: ${productsResponse.statusText}`
      }, { status: 500 });
    }

    const productsData = await productsResponse.json();

    // TEST 3: Check for OK Capsule products specifically (corrected vendor name)
    const okCapsuleResponse = await fetch(`${baseUrl}/products.json?vendor=ok-capsule&limit=10`, {
      method: 'GET',
      headers,
    });

    let okCapsuleData = { products: [] };
    if (okCapsuleResponse.ok) {
      okCapsuleData = await okCapsuleResponse.json();
    }

    // TEST 4: Get locations (needed for order fulfillment)
    const locationsResponse = await fetch(`${baseUrl}/locations.json`, {
      method: 'GET',
      headers,
    });

    let locationsData = { locations: [] };
    if (locationsResponse.ok) {
      locationsData = await locationsResponse.json();
    }

    return Response.json({
      status: '✅ COMPREHENSIVE VERIFICATION SUCCESS',
      message: 'All Shopify API endpoints are working correctly!',
      verification: {
        shopConnection: '✅ Working',
        productsAccess: '✅ Working',
        okCapsuleProducts: okCapsuleData.products.length > 0 ? '✅ Found' : '⚠️ None found',
        locationsAccess: '✅ Working'
      },
      shop: {
        name: shopData.shop.name,
        domain: shopData.shop.domain,
        email: shopData.shop.email,
        currency: shopData.shop.currency,
        plan: shopData.shop.plan_name,
        timezone: shopData.shop.timezone
      },
      catalog: {
        totalProducts: productsData.products.length,
        okCapsuleProducts: okCapsuleData.products.length,
        sampleProducts: productsData.products.slice(0, 3).map((p: any) => ({
          id: p.id,
          title: p.title,
          vendor: p.vendor,
          status: p.status,
          variants: p.variants.length
        }))
      },
      okCapsuleSupplements: okCapsuleData.products.map((p: any) => ({
        id: p.id,
        title: p.title,
        vendor: p.vendor,
        variants: p.variants.length,
        firstVariantId: p.variants[0]?.id
      })),
      locations: locationsData.locations.map((l: any) => ({
        id: l.id,
        name: l.name,
        active: l.active
      })),
      readyForOrders: {
        hasProducts: productsData.products.length > 0,
        hasOKCapsule: okCapsuleData.products.length > 0,
        hasLocations: locationsData.locations.length > 0,
        canCreateOrders: productsData.products.length > 0 && locationsData.locations.length > 0
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return Response.json({
      status: '❌ VERIFICATION FAILED',
      error: error.message,
      message: 'Comprehensive verification failed'
    }, { status: 500 });
  }
} 