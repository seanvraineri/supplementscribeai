// Simple test to verify the integration approach works
import { judgePersonalization, logQualityMetrics } from './supabase/functions/quality-judge/index.ts';

const testResponse = `Hi Sarah! Based on your Vitamin D level of 18 ng/mL, here's your plan...`;

try {
  const evaluation = await judgePersonalization(testResponse, 'supplement-plan', 'test-user');
  logQualityMetrics(evaluation);
  console.log('✅ Quality monitoring integration test passed!');
} catch (error) {
  console.error('❌ Integration test failed:', error);
}
