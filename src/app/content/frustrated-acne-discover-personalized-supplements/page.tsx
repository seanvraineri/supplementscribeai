'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Sparkles, Brain, Zap, Target, Shield, CheckCircle, TrendingUp, LogIn, Star, Search, Lightbulb, Award } from 'lucide-react';
import Link from 'next/link';

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
          <Link href="/content" className="text-dark-secondary hover:text-dark-primary transition-colors">
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

export default function AcneSupplementsPage() {
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
            {/* Back to Content */}
            <Link href="/content" className="inline-flex items-center gap-2 text-dark-secondary hover:text-dark-accent transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Content
            </Link>

            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm font-medium">
                  Skin Health
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  6 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                Frustrated with Acne? Discover the Power of Personalized Supplements
              </h1>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-dark-accent/20 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-dark-accent" />
                  </div>
                  <div>
                    <p className="text-dark-primary font-medium">SupplementScribe Health Team</p>
                    <div className="flex items-center gap-2 text-dark-secondary text-sm">
                      <Calendar className="h-3 w-3" />
                      Published June 23, 2025
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
            <div className="mb-12 h-64 bg-gradient-to-br from-pink-500/20 to-purple-900/20 rounded-xl flex items-center justify-center">
              <Sparkles className="h-24 w-24 text-pink-400/60" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.article
            className="prose prose-lg prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-dark-primary space-y-6 leading-relaxed">
              
              <p className="text-xl text-dark-secondary leading-relaxed">
                Struggling with breakouts? Acne affects millions, sapping confidence despite topical treatments that often miss the root cause. What if the best supplements for acne lie within a personalized plan? SupplementScribe, an AI-powered platform, offers <strong>personalized acne supplements 2025</strong> tailored to your unique needs via a 5-minute deep health analysis. Achieve clearer, healthier skin naturally with plans starting at $19.99/month or $75/month with custom supplement packs.
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Why Generic Solutions Fail Acne Sufferers</h2>
              
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <Search className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed">
                      Topical creams offer temporary relief, but acne often stems from internal imbalances. Studies suggest <strong className="text-dark-primary">70% of cases involve nutrient gaps or hormonal triggers</strong> ignored by one-size-fits-all products. This leaves you wasting time and money on ineffective treatments.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How Personalized Acne Supplements Transform Skin Health</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                SupplementScribe's <strong>AI acne treatment</strong> pinpoints and addresses underlying issues:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-400" />
                  Uncover Deficiencies
                </h3>
                <p className="text-dark-secondary">
                  Analyzes your diet, lifestyle, and optional health data to spot gaps like low zinc or vitamin D.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-purple-400" />
                  Target Root Causes
                </h3>
                <p className="text-dark-secondary mb-4">Custom plans tackle:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-pink-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-dark-primary">Hormonal Imbalances:</strong>
                      <span className="text-dark-secondary"> Balances levels to reduce breakouts.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-dark-primary">Inflammation:</strong>
                      <span className="text-dark-secondary"> Eases redness with targeted nutrients.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-dark-primary">Skin Cell Renewal:</strong>
                      <span className="text-dark-secondary"> Boosts healing for lasting results.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-400" />
                  24/7 Expert Guidance
                </h3>
                <p className="text-dark-secondary">
                  Our AI chatbot answers questions, suggests skincare tweaks, and tracks progress anytime.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">What Makes Our Approach Stand Out?</h2>
              
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <Award className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed">
                      Unlike generic supplements, our <strong className="text-dark-primary">personalized acne supplements 2025</strong> adapt to you. The $75/month plan delivers six monthly packs, while $19.99/month includes a custom grocery list and insights, all backed by science.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl p-6 my-8">
                <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-yellow-400" />
                  Visualize Clearer Skin
                </h2>
                <p className="text-dark-secondary leading-relaxed">
                  Imagine waking to smooth, glowing skin, confidently embracing your day. With the right <strong>AI acne treatment</strong>, this is within reach—naturally and affordably.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Start Your Journey to Radiant Skin</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Take control today with SupplementScribe:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-dark-secondary">Get a tailored plan based on your 5-minute analysis.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-dark-secondary">Ditch trial-and-error with <strong>best supplements for acne</strong>.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-dark-secondary">Unlock <strong>personalized acne supplements 2025</strong> for $19.99 or $75/month.</span>
                  </li>
                </ul>
                <div className="mt-6 text-center">
                  <p className="text-dark-primary font-semibold">Visit SupplementScribe.com to begin!</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">FAQ</h2>
              
              <div className="space-y-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Do Supplements Really Help Acne?</h3>
                  <p className="text-dark-secondary text-sm">Yes, nutrients like zinc and omega-3s address deficiencies linked to 70% of acne cases, per research.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">How Are Plans Personalized?</h3>
                  <p className="text-dark-secondary text-sm">AI evaluates your health input for a custom AI acne treatment plan.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Which Supplements Fight Acne?</h3>
                  <p className="text-dark-secondary text-sm">Common options include zinc, omega-3s, probiotics, and vitamin D, tailored to your needs.</p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">How Long Until I See Clearer Skin?</h3>
                  <p className="text-dark-secondary text-sm">Many notice improvements in weeks to months with consistent use.</p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Is This Scientifically Supported?</h3>
                  <p className="text-dark-secondary text-sm">Yes, our best supplements for acne rely on peer-reviewed studies and AI analysis.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl p-6 my-8">
                <h2 className="text-2xl font-bold text-dark-primary mb-4">Conclusion</h2>
                <p className="text-dark-secondary leading-relaxed">
                  Say goodbye to acne frustration with SupplementScribe's <strong>personalized acne supplements 2025</strong>. Start your natural skin health journey today at SupplementScribe.com for $19.99 or $75/month!
                </p>
              </div>

            </div>
          </motion.article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Skin with Personalized Supplements?</h3>
            <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
              Stop letting acne hold you back. Discover the power of AI-driven, personalized supplement plans designed specifically for clearer, healthier skin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors"
              >
                Start Your Skin Journey
              </Link>
              <Link 
                href="/science"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-colors"
              >
                View the Science
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-dark-primary mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link 
                href="/content/ai-optimized-supplements-dna-personalization-2025"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">AI-Optimized Supplements</h4>
                <p className="text-dark-secondary text-sm">Why Your DNA Demands Personalization</p>
              </Link>
              
              <Link 
                href="/content/dna-optimized-supplements-ai-guide-2025"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">DNA-Optimized Supplements</h4>
                <p className="text-dark-secondary text-sm">How AI Tailors Your Vitamins to Genes & Bloodwork</p>
              </Link>
              
              <Link 
                href="/content/ai-making-personalized-health-affordable-accessible"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">AI Making Health Affordable</h4>
                <p className="text-dark-secondary text-sm">Personalized Health for Everyone</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
