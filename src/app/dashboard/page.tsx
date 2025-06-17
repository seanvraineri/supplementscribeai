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
  Shield
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

  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  // Filter and search functions
  const filteredBiomarkers = biomarkersData.filter(biomarker => {
    const analysis = biomarkerAnalysis[biomarker.marker_name?.toLowerCase()?.replace(/\s+/g, '_')] || {};
    const cleanName = biomarker.marker_name?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Marker';
    
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

  const cleanProductName = (productName: string) => {
    // Remove "OK Capsule" prefix if present
    if (productName.startsWith('OK Capsule ')) {
      return productName.replace('OK Capsule ', '');
    }
    return productName;
  };

  // Function to generate clickable links for scientific citations
  const generateCitationLink = (citation: string): string | null => {
    // Extract DOI if present
    const doiMatch = citation.match(/doi:\s*([^\s]+)/i) || citation.match(/10\.\d{4,}\/[^\s]+/);
    if (doiMatch) {
      const doi = doiMatch[1] || doiMatch[0];
      return `https://doi.org/${doi}`;
    }

    // Extract PMID if present
    const pmidMatch = citation.match(/PMID:\s*(\d+)/i) || citation.match(/PubMed ID:\s*(\d+)/i);
    if (pmidMatch) {
      return `https://pubmed.ncbi.nlm.nih.gov/${pmidMatch[1]}/`;
    }

    // Try to extract journal and create PubMed search
    const journalPatterns = [
      /N Engl J Med/i,
      /Nature/i,
      /Science/i,
      /Cell/i,
      /Lancet/i,
      /JAMA/i,
      /BMJ/i,
      /Cochrane/i,
      /Am J Clin Nutr/i,
      /J Nutr/i,
      /Nutrients/i,
      /Mol Nutr Food Res/i,
      /Eur J Nutr/i,
      /Br J Nutr/i,
      /Food Funct/i,
      /Antioxidants/i
    ];

    for (const pattern of journalPatterns) {
      if (pattern.test(citation)) {
        // Extract year if present
        const yearMatch = citation.match(/\b(19|20)\d{2}\b/);
        const year = yearMatch ? yearMatch[0] : '';
        
        // Create a search query
        const searchTerms = citation
          .replace(/[^\w\s]/g, ' ')
          .split(' ')
          .filter(word => word.length > 3 && !['the', 'and', 'for', 'with', 'from'].includes(word.toLowerCase()))
          .slice(0, 5)
          .join(' ');
        
        return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(searchTerms + (year ? ' ' + year : ''))}`;
      }
    }

    // If no specific pattern found, create a general PubMed search
    const searchTerms = citation
      .replace(/[^\w\s]/g, ' ')
      .split(' ')
      .filter(word => word.length > 3 && !['the', 'and', 'for', 'with', 'from'].includes(word.toLowerCase()))
      .slice(0, 5)
      .join(' ');
    
    if (searchTerms.length > 10) {
      return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(searchTerms)}`;
    }

    return null;
  };

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
          {/* General Notes Section */}
          {plan.general_notes && (
            <div className="bg-gradient-to-r from-dark-accent/10 to-blue-900/10 rounded-xl p-6 border border-dark-accent/30">
              <h3 className="text-lg font-semibold text-dark-accent mb-3 flex items-center gap-2">
                <span className="text-xl">💙</span>
                Your Personalized Health Journey
              </h3>
              <p className="text-dark-primary leading-relaxed">{plan.general_notes}</p>
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
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-dark-primary">{rec.supplement}</h3>
                    <p className="text-dark-secondary font-mono">{cleanProductName(rec.product?.product_name)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-dark-primary text-lg">{rec.dosage}</p>
                    {rec.timing && <p className="text-dark-secondary text-sm">{rec.timing}</p>}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-dark-border space-y-2">
                  <h4 className="font-semibold text-dark-accent">Why This Is Perfect For You</h4>
                  <div className="bg-dark-background/50 rounded-lg p-4 border-l-4 border-dark-accent">
                    <p className="text-dark-primary leading-relaxed">{rec.reason}</p>
                  </div>
                  {rec.notes && (
                    <div className="mt-3 p-3 bg-blue-900/20 rounded-lg border border-blue-700/30">
                      <p className="text-blue-200 text-sm leading-relaxed">{rec.notes}</p>
                    </div>
                  )}
                </div>
                {rec.citations && rec.citations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-dark-border">
                    <h4 className="font-semibold text-dark-accent mb-2">Scientific Citations</h4>
                    <ul className="space-y-2 text-dark-secondary text-sm font-mono">
                      {rec.citations.map((citation: string, i: number) => {
                        const citationLink = generateCitationLink(citation);
                        return (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-dark-accent mt-1">•</span>
                            {citationLink ? (
                              <a 
                                href={citationLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors duration-200"
                                title="Click to view research paper"
                              >
                                {citation}
                              </a>
                            ) : (
                              <span>{citation}</span>
                            )}
                          </li>
                        );
                      })}
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

  const renderEnhancedAnalysis = () => {
    // Category display names
    const categoryDisplayNames: Record<string, string> = {
      'cardiovascular': 'Cardiovascular Health',
      'inflammation': 'Inflammation & Immune',
      'metabolic': 'Metabolic Health',
      'hormonal': 'Hormonal Balance',
      'cognitive-stress': 'Cognitive & Stress',
      'detoxification': 'Detoxification',
      'gut-microbiome': 'Gut & Microbiome',
      'nutrient-processing': 'Nutrient Processing'
    };

    // Category icons
    const categoryIcons: Record<string, any> = {
      'cardiovascular': Heart,
      'inflammation': Zap,
      'metabolic': TrendingUp,
      'hormonal': Activity,
      'cognitive-stress': Brain,
      'detoxification': Shield,
      'gut-microbiome': Pill,
      'nutrient-processing': Sparkles
    };

    // Status colors
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'optimal': return 'text-green-400';
        case 'borderline': return 'text-yellow-400';
        case 'concerning': return 'text-red-400';
        default: return 'text-gray-400';
      }
    };

    const getStatusBg = (status: string) => {
      switch (status) {
        case 'optimal': return 'bg-green-500/10 border-green-500/20';
        case 'borderline': return 'bg-yellow-500/10 border-yellow-500/20';
        case 'concerning': return 'bg-red-500/10 border-red-500/20';
        default: return 'bg-gray-500/10 border-gray-500/20';
      }
    };

    if (enhancedLoading) {
      return (
        <div className="space-y-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-dark-border border-t-dark-accent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-dark-primary mb-2">Analyzing Your Health Data...</h2>
            <p className="text-dark-secondary">Processing biomarkers and genetic variants</p>
          </div>
        </div>
      );
    }

    if (enhancedError) {
      return (
        <div className="space-y-8">
          <div className="text-center py-20">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-dark-primary mb-2">Analysis Error</h2>
            <p className="text-dark-secondary mb-4">{enhancedError}</p>
            <Button onClick={refetchEnhanced} className="bg-dark-accent text-white hover:bg-dark-accent/80">
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    // No data state - educational content
    if (summary.totalAnalyzed === 0) {
      return (
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-2xl"></div>
            <div className="relative p-8 text-center">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                Comprehensive Analysis
              </h1>
              <p className="text-xl text-dark-secondary max-w-3xl mx-auto leading-relaxed">
                Get personalized insights from your biomarker and genetic data
              </p>
            </div>
          </div>

          {/* Educational Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Blood Testing */}
            <div className="bg-dark-panel border border-dark-border rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-red-500/10 rounded-xl mr-4">
                  <Activity className="h-8 w-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark-primary">Blood Biomarkers</h3>
                  <p className="text-dark-secondary">Essential health indicators</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-dark-primary font-medium">Cardiovascular Risk Assessment</p>
                    <p className="text-dark-secondary text-sm">Cholesterol, triglycerides, inflammation markers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-dark-primary font-medium">Metabolic Health Analysis</p>
                    <p className="text-dark-secondary text-sm">Blood sugar, insulin sensitivity, metabolic markers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-dark-primary font-medium">Nutrient Status Evaluation</p>
                    <p className="text-dark-secondary text-sm">Vitamins, minerals, deficiency detection</p>
                  </div>
                </div>
              </div>

              <div className="bg-dark-background border border-dark-border rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-dark-primary mb-2">Recommended Tests:</h4>
                <ul className="text-sm text-dark-secondary space-y-1">
                  <li>• Complete Blood Count (CBC)</li>
                  <li>• Comprehensive Metabolic Panel (CMP)</li>
                  <li>• Lipid Panel</li>
                  <li>• Thyroid Function (TSH, T3, T4)</li>
                  <li>• Vitamin D, B12, Folate</li>
                </ul>
              </div>

              <Button 
                onClick={() => router.push('/onboarding')} 
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                Upload Lab Results
              </Button>
            </div>

            {/* Genetic Testing */}
            <div className="bg-dark-panel border border-dark-border rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-500/10 rounded-xl mr-4">
                  <Dna className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark-primary">Genetic Analysis</h3>
                  <p className="text-dark-secondary">Personalized genetic insights</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-dark-primary font-medium">Nutrient Processing Variants</p>
                    <p className="text-dark-secondary text-sm">MTHFR, COMT, VDR - methylation & absorption</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-dark-primary font-medium">Disease Risk Assessment</p>
                    <p className="text-dark-secondary text-sm">APOE, BRCA, cardiovascular risk variants</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-dark-primary font-medium">Medication Interactions</p>
                    <p className="text-dark-secondary text-sm">CYP enzymes, drug metabolism variants</p>
                  </div>
                </div>
              </div>

              <div className="bg-dark-background border border-dark-border rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-dark-primary mb-2">Compatible Tests:</h4>
                <ul className="text-sm text-dark-secondary space-y-1">
                  <li>• 23andMe Health + Ancestry</li>
                  <li>• AncestryDNA + Health</li>
                  <li>• MyHeritage DNA Health</li>
                  <li>• Nebula Genomics</li>
                  <li>• Raw genetic data files</li>
                </ul>
              </div>

              <Button 
                onClick={() => router.push('/onboarding')} 
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              >
                Upload Genetic Data
              </Button>
            </div>
          </div>

          {/* Why This Matters */}
          <div className="bg-gradient-to-r from-dark-accent/5 to-blue-500/5 border border-dark-accent/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-dark-primary mb-4 text-center">Why Comprehensive Analysis Matters</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-4 bg-dark-accent/10 rounded-xl w-fit mx-auto mb-4">
                  <Target className="h-8 w-8 text-dark-accent" />
                </div>
                <h4 className="font-semibold text-dark-primary mb-2">Personalized Insights</h4>
                <p className="text-dark-secondary text-sm">Get recommendations tailored to your unique genetic makeup and biomarker profile</p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-dark-accent/10 rounded-xl w-fit mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-dark-accent" />
                </div>
                <h4 className="font-semibold text-dark-primary mb-2">Early Detection</h4>
                <p className="text-dark-secondary text-sm">Identify potential health issues before they become serious problems</p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-dark-accent/10 rounded-xl w-fit mx-auto mb-4">
                  <Zap className="h-8 w-8 text-dark-accent" />
                </div>
                <h4 className="font-semibold text-dark-primary mb-2">Optimize Performance</h4>
                <p className="text-dark-secondary text-sm">Fine-tune your nutrition and lifestyle for peak health and longevity</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-2xl"></div>
          <div className="relative p-8 text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Comprehensive Analysis
            </h1>
            <p className="text-xl text-dark-secondary max-w-3xl mx-auto leading-relaxed">
              AI-powered insights from your {summary.totalAnalyzed} health markers across {summary.categoriesAnalyzed} categories
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-dark-panel border border-dark-border rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-dark-accent mb-2">{summary.totalAnalyzed}</div>
            <div className="text-sm text-dark-secondary">Total Analyzed</div>
          </div>
          <div className="bg-dark-panel border border-dark-border rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">{summary.concerningCount}</div>
            <div className="text-sm text-dark-secondary">Need Attention</div>
          </div>
          <div className="bg-dark-panel border border-dark-border rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{userContext.totalBiomarkers}</div>
            <div className="text-sm text-dark-secondary">Biomarkers</div>
          </div>
          <div className="bg-dark-panel border border-dark-border rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{userContext.totalSNPs}</div>
            <div className="text-sm text-dark-secondary">Genetic Variants</div>
          </div>
        </div>

        {/* Priority Items */}
        {priorityItems.length > 0 && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-dark-primary mb-4 flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-400 mr-3" />
              Priority Items ({priorityItems.length})
            </h2>
            <div className="grid gap-4">
              {priorityItems.slice(0, 3).map((item, index) => (
                <div key={index} className="bg-dark-panel border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-dark-primary">{item.displayName}</h3>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-dark-secondary text-sm mb-3">{item.whyItMatters}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-dark-accent">Lifestyle:</span>
                      <p className="text-xs text-dark-secondary">{item.recommendations.lifestyle}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-dark-accent">Supplements:</span>
                      <p className="text-xs text-dark-secondary">{item.recommendations.supplement}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-6">
          {Object.entries(resultsByCategory).map(([category, items]) => {
            const IconComponent = categoryIcons[category] || Activity;
            const stats = categoryStats.find(s => s.category === category);
            
            return (
              <div key={category} className="bg-dark-panel border border-dark-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-dark-accent/10 rounded-xl">
                      <IconComponent className="h-6 w-6 text-dark-accent" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-dark-primary">
                        {categoryDisplayNames[category] || category}
                      </h2>
                      <p className="text-dark-secondary">{items.length} markers analyzed</p>
                    </div>
                  </div>
                  {stats && (
                    <div className="flex space-x-2">
                      {stats.concerning > 0 && (
                        <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                          {stats.concerning} concerning
                        </span>
                      )}
                      {stats.borderline > 0 && (
                        <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                          {stats.borderline} borderline
                        </span>
                      )}
                      {stats.optimal > 0 && (
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                          {stats.optimal} optimal
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid gap-4">
                  {items.map((item, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${getStatusBg(item.status)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-dark-primary">{item.displayName}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-dark-secondary">
                              {item.markerType === 'biomarker' ? 'Value:' : 'Genotype:'} {item.userValue}
                            </span>
                            {item.referenceRange && (
                              <span className="text-xs text-dark-secondary">
                                Ref: {item.referenceRange}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-dark-secondary text-sm mb-3">{item.whyItMatters}</p>
                      
                      {item.personalizedRisk && (
                        <p className="text-dark-secondary text-sm mb-3 italic">{item.personalizedRisk}</p>
                      )}
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-medium text-dark-accent">Lifestyle Optimization:</span>
                          <p className="text-xs text-dark-secondary mt-1">{item.recommendations.lifestyle}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-dark-accent">Supplement Support:</span>
                          <p className="text-xs text-dark-secondary mt-1">{item.recommendations.supplement}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border/50">
                        <span className="text-xs text-dark-secondary">
                          Evidence: {item.evidenceLevel}
                        </span>
                        <span className="text-xs text-dark-secondary">
                          {item.markerType === 'biomarker' ? '🩸 Blood' : '🧬 Genetic'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <Button 
            onClick={refetchEnhanced}
            disabled={enhancedLoading}
            className="bg-dark-accent text-white hover:bg-dark-accent/80 px-8 py-3"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {enhancedLoading ? 'Analyzing...' : 'Refresh Analysis'}
          </Button>
        </div>
      </div>
    );
  };

  const renderAnalysis = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-2xl"></div>
        <div className="relative p-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Comprehensive Analysis
          </h1>
          <p className="text-xl text-dark-secondary max-w-3xl mx-auto leading-relaxed">
            Deep dive into your biomarker and genetic data with AI-powered insights and personalized recommendations
          </p>
        </div>
      </div>

      {/* Computing State */}
      {analysisComputing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8"
        >
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/20"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute inset-0"></div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-dark-primary mb-2">AI Analysis in Progress</h3>
              <p className="text-dark-secondary">Our advanced algorithms are processing your health data to generate personalized insights</p>
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
                Upload your lab reports to unlock personalized biomarker analysis and health insights
              </p>
              <Button 
                onClick={() => router.push('/onboarding')} 
                className="bg-gradient-to-r from-dark-accent to-blue-500 hover:from-dark-accent/80 hover:to-blue-500/80 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Upload Lab Results
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
                Upload your genetic test results (23andMe, AncestryDNA, etc.) to unlock personalized genetic insights
              </p>
              <Button 
                onClick={() => router.push('/onboarding')} 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-500/80 hover:to-pink-500/80 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Upload Genetic Data
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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-dark-primary">Health Tracking</h1>
        <p className="text-lg text-dark-secondary mt-1">
          Track your symptoms, supplement intake, and health metrics over time.
        </p>
      </div>

      {/* Date Selector */}
      <div className="flex items-center justify-between bg-dark-panel border border-dark-border rounded-xl p-6">
        <div>
          <h3 className="text-lg font-semibold text-dark-primary mb-1">Tracking Date</h3>
          <p className="text-sm text-dark-secondary">Select the date you want to track</p>
        </div>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-dark-background border border-dark-border rounded-lg px-4 py-2 text-dark-primary"
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Supplements Tracking - Top Section */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Pill className="w-6 h-6 text-dark-accent" />
          <h3 className="text-xl font-semibold text-dark-primary">Daily Supplements</h3>
        </div>
        
        {plan?.recommendations?.length > 0 ? (
          <div className="flex items-center justify-between">
            <p className="text-dark-secondary">Did you take all your supplements today?</p>
            <button
              onClick={() => toggleSupplements(!dailySupplementsTaken)}
              className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                dailySupplementsTaken
                  ? 'bg-green-500 text-white'
                  : 'bg-dark-border text-dark-secondary hover:bg-dark-accent hover:text-white'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              {dailySupplementsTaken ? 'All Taken ✓' : 'Mark as Taken'}
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-dark-secondary mb-4">Generate your supplement plan first to track adherence.</p>
            <Button 
              onClick={() => setActiveTab('supplement-plan')}
              className="bg-dark-accent hover:bg-dark-accent/80 text-white"
            >
              Generate Plan
            </Button>
          </div>
        )}
      </div>

      {/* Main Symptoms Tracking */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-dark-accent" />
          <h3 className="text-xl font-semibold text-dark-primary">Track Your Symptoms</h3>
        </div>
        <p className="text-dark-secondary mb-6">Rate how you're feeling today on a scale of 1-10 (1 = worst, 10 = best)</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: 'Energy Level', icon: Zap, color: 'text-emerald-400' },
            { name: 'Sleep Quality', icon: Moon, color: 'text-blue-400' },
            { name: 'Mental Clarity', icon: Brain, color: 'text-purple-400' },
            { name: 'Mood', icon: Heart, color: 'text-pink-400' },
            { name: 'Digestive Health', icon: Leaf, color: 'text-green-400' },
            { name: 'Anxiety Level', icon: AlertOctagon, color: 'text-red-400', reverse: true },
            { name: 'Joint Pain', icon: Bone, color: 'text-orange-400', reverse: true },
            { name: 'Stress Level', icon: CloudLightning, color: 'text-yellow-400', reverse: true }
          ].map((symptom) => {
            const IconComponent = symptom.icon;
            return (
              <div key={symptom.name} className="bg-dark-background border border-dark-border rounded-lg p-4 hover:bg-dark-border/50 transition-all">
                <div className="flex items-center mb-3">
                  <IconComponent className={`w-6 h-6 mr-3 ${symptom.color}`} />
                  <h4 className="font-semibold text-dark-primary">{symptom.name}</h4>
                </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-dark-secondary">{symptom.reverse ? 'High' : 'Low'}</span>
                <div className="flex-1 flex space-x-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                      key={value}
                      onClick={() => logSymptom(symptom.name, value)}
                      className={`flex-1 h-8 rounded transition-all ${
                        symptomRatings[symptom.name] === value
                          ? 'bg-dark-accent text-white'
                          : 'bg-dark-border hover:bg-dark-accent/30 text-dark-secondary hover:text-white'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-dark-secondary">{symptom.reverse ? 'Low' : 'High'}</span>
              </div>
              
              {symptomRatings[symptom.name] && (
                <div className="mt-2 text-sm text-dark-accent">
                  Rated: {symptomRatings[symptom.name]}/10
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      {/* Custom Symptoms - Bottom Section */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-6 h-6 text-dark-accent" />
          <h3 className="text-xl font-semibold text-dark-primary">Add Custom Symptom</h3>
        </div>
        
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newCustomSymptom}
            onChange={(e) => setNewCustomSymptom(e.target.value)}
            placeholder="Type a custom symptom (e.g., Headache, Back Pain, Nausea...)"
            className="flex-1 bg-dark-background border border-dark-border rounded-lg px-4 py-3 text-dark-primary placeholder-dark-secondary focus:outline-none focus:border-dark-accent"
            onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
          />
          <Button
            onClick={addCustomSymptom}
            disabled={!newCustomSymptom.trim()}
            className="px-6 py-3 bg-dark-accent hover:bg-dark-accent/80 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </Button>
        </div>
        
        {/* Custom Symptoms List */}
        {customSymptoms.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {customSymptoms.map((symptom) => (
              <div key={symptom} className="bg-dark-background border border-dark-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Edit3 className="w-5 h-5 mr-3 text-dark-accent" />
                    <h4 className="font-semibold text-dark-primary">{symptom}</h4>
                  </div>
                  <button
                    onClick={() => removeCustomSymptom(symptom)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <span className="text-sm">✕</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-dark-secondary">Low</span>
                  <div className="flex-1 flex space-x-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <button
                        key={value}
                        onClick={() => logSymptom(symptom, value)}
                        className={`flex-1 h-8 rounded transition-all ${
                          symptomRatings[symptom] === value
                            ? 'bg-dark-accent text-white'
                            : 'bg-dark-border hover:bg-dark-accent/30 text-dark-secondary hover:text-white'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-dark-secondary">High</span>
                </div>
                
                {symptomRatings[symptom] && (
                  <div className="mt-2 text-sm text-dark-accent">
                    Rated: {symptomRatings[symptom]}/10
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isTrackingLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-panel border border-dark-border rounded-xl p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-dark-accent border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-dark-primary">Loading tracking data...</p>
          </div>
        </div>
      )}
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
          placeholder="Paste product URL from Amazon, iHerb, etc."
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
          <h2 className="text-xl font-semibold text-dark-primary mb-4">Latest Analysis</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-dark-secondary">Personal Relevance:</span>
                <span className="text-2xl font-bold text-dark-accent">{studyAnalysis.relevanceScore}/10</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-dark-accent mb-2">Personalized Summary</h3>
              <p className="text-dark-secondary">{studyAnalysis.personalizedSummary}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-dark-accent mb-2">Personal Explanation</h3>
              <p className="text-dark-secondary">{studyAnalysis.personalizedExplanation}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-dark-accent mb-2">Key Findings</h3>
              <ul className="space-y-2">
                {studyAnalysis.keyFindings?.map((finding: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-dark-accent mt-1">•</span>
                    <span className="text-dark-secondary">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-dark-accent mb-2">Your Personalized Recommendations</h3>
              <ul className="space-y-2">
                {studyAnalysis.actionableRecommendations?.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-dark-secondary">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Study History */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-dark-primary mb-4">Your Study History</h2>
        {isLoadingStudies ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-accent mx-auto"></div>
            <p className="mt-2 text-dark-secondary">Loading studies...</p>
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

  const renderSettings = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-dark-primary">Settings</h1>
        <p className="text-lg text-dark-secondary mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Settings content will be implemented here */}
      <div className="bg-dark-panel border border-dark-border rounded-xl p-8 text-center">
        <Settings className="h-16 w-16 text-dark-secondary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-dark-primary mb-2">Settings</h3>
        <p className="text-dark-secondary">
          Manage your account settings, notification preferences, and data privacy options.
        </p>
        <p className="text-dark-secondary text-sm mt-2">
          This feature is coming soon!
        </p>
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