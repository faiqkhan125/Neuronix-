"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Zap, Terminal, Code, Rocket, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function GettingStarted() {
  const steps = [
    {
      title: "Prerequisites",
      content: "Ensure you have Node.js (v18+) and npm/yarn installed on your machine. Familiarity with React and Next.js is recommended."
    },
    {
      title: "Download Asset",
      content: "Purchase and download your desired asset from the Neuronix AI marketplace. You will receive a ZIP file containing the source code."
    },
    {
      title: "Installation",
      content: "Extract the ZIP file and run 'npm install' or 'yarn install' in the root directory to install all necessary dependencies."
    },
    {
      title: "Environment Setup",
      content: "Copy the '.env.example' file to '.env.local' and add your specific API keys and configuration variables."
    },
    {
      title: "Run Development Server",
      content: "Execute 'npm run dev' to start the local development server. Your project will be available at http://localhost:3000."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-dark-bg">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link href="/docs" className="text-neon-blue text-xs font-black uppercase tracking-widest mb-8 inline-block hover:opacity-70 transition-opacity">
            ← Back to Docs
          </Link>
          <div className="w-20 h-20 rounded-3xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-8 text-neon-blue">
            <Zap size={40} />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 uppercase">
            Getting <span className="text-neon-blue">Started</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed">
            Follow this guide to quickly set up your Neuronix AI assets and start building your next big project.
          </p>
        </motion.div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 text-6xl font-black text-white/5 group-hover:text-neon-blue/10 transition-colors">
                0{index + 1}
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter text-white group-hover:text-neon-blue transition-colors">
                {step.title}
              </h3>
              <p className="text-white/50 leading-relaxed relative z-10">
                {step.content}
              </p>
              {index === 2 && (
                <div className="mt-6 p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-xs text-neon-blue">
                  $ npm install<br />
                  $ npm run dev
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-10 glass-card border-neon-blue/20 text-center">
          <Rocket size={40} className="text-neon-blue mx-auto mb-6 animate-bounce" />
          <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">Ready to Scale?</h2>
          <p className="text-white/40 mb-8">Check out our deployment guide to take your project live.</p>
          <Link href="/docs/deployment" className="premium-button bg-neon-blue text-black px-8 py-3 neon-glow-blue inline-block font-black uppercase tracking-widest text-xs">
            Deployment Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
