'use client';

import React from 'react';

// ─── Base Shimmer ─────────────────────────────────────────────────────────────

function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-slate-100 rounded-lg before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent ${className}`}
      aria-hidden="true"
    />
  );
}

// ─── Product Card Skeleton ────────────────────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 p-3 bg-white space-y-3 shadow-sm overflow-hidden" aria-label="Loading product">
      <Shimmer className="w-full h-36 rounded-xl" />
      <Shimmer className="h-3 w-1/3 rounded-full" />
      <Shimmer className="h-4 w-3/4 rounded-full" />
      <div className="flex items-center justify-between pt-1">
        <Shimmer className="h-5 w-1/4 rounded-full" />
        <Shimmer className="h-8 w-20 rounded-xl" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Product Detail Skeleton ──────────────────────────────────────────────────

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8" aria-busy="true">
      {/* Gallery */}
      <div className="space-y-3">
        <Shimmer className="w-full h-72 sm:h-96 rounded-3xl" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} className="w-16 h-16 rounded-xl" />
          ))}
        </div>
      </div>
      {/* Info */}
      <div className="space-y-4">
        <Shimmer className="h-3 w-24 rounded-full" />
        <Shimmer className="h-7 w-4/5 rounded-full" />
        <Shimmer className="h-7 w-2/5 rounded-full" />
        <div className="space-y-2 pt-2">
          <Shimmer className="h-3 w-full rounded-full" />
          <Shimmer className="h-3 w-5/6 rounded-full" />
          <Shimmer className="h-3 w-3/4 rounded-full" />
        </div>
        <div className="flex gap-3 pt-4">
          <Shimmer className="h-12 flex-1 rounded-2xl" />
          <Shimmer className="h-12 w-12 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Category Rail Skeleton ───────────────────────────────────────────────────

export function CategoryRailSkeleton() {
  return (
    <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar" aria-busy="true">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="shrink-0 space-y-2 flex flex-col items-center">
          <Shimmer className="w-14 h-14 rounded-2xl" />
          <Shimmer className="w-12 h-2 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Banner Skeleton ──────────────────────────────────────────────────────────

export function BannerSkeleton() {
  return (
    <div className="w-full space-y-3" aria-busy="true">
      <Shimmer className="w-full h-48 sm:h-64 md:h-80 rounded-3xl" />
      <div className="flex gap-2 justify-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="w-2 h-2 rounded-full" />
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard Card Skeleton ──────────────────────────────────────────────────

export function DashboardCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-slate-100 bg-white space-y-3 shadow-sm overflow-hidden" aria-label="Loading stat">
      <div className="flex items-center justify-between">
        <Shimmer className="h-4 w-1/3 rounded-full" />
        <Shimmer className="w-10 h-10 rounded-xl" />
      </div>
      <Shimmer className="h-8 w-1/2 rounded-full" />
      <Shimmer className="h-3 w-2/3 rounded-full" />
    </div>
  );
}

export function DashboardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <DashboardCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Order Card Skeleton ──────────────────────────────────────────────────────

export function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3 shadow-sm overflow-hidden" aria-label="Loading order">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Shimmer className="h-3 w-28 rounded-full" />
          <Shimmer className="h-3 w-20 rounded-full" />
        </div>
        <Shimmer className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Shimmer key={i} className="w-12 h-12 rounded-xl" />
        ))}
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
        <Shimmer className="h-5 w-24 rounded-full" />
        <Shimmer className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function OrderListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Cart Skeleton ────────────────────────────────────────────────────────────

export function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-white overflow-hidden">
      <Shimmer className="w-16 h-16 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-4 w-3/4 rounded-full" />
        <Shimmer className="h-3 w-1/3 rounded-full" />
        <div className="flex items-center justify-between pt-1">
          <Shimmer className="h-5 w-24 rounded-full" />
          <Shimmer className="h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CartSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <CartItemSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Checkout Skeleton ────────────────────────────────────────────────────────

export function CheckoutSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6" aria-busy="true">
      <div className="lg:col-span-2 space-y-4">
        <Shimmer className="h-8 w-48 rounded-full" />
        <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Shimmer key={i} className="h-11 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-3">
          <Shimmer className="h-5 w-32 rounded-full" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-3 items-center p-3 border border-slate-100 rounded-xl">
              <Shimmer className="w-5 h-5 rounded-full" />
              <div className="flex-1 space-y-1">
                <Shimmer className="h-4 w-3/4 rounded-full" />
                <Shimmer className="h-3 w-1/2 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-3">
          <Shimmer className="h-5 w-28 rounded-full" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Shimmer className="h-4 w-1/3 rounded-full" />
              <Shimmer className="h-4 w-1/4 rounded-full" />
            </div>
          ))}
          <Shimmer className="h-[1px] w-full" />
          <div className="flex justify-between">
            <Shimmer className="h-5 w-16 rounded-full" />
            <Shimmer className="h-5 w-20 rounded-full" />
          </div>
          <Shimmer className="h-12 w-full rounded-2xl mt-2" />
        </div>
      </div>
    </div>
  );
}

// ─── Table Skeleton ───────────────────────────────────────────────────────────

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm" aria-busy="true">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer key={i} className={`h-4 rounded-full ${i === 0 ? 'w-32' : 'flex-1'}`} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="p-4 border-b border-slate-50 flex items-center gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Shimmer
              key={c}
              className={`h-4 rounded-full ${c === 0 ? 'w-32' : c === cols - 1 ? 'w-16' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Notification Skeleton ────────────────────────────────────────────────────

export function NotificationSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-4 rounded-2xl border border-slate-100 bg-white">
          <Shimmer className="w-9 h-9 rounded-xl shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Shimmer className="h-4 w-2/3 rounded-full" />
            <Shimmer className="h-3 w-full rounded-full" />
            <Shimmer className="h-3 w-1/4 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Profile Skeleton ─────────────────────────────────────────────────────────

export function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6" aria-busy="true">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center gap-3">
        <Shimmer className="w-24 h-24 rounded-full" />
        <Shimmer className="h-5 w-40 rounded-full" />
        <Shimmer className="h-3 w-28 rounded-full" />
      </div>
      {/* Form fields */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4">
        <Shimmer className="h-5 w-28 rounded-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Shimmer className="h-3 w-20 rounded-full" />
              <Shimmer className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <Shimmer className="h-11 w-32 rounded-xl mt-2" />
      </div>
    </div>
  );
}

// ─── Review Skeleton ──────────────────────────────────────────────────────────

export function ReviewSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-white space-y-2">
          <div className="flex items-center gap-3">
            <Shimmer className="w-10 h-10 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Shimmer className="h-4 w-32 rounded-full" />
              <Shimmer className="h-3 w-24 rounded-full" />
            </div>
            <Shimmer className="h-4 w-16 rounded-full" />
          </div>
          <Shimmer className="h-3 w-full rounded-full" />
          <Shimmer className="h-3 w-5/6 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Wishlist Skeleton ────────────────────────────────────────────────────────

export function WishlistSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-100 p-3 bg-white space-y-2">
          <Shimmer className="w-full h-36 rounded-xl" />
          <Shimmer className="h-4 w-3/4 rounded-full" />
          <Shimmer className="h-3 w-1/2 rounded-full" />
          <Shimmer className="h-9 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

// ─── Search Skeleton ──────────────────────────────────────────────────────────

export function SearchResultSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white">
          <Shimmer className="w-12 h-12 rounded-xl shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Shimmer className="h-4 w-2/3 rounded-full" />
            <Shimmer className="h-3 w-1/3 rounded-full" />
          </div>
          <Shimmer className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Address Skeleton ─────────────────────────────────────────────────────────

export function AddressSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <Shimmer className="h-4 w-32 rounded-full" />
            <Shimmer className="h-4 w-16 rounded-full" />
          </div>
          <Shimmer className="h-3 w-full rounded-full" />
          <Shimmer className="h-3 w-3/4 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Generic List Skeleton ────────────────────────────────────────────────────

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-white">
          <Shimmer className="w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Shimmer className="h-4 w-1/2 rounded-full" />
            <Shimmer className="h-3 w-1/3 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
