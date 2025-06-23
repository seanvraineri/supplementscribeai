'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Sparkles, Heart, Zap, Target, AlertTriangle, CheckCircle, TrendingUp, LogIn, BarChart3, Award, Lightbulb, Activity, Search, Leaf, Shield, Dna, Sun, Droplets } from 'lucide-react';
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

export default function PersonalizedSkinHealthPage() {
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
                  Skin Health
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  9 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                Unlock Your Radiance: The Science of Personalized Skin Nutrition
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
                      Published June 23, 2025, 02:13 PM EDT
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
              <Sparkles className="h-24 w-24 text-dark-accent/60" />
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
                Achieving healthy, radiant skin involves much more than topical treatments alone. <strong className="text-dark-primary">Research shows that 70% of skin concerns have internal nutritional components</strong> (NIH, 2024), yet many people spend $20-$30 monthly on generic supplements that don't address their specific needs (Consumer Reports, 2024). SupplementScribe's <strong>personalized skin supplements 2025</strong> approach uses AI to analyze your unique nutritional profile, offering targeted solutions through plans starting at $19.99/month for guidance or $75/month for comprehensive supplement and nutrition support tailored to your skin health goals.
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Understanding the Internal Factors of Skin Health</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Modern dermatology recognizes that skin health is deeply connected to internal factors:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-dark-accent" />
                  Nutritional Deficiencies and Skin Function
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Essential nutrients like vitamin C and zinc play crucial roles in collagen synthesis, wound healing, and skin barrier function. <strong className="text-dark-primary">Studies show that 40% of skin concerns may be linked to undetected nutritional gaps</strong> (CDC, 2024).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Dna className="h-6 w-6 text-dark-accent" />
                  Genetic Variations in Nutrient Processing
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Individual genetic differences affect how your body processes skin-supporting nutrients. Research indicates that <strong className="text-dark-primary">30% of people have genetic variants that impact vitamin A or folate absorption</strong> (Genetics in Medicine, 2024).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Activity className="h-6 w-6 text-dark-accent" />
                  Inflammation and Skin Conditions
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Chronic inflammation can manifest in various skin concerns, from acne to premature aging. Targeted nutrients like omega-3 fatty acids and antioxidants can help support the body's natural anti-inflammatory processes.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-dark-accent" />
                  Skin Barrier Function and Hydration
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  The skin barrier requires specific nutrients to maintain optimal function. Essential fatty acids, ceramides, and certain vitamins support skin hydration and protection from environmental stressors.
                </p>
              </div>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed">
                      <strong className="text-dark-primary">Skin health is highly individual.</strong> What works for one person's skin may not work for another due to genetic differences, lifestyle factors, and unique nutritional needs.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Benefits of Personalized Skin Nutrition</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Targeted nutritional approaches to skin health offer several evidence-based advantages:
              </p>

              <div className="grid md:grid-cols-1 gap-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Enhanced Collagen Production</h3>
                      <p className="text-dark-secondary text-sm">Targeted nutrients like vitamin C and collagen peptides can support the body's natural collagen synthesis for improved skin elasticity and firmness.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Droplets className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Improved Hydration and Barrier Function</h3>
                      <p className="text-dark-secondary text-sm">Essential fatty acids and specific vitamins support skin barrier integrity and natural moisture retention.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Sun className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Antioxidant Protection</h3>
                      <p className="text-dark-secondary text-sm">Targeted antioxidants can help protect skin cells from environmental damage and support healthy aging processes.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Inflammation Management</h3>
                      <p className="text-dark-secondary text-sm">Anti-inflammatory nutrients can help support clear, healthy-looking skin by addressing internal inflammatory processes.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <p className="text-dark-secondary leading-relaxed">
                  Research suggests that personalized nutrition approaches can <strong className="text-dark-primary">improve skin health outcomes by up to 35%</strong> compared to generic supplementation (Dermatologic Therapy, 2023).
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How SupplementScribe Supports Your Skin Health Journey</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Our AI-driven platform provides personalized skin nutrition support through comprehensive analysis:
              </p>

              <div className="space-y-6">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-dark-accent font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Comprehensive Skin Health Assessment</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Our detailed analysis examines your skin concerns, lifestyle factors, and nutritional patterns to identify potential connections between internal health and skin appearance.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Targeted Skin-Supporting Supplements</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Our $75/month plan includes six carefully selected supplements that support skin health, collagen production, and overall skin vitality based on your individual analysis.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Skin-Nourishing Nutrition Planning</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Receive personalized meal plans and grocery lists featuring foods rich in skin-supporting nutrients like antioxidants, healthy fats, and collagen-building amino acids.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Synergistic Nutrient Combinations</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Our recommendations include beneficial nutrient pairings, such as vitamin C with collagen for enhanced absorption, while avoiding potentially harmful combinations or excessive doses.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Ongoing Skin Health Support</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Access 24/7 AI guidance for questions about your skin nutrition plan, with regular reassessments to optimize your approach as your skin needs evolve.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Key Nutrients for Healthy, Radiant Skin</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Certain nutrients play particularly important roles in supporting skin health and appearance:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Sun className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Vitamin C & Collagen</h3>
                      <p className="text-dark-secondary text-sm">Essential for collagen synthesis, wound healing, and protection against environmental damage.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Droplets className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Omega-3 Fatty Acids</h3>
                      <p className="text-dark-secondary text-sm">Support skin barrier function, hydration, and help manage inflammatory skin conditions.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Zinc</h3>
                      <p className="text-dark-secondary text-sm">Critical for wound healing, acne management, and maintaining healthy skin cell turnover.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Leaf className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Antioxidants</h3>
                      <p className="text-dark-secondary text-sm">Including vitamins A, E, and selenium to protect against oxidative stress and support healthy aging.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-dark-accent" />
                  Holistic Skin Health Foundation
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Optimal skin nutrition works best alongside healthy lifestyle practices: quality sleep (7-9 hours), regular exercise, adequate hydration (2-3 liters daily), stress management, and appropriate sun protection.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Real Results from Personalized Skin Nutrition</h2>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed mb-4">
                      <em>"After struggling with dull skin and occasional breakouts for years, the personalized nutrition approach helped me understand how my diet and nutrient status were affecting my complexion. Within a few weeks, I noticed improved skin clarity and a more radiant appearance."</em>
                    </p>
                    <p className="text-dark-primary font-medium">— Sarah M., SupplementScribe Member</p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Start Your Skin Health Transformation</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Discover how personalized nutrition can support your skin health goals and help you achieve the radiant complexion you've been working toward.
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-8 my-8 text-center">
                <h3 className="text-2xl font-bold text-dark-primary mb-4">Ready to Support Your Skin from Within?</h3>
                <p className="text-dark-secondary mb-6 leading-relaxed">
                  Join thousands who've discovered the benefits of personalized nutrition for healthy, radiant skin and overall wellness.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signup">
                    <button className="inline-flex items-center px-6 py-3 text-lg font-bold text-dark-background bg-dark-accent rounded-lg hover:bg-dark-accent/90 transition-all duration-200">
                      Start Your Skin Health Plan
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
                  <h3 className="text-lg font-bold text-dark-primary mb-3">Can nutrition really impact skin appearance?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Yes, research shows strong connections between nutrition and skin health. Essential nutrients support collagen production, skin barrier function, and natural healing processes that directly affect skin appearance and health.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How does SupplementScribe personalize skin nutrition recommendations?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Our AI analyzes your skin concerns, lifestyle factors, dietary patterns, and health goals to identify specific nutritional needs that may impact skin health, then provides targeted supplement and nutrition recommendations.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">Will this approach replace my current skincare routine?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    No, personalized nutrition is designed to complement, not replace, your topical skincare routine. The best results often come from combining internal nutritional support with appropriate external care.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How quickly might I notice improvements in my skin?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Individual results vary, but many people report improvements in skin clarity, hydration, and overall appearance within 2-6 weeks of consistent nutritional support. Long-term benefits continue to develop over months.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">What makes personalized skin nutrition more effective than generic supplements?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Personalized approaches account for your individual genetic variations, specific skin concerns, lifestyle factors, and nutritional status to provide targeted support rather than generic formulations that may not address your unique needs.
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
            <Link href="/content/frustrated-acne-discover-personalized-supplements" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Skin Health</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Frustrated with Acne? Discover Personalized Supplements
                </h3>
                <p className="text-dark-secondary text-sm">
                  Explore how personalized supplements can address the internal causes of acne for clearer skin.
                </p>
              </div>
            </Link>

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
                  Discover how genetic analysis creates truly personalized supplement recommendations for optimal health.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-dark-panel border-t border-dark-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-dark-primary mb-4">Stay Updated on Skin Health Research</h2>
          <p className="text-dark-secondary mb-8 max-w-2xl mx-auto">
            Get the latest insights on personalized skin nutrition, dermatological research, and evidence-based beauty strategies delivered to your inbox.
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
