'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Heart, Users, TrendingUp, DollarSign, Brain, Shield, LogIn } from 'lucide-react';
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

export default function AIAffordableHealthPage() {
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
                  Health
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  5 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                How AI is Making Personalized Health Affordable and Accessible for Everyone
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
                Personalized health was once a luxury for the elite, with costs soaring into thousands. Now, AI is breaking those barriers, making tailored wellness accessible to all. At SupplementScribe, we lead this revolution with $19.99/month software-only or $75/month complete plans, delivering custom supplement solutions via our 5-minute deep health analysis.
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Why Personalized Health Was Once Expensive</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Traditional personalized health came with a high price tag due to:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Exclusive Services:</strong> Biohacking consultations cost thousands.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Manual Analysis:</strong> Human specialists spent hours on bloodwork or genetic data, driving up fees.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Limited Access:</strong> Top-tier care was geographically restricted, leaving most with generic options.
                    </div>
                  </li>
                </ul>
              </div>

              <p className="text-dark-secondary leading-relaxed">
                This left millions wanting better health solutions out of reach.
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How AI Levels the Playing Field</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                AI is revolutionizing personalized health by:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Scalable Data Analysis:</strong> Processes health inputs (e.g., symptom reports, optional bloodwork) in seconds, slashing costs.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Automation Efficiency:</strong> Generates AI wellness plans, identifying deficiencies and tailoring recommendations, reducing manual effort.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Continuous Updates:</strong> Adjusts plans in real-time as your health evolves, included in both $19.99 and $75 plans.
                    </div>
                  </li>
                </ul>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Why Personalized Health Matters for Everyone</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Custom supplement solutions benefit all, not just biohackers:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Precision Over Guesswork:</strong> Plans based on your 5-minute analysis ensure you take what you need.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Maximized Benefits:</strong> Targeted nutrients deliver faster results, avoiding wasted spending.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Preventative Care:</strong> Early imbalance detection prevents costly conditions.
                    </div>
                  </li>
                </ul>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How SupplementScribe Makes It Affordable</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                We simplify personalized health:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>1. Provide Your Data:</strong> Complete our 5-minute deep health analysis, optionally adding bloodwork or genetic insights.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>2. Receive Your Plan:</strong> AI crafts a custom supplement plan with a grocery list; $75/month adds six monthly supplement packs.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>3. Track Progress:</strong> Monitor improvements and update your AI wellness plans as needed.
                    </div>
                  </li>
                </ul>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Future of Affordable Wellness</h2>
              
              <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl p-6 my-8">
                <p className="text-dark-secondary leading-relaxed">
                  Personalized health is the 2025 standard, not a luxury. As AI advances, SupplementScribe ensures affordable personalized health for everyone, everywhere, with plans starting at $19.99/month.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">FAQ</h2>
              
              <div className="space-y-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">How Quickly Can I See Results?</h3>
                  <p className="text-dark-secondary text-sm">Improvements may start in 4–12 weeks, based on health optimization data.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Is Personalized Health Costly?</h3>
                  <p className="text-dark-secondary text-sm">No—$19.99/month (software) or $75/month (complete) beats traditional thousands.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Can I Use Optional Health Data?</h3>
                  <p className="text-dark-secondary text-sm">Yes, enhance your plan with bloodwork or genetic insights if available.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 rounded-xl p-6 my-8">
                <h2 className="text-2xl font-bold text-dark-primary mb-4">Conclusion</h2>
                <p className="text-dark-secondary leading-relaxed mb-4">
                  Join the affordable personalized health 2025 movement with SupplementScribe. Start your custom supplement solutions journey at SupplementScribe.com for $19.99 or $75/month today!
                </p>
                <p className="text-sm text-dark-secondary">
                  <strong>About the Team:</strong> The SupplementScribe Health Team combines 15+ years of health and AI expertise to deliver accessible, evidence-based wellness.
                </p>
              </div>

            </div>
          </motion.article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Personalized Health Journey?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands who've transformed their health with AI-powered personalized supplements. Get started with our 5-minute health analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Start Free Analysis
              </Link>
              <Link 
                href="/science"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
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
                href="/content/dna-optimized-supplements-ai-guide-2025"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">DNA-Optimized Supplements</h4>
                <p className="text-dark-secondary text-sm">How AI Tailors Your Vitamins to Genes & Bloodwork</p>
              </Link>
              
              <Link 
                href="/content/mthfr-gene-anxiety-founder-journey"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">MTHFR & Anxiety</h4>
                <p className="text-dark-secondary text-sm">A Founder's Journey from SSRIs to Nutrient Optimization</p>
              </Link>
              
              <Link 
                href="/content/ai-optimized-supplements-dna-personalization-2025"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">AI-Optimized Supplements</h4>
                <p className="text-dark-secondary text-sm">Why Your DNA Demands Personalization</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 