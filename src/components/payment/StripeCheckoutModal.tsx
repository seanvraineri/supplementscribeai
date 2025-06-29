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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tierInfo = TIER_INFO[selectedTier as keyof typeof TIER_INFO];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Prevent double-submission
    if (isSubmitting || loading || paymentSucceeded) {
      console.log('Payment already in progress, ignoring click');
      return;
    }

    if (!stripe || !elements) {
      setError('Stripe not loaded');
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      setLoading(false);
      setIsSubmitting(false);
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
        
        // Clean up body styles immediately
        document.body.style.overflow = '';
        document.body.style.position = '';
        
        // Payment successful - close modal and trigger success callback
        setTimeout(() => {
          onClose(); // Close the modal first
          onPaymentSuccess(); // Then trigger the success callback
        }, 1500);
      }

    } catch (err: any) {
      setError(err.message || 'Payment failed');
      setLoading(false);
      setIsSubmitting(false); // Allow retry on error
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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Selected Plan Summary */}
      <div className="bg-dark-background rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-dark-accent/20 rounded-lg">
            <tierInfo.icon className="w-5 h-5 sm:w-6 sm:h-6 text-dark-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-dark-primary text-sm sm:text-base">{tierInfo.title}</h3>
            <p className="text-xs sm:text-sm text-dark-secondary">{tierInfo.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-dark-primary">{tierInfo.price}</div>
            <div className="text-xs sm:text-sm text-dark-secondary">{tierInfo.period}</div>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="space-y-3 sm:space-y-4">
        <label className="block text-sm font-medium text-dark-primary">
          Card Details
        </label>
        <div className="p-4 border-2 border-dark-border rounded-lg bg-dark-panel focus-within:border-dark-accent transition-colors touch-manipulation">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '18px', // Increased for better mobile readability
                  lineHeight: '28px', // Better touch spacing
                  color: '#ffffff',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  '::placeholder': {
                    color: '#6b7280',
                  },
                  padding: '12px',
                },
                invalid: {
                  color: '#ef4444',
                  iconColor: '#ef4444',
                },
              },
              hidePostalCode: false,
            }}
          />
        </div>
      </div>

      {/* What Happens Next */}
      <div className="bg-dark-accent/10 rounded-lg p-3 sm:p-4">
        <h4 className="font-semibold text-dark-primary mb-2 text-sm sm:text-base">What happens after payment:</h4>
        <ul className="space-y-1 text-xs sm:text-sm text-dark-secondary">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-dark-accent flex-shrink-0" />
            <span>AI generates your personalized supplement plan</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-dark-accent flex-shrink-0" />
            <span>Health analysis and insights created</span>
          </li>
          {selectedTier === 'full' && (
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-dark-accent flex-shrink-0" />
              <span>First month's supplements automatically ordered & shipped</span>
            </li>
          )}
          <li className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-dark-accent flex-shrink-0" />
            <span>Instant access to your personal dashboard</span>
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
        disabled={!stripe || loading || isSubmitting}
        className="w-full bg-dark-accent hover:bg-dark-accent/80 active:bg-dark-accent/60 text-dark-background font-semibold py-4 px-6 rounded-xl transition-colors duration-100 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] text-base shadow-lg shadow-dark-accent/20 touch-manipulation"
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          userSelect: 'none'
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = 'scale(0.98)';
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            <span>Processing payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Pay {tierInfo.price}{tierInfo.period} & Get Your Plan</span>
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
  // Prevent viewport zoom on input focus for iOS
  useEffect(() => {
    if (isOpen) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
      }
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1');
      }
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[9999] p-0 sm:p-6"
      onClick={(e) => {
        // Close modal when clicking outside on desktop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-dark-panel rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 w-full sm:max-w-md lg:max-w-lg border border-dark-border max-h-[90vh] sm:max-h-[95vh] overflow-y-auto no-scrollbar sm:scrollbar-thin pb-safe sm:pb-6 overscroll-contain"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1 bg-dark-border rounded-full mx-auto mb-4 sm:hidden" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-dark-primary">Complete Your Subscription</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-border rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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