'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Bell, MessageSquare, Star, RefreshCcw, ShoppingCart, LucideIcon } from 'lucide-react';

interface CustomerEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function CustomerEmptyState({
  icon: Icon = ShoppingBag,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: CustomerEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-[#1e1f32]/60 border border-white/10 backdrop-blur-md">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 shadow-inner">
        <Icon className="w-8 h-8 animate-pulse" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">{description}</p>

      {actionText && (
        actionHref ? (
          <Link
            href={actionHref}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center gap-2"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center gap-2"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
}
