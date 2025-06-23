'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Brain, Heart, Zap, Target, AlertTriangle, CheckCircle, TrendingUp, LogIn, BarChart3, Award, Lightbulb, Activity, Search, Leaf, Shield } from 'lucide-react';
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

export default function MentalHealthMythsPage() {
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
                  Mental Health
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  8 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                Rethinking Mental Health: How Holistic Nutrition Supports Emotional Wellness
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
                      Published June 23, 2025, 01:35 PM EDT
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
                Mental health understanding has evolved significantly beyond the traditional "chemical imbalance" model. <strong className="text-dark-primary">Modern research reveals a complex interplay of genetics, nutrition, lifestyle, and environmental factors</strong> that influence emotional wellness (Business Insider, 2024). While medications can be helpful for many, studies show that 60% of individuals taking SSRIs still experience unresolved symptoms (JAMA, 2023), highlighting the need for comprehensive approaches. SupplementScribe's <strong>holistic mental health supplements 2025</strong> offer personalized nutritional support, with plans starting at $19.99/month for guidance or $75/month for targeted supplements and comprehensive wellness plans.
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Understanding Modern Mental Health Science</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Recent research has expanded our understanding of mental health beyond simple neurotransmitter theories:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-dark-accent" />
                  Nutritional Factors in Mood
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Essential nutrients like magnesium and omega-3 fatty acids play crucial roles in brain function and mood regulation. <strong className="text-dark-primary">Research shows that 40% of mood-related concerns may have nutritional components</strong> (NIH, 2023).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-dark-accent" />
                  Genetic Influences on Mental Health
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Individual genetic variations affect how we process nutrients and neurotransmitters. Studies indicate that <strong className="text-dark-primary">30% of people have genetic variations that impact mood regulation</strong> (Genetics in Medicine, 2024).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Activity className="h-6 w-6 text-dark-accent" />
                  Stress and Lifestyle Impact
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Chronic stress depletes essential nutrients and affects brain chemistry. <strong className="text-dark-primary">50% of adults experience chronic stress that impacts mental wellness</strong> (Stress in America, 2024).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Heart className="h-6 w-6 text-dark-accent" />
                  Gut-Brain Connection
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  The gut microbiome significantly influences mood and cognitive function through the gut-brain axis, with emerging research showing strong connections between digestive health and emotional wellness.
                </p>
              </div>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed">
                      <strong className="text-dark-primary">Mental health is multifaceted and highly individual.</strong> A comprehensive approach that includes proper nutrition, lifestyle factors, and personalized support often yields the best outcomes.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Benefits of Holistic Mental Health Support</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Integrative approaches to mental wellness offer comprehensive benefits:
              </p>

              <div className="grid md:grid-cols-1 gap-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Mood Stability Support</h3>
                      <p className="text-dark-secondary text-sm">Targeted nutrients can help support balanced mood and emotional resilience through proper brain nutrition.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Target className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Personalized Deficiency Correction</h3>
                      <p className="text-dark-secondary text-sm">Address specific nutritional gaps that may be contributing to mood or cognitive concerns.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Brain className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Cognitive Function Enhancement</h3>
                      <p className="text-dark-secondary text-sm">Support mental clarity, focus, and cognitive performance through optimized brain nutrition.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Long-term Wellness Foundation</h3>
                      <p className="text-dark-secondary text-sm">Build sustainable habits and nutritional foundations that support ongoing mental wellness.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <p className="text-dark-secondary leading-relaxed">
                  Research suggests that holistic approaches can reduce mental health challenges by <strong className="text-dark-primary">25% when properly implemented</strong> (Psychological Medicine, 2023).
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How SupplementScribe Supports Mental Wellness</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Our AI-driven platform provides personalized mental wellness support:
              </p>

              <div className="space-y-6">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-dark-accent font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Comprehensive Wellness Assessment</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Our detailed analysis examines lifestyle factors, stress levels, and potential nutritional gaps that may impact mental wellness.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Targeted Nutritional Support</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Our $75/month plan includes six carefully selected supplements that support brain health, mood stability, and cognitive function based on your individual needs.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Brain-Healthy Nutrition Planning</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Receive personalized meal plans and grocery lists featuring foods rich in mood-supporting nutrients like omega-3s, B-vitamins, and magnesium.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Evidence-Based Recommendations</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        All suggestions are backed by analysis of over 5,000 peer-reviewed studies, ensuring safe and effective support for mental wellness.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Ongoing Wellness Support</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Access 24/7 AI guidance for questions about your wellness plan, with regular reassessments to optimize your mental health support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Key Nutrients for Mental Wellness</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Certain nutrients play particularly important roles in supporting mental health and cognitive function:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Brain className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Omega-3 Fatty Acids</h3>
                      <p className="text-dark-secondary text-sm">Essential for brain structure and function, supporting mood stability and cognitive performance.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">B-Complex Vitamins</h3>
                      <p className="text-dark-secondary text-sm">Critical for neurotransmitter production and energy metabolism in the brain.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Magnesium</h3>
                      <p className="text-dark-secondary text-sm">Supports stress response regulation and promotes relaxation and quality sleep.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Vitamin D</h3>
                      <p className="text-dark-secondary text-sm">Influences mood regulation and cognitive function, with deficiency linked to mood concerns.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-dark-accent" />
                  Lifestyle Integration
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Nutritional support works best when combined with healthy lifestyle practices: regular sleep (7-9 hours), physical activity (150 minutes weekly), stress management techniques, and social connection.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Real Stories of Wellness Transformation</h2>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed mb-4">
                      <em>"After struggling with mood swings for years, the personalized nutrition approach helped me understand how my diet was affecting my mental state. The targeted supplements and meal planning made a noticeable difference in my daily well-being."</em>
                    </p>
                    <p className="text-dark-primary font-medium">— Maria L., SupplementScribe Member</p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Start Your Holistic Wellness Journey</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Mental wellness is a journey that benefits from comprehensive, personalized support. Discover how targeted nutrition can complement your overall mental health strategy.
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-8 my-8 text-center">
                <h3 className="text-2xl font-bold text-dark-primary mb-4">Ready to Support Your Mental Wellness?</h3>
                <p className="text-dark-secondary mb-6 leading-relaxed">
                  Join thousands who've discovered the benefits of personalized nutritional support for mental health and cognitive function.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signup">
                    <button className="inline-flex items-center px-6 py-3 text-lg font-bold text-dark-background bg-dark-accent rounded-lg hover:bg-dark-accent/90 transition-all duration-200">
                      Start Your Wellness Plan
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
                  <h3 className="text-lg font-bold text-dark-primary mb-3">Can nutrition really impact mental health?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Yes, research shows strong connections between nutrition and mental wellness. Essential nutrients support neurotransmitter production, brain structure, and stress response systems that directly affect mood and cognitive function.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How does SupplementScribe personalize mental wellness support?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Our AI analyzes your lifestyle, stress levels, dietary patterns, and wellness goals to identify specific nutritional needs that may impact mental health, then provides targeted supplement and nutrition recommendations.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">Is this approach meant to replace professional mental health care?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    No, our nutritional support is designed to complement, not replace, professional mental health care. Always consult with healthcare providers for mental health concerns and continue any prescribed treatments.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How quickly might I notice improvements in mental wellness?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Individual results vary, but many people report improvements in energy, mood stability, and cognitive clarity within 2-6 weeks of consistent nutritional support. Long-term benefits continue to develop over months.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">What makes holistic approaches effective for mental wellness?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Holistic approaches address multiple factors that influence mental health - nutrition, lifestyle, stress management, and individual biological differences - rather than focusing on single solutions, leading to more comprehensive support.
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
            <Link href="/content/mthfr-gene-anxiety-founder-journey" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Personal Story</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  MTHFR Gene & Anxiety: A Founder's Journey
                </h3>
                <p className="text-dark-secondary text-sm">
                  A personal story about discovering genetic factors in anxiety and finding nutritional solutions.
                </p>
              </div>
            </Link>

            <Link href="/content/adhd-nutritional-deficiencies-missing-piece" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Mental Health</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Unlocking the ADHD Puzzle: Nutritional Deficiencies
                </h3>
                <p className="text-dark-secondary text-sm">
                  Explore how nutritional factors may contribute to ADHD symptoms and management strategies.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-dark-panel border-t border-dark-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-dark-primary mb-4">Stay Updated on Mental Wellness Research</h2>
          <p className="text-dark-secondary mb-8 max-w-2xl mx-auto">
            Get the latest insights on holistic mental health, nutritional psychiatry, and evidence-based wellness strategies delivered to your inbox.
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
