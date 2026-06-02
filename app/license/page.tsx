"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Shield, CheckCircle, XCircle, FileText, Info, Gavel } from 'lucide-react';

export default function License() {
  const allowed = [
    "Use in personal projects",
    "Use in commercial client projects",
    "Modify the source code for your needs",
    "Deploy on multiple domains",
    "Use in SaaS applications"
  ];

  const restricted = [
    "Resell the original or modified asset",
    "Distribute for free on other platforms",
    "Use in themes or templates for resale",
    "Claim authorship of the original design",
    "Share download links with unauthorized users"
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-dark-bg">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 rounded-3xl bg-neon-emerald/10 border border-neon-emerald/20 flex items-center justify-center mx-auto mb-8 text-neon-emerald">
            <Shield size={40} />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 uppercase">
            Asset <span className="text-neon-emerald">License</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Our straightforward licensing terms for all digital assets on the Neuronix AI marketplace.
          </p>
        </motion.div>

        <div className="glass-card p-8 sm:p-12 space-y-12 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <Info size={24} className="text-neon-emerald" /> Standard License
            </h2>
            <p className="mb-8">
              Every asset purchased on Neuronix AI comes with our Standard License. This license is designed to be flexible and dev-friendly, allowing you to use the assets in a wide range of professional and personal projects.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CheckCircle size={14} /> What is allowed
                </h4>
                {allowed.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <XCircle size={14} /> What is restricted
                </h4>
                {restricted.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <Gavel size={24} className="text-neon-emerald" /> Legal Terms
            </h2>
            <p className="mb-4">
              By purchasing or downloading any asset from Neuronix AI, you agree to the following legal terms:
            </p>
            <ul className="list-disc pl-6 space-y-4 text-sm text-white/50">
              <li>The license is non-exclusive and non-transferable.</li>
              <li>Neuronix AI and the original author retain all intellectual property rights.</li>
              <li>You are responsible for any legal issues arising from the use of the asset in your projects.</li>
              <li>Violation of these terms will result in immediate termination of the license.</li>
            </ul>
          </section>

          <div className="pt-10 border-t border-white/5 text-sm text-white/30 text-center">
            Last updated: March 26, 2026
          </div>
        </div>
      </div>
    </div>
  );
}
