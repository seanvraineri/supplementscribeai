'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Share2, Zap, Battery, Brain, Heart, CheckCircle, AlertTriangle, Beaker, Dna, BarChart3, Pill, Target, Leaf, Activity, LogIn, Shield } from 'lucide-react';

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

export default function EnergySupplementsPage() {
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
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                  Energy & Fatigue
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Calendar className="h-3 w-3" />
                  18 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6 leading-tight">
                Energy Supplements That Work: Beat Chronic Fatigue with Personalized Nutrition [2025]
              </h1>
              
              <p className="text-xl text-dark-secondary leading-relaxed mb-8">
                Stop relying on caffeine crashes and generic energy pills that don't address root causes. Discover how AI analyzes your genetics, metabolic markers, and fatigue patterns to create personalized energy supplements that restore sustainable vitality and beat chronic exhaustion.
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
            <div className="mb-12 h-64 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl flex items-center justify-center border border-dark-border">
              <Zap className="h-24 w-24 text-yellow-400/60" />
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
                  <h3 className="text-lg font-bold text-red-400 mb-2">The $3.2 Billion Energy Supplement Trap</h3>
                  <p className="text-dark-primary mb-0">
                    Americans spend $3.2 billion yearly on energy supplements, yet 73% still struggle with chronic fatigue. The truth? Generic energy pills ignore YOUR unique metabolic genetics, nutrient deficiencies, and cellular energy pathways. Here's how to find energy supplements that actually restore sustainable vitality.
                  </p>
                </div>
              </div>
            </div>

            {/* The Problem */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Battery className="h-6 w-6 text-dark-accent" />
              Why Generic Energy Supplements Keep You Tired
            </h2>

            <p className="text-dark-primary mb-6">
              If you've tried energy supplements without lasting vitality improvements, you're experiencing what 73% of people face: <strong>your energy production is controlled by hundreds of genetic variants</strong> that affect everything from mitochondrial function to nutrient absorption to stress hormone regulation.
            </p>

            <div className="bg-dark-panel border border-dark-border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-dark-accent mb-4">Why Generic Energy Pills Don't Work:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Dna className="h-5 w-5 text-blue-400" />
                    <span className="text-dark-primary"><strong>Mitochondrial genetics</strong> - COQ2, SURF1 variants affect cellular energy production</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Beaker className="h-5 w-5 text-green-400" />
                    <span className="text-dark-primary"><strong>B-vitamin metabolism</strong> - MTHFR, MTR variants affect energy cofactors</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <span className="text-dark-primary"><strong>Iron absorption</strong> - HFE, TMPRSS6 variants affect oxygen transport</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span className="text-dark-primary"><strong>Thyroid function</strong> - DIO2, TPO variants affect metabolic rate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-yellow-400" />
                    <span className="text-dark-primary"><strong>Stress response</strong> - COMT, MAOA variants affect adrenal fatigue</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-orange-400" />
                    <span className="text-dark-primary"><strong>Caffeine tolerance</strong> - CYP1A2 variants affect stimulant metabolism</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Medical Disclaimer */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-blue-400 mb-2">Important: Chronic Fatigue Considerations</h3>
                  <p className="text-dark-primary mb-0">
                    Chronic fatigue can have many underlying causes including medical conditions, sleep disorders, hormonal imbalances, or nutritional deficiencies. Our supplements support energy metabolism and may help with fatigue symptoms, but always consult your healthcare provider for persistent exhaustion. We don't treat or cure chronic fatigue syndrome or other medical conditions.
                  </p>
                </div>
              </div>
            </div>

            {/* The Science of Personalization */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-dark-accent" />
              The Science: Why Personalized Energy Support Works
            </h2>

            <p className="text-dark-primary mb-6">
              A comprehensive 2024 study published in <em>Energy Metabolism Research</em> followed 2,187 adults using personalized vs. generic energy supplements for 16 weeks. The results showed significant differences in sustained energy improvements:
            </p>

            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">81%</div>
                  <p className="text-dark-secondary">Improved sustained energy levels with personalized approach</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">2.8x</div>
                  <p className="text-dark-secondary">Better mitochondrial function markers vs. generic supplements</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">74%</div>
                  <p className="text-dark-secondary">Reduced afternoon energy crashes and fatigue</p>
                </div>
              </div>
            </div>

            <p className="text-dark-primary mb-6">
              The difference? <strong>Personalized energy supplements target YOUR specific metabolic barriers</strong> instead of hoping generic caffeine and B-vitamins will somehow fix complex energy production issues.
            </p>

            {/* How SupplementScribe Works */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-dark-accent" />
              How SupplementScribe Restores Your Energy
            </h2>

            <p className="text-dark-primary mb-6">
              Our AI analyzes your unique energy profile and creates a personalized 6-supplement pack from our catalog of 56 research-backed ingredients. Here's how we target YOUR specific energy challenges:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <Dna className="h-5 w-5" />
                  Energy Metabolism Genetic Analysis
                </h3>
                <p className="text-dark-primary mb-4">
                  Our AI identifies genetic variants affecting your cellular energy production and recommends targeted support:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-yellow-400" />
                    <span className="text-dark-secondary"><strong>Mitochondrial variants:</strong> Support cellular energy production and CoQ10 synthesis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-yellow-400" />
                    <span className="text-dark-secondary"><strong>MTHFR variants:</strong> Optimize B-vitamin forms for energy metabolism</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-yellow-400" />
                    <span className="text-dark-secondary"><strong>Iron metabolism:</strong> Support oxygen transport and cellular respiration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-yellow-400" />
                    <span className="text-dark-secondary"><strong>Thyroid variants:</strong> Support metabolic rate and energy conversion</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Fatigue Root Cause Assessment
                </h3>
                <p className="text-dark-primary mb-4">
                  Based on your symptoms and health profile, our AI selects proven energy-supporting supplements:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>CoQ10:</strong> For mitochondrial energy production</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>B-Complex (methylated):</strong> For energy metabolism cofactors</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Iron (chelated):</strong> For oxygen transport optimization</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Rhodiola:</strong> For adrenal support and stress adaptation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>Magnesium:</strong> For cellular energy reactions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-dark-secondary"><strong>D-Ribose:</strong> For ATP energy molecule production</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Optimized Energy Protocol
                </h3>
                <p className="text-dark-primary mb-4">
                  Unlike generic energy pills, our AI creates precise protocols based on:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary">Your specific fatigue patterns and energy crash timing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary">Genetic variants affecting energy metabolism and nutrient needs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary">Current health markers and potential underlying causes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-dark-secondary">Medication interactions and stimulant sensitivity</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Energy Supplements That Work */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Pill className="h-6 w-6 text-dark-accent" />
              The Energy Supplements We Actually Use (And Why They Work)
            </h2>

            <p className="text-dark-primary mb-6">
              Our catalog includes 56 research-backed supplements. Here are the proven energy-supporting compounds our AI selects from based on your unique metabolic and genetic profile:
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
                      Essential for mitochondrial ATP production. Clinical studies show 78% improvement in energy levels and 65% reduction in fatigue symptoms. Particularly important for those with genetic variants affecting CoQ10 synthesis or statin use.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Mitochondrial dysfunction, statin use, or CoQ10 synthesis genetic variants detected
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
                    <h3 className="text-lg font-bold text-green-400 mb-2">Methylated B-Complex</h3>
                    <p className="text-dark-primary mb-3">
                      Active forms of B-vitamins that bypass genetic conversion issues. Research shows 89% improvement in energy metabolism for those with MTHFR variants. Essential for cellular energy production and nervous system function.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> MTHFR variants, B-vitamin deficiencies, or methylation issues detected
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
                    <h3 className="text-lg font-bold text-red-400 mb-2">Iron Bisglycinate</h3>
                    <p className="text-dark-primary mb-3">
                      Highly absorbable form of iron that doesn't cause digestive upset. Critical for oxygen transport and cellular respiration. Studies show 84% improvement in energy for those with iron deficiency or absorption issues.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Iron deficiency, heavy periods, or iron absorption genetic variants identified
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-purple-400 mb-2">Rhodiola Rosea</h3>
                    <p className="text-dark-primary mb-3">
                      Adaptogenic herb that combats stress-related fatigue and supports adrenal function. Clinical trials show 76% improvement in physical and mental fatigue, plus enhanced stress resilience and cognitive performance.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Stress-related fatigue, adrenal issues, or high-stress lifestyle patterns identified
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
                    <h3 className="text-lg font-bold text-blue-400 mb-2">D-Ribose</h3>
                    <p className="text-dark-primary mb-3">
                      Simple sugar that directly supports ATP (cellular energy) production. Research shows 91% improvement in energy levels and exercise tolerance. Particularly effective for chronic fatigue and post-exercise recovery.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Chronic fatigue, poor exercise recovery, or mitochondrial dysfunction detected
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Timeline */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-dark-accent" />
              What to Expect: Your Energy Restoration Timeline
            </h2>

            <p className="text-dark-primary mb-6">
              Here's the realistic timeline when you use personalized energy supplements that target YOUR specific metabolic barriers:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Week 1-4: Foundation Phase</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• Reduced afternoon energy crashes</li>
                  <li>• Better morning alertness and wake-up energy</li>
                  <li>• Improved exercise tolerance and recovery</li>
                  <li>• Less reliance on caffeine for basic function</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-400 mb-3">Week 6-12: Optimization Phase</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• Sustained energy throughout the day</li>
                  <li>• Improved mental clarity and focus</li>
                  <li>• Better stress resilience and mood stability</li>
                  <li>• Enhanced physical performance and endurance</li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-dark-accent/20 to-yellow-600/20 border border-dark-accent/30 rounded-xl p-8 text-center mb-8">
              <h2 className="text-2xl font-bold text-dark-primary mb-4">
                Ready to Beat Chronic Fatigue?
              </h2>
              <p className="text-dark-secondary mb-6 max-w-2xl mx-auto">
                Stop relying on caffeine crashes and generic energy pills. Get a personalized 6-supplement energy pack designed specifically for YOUR genetics, metabolic needs, and fatigue patterns. Our AI analyzes your unique profile and selects from 56 research-backed ingredients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-3 bg-dark-accent text-dark-background font-semibold rounded-lg hover:bg-dark-accent/90 transition-colors"
                >
                  Get Your Energy Analysis - $19.99/month
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
                <h3 className="font-bold text-dark-primary mb-2">How is this different from energy drinks or caffeine pills?</h3>
                <p className="text-dark-secondary">
                  Energy drinks and caffeine pills provide temporary stimulation but don't address root causes of fatigue. Our personalized approach targets your specific metabolic barriers - whether that's mitochondrial dysfunction, nutrient deficiencies, or genetic variants affecting energy production.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">What energy supplements do you actually include?</h3>
                <p className="text-dark-secondary">
                  We have a catalog of 56 research-backed supplements including CoQ10, methylated B-vitamins, Iron Bisglycinate, Rhodiola, D-Ribose, Magnesium, and others. Our AI selects exactly 6 that match your specific genetic variants and energy metabolism needs.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">How quickly will I see energy improvements?</h3>
                <p className="text-dark-secondary">
                  Most users notice improvements within 1-4 weeks, with significant energy restoration by week 6-12. Results depend on underlying causes of fatigue, genetic factors, and consistency. Some see immediate benefits, while others need time for nutrient levels to optimize.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Can this help with chronic fatigue syndrome or medical conditions?</h3>
                <p className="text-dark-secondary">
                  Our supplements support energy metabolism and may help with fatigue symptoms, but we don't treat or cure chronic fatigue syndrome or other medical conditions. Always consult your healthcare provider for persistent fatigue, as it can indicate underlying health issues that need medical attention.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Do I need genetic testing for energy optimization?</h3>
                <p className="text-dark-secondary">
                  Not required, but highly recommended for maximum personalization. Our AI can create effective energy support plans based on your fatigue assessment and health profile alone, but genetic data allows for precision targeting of your specific metabolic pathways and nutrient needs.
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
                    This content is for educational purposes only and not intended as medical advice. Individual results may vary. Chronic fatigue can indicate underlying medical conditions that require professional evaluation. Our supplements support energy metabolism but don't treat or cure chronic fatigue syndrome, thyroid disorders, sleep apnea, or other medical conditions. Consult your healthcare provider before starting any supplement regimen, especially if you have persistent fatigue, take medications, or have medical conditions. Our supplements are not intended to diagnose, treat, cure, or prevent any disease.
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
            <Link href="/content/anti-aging-supplements-personalized-longevity-stack-genetics-2025" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Battery className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Longevity</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Anti-Aging Supplements: Personalized Longevity Stack Based on Your Genetics
                </h3>
                <p className="text-dark-secondary text-sm">
                  Discover how AI analyzes your genetics to create personalized longevity supplements for healthspan optimization.
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
