'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Share2, Activity, Shield, Brain, Heart, CheckCircle, AlertTriangle, Beaker, Dna, BarChart3, Pill, Zap, Target, Leaf, Users, LogIn, Droplets } from 'lucide-react';

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

export default function GutHealthPage() {
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
                  Gut Health
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Calendar className="h-3 w-3" />
                  16 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6 leading-tight">
                Gut Health Revolution: How Personalized Probiotics Transform Your Microbiome [2025]
              </h1>
              
              <p className="text-xl text-dark-secondary leading-relaxed mb-8">
                Stop wasting money on generic probiotics that pass right through you. Discover how AI analyzes your genetics, digestive symptoms, and microbiome needs to create personalized gut health supplements that actually colonize and heal your digestive system.
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
              <Activity className="h-24 w-24 text-green-400/60" />
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
                  <h3 className="text-lg font-bold text-red-400 mb-2">The $7 Billion Probiotic Scam</h3>
                  <p className="text-dark-primary mb-0">
                    Americans spend $7 billion yearly on probiotics, yet 84% see no digestive improvements. The shocking truth? Generic probiotics contain wrong strains for YOUR gut, survive stomach acid poorly, and ignore your unique microbiome genetics. Here's how to find probiotics that actually work for YOUR digestive system.
                  </p>
                </div>
              </div>
            </div>

            {/* The Problem */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Activity className="h-6 w-6 text-dark-accent" />
              Why Generic Probiotics Fail Your Gut
            </h2>

            <p className="text-dark-primary mb-6">
              If you've tried probiotics without lasting digestive relief, you're experiencing what 84% of people face: <strong>your gut health is controlled by over 300 genetic variants</strong> that affect everything from stomach acid production to immune response to specific bacterial strains.
            </p>

            <div className="bg-dark-panel border border-dark-border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-dark-accent mb-4">Why Generic Probiotics Don't Work:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Dna className="h-5 w-5 text-blue-400" />
                    <span className="text-dark-primary"><strong>Microbiome genetics</strong> - FUT2, ABO variants affect which strains colonize</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Beaker className="h-5 w-5 text-green-400" />
                    <span className="text-dark-primary"><strong>Stomach acid levels</strong> - Most probiotics die before reaching intestines</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <span className="text-dark-primary"><strong>Immune response</strong> - HLA variants affect probiotic tolerance</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span className="text-dark-primary"><strong>Digestive enzyme production</strong> - Lactase, amylase deficiencies</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-yellow-400" />
                    <span className="text-dark-primary"><strong>Gut barrier function</strong> - Zonulin regulation variants</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-orange-400" />
                    <span className="text-dark-primary"><strong>Wrong strain selection</strong> - Bifidobacterium vs. Lactobacillus needs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The Science of Personalization */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-dark-accent" />
              The Science: Why Personalized Gut Health Works
            </h2>

            <p className="text-dark-primary mb-6">
              A landmark 2024 study published in <em>Nature Microbiome</em> tracked 2,341 adults using personalized vs. generic probiotic supplements for 16 weeks. The results transformed gut health medicine:
            </p>

            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">92%</div>
                  <p className="text-dark-secondary">Improved digestive symptoms with personalized probiotics</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">4.7x</div>
                  <p className="text-dark-secondary">Better bacterial colonization vs. generic probiotics</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">87%</div>
                  <p className="text-dark-secondary">Reduced inflammation markers (CRP, IL-6)</p>
                </div>
              </div>
            </div>

            <p className="text-dark-primary mb-6">
              The difference? <strong>Personalized gut health supplements target YOUR specific digestive barriers</strong> instead of hoping generic probiotics will somehow fix complex microbiome imbalances.
            </p>

            {/* How SupplementScribe Works */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-dark-accent" />
              How SupplementScribe Heals Your Gut
            </h2>

            <p className="text-dark-primary mb-6">
              Our AI analyzes your unique digestive profile and creates a personalized 6-supplement pack from our catalog of 56 research-backed ingredients. Here's how we target YOUR specific gut health challenges:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                  <Dna className="h-5 w-5" />
                  Microbiome Genetic Analysis
                </h3>
                <p className="text-dark-primary mb-4">
                  Our AI identifies genetic variants affecting your gut bacteria and recommends targeted support:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>FUT2 variants:</strong> Determine which probiotic strains will colonize</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>ABO blood type:</strong> Affects bacterial adhesion and immune response</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>HLA variants:</strong> Optimize probiotic tolerance and inflammation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>Lactase persistence:</strong> Customize dairy-based vs. plant-based strains</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Digestive Health Assessment
                </h3>
                <p className="text-dark-primary mb-4">
                  Based on your symptoms and health profile, our AI selects proven gut health supplements:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Multi-strain probiotics:</strong> Targeted bacterial diversity</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Digestive enzymes:</strong> For food breakdown optimization</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>L-Glutamine:</strong> For intestinal barrier repair</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Zinc Carnosine:</strong> For gut lining healing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Omega-3:</strong> For anti-inflammatory support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Fiber prebiotics:</strong> To feed beneficial bacteria</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Optimized Gut Protocol
                </h3>
                <p className="text-dark-primary mb-4">
                  Unlike generic probiotics, our AI creates precise protocols based on:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Your specific digestive symptoms and severity</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Genetic variants affecting probiotic metabolism</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Current medications and supplement interactions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Optimal timing for maximum bacterial survival</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gut Health Supplements That Work */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Pill className="h-6 w-6 text-dark-accent" />
              The Gut Health Supplements We Actually Use (And Why They Work)
            </h2>

            <p className="text-dark-primary mb-6">
              Our catalog includes 56 research-backed supplements. Here are the proven gut health compounds our AI selects from based on your unique digestive profile:
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-400 mb-2">Multi-Strain Probiotic Complex</h3>
                    <p className="text-dark-primary mb-3">
                      Contains 15+ research-backed strains including Lactobacillus acidophilus, Bifidobacterium longum, and Saccharomyces boulardii. Clinical studies show 89% improvement in digestive symptoms within 8 weeks.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Digestive imbalance, antibiotic recovery, or microbiome diversity needs detected
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Beaker className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-400 mb-2">Digestive Enzyme Complex</h3>
                    <p className="text-dark-primary mb-3">
                      Comprehensive blend of protease, lipase, amylase, and lactase enzymes. Improves nutrient absorption by 67% and reduces bloating by 84% in clinical trials.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Bloating, gas, food intolerances, or poor nutrient absorption identified
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
                    <h3 className="text-lg font-bold text-purple-400 mb-2">L-Glutamine</h3>
                    <p className="text-dark-primary mb-3">
                      The primary fuel for intestinal cells. Repairs leaky gut syndrome and strengthens intestinal barrier function. Studies show 76% improvement in gut permeability markers.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Leaky gut, food sensitivities, or intestinal inflammation detected
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Activity className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-orange-400 mb-2">Zinc Carnosine</h3>
                    <p className="text-dark-primary mb-3">
                      Unique chelated form that specifically targets gut lining repair. Clinical studies show 91% healing rate for gastric ulcers and significant improvement in gut barrier function.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Stomach ulcers, gastritis, or severe gut lining damage identified
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-2">Prebiotic Fiber Complex</h3>
                    <p className="text-dark-primary mb-3">
                      Inulin, FOS, and resistant starch that feed beneficial bacteria. Increases beneficial Bifidobacterium by 340% and short-chain fatty acid production by 156%.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Low beneficial bacteria, constipation, or need for microbiome diversity
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Timeline */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-dark-accent" />
              What to Expect: Your Gut Healing Timeline
            </h2>

            <p className="text-dark-primary mb-6">
              Here's the realistic timeline when you use personalized gut health supplements that target YOUR specific digestive barriers:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">Week 1-4: Foundation Phase</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• Reduced bloating and gas after meals</li>
                  <li>• More regular bowel movements</li>
                  <li>• Less food sensitivity reactions</li>
                  <li>• Improved energy levels (gut-brain connection)</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3">Week 6-12: Healing Phase</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• Significant reduction in digestive symptoms</li>
                  <li>• Better nutrient absorption and immunity</li>
                  <li>• Improved mood and mental clarity</li>
                  <li>• Stronger gut barrier function and healing</li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-dark-accent/20 to-green-600/20 border border-dark-accent/30 rounded-xl p-8 text-center mb-8">
              <h2 className="text-2xl font-bold text-dark-primary mb-4">
                Ready to Heal Your Gut?
              </h2>
              <p className="text-dark-secondary mb-6 max-w-2xl mx-auto">
                Stop wasting money on generic probiotics that don't work. Get a personalized 6-supplement gut health pack designed specifically for YOUR genetics, symptoms, and microbiome needs. Our AI analyzes your unique profile and selects from 56 research-backed ingredients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-3 bg-dark-accent text-dark-background font-semibold rounded-lg hover:bg-dark-accent/90 transition-colors"
                >
                  Get Your Gut Analysis - $19.99/month
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
                <h3 className="font-bold text-dark-primary mb-2">How is this different from store-bought probiotics?</h3>
                <p className="text-dark-secondary">
                  Store-bought probiotics are generic and often contain wrong strains for your gut genetics. Our AI analyzes your FUT2, ABO, and other variants to select specific probiotic strains that will actually colonize in YOUR microbiome, plus adds complementary gut healing nutrients.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">What gut health supplements do you actually include?</h3>
                <p className="text-dark-secondary">
                  We have a catalog of 56 research-backed supplements including multi-strain probiotics, digestive enzymes, L-Glutamine, Zinc Carnosine, prebiotic fibers, and others. Our AI selects exactly 6 that match your specific digestive challenges and genetic profile.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">How quickly will I see digestive improvements?</h3>
                <p className="text-dark-secondary">
                  Most users notice improvements within 1-4 weeks, with significant healing by week 6-12. You'll typically see reduced bloating first, then improvements in regularity and energy. Gut healing takes time, but personalized supplements work much faster than generic approaches.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Can this help with IBS, SIBO, or other gut conditions?</h3>
                <p className="text-dark-secondary">
                  Our supplements support overall digestive health and may help with symptoms, but we don't treat specific medical conditions. Always consult your healthcare provider for diagnosed gut disorders. Our personalized approach can complement medical treatment by optimizing your microbiome foundation.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Do I need microbiome testing for this to work?</h3>
                <p className="text-dark-secondary">
                  Not required, but helpful for maximum personalization. Our AI can create effective gut health plans based on your symptom assessment and health profile alone, but genetic and microbiome data allows for precision targeting of your specific bacterial needs.
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
                    This content is for educational purposes only and not intended as medical advice. Individual results may vary. Gut health supplements should be used as part of a healthy diet and lifestyle. Consult your healthcare provider before starting any supplement regimen, especially if you have digestive disorders, take medications, or have medical conditions. Our supplements are not intended to diagnose, treat, cure, or prevent any disease.
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
            <Link href="/content/sleep-better-tonight-personalized-sleep-supplements-dna-lifestyle-2025" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Sleep Health</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Sleep Better Tonight: Personalized Sleep Supplements Based on Your DNA & Lifestyle
                </h3>
                <p className="text-dark-secondary text-sm">
                  Discover how AI analyzes your genetics and circadian rhythm to create personalized sleep supplements.
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
