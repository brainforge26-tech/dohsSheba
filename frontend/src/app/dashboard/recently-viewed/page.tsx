'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/cn';
import { Layers, Trash2, ShoppingCart, Star } from 'lucide-react';

const RECENTLY_VIEWED = [
  { id: 'rv-1', name: 'Sony WH-1000XM5 Wireless Headphones', price: 34500, seller: 'GadgetZone DOHS', image: '🎧', rating: 4.9 },
  { id: 'rv-2', name: 'Organic Whole Milk (2L)', price: 180, seller: 'DOHS Dairy Store', image: '🥛', rating: 4.9 },
  { id: 'rv-3', name: 'Premium Basmati Rice (5kg)', price: 650, seller: 'Super Bazar DOHS', image: '🌾', rating: 4.8 },
  { id: 'rv-4', name: 'Cold Pressed Mustard Oil (1L)', price: 320, seller: 'Pure Spices Store', image: '🍾', rating: 4.9 },
];

export default function RecentlyViewedPage() {
  const [items, setItems] = useState(RECENTLY_VIEWED);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" /> Recently Viewed Products
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Quick access to products you recently browsed in the marketplace</p>
        </div>

        <button
          onClick={() => setItems([])}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 border border-white/10 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4 text-rose-400" /> Clear History
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-12 text-center bg-[#1e1f32] rounded-2xl border border-white/10">
          <p className="text-slate-400 text-sm">No recently viewed products in history.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-3 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div>
                <Link href={`/services/shopping/product/${item.id}`} className="text-4xl p-3 rounded-2xl bg-white/5 block w-fit mb-3 hover:scale-105 transition-transform">
                  {item.image}
                </Link>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating}
                </div>
                <Link href={`/services/shopping/product/${item.id}`}>
                  <h3 className="font-bold text-sm text-white hover:text-cyan-400 transition-colors">{item.name}</h3>
                </Link>
                <p className="text-xs text-slate-400">{item.seller}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-black text-emerald-400 text-sm">৳{formatCurrency(item.price)}</span>
                <button className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
