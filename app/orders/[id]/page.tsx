"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, Clock, DollarSign, 
  ExternalLink, Loader2, AlertCircle,
  ShoppingBag, User, Calendar, Tag,
  CreditCard, Wallet, Smartphone, Landmark,
  ShieldCheck, ArrowRight, Download, Star, Globe
} from 'lucide-react';
import { SafeImage } from '@/components/SafeImage';
import { FileUpload } from '@/components/FileUpload';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { mockAuth, mockOrders, mockProjects, mockUsers, mockReviews } from '@/lib/store';

export default function OrderManagement() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [proofData, setProofData] = useState({ transactionId: '', screenshotUrl: '' });
  const [downloadLink, setDownloadLink] = useState('');
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await mockOrders.getById(params.id as string);
        if (orderData) {
          setOrder(orderData);
          
          const projectData = await mockProjects.getById(orderData.projectId);
          setProject(projectData);
          
          const allUsers = await mockUsers.getAll();
          const sellerData = allUsers.find((u: any) => u.id === orderData.sellerId);
          setSeller(sellerData);
          
          const currentUser = await mockAuth.getCurrentUser();
          setUser(currentUser?.user || null);
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id, router]);

  const handleProofUpload = (file: File | null, base64: string | null) => {
    setProofData({ ...proofData, screenshotUrl: base64 || '' });
  };

  const handlePaymentDone = async () => {
    setSubmitting(true);
    try {
      await mockOrders.update(params.id as string, {
        status: 'payment_done',
        buyerPaymentProof: proofData
      });
      window.location.reload();
    } catch (err) {
      console.error('Error submitting payment proof:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmPayment = async () => {
    setSubmitting(true);
    try {
      await mockOrders.update(params.id as string, {
        status: 'confirmed',
        downloadLink: downloadLink
      });
      window.location.reload();
    } catch (err) {
      console.error('Error confirming payment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitCommission = async () => {
    setSubmitting(true);
    try {
      await mockOrders.update(params.id as string, {
        status: 'completed',
        sellerCommissionProof: proofData
      });
      window.location.reload();
    } catch (err) {
      console.error('Error submitting commission proof:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReview = async () => {
    setSubmitting(true);
    try {
      const currentUser = await mockAuth.getCurrentUser();
      if (!currentUser) return;

      await mockReviews.create({
        projectId: project.id,
        orderId: order.id,
        userId: currentUser.user.id,
        username: currentUser.user.username,
        ...reviewData
      });
      
      window.location.reload();
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-dark-bg">
        <Loader2 className="animate-spin text-neon-blue" size={48} suppressHydrationWarning />
      </div>
    );
  }

  const isBuyer = user?.id === order.buyerId;
  const isSeller = user?.id === order.sellerId;

  return (
    <div suppressHydrationWarning className="min-h-screen pt-20 sm:pt-32 pb-20 px-4 bg-dark-bg relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/20 blur-[150px] rounded-full -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-blue/20 blur-[150px] rounded-full -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-neon-blue mb-4 sm:mb-6"
            >
              <ShoppingBag size={14} suppressHydrationWarning /> Order Management
            </motion.div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter">Order #{order.id.slice(-6)}</h1>
            <p className="text-xs sm:text-sm text-white/40 mt-2">Status: <span className="text-neon-blue font-bold uppercase tracking-widest">{order.status.replace('_', ' ')}</span></p>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neon-purple">${order.price}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Order Flow */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Step 1: Payment Instructions (for Buyer) */}
            {isBuyer && order.status === 'pending_payment' && (
              <div className="glass-card p-6 sm:p-8 space-y-6 border-neon-blue/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center text-neon-blue shrink-0">
                    <CreditCard size={24} suppressHydrationWarning />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">Pay the Seller</h3>
                    <p className="text-xs sm:text-sm text-white/40">Choose a payment method and pay directly.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {seller.paymentMethods.map((method: any) => (
                    <div key={method.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60 shrink-0">
                          {method.type === 'PayPal' && <Globe size={20} suppressHydrationWarning />}
                          {method.type === 'JazzCash' && <Smartphone size={20} suppressHydrationWarning />}
                          {method.type === 'EasyPaisa' && <Smartphone size={20} suppressHydrationWarning />}
                          {method.type === 'Crypto' && <Wallet size={20} suppressHydrationWarning />}
                          {method.type === 'Bank' && <Landmark size={20} suppressHydrationWarning />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold">{method.type}</div>
                          <div className="text-xs text-white/40 truncate">{method.details}</div>
                        </div>
                      </div>
                      <button className="text-[10px] sm:text-xs font-bold text-neon-blue hover:underline self-start sm:self-auto">Copy Details</button>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                  <h4 className="text-sm font-bold">Submit Payment Proof</h4>
                  <div className="grid grid-cols-1 gap-6">
                    <input 
                      type="text" 
                      placeholder="Transaction ID"
                      value={proofData.transactionId}
                      onChange={(e) => setProofData({ ...proofData, transactionId: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-neon-blue outline-none"
                    />
                    <FileUpload 
                      onFileSelect={handleProofUpload}
                      value={proofData.screenshotUrl}
                      label="Payment Screenshot"
                      previewClassName="aspect-video"
                    />
                  </div>
                  <button 
                    onClick={handlePaymentDone}
                    disabled={submitting}
                    className="w-full py-4 bg-neon-blue text-black font-bold rounded-xl neon-glow-blue hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} suppressHydrationWarning /> : "Payment Done"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Confirm Payment (for Seller) */}
            {isSeller && order.status === 'payment_done' && (
              <div className="glass-card p-6 sm:p-8 space-y-6 border-neon-purple/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center text-neon-purple shrink-0">
                    <ShieldCheck size={24} suppressHydrationWarning />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">Verify Payment</h3>
                    <p className="text-xs sm:text-sm text-white/40">Check your account and confirm the transaction.</p>
                  </div>
                </div>

                <div className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Transaction ID</span>
                    <span className="text-xs sm:text-sm font-mono break-all">{order.buyerPaymentProof.transactionId}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Screenshot Proof</span>
                    <Link href={order.buyerPaymentProof.screenshotUrl} target="_blank" className="block relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-neon-blue transition-all">
                      <SafeImage src={order.buyerPaymentProof.screenshotUrl} alt="Proof" fill className="object-cover" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <h4 className="text-sm font-bold">Provide Download Link</h4>
                  <input 
                    type="url" 
                    placeholder="ZIP File or GitHub Link"
                    value={downloadLink}
                    onChange={(e) => setDownloadLink(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-neon-blue outline-none"
                  />
                  <button 
                    onClick={handleConfirmPayment}
                    disabled={submitting}
                    className="w-full py-4 bg-neon-purple text-white font-bold rounded-xl neon-glow-purple hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} suppressHydrationWarning /> : "Confirm & Send Link"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Pay Commission (for Seller) */}
            {isSeller && order.status === 'confirmed' && (
              <div className="glass-card p-6 sm:p-8 space-y-6 border-amber-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                    <DollarSign size={24} suppressHydrationWarning />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">Pay 10% Commission</h3>
                    <p className="text-xs sm:text-sm text-white/40">Pay the platform commission to complete the order.</p>
                  </div>
                </div>

                <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-center">
                  <div className="text-2xl sm:text-3xl font-black text-amber-500 mb-2">${(order.price * 0.1).toFixed(2)}</div>
                  <p className="text-[10px] sm:text-xs text-white/40">Please pay to JazzCash: <span className="text-white font-bold">+92 305 2332590</span></p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <input 
                      type="text" 
                      placeholder="Transaction ID"
                      value={proofData.transactionId}
                      onChange={(e) => setProofData({ ...proofData, transactionId: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-neon-blue outline-none"
                    />
                    <FileUpload 
                      onFileSelect={handleProofUpload}
                      value={proofData.screenshotUrl}
                      label="Commission Payment Screenshot"
                      previewClassName="aspect-video"
                    />
                  </div>
                  <button 
                    onClick={handleSubmitCommission}
                    disabled={submitting}
                    className="w-full py-4 bg-amber-500 text-black font-bold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} suppressHydrationWarning /> : "Submit Commission Proof"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Download & Review (for Buyer) */}
            {isBuyer && (order.status === 'confirmed' || order.status === 'completed') && (
              <div className="space-y-6 sm:space-y-8">
                <div className="glass-card p-6 sm:p-8 space-y-6 border-emerald-500/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                      <Download size={24} suppressHydrationWarning />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold">Download Your Project</h3>
                      <p className="text-xs sm:text-sm text-white/40">Your purchase is confirmed. You can now access the files.</p>
                    </div>
                  </div>
                  <Link 
                    href={order.downloadLink || '#'} 
                    target="_blank"
                    className="w-full py-4 bg-emerald-500 text-black font-bold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={20} suppressHydrationWarning /> Download Files
                  </Link>
                </div>

                {order.status === 'completed' && (
                  <div className="glass-card p-6 sm:p-8 space-y-6">
                    <h3 className="text-lg sm:text-xl font-bold">Rate Your Experience</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          onClick={() => setReviewData({ ...reviewData, rating: star })}
                          className={`p-2 sm:p-3 rounded-xl border transition-all ${reviewData.rating >= star ? 'bg-neon-blue/10 border-neon-blue text-neon-blue' : 'bg-white/5 border-white/10 text-white/20'}`}
                        >
                          <Star size={24} fill={reviewData.rating >= star ? "currentColor" : "none"} suppressHydrationWarning />
                        </button>
                      ))}
                    </div>
                    <textarea 
                      rows={4}
                      placeholder="Write a review..."
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm sm:text-base focus:outline-none focus:border-neon-blue transition-all resize-none"
                    />
                    <button 
                      onClick={handleSubmitReview}
                      disabled={submitting}
                      className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={20} suppressHydrationWarning /> : "Submit Review"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Waiting States */}
            {((isBuyer && order.status === 'payment_done') || (isSeller && order.status === 'pending_payment')) && (
              <div className="glass-card p-12 sm:p-20 text-center space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto animate-pulse">
                  <Clock size={40} className="text-white/20" suppressHydrationWarning />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">Waiting for Action</h2>
                <p className="text-xs sm:text-sm text-white/40">The {isBuyer ? 'seller' : 'buyer'} needs to complete their part of the process.</p>
              </div>
            )}
          </div>

          {/* Sidebar: Order Info */}
          <div className="space-y-6 sm:space-y-8">
            <div className="glass-card p-6 space-y-6">
              <div className="aspect-video relative rounded-xl overflow-hidden border border-white/10">
                <SafeImage src={project.thumbnail} alt="" fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-base sm:text-lg mb-1">{project.title}</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{project.category}</p>
              </div>
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-white/40">Order Date</span>
                  <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-white/40">Total Price</span>
                  <span className="text-neon-purple font-bold">${order.price}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Participants</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden relative shrink-0">
                    <SafeImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.buyerId}`} alt="" fill />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold">Buyer</div>
                    <div className="text-[10px] text-white/40 truncate">ID: {order.buyerId.slice(0, 8)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden relative shrink-0">
                    <SafeImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.sellerId}`} alt="" fill />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold">Seller</div>
                    <div className="text-[10px] text-white/40 truncate">ID: {order.sellerId.slice(0, 8)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
