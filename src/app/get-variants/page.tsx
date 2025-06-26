"use client";

import { useState, useEffect } from 'react';

export default function GetVariants() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/get-product-variants')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading products...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopify Products & Variant IDs</h1>
      
      <div className="space-y-6">
        {products.map((product: any, index: number) => (
          <div key={index} className="border rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">{product.node.title}</h2>
            <p className="text-gray-600 mb-4">Handle: {product.node.handle}</p>
            <p className="text-gray-600 mb-4">Product ID: {product.node.id}</p>
            
            <h3 className="font-semibold mb-2">Variants:</h3>
            <div className="space-y-2">
              {product.node.variants.edges.map((variant: any, vIndex: number) => (
                <div key={vIndex} className="bg-white p-3 rounded border">
                  <p><strong>Variant ID:</strong> <code className="bg-gray-200 px-2 py-1 rounded text-sm">{variant.node.id}</code></p>
                  <p><strong>Title:</strong> {variant.node.title}</p>
                  <p><strong>Price:</strong> ${variant.node.price.amount}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Next Steps:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Find your "Software Only" product ($19.99) and copy its variant ID</li>
          <li>Find your "Complete Package" product ($75.00) and copy its variant ID</li>
          <li>Update the variant IDs in the checkout API code</li>
        </ol>
      </div>
    </div>
  );
} 