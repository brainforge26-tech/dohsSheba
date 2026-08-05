'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store/useWishlistStore';
import { ProductCard } from '@/components/cards/ProductCard';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="text-3xl font-extrabold">Your Wishlist is Empty</h1>
        <p className="text-sm text-muted-foreground">
          Save your favorite fresh fruits, organic vegetables, and daily items by clicking the heart icon.
        </p>
        <Link
          href="/services/shopping"
          className="inline-block px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md"
        >
          Browse Market Items
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 w-full max-w-[1720px] mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            <span>Saved Favorites ({items.length})</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Quickly add your saved favorite products directly into your cart.
          </p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs text-muted-foreground hover:text-destructive font-semibold"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
