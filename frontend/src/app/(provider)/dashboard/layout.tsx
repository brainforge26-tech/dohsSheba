import React from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <DashboardSidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
