'use client';

import React from 'react';
import { ShoppingCart, Users } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

interface TargetMetricsProps {
  ordersCount?: number;
  ordersTargetPct?: number;
  usersCount?: number;
  usersTargetPct?: number;
}

export function TargetMetricsCard({
  ordersCount = 58,
  ordersTargetPct = 70,
  usersCount = 136,
  usersTargetPct = 80,
}: TargetMetricsProps) {
  const { language } = useLanguageStore();
  const isBn = language === 'BN';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Orders Target Card */}
      <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 text-white shadow-xl flex flex-col justify-between space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {isBn ? 'আদেশ' : 'Orders'}
          </span>
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="text-3xl font-black text-white">{ordersCount}</div>
          <div className="text-xs font-semibold text-slate-400">
            {ordersTargetPct} % {isBn ? 'লক্ষ্যমাত্রা' : 'Target'}
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#181928] overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${ordersTargetPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Users Target Card */}
      <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 text-white shadow-xl flex flex-col justify-between space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {isBn ? 'ব্যবহারকারীরা' : 'Users'}
          </span>
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="text-3xl font-black text-white">{usersCount}</div>
          <div className="text-xs font-semibold text-slate-400">
            {usersTargetPct} % {isBn ? 'লক্ষ্যমাত্রা' : 'Target'}
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#181928] overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${usersTargetPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

