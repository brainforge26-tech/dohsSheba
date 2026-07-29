'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SHOPPING_CATEGORIES } from '@/constants/products';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function ShoppingCategoriesGrid() {
  return (
    <section className="py-16 px-4 bg-secondary/40 border-y border-border">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <ShoppingBag className="w-4 h-4" />
              <span>DOHS Grocery Express</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1">
              Fresh Daily Needs & Kitchen Grocery
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Farm-fresh vegetables, organic fruits, halal meat & fish delivered straight from local shops in 45 mins.
            </p>
          </div>
          <Link
            href="/services/shopping"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card font-bold text-xs hover:bg-secondary transition-all shadow-sm group"
          >
            <span>Explore All Groceries</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Shopping Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {SHOPPING_CATEGORIES.map((pcat) => (
            <Link
              key={pcat.id}
              href={`/services/shopping/${pcat.slug}`}
              className="group relative h-48 rounded-3xl overflow-hidden border border-border/80 shadow-card hover:shadow-2xl transition-all duration-300 flex flex-col justify-end p-5"
            >
              {/* Background Image */}
              <Image
                src={pcat.image}
                alt={pcat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 space-y-1 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/80 backdrop-blur-md">
                  {pcat.itemCount} Items
                </span>
                <h3 className="font-extrabold text-lg group-hover:text-emerald-300 transition-colors">
                  {pcat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
