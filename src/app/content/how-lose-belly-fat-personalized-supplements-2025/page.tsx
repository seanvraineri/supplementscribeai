'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Share2, Scale, Target, Zap, Brain, Heart, TrendingUp, CheckCircle, AlertTriangle, Beaker, Activity, Dna, BarChart3, LogIn } from 'lucide-react';

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

export default function BellyFatPersonalizedSupplementsPage() {
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
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  Weight Loss
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Calendar className="h-3 w-3" />
                  12 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6 leading-tight">
                How to Lose Belly Fat: The Science of Personalized Fat-Burning Supplements [2025 Guide]
              </h1>
              
              <p className="text-xl text-dark-secondary leading-relaxed mb-8">
                Stop wasting money on generic fat burners. Discover how AI-powered personalized supplements target YOUR specific metabolism, genetics, and biomarkers for real belly fat loss that actually works.
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
            <div className="mb-12 h-64 bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-dark-border">
              <Scale className="h-24 w-24 text-green-400/60" />
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
                  <h3 className="text-lg font-bold text-red-400 mb-2">The $30 Billion Belly Fat Scam</h3>
                  <p className="text-dark-primary mb-0">
                    Americans spend over $30 billion yearly on generic fat burners that fail 87% of the time. Why? Because your belly fat isn't generic—it's driven by YOUR unique genetics, metabolism, and hormone profile. Here's how to finally target what's actually causing YOUR stubborn belly fat.
                  </p>
                </div>
              </div>
            </div>

            {/* The Problem */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-dark-accent" />
              Why Generic Fat Burners Fail (And Why Yours Might Too)
            </h2>

            <p className="text-dark-primary mb-6">
              If you've tried fat burners before and felt frustrated by the lack of results, you're not alone. Here's the truth: <strong>your belly fat accumulation is controlled by at least 47 different genetic variants</strong> that affect everything from how you process carbohydrates to how you store and burn fat.
            </p>

            <div className="bg-dark-panel border border-dark-border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-dark-accent mb-4">The Real Reasons You Can't Lose Belly Fat:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Dna className="h-5 w-5 text-blue-400" />
                    <span className="text-dark-primary"><strong>MTHFR variants</strong> - Poor B-vitamin processing slows metabolism</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Beaker className="h-5 w-5 text-green-400" />
                    <span className="text-dark-primary"><strong>Insulin resistance</strong> - Blood sugar imbalances drive fat storage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span className="text-dark-primary"><strong>Thyroid dysfunction</strong> - Low TSH/T3 kills fat burning</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-purple-400" />
                    <span className="text-dark-primary"><strong>Chronic inflammation</strong> - High CRP blocks leptin signals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-yellow-400" />
                    <span className="text-dark-primary"><strong>Cortisol dysregulation</strong> - Stress hormones promote belly fat</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-orange-400" />
                    <span className="text-dark-primary"><strong>Nutrient deficiencies</strong> - Missing cofactors for fat oxidation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What We Actually Offer */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-dark-accent" />
              How SupplementScribe Targets YOUR Belly Fat
            </h2>

            <p className="text-dark-primary mb-6">
              Our AI analyzes your unique health profile and creates a personalized 6-supplement pack from our catalog of 56 research-backed ingredients. Here's how we target belly fat specifically:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                  <Dna className="h-5 w-5" />
                  Genetic Analysis for Fat Metabolism
                </h3>
                <p className="text-dark-primary mb-4">
                  Our AI identifies genetic variants affecting your fat-burning ability and recommends targeted nutrients:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>MTHFR variants:</strong> Methyl B-Complex for proper metabolism</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>COMT variants:</strong> Magnesium for stress hormone regulation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>VDR variants:</strong> Optimized Vitamin D dosing for hormone balance</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Biomarker-Driven Supplement Selection
                </h3>
                <p className="text-dark-primary mb-4">
                  Based on your lab values, our AI selects from proven fat-burning supplements:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Berberine:</strong> For insulin resistance & glucose control</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Chromium:</strong> For carb cravings & blood sugar</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Alpha Lipoic Acid:</strong> For metabolic flexibility</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Green Tea Extract:</strong> For thermogenesis & fat oxidation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Omega-3:</strong> For inflammation & leptin sensitivity</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Magnesium:</strong> For stress & sleep optimization</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-dark-accent/20 to-blue-600/20 border border-dark-accent/30 rounded-xl p-8 text-center mb-8">
              <h2 className="text-2xl font-bold text-dark-primary mb-4">
                Ready to Target YOUR Belly Fat Causes?
              </h2>
              <p className="text-dark-secondary mb-6 max-w-2xl mx-auto">
                Stop guessing with generic fat burners. Get a personalized 6-supplement pack designed specifically for your genetics, biomarkers, and metabolism. Our AI analyzes your unique profile and selects from 56 research-backed ingredients.
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

            {/* Medical Disclaimer */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-yellow-400 mb-2">Important Medical Disclaimer</h3>
                  <p className="text-dark-secondary text-sm">
                    This content is for educational purposes only and not intended as medical advice. Individual results may vary. Consult your healthcare provider before starting any supplement regimen, especially if you have medical conditions or take medications. Our supplements are not intended to diagnose, treat, cure, or prevent any disease.
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
                  Discover how AI-driven personalization is revolutionizing supplement effectiveness with data-backed results.
                </p>
              </div>
            </Link>
            
            <Link href="/content/mthfr-gene-anxiety-founder-journey" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Personal Story</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  MTHFR Gene & Anxiety: A Founder's Journey
                </h3>
                <p className="text-dark-secondary text-sm">
                  A personal story about discovering genetic factors affecting metabolism and finding personalized solutions.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
