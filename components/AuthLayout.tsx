"use client";

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-blue/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-purple/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center neon-glow-blue group-hover:scale-110 transition-transform">
              <span className="text-black font-black text-xl">N</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter">
              NEURONIX<span className="text-neon-blue">AI</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
          <p className="text-white/50">{subtitle}</p>
        </div>

        <div className="glass-card p-8 neon-glow-purple/5">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
