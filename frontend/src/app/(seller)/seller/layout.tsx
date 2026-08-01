'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Loader2 } from 'lucide-react';

import { SellerMobileNav } from '@/components/dashboard/seller/SellerMobileNav';

export default function SellerShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, role, token, isAuthenticated } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const hasCookieToken = typeof document !== 'undefined' && document.cookie.includes('token=');
    const hasStoreToken = !!token || isAuthenticated || !!user;

    if (!hasCookieToken && !hasStoreToken) {
      router.push('/login');
    } else {
      setChecking(false);
    }
  }, [router, token, isAuthenticated, user]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#181928] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#181928] text-slate-100 font-sans">
      {/* Fixed Left Sidebar */}
      <DashboardSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Right Column: Fixed Header + Scrollable Main Content */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <DashboardHeader
          title="SELLER DASHBOARD"
          subtitle="Fresh Bazaar › Dashboard › Commerce Overview"
          onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* Independent Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 space-y-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <SellerMobileNav />
    </div>
  );
}
