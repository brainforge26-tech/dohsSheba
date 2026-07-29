'use client';

import React from 'react';
import Link from 'next/link';
import { Construction, ArrowLeft } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description?: string;
  step?: string;
  backHref?: string;
  features?: string[];
}

export function ComingSoon({ title, description, step, backHref = '/seller/dashboard', features = [] }: ComingSoonProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={backHref} className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-black text-white text-xl">{title}</h1>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
        {step && (
          <span className="ml-auto px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
            {step}
          </span>
        )}
      </div>

      {/* Main Card */}
      <div className="flex flex-col items-center justify-center min-h-[400px] p-10 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl text-center space-y-5">
        {/* Animated Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 flex items-center justify-center border border-indigo-500/30">
            <Construction className="w-9 h-9 text-indigo-400" />
          </div>
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-black text-white animate-bounce">!</span>
        </div>

        <div className="space-y-2 max-w-md">
          <h2 className="text-xl font-black text-white">{title}</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            {description || `This section is being built following the development roadmap. It will be fully functional soon.`}
          </p>
        </div>

        {features.length > 0 && (
          <div className="w-full max-w-sm space-y-2 text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-3">What's coming:</p>
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#181928]/60 border border-white/5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        )}

        {step && (
          <p className="text-[11px] text-slate-500 pt-2">
            Scheduled for <span className="text-indigo-400 font-bold">{step}</span> of the development roadmap
          </p>
        )}
      </div>
    </div>
  );
}
