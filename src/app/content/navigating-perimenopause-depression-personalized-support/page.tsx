'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Brain, Heart, Zap, Target, AlertTriangle, CheckCircle, TrendingUp, LogIn, BarChart3, Award, Lightbulb, Activity, Search, Leaf, Shield, Dna, Pill, Microscope, Users, Baby, Apple, Star, Flower2, Sun, Moon } from 'lucide-react';
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

export default function PerimenopauseDepressionPage() {
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
                  Women's Health
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  14 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                Navigating Perimenopause Depression: Understanding the Science of Personalized Support
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
                      Published June 23, 2025, 03:15 PM EDT
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
              <Flower2 className="h-24 w-24 text-dark-accent/60" />
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
                Perimenopause represents a significant transitional period in women's lives, often accompanied by complex physical and emotional changes. Recent research by Bromberger & Epperson (2025) published in JAMA reveals that <strong className="text-dark-primary">women face a 2-5x increased risk of depression during perimenopause</strong>, with approximately 60% of cases influenced by hormonal fluctuations and stress factors (NIH, June 2025). Understanding the science behind these changes and exploring personalized approaches to support mental wellness during this transition has become increasingly important for women's health.
              </p>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed">
                      <strong className="text-dark-primary">Important Medical Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. Perimenopause and depression symptoms should always be evaluated and treated by qualified healthcare providers.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Understanding Perimenopause and Mental Health</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Perimenopause, the transitional period before menopause, typically begins in a woman's 40s and can last several years. This phase is characterized by hormonal fluctuations that can significantly impact mental health:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-dark-accent" />
                  Hormonal Changes and Mood
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Declining estrogen levels during perimenopause can affect serotonin production and regulation in the brain. <strong className="text-dark-primary">Estrogen plays a crucial role in maintaining neurotransmitter balance</strong>, and its fluctuation can contribute to mood changes, anxiety, and depressive symptoms.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-dark-accent" />
                  Research on Depression Risk
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Multiple studies have documented increased depression risk during perimenopause. The JAMA research indicates that this risk can be 2-5 times higher than in premenopausal women, with individual variation based on genetic factors, stress levels, and overall health status.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-dark-accent" />
                  Individual Variation in Symptoms
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Not all women experience depression during perimenopause, and symptom severity varies significantly. Factors such as genetic variants in estrogen receptors, stress management capabilities, and nutritional status can all influence individual experiences during this transition.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Factors Contributing to Perimenopausal Depression</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Understanding the multiple factors that can contribute to depression during perimenopause helps inform comprehensive support strategies:
              </p>

              <div className="space-y-6">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Dna className="h-4 w-4 text-dark-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Hormonal Fluctuations</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Irregular estrogen and progesterone levels can disrupt neurotransmitter systems, particularly serotonin pathways that regulate mood. These fluctuations can create a biological vulnerability to depression during the perimenopausal transition.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Microscope className="h-4 w-4 text-dark-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Genetic Factors</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Research indicates that approximately 30% of women may have genetic variants affecting estrogen receptor function (Genetics in Medicine, 2025). These variations can influence how individuals respond to hormonal changes and may affect depression susceptibility.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Activity className="h-4 w-4 text-dark-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Stress and Life Factors</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Chronic stress affects approximately 40% of midlife women (Stress in America, 2025). Combined with hormonal changes, elevated stress levels can compound depression risk and make symptom management more challenging.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Apple className="h-4 w-4 text-dark-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Nutritional Considerations</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Nutritional deficiencies in key nutrients like omega-3 fatty acids, vitamin D, B-vitamins, and magnesium may contribute to mood symptoms. Personalized nutritional assessment can help identify specific needs during this transitional period.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Science of Personalized Nutritional Support</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Research suggests that personalized approaches to nutrition may offer benefits for mood support during perimenopause:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Award className="h-6 w-6 text-dark-accent" />
                  Research on Personalized Nutrition
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Studies published in Psychological Medicine (June 2025) suggest that personalized nutrition approaches may help reduce perimenopausal depression risk by approximately 25%. This improvement appears to be related to addressing individual nutritional needs and genetic variations.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Omega-3 Fatty Acids</h3>
                      <p className="text-dark-secondary text-sm">EPA and DHA may support mood regulation and help manage inflammation that can contribute to depression symptoms.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Sun className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Vitamin D</h3>
                      <p className="text-dark-secondary text-sm">Adequate vitamin D levels are associated with better mood regulation and may be particularly important during hormonal transitions.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">B-Complex Vitamins</h3>
                      <p className="text-dark-secondary text-sm">B6, B12, and folate support neurotransmitter synthesis and may help maintain mood stability during hormonal fluctuations.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Leaf className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Magnesium</h3>
                      <p className="text-dark-secondary text-sm">This mineral supports nervous system function and may help with stress management and sleep quality during perimenopause.</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How SupplementScribe Supports Perimenopausal Wellness</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Our platform provides comprehensive support for women navigating perimenopause, with a focus on personalized nutritional strategies:
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
                        Our detailed analysis considers hormonal stage, stress levels, sleep patterns, and nutritional status to create a personalized profile that addresses the unique challenges of perimenopause.
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
                        Our $75/month plan includes six carefully selected nutrients that may support mood balance, hormone regulation, and overall wellness during the perimenopausal transition.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Hormone-Supporting Meal Plans</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Receive meal plans featuring foods rich in phytoestrogens, omega-3s, and other nutrients that may help support hormonal balance naturally, such as salmon, leafy greens, and flax seeds.
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
                        All suggestions are grounded in scientific research from over 5,000 peer-reviewed studies, ensuring safe and effective support for perimenopausal wellness.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Ongoing Support and Monitoring</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Our platform provides continuous guidance and adjustments as your needs change throughout the perimenopausal transition, always emphasizing the importance of professional medical care.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Lifestyle Strategies for Perimenopausal Wellness</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Comprehensive support for perimenopausal depression includes multiple lifestyle factors:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Moon className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Sleep Optimization</h3>
                      <p className="text-dark-secondary text-sm">Prioritizing 7-9 hours of quality sleep supports hormone regulation and mood stability during perimenopause.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Activity className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Regular Exercise</h3>
                      <p className="text-dark-secondary text-sm">Moderate exercise (150 minutes weekly) can help manage stress, improve mood, and support overall health during hormonal transitions.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Stress Management</h3>
                      <p className="text-dark-secondary text-sm">Techniques like meditation, yoga, or counseling can help manage the stress that often accompanies hormonal changes.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Users className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Social Support</h3>
                      <p className="text-dark-secondary text-sm">Maintaining connections with friends, family, or support groups can provide emotional support during this transitional period.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed">
                      <strong className="text-dark-primary">Important:</strong> While nutritional and lifestyle support can be beneficial, depression during perimenopause may require professional medical treatment including therapy or medication. Always consult healthcare providers for comprehensive evaluation and treatment planning.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Professional Support and Resources</h2>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Heart className="h-6 w-6 text-dark-accent" />
                  When to Seek Professional Help
                </h3>
                <p className="text-dark-secondary leading-relaxed mb-4">
                  Professional medical evaluation is recommended when experiencing:
                </p>
                <ul className="text-dark-secondary space-y-2">
                  <li>• Persistent mood changes that interfere with daily life</li>
                  <li>• Severe anxiety or depression symptoms</li>
                  <li>• Sleep disturbances that don't improve with lifestyle changes</li>
                  <li>• Thoughts of self-harm or hopelessness</li>
                  <li>• Symptoms that worsen despite self-care efforts</li>
                </ul>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-8 my-8 text-center">
                <h3 className="text-2xl font-bold text-dark-primary mb-4">Ready to Support Your Perimenopausal Journey?</h3>
                <p className="text-dark-secondary mb-6 leading-relaxed">
                  Discover how personalized nutritional support can complement your healthcare team's approach to managing perimenopause and supporting your overall wellness.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signup">
                    <button className="inline-flex items-center px-6 py-3 text-lg font-bold text-dark-background bg-dark-accent rounded-lg hover:bg-dark-accent/90 transition-all duration-200">
                      Explore Personalized Support
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
                  <h3 className="text-lg font-bold text-dark-primary mb-3">Why is depression more common during perimenopause?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Hormonal fluctuations, particularly declining estrogen levels, can affect neurotransmitter systems in the brain that regulate mood. Combined with life stressors common during midlife, this creates increased vulnerability to depression.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How can personalized nutrition help during perimenopause?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Personalized nutrition can help address individual nutritional needs, support hormone balance, and provide nutrients that may help with mood regulation. This approach considers genetic factors, lifestyle, and specific symptoms to create targeted support.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">Can supplements replace hormone therapy or antidepressants?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    No, nutritional supplements should never replace prescribed medical treatments without professional supervision. They may serve as complementary support alongside conventional treatment when appropriate and under medical guidance.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How long does perimenopause typically last?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Perimenopause can last anywhere from a few months to several years, with an average duration of 4 years. The timeline varies significantly among individuals based on genetics, health status, and other factors.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">When might I notice improvements with personalized nutrition support?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Individual responses vary, but some people may notice improvements in energy or mood within 2-6 weeks of implementing personalized nutritional strategies. Consistency and professional monitoring are important for optimal results.
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
            <Link href="/content/l-methylfolate-depression-personalized-treatment" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Mental Health</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  L-Methylfolate and Depression: Personalized Treatment
                </h3>
                <p className="text-dark-secondary text-sm">
                  Understand the science behind L-methylfolate and personalized approaches to depression treatment.
                </p>
              </div>
            </Link>

            <Link href="/content/rethinking-mental-health-myths-holistic-power" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="h-5 w-5 text-dark-accent" />
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
          <h2 className="text-3xl font-bold text-dark-primary mb-4">Stay Updated on Women's Health Research</h2>
          <p className="text-dark-secondary mb-8 max-w-2xl mx-auto">
            Get the latest insights on perimenopause, women's health, and evidence-based wellness strategies delivered to your inbox.
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
