'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Sunrise, 
  Moon, 
  Sparkles, 
  Activity, 
  Brain, 
  MessageSquare,
  BarChart3,
  User,
  Leaf,
  Star,
  ChevronRight,
  Search,
  BookOpen
} from 'lucide-react';

export default function DesignPreview() {
  const [selectedRitual, setSelectedRitual] = useState<'morning' | 'evening'>('morning');
  
  // Mock data for the preview
  const mockUser = {
    name: "Sean",
    healthScore: 78,
    scoreLabel: "Good Health",
    lastUpdated: "Today"
  };

  const mockSupplements = {
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

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="h-screen bg-white text-gray-900 overflow-hidden">
      {/* Subtle luxury texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-50/50 pointer-events-none" />
      
      <div className="relative z-10 h-full flex flex-col container mx-auto px-6 py-4 max-w-7xl">
        {/* Compact Luxury Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center shadow-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-black">SupplementScribe</h1>
              <p className="text-gray-600 text-xs font-medium tracking-wide uppercase">Premium Wellness</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-black text-white rounded-lg font-medium text-xs tracking-wide">
              MEMBER
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Greeting */}
        <motion.div 
          className="text-center mb-4 flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-1 text-black tracking-tight">
            {getTimeGreeting()}, {mockUser.name}
          </h2>
          <p className="text-gray-600 text-sm font-medium">
            Your exclusive wellness experience
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          {/* Health Score */}
          <div className="col-span-4 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-black/5 rounded-full blur-xl scale-110" />
                <div className="relative bg-white border-3 border-gray-200 rounded-full p-6 w-48 h-48 flex flex-col items-center justify-center shadow-xl">
                  <div className="absolute inset-4 border-2 border-gray-100 rounded-full" />
                  <div className="text-center z-10">
                    <div className="text-4xl font-bold mb-1 text-black tracking-tight">
                      {mockUser.healthScore}
                    </div>
                    <div className="text-gray-700 text-sm font-semibold mb-1">{mockUser.scoreLabel}</div>
                    <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Updated {mockUser.lastUpdated}</div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      <Star className="h-2.5 w-2.5 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                      <Heart className="h-2 w-2 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Daily Collections */}
          <div className="col-span-5">
            <motion.div 
              className="h-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-center mb-3">
                <h3 className="text-lg font-bold text-black tracking-tight">Your Daily Collection</h3>
                <p className="text-gray-600 text-xs font-medium">Curated exclusively for you</p>
              </div>
              
              <div className="grid grid-rows-2 gap-3 h-full">
                {/* Morning Collection */}
                <div 
                  className={`bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 shadow-lg ${
                    selectedRitual === 'morning' ? 'border-black shadow-xl' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRitual('morning')}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                      <Sunrise className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black">Morning Collection</h4>
                      <p className="text-gray-600 text-xs">Begin with excellence</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {mockSupplements.morning.slice(0, 2).map((supplement, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-black rounded-full flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-black text-xs truncate">{supplement.name}</span>
                            <span className="text-gray-700 text-xs bg-gray-200 px-2 py-0.5 rounded-full">{supplement.dosage}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evening Collection */}
                <div 
                  className={`bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 shadow-lg ${
                    selectedRitual === 'evening' ? 'border-black shadow-xl' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRitual('evening')}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <Moon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black">Evening Collection</h4>
                      <p className="text-gray-600 text-xs">Restore & rejuvenate</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {mockSupplements.evening.slice(0, 2).map((supplement, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-black rounded-full flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-black text-xs truncate">{supplement.name}</span>
                            <span className="text-gray-700 text-xs bg-gray-200 px-2 py-0.5 rounded-full">{supplement.dosage}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Luxury Services */}
          <div className="col-span-3">
            <motion.div 
              className="h-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-center mb-3">
                <h3 className="text-lg font-bold text-black tracking-tight">Premium Services</h3>
              </div>
              
              <div className="grid grid-rows-5 gap-2 h-full">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-black hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-black truncate">Analysis</h4>
                      <p className="text-gray-600 text-xs">Health domains</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-black hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-black truncate">AI Concierge</h4>
                      <p className="text-gray-600 text-xs">Personal guidance</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-black hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-black truncate">Progress</h4>
                      <p className="text-gray-600 text-xs">Track wellness</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-black hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Search className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-black truncate">Product Checker</h4>
                      <p className="text-gray-600 text-xs">Verify quality</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-black hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-black truncate">Study Buddy</h4>
                      <p className="text-gray-600 text-xs">Research insights</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Compact Footer */}
        <motion.div 
          className="text-center mt-3 pt-3 border-t border-gray-200 flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-gray-800 text-sm font-bold">
            ✨ LUXURY DESIGN PREVIEW
          </p>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
            Louis Vuitton × Gucci Inspired • Everything on One Screen
          </p>
        </motion.div>
      </div>
    </div>
  );
} 