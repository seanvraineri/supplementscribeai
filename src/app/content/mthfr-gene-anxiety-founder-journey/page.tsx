'use client'

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Heart, Brain, Zap, Shield, Target, LogIn } from 'lucide-react';
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

export default function MTHFRAnxietyFounderJourneyPage() {
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
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                  Personal Story
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  7 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                MTHFR Gene & Anxiety: How Nutrient Optimization Replaced My SSRIs (A Founder's Journey)
              </h1>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-dark-accent/20 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-dark-accent" />
                  </div>
                  <div>
                    <p className="text-dark-primary font-medium">Sean Raineri, Founder</p>
                    <div className="flex items-center gap-2 text-dark-secondary text-sm">
                      <Calendar className="h-3 w-3" />
                      Published January 28, 2025
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
            <div className="mb-12 h-64 bg-gradient-to-br from-red-500/20 to-pink-900/20 rounded-xl flex items-center justify-center">
              <Heart className="h-24 w-24 text-red-400/60" />
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
                Anxiety can feel debilitating, I know from experience. SSRIs left me numb yet still anxious, a struggle that lasted years. A breakthrough came with a genetic test revealing my C677T MTHFR mutation, disrupting methylation—a process vital for neurotransmitter production and stress regulation. This inspired SupplementScribe, offering $19.99/month software-only or $75/month complete plans with personalized supplements to help others reclaim their health naturally. A 2023 study on MTHFR variants and mental health underscores why nutrient optimization beats generic solutions.
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Hidden Cost of SSRIs: My 3-Year "Zombie Mode" Battle</h2>
              
              <p>Anxiety isn't just nerves—it's a biological alarm. Doctors prescribed SSRIs, but I felt emotionally flat while panic persisted. The turning point? Learning my C677T MTHFR mutation impaired folate activation, critical for serotonin and dopamine. Research suggests MTHFR variants increase anxiety risk by 3x and contribute to a 79% SSRI failure rate due to poor nutrient processing.</p>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 my-8">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-dark-primary mb-2">The Reality of SSRI "Success"</h3>
                    <p className="text-dark-secondary">While doctors consider SSRIs successful if they reduce symptoms by 50%, many users like myself experienced emotional numbing, sexual dysfunction, and persistent anxiety - leading to a cycle of medication adjustments that never addressed the root cause.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Why Your Genes Make SSRIs Ineffective (Natural Solutions Work)</h2>
              
              <p>After ditching SSRIs, I built a supplement stack based on my mutation:</p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <strong>Methylfolate (L-5-MTHF):</strong> 15mg/day to bypass genetic blocks.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <strong>Magnesium Glycinate:</strong> 400mg at bedtime to lower cortisol by 18%.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <strong>Omega-3s:</strong> 1,500mg EPA/DHA to reduce neuroinflammation.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 my-8">
                <h3 className="text-xl font-semibold text-green-400 mb-3">The Results</h3>
                <p><strong>Anxiety dropped from 8/10 to 2/10 in 11 weeks</strong>, fueling academic and social gains. This led me to create SupplementScribe to share this natural anxiety relief.</p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">5 Nutrient Deficiencies Driving Your Anxiety</h2>
              
              <p>MTHFR mutations often cause gaps your doctor misses:</p>

              <div className="space-y-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h4 className="font-semibold text-dark-primary mb-2">1. Methylfolate</h4>
                  <p className="text-dark-secondary text-sm">Blocked by C677T, starving your brain of serotonin (68% of SSRI users deficient).</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h4 className="font-semibold text-dark-primary mb-2">2. Magnesium</h4>
                  <p className="text-dark-secondary text-sm">Low levels impair GABA, worsening fatigue from SSRIs.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h4 className="font-semibold text-dark-primary mb-2">3. Vitamin B6 (P5P)</h4>
                  <p className="text-dark-secondary text-sm">C677T triples needs; deficiency spikes homocysteine, linked to panic.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h4 className="font-semibold text-dark-primary mb-2">4. Zinc</h4>
                  <p className="text-dark-secondary text-sm">Vital for GABA balance; MTHFR carriers lose it 2x faster.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h4 className="font-semibold text-dark-primary mb-2">5. Omega-3s</h4>
                  <p className="text-dark-secondary text-sm">Low EPA/DHA heightens amygdala activity, fueling anxious thoughts.</p>
                </div>
              </div>

              <p>SupplementScribe's 5-minute deep health analysis flags these via bloodwork or symptom data.</p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How SupplementScribe Delivers Precision Health</h2>
              
              <p>Unlike generic advice, our AI-powered platform tailors solutions:</p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="bg-dark-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">1</span>
                    <div>
                      <strong>Analyze Your Data:</strong> Upload bloodwork or complete our 5-minute analysis.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-dark-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">2</span>
                    <div>
                      <strong>Custom Protocol:</strong> Get recommendations like methylfolate or omega-3s, optimized for your budget.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-dark-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">3</span>
                    <div>
                      <strong>Monthly Optimization:</strong> The $75/month plan delivers six targeted supplements; $19.99/month offers insights and a custom grocery list.
                    </div>
                  </li>
                </ol>
              </div>

              <p>Our GPT-4o AI leverages 5,000+ PubMed studies for accuracy.</p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Why We Skip Free Trials (Better for Your Anxiety)</h2>
              
              <p>No gimmicks here—consistency beats placebo. Our $19.99 or $75/month plans cost 1/10th of SSRI co-pays, with transparent, study-backed protocols.</p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">FAQ</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-dark-primary mb-2">How Long Until Nutrient Optimization Eases Anxiety?</h3>
                  <p>Expect relief in 11–12 weeks, per MTHFR research trends.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-dark-primary mb-2">Is This Cheaper Than SSRIs?</h3>
                  <p>Yes—$19.99/month (software) or $75/month (complete) beats $500+ consults and meds.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-dark-primary mb-2">Can I Use Current Supplements?</h3>
                  <p>Yes, our AI integrates them into your personalized health plan.</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Conclusion</h2>
              
              <p>Overcome anxiety naturally with SupplementScribe's personalized supplement plans. Ditch SSRIs and start your MTHFR anxiety relief journey at SupplementScribe.com for $19.99 or $75/month. Your health deserves it!</p>

              <div className="bg-gradient-to-r from-dark-accent/10 to-blue-900/10 border border-dark-accent/20 rounded-xl p-6 my-8">
                <h3 className="text-lg font-semibold text-dark-primary mb-3">About the Founder</h3>
                <p>A former SSRI user turned health advocate, I founded SupplementScribe after transforming my life with nutrient optimization, backed by 3+ years of self-directed research.</p>
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
            <h2 className="text-3xl font-bold mb-6 text-dark-primary">Ready to Try a Natural Approach to Anxiety?</h2>
            <p className="text-xl text-dark-secondary mb-8 max-w-2xl mx-auto">
              Discover your genetic variants and nutrient needs with our personalized health analysis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <button className="px-8 py-4 bg-dark-accent text-white rounded-lg hover:bg-dark-accent/90 transition-all duration-200 font-medium">
                  Start Your Analysis - $19.99/month
                </button>
              </Link>
              <Link href="/how-it-works">
                <button className="px-8 py-4 bg-transparent border border-dark-border text-dark-primary rounded-lg hover:border-dark-accent transition-all duration-200 font-medium">
                  Learn How It Works
                </button>
              </Link>
            </div>
            <p className="text-sm text-dark-secondary mt-4">
              *Not medical advice. Consult healthcare providers before making supplement changes.
            </p>
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
            <Link href="/content" className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent/50 transition-colors">
              <h3 className="font-semibold text-dark-primary mb-2">How Your Gut Microbiome Influences Supplements</h3>
              <p className="text-dark-secondary text-sm">Understanding gut bacteria's role in nutrient absorption</p>
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