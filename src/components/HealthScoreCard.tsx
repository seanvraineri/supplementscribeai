'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { 
  Heart, 
  TrendingUp, 
  Zap, 
  Shield, 
  Activity,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient();

interface HealthScoreData {
  healthScore: number;
  scoreBreakdown: {
    lifestyleHabits: number;
    symptomBurden: number;
    physicalWellness: number;
    riskFactors: number;
  };
  summary: string;
  strengths: string[];
  concerns: string[];
  topRecommendations: string[];
  scoreExplanation: string;
}

interface HealthScoreCardProps {
  onViewDetails?: () => void;
}

export default function HealthScoreCard({ onViewDetails }: HealthScoreCardProps) {
  const [healthScore, setHealthScore] = useState<HealthScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const loadExistingHealthScore = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Please log in to view your health score');
        return;
      }

      console.log('🔍 Loading existing health score from database...');

      // Load existing health score from database ONLY
      const { data: existingScore, error: dbError } = await supabase
        .from('user_health_scores')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingScore && !dbError) {
        console.log('✅ Health score loaded from database');
        // Health score exists, use it
        setHealthScore({
          healthScore: existingScore.health_score,
          scoreBreakdown: existingScore.score_breakdown,
          summary: existingScore.analysis_summary,
          strengths: existingScore.strengths || [],
          concerns: existingScore.concerns || [],
          topRecommendations: existingScore.recommendations || [],
          scoreExplanation: existingScore.score_explanation || 'Your health score is calculated based on your onboarding responses across multiple health domains.'
        });
      } else {
        console.log('❌ No health score found in database');
        // No existing health score found
        setHealthScore(null);
      }
    } catch (err: any) {
      console.error('Health score load error:', err);
      setError(err.message || 'Failed to load health score');
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateHealthScore = async () => {
    setIsRegenerating(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Please log in to regenerate your health score');
        return;
      }

      console.log('🔄 Regenerating health score...');

      // Call the health-score edge function
      const healthScoreResponse = await supabase.functions.invoke('health-score', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (healthScoreResponse.error) {
        console.error('❌ Health score regeneration failed:', healthScoreResponse.error);
        setError('Failed to regenerate health score. Please try again later.');
      } else if (healthScoreResponse.data) {
        console.log('✅ Health score regenerated successfully!');
        
        // Wait for database commit then reload (simple timing fix)
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        await loadExistingHealthScore();
      } else {
        setError('Health score regeneration returned empty response');
      }
    } catch (err: any) {
      console.error('Health score regeneration error:', err);
      setError(err.message || 'Failed to regenerate health score');
    } finally {
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    loadExistingHealthScore();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 55) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'from-green-500/20 to-green-600/20';
    if (score >= 70) return 'from-blue-500/20 to-blue-600/20';
    if (score >= 55) return 'from-yellow-500/20 to-yellow-600/20';
    return 'from-red-500/20 to-red-600/20';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 55) return 'Fair';
    return 'Needs Attention';
  };

  const categoryIcons = {
    lifestyleHabits: Heart,
    symptomBurden: Zap,
    physicalWellness: Activity,
    riskFactors: Shield
  };

  const categoryLabels = {
    lifestyleHabits: 'Lifestyle Habits',
    symptomBurden: 'Symptom Burden',
    physicalWellness: 'Physical Wellness',
    riskFactors: 'Risk Factors'
  };

  if (isLoading) {
    return (
      <Card className="bg-dark-panel border-dark-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-dark-primary flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-dark-accent" />
                Health Score
              </CardTitle>
              <CardDescription className="text-dark-secondary">
                AI-powered health assessment
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-6 w-6 text-dark-accent animate-spin" />
              <span className="text-dark-secondary">Analyzing your health data...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-dark-panel border-dark-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-dark-primary flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-dark-accent" />
                Health Score
              </CardTitle>
              <CardDescription className="text-dark-secondary">
                AI-powered health assessment
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-dark-secondary mb-4">{error}</p>
            <p className="text-dark-secondary text-sm">
              Health scores are generated during onboarding. Please contact support if this issue persists.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!healthScore) {
    return (
      <Card className="bg-dark-panel border-dark-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-dark-primary flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-dark-accent" />
                Health Score
              </CardTitle>
              <CardDescription className="text-dark-secondary">
                AI-powered health assessment
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-dark-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-dark-primary mb-2">No Health Score Available</h3>
            <p className="text-dark-secondary mb-4">Your health score is generated automatically when you complete the onboarding process.</p>
            <p className="text-dark-secondary text-sm mb-6">
              This appears to be an older account or the health score generation may have failed during onboarding.
            </p>
            <Button 
              onClick={regenerateHealthScore} 
              disabled={isRegenerating}
              className="bg-dark-accent hover:bg-dark-accent/80 text-white"
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Health Score
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-dark-panel border-dark-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-dark-primary flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-dark-accent" />
              Health Score
            </CardTitle>
            <CardDescription className="text-dark-secondary">
              AI-powered health assessment
            </CardDescription>
          </div>
          <div className="w-6 h-6 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-dark-accent" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score Display */}
        <div className="text-center">
          <div className="relative">
            <div className={`relative inline-flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br ${getScoreBgColor(healthScore.healthScore)} border-4 border-dark-border shadow-2xl`}>
              {/* Animated ring */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent">
                <div 
                  className={`absolute inset-0 rounded-full border-4 border-transparent border-t-current ${getScoreColor(healthScore.healthScore)} animate-spin`}
                  style={{ animationDuration: '3s' }}
                />
              </div>
              <div className="text-center z-10">
                <motion.div 
                  className={`text-5xl font-bold ${getScoreColor(healthScore.healthScore)}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {healthScore.healthScore}
                </motion.div>
                <div className="text-xs text-dark-secondary font-medium uppercase tracking-wider">
                  {getScoreLabel(healthScore.healthScore)}
                </div>
              </div>
            </div>
            {/* Score interpretation badges */}
            <div className="flex justify-center mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                healthScore.healthScore >= 85 ? 'bg-green-500/20 text-green-400' :
                healthScore.healthScore >= 70 ? 'bg-blue-500/20 text-blue-400' :
                healthScore.healthScore >= 55 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {healthScore.healthScore >= 85 ? '🌟 Excellent Health' :
                 healthScore.healthScore >= 70 ? '💪 Good Health' :
                 healthScore.healthScore >= 55 ? '⚠️ Fair Health' :
                 '🔴 Needs Attention'}
              </span>
            </div>
          </div>
          <motion.p 
            className="text-dark-secondary text-sm mt-4 max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {healthScore.summary}
          </motion.p>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-dark-primary mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-dark-accent" />
            Score Breakdown
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(healthScore.scoreBreakdown).map(([category, score], index) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
              const label = categoryLabels[category as keyof typeof categoryLabels];
              const percentage = (score / 25) * 100;
              
              return (
                <motion.div 
                  key={category} 
                  className="bg-dark-background rounded-lg p-3 border border-dark-border hover:border-dark-accent/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-dark-accent/10 rounded-lg">
                        <IconComponent className="h-3 w-3 text-dark-accent" />
                      </div>
                      <span className="text-xs font-medium text-dark-primary">{label}</span>
                    </div>
                    <span className={`text-xs font-bold ${getScoreColor(score * 4)}`}>{score}/25</span>
                  </div>
                  <div className="w-full bg-dark-border rounded-full h-1.5">
                    <motion.div
                      className={`h-1.5 rounded-full ${getScoreColor(score * 4).replace('text-', 'bg-')} shadow-sm`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.2, delay: 0.8 + index * 0.1 }}
                    />
                  </div>
                  <div className="mt-1 text-right">
                    <span className="text-xs text-dark-secondary">{Math.round(percentage)}%</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid md:grid-cols-2 gap-4">
          {healthScore.strengths.length > 0 && (
            <motion.div 
              className="bg-green-500/5 rounded-lg p-4 border border-green-500/20"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-green-500/20 rounded-lg">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                </div>
                <span className="text-sm font-semibold text-green-400">Your Strengths</span>
              </div>
              <div className="space-y-2">
                {healthScore.strengths.slice(0, 3).map((strength, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-green-400 text-xs mt-1">✓</span>
                    <p className="text-xs text-dark-primary font-medium leading-relaxed">
                      {strength}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {healthScore.concerns.length > 0 && (
            <motion.div 
              className="bg-yellow-500/5 rounded-lg p-4 border border-yellow-500/20"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="h-3 w-3 text-yellow-400" />
                </div>
                <span className="text-sm font-semibold text-yellow-400">Focus Areas</span>
              </div>
              <div className="space-y-2">
                {healthScore.concerns.slice(0, 3).map((concern, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-yellow-400 text-xs mt-1">⚠</span>
                    <p className="text-xs text-dark-primary font-medium leading-relaxed">
                      {concern}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className="w-full text-dark-secondary hover:text-dark-primary"
        >
          {expanded ? 'Show Less' : 'View Detailed Analysis'}
          <ChevronRight className={`h-4 w-4 ml-2 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </Button>

        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 border-t border-dark-border pt-4"
            >
              {/* Top Recommendations */}
              {healthScore.topRecommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-dark-primary mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-dark-accent" />
                    Personalized Action Plan
                  </h4>
                  <div className="space-y-3">
                    {healthScore.topRecommendations.map((recommendation, index) => (
                      <motion.div 
                        key={index} 
                        className="bg-gradient-to-r from-dark-accent/5 to-blue-500/5 rounded-lg p-4 border border-dark-accent/20 hover:border-dark-accent/40 transition-all duration-300"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-dark-accent/20 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-xs font-bold text-dark-accent">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-dark-primary leading-relaxed font-medium">
                              {recommendation}
                            </p>
                            {/* Add priority indicator for first few recommendations */}
                            {index < 2 && (
                              <span className="inline-block mt-2 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                                🔥 High Priority
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-dark-accent/10 rounded-lg border border-dark-accent/20">
                    <p className="text-xs text-dark-secondary text-center">
                      💡 <strong>Pro Tip:</strong> Start with the top 2-3 recommendations for maximum impact
                    </p>
                  </div>
                </div>
              )}

              {/* Score Explanation */}
              {healthScore.scoreExplanation && (
                <div>
                  <h4 className="text-sm font-semibold text-dark-primary mb-2">How Your Score Was Calculated</h4>
                  <div className="bg-dark-background rounded-lg p-3 border border-dark-border">
                    <p className="text-xs text-dark-secondary leading-relaxed">
                      {healthScore.scoreExplanation}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {onViewDetails && (
                <Button
                  onClick={onViewDetails}
                  className="w-full bg-dark-accent text-white hover:bg-dark-accent/80"
                >
                  View Full Health Analysis
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
} 