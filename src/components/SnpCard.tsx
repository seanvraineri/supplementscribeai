'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, Info, AlertTriangle, Sparkles, Target, Check, Dna } from 'lucide-react';
import { SNPData, SNPAnalysisData } from '@/lib/types';

interface SnpCardProps {
  snp: SNPData;
  analysis: SNPAnalysisData;
  gene: string;
  rsid: string;
  index: number;
}

export default function SnpCard({ snp, analysis, gene, rsid, index }: SnpCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const safeAnalysis = analysis as any;
  const safeSnp = snp as any;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group bg-dark-background/60 backdrop-blur-sm border border-dark-border/50 rounded-2xl overflow-hidden hover:bg-dark-background/80 hover:border-dark-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-dark-accent/10"
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
              <Dna className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-dark-primary group-hover:text-dark-accent transition-colors">
              {gene} <span className="text-dark-secondary font-mono text-lg">({rsid})</span>
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-dark-border/50 rounded-xl text-sm font-mono text-dark-primary border border-dark-border">
              {safeSnp.genotype || 'N/A'}
            </span>
            <span className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-lg ${
              safeAnalysis.riskColor === 'green'
                ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 border border-emerald-500/30'
                : safeAnalysis.riskColor === 'orange'
                ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-400 border border-orange-500/30'
                : safeAnalysis.riskColor === 'red'
                ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30'
                : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {safeAnalysis.riskLevel || 'Normal'}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-dark-accent/10 hover:bg-dark-accent/20 text-dark-accent transition-colors"
            >
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick summary */}
        <div className="mb-4">
          <p className="text-sm font-medium text-dark-secondary uppercase tracking-wide mb-2">Status</p>
          <div className="flex items-start space-x-2">
            <div className="p-1 bg-dark-accent/20 rounded-lg mt-1">
              <CheckCircle className="h-4 w-4 text-dark-accent" />
            </div>
            <div className="space-y-1">
              <p className="text-dark-primary leading-relaxed">
                {safeAnalysis.variantStatus || safeAnalysis.variantEffect || safeAnalysis.functionalImpact || 'Genetic variant analyzed successfully'}
              </p>
              {safeAnalysis.variantEffect && safeAnalysis.functionalImpact && (
                <p className="text-xs text-dark-secondary">Impact: {safeAnalysis.functionalImpact}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-dark-border/30"
          >
            <div className="p-6 space-y-6">
              {safeAnalysis.whatItDoes && (
                <div className="bg-dark-panel/40 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Info className="h-5 w-5 text-blue-400" />
                    <h4 className="text-lg font-semibold text-dark-primary">What This Gene Does</h4>
                  </div>
                  <p className="text-dark-secondary leading-relaxed">{safeAnalysis.whatItDoes}</p>
                </div>
              )}

              {safeAnalysis.variantEffect && (
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Dna className="h-5 w-5 text-purple-400" />
                    <h4 className="text-lg font-semibold text-dark-primary">Genetic Variant Effect</h4>
                  </div>
                  <p className="text-dark-primary leading-relaxed mb-2">{safeAnalysis.variantEffect}</p>
                  {safeAnalysis.functionalImpact && (
                    <p className="text-sm text-dark-secondary"><strong>Functional Impact:</strong> {safeAnalysis.functionalImpact}</p>
                  )}
                </div>
              )}

              {safeAnalysis.recommendations && safeAnalysis.recommendations.length > 0 && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                    <h4 className="text-lg font-semibold text-dark-primary">Personalized Recommendations</h4>
                  </div>
                  <div className="space-y-3">
                    {safeAnalysis.recommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="p-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg mt-0.5">
                          <Check className="h-3 w-3 text-emerald-400" />
                        </div>
                        <p className="text-dark-primary text-sm leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {safeAnalysis.actionPlan && (
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="h-5 w-5 text-purple-400" />
                    <h4 className="text-lg font-semibold text-dark-primary">Action Plan</h4>
                  </div>
                  <p className="text-dark-primary leading-relaxed">{safeAnalysis.actionPlan}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 