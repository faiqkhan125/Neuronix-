"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, Filter, Star, ShoppingBag, 
  ArrowRight, Sparkles, LayoutGrid, 
  List, SlidersHorizontal, ChevronDown,
  Zap, Code, Globe, Cpu
} from 'lucide-react';
import { SafeImage } from '@/components/SafeImage';
import Link from 'next/link';
import { mockProjects, mockUsers, PROJECT_CATEGORIES } from '@/lib/store';

const categories = ["All Assets", ...PROJECT_CATEGORIES];

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Assets';
  
  const [projects, setProjects] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    const fetchProjects = async () => {
      try {
        const [projectsData, profilesData] = await Promise.all([
          mockProjects.getAll(),
          mockUsers.getAll()
        ]);
        setProjects(projectsData || []);
        setProfiles(profilesData || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category') || 'All Assets');
    }
  }, [searchParams]);

  const filteredProjects = projects.filter(project => {
    // Show both 'live' (initial mock projects) and 'active' (user uploaded) projects
    if (project.status !== 'live' && project.status !== 'active') return false;
    
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Assets' || project.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'best_selling') return b.sales - a.sales;
    return 0;
  });

  if (!isMounted) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 bg-dark-bg" />
    );
  }

  return (
    <div suppressHydrationWarning className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden bg-dark-bg selection:bg-neon-blue/30 selection:text-neon-blue">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-neon-blue/20 blur-[180px] rounded-full -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-emerald-900/20 blur-[180px] rounded-full -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-neon-emerald/10 blur-[200px] rounded-full -z-10 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Marketplace Header */}
        <div className="text-center mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-neon-blue mb-6 sm:mb-8 backdrop-blur-xl shadow-[0_0_20px_rgba(0,245,255,0.1)]"
          >
            <Sparkles size={14} suppressHydrationWarning className="animate-pulse" /> Premium Digital Assets
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter mb-8 text-gradient drop-shadow-[0_0_50px_rgba(0,245,255,0.3)] leading-[0.85] uppercase"
          >
            Marketplace
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/40 max-w-3xl mx-auto text-base sm:text-2xl px-4 leading-relaxed font-medium"
          >
            Discover high-performance AI models, SaaS templates, and UI kits built by world-class developers.
          </motion.p>
        </div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-16 sm:mb-24"
        >
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-neon-blue/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-blue transition-all duration-300" size={24} suppressHydrationWarning />
            <input 
              type="text" 
              placeholder="Search for high-end digital assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input py-6 pl-20 pr-10 text-xl placeholder:text-white/10"
            />
          </div>
          
          <div className="grid grid-cols-2 lg:flex gap-4 sm:gap-6">
            <div className="relative group flex-1">
              <div className="absolute inset-0 bg-neon-blue/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full glass-input py-6 pl-10 pr-16 appearance-none font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] min-w-0 lg:min-w-[280px] cursor-pointer"
              >
                {categories.map(cat => <option key={cat} value={cat} className="bg-zinc-950 text-white">{cat}</option>)}
              </select>
              <ChevronDown className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-neon-blue transition-colors pointer-events-none" size={20} suppressHydrationWarning />
            </div>

            <div className="relative group flex-1">
              <div className="absolute inset-0 bg-neon-purple/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full glass-input py-6 pl-10 pr-16 appearance-none font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] min-w-0 lg:min-w-[240px] cursor-pointer focus:border-neon-purple/50 focus:ring-neon-purple/10"
              >
                <option value="newest" className="bg-zinc-950 text-white">Newest First</option>
                <option value="best_selling" className="bg-zinc-950 text-white">Best Selling</option>
                <option value="price_low" className="bg-zinc-950 text-white">Price: Low to High</option>
                <option value="price_high" className="bg-zinc-950 text-white">Price: High to Low</option>
              </select>
              <SlidersHorizontal className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-neon-purple transition-colors pointer-events-none" size={20} suppressHydrationWarning />
            </div>
          </div>
        </motion.div>


        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card aspect-[4/5] animate-pulse bg-white/5 border-white/10"></div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ willChange: 'transform, opacity' }}
                  className="group"
                >
                  <Link 
                href={`/marketplace/${project.id}`} 
                target="_blank"
                className="block h-full"
              >
                    <div className="glass-card-premium h-full flex flex-col overflow-hidden border-white/5 hover:border-neon-blue/30 transition-all duration-500 group-hover:neon-glow-blue/5 relative">
                      {/* Premium Badge */}
                      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="px-3 py-1 bg-neon-blue/20 backdrop-blur-md border border-neon-blue/30 rounded-full flex items-center gap-1.5">
                          <Sparkles size={10} className="text-neon-blue" suppressHydrationWarning />
                          <span className="text-[8px] font-black uppercase tracking-widest text-neon-blue">Premium</span>
                        </div>
                      </div>

                      {/* Thumbnail Container */}
                      <div className="aspect-[16/10] relative overflow-hidden">
                        <SafeImage 
                          src={project.thumbnail} 
                          alt={project.title}
                          fill
                          width={400}
                          height={250}
                          priority={i < 6}
                          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                        
                        <div className="absolute top-4 left-4 flex gap-2 z-20">
                          <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-white/80">
                            {project.category}
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg">
                            <Star size={12} className="text-neon-blue" fill="currentColor" suppressHydrationWarning />
                            <span className="text-[10px] font-black text-white">{project.rating}</span>
                          </div>
                          <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">{project.sales} Sales</div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-8 flex-1 flex flex-col relative">
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="text-2xl font-black tracking-tight group-hover:text-neon-blue transition-colors duration-500 line-clamp-1 group-hover:text-glow-blue">{project.title}</h3>
                          <div className="text-2xl font-black text-neon-purple drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] text-glow-purple">${project.price}</div>
                        </div>
                        
                        <p className="text-sm text-white/30 line-clamp-2 mb-8 flex-1 leading-relaxed group-hover:text-white/50 transition-colors duration-500">{project.description}</p>

                        <div className="flex flex-wrap gap-2 mb-8">
                          {project.techStack.slice(0, 3).map((tech: string) => (
                            <span key={tech} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black text-white/40 uppercase tracking-widest group-hover:border-white/10 transition-colors">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 overflow-hidden relative group-hover:border-neon-blue/30 transition-colors">
                              {(() => {
                                const sellerProfile = profiles.find(p => p.id === project.sellerId || p.username === project.authorUsername);
                                return (
                                  <SafeImage 
                                    src={sellerProfile?.avatarUrl || sellerProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.sellerId}`} 
                                    alt="Seller"
                                    fill
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                );
                              })()}
                            </div>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] group-hover:text-white/50 transition-colors">@{project.authorUsername}</span>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 group-hover:bg-neon-blue group-hover:text-black transition-all duration-500 group-hover:neon-glow-blue">
                            <ArrowRight size={18} suppressHydrationWarning />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 text-white/20">
              <Search size={40} suppressHydrationWarning />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Projects Found</h3>
            <p className="text-white/40 max-w-xs mx-auto">Try adjusting your search or filters to find what you&apos;re looking for.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All Assets'); }}
              className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-bold transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Marketplace() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-20 px-4 bg-dark-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin"></div>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
