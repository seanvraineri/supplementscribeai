'use client'

import { motion } from 'framer-motion';
import {
  LogIn,
  ArrowRight,
  BarChart3,
  FlaskConical,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

// Simplified Navigation for this page
const Navigation = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-background/80 backdrop-blur-md border-b border-dark-border">
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="flex items-center justify-between h-16">
        <Link
          href="/"
          className="text-xl font-bold text-dark-primary tracking-tight"
        >
          SupplementScribe
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/how-it-works" className="text-dark-accent font-medium">
            How It Works
          </Link>
          <Link
            href="/for-everyone"
            className="text-dark-secondary hover:text-dark-primary transition-colors"
          >
            For Everyone
          </Link>
          <Link
            href="/science"
            className="text-dark-secondary hover:text-dark-primary transition-colors"
          >
            Science
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
    className="bg-dark-panel p-8 rounded-2xl border border-dark-border"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
  >
    <div className="p-4 bg-dark-accent/10 rounded-xl mb-6 inline-block">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    <p className="text-dark-secondary leading-relaxed">{description}</p>
  </motion.div>
);

export default function HowItWorksPage() {
  return (
    <main className="bg-dark-background text-dark-primary font-sans">
      <Navigation />
      {/* Hero Section */}
      <section className="pt-40 pb-24 text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-dark-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Precision Nutrition, Made Simple.
          </motion.h1>
          <motion.p
            className="text-xl text-dark-secondary max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            We use data, not guesswork, to create a supplement plan that is
            scientifically designed for you. Here's how.
          </motion.p>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-24 bg-dark-panel/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Why Most Supplements Don't Work for You
            </h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              Standard formulas fail because they ignore the unique combination of
              factors that make you, you: your lifestyle, diet, goals, and
              biology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Your Path to Personalized Health
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            <StepCard
              icon={<BarChart3 className="w-10 h-10 text-dark-accent" />}
              title="1. The 5-Minute AI Health Assessment"
              description="Our smart assessment builds a holistic picture of your health by analyzing your goals, lifestyle, and symptoms. For even deeper insight, you can optionally add biomarker data."
              delay={0}
            />
            <StepCard
              icon={<FlaskConical className="w-10 h-10 text-dark-accent" />}
              title="2. Your Data-Driven, Personalized Plan"
              description="Our AI instantly creates your custom formula with transparent ingredients and precise dosages, all backed by scientific evidence. You get to see the 'why' behind every recommendation."
              delay={0.1}
            />
            <StepCard
              icon={<TrendingUp className="w-10 h-10 text-dark-accent" />}
              title="3. Track, Adapt, and Thrive"
              description="Receive your daily packs and use our daily symptom tracker to monitor progress. Your formula adapts as your needs change, ensuring you're always optimized."
              delay={0.2}
            />
          </div>

          <motion.div
            className="mt-24 bg-dark-panel border border-dark-accent/30 rounded-2xl p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4 text-dark-accent">
              How can our AI know what you need?
            </h3>
            <p className="text-dark-secondary max-w-3xl mx-auto leading-relaxed">
              Our AI is built on a model trained on vast datasets from
              scientific literature. This allows it to link your answers about
              symptoms and lifestyle to known biomarker levels and biological
              needs. It's like how an experienced doctor can deduce a great
              deal about your health just by asking the right questions—our AI
              does this at a massive scale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            className="text-center bg-gradient-to-r from-dark-panel/50 to-dark-panel/30 border border-dark-border rounded-2xl p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl font-bold mb-6 text-dark-primary">
              Stop Guessing. Start Knowing.
            </h3>
            <Link href="/auth/signup">
              <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-dark-background bg-dark-accent rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-lg shadow-dark-accent/20">
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