"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, ShoppingBag, Globe, Shield, Zap, 
  CheckCircle2, ArrowRight, Download, Share2, 
  Heart, MessageSquare, Info, Loader2, ChevronRight, 
  ChevronLeft, Play, Maximize2
} from 'lucide-react';
import Link from 'next/link';
import { SafeImage } from '@/components/SafeImage';
import { mockProjects, getStore } from '@/lib/store';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const found = await mockProjects.getById(id as string);
        if (!found) {
          router.push('/marketplace');
          return;
        }
        setProject(found);
        
        // Fetch seller profile
        const store = getStore();
        const profile = store.profiles.find((p: any) => p.userId === found.sellerId || p.username === found.authorUsername);
        if (profile) {
          setSellerProfile(profile);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-neon-blue" size={48} />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const screenshots = [
    project.thumbnail || `https://picsum.photos/seed/${project.id}/1200/800`,
    `https://picsum.photos/seed/${project.id}-1/1200/800`,
    `https://picsum.photos/seed/${project.id}-2/1200/800`,
    `https://picsum.photos/seed/${project.id}-3/1200/800`,
    `https://picsum.photos/seed/${project.id}-4/1200/800`,
  ];

  return (
    <div suppressHydrationWarning className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 relative overflow-hidden bg-black">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-neon-purple/5 blur-[80px] sm:blur-[150px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-neon-blue/5 blur-[80px] sm:blur-[150px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-10 sm:mb-16"
        >
          <Link href="/marketplace" className="hover:text-neon-blue transition-colors">Marketplace</Link>
          <ChevronRight size={12} suppressHydrationWarning />
          <Link href={`/marketplace?category=${encodeURIComponent(project.category)}`} className="hover:text-neon-blue transition-colors">{project.category}</Link>
          <ChevronRight size={12} suppressHydrationWarning />
          <span className="text-white/40">{project.title}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column: Media & Description */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-16">
            {/* Main Image Viewer */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="relative aspect-[16/10] rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-white/[0.02] border border-white/10 group shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full relative"
                  >
                    <SafeImage
                      src={screenshots[activeImage]}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-between px-6 sm:px-10">
                  <button 
                    onClick={() => setActiveImage((activeImage - 1 + screenshots.length) % screenshots.length)}
                    className="p-4 sm:p-5 bg-black/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 text-white hover:bg-neon-blue hover:text-black hover:scale-110 transition-all duration-500"
                  >
                    <ChevronLeft size={24} suppressHydrationWarning />
                  </button>
                  <button 
                    onClick={() => setActiveImage((activeImage + 1) % screenshots.length)}
                    className="p-4 sm:p-5 bg-black/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 text-white hover:bg-neon-blue hover:text-black hover:scale-110 transition-all duration-500"
                  >
                    <ChevronRight size={24} suppressHydrationWarning />
                  </button>
                </div>

                <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 flex gap-3">
                  <button className="p-3 sm:p-4 bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 text-white hover:bg-white/20 transition-all">
                    <Maximize2 size={20} suppressHydrationWarning />
                  </button>
                  <button className="p-3 sm:p-4 bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 text-white hover:bg-white/20 transition-all">
                    <Play size={20} suppressHydrationWarning />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide px-2">
                {screenshots.map((img, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-24 sm:w-32 aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === i ? 'border-neon-blue shadow-[0_0_20px_rgba(0,245,255,0.3)]' : 'border-transparent opacity-40 hover:opacity-100'
                    }`}
                  >
                    <SafeImage src={img} alt="" fill className="object-cover" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Description & Features */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 sm:p-16 space-y-12 sm:space-y-20 border-white/5"
            >
              <div className="space-y-6 sm:space-y-10">
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center">
                    <Info className="text-neon-blue" size={24} suppressHydrationWarning />
                  </div>
                  Project Overview
                </h2>
                <p className="text-white/50 leading-relaxed text-lg sm:text-2xl font-medium">
                  {project.description}
                </p>
              </div>

              <div className="space-y-6 sm:space-y-10">
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 flex items-center justify-center">
                    <Zap className="text-neon-purple" size={24} suppressHydrationWarning />
                  </div>
                  Key Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {project.features?.map((feature: string, i: number) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-5 sm:p-6 bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/5 hover:border-white/10 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="text-emerald-400" size={20} suppressHydrationWarning />
                      </div>
                      <span className="text-sm sm:text-base font-black text-white/60 tracking-tight">{feature}</span>
                    </motion.div>
                  )) || (
                    <div className="col-span-2 text-white/20 text-sm italic py-4">No features listed for this project.</div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Purchase & Info */}
          <div className="lg:col-span-4 space-y-8 sm:space-y-12">
            {/* Purchase Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 sm:p-12 lg:sticky lg:top-28 border-white/5 shadow-2xl"
            >
              <div className="space-y-8 sm:space-y-10 mb-10 sm:mb-16">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                      {project.category}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tighter leading-[0.9] text-gradient drop-shadow-[0_0_30px_rgba(0,245,255,0.2)]">{project.title}</h1>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-neon-blue">
                      <Star size={18} fill="currentColor" suppressHydrationWarning className="drop-shadow-[0_0_10px_rgba(0,245,255,0.5)]" />
                      <span className="text-xl font-black">4.9</span>
                    </div>
                    <div className="h-4 w-px bg-white/10"></div>
                    <div className="text-[10px] sm:text-xs font-black text-white/20 uppercase tracking-[0.2em]">128 Successful Sales</div>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-4">
                  <div className="text-5xl sm:text-7xl font-black text-neon-purple drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">${project.price}</div>
                  <div className="text-xs font-bold text-white/20 uppercase tracking-widest line-through">${Math.round(project.price * 1.5)}</div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6 mb-10 sm:mb-16">
                <button className="w-full py-5 sm:py-6 bg-neon-blue text-black font-black uppercase tracking-[0.2em] rounded-2xl sm:rounded-[1.5rem] neon-glow-blue hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm sm:text-base group">
                  <ShoppingBag size={20} suppressHydrationWarning />
                  Secure Purchase
                  <ArrowRight size={20} suppressHydrationWarning className="group-hover:translate-x-2 transition-transform" />
                </button>
                <a 
                  href={project.previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-5 sm:py-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-[0.2em] rounded-2xl sm:rounded-[1.5rem] transition-all flex items-center justify-center gap-3 text-xs sm:text-sm group"
                >
                  <Globe size={20} suppressHydrationWarning className="group-hover:rotate-12 transition-transform" />
                  Live Preview
                </a>
              </div>

              <div className="flex items-center justify-between gap-6 pt-8 sm:pt-12 border-t border-white/5">
                <div className="flex gap-8">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex flex-col items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isLiked ? 'text-red-500' : 'text-white/20 hover:text-white'}`}
                  >
                    <Heart size={20} suppressHydrationWarning className={isLiked ? 'fill-red-500' : ''} />
                    {isLiked ? 'Liked' : 'Like'}
                  </button>
                  <button className="flex flex-col items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all">
                    <Share2 size={20} suppressHydrationWarning />
                    Share
                  </button>
                </div>
                <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/20 hover:text-white transition-all group">
                  <MessageSquare size={20} suppressHydrationWarning className="group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Seller Info */}
              <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple p-0.5 shrink-0 group-hover:rotate-6 transition-transform">
                    <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center overflow-hidden relative">
                      <SafeImage 
                        src={sellerProfile?.avatarUrl || sellerProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.sellerId}`} 
                        alt="" 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-black tracking-tight">@{sellerProfile?.username || 'seller'}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Shield size={12} className="text-emerald-400" suppressHydrationWarning />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Verified Expert</span>
                    </div>
                  </div>
                </div>
                <Link href={`/seller/${project.sellerId}`} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-center block">
                  View Full Profile
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
