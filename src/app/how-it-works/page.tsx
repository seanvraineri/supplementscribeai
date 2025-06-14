'use client'

import { motion } from 'framer-motion';
import { CheckCircle, Users, Brain, Heart, Zap, Shield, ArrowRight, Activity, Database, Target, AlertTriangle, LogIn } from 'lucide-react';
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
          <Link href="/how-it-works" className="text-dark-accent font-medium">
            How It Works
          </Link>
          <Link href="/for-everyone" className="text-dark-secondary hover:text-dark-primary transition-colors">
            For Everyone
          </Link>
          <Link href="/science" className="text-dark-secondary hover:text-dark-primary transition-colors">
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

export default function HowItWorksPage() {
  return (
    <main className="bg-dark-background text-dark-primary font-sans">
      <Navigation />
      {/* Hero Section */}
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-dark-primary">
              How Personalized Nutrition Works
            </h1>
            <p className="text-xl text-dark-secondary max-w-3xl mx-auto leading-relaxed">
              Understanding why your unique biology matters for optimal health and wellness
            </p>
          </motion.div>
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
            <h2 className="text-4xl font-bold mb-6">The One-Size-Fits-All Problem</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              Traditional approaches to nutrition and supplements ignore a fundamental truth: 
              every person's biology is unique.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-dark-accent">Common Challenges People Face:</h3>
              <ul className="space-y-4">
                {[
                  "Taking supplements that don't work for their genetics",
                  "Experiencing fatigue despite 'healthy' habits",
                  "Struggling with focus and mental clarity",
                  "On anxiety medications that barely help or cause side effects",
                  "Poor sleep quality and recovery",
                  "Digestive issues and nutrient absorption problems",
                  "Wasting money on generic recommendations"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-dark-accent rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-dark-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="bg-dark-panel border border-dark-border rounded-2xl p-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-bold mb-4 text-dark-accent">Did You Know?</h4>
              <div className="space-y-4 text-dark-secondary">
                <p>• Genetic variations can affect how you process vitamins by up to 70%</p>
                <p>• What works for your friend might not work for you due to different genetic makeup</p>
                <p>• Many people take the wrong form of nutrients for their genetic profile</p>
                <p>• 40% of people on anxiety medications don't respond adequately</p>
                <p>• Personalized approaches can improve outcomes significantly</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mental Health Focus Section */}
      <section className="py-24 bg-gradient-to-br from-dark-background to-dark-panel/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">The Mental Health Connection</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              Many people struggle with anxiety medications that don't work or cause unwanted side effects. 
              Your genetics might hold the key to understanding why.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="bg-dark-panel border border-dark-border rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-2xl mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-red-400">The Problem</h3>
              <ul className="text-dark-secondary space-y-2 text-sm">
                <li>• 40% don't respond to first anxiety medication</li>
                <li>• Side effects: weight gain, fatigue, brain fog</li>
                <li>• Trial and error approach takes months</li>
                <li>• Many give up or accept "good enough"</li>
                <li>• Root nutritional causes ignored</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-dark-panel border border-dark-border rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-2xl mb-6">
                <Brain className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">The Science</h3>
              <ul className="text-dark-secondary space-y-2 text-sm">
                <li>• COMT gene affects neurotransmitter breakdown</li>
                <li>• MTHFR impacts methylation and mood</li>
                <li>• Magnesium deficiency mimics anxiety</li>
                <li>• B-vitamin variants affect brain function</li>
                <li>• Gut-brain axis influences mental health</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-dark-panel border border-dark-accent rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-2xl mb-6">
                <Target className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-green-400">The Solution</h3>
              <ul className="text-dark-secondary space-y-2 text-sm">
                <li>• Target root nutritional deficiencies</li>
                <li>• Support natural neurotransmitter production</li>
                <li>• Optimize methylation pathways</li>
                <li>• Reduce inflammation affecting mood</li>
                <li>• Work alongside medical treatment</li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 bg-dark-background border border-dark-accent/30 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <h4 className="text-2xl font-bold mb-4 text-dark-accent">Real Example: Sarah's Story</h4>
              <p className="text-dark-secondary mb-4 max-w-4xl mx-auto leading-relaxed">
                "I was on three different anxiety medications over two years. Each one either didn't work or made me feel worse. 
                When I discovered I had MTHFR and COMT variants, everything clicked. Targeted B-vitamins and magnesium 
                helped more than any prescription ever did. I still work with my doctor, but now I have the foundation my brain needs."
              </p>
              <p className="text-sm text-dark-secondary italic">
                * Individual results may vary. Always consult healthcare providers before making changes.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Science Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">The Science of Personalization</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              Modern science has revealed how genetic variations influence nutrient needs and metabolism
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Database className="w-8 h-8" />,
                title: "Genetic Variations",
                description: "Common genetic differences (called SNPs) affect how your body processes nutrients, medications, and supplements."
              },
              {
                icon: <Activity className="w-8 h-8" />,
                title: "Biomarker Analysis",
                description: "Blood markers reveal your current nutritional status and help identify deficiencies or imbalances."
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Metabolic Pathways",
                description: "Understanding how your body converts nutrients into energy and building blocks for optimal function."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-dark-panel border border-dark-border rounded-2xl p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-dark-accent/10 rounded-2xl mb-6 text-dark-accent">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-dark-secondary leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Examples Section */}
      <section className="py-24 bg-dark-panel/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Real-World Examples</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              How genetic differences can impact everyday health decisions
            </p>
          </motion.div>

          <div className="space-y-12">
            {[
              {
                title: "Folate Processing (MTHFR Gene)",
                problem: "Some people can't properly convert folic acid from supplements",
                solution: "These individuals may benefit from methylfolate instead",
                impact: "Better energy, mood, and cognitive function",
                mentalHealth: "Can significantly improve anxiety and depression symptoms"
              },
              {
                title: "Neurotransmitter Breakdown (COMT Gene)",
                problem: "Variations affect how quickly dopamine and norepinephrine are cleared",
                solution: "Targeted magnesium and B-vitamin support for optimal brain function",
                impact: "Better focus, mood stability, and stress resilience",
                mentalHealth: "May reduce need for anxiety medications or improve their effectiveness"
              },
              {
                title: "Vitamin D Receptor (VDR Gene)",
                problem: "Variations affect how efficiently vitamin D is utilized",
                solution: "May need different dosing or co-factors like magnesium",
                impact: "Improved immune function and bone health",
                mentalHealth: "Vitamin D deficiency strongly linked to depression and anxiety"
              },
              {
                title: "Caffeine Metabolism (CYP1A2 Gene)",
                problem: "Slow metabolizers may experience jitters or sleep issues",
                solution: "Timing and dosage adjustments for optimal benefits",
                impact: "Better energy without negative side effects",
                mentalHealth: "Prevents caffeine-induced anxiety and sleep disruption"
              }
            ].map((example, index) => (
              <motion.div
                key={index}
                className="bg-dark-panel border border-dark-border rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-6 text-dark-accent">{example.title}</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-red-400">The Challenge:</h4>
                    <p className="text-dark-secondary text-sm">{example.problem}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-yellow-400">Personalized Approach:</h4>
                    <p className="text-dark-secondary text-sm">{example.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-green-400">Physical Outcome:</h4>
                    <p className="text-dark-secondary text-sm">{example.impact}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-400">Mental Health Impact:</h4>
                    <p className="text-dark-secondary text-sm">{example.mentalHealth}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 bg-gradient-to-br from-dark-accent/5 to-dark-panel/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Why This Changes Everything</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              Stop playing guessing games with your health and mental wellbeing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-dark-accent">Traditional Approach Problems:</h3>
              {[
                "Trial and error with supplements for months",
                "Anxiety medications with side effects",
                "Generic recommendations that don't work",
                "Wasted money on ineffective products",
                "Feeling frustrated and hopeless",
                "Accepting 'good enough' mental health"
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  </div>
                  <span className="text-dark-secondary">{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-dark-accent">Personalized Approach Benefits:</h3>
              {[
                "Targeted recommendations from day one",
                "Address root causes of anxiety naturally",
                "Science-backed, genetic-based approach",
                "Save money with precise targeting",
                "Feel confident in your health decisions",
                "Optimize both physical and mental health"
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-dark-secondary">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-16 bg-dark-panel border-t border-dark-border">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            className="bg-dark-background border border-dark-border rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-dark-accent mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-3 text-dark-accent">Important Information</h3>
                <div className="text-sm text-dark-secondary space-y-2 leading-relaxed">
                  <p>
                    <strong>Educational Content:</strong> This information is for educational purposes only and is not intended as medical advice. 
                    Individual results may vary based on genetics, lifestyle, and other factors.
                  </p>
                  <p>
                    <strong>Mental Health Support:</strong> If you're currently taking anxiety or depression medications, do not stop or change them without consulting your healthcare provider. 
                    Our recommendations are designed to work alongside, not replace, professional medical care.
                  </p>
                  <p>
                    <strong>Consult Healthcare Providers:</strong> Always consult with qualified healthcare professionals before making changes to your supplement routine, 
                    especially if you have medical conditions or take medications.
                  </p>
                  <p>
                    <strong>No Medical Claims:</strong> We do not diagnose, treat, cure, or prevent any disease. 
                    Our platform provides educational information and personalized recommendations based on available data.
                  </p>
                  <p>
                    <strong>FDA Statement:</strong> These statements have not been evaluated by the Food and Drug Administration.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Understand Your Unique Biology?</h2>
            <p className="text-xl text-dark-secondary mb-8 max-w-2xl mx-auto">
              Stop guessing and start targeting. Discover how personalized nutrition could work for your individual needs.
            </p>
            <Link href="/auth/signup">
              <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-dark-background bg-dark-accent rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105">
                <span className="relative flex items-center">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 