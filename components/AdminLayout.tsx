"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, Package, Users, Bell, 
  Settings, LogOut, ChevronRight, Menu, X,
  TrendingUp, ShoppingBag, AlertCircle, CheckCircle2,
  Layers, MessageSquare, DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SafeImage } from '@/components/SafeImage';
import { mockAuth } from '@/lib/store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const checkAdmin = async () => {
      try {
        const data = await mockAuth.getCurrentUser();
        if (data && data.user && (data.user.role === 'admin' || data.user.email === 'neuronixaicareers@gmail.com' || data.user.email === 'faiqkhan1882006@gmail.com')) {
          setIsAdmin(true);
          setProfile(data.profile);
        } else {
          router.push('/');
        }
      } catch (err) {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [router, isMounted]);

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Projects', href: '/admin/projects' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Bell, label: 'Announcements', href: '/admin/announcements' },
    { icon: DollarSign, label: 'Commissions', href: '/admin/commissions' },
    { icon: Layers, label: 'Categories', href: '/admin/categories' },
    { icon: MessageSquare, label: 'Reviews', href: '/admin/reviews' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-white/5 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-sm">N</span>
            </div>
            <span className="text-lg font-bold tracking-tighter">ADMIN PANEL</span>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive ? 'bg-neon-blue text-black font-bold' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                >
                  <Icon size={20} className={isActive ? 'text-black' : 'text-white/50 group-hover:text-neon-blue'} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <button 
              onClick={() => router.push('/')}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <LogOut size={20} />
              <span>Back to Site</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <header className="h-16 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold">Neuronix Admin</span>
              <span className="text-[10px] text-white/40">Super Admin</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-neon-blue/20 border border-neon-blue/30 flex items-center justify-center overflow-hidden relative">
              <SafeImage 
                src={profile?.avatarUrl || profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`} 
                alt="Admin" 
                fill 
                className="object-cover" 
              />
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
