"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, Loader2, ArrowRight, Mail, ShieldAlert } from 'lucide-react';
import { Navbar, Footer } from '@/components/Layout';
import Link from 'next/link';
import { getStore, saveStore } from '@/lib/store';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { currentUser, notifications: allNotifications } = getStore();
      if (currentUser) {
        const userNotifications = (allNotifications || []).filter((n: any) => n.userId === currentUser.user.id);
        setNotifications(userNotifications);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    setMarking(id);
    try {
      const { notifications: allNotifications } = getStore();
      const newNotifications = allNotifications.map((n: any) => n.id === id ? { ...n, isRead: true } : n);
      saveStore({ notifications: newNotifications });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Mark as read error:', err);
    } finally {
      setMarking(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { currentUser, notifications: allNotifications } = getStore();
      if (currentUser) {
        const newNotifications = allNotifications.map((n: any) => n.userId === currentUser.user.id ? { ...n, isRead: true } : n);
        saveStore({ notifications: newNotifications });
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error('Mark all as read error:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { notifications: allNotifications } = getStore();
      const newNotifications = allNotifications.filter((n: any) => n.id !== id);
      saveStore({ notifications: newNotifications });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Delete notification error:', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'warning': return <ShieldAlert className="text-amber-500" size={20} />;
      case 'info': return <Info className="text-neon-blue" size={20} />;
      default: return <Bell className="text-white/40" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter mb-2">NOTIFICATIONS</h1>
            <p className="text-sm sm:text-base text-white/40">Stay updated with your neural activity.</p>
          </div>
          <button 
            onClick={markAllAsRead}
            className="w-full sm:w-auto px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] sm:text-xs font-bold hover:bg-white/10 transition-all"
          >
            MARK ALL AS READ
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-40 gap-4">
            <Loader2 className="animate-spin text-neon-blue" size={32} />
            <p className="text-xs sm:text-sm text-white/40 font-bold animate-pulse">DECRYPTING MESSAGES...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-40 text-center glass-card border-white/5 px-6">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Bell size={32} className="text-white/10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tighter mb-2">ALL CLEAR</h2>
            <p className="text-sm sm:text-base text-white/40 max-w-md mb-8">
              No new notifications at the moment. We&apos;ll alert you when something happens.
            </p>
            <Link 
              href="/marketplace" 
              className="w-full sm:w-auto px-8 py-4 bg-neon-blue text-black font-black rounded-xl neon-glow-blue hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              BROWSE MARKETPLACE <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {notifications.map((notif, index) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group glass-card p-4 sm:p-6 border-white/5 flex items-start gap-4 transition-all ${notif.read ? 'opacity-60 grayscale' : 'neon-glow-purple/5'}`}
                >
                  <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 shrink-0 ${!notif.read ? 'animate-pulse' : ''}`}>
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                      <h3 className="text-base sm:text-lg font-black tracking-tighter truncate">{notif.title}</h3>
                      <span className="text-[8px] sm:text-[10px] text-white/20 font-mono">{new Date(notif.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/40 mb-4 line-clamp-3 sm:line-clamp-none">{notif.message}</p>
                    
                    <div className="flex items-center gap-4">
                      {!notif.read && (
                        <button 
                          onClick={() => markAsRead(notif.id)}
                          disabled={marking === notif.id}
                          className="text-[10px] sm:text-xs font-black text-neon-blue hover:underline disabled:opacity-50"
                        >
                          {marking === notif.id ? 'MARKING...' : 'MARK AS READ'}
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notif.id)}
                        className="text-[10px] sm:text-xs font-black text-red-500/60 hover:text-red-500 transition-colors"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
