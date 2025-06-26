"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Package, Brain, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { OnboardingData } from '@/lib/schemas';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier: string;
  onboardingData: OnboardingData;
  onPaymentSuccess: () => void;
}

const TIER_INFO = {
  'full': {
    title: 'Complete Package',
    price: '$75',
    period: '/month',
    icon: Package,
    description: 'Software + Monthly Supplements'
  },
  'software_only': {
    title: 'Software Only', 
    price: '$19.99',
    period: '/month',
    icon: Brain,
    description: 'Just the Intelligence'
  }
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ 
  selectedTier, 
  onboardingData, 
  onPaymentSuccess, 
  onClose 
}: {
  selectedTier: string;
  onboardingData: OnboardingData;
  onPaymentSuccess: () => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const tierInfo = TIER_INFO[selectedTier as keyof typeof TIER_INFO];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe not loaded');
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      setLoading(false);
      return;
    }

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: selectedTier === 'full' ? 'complete' : 'software_only',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        setPaymentSucceeded(true);
        setLoading(false);
        
        // Payment successful - just close modal after showing success
        setTimeout(() => {
          onPaymentSuccess();
        }, 1500);
      }

    } catch (err: any) {
      setError(err.message || 'Payment failed');
      setLoading(false);
    }
  };

  if (paymentSucceeded) {
    return (
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto mb-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-bold text-dark-primary mb-2">Payment Successful!</h3>
        <p className="text-dark-secondary">Starting your personalized plan generation...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selected Plan Summary */}
      <div className="bg-dark-background rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-dark-accent/20 rounded-lg">
            <tierInfo.icon className="w-6 h-6 text-dark-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-dark-primary">{tierInfo.title}</h3>
            <p className="text-sm text-dark-secondary">{tierInfo.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-dark-primary">{tierInfo.price}</div>
            <div className="text-sm text-dark-secondary">{tierInfo.period}</div>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-dark-primary">
          Card Details
        </label>
        <div className="p-4 border border-dark-border rounded-lg bg-dark-panel">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ffffff',
                  '::placeholder': {
                    color: '#6b7280',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
              },
              hidePostalCode: false,
            }}
          />
        </div>
      </div>

      {/* What Happens Next */}
      <div className="bg-dark-accent/10 rounded-lg p-4">
        <h4 className="font-semibold text-dark-primary mb-2">What happens after payment:</h4>
        <ul className="space-y-1 text-sm text-dark-secondary">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-dark-accent" />
            AI generates your personalized supplement plan
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-dark-accent" />
            Health analysis and insights created
          </li>
          {selectedTier === 'full' && (
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-dark-accent" />
              First month's supplements automatically ordered & shipped
            </li>
          )}
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-dark-accent" />
            Instant access to your personal dashboard
          </li>
        </ul>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Payment Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-dark-accent hover:bg-dark-accent/80 text-dark-background font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing payment...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay {tierInfo.price}{tierInfo.period} & Get Your Plan
          </>
        )}
      </button>

      {/* Security Note */}
      <p className="text-xs text-dark-secondary text-center">
        🔒 Secure payment powered by Stripe. Cancel anytime.
      </p>
    </form>
  );
}

export function StripeCheckoutModal({ 
  isOpen, 
  onClose, 
  selectedTier, 
  onboardingData, 
  onPaymentSuccess 
}: StripeCheckoutModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-panel rounded-2xl p-8 max-w-md w-full border border-dark-border max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-dark-primary">Complete Your Subscription</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-border rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-secondary" />
          </button>
        </div>

        {/* Stripe Elements Provider */}
        <Elements stripe={stripePromise}>
          <CheckoutForm
            selectedTier={selectedTier}
            onboardingData={onboardingData}
            onPaymentSuccess={onPaymentSuccess}
            onClose={onClose}
          />
        </Elements>
      </motion.div>
    </motion.div>
  );
} 