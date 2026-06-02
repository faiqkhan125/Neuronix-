"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, XCircle, Clock, ExternalLink, 
  Eye, ShieldCheck, Loader2, AlertCircle,
  DollarSign, User, Calendar, Tag
} from 'lucide-react';
import { SafeImage } from '@/components/SafeImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockAuth, mockProjects } from '@/lib/store';

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const allProjects = await mockProjects.getAll();
        const pending = allProjects.filter((p: any) => p.status === 'pending_approval');
        setProjects(pending);
      } catch (err) {
        console.error('Error fetching pending projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, [router]);

  const handleAction = async (projectId: string, action: 'approve' | 'reject') => {
    setActionLoading(projectId);
    try {
      if (action === 'approve') {
        await mockProjects.update(projectId, { status: 'active' });
      } else {
        await mockProjects.update(projectId, { status: 'rejected' });
      }
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error('Error performing action:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="animate-spin text-neon-blue" size={48} suppressHydrationWarning />
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="min-h-screen pt-24 pb-20 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neon-purple/10 border border-neon-purple/20 rounded-full text-[10px] font-black uppercase tracking-widest text-neon-purple mb-6"
            >
              <ShieldCheck size={14} suppressHydrationWarning /> Admin Control Panel
            </motion.div>
            <h1 className="text-5xl font-black tracking-tighter">Project Approvals</h1>
            <p className="text-white/40 mt-2">Review and verify project uploads and payment proofs.</p>
          </div>
          <div className="flex gap-4">
            <div className="glass-card px-6 py-4 text-center">
              <div className="text-2xl font-black text-neon-blue">{projects.length}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-white/40">Pending</div>
            </div>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="glass-card p-20 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-400" suppressHydrationWarning />
            </div>
            <h2 className="text-2xl font-bold mb-2">Queue is Empty!</h2>
            <p className="text-white/40">All projects have been reviewed. Good job!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card overflow-hidden group border-white/5 hover:border-neon-blue/30 transition-all"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Project Preview */}
                    <div className="lg:w-1/3 relative aspect-video lg:aspect-auto">
                      <SafeImage 
                        src={project.thumbnail} 
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-neon-blue text-black text-[10px] font-black uppercase tracking-widest rounded-md">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="flex-1 p-8">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-4 flex-1">
                          <div>
                            <h3 className="text-2xl font-bold mb-1">{project.title}</h3>
                            <div className="flex items-center gap-4 text-xs text-white/40">
                              <span className="flex items-center gap-1"><User size={14} suppressHydrationWarning /> Seller ID: {project.sellerId}</span>
                              <span className="flex items-center gap-1"><Calendar size={14} suppressHydrationWarning /> {new Date(project.createdAt).toLocaleDateString()}</span>
                              <span className="flex items-center gap-1 text-neon-purple font-bold"><DollarSign size={14} suppressHydrationWarning /> ${project.price}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-white/60 line-clamp-2">{project.description}</p>

                          <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech: string) => (
                              <span key={tech} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold text-white/60 uppercase tracking-wider">
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-4 pt-4">
                            <Link 
                              href={project.demoUrl || '#'} 
                              target="_blank"
                              className="flex items-center gap-2 text-xs font-bold text-neon-blue hover:underline"
                            >
                              <ExternalLink size={14} suppressHydrationWarning /> Live Demo
                            </Link>
                            <Link 
                              href={project.fileUrl || '#'} 
                              target="_blank"
                              className="flex items-center gap-2 text-xs font-bold text-neon-purple hover:underline"
                            >
                              <Eye size={14} suppressHydrationWarning /> View Source/File
                            </Link>
                          </div>
                        </div>

                        {/* Payment Proof Section */}
                        <div className="md:w-72 p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neon-blue">
                            <DollarSign size={14} suppressHydrationWarning /> Payment Proof
                          </div>
                          <div className="space-y-2">
                            <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Transaction ID</div>
                            <div className="text-xs font-mono bg-black/40 p-2 rounded border border-white/5 break-all">
                              {project.paymentProof?.transactionId}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Screenshot</div>
                            <Link 
                              href={project.paymentProof?.screenshotUrl || '#'} 
                              target="_blank"
                              className="block relative aspect-video rounded-lg overflow-hidden border border-white/10 hover:border-neon-blue transition-all"
                            >
                              <SafeImage 
                                src={project.paymentProof?.screenshotUrl || ''} 
                                alt="Proof"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <ExternalLink size={20} suppressHydrationWarning />
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-4 mt-8 pt-8 border-t border-white/5">
                        <button 
                          onClick={() => handleAction(project.id, 'approve')}
                          disabled={actionLoading === project.id}
                          className="flex-1 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {actionLoading === project.id ? <Loader2 className="animate-spin" size={20} suppressHydrationWarning /> : <><CheckCircle2 size={20} suppressHydrationWarning /> Approve Project</>}
                        </button>
                        <button 
                          onClick={() => handleAction(project.id, 'reject')}
                          disabled={actionLoading === project.id}
                          className="flex-1 py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {actionLoading === project.id ? <Loader2 className="animate-spin" size={20} suppressHydrationWarning /> : <><XCircle size={20} suppressHydrationWarning /> Reject Project</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
