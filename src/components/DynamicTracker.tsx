'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Brain, TrendingUp, Target, Lightbulb, CheckCircle2 } from 'lucide-react';

interface DynamicQuestion {
  id: string;
  question_text: string;
  question_context: string;
  question_category: string;
  scale_description: string;
  generated_date: string;
}

interface TrackingResponse {
  question_id: string;
  response_value: number;
  notes?: string;
}

interface DynamicTrackerProps {
  userId: string;
}

export default function DynamicTracker({ userId }: DynamicTrackerProps) {
  const [questions, setQuestions] = useState<DynamicQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, TrackingResponse>>({});
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasGeneratedToday, setHasGeneratedToday] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isNewDay, setIsNewDay] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    console.log('DynamicTracker mounted with userId:', userId);
    loadTodaysQuestions();
  }, [userId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Number keys 1-9 and 0 for 10
      if (e.key >= '1' && e.key <= '9') {
        const value = parseInt(e.key);
        if (questions[currentQuestionIndex]) {
          submitResponse(questions[currentQuestionIndex].id, value);
        }
      } else if (e.key === '0') {
        if (questions[currentQuestionIndex]) {
          submitResponse(questions[currentQuestionIndex].id, 10);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [questions, currentQuestionIndex]);

  const loadTodaysQuestions = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      console.log('Loading questions for date:', today);
      
      // Query for today's questions specifically
      const { data: todaysQuestions, error: questionsError } = await supabase
        .from('user_dynamic_questions')
        .select('*')
        .eq('user_id', userId)
        .eq('generated_date', today)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (questionsError) {
        console.error('Error loading today\'s questions:', questionsError);
        throw questionsError;
      }

      if (todaysQuestions && todaysQuestions.length > 0) {
        // We have today's questions
        setQuestions(todaysQuestions);
        setHasGeneratedToday(true);
        setIsNewDay(true);
        
        // Load existing responses for today
        const { data: todaysResponses } = await supabase
          .from('user_dynamic_responses')
          .select('*')
          .eq('user_id', userId)
          .eq('response_date', today);

        if (todaysResponses) {
          const responseMap: Record<string, TrackingResponse> = {};
          todaysResponses.forEach(response => {
            responseMap[response.question_id] = {
              question_id: response.question_id,
              response_value: response.response_value,
              notes: response.notes
            };
          });
          setResponses(responseMap);
          
          // If all questions are already answered, show the completed view
          if (todaysQuestions.every((q: DynamicQuestion) => responseMap[q.id])) {
            setCurrentQuestionIndex(todaysQuestions.length - 1);
            
            // Load existing insight if available
            const { data: todaysInsight } = await supabase
              .from('user_tracking_insights')
              .select('insight_text')
              .eq('user_id', userId)
              .eq('data_period_end', today)
              .order('created_at', { ascending: false })
              .limit(1);
              
            if (todaysInsight && todaysInsight.length > 0) {
              setInsight(todaysInsight[0].insight_text);
            }
          }
        }
      } else {
        // No active questions at all, generate new ones
        console.log('No active questions found, generating new ones');
        await generateQuestions();
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No auth session found for dynamic tracking');
        return;
      }

      const response = await fetch('/api/supabase/functions/dynamic-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'generate_questions' }),
      });

      console.log('Dynamic tracking response status:', response.status);
      const result = await response.json();
      console.log('Dynamic tracking result:', result);
      
      if (result.success) {
        setQuestions(result.questions);
        setHasGeneratedToday(true);
      } else {
        console.error('Failed to generate questions:', result.error);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async (questionId: string, value: number, notes?: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/supabase/functions/dynamic-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'submit_response',
          questionId,
          responseValue: value,
          notes,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setResponses(prev => ({
          ...prev,
          [questionId]: { question_id: questionId, response_value: value, notes }
        }));
        
        // Auto-advance to next question
        const questionIndex = questions.findIndex(q => q.id === questionId);
        if (questionIndex < questions.length - 1 && !notes) {
          setTimeout(() => {
            setCurrentQuestionIndex(questionIndex + 1);
          }, 300); // Small delay for visual feedback
        }
        
        // Auto-generate insights when all questions are answered
        const updatedResponses = {
          ...responses,
          [questionId]: { question_id: questionId, response_value: value, notes }
        };
        const allAnswered = questions.every(q => updatedResponses[q.id]);
        if (allAnswered && !insight) {
          setTimeout(() => {
            getInsights();
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const getInsights = async () => {
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/supabase/functions/dynamic-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'get_insights' }),
      });

      const result = await response.json();
      if (result.success) {
        setInsight(result.insight);
      }
    } catch (error) {
      console.error('Error getting insights:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cognitive':
      case 'brain':
        return <Brain className="h-4 w-4" />;
      case 'energy':
      case 'physical':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cognitive':
      case 'brain':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'energy':
      case 'physical':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'mood':
      case 'emotional':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  const ScaleButton = ({ value, questionId, currentValue }: { value: number; questionId: string; currentValue?: number }) => {
    const isSelected = currentValue === value;
    const isLow = value <= 3;
    const isMid = value >= 4 && value <= 7;
    const isHigh = value >= 8;

    // Bloomberg-inspired design with Apple's interaction principles
    let buttonClass = 'relative h-11 w-11 rounded-lg font-mono text-sm transition-all duration-200 transform active:scale-95 ';
    
    if (isSelected) {
      // Selected state maintains Bloomberg dark theme with color accents
      if (isLow) {
        buttonClass += 'bg-red-500/20 text-red-400 border-2 border-red-500 shadow-lg shadow-red-500/20';
      } else if (isMid) {
        buttonClass += 'bg-amber-500/20 text-amber-400 border-2 border-amber-500 shadow-lg shadow-amber-500/20';
      } else {
        buttonClass += 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20';
      }
    } else {
      // Unselected with Bloomberg's signature dark aesthetic
      buttonClass += 'bg-zinc-900 border border-zinc-800 text-zinc-500 ';
      buttonClass += 'hover:bg-zinc-800 hover:border-zinc-700 hover:text-zinc-300';
    }

    return (
      <button
        className={buttonClass}
        onClick={() => submitResponse(questionId, value)}
        onKeyDown={(e) => {
          // Add keyboard support
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            submitResponse(questionId, value);
          }
        }}
      >
        <span className={`font-medium ${isSelected ? 'font-bold' : ''}`}>
          {value}
        </span>
        {isSelected && (
          <div className="absolute inset-0 rounded-lg animate-pulse bg-current opacity-10" />
        )}
      </button>
    );
  };

  if (loading || (!hasGeneratedToday && questions.length === 0)) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl font-semibold text-zinc-100">
            {isNewDay ? '🌅 Good morning! Your daily check-in is ready' : 'Preparing Your Daily Tracker'}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {isNewDay 
              ? 'Fresh questions tailored to your health journey await...' 
              : 'AI is generating personalized questions based on your health profile...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-blue-500" />
            <span className="text-zinc-400">
              {isNewDay ? 'Loading today\'s personalized questions' : 'Analyzing your health data'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allQuestionsAnswered = questions.every(q => responses[q.id]);
  const showInsightView = allQuestionsAnswered || (insight && Object.keys(responses).length === questions.length);

  // Show completed view with all responses
  if (showInsightView) {
    return (
      <div className="space-y-6">
        {/* Insight Card */}
        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-zinc-100">Today's AI Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {insight ? (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-zinc-200 leading-relaxed">{insight}</p>
              </div>
            ) : submitting ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-amber-500" />
                <span className="text-zinc-400">Analyzing your responses...</span>
              </div>
            ) : (
              <Button onClick={getInsights} className="w-full">
                Generate Insights
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Summary of Responses */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-zinc-100">Your Responses Today</CardTitle>
              {questions.length > 0 && questions[0].generated_date !== new Date().toISOString().split('T')[0] && (
                <Button 
                  onClick={() => {
                    setQuestions([]);
                    setResponses({});
                    setInsight('');
                    setCurrentQuestionIndex(0);
                    loadTodaysQuestions();
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Get Today's Questions
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {questions.map((question) => {
              const response = responses[question.id];
              return (
                <div key={question.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-zinc-300">{question.question_text}</p>
                    <p className="text-xs text-zinc-500 mt-1">{question.question_context}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold text-lg ${
                      response?.response_value <= 3 ? 'text-red-400' :
                      response?.response_value <= 7 ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      {response?.response_value}/10
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Single question view
  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = currentQuestion ? responses[currentQuestion.id] : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Daily Health Check</span>
          <span className="text-sm font-mono text-zinc-300">
            {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex + (currentResponse ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Keyboard Hint */}
      <div className="text-xs text-zinc-500 text-center">
        💡 Pro tip: Use number keys 1-9 (0 for 10) for quick responses
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(currentQuestion.question_category)} border`}>
                    {getCategoryIcon(currentQuestion.question_category)}
                    <span className="ml-1 capitalize">{currentQuestion.question_category}</span>
                  </div>
                </div>
                <CardTitle className="text-lg text-zinc-100 leading-relaxed">
                  {currentQuestion.question_text}
                </CardTitle>
                <CardDescription className="text-zinc-400 mt-1">
                  {currentQuestion.question_context}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Scale */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-zinc-400">
                <span>{currentQuestion.scale_description.split(' to ')[0]}</span>
                <span>{currentQuestion.scale_description.split(' to ')[1] || '10 (Excellent)'}</span>
              </div>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                  <ScaleButton
                    key={value}
                    value={value}
                    questionId={currentQuestion.id}
                    currentValue={currentResponse?.response_value}
                  />
                ))}
              </div>
            </div>

            {/* Notes */}
            {currentResponse && (
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">Notes (optional)</label>
                <Textarea
                  placeholder="Any additional context about your response..."
                  value={currentResponse.notes || ''}
                  onChange={(e) => {
                    const newResponse = { ...currentResponse, notes: e.target.value };
                    setResponses(prev => ({ ...prev, [currentQuestion.id]: newResponse }));
                    // Auto-save notes after user stops typing
                    setTimeout(() => {
                      submitResponse(currentQuestion.id, currentResponse.response_value, e.target.value);
                    }, 1000);
                  }}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 resize-none"
                  rows={2}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 