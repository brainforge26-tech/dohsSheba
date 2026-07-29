'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/cn';
import { Percent, Plus, Calendar, CheckCircle2, Clock, Trash2, Tag, Zap } from 'lucide-react';

const MOCK_CAMPAIGNS = [
  { id: 'd1', name: 'Summer Dairy Discount', type: 'Category Discount', discount: '10% OFF', category: 'Dairy & Eggs', status: 'ACTIVE', startDate: '2026-07-01', endDate: '2026-08-31', itemsIncluded: 5 },
  { id: 'd2', name: 'Rajshahi Mango Season Special', type: 'Product Discount', discount: '15% OFF', category: 'Fruits', status: 'ACTIVE', startDate: '2026-07-10', endDate: '2026-08-15', itemsIncluded: 1 },
  { id: 'd3', name: 'Eid Bulk Rice Discount', type: 'Volume Discount', discount: '5% OFF on 5kg+', category: 'Rice & Grains', status: 'EXPIRED', startDate: '2026-06-01', endDate: '2026-07-01', itemsIncluded: 3 },
];

export default function DiscountsPage() {
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Dashboard / Marketing / Discounts</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Percent className="w-5 h-5 text-indigo-400" /> Discount Campaigns
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Set category-level, product-level, and volume discounts</p>
        </div>
        <button onClick={() => alert('New Discount Campaign modal coming in next patch')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-lg">
          <Plus className="w-3.5 h-3.5" /> Create Discount Campaign
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campaigns.map((c) => (
          <div key={c.id} className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{c.type}</span>
                <h3 className="font-black text-white text-sm mt-2">{c.name}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${c.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>{c.status}</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#181928] border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400">Discount</p>
                <p className="font-black text-emerald-400 text-base">{c.discount}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400">Products</p>
                <p className="font-bold text-white text-xs">{c.itemsIncluded} items</p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
              <span>{c.startDate} → {c.endDate}</span>
              <button onClick={() => setCampaigns((prev) => prev.filter((i) => i.id !== c.id))} className="text-red-400 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
