"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Layout';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar />
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 blur-[120px] rounded-full animate-pulse delay-700"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-[12rem] font-black leading-none tracking-tighter text-white/5 select-none">404</h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            <h2 className="text-5xl font-black tracking-tighter mb-4">LOST IN THE NEURAL NETWORK?</h2>
            <p className="text-white/40 max-w-md mx-auto mb-10">
              The page you&apos;re looking for doesn&apos;t exist or has been moved to another dimension.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/" 
                className="px-8 py-4 bg-neon-blue text-black font-black rounded-xl neon-glow-blue hover:scale-105 transition-all flex items-center gap-2"
              >
                <Home size={20} /> BACK TO HOME
              </Link>
              <Link 
                href="/marketplace" 
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Search size={20} /> BROWSE MARKETPLACE
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent 1px),linear-gradient(to_bottom,#ffffff05_1px,transparent 1px)] bg-[size:40px_40px] pointer-events-none"></div>
    </div>
  );
}
