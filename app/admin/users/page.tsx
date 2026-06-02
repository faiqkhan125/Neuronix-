"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Filter, ShieldAlert, 
  ShieldCheck, MoreVertical, Mail, Calendar,
  ShoppingBag, Package, AlertCircle, XCircle
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { SafeImage } from '@/components/SafeImage';
import { mockUsers, mockProjects } from '@/lib/store';

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const users = await mockUsers.getAll();
      setProfiles(users || []);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'unsuspend') => {
    setActionLoading(userId);
    try {
      await mockUsers.updateProfile(userId, { is_suspended: action === 'suspend' });
      await fetchUsers();
    } catch (err) {
      console.error('User action error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckOverdue = async () => {
    if (!confirm('This will check all completed orders and suspend sellers who haven\'t paid commission in 48 hours. Continue?')) return;
    
    try {
      const allProjects = await mockProjects.getAll();
      const now = new Date();
      let suspendedCount = 0;
      
      for (const p of profiles) {
        // Simple logic: if user has pending commissions, suspend them
        const hasPendingCommissions = (allProjects || []).some((proj: any) => 
          proj.sellerId === p.id && proj.status === 'pending_payment'
        );
        
        if (hasPendingCommissions && !p.is_suspended) {
          suspendedCount++;
          await mockUsers.updateProfile(p.id, { is_suspended: true });
        }
      }
      
      if (suspendedCount > 0) {
        await fetchUsers();
        alert(`${suspendedCount} users suspended for overdue commissions.`);
      } else {
        alert('No overdue commissions found.');
      }
    } catch (err) {
      console.error('Check overdue error:', err);
    }
  };

  const filteredUsers = profiles.filter(p => {
    const fullName = p.full_name || p.fullName || '';
    const username = p.username || '';
    const matchesSearch = username.toLowerCase().includes(search.toLowerCase()) || fullName.toLowerCase().includes(search.toLowerCase());
    const isSuspended = p.is_suspended || p.isSuspended;
    const matchesFilter = filter === 'all' || (filter === 'suspended' && isSuspended) || (filter === 'active' && !isSuspended);
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">USERS</h1>
            <p className="text-white/40 text-sm">Manage user accounts and system access.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCheckOverdue}
              className="px-4 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all flex items-center gap-2"
            >
              <ShieldAlert size={18} /> CHECK OVERDUE
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text"
                placeholder="Search users..."
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
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Stats</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
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
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-white/20">
                        <Users size={48} />
                        <p className="text-sm font-bold">No users found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden relative">
                            <SafeImage 
                              src={user.avatar_url || user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                              alt={user.username} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold group-hover:text-neon-blue transition-colors">{user.full_name || user.fullName}</p>
                            <p className="text-[10px] text-white/40 font-mono">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${user.role === 'admin' ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20' : user.role === 'seller' ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/20' : 'bg-white/5 text-white/40 border-white/10'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-xs text-white/40" title="Purchases">
                            <ShoppingBag size={14} />
                            <span>{user.purchasedProjects?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-white/40" title="Wishlist">
                            <AlertCircle size={14} />
                            <span>{user.wishlist?.length || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-white/40">{new Date(user.joined_at || user.joinedAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        {(user.is_suspended || user.isSuspended) ? (
                          <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                            <XCircle size={14} />
                            Suspended
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                            <ShieldCheck size={14} />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-white/5 rounded-lg transition-all text-white/40 hover:text-white">
                            <Mail size={18} />
                          </button>
                          {user.role !== 'admin' && (
                            (user.is_suspended || user.isSuspended) ? (
                              <button 
                                disabled={actionLoading === user.id}
                                onClick={() => handleUserAction(user.id, 'unsuspend')}
                                className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                              >
                                {actionLoading === user.id ? '...' : 'Unsuspend'}
                              </button>
                            ) : (
                              <button 
                                disabled={actionLoading === user.id}
                                onClick={() => handleUserAction(user.id, 'suspend')}
                                className="px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-all disabled:opacity-50"
                              >
                                {actionLoading === user.id ? '...' : 'Suspend'}
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
