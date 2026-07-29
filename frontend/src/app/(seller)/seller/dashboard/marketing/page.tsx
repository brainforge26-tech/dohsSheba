'use client';

import React from 'react';
import Link from 'next/link';
import { Megaphone, Tag, Percent, Zap, ArrowUpRight, TrendingUp, Users, ShoppingBag } from 'lucide-react';

const STATS = [
  { label: 'Active Coupons',     value: '4',      icon: Tag,       color: 'from-indigo-600 to-purple-700' },
  { label: 'Active Discounts',   value: '2',      icon: Percent,   color: 'from-emerald-600 to-teal-700' },
  { label: 'Flash Sales',        value: '1',      icon: Zap,       color: 'from-amber-600 to-orange-700' },
  { label: 'Coupon Redemptions', value: '148',    icon: TrendingUp, color: 'from-cyan-600 to-blue-700' },
];

const MODULES = [
  {
    href: '/seller/dashboard/marketing/coupons',
    icon: Tag, label: 'Coupons & Promo Codes',
    desc: 'Create and manage discount coupons for your customers',
    badge: '4 active',
    color: 'border-indigo-500/30 hover:border-indigo-500',
  },
  {
    href: '/seller/dashboard/marketing/discounts',
    icon: Percent, label: 'Discount Campaigns',
    desc: 'Set percentage or fixed discounts on products and categories',
    badge: '2 active',
    color: 'border-emerald-500/30 hover:border-emerald-500',
  },
  {
    href: '/seller/dashboard/marketing/flash-sale',
    icon: Zap, label: 'Flash Sales',
    desc: 'Time-limited sales with countdown timers to drive urgency',
    badge: '1 live',
    color: 'border-amber-500/30 hover:border-amber-500',
  },
];

export default function MarketingOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-slate-500 mb-0.5">Dashboard / Marketing</p>
        <h1 className="font-black text-white text-xl flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-indigo-400" /> Marketing Overview
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage coupons, discounts, and flash sales to grow your store revenue</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className={`rounded-2xl bg-gradient-to-br ${s.color} p-4 shadow-lg`}>
            <s.icon className="w-5 h-5 text-white/70 mb-2" />
            <p className="font-black text-white text-2xl">{s.value}</p>
            <p className="text-xs text-white/70 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MODULES.map((m) => (
          <Link key={m.href} href={m.href}
            className={`group rounded-2xl bg-[#1e1f32] border ${m.color} p-5 flex flex-col gap-3 transition-all hover:bg-white/5`}>
            <div className="flex items-center justify-between">
              <m.icon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {m.badge}
              </span>
            </div>
            <div>
              <p className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">{m.label}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.desc}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Performance hint */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
        <TrendingUp className="w-5 h-5 mt-0.5 shrink-0 text-indigo-400" />
        <div>
          <p className="font-bold text-white mb-0.5">Marketing drives 23% more repeat purchases</p>
          <p>Customers who receive coupons spend on average 18% more per order. Try creating a first-time buyer discount!</p>
        </div>
      </div>
    </div>
  );
}
