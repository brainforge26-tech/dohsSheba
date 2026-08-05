'use client';

import React, { useState } from 'react';
import { MOCK_PROVIDER_PROFILES, SERVICE_CATEGORIES } from '@/constants/services';
import { ProviderCard } from '@/components/cards/ProviderCard';
import { ServiceFilterSidebar } from '@/components/services/ServiceFilterSidebar';
import { Wrench, Zap } from 'lucide-react';

export default function HomeServiceOverviewPage() {
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [instantArrivalOnly, setInstantArrivalOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const providers = Object.values(MOCK_PROVIDER_PROFILES).filter((p) => {
    const service = p.services[0];
    if (service && service.price > maxPrice) return false;
    if (p.rating < minRating) return false;
    if (verifiedOnly && !p.isVerified) return false;
    return true;
  });

  const handleReset = () => {
    setMaxPrice(5000);
    setMinRating(0);
    setInstantArrivalOnly(false);
    setVerifiedOnly(false);
  };

  return (
    <div className="py-10 px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 w-full max-w-[1720px] mx-auto space-y-8">
      {/* Category Title Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-blue-300">
          <Wrench className="w-3.5 h-3.5" />
          Verified DOHS Technicians Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          All Home Repair & Maintenance Services
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          Find and book certified electricians, AC technicians, plumbers, house cleaners, and pest exterminators across Mohakhali, Baridhara, Mirpur & Banani DOHS.
        </p>
      </div>

      {/* Content Layout with Filter Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <ServiceFilterSidebar
          currentCategorySlug="all"
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          minRating={minRating}
          setMinRating={setMinRating}
          instantArrivalOnly={instantArrivalOnly}
          setInstantArrivalOnly={setInstantArrivalOnly}
          verifiedOnly={verifiedOnly}
          setVerifiedOnly={setVerifiedOnly}
          onReset={handleReset}
        />

        {/* Providers Listing */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">
              Found {providers.length} {providers.length === 1 ? 'Provider' : 'Providers'}
            </h2>
            <span className="text-xs text-muted-foreground">Showing verified service partners</span>
          </div>

          <div className="space-y-4">
            {providers.length === 0 ? (
              <div className="p-12 text-center border border-border rounded-3xl bg-card space-y-2">
                <p className="font-bold text-lg">No service providers match your filters</p>
                <p className="text-xs text-muted-foreground">Try adjusting your price range or rating filters.</p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs mt-2"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
