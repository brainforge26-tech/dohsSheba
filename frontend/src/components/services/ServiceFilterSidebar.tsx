'use client';

import React from 'react';
import { SERVICE_CATEGORIES } from '@/constants/services';
import { ServiceCategorySlug } from '@/types/service';
import { SlidersHorizontal, Star, ShieldCheck, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface ServiceFilterSidebarProps {
  currentCategorySlug: ServiceCategorySlug | 'all';
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  minRating: number;
  setMinRating: (val: number) => void;
  instantArrivalOnly: boolean;
  setInstantArrivalOnly: (val: boolean) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (val: boolean) => void;
  onReset: () => void;
}

export function ServiceFilterSidebar({
  currentCategorySlug,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  instantArrivalOnly,
  setInstantArrivalOnly,
  verifiedOnly,
  setVerifiedOnly,
  onReset,
}: ServiceFilterSidebarProps) {
  return (
    <aside className="w-full lg:w-72 p-6 rounded-3xl border border-border/80 bg-card shadow-card space-y-6 flex-shrink-0">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2 font-extrabold text-base text-foreground">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span>Filter Services</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories Switcher */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Category
        </label>
        <div className="space-y-1">
          <Link
            href="/services/home-service"
            className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              currentCategorySlug === 'all'
                ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            All Home Services
          </Link>
          {SERVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/services/home-service/${cat.slug}`}
              className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                currentCategorySlug === cat.slug
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-muted-foreground">Max Starting Price</span>
          <span className="font-bold text-primary">৳{maxPrice}</span>
        </div>
        <input
          type="range"
          min="300"
          max="5000"
          step="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>৳300</span>
          <span>৳5000</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2 border-t border-border pt-4">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Minimum Rating
        </label>
        <div className="space-y-1">
          {[4.9, 4.8, 4.5, 4.0].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(rating === minRating ? 0 : rating)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                minRating === rating
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 font-bold'
                  : 'border-border hover:bg-secondary text-muted-foreground'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{rating} Stars & above</span>
              </div>
              {minRating === rating && <span className="text-[10px] uppercase font-mono">Selected</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Checkbox Options */}
      <div className="space-y-3 border-t border-border pt-4 text-xs font-semibold">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={instantArrivalOnly}
            onChange={(e) => setInstantArrivalOnly(e.target.checked)}
            className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
          />
          <div className="flex items-center gap-1.5 text-foreground">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>2-Hour Emergency Arrival</span>
          </div>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
          />
          <div className="flex items-center gap-1.5 text-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Verified Partners Only</span>
          </div>
        </label>
      </div>
    </aside>
  );
}
