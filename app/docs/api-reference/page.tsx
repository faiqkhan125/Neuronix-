"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Code, Terminal, Cpu, Database, Globe, Key } from 'lucide-react';
import Link from 'next/link';

export default function ApiReference() {
  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/projects",
      description: "Retrieve a list of all available digital assets in the marketplace.",
      params: ["category", "sort", "limit"]
    },
    {
      method: "POST",
      path: "/api/v1/auth/login",
      description: "Authenticate a user and receive a secure JWT token.",
      params: ["email", "password"]
    },
    {
      method: "GET",
      path: "/api/v1/user/profile",
      description: "Fetch the profile information for the currently authenticated user.",
      params: ["userId"]
    },
    {
      method: "PUT",
      path: "/api/v1/projects/:id",
      description: "Update the metadata and status of a specific project.",
      params: ["title", "description", "price", "status"]
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
          <div className="w-20 h-20 rounded-3xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mb-8 text-neon-purple">
            <Code size={40} />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 uppercase">
            API <span className="text-neon-purple">Reference</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed">
            Integrate Neuronix AI services directly into your applications with our robust and secure RESTful API.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12">
          <section className="glass-card p-10 border-white/5">
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter flex items-center gap-3">
              <Key size={24} className="text-neon-purple" /> Authentication
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              All API requests must be authenticated using a Bearer token in the Authorization header. You can generate your API key from the developer settings in your dashboard.
            </p>
            <div className="p-6 bg-black/40 rounded-xl border border-white/5 font-mono text-xs text-neon-purple">
              Authorization: Bearer YOUR_API_KEY
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter flex items-center gap-3">
              <Database size={24} className="text-neon-purple" /> Endpoints
            </h2>
            <div className="space-y-6">
              {endpoints.map((endpoint, index) => (
                <motion.div
                  key={endpoint.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-8 group hover:border-neon-purple/30 transition-all duration-500"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        endpoint.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        endpoint.method === 'POST' ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' :
                        'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono text-white/70">{endpoint.path}</code>
                    </div>
                    <div className="flex gap-2">
                      {endpoint.params.map(param => (
                        <span key={param} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[8px] font-black uppercase tracking-tighter text-white/30">
                          {param}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                    {endpoint.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
