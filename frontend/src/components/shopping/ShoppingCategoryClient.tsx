'use client';

import React, { useState } from 'react';
import { ALL_PRODUCTS } from '@/constants/products';
import { ProductCategory, ProductCategorySlug } from '@/types/shopping';
import { ProductCard } from '@/components/cards/ProductCard';
import { ProductFilterSidebar } from '@/components/shopping/ProductFilterSidebar';
import { ShoppingBag, SlidersHorizontal } from 'lucide-react';

interface ShoppingCategoryClientProps {
  categorySlug: ProductCategorySlug | 'all';
  currentCategory?: ProductCategory;
}

export function ShoppingCategoryClient({
  categorySlug,
  currentCategory,
}: ShoppingCategoryClientProps) {
  const [maxPrice, setMaxPrice] = useState(2000);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  let products = ALL_PRODUCTS.filter((p) => {
    if (categorySlug !== 'all' && p.categorySlug !== categorySlug) return false;
    if (p.price > maxPrice) return false;
    if (organicOnly && !p.isOrganic) return false;
    if (inStockOnly && p.stock <= 0) return false;
    return true;
  });

  if (sortBy === 'price-asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    products.sort((a, b) => b.price - a.price);
  } else {
    products.sort((a, b) => b.rating - a.rating);
  }

  const handleReset = () => {
    setMaxPrice(2000);
    setOrganicOnly(false);
    setInStockOnly(false);
    setSortBy('popular');
  };

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const activeFilterCount = (organicOnly ? 1 : 0) + (inStockOnly ? 1 : 0) + (maxPrice < 2000 ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* ── Mobile Filter Control Bar ── */}
      <div className="flex lg:hidden items-center justify-between p-3 rounded-2xl bg-card border border-border/80 shadow-sm gap-3">
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter & Sort Groceries</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-emerald-700 font-black text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-10 px-3 rounded-xl border border-input bg-background font-semibold text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
        >
          <option value="popular">Popularity</option>
          <option value="price-asc">Price: Low ➔ High</option>
          <option value="price-desc">Price: High ➔ Low</option>
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <ProductFilterSidebar
            currentCategorySlug={categorySlug}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            organicOnly={organicOnly}
            setOrganicOnly={setOrganicOnly}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onReset={handleReset}
          />
        </div>

        {/* ── Mobile Filter Slide-Over Drawer Modal ── */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-background border border-border rounded-t-3xl sm:rounded-3xl p-6 space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2 font-extrabold text-base text-foreground">
                  <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                  <span>Filter Groceries</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-all"
                >
                  ✕
                </button>
              </div>

              <ProductFilterSidebar
                currentCategorySlug={categorySlug}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                organicOnly={organicOnly}
                setOrganicOnly={setOrganicOnly}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onReset={handleReset}
              />

              <div className="flex items-center gap-3 pt-4 border-t border-border sticky bottom-0 bg-background">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg"
                >
                  Apply Filters ({products.length} Items)
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">
              Found {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </h2>
            <span className="text-xs text-muted-foreground">Showing local DOHS bazaar items</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.length === 0 ? (
              <div className="col-span-full p-12 text-center border border-border rounded-3xl bg-card space-y-3">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto stroke-[1.5]" />
                <div className="space-y-1">
                  <p className="font-bold text-lg">No grocery products match your filters</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Try adjusting your price range slider or unchecking organic filter.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs mt-2 shadow-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
