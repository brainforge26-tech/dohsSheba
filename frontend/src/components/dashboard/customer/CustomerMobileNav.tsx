'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { useCartStore } from '@/store/useCartStore';
import { Home, Grid, ShoppingBag, ShoppingCart, User } from 'lucide-react';

export function CustomerMobileNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { items: cartItems } = useCartStore();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Explore', href: '/services/shopping', icon: Grid },
    { label: t('myOrders'), href: '/dashboard/orders', icon: ShoppingBag },
    { label: t('cart'), href: '/cart', icon: ShoppingCart, badge: cartCount },
    { label: 'Profile', href: '/dashboard/customer', icon: User },
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
        const isActive = pathname === item.href || (item.href !== '/' && item.href !== '/dashboard/customer' && pathname?.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleNavClick}
            className={`relative flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all duration-200 active:scale-95 ${
              isActive
                ? 'text-indigo-400 bg-indigo-500/15 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {!!item.badge && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border border-[#181928] shadow-sm">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight truncate max-w-[64px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
