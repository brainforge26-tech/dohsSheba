'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Bell,
  CheckCircle2,
  Package,
  CreditCard,
  Truck,
  Tag,
  RefreshCcw,
  MessageSquare,
  Filter,
  Check,
  Trash2,
} from 'lucide-react';

export default function NotificationsPage() {
  const { isBn } = useTranslation();
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filtered = notifications.filter(
    (n) => activeFilter === 'ALL' || n.type.toUpperCase() === activeFilter
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'DELIVERY':
        return <Truck className="w-5 h-5 text-indigo-400" />;
      case 'PAYMENTS':
        return <CreditCard className="w-5 h-5 text-emerald-400" />;
      case 'OFFERS':
        return <Tag className="w-5 h-5 text-purple-400" />;
      case 'REFUNDS':
        return <RefreshCcw className="w-5 h-5 text-amber-400" />;
      default:
        return <Bell className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-purple-400" />
            {isBn ? 'নোটিফিকেশন সেন্টারে' : 'Notifications Center'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isBn
              ? 'আপনার অর্ডার, পেমেন্ট ও ডেলিভারির রিয়েল-টাইম নোটিফিকেশন আপডেট'
              : 'Stay updated with orders, payments, delivery alerts, and resident offers'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => markAllAsRead()}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isBn ? 'সবগুলো পড়া হয়েছে চিহ্নিত করুন' : 'Mark All as Read'}</span>
          </button>

          <button
            onClick={clearAll}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
            title={isBn ? 'সব মুছে ফেলুন' : 'Clear All'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['ALL', 'DELIVERY', 'PAYMENTS', 'OFFERS', 'REFUNDS'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeFilter === cat
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-[#1e1f32] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#1e1f32] border border-white/10 text-slate-400 text-xs">
            {isBn ? 'কোনো নোটিফিকেশন পাওয়া যায়নি' : 'No notifications found.'}
          </div>
        ) : (
          filtered.map((n) => (
            <Link
              key={n.id}
              href={n.link || '#'}
              onClick={() => markAsRead(n.id)}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 block ${
                n.read
                  ? 'bg-[#1e1f32] border-white/5 opacity-80'
                  : 'bg-[#1e1f32] border-purple-500/30 ring-1 ring-purple-500/20'
              }`}
            >
              <div className="p-3 rounded-xl shrink-0 bg-white/5 border border-white/10">
                {getNotificationIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    {n.title}
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    )}
                  </h3>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-300">{n.desc}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
