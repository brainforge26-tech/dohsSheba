'use client';

import React, { useState } from 'react';
import { MOCK_PROVIDER_PROFILES } from '@/constants/services';
import { ServiceCategory, ServiceCategorySlug } from '@/types/service';
import { ProviderCard } from '@/components/cards/ProviderCard';
import { ServiceFilterSidebar } from '@/components/services/ServiceFilterSidebar';
import { Wrench } from 'lucide-react';

interface CategoryClientProps {
  categorySlug: ServiceCategorySlug;
  currentCategory?: ServiceCategory;
}

export function CategoryClient({ categorySlug, currentCategory }: CategoryClientProps) {
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [instantArrivalOnly, setInstantArrivalOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const providers = Object.values(MOCK_PROVIDER_PROFILES).filter((p) => {
    const isCategoryMatch = p.categorySlug === categorySlug || p.services.some((s) => s.categorySlug === categorySlug);
    if (!isCategoryMatch) return false;

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
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <ServiceFilterSidebar
        currentCategorySlug={categorySlug}
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

      <div className="flex-1 w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">
            {providers.length} {providers.length === 1 ? 'Technician' : 'Technicians'} Available
          </h2>
          <span className="text-xs text-muted-foreground">Showing verified DOHS providers</span>
        </div>

        <div className="space-y-4">
          {providers.length === 0 ? (
            <div className="p-12 text-center border border-border rounded-3xl bg-card space-y-3">
              <Wrench className="w-12 h-12 text-muted-foreground mx-auto stroke-[1.5]" />
              <div className="space-y-1">
                <p className="font-bold text-lg">No providers match your exact filters</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Try adjusting your price range or rating filters to view available technicians in this category.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs mt-2 shadow-sm"
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
  );
}
