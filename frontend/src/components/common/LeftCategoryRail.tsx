'use client';

import React from 'react';
import Link from 'next/link';
import {
  Menu,
  Carrot,
  Beef,
  Fish,
  Milk,
  ShoppingBag,
  Zap,
  Percent,
  Sparkles,
} from 'lucide-react';
import { useCategoryDrawerStore } from '@/store/useCategoryDrawerStore';
import { useLanguageStore } from '@/store/useLanguageStore';

export function LeftCategoryRail() {
  const { openDrawer } = useCategoryDrawerStore();
  const { language } = useLanguageStore();
  const isBn = language === 'BN';

  const railItems = [
    {
      id: 'veg',
      label: isBn ? 'শাক-সবজি ও ফলমূল' : 'Vegetables & Fruits',
      icon: Carrot,
      href: '/services/shopping/vegetables',
    },
    {
      id: 'meat',
      label: isBn ? 'মাংস ও পোল্ট্রি' : 'Meat & Poultry',
      icon: Beef,
      href: '/services/shopping/meat',
    },
    {
      id: 'fish',
      label: isBn ? 'দেশি তাজা মাছ' : 'Seafood & Fish',
      icon: Fish,
      href: '/services/shopping/fish',
    },
    {
      id: 'dairy',
      label: isBn ? 'দুধ ও ডেইরি' : 'Milk & Dairy',
      icon: Milk,
      href: '/services/shopping/dairy',
    },
    {
      id: 'bakery',
      label: isBn ? 'বেকারি ও স্ন্যাকস' : 'Bakery & Snacks',
      icon: ShoppingBag,
      href: '/services/shopping/bakery',
    },
    {
      id: 'drinks',
      label: isBn ? 'পানীয় ও জুস' : 'Beverages & Juices',
      icon: Zap,
      href: '/services/shopping/beverages',
    },
    {
      id: 'offers',
      label: isBn ? 'বিশেষ ডিসকাউন্ট' : 'Weekly Discounts',
      icon: Percent,
      href: '/offers',
      isDiscount: true,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col items-center w-16 border-r border-slate-200 bg-white py-3 shrink-0 z-30 select-none shadow-2xs sticky top-0 h-screen overflow-y-auto no-scrollbar">
      {/* ── Top Green Circle Hamburger Button (Reference Image) ── */}
      <button
        onClick={openDrawer}
        title="Open All Categories Menu"
        className="w-10 h-10 rounded-full bg-[#7eb343] hover:bg-[#6c9c36] text-white flex items-center justify-center shadow-md active:scale-95 transition-all mb-4 cursor-pointer"
      >
        <Menu className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* ── Vertical Category Icon List ── */}
      <div className="flex-1 flex flex-col items-center gap-5 w-full">
        {railItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              title={item.label}
              className={`relative group p-2.5 rounded-xl transition-all ${
                item.isDiscount
                  ? 'text-[#7eb343] hover:bg-emerald-50'
                  : 'text-slate-500 hover:text-[#7eb343] hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-5 h-5 stroke-[2] transition-transform group-hover:scale-115 ${
                item.isDiscount ? 'text-[#7eb343]' : ''
              }`} />

              {/* Hover Tooltip Popup */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block z-50 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-150 pointer-events-none">
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900" />
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
