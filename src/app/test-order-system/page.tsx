'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestOrderSystem() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testOrderCreation = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const supabase = createClient();

      // Test the create-shopify-order function directly
      const testData = {
        userId: '12345678-1234-1234-1234-123456789012', // Test UUID
        supplementPlanId: '87654321-4321-4321-4321-210987654321', // Test UUID
        supplements: [
          'Vitamin D',
          'Magnesium',
          'Omega 3',
          'Vitamin B12',
          'Ashwagandha',
          'CoQ10'
        ]
      };

      console.log('Testing order creation with:', testData);

      const response = await fetch('/api/test-order-creation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        console.log('✅ Order creation test successful:', data);
      } else {
        setError(data.error || 'Unknown error');
        console.error('❌ Order creation test failed:', data);
      }

    } catch (err: any) {
      setError(err.message);
      console.error('Test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Please log in first');
        return;
      }

      console.log('Testing plan generation for user:', user.id);

      // Call the generate-plan function
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          userId: user.id
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        console.log('✅ Plan generation test successful:', data);
      } else {
        setError(data.error || 'Unknown error');
        console.error('❌ Plan generation test failed:', data);
      }

    } catch (err: any) {
      setError(err.message);
      console.error('Test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Order System Testing
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Options</h2>
          
          <div className="space-y-4">
            <button
              onClick={testOrderCreation}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : '🛒 Test Direct Order Creation'}
            </button>
            
            <button
              onClick={testGeneratePlan}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : '🧬 Test Plan Generation + Auto Order'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold">❌ Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-green-800 font-semibold mb-2">✅ Success</h3>
            <pre className="text-sm text-green-700 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-semibold mb-2">📋 System Status</h3>
          <ul className="text-yellow-700 space-y-1">
            <li>✅ Database table: supplement_orders created</li>
            <li>✅ Edge function: create-shopify-order deployed</li>
            <li>✅ Edge function: process-recurring-orders deployed</li>
            <li>✅ Edge function: generate-plan updated with auto-order</li>
            <li>🔄 Ready for testing!</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 