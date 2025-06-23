import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return Response.json({ error: 'Authorization header required' }, { status: 401 });
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('dynamic-tracking', {
      body,
      headers: {
        Authorization: authHeader,
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      return Response.json({ error: 'Function call failed' }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
} 