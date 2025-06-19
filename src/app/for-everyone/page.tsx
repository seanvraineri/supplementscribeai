'use client'

import { motion } from 'framer-motion';
import { Coffee, Moon, Brain, Heart, Users, Clock, DollarSign, ArrowRight, CheckCircle, AlertTriangle, Zap, LogIn } from 'lucide-react';
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
          <Link href="/for-everyone" className="text-dark-accent font-medium">
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

export default function ForEveryonePage() {
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
              Not Just for Health Enthusiasts
            </h1>
            <p className="text-xl text-dark-secondary max-w-3xl mx-auto leading-relaxed">
              Personalized nutrition helps everyday people feel their best without becoming nutrition experts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Common Problems Section */}
      <section className="py-24 bg-dark-panel/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Sound Familiar?</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              These everyday health challenges affect millions of people who just want to feel better
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Coffee className="w-8 h-8" />,
                title: "Always Tired",
                description: "You need 3+ cups of coffee just to function, even after 8 hours of sleep",
                people: "The Busy Parent, Office Worker, Student"
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Brain Fog",
                description: "Struggling to focus during meetings or forgetting simple things",
                people: "The Professional, New Parent, Anyone Over 30"
              },
              {
                icon: <AlertTriangle className="w-8 h-8" />,
                title: "Anxiety Medications Not Working",
                description: "On your second or third anxiety med, still feeling anxious with side effects",
                people: "The Overwhelmed, Medication Resistant, Side Effect Sufferer"
              },
              {
                icon: <Moon className="w-8 h-8" />,
                title: "Poor Sleep",
                description: "Tossing and turning, or waking up feeling unrested",
                people: "The Stressed Worker, Shift Worker, Anxious Mind"
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Mood Swings",
                description: "Feeling irritable, anxious, or down for no clear reason",
                people: "The Overwhelmed Parent, Hormonal Changes, High Stress"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Getting Sick Often",
                description: "Catching every cold that goes around the office",
                people: "The Commuter, Parent, Immune System Struggles"
              }
            ].map((problem, index) => (
              <motion.div
                key={index}
                className="bg-dark-panel border border-dark-border rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-dark-accent/10 rounded-2xl mb-6 text-dark-accent">
                  {problem.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{problem.title}</h3>
                <p className="text-dark-secondary mb-4 leading-relaxed">{problem.description}</p>
                <p className="text-sm text-dark-accent font-medium">{problem.people}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mental Health Reality Section */}
      <section className="py-24 bg-gradient-to-br from-red-500/5 to-dark-panel/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">The Anxiety Medication Reality</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              Millions of people are stuck in the anxiety medication cycle - and it's not their fault
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="bg-dark-panel border border-red-500/20 rounded-2xl p-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-red-400">The Frustrating Cycle</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 font-bold text-sm mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">First Medication Doesn't Work</h4>
                    <p className="text-dark-secondary text-sm">40% of people don't respond to their first anxiety medication</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 font-bold text-sm mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Side Effects Pile Up</h4>
                    <p className="text-dark-secondary text-sm">Weight gain, brain fog, fatigue, sexual dysfunction</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 font-bold text-sm mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Try Another Medication</h4>
                    <p className="text-dark-secondary text-sm">Months of trial and error, hoping the next one works</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 font-bold text-sm mr-4 mt-1">4</div>
                  <div>
                    <h4 className="font-semibold mb-1">Accept "Good Enough"</h4>
                    <p className="text-dark-secondary text-sm">Settle for partial relief because "this is as good as it gets"</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-dark-panel border border-dark-accent/30 rounded-2xl p-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-dark-accent">What If There's a Better Way?</h3>
              <div className="space-y-4">
                <p className="text-dark-secondary leading-relaxed">
                  What if your anxiety isn't just a "chemical imbalance" but also a sign that your brain 
                  isn't getting the nutrients it needs to function properly?
                </p>
                <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-yellow-400">The Missing Piece:</h4>
                  <ul className="text-dark-secondary text-sm space-y-1">
                    <li>• MTHFR variants affect mood-regulating neurotransmitters</li>
                    <li>• Magnesium deficiency can mimic anxiety disorders</li>
                    <li>• B-vitamin variants impact brain chemistry</li>
                    <li>• Gut health directly affects mental health</li>
                  </ul>
                </div>
                <p className="text-dark-secondary leading-relaxed">
                  <strong>This doesn't replace your medication</strong> - it gives your brain the foundation 
                  it needs to work better, potentially making your treatment more effective.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Real People Stories Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Real People, Real Results</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              How personalized nutrition helped everyday people without changing their entire lifestyle
            </p>
          </motion.div>

          <div className="space-y-12">
            {[
              {
                persona: "The Medication-Resistant",
                name: "Lisa, 29",
                problem: "Three different anxiety medications over 18 months, still anxious with weight gain and brain fog",
                solution: "Our AI Health Assessment identified key symptoms related to methylation and stress pathways. A targeted plan with specific B-vitamins and magnesium gave her brain the foundational support it needed.",
                outcome: "Reduced anxiety, better mood, and lost the medication-related weight"
              },
              {
                persona: "The Tired Professional",
                name: "Mark, 42",
                problem: "Drinks 4 cups of coffee a day but still feels exhausted by 3 PM, struggling with motivation",
                solution: "His assessment highlighted markers for low energy production. The AI recommended CoQ10 for cellular energy and a specific, highly-absorbable form of B12, often needed by people with his profile.",
                outcome: "Stable energy throughout the day, improved focus, and better workouts"
              },
              {
                persona: "The Overwhelmed Parent",
                name: "Emily, 34",
                problem: "Juggling work and two kids, constantly feeling stressed, irritable, and not sleeping well",
                solution: "Her health assessment pinpointed high stress and poor sleep patterns. The AI also noted a potential for slower caffeine metabolism based on her reported jitters, suggesting her afternoon coffee was affecting her sleep.",
                outcome: "Better stress resilience, deeper sleep, and more patience with her kids"
              },
              {
                persona: "The Health-Conscious but Confused",
                name: "David, 55",
                problem: "Spends $150/month on supplements from the health food store but isn't sure if they're working",
                solution: "David was taking many supplements but still felt off. Our AI analyzed his intake and compared it to the needs identified in his assessment. It found he was taking the wrong form of 3 key nutrients and getting too much of 2 others, creating imbalances.",
                outcome: "Switched to a simpler, more effective plan for less money and feels better than ever"
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                className="bg-dark-panel border border-dark-border rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-dark-primary">{story.persona}</h3>
                  <span className="text-sm text-dark-secondary">{story.name}</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-400 mb-2">The Challenge:</h4>
                    <p className="text-dark-secondary text-sm">{story.problem}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">Our Approach:</h4>
                    <p className="text-dark-secondary text-sm">{story.solution}</p>
                  </div>
                  <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      <span className="font-semibold text-green-400">Result</span>
                    </div>
                    <p className="text-dark-secondary text-sm">{story.outcome}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Works Section */}
      <section className="py-24 bg-dark-panel/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Why This Works for Everyone</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              You don't need to be a biohacker to benefit from personalized nutrition
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-dark-accent">Simple, Not Complicated</h3>
              <ul className="space-y-4">
                {[
                  "No need to understand genetics or biochemistry",
                  "Clear explanations for every recommendation", 
                  "Start with just a few targeted supplements",
                  "Easy-to-follow daily routine",
                  "No extreme diet changes required",
                  "Works alongside your current medications",
                  "Designed for busy, real-world lifestyles"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 mr-3 flex-shrink-0" />
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
              <h4 className="text-xl font-bold mb-6 text-dark-accent">The Gateway Effect</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-dark-accent text-dark-background rounded-full flex items-center justify-center text-sm font-bold mr-4">1</div>
                  <span className="text-dark-secondary">Start feeling better with targeted supplements</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-dark-accent text-dark-background rounded-full flex items-center justify-center text-sm font-bold mr-4">2</div>
                  <span className="text-dark-secondary">Mental clarity and energy improve</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-dark-accent text-dark-background rounded-full flex items-center justify-center text-sm font-bold mr-4">3</div>
                  <span className="text-dark-secondary">Gain motivation for other healthy habits</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-dark-accent text-dark-background rounded-full flex items-center justify-center text-sm font-bold mr-4">4</div>
                  <span className="text-dark-secondary">Develop a preventive health mindset</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-dark-background border border-dark-border rounded-lg">
                <p className="text-sm text-dark-secondary">
                  <strong className="text-dark-accent">The Result:</strong> You become the person who feels good, 
                  has energy, and makes better choices - not because you forced yourself, but because you finally 
                  have the biological foundation to do so.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cost Comparison Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Affordable for Real People</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              Precision nutrition doesn't have to break the bank - especially compared to the alternatives
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="bg-dark-panel border border-dark-border rounded-2xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-4 text-red-400">Traditional Approach</h3>
              <div className="text-3xl font-bold mb-4">$500+</div>
              <ul className="text-sm text-dark-secondary space-y-2">
                <li>• Functional medicine consultation</li>
                <li>• Multiple lab tests</li>
                <li>• $200+/month supplements</li>
                <li>• Trial and error for months</li>
                <li>• Limited follow-up</li>
                <li>• Often not covered by insurance</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-dark-panel border border-dark-accent rounded-2xl p-8 text-center relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-dark-accent text-dark-background px-4 py-2 rounded-full text-sm font-bold">
                Best Value
              </div>
              <h3 className="text-xl font-bold mb-4 text-dark-accent">SupplementScribe</h3>
              <div className="text-3xl font-bold mb-4">$75</div>
              <ul className="text-sm text-dark-secondary space-y-2">
                <li>• AI-powered genetic analysis</li>
                <li>• Personalized recommendations</li>
                <li>• Targeted supplements included</li>
                <li>• Results from day one</li>
                <li>• Ongoing optimization</li>
                <li>• Works with your doctor</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-dark-panel border border-dark-border rounded-2xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Medication Side Effects</h3>
              <div className="text-3xl font-bold mb-4">$$$</div>
              <ul className="text-sm text-dark-secondary space-y-2">
                <li>• Weight gain programs</li>
                <li>• Additional medications for side effects</li>
                <li>• Lost productivity from brain fog</li>
                <li>• Therapy for medication resistance</li>
                <li>• Quality of life impact</li>
                <li>• Hidden costs add up</li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 bg-dark-background border border-dark-accent/30 rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-2xl font-bold mb-4 text-dark-accent">The Real Savings</h4>
            <p className="text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              When you factor in the cost of ineffective supplements, medication side effects, lost productivity, 
              and reduced quality of life, personalized nutrition often pays for itself within the first month. 
              Plus, you're investing in feeling better, not just managing symptoms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-dark-panel/30">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Feel Your Best?</h2>
            <p className="text-xl text-dark-secondary mb-8 max-w-2xl mx-auto">
              Join thousands of everyday people who discovered their unique nutritional needs and finally feel like themselves again
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup">
                <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-dark-background bg-dark-accent rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105">
                  <span className="relative flex items-center">
                    Start My Plan <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </button>
              </Link>
              <Link href="/how-it-works">
                <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-dark-accent bg-transparent border-2 border-dark-accent rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105">
                  Learn More
                </button>
              </Link>
            </div>
            <p className="text-sm text-dark-secondary mt-6">
              * Individual results may vary. Always consult healthcare providers before making supplement changes.
              <br />
              Not intended to replace medical treatment for anxiety or depression.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 