'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#181928] text-slate-100 font-sans">
      <DashboardSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <DashboardHeader
          title="DASHBOARD"
          subtitle="Morvin > Dashboard > Executive Overview"
          onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className="flex-1 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 space-y-6 w-full max-w-[1720px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
