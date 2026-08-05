import React from 'react';
import { ServiceCategoriesGrid } from '@/components/home/ServiceCategoriesGrid';
import { ShoppingCategoriesGrid } from '@/components/home/ShoppingCategoriesGrid';
import { FeaturedServicesSection } from '@/components/home/FeaturedServicesSection';
import { DailyDealsSection } from '@/components/home/DailyDealsSection';

export default function ServicesPage() {
  return (
    <div className="py-8 space-y-12">
      <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Marketplace Catalog</h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Explore all home repair services, technician bookings, fresh vegetables, fruits & daily groceries.
        </p>
      </div>

      <ServiceCategoriesGrid />
      <ShoppingCategoriesGrid />
      <FeaturedServicesSection />
      <DailyDealsSection />
    </div>
  );
}
