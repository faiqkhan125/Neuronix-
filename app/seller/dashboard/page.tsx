"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerDashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.push('/dashboard/seller');
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
