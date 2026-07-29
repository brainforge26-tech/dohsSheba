'use client';

import React from 'react';
import Image from 'next/image';
import { DAILY_DEALS_PRODUCTS } from '@/constants/products';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/utils/cn';
import { ShoppingBag, Star, Plus, Check, Sparkles, Tag } from 'lucide-react';

export function DailyDealsSection() {
  const { addItem, items } = useCartStore();

  return (
    <section className="py-16 px-4 bg-emerald-950/5 dark:bg-emerald-950/20 border-y border-border">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              Daily DOHS Flash Deals & Grocery Offers
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2">
              Fresh Deals of the Day
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Special discounted prices on essential groceries, fresh fruits, vegetables & daily needs.
            </p>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {DAILY_DEALS_PRODUCTS.map((product) => {
            const inCart = items.find((i) => i.product.id === product.id);

            return (
              <div
                key={product.id}
                className="group rounded-2xl border border-border/80 bg-card overflow-hidden shadow-card hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between p-3"
              >
                {/* Image & Badge */}
                <div className="relative h-36 w-full rounded-xl overflow-hidden bg-secondary mb-3">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  {product.isOrganic && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Organic
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {product.shopName}
                    </span>
                    <h4 className="font-bold text-xs leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {product.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{product.unit}</p>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-foreground">
                        {formatCurrency(product.price)}
                      </div>
                      {product.originalPrice && (
                        <span className="text-[10px] text-muted-foreground line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addItem(product)}
                      className={`p-2 rounded-xl transition-all shadow-sm flex items-center justify-center ${
                        inCart
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                      }`}
                      title="Add to Basket"
                    >
                      {inCart ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
