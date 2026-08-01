'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import {
  User, ShoppingBag, Clock, CheckCircle2, XCircle, Heart,
  ShoppingCart, Award, Zap, Sparkles, Package, RefreshCcw,
  Headphones, Loader2, FileText
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const { items: cartItems } = useCartStore();
  const { t, isBn, language } = useTranslation();
  const [greeting, setGreeting] = useState('Good day');

  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('goodMorning'));
    else if (hour < 18) setGreeting(t('goodAfternoon'));
    else setGreeting(t('goodEvening'));
  }, [language, t]);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      fetchApi<any[]>('/orders'),
      fetchApi<any[]>('/products?limit=4'),
    ]).then(([ordersRes, productsRes]) => {
      if (ordersRes.status === 'fulfilled' && ordersRes.value.success && Array.isArray(ordersRes.value.data)) {
        setOrders(ordersRes.value.data);
      } else {
        setOrders([]);
      }

      if (productsRes.status === 'fulfilled' && productsRes.value.success && Array.isArray(productsRes.value.data)) {
        setProducts(productsRes.value.data);
      } else {
        setProducts([]);
      }
    }).finally(() => setLoading(false));
  }, []);

  const totalOrdersCount     = orders.length;
  const activeOrdersCount    = orders.filter((o) => ['PENDING', 'SELLER_ACCEPTED', 'READY_FOR_RIDER', 'RIDER_ASSIGNED', 'PICKUP_STARTED', 'PICKED_UP', 'ON_THE_WAY', 'ARRIVED'].includes(o.status)).length;
  const completedOrdersCount = orders.filter((o) => o.status === 'DELIVERED').length;
  const cancelledOrdersCount = orders.filter((o) => o.status === 'CANCELLED' || o.status === 'REJECTED').length;

  const totalSpending = orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);
  const rewardPoints  = Math.floor(totalSpending / 35);

  const stats = [
    { title: t('totalOrders'), value: String(totalOrdersCount), label: isBn ? `${completedOrdersCount} টি ডেলিভারড` : `${completedOrdersCount} Delivered`, icon: ShoppingBag, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { title: t('activeOrders'), value: String(activeOrdersCount), label: isBn ? `${activeOrdersCount} টি ডেলিভারির পথে` : `${activeOrdersCount} Active`, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { title: t('completedOrders'), value: String(completedOrdersCount), label: isBn ? '১০০% সন্তুষ্ট' : '100% Satisfied', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { title: t('cancelledOrders'), value: String(cancelledOrdersCount), label: isBn ? 'বাতিলকৃত অর্ডার' : 'Cancelled Orders', icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { title: t('wishlistItems'), value: String(wishlistItems.length), label: isBn ? 'সেভ করা পণ্য' : 'Saved Items', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
    { title: t('cartItems'), value: String(cartItems.length), label: isBn ? 'কার্টে থাকা পণ্য' : 'Items in Cart', icon: ShoppingCart, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { title: t('rewardPoints'), value: `${rewardPoints} Pts`, label: isBn ? 'রিওয়ার্ড পয়েন্ট' : 'Reward Points', icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  const quickActions = [
    { label: t('continueShopping'), href: '/services/shopping', icon: ShoppingBag, color: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' },
    { label: t('myOrders'), href: '/dashboard/orders', icon: Package, color: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10' },
    { label: t('trackOrder'), href: '/dashboard/orders', icon: Clock, color: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10' },
    { label: t('wishlist'), href: '/dashboard/wishlist', icon: Heart, color: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10' },
    { label: t('cart'), href: '/cart', icon: ShoppingCart, color: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10' },
    { label: t('contactSupport'), href: '/contact', icon: Headphones, color: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-[#1e1f32] p-6 md:p-8 border border-indigo-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('residentMember')}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">{user?.name || (isBn ? 'রেসিডেন্ট গ্রাহক' : 'Resident Customer')}</span>!
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl">
            {t('welcomeMessage')}
          </p>
        </div>

        <div className="flex items-center gap-4 z-10 shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5 shadow-xl">
            <div className="w-full h-full rounded-2xl bg-[#1e1f32] flex items-center justify-center font-black text-2xl text-white">
              {user?.name?.[0] || 'C'}
            </div>
          </div>
          <div>
            <span className="text-xs text-indigo-300 font-bold block">{rewardPoints > 1000 ? 'Gold Tier Member' : 'Resident Member'}</span>
            <span className="text-sm font-black text-white">{rewardPoints} {t('rewardPoints')}</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className={`rounded-2xl border ${stat.bg} p-5 flex flex-col justify-between space-y-3 hover:scale-[1.02] transition-transform`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">{stat.title}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-4">
        <h2 className="font-bold text-white text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" /> {t('quickActions')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`p-3.5 rounded-xl font-semibold text-xs flex flex-col items-center justify-center gap-2 text-center transition-all ${action.color}`}
            >
              <action.icon className="w-5 h-5" />
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Recent Activities & Buy Again */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> {t('recentActivities')}
            </h2>
            <Link href="/dashboard/orders" className="text-xs text-indigo-400 hover:underline font-semibold">
              {t('viewAll')}
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
              <p className="text-xs">Loading activity...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl space-y-2">
              <Package className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="font-bold text-white text-sm">No recent activity</p>
              <p className="text-xs text-slate-400">Your recent orders and account activities will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((act, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="p-2 rounded-lg text-xs shrink-0 text-indigo-400 bg-indigo-500/10">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs text-white truncate">Order #{act.id.slice(-6).toUpperCase()}</h3>
                      <span className="text-[10px] text-slate-400 shrink-0">{new Date(act.createdAt).toLocaleDateString('en-BD', { day: '2-digit', month: 'short' })}</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">Status: {act.status} · Total: ৳{formatCurrency(act.totalAmount || act.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buy Again / Marketplace Catalog Highlights */}
        <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-emerald-400" /> {t('buyAgainEssentials')}
            </h2>
            <Link href="/services/shopping" className="text-xs text-emerald-400 hover:underline font-semibold">
              {t('exploreAll')} →
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl space-y-2">
              <ShoppingBag className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="font-bold text-white text-sm">No products available</p>
              <p className="text-xs text-slate-400">Products added by sellers will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((prod) => (
                <div key={prod.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all space-y-2 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <Link href={`/services/shopping/product/${prod.slug || prod.id}`} className="shrink-0">
                      {prod.images?.[0] ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-secondary border border-white/10 hover:scale-105 transition-transform">
                          <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-3xl p-2 rounded-xl bg-white/5 block hover:scale-105 transition-transform">
                          📦
                        </span>
                      )}
                    </Link>
                    <div className="min-w-0">
                      <Link href={`/services/shopping/product/${prod.slug || prod.id}`}>
                        <h4 className="font-bold text-xs text-white truncate hover:text-emerald-400 transition-colors">{prod.name}</h4>
                      </Link>
                      <p className="text-[10px] text-slate-400">Green Market DOHS</p>
                      <p className="text-xs font-black text-emerald-400 mt-1">৳{formatCurrency(prod.price)}</p>
                    </div>
                  </div>
                  <Link href={`/services/shopping/product/${prod.slug || prod.id}`} className="w-full py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5" /> View Product
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
