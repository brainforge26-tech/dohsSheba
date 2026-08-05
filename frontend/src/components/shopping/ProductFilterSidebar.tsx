'use client';

import React from 'react';
import Link from 'next/link';
import { SHOPPING_CATEGORIES } from '@/constants/products';
import { ProductCategorySlug } from '@/types/shopping';
import { SlidersHorizontal, RefreshCw, Sparkles, Carrot } from 'lucide-react';

interface ProductFilterSidebarProps {
  currentCategorySlug: ProductCategorySlug | 'all';
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  organicOnly: boolean;
  setOrganicOnly: (val: boolean) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  onReset: () => void;
}

export function ProductFilterSidebar({
  currentCategorySlug,
  maxPrice,
  setMaxPrice,
  organicOnly,
  setOrganicOnly,
  inStockOnly,
  setInStockOnly,
  sortBy,
  setSortBy,
  onReset,
}: ProductFilterSidebarProps) {
  return (
    <aside className="w-full lg:w-72 p-6 rounded-3xl border border-border/80 bg-card shadow-card space-y-6 flex-shrink-0">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2 font-extrabold text-base text-foreground">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <span>Filter Groceries</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-emerald-600 flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sorting */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Sort Products By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-input bg-background font-semibold text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
        >
          <option value="popular">Popularity & Rating</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2 border-t border-border pt-4">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Shopping Category
        </label>
        <div className="space-y-1">
          <Link
            href="/services/shopping"
            className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              currentCategorySlug === 'all'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            All Market Categories
          </Link>
          {SHOPPING_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                currentCategorySlug === cat.slug
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-muted-foreground">Max Unit Price</span>
          <span className="font-bold text-emerald-600">৳{maxPrice}</span>
        </div>
        <input
          type="range"
          min="50"
          max="2000"
          step="25"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>৳50</span>
          <span>৳2000</span>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 border-t border-border pt-4 text-xs font-semibold">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={organicOnly}
            onChange={(e) => setOrganicOnly(e.target.checked)}
            className="w-4 h-4 rounded border-input text-emerald-600 focus:ring-emerald-600"
          />
          <div className="flex items-center gap-1.5 text-foreground">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Organic Certified Only</span>
          </div>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded border-input text-emerald-600 focus:ring-emerald-600"
          />
          <span className="text-foreground">In-Stock Ready for 45-Min Express</span>
        </label>
      </div>
    </aside>
  );
}
