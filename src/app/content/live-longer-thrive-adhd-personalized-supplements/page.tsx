'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Heart, Brain, Zap, Target, Shield, CheckCircle, TrendingUp, LogIn } from 'lucide-react';
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

export default function ADHDLongevityPage() {
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
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  Longevity
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  7 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                Live Longer and Thrive with ADHD: Personalized Supplements for a Healthier You
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
            <div className="mb-12 h-64 bg-gradient-to-br from-green-500/20 to-blue-900/20 rounded-xl flex items-center justify-center">
              <Heart className="h-24 w-24 text-green-400/60" />
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
                Recent reports suggest a link between ADHD and reduced life expectancy, raising concerns about health risks. Yet, you're not bound by statistics. With proactive strategies, you can boost longevity and well-being. SupplementScribe revolutionizes ADHD management with $19.99/month software-only or $75/month complete plans, offering personalized ADHD health 2025 solutions via AI-driven insights.
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How SupplementScribe Empowers Your Health</h2>
              
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-400" />
                  Personalized Supplement Plans
                </h3>
                <p className="text-dark-secondary mb-4">Our AI analyzes your:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-dark-secondary">ADHD symptoms</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-dark-secondary">Health goals</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-dark-secondary">Lifestyle factors</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-dark-secondary">Optional bloodwork or genetic data</span>
                  </li>
                </ul>
                <p className="text-dark-secondary mt-4">
                  <strong>The result?</strong> A custom plan with ADHD longevity supplements tailored to enhance brain function, energy, and clarity.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-purple-400" />
                  Target Key ADHD Areas
                </h3>
                <p className="text-dark-secondary mb-4">We recommend science-backed nutrients:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-dark-primary">Improved Focus & Attention:</strong>
                      <span className="text-dark-secondary"> Boost cognitive performance.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-dark-primary">Reduced Impulsivity:</strong>
                      <span className="text-dark-secondary"> Enhance decision-making.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-dark-primary">Stress & Anxiety Management:</strong>
                      <span className="text-dark-secondary"> Stabilize mood.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-dark-primary">Better Sleep Quality:</strong>
                      <span className="text-dark-secondary"> Support restorative rest.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                  Convenient Health Support
                </h3>
                <p className="text-dark-secondary mb-4">Navigating supplements is simplified with:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-dark-secondary">Detailed info on each recommendation.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-dark-secondary">Precise dosage guidelines.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-dark-secondary">Links to trusted, third-party-tested vendors; $75/month includes six monthly supplement packs.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-400" />
                  24/7 AI Health Assistant
                </h3>
                <p className="text-dark-secondary mb-4">Our chatbot offers ongoing support to:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <span className="text-dark-secondary">Answer supplement queries.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <span className="text-dark-secondary">Share wellness tips.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <span className="text-dark-secondary">Adjust your AI ADHD wellness plan as needed.</span>
                  </li>
                </ul>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Beyond Supplements: A Holistic ADHD Approach</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                SupplementScribe complements nutrition with lifestyle tips:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-dark-primary">Cultivate Healthy Habits:</strong>
                      <span className="text-dark-secondary"> Exercise to boost dopamine, eat brain-boosting foods, and practice mindfulness.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-dark-primary">Seek Professional Guidance:</strong>
                      <span className="text-dark-secondary"> Consult healthcare experts for added support.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-dark-primary">Connect with Support:</strong>
                      <span className="text-dark-secondary"> Build a network via friends or communities for long-term success.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 my-8">
                <h2 className="text-2xl font-bold text-dark-primary mb-4">Take Control of Your Health Today</h2>
                <p className="text-dark-secondary leading-relaxed">
                  Defy ADHD statistics with personalized ADHD health 2025 plans. Enhance focus, energy, and longevity with SupplementScribe.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">FAQ</h2>
              
              <div className="space-y-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">How Does ADHD Impact Life Expectancy?</h3>
                  <p className="text-dark-secondary text-sm">Research indicates potential health risks, but lifestyle and nutrition can mitigate this.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Can Supplements Manage ADHD Symptoms?</h3>
                  <p className="text-dark-secondary text-sm">Yes, nutrients like omega-3s, magnesium, and zinc support focus and mood, per studies.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">What Sets SupplementScribe Apart?</h3>
                  <p className="text-dark-secondary text-sm">Our AI creates custom ADHD longevity supplements, not generic plans.</p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Is There Science Behind This?</h3>
                  <p className="text-dark-secondary text-sm">Yes, recommendations draw from peer-reviewed research and health data.</p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">When Will I Notice Results?</h3>
                  <p className="text-dark-secondary text-sm">Many see improved focus and sleep within weeks, varying by individual.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 my-8">
                <h2 className="text-2xl font-bold text-dark-primary mb-4">Conclusion</h2>
                <p className="text-dark-secondary leading-relaxed">
                  Thrive with ADHD using SupplementScribe's personalized ADHD health 2025 solutions. Start at SupplementScribe.com for $19.99 or $75/month!
                </p>
              </div>

            </div>
          </motion.article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Live Longer and Thrive with ADHD?</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Don't let statistics define your future. Take control with personalized ADHD supplements designed to enhance your longevity and well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Start Your Health Journey
              </Link>
              <Link 
                href="/science"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
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
                href="/content/adhd-nutritional-deficiencies-missing-piece"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">ADHD Nutritional Deficiencies</h4>
                <p className="text-dark-secondary text-sm">Could Nutritional Deficiencies Be the Missing Piece?</p>
              </Link>
              
              <Link 
                href="/content/mthfr-gene-anxiety-founder-journey"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">MTHFR & Anxiety</h4>
                <p className="text-dark-secondary text-sm">A Founder's Journey from SSRIs to Nutrient Optimization</p>
              </Link>
              
              <Link 
                href="/content/ai-making-personalized-health-affordable-accessible"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">AI Making Health Affordable</h4>
                <p className="text-dark-secondary text-sm">How AI is Breaking Barriers to Personalized Wellness</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 