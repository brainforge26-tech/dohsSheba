import React from 'react';
import { ShoppingCategoriesGrid } from '@/components/home/ShoppingCategoriesGrid';
import { DailyDealsSection } from '@/components/home/DailyDealsSection';

export default function ShoppingMarketplacePage() {
  return (
    <div className="py-8 space-y-12">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white space-y-4 shadow-xl border border-emerald-500/20">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            DOHS Express Grocery Market
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Fresh Fruits, Vegetables & Daily Needs
          </h1>
          <p className="text-sm text-emerald-100 max-w-xl">
            Order directly from trusted local DOHS bazaar shops. 45-minute doorstep express delivery with 100% fresh guarantee.
          </p>
        </div>
      </div>

      <ShoppingCategoriesGrid />
      <DailyDealsSection />
    </div>
  );
}
