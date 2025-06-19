"use client";

import { useFormContext } from 'react-hook-form';
import { OnboardingData } from '@/lib/schemas';
import { motion } from 'framer-motion';
import { LIFESTYLE_QUESTIONS } from './02-LifestyleAssessment';
import { User, Heart, AlertTriangle, Activity, Shield, Dna, Check } from 'lucide-react';

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="bg-dark-panel border border-dark-border rounded-lg p-4"
  >
    <div className="flex items-center mb-3">
      <Icon className="w-5 h-5 text-dark-accent mr-3" />
      <h3 className="font-semibold text-dark-primary">{title}</h3>
    </div>
    <div className="text-sm text-dark-secondary space-y-2 pl-8 capitalize">
      {children}
    </div>
  </motion.div>
);

const Detail = ({ label, value }: { label: string, value?: React.ReactNode }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null;
  }
  return (
    <div className="flex justify-between items-start">
      <span className="font-medium text-dark-secondary/80 mr-4">{label}:</span>
      <span className="text-right text-dark-primary font-medium">{value}</span>
    </div>
  );
};

export function ReviewStep() {
  const { getValues } = useFormContext<OnboardingData>();
  const data = getValues();

  const healthGoals = data.healthGoals?.filter(g => g !== 'custom').map(g => g.replace(/_/g, ' ')).join(', ') || 'None';
  
  const lifestyleAnswers = LIFESTYLE_QUESTIONS
    .map(q => ({ question: q.question, answer: data[q.key as keyof OnboardingData] as string }))
    .filter(item => item.answer)
    .slice(0, 5); // Show first 5 answered for brevity

  return (
    <div className="space-y-6 w-full max-w-lg mx-auto text-left">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-dark-primary mb-1">
          {data.fullName?.split(' ')[0] || 'User'}, your plan to feel like a Superhero is almost here.
        </h2>
        <p className="text-dark-secondary">Please review your information below before we create your plan.</p>
      </motion.div>

      <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 rounded-lg">
        <Section title="Personal Details" icon={User}>
          <Detail label="Full Name" value={data.fullName} />
          <Detail label="Age" value={data.age} />
          <Detail label="Gender" value={data.gender} />
          <Detail label="Height" value={data.height_ft && data.height_in ? `${data.height_ft} ft ${data.height_in} in` : ''} />
          <Detail label="Weight" value={data.weight_lbs ? `${data.weight_lbs} lbs` : ''} />
        </Section>

        <Section title="Health Goals" icon={Heart}>
          <Detail label="Primary Goals" value={healthGoals} />
          <Detail label="Custom Goal" value={data.customHealthGoal} />
        </Section>
        
        <Section title="Primary Health Concern" icon={AlertTriangle}>
          <p className="text-dark-primary font-medium">{data.primary_health_concern || 'Not provided'}</p>
        </Section>

        <Section title="Lifestyle" icon={Activity}>
          <Detail label="Activity" value={data.activity_level?.replace(/_/g, ' ')} />
          <Detail label="Sleep" value={data.sleep_hours ? `${data.sleep_hours} hours / night` : ''} />
          <Detail label="Alcohol" value={data.alcohol_intake} />
        </Section>

        <Section title="Health Profile" icon={Shield}>
          <Detail label="Allergies" value={data.allergies?.map(a => a.value).join(', ') || 'None'} />
          <Detail label="Conditions" value={data.conditions?.map(c => c.value).join(', ') || 'None'} />
          <Detail label="Medications" value={data.medications?.map(m => m.value).join(', ') || 'None'} />
        </Section>

        {(data.known_biomarkers || data.known_genetic_variants) && (
          <Section title="Optional Data" icon={Dna}>
            <Detail label="Biomarkers" value={data.known_biomarkers} />
            <Detail label="Genetic Variants" value={data.known_genetic_variants} />
          </Section>
        )}
        
        {lifestyleAnswers.length > 0 && (
          <Section title="Lifestyle Q&A Highlights" icon={Check}>
              {lifestyleAnswers.map(item => (
                  <Detail key={item.question} label={item.question.slice(0, 30)+'...'} value={item.answer} />
              ))}
          </Section>
        )}
      </div>
    </div>
  );
} 