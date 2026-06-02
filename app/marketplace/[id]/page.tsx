"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, ShoppingBag, ArrowRight, Sparkles, 
  ExternalLink, Globe, Cpu, User, 
  Calendar, Tag, ShieldCheck, CheckCircle2,
  ChevronLeft, ChevronRight, MessageSquare,
  CreditCard, Wallet, Smartphone, Landmark,
  AlertCircle, Loader2, Camera, Github, 
  Download, FileCode
} from 'lucide-react';
import { SafeImage } from '@/components/SafeImage';
import { FileUpload } from '@/components/FileUpload';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { mockAuth, mockProjects, mockOrders, mockReviews, mockUsers } from '@/lib/store';

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isBuying, setIsBuying] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [orderInProgress, setOrderInProgress] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    if (project) {
      document.title = `${project.title} | Neuronix AI Marketplace`;
    }
  }, [project]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectData = await mockProjects.getById(params.id as string);
        if (projectData) {
          setProject(projectData);
          
          // Fetch reviews
          const allReviews = await mockReviews.getAll();
          const projectReviews = allReviews.filter((r: any) => r.projectId === params.id);
          setReviews(projectReviews);
          
          // Fetch seller profile
          const allUsers = await mockUsers.getAll();
          const sellerData = allUsers.find((u: any) => u.username === projectData.authorUsername);
          if (sellerData) {
            setSeller(sellerData);
          } else {
            setSeller({ username: projectData.authorUsername });
          }

          // Check if already purchased
          const currentUser = await mockAuth.getCurrentUser();
          if (currentUser) {
            const existingOrder = await mockOrders.getByUserAndProject(currentUser.user.id, params.id as string);
            if (existingOrder) {
              setIsPurchased(true);
            }
          }
        } else {
          router.push('/marketplace');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [params.id, router]);

  const handleInitiatePurchase = async () => {
    const user = await mockAuth.getCurrentUser();
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    setIsBuying(true);
  };

  const handleChat = async () => {
    const user = await mockAuth.getCurrentUser();
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    
    // Redirect to messages page with the seller's ID
    router.push(`/messages?partner=${project.sellerId}`);
  };

  const handleCompletePurchase = async () => {
    if (!paymentProof) {
      alert("Please upload the payment proof screenshot.");
      return;
    }

    setOrderInProgress(true);
    try {
      const userSession = await mockAuth.getCurrentUser();
      if (!userSession) throw new Error('Not authenticated');
      
      await mockOrders.create({
        projectId: project.id,
        buyerId: userSession.user.id,
        sellerId: project.sellerId,
        price: project.price,
        status: 'pending_review', // It goes to pending review wait for admin/seller to check screenshot
        paymentScreenshot: paymentProof,
        createdAt: new Date().toISOString()
      });
      
      setIsPurchased(true);
      setIsBuying(false);
      alert('Payment proof uploaded! You now have access to the project files.');
    } catch (err) {
      console.error('Error completing purchase:', err);
      alert('Failed to process order. Please try again.');
    } finally {
      setOrderInProgress(false);
    }
  };

  const handleScreenshotSelect = (file: File | null, base64: string | null) => {
    setPaymentProof(base64);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen pt-32 bg-dark-bg" />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-dark-bg">
        <Loader2 className="animate-spin text-neon-blue" size={48} suppressHydrationWarning />
      </div>
    );
  }

  const allImages = [project.thumbnail, ...(project.images || [])];

  return (
    <div suppressHydrationWarning className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 relative overflow-hidden bg-dark-bg selection:bg-neon-blue/30 selection:text-neon-blue">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-emerald-900/20 blur-[180px] rounded-full -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-neon-blue/20 blur-[180px] rounded-full -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-neon-emerald/10 blur-[200px] rounded-full -z-10 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
          {/* Left Column: Media */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 sm:space-y-12"
          >
            <div className="relative aspect-video rounded-3xl sm:rounded-[3rem] overflow-hidden border border-white/10 group shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-white/5" style={{ transformStyle: 'preserve-3d' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full relative"
                >
                  <SafeImage 
                    src={allImages[activeImage]} 
                    alt={project.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-700"></div>
              
              <div className="absolute inset-y-0 left-6 sm:left-8 flex items-center">
                <button 
                  onClick={() => setActiveImage((activeImage - 1 + allImages.length) % allImages.length)}
                  className="p-4 sm:p-5 bg-black/40 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-neon-blue hover:text-black hover:scale-110 duration-300 shadow-2xl"
                >
                  <ChevronLeft size={28} suppressHydrationWarning />
                </button>
              </div>
              <div className="absolute inset-y-0 right-6 sm:right-8 flex items-center">
                <button 
                  onClick={() => setActiveImage((activeImage + 1) % allImages.length)}
                  className="p-4 sm:p-5 bg-black/40 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-neon-blue hover:text-black hover:scale-110 duration-300 shadow-2xl"
                >
                  <ChevronRight size={28} suppressHydrationWarning />
                </button>
              </div>

              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="flex gap-3">
                  {allImages.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${activeImage === i ? 'w-12 bg-neon-blue shadow-[0_0_10px_rgba(0,245,255,0.5)]' : 'w-3 bg-white/20'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-hide px-2 font-black">
              {allImages.map((img, i) => (
                <motion.button 
                  key={i}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-28 sm:w-40 aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border-2 transition-all flex-shrink-0 shadow-xl ${activeImage === i ? 'border-neon-blue shadow-[0_0_30px_rgba(0,245,255,0.4)]' : 'border-transparent opacity-40 hover:opacity-100'}`}
                >
                  <SafeImage src={img} alt="" fill width={160} height={90} className="object-cover" />
                </motion.button>
              ))}
            </div>

            {project.demoUrl && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="glass-card-premium p-10 sm:p-12 space-y-8 sm:space-y-10 border-white/5 hover:border-neon-blue/20 transition-all duration-500 shadow-2xl group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-4">
                    <Globe size={28} className="text-neon-blue animate-pulse" suppressHydrationWarning /> Live Demo Preview
                  </h3>
                  <Link 
                    href={project.demoUrl} 
                    target="_blank"
                    className="group flex items-center gap-3 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-neon-blue hover:text-white transition-all"
                  >
                    Open Fullscreen <ExternalLink size={16} suppressHydrationWarning className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
                <div className="aspect-video rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 relative shadow-2xl group-hover:border-neon-blue/30 transition-all duration-500">
                  <iframe 
                    src={project.demoUrl} 
                    className="w-full h-full border-none grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                    title="Live Demo"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 pointer-events-none border-2 border-white/5 rounded-3xl sm:rounded-[2.5rem] group-hover:border-neon-blue/20 transition-colors duration-500"></div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column: Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 sm:space-y-12"
          >
            <div className="glass-card-premium p-10 sm:p-16 space-y-10 sm:space-y-14 border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 blur-[100px] -z-10"></div>
              
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] rounded-xl backdrop-blur-xl">
                    {project.category}
                  </span>
                  <span className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] rounded-xl text-white/40 backdrop-blur-xl">
                    {project.subcategory}
                  </span>
                </div>
                <h1 className="text-5xl sm:text-8xl font-black tracking-tighter leading-[0.85] text-gradient drop-shadow-[0_0_40px_rgba(168,85,247,0.25)]">{project.title}</h1>
                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-3 text-neon-blue">
                    <Star size={24} fill="currentColor" suppressHydrationWarning className="drop-shadow-[0_0_15px_rgba(0,245,255,0.6)]" />
                    <span className="text-2xl sm:text-3xl font-black">{project.rating}</span>
                    <span className="text-xs font-bold text-white/20 uppercase tracking-[0.2em] ml-2">({reviews.length} reviews)</span>
                  </div>
                  <div className="h-6 w-px bg-white/10"></div>
                  <div className="text-xs sm:text-sm font-black text-white/40 uppercase tracking-[0.3em]">{project.sales} Successful Sales</div>
                </div>
              </div>

              <div className="flex items-baseline gap-6">
                <div className="text-6xl sm:text-9xl font-black text-neon-purple drop-shadow-[0_0_40px_rgba(168,85,247,0.5)] leading-none text-glow-purple">${project.price}</div>
                <div className="text-sm sm:text-lg font-bold text-white/20 uppercase tracking-[0.2em] line-through decoration-neon-purple/30">${Math.round(project.price * 1.5)}</div>
              </div>

              <p className="text-white/50 leading-relaxed text-xl sm:text-2xl font-medium max-w-2xl">{project.description}</p>

              <div className="space-y-8">
                <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-white/20">Technology Stack</h4>
                <div className="flex flex-wrap gap-4">
                  {project.techStack.map((tech: string) => (
                    <span key={tech} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs sm:text-sm font-black text-white/60 uppercase tracking-[0.2em] hover:border-neon-blue/40 hover:text-neon-blue hover:bg-neon-blue/5 transition-all cursor-default shadow-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.payoutMethod?.value && (
                <div className="glass-card-premium p-8 border-neon-blue/20 bg-neon-blue/[0.02] rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-3 text-neon-blue">
                    <Wallet size={20} suppressHydrationWarning />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Seller&apos;s Preferred Payout</h4>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-1">{project.payoutMethod.type}</p>
                      <p className="text-base font-bold text-white font-mono tracking-tight">{project.payoutMethod.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white/40">
                      {project.payoutMethod.type === 'paypal' && <Globe size={24} suppressHydrationWarning />}
                      {project.payoutMethod.type === 'bank' && <Landmark size={24} suppressHydrationWarning />}
                      {(project.payoutMethod.type === 'easypaisa' || project.payoutMethod.type === 'jazzcash') && <Smartphone size={24} suppressHydrationWarning />}
                    </div>
                  </div>
                  <p className="text-[9px] text-white/20 italic font-medium leading-relaxed">
                    You can use this method for direct payment if required by the seller. Platform security applies to all on-site orders.
                  </p>
                </div>
              )}

              <div className="pt-12 border-t border-white/5 space-y-12">
                <div className="flex items-center justify-between p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500 group">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative shadow-xl group-hover:border-neon-blue/40 transition-all duration-500">
                      <SafeImage 
                        src={seller?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.authorUsername}`} 
                        alt="Seller"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div>
                      <div className="text-lg font-black tracking-tight group-hover:text-neon-blue transition-colors">@{seller?.username || 'seller'}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <ShieldCheck size={14} className="text-emerald-400" suppressHydrationWarning />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Verified Expert</span>
                      </div>
                    </div>
                  </div>
                  <Link 
                    href={`/@${seller?.username}`}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-xl"
                  >
                    Profile
                  </Link>
                </div>

                <AnimatePresence mode="wait">
                  {isPurchased ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] space-y-6"
                    >
                      <div className="flex items-center gap-3 text-emerald-400">
                        <CheckCircle2 size={24} suppressHydrationWarning />
                        <h4 className="text-sm font-black uppercase tracking-widest">Ownership Verified</h4>
                      </div>
                      <p className="text-sm text-white/60 font-medium">You have full access to this project&apos;s source code and deployment files.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {project.fileUrl && (
                          <Link 
                            href={project.fileUrl} 
                            target="_blank"
                            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between group transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <Github size={20} className="text-white/40 group-hover:text-white transition-colors" suppressHydrationWarning />
                              <span className="text-[10px] font-black uppercase tracking-widest">Source Repo</span>
                            </div>
                            <ExternalLink size={14} className="text-white/20" suppressHydrationWarning />
                          </Link>
                        )}
                        <Link 
                          href="#" 
                          onClick={(e) => e.preventDefault()}
                          className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between group transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <Download size={20} className="text-white/40 group-hover:text-white transition-colors" suppressHydrationWarning />
                            <span className="text-[10px] font-black uppercase tracking-widest">Assets Bundle</span>
                          </div>
                          <ExternalLink size={14} className="text-white/20" suppressHydrationWarning />
                        </Link>
                      </div>
                    </motion.div>
                  ) : isBuying ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card-premium p-8 border-neon-blue/30 bg-neon-blue/5 rounded-[2.5rem] space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-neon-blue">
                          <CreditCard size={20} suppressHydrationWarning />
                          <h4 className="text-xs font-black uppercase tracking-[0.2em]">Secure Payment Flow</h4>
                        </div>
                        <button 
                          onClick={() => setIsBuying(false)}
                          className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Freelancer Payout</span>
                          <span className="px-2 py-0.5 bg-neon-blue/20 text-neon-blue rounded text-[9px] font-bold uppercase tracking-wider">{project.payoutMethod?.type || 'Standard'}</span>
                        </div>
                        <div className="flex items-center justify-between group">
                          <span className="text-lg font-mono font-bold text-white tracking-tight">{project.payoutMethod?.value || '+92 3XX XXXXXXX'}</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(project.payoutMethod?.value || '');
                              alert('Copied to clipboard!');
                            }}
                            className="text-[9px] font-black uppercase tracking-widest text-neon-blue hover:underline"
                          >
                            Copy ID
                          </button>
                        </div>
                        <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                          <span className="text-white/40">Total Amount:</span>
                          <span className="font-black text-neon-purple">${project.price}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neon-blue ml-1 flex items-center gap-2">
                          <Camera size={14} suppressHydrationWarning /> Upload Payment Screenshot
                        </label>
                        <div className="h-48 rounded-2xl overflow-hidden border border-dashed border-neon-blue/30 relative bg-black/20 group hover:border-neon-blue transition-colors">
                          <FileUpload 
                            onFileSelect={handleScreenshotSelect}
                            value={paymentProof}
                            className="w-full h-full"
                            previewClassName="w-full h-full"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={handleCompletePurchase}
                        disabled={!paymentProof || orderInProgress}
                        className="w-full py-5 bg-neon-blue text-black font-black uppercase tracking-[0.3em] rounded-2xl neon-glow-blue hover:scale-105 active:scale-95 transition-all text-xs disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {orderInProgress ? <Loader2 className="animate-spin mx-auto" size={18} suppressHydrationWarning /> : "Confirm & Send Proof"}
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-6">
                      <button 
                        onClick={handleInitiatePurchase}
                        className="flex-[3] py-6 bg-neon-blue text-black font-black uppercase tracking-[0.3em] rounded-3xl neon-glow-blue hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-4 text-sm sm:text-lg shadow-[0_0_30px_rgba(0,245,255,0.3)]"
                      >
                        <ShoppingBag size={24} suppressHydrationWarning /> Secure Purchase
                      </button>
                      <button 
                        onClick={handleChat}
                        className="flex-1 py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl text-white transition-all flex items-center justify-center gap-4 group hover:border-neon-purple/30 shadow-xl"
                      >
                        <MessageSquare size={24} suppressHydrationWarning className="group-hover:scale-110 group-hover:text-neon-purple transition-all" />
                        <span className="sm:hidden lg:inline text-xs font-black uppercase tracking-[0.3em]">Chat</span>
                      </button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>


            {/* Reviews Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card-premium p-8 sm:p-12 space-y-8 sm:space-y-10 border-white/5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight">User Reviews</h3>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <Star size={14} className="text-neon-blue" fill="currentColor" suppressHydrationWarning />
                  <span className="text-sm font-black">4.9 / 5.0</span>
                </div>
              </div>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <motion.div 
                      key={review.id} 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="p-6 sm:p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-4 hover:border-white/10 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden relative border border-white/10">
                            <SafeImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userId}`} alt="" fill />
                          </div>
                          <div>
                            <div className="text-sm font-black tracking-tight">@{review.username}</div>
                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-neon-blue">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "drop-shadow-[0_0_5px_rgba(0,245,255,0.5)]" : "text-white/10"} suppressHydrationWarning />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-white/50 font-medium leading-relaxed italic">&quot;{review.comment}&quot;</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 sm:py-20 bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/10">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 text-white/10">
                    <MessageSquare size={32} suppressHydrationWarning />
                  </div>
                  <p className="text-white/30 text-sm font-medium max-w-[200px] mx-auto">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
