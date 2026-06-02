"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Cookie, Info, Settings, Shield } from 'lucide-react';

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-dark-bg">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 rounded-3xl bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center mx-auto mb-8">
            <Cookie size={40} className="text-neon-pink" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 uppercase">
            Cookies <span className="text-neon-pink">Policy</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            This policy explains how we use cookies and similar technologies on Neuronix AI.
          </p>
        </motion.div>

        <div className="glass-card p-8 sm:p-12 space-y-12 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <Info size={24} className="text-neon-pink" /> 1. What are Cookies?
            </h2>
            <p>
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <Settings size={24} className="text-neon-pink" /> 2. How We Use Cookies
            </h2>
            <p className="mb-4">
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly. They include, for example, cookies that enable you to log into secure areas of our website.</li>
              <li><strong>Analytical Cookies:</strong> These allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it.</li>
              <li><strong>Functional Cookies:</strong> These are used to recognize you when you return to our website. This enables us to personalize our content for you and remember your preferences.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
              <Shield size={24} className="text-neon-pink" /> 3. Managing Cookies
            </h2>
            <p>
              Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org" target="_blank" className="text-neon-pink hover:underline">www.allaboutcookies.org</a>.
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
