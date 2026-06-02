"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, CheckCircle2, XCircle, Eye, 
  Search, Filter, ExternalLink, Clock,
  DollarSign, Image as ImageIcon, AlertCircle
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { SafeImage } from '@/components/SafeImage';
import { getStore, saveStore, mockProjects } from '@/lib/store';

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const allProjects = await mockProjects.getAll();
      setProjects(allProjects || []);
    } catch (err) {
      console.error('Fetch projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject', reason?: string) => {
    setActionLoading(true);
    try {
      const updates = { 
        status: action === 'approve' ? 'live' : 'rejected',
        rejectionReason: reason
      };
      
      await mockProjects.update(id, updates);
      
      // Update local state
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      setShowModal(false);
    } catch (err) {
      console.error('Project action error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">PROJECTS</h1>
            <p className="text-white/40 text-sm">Manage and review all project submissions.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text"
                placeholder="Search projects..."
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
              <option value="all">All Status</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="live">Live</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Projects Table */}
        <div className="glass-card border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Project</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Seller</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
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
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-white/20">
                        <Package size={48} />
                        <p className="text-sm font-bold">No projects found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden relative">
                            <SafeImage 
                              src={project.thumbnail || 'https://picsum.photos/seed/project/100/100'} 
                              alt={project.title} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold group-hover:text-neon-blue transition-colors">{project.title}</p>
                            <p className="text-[10px] text-white/40 font-mono">{project.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center text-[10px] font-bold">
                            {project.authorUsername?.slice(0, 2).toUpperCase() || '??'}
                          </div>
                          <span className="text-xs text-white/60">@{project.authorUsername || 'unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-emerald-400">${project.price}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-white/40">{new Date(project.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            setSelectedProject(project);
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

        {/* Project Detail Modal */}
        <AnimatePresence>
          {showModal && selectedProject && (
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
                className="w-full max-w-4xl bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden relative z-10 shadow-2xl"
              >
                <div className="p-8 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex gap-6">
                      <div className="w-32 h-32 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative">
                        <SafeImage 
                          src={selectedProject.thumbnail || 'https://picsum.photos/seed/project/200/200'} 
                          alt={selectedProject.title} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div>
                        <StatusBadge status={selectedProject.status} />
                        <h2 className="text-3xl font-black tracking-tighter mt-2">{selectedProject.title}</h2>
                        <p className="text-white/40 text-sm mt-1">Project ID: {selectedProject.id}</p>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                            <DollarSign size={14} className="text-emerald-400" />
                            <span className="text-sm font-bold text-emerald-400">${selectedProject.price}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                            <Clock size={14} className="text-white/40" />
                            <span className="text-xs text-white/60">{new Date(selectedProject.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-white/5 rounded-full transition-all"
                    >
                      <XCircle size={24} className="text-white/20" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <section>
                        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Description</h4>
                        <p className="text-sm text-white/60 leading-relaxed">{selectedProject.description}</p>
                      </section>

                      <section>
                        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.techStack?.map((tech: string) => (
                            <span key={tech} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold text-white/60">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </section>

                      <section>
                        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Listing Payment Proof ($1)</h4>
                        {selectedProject.paymentProof ? (
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/40">Transaction ID:</span>
                              <span className="text-xs font-mono font-bold text-neon-blue">{selectedProject.paymentProof.transactionId}</span>
                            </div>
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
                              <SafeImage 
                                src={selectedProject.paymentProof.screenshotUrl} 
                                alt="Payment Proof" 
                                fill 
                                className="object-contain" 
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-3 text-red-400">
                            <AlertCircle size={18} />
                            <span className="text-xs font-bold">No payment proof submitted</span>
                          </div>
                        )}
                      </section>
                    </div>

                    <div className="space-y-6">
                      <section>
                        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Project Files</h4>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                              <Package size={20} className="text-neon-blue" />
                            </div>
                            <div>
                              <p className="text-sm font-bold">Source Code</p>
                              <p className="text-[10px] text-white/40">ZIP Archive / Repository</p>
                            </div>
                          </div>
                          <a 
                            href={selectedProject.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/40 hover:text-white"
                          >
                            <ExternalLink size={18} />
                          </a>
                        </div>
                      </section>

                      {selectedProject.status === 'pending_approval' && (
                        <div className="pt-8 border-t border-white/5 space-y-4">
                          <h4 className="text-sm font-bold text-white/80">Review Decision</h4>
                          <div className="flex gap-4">
                            <button 
                              disabled={actionLoading}
                              onClick={() => handleAction(selectedProject.id, 'approve')}
                              className="flex-1 py-4 bg-emerald-500 text-black font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {actionLoading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <CheckCircle2 size={20} />}
                              APPROVE PROJECT
                            </button>
                            <button 
                              disabled={actionLoading}
                              onClick={() => {
                                const reason = prompt('Enter rejection reason:');
                                if (reason) handleAction(selectedProject.id, 'reject', reason);
                              }}
                              className="flex-1 py-4 bg-red-500/10 border border-red-500/20 text-red-500 font-black rounded-xl hover:bg-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {actionLoading ? <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : <XCircle size={20} />}
                              REJECT
                            </button>
                          </div>
                          <p className="text-[10px] text-white/20 text-center">
                            Approving will make the project live on the marketplace. Rejecting will notify the seller with your reason.
                          </p>
                        </div>
                      )}
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

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    live: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending_approval: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    pending_payment: 'bg-neon-blue/10 text-neon-blue border-neon-blue/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${styles[status] || 'bg-white/5 text-white/40 border-white/10'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
