"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, ShoppingBag, Users, Package, 
  DollarSign, AlertCircle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Clock,
  Layers, MessageSquare, Megaphone, Cpu, Plus
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { mockAnnouncements, mockSaasPlatforms, mockProjects, mockOrders, mockUsers } from '@/lib/store';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [announcement, setAnnouncement] = useState('');
  const [saasName, setSaasName] = useState('');
  const [saasDesc, setSaasDesc] = useState('');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [saasPlatforms, setSaasPlatforms] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      try {
        const [users, projects, orders, ann, saas] = await Promise.all([
          mockUsers.getAll(),
          mockProjects.getAll(),
          mockOrders.getAll(),
          mockAnnouncements.getAll(),
          mockSaasPlatforms.getAll()
        ]);
        
        setAnnouncements(ann || []);
        setSaasPlatforms(saas || []);
        
        // Mock stats calculation
        const mockStats = {
          totalRevenue: (orders || []).reduce((acc: number, o: any) => acc + (o.price || 0), 0),
          totalOrders: (orders || []).length,
          totalUsers: (users || []).length,
          totalProjects: (projects || []).length,
          pendingProjects: (projects || []).filter((p: any) => p.status === 'pending_approval').length,
          pendingCommissions: (projects || []).filter((p: any) => p.status === 'pending_payment').length
        };
        
        const mockSalesData = [
          { date: '2026-03-18', revenue: 4000 },
          { date: '2026-03-19', revenue: 3000 },
          { date: '2026-03-20', revenue: 2000 },
          { date: '2026-03-21', revenue: 2780 },
          { date: '2026-03-22', revenue: 1890 },
          { date: '2026-03-23', revenue: 2390 },
          { date: '2026-03-24', revenue: 3490 },
        ];
        
        setStats(mockStats);
        setSalesData(mockSalesData);
      } catch (err) {
        console.error('Fetch data error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!isMounted || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-10 h-10 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: `$${stats?.totalRevenue || 0}`, icon: DollarSign, color: 'emerald', change: '+12.5%' },
    { label: 'Total Sales', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'neon-blue', change: '+8.2%' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'neon-purple', change: '+15.3%' },
    { label: 'Total Projects', value: stats?.totalProjects || 0, icon: Package, color: 'amber', change: '+4.1%' },
  ];

  const handleAddAnnouncement = async () => {
    if (!announcement.trim()) return;
    try {
      await mockAnnouncements.create({
        title: 'Platform Update',
        content: announcement,
        type: 'info'
      });
      setAnnouncement('');
      const ann = await mockAnnouncements.getAll();
      setAnnouncements(ann);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddSaas = async () => {
    if (!saasName.trim() || !saasDesc.trim()) return;
    try {
      await mockSaasPlatforms.create({ 
        title: saasName, 
        desc: saasDesc,
        status: 'coming_soon'
      });
      setSaasName('');
      setSaasDesc('');
      const saas = await mockSaasPlatforms.getAll();
      setSaasPlatforms(saas);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">ADMIN CONTROL</h1>
            <p className="text-white/40 text-sm">Neuronix AI Central Command. Manage the future.</p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            {['overview', 'announcements', 'saas'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-neon-blue text-black shadow-[0_0_20px_rgba(0,245,255,0.3)]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-6 border-white/5 relative group overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 border border-${stat.color}/20 flex items-center justify-center`}>
                        <Icon size={24} className={`text-${stat.color}`} />
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                        <ArrowUpRight size={14} />
                        {stat.change}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                      <h3 className="text-2xl font-black">{stat.value}</h3>
                    </div>
                    <div className={`absolute bottom-0 left-0 w-full h-1 bg-${stat.color}/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>
                  </motion.div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card p-8 border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black tracking-tight">REVENUE OVERVIEW</h3>
                  <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#ffffff20" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(val) => val.split('-').slice(1).join('/')}
                      />
                      <YAxis 
                        stroke="#ffffff20" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(val) => `$${val}`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        itemStyle={{ color: '#00F0FF', fontWeight: 'bold' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#00F0FF" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-8 border-white/5">
                <h3 className="text-xl font-black tracking-tight mb-8">PENDING TASKS</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <Package size={20} className="text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">Project Approvals</p>
                      <p className="text-xs text-white/40">{stats?.pendingProjects || 0} projects waiting</p>
                    </div>
                    <ArrowRight size={16} className="text-white/20" />
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
                      <DollarSign size={20} className="text-neon-purple" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">Commission Proofs</p>
                      <p className="text-xs text-white/40">{stats?.pendingCommissions || 0} proofs to verify</p>
                    </div>
                    <ArrowRight size={16} className="text-white/20" />
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Users size={20} className="text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">Seller Applications</p>
                      <p className="text-xs text-white/40">0 applications pending</p>
                    </div>
                    <ArrowRight size={16} className="text-white/20" />
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 border border-white/5 rounded-3xl text-center">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">System Health</p>
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-bold">All Systems Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-8 border-white/5">
              <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-3">
                <Megaphone className="text-neon-blue" />
                NEW ANNOUNCEMENT
              </h3>
              <div className="space-y-4">
                <textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="What would you like to announce to the platform?"
                  className="glass-input w-full h-32 resize-none"
                />
                <button
                  onClick={handleAddAnnouncement}
                  className="premium-button w-full bg-neon-blue text-black neon-glow-blue flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Post Announcement
                </button>
              </div>
            </div>

            <div className="glass-card p-8 border-white/5">
              <h3 className="text-xl font-black tracking-tight mb-6">PAST ANNOUNCEMENTS</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {announcements.length === 0 ? (
                  <p className="text-white/20 text-center py-8">No announcements yet.</p>
                ) : (
                  announcements.map((ann) => (
                    <div key={ann.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-sm text-white/80 mb-2">{ann.content}</p>
                      <p className="text-[10px] text-white/20 font-bold">{new Date(ann.created_at).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'saas' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-8 border-white/5">
              <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-3">
                <Cpu className="text-neon-purple" />
                LAUNCH SAAS PLATFORM
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block">Platform Name</label>
                  <input
                    type="text"
                    value={saasName}
                    onChange={(e) => setSaasName(e.target.value)}
                    placeholder="e.g. Neuronix Vision"
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block">Description</label>
                  <textarea
                    value={saasDesc}
                    onChange={(e) => setSaasDesc(e.target.value)}
                    placeholder="Describe the SaaS platform..."
                    className="glass-input w-full h-24 resize-none"
                  />
                </div>
                <button
                  onClick={handleAddSaas}
                  className="premium-button w-full bg-neon-purple text-white neon-glow-purple flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Launch Platform
                </button>
              </div>
            </div>

            <div className="glass-card p-8 border-white/5">
              <h3 className="text-xl font-black tracking-tight mb-6">LIVE SAAS PLATFORMS</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {saasPlatforms.length === 0 ? (
                  <p className="text-white/20 text-center py-8">No SaaS platforms launched yet.</p>
                ) : (
                  saasPlatforms.map((saas) => (
                    <div key={saas.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
                        <Cpu size={20} className="text-neon-purple" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{saas.title}</p>
                        <p className="text-xs text-white/40">{saas.desc}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function ArrowRight({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
