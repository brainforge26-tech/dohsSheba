'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/cn';
import { CustomerEmptyState } from '@/components/dashboard/customer/CustomerEmptyState';
import {
  Heart,
  Grid,
  List,
  ShoppingCart,
  Trash2,
  Bell,
  TrendingDown,
  CheckCircle2,
  Star,
} from 'lucide-react';

import { useWishlistStore } from '@/store/useWishlistStore';

export default function WishlistPage() {
  const { items: storeItems, removeItem } = useWishlistStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const items = storeItems.map((prod: any) => ({
    id: prod.id,
    name: prod.title || prod.name,
    price: prod.price,
    originalPrice: prod.originalPrice || prod.price,
    seller: prod.shopName || prod.seller || 'DOHS Market',
    image: prod.image || '🛍️',
    inStock: (prod.stock ?? 1) > 0,
    priceDrop: false,
    rating: prod.rating || 4.8,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-400 fill-pink-400" /> Saved Wishlist
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage your favorite saved items and receive price drop alerts</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#1e1f32] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <CustomerEmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="You haven't saved any items to your wishlist yet. Explore products and click the heart icon to save them for later."
          actionText="Explore Marketplace"
          actionHref="/"
        />
      ) : viewMode === 'grid' ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 flex flex-col justify-between space-y-4 hover:border-pink-500/30 transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/services/shopping/product/${item.id}`} className="text-4xl p-3 rounded-2xl bg-white/5 hover:scale-105 transition-transform">
                    {item.image}
                  </Link>
                  <div className="flex items-center gap-1.5">
                    {item.priceDrop && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" /> Price Drop
                      </span>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating}
                  </div>
                  <Link href={`/services/shopping/product/${item.id}`}>
                    <h3 className="font-bold text-sm text-white hover:text-pink-400 transition-colors">{item.name}</h3>
                  </Link>
                  <p className="text-xs text-slate-400">{item.seller}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-emerald-400">৳{formatCurrency(item.price)}</span>
                  {item.originalPrice > item.price && (
                    <span className="text-xs text-slate-500 line-through">৳{formatCurrency(item.originalPrice)}</span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <span className={`text-[11px] font-bold ${item.inStock ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </span>

                <button
                  disabled={!item.inStock}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Layout */
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-[#1e1f32] border border-white/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-pink-500/30 transition-all">
              <div className="flex items-center gap-4">
                <Link href={`/services/shopping/product/${item.id}`} className="text-3xl p-3 rounded-2xl bg-white/5 hover:scale-105 transition-transform">
                  {item.image}
                </Link>
                <div>
                  <Link href={`/services/shopping/product/${item.id}`}>
                    <h3 className="font-bold text-sm text-white hover:text-pink-400 transition-colors">{item.name}</h3>
                  </Link>
                  <p className="text-xs text-slate-400">Seller: <span className="text-indigo-300">{item.seller}</span></p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-black text-emerald-400">৳{formatCurrency(item.price)}</span>
                    {item.priceDrop && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        Price Dropped!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <button
                  disabled={!item.inStock}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                </button>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
