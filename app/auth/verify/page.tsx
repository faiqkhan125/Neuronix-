"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Loader2, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!email || !token) {
      setStatus('error');
      setMessage('Missing verification details');
      return;
    }

    const verify = async () => {
      try {
        // In mock mode, we just simulate a successful verification
        setTimeout(() => {
          setStatus('success');
          setMessage('Email verified successfully!');
        }, 1500);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message);
      }
    };

    verify();
  }, [email, token]);

  return (
    <div suppressHydrationWarning className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center relative overflow-hidden bg-dark-bg">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-blue/20 blur-[120px] rounded-full animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-10 border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-emerald-500 to-neon-blue animate-gradient-x"></div>
          
          <div className="mb-8">
            {status === 'loading' && (
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto relative">
                <Loader2 className="text-neon-blue animate-spin" size={40} suppressHydrationWarning />
              </div>
            )}
            {status === 'success' && (
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto relative group">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
                <CheckCircle2 className="text-emerald-400 relative z-10" size={40} suppressHydrationWarning />
              </div>
            )}
            {status === 'error' && (
              <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto relative group">
                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
                <XCircle className="text-red-400 relative z-10" size={40} suppressHydrationWarning />
              </div>
            )}
          </div>

          <h1 className="text-3xl font-black tracking-tighter mb-4">
            {status === 'loading' ? 'Verifying Email' : status === 'success' ? 'Verified!' : 'Verification Failed'}
          </h1>
          
          <p className="text-white/40 mb-10 leading-relaxed">
            {message || 'Please wait while we verify your email address...'}
          </p>

          {status !== 'loading' && (
            <Link 
              href="/auth/signin" 
              className="w-full py-4 bg-neon-blue text-black font-bold rounded-xl neon-glow-blue hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              Continue to Sign In <ArrowRight size={20} suppressHydrationWarning />
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center bg-black">
        <Loader2 className="text-neon-blue animate-spin" size={40} suppressHydrationWarning />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
