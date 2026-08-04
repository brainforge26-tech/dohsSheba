'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency } from '@/utils/cn';
import {
  ShoppingBag, Zap, Clock, CheckCircle2, ShoppingCart, Heart,
  Headphones, Truck, Package, RotateCcw, Sparkles, Loader2,
  FileText
} from 'lucide-react';

export default function CustomerDashboardOverview() {
  const { language } = useLanguageStore();
  const [activeBookingsCount, setActiveBookingsCount] = useState<number>(0);
  const [expressOrdersCount, setExpressOrdersCount] = useState<number>(0);
  const [totalSpend, setTotalSpend] = useState<number>(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isBn = language === 'BN';

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      fetchApi<any[]>('/bookings'),
      fetchApi<any[]>('/orders'),
      fetchApi<any[]>('/products?limit=4'),
    ]).then(([bookingsRes, ordersRes, productsRes]) => {
      if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success && Array.isArray(bookingsRes.value.data)) {
        const active = bookingsRes.value.data.filter((b) => b.status === 'CONFIRMED' || b.status === 'SCHEDULED' || b.status === 'EN_ROUTE');
        setActiveBookingsCount(active.length);
      } else {
        setActiveBookingsCount(0);
      }

      if (ordersRes.status === 'fulfilled' && ordersRes.value.success && Array.isArray(ordersRes.value.data)) {
        const apiOrders = ordersRes.value.data;
        setRecentOrders(apiOrders);
        setExpressOrdersCount(apiOrders.length);
        const spend = apiOrders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);
        setTotalSpend(spend);
        setLoyaltyPoints(Math.floor(spend / 35));
      } else {
        setRecentOrders([]);
        setExpressOrdersCount(0);
        setTotalSpend(0);
        setLoyaltyPoints(0);
      }

      if (productsRes.status === 'fulfilled' && productsRes.value.success && Array.isArray(productsRes.value.data)) {
        setCatalogProducts(productsRes.value.data);
      } else {
        setCatalogProducts([]);
      }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 text-white">

      {/* ── Stat Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#1e1f32] border border-white/10 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{isBn ? 'মোট অর্ডার' : 'Total Orders'}</span>
          <p className="text-2xl font-black text-white">{expressOrdersCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#1e1f32] border border-white/10 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{isBn ? 'অ্যাক্টিভ সার্ভিস বুকিং' : 'Active Bookings'}</span>
          <p className="text-2xl font-black text-indigo-400">{activeBookingsCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#1e1f32] border border-white/10 space-y-1">
          <span className="text-xs text-slate-400 font-medium">{isBn ? 'লয়্যালটি পয়েন্ট' : 'Loyalty Points'}</span>
          <p className="text-2xl font-black text-amber-400">{loyaltyPoints}</p>
        </div>
      </div>

      {/* ── Quick Action Cards Bar ── */}
      <div className="space-y-3">
        <h2 className="font-bold text-sm text-indigo-300 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>{isBn ? 'দ্রুত পদক্ষেপ' : 'Quick Actions'}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/services/shopping"
            className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all flex flex-col items-center justify-center gap-2 text-center group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>{isBn ? 'কেনাকাটা করুন' : 'Browse Products'}</span>
          </Link>

          <Link
            href="/dashboard/orders"
            className="p-4 rounded-2xl bg-[#1e1f32] hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
          >
            <Package className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>{isBn ? 'আমার আদেশ' : 'My Orders'}</span>
          </Link>

          <Link
            href="/dashboard/orders"
            className="p-4 rounded-2xl bg-[#1e1f32] hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
          >
            <Truck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>{isBn ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
          </Link>

          <Link
            href="/dashboard/wishlist"
            className="p-4 rounded-2xl bg-[#1e1f32] hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
          >
            <Heart className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>{isBn ? 'ইচ্ছাতালিকা' : 'Wishlist'}</span>
          </Link>

          <Link
            href="/cart"
            className="p-4 rounded-2xl bg-[#1e1f32] hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
          >
            <ShoppingCart className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>{isBn ? 'শপিং কার্ট' : 'Shopping Cart'}</span>
          </Link>

          <Link
            href="/contact"
            className="p-4 rounded-2xl bg-[#1e1f32] hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
          >
            <Headphones className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>{isBn ? 'সহায়তা' : 'Support'}</span>
          </Link>
        </div>
      </div>

      {/* ── Main Dashboard Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Recent Orders */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl bg-[#1e1f32] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>{isBn ? 'সাম্প্রতিক অর্ডার' : 'Recent Orders'}</span>
              </h2>
              <Link href="/dashboard/orders" className="text-xs font-semibold text-indigo-400 hover:underline">
                {isBn ? 'সব দেখুন' : 'View All'}
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
                <p className="text-xs">Loading orders...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl space-y-2">
                <ShoppingBag className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="font-bold text-white text-sm">No recent orders found</p>
                <p className="text-xs text-slate-400">Your order history is empty. Start shopping from the DOHS marketplace!</p>
                <Link
                  href="/services/shopping"
                  className="inline-block mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Browse Marketplace
                </Link>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {recentOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Status: <span className="text-indigo-300 font-semibold">{order.status}</span> · Total: <span className="text-emerald-400 font-bold">৳{formatCurrency(order.totalAmount || order.total)}</span>
                        </p>
                      </div>
                    </div>
                    <Link href={`/dashboard/orders/${order.id}`} className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-bold">
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Marketplace Catalog Highlights */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl bg-[#1e1f32] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{isBn ? 'মার্কেটপ্লেস পণ্যসমূহ' : 'Marketplace Products'}</span>
              </h2>
              <Link href="/services/shopping" className="text-xs font-semibold text-emerald-400 hover:underline">
                {isBn ? 'সবকিছু দেখুন →' : 'View All →'}
              </Link>
            </div>

            {catalogProducts.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl space-y-2">
                <Package className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="font-bold text-white text-sm">No products available</p>
                <p className="text-xs text-slate-400">Products added by sellers will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catalogProducts.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-[#181928] border border-white/5 space-y-2 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 text-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          '📦'
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-white truncate">{item.name}</h4>
                        <p className="text-[10px] text-slate-400 truncate">Green Market DOHS</p>
                        <p className="font-black text-xs text-emerald-400 mt-0.5">৳{formatCurrency(item.price)}</p>
                      </div>
                    </div>

                    <Link
                      href={`/services/shopping/product/${item.slug || item.id}`}
                      className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>{isBn ? 'পণ্য দেখুন' : 'View Product'}</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
