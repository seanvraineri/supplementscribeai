/**
 * 🎯 PRODUCTION QUALITY JUDGE
 * 
 * Evaluates AI response quality for monitoring and analytics
 * ZERO RISK - Only logs quality metrics, never breaks functionality
 */

interface QualityEvaluation {
  usesSpecificData: boolean
  isPersonalized: boolean
  score: number
  feedback: string
  functionType: string
  userId?: string
  timestamp: string
}

/**
 * 🤖 QUALITY JUDGE - Evaluates if response is truly personalized
 * This is MONITORING ONLY - never throws errors or breaks functionality
 */
export async function judgePersonalization(
  aiResponse: string,
  functionType: 'supplement-plan' | 'health-analysis' | 'ai-chat' | 'diet-plan',
  userId?: string
): Promise<QualityEvaluation | null> {
  
  // Early return if no OpenAI key (development/testing environments)
  const openaiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiKey) {
    console.log('⚠️ Quality judge skipped - no OpenAI API key')
    return null
  }

  // Early return if response is too short to evaluate
  if (!aiResponse || aiResponse.length < 50) {
    console.log('⚠️ Quality judge skipped - response too short')
    return null
  }

  try {
    const judgePrompt = `You are evaluating a ${functionType} response for personalization quality.

AI RESPONSE:
"""
${aiResponse.substring(0, 2000)}
"""

STRICT EVALUATION CRITERIA:

1. USES SPECIFIC DATA:
   - Does it mention specific biomarker values (like "18 ng/mL" or "250 pg/mL")?
   - Does it use the person's actual name?
   - Does it reference specific age or symptoms?

2. IS PERSONALIZED:
   - Would this response ONLY work for one specific person?
   - Or could this be sent to anyone with similar issues?
   - Does it feel custom-written or template-based?

RESPOND IN THIS EXACT FORMAT:
USES_SPECIFIC_DATA: [YES/NO]
IS_PERSONALIZED: [YES/NO]
SCORE: [1-10]
FEEDBACK: [One sentence why]`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: judgePrompt }],
        temperature: 0.1,
        max_tokens: 150
      })
    })

    if (!response.ok) {
      console.error('Quality judge API error:', response.status)
      return null
    }

    const data = await response.json()
    const evaluation = data.choices[0]?.message?.content || ''
    
    // Parse the structured response
    const usesSpecificData = evaluation.includes('USES_SPECIFIC_DATA: YES')
    const isPersonalized = evaluation.includes('IS_PERSONALIZED: YES')
    
    const scoreMatch = evaluation.match(/SCORE: (\d+)/)
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0
    
    const feedbackMatch = evaluation.match(/FEEDBACK: (.+)/)
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'No feedback provided'

    return {
      usesSpecificData,
      isPersonalized,
      score,
      feedback,
      functionType,
      userId,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    // NEVER throw errors - just log and return null
    console.error('Quality judge error (non-critical):', error)
    return null
  }
}

/**
 * 📊 LOG QUALITY METRICS
 * Standardized logging for quality monitoring
 */
export function logQualityMetrics(evaluation: QualityEvaluation | null, additionalContext?: any) {
  if (!evaluation) {
    console.log('🎯 Quality Check: Skipped')
    return
  }

  // Structured logging for monitoring systems
  console.log('🎯 QUALITY METRICS:', {
    function: evaluation.functionType,
    user_id: evaluation.userId || 'anonymous',
    quality_score: evaluation.score,
    is_personalized: evaluation.isPersonalized,
    uses_specific_data: evaluation.usesSpecificData,
    feedback: evaluation.feedback,
    timestamp: evaluation.timestamp,
    cost_estimate: '$0.001',
    ...additionalContext
  })

  // Alert on low quality (for monitoring)
  if (evaluation.score < 6) {
    console.warn('⚠️ LOW QUALITY ALERT:', {
      function: evaluation.functionType,
      score: evaluation.score,
      reason: evaluation.feedback,
      user_id: evaluation.userId
    })
  }

  // Celebrate high quality
  if (evaluation.score >= 9) {
    console.log('🏆 HIGH QUALITY SUCCESS:', {
      function: evaluation.functionType,
      score: evaluation.score,
      user_id: evaluation.userId
    })
  }
}

/**
 * 🔄 QUALITY MONITORING WRAPPER
 * Easy way to add quality monitoring to any edge function
 */
export async function withQualityMonitoring<T>(
  functionName: string,
  userId: string,
  aiResponse: string,
  functionType: 'supplement-plan' | 'health-analysis' | 'ai-chat' | 'diet-plan',
  originalResponse: T
): Promise<T> {
  
  // Run quality evaluation in background (non-blocking)
  setTimeout(async () => {
    const evaluation = await judgePersonalization(aiResponse, functionType, userId)
    logQualityMetrics(evaluation, { function_name: functionName })
  }, 0)

  // Return original response immediately (zero latency impact)
  return originalResponse
}
