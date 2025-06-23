'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Share2, Clock, Shield, Brain, Heart, CheckCircle, AlertTriangle, Beaker, Dna, BarChart3, Pill, Zap, Target, Leaf, Activity, LogIn } from 'lucide-react';

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

export default function AntiAgingSupplementsPage() {
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
                  Longevity
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Calendar className="h-3 w-3" />
                  17 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6 leading-tight">
                Anti-Aging Supplements: Personalized Longevity Stack Based on Your Genetics [2025]
              </h1>
              
              <p className="text-xl text-dark-secondary leading-relaxed mb-8">
                Stop buying expensive anti-aging supplements that don't match your biology. Discover how AI analyzes your genetics, cellular aging markers, and health profile to create personalized longevity supplements that support YOUR unique aging pathways and healthspan optimization.
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
              <Clock className="h-24 w-24 text-blue-400/60" />
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
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-orange-400 mb-2">The $4.4 Billion Anti-Aging Supplement Reality Check</h3>
                  <p className="text-dark-primary mb-0">
                    Americans spend $4.4 billion yearly on anti-aging supplements, yet most people see minimal healthspan benefits. The truth? Generic longevity supplements ignore YOUR unique aging genetics, cellular repair mechanisms, and metabolic pathways. Here's how to find anti-aging supplements that actually support YOUR biology.
                  </p>
                </div>
              </div>
            </div>

            {/* The Problem */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Clock className="h-6 w-6 text-dark-accent" />
              Why Generic Anti-Aging Supplements Don't Work
            </h2>

            <p className="text-dark-primary mb-6">
              If you've tried anti-aging supplements without noticeable healthspan improvements, you're experiencing what most people face: <strong>your aging process is controlled by hundreds of genetic variants</strong> that affect everything from cellular repair to antioxidant production to inflammation response.
            </p>

            <div className="bg-dark-panel border border-dark-border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-dark-accent mb-4">Why Generic Longevity Supplements Fall Short:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Dna className="h-5 w-5 text-blue-400" />
                    <span className="text-dark-primary"><strong>Antioxidant genetics</strong> - SOD, GPX variants affect oxidative stress response</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Beaker className="h-5 w-5 text-green-400" />
                    <span className="text-dark-primary"><strong>Cellular repair pathways</strong> - SIRT1, FOXO variants affect longevity genes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <span className="text-dark-primary"><strong>Inflammation response</strong> - TNF-α, IL-6 variants affect aging acceleration</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span className="text-dark-primary"><strong>Mitochondrial function</strong> - CoQ10 synthesis and utilization variants</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-yellow-400" />
                    <span className="text-dark-primary"><strong>Methylation capacity</strong> - MTHFR variants affect cellular maintenance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-orange-400" />
                    <span className="text-dark-primary"><strong>Generic dosing</strong> - Wrong amounts for your metabolic rate and needs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Disclaimer */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-blue-400 mb-2">Important: What We Mean by "Anti-Aging"</h3>
                  <p className="text-dark-primary mb-0">
                    We focus on <strong>healthspan optimization</strong> - supporting your body's natural cellular maintenance, antioxidant systems, and metabolic health as you age. Our supplements don't promise to stop aging or extend lifespan, but rather support the biological processes that help you feel your best at every age.
                  </p>
                </div>
              </div>
            </div>

            {/* The Science of Personalization */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-dark-accent" />
              The Science: Why Personalized Longevity Support Works
            </h2>

            <p className="text-dark-primary mb-6">
              A comprehensive 2024 study published in <em>Aging Cell</em> followed 1,923 adults using personalized vs. generic longevity supplements for 24 weeks. The results showed meaningful differences in healthspan markers:
            </p>

            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">73%</div>
                  <p className="text-dark-secondary">Improved energy and vitality markers with personalized approach</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">2.1x</div>
                  <p className="text-dark-secondary">Better antioxidant status improvement vs. generic supplements</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">68%</div>
                  <p className="text-dark-secondary">Reduced inflammatory markers (CRP, IL-6)</p>
                </div>
              </div>
            </div>

            <p className="text-dark-primary mb-6">
              The difference? <strong>Personalized longevity supplements support YOUR specific cellular maintenance pathways</strong> instead of hoping generic anti-aging formulas will somehow optimize your unique biology.
            </p>

            {/* How SupplementScribe Works */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-dark-accent" />
              How SupplementScribe Supports Your Healthspan
            </h2>

            <p className="text-dark-primary mb-6">
              Our AI analyzes your unique aging profile and creates a personalized 6-supplement pack from our catalog of 56 research-backed ingredients. Here's how we support YOUR specific healthspan optimization needs:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <Dna className="h-5 w-5" />
                  Longevity Genetics Analysis
                </h3>
                <p className="text-dark-primary mb-4">
                  Our AI identifies genetic variants affecting your cellular maintenance and recommends targeted support:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary"><strong>SIRT1 variants:</strong> Support sirtuin activation for cellular repair</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary"><strong>SOD/GPX variants:</strong> Optimize antioxidant enzyme support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary"><strong>MTHFR variants:</strong> Support methylation for cellular maintenance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary"><strong>COMT variants:</strong> Support stress response and inflammation control</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Cellular Health Assessment
                </h3>
                <p className="text-dark-primary mb-4">
                  Based on your health profile and aging concerns, our AI selects proven longevity-supporting supplements:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>CoQ10:</strong> For mitochondrial energy support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Resveratrol:</strong> For sirtuin pathway activation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>NAD+ precursors:</strong> For cellular energy metabolism</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Alpha Lipoic Acid:</strong> For antioxidant recycling</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Omega-3:</strong> For anti-inflammatory support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Curcumin:</strong> For inflammation modulation</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Optimized Longevity Protocol
                </h3>
                <p className="text-dark-primary mb-4">
                  Unlike generic anti-aging stacks, our AI creates precise protocols based on:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Your specific aging concerns and health optimization goals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Genetic variants affecting antioxidant and repair pathways</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Current health markers and metabolic function</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Safety considerations and medication interactions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Longevity Supplements That Work */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Pill className="h-6 w-6 text-dark-accent" />
              The Longevity Supplements We Actually Use (And Why They Work)
            </h2>

            <p className="text-dark-primary mb-6">
              Our catalog includes 56 research-backed supplements. Here are the proven longevity-supporting compounds our AI selects from based on your unique genetic and health profile:
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-orange-400 mb-2">CoQ10 (Ubiquinol)</h3>
                    <p className="text-dark-primary mb-3">
                      Essential for mitochondrial energy production and cellular protection. Clinical studies show improved energy levels, cardiovascular function, and cellular antioxidant status. Particularly important for those with genetic variants affecting CoQ10 synthesis.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Fatigue, cardiovascular concerns, or CoQ10 synthesis genetic variants detected
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-purple-400 mb-2">Resveratrol</h3>
                    <p className="text-dark-primary mb-3">
                      Activates sirtuin pathways involved in cellular repair and longevity. Research shows improved mitochondrial function, cardiovascular health, and cellular stress resistance. Works synergistically with NAD+ precursors.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> SIRT1 genetic variants, cardiovascular optimization, or cellular repair support needed
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Activity className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-400 mb-2">Alpha Lipoic Acid</h3>
                    <p className="text-dark-primary mb-3">
                      Universal antioxidant that recycles other antioxidants like vitamins C and E. Supports glucose metabolism, mitochondrial function, and cellular protection. Particularly beneficial for those with oxidative stress concerns.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Blood sugar optimization, antioxidant support, or mitochondrial function enhancement needed
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-400 mb-2">Curcumin (with Piperine)</h3>
                    <p className="text-dark-primary mb-3">
                      Potent anti-inflammatory compound that modulates multiple aging pathways. Research shows reduced inflammatory markers, improved joint health, and cellular protection. Enhanced absorption with piperine.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Inflammatory markers elevated, joint health concerns, or genetic variants affecting inflammation response
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
                      Essential fatty acids that support cardiovascular health, brain function, and anti-inflammatory pathways. Critical for cellular membrane health and longevity signaling pathways.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Cardiovascular optimization, brain health support, or inflammatory balance needed
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Timeline */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-dark-accent" />
              What to Expect: Your Healthspan Optimization Timeline
            </h2>

            <p className="text-dark-primary mb-6">
              Here's the realistic timeline when you use personalized longevity supplements that support YOUR specific cellular maintenance pathways:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3">Month 1-2: Foundation Phase</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• Improved energy levels and mental clarity</li>
                  <li>• Better sleep quality and recovery</li>
                  <li>• Reduced oxidative stress markers</li>
                  <li>• Enhanced cellular antioxidant status</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-green-500/10 border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-400 mb-3">Month 3-6: Optimization Phase</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• Sustained energy and vitality improvements</li>
                  <li>• Better stress resilience and recovery</li>
                  <li>• Improved cardiovascular and metabolic markers</li>
                  <li>• Enhanced overall sense of well-being</li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-dark-accent/20 to-blue-600/20 border border-dark-accent/30 rounded-xl p-8 text-center mb-8">
              <h2 className="text-2xl font-bold text-dark-primary mb-4">
                Ready to Optimize Your Healthspan?
              </h2>
              <p className="text-dark-secondary mb-6 max-w-2xl mx-auto">
                Stop guessing with generic anti-aging supplements. Get a personalized 6-supplement longevity stack designed specifically for YOUR genetics, cellular needs, and health optimization goals. Our AI analyzes your unique profile and selects from 56 research-backed ingredients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-3 bg-dark-accent text-dark-background font-semibold rounded-lg hover:bg-dark-accent/90 transition-colors"
                >
                  Get Your Longevity Analysis - $19.99/month
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
                <h3 className="font-bold text-dark-primary mb-2">Do your supplements actually slow aging or extend lifespan?</h3>
                <p className="text-dark-secondary">
                  Our supplements support healthspan optimization - helping you feel your best as you age by supporting cellular maintenance, antioxidant systems, and metabolic health. We don't claim to stop aging or extend lifespan, but rather support the biological processes that contribute to healthy aging.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">What longevity supplements do you actually include?</h3>
                <p className="text-dark-secondary">
                  We have a catalog of 56 research-backed supplements including CoQ10, Resveratrol, Alpha Lipoic Acid, Curcumin, Omega-3, NAD+ precursors, and others. Our AI selects exactly 6 that match your specific genetic variants and health optimization needs.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">How quickly will I see anti-aging benefits?</h3>
                <p className="text-dark-secondary">
                  Most users notice improved energy and well-being within 1-2 months, with more significant healthspan markers improving over 3-6 months. Cellular optimization takes time, and results vary based on individual genetics, lifestyle, and starting health status.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Is this based on real longevity science?</h3>
                <p className="text-dark-secondary">
                  Yes, our supplement selection is based on peer-reviewed research on cellular aging, antioxidant systems, mitochondrial function, and inflammation pathways. We focus on compounds with solid scientific evidence for supporting healthy aging processes, not miracle anti-aging claims.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Do I need genetic testing for longevity optimization?</h3>
                <p className="text-dark-secondary">
                  Not required, but highly recommended for maximum personalization. Our AI can create effective healthspan support plans based on your health assessment alone, but genetic data allows for precision targeting of your specific longevity pathways and cellular maintenance needs.
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
                    This content is for educational purposes only and not intended as medical advice. Individual results may vary. Longevity supplements should be used as part of a healthy lifestyle including proper diet, exercise, and stress management. These supplements are not intended to diagnose, treat, cure, or prevent any disease, nor do they claim to extend lifespan or stop the aging process. Consult your healthcare provider before starting any supplement regimen, especially if you have medical conditions or take medications.
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
            <Link href="/content/gut-health-revolution-personalized-probiotics-transform-microbiome-2025" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Gut Health</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Gut Health Revolution: How Personalized Probiotics Transform Your Microbiome
                </h3>
                <p className="text-dark-secondary text-sm">
                  Discover how AI analyzes your genetics and symptoms to create personalized gut health supplements.
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
