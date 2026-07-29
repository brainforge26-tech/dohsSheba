'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { LayoutDashboard, ShoppingBag, ShoppingCart, Heart, User } from 'lucide-react';

export function CustomerMobileNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { label: t('dashboard'), href: '/dashboard/customer', icon: LayoutDashboard },
    { label: t('myOrders'), href: '/dashboard/orders', icon: ShoppingBag },
    { label: t('cart'), href: '/dashboard/cart', icon: ShoppingCart },
    { label: t('wishlist'), href: '/dashboard/wishlist', icon: Heart },
    { label: t('profileSettings'), href: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1e1f32]/95 backdrop-blur-lg border-t border-white/10 px-3 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard/customer' && pathname?.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              isActive
                ? 'text-indigo-400 bg-indigo-500/10 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-wide truncate max-w-[60px]">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
