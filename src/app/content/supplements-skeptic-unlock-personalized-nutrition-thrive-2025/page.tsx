'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, AlertTriangle, Brain, Zap, Target, Shield, CheckCircle, TrendingUp, LogIn, BarChart3, Award, Lightbulb, Heart, Activity, Search } from 'lucide-react';
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

export default function SkepticGuidePage() {
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
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                  Skeptic Guide
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  6 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                Supplements: Skeptic? Unlock Personalized Nutrition to Thrive in 2025
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
                      Published June 23, 2025, 01:10 PM EDT
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
            <div className="mb-12 h-64 bg-gradient-to-br from-orange-500/20 to-red-900/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-24 w-24 text-orange-400/60" />
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
                Feeling drained, foggy, or rundown despite a "healthy" diet? In today's world, stress, pollution, and nutrient-stripped foods leave <strong>70% of adults missing key vitamins and minerals</strong> (NIH, 2024). You might wonder, <em>"Do I need supplements?"</em> or <em>"What should I do?"</em> A balanced diet is vital, but it's not enough—<strong>soil depletion cuts food nutrient density by 25%</strong> (USDA, 2023), and your unique needs demand more. SupplementScribe's <strong>personalized supplements 2025</strong>, starting at $19.99/month (software-only) or $75/month (with six vital supplements, grocery, and diet plans), use AI to tailor your nutrition. <strong>Struggling with energy dips or immunity issues? This could be your wake-up call—sign up to discover what your body craves!</strong>
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Why You Can't Ignore Nutrient Gaps Anymore</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Modern life sabotages your health, creating gaps no generic pill can fix:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-red-400" />
                  Widespread Deficiencies
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Only <strong className="text-dark-primary">30% of people get enough magnesium (300–400mg/day) or vitamin D (600–800 IU/day)</strong> from food, with 35% low in zinc (CDC, 2024). <em className="text-orange-400">Are you among the tired or sick?</em>
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  Stress & Toxin Overload
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Chronic stress depletes B vitamins (e.g., B12 at 2.4µg/day), while pollution ramps up antioxidant needs like vitamin C (75–90mg/day)—affecting <strong className="text-dark-primary">40% of adults</strong> (Stress in America, 2024).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-purple-400" />
                  Unique Needs
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Your age, activity, or genetics shape absorption—e.g., <strong className="text-dark-primary">15% struggle with omega-3s (1,000–2,000mg/day)</strong> due to diet or metabolism (NIH, 2023). Generic supplements miss this.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Search className="h-6 w-6 text-blue-400" />
                  Dietary Limits
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Processed foods lack micronutrients like iron (8–18mg/day), and even fresh produce falls short—<em className="text-orange-400">do you feel the gap in focus or energy?</em>
                </p>
              </div>

              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed">
                      <strong className="text-dark-primary">Without personalization, you're guessing—and 50% of supplement users see no benefit</strong> (Journal of Nutrition, 2022). <em className="text-orange-400">What should you do? The answer lies in a plan for you.</em>
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How SupplementScribe Turns Skepticism into Action</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                <strong>Ditch the doubt</strong>—SupplementScribe's <strong>AI nutrition support</strong> delivers:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-400" />
                  Reveal Your Specific Gaps
                </h3>
                <p className="text-dark-secondary">
                  Our 5-minute deep health analysis uncovers your needs—tiredness, stress, or immunity issues—using lifestyle data and optional health insights.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Award className="h-6 w-6 text-yellow-400" />
                  Six Vital Supplements, Tailored
                </h3>
                <p className="text-dark-secondary">
                  The $75/month plan provides six hard-to-get nutrients (e.g., omega-3s, magnesium) in perfect doses, addressing what diet alone can't.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  Grocery & Diet Plans for Micronutrients
                </h3>
                <p className="text-dark-secondary">
                  We map out foods rich in vitamins and minerals (e.g., leafy greens for folate, nuts for selenium) to complement supplements, ensuring a holistic boost.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-purple-400" />
                  Precision Dosing
                </h3>
                <p className="text-dark-secondary">
                  Avoids risks like excess iron (above 45mg/day) with exact recommendations—maximizing benefits for your body.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-400" />
                  24/7 Expert Backup
                </h3>
                <p className="text-dark-secondary">
                  Our AI chatbot guides you—ask <em>"What should I do?"</em> anytime, adjusting your plan as life shifts.
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6 my-8">
                <p className="text-dark-secondary leading-relaxed">
                  <strong className="text-dark-primary">With $19.99/month (custom grocery/diet plans) or $75/month (plus six supplements), you get a roadmap to thrive.</strong> <em className="text-orange-400">Feeling off? This could be your solution—sign up now!</em>
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Real Benefits to Seize Control</h2>
              
              <div className="grid md:grid-cols-1 gap-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Immune Strength</h3>
                      <p className="text-dark-secondary text-sm">Vitamin C and zinc ramp up defenses—<em className="text-green-400">perfect if you're prone to colds.</em></p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Energy Revival</h3>
                      <p className="text-dark-secondary text-sm">B12 and iron combat fatigue—<em className="text-orange-400">ideal if you're dragging by noon.</em></p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Brain className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Mental Edge</h3>
                      <p className="text-dark-secondary text-sm">Omega-3s and B6 clear fog—<em className="text-purple-400">try this if focus eludes you.</em></p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Stress Relief</h3>
                      <p className="text-dark-secondary text-sm">Magnesium and adaptogens cut cortisol by 20–30% (Journal of Alternative Medicine, 2023)—<em className="text-red-400">relief if stress rules your day.</em></p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Activity className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Daily Wins</h3>
                      <p className="text-dark-secondary text-sm">Pair with 7–9 hours sleep, 150 minutes exercise, and 2–3 liters water for a powerhouse routine.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6 my-8">
                <p className="text-dark-secondary leading-relaxed">
                  <strong className="text-dark-primary">These aren't vague tips—they're tailored to you.</strong> <em className="text-orange-400">Ready to feel the difference? Sign up to find out what your body needs!</em>
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">FAQ</h2>
              
              <div className="space-y-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Why Am I Still Exhausted with a Good Diet?</h3>
                  <p className="text-dark-secondary text-sm">Soil depletion and absorption issues leave 25% less nutrients (USDA, 2023)—personalization fills this.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">How Does SupplementScribe Personalize for Me?</h3>
                  <p className="text-dark-secondary text-sm">AI crafts your AI nutrition support from a 5-minute analysis and optional data.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">What Are the Six Vital Supplements?</h3>
                  <p className="text-dark-secondary text-sm">Tailored doses of omega-3s, magnesium, vitamin D, zinc, B vitamins, and iron—hard to get consistently.</p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Can Wrong Supplements Hurt?</h3>
                  <p className="text-dark-secondary text-sm">Yes, excess (e.g., excessive vitamin A above 10,000 IU) can harm—our plan ensures safety.</p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">How Soon Will I Feel Better?</h3>
                  <p className="text-dark-secondary text-sm">Many report energy or focus gains in 2–6 weeks—start today to see!</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6 my-8">
                <h2 className="text-2xl font-bold text-dark-primary mb-4">Conclusion</h2>
                <p className="text-dark-secondary leading-relaxed">
                  Don't let skepticism block your path—unlock <strong>personalized supplements 2025</strong> with SupplementScribe. <strong className="text-orange-400">Sign up at SupplementScribe.com for $19.99 or $75/month</strong> and get six vital supplements, grocery plans, and diet strategies tailored to you. <em className="text-orange-400">Your body's calling—what should you do? Act now!</em>
                </p>
              </div>

            </div>
          </motion.article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Still Skeptical? Your Body Has the Answers.</h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Stop wondering "What should I do?" and start getting real answers. Discover exactly what your unique body needs with AI-driven, personalized nutrition that actually works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Sign Up & Discover Your Gaps
              </Link>
              <Link 
                href="/science"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                See the Science
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-dark-primary mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link 
                href="/content/give-body-fighting-chance-personalized-supplements-everyday"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">Give Your Body a Fighting Chance</h4>
                <p className="text-dark-secondary text-sm">The Power of Personalized Supplements in Everyday Life</p>
              </Link>
              
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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
