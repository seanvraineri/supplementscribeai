'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 🔥 VIBRANT LIGHT GRADIENT BACKGROUND - EYE POPPING!
const VibrantDashboardGradient = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-pink-50 via-violet-50 to-cyan-50">
    <motion.div
      className="absolute inset-0"
      animate={{
        background: [
          "radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.15), transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15), transparent 50%), radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.15), transparent 50%)",
          "radial-gradient(circle at 60% 20%, rgba(236, 72, 153, 0.2), transparent 50%), radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.2), transparent 50%), radial-gradient(circle at 80% 60%, rgba(59, 130, 246, 0.2), transparent 50%)",
          "radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15), transparent 50%), radial-gradient(circle at 40% 20%, rgba(147, 51, 234, 0.15), transparent 50%), radial-gradient(circle at 20% 60%, rgba(59, 130, 246, 0.15), transparent 50%)",
        ],
      }}
      transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    />
    <motion.div
      className="absolute inset-0"
      animate={{
        background: [
          "linear-gradient(45deg, rgba(251, 191, 36, 0.08), rgba(34, 197, 94, 0.08), rgba(168, 85, 247, 0.08))",
          "linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(168, 85, 247, 0.12), rgba(251, 191, 36, 0.08))",
          "linear-gradient(225deg, rgba(168, 85, 247, 0.08), rgba(251, 191, 36, 0.08), rgba(34, 197, 94, 0.12))",
        ],
      }}
      transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 2 }}
    />
  </div>
);

// Mock data for preview
const mockUser = {
  email: "sean@example.com",
  name: "Sean"
};

const mockProfile = {
  full_name: "Sean Raineri"
};

const mockPlan = {
  morning: [
    { name: "Vitamin D3", dosage: "5000 IU", reason: "Support immune function and energy" },
    { name: "Omega-3", dosage: "2000 mg", reason: "Reduce inflammation and support brain health" },
    { name: "Magnesium", dosage: "400 mg", reason: "Improve sleep quality and muscle recovery" }
  ],
  evening: [
    { name: "Melatonin", dosage: "3 mg", reason: "Optimize sleep quality and circadian rhythm" },
    { name: "Ashwagandha", dosage: "300 mg", reason: "Reduce stress and support recovery" },
    { name: "Zinc", dosage: "15 mg", reason: "Support immune function and tissue repair" }
  ]
};

const mockHealthScore = {
  score: 78,
  label: "Good Health",
  lastUpdated: "Today"
};

type TabType = 'dashboard' | 'supplement-plan' | 'analysis' | 'tracking' | 'ai-chat' | 'product-checker' | 'study-buddy' | 'settings';

export default function LightPreviewPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedRitual, setSelectedRitual] = useState<'morning' | 'evening'>('morning');

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
                     <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-pink-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent">
             {getTimeGreeting()}, {mockProfile?.full_name?.split(' ')[0] || mockUser?.name || 'there'}!
           </h1>
           <p className="text-gray-700 mt-2 text-lg font-bold">Your personalized wellness experience ✨</p>
        </div>
                 <div className="text-right">
           <p className="text-sm text-gray-600">Last updated</p>
           <p className="text-sm font-bold text-gray-900">Today at 2:30 PM</p>
         </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-5 gap-6 h-full">
        {/* Health Score - Takes up 3/5 of the space */}
        <div className="lg:col-span-3">
                     <Card className="h-full bg-white/80 backdrop-blur-xl border-pink-200/50 shadow-2xl">
             <CardHeader className="pb-4">
               <div className="flex items-center justify-between">
                 <div>
                   <CardTitle className="text-gray-900 flex items-center gap-2 font-black text-xl">
                     <Heart className="h-6 w-6 text-pink-500" />
                     Health Score
                   </CardTitle>
                   <CardDescription className="text-gray-700 font-bold">
                     Your comprehensive wellness assessment
                   </CardDescription>
                 </div>
               </div>
             </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <div className="relative">
                                 {/* Main health score circle */}
                 <div className="relative bg-gradient-to-br from-pink-500/20 to-violet-600/20 backdrop-blur-xl border-4 border-white/30 rounded-full p-8 w-48 h-48 flex flex-col items-center justify-center shadow-2xl">
                   {/* Rings */}
                   <div className="absolute inset-6 border-2 border-white/40 rounded-full" />
                   <div className="absolute inset-8 border border-white/20 rounded-full" />
                   
                   {/* Score display */}
                   <div className="text-center z-10">
                     <div className="text-6xl font-black mb-2 text-white drop-shadow-lg">
                       {mockHealthScore.score}
                     </div>
                     <div className="text-cyan-300 text-lg font-bold mb-1">{mockHealthScore.label}</div>
                     <div className="text-white/60 text-xs font-medium">Updated {mockHealthScore.lastUpdated}</div>
                   </div>
 
                   {/* Badges */}
                   <div className="absolute top-4 right-4">
                     <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                       <Star className="h-3 w-3 text-white" />
                     </div>
                   </div>
                   <div className="absolute bottom-6 left-6">
                     <div className="w-5 h-5 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                       <Heart className="h-2.5 w-2.5 text-white" />
                     </div>
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Takes up 2/5 of the space */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-3">
            <Card 
              className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border-gray-200 hover:border-blue-300"
              onClick={() => setActiveTab('analysis')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Health Analysis</h3>
                    <p className="text-sm text-gray-600">View detailed insights</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border-gray-200 hover:border-green-300"
              onClick={() => setActiveTab('ai-chat')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">AI Health Assistant</h3>
                    <p className="text-sm text-gray-600">Get personalized guidance</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border-gray-200 hover:border-purple-300"
              onClick={() => setActiveTab('supplement-plan')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Pill className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Supplement Plan</h3>
                    <p className="text-sm text-gray-600">View your daily routine</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compact Supplement Plan */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                <Pill className="h-4 w-4 text-blue-600" />
                Today's Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Ritual Selector */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedRitual('morning')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedRitual === 'morning'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Morning
                </button>
                <button
                  onClick={() => setSelectedRitual('evening')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedRitual === 'evening'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Evening
                </button>
              </div>

              {/* Supplements List */}
              <div className="space-y-2">
                {mockPlan[selectedRitual]?.slice(0, 3).map((supplement: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 text-sm truncate">{supplement.name}</span>
                        <span className="text-gray-600 text-xs bg-gray-200 px-2 py-1 rounded-full">{supplement.dosage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'supplement-plan', label: 'Supplement Plan', icon: Pill },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'tracking', label: 'Tracking', icon: Activity },
    { id: 'ai-chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'product-checker', label: 'Product Checker', icon: Search },
    { id: 'study-buddy', label: 'Study Buddy', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-white text-gray-900">
      <VibrantDashboardGradient />
      
             {/* Sidebar */}
       <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white/80 backdrop-blur-xl border-r border-pink-200/50 transition-all duration-300 flex flex-col shadow-2xl relative z-10`}>
                 {/* Logo */}
         <div className="p-6 border-b border-pink-200/50">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
               <Leaf className="h-6 w-6 text-white" />
             </div>
             {!sidebarCollapsed && (
               <div>
                 <h1 className="text-xl font-black text-gray-900 tracking-tight">SupplementScribe</h1>
                 <p className="text-xs text-pink-600 uppercase tracking-wider font-bold">🔥 VIBRANT PREVIEW</p>
               </div>
             )}
           </div>
         </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                   isActive
                     ? 'bg-gradient-to-r from-pink-500/20 to-violet-500/20 text-gray-900 border border-pink-400/50 shadow-lg backdrop-blur-sm'
                     : 'text-gray-700 hover:bg-pink-100/50 hover:text-gray-900 backdrop-blur-sm'
                 }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-medium">{tab.label}</span>
                )}
              </button>
            );
          })}
        </nav>

                 {/* User Profile */}
         <div className="p-4 border-t border-pink-200/50">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
               <User className="h-5 w-5 text-white" />
             </div>
             {!sidebarCollapsed && (
               <div className="flex-1 min-w-0">
                 <p className="font-bold text-gray-900 truncate">
                   {mockProfile?.full_name || 'User'}
                 </p>
                 <p className="text-sm text-blue-600 truncate">{mockUser?.email}</p>
               </div>
             )}
           </div>
         </div>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
        >
          <ChevronRight className={`h-3 w-3 text-gray-600 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

             {/* Main Content */}
       <div className="flex-1 flex flex-col min-w-0 relative z-10">
         {/* Top Bar */}
         <div className="bg-white/80 backdrop-blur-xl border-b border-pink-200/50 px-6 py-4 shadow-2xl">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
               <h2 className="text-2xl font-black text-gray-900 capitalize tracking-tight">
                 {activeTab.replace('-', ' ')}
               </h2>
             </div>
             <div className="flex items-center gap-3">
               <Button
                 variant="outline"
                 size="sm"
                 className="border-pink-400/50 text-gray-900 hover:bg-pink-500/20 backdrop-blur-sm bg-pink-100/50"
               >
                 <LogOut className="h-4 w-4 mr-2" />
                 Sign Out
               </Button>
             </div>
           </div>
         </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'dashboard' && renderDashboardContent()}
          {activeTab !== 'dashboard' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tabs.find(tab => tab.id === activeTab)?.label} Preview
                </h3>
                <p className="text-gray-600">
                  This is a light theme preview. The actual functionality would be implemented here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 