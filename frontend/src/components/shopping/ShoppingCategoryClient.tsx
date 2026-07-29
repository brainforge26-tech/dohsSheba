'use client';

import React, { useState } from 'react';
import { ALL_PRODUCTS } from '@/constants/products';
import { ProductCategory, ProductCategorySlug } from '@/types/shopping';
import { ProductCard } from '@/components/cards/ProductCard';
import { ProductFilterSidebar } from '@/components/shopping/ProductFilterSidebar';
import { ShoppingBag } from 'lucide-react';

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

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
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
  );
}
