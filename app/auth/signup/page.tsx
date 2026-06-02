"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, ShieldCheck, UserCircle, Briefcase, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockAuth } from '@/lib/store';

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'buyer' as 'buyer' | 'seller',
  });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Gmail only validation
    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      setError('Only @gmail.com emails are allowed');
      setLoading(false);
      return;
    }

    // 2. Password strength check
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      // Use mock auth instead of API
      await mockAuth.signup(
        formData.email, 
        formData.password, 
        formData.username, 
        formData.fullName, 
        formData.role
      );

      // Successful sign up, redirect to sign in
      router.push('/auth/signin?signup=success');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div suppressHydrationWarning className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center relative overflow-hidden bg-dark-bg">
      {/* Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-blue/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-900/20 blur-[120px] rounded-full animate-pulse delay-700"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card p-8 md:p-10 border-white/10 relative overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-emerald-500 to-neon-blue animate-gradient-x"></div>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 relative group">
              <div className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <UserCircle className="text-neon-blue relative z-10" size={32} suppressHydrationWarning />
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">Create Account</h1>
            <p className="text-white/40 text-sm">Join the future of digital marketplaces</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-purple transition-colors" size={18} suppressHydrationWarning />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:outline-none focus:border-neon-purple transition-all placeholder:text-white/10"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Username</label>
                <div className="relative group">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-purple transition-colors" size={18} suppressHydrationWarning />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:outline-none focus:border-neon-purple transition-all placeholder:text-white/10"
                    placeholder="johndoe"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-purple transition-colors" size={18} suppressHydrationWarning />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:outline-none focus:border-neon-purple transition-all placeholder:text-white/10"
                  placeholder="your@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-purple transition-colors" size={18} suppressHydrationWarning />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:outline-none focus:border-neon-purple transition-all placeholder:text-white/10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Select Your Role</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'buyer' })}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 group ${
                    formData.role === 'buyer' 
                      ? 'bg-neon-blue/10 border-neon-blue text-white shadow-[0_0_15px_rgba(0,245,255,0.2)]' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                  }`}
                >
                  <ShoppingCart size={24} suppressHydrationWarning className={formData.role === 'buyer' ? 'text-neon-blue' : 'group-hover:text-white/60'} />
                  <div className="text-center">
                    <div className="text-sm font-bold">Client</div>
                    <div className="text-[10px] opacity-60">Browse & Buy Projects</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'seller' })}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 group ${
                    formData.role === 'seller' 
                      ? 'bg-neon-purple/10 border-neon-purple text-white shadow-[0_0_15px_rgba(191,0,255,0.2)]' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                  }`}
                >
                  <Briefcase size={24} suppressHydrationWarning className={formData.role === 'seller' ? 'text-neon-purple' : 'group-hover:text-white/60'} />
                  <div className="text-center">
                    <div className="text-sm font-bold">Freelancer</div>
                    <div className="text-[10px] opacity-60">Upload & Sell Projects</div>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98] ${
                formData.role === 'buyer' ? 'bg-neon-blue text-black neon-glow-blue' : 'bg-neon-purple text-white neon-glow-purple'
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} suppressHydrationWarning />
              ) : (
                <>
                  Create Account <ArrowRight size={20} suppressHydrationWarning />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-white/40 text-sm">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-neon-blue font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
