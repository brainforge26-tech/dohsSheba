'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, DollarSign, Store } from 'lucide-react';

export function SellerMobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/seller/dashboard', icon: LayoutDashboard },
    { label: 'Orders', href: '/seller/dashboard/orders', icon: ShoppingBag },
    { label: 'Products', href: '/seller/dashboard/products', icon: Package },
    { label: 'Finance', href: '/seller/dashboard/finance', icon: DollarSign },
    { label: 'Store', href: '/seller/dashboard/store', icon: Store },
  ];

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch (_) {}
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#181928]/95 backdrop-blur-xl border-t border-white/10 px-2 pt-2 pb-safe flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/seller/dashboard' && pathname?.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleNavClick}
            className={`relative flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all duration-200 active:scale-95 ${
              isActive
                ? 'text-emerald-400 bg-emerald-500/15 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight truncate max-w-[64px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
