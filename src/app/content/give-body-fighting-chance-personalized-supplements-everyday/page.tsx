'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Activity, Brain, Zap, Target, Shield, CheckCircle, TrendingUp, LogIn, BarChart3, AlertTriangle, Award, Lightbulb, Heart, Leaf } from 'lucide-react';
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

export default function DailyWellnessPage() {
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
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  Daily Wellness
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  7 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                Give Your Body a Fighting Chance: The Power of Personalized Supplements in Everyday Life
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
                      Published June 23, 2025, 01:07 PM EDT
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
            <div className="mb-12 h-64 bg-gradient-to-br from-blue-500/20 to-indigo-900/20 rounded-xl flex items-center justify-center">
              <Activity className="h-24 w-24 text-blue-400/60" />
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
                In today's relentless pace, our bodies face stress, environmental toxins, processed diets, and sleep deprivation, leaving many feeling drained. A balanced diet is foundational, but modern challenges—like <strong>soil nutrient depletion reducing food quality by 20–30% over 50 years</strong> (USDA, 2023)—make it hard to meet all nutritional needs. <strong>Personalized supplements 2025</strong> from SupplementScribe, starting at $19.99/month (software-only) or $75/month (with six custom packs), offer a targeted solution. This guide explores how supplementation bridges gaps, boosts resilience, and enhances daily vitality, backed by science.
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Modern Nutrient Challenge</h2>
              
              <div className="grid md:grid-cols-1 gap-6 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-400" />
                    Dietary Gaps
                  </h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Even healthy eaters may miss <strong className="text-dark-primary">10–20% of key nutrients</strong> (e.g., magnesium, vitamin D) due to food processing and bioavailability issues (American Journal of Clinical Nutrition, 2024).
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-green-400" />
                    Immune Support
                  </h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Vitamin C (75–90mg/day), vitamin D (600–800 IU), and zinc (8–11mg/day) bolster immunity, with <strong className="text-dark-primary">35% of adults deficient in at least one</strong> (CDC, 2024).
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                    <Zap className="h-6 w-6 text-orange-400" />
                    Energy Deficits
                  </h3>
                  <p className="text-dark-secondary leading-relaxed">
                    B vitamins (e.g., B12 at 2.4µg/day) and iron (8–18mg/day) drive energy production, yet <strong className="text-dark-primary">fatigue affects 20–30% of people</strong> due to suboptimal levels.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                    <Brain className="h-6 w-6 text-purple-400" />
                    Cognitive Health
                  </h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Omega-3s (1,000–2,000mg/day) and B6 (1.3–2mg/day) support brain function, with <strong className="text-dark-primary">15% of adults reporting poor focus</strong> (NIH, 2023).
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                    <Heart className="h-6 w-6 text-red-400" />
                    Stress Resilience
                  </h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Adaptogens like ashwagandha (300–600mg/day) and magnesium (300–400mg/day) reduce cortisol, aiding <strong className="text-dark-primary">40% who face chronic stress</strong> (Stress in America, 2024).
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6 my-8">
                <p className="text-dark-secondary leading-relaxed">
                  <strong className="text-dark-primary">Without tailored support, these gaps can undermine health</strong>, making personalization essential.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Why Generic Supplements Fall Short</h2>
              
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <BarChart3 className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed">
                      Over-the-counter options often use broad formulas, ignoring individual factors like metabolism or lifestyle. A 2022 study found <strong className="text-dark-primary">50% of users experienced no significant benefit</strong>, citing mismatched nutrient profiles. <strong>Personalized supplements 2025</strong> address this by adapting to your unique needs.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How SupplementScribe Empowers Your Daily Health</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                SupplementScribe's <strong>AI daily nutrition platform</strong> transforms supplementation:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-400" />
                  Custom Health Mapping
                </h3>
                <p className="text-dark-secondary">
                  Our 5-minute deep health analysis assesses symptoms, diet, exercise, and optional health data (e.g., bloodwork), aligning with personalized nutrition guidelines.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-purple-400" />
                  Precision Dosing
                </h3>
                <p className="text-dark-secondary">
                  Recommends optimal levels—e.g., 15mg zinc for immunity or 1,500mg omega-3s for cognition—based on your profile, minimizing overdose risks (e.g., excessive vitamin A above 10,000 IU).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Award className="h-6 w-6 text-yellow-400" />
                  Science-Backed Choices
                </h3>
                <p className="text-dark-secondary">
                  Prioritizes nutrients like vitamin D for bone health or iron for oxygen transport, supported by 5,000+ PubMed studies.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-400" />
                  Round-the-Clock Support
                </h3>
                <p className="text-dark-secondary">
                  A 24/7 AI chatbot offers evidence-based advice, adjusting your plan as goals shift.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  Streamlined Access
                </h3>
                <p className="text-dark-secondary">
                  The $75/month plan delivers six monthly supplement packs from third-party-tested vendors; $19.99/month includes a custom grocery list.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 my-8">
                <p className="text-dark-secondary leading-relaxed">
                  <strong className="text-dark-primary">This beats generic options</strong>, offering a proactive health strategy.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Maximizing Daily Wellness with Supplements</h2>
              
              <div className="grid md:grid-cols-1 gap-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Immune Boost</h3>
                      <p className="text-dark-secondary text-sm">Vitamin C enhances white blood cell activity; pair with zinc for synergy.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Energy Surge</h3>
                      <p className="text-dark-secondary text-sm">B12 and iron combat fatigue, especially for vegetarians or athletes.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Brain className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Mental Edge</h3>
                      <p className="text-dark-secondary text-sm">Omega-3s improve memory; add B6 for neurotransmitter support.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Stress Relief</h3>
                      <p className="text-dark-secondary text-sm">Magnesium and ashwagandha lower stress markers by 20–30% (Journal of Alternative Medicine, 2023).</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Activity className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Holistic Habits</h3>
                      <p className="text-dark-secondary text-sm">Complement with 7–9 hours of sleep, 150 minutes weekly exercise, and 2–3 liters of water daily.</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">FAQ</h2>
              
              <div className="space-y-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Why Supplements Despite a Good Diet?</h3>
                  <p className="text-dark-secondary text-sm">Soil depletion and processing reduce nutrient density by 25% (USDA, 2023), and absorption varies by individual.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">How Is My Plan Personalized?</h3>
                  <p className="text-dark-secondary text-sm">AI evaluates your 5-minute input and optional data for a tailored AI daily nutrition plan.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Which Nutrients Boost Energy?</h3>
                  <p className="text-dark-secondary text-sm">B vitamins, iron, and magnesium are key, dosed per your needs.</p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Can Wrong Supplements Harm?</h3>
                  <p className="text-dark-secondary text-sm">Yes, excess (e.g., iron above 45mg/day) can cause toxicity—personalization ensures safety.</p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">When Will I Notice Benefits?</h3>
                  <p className="text-dark-secondary text-sm">Many report energy or focus gains in 2–6 weeks with consistency.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl p-6 my-8">
                <h2 className="text-2xl font-bold text-dark-primary mb-4">Conclusion</h2>
                <p className="text-dark-secondary leading-relaxed">
                  Give your body a fighting chance with <strong>personalized supplements 2025</strong> from SupplementScribe. Start your <strong>AI daily nutrition</strong> journey at SupplementScribe.com for $19.99 or $75/month, backed by science for everyday vitality!
                </p>
              </div>

            </div>
          </motion.article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Give Your Body the Support It Deserves?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Stop struggling with generic supplements that don't match your unique needs. Discover the power of AI-driven, personalized nutrition designed for your everyday wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Start Your Wellness Journey
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
                href="/content/greens-powders-hype-health-boost-personalized-nutrition"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">Greens Powders: Hype or Health Boost?</h4>
                <p className="text-dark-secondary text-sm">Unlock Personalized Nutrition for Optimal Wellness</p>
              </Link>
              
              <Link 
                href="/content/ai-optimized-supplements-dna-personalization-2025"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">AI-Optimized Supplements</h4>
                <p className="text-dark-secondary text-sm">Why Your DNA Demands Personalization</p>
              </Link>
              
              <Link 
                href="/content/live-longer-thrive-adhd-personalized-supplements"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">Live Longer and Thrive with ADHD</h4>
                <p className="text-dark-secondary text-sm">Personalized Supplements for a Healthier You</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
