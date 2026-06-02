"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Book, Code, Zap, Globe, Shield, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function Documentation() {
  const sections = [
    {
      title: "Getting Started",
      icon: Zap,
      href: "/docs/getting-started",
      content: "Learn how to set up your development environment and start using our premium assets. We provide detailed guides for React, Next.js, and other popular frameworks."
    },
    {
      title: "API Reference",
      icon: Code,
      href: "/docs/api-reference",
      content: "Explore our comprehensive API documentation. Integrate our AI models and automation tools directly into your applications with ease."
    },
    {
      title: "Deployment",
      icon: Globe,
      href: "/docs/deployment",
      content: "Step-by-step instructions on how to deploy your projects to various platforms like Vercel, Netlify, and AWS."
    },
    {
      title: "Security",
      icon: Shield,
      href: "/docs/security",
      content: "Our best practices for securing your applications and protecting your users' data when using our templates and code."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-dark-bg">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="w-20 h-20 rounded-3xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mx-auto mb-8">
            <Book size={40} className="text-neon-blue" />
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tighter mb-6 uppercase">
            Developer <span className="text-neon-blue">Docs</span>
          </h1>
          <p className="text-white/40 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Everything you need to build, deploy, and scale your digital products with Neuronix AI assets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-10 group hover:border-neon-blue/30 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-neon-blue/10 transition-colors">
                <section.icon size={28} className="text-white/40 group-hover:text-neon-blue transition-colors" />
              </div>
              <h2 className="text-2xl font-black mb-4 group-hover:text-neon-blue transition-colors uppercase tracking-tighter">{section.title}</h2>
              <p className="text-white/40 leading-relaxed mb-8">{section.content}</p>
              <Link href={section.href} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neon-blue hover:text-white transition-colors">
                Read More <Terminal size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
