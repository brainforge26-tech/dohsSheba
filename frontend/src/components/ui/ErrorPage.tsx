'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorPageProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  showBack?: boolean;
}

/**
 * Reusable branded error card for use in both error.tsx and custom error pages.
 * Pass `onReset` to add a "Try Again" button.
 */
export function ErrorPage({
  title = 'Something Went Wrong',
  description = 'An unexpected error occurred. Please try again or return to the home page.',
  onReset,
  showBack = true,
}: ErrorPageProps) {
  return (
    <div className="min-h-[70vh] py-16 px-4 flex items-center justify-center bg-gradient-to-b from-white via-slate-50/50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-100 shadow-xl text-center space-y-6"
      >
        {/* Icon */}
        <div className="flex flex-col items-center space-y-3">
          <motion.div
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner border border-rose-100"
          >
            <AlertTriangle className="w-7 h-7" />
          </motion.div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-extrabold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>DOHS Sheba</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{title}</h2>
          <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onReset && (
            <button
              onClick={onReset}
              className="px-5 py-2.5 rounded-xl bg-[#0E7A45] hover:bg-[#095A32] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}

          {showBack && (
            <button
              onClick={() => window.history.back()}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          )}

          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-[#0E7A45] bg-white text-slate-700 hover:text-[#0E7A45] font-bold text-xs transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
