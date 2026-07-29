'use client';

import React from 'react';

export function CustomerSkeletonCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 animate-pulse space-y-4">
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-lg bg-slate-700/50" />
            <div className="w-4 h-4 rounded bg-slate-700/50" />
          </div>
          <div className="space-y-2">
            <div className="w-24 h-4 rounded bg-slate-700/50" />
            <div className="w-16 h-6 rounded bg-slate-700/50" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CustomerSkeletonTable() {
  return (
    <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-4 animate-pulse">
      <div className="w-48 h-6 bg-slate-700/50 rounded mb-4" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex justify-between items-center py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-700/50 shrink-0" />
            <div className="space-y-2">
              <div className="w-36 h-4 bg-slate-700/50 rounded" />
              <div className="w-24 h-3 bg-slate-700/50 rounded" />
            </div>
          </div>
          <div className="w-20 h-6 bg-slate-700/50 rounded-full" />
        </div>
      ))}
    </div>
  );
}
