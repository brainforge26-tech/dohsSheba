'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/cn';
import { Zap, Plus, Clock, Package, AlertTriangle, CheckCircle2, Flame } from 'lucide-react';

const MOCK_FLASH_SALES = [
  { id: 'fs1', title: 'Weekend Fresh Grocery Blitz', discountPct: 20, itemsCount: 4, startsIn: 'Active — Ends in 12h 45m', totalSold: 64, targetStock: 100, status: 'RUNNING' },
  { id: 'fs2', title: 'Midnight Mango Madness', discountPct: 25, itemsCount: 1, startsIn: 'Starts tomorrow at 10:00 PM', totalSold: 0, targetStock: 50, status: 'UPCOMING' },
];

export default function FlashSalePage() {
  const [sales, setSales] = useState(MOCK_FLASH_SALES);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Dashboard / Marketing / Flash Sale</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" /> Flash Sales
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Run high-converting limited-time discount events with countdown timers</p>
        </div>
        <button onClick={() => alert('New Flash Sale Campaign setup launched!')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-lg">
          <Plus className="w-3.5 h-3.5" /> Create Flash Sale
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sales.map((s) => {
          const pct = Math.round((s.totalSold / s.targetStock) * 100);
          return (
            <div key={s.id} className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${s.status === 'RUNNING' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'}`}>
                    ⚡ {s.status === 'RUNNING' ? 'LIVE NOW' : 'SCHEDULED'}
                  </span>
                  <h3 className="font-black text-white text-base mt-2">{s.title}</h3>
                </div>
                <span className="text-2xl font-black text-amber-400">-{s.discountPct}%</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-400" /> {s.startsIn}</span>
                <span className="text-slate-300 font-bold">{s.itemsCount} products included</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Items Sold</span>
                  <span className="text-slate-300 font-bold">{s.totalSold} / {s.targetStock} ({pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-[#181928] overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
