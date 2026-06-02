"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, MessageCircle, Mail, Phone, LifeBuoy, Search, X, Send, User } from 'lucide-react';
import Link from 'next/link';

export default function HelpCenter() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: 'Hello! How can I help you today?' }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newHistory = [...chatHistory, { role: 'user', text: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage('');

    // Mock bot response
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'bot', text: 'Thanks for your message! A support agent will be with you shortly.' }]);
    }, 1000);
  };

  const faqs = [
    {
      question: "How do I download my purchased assets?",
      answer: "After a successful purchase, your assets will be available in your dashboard under the 'Purchases' section. You'll also receive an email with a download link."
    },
    {
      question: "What is your refund policy?",
      answer: "Due to the digital nature of our products, we generally do not offer refunds once an asset has been downloaded. However, if there's a technical issue with the file, please contact our support team."
    },
    {
      question: "Can I use the assets for client projects?",
      answer: "Yes, our standard license allows you to use the assets for both personal and commercial client projects. Please check the specific license terms for each asset."
    },
    {
      question: "How do I get support for a specific template?",
      answer: "Each asset has a dedicated support channel. You can contact the seller directly through the product page or use our general support ticket system."
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
          <div className="w-20 h-20 rounded-3xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mx-auto mb-8 text-neon-purple">
            <HelpCircle size={40} />
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tighter mb-6 uppercase">
            Help <span className="text-neon-purple">Center</span>
          </h1>
          <p className="text-white/40 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Need assistance? Our support team is here to help you with any questions or issues.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="glass-card p-10 text-center group hover:border-neon-purple/30 transition-all duration-500">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-8 group-hover:bg-neon-purple/10 transition-colors">
              <MessageCircle size={32} className="text-white/40 group-hover:text-neon-purple transition-colors" />
            </div>
            <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Live Chat</h3>
            <p className="text-white/40 text-sm mb-8">Chat with our support experts in real-time for quick assistance.</p>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-full py-4 bg-neon-purple/10 border border-neon-purple/20 text-neon-purple font-black text-xs uppercase tracking-widest rounded-xl hover:bg-neon-purple hover:text-white transition-all"
            >
              Start Chat
            </button>
          </div>

          <div className="glass-card p-10 text-center group hover:border-neon-blue/30 transition-all duration-500">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-8 group-hover:bg-neon-blue/10 transition-colors">
              <Mail size={32} className="text-white/40 group-hover:text-neon-blue transition-colors" />
            </div>
            <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Email Support</h3>
            <p className="text-white/40 text-sm mb-8">Send us an email and we&apos;ll get back to you within 24 hours.</p>
            <a 
              href="mailto:support@neuronix.ai"
              className="block w-full py-4 bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-center font-black text-xs uppercase tracking-widest rounded-xl hover:bg-neon-blue hover:text-white transition-all"
            >
              Send Email
            </a>
          </div>

          <div className="glass-card p-10 text-center group hover:border-neon-pink/30 transition-all duration-500">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-8 group-hover:bg-neon-pink/10 transition-colors">
              <LifeBuoy size={32} className="text-white/40 group-hover:text-neon-pink transition-colors" />
            </div>
            <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Knowledge Base</h3>
            <p className="text-white/40 text-sm mb-8">Browse our extensive library of articles and tutorials.</p>
            <Link 
              href="/docs"
              className="block w-full py-4 bg-neon-pink/10 border border-neon-pink/20 text-neon-pink text-center font-black text-xs uppercase tracking-widest rounded-xl hover:bg-neon-pink hover:text-white transition-all"
            >
              Browse Docs
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-12 uppercase tracking-tighter text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8 group hover:border-white/20 transition-all duration-500"
              >
                <h4 className="text-lg font-black mb-4 group-hover:text-neon-purple transition-colors">{faq.question}</h4>
                <p className="text-white/40 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-8 right-8 w-full max-w-[400px] h-[600px] glass-card flex flex-col z-[100] overflow-hidden border-neon-purple/30 shadow-2xl"
          >
            <div className="p-6 bg-neon-purple/10 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                  <MessageCircle size={20} className="text-neon-purple" />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest">Support Chat</h4>
                  <p className="text-[10px] text-neon-purple font-black uppercase tracking-tighter">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl transition-all"
              >
                <X size={20} className="text-white/30" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-neon-purple text-black font-bold' 
                      : 'bg-white/5 border border-white/10 text-white/70'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-6 border-t border-white/10 bg-black/40">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-neon-purple transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-neon-purple text-black rounded-lg hover:bg-neon-purple/80 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

