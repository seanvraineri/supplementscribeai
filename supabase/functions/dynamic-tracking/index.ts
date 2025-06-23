import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DynamicTrackingRequest {
  action: 'generate_questions' | 'submit_response' | 'get_insights';
  questionId?: string;
  responseValue?: number;
  notes?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from auth
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { action, questionId, responseValue, notes }: DynamicTrackingRequest = await req.json();

    switch (action) {
      case 'generate_questions':
        return await generatePersonalizedQuestions(supabaseClient, user.id);
      
      case 'submit_response':
        if (!questionId || !responseValue) {
          return new Response(JSON.stringify({ error: 'Missing questionId or responseValue' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          });
        }
        return await submitTrackingResponse(supabaseClient, user.id, questionId, responseValue, notes);
      
      case 'get_insights':
        return await generateInsights(supabaseClient, user.id);
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
    }
  } catch (error) {
    console.error('Dynamic tracking error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function generatePersonalizedQuestions(supabaseClient: any, userId: string) {
  try {
    // Get user context using the database function
    const { data: contextData, error: contextError } = await supabaseClient
      .rpc('get_user_tracking_context', { p_user_id: userId });

    if (contextError) {
      console.error('Context error:', contextError);
      return new Response(JSON.stringify({ error: 'Failed to get user context' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const userContext = contextData;

    // Generate questions using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const prompt = `
You are an elite holistic health optimization AI focused on ROOT CAUSE healing, not symptom management.

User Profile Analysis:
${JSON.stringify(userContext, null, 2)}

Your mission: Generate 4-5 REVOLUTIONARY daily tracking questions that will uncover the ROOT CAUSES of their health issues.

CRITICAL REQUIREMENTS:

1. **HYPER-PERSONALIZED QUESTIONS**
   - Reference their EXACT symptoms, conditions, and biomarkers
   - Connect questions to their PRIMARY health concern
   - Make each question feel like it was written by their personal health detective

2. **ROOT CAUSE FOCUS**
   - Don't ask "how's your energy?" - ask about what DRIVES energy
   - Track upstream factors: sleep architecture, stress response, nutritional timing
   - Connect symptoms to lifestyle patterns they can control

3. **ACTIONABLE & MEASURABLE**
   - Each question should reveal a pattern they can act on
   - Include time-specific elements (morning vs evening, before/after meals)
   - Focus on controllable factors, not just observations

4. **ENGAGING & MOTIVATING**
   - Use their name and specific context
   - Make questions feel like discoveries, not chores
   - Include subtle education in the question itself

5. **CATEGORIES TO EXPLORE**
   - Energy: mitochondrial function, adrenal patterns, blood sugar stability
   - Cognitive: neurotransmitter balance, inflammation markers, focus windows
   - Physical: recovery capacity, inflammatory response, structural alignment
   - Emotional: stress resilience, mood stability, emotional processing
   - Sleep: sleep architecture, recovery quality, circadian alignment

EXAMPLE TRANSFORMATIONS:
❌ Generic: "How was your energy today?"
✅ Revolutionary: "Did you notice any energy dips 2-3 hours after meals today? This helps us track potential blood sugar instability affecting your afternoon fatigue."

❌ Generic: "Rate your mood today"
✅ Revolutionary: "How quickly did you bounce back from stressful moments today? This reveals your nervous system's resilience capacity."

Return ONLY a JSON array with this EXACT structure:
[
  {
    "question_text": "[Hyper-specific question that feels like a personal health detective asking]",
    "question_context": "[Brief explanation connecting to their specific condition/concern]",
    "question_category": "[energy/cognitive/physical/emotional/sleep]",
    "scale_description": "[Specific scale that teaches them what optimal looks like]"
  }
]

Make every question feel like a breakthrough moment in understanding their health!
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
      console.error('Failed to parse AI response:', questionsText);
      return new Response(JSON.stringify({ error: 'Failed to parse AI response' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // First, deactivate all old questions for this user
    const { error: deactivateError } = await supabaseClient
      .from('user_dynamic_questions')
      .update({ is_active: false })
      .eq('user_id', userId);
    
    if (deactivateError) {
      console.error('Error deactivating old questions:', deactivateError);
    }

    // Insert new questions into database
    const today = new Date().toISOString().split('T')[0];
    const questionsToInsert = questions.map((q: any) => ({
      user_id: userId,
      question_text: q.question_text,
      question_context: q.question_context,
      question_category: q.question_category,
      scale_description: q.scale_description || '1 (Poor) to 10 (Excellent)',
      generated_date: today,
      is_active: true,
    }));

    const { data: insertedQuestions, error: insertError } = await supabaseClient
      .from('user_dynamic_questions')
      .insert(questionsToInsert)
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to save questions' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      questions: insertedQuestions 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Generate questions error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate questions' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

async function submitTrackingResponse(supabaseClient: any, userId: string, questionId: string, responseValue: number, notes?: string) {
  try {
    const { data, error } = await supabaseClient
      .from('user_dynamic_responses')
      .insert({
        user_id: userId,
        question_id: questionId,
        response_value: responseValue,
        notes: notes,
      })
      .select();

    if (error) {
      console.error('Submit response error:', error);
      return new Response(JSON.stringify({ error: 'Failed to submit response' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      response: data[0] 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Submit response error:', error);
    return new Response(JSON.stringify({ error: 'Failed to submit response' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

async function generateInsights(supabaseClient: any, userId: string) {
  try {
    // Get recent responses (last 7 days)
    const { data: responses, error: responsesError } = await supabaseClient
      .from('user_dynamic_responses')
      .select(`
        *,
        user_dynamic_questions(question_text, question_context, question_category)
      `)
      .eq('user_id', userId)
      .gte('response_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('response_date', { ascending: false });

    if (responsesError || !responses || responses.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        insight: "Keep tracking for a few more days to get personalized insights!" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate insights using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const prompt = `
You are an elite health pattern recognition AI that uncovers ROOT CAUSES, not just symptoms.

Tracking Data Analysis (last 7 days):
${JSON.stringify(responses, null, 2)}

Your mission: Identify the MOST IMPORTANT hidden pattern that explains their symptoms.

ANALYSIS FRAMEWORK:
1. **PATTERN RECOGNITION**: What's the hidden connection between their responses?
2. **ROOT CAUSE**: What upstream factor is driving multiple symptoms?
3. **TIMING PATTERNS**: When do symptoms cluster? What precedes flare-ups?
4. **ACTIONABLE DISCOVERY**: What ONE change could create a cascade of improvements?

INSIGHT REQUIREMENTS:
- Start with the DISCOVERY: "I noticed..." or "Your data reveals..."
- Connect MULTIPLE data points to show the pattern
- Explain the ROOT CAUSE mechanism (why this happens biologically)
- Give ONE specific action with TIMING (when/how to do it)
- Include expected timeline for improvement
- Make them feel EMPOWERED, not overwhelmed

EXAMPLE FORMAT:
"Your energy crashes 2-3 hours after meals (averaging 3/10) while your morning energy starts strong (7/10). This pattern suggests reactive hypoglycemia - your blood sugar spikes then crashes. Try eating protein BEFORE carbs at lunch tomorrow and track if your 3pm energy stays above 5/10. Most people see improvement within 3 days of this simple sequencing change."

Return ONLY the insight text (100-150 words), no JSON formatting.
Make it feel like a breakthrough moment in understanding their health!
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
        max_tokens: 200,
      }),
    });

    const aiResponse = await response.json();
    const insightText = aiResponse.choices[0].message.content;

    // Save insight to database
    const { error: insertError } = await supabaseClient
      .from('user_tracking_insights')
      .insert({
        user_id: userId,
        insight_text: insightText,
        insight_type: 'pattern',
        confidence_score: 0.8,
        data_period_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        data_period_end: new Date().toISOString().split('T')[0],
      });

    if (insertError) {
      console.error('Insert insight error:', insertError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      insight: insightText 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Generate insights error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate insights' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
} 