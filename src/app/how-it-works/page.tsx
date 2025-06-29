'use client'

import { motion } from 'framer-motion';
import {
  LogIn,
  ArrowRight,
  BarChart3,
  FlaskConical,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

const StepCard = ({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    className="bg-dark-panel p-6 sm:p-8 rounded-2xl border border-dark-border"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
  >
    <div className="p-3 sm:p-4 bg-dark-accent/10 rounded-xl mb-4 sm:mb-6 inline-block">
      {icon}
    </div>
    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{title}</h3>
    <p className="text-dark-secondary leading-relaxed text-sm sm:text-base">{description}</p>
  </motion.div>
);

export default function HowItWorksPage() {
  return (
    <main className="bg-dark-background text-dark-primary font-sans">
      <Navigation />
      {/* Hero Section */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 text-center">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <motion.h1
            className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-dark-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            The End of Guesswork.
          </motion.h1>
          <motion.p
            className="text-base sm:text-xl text-dark-secondary max-w-3xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Our system provides a clear, data-driven blueprint to your unique biology. Here is how we build your path to resilience.
          </motion.p>
        </div>
      </section>

      {/* The Problem Section - Expanded */}
      <section className="py-16 sm:py-24 bg-dark-panel/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">First, Understand the Battlefield</h2>
            <p className="text-base sm:text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed px-4">
              Your body is fighting a daily battle against an environment that depletes its resources. Generic solutions fail because they don't understand the complexity of this fight.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <StepCard 
              icon={<TrendingDown className="w-10 h-10 text-red-400" />}
              title="The Food Fallacy"
              description="Modern agriculture has stripped our soil of vital minerals, leaving our food rich in calories but poor in the essential micronutrients your cells need to function."
              delay={0}
            />
            <StepCard 
              icon={<TrendingDown className="w-10 h-10 text-red-400" />}
              title="The Stress Tax"
              description="Chronic stress forces your body to burn through critical resources like Magnesium and B-Vitamins just to keep up, leaving your nervous system and energy reserves bankrupt."
              delay={0.1}
            />
            <StepCard 
              icon={<TrendingDown className="w-10 h-10 text-red-400" />}
              title="The Environmental Assault"
              description="Your body is under constant siege from environmental toxins, which depletes the very antioxidants, like Glutathione, that it needs to protect and repair itself."
              delay={0.2}
            />
          </div>
          
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl sm:text-3xl font-bold mb-6">This leads to the common traps...</h3>
            <div className="flex flex-col lg:flex-row justify-center gap-6 sm:gap-8">
              <div className="bg-dark-panel p-6 rounded-lg border border-dark-border lg:max-w-md text-left">
                <h4 className="font-bold text-white mb-2">The Greens Powder Fallacy</h4>
                <p className="text-dark-secondary text-sm sm:text-base">They provide a "pixie dust" of 70+ ingredients at ineffective doses, where they compete for absorption, rendering them useless.</p>
              </div>
              <div className="bg-dark-panel p-6 rounded-lg border border-dark-border lg:max-w-md text-left">
                <h4 className="font-bold text-white mb-2">The Random Supplement Trap</h4>
                <p className="text-dark-secondary text-sm sm:text-base">Taking single ingredients without a holistic plan can create new nutrient imbalances, making you feel even worse.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-4xl font-bold mb-6">
              Your Blueprint to Biological Resilience
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <StepCard
              icon={<BarChart3 className="w-10 h-10 text-dark-accent" />}
              title="1. The Deep Health Analysis"
              description="This is not a simple quiz. Our comprehensive analysis uses an expert-built AI logic engine to get an X-ray view of your health, identifying the likely root causes behind your symptoms."
              delay={0}
            />
            <StepCard
              icon={<FlaskConical className="w-10 h-10 text-dark-accent" />}
              title="2. Build Your Micronutrient Stack"
              description="We build your complete two-part solution: a Core 6 precision supplement formula for what's missing from your diet, and a synergistic food plan to handle the rest."
              delay={0.1}
            />
            <StepCard
              icon={<TrendingUp className="w-10 h-10 text-dark-accent" />}
              title="3. Adapt and Optimize"
              description="Your biology is always changing, and so is your plan. With daily progress tracking, our system adapts your formula and diet plan to ensure you're always on the fastest path to your goals."
              delay={0.2}
            />
          </div>

          <motion.div
            className="mt-16 sm:mt-24 bg-dark-panel border border-dark-accent/30 rounded-2xl p-8 sm:p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-dark-accent">
              How does our system know what you need?
            </h3>
            <p className="text-dark-secondary max-w-3xl mx-auto leading-relaxed text-sm sm:text-base">
              Our system uses a sophisticated AI logic engine, not a simple quiz. This engine is built upon a vast knowledge base of scientific literature and clinical data, curated by health experts. It analyzes the unique patterns across your symptoms and lifestyle to identify likely root causes and nutritional needs, much like an experienced doctor would—but with the power to cross-reference thousands of data points instantly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <motion.div
            className="text-center bg-gradient-to-r from-dark-panel/50 to-dark-panel/30 border border-dark-border rounded-2xl p-8 sm:p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl sm:text-4xl font-bold mb-6 text-dark-primary">
              Stop Guessing. Start Knowing.
            </h3>
            <Link href="/auth/signup">
              <button className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-dark-background bg-dark-accent rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-lg shadow-dark-accent/20">
                <span className="relative flex items-center">
                  Start Your AI Health Assessment{' '}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 