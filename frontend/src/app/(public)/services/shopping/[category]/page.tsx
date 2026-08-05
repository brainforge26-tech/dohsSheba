import React from 'react';
import Link from 'next/link';
import { SHOPPING_CATEGORIES } from '@/constants/products';
import { ProductCategorySlug } from '@/types/shopping';
import { ShoppingCategoryClient } from '@/components/shopping/ShoppingCategoryClient';
import { ChevronRight, ShoppingBag } from 'lucide-react';

export default async function ShoppingCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categorySlug = category as ProductCategorySlug;
  const currentCategory = SHOPPING_CATEGORIES.find((c) => c.slug === categorySlug);

  return (
    <div className="py-8 px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 w-full max-w-[1720px] mx-auto space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
        <Link href="/" className="hover:text-emerald-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/services/shopping" className="hover:text-emerald-600">Shopping Market</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-bold">{currentCategory?.name || category}</span>
      </nav>

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>45-Min Express Delivery in DOHS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {currentCategory?.name || category}
        </h1>
        <p className="text-sm text-emerald-100 max-w-2xl">
          Freshly packed items sourced directly from local DOHS vendors and organic farms.
        </p>
      </div>

      <ShoppingCategoryClient categorySlug={categorySlug} currentCategory={currentCategory} />
    </div>
  );
}
