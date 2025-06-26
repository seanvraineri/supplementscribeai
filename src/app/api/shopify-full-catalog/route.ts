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

    // Fetch ALL OK Capsule products (no limit)
    let allProducts: any[] = [];
    let hasNextPage = true;
    let pageInfo = '';

    while (hasNextPage) {
      let url = `${baseUrl}/products.json?vendor=ok-capsule&limit=250`;
      if (pageInfo) {
        url += `&page_info=${pageInfo}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        return Response.json({
          status: '❌ FAILED TO FETCH PRODUCTS',
          error: `HTTP ${response.status}: ${response.statusText}`
        }, { status: 500 });
      }

      const data = await response.json();
      allProducts = allProducts.concat(data.products);

      // Check for pagination
      const linkHeader = response.headers.get('Link');
      if (linkHeader && linkHeader.includes('rel="next"')) {
        // Extract page_info from Link header for next page
        const nextMatch = linkHeader.match(/<[^>]*[?&]page_info=([^&>]+)[^>]*>;\s*rel="next"/);
        if (nextMatch) {
          pageInfo = nextMatch[1];
        } else {
          hasNextPage = false;
        }
      } else {
        hasNextPage = false;
      }
    }

    // Process the complete catalog
    const supplementCatalog = allProducts.map((product: any) => ({
      id: product.id,
      title: product.title,
      vendor: product.vendor,
      status: product.status,
      handle: product.handle,
      variants: product.variants.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        price: variant.price,
        sku: variant.sku,
        inventory_quantity: variant.inventory_quantity
      })),
      firstVariantId: product.variants[0]?.id,
      description: product.body_html?.replace(/<[^>]*>/g, '').substring(0, 200) + '...' || 'No description'
    }));

    // Create a mapping object for easy AI integration
    const supplementMap = {};
    supplementCatalog.forEach((supplement: any) => {
      supplementMap[supplement.title] = {
        variantId: supplement.firstVariantId,
        productId: supplement.id,
        price: supplement.variants[0]?.price || '0',
        sku: supplement.variants[0]?.sku || ''
      };
    });

    return Response.json({
      status: '✅ FULL CATALOG SUCCESS',
      message: `Found ${allProducts.length} OK Capsule supplements in your catalog!`,
      summary: {
        totalSupplements: allProducts.length,
        vendor: 'ok-capsule',
        readyForAI: true
      },
      catalog: supplementCatalog,
      supplementMap: supplementMap,
      aiIntegrationReady: {
        totalOptions: allProducts.length,
        canCreate6Packs: allProducts.length >= 6,
        estimatedCombinations: Math.floor(allProducts.length * (allProducts.length - 1) * (allProducts.length - 2) * (allProducts.length - 3) * (allProducts.length - 4) * (allProducts.length - 5) / (6 * 5 * 4 * 3 * 2 * 1))
      },
      sampleSupplements: supplementCatalog.slice(0, 10).map(s => ({
        title: s.title,
        variantId: s.firstVariantId,
        price: s.variants[0]?.price
      })),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return Response.json({
      status: '❌ CATALOG FETCH FAILED',
      error: error.message,
      message: 'Failed to fetch complete supplement catalog'
    }, { status: 500 });
  }
} 