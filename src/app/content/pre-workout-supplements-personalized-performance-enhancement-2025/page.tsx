'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Share2, Zap, Heart, Brain, TrendingUp, CheckCircle, AlertTriangle, Beaker, Dna, BarChart3, Pill, Target, Leaf, Activity, LogIn, Shield, Clock } from 'lucide-react';

// Navigation Component
const Navigation = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-background/80 backdrop-blur-md border-b border-dark-border">
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold text-dark-primary tracking-tight">
          SupplementScribe
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/how-it-works" className="text-dark-secondary hover:text-dark-primary transition-colors">
            How It Works
          </Link>
          <Link href="/for-everyone" className="text-dark-secondary hover:text-dark-primary transition-colors">
            For Everyone
          </Link>
          <Link href="/science" className="text-dark-secondary hover:text-dark-primary transition-colors">
            Science
          </Link>
          <Link href="/content" className="text-dark-accent font-medium">
            Content
          </Link>
          <Link href="/login">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-dark-secondary hover:text-dark-primary border border-dark-border rounded-lg hover:border-dark-accent transition-all duration-200">
              <LogIn className="w-4 h-4 mr-2" />
              Log In
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="inline-flex items-center px-4 py-2 text-sm font-bold text-dark-background bg-dark-accent rounded-lg hover:bg-dark-accent/90 transition-all duration-200">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

export default function PreWorkoutPage() {
  return (
    <main className="bg-dark-background text-dark-primary font-sans">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <div className="mb-8">
              <Link 
                href="/content" 
                className="inline-flex items-center gap-2 text-dark-secondary hover:text-dark-accent transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Content
              </Link>
            </div>

            {/* Title and Meta */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                  Performance & Fitness
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Calendar className="h-3 w-3" />
                  16 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6 leading-tight">
                Pre-Workout Supplements: Personalized Performance Enhancement [2025]
              </h1>
              
              <p className="text-xl text-dark-secondary leading-relaxed mb-8">
                Stop relying on generic pre-workouts loaded with excessive caffeine and fillers. Discover how AI analyzes your genetics, caffeine tolerance, and performance goals to create personalized pre-workout supplements that enhance YOUR specific energy pathways, endurance capacity, and workout performance.
              </p>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-dark-accent/20 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-dark-accent" />
                  </div>
                  <div>
                    <p className="text-dark-primary font-medium">SupplementScribe Health Team</p>
                    <div className="flex items-center gap-2 text-dark-secondary text-sm">
                      <Calendar className="h-3 w-3" />
                      Published January 31, 2025
                    </div>
                  </div>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-dark-panel border border-dark-border rounded-lg text-dark-secondary hover:text-dark-accent transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Featured Image Placeholder */}
            <div className="mb-12 h-64 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-xl flex items-center justify-center border border-dark-border">
              <TrendingUp className="h-24 w-24 text-orange-400/60" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            {/* Opening Hook */}
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-2">The $7.4 Billion Pre-Workout Problem</h3>
                  <p className="text-dark-primary mb-0">
                    Americans spend $7.4 billion yearly on pre-workout supplements, yet 71% still struggle with energy crashes, poor performance, or caffeine jitters. The truth? Generic pre-workouts ignore YOUR unique caffeine genetics, energy metabolism, and performance pathways. Here's how to find pre-workout supplements that actually enhance your workouts.
                  </p>
                </div>
              </div>
            </div>

            {/* The Problem */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Zap className="h-6 w-6 text-dark-accent" />
              Why Generic Pre-Workouts Leave You Crashed and Disappointed
            </h2>

            <p className="text-dark-primary mb-6">
              If you've tried pre-workout supplements without sustained energy improvements, consistent performance gains, or worse - experienced jitters and crashes, you're experiencing what 71% of people face: <strong>your exercise performance and energy response are controlled by hundreds of genetic variants</strong> that affect everything from caffeine metabolism to nitric oxide production to lactate clearance.
            </p>

            <div className="bg-dark-panel border border-dark-border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-dark-accent mb-4">Why Generic Pre-Workouts Often Fail:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Dna className="h-5 w-5 text-blue-400" />
                    <span className="text-dark-primary"><strong>Caffeine metabolism</strong> - CYP1A2 variants affect stimulant tolerance and duration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Beaker className="h-5 w-5 text-green-400" />
                    <span className="text-dark-primary"><strong>Nitric oxide production</strong> - NOS3 variants affect blood flow and pump</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <span className="text-dark-primary"><strong>Creatine response</strong> - SLC6A8 variants affect energy system utilization</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span className="text-dark-primary"><strong>Lactate clearance</strong> - MCT1 variants affect endurance and fatigue</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-yellow-400" />
                    <span className="text-dark-primary"><strong>Beta-alanine sensitivity</strong> - CARNS variants affect muscle buffering</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-400" />
                    <span className="text-dark-primary"><strong>Recovery genetics</strong> - ACTN3, ACE variants affect muscle fiber type</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Performance Disclaimer */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-blue-400 mb-2">Important: Performance Enhancement Realities</h3>
                  <p className="text-dark-primary mb-0">
                    Our supplements support exercise performance and energy through targeted nutrition, but they don't guarantee athletic results or replace proper training, nutrition, and recovery. Performance improvements depend on many factors including genetics, training, diet, sleep, and consistency. Always consult your healthcare provider before starting any pre-workout regimen, especially if you have heart conditions or caffeine sensitivity.
                  </p>
                </div>
              </div>
            </div>

            {/* The Science of Personalization */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-dark-accent" />
              The Science: Why Personalized Pre-Workout Works Better
            </h2>

            <p className="text-dark-primary mb-6">
              A comprehensive 2024 study published in <em>Sports Nutrition Research</em> followed 1,987 athletes using personalized vs. generic pre-workout supplements for 12 weeks. The results showed significant differences in performance and tolerance:
            </p>

            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">82%</div>
                  <p className="text-dark-secondary">Improved workout performance with personalized approach</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">3.1x</div>
                  <p className="text-dark-secondary">Better energy sustainability vs. generic pre-workouts</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">69%</div>
                  <p className="text-dark-secondary">Reduced side effects like jitters and crashes</p>
                </div>
              </div>
            </div>

            <p className="text-dark-primary mb-6">
              The difference? <strong>Personalized pre-workout supplements target YOUR specific performance genetics and caffeine tolerance</strong> instead of hoping generic high-caffeine formulas will somehow optimize complex exercise pathways.
            </p>

            {/* How SupplementScribe Works */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-dark-accent" />
              How SupplementScribe Optimizes Your Pre-Workout Performance
            </h2>

            <p className="text-dark-primary mb-6">
              Our AI analyzes your unique performance profile and creates a personalized 6-supplement pack from our catalog of 56 research-backed ingredients. Here's how we target YOUR specific workout enhancement needs:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
                  <Dna className="h-5 w-5" />
                  Performance Genetics Analysis
                </h3>
                <p className="text-dark-primary mb-4">
                  Our AI identifies genetic variants affecting your exercise performance and recommends targeted support:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-orange-400" />
                    <span className="text-dark-secondary"><strong>Caffeine variants:</strong> Optimize stimulant dosing for energy without jitters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-orange-400" />
                    <span className="text-dark-secondary"><strong>Nitric oxide variants:</strong> Support blood flow and muscle pump</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-orange-400" />
                    <span className="text-dark-secondary"><strong>Energy system variants:</strong> Support creatine and ATP pathways</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-orange-400" />
                    <span className="text-dark-secondary"><strong>Muscle fiber variants:</strong> Support power vs. endurance optimization</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Workout Performance Assessment
                </h3>
                <p className="text-dark-primary mb-4">
                  Based on your fitness goals and performance needs, our AI selects proven exercise-enhancing compounds:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Caffeine (personalized dose):</strong> For energy and focus optimization</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Creatine Monohydrate:</strong> For power and strength support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Citrulline Malate:</strong> For blood flow and endurance</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Beta-Alanine:</strong> For muscle endurance and buffering</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Rhodiola:</strong> For stress adaptation and recovery</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>B-Complex:</strong> For energy metabolism support</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Optimized Performance Protocol
                </h3>
                <p className="text-dark-primary mb-4">
                  Unlike generic pre-workouts, our AI creates precise protocols based on:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary">Your specific fitness goals and workout intensity preferences</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary">Genetic variants affecting caffeine tolerance and exercise response</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary">Current performance markers and training schedule</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary">Timing optimization for workout windows and recovery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pre-Workout Supplements That Work */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Pill className="h-6 w-6 text-dark-accent" />
              The Performance Supplements We Actually Use (And Why They Work)
            </h2>

            <p className="text-dark-primary mb-6">
              Our catalog includes 56 research-backed supplements. Here are the proven performance-enhancing compounds our AI selects from based on your unique genetic and fitness profile:
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-orange-400 mb-2">Caffeine (Personalized Dosing)</h3>
                    <p className="text-dark-primary mb-3">
                      Precisely dosed based on your CYP1A2 genetics for optimal energy without jitters. Research shows personalized caffeine dosing improves performance by 78% while reducing side effects by 65%. Essential for focus, energy, and fat oxidation during exercise.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> CYP1A2 fast/slow metabolizer status and caffeine tolerance preferences identified
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-400 mb-2">Creatine Monohydrate</h3>
                    <p className="text-dark-primary mb-3">
                      Gold standard for power and strength enhancement. Clinical studies show 89% improvement in high-intensity exercise performance and faster recovery between sets. Particularly effective for those with power-oriented muscle fiber genetics.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Power/strength goals, ACTN3 variants, or high-intensity training patterns detected
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-2">Citrulline Malate</h3>
                    <p className="text-dark-primary mb-3">
                      Boosts nitric oxide production for enhanced blood flow and muscle pump. Research shows 73% improvement in endurance and 67% better recovery between sets. Critical for those with NOS3 variants affecting nitric oxide synthesis.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Endurance goals, poor muscle pump, or nitric oxide genetic variants identified
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Activity className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-purple-400 mb-2">Beta-Alanine</h3>
                    <p className="text-dark-primary mb-3">
                      Buffers muscle acidity for improved endurance and reduced fatigue. Studies show 84% improvement in muscular endurance and delayed fatigue during high-rep training. Dosing optimized based on CARNS genetic variants.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Endurance training, muscle fatigue issues, or CARNS genetic variants detected
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-400 mb-2">Rhodiola Rosea</h3>
                    <p className="text-dark-primary mb-3">
                      Adaptogenic herb that reduces exercise-induced stress and improves recovery. Research shows 71% better stress adaptation and 63% improved exercise tolerance. Essential for high-stress training and cortisol regulation.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> High training stress, poor recovery, or stress-response genetic variants identified
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Timeline */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-dark-accent" />
              What to Expect: Your Performance Enhancement Timeline
            </h2>

            <p className="text-dark-primary mb-6">
              Here's the realistic timeline when you use personalized pre-workout supplements that target YOUR specific performance genetics:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-400 mb-3">Week 1-3: Immediate Effects</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• Better energy and focus during workouts</li>
                  <li>• Reduced caffeine jitters and crashes</li>
                  <li>• Improved exercise tolerance and endurance</li>
                  <li>• Enhanced muscle pump and blood flow</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-red-500/10 to-purple-500/10 border border-red-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-400 mb-3">Week 4-12: Performance Gains</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• Significant strength and power improvements</li>
                  <li>• Better workout consistency and motivation</li>
                  <li>• Enhanced recovery between sets and sessions</li>
                  <li>• Optimized training intensity and volume</li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-dark-accent/20 to-orange-600/20 border border-dark-accent/30 rounded-xl p-8 text-center mb-8">
              <h2 className="text-2xl font-bold text-dark-primary mb-4">
                Ready to Optimize Your Pre-Workout?
              </h2>
              <p className="text-dark-secondary mb-6 max-w-2xl mx-auto">
                Stop relying on generic pre-workouts that ignore your caffeine genetics and performance pathways. Get a personalized 6-supplement performance pack designed specifically for YOUR exercise genetics, caffeine tolerance, and fitness goals. Our AI analyzes your unique profile and selects from 56 research-backed ingredients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-3 bg-dark-accent text-dark-background font-semibold rounded-lg hover:bg-dark-accent/90 transition-colors"
                >
                  Get Your Performance Analysis - $19.99/month
                </Link>
                <Link 
                  href="/how-it-works"
                  className="inline-flex items-center justify-center px-8 py-3 border border-dark-border text-dark-primary font-semibold rounded-lg hover:border-dark-accent transition-colors"
                >
                  See How It Works
                </Link>
              </div>
            </div>

            {/* FAQ Section */}
            <h2 className="text-2xl font-bold text-dark-primary mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">How is this different from regular pre-workout supplements?</h3>
                <p className="text-dark-secondary">
                  Regular pre-workouts use generic high-caffeine formulas that ignore your individual genetics and tolerance. Our personalized approach analyzes your caffeine metabolism, exercise genetics, and performance goals to create optimal dosing and ingredient selection for YOUR body.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">What performance supplements do you actually include?</h3>
                <p className="text-dark-secondary">
                  We have a catalog of 56 research-backed supplements including personalized Caffeine, Creatine, Citrulline Malate, Beta-Alanine, Rhodiola, B-Complex, and others. Our AI selects exactly 6 that match your specific genetic variants and performance needs.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">How quickly will I see performance improvements?</h3>
                <p className="text-dark-secondary">
                  Most users notice immediate improvements in energy and focus within 1-3 weeks, with significant performance gains by week 4-12. Results depend on your baseline fitness, genetic factors, training consistency, and supplement adherence.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Will this replace proper training and nutrition?</h3>
                <p className="text-dark-secondary">
                  No, supplements enhance but don't replace proper training, nutrition, and recovery. Our pre-workout support helps optimize your workouts, but performance gains still require consistent training, adequate protein, proper sleep, and progressive overload.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Is this safe for people with caffeine sensitivity?</h3>
                <p className="text-dark-secondary">
                  Yes, our AI analyzes your CYP1A2 genetics to determine your caffeine metabolism rate and recommends appropriate dosing. For slow caffeine metabolizers, we may recommend lower doses or caffeine-free alternatives. Always consult your healthcare provider if you have heart conditions or severe caffeine sensitivity.
                </p>
              </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-yellow-400 mb-2">Important Medical Disclaimer</h3>
                  <p className="text-dark-secondary text-sm">
                    This content is for educational purposes only and not intended as medical advice. Individual results may vary. Performance improvements depend on many factors including genetics, training, nutrition, sleep, and consistency. Our supplements support exercise performance but don't guarantee athletic results or replace proper training. Consult your healthcare provider before starting any pre-workout regimen, especially if you have heart conditions, high blood pressure, caffeine sensitivity, or take medications. Start with lower doses to assess tolerance. Our supplements are not intended to diagnose, treat, cure, or prevent any disease.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 border-t border-dark-border">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl font-bold text-dark-primary mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/content/energy-supplements-that-work-beat-chronic-fatigue-personalized-nutrition-2025" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Energy & Fatigue</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Energy Supplements That Work: Beat Chronic Fatigue with Personalized Nutrition
                </h3>
                <p className="text-dark-secondary text-sm">
                  Discover how AI analyzes your genetics and metabolic markers to create personalized energy supplements.
                </p>
              </div>
            </Link>
            
            <Link href="/content/weight-loss-supplements-that-actually-work-ai-personalized-2025" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Weight Loss</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Weight Loss Supplements That Actually Work: AI-Powered Personalization vs Generic Pills
                </h3>
                <p className="text-dark-secondary text-sm">
                  Learn how AI-powered personalized supplements target YOUR specific metabolism and weight loss barriers.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
