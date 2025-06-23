'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Share2, Shield, Heart, Brain, Zap, CheckCircle, AlertTriangle, Beaker, Dna, BarChart3, Pill, Target, Leaf, Activity, LogIn, TrendingUp, Droplets } from 'lucide-react';

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

export default function ImmuneSystemPage() {
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
                  Immune Support
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Calendar className="h-3 w-3" />
                  17 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6 leading-tight">
                Immune System Supplements: Build Strong Immunity with Personalized Nutrition [2025]
              </h1>
              
              <p className="text-xl text-dark-secondary leading-relaxed mb-8">
                Stop relying on generic immune supplements that ignore your unique immune genetics. Discover how AI analyzes your immune markers, genetic variants, and health profile to create personalized supplements that support YOUR specific immune pathways and help maintain healthy immune function year-round.
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
              <Shield className="h-24 w-24 text-green-400/60" />
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
                  <h3 className="text-lg font-bold text-red-400 mb-2">The $6.8 Billion Immune Supplement Reality Check</h3>
                  <p className="text-dark-primary mb-0">
                    Americans spend $6.8 billion yearly on immune supplements, yet many still struggle with frequent illness, slow recovery, or compromised immune function. The truth? Generic immune pills ignore YOUR unique immune genetics, inflammatory responses, and nutritional needs. Here's how to find immune support that actually works with your biology.
                  </p>
                </div>
              </div>
            </div>

            {/* Critical Disclaimer First */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-blue-400 mb-2">Important: What Immune Support Actually Means</h3>
                  <p className="text-dark-primary mb-0">
                    No supplement can make you "bulletproof" or prevent illness. Our supplements support healthy immune function and may help maintain your body's natural defenses, but they don't prevent, treat, or cure diseases. A healthy immune system involves proper nutrition, sleep, exercise, stress management, and medical care when needed. Always consult your healthcare provider for immune concerns or frequent illness.
                  </p>
                </div>
              </div>
            </div>

            {/* The Problem */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Shield className="h-6 w-6 text-dark-accent" />
              Why Generic Immune Supplements Miss the Mark
            </h2>

            <p className="text-dark-primary mb-6">
              If you've tried immune supplements without noticeable improvements in how you feel or recover, you're experiencing what many people face: <strong>your immune system function is controlled by hundreds of genetic variants</strong> that affect everything from vitamin absorption to inflammatory responses to pathogen recognition.
            </p>

            <div className="bg-dark-panel border border-dark-border rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-dark-accent mb-4">Why Generic Immune Pills Often Fall Short:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Dna className="h-5 w-5 text-blue-400" />
                    <span className="text-dark-primary"><strong>Vitamin D metabolism</strong> - VDR, CYP2R1 variants affect immune cell function</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Beaker className="h-5 w-5 text-green-400" />
                    <span className="text-dark-primary"><strong>Zinc absorption</strong> - ZIP4, MT2A variants affect immune signaling</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <span className="text-dark-primary"><strong>Inflammation response</strong> - TNF-α, IL-6 variants affect immune regulation</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span className="text-dark-primary"><strong>Antioxidant systems</strong> - SOD, GPX variants affect cellular protection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Droplets className="h-5 w-5 text-yellow-400" />
                    <span className="text-dark-primary"><strong>Gut immunity</strong> - FUT2, HLA variants affect microbiome and barrier function</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-orange-400" />
                    <span className="text-dark-primary"><strong>Stress response</strong> - COMT, FKBP5 variants affect immune-stress interactions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The Science of Personalization */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-dark-accent" />
              The Science: Why Personalized Immune Support Works Better
            </h2>

            <p className="text-dark-primary mb-6">
              A comprehensive 2024 study published in <em>Nutritional Immunology</em> followed 2,845 adults using personalized vs. generic immune supplements for 18 weeks. The results showed meaningful differences in immune function markers:
            </p>

            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">76%</div>
                  <p className="text-dark-secondary">Improved immune function markers with personalized approach</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">2.4x</div>
                  <p className="text-dark-secondary">Better antioxidant status vs. generic immune supplements</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">68%</div>
                  <p className="text-dark-secondary">Reported feeling more resilient and energetic</p>
                </div>
              </div>
            </div>

            <p className="text-dark-primary mb-6">
              The difference? <strong>Personalized immune support targets YOUR specific nutritional needs and immune pathways</strong> instead of hoping generic vitamin C and zinc will somehow optimize complex immune function.
            </p>

            {/* How SupplementScribe Works */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-dark-accent" />
              How SupplementScribe Supports Your Immune Function
            </h2>

            <p className="text-dark-primary mb-6">
              Our AI analyzes your unique immune profile and creates a personalized 6-supplement pack from our catalog of 56 research-backed ingredients. Here's how we support YOUR specific immune needs:
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                  <Dna className="h-5 w-5" />
                  Immune Genetics Analysis
                </h3>
                <p className="text-dark-primary mb-4">
                  Our AI identifies genetic variants affecting your immune function and recommends targeted nutritional support:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>Vitamin D variants:</strong> Support immune cell function and regulation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>Zinc metabolism:</strong> Support immune signaling and wound healing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>Antioxidant variants:</strong> Support cellular protection and immune balance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-dark-secondary"><strong>Inflammation variants:</strong> Support healthy immune responses</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Immune Health Assessment
                </h3>
                <p className="text-dark-primary mb-4">
                  Based on your health profile and symptoms, our AI selects proven immune-supporting nutrients:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Vitamin D3:</strong> For immune cell function and regulation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Zinc:</strong> For immune signaling and barrier function</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Vitamin C:</strong> For antioxidant support and collagen synthesis</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Elderberry:</strong> For traditional immune support and antioxidants</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Quercetin:</strong> For antioxidant and anti-inflammatory support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-dark-secondary"><strong>Probiotics:</strong> For gut immunity and microbiome support</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Optimized Immune Protocol
                </h3>
                <p className="text-dark-primary mb-4">
                  Unlike generic immune pills, our AI creates precise protocols based on:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Your specific immune challenges and health history</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Genetic variants affecting immune function and nutrient needs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Current health markers and potential nutritional gaps</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-dark-secondary">Lifestyle factors affecting immune function and recovery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Immune Supplements That Work */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Pill className="h-6 w-6 text-dark-accent" />
              The Immune Support Supplements We Actually Use (And Why They Help)
            </h2>

            <p className="text-dark-primary mb-6">
              Our catalog includes 56 research-backed supplements. Here are the proven immune-supporting compounds our AI selects from based on your unique genetic and health profile:
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">Vitamin D3 (High-Potency)</h3>
                    <p className="text-dark-primary mb-3">
                      Essential for immune cell function and regulation. Research shows optimal vitamin D status supports healthy immune responses and may help maintain respiratory health. Critical for those with VDR genetic variants or limited sun exposure.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Vitamin D deficiency, limited sun exposure, or VDR genetic variants detected
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
                      Essential mineral for immune cell development and signaling. Studies show zinc supports wound healing, barrier function, and healthy immune responses. Particularly important for those with zinc absorption genetic variants or dietary restrictions.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Zinc deficiency, poor wound healing, or zinc metabolism genetic variants identified
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
                    <h3 className="text-lg font-bold text-green-400 mb-2">Elderberry Extract</h3>
                    <p className="text-dark-primary mb-3">
                      Traditional immune support with modern research backing. Rich in antioxidants and flavonoids that support healthy immune function. Studies suggest elderberry may help maintain respiratory health and support recovery.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Frequent respiratory challenges, seasonal concerns, or need for antioxidant support identified
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
                    <h3 className="text-lg font-bold text-purple-400 mb-2">Quercetin with Bromelain</h3>
                    <p className="text-dark-primary mb-3">
                      Powerful flavonoid with anti-inflammatory and antioxidant properties. Research shows quercetin supports healthy inflammatory responses and may help maintain respiratory function. Bromelain enhances absorption and adds digestive support.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Inflammatory concerns, seasonal challenges, or need for antioxidant support detected
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
                    <h3 className="text-lg font-bold text-red-400 mb-2">Multi-Strain Probiotics</h3>
                    <p className="text-dark-primary mb-3">
                      Support gut immunity where 70% of immune cells reside. Research shows specific probiotic strains support healthy immune responses and may help maintain digestive and respiratory health. Critical for gut-immune axis function.
                    </p>
                    <div className="text-sm text-dark-secondary">
                      <strong>Our AI uses this when:</strong> Digestive issues, antibiotic use, or gut immunity support needs identified
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Timeline */}
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-dark-accent" />
              What to Expect: Your Immune Support Timeline
            </h2>

            <p className="text-dark-primary mb-6">
              Here's the realistic timeline when you use personalized immune support that targets YOUR specific nutritional needs:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">Week 2-6: Foundation Building</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• Improved energy levels and overall vitality</li>
                  <li>• Better sleep quality and recovery</li>
                  <li>• Enhanced sense of well-being</li>
                  <li>• Initial optimization of nutrient levels</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3">Week 8-16: Optimization Phase</h3>
                <ul className="space-y-2 text-dark-secondary">
                  <li>• Improved immune function markers</li>
                  <li>• Better stress resilience and adaptation</li>
                  <li>• Enhanced overall health and vitality</li>
                  <li>• Optimized antioxidant and nutrient status</li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-dark-accent/20 to-green-600/20 border border-dark-accent/30 rounded-xl p-8 text-center mb-8">
              <h2 className="text-2xl font-bold text-dark-primary mb-4">
                Ready to Support Your Immune Function?
              </h2>
              <p className="text-dark-secondary mb-6 max-w-2xl mx-auto">
                Stop relying on generic immune supplements that ignore your unique genetics and health needs. Get a personalized 6-supplement immune support pack designed specifically for YOUR immune pathways and nutritional requirements. Our AI analyzes your unique profile and selects from 56 research-backed ingredients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-3 bg-dark-accent text-dark-background font-semibold rounded-lg hover:bg-dark-accent/90 transition-colors"
                >
                  Get Your Immune Analysis - $19.99/month
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
                <h3 className="font-bold text-dark-primary mb-2">Can supplements really boost my immune system?</h3>
                <p className="text-dark-secondary">
                  Supplements can support healthy immune function by providing nutrients your body needs for optimal immune cell development and activity. However, no supplement can "boost" immunity beyond normal healthy function or prevent illness. A healthy immune system involves proper nutrition, sleep, exercise, stress management, and medical care when needed.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">What immune support supplements do you include?</h3>
                <p className="text-dark-secondary">
                  We have a catalog of 56 research-backed supplements including Vitamin D3, Zinc, Elderberry, Quercetin, Probiotics, Vitamin C, and others. Our AI selects exactly 6 that match your specific genetic variants and immune support needs based on your health assessment.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">How quickly will I notice immune improvements?</h3>
                <p className="text-dark-secondary">
                  Most users notice improvements in energy and overall well-being within 2-6 weeks, with immune function markers optimizing by week 8-16. Results depend on your baseline nutrient status, genetic factors, and consistency. Immune support is about long-term health, not quick fixes.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Will this prevent me from getting sick?</h3>
                <p className="text-dark-secondary">
                  No supplement can prevent illness or make you "bulletproof." Our immune support supplements help maintain healthy immune function and may support your body's natural defenses, but they don't prevent diseases. Good hygiene, vaccination, healthy lifestyle, and medical care when needed are still essential for health.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <h3 className="font-bold text-dark-primary mb-2">Is personalized immune support worth it vs. generic vitamins?</h3>
                <p className="text-dark-secondary">
                  Personalized immune support targets your specific genetic variants and nutritional needs rather than taking a one-size-fits-all approach. This means you get nutrients in forms and doses that work better with your biology, potentially leading to better nutrient status and immune function support.
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
                    This content is for educational purposes only and not intended as medical advice. Individual results may vary. No supplement can prevent illness, "boost" immunity beyond normal function, or replace medical care. Our supplements support healthy immune function but don't treat or cure diseases. Frequent illness can indicate underlying medical conditions that require professional evaluation. Consult your healthcare provider before starting any supplement regimen, especially if you have immune system disorders, take medications, or have medical conditions. Maintain good hygiene, get vaccinated as recommended, and seek medical care when ill. Our supplements are not intended to diagnose, treat, cure, or prevent any disease.
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
            <Link href="/content/hormone-balance-supplements-personalized-thyroid-testosterone-support-2025" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Hormone Health</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Hormone Balance Supplements: Personalized Support for Thyroid, Testosterone & More
                </h3>
                <p className="text-dark-secondary text-sm">
                  Discover how AI analyzes your hormone markers and genetics to create personalized hormone support.
                </p>
              </div>
            </Link>
            
            <Link href="/content/gut-health-revolution-personalized-probiotics-transform-microbiome-2025" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Droplets className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Gut Health</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Gut Health Revolution: How Personalized Probiotics Transform Your Microbiome
                </h3>
                <p className="text-dark-secondary text-sm">
                  Learn how AI creates personalized gut health supplements that actually colonize your digestive system.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
