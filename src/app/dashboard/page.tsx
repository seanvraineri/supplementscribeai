'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import ReactMarkdown from 'react-markdown';
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
  LogOut,
  Search,
  ExternalLink,
  BookOpen,
  Star,
  TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { useEducationData } from '@/hooks/useEducationData';


const supabase = createClient();

type TabType = 'dashboard' | 'supplement-plan' | 'analysis' | 'tracking' | 'ai-chat' | 'product-checker' | 'study-buddy' | 'settings';

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
  const [userConditions, setUserConditions] = useState<any[]>([]);
  const [userAllergies, setUserAllergies] = useState<any[]>([]);
  const [expandedBiomarkers, setExpandedBiomarkers] = useState<Set<number>>(new Set());
  const [expandedSnps, setExpandedSnps] = useState<Set<number>>(new Set());
  const [biomarkersExpanded, setBiomarkersExpanded] = useState(false);
  const [snpsExpanded, setSnpsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Product Checker state
  const [productUrl, setProductUrl] = useState('');
  const [isCheckingProduct, setIsCheckingProduct] = useState(false);
  const [productAnalysis, setProductAnalysis] = useState<any>(null);
  const [productCheckError, setProductCheckError] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [productHistory, setProductHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // AI Chat state
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  

  
  // Study Buddy state
  const [studyUrl, setStudyUrl] = useState('');
  const [isAnalyzingStudy, setIsAnalyzingStudy] = useState(false);
  const [studyAnalysis, setStudyAnalysis] = useState<any>(null);
  const [studyError, setStudyError] = useState<string | null>(null);

  const [userStudies, setUserStudies] = useState<any[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<any>(null);
  const [isLoadingStudies, setIsLoadingStudies] = useState(false);
  
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

  // Load education data for biomarkers and SNPs
  const { biomarkerEducation, snpEducation, loading: educationLoading } = useEducationData(
    biomarkersData,
    snpsData,
    userConditions,
    userAllergies
  );

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

          const { data: conditions, error: conditionsError } = await supabase
            .from('user_conditions')
            .select('*')
            .eq('user_id', user.id);

          const { data: allergies, error: allergiesError } = await supabase
            .from('user_allergies')
            .select('*')
            .eq('user_id', user.id);

          if (biomarkersError) {
            console.warn('Biomarkers fetch error:', biomarkersError);
          }
          if (snpsError) {
            console.warn('SNPs fetch error:', snpsError);
          }
          if (conditionsError) {
            console.warn('Conditions fetch error:', conditionsError);
          }
          if (allergiesError) {
            console.warn('Allergies fetch error:', allergiesError);
          }

          // Fetch supported SNPs for manual joining
          const { data: allSupportedSnps, error: supportedSnpsError } = await supabase
            .from('supported_snps')
            .select('id, rsid, gene');
          
          // Create lookup map for SNPs
          const snpLookup = new Map();
          if (allSupportedSnps) {
            allSupportedSnps.forEach(snp => {
              snpLookup.set(snp.id, { rsid: snp.rsid, gene: snp.gene });
            });
          }

          // Handle both matched SNPs (with supported_snp_id) and direct SNPs (with snp_id/gene_name)
          const mappedSnps = (snps || []).map(snp => {
            if (snp.supported_snp_id) {
              // SNP linked to supported_snps table
              const supportedSnp = snpLookup.get(snp.supported_snp_id);
              return {
                ...snp,
                snp_id: supportedSnp?.rsid,
                gene_name: supportedSnp?.gene,
                supported_snps: supportedSnp
              };
            } else {
              // SNP with direct fields (backward compatibility)
              return {
                ...snp,
                snp_id: snp.snp_id,
                gene_name: snp.gene_name,
                supported_snps: snp.snp_id && snp.gene_name ? { rsid: snp.snp_id, gene: snp.gene_name } : null
              };
            }
          });

          const extractedCounts = {
            biomarkers: biomarkers?.length || 0,
            snps: mappedSnps?.length || 0
          };
          setExtractedData(extractedCounts);
          setBiomarkersData(biomarkers || []);
          setSnpsData(mappedSnps || []);
          setUserConditions(conditions || []);
          setUserAllergies(allergies || []);
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
      
      const { data, error } = await supabase.functions.invoke('generate-plan', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate supplement plan');
      }

      if (data.success) {
        setPlan(data.plan);
        setActiveTab('supplement-plan'); // Switch to supplement plan tab
      } else {
        console.error('Failed to generate plan:', data.error);
        alert(`Failed to generate supplement plan: ${data.error}`);
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

  // Study Buddy functions
  const analyzeStudy = async () => {
    if (!studyUrl || !user) return;
    
    setIsAnalyzingStudy(true);
    setStudyAnalysis(null);
    setStudyError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('analyze-study', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: { 
          studyUrl: studyUrl
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to analyze study');
      }

      setStudyAnalysis(data);
      setStudyUrl('');
      loadUserStudies(); // Refresh the studies list
    } catch (error: any) {
      setStudyError(error.message);
    } finally {
      setIsAnalyzingStudy(false);
    }
  };

  const loadUserStudies = async () => {
    if (!user) return;
    
    setIsLoadingStudies(true);
    try {
      const { data, error } = await supabase
        .from('user_studies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading studies:', error);
        setUserStudies([]);
      } else {
        setUserStudies(data || []);
      }
    } catch (error) {
      console.error('Failed to load studies:', error);
      setUserStudies([]);
    } finally {
      setIsLoadingStudies(false);
    }
  };



  // Load studies when Study Buddy tab becomes active
  useEffect(() => {
    if (activeTab === 'study-buddy') {
      loadUserStudies();
    }
  }, [activeTab]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'supplement-plan', label: 'Supplement Plan', icon: Pill },
    { id: 'analysis', label: 'Comprehensive Analysis', icon: BarChart3 },
    { id: 'tracking', label: 'Tracking', icon: Activity },
    { id: 'ai-chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'product-checker', label: 'Product Checker', icon: Search },
    { id: 'study-buddy', label: 'Study Buddy', icon: BookOpen },
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
                <p className="text-dark-secondary">No supplement plan generated yet.</p>
                <Button onClick={generatePlan} disabled={isGenerating}>
                  {isGenerating ? 'Generating Plan...' : 'Generate My Personal Plan'}
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
          Deep dive into your biomarker and genetic data with personalized insights and recommendations.
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
            const education = biomarkerEducation[index] || { 
              name: marker.marker_name, 
              description: 'Loading analysis...', 
              recommendations: ['Analysis in progress...'],
              symptoms: ['Loading...'],
              referenceRange: 'Loading...'
            };
            const isExpanded = expandedBiomarkers.has(index);
            
            return (
              <div key={index} className="bg-dark-panel border border-dark-border rounded-lg">
                <div className="p-4 cursor-pointer" onClick={() => toggleBiomarker(index)}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg text-dark-primary">{cleanBiomarkerName(marker.marker_name)}</h4>
                    <span className="font-mono text-dark-accent">{marker.value} {marker.unit}</span>
                  </div>
                  <p className={`text-sm ${interpretation.color === 'red' ? 'text-red-400' : interpretation.color === 'yellow' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {interpretation.status}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-dark-secondary">Click to learn more</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-dark-secondary" /> : <ChevronDown className="h-4 w-4 text-dark-secondary" />}
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-dark-border p-4 space-y-4">
                    <div>
                      <h5 className="font-semibold text-dark-accent mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        What is {cleanBiomarkerName(marker.marker_name)}?
                      </h5>
                      <p className="text-dark-primary text-sm leading-relaxed">{education.description}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-dark-accent mb-2">Reference Range</h5>
                      <p className="font-mono text-dark-primary bg-dark-background p-2 rounded text-sm">{education.referenceRange}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-dark-accent mb-2">Your Result Analysis</h5>
                      <p className="text-dark-primary text-sm leading-relaxed">{education.interpretation}</p>
                    </div>
                    
                    {education.symptoms && (
                      <div>
                        <h5 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Potential Symptoms
                        </h5>
                        <p className="text-dark-primary text-sm leading-relaxed">{education.symptoms}</p>
                      </div>
                    )}
                    
                    <div>
                      <h5 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Personalized Recommendations
                      </h5>
                      <ul className="space-y-1 text-sm">
                        {education.recommendations.map((rec: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span className="text-dark-primary">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {education.interactions && (
                      <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                        <h5 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Important Considerations
                        </h5>
                        <p className="text-red-300 text-sm leading-relaxed">{education.interactions}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          }) : (
            <div className="text-center py-12 bg-dark-panel border border-dark-border rounded-lg">
              <Activity className="h-12 w-12 text-dark-secondary mx-auto mb-4" />
              <p className="text-dark-secondary">No biomarker data available.</p>
              <p className="text-dark-secondary text-sm">Upload lab reports to see detailed analysis.</p>
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
            const education = snpEducation[index] || {
              name: `${snp.gene_name} ${snp.snp_id}`,
              description: 'Loading analysis...',
              recommendations: ['Analysis in progress...'],
              variantEffect: 'Loading...',
              functionalImpact: 'Loading...'
            };
            const isExpanded = expandedSnps.has(index);

            return (
              <div key={index} className="bg-dark-panel border border-dark-border rounded-lg">
                <div className="p-4 cursor-pointer" onClick={() => toggleSnp(index)}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg text-dark-primary">{cleanSnpName(snp.snp_id, snp.gene_name)}</h4>
                    <span className="font-mono text-dark-accent">{snp.genotype || snp.allele}</span>
                  </div>
                  <p className={`text-sm ${interpretation.color === 'red' ? 'text-red-400' : interpretation.color === 'orange' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {interpretation.severity}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-dark-secondary">Click to learn more</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-dark-secondary" /> : <ChevronDown className="h-4 w-4 text-dark-secondary" />}
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-dark-border p-4 space-y-4">
                    <div>
                      <h5 className="font-semibold text-dark-accent mb-2 flex items-center gap-2">
                        <Dna className="h-4 w-4" />
                        What is {cleanSnpName(snp.snp_id, snp.gene_name)}?
                      </h5>
                      <p className="text-dark-primary text-sm leading-relaxed">{education.description}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-dark-accent mb-2">Your Variant Analysis</h5>
                      <p className="text-dark-primary text-sm leading-relaxed">{education.variantEffect}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-dark-accent mb-2">Functional Impact</h5>
                      <p className="text-dark-primary text-sm leading-relaxed">{education.functionalImpact}</p>
                    </div>
                    
                    {education.symptoms && (
                      <div>
                        <h5 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Potential Effects
                        </h5>
                        <p className="text-dark-primary text-sm leading-relaxed">{education.symptoms}</p>
                      </div>
                    )}
                    
                    <div>
                      <h5 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Personalized Strategies
                      </h5>
                      <ul className="space-y-1 text-sm">
                        {education.recommendations.map((rec: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span className="text-dark-primary">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {education.interactions && (
                      <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                        <h5 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Important Considerations
                        </h5>
                        <p className="text-red-300 text-sm leading-relaxed">{education.interactions}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          }) : (
            <div className="text-center py-12 bg-dark-panel border border-dark-border rounded-lg">
              <Dna className="h-12 w-12 text-dark-secondary mx-auto mb-4" />
              <p className="text-dark-secondary">No genetic data available.</p>
              <p className="text-dark-secondary text-sm">Upload genetic reports to see detailed analysis.</p>
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
                      className={`h-11 rounded text-xs font-mono transition-colors active:scale-95 transition-transform duration-150 ${symptomRatings[symptom.name] === i + 1 ? 'bg-dark-accent text-white' : 'bg-dark-border hover:bg-dark-accent/50'}`}
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
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Fixed Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-4xl font-bold text-dark-primary tracking-tight">AI Assistant</h1>
          <p className="text-dark-secondary mt-1">Your personalized health optimization expert.</p>
        </div>
        <Button onClick={startNewConversation} variant="outline" className="bg-dark-panel border-dark-border text-dark-secondary hover:bg-dark-border hover:text-dark-primary">
          New Chat
        </Button>
      </div>

      {/* Main Chat Area - Fixed Height */}
      <div className="grid lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Chat History Sidebar */}
        <div className="lg:col-span-4 flex flex-col">
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
        
        {/* Main Chat Panel */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="bg-dark-panel border border-dark-border rounded-lg h-full flex flex-col">
            {/* Messages Container - Scrollable */}
            <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto min-h-0">
              {chatMessages.length === 0 && (
                <div className="text-center text-dark-secondary h-full flex flex-col justify-center items-center">
                  <MessageSquare className="h-12 w-12 mb-4"/>
                  <h3 className="text-lg font-semibold text-dark-primary">No messages yet</h3>
                  <p>Start a conversation by asking a question below.</p>
                </div>
              )}
              
              <div className="space-y-6">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-dark-accent flex-shrink-0" />}
                    <div className={`p-4 rounded-lg max-w-2xl ${msg.role === 'user' ? 'bg-dark-accent text-white' : 'bg-dark-border text-dark-primary'}`}>
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-dark-primary prose-p:text-dark-primary prose-strong:text-dark-accent prose-ul:text-dark-primary prose-li:text-dark-primary prose-code:text-dark-accent prose-code:bg-dark-background prose-code:px-1 prose-code:rounded">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-white">{msg.content}</p>
                      )}
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
            </div>
            
            {/* Fixed Input Area */}
            <div className="p-4 border-t border-dark-border flex-shrink-0 bg-dark-panel">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(chatInput); }} className="flex gap-4">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about your results, supplements, or health..."
                  className="flex-1 bg-dark-background border border-dark-border rounded-lg px-4 py-3 text-dark-primary placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent transition-all"
                  disabled={isChatLoading}
                />
                <Button 
                  type="submit" 
                  disabled={isChatLoading || !chatInput.trim()} 
                  className="bg-dark-accent text-white hover:bg-dark-accent/80 px-6 py-3 transition-all disabled:opacity-50"
                >
                  {isChatLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send'
                  )}
                </Button>
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

  const renderProductChecker = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-dark-primary">Product Compatibility Checker</h2>
          <p className="text-dark-secondary mt-1">Analyze any supplement product against your unique health profile.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={toggleArchive}
          className="bg-dark-panel border-dark-border text-dark-primary hover:bg-dark-border"
        >
          {showArchive ? 'Hide Archive' : 'View Archive'}
        </Button>
      </div>

      <div className="flex space-x-2">
        <input
          type="url"
          value={productUrl}
          onChange={(e) => setProductUrl(e.target.value)}
          placeholder="Paste Direct Product URL from Brand Website"
          className="flex-grow bg-dark-panel border border-dark-border rounded-md px-4 py-2 text-dark-primary placeholder-dark-secondary focus:ring-2 focus:ring-dark-accent focus:outline-none"
          disabled={isCheckingProduct}
        />
        <Button onClick={checkProduct} disabled={isCheckingProduct || !productUrl}>
          {isCheckingProduct ? 'Analyzing...' : <><Search className="w-4 h-4 mr-2" /> Analyze</>}
        </Button>
      </div>

      {productCheckError && (
        <div className="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-md">
          <p><strong>Analysis Failed:</strong> {productCheckError}</p>
        </div>
      )}

      {isCheckingProduct && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-accent mx-auto"></div>
          <p className="mt-4 text-dark-secondary">Scraping product page and running analysis...</p>
        </div>
      )}

      {productAnalysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="bg-dark-panel border-dark-border">
            <CardHeader>
              <CardTitle className="text-2xl text-dark-primary">{productAnalysis.productName}</CardTitle>
              <CardDescription className="text-dark-secondary">{productAnalysis.brand}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className={`text-4xl font-bold ${productAnalysis.overallScore > 75 ? 'text-green-400' : productAnalysis.overallScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{productAnalysis.overallScore}/100</div>
                <div>
                  <h4 className="font-semibold text-dark-primary">Overall Compatibility</h4>
                  <p className="text-dark-secondary">{productAnalysis.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-dark-panel border-dark-border">
              <CardHeader><CardTitle className="text-lg text-green-400 flex items-center"><CheckCircle className="w-5 h-5 mr-2"/>Pros</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc list-inside text-dark-secondary">
                  {productAnalysis.pros.map((pro: string, i: number) => <li key={i}>{pro}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-dark-panel border-dark-border">
              <CardHeader><CardTitle className="text-lg text-yellow-400 flex items-center"><AlertTriangle className="w-5 h-5 mr-2"/>Cons & Considerations</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc list-inside text-dark-secondary">
                  {productAnalysis.cons.map((con: string, i: number) => <li key={i}>{con}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {productAnalysis.warnings?.length > 0 && (
            <Card className="bg-red-900/30 border-red-700">
              <CardHeader><CardTitle className="text-lg text-red-300 flex items-center"><AlertCircle className="w-5 h-5 mr-2"/>Important Warnings</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc list-inside text-red-300">
                  {productAnalysis.warnings.map((warning: string, i: number) => <li key={i}>{warning}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}



        </motion.div>
      )}

      {/* Archive Section */}
      {showArchive && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div className="border-t border-dark-border pt-8">
            <h3 className="text-2xl font-bold text-dark-primary mb-4">Product Check History</h3>
            
            {isLoadingHistory ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-accent mx-auto"></div>
                <p className="mt-2 text-dark-secondary">Loading history...</p>
              </div>
            ) : productHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-dark-secondary">No product checks yet. Analyze a product to start building your history!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {productHistory.map((check) => (
                  <Card key={check.id} className="bg-dark-panel border-dark-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-dark-primary">{check.product_name}</h4>
                          <p className="text-sm text-dark-secondary">{check.brand}</p>
                          <p className="text-xs text-dark-secondary mt-1">{getTimeAgo(check.created_at)}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className={`text-2xl font-bold ${check.overall_score > 75 ? 'text-green-400' : check.overall_score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {check.overall_score}/100
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setProductAnalysis(check.full_analysis)}
                            className="bg-dark-background border-dark-border text-dark-primary hover:bg-dark-border"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-dark-secondary mt-2 line-clamp-2">{check.analysis_summary}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderStudyBuddy = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-dark-border rounded-lg">
            <BookOpen className="h-6 w-6 text-dark-accent" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-dark-primary">Study Buddy</h1>
            <p className="text-lg text-dark-secondary mt-1">
              Personalized analysis of scientific research based on your genetics, biomarkers, and health profile
            </p>
          </div>
        </div>
      </div>

      {/* URL Input Section */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-dark-primary mb-4">Analyze a New Study</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="url"
              value={studyUrl}
              onChange={(e) => setStudyUrl(e.target.value)}
              placeholder="Enter PubMed URL or any scientific study link..."
              className="w-full px-4 py-3 bg-dark-background border border-dark-border rounded-lg text-dark-primary placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
            />
          </div>
          <Button
            onClick={analyzeStudy}
            disabled={isAnalyzingStudy || !studyUrl}
            className="bg-dark-accent text-white hover:bg-dark-accent/80 px-6 py-3"
          >
            {isAnalyzingStudy ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Analyze Study
              </div>
            )}
          </Button>

        </div>
        {studyError && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-600 rounded-lg">
            <p className="text-red-400">{studyError}</p>
          </div>
        )}
      </div>



      {/* Latest Analysis */}
      {studyAnalysis && (
        <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-dark-accent" />
            <h2 className="text-xl font-semibold text-dark-primary">Latest Analysis</h2>
          </div>
          
          <div className="space-y-6">
            {/* Personal Relevance Score */}
            <div className="bg-dark-background border border-dark-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-yellow-400" />
                <div>
                  <span className="text-dark-secondary text-sm">Personal Relevance:</span>
                  <div className="text-3xl font-bold text-yellow-400">{studyAnalysis.relevanceScore}/10</div>
                </div>
              </div>
            </div>
            
            {/* Personalized Summary */}
            <div>
              <h3 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-dark-accent" />
                Personalized Summary
              </h3>
              <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                <p className="text-dark-primary leading-relaxed">{studyAnalysis.personalizedSummary}</p>
              </div>
            </div>
            
            {/* Personal Explanation */}
            <div>
              <h3 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                <Brain className="h-5 w-5 text-dark-accent" />
                Personal Explanation
              </h3>
              <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                <p className="text-dark-primary leading-relaxed">{studyAnalysis.personalizedExplanation}</p>
              </div>
            </div>
            
            {/* Key Findings */}
            <div>
              <h3 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-dark-accent" />
                Key Findings
              </h3>
              <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                <ul className="space-y-3">
                  {studyAnalysis.keyFindings?.map((finding: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-dark-accent mt-1 text-lg">•</span>
                      <span className="text-dark-primary leading-relaxed">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Your Personalized Recommendations */}
            <div>
              <h3 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Your Personalized Recommendations
              </h3>
              <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                <ul className="space-y-3">
                  {studyAnalysis.actionableRecommendations?.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-400 mt-1 text-lg font-bold">✓</span>
                      <span className="text-dark-primary leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Important Considerations */}
            {studyAnalysis.limitations && studyAnalysis.limitations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  Important Considerations
                </h3>
                <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                  <ul className="space-y-3">
                    {studyAnalysis.limitations.map((limitation: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-yellow-400 mt-1 text-lg">⚠</span>
                        <span className="text-dark-primary leading-relaxed">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Studies History */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-dark-primary">Your Analyzed Studies</h2>
          <Button
            onClick={loadUserStudies}
            variant="outline"
            className="border-dark-border text-dark-secondary hover:bg-dark-border"
          >
            Refresh
          </Button>
        </div>
        
        {isLoadingStudies ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-dark-border border-t-dark-accent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-dark-secondary">Loading your studies...</p>
          </div>
        ) : userStudies.length > 0 ? (
          <div className="space-y-4">
            {userStudies.map((study) => (
              <div
                key={study.id}
                className="p-4 bg-dark-background border border-dark-border rounded-lg hover:border-dark-accent transition-colors cursor-pointer"
                onClick={() => setSelectedStudy(study)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-primary mb-1">
                      {study.study_title || 'Unknown Title'}
                    </h3>
                    <p className="text-dark-secondary text-sm mb-2 line-clamp-2">
                      {study.personalized_summary || 'No summary available'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-dark-secondary">
                      <span>Relevance: {study.relevance_score}/10</span>
                      <span>{new Date(study.created_at).toLocaleDateString()}</span>
                      {study.pmid && <span>PMID: {study.pmid}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-dark-border text-dark-secondary hover:bg-dark-border"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(study.study_url, '_blank');
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-dark-secondary mx-auto mb-4" />
            <p className="text-dark-secondary">No studies analyzed yet.</p>
            <p className="text-dark-secondary text-sm">Add a study URL above to get started!</p>
          </div>
        )}
      </div>

      {/* Selected Study Detail Modal */}
      {selectedStudy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-panel border border-dark-border rounded-xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-dark-primary">Study Analysis</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStudy(null)}
                className="border-dark-border text-dark-secondary hover:bg-dark-border"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Study Header */}
              <div>
                <h3 className="text-xl font-semibold text-dark-primary mb-2">{selectedStudy.study_title}</h3>
                {selectedStudy.study_authors && (
                  <p className="text-dark-secondary text-sm mb-2">{selectedStudy.study_authors}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-dark-secondary mb-4">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400" />
                    Personal Relevance: {selectedStudy.relevance_score}/10
                  </span>
                  <span>{new Date(selectedStudy.created_at).toLocaleDateString()}</span>
                  {selectedStudy.pmid && <span>PMID: {selectedStudy.pmid}</span>}
                  {selectedStudy.journal_name && <span>{selectedStudy.journal_name}</span>}
                </div>
              </div>
              
              {/* Personalized Summary */}
              <div>
                <h4 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-dark-accent" />
                  Personalized Summary
                </h4>
                <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                  <p className="text-dark-primary leading-relaxed">{selectedStudy.personalized_summary}</p>
                </div>
              </div>

              {/* Personal Explanation */}
              <div>
                <h4 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-dark-accent" />
                  Personal Explanation
                </h4>
                <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                  <p className="text-dark-primary leading-relaxed">{selectedStudy.personalized_explanation}</p>
                </div>
              </div>
              
              {/* Key Findings */}
              <div>
                <h4 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-dark-accent" />
                  Key Findings
                </h4>
                <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                  <ul className="space-y-3">
                    {selectedStudy.key_findings?.map((finding: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-dark-accent mt-1 text-lg">•</span>
                        <span className="text-dark-primary leading-relaxed">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Your Personalized Recommendations */}
              <div>
                <h4 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Your Personalized Recommendations
                </h4>
                <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                  <ul className="space-y-3">
                    {selectedStudy.actionable_recommendations?.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-green-400 mt-1 text-lg font-bold">✓</span>
                        <span className="text-dark-primary leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Important Considerations */}
              {selectedStudy.limitations && selectedStudy.limitations.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-dark-primary mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    Important Considerations
                  </h4>
                  <div className="bg-dark-background border border-dark-border rounded-lg p-4">
                    <ul className="space-y-3">
                      {selectedStudy.limitations.map((limitation: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-yellow-400 mt-1 text-lg">⚠</span>
                          <span className="text-dark-primary leading-relaxed">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-dark-border">
              <Button
                onClick={() => window.open(selectedStudy.study_url, '_blank')}
                className="bg-dark-accent text-white hover:bg-dark-accent/80"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Original Study
              </Button>
            </div>
          </div>
        </div>
      )}
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
      case 'product-checker':
        return renderProductChecker();
      case 'study-buddy':
        return renderStudyBuddy();
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
      
      const requestBody = { 
        message, 
        conversation_id: currentConversationId, 
        session_id: sessionId 
      };
      
            const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: requestBody,
      });

      if (error) {
        throw new Error(error.message || 'Failed to get AI response.');
      }

      // Handle the response from Supabase Edge Function (non-streaming)
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response || 'No response received.' 
      }]);

      // Update conversation ID if provided
      if (data.conversation_id && !currentConversationId) {
        setCurrentConversationId(data.conversation_id);
      }
      
      // Refresh chat history if new session
      if (data.is_new_session) {
        loadChatHistory();
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

  const checkProduct = async () => {
    if (!productUrl) return;
    setIsCheckingProduct(true);
    setProductAnalysis(null);
    setProductCheckError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('check-product', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: { productUrl },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to check product.');
      }

      setProductAnalysis(data);
      // Refresh history after successful check
      if (showArchive) {
        loadProductHistory();
      }
    } catch (error: any) {
      setProductCheckError(error.message);
    } finally {
      setIsCheckingProduct(false);
    }
  };

  const loadProductHistory = async () => {
    if (!user) return;
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('product_check_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading product history:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        setProductHistory([]);
      } else {
        setProductHistory(data || []);
        console.log('Loaded product history:', data?.length || 0, 'items');
      }
    } catch (error) {
      console.error('Failed to load product history:', error);
      setProductHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const toggleArchive = () => {
    setShowArchive(!showArchive);
    if (!showArchive && productHistory.length === 0) {
      loadProductHistory();
    }
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
              <div className="container mx-auto">
                {renderContent()}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 