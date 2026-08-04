'use client';

import React, { useState, useEffect } from 'react';
import { DAILY_DEALS_PRODUCTS } from '@/constants/products';
import { ProductCard } from '@/components/common/ProductCard';
import { Flame, Clock } from 'lucide-react';

export function DailyDealsSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'veg' | 'meat' | 'dairy'>('all');

  // Flash deal countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = DAILY_DEALS_PRODUCTS.filter((product) => {
    if (activeTab === 'veg') return product.title.toLowerCase().includes('tomato') || product.title.toLowerCase().includes('mango') || product.title.toLowerCase().includes('potato');
    if (activeTab === 'meat') return product.title.toLowerCase().includes('beef') || product.title.toLowerCase().includes('fish') || product.title.toLowerCase().includes('chicken');
    if (activeTab === 'dairy') return product.title.toLowerCase().includes('milk') || product.title.toLowerCase().includes('oil') || product.title.toLowerCase().includes('rice');
    return true;
  });

  return (
    <section className="py-6 px-4 bg-white font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Live Flash Timer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Super Flash Sale</span>
              </div>

              {/* Countdown Timer Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Ends In: {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Fresh Deals of the Day
            </h2>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {[
              { id: 'all', label: 'All Hot Deals' },
              { id: 'veg', label: '🍎 Vegetables & Fruits' },
              { id: 'meat', label: '🥩 Meat & Fish' },
              { id: 'dairy', label: '🥛 Milk & Grocery' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#7eb343] text-white border-[#7eb343] shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid (Woodmart ProductCard Component) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {filteredProducts.map((product) => {
            const discountPercent = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                slug={product.slug}
                price={product.price}
                originalPrice={product.originalPrice}
                unit={product.unit}
                image={product.image}
                badge={discountPercent > 0 ? `${discountPercent}% OFF` : undefined}
                isHot={discountPercent > 20}
                categorySlug={product.categorySlug}
                categoryName={product.categoryName}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}
