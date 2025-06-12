'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { 
  Dna, 
  FileText, 
  User, 
  BarChart3, 
  MessageSquare, 
  Settings,
  Home,
  Pill,
  Activity,
  Brain,
  ChevronRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Info,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { SVGProps } from 'react';
import SymptomModal from '@/components/SymptomModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  cleanBiomarkerName,
  cleanSnpName,
  getBiomarkerReferenceRange,
  interpretBiomarker,
  interpretSNP,
} from '@/lib/analysis-helpers';

const supabase = createClient();

type TabType = 'dashboard' | 'supplement-plan' | 'analysis' | 'tracking' | 'ai-chat' | 'settings';

const MindIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3a7 7 0 0 0-7 7v3a5 5 0 0 0 5 5h3a4 4 0 0 0 4-4v-1"/>
    <circle cx="12" cy="10" r="2"/>
    <path d="M15 7h.01"/>
  </svg>
);

// New Dark Animated Gradient for the Dashboard
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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [selectedSupplement, setSelectedSupplement] = useState<any>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [extractedData, setExtractedData] = useState({ biomarkers: 0, snps: 0 });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [biomarkersData, setBiomarkersData] = useState<any[]>([]);
  const [snpsData, setSnpsData] = useState<any[]>([]);
  const [expandedBiomarkers, setExpandedBiomarkers] = useState<Set<number>>(new Set());
  const [expandedSnps, setExpandedSnps] = useState<Set<number>>(new Set());
  const [biomarkersExpanded, setBiomarkersExpanded] = useState(false);
  const [snpsExpanded, setSnpsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // AI Chat state
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // Tracking state
  const [activeTrackingTab, setActiveTrackingTab] = useState<'symptoms' | 'supplements'>('symptoms');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [symptomEntries, setSymptomEntries] = useState<any[]>([]);
  const [supplementEntries, setSupplementEntries] = useState<any[]>([]);
  const [adherenceStats, setAdherenceStats] = useState({
    todayAdherence: 0,
    weeklyAverage: 0,
    currentStreak: 0
  });
  
  // Symptom modal state
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<any>(null);

  // Simple tracking state - no constant reloading
  const [dailySupplementsTaken, setDailySupplementsTaken] = useState(false);
  const [symptomRatings, setSymptomRatings] = useState<{[key: string]: number}>({});
  const [hasLoadedToday, setHasLoadedToday] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('Authentication error:', userError);
          router.push('/login');
          return;
        }
        setUser(user);

        // Fetch user profile with error handling
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          
          if (profileError) {
            console.warn('Profile fetch error:', profileError);
          } else {
            setProfile(profileData);
          }
        } catch (error) {
          console.warn('Profile fetch failed:', error);
        }

        // Fetch uploaded files with error handling
        try {
          const { data: filesData, error: filesError } = await supabase
            .from('user_lab_reports')
            .select('file_name, report_type, created_at, status')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (filesError) {
            console.warn('Files fetch error:', filesError);
            setUploadedFiles([]);
          } else {
            setUploadedFiles(filesData || []);
          }
        } catch (error) {
          console.warn('Files fetch failed:', error);
          setUploadedFiles([]);
        }

        // Check for extracted biomarkers and SNPs with error handling
        try {
          const { data: biomarkers, error: biomarkersError } = await supabase
            .from('user_biomarkers')
            .select('*')
            .eq('user_id', user.id);
          
          const { data: snps, error: snpsError } = await supabase
            .from('user_snps')
            .select('*')
            .eq('user_id', user.id);

          if (biomarkersError) {
            console.warn('Biomarkers fetch error:', biomarkersError);
          }
          if (snpsError) {
            console.warn('SNPs fetch error:', snpsError);
          }

          const extractedCounts = {
            biomarkers: biomarkers?.length || 0,
            snps: snps?.length || 0
          };
          setExtractedData(extractedCounts);
          setBiomarkersData(biomarkers || []);
          setSnpsData(snps || []);
        } catch (error) {
          console.warn('Health data fetch failed:', error);
          setExtractedData({ biomarkers: 0, snps: 0 });
          setBiomarkersData([]);
          setSnpsData([]);
        }

        // Fetch existing plan with error handling
        try {
          const { data: planData, error: planError } = await supabase
            .from('supplement_plans')
            .select('plan_details')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (planError) {
            if (planError.code !== 'PGRST116') { // Not found error is expected
              console.warn('Plan fetch error:', planError);
            }
          } else if (planData) {
            setPlan(planData.plan_details);
          }
        } catch (error) {
          console.warn('Plan fetch failed:', error);
        }

      } catch (error) {
        console.error('Critical error in fetchUserData:', error);
        // Don't redirect on data fetch errors, just log them
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const generatePlan = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setPlan(result.plan);
        setActiveTab('supplement-plan'); // Switch to supplement plan tab
  } else {
        console.error('Failed to generate plan:', result.error);
        alert(`Failed to generate supplement plan: ${result.error}`);
      }
    } catch (error: any) {
      console.error('Error generating plan:', error);
      alert(`An error occurred while generating your plan: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Tracking functions - simplified and efficient
  const loadTrackingData = async () => {
    if (hasLoadedToday && selectedDate === new Date().toISOString().split('T')[0]) {
      return; // Don't reload if we already have today's data
    }

    setIsTrackingLoading(true);
    try {
      // Load symptoms for the selected date
      const symptomsResponse = await fetch(`/api/tracking/symptoms?date=${selectedDate}`, {
        credentials: 'include'
      });
      if (symptomsResponse.ok) {
        const { symptoms } = await symptomsResponse.json();
        const ratingsMap: {[key: string]: number} = {};
        symptoms.forEach((symptom: any) => {
          ratingsMap[symptom.symptom_name] = symptom.value;
        });
        setSymptomRatings(ratingsMap);
      }

      // Load supplements for the selected date
      const supplementsResponse = await fetch(`/api/tracking/supplements?date=${selectedDate}`, {
        credentials: 'include'
      });
      if (supplementsResponse.ok) {
        const { supplements } = await supplementsResponse.json();
        const allTaken = supplements.length > 0 && supplements.every((s: any) => s.taken);
        setDailySupplementsTaken(allTaken);
      }

      if (selectedDate === new Date().toISOString().split('T')[0]) {
        setHasLoadedToday(true);
      }
    } catch (error) {
      console.error('Error loading tracking data:', error);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const logSymptom = async (symptomName: string, value: number) => {
    // Update UI immediately - no waiting
    setSymptomRatings(prev => ({
      ...prev,
      [symptomName]: value
    }));

    // Save to database in background
    try {
      await fetch('/api/tracking/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          symptom_name: symptomName,
          value,
          entry_date: selectedDate
        })
      });
    } catch (error) {
      console.error('Error saving symptom:', error);
      // Revert on error
      setSymptomRatings(prev => {
        const newRatings = { ...prev };
        delete newRatings[symptomName];
        return newRatings;
      });
    }
  };

  const toggleSupplements = async (taken: boolean) => {
    // Update UI immediately
    setDailySupplementsTaken(taken);

    // Save to database in background
    if (plan?.recommendations?.length > 0) {
      try {
        const promises = plan.recommendations.map((rec: any) =>
          fetch('/api/tracking/supplements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              supplement_name: rec.supplement,
              dosage: rec.dosage,
              taken,
              entry_date: selectedDate
            })
          })
        );
        await Promise.all(promises);
      } catch (error) {
        console.error('Error saving supplements:', error);
        // Revert on error
        setDailySupplementsTaken(!taken);
      }
    }
  };

  // Load tracking data when tracking tab becomes active
  useEffect(() => {
    if (activeTab === 'tracking') {
      loadTrackingData();
    }
  }, [activeTab, selectedDate]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'supplement-plan', label: 'Supplement Plan', icon: Pill },
    { id: 'analysis', label: 'Comprehensive Analysis', icon: BarChart3 },
    { id: 'tracking', label: 'Tracking', icon: Activity },
    { id: 'ai-chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderDashboardContent = () => (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-primary tracking-tight">Dashboard</h1>
        <p className="text-lg text-dark-secondary mt-1">
          A summary of your personalized health data.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        {/* Biomarkers Panel */}
        <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-dark-border rounded-lg">
              <Activity className="h-6 w-6 text-dark-accent" />
            </div>
            <div>
              <p className="text-dark-secondary text-sm">Biomarkers</p>
              <p className="text-3xl font-bold text-dark-primary">{extractedData.biomarkers}</p>
            </div>
          </div>
        </div>
        {/* Genetic Variants Panel */}
        <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-dark-border rounded-lg">
              <Dna className="h-6 w-6 text-dark-accent" />
            </div>
            <div>
              <p className="text-dark-secondary text-sm">Genetic Variants</p>
              <p className="text-3xl font-bold text-dark-primary">{extractedData.snps}</p>
            </div>
          </div>
        </div>
        {/* Supplements Panel */}
        <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-dark-border rounded-lg">
              <Pill className="h-6 w-6 text-dark-accent" />
            </div>
            <div>
              <p className="text-dark-secondary text-sm">Supplements</p>
              <p className="text-3xl font-bold text-dark-primary">{plan?.recommendations?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Health Reports Panel */}
        <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-5 w-5 text-dark-secondary" />
            <h3 className="text-lg font-semibold text-dark-primary">Health Reports</h3>
          </div>
          {uploadedFiles.length > 0 ? (
            <div className="space-y-3">
              {uploadedFiles.slice(0, 3).map((file, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-dark-background rounded-lg border border-dark-border">
                  <p className="font-medium text-sm text-dark-primary font-mono">{file.file_name}</p>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    file.status === 'parsed' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'
                  }`}>
                    {file.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-dark-secondary mb-4">You haven't uploaded any reports.</p>
              <Button className="rounded-lg bg-dark-border text-dark-primary hover:bg-dark-accent hover:text-white" onClick={() => router.push('/onboarding')}>
                Upload Files
              </Button>
            </div>
          )}
        </div>

        {/* Generate Plan Panel */}
        <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-5 w-5 text-dark-secondary" />
            <h3 className="text-lg font-semibold text-dark-primary">AI-Powered Plan</h3>
          </div>
          <div className="py-4">
            {plan ? (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 bg-green-900/50 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-dark-secondary">Your personalized supplement plan is ready.</p>
                <Button 
                  onClick={() => setActiveTab('supplement-plan')}
                  className="w-full bg-dark-accent text-white hover:bg-dark-accent/80 rounded-lg"
                >
                  View My Plan
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 bg-dark-border rounded-full mx-auto flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-dark-accent" />
                </div>
                <p className="text-dark-secondary">Get a supplement plan based on your unique data.</p>
                <Button 
                  onClick={generatePlan} 
                  disabled={isGenerating}
                  className="w-full bg-dark-accent text-white hover:bg-dark-accent/80 rounded-lg"
                >
                  {isGenerating ? 'Generating...' : 'Generate AI Plan'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupplementPlan = () => (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative bg-dark-panel border border-dark-border rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-dark-primary mb-2">
              Your Personalized Supplement Plan
            </h1>
            <p className="text-lg text-dark-secondary">
              AI-powered recommendations based on your unique health data
            </p>
          </div>
          <Button 
            onClick={generatePlan} 
            disabled={isGenerating}
            className="bg-dark-accent text-white hover:bg-dark-accent/80 transition-all duration-300"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Regenerating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Regenerate Plan
              </div>
            )}
          </Button>
        </div>
      </div>

      {plan ? (
        <div className="space-y-4">
          {plan.recommendations?.map((rec: any, index: number) => (
            <motion.div 
              key={index} 
              className="bg-dark-panel border border-dark-border rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-dark-primary">{rec.supplement}</h3>
                    <p className="text-dark-secondary font-mono">{rec.product?.brand} - {rec.product?.product_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-dark-primary text-lg">{rec.dosage}</p>
                    {rec.timing && <p className="text-dark-secondary text-sm">{rec.timing}</p>}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-dark-border space-y-2">
                  <h4 className="font-semibold text-dark-accent">Reasoning</h4>
                  <p className="text-dark-secondary">{rec.reason}</p>
                </div>
                {rec.citations && rec.citations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-dark-border">
                    <h4 className="font-semibold text-dark-accent mb-2">Scientific Citations</h4>
                    <ul className="space-y-2 text-dark-secondary text-sm font-mono">
                      {rec.citations.map((citation: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-dark-accent mt-1">•</span>
                          <span>{citation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-dark-panel border border-dark-border rounded-lg">
          <Pill className="h-12 w-12 text-dark-secondary mx-auto mb-4" />
          <h3 className="text-xl font-medium text-dark-primary mb-2">No Supplement Plan Generated</h3>
          <p className="text-dark-secondary mb-4">
            Generate your AI-powered plan to get started.
          </p>
          <Button onClick={generatePlan} disabled={isGenerating} className="bg-dark-accent text-white hover:bg-dark-accent/80">
            {isGenerating ? 'Generating...' : 'Generate AI Plan'}
          </Button>
        </div>
      )}
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-dark-primary">Comprehensive Analysis</h1>
        <p className="text-lg text-dark-secondary mt-1">
          Drill down into your biomarker and genetic data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Biomarkers Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-dark-accent" />
            <h2 className="text-2xl font-bold text-dark-primary">Biomarkers ({biomarkersData.length})</h2>
          </div>
          {biomarkersData.length > 0 ? biomarkersData.map((marker, index) => {
            const interpretation = interpretBiomarker(marker);
            const referenceRange = getBiomarkerReferenceRange(marker.marker_name);
            const isExpanded = expandedBiomarkers.has(index);
            
            return (
              <div key={index} className="bg-dark-panel border border-dark-border rounded-lg">
                <div className="p-4 cursor-pointer" onClick={() => toggleBiomarker(index)}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg text-dark-primary">{cleanBiomarkerName(marker.marker_name)}</h4>
                    <span className="font-mono text-dark-accent">{marker.value} {marker.unit}</span>
                  </div>
                  <p className={`text-sm ${interpretation.color === 'red' ? 'text-red-400' : 'text-green-400'}`}>{interpretation.status}</p>
                </div>
                {isExpanded && (
                  <div className="border-t border-dark-border p-4 space-y-4">
                    <div>
                      <h5 className="font-semibold text-dark-secondary mb-1">Reference Range</h5>
                      <p className="font-mono text-dark-primary bg-dark-background p-2 rounded">{referenceRange}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-dark-secondary mb-1">Health Impact</h5>
                      <p className="text-dark-primary">{interpretation.impact}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          }) : (
            <div className="text-center py-12 bg-dark-panel border border-dark-border rounded-lg">
              <p className="text-dark-secondary">No biomarker data available.</p>
            </div>
          )}
        </div>

        {/* SNPs Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Dna className="h-6 w-6 text-dark-accent" />
            <h2 className="text-2xl font-bold text-dark-primary">Genetic Variants ({snpsData.length})</h2>
          </div>
          {snpsData.length > 0 ? snpsData.map((snp, index) => {
             const interpretation = interpretSNP(snp);
             const isExpanded = expandedSnps.has(index);

            return (
              <div key={index} className="bg-dark-panel border border-dark-border rounded-lg">
                <div className="p-4 cursor-pointer" onClick={() => toggleSnp(index)}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg text-dark-primary">{cleanSnpName(snp.snp_id, snp.gene_name)}</h4>
                    <span className="font-mono text-dark-accent">{snp.genotype || snp.allele}</span>
                  </div>
                   <p className={`text-sm ${interpretation.color === 'red' ? 'text-red-400' : interpretation.color === 'orange' ? 'text-yellow-400' : 'text-green-400'}`}>{interpretation.severity}</p>
                </div>
                {isExpanded && (
                  <div className="border-t border-dark-border p-4 space-y-4">
                    <div>
                      <h5 className="font-semibold text-dark-secondary mb-1">Functional Impact</h5>
                      <p className="text-dark-primary">{interpretation.impact}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-dark-secondary mb-1">Associated Symptoms</h5>
                       <p className="text-dark-primary">{interpretation.symptoms}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          }) : (
            <div className="text-center py-12 bg-dark-panel border border-dark-border rounded-lg">
              <p className="text-dark-secondary">No genetic data available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTracking = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-dark-primary">Daily Tracking</h1>
        <p className="text-lg text-dark-secondary mt-1">
          Log your daily supplement intake and symptoms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-dark-primary">Symptom Log</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Energy Level', icon: '⚡' }, { name: 'Sleep Quality', icon: '😴' },
              { name: 'Brain Fog', icon: '🧠' }, { name: 'Mood', icon: '😊' },
              { name: 'Joint Pain', icon: '🦴' }, { name: 'Digestive Health', icon: '🫃' },
              { name: 'Stress Level', icon: '😰' }, { name: 'Focus', icon: '🎯' },
            ].map(symptom => (
              <div key={symptom.name} className="bg-dark-panel border border-dark-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-dark-primary">{symptom.icon} {symptom.name}</h3>
                  {symptomRatings[symptom.name] && <span className="font-mono text-dark-accent">{symptomRatings[symptom.name]}/10</span>}
                </div>
                <div className="grid grid-cols-10 gap-1">
                  {[...Array(10)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => logSymptom(symptom.name, i + 1)}
                      className={`h-7 rounded text-xs font-mono transition-colors ${symptomRatings[symptom.name] === i + 1 ? 'bg-dark-accent text-white' : 'bg-dark-border hover:bg-dark-accent/50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-dark-primary">Supplement Adherence</h2>
          <div className="bg-dark-panel border border-dark-border rounded-lg p-6 text-center">
            <h3 className="font-semibold text-dark-primary mb-4">Did you take your supplements today?</h3>
            <div className="flex gap-4">
              <Button onClick={() => toggleSupplements(true)} className={`flex-1 ${dailySupplementsTaken ? 'bg-dark-accent text-white' : 'bg-dark-border text-dark-secondary'}`}>Yes</Button>
              <Button onClick={() => toggleSupplements(false)} className={`flex-1 ${!dailySupplementsTaken ? 'bg-red-500 text-white' : 'bg-dark-border text-dark-secondary'}`}>No</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIChat = () => (
    <div className="h-full flex flex-col max-h-[calc(100vh-6rem)]">
      <header className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-4xl font-bold text-dark-primary tracking-tight">AI Assistant</h1>
          <p className="text-dark-secondary mt-1">Your personalized health optimization expert.</p>
        </div>
        <Button onClick={startNewConversation} variant="outline" className="bg-dark-panel border-dark-border text-dark-secondary hover:bg-dark-border hover:text-dark-primary">
          New Chat
        </Button>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 h-full flex flex-col">
          <div className="bg-dark-panel border border-dark-border rounded-lg h-full flex flex-col">
            <h3 className="font-semibold text-dark-primary p-4 border-b border-dark-border flex-shrink-0">Chat History</h3>
            <div className="overflow-y-auto p-2 space-y-2 flex-1">
              {chatHistory.map((conv: any) => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={`w-full text-left p-3 rounded-md transition-colors ${currentConversationId === conv.id ? 'bg-dark-accent/20 text-dark-accent' : 'hover:bg-dark-border'}`}
                >
                  <p className="font-semibold truncate">{conv.title}</p>
                  <p className="text-xs text-dark-secondary">{getTimeAgo(conv.updated_at)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-8 h-full flex flex-col">
          <div className="bg-dark-panel border border-dark-border rounded-lg h-full flex flex-col">
            <div ref={chatContainerRef} className="flex-1 p-6 space-y-6 overflow-y-auto">
              {chatMessages.length === 0 && (
                <div className="text-center text-dark-secondary h-full flex flex-col justify-center items-center">
                  <MessageSquare className="h-12 w-12 mb-4"/>
                  <h3 className="text-lg font-semibold text-dark-primary">No messages yet</h3>
                  <p>Start a conversation by asking a question below.</p>
                </div>
              )}
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-dark-accent flex-shrink-0" />}
                  <div className={`p-4 rounded-lg max-w-xl prose prose-invert prose-p:my-0 ${msg.role === 'user' ? 'bg-dark-accent text-white' : 'bg-dark-border text-dark-primary'}`}>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-dark-accent flex-shrink-0" />
                  <div className="p-4 rounded-lg bg-dark-border text-dark-primary">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-dark-accent rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-dark-accent rounded-full animate-pulse delay-75" />
                      <div className="w-2 h-2 bg-dark-accent rounded-full animate-pulse delay-150" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-dark-border flex-shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(chatInput); }} className="flex gap-4">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about your results, supplements, or health..."
                  className="flex-1 bg-dark-background border border-dark-border rounded-lg px-4 py-2 text-dark-primary focus:outline-none focus:ring-2 focus:ring-dark-accent"
                />
                <Button type="submit" disabled={isChatLoading} className="bg-dark-accent text-white hover:bg-dark-accent/80">Send</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <p className="text-gray-600">{profile?.full_name || 'Not set'}</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/onboarding')}>
              Update Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Uploaded Files</p>
                <p className="text-sm text-gray-600">{uploadedFiles.length} files</p>
              </div>
              <Button variant="outline" size="sm">
                Manage Files
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Extracted Data</p>
                <p className="text-sm text-gray-600">
                  {extractedData.biomarkers} biomarkers, {extractedData.snps} genetic variants
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-700">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardContent();
      case 'supplement-plan':
        return renderSupplementPlan();
      case 'analysis':
        return renderAnalysis();
      case 'tracking':
        return renderTracking();
      case 'ai-chat':
        return renderAIChat();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboardContent();
    }
  };

  const toggleBiomarker = (index: number) => {
    const newExpanded = new Set(expandedBiomarkers);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedBiomarkers(newExpanded);
  };

  const toggleSnp = (index: number) => {
    const newExpanded = new Set(expandedSnps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSnps(newExpanded);
  };

  // AI Chat functions - Session Management
  const initializeChatSession = () => {
    if (!currentSessionId) {
      const sessionId = crypto.randomUUID();
      setCurrentSessionId(sessionId);
      return sessionId;
    }
    return currentSessionId;
  };

  const endChatSession = () => {
    setCurrentSessionId(null);
    setCurrentConversationId(null);
    setChatMessages([]);
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isChatLoading) return;

    setIsChatLoading(true);
    
    const userMessage = {
      role: 'user' as const,
      content: message,
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    try {
      const sessionId = initializeChatSession();
      
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message, conversation_id: currentConversationId, session_id: sessionId }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response from server.');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if(parsed.type === 'content') {
                fullResponse += parsed.content;
                setChatMessages(prev => {
                  const newMessages = [...prev];
                  if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
                    newMessages[newMessages.length - 1].content = fullResponse;
                  }
                  return newMessages;
                });
              } else if (parsed.type === 'done') {
                if (parsed.conversation_id && !currentConversationId) {
                  setCurrentConversationId(parsed.conversation_id);
                }
                if (parsed.is_new_session) {
                  loadChatHistory();
                }
              }
            } catch (e) { /* Ignore parsing errors */ }
          }
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Sorry, something went wrong: ${error.message}` }]);
    } finally {
      setIsChatLoading(false);
    }
  };
  
  const loadChatHistory = async () => {
    if (!user?.id) return;
    try {
      const { data: conversations, error } = await supabase
        .from('user_chat_conversations')
        .select('id, title, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (error) {
        console.warn('Error loading chat history:', error);
        setChatHistory([]);
        return;
      }
      setChatHistory(conversations || []);
    } catch (error) {
      console.warn('Chat history fetch failed:', error);
      setChatHistory([]);
    }
  };

  const loadConversation = async (conversationId: string) => {
    endChatSession();
    setCurrentConversationId(conversationId);
    
    try {
      const { data: messages, error } = await supabase
        .from('user_chat_messages')
        .select('role, content, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading conversation:', error);
        return;
      }
      setChatMessages(messages || []);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const startNewConversation = () => {
    endChatSession();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-dark-background text-dark-primary font-sans">
      <DashboardGradient />
      
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-dark-background z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-dark-border border-t-dark-accent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-dark-primary mb-2">Loading Analysis Engine...</h2>
            <p className="text-dark-secondary">Calibrating biometric signature</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {!isLoading && (
          <motion.div 
            className="flex h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Sidebar */}
            <div className="w-64 bg-dark-panel border-r border-dark-border flex flex-col">
              <div className="p-6 border-b border-dark-border">
                <h1 className="text-xl font-bold text-dark-primary tracking-tighter">SupplementScribe</h1>
                {profile?.full_name && (
                  <p className="text-sm text-dark-secondary mt-1">user: {profile.full_name}</p>
                )}
              </div>
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {sidebarItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id as TabType)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                          activeTab === item.id
                            ? 'bg-dark-accent text-white font-semibold'
                            : 'text-dark-secondary hover:bg-dark-border hover:text-dark-primary'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4 border-t border-dark-border">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent border-dark-border text-dark-secondary hover:bg-dark-border hover:text-dark-primary"
                  onClick={() => {
                    supabase.auth.signOut();
                    router.push('/login');
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              <div className="p-8">
                {renderContent()}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 