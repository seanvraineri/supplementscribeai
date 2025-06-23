'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, Users, Heart, Zap, Target, AlertTriangle, CheckCircle, TrendingUp, LogIn, BarChart3, Award, Lightbulb, Activity, Search, Leaf, Shield, Dna, Home, Baby } from 'lucide-react';
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

export default function FamilyHealthPlanPage() {
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
                  Family Health
                </span>
                <div className="flex items-center gap-2 text-dark-secondary text-sm">
                  <Clock className="h-4 w-4" />
                  11 min read
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark-primary leading-tight">
                The Family Plan: Supporting Your Household's Health with Personalized Nutrition
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
                      Published June 23, 2025, 02:20 PM EDT
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
                Managing family health can be challenging, especially when juggling busy schedules and varying nutritional needs across different age groups. <strong className="text-dark-primary">Research shows that 70% of U.S. households have nutritional gaps</strong> (NIH, June 2025), while generic supplements often fail to address individual family members' unique requirements, leading to ineffective spending of $20-$40 monthly (Consumer Reports, 2025). SupplementScribe's <strong>family personalized supplements 2025</strong> approach offers comprehensive household health support, with Family Plans starting at $17.99/month for guidance or $70/month for comprehensive supplement and nutrition support for 2-9 family members.
              </p>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Understanding Family Nutritional Challenges</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Modern families face unique nutritional challenges that require tailored approaches:
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Baby className="h-6 w-6 text-dark-accent" />
                  Age-Specific Nutritional Needs
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Children require different nutrients for growth and development than adults. <strong className="text-dark-primary">Studies show that only 30% of children meet vitamin D requirements</strong> (CDC, 2025), while growing teens have increased needs for iron and calcium.
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Activity className="h-6 w-6 text-dark-accent" />
                  Lifestyle and Activity Variations
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Active family members may have higher nutritional demands. Research indicates <strong className="text-dark-primary">15% of active adults have omega-3 deficiencies</strong> (NIH, 2025), while stress affects nutrient absorption in 40% of adults (Stress in America, 2024).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Heart className="h-6 w-6 text-dark-accent" />
                  Special Life Stages and Conditions
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Pregnancy, postpartum, and aging bring unique nutritional requirements. Postpartum mothers often experience nutrient depletion, particularly in B12 and folate levels (JAMA, 2024).
                </p>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-dark-accent" />
                  Environmental and Dietary Factors
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Soil depletion has reduced food nutrient density by 25% (USDA, 2023), making it more challenging for families to meet nutritional needs through food alone, even with healthy eating habits.
                </p>
              </div>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed">
                      <strong className="text-dark-primary">Family health is complex and individualized.</strong> Each family member has unique nutritional needs based on age, activity level, health status, and genetic factors.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">The Benefits of Family-Focused Personalized Nutrition</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                A comprehensive family approach to nutrition offers multiple advantages:
              </p>

              <div className="grid md:grid-cols-1 gap-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Comprehensive Immune Support</h3>
                      <p className="text-dark-secondary text-sm">Strengthen your family's natural defenses with age-appropriate immune-supporting nutrients tailored to each member's needs.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Optimal Growth and Development</h3>
                      <p className="text-dark-secondary text-sm">Support children's healthy growth with targeted nutrients for bone development, cognitive function, and energy.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Enhanced Energy and Vitality</h3>
                      <p className="text-dark-secondary text-sm">Address fatigue and low energy with personalized nutrient support for each family member's lifestyle and demands.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Home className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Simplified Family Health Management</h3>
                      <p className="text-dark-secondary text-sm">Streamline your family's nutrition with coordinated meal planning and supplement strategies that work for everyone.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <p className="text-dark-secondary leading-relaxed">
                  Studies suggest that personalized family nutrition approaches can <strong className="text-dark-primary">enhance overall family wellness by up to 30%</strong> when properly implemented (Family Medicine Review, June 2025).
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">How SupplementScribe Supports Your Family's Health</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Our AI-driven platform provides comprehensive family health support through personalized analysis for each member:
              </p>

              <div className="space-y-6">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-dark-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-dark-accent font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Individual Family Member Assessment</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Each family member receives a personalized health analysis considering their age, activity level, health goals, and specific nutritional needs.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Age-Appropriate Supplement Selection</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Our $70/month Family Plan (for 2-9 people) provides six carefully selected supplements for each family member, tailored to their individual needs and life stage.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Family-Friendly Meal Planning</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Receive coordinated meal plans and grocery lists that support the nutritional needs of all family members while considering preferences and dietary restrictions.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">Safe, Evidence-Based Dosing</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        All recommendations follow age-appropriate, safe dosing guidelines based on analysis of over 5,000 peer-reviewed studies, with careful attention to avoiding excessive intake.
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
                      <h3 className="text-xl font-bold text-dark-primary mb-3">24/7 Family Health Support</h3>
                      <p className="text-dark-secondary leading-relaxed">
                        Access round-the-clock AI guidance for questions about your family's nutrition plan, with regular reassessments as children grow and family needs evolve.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Essential Nutrients for Family Health</h2>

              <p className="text-dark-secondary mb-6 leading-relaxed">
                Certain nutrients are particularly important for supporting family health across different age groups:
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-8">
                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Immune Support</h3>
                      <p className="text-dark-secondary text-sm">Vitamin C and zinc support immune function for all family members, with age-appropriate dosing.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Growth & Development</h3>
                      <p className="text-dark-secondary text-sm">Calcium and vitamin D support bone health in growing children and bone maintenance in adults.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Energy & Vitality</h3>
                      <p className="text-dark-secondary text-sm">B-vitamins and iron support energy production and help combat fatigue in busy family members.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-dark-primary mb-2">Cognitive Function</h3>
                      <p className="text-dark-secondary text-sm">Omega-3 fatty acids support brain health and cognitive development in children and cognitive maintenance in adults.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 my-8">
                <h3 className="text-xl font-bold text-dark-primary mb-4 flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-dark-accent" />
                  Family Wellness Foundation
                </h3>
                <p className="text-dark-secondary leading-relaxed">
                  Nutritional support works best when combined with healthy family habits: consistent sleep schedules (age-appropriate hours), regular physical activity, adequate hydration, and stress management techniques for the whole family.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Real Family Success Stories</h2>

              <div className="bg-gradient-to-r from-dark-accent/10 to-dark-panel border border-dark-accent/30 rounded-xl p-6 my-8">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-dark-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark-secondary leading-relaxed mb-4">
                      <em>"Managing nutrition for our family of five was overwhelming until we found SupplementScribe's Family Plan. Having personalized recommendations for each family member, from our toddler to my husband and me, has simplified our approach and improved everyone's energy levels."</em>
                    </p>
                    <p className="text-dark-primary font-medium">— Lisa K., Mother of Three, SupplementScribe Family Plan Member</p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-dark-primary mt-12 mb-6">Start Your Family's Health Journey</h2>
              
              <p className="text-dark-secondary mb-6 leading-relaxed">
                Supporting your family's health doesn't have to be complicated. Discover how personalized nutrition can help every family member thrive.
              </p>

              <div className="bg-dark-panel border border-dark-border rounded-xl p-8 my-8 text-center">
                <h3 className="text-2xl font-bold text-dark-primary mb-4">Ready to Support Your Family's Health?</h3>
                <p className="text-dark-secondary mb-6 leading-relaxed">
                  Join families who've discovered the benefits of personalized nutrition for every family member's unique needs and health goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signup">
                    <button className="inline-flex items-center px-6 py-3 text-lg font-bold text-dark-background bg-dark-accent rounded-lg hover:bg-dark-accent/90 transition-all duration-200">
                      Start Your Family Plan
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
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How does the Family Plan work for different ages?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Each family member receives an individual assessment and personalized recommendations appropriate for their age, from toddlers to seniors, ensuring safe and effective nutritional support.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">Is the Family Plan cost-effective compared to individual supplements?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Yes, the Family Plan at $70/month for 2-9 people typically costs less than purchasing individual supplements for each family member, while providing personalized optimization that generic multivitamins can't offer.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How do you ensure supplement safety for children?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    All pediatric recommendations follow established safety guidelines and age-appropriate dosing. We prioritize nutrients that are difficult to obtain from food alone and avoid potentially harmful excessive doses.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">Can the plan accommodate special dietary needs or restrictions?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Yes, our meal planning and supplement recommendations can be customized to accommodate various dietary restrictions, allergies, and preferences while still meeting each family member's nutritional needs.
                  </p>
                </div>

                <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-dark-primary mb-3">How quickly might we see improvements in family health?</h3>
                  <p className="text-dark-secondary leading-relaxed">
                    Individual results vary, but many families report improvements in energy levels, immune function, and overall well-being within 2-6 weeks of starting their personalized family nutrition plan.
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
            <Link href="/content/give-body-fighting-chance-personalized-supplements-everyday" className="group">
              <div className="bg-dark-panel border border-dark-border rounded-xl p-6 hover:border-dark-accent transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="h-5 w-5 text-dark-accent" />
                  <span className="text-sm text-dark-accent font-medium">Daily Wellness</span>
                </div>
                <h3 className="text-lg font-bold text-dark-primary mb-2 group-hover:text-dark-accent transition-colors">
                  Give Your Body a Fighting Chance: Personalized Supplements
                </h3>
                <p className="text-dark-secondary text-sm">
                  Discover how personalized supplements can support your daily wellness and vitality.
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
                  How AI is Making Personalized Health Affordable
                </h3>
                <p className="text-dark-secondary text-sm">
                  Learn how AI technology is making personalized health accessible for everyone.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-dark-panel border-t border-dark-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-dark-primary mb-4">Stay Updated on Family Health Research</h2>
          <p className="text-dark-secondary mb-8 max-w-2xl mx-auto">
            Get the latest insights on family nutrition, child development, and evidence-based wellness strategies for the whole household delivered to your inbox.
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
