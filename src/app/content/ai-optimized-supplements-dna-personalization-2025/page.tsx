'use client'

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Brain, Zap, Target, TrendingUp, Database, LogIn } from 'lucide-react';
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

export default function AIOptimizedSupplementsPage() {
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
                <span className="px-3 py-1 bg-dark-accent/20 text-dark-accent rounded-full text-sm font-medium">
                  Science
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  6 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                AI-Optimized Supplements: Why Your DNA Demands Personalization (2025 Data-Backed Guide)
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
                      Published January 26, 2025
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
            <div className="mb-12 h-64 bg-gradient-to-br from-dark-accent/20 to-purple-900/20 rounded-xl flex items-center justify-center">
              <Brain className="h-24 w-24 text-dark-accent/60" />
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
                Health and wellness are evolving, and generic supplements are losing ground. People crave personalized solutions tailored to their unique needs, and SupplementScribe is leading this shift. With our $19.99/month software-only plan or $75/month complete package (including six personalized supplement packs), we use AI to deliver custom wellness plans based on your health data. This 2025 guide explores why personalized supplements are the future and how our platform makes them accessible.
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Decline of One-Size-Fits-All Supplements</h2>
              
              <p>The $230B supplement industry relies on "average" doses, but no one is average. Studies show 79% of users see no benefits from generic vitamins due to:</p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Inefficiency:</strong> Taking nutrients your body doesn't need.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Overuse Risks:</strong> Excess intake causes imbalances or side effects.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Lack of Insight:</strong> No personalization leaves effectiveness untracked.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 my-8">
                <h3 className="text-lg font-semibold text-red-400 mb-3">The Cost of Generic Supplements</h3>
                <p>This wastes up to <strong>$50/month per person</strong>, prompting a demand for better solutions.</p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How Personalized Supplements Transform Wellness</h2>
              
              <p>Personalized supplements address these flaws by tailoring recommendations to your biology and lifestyle. Here's how:</p>

              <div className="space-y-6 my-8">
                <div className="bg-gradient-to-r from-dark-accent/10 to-blue-900/10 border border-dark-accent/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-dark-accent mb-4">Rooted in Your Health Profile</h3>
                  <p className="mb-4">Our 5-minute deep health analysis captures:</p>
                  <ul className="space-y-2 ml-6">
                    <li>• Symptom reports (e.g., fatigue, stress)</li>
                    <li>• Lifestyle factors (sleep, diet, exercise)</li>
                    <li>• Optional bloodwork or genetic insights if available</li>
                  </ul>
                  <p className="mt-4 text-dark-secondary">This ensures science-backed custom wellness plans.</p>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-emerald-900/10 border border-green-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-green-400 mb-4">Precise Nutrient Targeting</h3>
                  <p>You receive only what your body needs, optimized for absorption, avoiding generic overdosing pitfalls.</p>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-indigo-900/10 border border-purple-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4">Ongoing Adaptation</h3>
                  <p>The $75/month plan delivers monthly supplement packs, while both plans adjust recommendations as your health evolves.</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Power of AI in Personalized Health</h2>
              
              <p>AI drives this revolution at SupplementScribe, analyzing complex data to:</p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-dark-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-dark-accent" />
                    </div>
                    <h4 className="font-semibold text-dark-primary mb-2">Identify Patterns</h4>
                    <p className="text-dark-secondary text-sm">Process health inputs for optimization opportunities.</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-dark-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="h-6 w-6 text-dark-accent" />
                    </div>
                    <h4 className="font-semibold text-dark-primary mb-2">Deliver Insights</h4>
                    <p className="text-dark-secondary text-sm">Simplify data into actionable AI health optimization plans.</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-dark-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6 text-dark-accent" />
                    </div>
                    <h4 className="font-semibold text-dark-primary mb-2">Ensure Accessibility</h4>
                    <p className="text-dark-secondary text-sm">Scale personalized care affordably with zero human error.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How SupplementScribe Simplifies Your Journey</h2>
              
              <p>Our platform makes personalized health easy:</p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <span className="bg-dark-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">1</span>
                    <div>
                      <h4 className="font-semibold text-dark-primary mb-2">Provide Your Data</h4>
                      <p className="text-dark-secondary text-sm">Complete our 5-minute deep health analysis, optionally adding bloodwork or genetic details.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <span className="bg-dark-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">2</span>
                    <div>
                      <h4 className="font-semibold text-dark-primary mb-2">Get Your Plan</h4>
                      <p className="text-dark-secondary text-sm">AI crafts a custom supplement plan, including a grocery list and, with $75/month, six targeted supplements.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <span className="bg-dark-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">3</span>
                    <div>
                      <h4 className="font-semibold text-dark-primary mb-2">Track Progress</h4>
                      <p className="text-dark-secondary text-sm">Monitor improvements and update your personalized supplements 2025 plan as needed.</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Future of Wellness is Here</h2>
              
              <p>Personalized supplements are more than a trend—they're the future. As AI health optimization grows, SupplementScribe ensures affordable, effective wellness for all. Join thousands transforming their health with us.</p>

              <div className="bg-gradient-to-r from-dark-accent/10 to-blue-900/10 border border-dark-accent/20 rounded-xl p-6 my-8">
                <h3 className="text-xl font-semibold text-dark-accent mb-3">Join the Revolution</h3>
                <p>Thousands are already transforming their health with personalized, AI-driven supplement plans. Don't get left behind with generic solutions.</p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">FAQ</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-dark-primary mb-2">How Fast Will I See Results with Personalized Supplements?</h3>
                  <p>Expect improvements in 4–12 weeks, based on health optimization trends.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-dark-primary mb-2">Is This More Expensive Than Generic Supplements?</h3>
                  <p>No—$19.99/month (software) or $75/month (complete) beats wasting $25/month on ineffective options.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-dark-primary mb-2">Can I Share Existing Health Data?</h3>
                  <p>Yes, optionally include bloodwork or genetic insights for deeper personalization.</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Conclusion</h2>
              
              <p>Embrace the future with AI-optimized supplements from SupplementScribe. Start your custom wellness plans today at SupplementScribe.com for $19.99 or $75/month!</p>

              <div className="bg-gradient-to-r from-dark-accent/10 to-blue-900/10 border border-dark-accent/20 rounded-xl p-6 my-8">
                <h3 className="text-lg font-semibold text-dark-primary mb-3">About the Team</h3>
                <p>The SupplementScribe Health Team blends 15+ years of health and AI expertise to deliver personalized, evidence-based solutions.</p>
              </div>

            </div>
          </motion.article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-dark-panel/30">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-dark-primary">Ready to Experience AI-Powered Personalization?</h2>
            <p className="text-xl text-dark-secondary mb-8 max-w-2xl mx-auto">
              Join thousands who've ditched generic supplements for personalized health optimization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <button className="px-8 py-4 bg-dark-accent text-white rounded-lg hover:bg-dark-accent/90 transition-all duration-200 font-medium">
                  Start Your AI Analysis - $19.99/month
                </button>
              </Link>
              <Link href="/how-it-works">
                <button className="px-8 py-4 bg-transparent border border-dark-border text-dark-primary rounded-lg hover:border-dark-accent transition-all duration-200 font-medium">
                  See How It Works
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-2xl font-bold text-dark-primary mb-8 text-center">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/content/dna-optimized-supplements-ai-guide-2025" className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent/50 transition-colors">
              <h3 className="font-semibold text-dark-primary mb-2">DNA-Optimized Supplements: AI Guide 2025</h3>
              <p className="text-dark-secondary text-sm">How AI tailors vitamins to your genes and bloodwork</p>
            </Link>
            <Link href="/content/mthfr-gene-anxiety-founder-journey" className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent/50 transition-colors">
              <h3 className="font-semibold text-dark-primary mb-2">MTHFR Gene & Anxiety: A Founder's Journey</h3>
              <p className="text-dark-secondary text-sm">How nutrient optimization replaced SSRIs naturally</p>
            </Link>
            <Link href="/content" className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent/50 transition-colors">
              <h3 className="font-semibold text-dark-primary mb-2">The Ultimate Guide to Supplement Timing</h3>
              <p className="text-dark-secondary text-sm">Master the art of when to take your supplements</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 