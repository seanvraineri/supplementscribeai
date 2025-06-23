'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Brain, Zap, Target, AlertCircle, CheckCircle, Dna, TrendingUp, LogIn } from 'lucide-react';
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

export default function ADHDNutritionalDeficienciesPage() {
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
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                  Mental Health
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  6 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                Unlocking the ADHD Puzzle: Could Nutritional Deficiencies Be the Missing Piece?
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
            <div className="mb-12 h-64 bg-gradient-to-br from-purple-500/20 to-blue-900/20 rounded-xl flex items-center justify-center">
              <Brain className="h-24 w-24 text-purple-400/60" />
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
                ADHD affects millions, challenging focus, emotional regulation, and productivity. While brain chemistry and environment get attention, nutritional deficiencies and genetic factors may hold the key to better management. At SupplementScribe, our $19.99/month software-only or $75/month complete plans with personalized ADHD supplements 2025 use AI to tailor solutions, helping you unlock focus and stability naturally.
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Silent Role of Nutrition in ADHD</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Your brain needs specific nutrients to thrive. Common deficiencies in ADHD include:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Omega-3 Fatty Acids:</strong> Low levels link to poor focus, hyperactivity, and mood swings.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Iron:</strong> Vital for dopamine production, often deficient in ADHD individuals.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Magnesium:</strong> Calms the nervous system; lack can cause irritability.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Zinc:</strong> Supports dopamine; low levels correlate with ADHD severity.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 my-8">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-dark-secondary">
                    Even a "healthy" diet may not suffice if your body struggles to absorb these due to genetic or lifestyle factors.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Are Genetics Adding to the Challenge?</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Genetic variations can affect nutrient processing and brain chemicals:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Dna className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>MTHFR:</strong> Impacts folate use, crucial for neurotransmitter health.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Dna className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>DRD4:</strong> Variants influence dopamine signaling, affecting focus.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Dna className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>COMT:</strong> Alters dopamine breakdown, potentially worsening symptoms.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 my-8">
                <p className="text-dark-secondary">
                  If standard approaches fail, these genetic insights might explain why.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Can Personalized ADHD Supplements Help?</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Targeted nutrition addresses deficiencies and genetic predispositions. Effective options include:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Omega-3 Fish Oil:</strong> For brain health.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Magnesium:</strong> To ease restlessness.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Methylated B Vitamins:</strong> For potential MTHFR support.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 my-8">
                <p className="text-dark-secondary leading-relaxed">
                  But generic supplements often miss the mark. SupplementScribe's AI ADHD management uses your 5-minute deep health analysis to pinpoint needs, avoiding costly guesswork.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Fix Your ADHD with the Right Data</h2>
              
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 my-8">
                <p className="text-dark-secondary leading-relaxed mb-4">
                  Knowing your specific nutritional gaps can transform ADHD management. Our platform analyzes your health inputs—symptoms, lifestyle, and optional genetic data—to craft a tailored plan.
                </p>
                <p className="text-dark-secondary leading-relaxed">
                  The $75/month option delivers six monthly supplement packs, while $19.99/month provides a custom grocery list and insights.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 my-8">
                <h2 className="text-2xl font-bold text-dark-primary mb-4">Why Settle for Guesswork?</h2>
                <p className="text-dark-secondary leading-relaxed">
                  ADHD is unique to you. Generic solutions fall short, but personalized ADHD supplements 2025 offer clarity and results. Take control with SupplementScribe.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">FAQ</h2>
              
              <div className="space-y-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">How Soon Can I See ADHD Improvement?</h3>
                  <p className="text-dark-secondary text-sm">Results may appear in 4–12 weeks with consistent use, per nutrition trends.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Is This More Affordable Than Traditional Treatments?</h3>
                  <p className="text-dark-secondary text-sm">Yes—$19.99/month (software) or $75/month (complete) beats costly meds or consults.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Can I Add Genetic Insights?</h3>
                  <p className="text-dark-secondary text-sm">Yes, optionally enhance your plan with genetic data if available.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6 my-8">
                <h2 className="text-2xl font-bold text-dark-primary mb-4">Conclusion</h2>
                <p className="text-dark-secondary leading-relaxed">
                  Unlock your ADHD nutrition solutions with SupplementScribe. Start your AI ADHD management journey at SupplementScribe.com for $19.99 or $75/month today!
                </p>
              </div>

            </div>
          </motion.article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your ADHD Management?</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Stop guessing with generic supplements. Get personalized ADHD nutrition solutions tailored to your unique brain chemistry and genetic profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Start ADHD Analysis
              </Link>
              <Link 
                href="/science"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
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
                href="/content/mthfr-gene-anxiety-founder-journey"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">MTHFR & Anxiety</h4>
                <p className="text-dark-secondary text-sm">A Founder's Journey from SSRIs to Nutrient Optimization</p>
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
                <p className="text-dark-secondary text-sm">How AI is Breaking Barriers to Personalized Wellness</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 