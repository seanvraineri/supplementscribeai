'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Leaf, Brain, Zap, Target, Shield, CheckCircle, TrendingUp, LogIn, BarChart3, AlertTriangle, Award, Lightbulb, Activity } from 'lucide-react';
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

export default function GreensPowdersPage() {
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
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  Supplements
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  8 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                Greens Powders: Hype or Health Boost? Unlock Personalized Nutrition for Optimal Wellness
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
                      Published June 23, 2025, 01:06 PM EDT
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
            <div className="mb-12 h-64 bg-gradient-to-br from-green-500/20 to-emerald-900/20 rounded-xl flex items-center justify-center">
              <Leaf className="h-24 w-24 text-green-400/60" />
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
                Greens powders have surged in popularity, marketed as a quick fix for energy, immunity, and digestion. With the global greens supplement market projected to reach <strong>$1.2 billion by 2027</strong> (per industry reports), their appeal is undeniable. Yet, a growing body of evidence suggests these products may not suit everyone's unique nutritional profile. SupplementScribe offers a smarter alternative with <strong>personalized supplements 2025</strong>, leveraging <strong>AI nutrition plans</strong> starting at $19.99/month (software-only) or $75/month (with six custom supplement packs). This guide dives into greens powders' benefits and limitations, empowering you with data-driven choices for optimal health.
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Rise and Reality of Greens Powders</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Greens powders, blending spirulina, kale, and other nutrient-dense ingredients, aim to fill dietary gaps. However, industry trends reveal challenges:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  Generic Formulations
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Many powders use standardized blends, assuming uniform needs across diverse populations. Research indicates <strong className="text-dark-primary">60–70% of adults have unique nutrient demands</strong> influenced by age, activity levels, and health status (Journal of Nutrition, 2023).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-red-400" />
                  Opaque Ingredient Disclosure
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Proprietary blends, common in some products, obscure exact dosages. Studies warn that excessive intake of nutrients like vitamin A or iron (beyond 150% of the Recommended Dietary Allowance) can lead to toxicity or imbalances over time.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-blue-400" />
                  Limited Adaptability
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Flavor variations exist, but ingredient customization is rare, missing individual factors like gut microbiome diversity or chronic conditions.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                  Nutrient Gaps
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Some formulations may lack critical vitamins (e.g., vitamin D for bone health or iron for oxygen transport), which <strong className="text-dark-primary">40% of U.S. adults don't get enough of</strong> (NIH, 2024).
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <TrendingUp className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed">
                      While greens powders offer convenience—delivering 5–10g of greens per serving—they're not a panacea. A 2022 consumer survey found <strong className="text-dark-primary">45% of users reported minimal benefits</strong>, highlighting the need for personalization.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Why Personalized Nutrition Outperforms Greens Powders</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Your body's nutrient needs are as unique as your fingerprint. SupplementScribe's <strong>AI nutrition plan</strong> addresses this with:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-400" />
                  Precision Health Assessment
                </h3>
                <p className="text-dark-secondary">
                  Our 5-minute deep health analysis evaluates symptoms, diet, exercise, and optional health data (e.g., bloodwork insights), aligning with guidelines from the American Society for Nutrition.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-purple-400" />
                  Optimized Dosages
                </h3>
                <p className="text-dark-secondary">
                  AI recommends exact amounts—e.g., 600–2,000 IU vitamin D or 8–18mg iron daily—based on your profile, avoiding the risks of over- or under-supplementation noted in a 2023 JAMA study.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Award className="h-6 w-6 text-yellow-400" />
                  Tailored Ingredient Selection
                </h3>
                <p className="text-dark-secondary">
                  Unlike generic blends, we prioritize nutrients like magnesium (300–400mg for stress relief) or omega-3s (1,000–2,000mg for inflammation) based on your needs, supported by peer-reviewed research.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-400" />
                  Ongoing Support
                </h3>
                <p className="text-dark-secondary">
                  A 24/7 AI chatbot provides evidence-based advice, adjusting your plan as health goals evolve, a feature unmatched by static greens powder products.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  Seamless Access
                </h3>
                <p className="text-dark-secondary">
                  The $75/month plan includes six monthly supplement packs from third-party-tested vendors, while $19.99/month offers a custom grocery list, ensuring quality and convenience.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 my-8">
                <p className="text-dark-secondary leading-relaxed">
                  <strong className="text-dark-primary">This approach, rooted in 5,000+ PubMed studies</strong>, outperforms greens powder alternatives by adapting to your changing health landscape.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Practical Benefits of Personalized Supplements</h2>
              
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Zap className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Enhanced Energy</h3>
                      <p className="text-dark-secondary text-sm">Targeted B vitamins and iron address fatigue in 30% of adults with suboptimal levels (CDC, 2024).</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Activity className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Improved Digestion</h3>
                      <p className="text-dark-secondary text-sm">Probiotics or fiber recommendations cater to individual gut health, unlike generic greens blends.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Shield className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Long-Term Wellness</h3>
                      <p className="text-dark-secondary text-sm">Prevents chronic issues like osteoporosis (vitamin D) or anemia (iron), common with unbalanced intake.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <BarChart3 className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Cost Efficiency</h3>
                      <p className="text-dark-secondary text-sm">Saves up to $25/month compared to wasted generic purchases, per consumer spending trends.</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Actionable Steps to Optimize Your Nutrition</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Beyond supplements, consider:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Leaf className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-dark-primary">Diet Diversification:</strong>
                      <span className="text-dark-secondary"> Pair plans with whole foods (e.g., leafy greens, nuts) for synergy.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Activity className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-dark-primary">Hydration:</strong>
                      <span className="text-dark-secondary"> 2–3 liters daily enhances nutrient absorption.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-dark-primary">Consult Experts:</strong>
                      <span className="text-dark-secondary"> Pair with a healthcare provider for holistic care.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <BarChart3 className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-dark-primary">Track Progress:</strong>
                      <span className="text-dark-secondary"> Use our platform to monitor energy or digestion improvements weekly.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">FAQ</h2>
              
              <div className="space-y-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Do Greens Powders Benefit Everyone?</h3>
                  <p className="text-dark-secondary text-sm">They can aid those with low veggie intake, but 45% see limited results due to generic design (Consumer Reports, 2022).</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">How Does SupplementScribe Personalize?</h3>
                  <p className="text-dark-secondary text-sm">AI analyzes your 5-minute input and optional data for a tailored AI nutrition plan.</p>
                </div>
                
                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">What Nutrients Might Greens Powders Miss?</h3>
                  <p className="text-dark-secondary text-sm">Common gaps include vitamin D, iron, and vitamin C, essential for immunity and skin.</p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">Are Overdoses a Risk with Greens?</h3>
                  <p className="text-dark-secondary text-sm">Yes, excessive nutrients (e.g., excessive vitamin A above 10,000 IU) can harm—personalization mitigates this.</p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-lg p-4">
                  <h3 className="font-semibold text-dark-primary mb-2">When Will I Feel Benefits?</h3>
                  <p className="text-dark-secondary text-sm">Many notice energy or digestion boosts in 2–6 weeks with consistent use.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 my-8">
                <h2 className="text-2xl font-bold text-dark-primary mb-4">Conclusion</h2>
                <p className="text-dark-secondary leading-relaxed">
                  Don't rely on greens powder hype—embrace <strong>personalized supplements 2025</strong> with SupplementScribe. Unlock your <strong>AI nutrition plan</strong> at SupplementScribe.com for $19.99 or $75/month, backed by science for your optimal wellness!
                </p>
              </div>

            </div>
          </motion.article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Move Beyond Generic Greens Powders?</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Stop settling for one-size-fits-all nutrition. Discover the power of AI-driven, personalized supplement plans designed specifically for your unique health profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Start Your Personalized Plan
              </Link>
              <Link 
                href="/science"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
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
                href="/content/ai-optimized-supplements-dna-personalization-2025"
                className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent transition-colors"
              >
                <h4 className="font-semibold text-dark-primary mb-2">AI-Optimized Supplements</h4>
                <p className="text-dark-secondary text-sm">Why Your DNA Demands Personalization</p>
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
                <p className="text-dark-secondary text-sm">Personalized Health for Everyone</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
