'use client'

import { motion } from 'framer-motion';
import { BookOpen, Clock, User, ArrowRight, Search, Tag, Calendar, LogIn, TrendingUp, Brain, Heart, Leaf, Pill, Sparkles, Activity, AlertTriangle, Shield, Compass, Users, Moon, Zap, Scale, Microscope, DnaIcon, ShieldCheck, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';

// Navigation is now imported from the reusable component

// Sample blog posts data - you can replace this with your actual blog content
const sampleBlogPosts = [
  {
    id: 1,
    title: "Pre-Workout Supplements: Personalized Performance Enhancement",
    excerpt: "Stop relying on generic pre-workouts loaded with excessive caffeine and fillers. Discover how AI analyzes your genetics, caffeine tolerance, and performance goals to create personalized pre-workout supplements that enhance YOUR specific energy pathways, endurance capacity, and workout performance.",
    category: "Performance & Fitness",
    readTime: "16 min read",
    publishDate: "2025-01-31",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Pre-Workout", "Performance", "Caffeine", "Creatine", "Personalized", "Fitness"],
    featured: true,
    icon: TrendingUp,
    slug: "pre-workout-supplements-personalized-performance-enhancement-2025"
  },
  {
    id: 2,
    title: "Immune System Supplements: Build Strong Immunity with Personalized Nutrition",
    excerpt: "Stop relying on generic immune supplements that ignore your unique immune genetics. Discover how AI analyzes your immune markers, genetic variants, and health profile to create personalized supplements that support YOUR specific immune pathways and help maintain healthy immune function year-round.",
    category: "Immune Support",
    readTime: "17 min read",
    publishDate: "2025-01-31",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Immune Support", "Vitamin D", "Zinc", "Elderberry", "Personalized", "Genetics"],
    featured: false,
    icon: Shield,
    slug: "immune-system-supplements-build-strong-immunity-personalized-nutrition-2025"
  },
  {
    id: 3,
    title: "Hormone Balance Supplements: Personalized Support for Thyroid, Testosterone & More",
    excerpt: "Stop guessing with generic hormone supplements that ignore your unique endocrine genetics. Discover how AI analyzes your hormone markers, genetic variants, and symptoms to create personalized supplements that actually restore thyroid function, optimize testosterone, and balance your entire hormonal system.",
    category: "Hormone Health",
    readTime: "19 min read",
    publishDate: "2025-01-31",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Hormone Balance", "Thyroid", "Testosterone", "Endocrine", "Personalized", "Genetics"],
    featured: false,
    icon: Activity,
    slug: "hormone-balance-supplements-personalized-thyroid-testosterone-support-2025"
  },
  {
    id: 4,
    title: "Energy Supplements That Work: Beat Chronic Fatigue with Personalized Nutrition",
    excerpt: "Stop relying on caffeine crashes and generic energy pills that don't address root causes. Discover how AI analyzes your genetics, metabolic markers, and fatigue patterns to create personalized energy supplements that restore sustainable vitality and beat chronic exhaustion.",
    category: "Energy & Fatigue",
    readTime: "18 min read",
    publishDate: "2025-01-31",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Energy", "Chronic Fatigue", "Mitochondrial", "B-Vitamins", "Personalized", "Metabolism"],
    featured: false,
    icon: Zap,
    slug: "energy-supplements-that-work-beat-chronic-fatigue-personalized-nutrition-2025"
  },
  {
    id: 5,
    title: "Anti-Aging Supplements: Personalized Longevity Stack Based on Your Genetics",
    excerpt: "Stop buying expensive anti-aging supplements that don't match your biology. Discover how AI analyzes your genetics, cellular aging markers, and health profile to create personalized longevity supplements that support YOUR unique aging pathways and healthspan optimization.",
    category: "Longevity",
    readTime: "17 min read",
    publishDate: "2025-01-31",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Anti-Aging", "Longevity", "Genetics", "Personalized", "Healthspan", "Cellular Health"],
    featured: false,
    icon: Clock,
    slug: "anti-aging-supplements-personalized-longevity-stack-genetics-2025"
  },
  {
    id: 6,
    title: "Gut Health Revolution: How Personalized Probiotics Transform Your Microbiome",
    excerpt: "Stop wasting money on generic probiotics that pass right through you. Discover how AI analyzes your genetics, digestive symptoms, and microbiome needs to create personalized gut health supplements that actually colonize and heal your digestive system.",
    category: "Gut Health",
    readTime: "16 min read",
    publishDate: "2025-01-31",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Gut Health", "Probiotics", "Microbiome", "Digestive", "Personalized", "IBS"],
    featured: false,
    icon: Activity,
    slug: "gut-health-revolution-personalized-probiotics-transform-microbiome-2025"
  },
  {
    id: 7,
    title: "Sleep Better Tonight: Personalized Sleep Supplements Based on Your DNA & Lifestyle",
    excerpt: "Stop relying on generic melatonin that works for only 23% of people. Discover how AI analyzes your genetics, circadian rhythm, and lifestyle to create personalized sleep supplements that actually help you fall asleep faster and stay asleep longer.",
    category: "Sleep Health",
    readTime: "14 min read",
    publishDate: "2025-01-31",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Sleep", "Melatonin", "Circadian", "DNA", "Personalized", "Insomnia"],
    featured: false,
    icon: Moon,
    slug: "sleep-better-tonight-personalized-sleep-supplements-dna-lifestyle-2025"
  },
  {
    id: 8,
    title: "Weight Loss Supplements That Actually Work: AI-Powered Personalization vs Generic Pills",
    excerpt: "Stop falling for generic weight loss pills with 79% failure rates. Discover how AI-powered personalized supplements target YOUR specific metabolism, genetics, and weight loss barriers for results that actually last.",
    category: "Weight Loss",
    readTime: "15 min read",
    publishDate: "2025-01-31",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Weight Loss", "Supplements", "AI", "Personalized", "Metabolism", "Fat Loss"],
    featured: false,
    icon: TrendingUp,
    slug: "weight-loss-supplements-that-actually-work-ai-personalized-2025"
  },
  {
    id: 9,
    title: "How to Lose Belly Fat: The Science of Personalized Fat-Burning Supplements [2025 Guide]",
    excerpt: "Stop wasting money on generic fat burners that fail 87% of the time. Discover how AI-powered personalized supplements target YOUR specific metabolism, genetics, and biomarkers for real belly fat loss that actually works.",
    category: "Weight Loss",
    readTime: "12 min read",
    publishDate: "2025-01-31",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Weight Loss", "Belly Fat", "Fat Burners", "Personalized", "AI", "Metabolism"],
    featured: false,
    icon: TrendingUp,
    slug: "how-lose-belly-fat-personalized-supplements-2025"
  },
  {
    id: 10,
    title: "DNA-Optimized Supplements: How AI Tailors Your Vitamins to Genes & Bloodwork [2025 Guide]",
    excerpt: "Imagine feeling 2x healthier daily without the frustration of generic supplements or pricey doctor visits. A groundbreaking PubMed study shows that customizing nutrition to your unique biology can double health benefits compared to generic advice.",
    category: "Science",
    readTime: "8 min read",
    publishDate: "2025-01-30",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["DNA", "AI", "Personalization", "Genetics", "Bloodwork"],
    featured: false,
    icon: Brain,
    slug: "dna-optimized-supplements-ai-guide-2025"
  },
  {
    id: 11,
    title: "MTHFR Gene & Anxiety: How Nutrient Optimization Replaced My SSRIs (A Founder's Journey)",
    excerpt: "Anxiety can feel debilitating, I know from experience. SSRIs left me numb yet still anxious, a struggle that lasted years. A breakthrough came with a genetic test revealing my C677T MTHFR mutation, disrupting methylation—a process vital for neurotransmitter production.",
    category: "Personal Story",
    readTime: "7 min read",
    publishDate: "2025-01-28",
    author: "Sean Raineri, Founder",
    image: "/api/placeholder/600/400",
    tags: ["MTHFR", "Anxiety", "SSRIs", "Personal Story", "Mental Health"],
    featured: false,
    icon: Heart,
    slug: "mthfr-gene-anxiety-founder-journey"
  },
  {
    id: 12,
    title: "AI-Optimized Supplements: Why Your DNA Demands Personalization (2025 Data-Backed Guide)",
    excerpt: "Health and wellness are evolving, and generic supplements are losing ground. People crave personalized solutions tailored to their unique needs, and SupplementScribe is leading this shift with AI-driven custom wellness plans.",
    category: "Science",
    readTime: "6 min read",
    publishDate: "2025-01-26",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["AI", "Personalization", "DNA", "Data", "Future"],
    featured: false,
    icon: Brain,
    slug: "ai-optimized-supplements-dna-personalization-2025"
  },
  {
    id: 13,
    title: "How AI is Making Personalized Health Affordable and Accessible for Everyone",
    excerpt: "Personalized health was once a luxury for the elite, with costs soaring into thousands. Now, AI is breaking those barriers, making tailored wellness accessible to all with plans starting at just $19.99/month.",
    category: "Health",
    readTime: "5 min read",
    publishDate: "2025-01-24",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["AI", "Affordable", "Accessible", "Wellness", "Health"],
    featured: false,
    icon: Heart,
    slug: "ai-making-personalized-health-affordable-accessible"
  },
  {
    id: 14,
    title: "Unlocking the ADHD Puzzle: Could Nutritional Deficiencies Be the Missing Piece?",
    excerpt: "ADHD affects millions, challenging focus and productivity. While brain chemistry gets attention, nutritional deficiencies and genetic factors may hold the key to better management through personalized supplements.",
    category: "Mental Health",
    readTime: "6 min read",
    publishDate: "2025-01-24",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["ADHD", "Mental Health", "Nutrition", "Focus", "Genetics"],
    featured: false,
    icon: Brain,
    slug: "adhd-nutritional-deficiencies-missing-piece"
  },
  {
    id: 15,
    title: "Live Longer and Thrive with ADHD: Personalized Supplements for a Healthier You",
    excerpt: "Recent reports suggest a link between ADHD and reduced life expectancy. Yet, you're not bound by statistics. With proactive strategies and personalized supplements, you can boost longevity and well-being.",
    category: "Longevity",
    readTime: "7 min read",
    publishDate: "2025-01-24",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["ADHD", "Longevity", "Health", "Supplements", "Wellness"],
    featured: false,
    icon: Heart,
    slug: "live-longer-thrive-adhd-personalized-supplements"
  },
  {
    id: 16,
    title: "Frustrated with Acne? Discover the Power of Personalized Supplements",
    excerpt: "Acne affects millions, sapping confidence despite topical treatments that often miss the root cause. Discover how personalized supplements can transform your skin health naturally.",
    category: "Skin Health",
    readTime: "6 min read",
    publishDate: "2025-01-24",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Acne", "Skin Health", "Supplements", "Personalized", "Beauty"],
    featured: false,
    icon: Sparkles,
    slug: "frustrated-acne-discover-personalized-supplements"
  },
  {
    id: 17,
    title: "Greens Powders: Hype or Health Boost? Unlock Personalized Nutrition for Optimal Wellness",
    excerpt: "With the global greens supplement market projected to reach $1.2 billion by 2027, their appeal is undeniable. Yet evidence suggests these products may not suit everyone's unique nutritional profile.",
    category: "Supplements",
    readTime: "8 min read",
    publishDate: "2025-01-24",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Greens Powders", "Personalized Nutrition", "Supplements", "AI", "Wellness"],
    featured: false,
    icon: Leaf,
    slug: "greens-powders-hype-health-boost-personalized-nutrition"
  },
  {
    id: 18,
    title: "Give Your Body a Fighting Chance: The Power of Personalized Supplements in Everyday Life",
    excerpt: "In today's relentless pace, our bodies face stress, environmental toxins, and processed diets. Discover how personalized supplements bridge nutritional gaps and boost daily vitality.",
    category: "Daily Wellness",
    readTime: "7 min read",
    publishDate: "2025-01-24",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Daily Wellness", "Personalized Supplements", "Energy", "Immunity", "Stress"],
    featured: false,
    icon: Activity,
    slug: "give-body-fighting-chance-personalized-supplements-everyday"
  },
  {
    id: 19,
    title: "Supplements: Skeptic? Unlock Personalized Nutrition to Thrive in 2025",
    excerpt: "Feeling drained, foggy, or rundown despite a 'healthy' diet? 70% of adults are missing key vitamins and minerals. Discover how personalized supplements can bridge the gap.",
    category: "Skeptic Guide",
    readTime: "6 min read",
    publishDate: "2025-01-24",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Skeptic", "Personalized Nutrition", "Energy", "Health Gaps", "AI"],
    featured: false,
    icon: AlertTriangle,
    slug: "supplements-skeptic-unlock-personalized-nutrition-thrive-2025"
  },
  {
    id: 20,
    title: "Preventive Care, Naturally: How Personalized Supplements Transform Your Health Journey",
    excerpt: "In today's fast-paced world, preventive healthcare has never been more critical. With nutrient-depleted soils and chronic stress affecting millions, discover how personalized nutrition can transform your health journey.",
    category: "Preventive Care",
    readTime: "5 min read",
    publishDate: "2025-06-23",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Preventive Care", "Health", "Prevention", "Personalized", "Wellness"],
    featured: false,
    icon: Shield,
    slug: "preventive-care-naturally-halt-health-crisis-sign-up-now"
  },
  {
    id: 21,
    title: "Drowning in Health Advice? How Personalized Nutrition Cuts Through the Noise",
    excerpt: "In an era of information overload, navigating health advice has become more challenging than ever. Discover how SupplementScribe's AI-driven approach cuts through the noise with personalized precision.",
    category: "Health Guidance",
    readTime: "6 min read",
    publishDate: "2025-06-23",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Health Advice", "Personalized Nutrition", "AI", "Clarity", "Wellness"],
    featured: false,
    icon: Compass,
    slug: "drowning-health-advice-unleash-personalized-power"
  },
  {
    id: 22,
    title: "Rethinking Mental Health: How Holistic Nutrition Supports Emotional Wellness",
    excerpt: "Mental health understanding has evolved beyond traditional models. Discover how modern research reveals the complex interplay of genetics, nutrition, and lifestyle in emotional wellness, and how personalized nutrition can complement mental health strategies.",
    category: "Mental Health",
    readTime: "8 min read",
    publishDate: "2025-06-23",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Mental Health", "Holistic", "Nutrition", "Emotional Wellness", "Personalized"],
    featured: false,
    icon: Brain,
    slug: "rethinking-mental-health-myths-holistic-power"
  },
  {
    id: 23,
    title: "Are You Getting Real Value from Your Supplements? The Science of Personalized Optimization",
    excerpt: "Millions spend billions on supplements with little to show for it. Discover the science behind supplement effectiveness and how personalized optimization can transform your health investment into real results.",
    category: "Optimization",
    readTime: "7 min read",
    publishDate: "2025-06-23",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Optimization", "Value", "Science", "Personalized", "Results"],
    featured: false,
    icon: TrendingUp,
    slug: "flushing-money-supplements-dna-truth"
  },
  {
    id: 24,
    title: "Family Health: Personalized Nutrition for Every Generation (Coming Soon)",
    excerpt: "Managing family health is complex with different ages, genetics, and needs under one roof. Learn about the future of household wellness through personalized nutrition - family plans coming soon!",
    category: "Family Health",
    readTime: "6 min read",
    publishDate: "2025-06-23",
    author: "SupplementScribe Health Team",
    image: "/api/placeholder/600/400",
    tags: ["Family Health", "Personalized Nutrition", "Household", "Wellness", "Coming Soon"],
    featured: false,
    icon: Users,
    slug: "family-plan-personalized-supplements-household"
  }
];

const categories = ["All", "Science", "Personal Story", "Health", "Longevity", "Skin Health", "Daily Wellness", "Skeptic Guide", "Preventive Care", "Health Guidance", "Gut Health", "Supplements", "Optimization", "Mental Health", "Family Health", "Women's Health", "Research", "Sleep Health", "Weight Loss"];

export default function ContentPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = sampleBlogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = sampleBlogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <main className="bg-dark-background text-dark-primary font-sans">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-dark-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-dark-primary">
              Health Insights & Research
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-dark-secondary max-w-3xl mx-auto px-4">
              Evidence-based articles on nutrition, supplements, and personalized health optimization
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-dark-panel/50 border-y border-dark-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-secondary" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-background border border-dark-border rounded-lg focus:border-dark-accent focus:outline-none transition-colors text-dark-primary placeholder-dark-secondary"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 bg-dark-background border border-dark-border rounded-lg focus:border-dark-accent focus:outline-none transition-colors text-dark-primary"
            >
              <option value="">All Categories</option>
              <option value="Personalized Health">Personalized Health</option>
              <option value="Supplements">Supplements</option>
              <option value="Nutrition">Nutrition</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Family Health">Family Health</option>
              <option value="Energy & Performance">Energy & Performance</option>
              <option value="Sleep & Recovery">Sleep & Recovery</option>
            </select>
          </div>
        </div>
      </section>

      {/* Category Tags */}
      <section className="py-8 bg-dark-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {["All", "Personalized Health", "Supplements", "Nutrition", "Mental Health", "Energy & Performance", "Sleep & Recovery"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === "All" ? "" : category)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  (category === "All" && selectedCategory === "") || selectedCategory === category
                    ? 'bg-dark-accent text-dark-background'
                    : 'bg-dark-panel border border-dark-border text-dark-secondary hover:text-dark-primary hover:border-dark-accent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="py-12 sm:py-16 bg-dark-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-dark-primary mb-8 text-center">Featured Article</h2>
            <Link href={`/content/${featuredPost.slug}`}>
              <div className="bg-dark-panel border border-dark-border rounded-2xl overflow-hidden hover:border-dark-accent/50 transition-all duration-300 cursor-pointer group">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="h-64 md:h-full bg-gradient-to-br from-dark-accent/20 to-blue-900/20 flex items-center justify-center">
                      <featuredPost.icon className="w-24 h-24 text-dark-accent/50" />
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 md:w-1/2">
                    <span className="inline-block px-3 py-1 bg-dark-accent/20 text-dark-accent rounded-full text-xs font-medium mb-4">
                      {featuredPost.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-dark-primary group-hover:text-dark-accent transition-colors">
                      {featuredPost.title}
                    </h3>
                    <p className="text-dark-secondary mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-dark-secondary text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="w-4 h-4" />
                      <span>{featuredPost.publishDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-12 sm:py-16 bg-dark-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark-primary mb-8">
            {selectedCategory ? `${selectedCategory} Articles` : 'All Articles'}
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-secondary text-lg">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPosts.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link href={`/content/${article.slug}`}>
                    <article
                      className="bg-dark-panel border border-dark-border rounded-xl overflow-hidden hover:border-dark-accent/50 transition-all duration-300 cursor-pointer group h-full flex flex-col"
                    >
                      <div className="h-48 bg-gradient-to-br from-dark-accent/10 to-dark-panel flex items-center justify-center">
                        <article.icon className="w-16 h-16 text-dark-accent/40" />
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-dark-accent/10 text-dark-accent rounded text-xs font-medium">
                            {article.category}
                          </span>
                          <span className="text-dark-secondary text-xs">{article.readTime}</span>
                        </div>
                        
                        <h3 className="text-lg sm:text-xl font-bold text-dark-primary mb-3 group-hover:text-dark-accent transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-dark-secondary text-sm mb-4 flex-1 line-clamp-3">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-dark-secondary">
                          <span>{article.author}</span>
                          <span>{article.publishDate}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 sm:py-24 bg-dark-panel border-t border-dark-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-dark-primary">Stay Updated on Health Insights</h2>
          <p className="text-dark-secondary mb-8 text-base sm:text-lg">Get weekly evidence-based articles on personalized nutrition and supplement science.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 w-full px-4 py-3 bg-dark-panel border border-dark-border rounded-lg text-dark-primary placeholder-dark-secondary focus:border-dark-accent focus:outline-none transition-colors"
            />
            <button className="w-full sm:w-auto px-6 py-3 bg-dark-accent text-white rounded-lg hover:bg-dark-accent/90 transition-all duration-200 font-medium whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 sm:py-16 bg-dark-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-dark-primary">Ready to Optimize Your Health?</h3>
          <p className="text-dark-secondary mb-8 text-sm sm:text-base">Join thousands who've discovered their personalized nutrition path.</p>
          <Link href="/auth/signup">
            <button className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-dark-background bg-dark-accent rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
} 