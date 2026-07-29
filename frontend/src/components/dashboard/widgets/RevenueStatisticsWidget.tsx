'use client';

import React, { useState } from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/cn';

interface RevenueStatisticsProps {
  totalRevenue?: number;
}

export function RevenueStatisticsWidget({ totalRevenue = 14235 }: RevenueStatisticsProps) {
  const [filter, setFilter] = useState<'Today' | 'This Week' | 'This Month'>('Today');
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 text-white shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-white">Revenue Statistics</h3>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#181928] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <span>{filter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 w-32 bg-[#181928] border border-white/10 rounded-xl shadow-xl z-30 py-1 text-xs">
              {(['Today', 'This Week', 'This Month'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setFilter(opt);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-600/30 text-slate-200"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-black text-white">{formatCurrency(totalRevenue)}</div>
        <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+24.5% vs previous period</span>
        </div>
      </div>

      {/* SVG Wave Line Area Graph */}
      <div className="h-28 w-full pt-2">
        <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path
            d="M 0,80 Q 50,20 100,60 T 200,40 T 300,70 T 400,20 L 400,100 L 0,100 Z"
            fill="url(#revenueGrad)"
          />

          {/* Stroke Line */}
          <path
            d="M 0,80 Q 50,20 100,60 T 200,40 T 300,70 T 400,20"
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Sparkle Nodes */}
          <circle cx="200" cy="40" r="4" fill="#818cf8" />
          <circle cx="400" cy="20" r="4" fill="#38bdf8" />
        </svg>
      </div>
    </div>
  );
}
