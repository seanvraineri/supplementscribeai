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
    // Initialize Supabase client with service role key for admin operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // Get all users who need questions refreshed (last refresh was before today)
    const { data: usersNeedingQuestions, error: usersError } = await supabaseClient
      .from('user_profiles')
      .select('id, last_question_refresh')
      .or(`last_question_refresh.is.null,last_question_refresh.lt.${today}T00:00:00Z`);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    if (!usersNeedingQuestions || usersNeedingQuestions.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'All users already have questions for today',
        usersProcessed: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    let processedUsers = 0;
    const errors: string[] = [];

    // Process each user
    for (const user of usersNeedingQuestions) {
      try {
        await generateQuestionsForUser(supabaseClient, user.id, openaiApiKey);
        processedUsers++;
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        errors.push(`User ${user.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      usersProcessed: processedUsers,
      totalUsers: usersNeedingQuestions.length,
      errors: errors.length > 0 ? errors : undefined
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Daily automation error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function generateQuestionsForUser(supabaseClient: any, userId: string, openaiApiKey: string) {
  // Get user context
  const { data: contextData, error: contextError } = await supabaseClient
    .rpc('get_user_tracking_context', { p_user_id: userId });

  if (contextError) {
    throw new Error(`Failed to get user context: ${contextError.message}`);
  }

  const userContext = contextData;

  // Get previous insights to inform today's questions
  const { data: recentInsights } = await supabaseClient
    .from('user_tracking_insights')
    .select('insight_text, insight_type')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(3);

  const prompt = `
You are a health tracking AI generating daily questions for a user. Generate 4-5 personalized tracking questions.

User Context:
${JSON.stringify(userContext, null, 2)}

Recent Insights (to inform today's questions):
${recentInsights ? JSON.stringify(recentInsights, null, 2) : 'No recent insights'}

Requirements:
1. Questions should be specific to their health concerns and conditions
2. Focus on symptoms they can actually feel/observe daily
3. Questions should help track progress toward their goals
4. Avoid duplicate questions they already have
5. Make questions conversational and engaging, not clinical
6. Each question should track something actionable
7. If they have recent insights, create questions that help track those patterns

Return ONLY a JSON array of objects with this structure:
[
  {
    "question_text": "How clear and focused did your mind feel today?",
    "question_context": "Tracking cognitive clarity since you mentioned brain fog",
    "question_category": "cognitive",
    "scale_description": "1 (Very foggy) to 10 (Crystal clear)"
  }
]

CRITICAL: The scale_description MUST always be from 1 to 10, with 1 being the worst/negative end and 10 being the best/positive end.
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  const aiResponse = await response.json();
  const questionsText = aiResponse.choices[0].message.content;
  
  // Parse the JSON response
  let questions;
  try {
    questions = JSON.parse(questionsText);
  } catch (parseError) {
    throw new Error(`Failed to parse AI response: ${questionsText}`);
  }

  // Deactivate previous questions
  await supabaseClient
    .from('user_dynamic_questions')
    .update({ is_active: false })
    .eq('user_id', userId);

  // Insert new questions
  const questionsToInsert = questions.map((q: any) => ({
    user_id: userId,
    question_text: q.question_text,
    question_context: q.question_context,
    question_category: q.question_category,
    scale_description: q.scale_description || '1 (Poor) to 10 (Excellent)',
    generated_date: new Date().toISOString().split('T')[0],
    is_active: true,
  }));

  const { error: insertError } = await supabaseClient
    .from('user_dynamic_questions')
    .insert(questionsToInsert);

  if (insertError) {
    throw new Error(`Failed to save questions: ${insertError.message}`);
  }
  
  // Update user's last_question_refresh timestamp
  const { error: updateError } = await supabaseClient
    .from('user_profiles')
    .update({ last_question_refresh: new Date().toISOString() })
    .eq('id', userId);
    
  if (updateError) {
    console.error(`Failed to update last_question_refresh for user ${userId}:`, updateError);
  }
} 