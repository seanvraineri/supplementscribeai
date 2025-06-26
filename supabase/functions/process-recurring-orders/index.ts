import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const today = new Date().toISOString().split('T')[0];
    console.log('Processing recurring orders for date:', today);

    // Find users who are due for their next order
    const { data: dueOrders, error: queryError } = await supabase
      .from('supplement_orders')
      .select(`
        id,
        user_id,
        supplement_plan_id,
        next_order_date,
        user_profiles!inner(
          id,
          full_name,
          subscription_tier
        ),
        supplement_plans!inner(
          id,
          plan_details
        )
      `)
      .eq('next_order_date', today)
      .eq('user_profiles.subscription_tier', 'full')
      .eq('status', 'delivered'); // Only create new orders for successfully delivered previous orders

    if (queryError) {
      console.error('Error querying due orders:', queryError);
      return new Response(JSON.stringify({ 
        error: 'Failed to query due orders',
        details: queryError 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    if (!dueOrders || dueOrders.length === 0) {
      console.log('No recurring orders due today');
      return new Response(JSON.stringify({ 
        message: 'No recurring orders due today',
        processedCount: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${dueOrders.length} users due for recurring orders`);

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Process each due order
    for (const order of dueOrders) {
      try {
        console.log(`Processing recurring order for user: ${order.user_id}`);

        // Extract supplement names from the latest plan
        const planDetails = (order as any).supplement_plans.plan_details;
        if (!planDetails || !planDetails.recommendations) {
          console.error(`No valid plan details for user ${order.user_id}`);
          results.push({
            userId: order.user_id,
            success: false,
            error: 'No valid supplement plan found'
          });
          errorCount++;
          continue;
        }

        const supplementNames = planDetails.recommendations.map((rec: any) => rec.supplement);
        
        if (supplementNames.length !== 6) {
          console.error(`Invalid supplement count for user ${order.user_id}: ${supplementNames.length}`);
          results.push({
            userId: order.user_id,
            success: false,
            error: `Invalid supplement count: ${supplementNames.length}`
          });
          errorCount++;
          continue;
        }

        // Check if order already exists for today (prevent duplicates)
        const { data: existingOrder } = await supabase
          .from('supplement_orders')
          .select('id')
          .eq('user_id', order.user_id)
          .eq('order_date', today)
          .single();

        if (existingOrder) {
          console.log(`Order already exists for user ${order.user_id} today`);
          results.push({
            userId: order.user_id,
            success: false,
            error: 'Order already exists for today'
          });
          errorCount++;
          continue;
        }

        // Create the recurring order
        const orderResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/create-shopify-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
          },
          body: JSON.stringify({
            userId: order.user_id,
            supplementPlanId: order.supplement_plan_id,
            supplements: supplementNames
          })
        });

        if (orderResponse.ok) {
          const orderResult = await orderResponse.json();
          console.log(`✅ Recurring order created for user ${order.user_id}: ${orderResult.shopifyOrderId}`);
          
          results.push({
            userId: order.user_id,
            success: true,
            shopifyOrderId: orderResult.shopifyOrderId,
            nextOrderDate: orderResult.nextOrderDate
          });
          successCount++;
        } else {
          const errorText = await orderResponse.text();
          console.error(`❌ Failed to create recurring order for user ${order.user_id}:`, errorText);
          
          results.push({
            userId: order.user_id,
            success: false,
            error: errorText
          });
          errorCount++;
        }

      } catch (userError: any) {
        console.error(`Error processing user ${order.user_id}:`, userError);
        results.push({
          userId: order.user_id,
          success: false,
          error: userError.message || 'Unknown error'
        });
        errorCount++;
      }
    }

    console.log(`Recurring order processing complete: ${successCount} successful, ${errorCount} errors`);

    return new Response(JSON.stringify({ 
      success: true,
      message: `Processed ${dueOrders.length} recurring orders`,
      results: {
        total: dueOrders.length,
        successful: successCount,
        errors: errorCount,
        details: results
      },
      processedDate: today
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in process-recurring-orders function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      stack: error.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 