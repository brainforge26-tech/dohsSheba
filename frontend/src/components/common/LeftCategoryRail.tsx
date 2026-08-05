'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  Tag,
  Percent,
} from 'lucide-react';
import { useCategoryDrawerStore } from '@/store/useCategoryDrawerStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { fetchApi } from '@/lib/api-client';

export function LeftCategoryRail() {
  const { openDrawer } = useCategoryDrawerStore();
  const { language } = useLanguageStore();
  const isBn = language === 'BN';
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchApi<any[]>('/product-categories').catch(() => null);
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const parents = res.data.filter((c: any) => !c.parentId);
          setCategories(parents);
        } else {
          setCategories([
            { id: '1', name: 'Vegetables & Fruits', slug: 'vegetables-fruits', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100' },
            { id: '2', name: 'Meat & Poultry', slug: 'meat-poultry', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100' },
            { id: '3', name: 'Seafood & Fish', slug: 'seafood-fish', image: 'https://images.unsplash.com/photo-1534942519507-769d4679447d?w=100' },
            { id: '4', name: 'Dairy & Eggs', slug: 'dairy-eggs', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100' },
            { id: '5', name: 'Rice & Grains', slug: 'rice-grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100' },
          ]);
        }
      } catch (_) {}
    };
    loadCategories();
  }, []);

  return (
    <aside className="hidden lg:flex flex-col items-center w-16 border-r border-slate-200 bg-white py-3 shrink-0 z-30 select-none shadow-2xs sticky top-0 h-screen overflow-y-auto no-scrollbar">
      {/* ── Top Green Circle Hamburger Button ── */}
      <button
        onClick={openDrawer}
        title="Open All Categories Menu"
        className="w-10 h-10 rounded-full bg-[#7eb343] hover:bg-[#6c9c36] text-white flex items-center justify-center shadow-md active:scale-95 transition-all mb-4 cursor-pointer"
      >
        <Menu className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* ── Vertical Dynamic Category Icon List ── */}
      <div className="flex-1 flex flex-col items-center gap-4 w-full">
        {categories.slice(0, 7).map((item) => (
          <Link
            key={item.id}
            href={`/category/${item.slug}`}
            title={item.name}
            className="relative group p-1.5 rounded-xl transition-all text-slate-600 hover:text-[#7eb343] hover:bg-slate-50"
          >
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-6 h-6 rounded-md object-cover transition-transform group-hover:scale-110 border border-slate-200" />
            ) : (
              <Tag className="w-5 h-5 stroke-[2] transition-transform group-hover:scale-110 text-slate-500 group-hover:text-[#7eb343]" />
            )}

            {/* Hover Tooltip Popup */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block z-50 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-150 pointer-events-none">
              {item.name}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900" />
            </div>
          </Link>
        ))}

        {/* Special Offers Link */}
        <Link
          href="/offers"
          title="Weekly Discounts"
          className="relative group p-2.5 rounded-xl transition-all text-[#7eb343] hover:bg-emerald-50 mt-1"
        >
          <Percent className="w-5 h-5 stroke-[2] text-[#7eb343] transition-transform group-hover:scale-115" />
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block z-50 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-150 pointer-events-none">
            {isBn ? 'বিশেষ ডিসকাউন্ট' : 'Weekly Discounts'}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900" />
          </div>
        </Link>
      </div>
    </aside>
  );
}
