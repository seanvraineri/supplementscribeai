'use client';

import React, { useState, useEffect } from 'react';
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
  Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type TabType = 'dashboard' | 'supplement-plan' | 'analysis' | 'ai-chat' | 'settings';

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
  
  // AI Chat state
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      // Fetch uploaded files
      const { data: filesData } = await supabase
        .from('user_lab_reports')
        .select('file_name, report_type, created_at, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setUploadedFiles(filesData || []);

      // Check for extracted biomarkers and SNPs
      const { data: biomarkers } = await supabase
        .from('user_biomarkers')
        .select('*')
        .eq('user_id', user.id);
      
      const { data: snps, error: snpsError } = await supabase
        .from('user_snps')
        .select('*')
        .eq('user_id', user.id);

      const extractedCounts = {
        biomarkers: biomarkers?.length || 0,
        snps: snps?.length || 0
      };
      setExtractedData(extractedCounts);
      setBiomarkersData(biomarkers || []);
      setSnpsData(snps || []);

      // Fetch existing plan
      const { data: planData, error: planError } = await supabase
    .from('supplement_plans')
    .select('plan_details')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

      if (planData && !planError) {
        setPlan(planData.plan_details);
      }
    };

    fetchUserData();
  }, [router, supabase]);

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

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'supplement-plan', label: 'Supplement Plan', icon: Pill },
    { id: 'analysis', label: 'Comprehensive Analysis', icon: BarChart3 },
    { id: 'ai-chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'User'}! 👋
        </h1>
        <p className="text-blue-100">
          Your personalized health journey continues here. View your data and get AI-powered recommendations.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Biomarkers</p>
                <p className="text-2xl font-bold text-green-800">{extractedData.biomarkers}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Genetic Variants</p>
                <p className="text-2xl font-bold text-purple-800">{extractedData.snps}</p>
              </div>
              <Dna className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Supplements</p>
                <p className="text-2xl font-bold text-orange-800">{plan?.recommendations?.length || 0}</p>
              </div>
              <Pill className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Health Data Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Health Data
            </CardTitle>
            <CardDescription>
              Files you've uploaded for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedFiles.length > 0 ? (
              <div className="space-y-3">
                {uploadedFiles.slice(0, 3).map((file, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{file.file_name}</p>
                      <p className="text-xs text-gray-600">
                        {file.report_type === 'lab_report' ? 'Lab Report' : 'Genetic Report'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      file.status === 'parsed' ? 'bg-green-100 text-green-800' : 
                      file.status === 'uploaded' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {file.status}
                    </span>
                  </div>
                ))}
                {uploadedFiles.length > 3 && (
                  <p className="text-sm text-gray-600 text-center">
                    +{uploadedFiles.length - 3} more files
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No files uploaded yet</p>
                <Button variant="outline" className="mt-3" onClick={() => router.push('/onboarding')}>
                  Upload Files
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Plan Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Supplement Plan
            </CardTitle>
            <CardDescription>
              Generate personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              {plan ? (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-800 font-medium">✅ Plan Generated!</p>
                    <p className="text-green-700 text-sm">{plan.recommendations?.length} supplements recommended</p>
                  </div>
                  <Button 
                    onClick={() => setActiveTab('supplement-plan')}
                    className="w-full"
                  >
                    View My Plan
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Brain className="h-12 w-12 text-blue-500 mx-auto" />
                  <Button 
                    onClick={generatePlan} 
                    disabled={isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? 'Generating Plan...' : 'Generate AI Plan'}
                  </Button>
                </div>
              )}
              <p className="text-xs text-gray-600 mt-3">
                Uses your biomarkers, genetics, and health profile
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" onClick={() => router.push('/onboarding')}>
              Update Profile
            </Button>
            <Button variant="outline" onClick={() => setActiveTab('analysis')}>
              View Analysis
            </Button>
            <Button variant="outline" onClick={() => setActiveTab('ai-chat')}>
              Ask AI
            </Button>
            <Button variant="outline" onClick={() => setActiveTab('settings')}>
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSupplementPlan = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Supplement Plan</h1>
        <Button 
          onClick={generatePlan} 
          disabled={isGenerating}
          variant="outline"
        >
          {isGenerating ? 'Regenerating...' : 'Regenerate Plan'}
        </Button>
      </div>

      {plan ? (
        <>
          {/* Plan Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{plan.recommendations?.length || 0}</div>
                <div className="text-sm text-gray-600">Supplements</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {plan.recommendations?.filter((rec: any) => rec.citations && rec.citations.length > 0).length || 0}
                </div>
                <div className="text-sm text-gray-600">Citations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{extractedData.biomarkers}</div>
                <div className="text-sm text-gray-600">Biomarkers Used</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{extractedData.snps}</div>
                <div className="text-sm text-gray-600">Genetics Used</div>
              </CardContent>
            </Card>
          </div>

          {/* Supplement Recommendations */}
          <div className="space-y-6">
            {plan.recommendations?.map((rec: any, index: number) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-gray-800 mb-1">{rec.supplement}</h3>
                    {rec.product && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">{rec.product.brand}</span>
                        <span>•</span>
                        <span>{rec.product.product_name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          💊 Dosage & Timing
                        </h4>
                        <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                          <span className="font-medium text-blue-800">{rec.dosage || 'As directed'}</span>
                          {rec.timing && <span className="block text-sm mt-1">⏰ {rec.timing}</span>}
                        </div>
                      </div>
                      
                  <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          🎯 Why This Supplement?
                        </h4>
                        <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                          <p className="text-gray-600 text-sm">{rec.reason}</p>
                  </div>
                </div>

                      {/* Purchase Button */}
                      {rec.product && (
                        <Button
                          onClick={() => {
                            setSelectedSupplement(rec);
                            setIsPopupOpen(true);
                          }}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                          🛒 View & Purchase
                        </Button>
                      )}
                    </div>
                    
                    {/* Right Column */}
                    <div className="space-y-4">
                      {rec.citations && rec.citations.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            📚 Scientific Evidence
                          </h4>
                          <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                            <ul className="text-gray-600 text-sm space-y-1">
                              {rec.citations.slice(0, 2).map((citation: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-yellow-600 font-bold mt-0.5">•</span>
                                  <span>{citation}</span>
                        </li>
                      ))}
                    </ul>
                          </div>
                        </div>
                      )}

                      {rec.interactions && rec.interactions.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                            ⚠️ Drug Interactions
                          </h4>
                          <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                            <ul className="text-red-700 text-sm space-y-1">
                              {rec.interactions.map((interaction: string, i: number) => (
                                <li key={i}>{interaction}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {rec.notes && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            📝 Clinical Notes
                          </h4>
                          <div className="bg-gray-50 p-3 rounded border-l-4 border-gray-400">
                            <p className="text-gray-600 text-sm">{rec.notes}</p>
                          </div>
                  </div>
                )}
              </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* General Notes */}
          {(plan.general_notes || plan.contraindications) && (
            <div className="space-y-4">
              {plan.general_notes && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Important Considerations</h4>
                    <p className="text-yellow-700 text-sm">{plan.general_notes}</p>
                  </CardContent>
                </Card>
              )}
              
              {plan.contraindications && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-red-800 mb-2">⚠️ Important Warnings</h4>
                    <p className="text-red-700 text-sm">{plan.contraindications}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Supplement Plan Yet</h3>
            <p className="text-gray-600 mb-6">Generate your personalized supplement plan to get started.</p>
            <Button onClick={generatePlan} disabled={isGenerating}>
              {isGenerating ? 'Generating Plan...' : 'Generate My Plan'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

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

  // Helper function to clean up biomarker names for display
  const cleanBiomarkerName = (markerName: string) => {
    const name = markerName.toLowerCase();
    
    // Common biomarker name mappings
    const nameMap: { [key: string]: string } = {
      'cholesterol_total': 'Total Cholesterol',
      'cholesterol_ldl': 'LDL Cholesterol',
      'cholesterol_hdl': 'HDL Cholesterol',
      'hdl_c': 'HDL Cholesterol',
      'ldl_c': 'LDL Cholesterol',
      'non_hdl_cholesterol': 'Non-HDL Cholesterol',
      'cholesterol_hdl_ratio': 'Total/HDL Ratio',
      'triglycerides': 'Triglycerides',
      'glucose': 'Blood Glucose',
      'glucose_fasting': 'Fasting Glucose',
      'hemoglobin_a1c': 'Hemoglobin A1C',
      'hba1c': 'Hemoglobin A1C',
      'crp': 'C-Reactive Protein',
      'c_reactive_protein': 'C-Reactive Protein',
      'vitamin_d': 'Vitamin D',
      '25_oh_vitamin_d': 'Vitamin D (25-OH)',
      'vitamin_b12': 'Vitamin B12',
      'b12': 'Vitamin B12',
      'folate': 'Folate',
      'ferritin': 'Ferritin',
      'iron': 'Iron',
      'tsh': 'Thyroid Stimulating Hormone (TSH)',
      't4': 'Thyroxine (T4)',
      't3': 'Triiodothyronine (T3)',
      'magnesium': 'Magnesium',
      'zinc': 'Zinc',
      'calcium': 'Calcium',
      'phosphorus': 'Phosphorus',
      'albumin': 'Albumin',
      'total_protein': 'Total Protein',
      'alt': 'ALT (Alanine Aminotransferase)',
      'ast': 'AST (Aspartate Aminotransferase)',
      'bun': 'Blood Urea Nitrogen (BUN)',
      'creatinine': 'Creatinine',
      'egfr': 'eGFR',
      'uric_acid': 'Uric Acid',
      'homocysteine': 'Homocysteine',
      'insulin': 'Insulin',
      'cortisol': 'Cortisol',
      'testosterone': 'Testosterone',
      'estradiol': 'Estradiol',
      'progesterone': 'Progesterone',
      'dhea_s': 'DHEA-S',
      'igf_1': 'IGF-1',
      'psa': 'PSA'
    };
    
    // Check if we have a direct mapping
    if (nameMap[name]) {
      return nameMap[name];
    }
    
    // If no direct mapping, try to clean it up automatically
    return markerName
      .replace(/_/g, ' ')  // Replace underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase())  // Capitalize first letter of each word
      .replace(/\bCrp\b/g, 'CRP')  // Fix CRP
      .replace(/\bTsh\b/g, 'TSH')  // Fix TSH
      .replace(/\bT4\b/g, 'T4')    // Fix T4
      .replace(/\bT3\b/g, 'T3')    // Fix T3
      .replace(/\bHdl\b/g, 'HDL')  // Fix HDL
      .replace(/\bLdl\b/g, 'LDL')  // Fix LDL
      .replace(/\bB12\b/g, 'B12')  // Fix B12
      .replace(/\bA1c\b/g, 'A1C')  // Fix A1C
      .replace(/\bIgf\b/g, 'IGF')  // Fix IGF
      .replace(/\bPsa\b/g, 'PSA')  // Fix PSA
      .replace(/\bAlt\b/g, 'ALT')  // Fix ALT
      .replace(/\bAst\b/g, 'AST')  // Fix AST
      .replace(/\bBun\b/g, 'BUN')  // Fix BUN
      .replace(/\bEgfr\b/g, 'eGFR'); // Fix eGFR
  };

  // Helper function to clean up SNP names for display
  const cleanSnpName = (snpId: string, geneName: string) => {
    // Common gene name mappings
    const geneMap: { [key: string]: string } = {
      'MTHFR': 'MTHFR (Methylenetetrahydrofolate Reductase)',
      'COMT': 'COMT (Catechol-O-Methyltransferase)',
      'APOE': 'APOE (Apolipoprotein E)',
      'VDR': 'VDR (Vitamin D Receptor)',
      'FADS1': 'FADS1 (Fatty Acid Desaturase 1)',
      'FADS2': 'FADS2 (Fatty Acid Desaturase 2)',
      'CYP1A2': 'CYP1A2 (Cytochrome P450 1A2)',
      'ALDH2': 'ALDH2 (Aldehyde Dehydrogenase 2)',
      'BDNF': 'BDNF (Brain-Derived Neurotrophic Factor)',
      'CACNA1C': 'CACNA1C (Calcium Voltage-Gated Channel)',
      'DRD2': 'DRD2 (Dopamine Receptor D2)',
      'HTR2A': 'HTR2A (Serotonin Receptor 2A)',
      'MAOA': 'MAOA (Monoamine Oxidase A)',
      'SLC6A4': 'SLC6A4 (Serotonin Transporter)',
      'TNF': 'TNF (Tumor Necrosis Factor)',
      'IL6': 'IL6 (Interleukin 6)',
      'CRP': 'CRP (C-Reactive Protein)',
      'LEPR': 'LEPR (Leptin Receptor)',
      'FTO': 'FTO (Fat Mass and Obesity-Associated)',
      'MC4R': 'MC4R (Melanocortin 4 Receptor)',
      'PPARA': 'PPARA (Peroxisome Proliferator-Activated Receptor Alpha)',
      'PPARG': 'PPARG (Peroxisome Proliferator-Activated Receptor Gamma)',
      'TCF7L2': 'TCF7L2 (Transcription Factor 7 Like 2)',
      'KCNJ11': 'KCNJ11 (Potassium Inwardly Rectifying Channel)',
      'ADRA2A': 'ADRA2A (Alpha-2A Adrenergic Receptor)',
      'ADRB2': 'ADRB2 (Beta-2 Adrenergic Receptor)',
      'ADRB3': 'ADRB3 (Beta-3 Adrenergic Receptor)',
      'ACE': 'ACE (Angiotensin Converting Enzyme)',
      'ACTN3': 'ACTN3 (Alpha-Actinin 3)',
      'SOD2': 'SOD2 (Superoxide Dismutase 2)',
      'GSTT1': 'GSTT1 (Glutathione S-Transferase Theta 1)',
      'GSTM1': 'GSTM1 (Glutathione S-Transferase Mu 1)'
    };
    
    const cleanGene = geneMap[geneName] || geneName;
    
    // For common SNPs, add descriptive names
    if (snpId === 'rs1801133' && geneName.includes('MTHFR')) {
      return `${snpId} - MTHFR C677T (Folate Metabolism)`;
    }
    if (snpId === 'rs1801131' && geneName.includes('MTHFR')) {
      return `${snpId} - MTHFR A1298C (Folate Metabolism)`;
    }
    if (snpId === 'rs4680' && geneName.includes('COMT')) {
      return `${snpId} - COMT Val158Met (Dopamine Metabolism)`;
    }
    if ((snpId === 'rs429358' || snpId === 'rs7412') && geneName.includes('APOE')) {
      return `${snpId} - APOE (Alzheimer's Risk)`;
    }
    
    return `${snpId} - ${cleanGene}`;
  };

  // Helper function to explain what biomarkers actually measure/do
  const getBiomarkerExplanation = (markerName: string) => {
    const name = markerName.toLowerCase();
    
    if (name.includes('vitamin d') || name.includes('25-oh')) return 'Measures your vitamin D status. Vitamin D is actually a hormone that regulates calcium absorption, immune function, mood, and gene expression in nearly every cell of your body.';
    if (name.includes('b12') || name.includes('cobalamin')) return 'Measures vitamin B12 levels. B12 is essential for nerve function, brain health, red blood cell formation, and DNA synthesis. Deficiency causes fatigue, brain fog, and nerve damage.';
    if (name.includes('ferritin')) return 'Measures your iron stores. Ferritin is the storage form of iron in your body. Iron is needed to make hemoglobin (carries oxygen), supports energy production, and brain function.';
    if (name.includes('crp') || name.includes('c-reactive')) return 'Measures inflammation in your body. CRP is produced by the liver in response to inflammation. High levels indicate increased risk of heart disease, diabetes, and other chronic conditions.';
    if (name.includes('cholesterol') && name.includes('total')) return 'Measures total cholesterol in your blood. Cholesterol is used to make hormones, vitamin D, and bile acids. Your liver makes most of it - dietary cholesterol has less impact than previously thought.';
    if (name.includes('hdl')) return 'Measures "good cholesterol" that removes excess cholesterol from arteries and transports it to the liver for disposal. Higher HDL = better cardiovascular protection.';
    if (name.includes('ldl')) return 'Measures "bad cholesterol" that can build up in artery walls causing atherosclerosis. However, particle size and oxidation matter more than total LDL number.';
    if (name.includes('triglycerides')) return 'Measures fat in your blood. High triglycerides usually indicate insulin resistance, metabolic dysfunction, or excessive carbohydrate intake. Strongly linked to heart disease risk.';
    if (name.includes('glucose')) return 'Measures blood sugar levels. Glucose is your body\'s main fuel source. Consistently high levels indicate insulin resistance, prediabetes, or diabetes.';
    if (name.includes('tsh')) return 'Measures thyroid stimulating hormone from your pituitary gland. TSH tells your thyroid how much hormone to make. High TSH = underactive thyroid (hypothyroidism).';
    if (name.includes('t4')) return 'Measures thyroxine, the main hormone your thyroid produces. T4 is converted to the active T3 hormone that regulates metabolism, energy, and body temperature.';
    if (name.includes('t3')) return 'Measures the active thyroid hormone that directly affects your metabolism, heart rate, body temperature, and energy levels. More important than T4 for how you feel.';
    if (name.includes('folate')) return 'Measures folate (vitamin B9) levels. Folate is essential for DNA synthesis, red blood cell formation, and methylation reactions that affect gene expression and detoxification.';
    if (name.includes('magnesium')) return 'Measures magnesium levels. Magnesium is involved in 300+ enzymatic reactions including energy production, muscle/nerve function, blood pressure regulation, and blood sugar control.';
    if (name.includes('homocysteine')) return 'Measures homocysteine, an amino acid byproduct. High levels indicate poor methylation and increased risk of heart disease, stroke, and cognitive decline. Lowered by B vitamins.';
    if (name.includes('insulin')) return 'Measures insulin hormone levels. Insulin helps cells absorb glucose from blood. High fasting insulin indicates insulin resistance - often the first sign of metabolic dysfunction.';
    if (name.includes('cortisol')) return 'Measures your primary stress hormone. Cortisol regulates blood sugar, inflammation, and blood pressure. Chronic elevation causes weight gain, immune suppression, and mood issues.';
    if (name.includes('testosterone')) return 'Measures the primary male sex hormone (also important for women). Affects muscle mass, bone density, libido, mood, energy, and cognitive function.';
    if (name.includes('estrogen') || name.includes('estradiol')) return 'Measures the primary female sex hormone. Affects bone health, cardiovascular function, mood, skin health, and reproductive function in both men and women.';
    
    return 'This biomarker provides insights into your health status and metabolic function. Check with your healthcare provider for specific interpretation of your results.';
  };

  // Helper function to explain what genetic variants actually do
  const getSnpExplanation = (geneName: string, snpId: string) => {
    const gene = geneName.toUpperCase();
    
    if (gene.includes('MTHFR')) return 'MTHFR produces an enzyme that processes folate (vitamin B9) for methylation reactions. Variants can reduce enzyme efficiency by 30-70%, affecting DNA repair, neurotransmitter production, and detoxification.';
    if (gene.includes('COMT')) return 'COMT breaks down dopamine, norepinephrine, and estrogen. Variants affect how quickly you clear these neurotransmitters, influencing stress response, pain tolerance, and cognitive function.';
    if (gene.includes('APOE')) return 'APOE helps transport cholesterol and fats in the brain and body. The E4 variant increases Alzheimer\'s risk by 3-15x due to impaired brain fat metabolism and amyloid clearance.';
    if (gene.includes('VDR')) return 'VDR codes for the vitamin D receptor found in most body tissues. Variants can reduce receptor sensitivity, requiring higher vitamin D levels to achieve optimal function.';
    if (gene.includes('FADS')) return 'FADS enzymes convert plant omega-3s (ALA) into the active forms EPA and DHA. Variants reduce conversion efficiency by up to 80%, making marine omega-3s essential.';
    if (gene.includes('CYP')) return 'CYP enzymes detoxify medications, hormones, and toxins in the liver. Variants affect how fast or slow you metabolize substances, influencing drug dosing and detox capacity.';
    if (gene.includes('ACE')) return 'ACE regulates blood pressure and cardiovascular function. Variants affect your response to exercise, salt sensitivity, and cardiovascular disease risk.';
    if (gene.includes('FTO')) return 'FTO influences appetite regulation and fat metabolism. Variants can increase obesity risk by affecting satiety signals and food intake behavior.';
    if (gene.includes('BDNF')) return 'BDNF produces brain-derived neurotrophic factor that supports brain plasticity and neuron growth. Variants affect learning, memory, and depression risk.';
    
    return `${gene} variants can influence how your body processes nutrients, responds to medications, or affects disease risk. This information helps personalize your health optimization strategy.`;
  };

  // Helper function to get reference ranges for biomarkers
  const getBiomarkerReferenceRange = (markerName: string) => {
    const name = markerName.toLowerCase();
    
    if (name.includes('vitamin d') || name.includes('25-oh')) return '30-100 ng/mL';
    if (name.includes('b12') || name.includes('cobalamin')) return '300-900 pg/mL';
    if (name.includes('ferritin')) return 'M: 12-300 ng/mL, F: 12-150 ng/mL';
    if (name.includes('crp') || name.includes('c-reactive')) return '<3.0 mg/L';
    if (name.includes('cholesterol') && name.includes('total')) return '<200 mg/dL';
    if (name.includes('hdl')) return 'M: >40 mg/dL, F: >50 mg/dL';
    if (name.includes('ldl')) return '<100 mg/dL';
    if (name.includes('triglycerides')) return '<150 mg/dL';
    if (name.includes('cholesterol_hdl_ratio')) return '<5.0';
    if (name.includes('non_hdl')) return '<130 mg/dL';
    if (name.includes('glucose')) return '70-99 mg/dL';
    if (name.includes('hemoglobin a1c') || name.includes('hba1c')) return '<5.7%';
    if (name.includes('tsh')) return '0.4-4.0 mIU/L';
    if (name.includes('t4')) return '4.5-12.0 μg/dL';
    if (name.includes('t3')) return '80-200 ng/dL';
    if (name.includes('folate')) return '2.7-17.0 ng/mL';
    if (name.includes('magnesium')) return '1.7-2.2 mg/dL';
    if (name.includes('zinc')) return '70-120 μg/dL';
    if (name.includes('iron')) return 'M: 65-175 μg/dL, F: 50-170 μg/dL';
    
    return 'See lab reference';
  };

  // Helper function to get variant frequency for SNPs  
  const getSnpVariantInfo = (snpId: string, genotype: string) => {
    const snp = snpId.toLowerCase();
    
    if (snp.includes('rs1801133')) { // MTHFR C677T
      if (genotype.includes('TT')) return { frequency: '10-15%', risk: 'High risk variant' };
      if (genotype.includes('CT') || genotype.includes('TC')) return { frequency: '40-45%', risk: 'Moderate risk variant' };
      return { frequency: '40-50%', risk: 'Normal variant' };
    }
    
    if (snp.includes('rs1801131')) { // MTHFR A1298C  
      if (genotype.includes('CC')) return { frequency: '8-12%', risk: 'High risk variant' };
      if (genotype.includes('AC') || genotype.includes('CA')) return { frequency: '35-40%', risk: 'Moderate risk variant' };
      return { frequency: '50-55%', risk: 'Normal variant' };
    }
    
    if (snp.includes('rs4680')) { // COMT Val158Met
      if (genotype.includes('AA')) return { frequency: '25%', risk: 'Slow COMT (worrier)' };
      if (genotype.includes('GG')) return { frequency: '25%', risk: 'Fast COMT (warrior)' };
      return { frequency: '50%', risk: 'Intermediate COMT' };
    }
    
    if (snp.includes('rs429358') || snp.includes('rs7412')) { // APOE
      if (genotype.includes('E4')) return { frequency: '15-20%', risk: 'Increased Alzheimer risk' };
      if (genotype.includes('E2')) return { frequency: '8-10%', risk: 'Protective variant' };
      return { frequency: '60-65%', risk: 'Standard risk' };
    }
    
    return { frequency: 'Variable', risk: 'See recommendations below' };
  };

  // Helper function to interpret biomarker values
  const interpretBiomarker = (marker: any) => {
    const name = marker.marker_name?.toLowerCase() || '';
    const value = parseFloat(marker.value) || 0;
    const unit = marker.unit || '';
    
    // Common biomarker interpretations
    if (name.includes('vitamin d') || name.includes('25-oh')) {
      if (value < 20) return { 
        status: 'deficient', 
        color: 'red', 
        impact: 'Severe deficiency - affects bone health, immune function, mood',
        recommendations: [
          'Take high-dose vitamin D3: 4,000-6,000 IU daily (with doctor supervision)',
          'Get 15-30 minutes of midday sun exposure when possible (without sunscreen)',
          'Eat vitamin D rich foods: fatty fish, egg yolks, fortified dairy',
          'Take with fat for better absorption (with meals containing healthy fats)',
          'Recheck levels in 8-12 weeks to monitor improvement',
          'Consider vitamin K2 supplement to work synergistically with D3',
          'Address magnesium levels (needed for vitamin D metabolism)',
          'See doctor immediately - may need prescription-strength doses'
        ]
      };
      if (value < 30) return { 
        status: 'insufficient', 
        color: 'orange', 
        impact: 'Insufficiency - may cause fatigue, bone pain, frequent infections',
        recommendations: [
          'Take vitamin D3: 2,000-4,000 IU daily',
          'Increase sun exposure: 10-15 minutes midday, 3-4 times per week',
          'Include fatty fish 2-3 times weekly (salmon, mackerel, sardines)',
          'Choose fortified foods: milk, cereals, yogurt with vitamin D',
          'Take supplement with largest meal of the day for absorption',
          'Consider combining with magnesium (400mg) and vitamin K2 (100mcg)',
          'Recheck levels in 3 months',
          'Monitor for improvement in energy and mood'
        ]
      };
      if (value < 50) return { 
        status: 'suboptimal', 
        color: 'yellow', 
        impact: 'Suboptimal - may affect energy and immune function',
        recommendations: [
          'Take vitamin D3: 1,000-2,000 IU daily',
          'Aim for 10-15 minutes of sun exposure daily when possible',
          'Include vitamin D rich foods regularly in diet',
          'Take supplement consistently with meals',
          'Monitor seasonal changes (may need higher doses in winter)',
          'Recheck levels in 6 months',
          'Maintain healthy weight (vitamin D is fat-soluble)',
          'Consider higher doses during illness or stress'
        ]
      };
      return { 
        status: 'optimal', 
        color: 'green', 
        impact: 'Good levels support bone health, immunity, and mood',
        recommendations: [
          'Maintain current vitamin D intake',
          'Continue regular sun exposure and dietary sources',
          'Monitor levels annually',
          'May reduce supplementation to maintenance dose (800-1000 IU daily)'
        ]
      };
    }
    
    if (name.includes('b12') || name.includes('cobalamin')) {
      if (value < 300) return { 
        status: 'deficient', 
        color: 'red', 
        impact: 'Deficiency - can cause fatigue, brain fog, nerve problems',
        recommendations: [
          'Take high-dose B12: 1000-2000mcg daily (methylcobalamin or cyanocobalamin)',
          'Consider B12 injections if severely deficient (consult doctor)',
          'Eat B12-rich foods: meat, fish, eggs, dairy, nutritional yeast',
          'Take sublingual B12 for better absorption if digestive issues',
          'Address stomach acid levels (low acid reduces B12 absorption)',
          'Check for pernicious anemia or intrinsic factor deficiency',
          'Recheck levels in 8-12 weeks',
          'Consider IV B12 therapy for severe neurological symptoms',
          'Avoid alcohol (interferes with B12 absorption)',
          'Take with folate to prevent masking deficiency'
        ]
      };
      if (value < 400) return { 
        status: 'suboptimal', 
        color: 'yellow', 
        impact: 'Low normal - may affect energy and cognitive function',
        recommendations: [
          'Take B12 supplement: 500-1000mcg daily',
          'Choose methylcobalamin form for better utilization',
          'Include B12 foods daily: fish, meat, eggs, fortified foods',
          'Consider B-complex vitamin for synergistic effects',
          'Monitor energy levels and cognitive function',
          'Recheck levels in 3-6 months',
          'If vegetarian/vegan, supplementation is essential',
          'Take on empty stomach for better absorption'
        ]
      };
      return { 
        status: 'optimal', 
        color: 'green', 
        impact: 'Good levels support energy and neurological health',
        recommendations: [
          'Maintain current B12 intake from food and/or supplements',
          'Continue regular dietary sources',
          'Monitor levels annually, especially if over 65',
          'Maintenance dose of 250-500mcg may be sufficient'
        ]
      };
    }
    
    if (name.includes('ferritin')) {
      if (value < 30) return { 
        status: 'deficient', 
        color: 'red', 
        impact: 'Low iron stores - causes fatigue, weakness, restless legs',
        recommendations: [
          'Take iron bisglycinate 25-50mg daily on empty stomach (gentler form)',
          'Combine with vitamin C 500mg to enhance absorption',
          'Eat iron-rich foods: grass-fed red meat, liver, spinach, pumpkin seeds',
          'Cook in cast iron cookware to increase iron content',
          'Avoid coffee/tea within 2 hours of iron-rich meals',
          'Check for underlying causes: heavy periods, GI bleeding, celiac disease',
          'Address gut health: heal leaky gut, optimize stomach acid',
          'Consider lactoferrin supplement 200-400mg for better iron utilization',
          'Recheck levels in 8-12 weeks',
          'Monitor for constipation and adjust dosage accordingly'
        ]
      };
      if (value < 50) return { 
        status: 'suboptimal', 
        color: 'yellow', 
        impact: 'Suboptimal iron - may affect energy and exercise capacity',
        recommendations: [
          'Take iron supplement 15-25mg daily with meals',
          'Include heme iron sources: grass-fed beef, free-range chicken, wild fish',
          'Add vitamin C rich foods: bell peppers, citrus, berries with iron meals',
          'Optimize stomach acid: consider betaine HCl with meals if low acid',
          'Address inflammation: curcumin, omega-3s, anti-inflammatory diet',
          'Support thyroid function (iron and thyroid are interconnected)',
          'Manage stress which depletes iron stores',
          'Consider spirulina or chlorella as natural iron sources',
          'Recheck in 3-4 months'
        ]
      };
      if (value > 150) return { 
        status: 'elevated', 
        color: 'orange', 
        impact: 'High iron - may indicate inflammation or hemochromatosis',
        recommendations: [
          'Stop all iron supplementation immediately',
          'Avoid iron-fortified foods and multivitamins with iron',
          'Donate blood regularly if eligible (natural iron reduction)',
          'Take curcumin 500-1000mg daily (natural iron chelator)',
          'Drink green tea between meals (tannins bind iron)',
          'Include calcium and magnesium with meals (compete with iron absorption)',
          'Get tested for hemochromatosis genetic mutations',
          'Address inflammation: anti-inflammatory diet, omega-3s',
          'Consider milk thistle for liver support',
          'Monitor liver function tests',
          'Recheck ferritin every 3 months until normalized'
        ]
      };
      return { 
        status: 'optimal', 
        color: 'green', 
        impact: 'Good iron stores support energy and oxygen transport',
        recommendations: [
          'Maintain balanced iron intake from whole food sources',
          'Continue current dietary patterns',
          'Monitor levels annually',
          'Be aware of factors that can deplete iron (exercise, menstruation)'
        ]
      };
    }
    
    if (name.includes('crp') || name.includes('c-reactive')) {
      if (value > 3.0) return { 
        status: 'elevated', 
        color: 'red', 
        impact: 'High inflammation - increases cardiovascular and chronic disease risk',
        recommendations: [
          'Take high-dose omega-3: 2-4g EPA/DHA daily to reduce inflammation',
          'Curcumin with piperine: 1000-2000mg daily (powerful anti-inflammatory)',
          'Eliminate inflammatory foods: sugar, refined carbs, trans fats, processed foods',
          'Follow strict anti-inflammatory diet: Mediterranean or AIP protocol',
          'Address gut health: heal leaky gut, balance microbiome with probiotics',
          'Test for food sensitivities and eliminate trigger foods',
          'Manage stress aggressively: meditation, yoga, adequate sleep',
          'Consider systemic enzymes: serrapeptase, nattokinase between meals',
          'Add green tea 3-4 cups daily for polyphenol anti-inflammatory effects',
          'Check for hidden infections: dental, sinus, gut pathogens',
          'Optimize vitamin D levels (anti-inflammatory hormone)',
          'Recheck CRP in 8-12 weeks after interventions'
        ]
      };
      if (value > 1.0) return { 
        status: 'moderate', 
        color: 'yellow', 
        impact: 'Moderate inflammation - may benefit from anti-inflammatory interventions',
        recommendations: [
          'Take omega-3 fish oil: 1-2g EPA/DHA daily',
          'Add turmeric/curcumin 500-1000mg daily with meals',
          'Increase anti-inflammatory foods: berries, leafy greens, fatty fish',
          'Reduce inflammatory foods: limit sugar, refined grains, processed foods',
          'Support gut health: prebiotic fiber, fermented foods, quality probiotics',
          'Optimize sleep: 7-9 hours nightly (poor sleep increases inflammation)',
          'Exercise regularly but avoid overtraining (chronic cardio increases CRP)',
          'Manage stress: chronic stress drives inflammatory cytokines',
          'Consider quercetin 500mg daily (natural antihistamine/anti-inflammatory)',
          'Monitor dental health (gum disease increases systemic inflammation)',
          'Recheck CRP in 3-6 months'
        ]
      };
      return { 
        status: 'optimal', 
        color: 'green', 
        impact: 'Low inflammation - good cardiovascular health marker',
        recommendations: [
          'Maintain current anti-inflammatory lifestyle practices',
          'Continue omega-3 rich foods and regular exercise',
          'Monitor levels annually as part of cardiovascular health assessment',
          'Keep supporting optimal inflammatory balance'
        ]
      };
    }
    
    if (name.includes('cholesterol') && name.includes('total')) {
      if (value > 240) return { status: 'high', color: 'red', impact: 'High cholesterol - increases cardiovascular disease risk' };
      if (value > 200) return { status: 'borderline', color: 'yellow', impact: 'Borderline high - monitor diet and lifestyle factors' };
      return { status: 'optimal', color: 'green', impact: 'Good cholesterol levels support cardiovascular health' };
    }
    
    if (name.includes('hdl')) {
      if (value < 40) return { 
        status: 'low', 
        color: 'red', 
        impact: 'Low HDL - increases heart disease risk, need to raise "good" cholesterol',
        recommendations: [
          'Exercise regularly: 150+ minutes/week cardio + 2-3 resistance training sessions',
          'Eat healthy fats: avocados, olive oil, nuts, seeds, fatty fish daily',
          'Take omega-3 fish oil: 2-3g EPA/DHA daily',
          'Include MCT oil: 1-2 tbsp daily for HDL support',
          'Consume moderate amounts of red wine (1 glass for women, 2 for men) if appropriate',
          'Quit smoking immediately (smoking dramatically lowers HDL)',
          'Lose excess weight: even 5-10 lbs can significantly raise HDL',
          'Consider niacin (vitamin B3): 500-1000mg daily (monitor liver function)',
          'Add soluble fiber: oats, beans, psyllium husk to improve cholesterol ratios',
          'Minimize refined carbs and sugar (they lower HDL)',
          'Consider intermittent fasting to improve lipid profiles',
          'Recheck lipids in 3 months'
        ]
      };
      if (value < 50) return { 
        status: 'suboptimal', 
        color: 'yellow', 
        impact: 'Suboptimal HDL - could benefit from exercise and healthy fats',
        recommendations: [
          'Increase cardio exercise: aim for 45+ minutes 4-5x per week',
          'Add strength training: 2-3x per week to boost HDL production',
          'Include more monounsaturated fats: olive oil, avocados, almonds',
          'Eat fatty fish 2-3x per week: salmon, mackerel, sardines',
          'Take fish oil supplement: 1-2g EPA/DHA daily',
          'Limit refined carbohydrates and added sugars',
          'Maintain healthy weight through caloric balance',
          'Consider moderate alcohol consumption if appropriate',
          'Add ground flaxseed: 1-2 tbsp daily to meals',
          'Optimize sleep: poor sleep negatively affects HDL',
          'Recheck levels in 6 months'
        ]
      };
      return { 
        status: 'optimal', 
        color: 'green', 
        impact: 'Good HDL levels provide cardiovascular protection',
        recommendations: [
          'Maintain current exercise routine and healthy fat intake',
          'Continue cardiovascular-protective lifestyle habits',
          'Monitor levels annually',
          'Keep supporting heart health through whole foods diet'
        ]
      };
    }
    
    if (name.includes('ldl')) {
      if (value > 160) return { 
        status: 'high', 
        color: 'red', 
        impact: 'High LDL - significant cardiovascular risk, lifestyle and/or medication needed',
        recommendations: [
          'Reduce saturated fat intake to <7% of calories (avoid red meat, butter, cheese)',
          'Eliminate trans fats completely (check food labels for "partially hydrogenated oils")',
          'Increase soluble fiber to 10-25g daily (oats, beans, apples, barley)',
          'Add plant stanols/sterols 2g daily (fortified foods or supplements)',
          'Consider statins or other cholesterol-lowering medications with your doctor',
          'Exercise 150+ minutes/week of moderate cardio (brisk walking, cycling)',
          'Maintain healthy weight (lose 5-10% if overweight)',
          'Quit smoking if applicable (smoking damages arteries and worsens LDL impact)'
        ]
      };
      if (value > 130) return { 
        status: 'borderline', 
        color: 'orange', 
        impact: 'Borderline high LDL - dietary changes recommended',
        recommendations: [
          'Follow Mediterranean diet pattern (olive oil, nuts, fish, vegetables)',
          'Limit saturated fat to <10% of calories (choose lean proteins)',
          'Eat 2-3 servings of fatty fish weekly (salmon, mackerel, sardines)',
          'Include 1-2 tbsp ground flaxseed or chia seeds daily',
          'Choose whole grains over refined grains (brown rice, quinoa, oats)',
          'Add 30 minutes of cardio exercise 5 days/week',
          'Manage stress through meditation, yoga, or deep breathing',
          'Recheck levels in 3 months to monitor progress'
        ]
      };
      if (value > 100) return { 
        status: 'above optimal', 
        color: 'yellow', 
        impact: 'Above optimal LDL - monitor and consider lifestyle modifications',
        recommendations: [
          'Replace butter/margarine with olive oil or avocado oil',
          'Snack on unsalted nuts (almonds, walnuts) 1 oz daily',
          'Add beans/legumes to meals 3-4 times per week',
          'Choose oatmeal for breakfast (3g soluble fiber per serving)',
          'Take 10,000 steps daily or equivalent moderate exercise',
          'Limit processed foods and fast food to 1-2 times per week',
          'Include green tea (2-3 cups daily) for antioxidants',
          'Monitor levels every 6 months'
        ]
      };
      return { 
        status: 'optimal', 
        color: 'green', 
        impact: 'Optimal LDL levels support heart health',
        recommendations: [
          'Maintain current healthy eating patterns',
          'Continue regular physical activity',
          'Annual cholesterol screening recommended',
          'Keep supporting heart health with omega-3 rich foods'
        ]
      };
    }
    
    if (name.includes('triglycerides')) {
      if (value > 500) return { 
        status: 'very high', 
        color: 'red', 
        impact: 'Very high triglycerides - risk of pancreatitis, requires immediate attention',
        recommendations: [
          'See doctor immediately - may need prescription medication (fibrates, niacin)',
          'Severely restrict carbohydrates to <20% of calories',
          'Eliminate all sugar, sweets, and refined carbs completely',
          'Avoid alcohol entirely until levels normalize',
          'Eat very low-fat diet temporarily (<15% calories from fat)',
          'Consider prescription omega-3 supplements (4g EPA/DHA daily)',
          'Monitor for pancreatitis symptoms (severe abdominal pain)',
          'Recheck levels in 4-6 weeks',
          'May require hospitalization if symptoms develop'
        ]
      };
      if (value > 200) return { 
        status: 'high', 
        color: 'red', 
        impact: 'High triglycerides - increases heart disease risk',
        recommendations: [
          'Reduce refined carbs and sugar by 75% (bread, pasta, sweets)',
          'Limit alcohol to 1 drink per week or eliminate completely',
          'Take omega-3 fish oil: 2-3g EPA/DHA daily',
          'Increase fiber intake to 35g daily (vegetables, beans, oats)',
          'Exercise 45+ minutes daily, including cardio and resistance training',
          'Lose weight if overweight (even 5-10% helps significantly)',
          'Consider niacin supplement 500-1000mg (with doctor approval)',
          'Eat smaller, more frequent meals (5-6 per day)',
          'Recheck levels in 3 months'
        ]
      };
      if (value > 150) return { 
        status: 'borderline', 
        color: 'yellow', 
        impact: 'Borderline high triglycerides - dietary changes recommended',
        recommendations: [
          'Reduce simple carbohydrates by 50% (sugar, white bread, pastries)',
          'Limit alcohol to 2-3 drinks per week maximum',
          'Take fish oil supplement: 1-2g EPA/DHA daily',
          'Increase physical activity to 150+ minutes per week',
          'Choose complex carbs: quinoa, brown rice, sweet potatoes',
          'Eat more soluble fiber: oats, beans, apples, berries',
          'Lose 5-10% body weight if overweight',
          'Monitor portion sizes, especially carbohydrates',
          'Recheck levels in 6 months'
        ]
      };
      return { 
        status: 'optimal', 
        color: 'green', 
        impact: 'Normal triglyceride levels',
        recommendations: [
          'Maintain current dietary patterns',
          'Continue regular physical activity',
          'Moderate alcohol consumption (if any)',
          'Annual lipid panel monitoring'
        ]
      };
    }
    
    if (name.includes('cholesterol_hdl_ratio') || name.includes('total/hdl')) {
      if (value > 5.0) return { status: 'high risk', color: 'red', impact: 'High cardiovascular risk ratio - need to improve cholesterol profile' };
      if (value > 4.0) return { status: 'moderate risk', color: 'orange', impact: 'Moderate cardiovascular risk - lifestyle improvements recommended' };
      if (value > 3.5) return { status: 'low risk', color: 'yellow', impact: 'Acceptable ratio but room for improvement' };
      return { status: 'optimal', color: 'green', impact: 'Excellent cholesterol ratio - low cardiovascular risk' };
    }
    
    if (name.includes('non_hdl')) {
      if (value > 190) return { status: 'very high', color: 'red', impact: 'Very high non-HDL cholesterol - significant cardiovascular risk' };
      if (value > 160) return { status: 'high', color: 'red', impact: 'High non-HDL cholesterol - increased heart disease risk' };
      if (value > 130) return { status: 'borderline', color: 'yellow', impact: 'Borderline high non-HDL cholesterol - monitor closely' };
      return { status: 'optimal', color: 'green', impact: 'Good non-HDL cholesterol levels' };
    }
    
    if (name.includes('glucose') || name.includes('blood sugar')) {
      if (value > 126) return { 
        status: 'diabetic', 
        color: 'red', 
        impact: 'Diabetic range - requires medical management',
        recommendations: [
          'Work with healthcare provider immediately for diabetes management',
          'Follow very low-carb or ketogenic diet: <50g carbs daily',
          'Take chromium picolinate: 200-400mcg daily for glucose metabolism',
          'Add alpha-lipoic acid: 300-600mg daily for nerve protection',
          'Include cinnamon extract: 500-1000mg daily to improve insulin sensitivity',
          'Exercise after meals: 10-15 minute walks to lower glucose spikes',
          'Monitor blood glucose multiple times daily',
          'Consider berberine: 500mg 2-3x daily (natural metformin alternative)',
          'Optimize magnesium: 400-600mg daily (crucial for glucose metabolism)',
          'Practice intermittent fasting under medical supervision',
          'Test for food sensitivities that may spike glucose',
          'Address stress management: chronic stress worsens diabetes'
        ]
      };
      if (value > 100) return { 
        status: 'prediabetic', 
        color: 'orange', 
        impact: 'Prediabetic - increased diabetes risk, lifestyle changes needed',
        recommendations: [
          'Adopt low-glycemic diet: eliminate refined sugars, white flour, processed foods',
          'Practice carb cycling: limit carbs to <100g daily, time around workouts',
          'Take chromium: 200mcg daily to improve insulin sensitivity',
          'Add apple cider vinegar: 1-2 tbsp before meals to blunt glucose response',
          'Include fiber supplements: psyllium husk, glucomannan before meals',
          'Exercise regularly: 150+ minutes/week, include resistance training',
          'Try intermittent fasting: 16:8 or 14:10 eating windows',
          'Take omega-3s: 2g daily to reduce inflammation and improve insulin sensitivity',
          'Optimize sleep: poor sleep worsens insulin resistance',
          'Manage stress: cortisol increases blood sugar',
          'Consider berberine: 500mg 2x daily',
          'Recheck glucose and HbA1c in 3 months'
        ]
      };
      return { 
        status: 'optimal', 
        color: 'green', 
        impact: 'Normal glucose metabolism',
        recommendations: [
          'Maintain balanced diet with complex carbohydrates',
          'Continue regular physical activity',
          'Monitor levels annually after age 40',
          'Keep supporting healthy insulin sensitivity through lifestyle'
        ]
      };
    }
    
    // Default comprehensive recommendations based on biomarker category
    let defaultRecs = [
      'Consult with your healthcare provider for specific interpretation',
      'Compare with reference ranges provided by your lab',
      'Consider trends over time rather than single values'
    ];

    // Add category-specific functional health recommendations
    if (name.includes('hormone') || name.includes('testosterone') || name.includes('estrogen') || name.includes('progesterone')) {
      defaultRecs.push(
        'Support hormone balance: adequate sleep (7-9 hours), stress management',
        'Include healthy fats: avocados, nuts, olive oil for hormone production', 
        'Consider adaptogenic herbs: ashwagandha, rhodiola for hormonal support',
        'Limit endocrine disruptors: plastics, pesticides, synthetic fragrances',
        'Support liver detoxification: cruciferous vegetables, milk thistle'
      );
    } else if (name.includes('liver') || name.includes('alt') || name.includes('ast') || name.includes('bilirubin')) {
      defaultRecs.push(
        'Support liver health: milk thistle, NAC, glutathione precursors',
        'Limit alcohol consumption and processed foods',
        'Include liver-supporting foods: beets, artichokes, dandelion',
        'Stay hydrated: half your body weight in ounces of water daily',
        'Consider intermittent fasting to give liver time to detoxify'
      );
    } else if (name.includes('kidney') || name.includes('creatinine') || name.includes('bun') || name.includes('egfr')) {
      defaultRecs.push(
        'Support kidney health: adequate hydration, limit excess protein',
        'Reduce sodium intake: <2300mg daily, focus on whole foods',
        'Include kidney-supporting herbs: nettle leaf, cranberry',
        'Monitor blood pressure regularly',
        'Limit NSAIDs which can stress kidneys'
      );
    } else if (name.includes('thyroid') || name.includes('tsh') || name.includes('t3') || name.includes('t4')) {
      defaultRecs.push(
        'Support thyroid function: iodine-rich foods (seaweed), selenium (Brazil nuts)',
        'Avoid goitrogenic foods in excess: raw cruciferous vegetables',
        'Include tyrosine-rich foods: almonds, avocados, sesame seeds',
        'Manage stress which can suppress thyroid function',
        'Consider zinc and vitamin D for thyroid hormone conversion'
      );
    } else if (name.includes('vitamin') || name.includes('mineral') || name.includes('nutrient')) {
      defaultRecs.push(
        'Focus on nutrient-dense whole foods over supplements when possible',
        'Consider digestive health: gut absorption affects nutrient levels',
        'Address any dietary restrictions that may limit nutrient intake',
        'Monitor for signs of deficiency specific to this nutrient',
        'Work with functional medicine practitioner for comprehensive assessment'
      );
    } else {
      defaultRecs.push(
        'Follow anti-inflammatory diet: whole foods, omega-3s, antioxidants',
        'Maintain regular exercise: 150+ minutes moderate activity weekly',
        'Prioritize sleep quality: 7-9 hours nightly for optimal biomarker balance',
        'Manage stress: chronic stress negatively impacts most biomarkers',
        'Stay hydrated and avoid processed foods'
      );
    }

    return { 
      status: 'normal', 
      color: 'gray', 
      impact: 'Values appear within extracted range - functional health support recommended',
      recommendations: defaultRecs
    };
  };

  // Helper function to interpret SNPs
  const interpretSNP = (snp: any) => {
    const snpId = snp.snp_id || '';
    const genotype = snp.genotype || snp.allele || '';
    const gene = snp.gene_name || '';
    
    // Common SNP interpretations
    if (gene.includes('MTHFR')) {
      if (genotype.includes('T') || genotype.includes('C')) {
        return {
          impact: 'Affects folate metabolism - may need methylfolate supplementation',
          symptoms: 'Can cause: elevated homocysteine, fatigue, mood issues, cardiovascular risk',
          severity: 'moderate',
          color: 'orange',
          recommendations: [
            'Take methylfolate (5-MTHF) 400-800mcg daily instead of folic acid',
            'Supplement with methylcobalamin (B12) 1000mcg daily',
            'Add riboflavin (B2) 10-20mg daily to support MTHFR enzyme function',
            'Include folate-rich foods: leafy greens, legumes, asparagus',
            'Avoid folic acid in supplements and fortified foods when possible',
            'Check homocysteine levels annually (should be <10 μmol/L)',
            'Limit alcohol consumption (interferes with folate metabolism)',
            'Consider choline supplementation 300-500mg daily',
            'Monitor cardiovascular health more closely',
            'Consider family planning implications (MTHFR variants may affect pregnancy outcomes)'
          ]
        };
      }
      return { 
        impact: 'Normal folate metabolism', 
        symptoms: 'No significant impact', 
        severity: 'normal', 
        color: 'green',
        recommendations: [
          'Standard folate recommendations apply',
          'Regular diet with folate-rich foods is sufficient',
          'No special supplementation needed for MTHFR function'
        ]
      };
    }
    
    if (gene.includes('COMT')) {
      if (genotype.includes('A') || genotype.includes('T')) {
        return {
          impact: 'Slow dopamine breakdown - sensitive to stress and stimulants',
          symptoms: 'May experience: anxiety, stress sensitivity, caffeine sensitivity, need for magnesium',
          severity: 'moderate',
          color: 'yellow',
          recommendations: [
            'Limit caffeine intake to <100mg daily (about 1 cup coffee)',
            'Take magnesium glycinate 300-400mg before bed for stress support',
            'Practice stress management: meditation, yoga, deep breathing daily',
            'Avoid high-stress situations when possible',
            'Consider L-theanine 200mg with any caffeine consumption',
            'Get 7-9 hours of quality sleep (crucial for dopamine regulation)',
            'Eat protein-rich foods: eggs, fish, chicken, legumes',
            'Include dopamine-supporting foods: almonds, avocados, bananas',
            'Consider adaptogenic herbs: ashwagandha, rhodiola',
            'Avoid alcohol and recreational drugs (interfere with dopamine)',
            'Exercise regularly but avoid overtraining (increases stress)',
            'Consider SAMe supplementation 400-800mg daily'
          ]
        };
      }
      return {
        impact: 'Fast dopamine breakdown - handles stress well but may need more support',
        symptoms: 'May benefit from: dopamine support, methylated B-vitamins',
        severity: 'mild',
        color: 'blue',
        recommendations: [
          'Support dopamine production with tyrosine 500-1000mg daily',
          'Take methylated B-complex for neurotransmitter support',
          'Include iron-rich foods: red meat, spinach, lentils (if not deficient)',
          'Consider mucuna pruriens extract for natural L-DOPA',
          'Eat antioxidant-rich foods: berries, dark chocolate, green tea',
          'Regular exercise helps maintain dopamine sensitivity',
          'Can handle moderate caffeine intake (200-300mg daily)',
          'May benefit from cold exposure therapy',
          'Consider curcumin supplementation for neuroprotection',
          'Ensure adequate vitamin D levels for dopamine function'
        ]
      };
    }
    
    if (gene.includes('APOE')) {
      if (genotype.includes('E4')) {
        return {
          impact: 'Increased Alzheimer\'s risk - focus on brain health',
          symptoms: 'Higher risk for cognitive decline, Alzheimer\'s disease, and cardiovascular issues',
          severity: 'significant',
          color: 'red',
          recommendations: [
            'Take high-dose DHA omega-3: 1000-2000mg daily (from algae or fish oil)',
            'Supplement with curcumin 500-1000mg daily (with piperine for absorption)',
            'Limit saturated fat to <7% of calories (avoid red meat, butter, full-fat dairy)',
            'Follow Mediterranean diet strictly (fish, olive oil, nuts, vegetables)',
            'Exercise 150+ minutes/week including resistance training and cardio',
            'Prioritize sleep: 7-9 hours nightly (crucial for brain detox)',
            'Take vitamin E 400 IU daily (mixed tocopherols, not alpha alone)',
            'Consider lion\'s mane mushroom extract 500-1000mg daily',
            'Practice cognitive training: learning new skills, puzzles, reading',
            'Manage stress aggressively: meditation, yoga, therapy',
            'Avoid aluminum cookware and antiperspirants',
            'Get regular cognitive assessments starting at age 45',
            'Consider phosphatidylserine 100-300mg daily',
            'Maintain social connections and mental stimulation'
          ]
        };
      }
      return { 
        impact: 'Standard Alzheimer\'s risk', 
        symptoms: 'Normal genetic predisposition to cognitive aging', 
        severity: 'normal', 
        color: 'green',
        recommendations: [
          'Follow general brain health guidelines',
          'Include omega-3 rich foods regularly',
          'Stay physically and mentally active',
          'Maintain healthy cardiovascular system'
        ]
      };
    }
    
    if (gene.includes('VDR')) {
      return {
        impact: 'Vitamin D receptor variant - may need higher vitamin D doses',
        symptoms: 'May require increased vitamin D3 supplementation for optimal levels',
        severity: 'mild',
        color: 'yellow',
        recommendations: [
          'Take higher dose vitamin D3: 4000-6000 IU daily (vs standard 1000-2000 IU)',
          'Monitor vitamin D levels more frequently: every 6 months vs annually',
          'Combine with vitamin K2: 100-200mcg daily for synergistic effects',
          'Include magnesium: 400-600mg daily (required for vitamin D metabolism)',
          'Get morning sunlight exposure: 15-30 minutes daily when possible',
          'Consider vitamin D cofactors: boron 3-10mg, zinc 15-30mg daily',
          'Eat vitamin D rich foods: fatty fish, egg yolks, mushrooms',
          'Monitor for signs of deficiency: fatigue, mood issues, frequent illness',
          'Target higher optimal range: 60-80 ng/mL vs standard 30-50 ng/mL',
          'Consider seasonal dosing: higher doses in winter months'
        ]
      };
    }
    
    if (gene.includes('FADS')) {
      return {
        impact: 'Altered omega-3 metabolism - may need direct EPA/DHA',
        symptoms: 'Reduced ability to convert plant omega-3s (ALA) to EPA/DHA',
        severity: 'mild',
        color: 'blue',
        recommendations: [
          'Take high-quality fish oil: 2-3g EPA/DHA daily from marine sources',
          'Avoid relying on plant-based omega-3s: flax, chia, walnuts less effective',
          'Choose algae-based omega-3 if vegetarian: higher bioavailability than plants',
          'Eat fatty fish 3-4x per week: wild salmon, mackerel, sardines, anchovies',
          'Consider krill oil: may have better absorption than fish oil',
          'Monitor inflammatory markers: omega-6/omega-3 ratio, CRP',
          'Reduce omega-6 intake: vegetable oils, processed foods, grain-fed meat',
          'Include GLA sources: evening primrose oil, borage oil for inflammation',
          'Test omega-3 index annually: target >8% for optimal health',
          'Consider higher doses during inflammatory conditions',
          'Support with antioxidants: vitamin E, astaxanthin to prevent oxidation'
        ]
      };
    }
    
    // Default comprehensive recommendations based on gene category
    let defaultGeneRecs = [
      'Research the specific SNP and gene function in scientific literature'
    ];

    // Add category-specific functional health recommendations based on gene function
    if (gene.includes('CYP') || gene.includes('cytochrome')) {
      defaultGeneRecs.push(
        'Support liver detoxification: cruciferous vegetables, NAC, glutathione',
        'Limit exposure to toxins: pesticides, chemicals, excess medications',
        'Include detox-supporting foods: broccoli, Brussels sprouts, garlic',
        'Consider milk thistle and alpha-lipoic acid for liver support',
        'Be cautious with medication dosing - may need adjustments'
      );
    } else if (gene.includes('SERT') || gene.includes('HTR') || gene.includes('DRD') || gene.includes('MAOA')) {
      defaultGeneRecs.push(
        'Support neurotransmitter production: balanced protein intake, B-vitamins',
        'Manage stress through meditation, yoga, adequate sleep',
        'Include mood-supporting nutrients: omega-3s, magnesium, zinc',
        'Consider adaptogenic herbs: ashwagandha, rhodiola, holy basil',
        'Monitor mental health and work with healthcare provider if needed'
      );
    } else if (gene.includes('TNF') || gene.includes('IL') || gene.includes('inflammatory')) {
      defaultGeneRecs.push(
        'Follow anti-inflammatory diet: omega-3s, polyphenols, antioxidants',
        'Include turmeric/curcumin, green tea, berries for inflammation control',
        'Manage stress which increases inflammatory cytokines',
        'Optimize gut health: probiotics, prebiotic fiber, heal leaky gut',
        'Monitor inflammatory markers: CRP, ESR regularly'
      );
    } else if (gene.includes('LEPR') || gene.includes('FTO') || gene.includes('MC4R')) {
      defaultGeneRecs.push(
        'Focus on metabolic health: intermittent fasting, low-glycemic foods',
        'Include metabolism-supporting nutrients: chromium, alpha-lipoic acid',
        'Prioritize protein intake: 0.8-1.2g per kg body weight daily',
        'Manage insulin sensitivity through exercise and diet',
        'Monitor weight and metabolic markers regularly'
      );
    } else if (gene.includes('ACE') || gene.includes('cardiovascular') || gene.includes('heart')) {
      defaultGeneRecs.push(
        'Support cardiovascular health: omega-3s, CoQ10, magnesium',
        'Include heart-healthy foods: fatty fish, nuts, olive oil, berries',
        'Monitor blood pressure and lipid levels regularly',
        'Exercise regularly: cardio and resistance training',
        'Manage stress which impacts cardiovascular health'
      );
    } else if (gene.includes('SOD') || gene.includes('GSTT') || gene.includes('GSTM') || gene.includes('antioxidant')) {
      defaultGeneRecs.push(
        'Boost antioxidant intake: berries, dark leafy greens, colorful vegetables',
        'Include antioxidant supplements: vitamin C, E, selenium, NAC',
        'Support glutathione production: cysteine, glycine, glutamine',
        'Limit oxidative stress: avoid smoking, excess alcohol, processed foods',
        'Include sulfur-rich foods: garlic, onions, cruciferous vegetables'
      );
    } else {
      defaultGeneRecs.push(
        'Maintain optimal nutrition: whole foods, adequate protein, healthy fats',
        'Support epigenetic health: folate, B12, choline, adequate sleep',
        'Exercise regularly to optimize gene expression',
        'Manage stress which can negatively impact gene function',
        'Consider personalized nutrition based on genetic profile'
      );
    }

    // Provide more specific descriptions based on gene name
    let severityDescription = 'variant detected';
    let impactDescription = `Genetic variant in ${gene} - functional support recommended`;
    
    if (gene.includes('AHCY')) {
      severityDescription = 'methylation support';
      impactDescription = 'AHCY affects methylation cycle - supports homocysteine metabolism';
    } else if (gene.includes('BCMO1')) {
      severityDescription = 'vitamin A conversion';
      impactDescription = 'BCMO1 converts beta-carotene to vitamin A - may need preformed vitamin A';
    } else if (gene.includes('PEMT')) {
      severityDescription = 'choline metabolism';
      impactDescription = 'PEMT produces phosphatidylcholine - may need higher choline intake';
    } else if (gene.includes('CBS')) {
      severityDescription = 'sulfur metabolism';
      impactDescription = 'CBS processes sulfur amino acids - affects detoxification pathways';
    } else if (gene.includes('SUOX')) {
      severityDescription = 'sulfite oxidase';
      impactDescription = 'SUOX breaks down sulfites - may be sensitive to sulfite-containing foods';
    } else if (gene.includes('MAOA')) {
      severityDescription = 'neurotransmitter';
      impactDescription = 'MAOA breaks down serotonin and dopamine - affects mood regulation';
    } else if (gene.includes('GAD1')) {
      severityDescription = 'GABA production';
      impactDescription = 'GAD1 produces calming neurotransmitter GABA - affects anxiety/stress response';
    } else if (gene.includes('SHMT')) {
      severityDescription = 'folate pathway';
      impactDescription = 'SHMT processes folate and glycine - affects methylation and detox';
    } else if (gene.includes('CTH')) {
      severityDescription = 'sulfur pathway';
      impactDescription = 'CTH processes cysteine - affects glutathione production and detox';
    } else if (gene.includes('TCN')) {
      severityDescription = 'B12 transport';
      impactDescription = 'TCN transports vitamin B12 - may affect B12 absorption and utilization';
    }

    return {
      impact: impactDescription,
      symptoms: 'May benefit from targeted functional health interventions',
      severity: severityDescription,
      color: 'gray',
      recommendations: defaultGeneRecs
    };
  };

  const renderAnalysis = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Comprehensive Analysis</h1>
      
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setBiomarkersExpanded(!biomarkersExpanded)}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Biomarker Analysis
              </div>
              {biomarkersExpanded ? 
                <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                <ChevronDown className="h-5 w-5 text-gray-400" />
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-green-600 mb-2">{extractedData.biomarkers}</div>
              <p className="text-gray-600">Biomarkers Analyzed</p>
              {biomarkersExpanded && biomarkersData.length === 0 && (
                <p className="text-sm text-red-600 mt-2">Upload lab reports to see analysis</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSnpsExpanded(!snpsExpanded)}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dna className="h-5 w-5" />
                Genetic Variants
              </div>
              {snpsExpanded ? 
                <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                <ChevronDown className="h-5 w-5 text-gray-400" />
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-purple-600 mb-2">{extractedData.snps}</div>
              <p className="text-gray-600">Variants Identified</p>
              {snpsExpanded && snpsData.length === 0 && (
                <p className="text-sm text-red-600 mt-2">Upload genetic reports to see analysis</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biomarkers Section */}
      {biomarkersExpanded && biomarkersData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Your Biomarkers ({biomarkersData.length})
            </CardTitle>
            <CardDescription>
              Analysis of your lab results and health implications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {biomarkersData.map((marker, index) => {
                const interpretation = interpretBiomarker(marker);
                const referenceRange = getBiomarkerReferenceRange(marker.marker_name);
                const isExpanded = expandedBiomarkers.has(index);
                
                const StatusIcon = interpretation.color === 'red' ? AlertTriangle :
                                 interpretation.color === 'orange' ? AlertCircle :
                                 interpretation.color === 'yellow' ? AlertCircle :
                                 interpretation.color === 'green' ? CheckCircle : Info;
                
                return (
                  <div key={index} className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                    {/* Collapsed Header */}
                    <div 
                      className="p-4 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleBiomarker(index)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <StatusIcon className={`h-5 w-5 ${
                          interpretation.color === 'red' ? 'text-red-500' :
                          interpretation.color === 'orange' ? 'text-orange-500' :
                          interpretation.color === 'yellow' ? 'text-yellow-500' :
                          interpretation.color === 'green' ? 'text-green-500' :
                          'text-gray-500'
                        }`} />
                                                 <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-800">{cleanBiomarkerName(marker.marker_name)}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xl font-bold text-gray-900">
                              {marker.value} {marker.unit}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              interpretation.color === 'red' ? 'bg-red-100 text-red-700' :
                              interpretation.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                              interpretation.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                              interpretation.color === 'green' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {interpretation.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isExpanded ? 
                        <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      }
                    </div>
                    
                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t bg-gray-50 p-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Reference Range */}
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Reference Range</h5>
                            <div className="bg-blue-50 p-3 rounded border border-blue-200">
                              <p className="text-blue-800 font-mono text-sm">{referenceRange}</p>
                            </div>
                          </div>
                          
                          {/* Your Value Status */}
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Status</h5>
                            <div className={`p-3 rounded border ${
                              interpretation.color === 'red' ? 'bg-red-50 border-red-200' :
                              interpretation.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                              interpretation.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                              interpretation.color === 'green' ? 'bg-green-50 border-green-200' :
                              'bg-gray-50 border-gray-200'
                            }`}>
                              <p className="text-sm font-medium text-gray-800">{interpretation.status.toUpperCase()}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* What This Measures */}
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-700 mb-2">📊 What This Measures</h5>
                          <div className="bg-slate-50 p-3 rounded border border-slate-200">
                            <p className="text-sm text-slate-700">{getBiomarkerExplanation(marker.marker_name)}</p>
                          </div>
                        </div>

                        {/* Health Impact */}
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-700 mb-2">Health Impact</h5>
                          <div className={`p-3 rounded border-l-4 ${
                            interpretation.color === 'red' ? 'bg-red-50 border-red-400' :
                            interpretation.color === 'orange' ? 'bg-orange-50 border-orange-400' :
                            interpretation.color === 'yellow' ? 'bg-yellow-50 border-yellow-400' :
                            interpretation.color === 'green' ? 'bg-green-50 border-green-400' :
                            'bg-gray-50 border-gray-400'
                          }`}>
                            <p className="text-sm text-gray-700">{interpretation.impact}</p>
                          </div>
                        </div>

                        {/* Personalized Recommendations */}
                        {interpretation.recommendations && interpretation.recommendations.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-700 mb-2">🎯 Personalized Action Plan</h5>
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                              <ul className="space-y-2">
                                {interpretation.recommendations.map((rec: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-indigo-800">
                                    <span className="text-indigo-600 font-bold mt-0.5 text-xs">•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SNPs Section */}
      {snpsExpanded && snpsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dna className="h-5 w-5" />
              Your Genetic Variants ({snpsData.length})
            </CardTitle>
            <CardDescription>
              Analysis of your genetic variants and health implications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {snpsData.map((snp, index) => {
                const interpretation = interpretSNP(snp);
                const variantInfo = getSnpVariantInfo(snp.snp_id, snp.genotype || snp.allele || '');
                const isExpanded = expandedSnps.has(index);
                
                const StatusIcon = interpretation.color === 'red' ? AlertTriangle :
                                 interpretation.color === 'orange' ? AlertCircle :
                                 interpretation.color === 'yellow' ? AlertCircle :
                                 interpretation.color === 'blue' ? Info :
                                 interpretation.color === 'green' ? CheckCircle : Info;
                
                return (
                  <div key={index} className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                    {/* Collapsed Header */}
                    <div 
                      className="p-4 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleSnp(index)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <StatusIcon className={`h-5 w-5 ${
                          interpretation.color === 'red' ? 'text-red-500' :
                          interpretation.color === 'orange' ? 'text-orange-500' :
                          interpretation.color === 'yellow' ? 'text-yellow-500' :
                          interpretation.color === 'blue' ? 'text-blue-500' :
                          interpretation.color === 'green' ? 'text-green-500' :
                          'text-gray-500'
                        }`} />
                                                 <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-800">{cleanSnpName(snp.snp_id, snp.gene_name)}</h4>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-gray-900">
                              {snp.genotype || snp.allele}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              interpretation.color === 'red' ? 'bg-red-100 text-red-700' :
                              interpretation.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                              interpretation.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                              interpretation.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                              interpretation.color === 'green' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {interpretation.severity}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isExpanded ? 
                        <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      }
                    </div>
                    
                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t bg-gray-50 p-4">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          {/* Population Frequency */}
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Population Frequency</h5>
                            <div className="bg-purple-50 p-3 rounded border border-purple-200">
                              <p className="text-purple-800 font-mono text-sm">{variantInfo.frequency}</p>
                            </div>
                          </div>
                          
                          {/* Risk Level */}
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Risk Level</h5>
                            <div className={`p-3 rounded border ${
                              interpretation.color === 'red' ? 'bg-red-50 border-red-200' :
                              interpretation.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                              interpretation.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                              interpretation.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                              interpretation.color === 'green' ? 'bg-green-50 border-green-200' :
                              'bg-gray-50 border-gray-200'
                            }`}>
                              <p className="text-sm font-medium text-gray-800">{variantInfo.risk}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* What This Gene Does */}
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-700 mb-2">🧬 What This Gene Does</h5>
                          <div className="bg-slate-50 p-3 rounded border border-slate-200">
                            <p className="text-sm text-slate-700">{getSnpExplanation(snp.gene_name, snp.snp_id)}</p>
                          </div>
                        </div>

                        {/* Impact */}
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-700 mb-2">Functional Impact</h5>
                          <div className={`p-3 rounded border-l-4 ${
                            interpretation.color === 'red' ? 'bg-red-50 border-red-400' :
                            interpretation.color === 'orange' ? 'bg-orange-50 border-orange-400' :
                            interpretation.color === 'yellow' ? 'bg-yellow-50 border-yellow-400' :
                            interpretation.color === 'blue' ? 'bg-blue-50 border-blue-400' :
                            interpretation.color === 'green' ? 'bg-green-50 border-green-400' :
                            'bg-gray-50 border-gray-400'
                          }`}>
                            <p className="text-sm text-gray-700 font-medium mb-1">{interpretation.impact}</p>
                          </div>
                        </div>
                        
                        {/* Symptoms & General Info */}
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Associated Symptoms</h5>
                          <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            <p className="text-sm text-gray-700">{interpretation.symptoms}</p>
                          </div>
                        </div>

                        {/* Personalized Recommendations */}
                        {interpretation.recommendations && interpretation.recommendations.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-700 mb-2">🧬 Genetic-Based Action Plan</h5>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                              <ul className="space-y-2">
                                {interpretation.recommendations.map((rec: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-purple-800">
                                    <span className="text-purple-600 font-bold mt-0.5 text-xs">•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State for Biomarkers */}
      {biomarkersExpanded && biomarkersData.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              No Biomarker Data
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Lab Results Available</h3>
            <p className="text-gray-600 mb-4">
              Upload your lab reports to see biomarker analysis and health insights.
            </p>
            <Button variant="outline" onClick={() => router.push('/onboarding')}>
              Upload Lab Reports
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State for SNPs */}
      {snpsExpanded && snpsData.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dna className="h-5 w-5" />
              No Genetic Data
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Dna className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Genetic Results Available</h3>
            <p className="text-gray-600 mb-4">
              Upload your genetic testing results to see variant analysis and recommendations.
            </p>
            <Button variant="outline" onClick={() => router.push('/onboarding')}>
              Upload Genetic Reports
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Overall Empty State */}
      {!biomarkersExpanded && !snpsExpanded && biomarkersData.length === 0 && snpsData.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Analysis</h3>
            <p className="text-gray-600 mb-6">
              Click on the cards above to explore your biomarkers and genetic variants, or upload new data to get started.
            </p>
            <Button variant="outline" onClick={() => router.push('/onboarding')}>
              Upload Health Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // AI Chat functions
  const sendMessage = async (message: string, conversationId?: string) => {
    if (!message.trim() || isChatLoading) return;

    setIsChatLoading(true);
    
    // Add user message to chat immediately for better UX
    const userMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversation_id: conversationId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        // Add AI response to chat
        const aiMessage = {
          role: 'assistant' as const,
          content: result.message,
          timestamp: new Date().toISOString()
        };
        
        setChatMessages(prev => [...prev, aiMessage]);
        
        // Update conversation list if needed
        if (result.conversations) {
          setChatHistory(result.conversations);
        }
      } else {
        console.error('Failed to send message:', result.error);
        alert(`Failed to send message: ${result.error}`);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsChatLoading(false);
    }
  };

  const startNewConversation = () => {
    setChatMessages([]);
  };

  const loadConversation = async (conversationId: string) => {
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

      const formattedMessages = (messages || []).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.created_at
      }));

      setChatMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  // Load conversation history on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user) return;

      try {
        const { data: conversations, error } = await supabase
          .from('user_chat_conversations')
          .select('id, title, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (!error && conversations) {
          setChatHistory(conversations);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadChatHistory();
  }, [user, supabase]);

  const renderAIChat = () => (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">🧬 AI Biohacker Assistant</h1>
        <Button onClick={startNewConversation} variant="outline">
          New Conversation
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Conversation History Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-sm">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {chatHistory.map((conversation: any) => (
                  <button
                    key={conversation.id}
                    onClick={() => loadConversation(conversation.id)}
                    className="w-full text-left p-3 hover:bg-gray-50 border-b text-xs"
                  >
                    <div className="font-medium truncate">{conversation.title}</div>
                    <div className="text-gray-500 text-xs">
                      {new Date(conversation.updated_at).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Your Personal Health Assistant
              </CardTitle>
              <CardDescription>
                I have full access to your biomarkers, genetics, and health history. Ask me anything!
              </CardDescription>
            </CardHeader>
            
            {/* Chat Messages */}
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <Brain className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to optimize your health?</h3>
                    <p className="text-gray-600 mb-6">
                      I know your biomarkers ({extractedData.biomarkers}), genetic variants ({extractedData.snps}), 
                      and current supplement plan. What would you like to discuss?
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                      <Button 
                        variant="outline" 
                        onClick={() => sendMessage("What do my biomarkers tell you about my health?")}
                        className="text-left"
                      >
                        🩸 Analyze my biomarkers
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => sendMessage("Based on my genetics, what should I focus on?")}
                        className="text-left"
                      >
                        🧬 Genetic insights
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => sendMessage("How can I optimize my energy levels?")}
                        className="text-left"
                      >
                        ⚡ Boost energy
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => sendMessage("What biohacks would work best for me?")}
                        className="text-left"
                      >
                        🚀 Personalized biohacks
                      </Button>
                    </div>
                  </div>
                ) : (
                  chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(chatInput);
                      }
                    }}
                    placeholder="Ask about your biomarkers, genetics, supplements, or any health question..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isChatLoading}
                  />
                  <Button
                    onClick={() => sendMessage(chatInput)}
                    disabled={!chatInput.trim() || isChatLoading}
                    size="sm"
                  >
                    Send
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 I remember everything about your health profile and our previous conversations
                </p>
              </div>
            </CardContent>
          </Card>
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
      case 'ai-chat':
        return renderAIChat();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo/Header */}
        <div className="p-4 border-b border-gray-200">
          {!sidebarCollapsed ? (
            <h2 className="text-xl font-bold text-gray-800">SupplementAI</h2>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="font-medium">{item.label}</span>
                      {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Collapse Button */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className={`h-5 w-5 transition-transform ${sidebarCollapsed ? 'rotate-0' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>

      {/* Supplement Details Popup */}
      {isPopupOpen && selectedSupplement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Popup Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedSupplement.supplement}</h2>
                  {selectedSupplement.product && (
                    <div className="text-lg text-gray-600">
                      <span className="font-medium">{selectedSupplement.product.brand}</span> • {selectedSupplement.product.product_name}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setIsPopupOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </Button>
              </div>

              {/* Dosage & Timing */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-semibold text-gray-700 mb-2">💊 Recommended Dosage & Timing</h3>
                <p className="text-gray-600">
                  <span className="font-medium text-blue-800">{selectedSupplement.dosage || 'As directed'}</span>
                  {selectedSupplement.timing && <span className="block text-sm mt-1">⏰ {selectedSupplement.timing}</span>}
                </p>
              </div>

              {/* Why This Supplement */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h3 className="font-semibold text-gray-700 mb-2">🎯 Why This Supplement?</h3>
                <p className="text-gray-600">{selectedSupplement.reason}</p>
              </div>

              {/* Scientific Evidence */}
              {selectedSupplement.citations && selectedSupplement.citations.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <h3 className="font-semibold text-gray-700 mb-2">📚 Scientific Evidence</h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    {selectedSupplement.citations.map((citation: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-yellow-600 font-bold mt-0.5">•</span>
                        <span>{citation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Drug Interactions */}
              {selectedSupplement.interactions && selectedSupplement.interactions.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <h3 className="font-semibold text-red-700 mb-2">⚠️ Drug Interactions</h3>
                  <ul className="text-red-700 text-sm space-y-1">
                    {selectedSupplement.interactions.map((interaction: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-500 font-bold mt-0.5">•</span>
                        <span>{interaction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Clinical Notes */}
              {selectedSupplement.notes && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                  <h3 className="font-semibold text-gray-700 mb-2">📝 Clinical Notes</h3>
                  <p className="text-gray-600 text-sm">{selectedSupplement.notes}</p>
                </div>
              )}

              {/* Purchase Button */}
              {selectedSupplement.product && selectedSupplement.product.product_url && (
                <div className="flex gap-3">
                  <a 
                    href={selectedSupplement.product.product_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center flex items-center justify-center gap-2"
                  >
                    🛒 Purchase This Product
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <Button
                    variant="outline"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 