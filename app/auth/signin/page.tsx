"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Loader2, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { mockAuth } from '@/lib/store';

function SigninContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (searchParams.get('signup') === 'success') {
      setSuccess('Account created successfully! Please sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Use mock auth instead of API
      await mockAuth.login(formData.email, formData.password);

      // Successful sign in, redirect to home
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-neon-blue" size={48} suppressHydrationWarning />
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center relative overflow-hidden bg-dark-bg">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-900/20 blur-[120px] rounded-full animate-pulse delay-700"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 md:p-10 border-white/10 relative overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue animate-gradient-x"></div>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 relative group">
              <div className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ShieldCheck className="text-neon-blue relative z-10" size={32} suppressHydrationWarning />
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">Welcome Back</h1>
            <p className="text-white/40 text-sm">Enter your credentials to access your account</p>
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

          {success && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium flex items-center gap-3"
            >
              <CheckCircle2 size={18} className="text-emerald-500" suppressHydrationWarning />
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-blue transition-colors" size={18} suppressHydrationWarning />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:outline-none focus:border-neon-blue transition-all placeholder:text-white/10"
                  placeholder="your@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Password</label>
                <Link href="/auth/forgot-password" title="Forgot Password" className="text-[10px] font-bold uppercase tracking-widest text-neon-blue hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-blue transition-colors" size={18} suppressHydrationWarning />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:outline-none focus:border-neon-blue transition-all placeholder:text-white/10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-neon-blue text-black font-bold rounded-xl neon-glow-blue hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} suppressHydrationWarning />
              ) : (
                <>
                  Sign In <ArrowRight size={20} suppressHydrationWarning />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-white/40 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-neon-blue font-bold hover:underline">Create Account</Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex items-center justify-center gap-6 text-white/20">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Sparkles size={12} suppressHydrationWarning /> Secure Auth
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10"></div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
            <ShieldCheck size={12} suppressHydrationWarning /> Encrypted
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Signin() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-neon-blue" size={48} /></div>}>
      <SigninContent />
    </Suspense>
  );
}
