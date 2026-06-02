"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, Search, Filter, Eye, 
  CheckCircle2, XCircle, Clock, ExternalLink,
  Image as ImageIcon, User, Package, AlertCircle
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { SafeImage } from '@/components/SafeImage';
import { mockProjects, mockOrders } from '@/lib/store';

export default function AdminCommissions() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedProof, setSelectedProof] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProofs();
  }, []);

  const fetchProofs = async () => {
    try {
      const [allProjects, allOrders] = await Promise.all([
        mockProjects.getAll(),
        mockOrders.getAll()
      ]);
      const allProofs: any[] = [];
      
      // Extract listing proofs from projects
      (allProjects || []).forEach((p: any) => {
        if (p.paymentProof) {
          allProofs.push({
            id: p.id,
            title: p.title,
            sellerId: p.authorUsername || p.authorId,
            type: 'listing',
            proof: {
              ...p.paymentProof,
              submittedAt: p.createdAt
            }
          });
        }
      });
      
      // Extract commission proofs from orders (if any)
      (allOrders || []).forEach((o: any) => {
        if (o.seller_commission_proof) {
          allProofs.push({
            id: o.id,
            title: `Commission for ${o.projectTitle || o.projects?.title}`,
            sellerId: o.sellerUsername || o.sellerId,
            type: 'commission',
            proof: o.seller_commission_proof
          });
        }
      });
      
      setProofs(allProofs);
    } catch (err) {
      console.error('Fetch proofs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProofs = proofs.filter(p => {
    const matchesFilter = filter === 'all' || p.type === filter;
    const matchesSearch = p.id.toLowerCase().includes(search.toLowerCase()) || p.sellerId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">COMMISSIONS & FEES</h1>
            <p className="text-white/40 text-sm">Verify all listing fees and sales commissions.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text"
                placeholder="Search proofs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-neon-blue transition-all w-64"
              />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-neon-blue transition-all"
            >
              <option value="all">All Types</option>
              <option value="listing">Listing Fee ($1)</option>
              <option value="commission">Sales Commission (10%)</option>
            </select>
          </div>
        </div>

        {/* Proofs Table */}
        <div className="glass-card border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Reference</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Seller</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Transaction ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-8">
                        <div className="h-4 bg-white/5 rounded w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredProofs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-white/20">
                        <DollarSign size={48} />
                        <p className="text-sm font-bold">No payment proofs found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProofs.map((proof) => (
                    <tr key={proof.id + proof.type} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${proof.type === 'listing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-neon-blue/10 text-neon-blue border-neon-blue/20'}`}>
                          {proof.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold truncate max-w-[200px]">{proof.title}</span>
                          <span className="text-[10px] text-white/40 font-mono">{proof.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center text-[10px] font-bold">
                            {proof.sellerId.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-xs text-white/60">@{proof.sellerId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-neon-blue">{proof.proof.transactionId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-white/40">{new Date(proof.proof.submittedAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            setSelectedProof(proof);
                            setShowModal(true);
                          }}
                          className="p-2 hover:bg-neon-blue/10 hover:text-neon-blue rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Proof Detail Modal */}
        <AnimatePresence>
          {showModal && selectedProof && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden relative z-10 shadow-2xl"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${selectedProof.type === 'listing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-neon-blue/10 text-neon-blue border-neon-blue/20'}`}>
                        {selectedProof.type} Proof
                      </span>
                      <h2 className="text-2xl font-black tracking-tighter mt-2">Transaction Verification</h2>
                    </div>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-white/5 rounded-full"
                    >
                      <XCircle size={24} className="text-white/20" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Transaction ID</p>
                        <p className="text-sm font-mono font-bold text-neon-blue">{selectedProof.proof.transactionId}</p>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Submitted At</p>
                        <p className="text-sm font-bold">{new Date(selectedProof.proof.submittedAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black group">
                      <SafeImage 
                        src={selectedProof.proof.screenshotUrl} 
                        alt="Payment Proof" 
                        fill 
                        className="object-contain" 
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a 
                          href={selectedProof.proof.screenshotUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-white text-black font-black rounded-xl flex items-center gap-2 hover:scale-105 transition-all"
                        >
                          <ExternalLink size={20} /> VIEW FULL IMAGE
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        onClick={() => setShowModal(false)}
                        className="flex-1 py-4 bg-emerald-500 text-black font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={20} /> MARK AS VERIFIED
                      </button>
                      <button 
                        onClick={() => setShowModal(false)}
                        className="flex-1 py-4 bg-red-500/10 border border-red-500/20 text-red-500 font-black rounded-xl hover:bg-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle size={20} /> FLAG AS FRAUD
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
