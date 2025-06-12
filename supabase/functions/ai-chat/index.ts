import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: any;
}

// Health context cache (simple in-memory cache for session)
const healthContextCache = new Map<string, { context: string, timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

Deno.serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { message, conversation_id } = await req.json();
    const userId = user.id;

    console.log('Processing chat message for user:', userId);

    // Check cache for health context
    const cacheKey = userId;
    const cached = healthContextCache.get(cacheKey);
    const now = Date.now();
    
    let healthContext: string;
    
    if (cached && (now - cached.timestamp < CACHE_DURATION)) {
      console.log('Using cached health context');
      healthContext = cached.context;
    } else {
      console.log('Fetching fresh health context');
      // --- FETCH COMPREHENSIVE USER DATA (OPTIMIZED WITH PARALLEL QUERIES) ---
      const [
        { data: profile },
        { data: allergies },
        { data: conditions },
        { data: medications },
        { data: biomarkers },
        { data: snps },
        { data: supplementPlan }
      ] = await Promise.all([
        supabase.from('user_profiles').select('age, gender, weight_lbs, height_total_inches, health_goals, energy_levels, brain_fog, sleep_quality, anxiety_level, joint_pain, bloating, activity_level').eq('id', userId).single(),
        supabase.from('user_allergies').select('ingredient_name').eq('user_id', userId).limit(20),
        supabase.from('user_conditions').select('condition_name').eq('user_id', userId).limit(20),
        supabase.from('user_medications').select('medication_name').eq('user_id', userId).limit(20),
        supabase.from('user_biomarkers').select('marker_name, value, unit').eq('user_id', userId).limit(50),
        supabase.from('user_snps').select('snp_id, gene_name, genotype, allele').eq('user_id', userId).limit(30),
        supabase.from('supplement_plans').select('plan_details').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single()
      ]);

      // Build optimized health context
      healthContext = buildOptimizedHealthContext(
        profile || {},
        allergies || [],
        conditions || [],
        medications || [],
        biomarkers || [],
        snps || [],
        supplementPlan?.plan_details || null
      );

      // Cache the context
      healthContextCache.set(cacheKey, { context: healthContext, timestamp: now });
    }

    // Handle conversation logic
    let currentConversationId = conversation_id;
    
    if (!currentConversationId) {
      // Create new conversation
      const { data: newConversation, error: convError } = await supabase
        .from('user_chat_conversations')
        .insert({
          user_id: userId,
          title: message.length > 50 ? message.substring(0, 50) + '...' : message
        })
        .select('id')
        .single();
      
      if (convError) {
        console.error('Error creating conversation:', convError);
        return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      
      currentConversationId = newConversation.id;
    }

    // Fetch conversation history (limit to last 10 messages for speed)
    const { data: messageHistory } = await supabase
      .from('user_chat_messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Store user message (async, don't wait)
    (async () => {
      try {
        await supabase
          .from('user_chat_messages')
          .insert({
            conversation_id: currentConversationId,
            user_id: userId,
            role: 'user',
            content: message
          });
        console.log('User message stored');
      } catch (err: any) {
        console.error('Error storing user message:', err);
      }
    })();

    // --- PREPARE CHAT HISTORY ---
    const conversationHistory = (messageHistory || [])
      .reverse() // Restore chronological order
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

    // --- OPENAI STREAMING API CALL ---
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const systemPrompt = createOptimizedSystemPrompt(healthContext);
    
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.slice(-8), // Only keep last 8 messages for speed
      { role: 'user' as const, content: message }
    ];

    console.log('Calling OpenAI with streaming...');

    // Create a readable stream for Server-Sent Events
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o', // Faster than GPT-4 Turbo
              messages: messages,
              max_tokens: 1500, // Reduced for speed
              temperature: 0.2, // Reduced for faster, more focused responses
              stream: true,
              presence_penalty: 0.1,
              frequency_penalty: 0.1,
            }),
          });

          if (!openaiResponse.ok) {
            const errorText = await openaiResponse.text();
            console.error('OpenAI API error:', errorText);
            controller.close();
            return;
          }

          const reader = openaiResponse.body?.getReader();
          const decoder = new TextDecoder();
          let fullResponse = '';

          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    // Store complete AI response (async)
                    (async () => {
                      try {
                        await supabase
                          .from('user_chat_messages')
                          .insert({
                            conversation_id: currentConversationId,
                            user_id: userId,
                            role: 'assistant',
                            content: fullResponse,
                            metadata: {
                              model: 'gpt-4o',
                              timestamp: new Date().toISOString()
                            }
                          });
                        console.log('AI response stored');
                      } catch (err: any) {
                        console.error('Error storing AI response:', err);
                      }
                    })();
                    
                    // Send final event with conversation info
                    controller.enqueue(new TextEncoder().encode(
                      `data: ${JSON.stringify({
                        type: 'done',
                        conversation_id: currentConversationId
                      })}\n\n`
                    ));
                    controller.close();
                    return;
                  }

                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices[0]?.delta?.content;
                    if (content) {
                      fullResponse += content;
                      // Send streaming content
                      controller.enqueue(new TextEncoder().encode(
                        `data: ${JSON.stringify({
                          type: 'content',
                          content: content
                        })}\n\n`
                      ));
                    }
                  } catch (e) {
                    // Skip malformed JSON
                  }
                }
              }
            }
          }
        } catch (error: any) {
          console.error('Streaming error:', error);
          controller.enqueue(new TextEncoder().encode(
            `data: ${JSON.stringify({
              type: 'error',
              error: error.message
            })}\n\n`
          ));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Internal server error'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

function buildOptimizedHealthContext(
  profile: any,
  allergies: any[],
  conditions: any[],
  medications: any[],
  biomarkers: any[],
  snps: any[],
  supplementPlan: any
): string {
  const parts = [];

  // Essential demographics
  if (profile.age || profile.gender) {
    const demo = [];
    if (profile.age) demo.push(`${profile.age}y`);
    if (profile.gender) demo.push(profile.gender);
    if (profile.weight_lbs) demo.push(`${profile.weight_lbs}lbs`);
    parts.push(`PROFILE: ${demo.join(', ')}`);
  }

  // Key health goals & symptoms
  if (profile.health_goals?.length || profile.energy_levels || profile.brain_fog) {
    const health = [];
    if (profile.health_goals?.length) health.push(`Goals: ${profile.health_goals.slice(0,3).join(', ')}`);
    if (profile.energy_levels && profile.energy_levels !== 'high') health.push(`Energy: ${profile.energy_levels}`);
    if (profile.brain_fog && profile.brain_fog !== 'none') health.push(`Brain fog: ${profile.brain_fog}`);
    if (profile.sleep_quality && profile.sleep_quality !== 'excellent') health.push(`Sleep: ${profile.sleep_quality}`);
    if (health.length) parts.push(`HEALTH: ${health.join(', ')}`);
  }

  // Medical conditions (top 5)
  if (conditions.length > 0) {
    parts.push(`CONDITIONS: ${conditions.slice(0,5).map(c => c.condition_name).join(', ')}`);
  }

  // Current medications (top 5)
  if (medications.length > 0) {
    parts.push(`MEDS: ${medications.slice(0,5).map(m => m.medication_name).join(', ')}`);
  }

  // Key biomarkers (top 10 most important)
  if (biomarkers.length > 0) {
    const keyBiomarkers = biomarkers
      .filter(b => ['CRP', 'HDL', 'LDL', 'Glucose', 'HbA1c', 'Ferritin', 'Vitamin D', 'B12', 'TSH', 'Testosterone'].some(key => 
        b.marker_name.toLowerCase().includes(key.toLowerCase())
      ))
      .slice(0, 10)
      .map(b => `${b.marker_name}: ${b.value}${b.unit || ''}`)
      .join(', ');
    if (keyBiomarkers) parts.push(`BIOMARKERS: ${keyBiomarkers}`);
  }

  // Key genetic variants (top 10)
  if (snps.length > 0) {
    const keySnps = snps
      .filter(s => ['MTHFR', 'COMT', 'VDR', 'FADS', 'APOE'].includes(s.gene_name))
      .slice(0, 10)
      .map(s => `${s.gene_name}(${s.snp_id}): ${s.genotype || s.allele}`)
      .join(', ');
    if (keySnps) parts.push(`GENETICS: ${keySnps}`);
  }

  // Current supplements (top 10)
  if (supplementPlan?.recommendations) {
    const currentSupps = supplementPlan.recommendations
      .slice(0, 10)
      .map((rec: any) => `${rec.supplement}: ${rec.dosage}`)
      .join(', ');
    parts.push(`SUPPLEMENTS: ${currentSupps}`);
  }

  // Allergies
  if (allergies.length > 0) {
    parts.push(`ALLERGIES: ${allergies.slice(0,10).map(a => a.ingredient_name).join(', ')}`);
  }

  return parts.join('\n\n');
}

function createOptimizedSystemPrompt(healthContext: string): string {
  return `You are a personalized biohacker and functional medicine expert with complete access to this user's health data:

${healthContext}

PERSONALITY: Friendly, knowledgeable health advisor who remembers everything about their health profile.

APPROACH:
• Reference their specific data (biomarkers, genetics, symptoms)
• Provide actionable, personalized recommendations
• Focus on root causes and optimization
• Consider genetic predispositions
• Be aware of medication interactions
• Emphasize prevention and biohacking

RESPONSE STYLE:
• Conversational but scientifically sound
• Reference their specific data points
• Provide practical next steps
• Keep responses focused and actionable
• Ask follow-up questions when helpful

Focus on their unique health profile and provide personalized biohacking advice based on their actual data.`;
} 