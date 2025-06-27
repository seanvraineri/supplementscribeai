/**
 * 🎯 ZERO-RISK QUALITY JUDGE INTEGRATION EXAMPLE
 * 
 * This shows how to add quality monitoring to existing edge functions
 * WITHOUT breaking anything or changing database schema
 */

// 1. ADD QUALITY JUDGE IMPORT (at top of edge function)
import { judgePersonalization } from '../quality-judge/index.ts'

// 2. EXISTING FUNCTION LOGIC (UNCHANGED)
export default async function handler(req: Request) {
  // ... all your existing code stays exactly the same ...
  
  // Get user data (UNCHANGED)
  const profile = await supabase.from('user_profiles').select('*')...
  const biomarkers = await supabase.from('user_biomarkers').select('*')...
  
  // Generate AI response (UNCHANGED)
  const aiResponse = await openai.chat.completions.create({
    model: 'o1-mini',
    messages: [...],
    // ... all existing parameters stay the same
  })
  
  const responseContent = aiResponse.choices[0]?.message?.content || ''
  
  // 3. ADD QUALITY MONITORING (NEW - ZERO RISK)
  try {
    const qualityEvaluation = await judgePersonalization(
      responseContent,
      'supplement-plan' // or 'health-analysis', 'ai-chat'
    )
    
    // Log quality metrics (for monitoring/analytics)
    console.log('🎯 Quality Check:', {
      userId: user.id,
      functionName: 'generate-plan',
      qualityScore: qualityEvaluation.score,
      isPersonalized: qualityEvaluation.isPersonalized,
      usesSpecificData: qualityEvaluation.usesSpecificData,
      feedback: qualityEvaluation.feedback,
      timestamp: new Date().toISOString()
    })
    
    // Optional: Store quality metrics in existing tables
    // (Could add to supplement_plans.plan_details.quality_score)
    
  } catch (qualityError) {
    // Quality check failed - log but don't break function
    console.error('Quality check failed (non-critical):', qualityError)
  }
  
  // 4. RETURN RESPONSE (UNCHANGED)
  return new Response(JSON.stringify({
    // ... all existing response data stays the same
    supplements: recommendations,
    // Optional: Add quality score to response
    quality_score: qualityEvaluation?.score || null
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
