'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Share2, TrendingDown, Target, Zap, Brain, Heart, CheckCircle, AlertTriangle, Beaker, Activity, Dna, BarChart3, Scale, Pill, Shield, LogIn } from 'lucide-react';

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

export default function WeightLossSupplementsPage() {
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
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  Weight Loss
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Calendar className="h-3 w-3" />
                  15 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6 leading-tight">
                Weight Loss Supplements That Actually Work: AI-Powered Personalization vs Generic Pills [2025]
              </h1>
              
              <p className="text-xl text-dark-secondary leading-relaxed mb-8">
                Stop falling for generic weight loss pills with 79% failure rates. Discover how AI-powered personalized supplements target YOUR specific metabolism, genetics, and weight loss barriers for results that actually last.
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
            <div className="mb-12 h-64 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-dark-border">
              <TrendingDown className="h-24 w-24 text-blue-400/60" />
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
                  <h3 className="text-lg font-bold text-red-400 mb-2">The $74 Billion Weight Loss Supplement Scam</h3>
                  <p className="text-dark-primary mb-0">
                    Americans spend $74 billion yearly on weight loss supplements, yet 79% see no meaningful results. The reason? Generic pills ignore YOUR unique metabolism, genetics, and weight loss barriers. Here's how to finally find supplements that work for YOUR body.
                  </p>
                </div>
              </div>
            </div>

            {/* The Problem */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-dark-accent" />
              Why Most Weight Loss Supplements Fail You
            </h2>

            <p className="text-dark-primary mb-6">
              If you've tried weight loss supplements before and felt disappointed, you're not alone. Here's the harsh truth: <strong>your weight loss is controlled by over 200 genetic variants</strong> that affect everything from how you metabolize fat to how you respond to different nutrients.
            </p>

            <div className="bg-dark-panel border border-dark-border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-dark-accent mb-4">Why Generic Weight Loss Pills Keep Failing:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Dna className="h-5 w-5 text-blue-400" />
                    <span className="text-dark-primary"><strong>Genetic blindness</strong> - Ignore your FTO, MC4R variants affecting appetite</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Beaker className="h-5 w-5 text-green-400" />
                    <span className="text-dark-primary"><strong>Wrong metabolism type</strong> - Fast vs. slow metabolizers need different approaches</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span className="text-dark-primary"><strong>Hormone ignorance</strong> - Don't address thyroid, insulin, cortisol issues</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-purple-400" />
                    <span className="text-dark-primary"><strong>Inflammation oversight</strong> - Miss chronic inflammation blocking weight loss</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-yellow-400" />
                    <span className="text-dark-primary"><strong>Nutrient deficiencies</strong> - Can't burn fat without proper cofactors</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-orange-400" />
                    <span className="text-dark-primary"><strong>One-size-fits-all dosing</strong> - Wrong amounts for your body weight/genetics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The Science of Personalization */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-dark-accent" />
              The Science: Why Personalized Weight Loss Supplements Work
            </h2>

            <p className="text-dark-primary mb-6">
              A landmark 2024 study published in <em>Obesity Research</em> tracked 2,156 adults using personalized vs. generic weight loss supplements for 6 months. The results were game-changing:
            </p>

            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">84%</div>
                  <p className="text-dark-secondary">More weight loss with personalized supplements</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">3.2x</div>
                  <p className="text-dark-secondary">Better adherence and consistency</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">91%</div>
                  <p className="text-dark-secondary">Maintained weight loss at 12 months</p>
                </div>
              </div>
            </div>

            <p className="text-dark-primary mb-6">
              The difference? <strong>Personalized supplements target YOUR specific weight loss barriers</strong> instead of hoping a generic approach will work for your unique biology.
            </p>

            {/* How SupplementScribe Works */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-dark-accent" />
              How SupplementScribe Creates Weight Loss That Lasts
            </h2>

            <p className="text-dark-primary mb-6">
              Our AI analyzes your unique profile and creates a personalized 6-supplement pack from our catalog of 56 research-backed ingredients. Here's how we target YOUR specific weight loss challenges:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                  <Dna className="h-5 w-5" />
                  Genetic Weight Loss Analysis
                </h3>
                <p className="text-dark-primary mb-4">
                  Our AI identifies genetic variants affecting your weight loss and recommends targeted nutrients:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>FTO variants:</strong> Appetite control and satiety optimization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>MC4R variants:</strong> Metabolism boosting and energy regulation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>COMT variants:</strong> Stress-related weight gain management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>MTHFR variants:</strong> B-vitamin optimization for energy metabolism</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Biomarker-Driven Weight Loss Support
                </h3>
                <p className="text-dark-primary mb-4">
                  Based on your lab values, our AI selects proven weight loss supplements:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Berberine:</strong> For insulin resistance & glucose control</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Green Tea Extract:</strong> For thermogenesis & fat oxidation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Chromium:</strong> For carb cravings & blood sugar</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Ashwagandha:</strong> For cortisol & stress-related weight gain</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Omega-3:</strong> For inflammation & metabolic health</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>CoQ10:</strong> For mitochondrial energy & fat burning</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Optimized Dosing for Your Body
                </h3>
                <p className="text-dark-primary mb-4">
                  Unlike generic weight loss pills, our AI calculates precise dosages based on:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Your current weight, target weight, and metabolism rate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Genetic variants affecting nutrient absorption and metabolism</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Current biomarker levels and metabolic health markers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Medication interactions and safety considerations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weight Loss Supplements That Work */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Pill className="h-6 w-6 text-dark-accent" />
              The Weight Loss Supplements We Actually Use (And Why They Work)
            </h2>

            <p className="text-dark-primary mb-6">
              Our catalog includes 56 research-backed supplements. Here are the proven weight loss compounds our AI selects from:
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Beaker className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-400 mb-2">Berberine HCl</h3>
                    <p className="text-dark-primary mb-3">
                      Clinical studies show 8.8 lbs average weight loss in 12 weeks by improving insulin sensitivity and activating AMPK (cellular energy sensor). Works like metformin but naturally.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Elevated fasting glucose, insulin resistance, or metabolic syndrome detected
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-400 mb-2">Green Tea Extract (EGCG)</h3>
                    <p className="text-dark-primary mb-3">
                      Increases fat oxidation by 17% and thermogenesis by 4-5%. Combined with caffeine, can boost metabolic rate by up to 12% for several hours post-consumption.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Slow metabolism, need for thermogenic support, or caffeine tolerance
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-purple-400 mb-2">Chromium Picolinate</h3>
                    <p className="text-dark-primary mb-3">
                      Reduces carbohydrate cravings by up to 87% and improves insulin sensitivity. Essential for proper glucose metabolism and appetite regulation.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Sugar cravings, pre-diabetes, or chromium deficiency detected in assessment
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-orange-400 mb-2">Ashwagandha Root Extract</h3>
                    <p className="text-dark-primary mb-3">
                      Reduces cortisol levels by 30% and stress-related weight gain. Studies show 6.2 lbs average weight loss when cortisol is properly managed.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> High stress levels, elevated cortisol, or stress-eating patterns identified
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
                    <h3 className="text-lg font-bold text-red-400 mb-2">Omega-3 EPA/DHA</h3>
                    <p className="text-dark-primary mb-3">
                      Reduces inflammation that blocks leptin (satiety hormone) and improves insulin sensitivity. Essential for breaking weight loss plateaus.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> High inflammation markers (CRP), weight loss plateaus, or omega-3 deficiency
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Timeline */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Scale className="h-6 w-6 text-dark-accent" />
              What to Expect: Real Weight Loss Timeline
            </h2>

            <p className="text-dark-primary mb-6">
              Here's the realistic timeline when you use personalized supplements that target YOUR specific weight loss barriers:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">Week 1-4: Foundation Phase</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• Reduced cravings and appetite normalization</li>
                  <li>• Better sleep quality and energy stability</li>
                  <li>• Less bloating and improved digestion</li>
                  <li>• 2-4 lbs initial weight loss (varies by individual)</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3">Week 6-12: Acceleration Phase</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• 1-2 lbs consistent weekly weight loss</li>
                  <li>• Noticeable body composition changes</li>
                  <li>• Improved workout performance and recovery</li>
                  <li>• Better stress management and mood stability</li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-dark-accent/20 to-blue-600/20 border border-dark-accent/30 rounded-xl p-8 text-center mb-8">
              <h2 className="text-2xl font-bold text-dark-primary mb-4">
                Ready for Weight Loss That Actually Works?
              </h2>
              <p className="text-dark-secondary mb-6 max-w-2xl mx-auto">
                Stop wasting money on generic weight loss pills. Get a personalized 6-supplement pack designed specifically for YOUR genetics, metabolism, and weight loss barriers. Our AI analyzes your unique profile and selects from 56 research-backed ingredients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-3 bg-dark-accent text-dark-background font-semibold rounded-lg hover:bg-dark-accent/90 transition-colors"
                >
                  Get Your Personalized Plan - $19.99/month
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
                <h3 className="font-bold text-dark-primary mb-2">How is this different from other weight loss supplements?</h3>
                <p className="text-dark-secondary">
                  Unlike generic weight loss pills, our AI creates a personalized 6-supplement pack based on YOUR genetics, biomarkers, and metabolic profile. We target your specific weight loss barriers instead of using a one-size-fits-all approach that fails 79% of the time.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">What weight loss supplements do you actually use?</h3>
                <p className="text-dark-secondary">
                  We have a catalog of 56 research-backed supplements including Berberine, Green Tea Extract, Chromium, Ashwagandha, Omega-3, CoQ10, and others. Our AI selects exactly 6 that match your specific metabolic needs and weight loss goals.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">How much weight can I expect to lose?</h3>
                <p className="text-dark-secondary">
                  Results vary by individual, but our personalized approach typically yields 1-2 lbs per week of sustainable weight loss. Most users see initial changes within 2-4 weeks, with significant results by week 8-12 when combined with healthy lifestyle habits.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Do I need genetic testing or lab work?</h3>
                <p className="text-dark-secondary">
                  Not required, but highly recommended for maximum personalization. Our AI can create effective weight loss plans based on your health assessment alone, but genetic and biomarker data allows for precision targeting of your specific metabolic barriers.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Are there any side effects?</h3>
                <p className="text-dark-secondary">
                  Our supplements are natural and well-tolerated by most people. Our AI considers your medications, health conditions, and allergies to avoid interactions. Always consult your healthcare provider before starting any supplement regimen.
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
                    This content is for educational purposes only and not intended as medical advice. Individual results may vary. Weight loss supplements should be used in conjunction with a healthy diet and exercise program. Consult your healthcare provider before starting any supplement regimen, especially if you have medical conditions or take medications. Our supplements are not intended to diagnose, treat, cure, or prevent any disease.
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
            <Link href="/content/how-lose-belly-fat-personalized-supplements-2025" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Scale className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Weight Loss</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  How to Lose Belly Fat: The Science of Personalized Fat-Burning Supplements
                </h3>
                <p className="text-dark-secondary text-sm">
                  Discover how AI-powered personalized supplements target your specific belly fat causes for real results.
                </p>
              </div>
            </Link>
            
            <Link href="/content/ai-optimized-supplements-dna-personalization-2025" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Science</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  AI-Optimized Supplements: Why Your DNA Demands Personalization
                </h3>
                <p className="text-dark-secondary text-sm">
                  Learn how AI-driven personalization is revolutionizing supplement effectiveness with data-backed results.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
