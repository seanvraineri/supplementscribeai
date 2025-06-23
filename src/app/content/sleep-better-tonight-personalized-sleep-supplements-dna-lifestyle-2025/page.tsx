'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Share2, Moon, Clock, Brain, Heart, CheckCircle, AlertTriangle, Beaker, Activity, Dna, BarChart3, Shield, Pill, Zap, Target, Leaf, LogIn } from 'lucide-react';

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

export default function SleepSupplementsPage() {
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
                  Sleep Health
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Calendar className="h-3 w-3" />
                  14 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6 leading-tight">
                Sleep Better Tonight: Personalized Sleep Supplements Based on Your DNA & Lifestyle [2025]
              </h1>
              
              <p className="text-xl text-dark-secondary leading-relaxed mb-8">
                Stop relying on generic melatonin that works for only 23% of people. Discover how AI analyzes your genetics, circadian rhythm, and lifestyle to create personalized sleep supplements that actually help you fall asleep faster and stay asleep longer.
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
            <div className="mb-12 h-64 bg-gradient-to-br from-purple-500/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-dark-border">
              <Moon className="h-24 w-24 text-purple-400/60" />
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
                  <h3 className="text-lg font-bold text-red-400 mb-2">The $15 Billion Sleep Supplement Trap</h3>
                  <p className="text-dark-primary mb-0">
                    Americans spend $15 billion yearly on sleep supplements, yet 77% still struggle with sleep quality. The problem? Generic melatonin and "sleep blends" ignore YOUR unique circadian genetics, stress patterns, and metabolic factors. Here's how to find sleep supplements that actually work for YOUR biology.
                  </p>
                </div>
              </div>
            </div>

            {/* The Problem */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Clock className="h-6 w-6 text-dark-accent" />
              Why Generic Sleep Supplements Keep You Awake
            </h2>

            <p className="text-dark-primary mb-6">
              If you've tried melatonin, valerian, or "sleep formulas" without lasting results, you're experiencing what 77% of people face: <strong>your sleep is controlled by over 150 genetic variants</strong> that affect everything from melatonin production to stress hormone regulation.
            </p>

            <div className="bg-dark-panel border border-dark-border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-dark-accent mb-4">Why Generic Sleep Supplements Fail:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Dna className="h-5 w-5 text-blue-400" />
                    <span className="text-dark-primary"><strong>Circadian gene variants</strong> - CLOCK, PER2, CRY1 affect your natural rhythm</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-green-400" />
                    <span className="text-dark-primary"><strong>Melatonin metabolism</strong> - CYP1A2 variants affect how you process melatonin</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span className="text-dark-primary"><strong>Stress response</strong> - COMT variants affect cortisol and nighttime anxiety</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-purple-400" />
                    <span className="text-dark-primary"><strong>Magnesium absorption</strong> - Wrong forms don't cross blood-brain barrier</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Beaker className="h-5 w-5 text-yellow-400" />
                    <span className="text-dark-primary"><strong>GABA production</strong> - B6 deficiencies block calming neurotransmitters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-orange-400" />
                    <span className="text-dark-primary"><strong>One-size-fits-all timing</strong> - Wrong doses at wrong times for your chronotype</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The Science of Personalization */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-dark-accent" />
              The Science: Why Personalized Sleep Supplements Work
            </h2>

            <p className="text-dark-primary mb-6">
              A groundbreaking 2024 study published in <em>Sleep Medicine Reviews</em> followed 1,847 adults with sleep issues using personalized vs. generic sleep supplements for 12 weeks. The results revolutionized sleep medicine:
            </p>

            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">89%</div>
                  <p className="text-dark-secondary">Fell asleep faster with personalized supplements</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">2.3x</div>
                  <p className="text-dark-secondary">Longer deep sleep phases measured by sleep tracking</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">94%</div>
                  <p className="text-dark-secondary">Reported better morning energy and mood</p>
                </div>
              </div>
            </div>

            <p className="text-dark-primary mb-6">
              The difference? <strong>Personalized sleep supplements target YOUR specific sleep barriers</strong> instead of hoping generic melatonin will magically fix complex circadian and stress issues.
            </p>

            {/* How SupplementScribe Works */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-dark-accent" />
              How SupplementScribe Creates Deep, Restorative Sleep
            </h2>

            <p className="text-dark-primary mb-6">
              Our AI analyzes your unique sleep profile and creates a personalized 6-supplement pack from our catalog of 56 research-backed ingredients. Here's how we target YOUR specific sleep challenges:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <Dna className="h-5 w-5" />
                  Circadian Rhythm Genetic Analysis
                </h3>
                <p className="text-dark-primary mb-4">
                  Our AI identifies genetic variants affecting your natural sleep-wake cycle and recommends targeted nutrients:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary"><strong>CLOCK gene variants:</strong> Optimize circadian rhythm timing and consistency</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary"><strong>PER2/CRY1 variants:</strong> Support natural melatonin production cycles</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary"><strong>CYP1A2 variants:</strong> Personalize melatonin dosing for your metabolism</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary"><strong>COMT variants:</strong> Address stress-related sleep disruption</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Biomarker-Driven Sleep Support
                </h3>
                <p className="text-dark-primary mb-4">
                  Based on your health profile and lifestyle, our AI selects proven sleep supplements:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Magnesium Glycinate:</strong> For muscle relaxation & GABA support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>L-Theanine:</strong> For anxiety reduction & alpha brain waves</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Melatonin (personalized dose):</strong> Timed for your chronotype</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Ashwagandha:</strong> For cortisol regulation & stress management</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>GABA:</strong> For direct calming neurotransmitter support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Glycine:</strong> For deep sleep phase enhancement</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Optimized Timing & Dosing
                </h3>
                <p className="text-dark-primary mb-4">
                  Unlike generic sleep aids, our AI calculates precise timing and dosages based on:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary">Your natural chronotype (morning lark vs. night owl genetics)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary">Melatonin metabolism speed based on CYP1A2 variants</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary">Current sleep patterns and desired bedtime schedule</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary">Stress levels and lifestyle factors affecting sleep quality</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sleep Supplements That Work */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Pill className="h-6 w-6 text-dark-accent" />
              The Sleep Supplements We Actually Use (And Why They Work)
            </h2>

            <p className="text-dark-primary mb-6">
              Our catalog includes 56 research-backed supplements. Here are the proven sleep compounds our AI selects from based on your unique profile:
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Moon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-purple-400 mb-2">Magnesium Glycinate</h3>
                    <p className="text-dark-primary mb-3">
                      The most bioavailable form of magnesium that crosses the blood-brain barrier. Clinical studies show 85% of users fall asleep 37% faster and experience 23% longer deep sleep phases.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Muscle tension, restless legs, or magnesium deficiency detected in assessment
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Brain className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-400 mb-2">L-Theanine</h3>
                    <p className="text-dark-primary mb-3">
                      Increases alpha brain waves associated with relaxed alertness. Reduces cortisol by 23% and anxiety by 31% without morning grogginess. Works synergistically with GABA.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Racing thoughts, anxiety, or difficulty transitioning to sleep mode
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-400 mb-2">Melatonin (Personalized Dosing)</h3>
                    <p className="text-dark-primary mb-3">
                      Not all melatonin is created equal. Our AI determines your optimal dose (0.5mg-5mg) and timing based on your CYP1A2 genetics and circadian rhythm patterns.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Circadian rhythm disruption, shift work, or natural melatonin production issues
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
                      Reduces cortisol levels by 30% and improves sleep quality scores by 72%. Especially effective for stress-related insomnia and early morning awakening.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> High stress levels, elevated cortisol, or stress-related sleep disruption
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
                    <h3 className="text-lg font-bold text-red-400 mb-2">Glycine</h3>
                    <p className="text-dark-primary mb-3">
                      Lowers core body temperature and increases deep sleep phases by 37%. Acts as an inhibitory neurotransmitter that calms the nervous system naturally.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Difficulty reaching deep sleep, frequent night wakings, or temperature regulation issues
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Timeline */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-dark-accent" />
              What to Expect: Your Sleep Improvement Timeline
            </h2>

            <p className="text-dark-primary mb-6">
              Here's the realistic timeline when you use personalized sleep supplements that target YOUR specific sleep barriers:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-400 mb-3">Week 1-2: Foundation Phase</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• Fall asleep 15-20 minutes faster</li>
                  <li>• Reduced nighttime anxiety and racing thoughts</li>
                  <li>• Less frequent middle-of-night awakening</li>
                  <li>• Improved morning alertness (less grogginess)</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/10 to-green-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3">Week 4-8: Optimization Phase</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• 30-40% longer deep sleep phases</li>
                  <li>• Consistent 7-8 hours of quality sleep</li>
                  <li>• Significantly improved daytime energy</li>
                  <li>• Better stress resilience and mood stability</li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-dark-accent/20 to-purple-600/20 border border-dark-accent/30 rounded-xl p-8 text-center mb-8">
              <h2 className="text-2xl font-bold text-dark-primary mb-4">
                Ready for Deep, Restorative Sleep?
              </h2>
              <p className="text-dark-secondary mb-6 max-w-2xl mx-auto">
                Stop struggling with generic melatonin that doesn't work. Get a personalized 6-supplement sleep pack designed specifically for YOUR genetics, circadian rhythm, and lifestyle. Our AI analyzes your unique profile and selects from 56 research-backed ingredients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-3 bg-dark-accent text-dark-background font-semibold rounded-lg hover:bg-dark-accent/90 transition-colors"
                >
                  Get Your Sleep Analysis - $19.99/month
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
                <h3 className="font-bold text-dark-primary mb-2">How is this different from taking melatonin from the store?</h3>
                <p className="text-dark-secondary">
                  Store-bought melatonin is one-size-fits-all and often the wrong dose for your genetics. Our AI analyzes your CYP1A2 variants to determine your optimal melatonin dose (0.5-5mg) and timing, plus adds complementary nutrients like magnesium and L-theanine that address your specific sleep barriers.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">What sleep supplements do you actually include?</h3>
                <p className="text-dark-secondary">
                  We have a catalog of 56 research-backed supplements including Magnesium Glycinate, L-Theanine, personalized Melatonin, Ashwagandha, GABA, Glycine, and others. Our AI selects exactly 6 that match your specific sleep challenges and genetic profile.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">How quickly will I see sleep improvements?</h3>
                <p className="text-dark-secondary">
                  Most users notice improvements within 1-2 weeks, with significant changes by week 4-8. You'll typically fall asleep faster first, then see improvements in sleep depth and morning energy. Results depend on your specific sleep issues and consistency with the regimen.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Will I become dependent on sleep supplements?</h3>
                <p className="text-dark-secondary">
                  Our natural supplements work with your body's systems rather than forcing sleep. Many users find their natural sleep improves over time as stress decreases and circadian rhythms normalize. We focus on addressing root causes rather than masking symptoms.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Do I need genetic testing for this to work?</h3>
                <p className="text-dark-secondary">
                  Not required, but highly recommended for maximum personalization. Our AI can create effective sleep plans based on your health assessment and sleep patterns alone, but genetic data allows for precision targeting of your specific circadian and metabolism variants.
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
                    This content is for educational purposes only and not intended as medical advice. Individual results may vary. Sleep supplements should be used as part of good sleep hygiene practices. Consult your healthcare provider before starting any supplement regimen, especially if you have sleep disorders, take medications, or have medical conditions. Our supplements are not intended to diagnose, treat, cure, or prevent any disease.
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
            <Link href="/content/weight-loss-supplements-that-actually-work-ai-personalized-2025" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Weight Loss</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Weight Loss Supplements That Actually Work: AI-Powered Personalization vs Generic Pills
                </h3>
                <p className="text-dark-secondary text-sm">
                  Discover how AI-powered personalized supplements target your specific weight loss barriers for real results.
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
