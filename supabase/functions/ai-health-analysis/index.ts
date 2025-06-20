import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  type: 'biomarker' | 'snp';
  name: string;
  value?: string;
  unit?: string;
  genotype?: string;
  gene?: string;
  userConditions?: Array<{ name: string }>;
  userAllergies?: Array<{ name: string }>;
  userAge?: number;
  userGender?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, name, value, unit, genotype, gene, userConditions = [], userAllergies = [], userAge, userGender }: AnalysisRequest = await req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let prompt = '';
    
    if (type === 'biomarker') {
      prompt = `You are a functional medicine expert providing personalized biomarker analysis. Analyze this biomarker with EXTREMELY SPECIFIC, actionable recommendations.

BIOMARKER: ${name}
VALUE: ${value} ${unit}
USER AGE: ${userAge || 'Not specified'}
USER GENDER: ${userGender || 'Not specified'}
USER CONDITIONS: ${userConditions.map(c => c.name).join(', ') || 'None'}
USER ALLERGIES: ${userAllergies.map(a => a.name).join(', ') || 'None'}

Provide a comprehensive analysis with:

1. BIOMARKER DESCRIPTION: What this biomarker measures and why it's important
2. REFERENCE RANGES: Optimal, normal, and concerning ranges with units
3. CURRENT STATUS: Where this value falls (optimal/suboptimal/concerning) and what it means
4. SYMPTOMS: Specific symptoms associated with this level
5. PERSONALIZED RECOMMENDATIONS: 
   - EXACT supplement dosages with specific forms (e.g., "Methylcobalamin B12 1000-2000 mcg daily")
   - SPECIFIC foods with quantities (e.g., "2-3 servings grass-fed red meat weekly")
   - PRECISE timing instructions (e.g., "Take with fat-containing meal", "Space 4+ hours from thyroid medication")
   - EXACT monitoring protocols (e.g., "Retest in 8-12 weeks", "Target range 40-80 ng/mL")
   - Modifications for user's conditions and allergies

6. RISK ASSESSMENT: Low/Moderate/High risk level
7. NEXT STEPS: Specific actions to take

Make recommendations WAYYY more specific than generic advice. Include exact dosages, specific supplement forms, precise timing, and detailed protocols. Avoid vague terms like "balanced nutrition" - give exact foods and amounts.

If user has allergies, substitute accordingly (fish allergy = algae-based omega-3, shellfish allergy = avoid oyster recommendations).

Format as JSON with these exact keys: name, description, currentValue, currentRange, referenceRange, symptoms, recommendations, riskLevel, nextSteps`;

    } else if (type === 'snp') {
      prompt = `You are a genetic counselor and functional medicine expert providing personalized genetic variant analysis. Analyze this SNP with EXTREMELY SPECIFIC, actionable recommendations.

GENETIC VARIANT: ${name} (${gene})
GENOTYPE: ${genotype}
USER AGE: ${userAge || 'Not specified'}
USER GENDER: ${userGender || 'Not specified'}
USER CONDITIONS: ${userConditions.map(c => c.name).join(', ') || 'None'}
USER ALLERGIES: ${userAllergies.map(a => a.name).join(', ') || 'None'}

Provide a comprehensive analysis with:

1. GENE FUNCTION: What this gene does and its biological importance
2. VARIANT DESCRIPTION: What this specific variant means
3. GENOTYPE ANALYSIS: How this specific genotype (${genotype}) affects function
4. FUNCTIONAL IMPACT: Percentage of normal function if known, or qualitative description
5. RISK ASSESSMENT: Standard/Mild/Moderate/High/Protective risk level
6. PERSONALIZED RECOMMENDATIONS:
   - EXACT supplement protocols with specific dosages and forms
   - SPECIFIC dietary modifications with precise foods and amounts
   - LIFESTYLE modifications tailored to this variant
   - MONITORING recommendations with specific tests and frequencies
   - Modifications for user's conditions and allergies

7. INTERACTIONS: How this variant interacts with medications, other nutrients, or lifestyle factors
8. NEXT STEPS: Specific actions to take

Make recommendations WAYYY more specific. For example:
- Instead of "folate supplementation" → "Methylfolate (5-MTHF) 800-1000 mcg daily, avoid synthetic folic acid completely"
- Instead of "omega-3s" → "EPA/DHA 2-3g daily from algae source, take with fat-containing meal"
- Instead of "exercise" → "150+ minutes moderate aerobic exercise weekly plus 2-3 resistance training sessions"

If user has allergies, substitute accordingly.

Format as JSON with these exact keys: gene, name, description, genotype, effect, impact, riskLevel, recommendations, interactions, nextSteps, functionalImpact`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a world-class functional medicine doctor and genetic counselor. Provide extremely specific, actionable health recommendations with exact dosages, precise timing, and detailed protocols. Never give generic advice.'
          },
          {
            role: 'user',
            content: prompt
          }
                  ],
          max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Try to parse as JSON, fallback to structured text if needed
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch (e) {
      // If JSON parsing fails, create a structured response
      parsedAnalysis = {
        name: name,
        description: 'AI-generated analysis',
        analysis: analysis,
        type: type
      };
    }

    return new Response(
      JSON.stringify(parsedAnalysis),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in ai-health-analysis:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}); 