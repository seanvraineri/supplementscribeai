'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Shield, Zap, Package, Store, MapPin } from 'lucide-react';

export default function ShopifyVerify() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runVerification = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/shopify-verify-real');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ 
        status: '❌ NETWORK ERROR', 
        error: 'Network error',
        message: 'Could not reach verification endpoint'
      });
    }
    
    setLoading(false);
  };

  const isSuccess = result?.status?.includes('SUCCESS');
  const isError = result?.status?.includes('FAILED') || result?.status?.includes('ERROR');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 Shopify Integration Verification
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive testing to ensure your Shopify connection is REAL and ready for supplement ordering
          </p>
        </div>

        {/* Verification Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">🧪 Deep Verification Test</CardTitle>
            <p className="text-gray-600">
              This will test multiple Shopify API endpoints to verify everything is working correctly
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button 
              onClick={runVerification}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Running Comprehensive Verification...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Run Deep Verification
                </div>
              )}
            </Button>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Status Card */}
                <Card className={`${
                  isSuccess ? 'border-green-200 bg-green-50' : 
                  isError ? 'border-red-200 bg-red-50' : 
                  'border-yellow-200 bg-yellow-50'
                }`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${
                      isSuccess ? 'text-green-800' : 
                      isError ? 'text-red-800' : 
                      'text-yellow-800'
                    }`}>
                      {isSuccess ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      {result.status}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{result.message}</p>
                  </CardContent>
                </Card>

                {/* Verification Results */}
                {result.verification && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Verification Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Shop Connection:</span>
                            <span className="font-medium">{result.verification.shopConnection}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Products Access:</span>
                            <span className="font-medium">{result.verification.productsAccess}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>OK Capsule Products:</span>
                            <span className="font-medium">{result.verification.okCapsuleProducts}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Locations Access:</span>
                            <span className="font-medium">{result.verification.locationsAccess}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Store Information */}
                {result.shop && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Store className="w-5 h-5" />
                        Store Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div><strong>Name:</strong> {result.shop.name}</div>
                          <div><strong>Domain:</strong> {result.shop.domain}</div>
                          <div><strong>Email:</strong> {result.shop.email}</div>
                        </div>
                        <div className="space-y-2">
                          <div><strong>Currency:</strong> {result.shop.currency}</div>
                          <div><strong>Plan:</strong> {result.shop.plan}</div>
                          <div><strong>Timezone:</strong> {result.shop.timezone}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Product Catalog */}
                {result.catalog && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Product Catalog
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <strong>Total Products:</strong> {result.catalog.totalProducts}
                          </div>
                          <div>
                            <strong>OK Capsule Products:</strong> {result.catalog.okCapsuleProducts}
                          </div>
                        </div>
                        
                        {result.catalog.sampleProducts && result.catalog.sampleProducts.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Sample Products:</h4>
                            <div className="space-y-2">
                              {result.catalog.sampleProducts.map((product: any) => (
                                <div key={product.id} className="bg-gray-50 p-3 rounded">
                                  <div><strong>{product.title}</strong></div>
                                  <div className="text-sm text-gray-600">
                                    Vendor: {product.vendor} | Status: {product.status} | Variants: {product.variants}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* OK Capsule Supplements */}
                {result.okCapsuleSupplements && result.okCapsuleSupplements.length > 0 && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-800">
                        <Package className="w-5 h-5" />
                        💊 OK Capsule Supplements Found!
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {result.okCapsuleSupplements.map((supplement: any) => (
                          <div key={supplement.id} className="bg-white p-3 rounded border">
                            <div><strong>{supplement.title}</strong></div>
                            <div className="text-sm text-gray-600">
                              ID: {supplement.id} | Variants: {supplement.variants} | First Variant ID: {supplement.firstVariantId}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Locations */}
                {result.locations && result.locations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Store Locations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {result.locations.map((location: any) => (
                          <div key={location.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                            <span><strong>{location.name}</strong></span>
                            <span className={`px-2 py-1 rounded text-sm ${
                              location.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {location.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Order Readiness */}
                {result.readyForOrders && (
                  <Card className={result.readyForOrders.canCreateOrders ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${
                        result.readyForOrders.canCreateOrders ? 'text-green-800' : 'text-yellow-800'
                      }`}>
                        <Zap className="w-5 h-5" />
                        🚀 Order Creation Readiness
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Has Products:</span>
                          <span>{result.readyForOrders.hasProducts ? '✅ Yes' : '❌ No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Has OK Capsule:</span>
                          <span>{result.readyForOrders.hasOKCapsule ? '✅ Yes' : '❌ No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Has Locations:</span>
                          <span>{result.readyForOrders.hasLocations ? '✅ Yes' : '❌ No'}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Ready for Automatic Orders:</span>
                          <span>{result.readyForOrders.canCreateOrders ? '🎉 YES!' : '⚠️ Not Yet'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Raw Data */}
                <details className="bg-gray-100 p-3 rounded-lg">
                  <summary className="cursor-pointer font-medium">View Complete Raw Response</summary>
                  <pre className="mt-2 text-sm overflow-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 