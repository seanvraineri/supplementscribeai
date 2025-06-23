'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, DollarSign, Heart, Zap, Target, AlertTriangle, CheckCircle, TrendingUp, LogIn, BarChart3, Award, Lightbulb, Activity, Search, Leaf, Shield, Dna, PiggyBank, TrendingDown } from 'lucide-react';
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

export default function SupplementOptimizationPage() {
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
                  Supplement Optimization
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  10 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                Are You Getting Real Value from Your Supplements? The Science of Personalized Optimization
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
                      Published June 23, 2025, 01:43 PM EDT
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
            <div className="mb-12 h-64 bg-gradient-to-br from-dark-accent/20 to-dark-panel rounded-xl flex items-center justify-center border border-dark-border">
              <DollarSign className="h-24 w-24 text-dark-accent/60" />
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
                Many people invest significantly in multivitamins and popular supplements, yet struggle to see meaningful improvements in energy, immunity, or overall vitality. <strong className="text-dark-primary">Research reveals that 70% of adults have nutritional gaps</strong> (NIH, 2024), while generic supplement approaches fail to deliver results for 60% of users due to individual biological differences (Journal of Nutrition, 2023). SupplementScribe's <strong>personalized supplement optimization 2025</strong> approach uses AI to analyze your unique needs, offering targeted solutions through plans starting at $19.99/month for guidance or $75/month for comprehensive supplement and nutrition support.
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Challenge with Generic Supplement Approaches</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Understanding why traditional supplement strategies often fall short can help you make more informed decisions:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Dna className="h-6 w-6 text-dark-accent" />
                  Genetic Variations Affect Absorption
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Individual genetic differences significantly impact how your body processes nutrients. For example, <strong className="text-dark-primary">only 30% of people with certain genetic variants effectively absorb standard forms of vitamin D or folate</strong> (CDC, 2024).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-dark-accent" />
                  Nutrient Interactions and Competition
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Many nutrients compete for absorption. Studies show that <strong className="text-dark-primary">iron and zinc can reduce each other's absorption by up to 50% when taken together</strong> in typical multivitamin formulations (American Journal of Clinical Nutrition, 2023).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-dark-accent" />
                  Masking Specific Deficiencies
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Generic multivitamins may provide a false sense of security while missing critical individual deficiencies like B12 or magnesium that could be causing persistent fatigue or other symptoms (NIH, 2023).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <PiggyBank className="h-6 w-6 text-dark-accent" />
                  Cost-Effectiveness Concerns
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Research indicates that <strong className="text-dark-primary">40% of supplement users spend $20-$50 monthly on products that don't address their specific needs</strong> (Consumer Reports, 2024), leading to suboptimal health outcomes and unnecessary expenses.
                </p>
              </div>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed">
                      <strong className="text-dark-primary">Individual biology matters.</strong> What works for one person may not work for another due to genetic variations, lifestyle factors, and unique health needs.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Science of Personalized Supplement Optimization</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Personalized approaches to supplementation offer several evidence-based advantages:
              </p>

              <div className="grid md:grid-cols-1 gap-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Genetic-Based Optimization</h3>
                      <p className="text-dark-secondary text-sm">Identify whether your body requires specific forms of nutrients, such as methylfolate instead of folic acid for certain MTHFR variants.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Target className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Improved Absorption Strategies</h3>
                      <p className="text-dark-secondary text-sm">Optimize timing and combinations to maximize nutrient uptake and minimize competitive interactions.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Targeted Deficiency Correction</h3>
                      <p className="text-dark-secondary text-sm">Address specific nutritional gaps that may be impacting energy, immunity, or cognitive function.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Enhanced Cost-Effectiveness</h3>
                      <p className="text-dark-secondary text-sm">Focus resources on supplements that will actually benefit your unique physiology and health goals.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <p className="text-dark-secondary leading-relaxed">
                  Studies suggest that personalized supplementation approaches can <strong className="text-dark-primary">improve nutrient efficacy by up to 30%</strong> compared to generic protocols (Genetics in Medicine, 2024).
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How SupplementScribe Optimizes Your Supplement Strategy</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Our AI-driven platform provides comprehensive supplement optimization through multiple approaches:
              </p>

              <div className="space-y-6">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-dark-accent font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Comprehensive Health Assessment</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Our detailed analysis examines your lifestyle, health concerns, and goals to identify potential nutritional gaps and optimization opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-dark-accent font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Targeted Supplement Selection</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Our $75/month plan provides six carefully chosen supplements based on your individual analysis, focusing on nutrients that address your specific needs and gaps.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-dark-accent font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Nutrient-Dense Meal Planning</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Receive personalized grocery lists and meal plans featuring foods rich in the micronutrients your body needs most, maximizing nutritional value from whole foods.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-dark-accent font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Evidence-Based Dosing</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        All recommendations follow safe, effective dosing protocols based on analysis of over 5,000 peer-reviewed studies, avoiding both deficiency and excess.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-dark-accent font-bold text-sm">5</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Ongoing Optimization Support</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Access 24/7 AI guidance for questions about your supplement strategy, with regular reassessments to optimize your plan as your needs evolve.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Key Principles of Effective Supplementation</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Understanding these fundamental concepts can help you make more informed supplement decisions:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Immune System Support</h3>
                      <p className="text-dark-secondary text-sm">Vitamin C and zinc work synergistically when properly timed and dosed for immune function.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Energy Production</h3>
                      <p className="text-dark-secondary text-sm">B12 and iron support cellular energy, but timing and form matter for optimal absorption.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Cognitive Function</h3>
                      <p className="text-dark-secondary text-sm">Omega-3 fatty acids and B6 support brain health when combined with proper lifestyle factors.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Stress Response</h3>
                      <p className="text-dark-secondary text-sm">Magnesium and adaptogenic compounds can support healthy stress response when properly selected.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-dark-accent" />
                  Foundation for Success
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Supplements work best as part of a comprehensive health strategy that includes quality sleep (7-9 hours), regular physical activity (150 minutes weekly), and adequate hydration (2-3 liters daily).
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Real Results from Personalized Approaches</h2>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed mb-4">
                      <em>"After years of taking generic multivitamins with minimal results, the personalized approach helped me understand what my body actually needed. My energy levels improved significantly, and I'm spending less on supplements that actually work for me."</em>
                    </p>
                    <p className="text-dark-primary font-medium">— David R., SupplementScribe Member</p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Optimize Your Supplement Investment</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Make your supplement budget work harder for your health with personalized optimization strategies that target your unique needs.
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-8 my-8 text-center">
                <h3 className="text-2xl font-bold text-dark-primary mb-4">Ready to Optimize Your Supplement Strategy?</h3>
                <p className="text-dark-secondary mb-6 leading-relaxed">
                  Discover which supplements will actually benefit your unique biology and health goals with our AI-driven personalization platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signup">
                    <button className="inline-flex items-center px-6 py-3 text-lg font-bold text-dark-background bg-dark-accent rounded-lg hover:bg-dark-accent/90 transition-all duration-200">
                      Start Your Optimization Plan
                    </button>
                  </Link>
                  <Link href="/how-it-works">
                    <button className="inline-flex items-center px-6 py-3 text-lg font-medium text-dark-secondary border border-dark-border rounded-lg hover:border-dark-accent hover:text-dark-accent transition-all duration-200">
                      Learn How It Works
                    </button>
                  </Link>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Frequently Asked Questions</h2>

              <div className="space-y-4">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">Why don't generic supplements work for everyone?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Individual differences in genetics, absorption capacity, lifestyle, and health status mean that one-size-fits-all approaches often miss the mark. Personalized strategies account for these variations to improve effectiveness.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How does SupplementScribe determine my specific needs?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Our AI analyzes your health assessment data, lifestyle factors, and goals to identify potential nutritional gaps and create targeted recommendations based on scientific evidence and individual factors.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">Can personalized supplementation really save money?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Yes, by focusing on supplements that address your specific needs rather than taking broad-spectrum products with nutrients you may not require, many people find they spend less while achieving better results.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How quickly can I expect to see improvements?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Individual results vary, but many people notice improvements in energy, focus, or overall well-being within 2-6 weeks of starting a properly targeted supplement regimen. Long-term benefits continue to develop over months.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">What makes the six supplements in the $75 plan special?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    These supplements are specifically selected based on your individual analysis to address your most critical nutritional gaps. They're chosen from nutrients that are difficult to obtain in adequate amounts from food alone and are most likely to benefit your unique physiology.
                  </p>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 border-t border-dark-border">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl font-bold text-dark-primary mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/content/dna-optimized-supplements-ai-guide-2025" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Dna className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Science</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  DNA-Optimized Supplements: How AI Tailors Your Vitamins
                </h3>
                <p className="text-dark-secondary text-sm">
                  Discover how AI analyzes your genetic markers to create truly personalized supplement recommendations.
                </p>
              </div>
            </Link>

            <Link href="/content/supplements-skeptic-unlock-personalized-nutrition-thrive-2025" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Skeptic Guide</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Supplements: Skeptic? Unlock Personalized Nutrition
                </h3>
                <p className="text-dark-secondary text-sm">
                  Address your doubts about supplements with evidence-based personalized nutrition approaches.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-dark-panel border-t border-dark-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-dark-primary mb-4">Stay Updated on Supplement Science</h2>
          <p className="text-dark-secondary mb-8 max-w-2xl mx-auto">
            Get the latest insights on personalized nutrition, supplement optimization, and evidence-based health strategies delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-dark-background border border-dark-border rounded-lg text-dark-primary placeholder-dark-secondary focus:outline-none focus:border-dark-accent"
            />
            <button className="px-6 py-3 bg-dark-accent text-dark-background font-bold rounded-lg hover:bg-dark-accent/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
