'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, Info, AlertTriangle, Sparkles, Target, Check } from 'lucide-react';
import { BiomarkerData, BiomarkerAnalysisData } from '@/lib/types';

interface BiomarkerCardProps {
  biomarker: BiomarkerData;
  analysis: BiomarkerAnalysisData;
  cleanName: string;
  index: number;
}

export default function BiomarkerCard({ biomarker, analysis, cleanName, index }: BiomarkerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const safeAnalysis = analysis as any;
  const safeBiomarker = biomarker as any;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-dark-background/60 backdrop-blur-sm border border-dark-border/50 rounded-2xl overflow-hidden hover:bg-dark-background/80 hover:border-dark-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-dark-accent/10"
    >
      {/* Main Card Header - Always Visible */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-dark-primary group-hover:text-dark-accent transition-colors">
            {cleanName}
          </h3>
          <div className="flex items-center space-x-3">
            <span className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-lg ${
              safeAnalysis.statusColor === 'green' ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 border border-emerald-500/30' :
              safeAnalysis.statusColor === 'yellow' ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30' :
              safeAnalysis.statusColor === 'red' ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30' :
              'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {safeAnalysis.status || 'Normal'}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-dark-accent/10 hover:bg-dark-accent/20 text-dark-accent transition-colors"
            >
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Quick Summary - Always Visible */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-dark-secondary uppercase tracking-wide">Your Value</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-dark-primary">
                {safeBiomarker.value || 'Not provided'}
              </span>
              <span className="text-lg text-dark-secondary font-medium">
                {safeBiomarker.unit || ''}
              </span>
            </div>
            {safeBiomarker.reference_range && (
              <p className="text-sm text-dark-secondary bg-dark-border/30 rounded-lg px-3 py-1 inline-block">
                Lab Range: {safeBiomarker.reference_range}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-dark-secondary uppercase tracking-wide">Status</p>
            <div className="flex items-start space-x-2">
              <div className="p-1 bg-dark-accent/20 rounded-lg mt-1">
                <CheckCircle className="h-4 w-4 text-dark-accent" />
              </div>
              <div className="space-y-1">
                <p className="text-dark-primary leading-relaxed">
                  {safeAnalysis.inRangeStatus || safeAnalysis.interpretation || 'Data captured successfully'}
                </p>
                {safeAnalysis.referenceRange && (
                  <p className="text-xs text-dark-secondary">
                    Optimal: {safeAnalysis.referenceRange}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Detailed Analysis */}
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
              {/* What It Does Section */}
              {safeAnalysis.whatItDoes && (
                <div className="bg-dark-panel/40 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Info className="h-5 w-5 text-blue-400" />
                    <h4 className="text-lg font-semibold text-dark-primary">What This Biomarker Does</h4>
                  </div>
                  <p className="text-dark-secondary leading-relaxed">
                    {safeAnalysis.whatItDoes}
                  </p>
                </div>
              )}
              
              {/* Symptoms Section */}
              {safeAnalysis.symptoms && safeAnalysis.symptoms.length > 0 && (
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                    <h4 className="text-lg font-semibold text-dark-primary">Potential Symptoms</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {safeAnalysis.symptoms.map((symptom: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <p className="text-dark-primary text-sm">{symptom}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Recommendations Section */}
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

              {/* Action Plan Section */}
              {safeAnalysis.actionPlan && (
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="h-5 w-5 text-purple-400" />
                    <h4 className="text-lg font-semibold text-dark-primary">Action Plan</h4>
                  </div>
                  <p className="text-dark-primary leading-relaxed">
                    {safeAnalysis.actionPlan}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 