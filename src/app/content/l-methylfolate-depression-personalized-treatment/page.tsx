'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Brain, Heart, Zap, Target, AlertTriangle, CheckCircle, TrendingUp, LogIn, BarChart3, Award, Lightbulb, Activity, Search, Leaf, Shield, Dna, Pill, Microscope } from 'lucide-react';
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

export default function LMethylfolateDepressionPage() {
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
                  Mental Health Research
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  12 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                L-Methylfolate and Depression: Understanding the Science of Personalized Treatment
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
                      Published June 23, 2025, 02:45 PM EDT
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
                Depression treatment has evolved significantly with new research revealing the complex interplay between genetics, inflammation, and nutritional factors. Recent studies by Dr. Matthew Macaluso at the University of Alabama (2025) highlight that <strong className="text-dark-primary">60% of treatment-resistant depression cases are associated with obesity and inflammation</strong> (JAMA, June 2025), suggesting that traditional approaches may not address all underlying factors. SupplementScribe's <strong>L-methylfolate depression treatment 2025</strong> approach integrates personalized nutritional support with comprehensive mental health strategies, offering plans starting at $19.99/month for guidance or $75/month for targeted supplement and nutrition support.
              </p>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed">
                      <strong className="text-dark-primary">Important Medical Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. Always consult with healthcare providers before making changes to depression treatment, and never discontinue prescribed medications without medical supervision.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Understanding Treatment-Resistant Depression</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Modern research has identified several factors that may contribute to treatment resistance in depression:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-dark-accent" />
                  Obesity and Metabolic Factors
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Research indicates that obesity may increase depression risk by approximately 55% (NIH, 2025). <strong className="text-dark-primary">With 74% of Americans affected by overweight or obesity</strong> (CDC, 2025), metabolic factors may play a significant role in treatment response.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Microscope className="h-6 w-6 text-dark-accent" />
                  Inflammation and Depression
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Chronic inflammation, measured by elevated C-reactive protein (CRP) levels, affects approximately 40% of individuals with depression (Stress in America, 2025). <strong className="text-dark-primary">Inflammatory processes may interfere with serotonin function and treatment response</strong> (JAMA, 2025).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Dna className="h-6 w-6 text-dark-accent" />
                  Genetic Variations in Folate Metabolism
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  MTHFR gene variants affect folate metabolism in a significant portion of the population. <strong className="text-dark-primary">These genetic differences may impact the brain's ability to produce adequate neurotransmitters</strong>, potentially affecting treatment response (Genetics in Medicine, 2025).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-dark-accent" />
                  Nutritional Deficiencies
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Deficiencies in key nutrients like folate, B12, vitamin D, and omega-3 fatty acids may contribute to depression symptoms and treatment resistance. Personalized assessment can help identify specific nutritional gaps.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Science of L-Methylfolate in Depression</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                L-methylfolate represents an active form of folate that can cross the blood-brain barrier and support neurotransmitter production:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-dark-accent" />
                  Neurotransmitter Support
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  L-methylfolate serves as a cofactor in the production of serotonin, dopamine, and norepinephrine. Unlike folic acid, L-methylfolate doesn't require conversion and can be utilized directly by the brain.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Award className="h-6 w-6 text-dark-accent" />
                  Clinical Research Evidence
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Clinical trials have shown promising results. <strong className="text-dark-primary">Research by Dr. Macaluso (2025) demonstrated that L-methylfolate (15mg/day) increased response rates to 32.3% compared to 14.6% with standard treatment alone</strong>, with significant improvements in depression scores (HAM-D, JAMA, 2025).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-dark-accent" />
                  Safety and Tolerability
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  L-methylfolate is generally well-tolerated and can be used alongside conventional antidepressants. However, dosing and timing should always be determined in consultation with healthcare providers.
                </p>
              </div>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <p className="text-dark-secondary leading-relaxed">
                  <strong className="text-dark-primary">Important:</strong> L-methylfolate is considered a medical food and should be used under physician supervision, particularly when combined with other depression treatments.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How SupplementScribe Supports Mental Health Nutrition</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Our platform provides comprehensive support for mental health nutrition as part of a holistic wellness approach:
              </p>

              <div className="space-y-6">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-dark-accent font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Comprehensive Mental Health Assessment</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Our analysis examines lifestyle factors, stress levels, and nutritional patterns that may impact mental health, while always recommending professional medical evaluation for depression concerns.
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
                        Our $75/month plan includes six carefully selected supplements that may support mental health, including nutrients like L-methylfolate when appropriate, based on individual assessment.
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
                        Receive meal plans featuring foods rich in mood-supporting nutrients like folate-rich leafy greens, omega-3 rich fish, and other brain-healthy options.
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
                        All suggestions are grounded in scientific research from over 5,000 peer-reviewed studies, ensuring safe and effective support for mental wellness.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Complementary Wellness Support</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Our platform provides guidance on lifestyle factors that support mental health, while always emphasizing the importance of professional medical care for depression.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Key Nutrients for Mental Health Support</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Research has identified several nutrients that may play important roles in mental health:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Pill className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">L-Methylfolate</h3>
                      <p className="text-dark-secondary text-sm">Active form of folate that supports neurotransmitter production and may enhance treatment response.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">B-Complex Vitamins</h3>
                      <p className="text-dark-secondary text-sm">Essential for neurotransmitter synthesis and energy metabolism in the brain.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Omega-3 Fatty Acids</h3>
                      <p className="text-dark-secondary text-sm">Support brain structure and may help reduce inflammation associated with depression.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Zinc & Magnesium</h3>
                      <p className="text-dark-secondary text-sm">Important minerals for neurotransmitter function and stress response regulation.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-dark-accent" />
                  Comprehensive Mental Health Approach
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Mental health support is most effective when combining proper nutrition with professional medical care, therapy, regular exercise, quality sleep, stress management, and social support.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Professional Guidance and Safety</h2>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed mb-4">
                      <strong className="text-dark-primary">Critical Safety Information:</strong> Depression is a serious medical condition that requires professional treatment. L-methylfolate and other nutritional supplements should only be used as part of a comprehensive treatment plan under medical supervision.
                    </p>
                    <ul className="text-dark-secondary text-sm space-y-2">
                      <li>• Always consult healthcare providers before starting new supplements</li>
                      <li>• Never discontinue prescribed medications without medical guidance</li>
                      <li>• Seek immediate help if experiencing suicidal thoughts</li>
                      <li>• Regular monitoring is essential when combining treatments</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Supporting Your Mental Health Journey</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Mental health is complex and highly individual. Nutritional support can be a valuable component of comprehensive care when used appropriately.
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-8 my-8 text-center">
                <h3 className="text-2xl font-bold text-dark-primary mb-4">Interested in Nutritional Mental Health Support?</h3>
                <p className="text-dark-secondary mb-6 leading-relaxed">
                  Explore how personalized nutrition might complement your mental health care plan with professional guidance and evidence-based approaches.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signup">
                    <button className="inline-flex items-center px-6 py-3 text-lg font-bold text-dark-background bg-dark-accent rounded-lg hover:bg-dark-accent/90 transition-all duration-200">
                      Explore Personalized Nutrition
                    </button>
                  </Link>
                  <Link href="/how-it-works">
                    <button className="inline-flex items-center px-6 py-3 text-lg font-medium text-dark-secondary border border-dark-border rounded-lg hover:border-dark-accent hover:text-dark-accent transition-all duration-200">
                      Learn Our Approach
                    </button>
                  </Link>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Frequently Asked Questions</h2>

              <div className="space-y-4">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">Is L-methylfolate safe to take with antidepressants?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    L-methylfolate is generally considered safe when used under medical supervision, but interactions and optimal dosing should always be determined by healthcare providers familiar with your complete medical history.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How does SupplementScribe approach mental health nutrition?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    We provide educational information and personalized nutritional guidance that may support mental wellness, always emphasizing the importance of professional medical care for depression and other mental health conditions.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">Can nutritional supplements replace antidepressant medication?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    No, nutritional supplements should never replace prescribed medications without medical supervision. They may serve as complementary support alongside conventional treatment when appropriate.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How quickly might nutritional support show benefits?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Individual responses vary significantly. Some people may notice improvements in energy or mood within 2-6 weeks, while others may require longer periods or different approaches. Professional monitoring is essential.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">Who should consider L-methylfolate supplementation?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    L-methylfolate may be considered for individuals with depression who have folate deficiency, certain genetic variants affecting folate metabolism, or treatment-resistant cases, but this determination should always be made by qualified healthcare providers.
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

            <Link href="/content/rethinking-mental-health-myths-holistic-power" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Mental Health</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Rethinking Mental Health: Holistic Nutrition Approaches
                </h3>
                <p className="text-dark-secondary text-sm">
                  Explore how holistic nutrition can support emotional wellness and mental health.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-dark-panel border-t border-dark-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-dark-primary mb-4">Stay Updated on Mental Health Research</h2>
          <p className="text-dark-secondary mb-8 max-w-2xl mx-auto">
            Get the latest insights on nutritional psychiatry, mental health research, and evidence-based wellness strategies delivered to your inbox.
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
