"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Globe, Rocket, Server, Cloud, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Deployment() {
  const platforms = [
    {
      name: "Vercel",
      icon: Globe,
      color: "text-white",
      description: "Optimized for Next.js, Vercel provides a seamless deployment experience with automatic SSL and edge caching."
    },
    {
      name: "Netlify",
      icon: Cloud,
      color: "text-neon-blue",
      description: "Perfect for static sites and serverless functions, Netlify offers powerful build automation and form handling."
    },
    {
      name: "AWS",
      icon: Server,
      color: "text-neon-purple",
      description: "For complex enterprise-grade applications, AWS provides a wide range of services for global scaling."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-dark-bg">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link href="/docs" className="text-neon-blue text-xs font-black uppercase tracking-widest mb-8 inline-block hover:opacity-70 transition-opacity">
            ← Back to Docs
          </Link>
          <div className="w-20 h-20 rounded-3xl bg-neon-emerald/10 border border-neon-emerald/20 flex items-center justify-center mb-8 text-neon-emerald">
            <Globe size={40} />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 uppercase">
            Project <span className="text-neon-emerald">Deployment</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed">
            Learn how to deploy your Neuronix AI projects to various platforms and take them live for your users.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-10 group hover:border-neon-emerald/30 transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-neon-emerald/10 transition-colors ${platform.color}`}>
                <platform.icon size={28} />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-tighter group-hover:text-neon-emerald transition-colors">{platform.name}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8">{platform.description}</p>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neon-emerald hover:text-white transition-colors">
                Setup Guide <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

        <section className="glass-card p-10 border-white/5">
          <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter flex items-center gap-3">
            <CheckCircle size={24} className="text-neon-emerald" /> Deployment Checklist
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              "Configure environment variables",
              "Run production build (npm run build)",
              "Optimize images and assets",
              "Setup custom domain and SSL",
              "Configure database connections",
              "Enable error tracking and monitoring"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-white/50 text-sm">
                <div className="w-5 h-5 rounded-full bg-neon-emerald/20 border border-neon-emerald/30 flex items-center justify-center shrink-0">
                  <CheckCircle size={12} className="text-neon-emerald" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
