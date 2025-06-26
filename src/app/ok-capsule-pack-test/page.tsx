'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Shield, Package, Pill, Zap, Shuffle, Sparkles } from 'lucide-react';

export default function OKCapsulePackTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Multiple weird/random supplement combinations to test
  const supplementCombinations = {
    'weird-mix-1': {
      name: '🤪 Weird Mix #1',
      supplements: [
        { name: 'Cordyceps Mushroom', handle: 'cordyceps-mushroom' },
        { name: 'Rhodiola Rosea', handle: 'rhodiola-rosea' },
        { name: 'Black Seed Oil', handle: 'black-seed-oil' },
        { name: 'Spirulina', handle: 'spirulina' },
        { name: 'Milk Thistle', handle: 'milk-thistle' },
        { name: 'Saw Palmetto', handle: 'saw-palmetto' }
      ]
    },
    'random-combo': {
      name: '🎲 Random Combo',
      supplements: [
        { name: 'Pine Bark Extract', handle: 'pine-bark-extract' },
        { name: 'Ginkgo Biloba', handle: 'ginkgo-biloba' },
        { name: 'Boswellia', handle: 'boswellia' },
        { name: 'Chaga Mushroom', handle: 'chaga-mushroom' },
        { name: 'Elderberry', handle: 'elderberry' },
        { name: 'Bitter Melon', handle: 'bitter-melon' }
      ]
    },
    'exotic-blend': {
      name: '🌿 Exotic Blend',
      supplements: [
        { name: 'Schisandra Berry', handle: 'schisandra-berry' },
        { name: 'Tongkat Ali', handle: 'tongkat-ali' },
        { name: 'Mucuna Pruriens', handle: 'mucuna-pruriens' },
        { name: 'Bacopa Monnieri', handle: 'bacopa-monnieri' },
        { name: 'Reishi Mushroom', handle: 'reishi-mushroom' },
        { name: 'Astragalus', handle: 'astragalus' }
      ]
    },
    'totally-random': {
      name: '🤯 Totally Random',
      supplements: [
        { name: 'Cat\'s Claw', handle: 'cats-claw' },
        { name: 'Horny Goat Weed', handle: 'horny-goat-weed' },
        { name: 'Fo-Ti', handle: 'fo-ti' },
        { name: 'Jiaogulan', handle: 'jiaogulan' },
        { name: 'Suma Root', handle: 'suma-root' },
        { name: 'Dragon\'s Blood', handle: 'dragons-blood' }
      ]
    },
    'ai-favorites': {
      name: '🤖 AI Favorites',
      supplements: [
        { name: 'Berberine', handle: 'berberine' },
        { name: 'Ashwagandha', handle: 'ashwagandha' },
        { name: 'NAC', handle: 'nac' },
        { name: 'Lion\'s Mane', handle: 'lions-mane' },
        { name: 'Quercetin', handle: 'quercetin' },
        { name: 'Alpha Lipoic Acid', handle: 'alpha-lipoic-acid' }
      ]
    }
  };

  const [currentCombo, setCurrentCombo] = useState<string>('ai-favorites');

  const testPackBuilder = async (comboKey?: string) => {
    setLoading(true);
    setResult(null);
    
    const combo = comboKey ? supplementCombinations[comboKey as keyof typeof supplementCombinations] : supplementCombinations[currentCombo as keyof typeof supplementCombinations];
    
    try {
      const response = await fetch('/api/ok-capsule-pack-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplements: combo.supplements,
          customerInfo: {
            email: 'test@supplementscribe.ai',
            firstName: 'Test',
            lastName: 'User'
          }
        })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ 
        status: '❌ NETWORK ERROR', 
        error: 'Network error',
        message: 'Could not reach pack test endpoint'
      });
    }
    
    setLoading(false);
  };

  const isSuccess = result?.status?.includes('SUCCESS');
  const isError = result?.status?.includes('FAILED') || result?.status?.includes('ERROR');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧬 Custom 6-Pack Builder Test
          </h1>
          <p className="text-xl text-gray-600">
            Testing ANY combination of 6 supplements with OK Capsule custom pack creation
          </p>
        </div>

        {/* Safety Card */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Shield className="w-5 h-5" />
              🛡️ Safety Mode - Custom Pack Testing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>Test mode only</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>No real orders created</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>Testing custom combinations</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>Validating ANY 6-supplement pack</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supplement Combination Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="w-5 h-5" />
              Choose Your Weird Supplement Combo
            </CardTitle>
            <p className="text-gray-600">
              Pick any combination to prove custom packs work with ANY supplements!
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(supplementCombinations).map(([key, combo]) => (
                <Button
                  key={key}
                  variant={currentCombo === key ? "default" : "outline"}
                  onClick={() => setCurrentCombo(key)}
                  className="h-auto p-4 flex flex-col items-start gap-2"
                >
                  <div className="font-semibold">{combo.name}</div>
                  <div className="text-xs text-left opacity-80">
                    {combo.supplements.slice(0, 3).map(s => s.name).join(', ')}...
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Test Supplements */}
        <Card className="mb-8 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Pill className="w-5 h-5" />
              Current Test Pack: {supplementCombinations[currentCombo as keyof typeof supplementCombinations]?.name}
            </CardTitle>
            <p className="text-purple-600">
              Testing this {currentCombo.includes('weird') || currentCombo.includes('random') ? 'WEIRD' : 'custom'} combination to prove ANY 6 supplements work!
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {supplementCombinations[currentCombo as keyof typeof supplementCombinations]?.supplements.map((supplement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{supplement.name}</div>
                    <div className="text-sm text-gray-600">Handle: {supplement.handle}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">🧪 Custom Pack Builder Test</CardTitle>
            <p className="text-gray-600">
              Test the selected combination or try all the weird ones!
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Main Test Button */}
            <Button 
              onClick={() => testPackBuilder()}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Testing {supplementCombinations[currentCombo as keyof typeof supplementCombinations]?.name}...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Test {supplementCombinations[currentCombo as keyof typeof supplementCombinations]?.name}
                </div>
              )}
            </Button>

            {/* Quick Test All Button */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                onClick={() => testPackBuilder('weird-mix-1')}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Test Weird Mix #1
              </Button>
              <Button 
                onClick={() => testPackBuilder('totally-random')}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Shuffle className="w-4 h-4" />
                Test Totally Random
              </Button>
            </div>

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

                    {/* Tested Supplements */}
                    {result.testSupplements && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 text-purple-800">🧪 Tested Supplements:</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.testSupplements.map((supplement: any, index: number) => (
                            <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                              {supplement.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Pack Product Info */}
                    {result.packProduct && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 text-green-800">📦 Pack Product Found:</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div><strong>Title:</strong> {result.packProduct.title}</div>
                          <div><strong>ID:</strong> {result.packProduct.id}</div>
                          <div><strong>Variant ID:</strong> {result.packProduct.variantId}</div>
                          <div><strong>Handle:</strong> {result.packProduct.handle}</div>
                          <div><strong>Customizable:</strong> {result.packProduct.isCustomizable ? '✅ Yes' : '❌ No'}</div>
                        </div>
                      </div>
                    )}

                    {/* Custom Capabilities */}
                    {result.customCapabilities && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 text-purple-800">🧬 Custom Pack Capabilities:</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            {result.customCapabilities.canCreateCustomPacks ? 
                              <CheckCircle className="w-4 h-4 text-green-600" /> : 
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            }
                            <span>Can Create Custom Packs</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {result.customCapabilities.supportsAnySupplementCombination ? 
                              <CheckCircle className="w-4 h-4 text-green-600" /> : 
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            }
                            <span>Any Supplement Combination</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {result.customCapabilities.lineItemPropertiesWorking ? 
                              <CheckCircle className="w-4 h-4 text-green-600" /> : 
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            }
                            <span>Line Item Properties Working</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {result.customCapabilities.readyForAIIntegration ? 
                              <CheckCircle className="w-4 h-4 text-green-600" /> : 
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            }
                            <span>Ready for AI Integration</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Line Item Properties */}
                    {result.lineItemProperties && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 text-blue-800">🏷️ Custom Line Item Properties:</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {Object.entries(result.lineItemProperties).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                              <span className="font-mono text-sm">{key}:</span>
                              <span className="text-sm">{value as string}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Custom Order Structure */}
                    {result.customOrderStructure && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 text-indigo-800">📋 What Customer Actually Sees:</h4>
                        <div className="space-y-4">
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h5 className="font-semibold text-green-800 mb-2">✅ Order Line Item (What Customer Sees):</h5>
                            <div className="space-y-2">
                              <div><strong>Product Title:</strong> {result.customOrderStructure.order.line_items[0].title}</div>
                              <div><strong>Product Name:</strong> {result.customOrderStructure.order.line_items[0].name}</div>
                              {result.customOrderStructure.order.line_items[0].custom_attributes && (
                                <div>
                                  <strong>Custom Attributes:</strong>
                                  <ul className="ml-4 mt-1">
                                    {result.customOrderStructure.order.line_items[0].custom_attributes.map((attr: any, index: number) => (
                                      <li key={index} className="text-sm">
                                        <strong>{attr.key}:</strong> {attr.value}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h5 className="font-semibold text-blue-800 mb-2">📧 Order Details (Email/Confirmation):</h5>
                            <div className="space-y-2">
                              <div><strong>Order Note:</strong> {result.customOrderStructure.order.note}</div>
                              <div><strong>Tags:</strong> {result.customOrderStructure.order.tags}</div>
                              {result.customOrderStructure.order.note_attributes && (
                                <div>
                                  <strong>Note Attributes:</strong>
                                  <ul className="ml-4 mt-1">
                                    {result.customOrderStructure.order.note_attributes.map((attr: any, index: number) => (
                                      <li key={index} className="text-sm">
                                        <strong>{attr.name}:</strong> {attr.value}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <h5 className="font-semibold text-red-800 mb-2">⚠️ Backend Product (Customer Never Sees This):</h5>
                            <div className="text-sm text-red-700">
                              The "{result.packProduct?.title}" is just the backend container product. 
                              Customers see the custom title and description above, not this backend product name.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Custom Pack Validation */}
                    {result.customPackValidation && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 text-indigo-800">✅ Custom Pack Validation:</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div><strong>Pack Type:</strong> {result.customPackValidation.packType}</div>
                          <div><strong>Supplement Count:</strong> {result.customPackValidation.supplementCount}</div>
                          <div><strong>Properties Count:</strong> {result.customPackValidation.propertiesCount}</div>
                          <div><strong>AI Generated:</strong> {result.customPackValidation.aiGenerated ? '✅ Yes' : '❌ No'}</div>
                        </div>
                      </div>
                    )}

                    {/* Test Results */}
                    {result.tests && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 text-indigo-800">🧪 Test Results:</h4>
                        <div className="space-y-2">
                          {result.tests.map((test: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              {test.passed ? 
                                <CheckCircle className="w-4 h-4 text-green-600" /> : 
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              }
                              <span className={test.passed ? 'text-green-700' : 'text-red-700'}>
                                {test.name}: {test.result}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Error Information */}
                    {result.error && (
                      <div className="bg-red-100 p-4 rounded-lg border border-red-200">
                        <h4 className="font-semibold text-red-800 mb-2">Error Details:</h4>
                        <p className="text-red-700">{result.error}</p>
                      </div>
                    )}
                    
                    {/* Raw Data */}
                    <details className="bg-gray-100 p-3 rounded-lg">
                      <summary className="cursor-pointer font-medium">View Complete Response</summary>
                      <pre className="mt-2 text-sm overflow-auto max-h-96">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </details>

                    {/* Next Steps */}
                    {isSuccess && (
                      <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">🎉 Custom Pack Success!</h4>
                        <ul className="text-green-700 space-y-1">
                          <li>✅ Custom 6-pack creation validated!</li>
                          <li>✅ ANY supplement combination works!</li>
                          <li>✅ Ready to integrate with generate-plan function</li>
                          <li>✅ Ready to build Supabase Edge Function for orders</li>
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
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              📋 Custom Pack Test Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-bold mt-0.5">1</div>
                <div>Choose any weird/random supplement combination from the buttons above</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-bold mt-0.5">2</div>
                <div>Click "Test" to validate that OK Capsule can create custom packs</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-bold mt-0.5">3</div>
                <div>See how ANY 6 supplements get mapped to custom line item properties</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-bold mt-0.5">4</div>
                <div>Proves our AI can generate ANY combination for custom fulfillment!</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 