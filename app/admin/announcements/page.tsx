"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, Plus, Trash2, CheckCircle2, 
  AlertCircle, Info, X, Send
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { mockAnnouncements } from '@/lib/store';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'info'
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const allAnnouncements = await mockAnnouncements.getAll();
      setAnnouncements(allAnnouncements || []);
    } catch (err) {
      console.error('Fetch announcements error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await mockAnnouncements.create(newAnnouncement);
      
      fetchAnnouncements();
      setShowModal(false);
      setNewAnnouncement({ title: '', content: '', type: 'info' });
    } catch (err) {
      console.error('Create announcement error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await mockAnnouncements.delete(id);
      fetchAnnouncements();
    } catch (err) {
      console.error('Delete announcement error:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">ANNOUNCEMENTS</h1>
            <p className="text-white/40 text-sm">Broadcast messages to all users site-wide.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-neon-blue text-black font-black rounded-xl neon-glow-blue hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            NEW ANNOUNCEMENT
          </button>
        </div>

        {/* Announcements List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 bg-white/5 border border-white/10 rounded-3xl animate-pulse"></div>
            ))
          ) : announcements.length === 0 ? (
            <div className="md:col-span-2 py-20 text-center glass-card border-white/5">
              <div className="flex flex-col items-center gap-3 text-white/20">
                <Bell size={48} />
                <p className="text-sm font-bold">No active announcements</p>
              </div>
            </div>
          ) : (
            announcements.map((ann) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 border-white/5 relative group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    ann.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    ann.type === 'warning' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                  }`}>
                    {ann.type === 'success' ? <CheckCircle2 size={20} /> :
                     ann.type === 'warning' ? <AlertCircle size={20} /> :
                     <Info size={20} />}
                  </div>
                  <button 
                    onClick={() => handleDelete(ann.id)}
                    className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3 className="text-lg font-bold mb-2">{ann.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed mb-4">{ann.content}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                    Posted {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    ann.type === 'success' ? 'text-emerald-400' :
                    ann.type === 'warning' ? 'text-amber-400' :
                    'text-neon-blue'
                  }`}>
                    {ann.type}
                  </span>
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
                    <h2 className="text-2xl font-black tracking-tighter">NEW ANNOUNCEMENT</h2>
                    <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-full">
                      <X size={20} className="text-white/40" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Title</label>
                      <input 
                        required
                        type="text"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        placeholder="Maintenance Update, New Feature, etc."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-neon-blue transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['info', 'success', 'warning'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setNewAnnouncement({ ...newAnnouncement, type: t as any })}
                            className={`py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${
                              newAnnouncement.type === t 
                                ? 'bg-white/10 border-white/20 text-white' 
                                : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Content</label>
                      <textarea 
                        required
                        rows={4}
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                        placeholder="Write your message here..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-neon-blue transition-all resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={actionLoading}
                    type="submit"
                    className="w-full py-4 bg-neon-blue text-black font-black rounded-xl neon-glow-blue hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}
                    PUBLISH ANNOUNCEMENT
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
