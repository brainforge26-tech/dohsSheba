'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/utils/cn';
import { DollarSign, TrendingUp, Wallet, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function ProviderFinancePage() {
  const [balance, setBalance] = useState(24500);
  const [payoutRequested, setPayoutRequested] = useState(false);

  const transactions = [
    { id: 'TX-9901', date: '30 Jul 2026', type: 'Job Payout', amount: 1500, status: 'COMPLETED', desc: 'BK-9912 AC Jet Wash Servicing' },
    { id: 'TX-9884', date: '29 Jul 2026', type: 'Job Payout', amount: 2200, status: 'COMPLETED', desc: 'BK-9908 Main DB Box Breaker Setup' },
    { id: 'TX-9870', date: '28 Jul 2026', type: 'Bank Withdrawal', amount: -15000, status: 'PROCESSED', desc: 'bKash Merchant Payout (#01711223344)' },
    { id: 'TX-9852', date: '27 Jul 2026', type: 'Job Payout', amount: 3500, status: 'COMPLETED', desc: 'Inverter AC Outdoor Gas Refill' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" /> Earnings & Partner Wallet Payouts
          </h1>
          <p className="text-xs text-slate-400">Track service revenues, completed job balances, and instantly request payouts</p>
        </div>

        <button
          type="button"
          onClick={() => setPayoutRequested(true)}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-lg flex items-center gap-2"
        >
          <DollarSign className="w-4 h-4" /> Request Payout to bKash / Bank
        </button>
      </div>

      {payoutRequested && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Payout request of ৳{formatCurrency(balance)} submitted! Admin processing within 2 hours.</span>
          </div>
          <button onClick={() => setPayoutRequested(false)} className="text-white hover:underline text-[11px]">Dismiss</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2 shadow-xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Available Balance</span>
          <div className="text-3xl font-black text-emerald-400">৳{formatCurrency(balance)}</div>
          <p className="text-[11px] text-slate-400">Ready for instant withdrawal</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2 shadow-xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Lifetime Earnings</span>
          <div className="text-3xl font-black text-white">৳{formatCurrency(148200)}</div>
          <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +32% this month
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2 shadow-xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Withdrawn</span>
          <div className="text-3xl font-black text-indigo-400">৳{formatCurrency(123700)}</div>
          <p className="text-[11px] text-slate-400">Paid to registered bKash account</p>
        </div>
      </div>

      {/* Transactions History */}
      <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
        <h2 className="font-bold text-sm text-white">Recent Financial Transactions</h2>
        <div className="divide-y divide-white/5 text-xs">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                  tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {tx.amount > 0 ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{tx.desc}</p>
                  <p className="text-[11px] text-slate-400">{tx.date} · <span className="font-mono">{tx.id}</span></p>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-black text-base ${tx.amount > 0 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                  {tx.amount > 0 ? '+' : ''}৳{formatCurrency(tx.amount)}
                </p>
                <span className="text-[10px] font-bold text-emerald-400">{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
