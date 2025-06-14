import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get cookies from request
    const cookies = request.headers.get('cookie');
    
    // Create Supabase client with cookies
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Authentication failed in ai-chat route');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('User authenticated:', user.id);

    // Parse the request body
    const { message, conversation_id, session_id } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const userId = user.id;

    // Handle conversation logic with session-based approach
    let currentConversationId = conversation_id;
    let isNewSession = false;
    
    if (!currentConversationId && session_id) {
      // Check if there's an existing conversation for this session
      const { data: existingConversation } = await supabase
        .from('user_chat_conversations')
        .select('id')
        .eq('user_id', userId)
        .eq('session_id', session_id)
        .single();
      
      if (existingConversation) {
        currentConversationId = existingConversation.id;
      }
    }
    
    if (!currentConversationId) {
      // Create new conversation with session tracking
      const { data: newConversation, error: convError } = await supabase
        .from('user_chat_conversations')
        .insert({
          user_id: userId,
          session_id: session_id || crypto.randomUUID(),
          title: message.length > 50 ? message.substring(0, 50) + '...' : message
        })
        .select('id, session_id')
        .single();
      
      if (convError) {
        console.error('Error creating conversation:', convError);
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        );
      }
      
      currentConversationId = newConversation.id;
      isNewSession = true;
    }

    // Store user message
    await supabase
      .from('user_chat_messages')
      .insert({
        conversation_id: currentConversationId,
        user_id: userId,
        role: 'user',
        content: message
      });

    // Get conversation history for context (last 10 messages)
    const { data: messageHistory } = await supabase
      .from('user_chat_messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get user's health context
    const healthContext = await buildHealthContext(supabase, userId);

    // Prepare messages for OpenAI
    const conversationHistory = (messageHistory || [])
      .reverse()
      .slice(0, -1) // Remove the message we just added
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

    const systemPrompt = createSystemPrompt(healthContext);
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.slice(-8),
      { role: 'user' as const, content: message }
    ];

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Check if OpenAI API key is available
          if (!process.env.OPENAI_API_KEY) {
            console.log('OpenAI API key not found, using mock response');
            // Mock response for testing
            const mockResponse = `Hello! I'm your AI health assistant. I can see you're asking: "${message}"\n\nBased on your health profile, I'd be happy to help you with personalized recommendations. However, I need an OpenAI API key to provide detailed responses.\n\nFor now, I can confirm that:\n- Your authentication is working ✅\n- Your health data is accessible ✅\n- The chat system is functional ✅\n\nPlease add your OpenAI API key to the environment variables to enable full AI responses.`;
            
            // Simulate streaming
            const words = mockResponse.split(' ');
            for (let i = 0; i < words.length; i++) {
              const word = words[i] + (i < words.length - 1 ? ' ' : '');
              controller.enqueue(new TextEncoder().encode(
                `data: ${JSON.stringify({
                  type: 'content',
                  content: word
                })}\n\n`
              ));
              // Small delay to simulate streaming
              await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            // Store mock response
            await supabase
              .from('user_chat_messages')
              .insert({
                conversation_id: currentConversationId,
                user_id: userId,
                role: 'assistant',
                content: mockResponse,
                metadata: {
                  model: 'mock',
                  timestamp: new Date().toISOString()
                }
              });
            
            // Send final event
            controller.enqueue(new TextEncoder().encode(
              `data: ${JSON.stringify({
                type: 'done',
                conversation_id: currentConversationId,
                session_id: session_id,
                is_new_session: isNewSession
              })}\n\n`
            ));
            controller.close();
            return;
          }

          const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: messages,
              max_tokens: 1500,
              temperature: 0.2,
              stream: true,
              presence_penalty: 0.1,
              frequency_penalty: 0.1,
            }),
          });

          if (!openaiResponse.ok) {
            const errorText = await openaiResponse.text();
            console.error('OpenAI API error:', errorText);
            controller.enqueue(new TextEncoder().encode(
              `data: ${JSON.stringify({ type: 'error', error: 'Failed to get AI response' })}\n\n`
            ));
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
                    // Store complete AI response
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
                    
                    // Send final event with conversation info
                    controller.enqueue(new TextEncoder().encode(
                      `data: ${JSON.stringify({
                        type: 'done',
                        conversation_id: currentConversationId,
                        session_id: session_id,
                        is_new_session: isNewSession
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
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

async function buildHealthContext(supabase: any, userId: string): Promise<string> {
  try {
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
      supabase.from('user_snps').select('*').eq('user_id', userId).limit(100),
      supabase.from('supplement_plans').select('plan_details').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single()
    ]);

    const parts = [];

    // Essential demographics
    if (profile?.age || profile?.gender) {
      const demo = [];
      if (profile.age) demo.push(`**${profile.age} years old**`);
      if (profile.gender) demo.push(`**${profile.gender}**`);
      if (profile.weight_lbs) demo.push(`**${profile.weight_lbs} lbs**`);
      parts.push(`**PROFILE**: ${demo.join(', ')}`);
    }

    // Key health goals & symptoms
    if (profile?.health_goals?.length || profile?.energy_levels || profile?.brain_fog) {
      const health = [];
      if (profile.health_goals?.length) health.push(`Goals: **${profile.health_goals.slice(0,3).join(', ')}**`);
      if (profile.energy_levels && profile.energy_levels !== 'high') health.push(`Energy: **${profile.energy_levels}**`);
      if (profile.brain_fog && profile.brain_fog !== 'none') health.push(`Brain fog: **${profile.brain_fog}**`);
      if (profile.sleep_quality && profile.sleep_quality !== 'excellent') health.push(`Sleep: **${profile.sleep_quality}**`);
      if (health.length) parts.push(`**HEALTH GOALS & SYMPTOMS**: ${health.join(', ')}`);
    }

    // Medical conditions (top 5)
    if (conditions?.length > 0) {
      parts.push(`**CONDITIONS**: ${conditions.slice(0,5).map((c: any) => `**${c.condition_name}**`).join(', ')}`);
    }

    // Current medications (top 5)
    if (medications?.length > 0) {
      parts.push(`**MEDICATIONS**: ${medications.slice(0,5).map((m: any) => `**${m.medication_name}**`).join(', ')}`);
    }

    // Key biomarkers (top 10 most important)
    if (biomarkers?.length > 0) {
      const keyBiomarkers = biomarkers
        .filter((b: any) => ['CRP', 'HDL', 'LDL', 'Glucose', 'HbA1c', 'Ferritin', 'Vitamin D', 'B12', 'TSH', 'Testosterone'].some(key => 
          b.marker_name.toLowerCase().includes(key.toLowerCase())
        ))
        .slice(0, 10)
        .map((b: any) => `**${b.marker_name}**: ${b.value}${b.unit || ''}`)
        .join(', ');
      if (keyBiomarkers) parts.push(`**KEY BIOMARKERS**: ${keyBiomarkers}`);
    }

    // All genetic variants with manual joining (up to 30 most important)
    if (snps?.length > 0) {
      // Fetch supported SNPs data for manual joining
      const { data: allSupportedSnps } = await supabase
        .from('supported_snps')
        .select('id, rsid, gene');
      
      // Create lookup map
      const snpLookup = new Map();
      if (allSupportedSnps) {
        allSupportedSnps.forEach((snp: any) => {
          snpLookup.set(snp.id, { rsid: snp.rsid, gene: snp.gene });
        });
      }

      // Enrich SNPs with gene data
      const enrichedSnps = snps.map((userSnp: any) => ({
        ...userSnp,
        supported_snps: snpLookup.get(userSnp.supported_snp_id) || null
      }));

      // Group by gene for better organization
      const geneGroups: { [key: string]: any[] } = {};
      enrichedSnps.forEach((snp: any) => {
        const geneName = snp.supported_snps?.gene || 'Unknown';
        if (!geneGroups[geneName]) {
          geneGroups[geneName] = [];
        }
        geneGroups[geneName].push(snp);
      });

      const formattedGenetics = Object.entries(geneGroups)
        .slice(0, 15) // Limit to first 15 genes to avoid token overflow
        .map(([geneName, variants]) => {
          const variantList = variants
            .slice(0, 3) // Limit variants per gene
            .map((v: any) => `${v.supported_snps?.rsid || 'Unknown'}: **${v.genotype || 'Unknown'}**`)
            .join(', ');
          return `**${geneName}**: ${variantList}`;
        })
        .join('\n');
      
      parts.push(`**GENETICS** (${snps.length} variants):\n${formattedGenetics}`);
    }

    // Current supplements (top 10)
    if (supplementPlan?.plan_details?.recommendations) {
      const currentSupps = supplementPlan.plan_details.recommendations
        .slice(0, 10)
        .map((rec: any) => `**${rec.supplement}**: ${rec.dosage}`)
        .join(', ');
      parts.push(`**CURRENT SUPPLEMENTS**: ${currentSupps}`);
    }

    // Allergies
    if (allergies?.length > 0) {
      parts.push(`**ALLERGIES**: ${allergies.slice(0,10).map((a: any) => `**${a.ingredient_name}**`).join(', ')}`);
    }

    return parts.join('\n\n');
  } catch (error) {
    console.error('Error building health context:', error);
    return 'Health data not available';
  }
}

function createSystemPrompt(healthContext: string): string {
  return `You are a personalized biohacker and functional medicine expert with complete access to this user's health data:

${healthContext}

**PERSONALITY**: Friendly, knowledgeable health advisor who remembers everything about their health profile.

**APPROACH**:
- Reference their specific data (biomarkers, genetics, symptoms)
- When discussing genetics, cover ALL relevant variants, not just one gene
- Provide actionable, personalized recommendations
- Focus on root causes and optimization
- Consider genetic predispositions across multiple pathways
- Be aware of medication interactions
- Emphasize prevention and biohacking

**CRITICAL FORMATTING REQUIREMENTS**:
You MUST format your responses with proper structure and spacing for maximum readability:

1. **Use clear section headers** with double line breaks before and after
2. **Bold all important terms** like gene names, supplement names, and key concepts
3. **Use numbered lists** for step-by-step recommendations
4. **Use bullet points (-)** for related items or features
5. **Add blank lines** between different topics and sections
6. **Keep paragraphs short** (2-3 sentences max)
7. **Use specific data points** with exact numbers when referencing their biomarkers/genetics

**EXAMPLE FORMATTING**:

## Key Genetic Insights

**MTHFR Variants**: Your **C677T (GA)** and **A1298C (GT)** variants suggest moderate methylation efficiency.

**COMT V158M**: With the **GA** genotype, you have balanced dopamine metabolism.

## Actionable Recommendations

1. **Methylation Support**
   - Continue folate supplementation
   - Consider adding B6 and riboflavin
   - Monitor homocysteine levels

2. **Stress Management**
   - Practice daily meditation
   - Consider adaptogenic herbs
   - Optimize sleep schedule

## Next Steps

Based on your profile, I recommend focusing on...

Always structure your responses this way with clear headers, proper spacing, and organized sections. Make it easy to scan and read.`;
} 