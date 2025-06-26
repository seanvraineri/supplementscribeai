/**
 * Testing Configuration
 * Handles different testing modes and environments
 */

export interface TestingConfig {
  skipPayments: boolean;
  skipOrderCreation: boolean;
  useTestCustomers: boolean;
  testMode: boolean;
  environment: 'development' | 'staging' | 'production';
}

export const getTestingConfig = (): TestingConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTestingMode = process.env.TESTING_MODE === 'true';
  
  return {
    skipPayments: process.env.SKIP_PAYMENTS === 'true' || isTestingMode,
    skipOrderCreation: process.env.SKIP_ORDER_CREATION === 'true',
    useTestCustomers: process.env.USE_TEST_CUSTOMERS === 'true' || isTestingMode,
    testMode: isTestingMode || isDevelopment,
    environment: (process.env.NODE_ENV as any) || 'development'
  };
};

// Test user profiles for different scenarios
export const TEST_PROFILES = {
  BASIC_USER: {
    full_name: 'Test Basic User',
    age: 25,
    gender: 'female',
    subscription_tier: 'basic',
    health_goals: ['energy_performance'],
    email: 'test-basic@supplementscribe.ai'
  },
  FULL_USER: {
    full_name: 'Test Full User',
    age: 30,
    gender: 'male', 
    subscription_tier: 'full',
    health_goals: ['weight_management', 'athletic_performance'],
    email: 'test-full@supplementscribe.ai'
  },
  PREMIUM_USER: {
    full_name: 'Test Premium User',
    age: 35,
    gender: 'female',
    subscription_tier: 'full',
    health_goals: ['longevity', 'cognitive_enhancement'],
    email: 'test-premium@supplementscribe.ai'
  }
};

// Test order scenarios
export const TEST_SCENARIOS = {
  FIRST_ORDER: 'first_order',
  RECURRING_ORDER: 'recurring_order',
  PLAN_UPDATE: 'plan_update',
  SUBSCRIPTION_CHANGE: 'subscription_change'
};

export const shouldSkipPayments = (): boolean => {
  return getTestingConfig().skipPayments;
};

export const shouldSkipOrderCreation = (): boolean => {
  return getTestingConfig().skipOrderCreation;
};

export const isTestMode = (): boolean => {
  return getTestingConfig().testMode;
};

export const getTestCustomerEmail = (userId: string): string => {
  if (getTestingConfig().useTestCustomers) {
    return `test-${userId}@supplementscribe.ai`;
  }
  return `user-${userId}@supplementscribe.ai`;
};