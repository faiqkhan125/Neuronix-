"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockAuth, saveStore, getStore, mockUsers } from '@/lib/store';
import { motion } from 'motion/react';
import { ShoppingBag, LayoutDashboard, Check, Loader2 } from 'lucide-react';

export default function RoleSelection() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const data = await mockAuth.getCurrentUser();
      if (!data) {
        router.push('/auth/signin');
        return;
      }
      setUser(data.user);
    };
    checkUser();
  }, [router]);

  const handleRoleSelect = async (role: string) => {
    setSelectedRole(role);
    setLoading(true);
    setError('');
    try {
      const data = await mockAuth.getCurrentUser();
      if (!data) throw new Error('No user found');

      await mockUsers.updateProfile(data.user.id, { role });
      
      router.push('/onboarding/profile-setup');
    } catch (err: any) {
      console.error('Error saving role:', err);
      setError(err.message || 'Failed to save role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'seller',
      title: 'I am a Freelancer',
      description: 'I want to sell high-quality website projects and templates.',
      icon: LayoutDashboard,
      color: 'from-neon-blue to-blue-600',
    },
    {
      id: 'buyer',
      title: 'I am a Client',
      description: 'I want to browse and buy ready-to-use websites.',
      icon: ShoppingBag,
      color: 'from-neon-purple to-purple-600',
    },
    {
      id: 'both',
      title: 'I am Both',
      description: 'I want to both buy and sell digital assets on the platform.',
      icon: Check,
      color: 'from-emerald-400 to-emerald-600',
    }
  ];

  return (
    <div suppressHydrationWarning className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-dark-bg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,255,0.05),transparent_50%)]"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">What best describes you?</h1>
        <p className="text-white/50 text-lg mb-12">Select your primary role to personalize your experience.</p>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect(role.id)}
                disabled={loading}
                className={`glass-card p-8 text-left group relative overflow-hidden ${
                  selectedRole === role.id ? 'border-neon-blue bg-neon-blue/5' : 'hover:border-white/20'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 neon-glow-blue group-hover:scale-110 transition-transform`}>
                  <Icon size={28} className="text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{role.description}</p>
                
                {loading && selectedRole === role.id && (
                  <div className="absolute inset-0 bg-dark-bg/60 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="animate-spin text-neon-blue" size={32} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
