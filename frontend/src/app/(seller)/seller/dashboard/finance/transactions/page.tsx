'use client';

import React, { useState, useMemo } from 'react';
import { formatCurrency } from '@/utils/cn';
import {
  RefreshCcw, Download, Search, ArrowDownLeft, ArrowUpRight,
  Clock, CheckCircle2, XCircle, Filter,
} from 'lucide-react';

type TxType = 'ALL' | 'CREDIT' | 'DEBIT' | 'PENDING';

const ALL_TXS = [
  { id: 'TX-2024', type: 'CREDIT', amount: 4820,  label: 'Order Settlement #ORD-2024', ref: 'ORD-2024', date: '28 Jul 2026 11:00', status: 'COMPLETED' },
  { id: 'TX-2023', type: 'CREDIT', amount: 6150,  label: 'Order Settlement #ORD-2023', ref: 'ORD-2023', date: '27 Jul 2026 18:30', status: 'COMPLETED' },
  { id: 'TX-2022', type: 'DEBIT',  amount: -15000, label: 'Withdrawal → bKash',         ref: 'WD-0041',  date: '25 Jul 2026 14:10', status: 'COMPLETED' },
  { id: 'TX-2021', type: 'CREDIT', amount: 3160,  label: 'Order Settlement #ORD-2021', ref: 'ORD-2021', date: '24 Jul 2026 16:00', status: 'COMPLETED' },
  { id: 'TX-2020', type: 'DEBIT',  amount: -20000, label: 'Withdrawal → DBBL Bank',     ref: 'WD-0040',  date: '20 Jul 2026 10:00', status: 'COMPLETED' },
  { id: 'TX-2019', type: 'CREDIT', amount: 6250,  label: 'Order Settlement #ORD-2019', ref: 'ORD-2019', date: '18 Jul 2026 09:30', status: 'COMPLETED' },
  { id: 'TX-2018', type: 'CREDIT', amount: 1200,  label: 'Refund Reversal #REF-0041',  ref: 'REF-0041', date: '15 Jul 2026 13:45', status: 'COMPLETED' },
  { id: 'TX-2017', type: 'CREDIT', amount: 8900,  label: 'Order Settlement #ORD-2017', ref: 'ORD-2017', date: '12 Jul 2026 11:20', status: 'COMPLETED' },
  { id: 'TX-2016', type: 'DEBIT',  amount: -10000, label: 'Withdrawal → bKash',         ref: 'WD-0039',  date: '10 Jul 2026 09:00', status: 'COMPLETED' },
  { id: 'TX-2015', type: 'CREDIT', amount: 4480,  label: 'Order Settlement #ORD-2015', ref: 'ORD-2015', date: '08 Jul 2026 15:30', status: 'COMPLETED' },
  { id: 'TX-PEND', type: 'PENDING', amount: 8400, label: 'Order Settlement #ORD-2025', ref: 'ORD-2025', date: '28 Jul 2026 11:00', status: 'PENDING' },
];

export default function TransactionsPage() {
  const [typeFilter, setTypeFilter] = useState<TxType>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 7;

  const filtered = useMemo(() => {
    return ALL_TXS.filter((t) => {
      const typeMatch = typeFilter === 'ALL' ? true : t.type === typeFilter;
      const searchMatch = !search || t.label.toLowerCase().includes(search.toLowerCase()) || t.ref.toLowerCase().includes(search.toLowerCase());
      return typeMatch && searchMatch;
    });
  }, [typeFilter, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalCredit = ALL_TXS.filter(t => t.type === 'CREDIT').reduce((a, t) => a + t.amount, 0);
  const totalDebit  = ALL_TXS.filter(t => t.type === 'DEBIT').reduce((a, t) => a + Math.abs(t.amount), 0);

  const statusBadge = (s: string) => {
    if (s === 'COMPLETED') return <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
    if (s === 'PENDING')   return <span className="flex items-center gap-1 text-amber-400"><Clock className="w-3.5 h-3.5" /> Pending</span>;
    return <span className="flex items-center gap-1 text-red-400"><XCircle className="w-3.5 h-3.5" /> Failed</span>;
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Finance / Transactions</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <RefreshCcw className="w-5 h-5 text-indigo-400" /> Transaction History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">All credits, debits, withdrawals, and settlements</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
          <p className="text-xs text-emerald-300 mb-1">Total Credits</p>
          <p className="font-black text-emerald-400 text-lg">৳{formatCurrency(totalCredit)}</p>
        </div>
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-center">
          <p className="text-xs text-rose-300 mb-1">Total Debits</p>
          <p className="font-black text-rose-400 text-lg">৳{formatCurrency(totalDebit)}</p>
        </div>
        <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-4 text-center">
          <p className="text-xs text-indigo-300 mb-1">Net Balance</p>
          <p className="font-black text-indigo-400 text-lg">৳{formatCurrency(totalCredit - totalDebit)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by label or reference…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1e1f32] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-1">
          {(['ALL', 'CREDIT', 'DEBIT', 'PENDING'] as TxType[]).map((t) => (
            <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${typeFilter === t ? 'bg-indigo-600 text-white' : 'bg-[#1e1f32] text-slate-400 hover:text-white border border-white/10'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-slate-500 uppercase tracking-widest">
                <th className="px-5 py-3 text-left">Reference</th>
                <th className="px-5 py-3 text-left">Description</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginated.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">{tx.ref}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${tx.type === 'CREDIT' ? 'bg-emerald-500/15' : tx.type === 'DEBIT' ? 'bg-rose-500/15' : 'bg-amber-500/15'}`}>
                        {tx.type === 'CREDIT' ? <ArrowDownLeft className="w-3 h-3 text-emerald-400" /> : tx.type === 'DEBIT' ? <ArrowUpRight className="w-3 h-3 text-rose-400" /> : <Clock className="w-3 h-3 text-amber-400" />}
                      </div>
                      <span className="text-white font-medium truncate max-w-[200px]">{tx.label}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-400">{tx.date}</td>
                  <td className={`px-5 py-3.5 text-right font-bold ${tx.type === 'DEBIT' ? 'text-rose-400' : tx.type === 'PENDING' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {tx.type === 'DEBIT' ? '-' : '+'}৳{formatCurrency(Math.abs(tx.amount))}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold">{statusBadge(tx.status)}</td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500 text-sm">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/10">
            <p className="text-xs text-slate-500">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${page === p ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
