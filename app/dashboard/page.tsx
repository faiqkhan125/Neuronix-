"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { mockAuth } from '@/lib/store';
import { Loader2 } from 'lucide-react';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const data = await mockAuth.getCurrentUser();
        
        if (!data || !data.user) {
          router.push('/auth/signin');
          return;
        }

        if (data.user.role === 'seller' || data.user.role === 'admin') {
          router.push('/dashboard/seller');
        } else {
          router.push('/dashboard/buyer');
        }
      } catch (err) {
        console.error('Redirect error:', err);
        router.push('/auth/signin');
      }
    };
    checkRole();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-neon-blue animate-spin" />
        <p className="text-white/40 font-medium animate-pulse">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
