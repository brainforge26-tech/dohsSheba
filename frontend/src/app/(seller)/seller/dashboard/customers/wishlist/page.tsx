'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import {
  Heart, Package, Users, Tag, ArrowRight, Zap,
  TrendingUp, Download, Eye, Plus, ShoppingBag, Loader2,
} from 'lucide-react';

const MOCK_WISHLISTS = [
  { id: 'w1', product: { id: 'p1', name: 'Organic Full Cream Milk (1L)', price: 120, images: [], category: 'Dairy & Eggs', stock: 45 }, wishlistCount: 28, demandScore: 'High', discountSuggested: '10%' },
  { id: 'w2', product: { id: 'p7', name: 'Fresh Hilsa Fish (per kg)', price: 1200, images: [], category: 'Fish & Seafood', stock: 9 }, wishlistCount: 42, demandScore: 'Very High', discountSuggested: '5%' },
  { id: 'w3', product: { id: 'p2', name: 'Himsagar Mango (per kg)', price: 240, images: [], category: 'Fruits', stock: 28 }, wishlistCount: 35, demandScore: 'High', discountSuggested: '15%' },
  { id: 'w4', product: { id: 'p4', name: 'Deshi Ghee (500g)', price: 420, images: [], category: 'Dairy & Eggs', stock: 3 }, wishlistCount: 19, demandScore: 'Medium', discountSuggested: '5%' },
  { id: 'w5', product: { id: 'p3', name: 'Basmati Rice (5kg Bag)', price: 850, images: [], category: 'Rice & Grains', stock: 22 }, wishlistCount: 16, demandScore: 'Medium', discountSuggested: '8%' },
];

export default function WishlistPage() {
  const [wishlists, setWishlists] = useState(MOCK_WISHLISTS);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    fetchApi<any>('/seller/wishlist-insights')
      .then((r) => { if (r.success && r.data?.length) setWishlists(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalWishlists = wishlists.reduce((s, w) => s + w.wishlistCount, 0);

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded-xl bg-[#1f2136]" />
      <div className="h-48 rounded-3xl bg-[#1f2136]" />
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Dashboard / Customers / Wishlists</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400 fill-red-400" /> Customer Wishlist Insights
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">See which products your customers have saved to their wishlists</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#1f2136] border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0"><Heart className="w-5 h-5 text-red-400 fill-red-400" /></div>
          <div><p className="text-[11px] text-slate-400 font-semibold">Total Wishlisted Items</p><p className="text-xl font-black text-white">{totalWishlists}</p></div>
        </div>
        <div className="p-4 rounded-2xl bg-[#1f2136] border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0"><TrendingUp className="w-5 h-5 text-amber-400" /></div>
          <div><p className="text-[11px] text-slate-400 font-semibold">Top Demand Product</p><p className="text-sm font-bold text-white truncate max-w-[180px]">{wishlists[1]?.product?.name}</p></div>
        </div>
        <div className="p-4 rounded-2xl bg-[#1f2136] border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0"><Zap className="w-5 h-5 text-indigo-400" /></div>
          <div><p className="text-[11px] text-slate-400 font-semibold">Promo Opportunity</p><p className="text-xs font-bold text-indigo-300">Run a Flash Sale on top items</p></div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 font-bold text-white text-sm">Most Saved Products</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-[#181928]/50">
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-center">Wishlist Count</th>
                <th className="p-4 text-center">Demand Score</th>
                <th className="p-4 text-center">Suggested Promo</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {wishlists.map((w) => (
                <tr key={w.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white">{w.product.name}</td>
                  <td className="p-4 text-slate-300">{w.product.category}</td>
                  <td className="p-4 text-right font-bold text-white">{formatCurrency(w.product.price)}</td>
                  <td className="p-4 text-center font-black text-amber-400 text-sm">{w.wishlistCount} ❤️</td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {w.demandScore}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Offer {w.discountSuggested} OFF
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Link href="/seller/dashboard/marketing/coupons" className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-all inline-flex items-center gap-1">
                      Create Coupon <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
