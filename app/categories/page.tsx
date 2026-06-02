"use client";

import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, Zap, Shield, Sparkles, TrendingUp, User, 
  Link as LinkIcon, ArrowRight, LayoutGrid, List, Search
} from 'lucide-react';
import Link from 'next/link';

const SUBCATEGORIES = [
  { id: 'ai-models', name: 'AI Models & Chatbots', icon: Sparkles, description: 'Advanced AI models, chatbots, and neural architectures.', count: 150 },
  { id: 'saas-templates', name: 'SaaS Templates', icon: TrendingUp, description: 'Complete SaaS solutions and multi-tenant applications.', count: 310 },
  { id: 'ui-kits', name: 'UI/UX Kits', icon: LayoutGrid, description: 'Beautiful design systems and component libraries.', count: 520 },
  { id: 'web-apps', name: 'Web Applications', icon: Globe, description: 'Full-stack web applications and digital tools.', count: 640 },
  { id: 'mobile-apps', name: 'Mobile Apps', icon: List, description: 'Native and cross-platform mobile app templates.', count: 280 },
  { id: 'ecommerce', name: 'E-commerce Solutions', icon: Shield, description: 'Ready-to-use digital storefronts and shop flows.', count: 420 },
  { id: 'data-viz', name: 'Data Visualization', icon: TrendingUp, description: 'Complex charts, graphs, and data dashboards.', count: 190 },
  { id: 'blockchain', name: 'Blockchain & Web3', icon: LinkIcon, description: 'Web3, crypto, and blockchain based components.', count: 85 },
  { id: 'automation', name: 'Automation Tools', icon: Zap, description: 'Workflow automation and efficiency scripts.', count: 210 },
  { id: 'api', name: 'API Integrations', icon: Sparkles, description: 'Powerful API wrappers and integration tools.', count: 460 },
  { id: 'plugins', name: 'Plugins, Scripts & Add-ons', icon: Zap, description: 'Extend functionality with custom scripts and plugins.', count: 940 },
  { id: 'full-sites', name: 'Full Websites & Multi-Page Sites', icon: Globe, description: 'Complete multi-page website solutions.', count: 310 },
  { id: 'other', name: 'Other / Niche Templates', icon: Search, description: 'Specialized templates for unique industries.', count: 120 },
];

export default function Categories() {
  const [isMounted, setIsMounted] = React.useState(false);
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 bg-dark-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16 sm:mb-24">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-8xl font-black tracking-tighter mb-6 text-gradient drop-shadow-[0_0_30px_rgba(0,255,157,0.2)]"
        >
          Browse Categories
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/40 max-w-2xl mx-auto text-base sm:text-xl px-4 leading-relaxed font-medium"
        >
          Explore our curated collection of digital assets across specialized categories.
        </motion.p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
        {SUBCATEGORIES.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ willChange: 'transform, opacity' }}
              className="glass-card p-8 sm:p-10 group cursor-pointer hover:border-neon-blue/30 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-blue/5 blur-[80px] rounded-full group-hover:bg-neon-blue/10 transition-colors duration-700"></div>
              
              <div className="flex justify-between items-start mb-8 sm:mb-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neon-blue/10 group-hover:border-neon-blue/30 transition-all duration-700 shrink-0">
                  <Icon size={32} suppressHydrationWarning className="text-white/40 group-hover:text-neon-blue transition-colors duration-700" />
                </div>
                <div className="text-[10px] sm:text-xs font-black text-white/20 group-hover:text-neon-blue transition-colors duration-700 uppercase tracking-[0.2em]">
                  {category.count} Assets
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black mb-4 group-hover:text-neon-blue transition-colors duration-700 leading-tight tracking-tight">{category.name}</h3>
              <p className="text-sm sm:text-base text-white/30 leading-relaxed mb-8 sm:mb-12 group-hover:text-white/50 transition-colors duration-700 font-medium">{category.description}</p>
              
              <Link 
                href={`/marketplace?category=${encodeURIComponent(category.name)}`}
                className="inline-flex items-center gap-3 text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-neon-blue transition-all duration-500"
              >
                Explore Category <ArrowRight size={18} suppressHydrationWarning className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Featured Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mt-24 sm:mt-40 p-8 sm:p-16 md:p-24 rounded-[2.5rem] sm:rounded-[4rem] bg-gradient-to-br from-neon-blue/10 via-neon-purple/5 to-transparent border border-white/5 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(0,245,255,0.15),transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_100%,rgba(168,85,247,0.1),transparent_70%)]"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-20">
          <div className="max-w-2xl text-center lg:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 sm:mb-10 leading-[0.9]"
            >
              Can&apos;t find <br className="hidden sm:block" />
              <span className="text-neon-blue">what you need?</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-white/50 text-base sm:text-xl mb-10 sm:mb-14 leading-relaxed font-medium"
            >
              Our marketplace is constantly growing. If you have a specific request or need a custom solution, 
              our network of expert developers is here to help you build the future.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start"
            >
              <button className="premium-button bg-neon-blue text-black neon-glow-blue">
                Request Custom Project
              </button>
              <button className="premium-button bg-white/5 hover:bg-white/10 border border-white/10 text-white">
                Contact Support
              </button>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full sm:w-auto max-w-[320px] sm:max-w-none mx-auto lg:max-w-none">
            {[LayoutGrid, List, Search, Zap].map((Icon, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="aspect-square w-full sm:w-32 h-auto sm:h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-neon-blue hover:border-neon-blue/30 transition-all duration-500 shadow-xl backdrop-blur-md"
              >
                <Icon size={32} suppressHydrationWarning />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
