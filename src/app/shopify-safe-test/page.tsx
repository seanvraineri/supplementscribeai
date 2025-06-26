'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Shield, Zap } from 'lucide-react';

export default function ShopifySafeTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/shopify-safe-test');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ 
        status: '❌ NETWORK ERROR', 
        error: 'Network error',
        message: 'Could not reach API endpoint - check if server is running'
      });
    }
    
    setLoading(false);
  };

  const isSuccess = result?.status?.includes('SUCCESS');
  const isError = result?.status?.includes('FAILED') || result?.status?.includes('ERROR');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Shopify API Safe Test
          </h1>
          <p className="text-xl text-gray-600">
            Testing your Shopify integration for SupplementScribe AI
          </p>
        </div>

        {/* Safety Card */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Shield className="w-5 h-5" />
              🛡️ Safety Guarantees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>Read-only operation</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>No orders created</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>No data modified</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completely isolated from main app</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Connection Test</CardTitle>
            <p className="text-gray-600">
              This will test if we can connect to your Shopify store: <strong>uswxpu-zg.myshopify.com</strong>
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button 
              onClick={testConnection}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Testing Connection...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Test Shopify Connection
                </div>
              )}
            </Button>

            {/* Results */}
            {result && (
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
                  <div className="space-y-4">
                    <p className="font-medium">{result.message}</p>
                    
                    {/* Success: Store Information */}
                    {result.shop && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 text-green-800">🏪 Store Information:</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div><strong>Name:</strong> {result.shop.name}</div>
                          <div><strong>Domain:</strong> {result.shop.domain}</div>
                          <div><strong>Email:</strong> {result.shop.email}</div>
                          <div><strong>Currency:</strong> {result.shop.currency}</div>
                          <div><strong>Plan:</strong> {result.shop.plan}</div>
                        </div>
                      </div>
                    )}

                    {/* Safety Info */}
                    {result.safety && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 text-blue-800">🛡️ Safety Status:</h4>
                        <div className="space-y-1">
                          <div><strong>Operation:</strong> {result.safety.operation}</div>
                          <div><strong>Data Modified:</strong> {result.safety.dataModified ? '❌ Yes' : '✅ No'}</div>
                          <div><strong>Orders Created:</strong> {result.safety.ordersCreated ? '❌ Yes' : '✅ No'}</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Error Information */}
                    {result.error && (
                      <div className="bg-red-100 p-4 rounded-lg border border-red-200">
                        <h4 className="font-semibold text-red-800 mb-2">Error Details:</h4>
                        <p className="text-red-700">{result.error}</p>
                        {result.required && (
                          <div className="mt-2">
                            <strong>Required Environment Variables:</strong>
                            <ul className="list-disc list-inside mt-1">
                              {result.required.map((req: string) => (
                                <li key={req}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Raw Data */}
                    <details className="bg-gray-100 p-3 rounded-lg">
                      <summary className="cursor-pointer font-medium">View Raw Response</summary>
                      <pre className="mt-2 text-sm overflow-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </details>

                    {/* Next Steps */}
                    {isSuccess && (
                      <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">🎉 Next Steps:</h4>
                        <ul className="text-green-700 space-y-1">
                          <li>✅ Shopify connection is working!</li>
                          <li>✅ Ready to test product fetching</li>
                          <li>✅ Ready to build supplement ordering system</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle>📋 Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Make sure you've added your Shopify access token to <code className="bg-gray-200 px-1 rounded">.env.local</code></li>
              <li>Click "Test Shopify Connection" above</li>
              <li>If successful, we can proceed to build the supplement ordering system</li>
              <li>If failed, we'll debug the credentials together</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 