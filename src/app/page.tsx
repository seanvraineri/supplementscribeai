'use client'

import { motion, Variants } from 'framer-motion';
import { CheckCircle, ChevronsRight, ChevronDown, LogIn, Database, Users, Brain, Dna, HeartHandshake, Microscope } from 'lucide-react';
import { Disclosure } from '@headlessui/react';
import Link from 'next/link';
import { SVGProps } from 'react';
import BackgroundAnimation from '@/components/BackgroundAnimation';

// Re-using the dark, animated gradient from the dashboard for a consistent theme
const DashboardGradient = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden bg-dark-background">
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
  </div>
);

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

export default function HomePage() {
  const headline = ["This", "Isn't", "Wellness.", "This", "is", "Precision."];
  const subheadline = ["Your", "biology", "is", "unique.", "Your", "supplement", "plan", "should", "be", "too."];

  const FADE_IN_ANIMATION_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  const faqItems = [
    { question: "How does SupplementScribe personalize my plan?", answer: "We use a sophisticated AI engine to analyze your blood biomarker data, genetic test results, and health questionnaires. This allows us to identify your unique nutritional needs and potential deficiencies, creating a supplement plan that is precisely tailored to your biology." },
    { question: "Is my health data secure?", answer: "Absolutely. We use end-to-end encryption and follow HIPAA best practices to ensure your personal and health data is stored securely and remains confidential. We never sell your data." },
    { question: "Can I use my own doctor's lab results?", answer: "Yes. You can securely upload recent lab results from your doctor or other testing services. Our platform can parse and analyze standard PDF lab reports to integrate into your health profile." },
    { question: "What if my needs change?", answer: "Your biology isn't static, and your plan shouldn't be either. We recommend re-analyzing your data every 3-6 months. Your subscription includes monthly plan updates based on your ongoing tracking and any new data you provide." }
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
      <Navigation />
      <DashboardGradient />
      
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center pt-32 pb-24">
        <BackgroundAnimation />
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
          <motion.h1 
            className="text-5xl md:text-8xl font-bold tracking-tight mb-6 text-dark-primary"
            variants={{
              hidden: {},
              show: {},
            }}
          >
            {headline.map((word, i) => (
              <motion.span key={i} variants={FADE_IN_ANIMATION_VARIANTS} className={`inline-block ${i !== headline.length - 1 ? 'mr-4' : ''}`}>
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-dark-secondary mb-10 max-w-2xl mx-auto"
             variants={{
              hidden: {},
              show: {},
            }}
          >
             {subheadline.map((word, i) => (
              <motion.span key={i} variants={FADE_IN_ANIMATION_VARIANTS} className={`inline-block ${i !== subheadline.length - 1 ? 'mr-2' : ''}`}>
                {word}
              </motion.span>
            ))}
          </motion.p>
          <motion.div variants={FADE_IN_ANIMATION_VARIANTS}>
            <Link href="/auth/signup">
              <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-dark-background bg-dark-accent rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105">
                <span className="relative flex items-center">
                  Start My Plan <ChevronsRight className="ml-2 h-5 w-5" />
                </span>
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Learn More Navigation */}
      <section className="py-16 bg-dark-panel/30 border-t border-dark-border">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-dark-primary">Learn More</h2>
            <p className="text-dark-secondary max-w-2xl mx-auto">
              Discover how personalized nutrition can work for you
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "How It Works",
                description: "Understanding the science behind personalized nutrition and why your biology matters",
                href: "/how-it-works",
                icon: <Dna className="w-8 h-8 text-dark-accent" />
              },
              {
                title: "For Everyone",
                description: "How everyday people benefit from personalized nutrition without being health experts",
                href: "/for-everyone", 
                icon: <HeartHandshake className="w-8 h-8 text-dark-accent" />
              },
              {
                title: "The Science",
                description: "Research evidence and genetic variations that influence your nutritional needs",
                href: "/science",
                icon: <Microscope className="w-8 h-8 text-dark-accent" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={item.href}>
                  <div className="group bg-dark-panel border border-dark-border rounded-2xl p-8 text-center hover:border-dark-accent transition-all duration-300 cursor-pointer h-full">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-dark-accent/10 rounded-2xl mb-6">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-dark-primary group-hover:text-dark-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-dark-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-dark-background/50 backdrop-blur-lg border-t border-b border-dark-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <motion.h2 
              className="text-4xl font-bold tracking-tight text-dark-primary"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              The Future of Personal Health
            </motion.h2>
            <motion.p 
              className="text-lg text-dark-secondary mt-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              We translate your unique biological data into a supplement plan that is precisely yours, in three simple steps.
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 text-dark-primary">
            {[
              { icon: <AnalyzeIcon />, title: "1. Analyze Data", description: "Securely upload your lab results or connect your health accounts. Our AI analyzes your biomarkers and genetic data." },
              { icon: <PlanIcon />, title: "2. Get Your Plan", description: "Receive a personalized supplement plan based on your unique needs, with clear explanations for each recommendation." },
              { icon: <ShipIcon />, title: "3. Ship & Track", description: "Your personalized daily supplement packs are shipped to your door. Track your progress and adapt your plan over time." }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-dark-panel rounded-2xl mb-6 border border-dark-border shadow-md text-dark-accent">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-dark-secondary">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
            <h2 className="text-4xl font-bold tracking-tight text-dark-primary">Your Precision Panel</h2>
            <p className="text-lg text-dark-secondary mt-4 max-w-3xl mx-auto">
              This isn't just a list of pills. It's a direct line to your biology. See what you're taking, why you're taking it, and the data that backs it up.
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-dark-primary">
              <div className="md:col-span-1 space-y-3">
                <h3 className="font-semibold text-dark-secondary px-2">Your Daily Formula</h3>
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
              <div className="md:col-span-2 bg-dark-background rounded-2xl p-6 border border-dark-border">
                <h4 className="text-2xl font-bold mb-1">Ashwagandha</h4>
                <p className="text-sm text-dark-secondary mb-6">KSM-66® Full Spectrum Extract</p>
                <div className="space-y-4">
                  <p>Selected to regulate your elevated cortisol levels, identified from your biomarker data. Ashwagandha is an adaptogen that helps your body manage stress, which can improve sleep, energy, and overall well-being.</p>
                  <div className="bg-dark-panel p-4 rounded-lg border border-dark-border">
                    <p className="text-sm font-semibold text-dark-secondary">Data Point:</p>
                    <p className="font-mono text-sm text-dark-accent">Cortisol: 19.2 ug/dL (Optimal: &lt;15 ug/dL)</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-dark-secondary/50 mt-6">Dashboard preview. Actual results may vary.</p>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonial Marquee Section */}
      <section className="py-24 bg-dark-background/50 backdrop-blur-lg border-t border-b border-dark-border overflow-hidden">
         <h2 className="text-4xl font-bold tracking-tight text-center mb-16 text-dark-primary">Trusted by the Health Obsessed</h2>
         <div className="relative flex overflow-hidden">
           <motion.div 
             className="flex"
             animate={{ x: ['0%', '-100%'] }}
             transition={{ ease: 'linear', duration: 40, repeat: Infinity }}
           >
             {duplicatedTestimonials.map((t, i) => (
                <div key={`p1-${i}`} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-6">
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

      {/* Pricing Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto bg-dark-panel border border-dark-border rounded-3xl p-10 text-center shadow-2xl shadow-black/20"
          >
            <h3 className="text-3xl font-bold mb-4 text-dark-primary">One Plan, Total Precision</h3>
            <div className="text-6xl font-bold mb-4 text-dark-primary">
              $75<span className="text-2xl text-dark-secondary">/month</span>
            </div>
            <ul className="space-y-3 text-left mb-8 text-dark-primary">
              <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-dark-accent flex-shrink-0" /> Personalized daily supplement pack</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-dark-accent flex-shrink-0" /> AI-driven monthly plan updates</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-dark-accent flex-shrink-0" /> Optional lab & genetic integration</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-dark-accent flex-shrink-0" /> Ongoing progress tracking</li>
            </ul>
            <Link href="/auth/signup">
              <button className="group relative inline-flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-dark-background bg-dark-accent rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105">
                <span className="relative">Get Started</span>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
      
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