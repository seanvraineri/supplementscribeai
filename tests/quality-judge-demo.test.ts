/**
 * 🎯 LLM QUALITY JUDGE DEMO
 * Simple test to verify OpenAI integration works
 * 
 * @jest-environment node
 */

// Load environment variables from .env.local
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import OpenAI from 'openai'

// Skip tests if no OpenAI key
const skipIfNoKey = process.env.OPENAI_API_KEY ? test : test.skip

describe('🎯 LLM QUALITY JUDGE DEMO', () => {
  skipIfNoKey('OpenAI connection works', async () => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Rate this supplement plan quality from 1-10: "Take Vitamin D 2000 IU daily for general health."' }
      ],
      max_tokens: 50,
      temperature: 0.1
    })

    expect(response.choices[0]?.message?.content).toBeDefined()
    expect(response.choices[0]?.message?.content?.length).toBeGreaterThan(0)
    
    console.log('✅ OpenAI Response:', response.choices[0]?.message?.content)
  }, 10000)

  test('Shows environment status', () => {
    const hasKey = !!process.env.OPENAI_API_KEY
    console.log(`🔑 OpenAI API Key: ${hasKey ? 'Found' : 'Not found'}`)
    
    if (!hasKey) {
      console.log('⚠️  Quality judge tests will be skipped')
      console.log('   Make sure OPENAI_API_KEY is set in .env.local')
    } else {
      console.log('🚀 Quality judge tests will run!')
    }
    
    expect(true).toBe(true) // Always passes
  })
})
