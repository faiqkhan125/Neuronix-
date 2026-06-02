"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Plus, Settings, User, 
  DollarSign, Star, Clock, ArrowRight,
  ShieldCheck, Sparkles, CreditCard,
  LayoutDashboard, Search, Filter, ShoppingBag,
  ExternalLink, Trash2, Edit3, Camera,
  Globe, Wallet, Landmark, Smartphone,
  CheckCircle2, XCircle, MoreVertical,
  PlusCircle, Save, Trash, AlertCircle
} from 'lucide-react';
import { SafeImage } from '@/components/SafeImage';
import { UserAvatar } from '@/components/UserAvatar';
import { FileUpload } from '@/components/FileUpload';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockAuth, getStore, mockProjects, mockOrders, mockUsers } from '@/lib/store';

export default function FreelancerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'payments' | 'settings'>('projects');
  const [isMounted, setIsMounted] = useState(false);
  
  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    type: 'paypal' as any,
    label: '',
    value: '',
  });

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
        if (currentUser.user.role !== 'seller' && currentUser.user.role !== 'admin') {
          router.push('/dashboard/buyer');
          return;
        }
        setUser(currentUser.user);
        setProfile(currentUser.profile);
        setProfileData({ 
          fullName: currentUser.profile.fullName || currentUser.user.fullName || '', 
          avatarUrl: currentUser.profile.avatarUrl || currentUser.profile.avatar_url || ''
        });
        
        const allProjects = await mockProjects.getAll();
        const userProjects = allProjects.filter((p: any) => p.authorUsername === currentUser.user.username);
        setProjects(userProjects);
        setPaymentMethods(currentUser.profile.paymentMethods || []);

        // Fetch seller orders
        const allOrders = await mockOrders.getAll();
        const sellerOrders = allOrders.filter((o: any) => o.sellerId === currentUser.user.id);
        setOrders(sellerOrders);
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
    if (!confirm('CRITICAL: This will permanently delete your account and all your projects. Are you absolutely sure?')) return;
    
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

  const handleAddPayment = async () => {
    if (!newPayment.label || !newPayment.value) return;
    
    const updatedMethods = [
      ...paymentMethods,
      { id: 'pm-' + Date.now(), ...newPayment, isDefault: paymentMethods.length === 0 }
    ];
    
    try {
      await mockUsers.updateProfile(user.id, { paymentMethods: updatedMethods });
      setPaymentMethods(updatedMethods);
      setIsAddingPayment(false);
      setNewPayment({ type: 'paypal', label: '', value: '' });
      // Update local state
      const updatedProfile = { ...profile, paymentMethods: updatedMethods };
      setProfile(updatedProfile);
    } catch (err) {
      console.error('Error adding payment method:', err);
    }
  };

  const handleDeletePayment = async (id: string) => {
    const updatedMethods = paymentMethods.filter(pm => pm.id !== id);
    try {
      await mockUsers.updateProfile(user.id, { paymentMethods: updatedMethods });
      setPaymentMethods(updatedMethods);
      // Update local state
      const updatedProfile = { ...profile, paymentMethods: updatedMethods };
      setProfile(updatedProfile);
    } catch (err) {
      console.error('Error deleting payment method:', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    
    try {
      await mockProjects.delete(id, user.id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const [submittingProof, setSubmittingProof] = useState<string | null>(null);
  const [proofData, setProofData] = useState({ transactionId: '', screenshotUrl: '' });

  const handleSubmitProof = async (projectId: string) => {
    setLoading(true);
    try {
      // In mock mode, we just update the project status locally
      await mockProjects.update(projectId, { 
        status: 'pending_approval',
        paymentProof: { ...proofData, submittedAt: new Date().toISOString() }
      });
      setSubmittingProof(null);
      setProofData({ transactionId: '', screenshotUrl: '' });
      // Refresh data
      const allProjects = await mockProjects.getAll();
      const userProjects = allProjects.filter((p: any) => p.authorUsername === user.username);
      setProjects(userProjects);
    } catch (err) {
      console.error('Error submitting proof:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen pt-24 bg-dark-bg" />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-dark-bg">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden bg-dark-bg">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/20 blur-[150px] rounded-full -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-blue/20 blur-[150px] rounded-full -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-12 sm:mb-20"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center text-neon-purple shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <Briefcase size={28} suppressHydrationWarning />
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-gradient drop-shadow-[0_0_30px_rgba(168,85,247,0.2)]">Freelancer Dashboard</h1>
            </div>
            <p className="text-white/40 text-sm sm:text-lg font-medium max-w-xl">Manage your premium digital assets, track real-time sales, and configure your global payouts.</p>
          </div>

          <div className="w-full sm:w-auto">
            <Link href="/seller/upload" className="premium-button bg-neon-purple text-white neon-glow-purple w-full sm:w-auto">
              <Plus size={20} suppressHydrationWarning /> Upload New Project
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Sidebar Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-1 space-y-6 sm:space-y-10"
          >
            <div className="glass-card p-6 sm:p-8 border-white/5">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple p-0.5 shrink-0 shadow-lg">
                  <UserAvatar 
                    src={profile?.avatarUrl || profile?.avatar_url} 
                    name={user?.fullName || user?.username} 
                    size={64}
                    className="rounded-2xl" 
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-black tracking-tight truncate">{user?.fullName}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 truncate">@{user?.username}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setActiveTab('projects')}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs sm:text-sm transition-all uppercase tracking-[0.1em] ${activeTab === 'projects' ? 'bg-neon-purple text-white neon-glow-purple' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
                >
                  <Briefcase size={20} suppressHydrationWarning /> My Projects
                </button>
                <button 
                  onClick={() => setActiveTab('payments')}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs sm:text-sm transition-all uppercase tracking-[0.1em] ${activeTab === 'payments' ? 'bg-neon-blue text-black neon-glow-blue' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
                >
                  <CreditCard size={20} suppressHydrationWarning /> Payouts
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs sm:text-sm transition-all uppercase tracking-[0.1em] ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
                >
                  <Settings size={20} suppressHydrationWarning /> Settings
                </button>
              </div>
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card p-8 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-500/20 relative overflow-hidden group"
            >
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-colors"></div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-3 text-white/40">
                <DollarSign size={18} className="text-emerald-400" suppressHydrationWarning /> Total Earnings
              </h4>
              <div className="text-4xl font-black text-white mb-2 tracking-tighter">$1,284.50</div>
              <p className="text-[10px] text-emerald-400/60 uppercase tracking-[0.2em] font-black">Available for payout</p>
              <button className="w-full mt-8 py-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-2xl text-xs font-black uppercase tracking-widest text-emerald-400 transition-all">Withdraw Now</button>
            </motion.div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {activeTab === 'projects' && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8 sm:space-y-12"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">My Projects</h2>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 text-[10px] sm:text-xs font-black text-white/20 uppercase tracking-[0.3em]">
                        <Filter size={16} suppressHydrationWarning /> Sort: Newest First
                      </div>
                    </div>
                  </div>

                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                      {projects.map((project, idx) => (
                          <motion.div 
                            key={project.id} 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -10 }}
                            className="glass-card-premium p-8 group relative overflow-hidden border-white/5 hover:border-neon-purple/30 transition-all duration-700"
                          >
                            <div className="aspect-[16/10] relative rounded-3xl overflow-hidden mb-8 shadow-2xl">
                              <SafeImage 
                                src={project.thumbnail} 
                                alt={project.title} 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                              <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-2xl rounded-2xl text-[10px] font-black text-white border border-white/10 uppercase tracking-[0.3em] shadow-xl">
                                {project.category}
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-start mb-8 gap-8">
                              <div className="min-w-0">
                                <h3 className="text-2xl font-black tracking-tight group-hover:text-neon-purple transition-colors truncate text-glow-purple">{project.title}</h3>
                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                  <span className={`text-[9px] px-3 py-1.5 rounded-xl font-black uppercase tracking-[0.2em] shadow-lg ${
                                    project.status === 'live' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    project.status === 'pending_payment' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                    project.status === 'pending_approval' ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' :
                                    'bg-red-500/20 text-red-400 border border-red-500/30'
                                  }`}>
                                    {project.status.replace('_', ' ')}
                                  </span>
                                  <div className="flex items-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><ShoppingBag size={12} /> {project.sales} Sales</span>
                                    <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                    <div className="flex items-center gap-1.5 text-neon-blue">
                                      <Star size={12} fill="currentColor" suppressHydrationWarning />
                                      {project.rating}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-3xl font-black text-neon-purple shrink-0 text-glow-purple">${project.price}</div>
                            </div>

                          {project.status === 'pending_payment' && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mb-6 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-6"
                            >
                              <div className="flex items-center gap-3 text-amber-400 text-xs font-black uppercase tracking-widest">
                                <AlertCircle size={18} suppressHydrationWarning /> Action Required: Payment ($1.00)
                              </div>
                              <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                                To list your project, please pay the $1.00 listing fee to JazzCash: <span className="text-white font-black">+92 305 2332590</span>. 
                                Upload your transaction proof below.
                              </p>
                              
                              {submittingProof === project.id ? (
                                <div className="space-y-4">
                                  <input 
                                    type="text" 
                                    placeholder="Transaction ID"
                                    value={proofData.transactionId}
                                    onChange={(e) => setProofData({ ...proofData, transactionId: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-xs font-medium focus:border-neon-blue outline-none transition-all"
                                  />
                                  <FileUpload 
                                    onFileSelect={(file, base64) => setProofData({ ...proofData, screenshotUrl: base64 || '' })}
                                    value={proofData.screenshotUrl}
                                    label="Listing Fee Screenshot"
                                    previewClassName="aspect-video"
                                  />
                                  <div className="flex gap-3">
                                    <button 
                                      onClick={() => handleSubmitProof(project.id)}
                                      className="flex-1 py-3 bg-neon-blue text-black text-xs font-black uppercase tracking-widest rounded-xl neon-glow-blue"
                                    >
                                      Submit Proof
                                    </button>
                                    <button 
                                      onClick={() => setSubmittingProof(null)}
                                      className="px-5 py-3 bg-white/5 text-white/40 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setSubmittingProof(project.id)}
                                  className="w-full py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-amber-500/30"
                                >
                                  Upload Payment Proof
                                </button>
                              )}
                            </motion.div>
                          )}
                          <div className="flex gap-3">
                            <Link 
                              href={`/seller/upload?id=${project.id}`}
                              className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                            >
                              <Edit3 size={16} suppressHydrationWarning /> Edit Project
                            </Link>
                            <button 
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl text-white/20 hover:text-red-400 transition-all"
                            >
                              <Trash2 size={18} suppressHydrationWarning />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-32 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
                      <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-8 text-white/10">
                        <Briefcase size={48} suppressHydrationWarning />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight mb-4">No Projects Found</h3>
                      <p className="text-white/30 mb-12 max-w-xs mx-auto text-base font-medium">You haven&apos;t uploaded any digital assets yet. Start your journey as a creator today!</p>
                      <Link href="/seller/upload" className="premium-button bg-neon-purple text-white neon-glow-purple">
                        Upload Your First Project
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-10 sm:space-y-16"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-gradient">Payout Methods</h2>
                      <p className="text-white/40 text-sm font-medium">Manage how you receive your global earnings.</p>
                    </div>
                    <button 
                      onClick={() => setIsAddingPayment(!isAddingPayment)}
                      className="premium-button bg-neon-blue text-black neon-glow-blue w-full sm:w-auto"
                    >
                      <PlusCircle size={20} suppressHydrationWarning /> {isAddingPayment ? 'Close Form' : 'Add New Method'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isAddingPayment && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="glass-card p-8 sm:p-12 border-neon-blue/20 bg-neon-blue/[0.02]">
                          <h3 className="text-xl font-black tracking-tight mb-10 uppercase tracking-[0.1em]">Configure New Payout</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Payment Provider</label>
                              <select 
                                value={newPayment.type}
                                onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value as any })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:border-neon-blue outline-none transition-all appearance-none cursor-pointer"
                              >
                                <option value="jazzcash" className="bg-black">JazzCash</option>
                                <option value="easypaisa" className="bg-black">EasyPaisa</option>
                                <option value="paypal" className="bg-black">PayPal</option>
                                <option value="stripe" className="bg-black">Stripe</option>
                                <option value="crypto" className="bg-black">Crypto (USDT/BTC)</option>
                                <option value="bank" className="bg-black">Bank Transfer</option>
                              </select>
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Label (e.g. Primary)</label>
                              <input 
                                type="text" 
                                placeholder="My PayPal"
                                value={newPayment.label}
                                onChange={(e) => setNewPayment({ ...newPayment, label: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:border-neon-blue outline-none transition-all"
                              />
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Identifier (ID/Link)</label>
                              <input 
                                type="text" 
                                placeholder="email@example.com"
                                value={newPayment.value}
                                onChange={(e) => setNewPayment({ ...newPayment, value: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:border-neon-blue outline-none transition-all"
                              />
                            </div>
                          </div>
                          <div className="mt-12 flex justify-end gap-4">
                            <button 
                              onClick={() => setIsAddingPayment(false)}
                              className="px-8 py-4 text-white/40 hover:text-white font-black uppercase tracking-widest text-xs transition-all"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={handleAddPayment}
                              className="px-10 py-4 bg-neon-blue text-black font-black uppercase tracking-widest rounded-2xl neon-glow-blue hover:scale-105 transition-all"
                            >
                              Save Payout Method
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {paymentMethods.length > 0 ? (
                      paymentMethods.map((method, idx) => (
                          <motion.div 
                            key={method.id} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -5 }}
                            className="glass-card-premium p-10 border-white/5 hover:border-neon-blue/30 transition-all group relative overflow-hidden"
                          >
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-neon-blue/5 blur-3xl rounded-full group-hover:bg-neon-blue/10 transition-colors duration-700"></div>
                            <div className="flex justify-between items-start mb-10">
                              <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center text-neon-blue shadow-2xl group-hover:border-neon-blue/30 transition-colors">
                                {method.type === 'paypal' && <Globe size={32} suppressHydrationWarning />}
                                {method.type === 'jazzcash' && <Smartphone size={32} suppressHydrationWarning />}
                                {method.type === 'easypaisa' && <Smartphone size={32} suppressHydrationWarning />}
                                {method.type === 'stripe' && <ExternalLink size={32} suppressHydrationWarning />}
                                {method.type === 'crypto' && <Wallet size={32} suppressHydrationWarning />}
                                {method.type === 'bank' && <Landmark size={32} suppressHydrationWarning />}
                              </div>
                              <button 
                                onClick={() => handleDeletePayment(method.id)}
                                className="p-4 text-white/10 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash size={20} suppressHydrationWarning />
                              </button>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-4 mb-2">
                                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{method.type}</div>
                                {method.isDefault && <span className="text-[8px] px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">Default</span>}
                              </div>
                              <div className="text-2xl font-black tracking-tight text-glow-blue">{method.label}</div>
                              <div className="text-sm font-medium text-white/30 mt-3 truncate font-mono tracking-wider">{method.value}</div>
                            </div>
                            <div className="mt-10 flex items-center gap-4">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-pulse"></div>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/80">Verified & Active Payout</span>
                            </div>
                          </motion.div>
                      ))
                    ) : (
                      <div className="md:col-span-2 text-center py-24 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-8 text-white/10">
                          <CreditCard size={40} suppressHydrationWarning />
                        </div>
                        <h3 className="text-xl font-black tracking-tight mb-3">No Payout Methods</h3>
                        <p className="text-white/30 mb-10 max-w-xs mx-auto text-sm font-medium">Add a payment method to start receiving your hard-earned revenue.</p>
                        <button 
                          onClick={() => setIsAddingPayment(true)}
                          className="premium-button bg-neon-blue text-black neon-glow-blue"
                        >
                          Add Your First Method
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-12 sm:space-y-16"
                >
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-gradient">Profile Settings</h2>
                    <p className="text-white/40 text-sm font-medium">Customize your public presence on the marketplace.</p>
                  </div>
                  
                  <div className="glass-card p-8 sm:p-12 space-y-12 border-white/5">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
                      <div className="relative group shrink-0">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-neon-blue to-neon-purple p-0.5 shadow-2xl">
                          <div className="w-full h-full rounded-[2.5rem] bg-black overflow-hidden relative">
                            <FileUpload 
                              onFileSelect={handleAvatarChange}
                              value={profileData.avatarUrl}
                              previewClassName="w-full h-full"
                              className="w-full h-full"
                              label="Upload DP"
                            />
                            {!profileData.avatarUrl && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-6xl font-black text-white/20">{(profileData.fullName || user?.username || "?").charAt(0).toUpperCase()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-8 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Display Name</label>
                            <input 
                              type="text" 
                              value={profileData.fullName}
                              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                              className="w-full glass-input"
                              placeholder="Your full name"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Username</label>
                            <input 
                              type="text" 
                              defaultValue={user?.username}
                              disabled
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium opacity-30 cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex justify-end">
                      <button 
                        onClick={handleUpdateProfile}
                        className="px-12 py-4 bg-neon-purple text-white font-black uppercase tracking-widest rounded-2xl neon-glow-purple hover:scale-105 transition-all"
                      >
                        Update Profile
                      </button>
                    </div>
                  </div>

                  <div className="glass-card p-8 sm:p-12 border-red-500/20 bg-red-500/[0.02] relative overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-red-500/5 blur-3xl rounded-full group-hover:bg-red-500/10 transition-colors"></div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                      <div>
                        <h3 className="text-2xl font-black text-red-400 mb-3 tracking-tight">Danger Zone</h3>
                        <p className="text-sm text-white/30 max-w-md font-medium">Permanently delete your freelancer account and all associated projects. This action is irreversible.</p>
                      </div>
                      <button 
                        onClick={handleDeleteAccount}
                        className="px-8 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl text-red-400 font-black uppercase tracking-widest text-xs transition-all shrink-0"
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
