'use client';

import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/cn';
import { RefreshCcw, ShoppingCart, Star, Heart, Check, ArrowRight } from 'lucide-react';

const REORDER_ITEMS = [
  { id: 'pa-1', name: 'Organic Whole Milk (2L)', seller: 'DOHS Dairy Store', price: 180, lastPurchased: '27 Jul 2026', icon: '🥛', rating: 4.9 },
  { id: 'pa-2', name: 'Premium Basmati Rice (5kg)', seller: 'Super Bazar DOHS', price: 650, lastPurchased: '25 Jul 2026', icon: '🌾', rating: 4.8 },
  { id: 'pa-3', name: 'Cold Pressed Mustard Oil (1L)', seller: 'Pure Spices Store', price: 320, lastPurchased: '20 Jul 2026', icon: '🍾', rating: 4.9 },
  { id: 'pa-4', name: 'Fresh Farm Eggs (12 pcs)', seller: 'Organic Farm BD', price: 155, lastPurchased: '18 Jul 2026', icon: '🥚', rating: 4.7 },
  { id: 'pa-5', name: 'Fresh Green Cucumbers (1kg)', seller: 'DOHS Fresh Market', price: 60, lastPurchased: '15 Jul 2026', icon: '🥒', rating: 4.6 },
  { id: 'pa-6', name: 'Aromatic Chinigura Rice (2kg)', seller: 'Super Bazar DOHS', price: 280, lastPurchased: '10 Jul 2026', icon: '🍚', rating: 4.9 },
];

export default function BuyAgainPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <RefreshCcw className="w-6 h-6 text-emerald-400" /> Buy Again Essentials
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Quickly reorder items you previously purchased with 1-click</p>
        </div>

        <Link
          href="/dashboard/cart"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" /> View Cart
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REORDER_ITEMS.map((item) => (
          <div key={item.id} className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-4">
              <Link href={`/services/shopping/product/${item.id}`} className="text-4xl p-3 rounded-2xl bg-white/5 hover:scale-105 transition-transform">
                {item.icon}
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating}
                </div>
                <Link href={`/services/shopping/product/${item.id}`}>
                  <h3 className="font-bold text-sm text-white truncate mt-0.5 hover:text-emerald-400 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-xs text-slate-400">{item.seller}</p>
                <p className="text-xs text-slate-400 mt-1">Last ordered: <span className="text-slate-300 font-semibold">{item.lastPurchased}</span></p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">PRICE</span>
                <span className="text-base font-black text-emerald-400">৳{formatCurrency(item.price)}</span>
              </div>

              <button className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95">
                <ShoppingCart className="w-4 h-4" /> 1-Click Reorder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
