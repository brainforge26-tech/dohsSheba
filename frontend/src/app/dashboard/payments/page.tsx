'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { Wallet, CreditCard, Download, CheckCircle2, ArrowDownLeft, ArrowUpRight, Loader2, Plus } from 'lucide-react';

interface TransactionItem {
  id: string;
  type: string; // CREDIT | DEBIT
  amount: number;
  description?: string;
  createdAt: string;
}

export default function PaymentsPage() {
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toppingUp, setToppingUp] = useState(false);
  const [msg, setMsg] = useState('');

  const loadWallet = () => {
    setLoading(true);
    fetchApi<any>('/wallet')
      .then((res) => {
        if (res.success && res.data) {
          setBalance(res.data.balance || 0);
          setTransactions(res.data.transactions || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setMounted(true);
    loadWallet();
  }, []);

  const handleTopUp = async () => {
    setToppingUp(true);
    setMsg('');
    try {
      const res = await fetchApi<any>('/wallet/topup', {
        method: 'POST',
        body: JSON.stringify({ amount: 500 }),
      });
      if (res.success) {
        setMsg('৳500 topped up successfully to your wallet!');
        loadWallet();
      }
    } catch (err: any) {
      setMsg(err.message || 'Failed to top up wallet');
    } finally {
      setToppingUp(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 text-xs">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading payments...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Wallet className="w-6 h-6 text-emerald-400" /> Payment & Wallet History
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Track payment receipts, invoices, transaction IDs, and wallet refunds</p>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${msg.includes('Failed') ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'}`}>
          <CheckCircle2 className="w-4 h-4" /> {msg}
        </div>
      )}

      {/* Wallet Balance Summary */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900/60 via-teal-900/40 to-[#1e1f32] border border-emerald-500/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">RESIDENT WALLET BALANCE</span>
          {loading ? (
            <div className="flex items-center gap-2 text-slate-400 py-1">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading balance...
            </div>
          ) : (
            <h2 className="text-3xl font-black text-white" suppressHydrationWarning>৳{formatCurrency(balance)}</h2>
          )}
          <p className="text-xs text-slate-300">Instant checkout ready for future marketplace orders</p>
        </div>

        <button
          onClick={handleTopUp}
          disabled={toppingUp}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
        >
          {toppingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>Top Up ৳500</span>
        </button>
      </div>

      {/* Transactions Table Card */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Recent Transactions</h3>
          <span className="text-xs text-slate-400 font-semibold" suppressHydrationWarning>{transactions.length} Total</span>
        </div>

        <div className="space-y-0">
          {loading && (
            <div key="trx-loader" className="flex items-center justify-center p-12 text-slate-400 text-xs">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading transaction history...
            </div>
          )}

          {!loading && transactions.length === 0 && (
            <div key="trx-empty" className="p-8 text-center text-slate-400 text-xs">
              No wallet transactions found.
            </div>
          )}

          {!loading && transactions.length > 0 && (
            <div key="trx-list" className="divide-y divide-white/5">
              {transactions.map((trx) => {
                const isCredit = trx.type === 'CREDIT';
                return (
                  <div key={trx.id || trx.createdAt} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${isCredit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                        {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white" suppressHydrationWarning>{(trx.id || '').substring(0, 12)}</span>
                          <span className="text-[10px] text-slate-400" suppressHydrationWarning>
                            · {new Date(trx.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400" suppressHydrationWarning>{trx.description || (isCredit ? 'Credit Refund / Reward' : 'Order Payment')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                      <span className={`font-black text-sm ${isCredit ? 'text-emerald-400' : 'text-slate-100'}`} suppressHydrationWarning>
                        {isCredit ? '+' : '-'}৳{formatCurrency(trx.amount)}
                      </span>
                      <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1" title="Download Receipt">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

