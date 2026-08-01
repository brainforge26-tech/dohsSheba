'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/cn';
import { CustomerEmptyState } from '@/components/dashboard/customer/CustomerEmptyState';
import { Layers, Trash2, ShoppingCart, Star } from 'lucide-react';

export default function RecentlyViewedPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dohssheba-recently-viewed');
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        setItems([]);
      }
    } catch (_) {
      setItems([]);
    }
  }, []);

  const clearHistory = () => {
    try {
      localStorage.removeItem('dohssheba-recently-viewed');
    } catch (_) {}
    setItems([]);
  };

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

        {items.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 border border-white/10 transition-colors flex items-center gap-1.5 w-fit"
          >
            <Trash2 className="w-4 h-4 text-rose-400" /> Clear History
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <CustomerEmptyState
          icon={Layers}
          title="No Recently Viewed Products"
          description="You haven't viewed any products recently. Products you browse on the DOHS marketplace will be saved here."
          actionText="Browse Products"
          actionHref="/services/shopping"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-3 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-3 overflow-hidden">
                  {item.image?.startsWith('http') || item.image?.startsWith('/') ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.image || '📦'
                  )}
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating || 4.8}
                </div>
                <Link href={`/services/shopping/product/${item.slug || item.id}`}>
                  <h3 className="font-bold text-sm text-white hover:text-cyan-400 transition-colors truncate">{item.name}</h3>
                </Link>
                <p className="text-xs text-slate-400">{item.seller || 'DOHS Market'}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-black text-emerald-400 text-sm">৳{formatCurrency(item.price)}</span>
                <Link href={`/services/shopping/product/${item.slug || item.id}`} className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors">
                  <ShoppingCart className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
