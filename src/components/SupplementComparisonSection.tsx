'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Zap,
  Brain,
  Target,
  Shield,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Dna,
  Search,
  BarChart3,
  FlaskConical,
  Spline,
  ShieldCheck,
  BookOpen,
  ScanLine,
  Library
} from 'lucide-react';
import Link from 'next/link';

interface ComparisonOption {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  priceDetail: string;
  icon: React.ReactNode;
  gradient: string;
  pros: string[];
  cons: string[];
  bottomLine: string;
  isRecommended?: boolean;
}

const comparisonOptions: ComparisonOption[] = [
  {
    id: 'diy',
    title: 'DIY 6-Bottle Stack',
    subtitle: '$146.50/month + 20+ hours research',
    price: '$146.50',
    priceDetail: '/month + 20+ hours research',
    icon: <AlertTriangle className="w-6 h-6" />,
    gradient: 'from-red-500/20 to-orange-500/20',
    pros: ['Full control over brands and dosages'],
    cons: [
      'No data-driven analysis to guide your choices',
      'High risk of nutrient interactions or incorrect dosages',
      'Ignores your personal health goals and symptoms',
      'Endless research that still results in guesswork',
    ],
    bottomLine: 'More effort and expense for less precision.',
  },
  {
    id: 'ag1',
    title: 'Popular Greens Powder',
    subtitle: '$79–109/month (celebrity-endorsed)',
    price: '$79-109',
    priceDetail: '/month for celebrity-endorsed',
    icon: <Users className="w-6 h-6" />,
    gradient: 'from-green-500/20 to-emerald-500/20',
    pros: ['Tastes okay', 'Good marketing and branding'],
    cons: [
      '"One-size-fits-all" formula ignores your bio-individuality',
      'Lacks targeting for your specific health goals',
      'Proprietary blends can hide ineffective "dusting" of ingredients',
      'Pays for celebrity endorsements, not a personalized formula',
    ],
    bottomLine: 'A trendy drink, not a targeted health solution.',
  },
  {
    id: 'multivitamin',
    title: 'Daily Multivitamin',
    subtitle: '$6–24/month (drugstore convenience)',
    price: '$6-24',
    priceDetail: '/month for drugstore convenience',
    icon: <XCircle className="w-6 h-6" />,
    gradient: 'from-gray-500/20 to-slate-500/20',
    pros: ['Cheap and available everywhere'],
    cons: [
      'Completely generic with zero personalization',
      "Often uses low-quality, poorly absorbed nutrient forms",
      'Fails to address your specific symptoms or objectives',
      "Can create nutrient imbalances by providing things you don't need",
    ],
    bottomLine: 'The illusion of health in a pill.',
  },
  {
    id: 'supplementscribe',
    title: 'SupplementScribe',
    subtitle: '$75/month — truly personalized nutrition',
    price: '$75',
    priceDetail: '/month for personalized nutrition',
    icon: <Brain className="w-6 h-6" />,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    pros: [
      'Personalized formula based on our AI Health Assessment',
      'Analyzes your goals, lifestyle, and symptoms',
      'Option to add biomarker data for ultimate precision',
      'High-absorption bioavailable forms',
      'Adaptive monthly re-optimization',
      'Saves $800+/year vs DIY',
      'Actually works.',
    ],
    cons: [
      'Takes ~5 mins to complete the detailed assessment',
      'Requires brief weekly check-ins to fine-tune your formula.',
    ],
    bottomLine: 'Finally, supplements that make sense for YOUR body — not the label.',
    isRecommended: true,
  }
];

const features = [
  {
    name: 'Dynamic Health Assessment',
    description:
      'Our AI analyzes your goals, lifestyle, and symptoms to build a complete picture of your health needs.',
    icon: <Search className="w-6 h-6" />,
  },
  {
    name: 'Holistic Symptom Analysis',
    description:
      "Go beyond single data points. We analyze how your symptoms connect to guide your personalized formula.",
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    name: 'Personalized Formula Creation',
    description:
      'Receive a supplement plan with precise ingredients and dosages tailored to your unique biology.',
    icon: <FlaskConical className="w-6 h-6" />,
  },
  {
    name: 'Precision Ingredient Matching',
    description:
      'Our engine matches your specific needs to a database of thousands of ingredients for optimal results.',
    icon: <Spline className="w-6 h-6" />,
  },
  {
    name: 'Drug-Nutrient Safety Checks',
    description:
      'Automatically screens for potential interactions with medications you may be taking.',
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  {
    name: 'Evidence-Based Recommendations',
    description:
      'Every ingredient is backed by a database of peer-reviewed scientific literature.',
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    name: 'Symptom-Driven Adaptation',
    description:
      'Your formula evolves over time based on your weekly check-ins and symptom tracking data.',
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    name: 'Product Checker',
    description:
      'Upload a product label and our AI will analyze its quality, ingredients, and potential interactions.',
    icon: <ScanLine className="w-6 h-6" />,
  },
  {
    name: 'Study Buddy',
    description:
      'PubMed research personalized for YOU. Science made simple and relevant.',
    icon: <Library className="w-6 h-6" />,
  },
];

const smartReasons = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: 'They Stop Wasting Money on Guesswork.',
    description:
      'Our AI-driven analysis ensures you only pay for the precise nutrients your body needs, eliminating costly trial-and-error with generic supplements.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'They Make Decisions Based on Data, Not Fads.',
    description:
      'Your personalized plan is generated from your unique health assessment and symptom data, not from marketing trends or celebrity endorsements.',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'They Get a Plan That Evolves With Them.',
    description:
      "Your body's needs change. Through weekly check-ins, your formula adapts to ensure you are always optimized for your current goals and lifestyle.",
  },
];

export default function SupplementComparisonSection() {
  const [showAllDetails, setShowAllDetails] = useState(false);

  const toggleAllDetails = () => {
    setShowAllDetails(!showAllDetails);
  };

  return (
    <section className="py-24 bg-dark-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-panel/10 via-transparent to-dark-panel/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-dark-primary">
            You're Spending $100+ on Supplements.
            <br />
            <span className="text-dark-accent">Are They Actually Working?</span>
          </h2>
          <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
            Most people waste money on generic formulas. Find out what your body
            *actually* needs with our AI Health Assessment.
          </p>
        </motion.div>

        {/* Global Toggle Button */}
        <div className="text-center mb-8">
          <button
            onClick={toggleAllDetails}
            className="inline-flex items-center px-6 py-3 bg-dark-accent/10 border border-dark-accent rounded-full text-dark-accent font-semibold hover:bg-dark-accent/20 transition-all duration-300"
          >
            {showAllDetails ? (
              <>
                <ChevronUp className="w-5 h-5 mr-2" />
                Hide All Details
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5 mr-2" />
                Compare All Details
              </>
            )}
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {comparisonOptions.map((option, index) => (
            <motion.div
              key={option.id}
              className={`relative bg-dark-panel border ${
                option.isRecommended 
                  ? 'border-dark-accent shadow-lg shadow-dark-accent/20' 
                  : 'border-dark-border'
              } rounded-2xl overflow-hidden transition-all duration-300 hover:border-dark-accent/50`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Recommended Badge */}
              {option.isRecommended && (
                <div className="absolute top-4 left-4 bg-dark-accent text-dark-background px-3 py-1 rounded-full text-xs font-bold">
                  RECOMMENDED
                </div>
              )}

              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-50`}></div>
              
              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    option.isRecommended 
                      ? 'bg-dark-accent/20 text-dark-accent' 
                      : 'bg-dark-background/50 text-dark-secondary'
                  }`}>
                    {option.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-dark-primary">{option.price}</div>
                    <div className="text-xs text-dark-secondary">{option.priceDetail}</div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-dark-primary mb-2">{option.title}</h3>
                <p className="text-sm text-dark-secondary mb-4">{option.subtitle}</p>

                {/* Expanded Content - Always show when showAllDetails is true */}
                <AnimatePresence>
                  {showAllDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="mt-4 pt-4 border-t border-dark-border/50"
                    >
                      {/* Pros */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-green-400 mb-2">✨ What You Get:</h4>
                        <ul className="space-y-2">
                          {option.pros.map((pro, idx) => (
                            <li key={idx} className="text-xs text-dark-secondary flex items-start">
                              <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Cons */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Trade-offs:</h4>
                        <ul className="space-y-2">
                          {option.cons.map((con, idx) => (
                            <li key={idx} className="text-xs text-dark-secondary flex items-start">
                              <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Bottom Line */}
                      <div className="bg-dark-background/50 rounded-lg p-3">
                        <p className="text-xs font-medium text-dark-primary">{option.bottomLine}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Features Callout */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <p className="text-lg text-dark-secondary">
              And this doesn't even include our AI features...
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-dark-panel/80 to-dark-panel/60 border border-dark-accent/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-dark-primary">
              World's First AI Supplement Platform
            </h3>
            
            {/* AI Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-dark-panel p-6 rounded-2xl border border-dark-border"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-dark-accent/10 rounded-lg mr-4 text-dark-accent">
                      {feature.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-dark-primary">{feature.name}</h4>
                  </div>
                  <p className="text-dark-secondary text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-2xl font-semibold text-dark-accent">
                Precision nutrition isn't just a concept. It's the feeling of
                getting your energy back.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Why Smart People Choose Section */}
        <motion.div
          className="my-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-dark-primary">
            Why Smart People Choose SupplementScribe
          </h3>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {smartReasons.map((reason, index) => (
              <motion.div
                key={index}
                className="bg-dark-panel p-8 rounded-2xl border border-dark-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-3 bg-dark-accent/10 rounded-lg mr-4 text-dark-accent inline-block mb-4">
                  {reason.icon}
                </div>
                <h4 className="text-xl font-semibold text-dark-primary mb-3">
                  {reason.title}
                </h4>
                <p className="text-dark-secondary">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center bg-gradient-to-r from-dark-panel/50 to-dark-panel/30 border border-dark-border rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-4 text-dark-primary">
            Ready to Stop Wasting Money?
          </h3>
          <p className="text-lg text-dark-secondary mb-8 max-w-2xl mx-auto">
            Stop gambling with generic supplements. Get a plan that's actually designed for your unique body.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Link href="/auth/signup">
              <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-dark-background bg-dark-accent rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-lg shadow-dark-accent/20">
                <span className="relative flex items-center">
                  Get My Personal Plan <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </button>
            </Link>
            <Link href="/how-it-works">
              <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-dark-accent bg-transparent border-2 border-dark-accent rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105">
                See the Science
              </button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-xs text-dark-secondary">
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
              Personalized nutrition
            </span>
            <span className="flex items-center">
              <Shield className="w-4 h-4 text-blue-400 mr-1" />
              Your data stays secure
            </span>
            <span className="flex items-center">
              <Dna className="w-4 h-4 text-purple-400 mr-1" />
              Based on your genetics
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 