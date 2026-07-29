'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/utils/cn';
import {
  ArrowUpRight, Wallet, Building2, Smartphone, CreditCard,
  ShieldCheck, AlertCircle, CheckCircle2, Loader2, Info, Clock,
} from 'lucide-react';

const METHODS = [
  { id: 'bkash',    label: 'bKash',                   icon: Smartphone,  account: '01711-000001', fee: '1.5%' },
  { id: 'dbbl',     label: 'Dutch Bangla Bank (DBBL)', icon: Building2,   account: '148XXXX-12',  fee: 'Free' },
  { id: 'nagad',    label: 'Nagad',                    icon: Smartphone,  account: '—',           fee: '1.5%' },
];

const PENDING_REQUESTS = [
  { id: 'WD-0041', amount: 15000, method: 'bKash (01711-XXXXX)', requestedAt: '25 Jul 2026', status: 'COMPLETED' },
  { id: 'WD-0040', amount: 20000, method: 'DBBL Bank',           requestedAt: '20 Jul 2026', status: 'COMPLETED' },
  { id: 'WD-0039', amount: 10000, method: 'bKash (01711-XXXXX)', requestedAt: '14 Jul 2026', status: 'COMPLETED' },
];

export default function WithdrawPage() {
  const [method, setMethod]   = useState('bkash');
  const [amount, setAmount]   = useState('');
  const [note, setNote]       = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const withdrawable = 38250;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) { setError('Please enter a valid amount.'); return; }
    if (val < 500)   { setError('Minimum withdrawal amount is ৳500.'); return; }
    if (val > withdrawable) { setError(`You can only withdraw up to ৳${formatCurrency(withdrawable)}.`); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(`Withdrawal of ৳${formatCurrency(val)} requested successfully! Processing in 24–48 hours.`);
      setAmount('');
    }, 1000);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs text-slate-500 mb-0.5">Finance / Withdraw</p>
        <h1 className="font-black text-white text-xl flex items-center gap-2">
          <ArrowUpRight className="w-5 h-5 text-indigo-400" /> Withdraw Funds
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Transfer your store earnings to your bank or mobile wallet</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Withdraw Form */}
        <div className="lg:col-span-2 space-y-5">

          {/* Withdraw Balance */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-200 font-medium">Available to Withdraw</p>
              <p className="font-black text-white text-3xl mt-1">৳{formatCurrency(withdrawable)}</p>
            </div>
            <Wallet className="w-12 h-12 text-white/30" />
          </div>

          {success && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
              <p>{success}</p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-5">
            {/* Method selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Payout Method</label>
              <div className="space-y-2">
                {METHODS.map((m) => (
                  <label key={m.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${method === m.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/20 bg-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-indigo-500" />
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <m.icon className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{m.label}</p>
                        <p className="text-[11px] text-slate-400">{m.account}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">Fee: {m.fee}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Amount (৳)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">৳</span>
                <input
                  type="number" min="500" max={withdrawable} step="100"
                  value={amount} onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (min ৳500)"
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[5000, 10000, 15000, 20000].map((amt) => (
                  <button key={amt} type="button" onClick={() => setAmount(String(amt))}
                    className="text-[10px] px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors">
                    ৳{formatCurrency(amt)}
                  </button>
                ))}
                <button type="button" onClick={() => setAmount(String(withdrawable))}
                  className="text-[10px] px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors font-semibold">
                  Max
                </button>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Note (Optional)</label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Monthly profit withdrawal"
                className="w-full px-4 py-3 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
              {loading ? 'Processing…' : 'Request Withdrawal'}
            </button>
          </form>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Rules */}
          <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-3">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" /> Withdrawal Rules
            </h2>
            {[
              'Minimum withdrawal: ৳500',
              'Processing time: 24–48 business hours',
              'bKash / Nagad: 1.5% processing fee',
              'Bank transfer: Free',
              'Maximum single withdrawal: ৳100,000',
            ].map((r) => (
              <div key={r} className="flex items-start gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-500" />
                {r}
              </div>
            ))}
          </div>

          {/* Recent Requests */}
          <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" /> Recent Requests
              </h2>
            </div>
            <div className="divide-y divide-white/5">
              {PENDING_REQUESTS.map((r) => (
                <div key={r.id} className="px-4 py-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold text-white">৳{formatCurrency(r.amount)}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{r.method} · {r.requestedAt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
            <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0 text-indigo-400" />
            <p>All withdrawal requests are reviewed and encrypted. You'll receive confirmation via email.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
