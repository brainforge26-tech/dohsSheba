'use client';

import React, { useState } from 'react';
import { CreditCard, Eye, ArrowUpRight, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/cn';
import { useLanguageStore } from '@/store/useLanguageStore';

interface QuickSummaryWidgetProps {
  earningAmount?: number;
  toPaidAmount?: number;
  onlineVisitors?: number;
  chartData?: any[];
}

export function QuickSummaryWidget({
  earningAmount = 2354,
  toPaidAmount = 1598,
  onlineVisitors = 1230,
  chartData: rawChartData,
}: QuickSummaryWidgetProps) {
  const { language } = useLanguageStore();
  const isBn = language === 'BN';
  const [timeframe, setTimeframe] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Year');

  const chartData = [
    { label: isBn ? 'জানুয়ারি' : 'Jan', top: 5, bottom: 7 },
    { label: isBn ? 'ফেব্রুয়ারি' : 'Feb', top: 6, bottom: 7 },
    { label: isBn ? 'মার্চ' : 'Mar', top: 4, bottom: 7 },
    { label: isBn ? 'এপ্রিল' : 'Apr', top: 5, bottom: 6 },
    { label: isBn ? 'মে' : 'May', top: 6, bottom: 7 },
    { label: isBn ? 'জুন' : 'Jun', top: 4, bottom: 5 },
    { label: isBn ? 'জুলাই' : 'Jul', top: 3, bottom: 7 },
    { label: isBn ? 'আগস্ট' : 'Aug', top: 5, bottom: 6 },
    { label: isBn ? 'সেপ্টেম্বর' : 'Sep', top: 4, bottom: 7 },
    { label: isBn ? 'অক্টোবর' : 'Oct', top: 6, bottom: 4 },
    { label: isBn ? 'নভেম্বর' : 'Nov', top: 4, bottom: 6 },
    { label: isBn ? 'ডিসেম্বর' : 'Dec', top: 3, bottom: 7 },
  ];

  const tabLabels = {
    Day: isBn ? 'দিন' : 'Day',
    Week: isBn ? 'সপ্তাহ' : 'Week',
    Month: isBn ? 'মাস' : 'Month',
    Year: isBn ? 'বছর' : 'Year',
  };

  return (
    <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 text-white shadow-xl space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-bold text-base tracking-wide text-white">
          {isBn ? 'সংক্ষিপ্ত সারসংক্ষেপ' : 'Quick Summary'}
        </h2>

        {/* Timeframe selector tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#181928] border border-white/10 text-xs font-semibold">
          {(['Day', 'Week', 'Month', 'Year'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeframe === t
                  ? 'bg-indigo-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tabLabels[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Bar Chart + Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side Bar Chart (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full max-w-[14px] flex flex-col justify-end items-center rounded-sm overflow-hidden h-48 bg-[#181928] relative">
                  {/* Top White portion */}
                  <div
                    className="w-full bg-white transition-all duration-300 group-hover:bg-slate-200"
                    style={{ height: `${(d.top / 12) * 100}%` }}
                  />
                  {/* Bottom Purple/Blue portion */}
                  <div
                    className="w-full bg-indigo-500 transition-all duration-300 group-hover:bg-indigo-400"
                    style={{ height: `${(d.bottom / 12) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] font-semibold text-slate-400 truncate max-w-[32px]">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Callout Metrics (4 cols) */}
        <div className="lg:col-span-4 space-y-5 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
          {/* Earning Stat */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#181928]/70 border border-white/5 hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 rounded-full bg-white text-indigo-900 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              ৳
            </div>
            <div>
              <div className="text-xl font-black text-white">৳{formatCurrency(earningAmount)}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <span>{isBn ? 'উপার্জন' : 'Earning'}</span>
                <button className="text-indigo-400 font-bold hover:underline flex items-center gap-0.5 ml-1">
                  {isBn ? 'প্রত্যাহার' : 'Withdraw'} <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* To Paid Stat */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#181928]/70 border border-white/5 hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 rounded-full bg-white text-indigo-900 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              <CreditCard className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <div className="text-xl font-black text-white">৳{formatCurrency(toPaidAmount)}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <span>{isBn ? 'পরিশোধ করতে' : 'To Paid'}</span>
                <button className="text-indigo-400 font-bold hover:underline flex items-center gap-0.5 ml-1">
                  {isBn ? 'বেতন' : 'Pay'} <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Online Visitors Stat */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#181928]/70 border border-white/5 hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 rounded-full bg-white text-indigo-900 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              <Eye className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <div className="text-xl font-black text-white">{onlineVisitors}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <span>{isBn ? 'অনলাইনে' : 'Online'}</span>
                <button className="text-indigo-400 font-bold hover:underline flex items-center gap-0.5 ml-1">
                  {isBn ? 'দেখুন' : 'Visitors'} <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
