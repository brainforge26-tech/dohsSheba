'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/cn';
import {
  Wallet, DollarSign, ArrowUpRight, ArrowDownLeft, TrendingUp,
  CreditCard, Building, Download, BarChart2, Percent, Clock, CheckCircle2,
} from 'lucide-react';

const MONTHLY = [
  { month: 'Feb', revenue: 15600, commission: 1560, net: 14040 },
  { month: 'Mar', revenue: 18900, commission: 1890, net: 17010 },
  { month: 'Apr', revenue: 16400, commission: 1640, net: 14760 },
  { month: 'May', revenue: 21500, commission: 2150, net: 19350 },
  { month: 'Jun', revenue: 24160, commission: 2416, net: 21744 },
  { month: 'Jul', revenue: 28440, commission: 2844, net: 25596 },
];

const RECENT_TXS = [
  { id: 'tx-109', type: 'CREDIT', amount: 18340,  label: 'Order earnings — Jul 28', date: '28 Jul 2026', status: 'COMPLETED' },
  { id: 'tx-108', type: 'CREDIT', amount: 24160,  label: 'Order earnings — Jul 27', date: '27 Jul 2026', status: 'COMPLETED' },
  { id: 'tx-107', type: 'DEBIT',  amount: 15000,  label: 'Withdrawal to bKash',     date: '25 Jul 2026', status: 'COMPLETED' },
  { id: 'tx-106', type: 'CREDIT', amount: 12800,  label: 'Order earnings — Jul 24', date: '24 Jul 2026', status: 'COMPLETED' },
  { id: 'tx-105', type: 'DEBIT',  amount: 20000,  label: 'Withdrawal to DBBL',      date: '20 Jul 2026', status: 'COMPLETED' },
];

const maxRev = Math.max(...MONTHLY.map(m => m.revenue));

export default function FinanceOverviewPage() {

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Dashboard / Finance</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-400" /> Finance Overview
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Track store revenue, wallet balance, commissions, and payout history</p>
        </div>
        <div className="flex gap-2">
          <Link href="/seller/dashboard/finance/withdraw"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-lg">
            <ArrowUpRight className="w-3.5 h-3.5" /> Request Withdrawal
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Gross Revenue',    value: 142800, icon: DollarSign,  color: 'from-indigo-600 to-purple-700', sub: '+18.4% this month' },
          { label: 'Net Earnings',     value: 128520, icon: TrendingUp,  color: 'from-emerald-600 to-teal-700', sub: 'After 10% commission' },
          { label: 'Wallet Balance',   value: 42500,  icon: Wallet,      color: 'from-cyan-600 to-blue-700',    sub: '৳38,250 withdrawable' },
          { label: 'Total Withdrawn',  value: 86020,  icon: ArrowUpRight, color: 'from-amber-600 to-orange-700', sub: 'All time' },
        ].map((c) => (
          <div key={c.label} className={`rounded-2xl bg-gradient-to-br ${c.color} p-5 shadow-lg`}>
            <div className="flex items-center justify-between mb-3">
              <c.icon className="w-5 h-5 text-white/70" />
              <p className="text-[10px] font-semibold text-white/60">{c.sub}</p>
            </div>
            <p className="font-black text-white text-xl">৳{formatCurrency(c.value)}</p>
            <p className="text-xs text-white/70 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Commission Banner */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
        <Percent className="w-6 h-6 text-amber-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">Platform Commission: 10%</p>
          <p className="text-xs text-slate-400 mt-0.5">৳14,280 deducted this month · ৳128,520 net earnings retained</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-amber-300 font-semibold">৳14,280</p>
          <p className="text-[10px] text-slate-500">this month</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white text-sm flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-400" /> Monthly Revenue vs Net Earnings
          </h2>
          <div className="flex gap-3 text-[10px]">
            <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-indigo-500" />Revenue</span>
            <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-500" />Net</span>
          </div>
        </div>
        <div className="flex items-end gap-3 h-36">
          {MONTHLY.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-0.5 items-end" style={{ height: '100%' }}>
                <div className="flex-1 rounded-t-lg bg-indigo-500/60 hover:bg-indigo-500 transition-colors"
                  style={{ height: `${(m.revenue / maxRev) * 100}%` }} title={`Revenue ৳${formatCurrency(m.revenue)}`} />
                <div className="flex-1 rounded-t-lg bg-emerald-500/60 hover:bg-emerald-500 transition-colors"
                  style={{ height: `${(m.net / maxRev) * 100}%` }} title={`Net ৳${formatCurrency(m.net)}`} />
              </div>
              <p className="text-[10px] text-slate-500">{m.month}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Wallet',       href: '/seller/dashboard/finance/wallet',       icon: Wallet,       desc: 'Balance & payout methods' },
          { label: 'Withdraw',     href: '/seller/dashboard/finance/withdraw',     icon: ArrowUpRight, desc: 'Request payout' },
          { label: 'Transactions', href: '/seller/dashboard/finance/transactions', icon: CreditCard,   desc: 'Full history' },
          { label: 'Analytics',    href: '/seller/dashboard/analytics',            icon: TrendingUp,   desc: 'Performance insights' },
        ].map((l) => (
          <Link key={l.label} href={l.href}
            className="group rounded-2xl bg-[#1e1f32] border border-white/10 hover:border-indigo-500/40 p-4 flex flex-col gap-2 transition-all hover:bg-white/5">
            <l.icon className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            <p className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">{l.label}</p>
            <p className="text-[11px] text-slate-500">{l.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-bold text-white text-sm">Recent Transactions</h2>
          <Link href="/seller/dashboard/finance/transactions"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">View All →</Link>
        </div>
        <div className="divide-y divide-white/5">
          {RECENT_TXS.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-emerald-500/15' : 'bg-rose-500/15'}`}>
                  {tx.type === 'CREDIT'
                    ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                    : <ArrowUpRight className="w-4 h-4 text-rose-400" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{tx.label}</p>
                  <p className="text-[11px] text-slate-500">{tx.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className={`font-bold text-sm ${tx.type === 'CREDIT' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tx.type === 'CREDIT' ? '+' : '-'}৳{formatCurrency(tx.amount)}
                </p>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
