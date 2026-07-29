import React from 'react';
import Link from 'next/link';
import { SERVICE_CATEGORIES } from '@/constants/services';
import { ServiceCategorySlug } from '@/types/service';
import { CategoryClient } from '@/components/services/CategoryClient';
import { ChevronRight, Zap } from 'lucide-react';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categorySlug = slug as ServiceCategorySlug;
  const currentCategory = SERVICE_CATEGORIES.find((c) => c.slug === categorySlug);

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/services/home-service" className="hover:text-primary">Home Services</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-bold">{currentCategory?.name || slug}</span>
      </nav>

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white space-y-3 shadow-xl relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-blue-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>DOHS Verified Service Partners</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {currentCategory?.name || slug}
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          {currentCategory?.description || 'Book certified local technicians with transparent pricing and 7-day warranty.'}
        </p>
      </div>

      <CategoryClient categorySlug={categorySlug} currentCategory={currentCategory} />
    </div>
  );
}
