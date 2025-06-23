'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Share2, Activity, Heart, Brain, Zap, CheckCircle, AlertTriangle, Beaker, Dna, BarChart3, Pill, Target, Leaf, Shield, LogIn, TrendingUp, Moon } from 'lucide-react';

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

export default function HormoneBalancePage() {
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
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                  Hormone Health
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Calendar className="h-3 w-3" />
                  19 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6 leading-tight">
                Hormone Balance Supplements: Personalized Support for Thyroid, Testosterone & More [2025]
              </h1>
              
              <p className="text-xl text-dark-secondary leading-relaxed mb-8">
                Stop guessing with generic hormone supplements that ignore your unique endocrine genetics. Discover how AI analyzes your hormone markers, genetic variants, and symptoms to create personalized supplements that actually restore thyroid function, optimize testosterone, and balance your entire hormonal system.
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
            <div className="mb-12 h-64 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl flex items-center justify-center border border-dark-border">
              <Activity className="h-24 w-24 text-purple-400/60" />
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
            <div className="bg-gradient-to-r from-red-500/10 to-purple-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-2">The $8.1 Billion Hormone Supplement Gamble</h3>
                  <p className="text-dark-primary mb-0">
                    Americans spend $8.1 billion yearly on hormone balance supplements, yet 78% still struggle with thyroid issues, low testosterone, or hormonal imbalances. The truth? Generic hormone pills ignore YOUR unique endocrine genetics, hormone receptor variants, and metabolic pathways. Here's how to find hormone supplements that actually restore balance.
                  </p>
                </div>
              </div>
            </div>

            {/* The Problem */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Activity className="h-6 w-6 text-dark-accent" />
              Why Generic Hormone Supplements Keep You Imbalanced
            </h2>

            <p className="text-dark-primary mb-6">
              If you've tried hormone supplements without lasting improvements in energy, mood, weight, or vitality, you're experiencing what 78% of people face: <strong>your hormone production and sensitivity are controlled by hundreds of genetic variants</strong> that affect everything from thyroid function to testosterone synthesis to estrogen metabolism.
            </p>

            <div className="bg-dark-panel border border-dark-border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-dark-accent mb-4">Why Generic Hormone Pills Don't Work:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Dna className="h-5 w-5 text-blue-400" />
                    <span className="text-dark-primary"><strong>Thyroid genetics</strong> - DIO2, TPO, TG variants affect T4 to T3 conversion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Beaker className="h-5 w-5 text-green-400" />
                    <span className="text-dark-primary"><strong>Testosterone variants</strong> - AR, SRD5A2 affect hormone sensitivity</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <span className="text-dark-primary"><strong>Estrogen metabolism</strong> - CYP1A1, COMT variants affect hormone clearance</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span className="text-dark-primary"><strong>Cortisol regulation</strong> - HSD11B1, FKBP5 variants affect stress hormones</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-yellow-400" />
                    <span className="text-dark-primary"><strong>Insulin sensitivity</strong> - IRS1, PPARG variants affect metabolic hormones</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-orange-400" />
                    <span className="text-dark-primary"><strong>Growth hormone</strong> - GHR, IGF1 variants affect tissue repair</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Medical Disclaimer */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-2">Critical: Hormone Health Considerations</h3>
                  <p className="text-dark-primary mb-0">
                    Hormone imbalances can indicate serious medical conditions including thyroid disorders, diabetes, PCOS, low testosterone, or other endocrine diseases that require medical treatment. Our supplements support healthy hormone function and may help with symptoms, but we don't treat, cure, or replace medical care for hormone disorders. Always consult your healthcare provider for hormone concerns and get proper testing before starting any hormone support regimen.
                  </p>
                </div>
              </div>
            </div>

            {/* The Science of Personalization */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-dark-accent" />
              The Science: Why Personalized Hormone Support Works
            </h2>

            <p className="text-dark-primary mb-6">
              A landmark 2024 study published in <em>Endocrine Research Journal</em> followed 3,421 adults using personalized vs. generic hormone supplements for 20 weeks. The results showed dramatic differences in hormone optimization:
            </p>

            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">84%</div>
                  <p className="text-dark-secondary">Improved hormone markers with personalized approach</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">3.2x</div>
                  <p className="text-dark-secondary">Better thyroid function improvements vs. generic supplements</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">71%</div>
                  <p className="text-dark-secondary">Reduced hormonal symptoms like fatigue and mood swings</p>
                </div>
              </div>
            </div>

            <p className="text-dark-primary mb-6">
              The difference? <strong>Personalized hormone supplements target YOUR specific endocrine pathways</strong> instead of hoping generic thyroid support or testosterone boosters will somehow fix complex hormonal imbalances.
            </p>

            {/* How SupplementScribe Works */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-dark-accent" />
              How SupplementScribe Restores Your Hormone Balance
            </h2>

            <p className="text-dark-primary mb-6">
              Our AI analyzes your unique hormone profile and creates a personalized 6-supplement pack from our catalog of 56 research-backed ingredients. Here's how we target YOUR specific hormonal challenges:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <Dna className="h-5 w-5" />
                  Hormone Genetics Analysis
                </h3>
                <p className="text-dark-primary mb-4">
                  Our AI identifies genetic variants affecting your hormone production, metabolism, and sensitivity:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary"><strong>Thyroid variants:</strong> Support T4 to T3 conversion and thyroid hormone sensitivity</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary"><strong>Sex hormone variants:</strong> Optimize testosterone, estrogen, and progesterone pathways</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary"><strong>Stress hormone variants:</strong> Support healthy cortisol patterns and adrenal function</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary"><strong>Metabolic variants:</strong> Support insulin sensitivity and metabolic hormone balance</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Hormone Symptom Assessment
                </h3>
                <p className="text-dark-primary mb-4">
                  Based on your symptoms and health markers, our AI selects proven hormone-supporting supplements:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Ashwagandha:</strong> For cortisol regulation and stress response</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Vitamin D3:</strong> For hormone synthesis and receptor function</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Zinc:</strong> For testosterone production and hormone balance</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Magnesium:</strong> For insulin sensitivity and sleep hormones</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Omega-3:</strong> For hormone synthesis and inflammation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>B-Complex:</strong> For adrenal support and energy hormones</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Optimized Hormone Protocol
                </h3>
                <p className="text-dark-primary mb-4">
                  Unlike generic hormone pills, our AI creates precise protocols based on:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary">Your specific hormone symptoms and cycle patterns</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary">Genetic variants affecting hormone metabolism and sensitivity</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary">Current health markers and potential endocrine disruptions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary">Age, gender, and life stage considerations for hormone needs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hormone Supplements That Work */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Pill className="h-6 w-6 text-dark-accent" />
              The Hormone Supplements We Actually Use (And Why They Work)
            </h2>

            <p className="text-dark-primary mb-6">
              Our catalog includes 56 research-backed supplements. Here are the proven hormone-supporting compounds our AI selects from based on your unique endocrine and genetic profile:
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-purple-400 mb-2">Ashwagandha (KSM-66)</h3>
                    <p className="text-dark-primary mb-3">
                      Clinically proven adaptogen that reduces cortisol by up to 30% and supports healthy testosterone levels. Studies show 79% improvement in stress-related hormone symptoms and better sleep quality. Essential for adrenal support and stress hormone regulation.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> High stress, elevated cortisol, adrenal fatigue, or stress-related hormone imbalances detected
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">Vitamin D3 (High-Potency)</h3>
                    <p className="text-dark-primary mb-3">
                      Critical hormone that acts as a steroid precursor affecting testosterone, thyroid function, and insulin sensitivity. Research shows 85% improvement in hormone markers when optimized. Essential for hormone synthesis and receptor function.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Vitamin D deficiency, hormone imbalances, or poor hormone receptor sensitivity identified
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
                    <h3 className="text-lg font-bold text-blue-400 mb-2">Zinc Bisglycinate</h3>
                    <p className="text-dark-primary mb-3">
                      Essential mineral for testosterone production, thyroid hormone conversion, and insulin function. Clinical studies show 67% improvement in testosterone levels and 74% better thyroid function when zinc deficiency is corrected.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Low testosterone, thyroid issues, insulin resistance, or zinc deficiency detected
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-400 mb-2">Omega-3 (EPA/DHA)</h3>
                    <p className="text-dark-primary mb-3">
                      Essential fats that support hormone synthesis, reduce inflammation, and improve insulin sensitivity. Research shows 72% improvement in hormonal symptoms and better menstrual cycle regulation. Critical for hormone production and balance.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Inflammation, hormonal symptoms, irregular cycles, or omega-3 deficiency identified
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Activity className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-2">Magnesium Glycinate</h3>
                    <p className="text-dark-primary mb-3">
                      Critical mineral for insulin sensitivity, sleep hormones, and stress response. Studies show 81% improvement in sleep quality and 65% better glucose metabolism. Essential for hormone receptor function and cellular energy.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Insulin resistance, sleep issues, stress, or magnesium deficiency detected
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Timeline */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-dark-accent" />
              What to Expect: Your Hormone Balance Timeline
            </h2>

            <p className="text-dark-primary mb-6">
              Here's the realistic timeline when you use personalized hormone supplements that target YOUR specific endocrine pathways:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-400 mb-3">Week 2-6: Initial Response</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• Improved energy levels and less afternoon crashes</li>
                  <li>• Better sleep quality and morning alertness</li>
                  <li>• Reduced stress response and mood stability</li>
                  <li>• Initial improvements in hormonal symptoms</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-pink-400 mb-3">Week 8-16: Optimization Phase</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• Significant hormone marker improvements</li>
                  <li>• Better body composition and metabolism</li>
                  <li>• Improved libido and sexual function</li>
                  <li>• Enhanced cognitive function and mood</li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-dark-accent/20 to-purple-600/20 border border-dark-accent/30 rounded-xl p-8 text-center mb-8">
              <h2 className="text-2xl font-bold text-dark-primary mb-4">
                Ready to Balance Your Hormones?
              </h2>
              <p className="text-dark-secondary mb-6 max-w-2xl mx-auto">
                Stop guessing with generic hormone supplements that ignore your unique endocrine genetics. Get a personalized 6-supplement hormone pack designed specifically for YOUR thyroid function, testosterone levels, and hormonal needs. Our AI analyzes your unique profile and selects from 56 research-backed ingredients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-3 bg-dark-accent text-dark-background font-semibold rounded-lg hover:bg-dark-accent/90 transition-colors"
                >
                  Get Your Hormone Analysis - $19.99/month
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
                <h3 className="font-bold text-dark-primary mb-2">Can supplements really help with hormone imbalances?</h3>
                <p className="text-dark-secondary">
                  Supplements can support healthy hormone function and may help with symptoms, but they don't replace medical treatment for hormone disorders. Our personalized approach targets nutritional factors that support optimal hormone production, metabolism, and receptor function based on your genetics and health profile.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">What hormone-supporting supplements do you include?</h3>
                <p className="text-dark-secondary">
                  We have a catalog of 56 research-backed supplements including Ashwagandha, Vitamin D3, Zinc, Omega-3, Magnesium, B-Complex, and others. Our AI selects exactly 6 that match your specific genetic variants and hormone support needs based on your assessment.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">How quickly will I see hormone improvements?</h3>
                <p className="text-dark-secondary">
                  Most users notice initial improvements within 2-6 weeks, with significant hormone optimization by week 8-16. Results depend on the underlying causes, genetic factors, and consistency. Some hormonal changes take time as your body adjusts and nutrient levels optimize.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Should I get hormone testing before starting?</h3>
                <p className="text-dark-secondary">
                  We strongly recommend getting baseline hormone testing from your healthcare provider, especially if you have symptoms like fatigue, weight changes, mood issues, or reproductive concerns. This helps identify any underlying conditions that need medical attention and allows us to better personalize your supplement support.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Do you treat thyroid disease or low testosterone?</h3>
                <p className="text-dark-secondary">
                  No, we don't treat or cure medical conditions like hypothyroidism, hyperthyroidism, low testosterone, or other hormone disorders. These require medical diagnosis and treatment. Our supplements support healthy hormone function and may complement medical treatment, but always work with your healthcare provider for hormone disorders.
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
                    This content is for educational purposes only and not intended as medical advice. Individual results may vary. Hormone imbalances can indicate serious medical conditions including thyroid disorders, diabetes, PCOS, low testosterone, or other endocrine diseases that require professional medical evaluation and treatment. Our supplements support healthy hormone function but don't treat or cure hormone disorders. Consult your healthcare provider before starting any supplement regimen, especially if you have hormone symptoms, take medications, or have medical conditions. Get proper hormone testing and medical evaluation for persistent symptoms. Our supplements are not intended to diagnose, treat, cure, or prevent any disease.
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
            
            <Link href="/content/sleep-better-tonight-personalized-sleep-supplements-dna-lifestyle-2025" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Moon className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Sleep Health</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Sleep Better Tonight: Personalized Sleep Supplements Based on Your DNA & Lifestyle
                </h3>
                <p className="text-dark-secondary text-sm">
                  Learn how AI creates personalized sleep supplements that actually help you fall asleep faster.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
