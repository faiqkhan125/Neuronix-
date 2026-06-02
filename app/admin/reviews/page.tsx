"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Trash2, Star, Search, 
  Filter, User, Package, AlertCircle,
  CheckCircle2, XCircle
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { mockReviews } from '@/lib/store';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await mockReviews.getAll();
      setReviews(data || []);
    } catch (err) {
      console.error('Fetch reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;
    
    setActionLoading(id);
    try {
      await mockReviews.delete(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      (r.content?.toLowerCase().includes(search.toLowerCase())) ||
      (r.projects?.title?.toLowerCase().includes(search.toLowerCase())) ||
      (r.profiles?.username?.toLowerCase().includes(search.toLowerCase()));
    
    const matchesFilter = filter === 'all' || 
      (filter === 'positive' && r.rating >= 4) ||
      (filter === 'negative' && r.rating <= 2);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">REVIEWS</h1>
            <p className="text-white/40 text-sm">Monitor and manage marketplace feedback.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text"
                placeholder="Search reviews..."
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
              <option value="all">All Ratings</option>
              <option value="positive">Positive (4-5★)</option>
              <option value="negative">Negative (1-2★)</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-white/5 border border-white/10 rounded-3xl animate-pulse"></div>
            ))
          ) : filteredReviews.length === 0 ? (
            <div className="py-20 text-center glass-card border-white/5">
              <div className="flex flex-col items-center gap-3 text-white/20">
                <MessageSquare size={48} />
                <p className="text-sm font-bold">No reviews found</p>
              </div>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <button 
                        disabled={actionLoading === review.id}
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                      >
                        {actionLoading === review.id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                    
                    <p className="text-white/80 text-sm leading-relaxed mb-4 italic">
                      &quot;{review.content}&quot;
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
                          <User size={12} className="text-neon-blue" />
                        </div>
                        <span className="text-xs font-bold text-white/60">@{review.profiles?.username || 'unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
                          <Package size={12} className="text-neon-purple" />
                        </div>
                        <span className="text-xs font-bold text-white/60">{review.projects?.title || 'Unknown Project'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
