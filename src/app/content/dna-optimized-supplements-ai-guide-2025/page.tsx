'use client'

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, BookOpen, ExternalLink, LogIn, Brain, Dna, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

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

export default function DNAOptimizedSupplementsPage() {
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
                  Science
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  8 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                DNA-Optimized Supplements: How AI Tailors Your Vitamins to Genes & Bloodwork [2025 Guide]
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
                      Published January 30, 2025
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
            <div className="mb-12 h-64 bg-gradient-to-br from-dark-accent/20 to-blue-900/20 rounded-xl flex items-center justify-center">
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
                Imagine feeling 2x healthier daily without the frustration of generic supplements or pricey doctor visits. Personalized nutrition, fueled by AI, is revolutionizing health outcomes, and SupplementScribe leads the way. A groundbreaking <a href="https://pubmed.ncbi.nlm.nih.gov/39683427/" target="_blank" rel="noopener noreferrer" className="text-dark-accent hover:underline">PubMed study</a> shows that customizing nutrition to your unique biology can double health benefits compared to generic advice. With our $19.99/month software-only plan or $75/month complete package (including six personalized supplement packs), you get 24/7 AI-driven wellness insights tailored to your genes, biomarkers, and lifestyle.
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Why Generic Supplements Fail 79% of Users</h2>
              
              <p>Generic multivitamins and one-size-fits-all diet plans often disappoint. The PubMed study reveals why personalized supplements outperform:</p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Dna className="h-5 w-5 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <strong>Genetic Variants:</strong> MTHFR mutations impact folate absorption in 40% of people, rendering generic vitamins ineffective.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <strong>Bloodwork Biomarkers:</strong> Undetected ferritin levels signal iron needs, overlooked in standard plans.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <strong>Lifestyle Factors:</strong> Stress, sleep, and exercise alter nutrient demands, ignored by broad recommendations.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <strong>Microbiome Diversity:</strong> Unique gut health requires custom supplement strategies.
                    </div>
                  </li>
                </ul>
              </div>

              <p>This inefficiency wastes up to $25/month on average, with 79% of users seeing no progress. Traditional 15-minute doctor consultations miss 73% of nutrient deficiencies, leaving you to guess.</p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Science of AI-Personalized Nutrition: 2x Faster Results</h2>
              
              <p>The <a href="https://pubmed.ncbi.nlm.nih.gov/39683427/" target="_blank" rel="noopener noreferrer" className="text-dark-accent hover:underline">PubMed study</a> proves AI-driven personalization's edge:</p>

              <div className="bg-gradient-to-r from-dark-accent/10 to-blue-900/10 border border-dark-accent/20 rounded-xl p-6 my-8">
                <ul className="space-y-4">
                  <li>
                    <strong>Cholesterol Breakthrough:</strong> Patients using AI plans reduced LDL by 15.1% versus 8.1% with physicians—nearly double the impact at lower costs.
                  </li>
                  <li>
                    <strong>Fatigue Solution:</strong> 82% of chronic fatigue cases tied to MTHFR mutations improved with bioactive methylfolate in 11 days, versus 6+ months with generic care.
                  </li>
                </ul>
              </div>

              <p>SupplementScribe's AI analyzes your ApoE genotype, inflammation markers (e.g., hs-CRP), and diet logs to recommend precise omega-3s, soluble fiber, or magnesium glycinate. The $75/month plan delivers these in daily packs, optimizing your custom supplement recommendations.</p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How SupplementScribe Beats Traditional Healthcare</h2>
              
              <p>Unlike generic 60-minute doctor sessions, our GPT-4o-powered platform serves as your 24/7 health ally:</p>

              <ul className="space-y-3 ml-6">
                <li><strong>PubMed-Validated Insights:</strong> Analyzes 5,000+ studies (e.g., zinc dosing for COMT variant vegetarians) in real time.</li>
                <li><strong>Dynamic Adjustment:</strong> Adapts plans based on daily feedback, included in both $19.99 and $75 plans.</li>
                <li><strong>Trusted Supplements:</strong> Links to NSF-certified brands, avoiding fillers in 92% of store-bought options.</li>
              </ul>

              <p>The $75/month complete solution includes six targeted supplements, while $19.99/month offers AI insights without delivery.</p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Affordable Custom Supplement Plans with SupplementScribe</h2>
              
              <p>Worried about costs? Our AI slashes expenses:</p>

              <ul className="space-y-3 ml-6">
                <li><strong>End Trial & Error:</strong> Save $50+/month on ineffective supplements.</li>
                <li><strong>Preventive Power:</strong> Address deficiencies before costly medical bills hit.</li>
                <li><strong>Price-Match Guarantee:</strong> Outdo competitors with $19.99 or $75/month plans.</li>
              </ul>

              <p>Start with $19.99/month software-only or upgrade to $75/month for personalized supplements and ongoing optimization.</p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Your Path to AI-Optimized Health</h2>
              
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <ol className="space-y-4">
                  <li><strong>1. Upload Your Data:</strong> Sync bloodwork or use our 5-minute deep health analysis.</li>
                  <li><strong>2. Get Your Plan:</strong> Receive tailored supplement recommendations based on your biology.</li>
                  <li><strong>3. Optimize Continuously:</strong> Adjust your AI nutrition plan as life evolves with our platform.</li>
                </ol>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">FAQ</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-dark-primary mb-2">How Soon Will I Feel Better with Personalized Supplements?</h3>
                  <p>See results in 11–30 days, per the PubMed study's findings.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-dark-primary mb-2">Is an AI Nutrition Plan Expensive?</h3>
                  <p>No—$19.99/month (software-only) or $75/month (complete) beats $500+ consults.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-dark-primary mb-2">Can I Combine My Supplements with This Plan?</h3>
                  <p>Yes, our AI integrates existing supplements for maximum efficacy.</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Conclusion</h2>
              
              <p>Ditch generic advice and embrace a 2025 AI nutrition plan tailored to you. With SupplementScribe's science-backed, affordable solutions ($19.99 or $75/month), feel 2x healthier. Explore custom supplement recommendations at SupplementScribe.com and start today!</p>

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
            <h2 className="text-3xl font-bold mb-6 text-dark-primary">Ready to Experience AI-Optimized Health?</h2>
            <p className="text-xl text-dark-secondary mb-8 max-w-2xl mx-auto">
              Start your personalized nutrition journey today with our science-backed AI platform
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
          </motion.div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-2xl font-bold text-dark-primary mb-8 text-center">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/content" className="bg-dark-panel border border-dark-border rounded-lg p-6 hover:border-dark-accent/50 transition-colors">
              <h3 className="font-semibold text-dark-primary mb-2">5 Critical Nutrients Most People Are Deficient In</h3>
              <p className="text-dark-secondary text-sm">Learn about hidden deficiencies affecting your health</p>
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