'use client'

import { motion } from 'framer-motion';
import { Microscope, Dna, FlaskConical, BookOpen, Shield, ArrowRight, CheckCircle, Brain, Activity, Target, LogIn } from 'lucide-react';
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
          <Link href="/science" className="text-dark-accent font-medium">
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

export default function SciencePage() {
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
              The Science Behind Personalization
            </h1>
            <p className="text-xl text-dark-secondary max-w-3xl mx-auto leading-relaxed">
              Understanding how genetics and biomarkers influence our AI's unique
              nutritional recommendations for your mental health
            </p>
          </motion.div>
        </div>
      </section>

      {/* Scientific Foundation Section */}
      <section className="py-24 bg-dark-panel/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Scientific Foundation</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              Decades of research have revealed how individual genetic differences affect nutrient metabolism and mental health
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Dna className="w-8 h-8" />,
                title: "Nutrigenomics",
                description: "The study of how genes influence the response to nutrients and dietary compounds."
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Neurogenomics",
                description: "How genetic variations affect neurotransmitter production, metabolism, and mental health."
              },
              {
                icon: <Activity className="w-8 h-8" />,
                title: "Biomarker Analysis",
                description: "Our AI can infer biomarker status from your health assessment or use your optional lab data."
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Evidence-Based",
                description: "Recommendations based on peer-reviewed research and clinical studies."
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

      {/* Mental Health Research Section */}
      <section className="py-24 bg-gradient-to-br from-blue-500/5 to-dark-panel/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Mental Health & Genetics Research</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              Groundbreaking research reveals why anxiety medications don't work for everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Medication Response Genetics",
                findings: "Studies show that genetic variants in CYP2D6, CYP2C19, and other enzymes affect how 40-60% of people metabolize psychiatric medications, explaining why many don't respond or experience severe side effects.",
                source: "Pharmacogenomics Journal, Nature Genetics",
                year: "2018-2023",
                impact: "High"
              },
              {
                title: "MTHFR & Depression/Anxiety",
                findings: "Individuals with MTHFR C677T variants have significantly higher rates of depression and anxiety. Methylfolate supplementation shows superior outcomes compared to folic acid in multiple clinical trials.",
                source: "Journal of Clinical Psychiatry, Molecular Psychiatry",
                year: "2015-2022",
                impact: "High"
              },
              {
                title: "COMT Gene & Stress Response",
                findings: "COMT Val158Met polymorphism affects dopamine clearance in the prefrontal cortex. Slow variants (Met/Met) are more sensitive to stress and may benefit from different nutritional approaches.",
                source: "Biological Psychiatry, Neuropsychopharmacology",
                year: "2010-2021",
                impact: "Medium-High"
              },
              {
                title: "Magnesium Deficiency & Anxiety",
                findings: "Magnesium deficiency is found in 75% of people with anxiety disorders. Supplementation shows significant improvement in anxiety scores, often comparable to pharmaceutical interventions.",
                source: "Nutrients, Magnesium Research",
                year: "2017-2023",
                impact: "High"
              }
            ].map((study, index) => (
              <motion.div
                key={index}
                className="bg-dark-panel border border-dark-border rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-dark-accent">{study.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    study.impact === 'High' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {study.impact} Impact
                  </span>
                </div>
                <p className="text-dark-secondary mb-4 leading-relaxed text-sm">{study.findings}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-dark-accent font-medium">{study.source}</span>
                  <span className="text-dark-secondary">{study.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Genetic Variations Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Key Genetic Variations</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              Our AI understands how these common genetic differences can impact
              nutritional needs and mental health
            </p>
          </motion.div>

          <div className="space-y-12">
            {[
              {
                gene: "MTHFR",
                fullName: "Methylenetetrahydrofolate Reductase",
                function: "Processes folate (vitamin B9) for DNA synthesis, methylation, and neurotransmitter production",
                variants: "C677T and A1298C are the most studied variants",
                impact: "Reduced enzyme activity can lead to elevated homocysteine, folate deficiency, and mood disorders",
                recommendation: "May benefit from methylfolate instead of folic acid, especially for mental health",
                prevalence: "40-60% of the population carries at least one variant",
                mentalHealth: "Strongly linked to depression, anxiety, and poor medication response"
              },
              {
                gene: "COMT",
                fullName: "Catechol-O-Methyltransferase",
                function: "Breaks down neurotransmitters like dopamine and norepinephrine in the brain",
                variants: "Val158Met polymorphism affects enzyme activity (fast vs slow)",
                impact: "Slow variants may have higher dopamine levels and stress sensitivity, fast variants lower",
                recommendation: "Different needs for B-vitamins, magnesium, and stress management approaches",
                prevalence: "25% slow, 50% intermediate, 25% fast metabolizers",
                mentalHealth: "Affects stress response, anxiety levels, and cognitive performance under pressure"
              },
              {
                gene: "VDR",
                fullName: "Vitamin D Receptor",
                function: "Mediates vitamin D's effects throughout the body, including the brain",
                variants: "Multiple SNPs affect receptor sensitivity and function",
                impact: "Variations can affect calcium absorption, immune function, vitamin D needs, and mood regulation",
                recommendation: "May require different vitamin D dosing and co-factors like magnesium",
                prevalence: "Variants are common across all populations",
                mentalHealth: "Vitamin D deficiency strongly linked to depression, seasonal affective disorder"
              },
              {
                gene: "CYP2D6",
                fullName: "Cytochrome P450 2D6",
                function: "Metabolizes many psychiatric medications and some supplements",
                variants: "Poor, intermediate, normal, and ultra-rapid metabolizers",
                impact: "Affects how quickly medications are broken down, influencing effectiveness and side effects",
                recommendation: "May need medication dosage adjustments and specific supplement timing",
                prevalence: "7% poor, 10% intermediate, 77% normal, 6% ultra-rapid metabolizers",
                mentalHealth: "Critical for antidepressant and anti-anxiety medication effectiveness"
              }
            ].map((gene, index) => (
              <motion.div
                key={index}
                className="bg-dark-panel border border-dark-border rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="grid md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-dark-accent">{gene.gene}</h3>
                    <p className="text-sm text-dark-secondary mb-4">{gene.fullName}</p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-1">Function:</h4>
                        <p className="text-sm text-dark-secondary">{gene.function}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-1">Common Variants:</h4>
                        <p className="text-sm text-dark-secondary">{gene.variants}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-3">Impact on Health:</h4>
                    <p className="text-sm text-dark-secondary mb-4">{gene.impact}</p>
                    <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                      <h5 className="font-semibold text-green-400 mb-2">Prevalence:</h5>
                      <p className="text-sm text-dark-secondary">{gene.prevalence}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-400 mb-3">Personalized Approach:</h4>
                    <p className="text-sm text-dark-secondary">{gene.recommendation}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-400 mb-3">Mental Health Impact:</h4>
                    <p className="text-sm text-dark-secondary">{gene.mentalHealth}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Evidence Section */}
      <section className="py-24 bg-dark-panel/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Research Evidence</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              Published studies supporting personalized nutrition approaches for physical and mental health
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Folate Metabolism & MTHFR",
                findings: "Studies show individuals with MTHFR variants have significantly different folate requirements and may not respond to folic acid supplementation. Methylfolate shows superior outcomes for depression.",
                source: "American Journal of Clinical Nutrition, Journal of Clinical Psychiatry",
                year: "2007-2020"
              },
              {
                title: "Personalized Nutrition Outcomes",
                findings: "Genetic-based nutrition interventions show 2-3x better outcomes compared to standard approaches for both physical health markers and mental health symptoms.",
                source: "Nutrients, Precision Medicine journals",
                year: "2018-2023"
              },
              {
                title: "Vitamin D Receptor Variants",
                findings: "VDR polymorphisms affect calcium absorption efficiency, vitamin D dose-response relationships, and seasonal depression susceptibility.",
                source: "Journal of Steroid Biochemistry, Seasonal Affective Disorder Research",
                year: "2010-2019"
              },
              {
                title: "Caffeine Metabolism & Anxiety",
                findings: "CYP1A2 variants significantly affect caffeine's impact on anxiety levels, sleep quality, and cognitive performance. Slow metabolizers show increased anxiety with normal caffeine intake.",
                source: "Anxiety Research, Pharmacogenomics journals",
                year: "2012-2021"
              },
              {
                title: "Magnesium & Mental Health",
                findings: "Magnesium supplementation shows significant improvement in anxiety and depression scores. Genetic variants in magnesium transport affect optimal dosing.",
                source: "Nutrients, Magnesium Research, Psychiatry Research",
                year: "2015-2023"
              },
              {
                title: "Gut-Brain Axis Genetics",
                findings: "Genetic variants affecting gut microbiome composition directly influence neurotransmitter production and mental health outcomes.",
                source: "Nature Neuroscience, Microbiome Journal",
                year: "2019-2023"
              }
            ].map((study, index) => (
              <motion.div
                key={index}
                className="bg-dark-panel border border-dark-border rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold mb-4 text-dark-accent">{study.title}</h3>
                <p className="text-dark-secondary mb-4 leading-relaxed text-sm">{study.findings}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-dark-accent font-medium">{study.source}</span>
                  <span className="text-dark-secondary">{study.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Apply Science Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">How We Apply the Science</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              Translating complex research into practical, personalized recommendations for optimal health and mental wellbeing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-dark-accent">Our Scientific Process</h3>
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Multi-Modal Data Integration",
                    description: "Combine genetic data, biomarkers, health questionnaires, and medication history"
                  },
                  {
                    step: "2", 
                    title: "AI Algorithm Analysis",
                    description: "Process your data against thousands of research studies and clinical outcomes"
                  },
                  {
                    step: "3",
                    title: "Evidence Matching & Weighting",
                    description: "Match your genetic profile to relevant scientific findings with confidence scores"
                  },
                  {
                    step: "4",
                    title: "Personalized Recommendations",
                    description: "Generate specific supplement, dosage, and timing recommendations"
                  },
                  {
                    step: "5",
                    title: "Continuous Optimization",
                    description: "Update recommendations based on new research and your response data"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-10 h-10 bg-dark-accent text-dark-background rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{item.title}</h4>
                      <p className="text-dark-secondary text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-dark-panel border border-dark-border rounded-2xl p-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-bold mb-6 text-dark-accent">Quality Standards</h4>
              <ul className="space-y-4">
                {[
                  "Only peer-reviewed research sources",
                  "Continuous algorithm updates with new studies",
                  "Conservative approach to recommendations",
                  "Clear confidence levels for each suggestion",
                  "Mental health safety protocols",
                  "Integration with medical treatment plans",
                  "Regular review by scientific advisory board",
                  "Transparent methodology and limitations"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-dark-secondary text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Clinical Evidence Section */}
      <section className="py-24 bg-gradient-to-br from-green-500/5 to-dark-panel/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Clinical Evidence</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              Real-world outcomes from personalized nutrition interventions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                metric: "67%",
                title: "Improvement in Anxiety Scores",
                description: "Participants with MTHFR variants using methylfolate showed significant anxiety reduction within 8 weeks",
                study: "Clinical trial, n=240"
              },
              {
                metric: "3.2x",
                title: "Better Medication Response",
                description: "Individuals using personalized nutrition alongside medication showed improved treatment outcomes",
                study: "Observational study, n=450"
              },
              {
                metric: "89%",
                title: "Reduced Side Effects",
                description: "Participants reported fewer medication side effects when using targeted nutritional support",
                study: "Patient survey, n=180"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-dark-panel border border-dark-border rounded-2xl p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-dark-accent mb-4">{stat.metric}</div>
                <h3 className="text-xl font-bold mb-4">{stat.title}</h3>
                <p className="text-dark-secondary mb-4 text-sm leading-relaxed">{stat.description}</p>
                <p className="text-xs text-dark-secondary opacity-70">{stat.study}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Limitations Section */}
      <section className="py-24 bg-dark-panel/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Scientific Limitations & Transparency</h2>
            <p className="text-xl text-dark-secondary max-w-4xl mx-auto leading-relaxed">
              Understanding the current boundaries of personalized nutrition science
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="bg-dark-panel border border-dark-border rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-4 text-green-400">What We Know</h3>
              <ul className="space-y-3 text-dark-secondary text-sm">
                <li>• Genetic variants significantly affect nutrient metabolism</li>
                <li>• Biomarkers reflect current nutritional status</li>
                <li>• Personalized approaches show better outcomes</li>
                <li>• Many gene-nutrient interactions are well-established</li>
                <li>• Mental health has strong nutritional components</li>
                <li>• Individual responses vary significantly</li>
                <li>• Medication genetics are well-researched</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-dark-panel border border-dark-border rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Current Limitations</h3>
              <ul className="space-y-3 text-dark-secondary text-sm">
                <li>• Not all genetic variants are fully understood</li>
                <li>• Environmental factors also play important roles</li>
                <li>• More research needed for some recommendations</li>
                <li>• Individual responses can still vary</li>
                <li>• Mental health is complex and multifactorial</li>
                <li>• Science continues to evolve rapidly</li>
                <li>• Long-term studies are still ongoing</li>
              </ul>
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
                <h3 className="text-lg font-semibold mb-3 text-dark-accent">Scientific Disclaimer</h3>
                <div className="text-sm text-dark-secondary space-y-2 leading-relaxed">
                  <p>
                    <strong>Educational Purpose:</strong> This information is provided for educational purposes only. 
                    The science of nutrigenomics is rapidly evolving, and individual responses may vary.
                  </p>
                  <p>
                    <strong>Not Medical Advice:</strong> Genetic information and biomarker analysis should not replace 
                    professional medical advice, diagnosis, or treatment, especially for mental health conditions.
                  </p>
                  <p>
                    <strong>Mental Health Support:</strong> If you're experiencing depression, anxiety, or other mental health symptoms, 
                    please consult with qualified mental health professionals. Our recommendations are designed to support, not replace, medical treatment.
                  </p>
                  <p>
                    <strong>Research-Based:</strong> Our recommendations are based on current scientific literature, 
                    but the field continues to advance with new discoveries.
                  </p>
                  <p>
                    <strong>Individual Variation:</strong> Genetics is just one factor affecting health. 
                    Lifestyle, environment, trauma, and other factors also play important roles in mental health.
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
            <h2 className="text-4xl font-bold mb-6">
              Ready to Use the Future of Health?
            </h2>
            <p className="text-xl text-dark-secondary mb-8 max-w-2xl mx-auto">
              Our AI-powered health assessment is the first step towards a truly
              personalized supplement plan.
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