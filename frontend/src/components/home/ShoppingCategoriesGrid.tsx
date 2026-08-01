'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SHOPPING_CATEGORIES } from '@/constants/products';
import { ShoppingBag, ArrowRight, Truck, Clock, Sparkles, ShieldCheck, ChevronRight, Zap } from 'lucide-react';

export function ShoppingCategoriesGrid() {
  const [activeTab, setActiveTab] = useState<'all' | 'farm' | 'protein' | 'pantry'>('all');

  const filterCategories = () => {
    if (activeTab === 'farm') {
      return SHOPPING_CATEGORIES.filter((c) => ['pcat_veg', 'pcat_fruit'].includes(c.id));
    }
    if (activeTab === 'protein') {
      return SHOPPING_CATEGORIES.filter((c) => ['pcat_meat', 'pcat_fish'].includes(c.id));
    }
    if (activeTab === 'pantry') {
      return SHOPPING_CATEGORIES.filter((c) => ['pcat_dairy', 'pcat_groc', 'pcat_snack', 'pcat_bev'].includes(c.id));
    }
    return SHOPPING_CATEGORIES;
  };

  const displayedCategories = filterCategories();

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-900/40 via-background to-slate-900/40 border-y border-border/50">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Savar DOHS Grocery Express</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Fresh Daily Needs & Kitchen Grocery
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl font-normal leading-relaxed">
              Farm-fresh vegetables, organic fruits, halal meat & river fish delivered straight to your door in 45 minutes.
            </p>
          </div>

          <Link
            href="/services/shopping"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md hover:shadow-lg group shrink-0"
          >
            <span>Explore All Groceries</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Grocery Needs' },
            { id: 'farm', label: '🥬 Farm Fresh Produce' },
            { id: 'protein', label: '🥩 Fresh Meat & Fish' },
            { id: 'pantry', label: '🥛 Dairy, Rice & Spices' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                  : 'bg-card text-muted-foreground border-border hover:border-border/80 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Shopping Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayedCategories.map((pcat) => (
            <Link
              key={pcat.id}
              href={`/services/shopping/${pcat.slug}`}
              className="group relative h-56 rounded-3xl overflow-hidden border border-border/80 shadow-card hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between p-5"
            >
              {/* Background Image */}
              <Image
                src={pcat.image}
                alt={pcat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Dynamic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-black/20 group-hover:from-slate-950/90 transition-all duration-300" />

              {/* Top Item Count & Delivery Pill */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-white shadow-xs">
                  {pcat.itemCount} {pcat.itemCount === 1 ? 'Item' : 'Items'}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" /> 45 Min
                </span>
              </div>

              {/* Bottom Content & CTA */}
              <div className="relative z-10 space-y-2">
                <h3 className="font-extrabold text-lg text-white group-hover:text-emerald-300 transition-colors leading-tight">
                  {pcat.name}
                </h3>

                <div className="flex items-center justify-between text-xs font-bold text-slate-300 pt-1">
                  <span className="text-emerald-400 text-[11px]">Guaranteed Fresh</span>
                  <span className="text-emerald-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    Shop <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Delivery Promise Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-950/80 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30">
              <Truck className="w-7 h-7" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-base text-white flex items-center gap-2 justify-center sm:justify-start">
                <span>Fast Express Delivery in Savar DOHS</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black">FREE &gt; ৳500</span>
              </h4>
              <p className="text-xs text-slate-300">Order before 8:00 PM for guaranteed 45-minute express delivery to your doorstep.</p>
            </div>
          </div>
          <Link
            href="/services/shopping"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-emerald-600/30 shrink-0"
          >
            Start Grocery Order
          </Link>
        </div>

      </div>
    </section>
  );
}
