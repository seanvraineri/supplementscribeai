"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { X, Package, DollarSign, CheckCircle, Sparkles } from 'lucide-react';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  onContinueWithSoftware: () => void;
  customerName: string;
}

export function UpsellModal({ 
  isOpen, 
  onClose, 
  onUpgrade, 
  onContinueWithSoftware,
  customerName 
}: UpsellModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-dark-panel border border-dark-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-dark-accent/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-dark-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-dark-primary">
                  Wait, {customerName}!
                </h2>
                <p className="text-sm text-dark-secondary">
                  See what you'd save with supplements included
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-dark-secondary hover:text-dark-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cost Comparison */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-dark-primary mb-2">
              Here's what your supplements would cost buying individually:
            </h3>
            <p className="text-dark-secondary text-sm">
              Based on typical personalized supplement recommendations
            </p>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-dark-background/50 rounded-lg p-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-dark-border/50">
                <span className="text-dark-secondary">Adaptogen (Ashwagandha)</span>
                <span className="text-dark-primary font-medium">$28/month</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-dark-border/50">
                <span className="text-dark-secondary">Stress Support (Rhodiola)</span>
                <span className="text-dark-primary font-medium">$35/month</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-dark-border/50">
                <span className="text-dark-secondary">Sleep Support (Magnesium)</span>
                <span className="text-dark-primary font-medium">$22/month</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-dark-border/50">
                <span className="text-dark-secondary">Immune Support (D3+K2)</span>
                <span className="text-dark-primary font-medium">$18/month</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-dark-border/50">
                <span className="text-dark-secondary">Energy Support (B-Complex)</span>
                <span className="text-dark-primary font-medium">$32/month</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-dark-secondary">Brain Support (Omega-3)</span>
                <span className="text-dark-primary font-medium">$45/month</span>
              </div>
            </div>
            
            {/* Total */}
            <div className="border-t border-dark-border mt-4 pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="text-dark-primary">DIY Total:</span>
                <span className="text-red-400">$180/month</span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold mt-2">
                <span className="text-dark-primary">Complete Package:</span>
                <span className="text-green-400">$75/month</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold mt-3 p-3 bg-dark-accent/10 rounded-lg">
                <span className="text-dark-accent">YOU SAVE:</span>
                <span className="text-dark-accent">$105/month</span>
              </div>
              <p className="text-center text-dark-secondary text-sm mt-2">
                That's <span className="text-dark-accent font-semibold">$1,260 saved per year</span> + all AI features included!
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-dark-primary mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-dark-accent" />
              Plus you get:
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-dark-secondary text-sm">Pharmaceutical-grade supplements</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-dark-secondary text-sm">Exact dosages for your genetics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-dark-secondary text-sm">Monthly delivery to your door</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-dark-secondary text-sm">No research, shopping, or guessing</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onUpgrade}
              className="w-full bg-dark-accent hover:bg-dark-accent/90 text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Yes, Upgrade & Save $105/Month
            </button>
            <button
              onClick={onContinueWithSoftware}
              className="w-full border border-dark-border hover:bg-dark-background/50 text-dark-secondary py-3 px-6 rounded-lg transition-all"
            >
              No thanks, continue with Software Only
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 