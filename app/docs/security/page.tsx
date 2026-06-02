"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Security() {
  const principles = [
    {
      title: "Data Encryption",
      icon: Lock,
      description: "All sensitive data is encrypted at rest and in transit using industry-standard AES-256 and TLS 1.3 encryption."
    },
    {
      title: "Secure Authentication",
      icon: Shield,
      description: "We use secure JWT-based authentication with short-lived tokens and refresh tokens to protect user sessions."
    },
    {
      title: "Access Control",
      icon: Eye,
      description: "Implement role-based access control (RBAC) to ensure users only have access to the resources they are authorized to use."
    },
    {
      title: "Security Audits",
      icon: FileText,
      description: "Regular security audits and penetration testing to identify and mitigate potential vulnerabilities in our codebase."
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
          <div className="w-20 h-20 rounded-3xl bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center mb-8 text-neon-pink">
            <Shield size={40} />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 uppercase">
            Security <span className="text-neon-pink">Best Practices</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed">
            Our commitment to security ensures your applications and user data are always protected with the latest security standards.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-10 group hover:border-neon-pink/30 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-neon-pink/10 transition-colors text-neon-pink">
                <principle.icon size={28} />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-tighter group-hover:text-neon-pink transition-colors">{principle.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{principle.description}</p>
            </motion.div>
          ))}
        </div>

        <section className="glass-card p-10 border-white/5 bg-red-500/5 border-red-500/10">
          <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter flex items-center gap-3 text-red-400">
            <AlertTriangle size={24} /> Security Warning
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            Never expose your private API keys or secrets in client-side code. Always use environment variables and server-side processing for sensitive operations.
          </p>
          <div className="flex items-center gap-4 text-emerald-400 text-sm font-black uppercase tracking-widest">
            <CheckCircle size={18} /> Use .env.local for local development
          </div>
        </section>
      </div>
    </div>
  );
}
