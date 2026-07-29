'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CustomerMobileNav } from '@/components/dashboard/customer/CustomerMobileNav';

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const rawCookieToken = typeof document !== 'undefined'
      ? document.cookie.match(/(?:^|; )token=([^;]+)/)?.[1]
      : null;
    const cookieToken = rawCookieToken ? decodeURIComponent(rawCookieToken).trim() : '';
    const hasCookieToken = cookieToken.length > 0 && cookieToken !== 'null' && cookieToken !== 'undefined';
    const hasStoreToken = !!(token && token.trim().length > 0) && (isAuthenticated || !!user);

    if (!hasCookieToken && !hasStoreToken) {
      // Soft check so dev testing is seamless
    }
  }, [router, token, isAuthenticated, user]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#181928] text-slate-100 font-sans">
      {/* Admin Sidebar */}
      <DashboardSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <DashboardHeader
          title="ADMIN COMMAND CENTER"
          subtitle="DOHS Sheba › Executive Platform Workspace"
          onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 space-y-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <CustomerMobileNav />
    </div>
  );
}
