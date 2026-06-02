"use client";

import React from 'react';
import { motion } from 'motion/react';
import { FileText, Gavel, CheckCircle, AlertCircle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-dark-bg">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 rounded-3xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mx-auto mb-8">
            <Gavel size={40} className="text-neon-purple" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 uppercase">
            Terms of <span className="text-neon-purple">Service</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using the Neuronix AI marketplace.
          </p>
        </motion.div>

        <div className="glass-card p-8 sm:p-12 space-y-12 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <CheckCircle size={24} className="text-neon-purple" /> 1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Neuronix AI platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <FileText size={24} className="text-neon-purple" /> 2. Use License
            </h2>
            <p className="mb-4">
              Permission is granted to download digital assets from Neuronix AI for personal or commercial use, subject to the specific license terms of each asset. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials without proper authorization</li>
              <li>Use the materials for any unauthorized commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on the platform</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <AlertCircle size={24} className="text-neon-purple" /> 3. Disclaimer
            </h2>
            <p>
              The materials on Neuronix AI are provided on an &apos;as is&apos; basis. Neuronix AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <Gavel size={24} className="text-neon-purple" /> 4. Limitations
            </h2>
            <p>
              In no event shall Neuronix AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Neuronix AI, even if Neuronix AI or a Neuronix AI authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <div className="pt-10 border-t border-white/5 text-sm text-white/30 text-center">
            Last updated: March 26, 2026
          </div>
        </div>
      </div>
    </div>
  );
}
