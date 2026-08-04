'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import {
  ShoppingBag, Clock, CheckCircle2, XCircle, Heart,
  ShoppingCart, Award, Sparkles, Package, RefreshCcw,
  Headphones, Loader2, MapPin, Truck, ChevronRight,
  Star, Gift, ArrowRight, Home, Search, Bell,
} from 'lucide-react';

// ── Status label helpers ──────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, { label: string; labelBn: string; color: string }> = {
  PENDING:           { label: 'Pending Confirmation', labelBn: 'অর্ডার পেন্ডিং',       color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  SELLER_ACCEPTED:   { label: 'Seller Accepted',      labelBn: 'সেলার গ্রহণ করেছেন',    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  READY_FOR_RIDER:   { label: 'Ready for Pickup',     labelBn: 'পিকআপের জন্য প্রস্তুত', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  RIDER_ASSIGNED:    { label: 'Rider Assigned',        labelBn: 'রাইডার নিযুক্ত',        color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  PICKED_UP:         { label: 'Picked Up',             labelBn: 'পিকআপ হয়েছে',           color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  ON_THE_WAY:        { label: 'On the Way 🛵',         labelBn: 'রাস্তায় আছে 🛵',         color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ARRIVED:           { label: 'Arrived!',              labelBn: 'পৌঁছে গেছে!',           color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  DELIVERED:         { label: 'Delivered ✓',           labelBn: 'ডেলিভারড ✓',             color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  CANCELLED:         { label: 'Cancelled',             labelBn: 'বাতিল',                  color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  REJECTED:          { label: 'Rejected',              labelBn: 'প্রত্যাখ্যাত',           color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

const ACTIVE_STATUSES = ['PENDING','SELLER_ACCEPTED','READY_FOR_RIDER','RIDER_ASSIGNED','PICKED_UP','ON_THE_WAY','ARRIVED'];

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const { items: cartItems } = useCartStore();
  const { language } = useLanguageStore();
  const isBn = language === 'BN';

  const [greeting, setGreeting] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12)      setGreeting(isBn ? 'শুভ সকাল' : 'Good Morning');
    else if (hour < 18) setGreeting(isBn ? 'শুভ অপরাহ্ন' : 'Good Afternoon');
    else                setGreeting(isBn ? 'শুভ সন্ধ্যা' : 'Good Evening');
  }, [isBn]);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      fetchApi<any>('/orders'),
      fetchApi<any>('/products?limit=6&isFeatured=true'),
    ]).then(([ordersRes, productsRes]) => {
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.success && Array.isArray(ordersRes.value.data))
        setOrders(ordersRes.value.data);
      else setOrders([]);

      if (productsRes.status === 'fulfilled' && productsRes.value?.success) {
        const data = productsRes.value.data;
        setProducts(Array.isArray(data) ? data : (data?.products ?? []));
      } else setProducts([]);
    }).finally(() => setLoading(false));
  }, []);

  const totalOrders     = orders.length;
  const activeOrders    = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const completedOrders = orders.filter((o) => o.status === 'DELIVERED');
  const cancelledCount  = orders.filter((o) => ['CANCELLED','REJECTED'].includes(o.status)).length;
  const totalSpending   = orders.reduce((s, o) => s + (o.totalAmount || o.total || 0), 0);
  const rewardPoints    = Math.floor(totalSpending / 35);
  const cartCount       = cartItems.reduce((s, i) => s + i.quantity, 0);

  // The most recent active order to highlight
  const liveOrder = activeOrders[0] || null;
  const liveStatus = liveOrder ? (STATUS_LABEL[liveOrder.status] || { label: liveOrder.status, labelBn: liveOrder.status, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' }) : null;

  const quickActions = [
    { label: isBn ? 'শপিং করুন' : 'Shop Now',       href: '/services/shopping',     emoji: '🛍️', bg: 'from-emerald-600 to-teal-600', text: 'text-white', primary: true },
    { label: isBn ? 'আমার অর্ডারস' : 'My Orders',   href: '/dashboard/orders',       emoji: '📦', bg: 'from-indigo-600 to-violet-600', text: 'text-white', primary: true },
    { label: isBn ? 'ঠিকানা' : 'Addresses',         href: '/dashboard/addresses',    emoji: '📍', bg: '', text: '' },
    { label: isBn ? 'উইশলিস্ট' : 'Wishlist',        href: '/dashboard/wishlist',     emoji: '❤️', bg: '', text: '', badge: wishlistItems.length },
    { label: isBn ? 'কুপন' : 'Coupons',              href: '/dashboard/coupons',      emoji: '🏷️', bg: '', text: '' },
    { label: isBn ? 'সাপোর্ট' : 'Support',           href: '/contact',                emoji: '🎧', bg: '', text: '' },
  ];

  const userName = user?.name?.split(' ')[0] || (isBn ? 'রেসিডেন্ট' : 'Resident');

  return (
    <div className="space-y-5 pb-6">

      {/* ── Welcome Banner ─────────────────────────────────────────────── */}
      <div className="rounded-3xl overflow-hidden relative bg-gradient-to-r from-[#1a2a4a] via-[#1a2040] to-[#1e1f32] border border-indigo-500/20 shadow-2xl">
        {/* BG glow blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-32 h-32 rounded-full bg-emerald-600/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-7">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-[11px] font-bold tracking-wide">
              <Sparkles className="w-3 h-3" />
              <span>{isBn ? '✦ DOHS শেবা রেসিডেন্ট মেম্বার' : '✦ DOHS Sheba Resident Member'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {greeting},{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-emerald-300">
                {userName}!
              </span>
            </h1>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              {isBn
                ? 'আপনার অর্ডার ট্র্যাক করুন, পুনরায় কিনুন এবং DOHS শেবার সেরা অফার উপভোগ করুন।'
                : 'Track your orders, reorder favorites, and enjoy the best of DOHS Sheba marketplace.'}
            </p>
          </div>

          {/* Avatar + Reward Points — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            {/* Reward Badge */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-xl mb-1">
                <span className="text-2xl">{rewardPoints > 500 ? '🏆' : '⭐'}</span>
              </div>
              <p className="text-[10px] text-amber-400 font-black">{rewardPoints} pts</p>
            </div>
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5 shadow-xl">
              <div className="w-full h-full rounded-2xl bg-[#1e1f32] flex items-center justify-center font-black text-2xl text-white">
                {user?.name?.[0]?.toUpperCase() || 'C'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Live Active Order Banner ──────────────────────────────────── */}
      {liveOrder && liveStatus && (
        <div className="rounded-2xl bg-gradient-to-r from-[#0f2a1a] to-[#1e1f32] border border-emerald-500/30 p-4 flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 animate-pulse">
              <Truck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-black text-white">
                  {isBn ? 'অর্ডার লাইভ ট্র্যাকিং' : 'Live Order Tracking'}
                </p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${liveStatus.color}`}>
                  {isBn ? liveStatus.labelBn : liveStatus.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isBn ? 'অর্ডার' : 'Order'} #{liveOrder.id?.slice(-6).toUpperCase()} · ৳{formatCurrency(liveOrder.totalAmount || liveOrder.total || 0)}
              </p>
            </div>
          </div>
          <Link
            href={`/dashboard/orders`}
            className="shrink-0 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            {isBn ? 'ট্র্যাক করুন' : 'Track'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── Metric Pill Bar ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: isBn ? 'মোট অর্ডার' : 'Total Orders',
            value: totalOrders,
            sub: isBn ? `${completedOrders.length} ডেলিভারড` : `${completedOrders.length} delivered`,
            icon: '📦', color: 'border-indigo-500/20 bg-indigo-500/5',
            iconBg: 'bg-indigo-500/15 text-indigo-400',
          },
          {
            label: isBn ? 'সক্রিয় অর্ডার' : 'Active Orders',
            value: activeOrders.length,
            sub: isBn ? 'রাস্তায় আছে' : 'in progress',
            icon: '🛵', color: 'border-amber-500/20 bg-amber-500/5',
            iconBg: 'bg-amber-500/15 text-amber-400',
          },
          {
            label: isBn ? 'উইশলিস্ট' : 'Wishlist',
            value: wishlistItems.length,
            sub: isBn ? 'সেভ করা পণ্য' : 'saved items',
            icon: '❤️', color: 'border-pink-500/20 bg-pink-500/5',
            iconBg: 'bg-pink-500/15 text-pink-400',
          },
          {
            label: isBn ? 'রিওয়ার্ড পয়েন্ট' : 'Reward Points',
            value: rewardPoints,
            sub: isBn ? 'মোট অর্জন' : 'pts earned',
            icon: '⭐', color: 'border-amber-500/20 bg-amber-500/5',
            iconBg: 'bg-amber-500/15 text-amber-400',
          },
        ].map((m) => (
          <div key={m.label} className={`rounded-2xl border ${m.color} p-4 flex flex-col gap-2`}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-slate-400 leading-tight">{m.label}</p>
              <span className="text-base">{m.icon}</span>
            </div>
            <p className="text-2xl font-black text-white">{m.value}</p>
            <p className="text-[11px] text-slate-500">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
          {isBn ? 'দ্রুত অ্যাকসেস' : 'Quick Access'}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`relative group rounded-2xl p-3 flex flex-col items-center gap-2 text-center transition-all active:scale-95 ${
                action.primary
                  ? `bg-gradient-to-br ${action.bg} shadow-lg hover:shadow-xl hover:opacity-95`
                  : 'bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/15'
              }`}
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className={`text-[10px] font-bold leading-tight ${action.primary ? 'text-white' : 'text-slate-300'}`}>
                {action.label}
              </span>
              {!!action.badge && action.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#181928] shadow">
                  {action.badge > 9 ? '9+' : action.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent Orders + Featured Products ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Orders */}
        <div className="rounded-2xl bg-[#1e1f32] border border-white/8 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              {isBn ? 'সাম্প্রতিক অর্ডারস' : 'Recent Orders'}
            </h2>
            <Link href="/dashboard/orders" className="text-[11px] font-bold text-indigo-400 hover:underline flex items-center gap-1">
              {isBn ? 'সব দেখুন' : 'View All'} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              <p className="text-xs text-slate-500">{isBn ? 'লোড হচ্ছে...' : 'Loading...'}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-white/10 rounded-2xl space-y-3">
              <div className="text-4xl">📦</div>
              <p className="font-bold text-white text-sm">{isBn ? 'কোনো অর্ডার নেই' : 'No orders yet'}</p>
              <p className="text-xs text-slate-400 px-4">
                {isBn ? 'আপনার প্রথম অর্ডার দিতে নিচের বাটনে ক্লিক করুন।' : 'Place your first order from the DOHS Sheba marketplace.'}
              </p>
              <Link href="/services/shopping" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-all">
                <ShoppingBag className="w-3.5 h-3.5" /> {isBn ? 'শপিং করুন' : 'Start Shopping'}
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {orders.slice(0, 4).map((order) => {
                const st = STATUS_LABEL[order.status] || { label: order.status, labelBn: order.status, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' };
                return (
                  <Link
                    key={order.id}
                    href={`/dashboard/orders/${order.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-base">
                      {order.status === 'DELIVERED' ? '✅' : order.status === 'CANCELLED' ? '❌' : '🛵'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-white truncate">
                          #{order.id?.slice(-6)?.toUpperCase()}
                        </p>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold border ${st.color}`}>
                          {isBn ? st.labelBn : st.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        ৳{formatCurrency(order.totalAmount || order.total || 0)} · {new Date(order.createdAt).toLocaleDateString('en-BD', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Featured Products / Buy Again */}
        <div className="rounded-2xl bg-[#1e1f32] border border-white/8 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-emerald-400" />
              {isBn ? 'পুনরায় কিনুন' : 'Buy Again'}
            </h2>
            <Link href="/services/shopping" className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1">
              {isBn ? 'সব পণ্য' : 'Browse All'} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <p className="text-xs text-slate-500">{isBn ? 'লোড হচ্ছে...' : 'Loading...'}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-white/10 rounded-2xl space-y-3">
              <div className="text-4xl">🛒</div>
              <p className="font-bold text-white text-sm">{isBn ? 'পণ্য পাওয়া যায়নি' : 'No products found'}</p>
              <p className="text-xs text-slate-400">{isBn ? 'মার্কেটপ্লেস থেকে পণ্য খুঁজুন' : 'Explore our marketplace for fresh groceries.'}</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {products.slice(0, 4).map((prod) => (
                <div key={prod.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                  <Link href={`/services/shopping/product/${prod.slug || prod.id}`} className="shrink-0">
                    {prod.images?.[0] ? (
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-800 border border-white/10">
                        <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-lg">📦</div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/services/shopping/product/${prod.slug || prod.id}`}>
                      <p className="text-xs font-bold text-white truncate hover:text-emerald-400 transition-colors">{prod.name}</p>
                    </Link>
                    <p className="text-[11px] text-emerald-400 font-black mt-0.5">৳{formatCurrency(prod.price)}</p>
                  </div>
                  <Link
                    href={`/services/shopping/product/${prod.slug || prod.id}`}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold transition-all whitespace-nowrap"
                  >
                    {isBn ? 'কিনুন' : 'Buy'}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Banner: Total Spending Summary ────────────────────── */}
      {totalSpending > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-[#1a2a4a] to-[#1e1f32] border border-indigo-500/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              {isBn ? '✦ আপনার DOHS শেবা যাত্রা' : '✦ Your DOHS Sheba Journey'}
            </p>
            <p className="text-xl font-black text-white">
              {isBn ? 'মোট খরচ:' : 'Total Spent:'}{' '}
              <span className="text-emerald-400">৳{formatCurrency(totalSpending)}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {isBn
                ? `${completedOrders.length} টি সফল অর্ডার · ${rewardPoints} রিওয়ার্ড পয়েন্ট অর্জিত`
                : `${completedOrders.length} successful orders · ${rewardPoints} reward points earned`}
            </p>
          </div>
          <Link
            href="/dashboard/coupons"
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <Gift className="w-4 h-4" />
            {isBn ? 'কুপন ও রিওয়ার্ড দেখুন' : 'View Rewards & Coupons'}
          </Link>
        </div>
      )}
    </div>
  );
}
