"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, Calendar, User, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { SafeImage } from '@/components/SafeImage';
import Link from 'next/link';

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "The Future of AI in Web Development",
      excerpt: "Explore how artificial intelligence is transforming the way we build and design digital experiences in 2026.",
      date: "March 24, 2026",
      author: "Neuronix Team",
      category: "AI & Tech",
      image: "https://picsum.photos/seed/ai/800/600"
    },
    {
      id: 2,
      title: "10 Essential UI Kits for SaaS Startups",
      excerpt: "Boost your startup's productivity with these carefully curated UI kits designed for high-performance SaaS platforms.",
      date: "March 20, 2026",
      author: "Design Lead",
      category: "Design",
      image: "https://picsum.photos/seed/design/800/600"
    },
    {
      id: 3,
      title: "Optimizing Next.js for Performance",
      excerpt: "Learn the best practices for optimizing your Next.js applications to achieve lightning-fast load times and superior SEO.",
      date: "March 15, 2026",
      author: "Dev Expert",
      category: "Development",
      image: "https://picsum.photos/seed/dev/800/600"
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
          <div className="w-20 h-20 rounded-3xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mx-auto mb-8 text-neon-blue">
            <Newspaper size={40} />
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tighter mb-6 uppercase">
            Neuronix <span className="text-neon-blue">Blog</span>
          </h1>
          <p className="text-white/40 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Insights, tutorials, and news from the world of AI and digital asset development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden group hover:border-neon-blue/30 transition-all duration-500"
            >
              <div className="aspect-video relative overflow-hidden">
                <SafeImage 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  width={400}
                  height={225}
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 bg-neon-blue/20 backdrop-blur-md border border-neon-blue/30 rounded-lg text-[10px] font-black uppercase tracking-widest text-neon-blue">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">
                  <div className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</div>
                  <div className="flex items-center gap-1.5"><User size={12} /> {post.author}</div>
                </div>
                <h3 className="text-xl font-black mb-4 group-hover:text-neon-blue transition-colors uppercase tracking-tighter">{post.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8 line-clamp-2">{post.excerpt}</p>
                <Link href="#" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neon-blue hover:text-white transition-colors">
                  Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
