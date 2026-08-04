import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home, ShoppingBag, Wrench } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] py-16 px-4 flex items-center justify-center bg-gradient-to-b from-white via-emerald-50/20 to-white font-sans">
      <div className="max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-white border border-slate-100 shadow-xl text-center space-y-6">
        {/* Animated Badge & Icon */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-[#0E7A45] flex items-center justify-center shadow-inner border border-emerald-100/60">
            <FileQuestion className="w-8 h-8 animate-bounce" />
          </div>

          <span className="text-4xl font-black tracking-tight text-[#0E7A45]">
            404
          </span>
        </div>

        {/* Heading & Subtext */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            The page or service you are looking for might have been moved, deleted, or is temporarily unavailable in DOHS area.
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            href="/services/shopping"
            className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all text-left group"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-slate-800 group-hover:text-[#0E7A45]">
              <ShoppingBag className="w-4 h-4 text-[#0E7A45]" />
              <span>Shopping Market</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Fresh Groceries in 45-Min</p>
          </Link>

          <Link
            href="/services"
            className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all text-left group"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-slate-800 group-hover:text-[#0E7A45]">
              <Wrench className="w-4 h-4 text-[#0E7A45]" />
              <span>Home Services</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">AC, Plumbing & Repair</p>
          </Link>
        </div>

        {/* Home Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0E7A45] hover:bg-[#095A32] text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to DOHS Sheba Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
