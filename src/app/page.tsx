'use client'

import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { CheckCircle, ChevronsRight, ChevronDown, LogIn, Database, Users, Brain, Dna, HeartHandshake, Microscope, Search, FlaskConical, TrendingUp } from 'lucide-react';
import { Disclosure } from '@headlessui/react';
import Link from 'next/link';
import { SVGProps } from 'react';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import SupplementComparisonSection from '@/components/SupplementComparisonSection';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import FloatingPanel from '@/components/FloatingPanel';

const ParallaxBackground = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -150]); // Move background slower than scroll

  return (
    <motion.div 
      className="absolute inset-0 -z-10 overflow-hidden bg-dark-background"
      style={{ y }}
    >
      <motion.div
        className="absolute"
        style={{ top: '20%', left: '10%', width: '800px', height: '800px' }}
        animate={{
          backgroundImage: [
            "radial-gradient(circle, rgba(0, 191, 255, 0.08), rgba(13, 13, 13, 0) 60%)",
            "radial-gradient(circle, rgba(0, 191, 255, 0.05), rgba(13, 13, 13, 0) 70%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute"
        style={{ bottom: '10%', right: '5%', width: '600px', height: '600px' }}
        animate={{
          backgroundImage: [
            "radial-gradient(circle, rgba(0, 191, 255, 0.04), rgba(13, 13, 13, 0) 65%)",
            "radial-gradient(circle, rgba(0, 191, 255, 0.07), rgba(13, 13, 13, 0) 55%)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 5 }}
      />
    </motion.div>
  );
};

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
          <a href="#pricing" className="text-dark-secondary hover:text-dark-primary transition-colors">
            Pricing
          </a>
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

// Updated icons for the dark theme
const AnalyzeIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const PlanIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M16 4H8C6.89543 4 6 4.89543 6 6V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V6C18 4.89543 17.1046 4 16 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 14H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 10H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ShipIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const headlines = [
  { text: 'Stop Wasting $2,000+ on Supplements That Don\'t Work', color: '#f87171' }, // red-400
  { text: 'Get What $15,000+ Lab Tests Would Tell You for $9.99', color: '#4ade80' }, // green-400
  { text: 'Finally Know Your Body\'s Secret Blueprint', color: '#60a5fa' }, // blue-400
];

export default function HomePage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % headlines.length);
    }, 2000); // Changed to 2 seconds for dopamine hits

    return () => clearInterval(interval);
  }, []);

  const subheadline = ["Your", "biology", "is", "unique.", "Your", "supplement", "plan", "should", "be", "too."];

  const FADE_IN_ANIMATION_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  // Structured data for SEO and AI GEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "SupplementScribe",
    "description": "AI-powered personalized nutrition and supplement recommendations based on genetics, biomarkers, and health analysis",
    "url": "https://supplementscribe.ai",
    "serviceType": "Personalized Nutrition Analysis",
    "medicalSpecialty": ["Nutritional Medicine", "Personalized Medicine", "Preventive Medicine"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Personalized Supplement Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "DNA-Based Supplement Recommendations",
            "description": "Genetic analysis for personalized supplement selection"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Biomarker-Driven Nutrition Plans",
            "description": "Custom nutrition based on lab values and health markers"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Root Cause Health Analysis",
            "description": "AI-powered analysis to identify underlying health issues"
          }
        }
      ]
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Why don't supplements work for me?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Generic supplements fail because they ignore your unique genetics, biomarkers, and individual health needs. Our AI creates personalized supplement recommendations based on your specific biology."
          }
        },
        {
          "@type": "Question", 
          "name": "Why am I tired all the time?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Chronic fatigue often stems from nutrient deficiencies, hormonal imbalances, or metabolic issues that vary by individual. Our personalized analysis identifies your specific root causes."
          }
        },
        {
          "@type": "Question",
          "name": "How do you create personalized supplement recommendations?", 
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We use AI to analyze your genetics, biomarkers, symptoms, and lifestyle to create custom 6-supplement packs from our catalog of 56 research-backed ingredients."
          }
        }
      ]
    }
  };

  const faqItems = [
    {
      question: 'What is the Deep Health Analysis?',
      answer:
        'It\'s not a simple quiz. It\'s a comprehensive analysis of your health goals, lifestyle, and symptoms. Our analysis identifies patterns to get an "X-ray view" of your biology, identifying the likely root causes of your symptoms without requiring expensive, upfront lab tests.',
    },
    {
      question: 'What is the "Micronutrient Stack"?',
      answer:
        'It\'s our complete, two-part system for restoring your nutritional foundation. It includes: 1) The Core 6 Formula, a precision supplement pack with the vital nutrients you can\'t get from diet alone, and 2) The Synergistic Food Plan, a personalized grocery list to cover the rest.'
    },
    {
      question: 'How do you know what I need without a blood test?',
      answer:
        "Our system uses a sophisticated logic model, not a simple quiz. This model is built upon a vast knowledge base of scientific literature and clinical data, curated by health experts. It analyzes the unique patterns across your symptoms and lifestyle to identify likely root causes and nutritional needs, much like an experienced doctor would—but with the power to cross-reference thousands of data points instantly."
    },
    {
      question:
        'Why not just take a multivitamin or greens powder?',
      answer:
        'Those are "shotgun" approaches that ignore your unique biology. They contain ineffective "pixie dust" dosages and can lead to nutrient competition and imbalances. Our system is a targeted, "sniper rifle" approach, giving you exactly what you need, in the right forms and dosages, for maximum impact.',
    },
    {
      question: 'How are your supplements sourced and tested?',
      answer:
        "We source only the highest-quality, bioavailable ingredients from trusted suppliers. Every batch is third-party tested for purity and potency to ensure you're getting exactly what's on the label, with no contaminants or fillers. Your health and safety are our highest priority.",
    },
  ];

  const testimonials = [
    { quote: "Finally, a supplement plan that understands my body. The data-driven approach is a game-changer.", name: "Alex R.", title: "Biohacker & Founder" },
    { quote: "The most seamless health experience I've ever had. My energy levels have never been better.", name: "Samantha K.", title: "Pro Athlete" },
    { quote: "SupplementScribe eliminated all the guesswork. I feel incredible and have the data to prove it.", name: "Dr. Marcus L.", title: "Naturopathic Doctor" },
    { quote: "This is the future of preventative health. Incredibly precise and easy to follow.", name: "Jessica T.", title: "Quantified Self Enthusiast" },
  ];
  
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <main className="bg-dark-background text-dark-primary font-sans overflow-x-hidden">
      {/* Structured Data for SEO & AI GEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Navigation />
      <ParallaxBackground />
      
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center pt-32 pb-24">
        <BackgroundAnimation />
        
        {/* SEO-Optimized Hidden Content for Search Engines & AI GEO */}
        <div className="sr-only">
          <h1>Why Don't Supplements Work? Personalized AI-Powered Solutions for Common Health Problems</h1>
          <h2>Top Health Pain Points We Solve:</h2>
          <ul>
            <li>Why am I tired all the time? - Chronic fatigue and energy problems</li>
            <li>Gut health destroying my life - Digestive issues and microbiome imbalances</li>
            <li>Weight loss plateau won't budge - Stubborn weight and metabolism issues</li>
            <li>Brain fog ruining my productivity - Cognitive function and mental clarity</li>
            <li>Hormone chaos wreaking havoc - Hormonal imbalances and endocrine issues</li>
            <li>Sleep problems stealing my energy - Insomnia and sleep quality issues</li>
            <li>Supplement side effects nobody talks about - Adverse reactions to generic vitamins</li>
            <li>Wasted thousands on useless supplements - Generic supplement failures</li>
            <li>Normal blood work but feel terrible - Root cause analysis beyond standard tests</li>
            <li>Doctors can't find what's wrong - Unexplained symptoms and health mysteries</li>
          </ul>
          <h2>Our AI-Powered Personalized Nutrition Solutions:</h2>
          <ul>
            <li>DNA-based supplement recommendations using genetic analysis</li>
            <li>Personalized nutrition that actually works for your unique biology</li>
            <li>Custom supplements tailored to your genetics and biomarkers</li>
            <li>AI-powered health optimization and precision dosing</li>
            <li>Biomarker-driven supplement selection from 56 research-backed ingredients</li>
            <li>Root cause analysis to treat the source, not just symptoms</li>
            <li>Personalized 6-supplement packs designed for your specific needs</li>
          </ul>
          <p>Stop wasting money on generic supplements that don't work. Our AI analyzes your genetics, biomarkers, and health profile to create personalized supplement recommendations that address your specific health concerns and root causes.</p>
        </div>

        <motion.div 
          className="container mx-auto px-4 z-10 text-center"
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <div className="flex justify-center flex-col items-center">
            {/* SEO H1 - Hidden but present for search engines */}
            <h1 className="sr-only">
              AI-Powered Personalized Supplement Plans Based on Deep Health Analysis
            </h1>
            
                        {/* Visible Animated Display - The beloved flipping text */}
            <div className="h-32 md:h-40 lg:h-48 xl:h-56 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={headlines[index].text}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="text-center text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-tight"
                  style={{ color: headlines[index].color }}
                >
                  {headlines[index].text}
                </motion.div>
              </AnimatePresence>
            </div>
                      </div>
            <p className="mx-auto mt-12 max-w-2xl text-center text-lg md:text-xl leading-8 text-slate-200">
            What Doctors Can't Tell You (But Should)
          </p>
          <p className="mx-auto mt-2 max-w-3xl text-center text-sm md:text-base leading-7 text-slate-300 px-4">
            We reverse-engineer your body's needs from symptoms → Find the 6 missing pieces → Skip everything else
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 px-4">
            <Link href="/auth/signup">
              <Button
                variant="default"
                className="w-full sm:w-auto bg-dark-accent hover:bg-dark-accent/90 text-dark-background font-bold px-8 py-4 text-lg whitespace-nowrap"
                size="lg"
              >
                <span className="hidden sm:inline">Start for $9.99 First Month</span>
                <span className="sm:hidden">Start $9.99</span>{' '}
                <ChevronsRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/design-preview">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-dark-accent border-2 text-dark-accent hover:bg-dark-accent hover:text-dark-background px-8 py-4 text-lg whitespace-nowrap font-semibold"
                size="lg"
              >
                See The Analysis{' '}
                <Search className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <FloatingPanel>
        {/* Value Shock Section */}
        <section className="py-12 md:py-16 bg-dark-background border-t border-dark-border">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6 px-2">
                What Usually Costs $15,000+ in Lab Tests*
              </h2>
              <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto px-2">
                We've developed an accessible approach to personalized health insights. Get comprehensive analysis for significantly less.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-dark-panel p-4 md:p-6 rounded-2xl border border-dark-border">
                <h3 className="text-lg md:text-xl font-bold text-red-400 mb-3">Traditional Route</h3>
                <div className="space-y-2 text-gray-300 text-sm md:text-base">
                  <p>• Comprehensive Metabolic Panel: $2,500</p>
                  <p>• Nutrient Deficiency Testing: $3,200</p>
                  <p>• Hormone Analysis: $4,800</p>
                  <p>• Genetic Testing: $1,500</p>
                  <p>• Functional Medicine Consult: $800/session</p>
                  <p>• Custom Supplement Formulation: $500/month</p>
                </div>
                <div className="mt-4 pt-4 border-t border-dark-border">
                  <p className="text-red-400 font-bold text-base md:text-lg">Total: $15,000+/year</p>
                </div>
              </div>
              <div className="bg-dark-panel p-4 md:p-6 rounded-2xl border border-dark-accent relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-dark-accent text-dark-background px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold">
                  BREAKTHROUGH
                </div>
                <h3 className="text-lg md:text-xl font-bold text-green-400 mb-3 mt-2">SupplementScribe</h3>
                <div className="space-y-2 text-gray-300 text-sm md:text-base">
                  <p>• Deep Symptom Pattern Analysis: ✓</p>
                  <p>• Nutrient Gap Identification: ✓</p>
                  <p>• Metabolic Pathway Mapping: ✓</p>
                  <p>• Genetic Predisposition Insights: ✓</p>
                  <p>• Personalized Protocol: ✓</p>
                  <p>• Monthly Optimization: ✓</p>
                </div>
                <div className="mt-4 pt-4 border-t border-dark-border">
                  <p className="text-green-400 font-bold text-base md:text-lg">$9.99 first month, then $19.99/month</p>
                </div>
              </div>
              <div className="bg-dark-panel p-4 md:p-6 rounded-2xl border border-dark-border">
                <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-3">The Difference</h3>
                <div className="space-y-3 text-gray-300">
                  <p className="text-xl md:text-2xl font-bold text-white">Significant Savings</p>
                  <div className="space-y-2 text-sm md:text-base">
                    <p>• No waiting for lab results</p>
                    <p>• No expensive doctor visits</p>
                    <p>• No guesswork or trial-and-error</p>
                    <p>• Instant access to insights</p>
                    <p>• Continuously adaptive</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-dark-border">
                  <p className="text-blue-400 font-bold text-sm md:text-base">Same Results, Fraction of Cost</p>
                </div>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-xs text-gray-500 max-w-4xl mx-auto">
                *Cost estimates based on typical functional medicine practice pricing for comprehensive testing and consultations. Individual costs may vary. SupplementScribe provides health analysis and recommendations but is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a healthcare provider before making health decisions.
              </p>
            </div>
          </div>
        </section>
      </FloatingPanel>

      <FloatingPanel>
        {/* Trusted by Section */}
        <section className="py-12 bg-dark-background">
          <div className="container mx-auto px-6 max-w-6xl">
            <p className="text-center text-sm font-bold uppercase tracking-widest text-dark-secondary">
              Designed for the Health-Obsessed
            </p>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
              <div className="flex justify-center items-center">
                <p className="font-bold text-dark-primary text-lg">Julian H. <span className="text-dark-secondary font-normal text-sm">- Founder & CEO</span></p>
              </div>
              <div className="flex justify-center items-center">
                <p className="font-bold text-dark-primary text-lg">Dr. Anya S. <span className="text-dark-secondary font-normal text-sm">- PhD, Neuroscience</span></p>
              </div>
              <div className="flex justify-center items-center">
                <p className="font-bold text-dark-primary text-lg">Catherine M. <span className="text-dark-secondary font-normal text-sm">- Marathoner (at 52)</span></p>
              </div>
              <div className="flex justify-center items-center">
                <p className="font-bold text-dark-primary text-lg">Leo C. <span className="text-dark-secondary font-normal text-sm">- Ironman Triathlete</span></p>
              </div>
            </div>
          </div>
        </section>
      </FloatingPanel>

      <FloatingPanel>
        {/* Supplement Comparison Marketing Section */}
        <SupplementComparisonSection />
      </FloatingPanel>

      <FloatingPanel>
        {/* "Stop Guessing. Start Knowing." Distilled Section */}
        <section className="py-24 bg-dark-background">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-4">
                Stop Guessing. Start Knowing.
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Generic solutions fail because they ignore your unique biology. It's time to stop wasting money and effort on solutions that weren't designed for you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-dark-panel border border-dark-border rounded-2xl">
              {/* Column 1: The Common (Flawed) Approach */}
              <div className="border-r border-dark-border pr-8">
                <h3 className="text-lg font-bold text-dark-secondary mb-4">THE GUESSWORK</h3>
                <div className="space-y-4 text-white">
                  <p>Generic Multivitamins</p>
                  <p>"Kitchen-Sink" Greens Powders</p>
                  <p>Random, Un-Guided Supplements</p>
                </div>
              </div>
              {/* Column 2: The Core Problem */}
              <div className="border-r border-dark-border pr-8">
                <h3 className="text-lg font-bold text-dark-secondary mb-4">THE FATAL FLAW</h3>
                <p className="text-white">
                  They ignore your unique biology, leading to nutrient competition, improper dosages, and new imbalances.
                </p>
              </div>
              {/* Column 3: The Unfortunate Result */}
              <div>
                <h3 className="text-lg font-bold text-dark-secondary mb-4">THE UNFORTUNATE RESULT</h3>
                <div className="space-y-4 text-white">
                  <p>Expensive Placebos</p>
                  <p>New, Unintended Problems</p>
                  <p>You Still Don't Feel Better</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FloatingPanel>

      <FloatingPanel>
        {/* How It Works Section */}
        <section className="py-24 bg-dark-background">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-4">
                Your Blueprint to Biological Resilience
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Our system is designed to overcome these traps with a targeted, synergistic approach built for your unique biology.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 text-center">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="p-4 bg-blue-500/10 rounded-xl mb-4 inline-block">
                  <Search className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center h-24 text-center">
                  1. The Deep Health Analysis
                </h3>
                <p className="text-gray-400">
                  This is not a simple quiz. Our comprehensive analysis uses a sophisticated analysis of your health inputs to get an X-ray view of your health, identifying the likely root causes behind your symptoms.
                </p>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="p-4 bg-blue-500/10 rounded-xl mb-4 inline-block">
                  <FlaskConical className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center h-24 text-center">
                  2. Build Your Micronutrient Stack
                </h3>
                <p className="text-gray-400">
                  We build your complete two-part solution: a Core 6 precision supplement formula for what's missing from your diet, and a synergistic diet plan to handle the rest.
                </p>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="p-4 bg-blue-500/10 rounded-xl mb-4 inline-block">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center h-24 text-center">
                  3. Adapt and Optimize
                </h3>
                <p className="text-gray-400">
                  Your biology is always changing, and so is your plan. With daily progress tracking, your plan adapts your formula and diet plan to ensure you're always on the fastest path to your goals.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FloatingPanel>

      <FloatingPanel>
        {/* Precision Panel Section */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl font-bold tracking-tight text-dark-primary">Your Personalized Micronutrient Stack</h2>
              <p className="text-lg text-dark-secondary mt-4 max-w-3xl mx-auto">
                Our system is designed to divide your nutritional needs into two parts for maximum efficacy and absorption.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="relative bg-dark-panel rounded-3xl p-8 border border-dark-border shadow-2xl shadow-black/30"
            >
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/5 to-transparent rounded-t-3xl" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-dark-primary">
                <div className="md:col-span-1 space-y-3 bg-dark-background rounded-2xl p-6 border border-dark-border">
                  <h3 className="font-semibold text-dark-secondary px-2 mb-4">Part 1: The Core 6 Formula</h3>
                  <p className="text-sm text-dark-secondary px-2 mb-4">The 6 vital nutrients, nearly impossible to get from diet alone, delivered to your door in their most bioavailable forms.</p>
                  {[
                    { name: "Ashwagandha", reason: "Cortisol Regulation", active: true },
                    { name: "Rhodiola Rosea", reason: "Stress Resilience" },
                    { name: "Magnesium Glycinate", reason: "Sleep Quality" },
                    { name: "Vitamin D3+K2", reason: "Bone & Immune Health" },
                    { name: "B-Complex", reason: "Energy Metabolism" },
                    { name: "Omega-3 (EPA/DHA)", reason: "Cognitive Function" },
                  ].map((sup, i) => (
                    <div key={i} className={`p-3 rounded-lg transition-colors cursor-pointer ${sup.active ? 'bg-dark-accent/20 text-dark-accent' : 'hover:bg-dark-border'}`}>
                      <p className="font-bold">{sup.name}</p>
                      <p className="text-sm text-dark-secondary">{sup.reason}</p>
                    </div>
                  ))}
                </div>
                <div className="md:col-span-1 bg-dark-background rounded-2xl p-6 border border-dark-border">
                  <h3 className="font-semibold text-dark-secondary px-2 mb-4">Part 2: The Synergistic Food Plan</h3>
                  <p className="text-sm text-dark-secondary px-2 mb-4">Your personalized grocery list designed to provide the remaining nutrients that are best absorbed from whole foods.</p>
                  <div className="space-y-4">
                    <div className="bg-dark-panel p-4 rounded-lg border border-dark-border">
                      <p className="font-mono text-sm text-dark-accent">Focus: Leafy Greens (for Folate & Potassium)</p>
                    </div>
                     <div className="bg-dark-panel p-4 rounded-lg border border-dark-border">
                      <p className="font-mono text-sm text-dark-accent">Focus: Wild-Caught Salmon (for Omega-3 Synergy)</p>
                    </div>
                     <div className="bg-dark-panel p-4 rounded-lg border border-dark-border">
                      <p className="font-mono text-sm text-dark-accent">Focus: Grass-Fed Beef (for Iron & B12)</p>
                    </div>
                    <div className="bg-dark-panel p-4 rounded-lg border border-dark-border">
                      <p className="font-mono text-sm text-dark-accent">Focus: Berries & Citrus (for Vitamin C & Flavonoids)</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-dark-secondary/50 mt-6">Dashboard preview. Actual results may vary.</p>
            </motion.div>
          </div>
        </section>
      </FloatingPanel>
      
      <FloatingPanel>
        {/* Testimonial Marquee Section */}
        <section className="py-24 bg-dark-background/50 backdrop-blur-lg border-t border-b border-dark-border overflow-hidden">
           <h2 className="text-4xl font-bold tracking-tight text-center mb-16 text-dark-primary">Trusted by the Health Obsessed</h2>
           <div className="relative flex overflow-hidden">
             <motion.div 
               className="flex"
               animate={{ x: ['0%', '-50%'] }}
               transition={{ ease: 'linear', duration: 20, repeat: Infinity }}
             >
               {duplicatedTestimonials.map((t, i) => (
                  <div key={`testimonial-${i}`} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-6">
                     <div className="h-full bg-dark-panel p-8 rounded-2xl border border-dark-border shadow-lg">
                       <p className="text-lg mb-6 text-dark-primary">"{t.quote}"</p>
                       <p className="font-bold text-dark-primary">{t.name}</p>
                       <p className="text-sm text-dark-secondary">{t.title}</p>
                     </div>
                  </div>
               ))}
             </motion.div>
           </div>
        </section>
      </FloatingPanel>

      <FloatingPanel>
        {/* Pricing Section */}
        <section id="pricing" className="py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold tracking-tight text-dark-primary mb-4">Choose Your Health Journey</h2>
              <p className="text-lg text-dark-secondary max-w-3xl mx-auto">
                Select the plan that fits your lifestyle. All plans include our AI-powered health analysis and personalized recommendations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
            >
              {/* Software-Only Plan */}
              <div className="bg-dark-panel border border-dark-border rounded-3xl p-6 shadow-xl shadow-black/20 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    50% OFF FIRST MONTH
                  </span>
                </div>
                <div className="text-center mb-6 mt-2">
                  <h3 className="text-xl font-bold text-dark-primary mb-2">Software-Only</h3>
                  <p className="text-sm text-dark-secondary mb-4">AI analysis & recommendations</p>
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-lg text-dark-secondary line-through">$19.99</span>
                      <span className="text-3xl font-bold text-green-400">$9.99</span>
                      <span className="text-sm text-dark-secondary">first month</span>
                    </div>
                    <div className="text-sm text-dark-primary">
                      Then $19.99/month
                    </div>
                    <div className="text-xs text-dark-secondary mt-1">
                      Cancel anytime • No commitment
                    </div>
                  </div>
                </div>
                <ul className="space-y-3 mb-4 text-dark-primary text-sm">
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Deep Health Analysis</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Personalized Core 6 Formula Plan</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Custom Diet Plan</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Progress Tracking</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Health Score Monitoring</li>
                </ul>
                <div className="mb-6 p-3 bg-dark-background/50 rounded-lg border border-dark-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-dark-primary">Add Monthly Supplements</p>
                      <p className="text-xs text-dark-secondary">Upgrade anytime</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-dark-accent">$75/month total</p>
                      <p className="text-xs text-dark-secondary">($55.01 more)</p>
                    </div>
                  </div>
                </div>
                <Link href="/auth/signup">
                  <button className="w-full px-4 py-2 text-sm font-bold text-dark-primary bg-dark-background border border-dark-border rounded-full hover:bg-dark-border transition-all duration-200">
                    Get Started
                  </button>
                </Link>
              </div>

              {/* Complete Package Plan - Recommended */}
              <div className="bg-dark-panel border-2 border-dark-accent rounded-3xl p-6 shadow-2xl shadow-black/30 relative transform scale-105">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-dark-accent text-dark-background px-4 py-1 rounded-full text-xs font-bold">
                    RECOMMENDED
                  </span>
                </div>
                <div className="text-center mb-6 mt-2">
                  <h3 className="text-xl font-bold text-dark-primary mb-2">Complete Package</h3>
                  <p className="text-sm text-dark-secondary mb-4">Software + physical supplements</p>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-dark-primary">
                      $75<span className="text-sm text-dark-secondary">/month</span>
                    </div>
                    <div className="text-sm text-dark-accent mt-1">
                      $65/month yearly
                    </div>
                  </div>
                </div>
                <ul className="space-y-3 mb-6 text-dark-primary text-sm">
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Everything in Software-Only</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Monthly Core 6 Supplement Pack</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Premium Bioavailable Formulas</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Delivered to Your Door</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> No Sourcing Required</li>
                </ul>
                <Link href="/auth/signup">
                  <button className="w-full px-4 py-2 text-sm font-bold text-dark-background bg-dark-accent rounded-full hover:bg-dark-accent/90 transition-all duration-200 transform hover:scale-105">
                    Get Started
                  </button>
                </Link>
              </div>

              {/* Family Software-Only Plan */}
              <div className="bg-dark-panel border border-dark-border rounded-3xl p-6 shadow-xl shadow-black/20 relative">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-dark-primary mb-2">Family Software</h3>
                  <p className="text-sm text-dark-secondary mb-4">For families (2-9 members)</p>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-dark-primary">
                      $17.99<span className="text-sm text-dark-secondary">/month</span>
                    </div>
                    <div className="text-sm text-dark-accent mt-1">
                      $13.99/month yearly
                    </div>
                    <div className="text-xs text-dark-secondary mt-1">
                      Per person
                    </div>
                  </div>
                </div>
                <ul className="space-y-3 mb-6 text-dark-primary text-sm">
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Everything in Software-Only</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Up to 9 Family Members</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Individual Health Profiles</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Family Discount Pricing</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Separate Tracking Per Person</li>
                </ul>
                <Link href="/auth/signup">
                  <button className="w-full px-4 py-2 text-sm font-bold text-dark-primary bg-dark-background border border-dark-border rounded-full hover:bg-dark-border transition-all duration-200">
                    Get Started
                  </button>
                </Link>
              </div>

              {/* Family Complete Plan */}
              <div className="bg-dark-panel border border-dark-border rounded-3xl p-6 shadow-xl shadow-black/20 relative">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-dark-primary mb-2">Family Complete</h3>
                  <p className="text-sm text-dark-secondary mb-4">Software + supplements for all</p>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-dark-primary">
                      $70<span className="text-sm text-dark-secondary">/month</span>
                    </div>
                    <div className="text-sm text-dark-accent mt-1">
                      $63/month yearly
                    </div>
                    <div className="text-xs text-dark-secondary mt-1">
                      Per person
                    </div>
                  </div>
                </div>
                <ul className="space-y-3 mb-6 text-dark-primary text-sm">
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Everything in Complete Package</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Up to 9 Family Members</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Individual Supplement Packs</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Personalized for Each Member</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 text-dark-accent flex-shrink-0 mt-0.5" /> Family Discount Pricing</li>
                </ul>
                <Link href="/auth/signup">
                  <button className="w-full px-4 py-2 text-sm font-bold text-dark-primary bg-dark-background border border-dark-border rounded-full hover:bg-dark-border transition-all duration-200">
                    Get Started
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <p className="text-sm text-dark-secondary mb-4">
                All plans include 30-day money-back guarantee • Cancel anytime • No setup fees
              </p>
              <div className="flex justify-center items-center space-x-8 text-xs text-dark-secondary">
                <span>✓ HIPAA Compliant</span>
                <span>✓ Bank-Level Security</span>
                <span>✓ 99.9% Uptime</span>
              </div>
            </motion.div>
          </div>
        </section>
      </FloatingPanel>
      
      <FloatingPanel>
        {/* FAQ Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-4xl font-bold text-center mb-12 text-dark-primary">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <Disclosure key={i}>
                  {({ open }) => (
                    <motion.div 
                      className="bg-dark-panel p-6 rounded-2xl border border-dark-border shadow-sm"
                      initial={false}
                      animate={{ backgroundColor: open ? "#1c1c1c" : "#131313" }}
                    >
                      <Disclosure.Button className="w-full flex justify-between items-center text-left text-lg font-medium text-dark-primary">
                        <span>{item.question}</span>
                        <ChevronDown className={`transform transition-transform duration-300 ${open ? 'rotate-180 text-dark-accent' : 'text-dark-secondary'}`} />
                      </Disclosure.Button>
                      <motion.div
                        initial={false}
                        animate={{ height: open ? 'auto' : 0, marginTop: open ? '1.5rem' : 0, opacity: open ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="text-dark-secondary leading-relaxed pt-2">
                          {item.answer}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </Disclosure>
              ))}
            </div>
          </div>
        </section>
      </FloatingPanel>

      {/* Footer */}
      <footer className="bg-dark-panel text-dark-primary py-20 border-t border-dark-border">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Join the Biohacking Class of One</h3>
          <p className="text-dark-secondary mb-8 max-w-xl mx-auto">Get access to the latest in precision health and be the first to know about new features.</p>
          <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3 rounded-full bg-dark-background border border-dark-border text-dark-primary placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent" />
            <button type="submit" className="px-8 py-3 font-bold text-dark-background bg-dark-accent rounded-full">Subscribe</button>
          </form>
        </div>
      </footer>
    </main>
  );
} 