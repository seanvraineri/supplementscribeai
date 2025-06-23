'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Brain, Heart, Zap, Target, AlertTriangle, CheckCircle, TrendingUp, LogIn, BarChart3, Award, Lightbulb, Activity, Search, Leaf, Shield, Dna, Pill, Microscope, Users, Baby, Apple, Star } from 'lucide-react';
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

export default function KidsTeensSupplementsPage() {
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
                  Family Health Guide
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  15 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                Dietary Supplements for Kids & Teens: A Complete Family Guide to Safe Nutrition
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
                      Published June 23, 2025, 03:00 PM EDT
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
              <Users className="h-24 w-24 text-dark-accent/60" />
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
                Navigating dietary supplements for children and teenagers requires careful consideration and professional guidance. Recent research shows that <strong className="text-dark-primary">30% of U.S. children and 20-30% globally use dietary supplements</strong> (Rocha Barretto et al., 2025), yet many families lack proper guidance on safe and effective supplementation. With growing concerns about nutrient depletion in foods and increasing health challenges in young people, understanding evidence-based approaches to pediatric nutrition has never been more important.
              </p>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed">
                      <strong className="text-dark-primary">Critical Safety Notice:</strong> All supplement decisions for children and teens should be made in consultation with qualified healthcare providers. This information is educational and should never replace professional pediatric medical advice.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Understanding Pediatric Supplement Use</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                The landscape of pediatric nutrition has evolved significantly, with several factors contributing to increased supplement consideration:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Apple className="h-6 w-6 text-dark-accent" />
                  Nutritional Challenges in Modern Diets
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Research indicates that soil depletion has reduced nutrient content in foods by approximately 25% over recent decades (USDA, 2023). Combined with processed food consumption and selective eating patterns common in children, nutritional gaps may occur even with well-intentioned meal planning.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-dark-accent" />
                  Common Deficiencies in Young People
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Studies show that approximately 30% of children may have insufficient vitamin D levels (CDC, 2025), while iron deficiency remains a concern, particularly in adolescent girls. <strong className="text-dark-primary">These deficiencies can impact growth, immune function, and cognitive development</strong>.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-dark-accent" />
                  Safety Concerns with Unsupervised Use
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Research indicates that 50% of parents may not consult healthcare providers before starting supplements (Journal of Pediatrics, 2025), potentially leading to inappropriate dosing or interactions. <strong className="text-dark-primary">Professional guidance is essential for safe pediatric supplementation</strong>.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Age-Specific Nutritional Considerations</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Nutritional needs vary significantly across developmental stages:
              </p>

              <div className="space-y-6">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Baby className="h-4 w-4 text-dark-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Early Childhood (2-8 years)</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Focus on foundational nutrients for growth and development. Vitamin D, iron, and omega-3 fatty acids are commonly assessed. Professional evaluation helps determine if dietary sources are sufficient or if supplementation is needed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="h-4 w-4 text-dark-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Pre-Adolescence (9-12 years)</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Rapid growth periods may increase nutritional demands. Calcium, vitamin D, and B-vitamins become particularly important. Individual assessment helps identify specific needs during this transitional period.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <TrendingUp className="h-4 w-4 text-dark-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Adolescence (13-18 years)</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Peak growth velocity and hormonal changes create unique nutritional demands. Iron needs increase, particularly for menstruating teens. Protein, zinc, and magnesium support muscle development and cognitive function.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Common Supplement Categories for Young People</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Understanding the most commonly considered supplements helps families make informed decisions:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Immune Support</h3>
                      <p className="text-dark-secondary text-sm">Vitamin C, vitamin D, and zinc are commonly evaluated for immune system support, particularly during school seasons.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Growth & Development</h3>
                      <p className="text-dark-secondary text-sm">Calcium, vitamin D, and protein support healthy bone development and linear growth during critical periods.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Brain className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Cognitive Function</h3>
                      <p className="text-dark-secondary text-sm">Omega-3 fatty acids, B-vitamins, and iron support brain development and academic performance.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Activity className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Energy & Athletics</h3>
                      <p className="text-dark-secondary text-sm">Iron, B-vitamins, and magnesium support energy metabolism and athletic performance in active teens.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed">
                      <strong className="text-dark-primary">Important Safety Consideration:</strong> Approximately 20% of supplement batches may contain contaminants or inaccurate labeling (FDA, 2025). Choose products from reputable manufacturers with third-party testing and always consult healthcare providers.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How SupplementScribe Supports Family Nutrition</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Our Family Plan provides comprehensive nutritional guidance designed specifically for households with varying age groups and needs:
              </p>

              <div className="space-y-6">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-dark-accent font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Age-Appropriate Assessment</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Individual nutritional analysis for each family member, considering developmental stage, dietary preferences, activity levels, and health goals while emphasizing the importance of pediatric medical consultation.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Family-Friendly Meal Planning</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Nutritious meal plans that appeal to different age groups while maximizing nutrient density. Focus on whole foods rich in vitamins, minerals, and other beneficial compounds.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Safe Supplement Guidance</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        When supplements are appropriate, our platform provides evidence-based recommendations with proper dosing guidelines and safety considerations, always emphasizing professional medical oversight.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Educational Resources</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Comprehensive information about pediatric nutrition, helping families understand when supplements might be beneficial and when dietary approaches are sufficient.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Professional Integration</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Our recommendations are designed to complement, not replace, professional pediatric care. We encourage families to share our assessments with their healthcare providers for optimal safety.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Family Plan Pricing and Value</h2>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-8 my-8">
                <h3 className="text-2xl font-bold text-dark-primary mb-6 text-center">Comprehensive Family Nutrition Support</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-dark-background border border-dark-border rounded-xl p-6">
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold text-dark-primary mb-2">Guidance Plan</h4>
                      <p className="text-3xl font-bold text-dark-accent">$15<span className="text-lg text-dark-secondary">/month per member</span></p>
                    </div>
                    <ul className="text-dark-secondary space-y-2 text-sm">
                      <li>• Personalized nutrition assessment</li>
                      <li>• Family meal planning</li>
                      <li>• Educational resources</li>
                      <li>• Basic supplement guidance</li>
                      <li>• Professional consultation recommendations</li>
                    </ul>
                  </div>

                  <div className="bg-dark-background border border-dark-accent rounded-xl p-6">
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold text-dark-primary mb-2">Complete Family Plan</h4>
                      <p className="text-3xl font-bold text-dark-accent">$70<span className="text-lg text-dark-secondary">/month for 2-9 people</span></p>
                    </div>
                    <ul className="text-dark-secondary space-y-2 text-sm">
                      <li>• Everything in Guidance Plan</li>
                      <li>• Age-appropriate supplement recommendations</li>
                      <li>• Grocery shopping lists</li>
                      <li>• Detailed meal prep guidance</li>
                      <li>• 24/7 AI nutrition support</li>
                      <li>• Regular progress tracking</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-8 my-8 text-center">
                <h3 className="text-2xl font-bold text-dark-primary mb-4">Ready to Support Your Family's Health Journey?</h3>
                <p className="text-dark-secondary mb-6 leading-relaxed">
                  Discover how personalized nutrition guidance can help your family thrive while maintaining the highest safety standards and professional oversight.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signup">
                    <button className="inline-flex items-center px-6 py-3 text-lg font-bold text-dark-background bg-dark-accent rounded-lg hover:bg-dark-accent/90 transition-all duration-200">
                      Explore Family Plans
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
                  <h3 className="text-lg font-bold text-dark-primary mb-3">At what age can children start taking supplements?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    The appropriate age varies by supplement type and individual needs. Most pediatricians recommend focusing on whole foods for young children, with specific supplements considered only when medically indicated. Always consult your child's healthcare provider before starting any supplements.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How does the Family Plan work for different age groups?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Our platform provides age-appropriate recommendations for each family member, considering developmental stages, nutritional needs, and safety guidelines. All recommendations emphasize professional medical consultation for children and teens.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">Are supplements necessary if my child eats a balanced diet?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Many children who eat varied, nutrient-dense diets may not need supplements. However, certain nutrients like vitamin D or iron may sometimes require supplementation even with good diets. Individual assessment with healthcare providers helps determine specific needs.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How can I ensure supplement safety for my teenager?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Choose products from reputable manufacturers with third-party testing, follow age-appropriate dosing guidelines, consult healthcare providers, and monitor for any adverse effects. Avoid products marketed specifically for adult athletes or weight loss.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">What's the difference between children's and adult supplements?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Children's supplements typically contain lower doses appropriate for smaller body sizes and developing systems. They often exclude certain ingredients that may not be suitable for young people and may have more palatable formulations.
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
            <Link href="/content/family-plan-personalized-supplements-household" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Family Health</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  The Family Plan: Supporting Your Household's Health
                </h3>
                <p className="text-dark-secondary text-sm">
                  Discover how personalized nutrition can support every family member's unique health requirements.
                </p>
              </div>
            </Link>

            <Link href="/content/ai-making-personalized-health-affordable-accessible" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Health</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Making Personalized Health Affordable for Everyone
                </h3>
                <p className="text-dark-secondary text-sm">
                  Learn how AI is breaking cost barriers to make personalized health accessible to all families.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-dark-panel border-t border-dark-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-dark-primary mb-4">Stay Updated on Family Health</h2>
          <p className="text-dark-secondary mb-8 max-w-2xl mx-auto">
            Get the latest insights on pediatric nutrition, family wellness strategies, and evidence-based health guidance delivered to your inbox.
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
