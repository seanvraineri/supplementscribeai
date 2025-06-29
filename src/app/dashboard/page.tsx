'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import ReactMarkdown from 'react-markdown';
import { cancelSubscription } from './actions';
import Navigation from '@/components/Navigation';
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
  TrendingUp,
  MessageCircle,
  Zap,
  Moon,
  Heart,
  Leaf,
  AlertOctagon,
  Bone,
  CloudLightning,
  Edit3,
  Check,
  Target,
  Shield,
  Network,
  Send,
  Apple,
  Clock,
  ChefHat,
  Users,
  Menu,
  X,
  CreditCard,
  Package
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SVGProps } from 'react';
import SymptomModal from '@/components/SymptomModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  cleanBiomarkerName,
  formatBiomarkerName,
  cleanSnpName,
  getBiomarkerReferenceRange,
  interpretBiomarker,
  interpretSNP,
} from '@/lib/analysis-helpers';
  // import { useEducationData } from '@/hooks/useEducationData';
import { useComprehensiveAnalysis } from '@/hooks/useComprehensiveAnalysis';
import { useEnhancedAnalysis } from '@/hooks/useEnhancedAnalysis';
import BiomarkerCard from '@/components/BiomarkerCard';
import SnpCard from '@/components/SnpCard';
import HealthScoreCard from '@/components/HealthScoreCard';
import { generateReferralUrl, generateSignupUrl } from '@/lib/referral-utils';
import ShareGraphics from '@/components/ShareGraphics';
import DynamicTracker from '@/components/DynamicTracker';


const supabase = createClient();

type TabType = 'dashboard' | 'supplement-plan' | 'diet-groceries' | 'analysis' | 'tracking' | 'ai-chat' | 'product-checker' | 'study-buddy' | 'settings';

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

// Key biomarkers and SNPs template for comprehensive analysis
const KEY_BIOMARKERS = [
  'glucose', 'hba1c', 'insulin', 'triglycerides', 'cholesterol', 'ldl', 'hdl',
  'testosterone', 'free_testosterone', 'estradiol', 'dhea', 'cortisol', 'shbg',
  'vitamin_d', 'vitamin_b12', 'folate', 'magnesium', 'zinc', 'iron', 'ferritin',
  'homocysteine', 'crp', 'tsh', 'free_t3', 'free_t4', 'vitamin_b6', 'omega_3'
];

const KEY_SNPS = [
  'MTHFR', 'COMT', 'APOE', 'FTO', 'VDR', 'FADS1', 'FADS2', 'CYP1A1', 'CYP1B1', 
  'MTR', 'MTRR', 'BDNF', 'TOMM40', 'MC4R', 'PPARG', 'TCF7L2', 'CYP2R1', 'GC'
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [dietPlan, setDietPlan] = useState<any>(null);
  const [isGeneratingDiet, setIsGeneratingDiet] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  // REMOVED: uploadedFiles state (legacy file upload functionality)
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
  const [activeTrackingTab, setActiveTrackingTab] = useState<'symptoms' | 'supplements' | 'custom'>('symptoms');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [symptomEntries, setSymptomEntries] = useState<any[]>([]);
  const [supplementEntries, setSupplementEntries] = useState<any[]>([]);
  const [adherenceStats, setAdherenceStats] = useState({
    todayAdherence: 0,
    weeklyAverage: 0,
    currentStreak: 0
  });
  const [customSymptoms, setCustomSymptoms] = useState<string[]>([]);
  const [newCustomSymptom, setNewCustomSymptom] = useState('');
  const [individualSupplementStatus, setIndividualSupplementStatus] = useState<{[key: string]: boolean}>({});
  
  // Symptom modal state
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<any>(null);

  // Simple tracking state - no constant reloading
  const [dailySupplementsTaken, setDailySupplementsTaken] = useState(false);
  const [symptomRatings, setSymptomRatings] = useState<{[key: string]: number}>({});
  const [hasLoadedToday, setHasLoadedToday] = useState(false);
  
  // Referral state
  const [copiedReferralCode, setCopiedReferralCode] = useState(false);
  const [copiedReferralUrl, setCopiedReferralUrl] = useState(false);
  
  // Subscription management state
  const [subscriptionOrders, setSubscriptionOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [nextDeliveryDate, setNextDeliveryDate] = useState<string | null>(null);
  
  // Share graphics state
  const [showShareGraphics, setShowShareGraphics] = useState(false);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Subscription cancellation state
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'supplement-plan', icon: Pill, label: 'Supplement Plan' },
    { id: 'diet-groceries', icon: Apple, label: 'Diet & Groceries' },
    { id: 'analysis', icon: BarChart3, label: 'Comprehensive Analysis' },
    { id: 'tracking', icon: Activity, label: 'Tracking' },
    { id: 'ai-chat', icon: MessageSquare, label: 'AI Chat' },
    { id: 'product-checker', icon: Search, label: 'Product Checker' },
    { id: 'study-buddy', icon: BookOpen, label: 'Study Buddy' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  // Automatically scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const router = useRouter();

  // Load comprehensive analysis for biomarkers and SNPs
  const { biomarkerAnalysis, snpAnalysis, loading: analysisLoading, computing: analysisComputing, triggerRecomputation } = useComprehensiveAnalysis(
    biomarkersData,
    snpsData
  );

  // Enhanced analysis system
  const { 
    results: enhancedResults, 
    resultsByCategory, 
    priorityItems, 
    categoryStats, 
    userContext, 
    summary, 
    loading: enhancedLoading, 
    error: enhancedError,
    refetch: refetchEnhanced
  } = useEnhancedAnalysis();

  // Add search and filter states
  const [biomarkerSearch, setBiomarkerSearch] = useState('');
  const [snpSearch, setSnpSearch] = useState('');
  const [biomarkerFilter, setBiomarkerFilter] = useState<'all' | 'normal' | 'attention' | 'analyzed'>('all');
  const [snpFilter, setSnpFilter] = useState<'all' | 'low' | 'moderate' | 'high' | 'analyzed'>('all');
  const [biomarkerPage, setBiomarkerPage] = useState(1);
  const [snpPage, setSnpPage] = useState(1);
  const [biomarkersPerPage] = useState(10);
  const [snpsPerPage] = useState(15);

  // Health domains analysis state
  const [domainsData, setDomainsData] = useState<any>(null);
  const [domainsLoading, setDomainsLoading] = useState(false);
  const [domainsError, setDomainsError] = useState<string | null>(null);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

  // Filter and search functions - for comprehensive analysis, only show key markers
  const filteredBiomarkers = biomarkersData.filter(biomarker => {
    const analysis = biomarkerAnalysis[biomarker.marker_name?.toLowerCase()?.replace(/\s+/g, '_')] || {};
    const cleanName = biomarker.marker_name?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Marker';
    
    // For comprehensive analysis, only show key biomarkers
    const isKeyBiomarker = KEY_BIOMARKERS.some(key => {
      const cleanBioName = biomarker.marker_name?.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const cleanKeyName = key.toLowerCase();
      return cleanBioName?.includes(cleanKeyName) || cleanKeyName.includes(cleanBioName?.substring(0, 5) || '');
    });
    
    if (!isKeyBiomarker) return false;
    
    // Search filter
    const matchesSearch = cleanName.toLowerCase().includes(biomarkerSearch.toLowerCase()) ||
                         (biomarker.value && biomarker.value.toString().toLowerCase().includes(biomarkerSearch.toLowerCase()));
    
    // Status filter
    const matchesFilter = biomarkerFilter === 'all' || 
                         (biomarkerFilter === 'normal' && (analysis.statusColor === 'green' || !analysis.statusColor)) ||
                         (biomarkerFilter === 'attention' && (analysis.statusColor === 'yellow' || analysis.statusColor === 'red')) ||
                         (biomarkerFilter === 'analyzed' && analysis.interpretation);
    
    return matchesSearch && matchesFilter;
  });

  const filteredSnps = snpsData.filter(snp => {
    const gene = snp.supported_snps?.gene || snp.gene_name || 'Unknown';
    const rsid = snp.supported_snps?.rsid || snp.snp_id || 'Unknown';
    const analysis = snpAnalysis[`${gene} (${rsid})`] || {};
    
    // For comprehensive analysis, only show key SNPs
    const isKeySNP = KEY_SNPS.some(key => {
      return gene.toUpperCase() === key.toUpperCase();
    });
    
    if (!isKeySNP) return false;
    
    // Search filter
    const matchesSearch = gene.toLowerCase().includes(snpSearch.toLowerCase()) ||
                         rsid.toLowerCase().includes(snpSearch.toLowerCase()) ||
                         (snp.genotype && snp.genotype.toLowerCase().includes(snpSearch.toLowerCase()));
    
    // Risk filter
    const matchesFilter = snpFilter === 'all' ||
                         (snpFilter === 'low' && (analysis.riskColor === 'green' || !analysis.riskColor)) ||
                         (snpFilter === 'moderate' && analysis.riskColor === 'orange') ||
                         (snpFilter === 'high' && analysis.riskColor === 'red') ||
                         (snpFilter === 'analyzed' && analysis.variantEffect);
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const paginatedBiomarkers = filteredBiomarkers.slice(
    (biomarkerPage - 1) * biomarkersPerPage,
    biomarkerPage * biomarkersPerPage
  );

  const paginatedSnps = filteredSnps.slice(
    (snpPage - 1) * snpsPerPage,
    snpPage * snpsPerPage
  );

  const totalBiomarkerPages = Math.ceil(filteredBiomarkers.length / biomarkersPerPage);
  const totalSnpPages = Math.ceil(filteredSnps.length / snpsPerPage);

  // Toggle functions for expanded cards
  const toggleBiomarkerExpanded = (index: number) => {
    const newExpanded = new Set(expandedBiomarkers);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedBiomarkers(newExpanded);
  };

  const toggleSnpExpanded = (index: number) => {
    const newExpanded = new Set(expandedSnps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSnps(newExpanded);
  };

  // Toggle domain expansion
  const toggleDomain = (domainKey: string) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domainKey)) {
      newExpanded.delete(domainKey);
    } else {
      newExpanded.add(domainKey);
    }
    setExpandedDomains(newExpanded);
  };

  useEffect(() => {
    let isMounted = true;
    
    // CRITICAL: Check if user just completed onboarding
    if (typeof window !== 'undefined') {
      const justCompletedOnboarding = sessionStorage.getItem('onboarding_completed') === 'true' || 
                                     localStorage.getItem('onboarding_completed') === 'true';
      
      if (justCompletedOnboarding) {
        console.log('🚫 DASHBOARD: User just completed onboarding - preventing any redirects back');
        // Clear the flags after checking
        sessionStorage.removeItem('onboarding_completed');
        localStorage.removeItem('onboarding_completed');
      }
    }
    
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          if (!isMounted) return; // Component unmounted
          console.error('Authentication error:', userError);
          router.push('/login');
          return;
        }
        
        if (!isMounted) return; // Component unmounted
        setUser(user);

        // Fetch user profile with error handling
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileError) {
            console.warn('Profile fetch error:', profileError);
                  } else {
          if (!isMounted) return;
          setProfile(profileData);
          
          // Generate referral code for existing users who don't have one
          if (profileData && !profileData.referral_code) {
            generateReferralCodeForExistingUser();
          }
        }
        } catch (error) {
          console.warn('Profile fetch failed:', error);
        }

        // REMOVED: Legacy file upload functionality
        // Files are no longer uploaded in frictionless onboarding

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
          if (!isMounted) return;
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
            if (!isMounted) return;
            setPlan(planData.plan_details);
          }
        } catch (error) {
          console.warn('Plan fetch failed:', error);
        }

        // Fetch existing diet plan with error handling
        try {
          const { data: dietPlanData, error: dietPlanError } = await supabase
            .from('diet_plans')
            .select('plan_details')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(); // Changed from .single() to handle no results gracefully

          if (dietPlanError) {
            console.warn('Diet plan fetch error:', dietPlanError);
          } else if (dietPlanData) {
            if (!isMounted) return;
            setDietPlan(dietPlanData.plan_details);
          }
          // If dietPlanData is null, that's fine - user hasn't generated one yet
        } catch (error) {
          console.warn('Diet plan fetch failed:', error);
        }

      } catch (error) {
        console.error('Critical error in fetchUserData:', error);
        // Don't redirect on data fetch errors, just log them
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [router]);

  // Load health domains analysis function (extracted for reuse)
  const loadHealthDomains = async () => {
    if (!user) return;
    
    setDomainsLoading(true);
    setDomainsError(null);
    
    try {
      // Simple, scalable query - get the most recent analysis for this user
      const { data: storedAnalysis, error } = await supabase
        .from('user_health_domains_analysis')
        .select('analysis_data, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .maybeSingle(); // Use maybeSingle() instead of limit(1) - handles no results gracefully
      
      if (error) {
        console.error('Health domains analysis error:', error);
        setDomainsError('Failed to load analysis');
        return;
      }

      if (storedAnalysis?.analysis_data) {
        setDomainsData(storedAnalysis.analysis_data);
      } else {
        setDomainsError('No health domains analysis found. Complete onboarding to generate your analysis.');
      }
    } catch (error: any) {
      console.error('Health domains analysis loading error:', error);
      setDomainsError('Failed to load analysis');
    } finally {
      setDomainsLoading(false);
    }
  };

  // Load health domains analysis on mount
  useEffect(() => {
    loadHealthDomains();
  }, [user]);

  // Load subscription orders for full subscription users
  useEffect(() => {
    if (profile?.subscription_tier === 'full') {
      loadSubscriptionOrders();
    }
  }, [profile]);

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

  const generateDietPlan = async () => {
    if (!user) return;

    setIsGeneratingDiet(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('generate-diet-plan', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate diet plan');
      }

      if (data.success) {
        setDietPlan(data.data);
        setActiveTab('diet-groceries'); // Switch to diet plan tab
      } else {
        console.error('Failed to generate diet plan:', data.error);
        alert(`Failed to generate diet plan: ${data.error}`);
      }
    } catch (error: any) {
      console.error('Error generating diet plan:', error);
      alert(`An error occurred while generating your diet plan: ${error.message}`);
    } finally {
      setIsGeneratingDiet(false);
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
        const symptomsData = await symptomsResponse.json();
        console.log('Symptoms API response:', symptomsData);
        
        const { symptoms } = symptomsData;
        const ratingsMap: {[key: string]: number} = {};
        
        if (symptoms && Array.isArray(symptoms)) {
        // ✅ Keep any here - symptom data structure varies from API
        symptoms.forEach((symptom: any) => {
            if (symptom.symptom_name && symptom.value) {
          ratingsMap[symptom.symptom_name] = symptom.value;
            }
        });
        } else {
          console.warn('Symptoms data is not an array:', symptoms);
        }
        
        setSymptomRatings(ratingsMap);
      } else {
        console.error('Failed to load symptoms:', symptomsResponse.status, symptomsResponse.statusText);
      }

      // Load supplements for the selected date
      const supplementsResponse = await fetch(`/api/tracking/supplements?date=${selectedDate}`, {
        credentials: 'include'
      });
      
      if (supplementsResponse.ok) {
        const supplementsData = await supplementsResponse.json();
        console.log('Supplements API response:', supplementsData);
        
        const { supplements } = supplementsData;
        
        if (supplements && Array.isArray(supplements)) {
        // ✅ Keep any here - supplement data structure varies from API
        const allTaken = supplements.length > 0 && supplements.every((s: any) => s.taken);
        setDailySupplementsTaken(allTaken);
        } else {
          console.warn('Supplements data is not an array:', supplements);
          setDailySupplementsTaken(false);
        }
      } else {
        console.error('Failed to load supplements:', supplementsResponse.status, supplementsResponse.statusText);
        setDailySupplementsTaken(false);
      }

      if (selectedDate === new Date().toISOString().split('T')[0]) {
        setHasLoadedToday(true);
      }
    } catch (error) {
      console.error('Error loading tracking data:', error);
      // Reset states on error
      setSymptomRatings({});
      setDailySupplementsTaken(false);
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
        // ✅ Keep any here - recommendation structure varies from AI plan generation
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

  const toggleIndividualSupplement = async (supplementName: string, taken: boolean) => {
    // Update UI immediately
    setIndividualSupplementStatus(prev => ({
      ...prev,
      [supplementName]: taken
    }));

    // Save to database in background
    try {
      await fetch('/api/tracking/supplements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          supplement_name: supplementName,
          taken,
          entry_date: selectedDate
        })
      });
    } catch (error) {
      console.error('Error saving individual supplement:', error);
      // Revert on error
      setIndividualSupplementStatus(prev => ({
        ...prev,
        [supplementName]: !taken
      }));
    }
  };

  const addCustomSymptom = () => {
    if (newCustomSymptom.trim() && !customSymptoms.includes(newCustomSymptom.trim())) {
      setCustomSymptoms(prev => [...prev, newCustomSymptom.trim()]);
      setNewCustomSymptom('');
    }
  };

  const removeCustomSymptom = (symptomToRemove: string) => {
    setCustomSymptoms(prev => prev.filter(s => s !== symptomToRemove));
    // Also remove from ratings
    setSymptomRatings(prev => {
      const newRatings = { ...prev };
      delete newRatings[symptomToRemove];
      return newRatings;
    });
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

  const cleanProductName = (productName: string | undefined) => {
    // Handle undefined/null productName
    if (!productName) {
      return '';
    }
    // Remove "OK Capsule" prefix if present
    if (productName.startsWith('OK Capsule ')) {
      return productName.replace('OK Capsule ', '');
    }
    return productName;
  };

  const renderDashboardContent = () => (
    <div className="h-full flex flex-col space-y-4 sm:space-y-6">
      {/* Compact Welcome Header */}
      <div className="text-center px-4 sm:px-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-primary tracking-tight">Dashboard</h1>
        <p className="text-dark-secondary mt-1 text-sm sm:text-base">Your personalized health insights and recommendations.</p>
      </div>

      {/* Onboarding Banner - Show if profile is incomplete */}
      {!profile && (
        <motion.div 
          className="bg-gradient-to-r from-dark-accent/20 to-blue-900/20 border border-dark-accent/50 rounded-lg sm:rounded-xl p-3 sm:p-4 mx-4 sm:mx-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="p-1.5 sm:p-2 bg-dark-accent/20 rounded-lg">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-dark-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-semibold text-dark-primary mb-1">
                Complete Your Health Profile
              </h3>
              <p className="text-dark-secondary text-xs sm:text-sm">
                Unlock personalized AI recommendations by completing your health onboarding.
              </p>
            </div>
            <Button 
              onClick={() => router.push('/onboarding')}
              className="bg-dark-accent text-white hover:bg-dark-accent/80 transition-all duration-300 w-full sm:w-auto text-sm px-3 sm:px-4 touch-target"
              size="sm"
            >
              Complete Setup
            </Button>
          </div>
        </motion.div>
      )}

      {/* Main Content - Single Row Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 px-4 sm:px-0">
        {/* Health Score - Takes up 3/5 of the space and is static */}
        <div className="lg:col-span-3">
          <div className="h-full">
            <HealthScoreCard onViewDetails={() => setActiveTab('analysis')} />
          </div>
        </div>

        {/* Right Sidebar - Takes up 2/5 of the space */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {/* Quick Supplements Count */}
          <div className="bg-dark-panel border border-dark-border rounded-lg sm:rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 sm:p-2 bg-dark-border rounded-lg">
                <Pill className="h-4 w-4 text-dark-accent" />
              </div>
              <div>
                <p className="text-dark-secondary text-xs sm:text-sm">Active Supplements</p>
                <p className="text-lg sm:text-xl font-bold text-dark-primary">{plan?.recommendations?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* Mobile horizontal layout for plan panels */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
            {/* Supplement Plan Panel - Compact */}
            <div className="bg-dark-panel rounded-lg sm:rounded-xl p-3 border border-dark-border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-dark-secondary" />
                <h3 className="text-xs sm:text-sm font-semibold text-dark-primary">AI-Powered Plan</h3>
              </div>
              <div className="py-1">
                {plan ? (
                  <div className="space-y-2 text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-900/50 rounded-full mx-auto flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                    </div>
                    <p className="text-dark-secondary text-[10px] sm:text-xs">Plan ready</p>
                    <Button 
                      onClick={() => setActiveTab('supplement-plan')}
                      size="sm"
                      className="w-full bg-dark-accent text-white hover:bg-dark-accent/80 rounded-lg text-[11px] sm:text-xs py-1 touch-target min-h-[36px] sm:min-h-[32px]"
                    >
                      View Plan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-dark-border rounded-full mx-auto flex items-center justify-center">
                      <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-dark-accent" />
                    </div>
                    <p className="text-dark-secondary text-[10px] sm:text-xs">No plan yet</p>
                    <Button 
                      onClick={generatePlan} 
                      disabled={isGenerating}
                      size="sm"
                      className="w-full text-[11px] sm:text-xs py-1 touch-target min-h-[36px] sm:min-h-[32px]"
                    >
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Diet Plan Panel - Compact */}
            <div className="bg-dark-panel rounded-lg sm:rounded-xl p-3 border border-dark-border">
              <div className="flex items-center gap-2 mb-2">
                <Apple className="h-3 w-3 sm:h-4 sm:w-4 text-dark-secondary" />
                <h3 className="text-xs sm:text-sm font-semibold text-dark-primary">Whole Food Diet</h3>
              </div>
              <div className="py-1">
                {dietPlan ? (
                  <div className="space-y-2 text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-900/50 rounded-full mx-auto flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                    </div>
                    <p className="text-dark-secondary text-[10px] sm:text-xs">Diet ready</p>
                    <Button 
                      onClick={() => setActiveTab('diet-groceries')}
                      size="sm"
                      className="w-full bg-dark-accent text-white hover:bg-dark-accent/80 rounded-lg text-[11px] sm:text-xs py-1 touch-target min-h-[36px] sm:min-h-[32px]"
                    >
                      View Diet
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-dark-border rounded-full mx-auto flex items-center justify-center">
                      <Apple className="h-3 w-3 sm:h-4 sm:w-4 text-dark-accent" />
                    </div>
                    <p className="text-dark-secondary text-[10px] sm:text-xs">No diet yet</p>
                    <Button 
                      onClick={generateDietPlan} 
                      disabled={isGeneratingDiet}
                      size="sm"
                      className="w-full text-[11px] sm:text-xs py-1 touch-target min-h-[36px] sm:min-h-[32px]"
                    >
                      {isGeneratingDiet ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions - Vertical Stack */}
          <div className="space-y-2">
            <motion.div 
              className="bg-dark-panel border border-dark-border rounded-lg p-3 hover:border-dark-accent/50 transition-all cursor-pointer mobile-tap"
              onClick={() => setActiveTab('analysis')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-1 sm:p-1.5 bg-blue-500/10 rounded-lg">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-dark-primary">Analysis</h3>
                  <p className="text-dark-secondary text-[10px] sm:text-xs">Health domains</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-dark-panel border border-dark-border rounded-lg p-3 hover:border-dark-accent/50 transition-all cursor-pointer mobile-tap"
              onClick={() => setActiveTab('tracking')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-1 sm:p-1.5 bg-green-500/10 rounded-lg">
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-dark-primary">Tracking</h3>
                  <p className="text-dark-secondary text-[10px] sm:text-xs">Log progress</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-dark-panel border border-dark-border rounded-lg p-3 hover:border-dark-accent/50 transition-all cursor-pointer mobile-tap"
              onClick={() => setActiveTab('ai-chat')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-2">
                <div className="p-1 sm:p-1.5 bg-purple-500/10 rounded-lg">
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-dark-primary">AI Chat</h3>
                  <p className="text-dark-secondary text-[10px] sm:text-xs">Get advice</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupplementPlan = () => (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Hero Header */}
      <div className="relative bg-dark-panel border border-dark-border rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-dark-primary mb-1 sm:mb-2">
              Your Personalized Supplement Plan
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-dark-secondary">
              AI-powered recommendations based on your unique health data
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {plan && (
              <Button 
                onClick={() => {
                  if (profile?.referral_code) {
                    setShowShareGraphics(true);
                  } else {
                    alert('Please visit Settings to set up your referral code first, then you can share your stack!');
                  }
                }}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base touch-target"
              >
                <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                🔥 Share Your Stack
              </Button>
            )}
            <Button 
              onClick={generatePlan} 
              disabled={isGenerating}
              className="bg-dark-accent text-white hover:bg-dark-accent/80 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base touch-target"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Regenerating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  Regenerate Plan
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {plan ? (
        <div className="space-y-3 sm:space-y-4">
          {/* General Notes Section */}
          {plan.general_notes && (
            <div className="bg-dark-panel rounded-lg sm:rounded-xl p-4 sm:p-6 border border-dark-border">
              <h3 className="text-base sm:text-lg font-semibold text-dark-accent mb-2 sm:mb-3 flex items-center gap-2">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                Your Personalized Health Journey
              </h3>
              <p className="text-dark-primary leading-relaxed text-sm sm:text-base">{plan.general_notes}</p>
            </div>
          )}
          
          {plan.recommendations?.map((rec: any, index: number) => (
            <motion.div 
              key={index} 
              className="bg-dark-panel border border-dark-border rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-dark-primary">{rec.supplement}</h3>
                    <p className="text-dark-secondary font-mono text-xs sm:text-sm truncate">{cleanProductName(rec.product?.product_name)}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-bold text-dark-primary text-base sm:text-lg">{rec.dosage}</p>
                    {rec.timing && <p className="text-dark-secondary text-xs sm:text-sm">{rec.timing}</p>}
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-dark-border space-y-2">
                  <h4 className="font-semibold text-dark-accent text-sm sm:text-base">Why This Is Perfect For You</h4>
                  <div className="bg-dark-background/50 rounded-lg p-3 sm:p-4 border-l-4 border-dark-accent">
                    <p className="text-dark-primary leading-relaxed text-sm sm:text-base">{rec.reason}</p>
                  </div>
                  {rec.notes && (
                    <div className="mt-2 sm:mt-3 p-2.5 sm:p-3 bg-dark-border rounded-lg">
                      <p className="text-dark-secondary text-xs sm:text-sm leading-relaxed">{rec.notes}</p>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 lg:py-20 bg-dark-panel border border-dark-border rounded-lg mx-4 sm:mx-0">
          <Pill className="h-10 w-10 sm:h-12 sm:w-12 text-dark-secondary mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg lg:text-xl font-medium text-dark-primary mb-2">No Supplement Plan Generated</h3>
          <p className="text-dark-secondary mb-3 sm:mb-4 text-sm sm:text-base px-4 sm:px-0">
            Generate your AI-powered plan to get started.
          </p>
          <Button onClick={generatePlan} disabled={isGenerating} className="bg-dark-accent text-white hover:bg-dark-accent/80 text-sm sm:text-base touch-target">
            {isGenerating ? 'Generating...' : 'Generate AI Plan'}
          </Button>
        </div>
      )}
    </div>
  );

  const renderDietGroceries = () => (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Hero Header */}
      <div className="relative bg-dark-panel border border-dark-border rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-dark-primary mb-1 sm:mb-2">
              Your Personalized Whole Food Diet Plan
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-dark-secondary">
              Traditional nutrition principles with grocery list & meal suggestions
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              onClick={generateDietPlan} 
              disabled={isGeneratingDiet}
              className="bg-dark-accent text-white hover:bg-dark-accent/80 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base touch-target"
            >
              {isGeneratingDiet ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Regenerating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Apple className="h-3 w-3 sm:h-4 sm:w-4" />
                  Regenerate Diet Plan
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {dietPlan ? (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Dietary Restrictions Display */}
          {(profile?.dietary_preference || (userAllergies && userAllergies.length > 0)) && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-red-400 mb-2 sm:mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                Your Dietary Requirements (Strictly Followed)
              </h3>
              <div className="space-y-2">
                {profile?.dietary_preference && (
                  <div className="flex items-center gap-2">
                    <Leaf className="h-3 w-3 sm:h-4 sm:w-4 text-dark-accent" />
                    <span className="text-dark-primary font-medium text-sm sm:text-base">
                      Diet Type: <span className="text-dark-accent">{profile.dietary_preference.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                    </span>
                  </div>
                )}
                {userAllergies && userAllergies.length > 0 && (
                  <div>
                    <p className="text-dark-primary font-medium mb-1 text-sm sm:text-base">⚠️ Allergies Avoided:</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {userAllergies.map((allergy: any, index: number) => (
                        <span key={index} className="bg-red-500/10 text-red-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                          {allergy.ingredient_name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* General Notes Section */}
          {dietPlan.general_notes && (
            <div className="bg-dark-panel rounded-lg sm:rounded-xl p-4 sm:p-6 border border-dark-border">
              <h3 className="text-base sm:text-lg font-semibold text-dark-accent mb-2 sm:mb-3 flex items-center gap-2">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                Your Personalized Nutrition Journey
              </h3>
              <p className="text-dark-primary leading-relaxed text-sm sm:text-base">{dietPlan.general_notes}</p>
            </div>
          )}

          {/* Grocery List Section */}
          <div className="bg-dark-panel rounded-lg sm:rounded-xl p-4 sm:p-6 border border-dark-border">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-dark-primary mb-4 sm:mb-6 flex items-center gap-2">
              <Apple className="h-5 w-5 sm:h-6 sm:w-6 text-dark-accent" />
              Your Personalized Grocery List
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {dietPlan.grocery_list && Object.entries(dietPlan.grocery_list).map(([category, items]: [string, any]) => (
                <motion.div 
                  key={category}
                  className="bg-dark-background/50 rounded-lg p-3 sm:p-4 border border-dark-border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-dark-accent mb-2 sm:mb-3 capitalize">
                    {category.replace('_', ' ')}
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {Array.isArray(items) && items.map((item: any, index: number) => (
                      <div key={index} className="bg-dark-panel rounded-lg p-2.5 sm:p-3 border border-dark-border">
                        <h4 className="font-semibold text-dark-primary text-xs sm:text-sm mb-0.5 sm:mb-1">{item.item}</h4>
                        <p className="text-dark-secondary text-[11px] sm:text-xs leading-relaxed">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Meal Suggestions Section */}
          <div className="bg-dark-panel rounded-lg sm:rounded-xl p-4 sm:p-6 border border-dark-border">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-dark-primary mb-4 sm:mb-6 flex items-center gap-2">
              <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-dark-accent" />
              Your 20 Personalized Meal Suggestions
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {dietPlan.meal_suggestions && Object.entries(dietPlan.meal_suggestions).map(([mealType, meals]: [string, any]) => (
                <motion.div 
                  key={mealType}
                  className="bg-dark-background/50 rounded-lg p-3 sm:p-4 border border-dark-border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-dark-accent mb-3 sm:mb-4 capitalize flex items-center gap-2">
                    {mealType === 'breakfast' && <Star className="h-4 w-4 sm:h-5 sm:w-5" />}
                    {mealType === 'lunch' && <Target className="h-4 w-4 sm:h-5 sm:w-5" />}
                    {mealType === 'dinner' && <Heart className="h-4 w-4 sm:h-5 sm:w-5" />}
                    {mealType === 'snacks' && <Zap className="h-4 w-4 sm:h-5 sm:w-5" />}
                    {mealType} ({Array.isArray(meals) ? meals.length : 0})
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {Array.isArray(meals) && meals.map((meal: any, index: number) => (
                      <motion.div 
                        key={index} 
                        className="bg-dark-panel rounded-lg p-3 sm:p-4 border border-dark-border"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                      >
                        <h4 className="font-bold text-dark-primary mb-2 text-sm sm:text-base">{meal.name}</h4>
                        
                        {/* Cooking Info */}
                        {(meal.prep_time || meal.cook_time || meal.servings) && (
                          <div className="flex flex-wrap gap-2 sm:gap-4 mb-2 sm:mb-3 text-[11px] sm:text-xs text-dark-secondary">
                            {meal.prep_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                <span>Prep: {meal.prep_time}</span>
                              </div>
                            )}
                            {meal.cook_time && (
                              <div className="flex items-center gap-1">
                                <ChefHat className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                <span>Cook: {meal.cook_time}</span>
                              </div>
                            )}
                            {meal.servings && (
                              <div className="flex items-center gap-1">
                                <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                <span>Serves: {meal.servings}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="mb-2 sm:mb-3">
                          <p className="text-dark-secondary text-xs sm:text-sm mb-1">Ingredients:</p>
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(meal.ingredients) && meal.ingredients.map((ingredient: string, i: number) => (
                              <span key={i} className="bg-dark-accent/20 text-dark-accent px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Cooking Instructions */}
                        {meal.instructions && Array.isArray(meal.instructions) && meal.instructions.length > 0 && (
                          <div className="mb-2 sm:mb-3">
                            <p className="text-dark-secondary text-xs sm:text-sm mb-1.5 sm:mb-2 font-semibold">5-Step Instructions:</p>
                            <div className="space-y-1">
                              {meal.instructions.map((step: string, stepIndex: number) => (
                                <div key={stepIndex} className="flex items-start gap-1.5 sm:gap-2">
                                  <span className="bg-dark-accent text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {stepIndex + 1}
                                  </span>
                                  <p className="text-dark-secondary text-[11px] sm:text-xs leading-relaxed">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Micronutrient Information */}
                        {meal.micronutrients && (
                          <div className="mb-2 sm:mb-3">
                            <p className="text-dark-secondary text-xs sm:text-sm mb-1.5 sm:mb-2 font-semibold flex items-center gap-1">
                              <Dna className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              Personalized Nutrition Analysis:
                            </p>
                            <div className="bg-dark-background/30 rounded-lg p-2 sm:p-3 space-y-1.5 sm:space-y-2">
                              {meal.micronutrients.nutrient_density_score && (
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400" />
                                  <span className="text-[10px] sm:text-xs text-dark-accent font-medium">{meal.micronutrients.nutrient_density_score}</span>
                                </div>
                              )}
                              
                              {meal.micronutrients.primary_nutrients && meal.micronutrients.primary_nutrients.length > 0 && (
                                <div>
                                  <p className="text-[10px] sm:text-xs text-dark-secondary font-medium mb-1">Key Nutrients:</p>
                                  <div className="flex flex-wrap gap-0.5 sm:gap-1">
                                    {meal.micronutrients.primary_nutrients.map((nutrient: string, i: number) => (
                                      <span key={i} className="bg-blue-500/20 text-blue-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-xs">
                                        {nutrient}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {meal.micronutrients.synergistic_effects && (
                                <div className="bg-dark-panel rounded p-1.5 sm:p-2 border-l-2 border-dark-accent">
                                  <p className="text-[10px] sm:text-xs text-dark-secondary">
                                    <span className="font-semibold text-dark-accent">Synergy:</span> {meal.micronutrients.synergistic_effects}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="bg-dark-background/50 rounded-lg p-2.5 sm:p-3 border-l-4 border-dark-accent">
                          <p className="text-dark-secondary text-xs sm:text-sm">
                            <span className="font-semibold text-dark-accent">Why this works for you:</span> {meal.benefits}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contraindications Section */}
          {dietPlan.contraindications && (
            <div className="bg-dark-panel rounded-lg sm:rounded-xl p-4 sm:p-6 border border-dark-border border-l-4 border-l-yellow-500">
              <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-2 sm:mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                Important Safety Considerations
              </h3>
              <p className="text-dark-primary leading-relaxed text-sm sm:text-base">{dietPlan.contraindications}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 lg:py-20 bg-dark-panel border border-dark-border rounded-lg mx-4 sm:mx-0">
          <Apple className="h-10 w-10 sm:h-12 sm:w-12 text-dark-secondary mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg lg:text-xl font-medium text-dark-primary mb-2">No Diet Plan Generated</h3>
          <p className="text-dark-secondary mb-3 sm:mb-4 text-sm sm:text-base px-4 sm:px-0">
            Generate your personalized whole food nutrition plan to get started.
          </p>
          <Button onClick={generateDietPlan} disabled={isGeneratingDiet} className="bg-dark-accent text-white hover:bg-dark-accent/80 text-sm sm:text-base touch-target">
            {isGeneratingDiet ? 'Generating...' : 'Generate Diet Plan'}
          </Button>
        </div>
      )}
    </div>
  );

  const renderEnhancedAnalysis = () => {
    // Domain icons mapping
    const domainIcons: Record<string, any> = {
      'metabolomic': TrendingUp,
      'lipidomic': Bone,
      'inflammation': Zap,
      'cognitive': Brain,
      'gutMicrobiome': Pill
    };

    if (domainsLoading) {
      return (
        <div className="space-y-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-dark-border border-t-dark-accent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-dark-primary mb-2">Analyzing Your Health Domains...</h2>
            <p className="text-dark-secondary">Processing your onboarding responses across 5 health domains</p>
          </div>
        </div>
      );
    }

    if (domainsError) {
      const isNotFoundError = domainsError.includes('No health domains analysis found');
      
      return (
        <div className="space-y-8">
          <div className="text-center py-20">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-dark-primary mb-2">
              {isNotFoundError ? 'Health Analysis Not Generated' : 'Analysis Error'}
            </h2>
            <p className="text-dark-secondary mb-4">
              {isNotFoundError 
                ? 'Your personalized health domains analysis hasn\'t been generated yet.' 
                : domainsError}
            </p>
            <Button 
              onClick={async () => {
                if (isNotFoundError) {
                  setDomainsLoading(true);
                  setDomainsError(null);
                  
                  try {
                    // Generate new analysis
                    const { data, error } = await supabase.functions.invoke('health-domains-analysis');

                    if (error) throw error;
                    
                    // Display the results immediately
                    setDomainsData(data);
                    
                    // Also refresh from database after a moment to ensure persistence
                    setTimeout(loadHealthDomains, 2000);
                  } catch (error: any) {
                    setDomainsError(`Failed to generate analysis: ${error.message}`);
                  } finally {
                    setDomainsLoading(false);
                  }
                } else {
                  loadHealthDomains();
                }
              }} 
              className="bg-dark-accent text-white hover:bg-dark-accent/80 disabled:opacity-50"
              disabled={domainsLoading}
            >
              {domainsLoading ? 'Generating...' : (isNotFoundError ? 'Generate Analysis' : 'Try Again')}
            </Button>
          </div>
        </div>
      );
    }

    if (!domainsData) {
      return (
        <div className="space-y-8">
          <div className="text-center py-20">
            <Brain className="h-16 w-16 text-dark-accent mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-dark-primary mb-2">Complete Your Health Assessment</h2>
            <p className="text-dark-secondary mb-4">Please complete the onboarding to get your comprehensive health domains analysis</p>
            <Button 
              onClick={() => router.push('/onboarding')} 
              className="bg-dark-accent text-white hover:bg-dark-accent/80"
            >
              Complete Assessment
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Hero Section with User Goals */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-xl sm:rounded-2xl"></div>
          <div className="relative p-4 sm:p-6 lg:p-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 sm:mb-3 lg:mb-4">
              Comprehensive Analysis
            </h1>
            <p className="text-sm sm:text-base lg:text-xl text-dark-secondary max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6">
              Educational insights across 5 health domains based on your onboarding responses
            </p>
            
            {/* User Goals Display */}
            {domainsData.userProfile && (
              <div className="bg-dark-panel/60 border border-dark-accent/20 rounded-lg sm:rounded-xl p-4 sm:p-6 max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-dark-primary mb-2 sm:mb-3 flex items-center justify-center">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-dark-accent mr-2 sm:mr-3" />
                  <span className="line-clamp-1">Your Health Goals, {domainsData.userProfile.name}</span>
                </h2>
                <div className="text-sm sm:text-base lg:text-lg text-dark-secondary mb-3 sm:mb-4">
                  You want to: <span className="text-dark-accent font-semibold">{domainsData.userProfile.goalDescription}</span>
                </div>
                {domainsData.userProfile.goals && domainsData.userProfile.goals.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                    {domainsData.userProfile.goals.map((goal: string, index: number) => {
                      // Create proper goal labels
                      const goalLabels: {[key: string]: string} = {
                        'weight_loss': 'Weight Loss',
                        'muscle_gain': 'Muscle Gain', 
                        'energy': 'Energy Boost',
                        'sleep': 'Sleep Quality',
                        'stress': 'Stress Management',
                        'digestion': 'Digestive Health',
                        'digestive_health': 'Digestive Health',
                        'immunity': 'Immune Health',
                        'skin': 'Skin Health',
                        'mood': 'Mood Balance',
                        'focus': 'Mental Clarity',
                        'weight_management': 'Weight Management',
                        'longevity_wellness': 'Longevity & Wellness'
                      };
                      
                      const displayLabel = goalLabels[goal] || goal.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                      
                      return (
                        <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-dark-accent/10 text-dark-accent border border-dark-accent/20 rounded-full text-xs sm:text-sm font-medium">
                          {displayLabel}
                        </span>
                      );
                    })}
                  </div>
                )}
                <p className="text-xs sm:text-sm text-dark-secondary mt-2 sm:mt-3">
                  Every recommendation below is tailored to support these specific goals
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cross-Domain Connections */}
        {domainsData.crossDomainConnections && (
          <div className="bg-gradient-to-r from-dark-accent/5 to-blue-500/5 border border-dark-accent/20 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-dark-primary mb-3 sm:mb-4 flex items-center">
              <Network className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-dark-accent mr-2 sm:mr-3" />
              Cross-Domain Connections
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {domainsData.crossDomainConnections.map((connection: string, index: number) => (
                <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-dark-accent rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="text-dark-secondary text-sm sm:text-base">{connection}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Priority Protocols */}
        {domainsData.priorityProtocols && (
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-dark-primary mb-3 sm:mb-4 flex items-center">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-400 mr-2 sm:mr-3" />
              Priority Protocols for Your Goals
            </h2>
            <div className="grid gap-3 sm:gap-4">
              {domainsData.priorityProtocols.map((protocolItem: any, index: number) => {
                // Handle both old string format and new object format
                const protocol = typeof protocolItem === 'string' ? protocolItem : protocolItem.protocol;
                const goalConnection = typeof protocolItem === 'object' ? protocolItem.goalConnection : null;
                
                return (
                  <div key={index} className="bg-dark-panel border border-yellow-500/20 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-dark-primary font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">{protocol}</p>
                        {goalConnection && (
                          <div className="flex items-center space-x-1.5 sm:space-x-2">
                            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-dark-accent" />
                            <span className="text-xs sm:text-sm text-dark-accent font-medium">{goalConnection}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Health Domains */}
        <div className="space-y-4 sm:space-y-6">
          {domainsData.domains && Object.entries(domainsData.domains).map(([domainKey, domain]: [string, any]) => {
            const IconComponent = domainIcons[domainKey] || Activity;
            const isExpanded = expandedDomains.has(domainKey);
            
            return (
              <motion.div 
                key={domainKey} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-panel border border-dark-border rounded-lg sm:rounded-xl p-4 sm:p-6"
              >
                {/* Domain Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="p-2 sm:p-3 bg-dark-accent/10 rounded-lg sm:rounded-xl">
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-dark-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-dark-primary truncate">{domain.title}</h2>
                      <p className="text-dark-secondary text-sm sm:text-base">{domain.subtitle}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => toggleDomain(domainKey)}
                    variant="outline"
                    size="sm"
                    className="border-dark-border hover:bg-dark-accent/10 ml-2"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Insights Preview */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-dark-primary mb-2 sm:mb-3">Key Insights</h3>
                  <div className="grid gap-2 sm:gap-3">
                    {domain.insights?.slice(0, 2).map((insight: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-dark-secondary text-sm sm:text-base">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personalized Findings */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-dark-primary mb-2 sm:mb-3">Your Profile</h3>
                  <div className="grid gap-2 sm:gap-3">
                    {domain.personalizedFindings?.map((finding: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-dark-secondary text-sm sm:text-base">{finding}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 sm:space-y-6"
                    >
                      {/* All Insights */}
                      {domain.insights?.length > 2 && (
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-dark-primary mb-2 sm:mb-3">Complete Educational Insights</h3>
                          <div className="grid gap-2 sm:gap-3">
                            {domain.insights.slice(2).map((insight: string, index: number) => (
                              <div key={index + 2} className="flex items-start space-x-2 sm:space-x-3">
                                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                <p className="text-dark-secondary text-sm sm:text-base">{insight}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-dark-primary mb-2 sm:mb-3">Holistic Protocols</h3>
                        <div className="grid gap-3 sm:gap-4">
                          {domain.recommendations?.map((rec: string, index: number) => (
                            <div key={index} className="bg-dark-background border border-dark-border rounded-lg p-3 sm:p-4">
                              <div className="flex items-start space-x-2 sm:space-x-3">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-dark-accent/20 text-dark-accent rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">
                                  {index + 1}
                                </div>
                                <p className="text-dark-primary font-medium text-sm sm:text-base">{rec}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Goal Alignment */}
                      {domain.goalAlignment && (
                        <div className="bg-gradient-to-r from-dark-accent/10 to-blue-500/10 border-2 border-dark-accent/30 rounded-lg p-4 sm:p-5">
                          <h4 className="font-bold text-dark-primary mb-2 sm:mb-3 flex items-center text-base sm:text-lg">
                            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-dark-accent mr-1.5 sm:mr-2" />
                            How This Supports Your Goals
                          </h4>
                          <p className="text-dark-primary font-medium leading-relaxed text-sm sm:text-base">{domain.goalAlignment}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Safety Check */}
        {domainsData.conflictCheck && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-dark-primary mb-2 sm:mb-3 flex items-center">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-400 mr-2 sm:mr-3" />
              Safety Verification
            </h2>
            <p className="text-dark-secondary text-sm sm:text-base">{domainsData.conflictCheck}</p>
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center">
          <Button 
            onClick={async () => {
              setDomainsLoading(true);
              setDomainsError(null);
              
              try {
                // Generate new analysis
                const { data, error } = await supabase.functions.invoke('health-domains-analysis');

                if (error) throw error;
                
                // Display the results immediately
                setDomainsData(data);
                
                // Also refresh from database after a moment to ensure persistence
                setTimeout(loadHealthDomains, 2000);
              } catch (error: any) {
                setDomainsError(`Failed to generate analysis: ${error.message}`);
              } finally {
                setDomainsLoading(false);
              }
            }}
            disabled={domainsLoading}
            className="bg-dark-accent text-white hover:bg-dark-accent/80 px-6 sm:px-8 py-2.5 sm:py-3 disabled:opacity-50 touch-target"
          >
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
            <span className="text-sm sm:text-base">{domainsLoading ? 'Generating...' : 'Refresh Analysis'}</span>
          </Button>
        </div>
      </div>
    );
  };

  const renderAnalysis = () => (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-xl sm:rounded-2xl"></div>
        <div className="relative p-4 sm:p-6 lg:p-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 sm:mb-3 lg:mb-4">
            Comprehensive Analysis
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-dark-secondary max-w-3xl mx-auto leading-relaxed">
            AI-powered insights from your key health markers focused on metabolic syndrome, cognitive health, hormonal balance, and nutritional status
          </p>
        </div>
      </div>

      {/* Computing State */}
      {analysisComputing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500/20"></div>
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent absolute inset-0"></div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-dark-primary mb-1 sm:mb-2">AI Analysis in Progress</h3>
              <p className="text-dark-secondary text-sm sm:text-base">Our advanced algorithms are processing your health data</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="space-y-12">
        {/* Lab Results Section */}
        {biomarkersData.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl"></div>
            
            {/* Content */}
            <div className="relative bg-dark-panel/80 backdrop-blur-sm border border-dark-border/50 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl shadow-lg">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-dark-primary">Lab Results Analysis</h2>
                    <p className="text-dark-secondary">Comprehensive biomarker insights</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    {biomarkersData.length}
                  </div>
                  <div className="text-sm text-dark-secondary font-medium">Biomarkers</div>
                </div>
              </div>
              
              {/* Search and Filter Controls */}
              <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-secondary" />
                  <input
                    type="text"
                    placeholder="Search biomarkers by name or value..."
                    value={biomarkerSearch}
                    onChange={(e) => setBiomarkerSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-dark-background/60 border border-dark-border/50 rounded-xl text-dark-primary placeholder-dark-secondary focus:outline-none focus:border-dark-accent/50 focus:ring-2 focus:ring-dark-accent/20 transition-all"
                  />
                </div>
                
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: 'all', label: 'All Results', count: biomarkersData.length },
                    { key: 'normal', label: 'Normal', count: biomarkersData.filter(b => {
                      const analysis = biomarkerAnalysis[b.marker_name?.toLowerCase()?.replace(/\s+/g, '_')] || {};
                      return analysis.statusColor === 'green' || !analysis.statusColor;
                    }).length },
                    { key: 'attention', label: 'Needs Attention', count: biomarkersData.filter(b => {
                      const analysis = biomarkerAnalysis[b.marker_name?.toLowerCase()?.replace(/\s+/g, '_')] || {};
                      return analysis.statusColor === 'yellow' || analysis.statusColor === 'red';
                    }).length },
                    { key: 'analyzed', label: 'AI Analyzed', count: biomarkersData.filter(b => {
                      const analysis = biomarkerAnalysis[b.marker_name?.toLowerCase()?.replace(/\s+/g, '_')] || {};
                      return analysis.interpretation;
                    }).length }
                  ].map(filter => (
                    <button
                      key={filter.key}
                      onClick={() => {
                        setBiomarkerFilter(filter.key as any);
                        setBiomarkerPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        biomarkerFilter === filter.key
                          ? 'bg-dark-accent text-white shadow-lg'
                          : 'bg-dark-background/60 text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary border border-dark-border/50'
                      }`}
                    >
                      {filter.label} ({filter.count})
                    </button>
                  ))}
                </div>
                
                {/* Results Summary */}
                <div className="flex items-center justify-between text-sm text-dark-secondary">
                  <span>
                    Showing {paginatedBiomarkers.length} of {filteredBiomarkers.length} biomarkers
                    {biomarkerSearch && ` matching "${biomarkerSearch}"`}
                  </span>
                  {filteredBiomarkers.length !== biomarkersData.length && (
                    <button
                      onClick={() => {
                        setBiomarkerSearch('');
                        setBiomarkerFilter('all');
                        setBiomarkerPage(1);
                      }}
                      className="text-dark-accent hover:text-dark-accent/80 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
              
              {/* Biomarkers Grid */}
              <div className="grid gap-6">
                {paginatedBiomarkers.map((biomarker, index) => {
                  const analysis = biomarkerAnalysis[biomarker.marker_name?.toLowerCase()?.replace(/\s+/g, '_')] || {};
                  const cleanName = biomarker.marker_name?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Marker';
                  
                  return (
                    <BiomarkerCard 
                      key={`${biomarker.marker_name}-${index}`}
                      biomarker={biomarker}
                      analysis={analysis}
                      cleanName={cleanName}
                      index={index}
                    />
                  );
                })}
              </div>
              
              {/* Biomarker Pagination */}
              {totalBiomarkerPages > 1 && (
                <div className="mt-8 flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBiomarkerPage(Math.max(1, biomarkerPage - 1))}
                    disabled={biomarkerPage === 1}
                    className="border-dark-border text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalBiomarkerPages) }, (_, i) => {
                      let pageNum;
                      if (totalBiomarkerPages <= 5) {
                        pageNum = i + 1;
                      } else if (biomarkerPage <= 3) {
                        pageNum = i + 1;
                      } else if (biomarkerPage >= totalBiomarkerPages - 2) {
                        pageNum = totalBiomarkerPages - 4 + i;
                      } else {
                        pageNum = biomarkerPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={biomarkerPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBiomarkerPage(pageNum)}
                          className={biomarkerPage === pageNum 
                            ? "bg-dark-accent text-white" 
                            : "border-dark-border text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBiomarkerPage(Math.min(totalBiomarkerPages, biomarkerPage + 1))}
                    disabled={biomarkerPage === totalBiomarkerPages}
                    className="border-dark-border text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-blue-500/5 rounded-3xl"></div>
            <div className="relative bg-dark-panel/80 backdrop-blur-sm border border-dark-border/50 rounded-3xl p-12 text-center shadow-2xl">
              <div className="p-6 bg-gradient-to-br from-gray-500/10 to-blue-500/10 rounded-3xl w-fit mx-auto mb-6">
                <Activity className="h-16 w-16 text-dark-secondary mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-dark-primary mb-4">No Lab Results Yet</h3>
              <p className="text-dark-secondary mb-8 max-w-md mx-auto leading-relaxed">
                Complete your health assessment to unlock personalized biomarker analysis and health insights
              </p>
              <Button 
                onClick={() => router.push('/onboarding')} 
                className="bg-gradient-to-r from-dark-accent to-blue-500 hover:from-dark-accent/80 hover:to-blue-500/80 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Complete Assessment
              </Button>
            </div>
          </motion.div>
        )}

        {/* Genetic Analysis Section */}
        {snpsData.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-3xl"></div>
            
            {/* Content */}
            <div className="relative bg-dark-panel/80 backdrop-blur-sm border border-dark-border/50 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                    <Dna className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-dark-primary">Genetic Analysis</h2>
                    <p className="text-dark-secondary">Personalized genetic insights</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {snpsData.length.toLocaleString()}
                  </div>
                  <div className="text-sm text-dark-secondary font-medium">Genetic Variants</div>
                </div>
              </div>
              
              {/* Search and Filter Controls */}
              <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-secondary" />
                  <input
                    type="text"
                    placeholder="Search by gene name, rsID, or genotype..."
                    value={snpSearch}
                    onChange={(e) => setSnpSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-dark-background/60 border border-dark-border/50 rounded-xl text-dark-primary placeholder-dark-secondary focus:outline-none focus:border-dark-accent/50 focus:ring-2 focus:ring-dark-accent/20 transition-all"
                  />
                </div>
                
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: 'all', label: 'All Variants', count: snpsData.length },
                    { key: 'low', label: 'Low Risk', count: snpsData.filter(s => {
                      const gene = s.supported_snps?.gene || s.gene_name || 'Unknown';
                      const rsid = s.supported_snps?.rsid || s.snp_id || 'Unknown';
                      const analysis = snpAnalysis[`${gene} (${rsid})`] || {};
                      return analysis.riskColor === 'green' || !analysis.riskColor;
                    }).length },
                    { key: 'moderate', label: 'Moderate Risk', count: snpsData.filter(s => {
                      const gene = s.supported_snps?.gene || s.gene_name || 'Unknown';
                      const rsid = s.supported_snps?.rsid || s.snp_id || 'Unknown';
                      const analysis = snpAnalysis[`${gene} (${rsid})`] || {};
                      return analysis.riskColor === 'orange';
                    }).length },
                    { key: 'high', label: 'High Risk', count: snpsData.filter(s => {
                      const gene = s.supported_snps?.gene || s.gene_name || 'Unknown';
                      const rsid = s.supported_snps?.rsid || s.snp_id || 'Unknown';
                      const analysis = snpAnalysis[`${gene} (${rsid})`] || {};
                      return analysis.riskColor === 'red';
                    }).length },
                    { key: 'analyzed', label: 'AI Analyzed', count: snpsData.filter(s => {
                      const gene = s.supported_snps?.gene || s.gene_name || 'Unknown';
                      const rsid = s.supported_snps?.rsid || s.snp_id || 'Unknown';
                      const analysis = snpAnalysis[`${gene} (${rsid})`] || {};
                      return analysis.variantEffect;
                    }).length }
                  ].map(filter => (
                    <button
                      key={filter.key}
                      onClick={() => {
                        setSnpFilter(filter.key as any);
                        setSnpPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        snpFilter === filter.key
                          ? 'bg-dark-accent text-white shadow-lg'
                          : 'bg-dark-background/60 text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary border border-dark-border/50'
                      }`}
                    >
                      {filter.label} ({filter.count})
                    </button>
                  ))}
                </div>
                
                {/* Results Summary */}
                <div className="flex items-center justify-between text-sm text-dark-secondary">
                  <span>
                    Showing {paginatedSnps.length} of {filteredSnps.length} genetic variants
                    {snpSearch && ` matching "${snpSearch}"`}
                  </span>
                  {filteredSnps.length !== snpsData.length && (
                    <button
                      onClick={() => {
                        setSnpSearch('');
                        setSnpFilter('all');
                        setSnpPage(1);
                      }}
                      className="text-dark-accent hover:text-dark-accent/80 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
              
              {/* SNPs Grid */}
              <div className="space-y-4">
                {paginatedSnps.map((snp, index) => {
                  const gene = snp.supported_snps?.gene || snp.gene_name || 'Unknown';
                  const rsid = snp.supported_snps?.rsid || snp.snp_id || 'Unknown';
                  const analysis = snpAnalysis[`${gene} (${rsid})`] || {};
                  
                  return (
                    <SnpCard 
                      key={`${gene}-${rsid}-${index}`}
                      snp={snp}
                      analysis={analysis}
                      gene={gene}
                      rsid={rsid}
                      index={index}
                    />
                  );
                })}
              </div>
              
              {/* SNP Pagination */}
              {totalSnpPages > 1 && (
                <div className="mt-8 flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSnpPage(Math.max(1, snpPage - 1))}
                    disabled={snpPage === 1}
                    className="border-dark-border text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalSnpPages) }, (_, i) => {
                      let pageNum;
                      if (totalSnpPages <= 5) {
                        pageNum = i + 1;
                      } else if (snpPage <= 3) {
                        pageNum = i + 1;
                      } else if (snpPage >= totalSnpPages - 2) {
                        pageNum = totalSnpPages - 4 + i;
                      } else {
                        pageNum = snpPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={snpPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSnpPage(pageNum)}
                          className={snpPage === pageNum 
                            ? "bg-dark-accent text-white" 
                            : "border-dark-border text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSnpPage(Math.min(totalSnpPages, snpPage + 1))}
                    disabled={snpPage === totalSnpPages}
                    className="border-dark-border text-dark-secondary hover:bg-dark-background/80 hover:text-dark-primary disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl"></div>
            <div className="relative bg-dark-panel/80 backdrop-blur-sm border border-dark-border/50 rounded-3xl p-12 text-center shadow-2xl">
              <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl w-fit mx-auto mb-6">
                <Dna className="h-16 w-16 text-dark-secondary mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-dark-primary mb-4">No Genetic Data Yet</h3>
              <p className="text-dark-secondary mb-8 max-w-md mx-auto leading-relaxed">
                Complete your genetic assessment to unlock personalized genetic insights and recommendations
              </p>
              <Button 
                onClick={() => router.push('/onboarding')} 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-500/80 hover:to-pink-500/80 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Complete Assessment
              </Button>
            </div>
          </motion.div>
        )}

        {/* Action Center */}
        {(biomarkersData.length > 0 || snpsData.length > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-dark-accent/5 to-blue-500/5 rounded-3xl"></div>
            <div className="relative bg-dark-panel/80 backdrop-blur-sm border border-dark-border/50 rounded-3xl p-8 text-center shadow-2xl">
              <h3 className="text-2xl font-bold text-dark-primary mb-4">Keep Your Analysis Fresh</h3>
              <p className="text-dark-secondary mb-6 max-w-md mx-auto">
                Refresh your analysis to get the latest insights as our AI models improve
              </p>
              <Button 
                onClick={triggerRecomputation}
                disabled={analysisComputing}
                className="bg-gradient-to-r from-dark-accent to-blue-500 hover:from-dark-accent/80 hover:to-blue-500/80 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                <Sparkles className="h-5 w-5 mr-3" />
                {analysisComputing ? 'Computing...' : 'Refresh Analysis'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderTracking = () => (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="text-center px-4 sm:px-0">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 sm:mb-2">
          AI-Powered Health Tracking
        </h2>
        <p className="text-dark-secondary text-sm sm:text-base">Personalized questions generated just for you based on your health profile</p>
      </div>

      {/* Dynamic Tracker Component */}
      <div className="px-4 sm:px-0">
        {user && <DynamicTracker userId={user.id} key={`tracker-${new Date().toISOString().split('T')[0]}`} />}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="px-4 sm:px-0">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-dark-primary">Settings</h1>
        <p className="text-sm sm:text-base lg:text-lg text-dark-secondary mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Referral System */}
      <div className="bg-dark-panel border border-dark-border rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Network className="h-5 w-5 sm:h-6 sm:w-6 text-dark-accent" />
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-dark-primary">Refer Friends</h3>
        </div>
        <p className="text-dark-secondary mb-4 sm:mb-6 text-sm sm:text-base">
          Share SupplementScribe with friends and help them optimize their health too!
        </p>
        
        {profile?.referral_code ? (
          <div className="space-y-3 sm:space-y-4">
            {/* Referral Code */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-dark-secondary mb-1.5 sm:mb-2 block">
                Your Referral Code
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="flex-1 bg-dark-background border border-dark-border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3">
                  <code className="text-base sm:text-lg font-mono text-dark-accent">{profile.referral_code}</code>
                </div>
                <Button
                  onClick={copyReferralCode}
                  variant="outline"
                  className="px-3 sm:px-4 py-2.5 sm:py-3 border-dark-border hover:bg-dark-border text-dark-primary hover:text-dark-primary bg-dark-panel touch-target"
                >
                  {copiedReferralCode ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    'Copy'
                  )}
                </Button>
              </div>
            </div>

            {/* Referral URL */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-dark-secondary mb-1.5 sm:mb-2 block">
                Your Referral Link
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="flex-1 bg-dark-background border border-dark-border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 overflow-hidden">
                  <code className="text-xs sm:text-sm text-dark-primary break-all">
                    {generateReferralUrl(profile.referral_code)}
                  </code>
                </div>
                <Button
                  onClick={copyReferralUrl}
                  variant="outline"
                  className="px-3 sm:px-4 py-2.5 sm:py-3 border-dark-border hover:bg-dark-border text-dark-primary hover:text-dark-primary bg-dark-panel touch-target"
                >
                  {copiedReferralUrl ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    'Copy'
                  )}
                </Button>
              </div>
            </div>

            {/* Referral Stats */}
            <div className="bg-dark-background border border-dark-border rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-dark-secondary">People you've referred</p>
                  <p className="text-xl sm:text-2xl font-bold text-dark-accent">{profile.referral_count || 0}</p>
                </div>
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-dark-accent" />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <div className="bg-dark-background border border-dark-border rounded-lg p-4 sm:p-6">
              <Network className="h-10 w-10 sm:h-12 sm:w-12 text-dark-accent mx-auto mb-3 sm:mb-4" />
              <h4 className="text-base sm:text-lg font-semibold text-dark-primary mb-1.5 sm:mb-2">Setting up your referral code...</h4>
              <p className="text-dark-secondary mb-3 sm:mb-4 text-sm sm:text-base">
                Click the button below to generate your unique referral code.
              </p>
              <div className="space-y-2 sm:space-y-3">
                <Button 
                  onClick={generateReferralCodeForExistingUser}
                  className="bg-dark-accent text-white hover:bg-dark-accent/80 w-full sm:w-auto text-sm sm:text-base touch-target"
                >
                  Generate My Referral Code
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  className="border-dark-border text-dark-primary hover:bg-dark-border hover:text-dark-primary bg-dark-panel w-full sm:w-auto text-sm sm:text-base touch-target"
                >
                  Refresh Page
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Management */}
      <div className="bg-dark-panel border border-dark-border rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-dark-accent" />
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-dark-primary">Subscription & Orders</h3>
        </div>
        
        {/* Current Plan */}
        <div className="bg-dark-background border border-dark-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-dark-primary">Current Plan</h4>
              <p className="text-dark-secondary text-xs sm:text-sm">Your active subscription tier</p>
            </div>
            <div className="sm:text-right">
              <div className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                profile?.subscription_tier === 'full' 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {profile?.subscription_tier === 'full' ? 'Complete Package' : 'Software Only'}
              </div>
              <p className="text-dark-accent font-bold text-base sm:text-lg mt-1">
                {profile?.subscription_tier === 'full' ? '$75.00/month' : '$19.99/month'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-dark-secondary">Plan Features:</p>
              <ul className="space-y-1 text-sm text-dark-primary">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  AI Health Analysis & Scoring
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Personalized Supplement Plans
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Custom Diet Plans & Groceries
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Health Tracking & Insights
                </li>
                {profile?.subscription_tier === 'full' && (
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="font-medium text-dark-accent">Monthly Supplement Delivery</span>
                  </li>
                )}
              </ul>
            </div>
            
            {profile?.subscription_tier === 'full' && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-dark-secondary">Next Delivery:</p>
                <div className="bg-dark-panel border border-dark-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-dark-accent" />
                    <span className="text-sm font-medium text-dark-primary">6-Supplement Pack</span>
                  </div>
                  <p className="text-xs text-dark-secondary">
                    Estimated: {nextDeliveryDate ? 
                      new Date(nextDeliveryDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      }) : 
                      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        {profile?.subscription_tier === 'full' && (
          <div className="bg-dark-background border border-dark-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-dark-primary">Recent Orders</h4>
              <Button 
                variant="outline" 
                className="text-sm border-dark-border hover:bg-dark-border text-dark-primary hover:text-dark-primary bg-dark-panel"
                onClick={() => {
                  // TODO: Implement order history modal or page
                  alert('Order history feature coming soon!');
                }}
              >
                View All Orders
              </Button>
            </div>
            
            {isLoadingOrders ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-accent mx-auto mb-2"></div>
                <p className="text-sm text-dark-secondary">Loading orders...</p>
              </div>
            ) : subscriptionOrders.length > 0 ? (
              <div className="space-y-3">
                {subscriptionOrders.slice(0, 3).map((order, index) => {
                  const orderDate = new Date(order.order_date).toLocaleDateString();
                  const statusColors = {
                    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                    processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    shipped: 'bg-green-500/10 text-green-400 border-green-500/20',
                    delivered: 'bg-green-600/10 text-green-300 border-green-600/20',
                    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
                    cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  };
                  
                  return (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-dark-panel border border-dark-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-dark-accent/10 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-dark-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-dark-primary">6-Supplement Pack</p>
                          <p className="text-sm text-dark-secondary">
                            {order.shopify_order_id ? `Order #${order.shopify_order_id.slice(-6)}` : `Order #${order.id.slice(-6)}`} • {orderDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors] || statusColors.pending}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                        <p className="text-sm text-dark-accent font-medium mt-1">
                          ${order.order_total ? Number(order.order_total).toFixed(2) : '75.00'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Package className="h-12 w-12 text-dark-secondary mx-auto mb-3 opacity-50" />
                <p className="text-dark-secondary">No orders yet</p>
                <p className="text-sm text-dark-secondary mt-1">Your first order will appear here after generation</p>
              </div>
            )}
          </div>
        )}

        {/* Billing & Payment */}
        <div className="bg-dark-background border border-dark-border rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-dark-primary mb-4">Billing & Payment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-dark-secondary mb-2">Payment Method</p>
              <div className="flex items-center gap-3 p-3 bg-dark-panel border border-dark-border rounded-lg">
                <CreditCard className="h-5 w-5 text-dark-accent" />
                <div>
                  <p className="text-sm font-medium text-dark-primary">•••• •••• •••• 4242</p>
                  <p className="text-xs text-dark-secondary">Expires 12/25</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-dark-secondary mb-2">Next Billing Date</p>
              <div className="p-3 bg-dark-panel border border-dark-border rounded-lg">
                <p className="text-sm font-medium text-dark-primary">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-dark-secondary">
                  ${profile?.subscription_tier === 'full' ? '75.00' : '19.99'} will be charged
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button 
              variant="outline" 
              className="border-dark-border hover:bg-dark-border text-dark-primary hover:text-dark-primary bg-dark-panel"
              onClick={() => {
                // TODO: Implement payment method update
                alert('Payment method update coming soon!');
              }}
            >
              Update Payment Method
            </Button>
            <Button 
              variant="outline" 
              className="border-dark-border hover:bg-dark-border text-dark-primary hover:text-dark-primary bg-dark-panel"
              onClick={() => {
                // TODO: Implement billing history
                alert('Billing history feature coming soon!');
              }}
            >
              View Billing History
            </Button>
          </div>
        </div>

        {/* Plan Management */}
        <div className="bg-dark-background border border-dark-border rounded-lg p-6">
          <h4 className="text-lg font-semibold text-dark-primary mb-4">Plan Management</h4>
          
          <div className="space-y-4">
            {profile?.subscription_tier === 'full' && (
              <>
                <div className="flex items-center justify-between p-4 bg-dark-panel border border-dark-border rounded-lg">
                  <div>
                    <p className="font-medium text-dark-primary">Pause Deliveries</p>
                    <p className="text-sm text-dark-secondary">Temporarily pause your monthly supplement deliveries</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-dark-border hover:bg-dark-border text-dark-primary hover:text-dark-primary bg-dark-panel"
                    onClick={() => {
                      // TODO: Implement delivery pause
                      alert('Delivery pause feature coming soon!');
                    }}
                  >
                    Pause
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-dark-panel border border-dark-border rounded-lg">
                  <div>
                    <p className="font-medium text-dark-primary">Downgrade to Software Only</p>
                    <p className="text-sm text-dark-secondary">Keep AI features, cancel supplement deliveries</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-dark-border hover:bg-dark-border text-orange-400 hover:text-orange-300 bg-dark-panel"
                    onClick={() => {
                      // TODO: Implement plan downgrade
                      alert('Plan downgrade feature coming soon!');
                    }}
                  >
                    Downgrade
                  </Button>
                </div>
              </>
            )}
            
            {profile?.subscription_tier === 'software_only' && (
              <div className="flex items-center justify-between p-4 bg-dark-panel border border-dark-border rounded-lg">
                <div>
                  <p className="font-medium text-dark-primary">Upgrade to Complete Package</p>
                  <p className="text-sm text-dark-secondary">Get monthly supplement delivery - $75.00/month</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-dark-border hover:bg-dark-border text-green-400 hover:text-green-300 bg-dark-panel"
                  onClick={() => {
                    // TODO: Implement plan upgrade
                    alert('Plan upgrade feature coming soon!');
                  }}
                >
                  Upgrade
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-between p-4 bg-dark-panel border border-red-500/20 rounded-lg">
              <div>
                <p className="font-medium text-red-400">Cancel Subscription</p>
                <p className="text-sm text-dark-secondary">Cancel your subscription and end all services</p>
              </div>
              <Button 
                variant="outline" 
                className="border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-300 bg-dark-panel"
                onClick={() => setShowCancelConfirm(true)}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-6 w-6 text-dark-secondary" />
          <h3 className="text-2xl font-semibold text-dark-primary">Account Settings</h3>
        </div>
        <p className="text-dark-secondary">
          Manage your account settings, notification preferences, and data privacy options.
        </p>
        <p className="text-dark-secondary text-sm mt-2">
          This feature is coming soon!
        </p>
      </div>
    </div>
  );

  const renderAIChat = () => {
    return (
      <div className="flex flex-col h-[calc(100vh-10rem)] sm:h-[calc(100vh-10rem)]"> {/* Adjusted height */}
        {/* Fixed Header */}
        <div className="flex-shrink-0 mb-4 sm:mb-6 px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight text-dark-primary">AI Assistant</h1>
              <p className="mt-1 text-dark-secondary text-sm sm:text-base">Your personalized health optimization expert.</p>
            </div>
            <Button onClick={startNewConversation} variant="outline" className="text-dark-secondary border-dark-border bg-dark-panel hover:bg-dark-border hover:text-dark-primary w-full sm:w-auto touch-target">
              New Chat
            </Button>
          </div>
        </div>
        <div className="flex flex-1 min-h-0 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
          <div className="hidden lg:flex lg:flex-col w-1/3 max-w-sm flex-shrink-0">
            <div className="flex flex-col h-full bg-dark-panel border border-dark-border rounded-lg">
              <h3 className="flex-shrink-0 p-4 font-semibold border-b border-dark-border text-dark-primary">Chat History</h3>
              <div className="p-2 space-y-2 overflow-y-auto">
                {chatHistory.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`w-full p-3 text-left rounded-md transition-colors ${currentConversationId === conv.id ? 'bg-dark-accent text-white' : 'hover:bg-dark-border'}`}
                  >
                    <p className="font-semibold truncate">{conv.title}</p>
                    <p className={`text-xs ${currentConversationId === conv.id ? 'text-white/70' : 'text-dark-secondary'}`}>{getTimeAgo(conv.updated_at)}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 h-full min-w-0">
            <div className="flex flex-col h-full bg-dark-panel border border-dark-border rounded-lg">
              {/* Messages Container - This is the scrollable part */}
              <div ref={chatContainerRef} className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-dark-secondary">
                    <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 rounded-full bg-dark-accent/10 text-dark-accent">
                      <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-dark-primary">AI Health Assistant</h3>
                    <p className="text-sm sm:text-base">Ask me anything about your health data.</p>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' &&
                          <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-dark-accent">
                            <Sparkles className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                          </div>
                        }
                        <div className={`p-3 sm:p-4 rounded-lg max-w-[85%] sm:max-w-2xl ${msg.role === 'user' ? 'bg-dark-accent text-white' : 'bg-dark-background'}`}>
                          <div className="prose prose-sm prose-invert max-w-none prose-p:my-0 prose-p:text-dark-primary text-xs sm:text-sm">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start gap-2 sm:gap-3">
                        <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-dark-accent">
                          <Sparkles className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="p-3 sm:p-4 rounded-lg bg-dark-border">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-dark-accent animate-pulse" style={{ animationDelay: '0s' }} />
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-dark-accent animate-pulse" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-dark-accent animate-pulse" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 p-3 sm:p-4 bg-dark-panel border-t border-dark-border">
                <form onSubmit={(e) => { e.preventDefault(); if (chatInput.trim()) sendMessage(chatInput); }} className="relative">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (chatInput.trim()) sendMessage(chatInput);
                      }
                    }}
                    placeholder="Ask about your results, supplements, or health..."
                    className="w-full p-2.5 sm:p-3 pr-14 sm:pr-20 text-white bg-dark-background border-2 border-dark-border rounded-lg resize-none placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent text-sm sm:text-base"
                    rows={1}
                    disabled={isChatLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isChatLoading || !chatInput.trim()}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 p-0 bg-dark-accent text-white rounded-full hover:bg-dark-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl touch-target"
                  >
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProductChecker = () => (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-primary">Product Compatibility Checker</h2>
          <p className="text-dark-secondary mt-1 text-sm sm:text-base">Analyze any supplement product against your unique health profile.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={toggleArchive}
          className="bg-dark-panel border-dark-border text-dark-primary hover:bg-dark-border w-full sm:w-auto touch-target"
        >
          {showArchive ? 'Hide Archive' : 'View Archive'}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
        <input
          type="url"
          value={productUrl}
          onChange={(e) => setProductUrl(e.target.value)}
          placeholder="Paste direct product link"
          className="flex-grow bg-dark-panel border border-dark-border rounded-md px-3 sm:px-4 py-2.5 sm:py-2 text-dark-primary placeholder-dark-secondary focus:ring-2 focus:ring-dark-accent focus:outline-none text-sm sm:text-base"
          disabled={isCheckingProduct}
        />
        <Button onClick={checkProduct} disabled={isCheckingProduct || !productUrl} className="w-full sm:w-auto touch-target">
          {isCheckingProduct ? 'Analyzing...' : <><Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> Analyze</>}
        </Button>
      </div>

      {productCheckError && (
        <div className="p-3 sm:p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-md text-sm sm:text-base">
          <p><strong>Analysis Failed:</strong> {productCheckError}</p>
        </div>
      )}

      {isCheckingProduct && (
        <div className="text-center py-6 sm:py-8 lg:py-10">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-dark-accent mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-dark-secondary text-sm sm:text-base">Scraping product page and running analysis...</p>
        </div>
      )}

      {productAnalysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">
          <Card className="bg-dark-panel border-dark-border">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl text-dark-primary">{productAnalysis.productName}</CardTitle>
              <CardDescription className="text-dark-secondary text-sm sm:text-base">{productAnalysis.brand}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:space-x-4">
                <div className={`text-3xl sm:text-4xl font-bold ${productAnalysis.overallScore > 75 ? 'text-green-400' : productAnalysis.overallScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{productAnalysis.overallScore}/100</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-dark-primary text-sm sm:text-base">Overall Compatibility</h4>
                  <p className="text-dark-secondary text-sm sm:text-base">{productAnalysis.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="bg-dark-panel border-dark-border">
              <CardHeader className="p-4 sm:p-6"><CardTitle className="text-base sm:text-lg text-green-400 flex items-center"><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"/>Pros</CardTitle></CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ul className="space-y-1.5 sm:space-y-2 list-disc list-inside text-dark-secondary text-sm sm:text-base">
                  {productAnalysis.pros.map((pro: string, i: number) => <li key={i}>{pro}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-dark-panel border-dark-border">
              <CardHeader className="p-4 sm:p-6"><CardTitle className="text-base sm:text-lg text-yellow-400 flex items-center"><AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"/>Cons & Considerations</CardTitle></CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ul className="space-y-1.5 sm:space-y-2 list-disc list-inside text-dark-secondary text-sm sm:text-base">
                  {productAnalysis.cons.map((con: string, i: number) => <li key={i}>{con}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {productAnalysis.warnings?.length > 0 && (
            <Card className="bg-red-900/30 border-red-700">
              <CardHeader className="p-4 sm:p-6"><CardTitle className="text-base sm:text-lg text-red-300 flex items-center"><AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2"/>Important Warnings</CardTitle></CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ul className="space-y-1.5 sm:space-y-2 list-disc list-inside text-red-300 text-sm sm:text-base">
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
          <div className="border-t border-dark-border pt-6 sm:pt-8">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-dark-primary mb-3 sm:mb-4">Product Check History</h3>
            
            {isLoadingHistory ? (
              <div className="text-center py-6 sm:py-8">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-dark-accent mx-auto"></div>
                <p className="mt-2 text-dark-secondary text-sm sm:text-base">Loading history...</p>
              </div>
            ) : productHistory.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-dark-secondary text-sm sm:text-base">No product checks yet. Analyze a product to start building your history!</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {productHistory.map((check) => (
                  <Card key={check.id} className="bg-dark-panel border-dark-border">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-dark-primary text-sm sm:text-base">{check.product_name}</h4>
                          <p className="text-xs sm:text-sm text-dark-secondary">{check.brand}</p>
                          <p className="text-xs text-dark-secondary mt-1">{getTimeAgo(check.created_at)}</p>
                        </div>
                        <div className="flex items-center justify-between sm:space-x-4">
                          <div className={`text-xl sm:text-2xl font-bold ${check.overall_score > 75 ? 'text-green-400' : check.overall_score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {check.overall_score}/100
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setProductAnalysis(check.full_analysis)}
                            className="bg-dark-background border-dark-border text-dark-primary hover:bg-dark-border text-xs sm:text-sm"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-dark-secondary mt-2 line-clamp-2">{check.analysis_summary}</p>
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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="p-2 sm:p-3 bg-dark-border rounded-lg">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-dark-accent" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-dark-primary">Study Buddy</h1>
            <p className="text-sm sm:text-base lg:text-lg text-dark-secondary mt-1">
              Personalized analysis of scientific research based on your genetics, biomarkers, and health profile
            </p>
          </div>
        </div>
      </div>

      {/* URL Input Section */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-dark-primary mb-3 sm:mb-4">Analyze a New Study</h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <input
              type="url"
              value={studyUrl}
              onChange={(e) => setStudyUrl(e.target.value)}
              placeholder="Enter PubMed URL or any scientific study link..."
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-background border border-dark-border rounded-lg text-dark-primary placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent text-sm sm:text-base"
            />
          </div>
          <Button
            onClick={analyzeStudy}
            disabled={isAnalyzingStudy || !studyUrl}
            className="bg-dark-accent text-white hover:bg-dark-accent/80 px-4 sm:px-6 py-2.5 sm:py-3 w-full sm:w-auto touch-target"
          >
            {isAnalyzingStudy ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-sm sm:text-base">Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-base">Analyze Study</span>
              </div>
            )}
          </Button>
        </div>
        {studyError && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-900/50 border border-red-600 rounded-lg">
            <p className="text-red-400 text-sm sm:text-base">{studyError}</p>
          </div>
        )}
      </div>

      {/* Latest Analysis */}
      {studyAnalysis && (
        <div className="bg-dark-panel border border-dark-border rounded-xl p-4 sm:p-6">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-dark-primary mb-3 sm:mb-4">Latest Analysis</h2>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                <span className="text-dark-secondary text-sm sm:text-base">Personal Relevance:</span>
                <span className="text-xl sm:text-2xl font-bold text-dark-accent">{studyAnalysis.relevanceScore}/10</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-dark-accent mb-1.5 sm:mb-2 text-sm sm:text-base">Personalized Summary</h3>
              <p className="text-dark-secondary text-sm sm:text-base">{studyAnalysis.personalizedSummary}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-dark-accent mb-1.5 sm:mb-2 text-sm sm:text-base">Personal Explanation</h3>
              <p className="text-dark-secondary text-sm sm:text-base">{studyAnalysis.personalizedExplanation}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-dark-accent mb-1.5 sm:mb-2 text-sm sm:text-base">Key Findings</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {studyAnalysis.keyFindings?.map((finding: string, index: number) => (
                  <li key={index} className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-dark-accent mt-0.5 sm:mt-1">•</span>
                    <span className="text-dark-secondary text-sm sm:text-base">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-dark-accent mb-1.5 sm:mb-2 text-sm sm:text-base">Your Personalized Recommendations</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {studyAnalysis.actionableRecommendations?.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-green-400 mt-0.5 sm:mt-1">✓</span>
                    <span className="text-dark-secondary text-sm sm:text-base">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Study History */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-dark-primary mb-3 sm:mb-4">Your Study History</h2>
        {isLoadingStudies ? (
          <div className="text-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-dark-accent mx-auto"></div>
            <p className="mt-2 text-dark-secondary text-sm sm:text-base">Loading studies...</p>
          </div>
        ) : userStudies.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {userStudies.map((study) => (
              <div
                key={study.id}
                className="p-3 sm:p-4 bg-dark-background border border-dark-border rounded-lg hover:border-dark-accent transition-colors cursor-pointer"
                onClick={() => setSelectedStudy(study)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-primary mb-1 text-sm sm:text-base">
                      {study.study_title || 'Unknown Title'}
                    </h3>
                    <p className="text-dark-secondary text-xs sm:text-sm mb-2 line-clamp-2">
                      {study.personalized_summary || 'No summary available'}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-dark-secondary">
                      <span>Relevance: {study.relevance_score}/10</span>
                      <span>{new Date(study.created_at).toLocaleDateString()}</span>
                      {study.pmid && <span>PMID: {study.pmid}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-dark-border text-dark-secondary hover:bg-dark-border h-8 w-8 p-0"
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
          <div className="text-center py-6 sm:py-8">
            <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-dark-secondary mx-auto mb-3 sm:mb-4" />
            <p className="text-dark-secondary text-sm sm:text-base">No studies analyzed yet.</p>
            <p className="text-dark-secondary text-xs sm:text-sm">Add a study URL above to get started!</p>
          </div>
        )}
      </div>

      {/* Selected Study Detail Modal */}
      {selectedStudy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-dark-panel border border-dark-border rounded-xl p-4 sm:p-6 w-full max-w-full sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-dark-primary">Study Analysis</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStudy(null)}
                className="border-dark-border text-dark-secondary hover:bg-dark-border h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Study Header */}
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-dark-primary mb-1.5 sm:mb-2">{selectedStudy.study_title}</h3>
                {selectedStudy.study_authors && (
                  <p className="text-dark-secondary text-xs sm:text-sm mb-1.5 sm:mb-2">{selectedStudy.study_authors}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-dark-secondary mb-3 sm:mb-4">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400" />
                    Personal Relevance: {selectedStudy.relevance_score}/10
                  </span>
                  <span>{new Date(selectedStudy.created_at).toLocaleDateString()}</span>
                  {selectedStudy.pmid && <span>PMID: {selectedStudy.pmid}</span>}
                  {selectedStudy.journal_name && <span className="hidden sm:inline">{selectedStudy.journal_name}</span>}
                </div>
              </div>
              
              {/* Personalized Summary */}
              <div>
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-dark-primary mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-dark-accent" />
                  Personalized Summary
                </h4>
                <div className="bg-dark-background border border-dark-border rounded-lg p-3 sm:p-4">
                  <p className="text-dark-primary leading-relaxed text-sm sm:text-base">{selectedStudy.personalized_summary}</p>
                </div>
              </div>

              {/* Personal Explanation */}
              <div>
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-dark-primary mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-dark-accent" />
                  Personal Explanation
                </h4>
                <div className="bg-dark-background border border-dark-border rounded-lg p-3 sm:p-4">
                  <p className="text-dark-primary leading-relaxed text-sm sm:text-base">{selectedStudy.personalized_explanation}</p>
                </div>
              </div>
              
              {/* Key Findings */}
              <div>
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-dark-primary mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-dark-accent" />
                  Key Findings
                </h4>
                <div className="bg-dark-background border border-dark-border rounded-lg p-3 sm:p-4">
                  <ul className="space-y-2 sm:space-y-3">
                    {selectedStudy.key_findings?.map((finding: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3">
                        <span className="text-dark-accent mt-0.5 sm:mt-1 text-base sm:text-lg">•</span>
                        <span className="text-dark-primary leading-relaxed text-sm sm:text-base">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Your Personalized Recommendations */}
              <div>
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-dark-primary mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                  Your Personalized Recommendations
                </h4>
                <div className="bg-dark-background border border-dark-border rounded-lg p-3 sm:p-4">
                  <ul className="space-y-2 sm:space-y-3">
                    {selectedStudy.actionable_recommendations?.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3">
                        <span className="text-green-400 mt-0.5 sm:mt-1 text-base sm:text-lg font-bold">✓</span>
                        <span className="text-dark-primary leading-relaxed text-sm sm:text-base">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Important Considerations */}
              {selectedStudy.limitations && selectedStudy.limitations.length > 0 && (
                <div>
                  <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-dark-primary mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                    Important Considerations
                  </h4>
                  <div className="bg-dark-background border border-dark-border rounded-lg p-3 sm:p-4">
                    <ul className="space-y-2 sm:space-y-3">
                      {selectedStudy.limitations.map((limitation: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 sm:gap-3">
                          <span className="text-yellow-400 mt-0.5 sm:mt-1 text-base sm:text-lg">⚠</span>
                          <span className="text-dark-primary leading-relaxed text-sm sm:text-base">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-3 sm:pt-4 mt-4 sm:mt-6 border-t border-dark-border">
              <Button
                onClick={() => window.open(selectedStudy.study_url, '_blank')}
                className="bg-dark-accent text-white hover:bg-dark-accent/80 w-full sm:w-auto touch-target"
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="text-sm sm:text-base">View Original Study</span>
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
      case 'diet-groceries':
        return renderDietGroceries();
      case 'analysis':
        return renderEnhancedAnalysis();
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

  // Referral functions
  const copyReferralCode = async () => {
    if (profile?.referral_code) {
      await navigator.clipboard.writeText(profile.referral_code);
      setCopiedReferralCode(true);
      setTimeout(() => setCopiedReferralCode(false), 2000);
    }
  };

  const copyReferralUrl = async () => {
    if (profile?.referral_code) {
      const url = generateReferralUrl(profile.referral_code);
      await navigator.clipboard.writeText(url);
      setCopiedReferralUrl(true);
      setTimeout(() => setCopiedReferralUrl(false), 2000);
    }
  };

  const generateReferralCodeForExistingUser = async () => {
    if (!user?.id || profile?.referral_code) return;

    try {
      console.log('🔍 Starting referral code generation for user:', user.id);
      
      // FIRST: Test if we can even access the table structure
      console.log('🧪 Testing schema access...');
      const { data: schemaTest, error: schemaError } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('id', user.id)
        .single();
      
      console.log('🧪 Schema test result:', { schemaTest, schemaError });
      
      if (schemaError) {
        console.error('❌ Basic schema access failed:', schemaError);
        return;
      }
      
      // First, check if user profile exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('👤 User profile check:', { existingProfile, profileCheckError });
      
      if (profileCheckError || !existingProfile) {
        console.error('❌ User profile does not exist! Cannot update referral code.');
        return;
      }
      
      // Generate a unique referral code using the utility function
      const { generateReferralCode } = await import('@/lib/referral-utils');
      let newCode = generateReferralCode();
      
      console.log('🎲 Generated code:', newCode);
      
      // Check uniqueness with a simple retry
      let attempts = 0;
      while (attempts < 5) {
        const { data: existingUser, error: checkError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('referral_code', newCode)
          .single();
        
        console.log('🔍 Uniqueness check result:', { existingUser, checkError });
        
        if (!existingUser) break; // Code is unique
        
        newCode = generateReferralCode();
        attempts++;
        console.log('🔄 Retry attempt', attempts, 'with new code:', newCode);
      }
      
      console.log('✅ Final unique code:', newCode);
      
      // INSTEAD OF UPSERT, try a simple UPDATE first
      console.log('📝 Attempting to UPDATE profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ referral_code: newCode })
        .eq('id', user.id)
        .select('*')
        .single();

      console.log('📊 Update result:', { data, error });

      if (error) {
        console.error('❌ Supabase update error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // If UPDATE fails, try UPSERT as fallback
        console.log('🔄 Trying UPSERT as fallback...');
        const { data: upsertData, error: upsertError } = await supabase
          .from('user_profiles')
          .upsert({ 
            id: user.id,
            referral_code: newCode 
          })
          .select('*')
          .single();
          
        console.log('📊 Upsert result:', { upsertData, upsertError });
        
        if (upsertError) {
          throw upsertError;
        }
        
        if (upsertData) {
          console.log('✅ Successfully updated profile with referral code via upsert');
          setProfile(upsertData);
        }
        return;
      }

      if (data) {
        console.log('✅ Successfully updated profile with referral code');
        setProfile(data);
      }
    } catch (error) {
      console.error('💥 Full error generating referral code:', error);
    }
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

  const loadSubscriptionOrders = async () => {
    if (!user || profile?.subscription_tier !== 'full') return;
    
    setIsLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('supplement_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading subscription orders:', error);
        setSubscriptionOrders([]);
      } else {
        setSubscriptionOrders(data || []);
        
        // Calculate next delivery date from most recent order
        if (data && data.length > 0) {
          const mostRecentOrder = data[0];
          if (mostRecentOrder.next_order_date) {
            setNextDeliveryDate(mostRecentOrder.next_order_date);
          } else {
            // Calculate 30 days from order date if next_order_date is null
            const orderDate = new Date(mostRecentOrder.order_date);
            const nextDate = new Date(orderDate.getTime() + (30 * 24 * 60 * 60 * 1000));
            setNextDeliveryDate(nextDate.toISOString().split('T')[0]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load subscription orders:', error);
      setSubscriptionOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const toggleArchive = () => {
    setShowArchive(!showArchive);
    if (!showArchive && productHistory.length === 0) {
      loadProductHistory();
    }
  };
  
  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelSubscription();
      
      if (result.success) {
        // Update local profile state
        setProfile((prev: any) => ({ 
          ...prev, 
          subscription_tier: null,
          subscription_cancelled_at: new Date().toISOString()
        }));
        
        // Show success message briefly
        alert(result.message || 'Your subscription has been cancelled successfully.');
        
        // Redirect to homepage
        router.push('/');
      } else {
        alert(result.error || 'Failed to cancel subscription. Please try again.');
        setIsCancelling(false);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('An unexpected error occurred. Please try again.');
      setIsCancelling(false);
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
            className="flex h-screen relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mobile Menu Button - Only visible on small screens */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-panel border border-dark-border rounded-lg"
            >
              <Menu className="h-5 w-5 text-dark-primary" />
            </button>

            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
              <div 
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* Sidebar - IDENTICAL design, just responsive positioning */}
            <div className={`
              w-64 bg-dark-panel border-r border-dark-border flex flex-col
              lg:relative lg:block
              ${isMobileMenuOpen ? 'fixed' : 'hidden lg:flex'}
              ${isMobileMenuOpen ? 'inset-y-0 left-0 z-50' : ''}
            `}>
              {/* Mobile Close Button - Only shows on mobile when open */}
              {isMobileMenuOpen && (
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="lg:hidden absolute top-4 right-4 p-1 text-dark-secondary hover:text-dark-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              )}

              {/* EXACT SAME CONTENT - ZERO CHANGES */}
              <div className="p-6 border-b border-dark-border flex items-center gap-3 flex-shrink-0">
                <h1 className="text-xl font-bold text-dark-primary tracking-tighter">SupplementScribe</h1>
              </div>
              <div className="p-4 flex-shrink-0">
                 {profile?.full_name && (
                  <p className="text-sm text-dark-secondary">user: {profile.full_name}</p>
                )}
              </div>
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {sidebarItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveTab(item.id as TabType);
                          setIsMobileMenuOpen(false); // Auto-close on mobile
                        }}
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

            {/* Main Content - Add mobile padding only */}
            <main className="flex-1 flex flex-col">
              <div className={`container mx-auto ${activeTab === 'dashboard' ? 'h-full flex-1 p-4' : 'overflow-auto p-4 sm:p-6'} lg:pt-4 pt-16`}>
                {renderContent()}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Graphics Modal */}
      {showShareGraphics && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-dark-background border border-dark-border rounded-xl sm:rounded-2xl max-w-full sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-dark-primary">Share Your Stack</h2>
                <Button
                  onClick={() => setShowShareGraphics(false)}
                  variant="outline"
                  size="sm"
                  className="border-dark-border text-dark-secondary hover:bg-dark-border h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>
              
              {profile?.referral_code && plan?.recommendations && (
                <ShareGraphics
                  userName={profile.full_name || 'Anonymous'}
                  supplements={plan.recommendations.map((rec: any) => rec.supplement)}
                  healthScore={profile.health_score}
                  referralCode={profile.referral_code}
                  referralUrl={generateReferralUrl(profile.referral_code)}
                />
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Cancel Subscription Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-background border border-dark-border rounded-2xl max-w-md w-full p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-dark-primary mb-2">Cancel Subscription?</h2>
              <p className="text-dark-secondary">
                Are you sure you want to cancel your subscription? This will:
              </p>
              <ul className="mt-4 space-y-2 text-dark-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Stop all future monthly shipments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Remove access to full features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>End your personalized supplement plan</span>
                </li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-dark-border text-dark-secondary hover:bg-dark-border"
                onClick={() => setShowCancelConfirm(false)}
                disabled={isCancelling}
              >
                Keep Subscription
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleCancelSubscription}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 