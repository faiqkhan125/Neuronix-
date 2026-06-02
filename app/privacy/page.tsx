"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-dark-bg">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 rounded-3xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mx-auto mb-8">
            <Shield size={40} className="text-neon-blue" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 uppercase">
            Privacy <span className="text-neon-blue">Policy</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Your privacy is our priority. Learn how we protect and manage your data at Neuronix AI.
          </p>
        </motion.div>

        <div className="glass-card p-8 sm:p-12 space-y-12 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <Lock size={24} className="text-neon-blue" /> 1. Information Collection
            </h2>
            <p className="mb-4">
              We collect information that you provide directly to us when you create an account, make a purchase, or communicate with us. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and contact information (email address)</li>
              <li>Account credentials</li>
              <li>Payment information (processed securely via third-party providers)</li>
              <li>Profile information and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <Eye size={24} className="text-neon-blue" /> 2. How We Use Your Data
            </h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our marketplace services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and security alerts</li>
              <li>Respond to your comments and questions</li>
              <li>Personalize your experience on our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <Shield size={24} className="text-neon-blue" /> 3. Data Protection
            </h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. We use advanced encryption and secure servers to protect your data from unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <FileText size={24} className="text-neon-blue" /> 4. Third-Party Services
            </h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
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
