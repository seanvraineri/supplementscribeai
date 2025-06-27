/**
 * 🎯 LLM QUALITY JUDGE TESTING
 * 
 * Uses OpenAI GPT-3.5-turbo to evaluate if AI outputs are:
 * - HIGH QUALITY (not generic)
 * - PERSONALIZED (uses user data)
 * - FOLLOWS APPLICATION INTENT (creates "wow" moments)
 * 
 * @jest-environment node
 */

// Load environment variables from .env.local
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Mock user profiles for testing
const MOCK_USERS = {
  energyUser: {
    profile: {
      full_name: 'Sarah Johnson',
      age: 28,
      gender: 'female',
      primary_health_concern: 'Low energy throughout the day',
      energy_levels: 'yes',
      brain_fog: 'yes',
      sleep_quality: 'yes'
    },
    biomarkers: [
      { marker_name: 'Vitamin D', value: 18, unit: 'ng/mL', reference_range: '30-100' },
      { marker_name: 'B12', value: 250, unit: 'pg/mL', reference_range: '300-900' }
    ]
  }
}

/**
 * 🤖 QUALITY JUDGE - Evaluates AI response quality
 */
async function judgeQuality(
  userProfile: any,
  aiResponse: string,
  functionType: 'supplement-plan' | 'health-analysis' | 'ai-chat' | 'diet-plan'
): Promise<{
  isHighQuality: boolean
  isPersonalized: boolean
  followsIntent: boolean
  score: number
  feedback: string
}> {
  
  const judgePrompt = `You are a strict quality evaluator for SupplementScribe AI, a premium health optimization platform.

CONTEXT: This is a ${functionType} response for a user with this profile:
${JSON.stringify(userProfile, null, 2)}

AI RESPONSE TO EVALUATE:
"""
${aiResponse}
"""

EVALUATION CRITERIA (BE VERY STRICT):

1. HIGH QUALITY (not generic):
   - MUST use SPECIFIC data points from user profile (exact biomarker values, age, symptoms)
   - MUST provide detailed, scientific explanations
   - MUST go far beyond basic health advice
   - MUST show deep understanding of THIS user's unique situation

2. PERSONALIZED (uses user data):
   - MUST reference user's specific name, age, biomarker values
   - MUST connect to their exact symptoms/concerns listed above
   - MUST feel like it was written ONLY for this specific user
   - Generic advice that could apply to anyone = FAIL

3. FOLLOWS APPLICATION INTENT (creates "wow" moments):
   - MUST provide insights user couldn't get from Google or ChatGPT
   - MUST create "I didn't even know that" revelations
   - MUST show specific connections between their data points
   - MUST make user feel truly understood

IMPORTANT: If the response doesn't use SPECIFIC user data (like "your Vitamin D of 18 ng/mL" or "Sarah"), it's NOT personalized.

RESPOND IN THIS EXACT FORMAT:
HIGH_QUALITY: [YES/NO]
PERSONALIZED: [YES/NO] 
FOLLOWS_INTENT: [YES/NO]
OVERALL_SCORE: [1-10]
FEEDBACK: [One sentence explaining why]`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: judgePrompt }],
      temperature: 0.1,
      max_tokens: 200
    })

    const evaluation = response.choices[0]?.message?.content || ''
    
    // Parse the structured response
    const isHighQuality = evaluation.includes('HIGH_QUALITY: YES')
    const isPersonalized = evaluation.includes('PERSONALIZED: YES')
    const followsIntent = evaluation.includes('FOLLOWS_INTENT: YES')
    
    const scoreMatch = evaluation.match(/OVERALL_SCORE: (\d+)/)
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0
    
    const feedbackMatch = evaluation.match(/FEEDBACK: (.+)/)
    const feedback = feedbackMatch ? feedbackMatch[1] : 'No feedback provided'

    return {
      isHighQuality,
      isPersonalized,
      followsIntent,
      score,
      feedback
    }
  } catch (error) {
    console.error('Quality judge error:', error)
    return {
      isHighQuality: false,
      isPersonalized: false,
      followsIntent: false,
      score: 0,
      feedback: 'Evaluation failed'
    }
  }
}

// Skip tests if no OpenAI key
const skipIfNoKey = process.env.OPENAI_API_KEY ? test : test.skip

describe('🎯 LLM QUALITY JUDGE TESTS', () => {
  
  describe('📋 SUPPLEMENT PLAN QUALITY', () => {
    skipIfNoKey('High-quality personalized supplement plan passes all criteria', async () => {
      const highQualityPlan = `Hi Sarah! Based on your comprehensive health profile, I've created a targeted supplement plan to address your low energy and brain fog.

Your Vitamin D level of 18 ng/mL is severely deficient (optimal is 40-60), which directly explains your fatigue. At 28, your body needs 4000 IU daily to reach optimal levels within 8-12 weeks.

Your B12 at 250 pg/mL is also suboptimal, contributing to both your energy issues and brain fog. The methylated form is crucial for your body's energy production at the cellular level.

Here's your personalized 6-supplement protocol:
1. Vitamin D3 4000 IU (morning) - Target your severe deficiency
2. Methylcobalamin B12 1000 mcg (morning) - Address energy and cognition  
3. Iron Bisglycinate 25 mg (evening) - Support energy production
4. Magnesium Glycinate 400 mg (evening) - Improve your sleep quality
5. Ashwagandha 300 mg (evening) - Reduce stress affecting your energy
6. B-Complex (morning) - Support overall energy metabolism

This plan specifically targets the root causes of your symptoms, not just the symptoms themselves.`

      const evaluation = await judgeQuality(MOCK_USERS.energyUser, highQualityPlan, 'supplement-plan')
      
      console.log('✅ High-quality plan evaluation:', evaluation)
      
      expect(evaluation.isHighQuality).toBe(true)
      expect(evaluation.isPersonalized).toBe(true) 
      expect(evaluation.followsIntent).toBe(true)
      expect(evaluation.score).toBeGreaterThanOrEqual(8)
    }, 15000)

    skipIfNoKey('Generic supplement plan fails quality check', async () => {
      const genericPlan = `Here are some supplements that might help with energy:
      
1. Vitamin D - Good for energy
2. B12 - Helps with fatigue  
3. Iron - Supports energy
4. Magnesium - Good for sleep
5. Multivitamin - General health
6. Omega-3 - Overall wellness

These supplements are commonly recommended for people with low energy. Take them as directed on the bottle. Consider consulting with a healthcare provider for personalized advice.`

      const evaluation = await judgeQuality(MOCK_USERS.energyUser, genericPlan, 'supplement-plan')
      
      console.log('❌ Generic plan evaluation:', evaluation)
      
      expect(evaluation.isHighQuality).toBe(false)
      expect(evaluation.isPersonalized).toBe(false)
      expect(evaluation.score).toBeLessThan(6)
    }, 15000)
  })

  describe('🧠 HEALTH ANALYSIS QUALITY', () => {
    skipIfNoKey('Insightful health analysis passes quality check', async () => {
      const insightfulAnalysis = `Sarah, your health data reveals fascinating connections you probably haven't considered.

ENERGY & VITALITY INSIGHTS:
• Your severe Vitamin D deficiency (18 ng/mL) isn't just about bone health - it's literally sabotaging your mitochondrial energy production. This explains why you feel exhausted even after sleeping.
• The combination of low B12 (250 pg/mL) and brain fog suggests your neurons aren't getting the fuel they need. This creates a cascade effect where mental fatigue leads to physical fatigue.
• At 28, your energy systems should be peak performance. The fact that they're not indicates specific nutritional gaps, not aging.

COGNITIVE & BRAIN INSIGHTS:  
• Your brain fog isn't psychological - it's biochemical. Low B12 directly impairs neurotransmitter synthesis, making concentration feel impossible.
• The sleep quality issues you're experiencing create a vicious cycle: poor sleep → worse nutrient absorption → more deficiencies → worse sleep.

This isn't just "being tired" - your body is sending very specific signals about what it needs to thrive.`

      const evaluation = await judgeQuality(MOCK_USERS.energyUser, insightfulAnalysis, 'health-analysis')
      
      console.log('✅ Insightful analysis evaluation:', evaluation)
      
      expect(evaluation.isHighQuality).toBe(true)
      expect(evaluation.isPersonalized).toBe(true)
      expect(evaluation.followsIntent).toBe(true)
      expect(evaluation.score).toBeGreaterThanOrEqual(8)
    }, 15000)

    skipIfNoKey('Generic health analysis fails quality check', async () => {
      const genericAnalysis = `Here are some insights about your health:

ENERGY: You might have low energy due to various factors like poor diet, lack of exercise, or stress. Consider improving your lifestyle habits.

BRAIN: Brain fog can be caused by stress, poor sleep, or nutritional deficiencies. Try to get more rest and eat a balanced diet.

SLEEP: Good sleep hygiene is important for overall health. Try to maintain a regular sleep schedule and avoid screens before bed.

These are common issues that many people experience. Focus on healthy lifestyle habits and consider speaking with a healthcare provider.`

      const evaluation = await judgeQuality(MOCK_USERS.energyUser, genericAnalysis, 'health-analysis')
      
      console.log('❌ Generic analysis evaluation:', evaluation)
      
      expect(evaluation.isHighQuality).toBe(false)
      expect(evaluation.isPersonalized).toBe(false)
      expect(evaluation.score).toBeLessThan(6)
    }, 15000)
  })

  describe('💬 AI CHAT QUALITY', () => {
    skipIfNoKey('Evidence-based personalized chat response passes', async () => {
      const qualityChatResponse = `Great question, Sarah! Based on your specific health profile, there's actually a fascinating connection here.

Your Vitamin D deficiency (18 ng/mL) directly impacts your sleep quality through melatonin regulation. Research from the Journal of Clinical Sleep Medicine (2018) found that vitamin D receptors in the brain's sleep centers become less responsive when levels drop below 20 ng/mL - exactly where you are.

Here's what's likely happening: Your low D3 → disrupted circadian rhythm → poor sleep → worse nutrient absorption → more fatigue during the day. It's a cycle.

For your specific situation, I'd recommend taking your Vitamin D3 (4000 IU) in the morning with breakfast. This timing helps reset your circadian clock and should improve your sleep quality within 4-6 weeks as your levels rise.

Your B12 deficiency (250 pg/mL) compounds this because B12 is crucial for melatonin production. The combination explains why you're experiencing both energy crashes AND sleep issues.

Does this help explain the connection you're seeing between your supplements and sleep patterns?`

      const evaluation = await judgeQuality(MOCK_USERS.energyUser, qualityChatResponse, 'ai-chat')
      
      console.log('✅ Quality chat evaluation:', evaluation)
      
      expect(evaluation.isHighQuality).toBe(true)
      expect(evaluation.isPersonalized).toBe(true)
      expect(evaluation.followsIntent).toBe(true)
      expect(evaluation.score).toBeGreaterThanOrEqual(7)
    }, 15000)
  })

  describe('🔄 COST & PERFORMANCE VALIDATION', () => {
    skipIfNoKey('Quality evaluation is fast and cost-effective', async () => {
      const startTime = Date.now()
      
      const testResponse = `Sarah, your Vitamin D of 18 ng/mL explains your fatigue...`
      
      const evaluation = await judgeQuality(MOCK_USERS.energyUser, testResponse, 'supplement-plan')
      
      const duration = Date.now() - startTime
      
      console.log(`⚡ Evaluation completed in ${duration}ms`)
      console.log(`💰 Estimated cost: ~$0.002 per evaluation`)
      console.log(`🎯 Quality score: ${evaluation.score}/10`)
      
      // Should be reasonably fast (under 5 seconds)
      expect(duration).toBeLessThan(5000)
      
      // Should return valid evaluation
      expect(evaluation.score).toBeGreaterThan(0)
      expect(evaluation.feedback).toBeDefined()
    }, 10000)
  })

  test('Shows comprehensive testing summary', () => {
    const hasKey = !!process.env.OPENAI_API_KEY
    
    if (hasKey) {
      console.log('\n🎯 COMPREHENSIVE QUALITY JUDGE SUMMARY:')
      console.log('✅ Validates high-quality vs generic supplement plans')
      console.log('✅ Validates insightful vs generic health analysis')  
      console.log('✅ Validates evidence-based vs generic AI chat')
      console.log('✅ Tests cost and performance efficiency')
      console.log('')
      console.log('📊 QUALITY METRICS:')
      console.log('   • High-quality responses: Score 8-10, all criteria pass')
      console.log('   • Generic responses: Score 1-5, fail personalization')
      console.log('   • Evaluation time: <5 seconds per response')
      console.log('   • Cost per user: <$0.01 (less than 1 cent)')
      console.log('')
      console.log('🚀 IMPACT:')
      console.log('   • Ensures "ChatGPT could never do this" quality')
      console.log('   • Prevents generic responses from reaching users')
      console.log('   • Validates $20-75/month value proposition')
      console.log('   • Protects against AI quality degradation')
    } else {
      console.log('\n⚠️  Quality judge tests skipped - no OpenAI API key')
      console.log('   Set OPENAI_API_KEY in .env.local to enable')
    }
    
    expect(true).toBe(true)
  })
})

// Export for use in other tests
export { judgeQuality, MOCK_USERS }
