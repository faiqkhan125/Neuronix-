"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Search, Filter, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { Navbar, Footer } from '@/components/Layout';
import { SafeImage } from '@/components/SafeImage';
import Link from 'next/link';
import { getStore, saveStore } from '@/lib/store';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { currentUser, projects } = getStore();
      if (currentUser && currentUser.profile && currentUser.profile.wishlist) {
        const wishlistProjects = projects.filter((p: any) => currentUser.profile.wishlist.includes(p.id));
        setWishlist(wishlistProjects);
      } else {
        setWishlist([]);
      }
    } catch (err) {
      console.error('Fetch wishlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (projectId: string) => {
    setRemoving(projectId);
    try {
      const { currentUser, profiles } = getStore();
      if (currentUser && currentUser.profile) {
        const newWishlist = currentUser.profile.wishlist.filter((id: string) => id !== projectId);
        currentUser.profile.wishlist = newWishlist;
        
        const newProfiles = profiles.map((p: any) => p.userId === currentUser.user.id ? currentUser.profile : p);
        
        saveStore({ profiles: newProfiles, currentUser });
        setWishlist(prev => prev.filter(p => p.id !== projectId));
      }
    } catch (err) {
      console.error('Remove from wishlist error:', err);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter mb-2">MY WISHLIST</h1>
            <p className="text-sm sm:text-base text-white/40">Saved projects you&apos;re interested in.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] sm:text-sm font-bold text-white/20 uppercase tracking-widest">{wishlist.length} ITEMS</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-40 gap-4">
            <Loader2 className="animate-spin text-neon-blue" size={48} />
            <p className="text-xs sm:text-sm text-white/40 font-bold animate-pulse">SYNCING NEURAL DATA...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-40 text-center glass-card border-white/5 px-6">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Heart size={48} className="text-white/10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tighter mb-2">YOUR WISHLIST IS EMPTY</h2>
            <p className="text-sm sm:text-base text-white/40 max-w-md mb-8">
              Explore the marketplace and save projects you love to see them here.
            </p>
            <Link 
              href="/marketplace" 
              className="w-full sm:w-auto px-8 py-4 bg-neon-blue text-black font-black rounded-xl neon-glow-blue hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              BROWSE MARKETPLACE <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {wishlist.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="group glass-card border-white/5 overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <SafeImage 
                      src={project.thumbnail} 
                      alt={project.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => removeFromWishlist(project.id)}
                        disabled={removing === project.id}
                        className="p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        {removing === project.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue text-[10px] font-black uppercase tracking-widest rounded border border-neon-blue/30 backdrop-blur-md">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex-grow flex flex-col">
                    <Link href={`/marketplace/${project.id}`}>
                      <h3 className="text-lg sm:text-xl font-black tracking-tighter group-hover:text-neon-blue transition-colors mb-2 line-clamp-1">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-white/40 line-clamp-2 mb-6 flex-grow">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-5 sm:pt-6 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Price</span>
                        <span className="text-lg sm:text-xl font-black text-neon-blue">${project.price}</span>
                      </div>
                      <Link 
                        href={`/marketplace/${project.id}`}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-black text-[10px] sm:text-xs font-black rounded-lg hover:bg-neon-blue hover:scale-105 transition-all flex items-center gap-2"
                      >
                        VIEW PROJECT <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
