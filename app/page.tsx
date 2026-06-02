"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Zap, Shield, Sparkles, TrendingUp, User, Globe, Link as LinkIcon, Cpu, Code, Mail, Phone, Megaphone, X, Star, ShoppingBag, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import { mockAnnouncements, mockSaasPlatforms, mockProjects } from '@/lib/store';
import { SafeImage } from '@/components/SafeImage';

const SUBCATEGORIES = [
  { id: 'ai-models', name: 'AI Models & Chatbots', icon: Sparkles, description: 'Advanced AI models and chatbots.' },
  { id: 'saas-templates', name: 'SaaS Templates', icon: TrendingUp, description: 'Complete SaaS solutions.' },
  { id: 'ui-kits', name: 'UI/UX Kits', icon: LayoutGrid, description: 'Beautiful design systems.' },
  { id: 'web-apps', name: 'Web Applications', icon: Globe, description: 'Full-stack web applications.' },
  { id: 'mobile-apps', name: 'Mobile Apps', icon: List, description: 'Native mobile app templates.' },
  { id: 'ecommerce', name: 'E-commerce Solutions', icon: Shield, description: 'Digital storefronts and shops.' },
  { id: 'data-viz', name: 'Data Visualization', icon: TrendingUp, description: 'Complex data dashboards.' },
  { id: 'blockchain', name: 'Blockchain & Web3', icon: LinkIcon, description: 'Web3 and crypto components.' },
];

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [saasPlatforms, setSaasPlatforms] = useState<any[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      try {
        const [ann, saas, projects] = await Promise.all([
          mockAnnouncements.getAll(),
          mockSaasPlatforms.getAll(),
          mockProjects.getAll()
        ]);
        setAnnouncements(ann || []);
        setSaasPlatforms(saas || []);
        // Only show live or active projects, sorted by date
        const filtered = (projects || [])
          .filter((p: any) => p.status === 'live' || p.status === 'active')
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        setFeaturedProjects(filtered);
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };
    fetchData();
  }, []);

  const latestAnnouncement = announcements[announcements.length - 1];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Neuronix AI",
    "url": "https://neuronix-ai.run.app",
    "description": "Premium marketplace for high-quality website templates, UI kits, and SaaS dashboards.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://neuronix-ai.run.app/marketplace?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div suppressHydrationWarning className="pt-20 relative">
      {/* Global Background Elements */}
      {isMounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/20 blur-[120px] rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-emerald-900/20 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] bg-neon-pink/10 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: 'transform, opacity' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
            >
              {isMounted && <Sparkles size={16} suppressHydrationWarning className="text-neon-blue animate-pulse" />}
              <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-white/80">The Future of Web Marketplaces</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: 'transform, opacity' }}
              className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] px-2"
            >
              Neuronix <span className="text-gradient drop-shadow-[0_0_8px_rgba(0,255,157,0.6)]">AI Platform</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: 'transform, opacity' }}
              className="max-w-2xl mx-auto text-base sm:text-xl text-white/50 mb-12 leading-relaxed font-medium"
            >
              The ultimate ecosystem for high-quality website templates, AI SaaS platforms, and custom digital solutions. 
              Built by Neuronix AI for the next generation of web.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: 'transform, opacity' }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link href="/marketplace" className="premium-button w-full sm:w-auto bg-neon-blue text-black neon-glow-blue flex items-center justify-center gap-3 group">
                <span className="relative z-10">Explore Marketplace</span>
                {isMounted && <ArrowRight size={20} suppressHydrationWarning className="group-hover:translate-x-1 transition-transform relative z-10" />}
              </Link>
              <Link href="/categories" className="premium-button w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center gap-3">
                <span>View Categories</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {isMounted && (
        <section className="py-12 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Active Projects', value: '1,200+' },
                { label: 'Happy Clients', value: '50k+' },
                { label: 'Total Downloads', value: '250k+' },
                { label: 'Expert Authors', value: '150+' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects Section */}
      {isMounted && featuredProjects.length > 0 && (
        <section className="py-24 sm:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-16 sm:mb-24">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl sm:text-5xl font-black tracking-tighter mb-4"
                >
                  Featured <span className="text-neon-blue">Digital Assets</span>
                </motion.h2>
                <p className="text-white/40 text-sm sm:text-lg max-w-xl font-medium">Discover top-rated templates and UI kits handpicked from our global marketplace.</p>
              </div>
              <Link href="/marketplace" className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-bold text-sm">
                Browse Marketplace <ArrowRight size={18} suppressHydrationWarning className="group-hover:translate-x-1 transition-transform text-neon-blue" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              {featuredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative"
                >
                  <Link href={`/marketplace/${project.id}`} className="block">
                    <div className="aspect-[16/10] relative rounded-[2rem] overflow-hidden mb-6 border border-white/5 shadow-2xl">
                      <SafeImage 
                        src={project.thumbnail} 
                        alt={project.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-2xl text-[10px] font-black text-white border border-white/10 uppercase tracking-[0.2em]">
                        ${project.price}
                      </div>
                    </div>
                    
                    <div className="px-2">
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-neon-blue uppercase tracking-[0.2em] mb-2">
                        {project.category}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black mb-4 tracking-tight group-hover:text-neon-blue transition-colors truncate">{project.title}</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-[10px] sm:text-xs font-black text-white/20 uppercase tracking-widest">
                          <span className="flex items-center gap-2"><ShoppingBag size={14} suppressHydrationWarning /> {project.sales}</span>
                          <div className="flex items-center gap-1 text-neon-blue">
                            <Star size={14} fill="currentColor" suppressHydrationWarning />
                            {project.rating}
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-neon-blue group-hover:text-black group-hover:border-neon-blue transition-all">
                          <ArrowRight size={20} suppressHydrationWarning />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AI SaaS Platforms Section */}
      {isMounted && (
        <section className="py-24 sm:py-32 relative bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 sm:mb-24">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl font-black tracking-tighter mb-6"
              >
                AI <span className="text-neon-purple">SaaS Platforms</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-white/40 text-base sm:text-lg max-w-2xl mx-auto"
              >
                We don&apos;t just sell templates. Neuronix AI launches cutting-edge AI SaaS platforms 
                designed to solve real-world problems for our users.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {saasPlatforms.length > 0 ? (
                saasPlatforms.map((platform, i) => (
                  <motion.div
                    key={platform.id || i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-8 border-white/5 relative group"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Cpu size={28} className="text-neon-purple" />
                    </div>
                    <h3 className="text-xl font-black mb-3">{platform.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed mb-6">{platform.desc}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-neon-blue">
                      <span>Coming Soon</span>
                      <div className="w-1 h-1 rounded-full bg-neon-blue animate-ping"></div>
                    </div>
                  </motion.div>
                ))
              ) : (
                [
                  { title: 'Neuronix Vision', desc: 'Advanced AI image generation and editing platform.', icon: Sparkles, color: 'neon-blue' },
                  { title: 'Neuronix Code', desc: 'AI-powered code assistant for modern developers.', icon: Cpu, color: 'neon-purple' },
                  { title: 'Neuronix Analytics', desc: 'Predictive analytics and data visualization SaaS.', icon: TrendingUp, color: 'neon-pink' },
                ].map((platform, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-8 border-white/5 relative group"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-${platform.color}/10 border border-${platform.color}/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <platform.icon size={28} className={`text-${platform.color}`} />
                    </div>
                    <h3 className="text-xl font-black mb-3">{platform.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed mb-6">{platform.desc}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-neon-blue">
                      <span>Coming Soon</span>
                      <div className="w-1 h-1 rounded-full bg-neon-blue animate-ping"></div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Custom Services Section */}
      {isMounted && (
        <section className="py-24 sm:py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/5 blur-[150px] rounded-full -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card-premium p-12 sm:p-20 border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-blue/10 border border-neon-blue/20 mb-8"
                  >
                    <Code size={16} className="text-neon-blue" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-neon-blue">Custom Solutions</span>
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl sm:text-6xl font-black tracking-tighter mb-8 leading-tight"
                  >
                    Need a <span className="text-gradient">Custom Website?</span>
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-white/50 text-lg mb-12 leading-relaxed"
                  >
                    Neuronix AI specializes in building high-performance, custom-tailored digital experiences. 
                    From complex enterprise SaaS to unique creative portfolios, we bring your vision to life.
                  </motion.p>
                  
                  <div className="space-y-6">
                    <motion.a 
                      href="mailto:neuronixaicareers@gmail.com"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neon-blue/20 group-hover:border-neon-blue/30 transition-all">
                        <Mail size={20} className="text-white/40 group-hover:text-neon-blue transition-colors" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Email Us</p>
                        <p className="text-sm font-bold group-hover:text-neon-blue transition-colors">neuronixaicareers@gmail.com</p>
                      </div>
                    </motion.a>
                    
                    <motion.a 
                      href="tel:+923052332590"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neon-purple/20 group-hover:border-neon-purple/30 transition-all">
                        <Phone size={20} className="text-white/40 group-hover:text-neon-purple transition-colors" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Call Us</p>
                        <p className="text-sm font-bold group-hover:text-neon-purple transition-colors">+92 3052332590</p>
                      </div>
                    </motion.a>
                  </div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  style={{ willChange: 'transform, opacity' }}
                  className="relative"
                >
                  <div className="aspect-square rounded-3xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-white/10 flex items-center justify-center overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/code/400/400')] bg-cover bg-center opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="relative z-10 text-center p-8">
                      <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mx-auto mb-6">
                        <Cpu size={40} className="text-neon-blue animate-pulse" />
                      </div>
                      <h4 className="text-2xl font-black mb-2">Start Your Project</h4>
                      <p className="text-sm text-white/40">Get a quote for your custom digital solution today.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      {isMounted && (
        <section className="py-24 sm:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 sm:mb-24">
              <div className="max-w-2xl">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl sm:text-5xl font-black tracking-tighter mb-6"
                >
                  Browse by <span className="text-neon-blue">Category</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-white/40 text-base sm:text-lg leading-relaxed"
                >
                  Explore our wide range of specialized website categories designed for every business need. 
                  From high-performance SaaS dashboards to elegant landing pages.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Link href="/categories" className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-bold text-sm">
                  View All Categories <ArrowRight size={18} suppressHydrationWarning className="group-hover:translate-x-1 transition-transform text-neon-blue" />
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SUBCATEGORIES.slice(0, 8).map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    style={{ willChange: 'transform, opacity' }}
                    className="glass-card p-8 group cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:bg-neon-blue/10 transition-colors"></div>
                    
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-neon-blue/10 transition-all duration-500 border border-white/5 group-hover:border-neon-blue/20">
                      <Icon size={24} suppressHydrationWarning className="text-white/50 group-hover:text-neon-blue transition-colors duration-500" />
                    </div>
                    
                    <h3 className="font-black text-lg mb-3 group-hover:text-neon-blue transition-colors duration-500">{category.name}</h3>
                    <p className="text-sm text-white/30 leading-relaxed group-hover:text-white/50 transition-colors duration-500">{category.description}</p>
                    
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neon-blue">Explore Now</span>
                      <ArrowRight size={16} suppressHydrationWarning className="text-neon-blue" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
