'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { DAILY_DEALS_PRODUCTS } from '@/constants/products';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/utils/cn';
import { ShoppingBag, Star, Plus, Check, Sparkles, Tag, Flame, Clock, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function DailyDealsSection() {
  const { addItem, items, openCart } = useCartStore();
  const [activeTab, setActiveTab] = useState<'all' | 'veg' | 'meat' | 'dairy'>('all');

  const handleProductClick = (product: any) => {
    try {
      const stored = localStorage.getItem('dohssheba-recently-viewed');
      const list = stored ? JSON.parse(stored) : [];
      const itemToSave = {
        id: product.id,
        name: product.title || product.name,
        price: product.price,
        seller: product.shopName || 'DOHS Market',
        image: product.image,
        rating: product.rating || 4.8,
        slug: product.slug,
      };
      const filtered = list.filter((item: any) => item.id !== product.id);
      const updated = [itemToSave, ...filtered].slice(0, 10);
      localStorage.setItem('dohssheba-recently-viewed', JSON.stringify(updated));
    } catch (_) {}
  };

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
    <section className="py-16 px-4 bg-gradient-to-b from-slate-900/60 via-background to-slate-900/60 border-y border-emerald-500/20">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header with Live Flash Timer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-extrabold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Super Flash Sale</span>
              </div>

              {/* Countdown Timer Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Ends In: {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Fresh Deals of the Day
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl font-normal leading-relaxed">
              Special discounted prices on farm-fresh produce, organic fruits, halal meats & daily kitchen essentials in Savar DOHS.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Hot Deals' },
              { id: 'veg', label: '🍎 Vegetables & Fruits' },
              { id: 'meat', label: '🥩 Meat & Fish' },
              { id: 'dairy', label: '🥛 Milk & Grocery' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap border ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                    : 'bg-card text-muted-foreground border-border hover:border-border/80 hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid - 2 Columns on Mobile, 4 Columns on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {filteredProducts.map((product) => {
            const inCart = items.find((i) => i.product.id === product.id);

            // Calculate discount percentage if original price exists
            const discountPercent = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="group relative rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-md overflow-hidden shadow-md hover:shadow-2xl hover:border-emerald-500/60 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container */}
                <Link
                  href={`/services/shopping/product/${product.slug}`}
                  onClick={() => handleProductClick(product)}
                  className="relative h-32 sm:h-52 w-full overflow-hidden bg-slate-950 block cursor-pointer"
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20" />
                  
                  {/* Discount Badge */}
                  {discountPercent > 0 && (
                    <span className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[9px] sm:text-[11px] font-black bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md z-10 animate-pulse">
                      {discountPercent}% OFF
                    </span>
                  )}

                  {/* Organic Badge */}
                  {product.isOrganic && (
                    <span className="hidden sm:inline-block absolute top-3.5 right-3.5 px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-400 text-slate-950 shadow-md z-10">
                      100% Organic
                    </span>
                  )}

                  {/* Shop Name Tag */}
                  <div className="hidden sm:flex absolute bottom-3.5 left-3.5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-emerald-300 text-[11px] font-extrabold border border-emerald-500/30 items-center gap-1.5 z-10 shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{product.shopName}</span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-2.5 sm:p-5 space-y-2 sm:space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold">
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[9px] sm:text-[11px]">
                        {product.unit}
                      </span>
                      <span className="flex items-center gap-1 text-amber-300 bg-amber-400/10 px-1.5 sm:px-2 py-0.5 rounded-md border border-amber-400/20 text-[9px] sm:text-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9
                      </span>
                    </div>

                    <Link
                      href={`/services/shopping/product/${product.slug}`}
                      onClick={() => handleProductClick(product)}
                      className="block pt-0.5"
                    >
                      <h3 className="font-extrabold text-xs sm:text-base leading-snug text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-2 sm:pt-3.5 border-t border-white/10 flex items-center justify-between gap-1.5">
                    <Link
                      href={`/services/shopping/product/${product.slug}`}
                      onClick={() => handleProductClick(product)}
                      className="block hover:opacity-90 transition-opacity"
                    >
                      <div className="text-[8px] sm:text-[10px] text-slate-400 font-extrabold uppercase tracking-wider hidden sm:block">Offer Price</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm sm:text-xl font-black text-emerald-400 tracking-tight">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] sm:text-xs text-slate-500 line-through font-semibold">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        addItem(product);
                        openCart();
                      }}
                      className={`px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center gap-1 shrink-0 active:scale-95 cursor-pointer ${
                        inCart
                          ? 'bg-emerald-600 text-white shadow-emerald-600/40'
                          : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/40'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">In Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
