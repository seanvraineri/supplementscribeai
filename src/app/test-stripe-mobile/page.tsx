"use client";

import { useState } from 'react';
import { StripeCheckoutModal } from '@/components/payment/StripeCheckoutModal';
import { OnboardingData } from '@/lib/schemas';

export default function TestStripeMobile() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'full' | 'software_only'>('full');
  
  const mockOnboardingData: OnboardingData = {
    fullName: 'Test User',
    age: 30,
    gender: 'male',
    height_ft: 5,
    height_in: 10,
    weight_lbs: 170,
    healthGoals: ['energy'],
    subscription_tier: 'full',
    shipping_name: 'Test User',
    shipping_address_line1: '123 Test Street',
    shipping_city: 'Test City',
    shipping_state: 'CA',
    shipping_postal_code: '12345',
    shipping_country: 'US',
    shipping_phone: '1234567890',
    allergies: [],
    conditions: [],
    medications: [],
    activity_level: 'moderate',
    sleep_hours: 7,
    alcohol_intake: 'moderate',
    dietary_preference: 'omnivore',
    primary_health_concern: 'Energy and focus'
  };
  
  return (
    <div className="min-h-screen bg-dark-background p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-dark-primary mb-8 text-center">
          Test Stripe Payment (Mobile)
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              setSelectedTier('full');
              setShowModal(true);
            }}
            className="w-full p-4 bg-dark-panel border border-dark-border rounded-lg hover:border-dark-accent transition-colors"
          >
            <h3 className="font-semibold text-dark-primary">Complete Package</h3>
            <p className="text-dark-secondary text-sm">$75/month - Software + Supplements</p>
          </button>
          
          <button
            onClick={() => {
              setSelectedTier('software_only');
              setShowModal(true);
            }}
            className="w-full p-4 bg-dark-panel border border-dark-border rounded-lg hover:border-dark-accent transition-colors"
          >
            <h3 className="font-semibold text-dark-primary">Software Only</h3>
            <p className="text-dark-secondary text-sm">$19.99/month - Just the Intelligence</p>
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-dark-accent/10 rounded-lg">
          <h2 className="font-semibold text-dark-primary mb-2">Mobile Test Instructions:</h2>
          <ul className="text-sm text-dark-secondary space-y-1">
            <li>• Tap a plan to open payment modal</li>
            <li>• Check slide-up animation</li>
            <li>• Verify card input is readable</li>
            <li>• Test touch targets and scrolling</li>
            <li>• Swipe down or tap X to close</li>
          </ul>
        </div>
      </div>
      
      <StripeCheckoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedTier={selectedTier}
        onboardingData={mockOnboardingData}
        onPaymentSuccess={() => {
          alert('Payment successful!');
          setShowModal(false);
        }}
      />
    </div>
  );
} 