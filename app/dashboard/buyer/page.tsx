"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Heart, Settings, User, 
  Download, Star, Clock, ArrowRight,
  ShieldCheck, Sparkles, CreditCard,
  LayoutDashboard, Search, Filter,
  ExternalLink, Trash2, Edit3, Camera
} from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';
import { SafeImage } from '@/components/SafeImage';
import { FileUpload } from '@/components/FileUpload';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockAuth, getStore, mockOrders, mockUsers } from '@/lib/store';

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'purchases' | 'wishlist' | 'settings'>('purchases');
  const [isMounted, setIsMounted] = useState(false);

  const [profileData, setProfileData] = useState({ fullName: '', avatarUrl: '' });

  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      try {
        const currentUser = await mockAuth.getCurrentUser();
        if (!currentUser) {
          router.push('/auth/signin');
          return;
        }
        setUser(currentUser.user);
        setProfile(currentUser.profile);
        setProfileData({ 
          fullName: currentUser.profile.fullName || currentUser.user.fullName || '', 
          avatarUrl: currentUser.profile.avatarUrl || currentUser.profile.avatar_url || ''
        });
        
        // Fetch buyer orders
        const allOrders = await mockOrders.getAll();
        const buyerOrders = allOrders.filter((o: any) => o.buyerId === currentUser.user.id);
        setOrders(buyerOrders);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await mockUsers.updateProfile(user.id, profileData);
      alert('Profile updated successfully!');
      // Update local state
      const updatedProfile = { ...profile, ...profileData };
      setProfile(updatedProfile);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (file: File | null, base64: string | null) => {
    setProfileData({ ...profileData, avatarUrl: base64 || '' });
  };

  const handleDeleteAccount = async () => {
    if (!confirm('CRITICAL: This will permanently delete your account and all your data. Are you absolutely sure?')) return;
    
    setLoading(true);
    try {
      // In mock mode, we just logout
      await mockAuth.logout();
      router.push('/');
    } catch (err) {
      console.error('Error deleting account:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen pt-32 bg-dark-bg" />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-black">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
            borderColor: ['#00f2ff', '#a855f7', '#00f2ff']
          }} 
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full shadow-[0_0_20px_rgba(0,242,255,0.3)]"
        />
      </div>
    );
  }

  const PurchasedCard = ({ project }: { project: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="glass-card-premium group relative overflow-hidden"
    >
      <div className="aspect-video relative overflow-hidden rounded-2xl mb-6">
        <SafeImage 
          src={project.thumbnail || `https://picsum.photos/seed/${project.id}/800/450`} 
          alt={project.title} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-neon-blue/20 backdrop-blur-md border border-neon-blue/30 rounded-full text-[10px] font-black text-neon-blue uppercase tracking-widest">
            Purchased
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xl font-black tracking-tight text-glow-blue group-hover:text-white transition-colors line-clamp-1">{project.title}</h3>
          <div className="flex items-center gap-1 text-neon-blue">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-bold">4.9</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-white/40 text-xs font-medium">
          <Clock size={14} />
          <span>Purchased on {new Date().toLocaleDateString()}</span>
        </div>

        <div className="pt-4 flex gap-3">
          <button className="flex-1 premium-button bg-neon-blue text-black neon-glow-blue py-3 flex items-center justify-center gap-2 text-[10px]">
            <Download size={16} /> DOWNLOAD ASSETS
          </button>
          <button className="w-12 h-12 glass-card flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all">
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div suppressHydrationWarning className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden bg-dark-bg">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-neon-blue/20 blur-[200px] rounded-full -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-emerald-900/20 blur-[200px] rounded-full -z-10 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/10 blur-[150px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-6 mb-6">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="w-16 h-16 rounded-3xl bg-gradient-to-br from-neon-blue via-emerald-500 to-neon-pink p-0.5 shadow-[0_0_40px_rgba(0,255,157,0.4)]"
              >
                <div className="w-full h-full rounded-3xl bg-dark-bg flex items-center justify-center text-neon-blue">
                  <LayoutDashboard size={32} suppressHydrationWarning />
                </div>
              </motion.div>
              <div>
                <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-gradient leading-none mb-2">Workspace</h1>
                <div className="flex items-center gap-3">
                  <span className="h-[1px] w-12 bg-neon-blue/50"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neon-blue/60">Client Dashboard</span>
                </div>
              </div>
            </div>
            <p className="text-white/40 text-sm sm:text-lg font-medium max-w-xl leading-relaxed">
              Manage your premium digital assets, curated wishlist, and account preferences in your high-performance workspace.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full lg:w-auto"
          >
            <Link href="/marketplace" className="premium-button bg-white/5 text-white border-white/10 hover:bg-white/10 w-full lg:w-auto flex items-center justify-center gap-4 px-10 py-5 group">
              <Search size={20} suppressHydrationWarning className="group-hover:text-neon-blue transition-colors" /> 
              <span className="uppercase tracking-[0.2em] text-xs font-black">Explore Marketplace</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform text-neon-blue" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="glass-card-premium p-8"
            >
              <div className="flex items-center gap-6 mb-12">
                <div className="relative">
                  <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink p-0.5 shadow-2xl">
                    <UserAvatar 
                      src={profile?.avatarUrl || profile?.avatar_url} 
                      name={user?.fullName || user?.username} 
                      size={80}
                      className="rounded-[2rem]" 
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-neon-blue rounded-full border-4 border-black flex items-center justify-center">
                    <ShieldCheck size={10} className="text-black" />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-xl font-black tracking-tight truncate text-glow-blue">{user?.fullName}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 truncate">@{user?.username}</div>
                </div>
              </div>

              <nav className="space-y-4">
                {[
                  { id: 'purchases', label: 'Purchases', icon: ShoppingBag, color: 'neon-blue' },
                  { id: 'wishlist', label: 'Wishlist', icon: Heart, color: 'neon-purple' },
                  { id: 'settings', label: 'Settings', icon: Settings, color: 'white' },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all relative group overflow-hidden ${
                      activeTab === tab.id 
                        ? tab.id === 'purchases' ? 'bg-neon-blue text-black neon-glow-blue' : tab.id === 'wishlist' ? 'bg-neon-purple text-white neon-glow-purple' : 'bg-white/10 text-white'
                        : 'text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon size={20} suppressHydrationWarning className={`transition-transform duration-500 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="relative z-10">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTabBuyer"
                        className="absolute inset-0 bg-white/10 pointer-events-none"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </nav>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="glass-card-premium p-8 bg-gradient-to-br from-neon-blue/10 to-transparent border-neon-blue/20 relative overflow-hidden group"
            >
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-neon-blue/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-neon-blue/20 flex items-center justify-center mb-6 text-neon-blue shadow-[0_0_20px_rgba(0,242,255,0.2)]">
                  <Sparkles size={24} suppressHydrationWarning />
                </div>
                <h4 className="text-sm font-black uppercase tracking-[0.3em] mb-4 text-neon-blue">
                  Pro Client
                </h4>
                <p className="text-xs text-white/40 mb-8 leading-relaxed font-medium">Unlock exclusive early access, premium support, and member-only discounts on all assets.</p>
                <button className="w-full py-4 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue transition-all">Upgrade Now</button>
              </div>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {activeTab === 'purchases' && (
                <motion.div
                  key="purchases"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-12"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8">
                    <div>
                      <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 text-gradient">My Purchases</h2>
                      <p className="text-white/40 text-sm font-medium flex items-center gap-2">
                        <ShieldCheck size={16} className="text-neon-blue" />
                        Access and download your acquired digital assets securely.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] hover:border-white/20 transition-all cursor-pointer group">
                      <Filter size={16} suppressHydrationWarning className="group-hover:text-neon-blue transition-colors" /> Filter: All Assets
                    </div>
                  </div>

                  {orders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {orders.map((order: any) => (
                        order.project && <PurchasedCard key={order.id} project={order.project} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-40 glass-card-premium border-dashed border-white/10 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <motion.div 
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-32 h-32 rounded-[2.5rem] bg-white/5 flex items-center justify-center mx-auto mb-10 text-white/10 group-hover:text-neon-blue group-hover:bg-neon-blue/5 transition-all duration-700 shadow-2xl"
                      >
                        <ShoppingBag size={56} suppressHydrationWarning />
                      </motion.div>
                      <h3 className="text-3xl font-black tracking-tight mb-4">No Purchases Yet</h3>
                      <p className="text-white/30 mb-12 max-w-sm mx-auto text-sm font-medium leading-relaxed">Your digital library is currently empty. Start building your high-end collection today.</p>
                      <Link href="/marketplace" className="premium-button bg-neon-blue text-black neon-glow-blue px-12 py-5 text-sm">
                        Explore Marketplace
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-12"
                >
                  <div>
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 text-gradient">My Wishlist</h2>
                    <p className="text-white/40 text-sm font-medium flex items-center gap-2">
                      <Heart size={16} className="text-neon-purple" />
                      Curate your favorite projects for future high-impact acquisition.
                    </p>
                  </div>
                  
                  <div className="text-center py-40 glass-card-premium border-dashed border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, -5, 5, 0]
                      }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-32 h-32 rounded-[2.5rem] bg-white/5 flex items-center justify-center mx-auto mb-10 text-white/10 group-hover:text-neon-purple group-hover:bg-neon-purple/5 transition-all duration-700 shadow-2xl"
                    >
                      <Heart size={56} suppressHydrationWarning />
                    </motion.div>
                    <h3 className="text-3xl font-black tracking-tight mb-4">Wishlist is Empty</h3>
                    <p className="text-white/30 mb-12 max-w-sm mx-auto text-sm font-medium leading-relaxed">Save the projects that inspire you to keep them within reach for your next big move.</p>
                    <Link href="/marketplace" className="premium-button bg-neon-purple text-white neon-glow-purple px-12 py-5 text-sm">
                      Find Favorites
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-12 sm:space-y-16"
                >
                  <div>
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 text-gradient text-glow-blue">Account Settings</h2>
                    <p className="text-white/40 text-sm font-medium flex items-center gap-2">
                      <Settings size={16} className="text-white/60" />
                      Manage your personal information and high-security preferences.
                    </p>
                  </div>
                  
                  <div className="glass-card-premium p-8 sm:p-12 space-y-16">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16">
                      <div className="relative group shrink-0">
                        <div className="w-48 h-48 rounded-[3rem] bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink p-0.5 shadow-2xl relative">
                          <div className="absolute inset-0 bg-white/20 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
                          <div className="w-full h-full rounded-[3rem] bg-black overflow-hidden relative z-10">
                            <FileUpload 
                              onFileSelect={handleAvatarChange}
                              value={profileData.avatarUrl}
                              previewClassName="w-full h-full"
                              className="w-full h-full"
                              label="Upload DP"
                            />
                            {!profileData.avatarUrl && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-8xl font-black text-white/20">{(profileData.fullName || user?.username || "?").charAt(0).toUpperCase()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-10 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">Display Name</label>
                            <div className="relative group">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-sm"></div>
                              <input 
                                type="text" 
                                value={profileData.fullName}
                                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                className="relative w-full glass-input"
                                placeholder="Your full name"
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 ml-2">Username</label>
                            <input 
                              type="text" 
                              defaultValue={user?.username}
                              disabled
                              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 px-8 text-sm font-black tracking-wide opacity-30 cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
                      <div className="flex items-center gap-4 text-white/30">
                        <ShieldCheck size={20} className="text-neon-blue" />
                        <span className="text-[10px] font-black uppercase tracking-widest">End-to-end encrypted profile data</span>
                      </div>
                      <button 
                        onClick={handleUpdateProfile}
                        className="w-full sm:w-auto px-16 py-5 bg-neon-blue text-black font-black uppercase tracking-[0.3em] rounded-2xl neon-glow-blue hover:scale-105 active:scale-95 transition-all text-xs"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>

                  <div className="glass-card-premium p-8 sm:p-12 border-red-500/20 bg-red-500/[0.02] relative overflow-hidden group">
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full group-hover:bg-red-500/10 transition-colors duration-1000"></div>
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative z-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                            <Trash2 size={24} suppressHydrationWarning />
                          </div>
                          <h3 className="text-3xl font-black text-red-400 tracking-tight">Danger Zone</h3>
                        </div>
                        <p className="text-sm text-white/30 max-w-lg font-medium leading-relaxed">Permanently delete your account and all associated data including purchases and wishlist. This action is irreversible and cannot be undone.</p>
                      </div>
                      <button 
                        onClick={handleDeleteAccount}
                        className="w-full lg:w-auto px-10 py-5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl text-red-400 font-black uppercase tracking-[0.2em] text-xs transition-all shrink-0 hover:scale-105 active:scale-95"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
