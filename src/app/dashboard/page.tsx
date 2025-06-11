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
    
    return { frequency: 'Variable', risk: 'See genetic counselor' };
  };

  // Helper function to interpret biomarker values
  const interpretBiomarker = (marker: any) => {
    const name = marker.marker_name?.toLowerCase() || '';
    const value = parseFloat(marker.value) || 0;
    const unit = marker.unit || '';
    
    // Common biomarker interpretations
    if (name.includes('vitamin d') || name.includes('25-oh')) {
      if (value < 20) return { status: 'deficient', color: 'red', impact: 'Severe deficiency - affects bone health, immune function, mood' };
      if (value < 30) return { status: 'insufficient', color: 'orange', impact: 'Insufficiency - may cause fatigue, bone pain, frequent infections' };
      if (value < 50) return { status: 'suboptimal', color: 'yellow', impact: 'Suboptimal - may affect energy and immune function' };
      return { status: 'optimal', color: 'green', impact: 'Good levels support bone health, immunity, and mood' };
    }
    
    if (name.includes('b12') || name.includes('cobalamin')) {
      if (value < 300) return { status: 'deficient', color: 'red', impact: 'Deficiency - can cause fatigue, brain fog, nerve problems' };
      if (value < 400) return { status: 'suboptimal', color: 'yellow', impact: 'Low normal - may affect energy and cognitive function' };
      return { status: 'optimal', color: 'green', impact: 'Good levels support energy and neurological health' };
    }
    
    if (name.includes('ferritin')) {
      if (value < 30) return { status: 'deficient', color: 'red', impact: 'Low iron stores - causes fatigue, weakness, restless legs' };
      if (value < 50) return { status: 'suboptimal', color: 'yellow', impact: 'Suboptimal iron - may affect energy and exercise capacity' };
      if (value > 150) return { status: 'elevated', color: 'orange', impact: 'High iron - may indicate inflammation or hemochromatosis' };
      return { status: 'optimal', color: 'green', impact: 'Good iron stores support energy and oxygen transport' };
    }
    
    if (name.includes('crp') || name.includes('c-reactive')) {
      if (value > 3.0) return { status: 'elevated', color: 'red', impact: 'High inflammation - increases cardiovascular and chronic disease risk' };
      if (value > 1.0) return { status: 'moderate', color: 'yellow', impact: 'Moderate inflammation - may benefit from anti-inflammatory interventions' };
      return { status: 'optimal', color: 'green', impact: 'Low inflammation - good cardiovascular health marker' };
    }
    
    if (name.includes('cholesterol') && name.includes('total')) {
      if (value > 240) return { status: 'high', color: 'red', impact: 'High cholesterol - increases cardiovascular disease risk' };
      if (value > 200) return { status: 'borderline', color: 'yellow', impact: 'Borderline high - monitor diet and lifestyle factors' };
      return { status: 'optimal', color: 'green', impact: 'Good cholesterol levels support cardiovascular health' };
    }
    
    if (name.includes('hdl')) {
      if (value < 40) return { status: 'low', color: 'red', impact: 'Low HDL - increases heart disease risk, need to raise "good" cholesterol' };
      if (value < 50) return { status: 'suboptimal', color: 'yellow', impact: 'Suboptimal HDL - could benefit from exercise and healthy fats' };
      return { status: 'optimal', color: 'green', impact: 'Good HDL levels provide cardiovascular protection' };
    }
    
    if (name.includes('ldl')) {
      if (value > 160) return { status: 'high', color: 'red', impact: 'High LDL - significant cardiovascular risk, lifestyle and/or medication needed' };
      if (value > 130) return { status: 'borderline', color: 'orange', impact: 'Borderline high LDL - dietary changes recommended' };
      if (value > 100) return { status: 'above optimal', color: 'yellow', impact: 'Above optimal LDL - monitor and consider lifestyle modifications' };
      return { status: 'optimal', color: 'green', impact: 'Optimal LDL levels support heart health' };
    }
    
    if (name.includes('triglycerides')) {
      if (value > 500) return { status: 'very high', color: 'red', impact: 'Very high triglycerides - risk of pancreatitis, requires immediate attention' };
      if (value > 200) return { status: 'high', color: 'red', impact: 'High triglycerides - increases heart disease risk' };
      if (value > 150) return { status: 'borderline', color: 'yellow', impact: 'Borderline high triglycerides - dietary changes recommended' };
      return { status: 'optimal', color: 'green', impact: 'Normal triglyceride levels' };
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
      if (value > 126) return { status: 'diabetic', color: 'red', impact: 'Diabetic range - requires medical management' };
      if (value > 100) return { status: 'prediabetic', color: 'orange', impact: 'Prediabetic - increased diabetes risk, lifestyle changes needed' };
      return { status: 'optimal', color: 'green', impact: 'Normal glucose metabolism' };
    }
    
    // Default for unknown markers
    return { status: 'normal', color: 'gray', impact: 'Values appear within extracted range' };
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
          color: 'orange'
        };
      }
      return { impact: 'Normal folate metabolism', symptoms: 'No significant impact', severity: 'normal', color: 'green' };
    }
    
    if (gene.includes('COMT')) {
      if (genotype.includes('A') || genotype.includes('T')) {
        return {
          impact: 'Slow dopamine breakdown - sensitive to stress and stimulants',
          symptoms: 'May experience: anxiety, stress sensitivity, caffeine sensitivity, need for magnesium',
          severity: 'moderate',
          color: 'yellow'
        };
      }
      return {
        impact: 'Fast dopamine breakdown - handles stress well but may need more support',
        symptoms: 'May benefit from: dopamine support, methylated B-vitamins',
        severity: 'mild',
        color: 'blue'
      };
    }
    
    if (gene.includes('APOE')) {
      if (genotype.includes('E4')) {
        return {
          impact: 'Increased Alzheimer\'s risk - focus on brain health',
          symptoms: 'Recommendations: omega-3 DHA, curcumin, antioxidants, avoid saturated fats',
          severity: 'significant',
          color: 'red'
        };
      }
      return { impact: 'Standard Alzheimer\'s risk', symptoms: 'Maintain general brain health practices', severity: 'normal', color: 'green' };
    }
    
    if (gene.includes('VDR')) {
      return {
        impact: 'Vitamin D receptor variant - may need higher vitamin D doses',
        symptoms: 'May require: increased vitamin D3 supplementation for optimal levels',
        severity: 'mild',
        color: 'yellow'
      };
    }
    
    if (gene.includes('FADS')) {
      return {
        impact: 'Altered omega-3 metabolism - may need direct EPA/DHA',
        symptoms: 'May benefit from: direct fish oil rather than plant-based omega-3s',
        severity: 'mild',
        color: 'blue'
      };
    }
    
    // Default for unknown SNPs
    return {
      impact: 'Genetic variant identified - specific interpretation pending',
      symptoms: 'Consult with genetic counselor for detailed interpretation',
      severity: 'unknown',
      color: 'gray'
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
                        
                        {/* Recommendations */}
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Recommendations & Symptoms</h5>
                          <div className="bg-indigo-50 p-3 rounded border border-indigo-200">
                            <p className="text-sm text-indigo-800">{interpretation.symptoms}</p>
                          </div>
                        </div>
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

  const renderAIChat = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Health Assistant</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat with AI
          </CardTitle>
          <CardDescription>
            Ask questions about your health data and get personalized advice
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Brain className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI Chat Coming Soon</h3>
          <p className="text-gray-600 mb-6">
            Soon you'll be able to have conversations with our AI about your health data, 
            ask questions about supplements, and get personalized guidance.
          </p>
          <Button disabled variant="outline">
            Start Chat (Coming Soon)
          </Button>
        </CardContent>
      </Card>
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