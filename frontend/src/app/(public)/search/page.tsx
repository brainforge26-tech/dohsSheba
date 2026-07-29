'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FeaturedServicesSection } from '@/components/home/FeaturedServicesSection';
import { DailyDealsSection } from '@/components/home/DailyDealsSection';
import { Search } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('cat') || 'all';

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto space-y-8">
      <div className="p-6 rounded-3xl bg-secondary/50 border border-border flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-primary text-primary-foreground">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">
            Search Results for "{query || 'All Items'}"
          </h1>
          <p className="text-xs text-muted-foreground">
            Category Filter: <strong className="uppercase">{category}</strong> | Showing top matches in DOHS area
          </p>
        </div>
      </div>

      <FeaturedServicesSection />
      <DailyDealsSection />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
