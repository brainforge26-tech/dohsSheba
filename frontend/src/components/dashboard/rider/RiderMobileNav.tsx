'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navigation, Compass, History, Wallet, User } from 'lucide-react';

export function RiderMobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Mission', href: '/rider/dashboard', icon: Navigation },
    { label: 'Dispatch', href: '/rider/dashboard/dispatch', icon: Compass },
    { label: 'History', href: '/rider/dashboard/history', icon: History },
    { label: 'Wallet', href: '/rider/dashboard/wallet', icon: Wallet },
    { label: 'Profile', href: '/rider/dashboard/profile', icon: User },
  ];

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch (_) {}
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#12131f]/95 backdrop-blur-2xl border-t border-white/10 px-3 py-2 pb-safe flex items-center justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/rider/dashboard' && pathname?.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleNavClick}
            className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-300 active:scale-95 ${
              isActive
                ? 'text-emerald-400 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isActive && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            )}
            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-emerald-500/20 shadow-lg shadow-emerald-500/20' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight truncate max-w-[64px] font-bold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
