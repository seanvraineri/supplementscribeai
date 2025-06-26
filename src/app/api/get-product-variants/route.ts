import { NextResponse } from 'next/server';

const SHOPIFY_DOMAIN = 'uswxpu-zg.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function GET() {
  try {
    const query = `
      {
        products(first: 20) {
          edges {
            node {
              id
              title
              handle
              availableForSale
              publishedAt
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    console.log('Fetching products from Storefront API...');
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    console.log('Storefront API response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return NextResponse.json({ error: 'GraphQL errors', details: data.errors }, { status: 500 });
    }

    return NextResponse.json({ 
      products: data.data.products.edges,
      totalCount: data.data.products.edges.length
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 