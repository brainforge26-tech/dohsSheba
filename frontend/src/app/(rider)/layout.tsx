'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

import { RiderMobileNav } from '@/components/dashboard/rider/RiderMobileNav';

export default function RiderShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#181928] text-slate-100 font-sans">
      {/* Single outer Rider Sidebar */}
      <DashboardSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Rider Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <DashboardHeader
          title="RIDER FLEET COMMAND"
          subtitle="DOHS Express Doorstep Delivery & Dispatch"
          onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 bg-[#141523] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <RiderMobileNav />
    </div>
  );
}
