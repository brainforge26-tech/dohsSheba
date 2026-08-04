'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Search, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';

export function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { language } = useLanguageStore();
  const isBn = mounted ? language === 'BN' : true;

  const { getTotalCount, openCart } = useCartStore();
  const { user, role } = useAuthStore();
  const cartCount = mounted ? getTotalCount() : 0;

  const getAccountHref = () => {
    if (!mounted || !user) return '/login';
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'PROVIDER') return '/provider/dashboard';
    if (role === 'SELLER') return '/seller/dashboard';
    if (role === 'RIDER') return '/rider/dashboard';
    return '/dashboard/customer';
  };

  const navItems = [
    {
      id: 'home',
      label: isBn ? 'হোম' : 'Home',
      icon: Home,
      href: '/',
      isActive: pathname === '/',
    },
    {
      id: 'categories',
      label: isBn ? 'ক্যাটাগরি' : 'Categories',
      icon: LayoutGrid,
      href: '/services/shopping',
      isActive: Boolean(pathname?.startsWith('/services')),
    },
    {
      id: 'search',
      label: isBn ? 'সার্চ' : 'Search',
      icon: Search,
      href: '/search',
      isActive: pathname === '/search',
    },
    {
      id: 'cart',
      label: isBn ? 'কার্ট' : 'Cart',
      icon: ShoppingBag,
      onClick: openCart,
      badge: cartCount > 0 ? cartCount : undefined,
      isActive: false,
    },
    {
      id: 'account',
      label: isBn ? 'অ্যাকাউন্ট' : 'Account',
      icon: User,
      href: getAccountHref(),
      isActive: mounted && Boolean(pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin') || pathname?.startsWith('/provider') || pathname?.startsWith('/seller') || pathname?.startsWith('/rider')),
    },
  ];

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/80 shadow-2xl h-16 flex items-center justify-around px-2 safe-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const activeClass = item.isActive
          ? 'text-emerald-600 dark:text-emerald-400 font-extrabold scale-105'
          : 'text-muted-foreground hover:text-foreground font-semibold';

        if (item.onClick) {
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`relative flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all duration-200 active:scale-90 ${activeClass}`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 stroke-[2.2]" />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-background animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href || '/'}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all duration-200 active:scale-90 ${activeClass}`}
          >
            <Icon className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
