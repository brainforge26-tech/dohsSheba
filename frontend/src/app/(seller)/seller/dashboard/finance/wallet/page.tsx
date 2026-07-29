'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/cn';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, Plus, RefreshCcw,
  CreditCard, Building2, Smartphone, ChevronRight, ShieldCheck,
  Clock, CheckCircle2, XCircle, TrendingUp,
} from 'lucide-react';

const MOCK_WALLET = {
  balance: 42500,
  withdrawable: 38250,
  pendingIn: 8400,
  pendingOut: 4250,
  lifetimeEarned: 186520,
  lifetimeWithdrawn: 144020,
};

const MOCK_TXS = [
  { id: 'w-2024', type: 'IN',  label: 'Order Settlement #ORD-2024', amount: 4820, date: '28 Jul 2026 · 11:00', status: 'COMPLETED' },
  { id: 'w-2023', type: 'OUT', label: 'Withdrawal → bKash (01711-XXXXX)', amount: -15000, date: '25 Jul 2026 · 14:10', status: 'COMPLETED' },
  { id: 'w-2022', type: 'IN',  label: 'Order Settlement #ORD-2022', amount: 3160, date: '24 Jul 2026 · 16:00', status: 'COMPLETED' },
  { id: 'w-2021', type: 'OUT', label: 'Withdrawal → DBBL Bank', amount: -20000, date: '20 Jul 2026 · 10:00', status: 'COMPLETED' },
  { id: 'w-2020', type: 'IN',  label: 'Order Settlement #ORD-2020', amount: 6250, date: '18 Jul 2026 · 09:30', status: 'COMPLETED' },
  { id: 'w-2019', type: 'IN',  label: 'Refund Reversal #REF-0041', amount: 1200, date: '15 Jul 2026 · 13:45', status: 'COMPLETED' },
  { id: 'w-2018', type: 'PENDING', label: 'Order Settlement #ORD-2018', amount: 8400, date: '28 Jul 2026 · 11:00', status: 'PENDING' },
];

export default function WalletPage() {
  const [tab, setTab] = useState<'all' | 'in' | 'out' | 'pending'>('all');

  const filtered = MOCK_TXS.filter((t) => {
    if (tab === 'in')      return t.type === 'IN';
    if (tab === 'out')     return t.type === 'OUT';
    if (tab === 'pending') return t.type === 'PENDING';
    return true;
  });

  const statusIcon = (s: string) => {
    if (s === 'COMPLETED') return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    if (s === 'PENDING')   return <Clock className="w-4 h-4 text-amber-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Finance / Wallet</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-400" /> My Wallet
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Your store wallet balance, pending earnings, and transaction history</p>
        </div>
        <Link href="/seller/dashboard/finance/withdraw"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-lg">
          <ArrowUpRight className="w-3.5 h-3.5" /> Withdraw Funds
        </Link>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Balance',    value: MOCK_WALLET.balance,         icon: Wallet,        color: 'from-indigo-600 to-purple-600' },
          { label: 'Withdrawable',     value: MOCK_WALLET.withdrawable,    icon: ArrowUpRight,  color: 'from-emerald-600 to-teal-600' },
          { label: 'Pending (Incoming)', value: MOCK_WALLET.pendingIn,     icon: TrendingUp,    color: 'from-amber-600 to-orange-600' },
          { label: 'Pending (Payout)', value: MOCK_WALLET.pendingOut,      icon: Clock,         color: 'from-rose-600 to-pink-600' },
        ].map((c) => (
          <div key={c.label} className={`rounded-2xl bg-gradient-to-br ${c.color} p-4 flex flex-col gap-2 shadow-lg`}>
            <c.icon className="w-5 h-5 text-white/80" />
            <p className="text-[11px] text-white/70 font-medium">{c.label}</p>
            <p className="font-black text-white text-lg">৳{formatCurrency(c.value)}</p>
          </div>
        ))}
      </div>

      {/* Lifetime Summary */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-400 mb-1">Lifetime Earned</p>
          <p className="font-black text-emerald-400 text-xl">৳{formatCurrency(MOCK_WALLET.lifetimeEarned)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Total Withdrawn</p>
          <p className="font-black text-indigo-400 text-xl">৳{formatCurrency(MOCK_WALLET.lifetimeWithdrawn)}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-slate-500 mb-1.5">Withdrawal Progress</p>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${Math.round((MOCK_WALLET.lifetimeWithdrawn / MOCK_WALLET.lifetimeEarned) * 100)}%` }}
            />
          </div>
          <p className="text-right text-[10px] text-slate-500 mt-1">
            {Math.round((MOCK_WALLET.lifetimeWithdrawn / MOCK_WALLET.lifetimeEarned) * 100)}% withdrawn
          </p>
        </div>
      </div>

      {/* Quick Pay Out Methods */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5">
        <h2 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-indigo-400" /> Linked Payout Methods
        </h2>
        <div className="space-y-2.5">
          {[
            { icon: Smartphone, label: 'bKash', account: '01711-XXXXXX', primary: true },
            { icon: Building2,  label: 'Dutch Bangla Bank (DBBL)', account: '148XXXX-12', primary: false },
          ].map((m) => (
            <div key={m.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <m.icon className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{m.label}</p>
                  <p className="text-[11px] text-slate-400">{m.account}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {m.primary && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Primary
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          ))}
          <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/20 text-slate-400 hover:text-white hover:border-white/40 transition-colors text-xs font-medium">
            <Plus className="w-4 h-4" /> Add Payment Method
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-bold text-white text-sm flex items-center gap-2">
            <RefreshCcw className="w-4 h-4 text-indigo-400" /> Transaction History
          </h2>
          <div className="flex gap-1">
            {(['all', 'in', 'out', 'pending'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${tab === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${tx.type === 'IN' ? 'bg-emerald-500/15' : tx.type === 'OUT' ? 'bg-rose-500/15' : 'bg-amber-500/15'}`}>
                  {tx.type === 'IN'
                    ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                    : tx.type === 'OUT'
                    ? <ArrowUpRight className="w-4 h-4 text-rose-400" />
                    : <Clock className="w-4 h-4 text-amber-400" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{tx.label}</p>
                  <p className="text-[11px] text-slate-500">{tx.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className={`font-bold text-sm ${tx.type === 'IN' || tx.type === 'PENDING' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tx.type === 'IN' || tx.type === 'PENDING' ? '+' : ''}৳{formatCurrency(Math.abs(tx.amount))}
                </p>
                {statusIcon(tx.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Note */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
        <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0 text-indigo-400" />
        <p>Your wallet and payout methods are protected with end-to-end encryption. Withdrawals require account verification for amounts above ৳50,000.</p>
      </div>
    </div>
  );
}
