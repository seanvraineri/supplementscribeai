'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, Package, Search, Zap, Pill } from 'lucide-react';

export default function ShopifyFullCatalog() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFullCatalog = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/shopify-full-catalog');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ 
        status: '❌ NETWORK ERROR', 
        error: 'Network error',
        message: 'Could not reach catalog endpoint'
      });
    }
    
    setLoading(false);
  };

  const isSuccess = result?.status?.includes('SUCCESS');
  const isError = result?.status?.includes('FAILED') || result?.status?.includes('ERROR');

  // Filter supplements based on search term
  const filteredSupplements = result?.catalog?.filter((supplement: any) =>
    supplement.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📦 Complete OK Capsule Supplement Catalog
          </h1>
          <p className="text-xl text-gray-600">
            View all 56 supplements available for AI-powered personalized recommendations
          </p>
        </div>

        {/* Fetch Button */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">🔍 Fetch Complete Catalog</CardTitle>
            <p className="text-gray-600">
              This will retrieve ALL OK Capsule supplements from your Shopify store
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button 
              onClick={fetchFullCatalog}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Fetching All Supplements...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Fetch Complete Catalog (All 56 Supplements)
                </div>
              )}
            </Button>

            {/* Results Summary */}
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

                {/* Summary Stats */}
                {result.summary && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="w-5 h-5" />
                        Catalog Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600">{result.summary.totalSupplements}</div>
                          <div className="text-blue-800">Total Supplements</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-3xl font-bold text-green-600">
                            {result.aiIntegrationReady?.estimatedCombinations || 'Millions'}
                          </div>
                          <div className="text-green-800">Possible 6-Packs</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-3xl font-bold text-purple-600">
                            {result.aiIntegrationReady?.canCreate6Packs ? '✅' : '❌'}
                          </div>
                          <div className="text-purple-800">AI Ready</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Search and Filter */}
                {result.catalog && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Search Supplements ({result.catalog.length} total)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <Input
                          placeholder="Search supplements by name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        Showing {filteredSupplements.length} of {result.catalog.length} supplements
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Supplement Grid */}
                {filteredSupplements.length > 0 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSupplements.map((supplement: any) => (
                      <Card key={supplement.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{supplement.title}</CardTitle>
                          <div className="text-sm text-gray-600">
                            Status: <span className={`px-2 py-1 rounded text-xs ${
                              supplement.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {supplement.status}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div><strong>Product ID:</strong> {supplement.id}</div>
                            <div><strong>Variant ID:</strong> {supplement.firstVariantId}</div>
                            <div><strong>Price:</strong> ${supplement.variants[0]?.price || 'N/A'}</div>
                            <div><strong>SKU:</strong> {supplement.variants[0]?.sku || 'N/A'}</div>
                            {supplement.description && (
                              <div className="text-gray-600 text-xs mt-2">
                                {supplement.description}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* AI Integration Info */}
                {result.aiIntegrationReady && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-800">
                        <Zap className="w-5 h-5" />
                        🤖 AI Integration Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Supplement Options:</span>
                          <span className="font-bold">{result.aiIntegrationReady.totalOptions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Can Create 6-Packs:</span>
                          <span className="font-bold">{result.aiIntegrationReady.canCreate6Packs ? '✅ Yes' : '❌ No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Possible Combinations:</span>
                          <span className="font-bold">{result.aiIntegrationReady.estimatedCombinations?.toLocaleString() || 'Unlimited'}</span>
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