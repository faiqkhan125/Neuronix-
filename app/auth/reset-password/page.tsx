"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, KeyRound, ArrowRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    resetToken: '',
    newPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In mock mode, we just simulate a successful password reset
      setSuccess(true);
      setTimeout(() => router.push('/auth/signin'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div suppressHydrationWarning className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center relative overflow-hidden bg-dark-bg">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 blur-[120px] rounded-full animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 md:p-10 border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-emerald-500 to-neon-blue animate-gradient-x"></div>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 relative group">
              <div className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <KeyRound className="text-neon-blue relative z-10" size={32} suppressHydrationWarning />
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">Reset Password</h1>
            <p className="text-white/40 text-sm">Enter the token and your new password</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium">
              Password reset successfully! Redirecting to sign in...
            </div>
          )}

          {!success && (
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
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Reset Token</label>
                <div className="relative group">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-blue transition-colors" size={18} suppressHydrationWarning />
                  <input
                    type="text"
                    required
                    value={formData.resetToken}
                    onChange={(e) => setFormData({ ...formData, resetToken: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:outline-none focus:border-neon-blue transition-all placeholder:text-white/10"
                    placeholder="Enter token"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-blue transition-colors" size={18} suppressHydrationWarning />
                  <input
                    type="password"
                    required
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:outline-none focus:border-neon-blue transition-all placeholder:text-white/10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-neon-blue text-black font-bold rounded-xl neon-glow-blue hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} suppressHydrationWarning />
                ) : (
                  <>
                    Reset Password <ArrowRight size={20} suppressHydrationWarning />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <Link href="/auth/signin" className="text-white/40 text-sm hover:text-white transition-colors">
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
