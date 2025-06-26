'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestCompleteFlow() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const checkCurrentUser = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    
    if (user) {
      // Get user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setCurrentUser({ ...user, profile });
    }
  };

  const testCompletePlanGeneration = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Please log in first to test the complete flow');
        return;
      }

      console.log('🧪 Testing complete flow for user:', user.id);

      // Call the generate-plan function (this should trigger automatic order creation)
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          userId: user.id
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        console.log('✅ Complete flow test successful:', data);
        
        // Check if order was created
        if (data.order?.created) {
          console.log('🛒 Automatic order created:', data.order.shopifyOrderId);
        } else {
          console.log('ℹ️ No order created:', data.order?.reason);
        }
      } else {
        setError(data.error || 'Unknown error');
        console.error('❌ Complete flow test failed:', data);
      }

    } catch (err: any) {
      setError(err.message);
      console.error('Test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testOrderHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please log in first');
        return;
      }

      // Get user's order history
      const { data: orders, error: orderError } = await supabase
        .from('supplement_orders')
        .select(`
          *,
          supplement_plans!inner(plan_details)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (orderError) {
        setError(orderError.message);
        return;
      }

      setResult({
        type: 'order_history',
        orders: orders || [],
        user_id: user.id
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Sign up a test user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: `test-${Date.now()}@supplementscribe.ai`,
        password: 'testpassword123'
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (authData.user) {
        // Create test profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            full_name: 'Test User',
            age: 30,
            gender: 'male',
            subscription_tier: 'full',
            health_goals: ['energy_performance', 'athletic_performance'],
            activity_level: 'high',
            sleep_hours: 7,
            energy_levels: 'low',
            brain_fog: 'yes',
            anxiety_level: 'moderate'
          });

        if (profileError) {
          setError(profileError.message);
          return;
        }

        setResult({
          type: 'user_created',
          user: authData.user,
          message: 'Test user created successfully! You can now test plan generation.'
        });
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Complete User Journey Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current User Status</h2>
          
          <button
            onClick={checkCurrentUser}
            className="mb-4 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Check Current User
          </button>
          
          {currentUser && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p><strong>User ID:</strong> {currentUser.id}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              {currentUser.profile && (
                <>
                  <p><strong>Name:</strong> {currentUser.profile.full_name}</p>
                  <p><strong>Subscription:</strong> {currentUser.profile.subscription_tier}</p>
                  <p><strong>Health Goals:</strong> {currentUser.profile.health_goals?.join(', ')}</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          
          <div className="space-y-4">
            <button
              onClick={createTestUser}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : '👤 Create Test User & Profile'}
            </button>
            
            <button
              onClick={testCompletePlanGeneration}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : '🧬 Test Complete Flow: Plan Generation + Auto Order'}
            </button>
            
            <button
              onClick={testOrderHistory}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : '📋 Check Order History'}
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
            <h3 className="text-green-800 font-semibold mb-2">✅ Result</h3>
            
            {result.type === 'order_history' && (
              <div>
                <p className="mb-2">Found {result.orders.length} orders for user {result.user_id}</p>
                {result.orders.map((order: any, index: number) => (
                  <div key={order.id} className="bg-white p-3 rounded mb-2">
                    <p><strong>Order #{index + 1}:</strong> Shopify ID {order.shopify_order_id}</p>
                    <p><strong>Date:</strong> {order.order_date}</p>
                    <p><strong>Next Order:</strong> {order.next_order_date}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Total:</strong> ${order.order_total}</p>
                  </div>
                ))}
              </div>
            )}
            
            {result.plan && (
              <div>
                <p className="mb-2"><strong>Plan Generated:</strong> {result.plan.recommendations?.length} supplements</p>
                <p className="mb-2"><strong>Personalization Tier:</strong> {result.personalization_tier}</p>
                
                {result.order && (
                  <div className="bg-blue-50 p-3 rounded mt-2">
                    <p><strong>🛒 Order Status:</strong> {result.order.created ? 'CREATED' : 'NOT CREATED'}</p>
                    {result.order.created && (
                      <>
                        <p><strong>Shopify Order ID:</strong> {result.order.shopifyOrderId}</p>
                        <p><strong>Next Order Date:</strong> {result.order.nextOrderDate}</p>
                      </>
                    )}
                    {result.order.reason && (
                      <p><strong>Reason:</strong> {result.order.reason}</p>
                    )}
                  </div>
                )}
                
                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold">View Full Response</summary>
                  <pre className="text-sm text-green-700 overflow-auto mt-2">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            )}
            
            {result.type !== 'order_history' && !result.plan && (
              <pre className="text-sm text-green-700 overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-semibold mb-2">🧪 Test Instructions</h3>
          <ol className="text-yellow-700 space-y-1 list-decimal list-inside">
            <li>First check if you're logged in</li>
            <li>If not logged in, create a test user</li>
            <li>Test the complete plan generation flow</li>
            <li>Check if automatic order was created</li>
            <li>Review order history</li>
          </ol>
        </div>
      </div>
    </div>
  );
}