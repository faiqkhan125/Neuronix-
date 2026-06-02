"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Layers, X, 
  Tag, Search, AlertCircle, Edit3, Package
} from 'lucide-react';
import { mockCategories } from '@/lib/store';
import AdminLayout from '@/components/AdminLayout';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await mockCategories.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Fetch categories error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await mockCategories.create(newCategory);
      fetchCategories();
      setShowModal(false);
      setNewCategory({ name: '', slug: '', description: '' });
    } catch (err) {
      console.error('Create category error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await mockCategories.delete(id);
      fetchCategories();
    } catch (err) {
      console.error('Delete category error:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">CATEGORIES</h1>
            <p className="text-white/40 text-sm">Manage marketplace categories and taxonomy.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-neon-blue text-black font-black rounded-xl neon-glow-blue hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            NEW CATEGORY
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-white/5 border border-white/10 rounded-3xl animate-pulse"></div>
            ))
          ) : categories.length === 0 ? (
            <div className="lg:col-span-3 py-20 text-center glass-card border-white/5">
              <div className="flex flex-col items-center gap-3 text-white/20">
                <Layers size={48} />
                <p className="text-sm font-bold">No categories found</p>
              </div>
            </div>
          ) : (
            categories.map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 border-white/5 relative group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple">
                    <Tag size={24} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1">{cat.name}</h3>
                <p className="text-xs font-mono text-neon-blue mb-3">/{cat.slug}</p>
                <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">{cat.description || 'No description provided.'}</p>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                    ID: {cat.id}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <Package size={12} />
                    <span>0 Projects</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Create Modal */}
        <AnimatePresence>
          {showModal && (
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
                className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden relative z-10 shadow-2xl"
              >
                <form onSubmit={handleCreate} className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tighter">NEW CATEGORY</h2>
                    <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-full">
                      <X size={20} className="text-white/40" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Category Name</label>
                      <input 
                        required
                        type="text"
                        value={newCategory.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                          setNewCategory({ ...newCategory, name, slug });
                        }}
                        placeholder="e.g. Computer Vision"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-neon-blue transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Slug</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm">/</span>
                        <input 
                          required
                          type="text"
                          value={newCategory.slug}
                          onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                          className="w-full pl-7 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-neon-blue transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Description</label>
                      <textarea 
                        rows={3}
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        placeholder="What kind of projects go here?"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-neon-blue transition-all resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={actionLoading}
                    type="submit"
                    className="w-full py-4 bg-neon-blue text-black font-black rounded-xl neon-glow-blue hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <Plus size={20} />}
                    CREATE CATEGORY
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
