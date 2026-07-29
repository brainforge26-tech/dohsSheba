'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from '@/utils/cn';
import {
  User,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Heart,
  ShoppingCart,
  Award,
  Zap,
  ArrowRight,
  Sparkles,
  Package,
  TrendingUp,
  RefreshCcw,
  MessageSquare,
  ShieldAlert,
  Headphones,
  Search,
  ChevronRight,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const { t, isBn, language } = useTranslation();
  const [greeting, setGreeting] = useState('Good day');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('goodMorning'));
    else if (hour < 18) setGreeting(t('goodAfternoon'));
    else setGreeting(t('goodEvening'));
  }, [language, t]);

  const stats = [
    { title: t('totalOrders'), value: '18', label: isBn ? '১৪ টি ডেলিভারড' : '14 Delivered', icon: ShoppingBag, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { title: t('activeOrders'), value: '3', label: isBn ? '১ টি ডেলিভারির পথে' : '1 Out for Delivery', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { title: t('completedOrders'), value: '14', label: isBn ? '১০০% সন্তুষ্ট' : '100% Satisfied', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { title: t('cancelledOrders'), value: '1', label: isBn ? 'রিফান্ড সম্পন্ন' : 'Refund Completed', icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { title: t('wishlistItems'), value: '8', label: isBn ? '২ টি পণ্যের দাম কমেছে' : '2 Price Drops', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
    { title: t('cartItems'), value: '4', label: isBn ? '৳১,৮৫০ আনুমানিক' : '৳1,850 Estimated', icon: ShoppingCart, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { title: t('rewardPoints'), value: '450 Pts', label: isBn ? '৳৪৫০ ভাউচার রেডি' : '৳450 Voucher Ready', icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { title: t('totalSpending'), value: `৳${formatCurrency(24500)}`, label: isBn ? 'গোল্ড মেম্বারশিপ' : 'Gold Tier Member', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  ];

  const quickActions = [
    { label: t('continueShopping'), href: '/', icon: ShoppingBag, color: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' },
    { label: t('myOrders'), href: '/dashboard/orders', icon: Package, color: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10' },
    { label: t('trackOrder'), href: '/dashboard/orders/track', icon: Clock, color: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10' },
    { label: t('wishlist'), href: '/dashboard/wishlist', icon: Heart, color: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10' },
    { label: t('cart'), href: '/dashboard/cart', icon: ShoppingCart, color: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10' },
    { label: t('contactSupport'), href: '/dashboard/support', icon: Headphones, color: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10' },
  ];

  const recentActivities = [
    {
      title: isBn ? 'অর্ডার #ORD-9942 ডেলিভারড সম্পন্ন' : 'Order #ORD-9942 Delivered',
      time: isBn ? '১০ মিনিট আগে' : '10 mins ago',
      desc: isBn ? 'ডিএইচএস এক্সপ্রেস থেকে খাটি দুধ ও টমেটো ডেলিভারড হয়েছে' : 'Fresh Tomatoes & Organic Whole Milk delivered by DOHS Express',
      type: 'delivery',
      color: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      title: isBn ? 'পেমেন্ট নিশ্চিত হয়েছে' : 'Payment Confirmed',
      time: isBn ? '২ ঘন্টা আগে' : '2 hours ago',
      desc: isBn ? 'বিকাশের মাধ্যমে ৳১,৮৫০ টাকা পরিশোধিত' : '৳1,850 via bKash payment for Order #ORD-9945',
      type: 'payment',
      color: 'text-indigo-400 bg-indigo-500/10',
    },
    {
      title: isBn ? 'অর্ডার #ORD-9945 সম্পন্ন' : 'Order #ORD-9945 Placed',
      time: isBn ? '২ ঘন্টা আগে' : '2 hours ago',
      desc: isBn ? 'বাশমতি চাল (৫ কেজি) ও সরিষার তেল (১ লিটার)' : 'Basmati Rice (5kg) & Mustard Oil (1L)',
      type: 'order',
      color: 'text-cyan-400 bg-cyan-500/10',
    },
  ];

  const buyAgainProducts = [
    { id: 'prod-1', name: isBn ? 'খাটি দুধ (২ লিটার)' : 'Organic Whole Milk (2L)', seller: 'DOHS Dairy Store', price: 180, image: '🥛' },
    { id: 'prod-2', name: isBn ? 'প্রিমিয়াম বাশমতি চাল (৫ কেজি)' : 'Premium Basmati Rice (5kg)', seller: 'Super Bazar DOHS', price: 650, image: '🌾' },
    { id: 'prod-3', name: isBn ? 'সরিষার তেল (১ লিটার)' : 'Cold Pressed Mustard Oil (1L)', seller: 'Pure Spices & Oils', price: 320, image: '🍾' },
    { id: 'prod-4', name: isBn ? 'ফার্মের লাল ডিম (১২ টি)' : 'Fresh Farm Eggs (12 pcs)', seller: 'Organic Farm BD', price: 155, image: '🥚' },
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
            <span className="text-xs text-indigo-300 font-bold block">{t('goldMember')}</span>
            <span className="text-sm font-black text-white">450 {t('rewardPoints')}</span>
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
            <Link href="/dashboard/notifications" className="text-xs text-indigo-400 hover:underline font-semibold">
              {t('viewAll')}
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className={`p-2 rounded-lg text-xs shrink-0 ${act.color}`}>
                  <Package className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-0.5 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-white truncate">{act.title}</h3>
                    <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buy Again Quick Shelf */}
        <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-emerald-400" /> {t('buyAgainEssentials')}
            </h2>
            <Link href="/dashboard/buy-again" className="text-xs text-emerald-400 hover:underline font-semibold">
              {t('exploreAll')} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {buyAgainProducts.map((prod) => (
              <div key={prod.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all space-y-2 flex flex-col justify-between">
                <div className="flex items-start gap-3">
                  <Link href={`/services/shopping/product/${prod.id}`} className="shrink-0">
                    {prod.image && (prod.image.startsWith('http') || prod.image.startsWith('/')) ? (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-secondary border border-white/10 hover:scale-105 transition-transform">
                        <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <span className="text-3xl p-2 rounded-xl bg-white/5 block hover:scale-105 transition-transform">
                        {prod.image || '🛒'}
                      </span>
                    )}
                  </Link>
                  <div className="min-w-0">
                    <Link href={`/services/shopping/product/${prod.id}`}>
                      <h4 className="font-bold text-xs text-white truncate hover:text-emerald-400 transition-colors">{prod.name}</h4>
                    </Link>
                    <p className="text-[10px] text-slate-400">{prod.seller}</p>
                    <p className="text-xs font-black text-emerald-400 mt-1">৳{formatCurrency(prod.price)}</p>
                  </div>
                </div>
                <button className="w-full py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5" /> {t('reorder')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
