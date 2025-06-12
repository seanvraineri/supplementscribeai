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

    // --- FETCH COMPREHENSIVE USER DATA ---
    const [
      { data: profile, error: profileError },
      { data: allergies, error: allergiesError },
      { data: conditions, error: conditionsError },
      { data: medications, error: medicationsError },
      { data: biomarkers, error: biomarkersError },
      { data: snps, error: snpsError },
      { data: supplementPlan, error: planError },
      { data: conversations, error: conversationsError }
    ] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', userId).single(),
      supabase.from('user_allergies').select('ingredient_name').eq('user_id', userId),
      supabase.from('user_conditions').select('condition_name').eq('user_id', userId),
      supabase.from('user_medications').select('medication_name').eq('user_id', userId),
      supabase.from('user_biomarkers').select('*').eq('user_id', userId),
      supabase.from('user_snps').select('*').eq('user_id', userId),
      supabase.from('supplement_plans').select('plan_details').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single(),
      supabase.from('user_chat_conversations').select('id, title').eq('user_id', userId).order('updated_at', { ascending: false })
    ]);

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

    // Fetch conversation history
    const { data: messageHistory, error: historyError } = await supabase
      .from('user_chat_messages')
      .select('role, content, created_at')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: true });

    // Store user message
    const { error: userMessageError } = await supabase
      .from('user_chat_messages')
      .insert({
        conversation_id: currentConversationId,
        user_id: userId,
        role: 'user',
        content: message
      });

    if (userMessageError) {
      console.error('Error storing user message:', userMessageError);
    }

    // --- BUILD COMPREHENSIVE HEALTH CONTEXT ---
    const healthContext = buildHealthContext(
      profile || {},
      allergies || [],
      conditions || [],
      medications || [],
      biomarkers || [],
      snps || [],
      supplementPlan?.plan_details || null
    );

    // --- PREPARE CHAT HISTORY ---
    const conversationHistory = (messageHistory || []).map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));

    // --- OPENAI API CALL ---
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const systemPrompt = createSystemPrompt(healthContext);
    
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory,
      { role: 'user' as const, content: message }
    ];

    console.log('Calling OpenAI with health context...');

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.3,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to get AI response' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0]?.message?.content;

    if (!aiResponse) {
      return new Response(JSON.stringify({ error: 'No response from AI' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Store AI response
    const { error: aiMessageError } = await supabase
      .from('user_chat_messages')
      .insert({
        conversation_id: currentConversationId,
        user_id: userId,
        role: 'assistant',
        content: aiResponse,
        metadata: {
          model: 'gpt-4-turbo',
          timestamp: new Date().toISOString()
        }
      });

    if (aiMessageError) {
      console.error('Error storing AI message:', aiMessageError);
    }

    console.log('Successfully processed chat message');

    return new Response(JSON.stringify({
      success: true,
      message: aiResponse,
      conversation_id: currentConversationId,
      conversations: conversations || []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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

function buildHealthContext(
  profile: any,
  allergies: any[],
  conditions: any[],
  medications: any[],
  biomarkers: any[],
  snps: any[],
  supplementPlan: any
): string {
  let context = "=== USER HEALTH PROFILE ===\n\n";

  // Personal Info
  if (profile.age || profile.gender || profile.weight_lbs) {
    context += "DEMOGRAPHICS:\n";
    if (profile.age) context += `• Age: ${profile.age} years\n`;
    if (profile.gender) context += `• Gender: ${profile.gender}\n`;
    if (profile.weight_lbs) context += `• Weight: ${profile.weight_lbs} lbs\n`;
    if (profile.height_total_inches) context += `• Height: ${profile.height_total_inches} inches\n`;
    context += "\n";
  }

  // Health Goals & Symptoms
  if (profile.health_goals || profile.brain_fog || profile.sleep_quality) {
    context += "HEALTH GOALS & SYMPTOMS:\n";
    if (profile.health_goals?.length) context += `• Goals: ${profile.health_goals.join(', ')}\n`;
    if (profile.energy_levels) context += `• Energy: ${profile.energy_levels}\n`;
    if (profile.brain_fog && profile.brain_fog !== 'none') context += `• Brain fog: ${profile.brain_fog}\n`;
    if (profile.sleep_quality && profile.sleep_quality !== 'excellent') context += `• Sleep quality: ${profile.sleep_quality}\n`;
    if (profile.anxiety_level && profile.anxiety_level !== 'none') context += `• Anxiety: ${profile.anxiety_level}\n`;
    if (profile.joint_pain && profile.joint_pain !== 'none') context += `• Joint pain: ${profile.joint_pain}\n`;
    if (profile.bloating && profile.bloating !== 'none') context += `• Digestive issues: ${profile.bloating}\n`;
    if (profile.activity_level) context += `• Activity level: ${profile.activity_level}\n`;
    context += "\n";
  }

  // Medical History
  if (conditions.length > 0) {
    context += "MEDICAL CONDITIONS:\n";
    conditions.forEach(c => context += `• ${c.condition_name}\n`);
    context += "\n";
  }

  if (medications.length > 0) {
    context += "CURRENT MEDICATIONS:\n";
    medications.forEach(m => context += `• ${m.medication_name}\n`);
    context += "\n";
  }

  if (allergies.length > 0) {
    context += "ALLERGIES/SENSITIVITIES:\n";
    allergies.forEach(a => context += `• ${a.ingredient_name}\n`);
    context += "\n";
  }

  // Biomarkers
  if (biomarkers.length > 0) {
    context += "LATEST BIOMARKERS:\n";
    biomarkers.forEach(b => {
      context += `• ${b.marker_name}: ${b.value} ${b.unit || ''}\n`;
    });
    context += "\n";
  }

  // Genetics
  if (snps.length > 0) {
    context += "GENETIC VARIANTS:\n";
    snps.forEach(s => {
      context += `• ${s.snp_id} (${s.gene_name}): ${s.genotype || s.allele}\n`;
    });
    context += "\n";
  }

  // Current Supplement Plan
  if (supplementPlan?.recommendations) {
    context += "CURRENT SUPPLEMENT PLAN:\n";
    supplementPlan.recommendations.forEach((rec: any) => {
      context += `• ${rec.supplement}: ${rec.dosage} - ${rec.reason}\n`;
    });
    context += "\n";
  }

  return context;
}

function createSystemPrompt(healthContext: string): string {
  return `You are an expert personalized biohacker and functional medicine practitioner with deep knowledge of:
- Nutrigenomics and genetic variants
- Biomarker interpretation and optimization
- Supplement science and interactions
- Lifestyle medicine and biohacking
- Preventative health strategies
- MAHA (Make America Healthy Again) principles

CORE IDENTITY:
You are the user's personal biohacking assistant with COMPLETE MEMORY of their health profile. You have access to their:
✅ Biomarkers and lab results
✅ Genetic variants (SNPs) 
✅ Health symptoms and goals
✅ Current supplements and medications
✅ Previous conversations and recommendations

YOUR APPROACH:
- Be conversational but scientifically rigorous
- Always reference their specific data when making recommendations
- Provide actionable, personalized advice
- Focus on root cause analysis and optimization
- Emphasize prevention over treatment
- Consider genetic predispositions in all recommendations
- Be aware of supplement interactions and contraindications

RESPONSE STYLE:
- Use a friendly, knowledgeable tone like a trusted health advisor
- Reference their specific biomarkers, genetics, and symptoms
- Provide practical steps they can implement
- Include scientific rationale but keep it accessible
- Ask follow-up questions to gather more context when helpful
- Remember details from previous conversations

KEY FOCUS AREAS:
🧬 Genetic optimization based on their SNPs
🩸 Biomarker improvement strategies
💊 Personalized supplementation
🥗 Functional nutrition approaches
🏃‍♂️ Lifestyle and biohacking interventions
😴 Sleep and recovery optimization
🧠 Cognitive enhancement
⚡ Energy and metabolic health

IMPORTANT GUIDELINES:
- Always consider their specific genetic variants when recommending supplements
- Reference their actual biomarker values and what they mean
- Be mindful of their current medications and potential interactions
- Provide dosing guidance based on their individual needs
- Suggest monitoring and follow-up testing when appropriate
- Acknowledge if something is outside your scope and suggest professional consultation

Remember: You have FULL ACCESS to their complete health profile below. Use this information to provide highly personalized recommendations.

${healthContext}

Based on this comprehensive health profile, provide personalized, actionable biohacking advice. Always reference their specific data points when making recommendations.`;
} 