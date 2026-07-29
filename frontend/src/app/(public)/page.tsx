import React from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { ServiceCategoriesGrid } from '@/components/home/ServiceCategoriesGrid';
import { ShoppingCategoriesGrid } from '@/components/home/ShoppingCategoriesGrid';
import { FeaturedServicesSection } from '@/components/home/FeaturedServicesSection';
import { DailyDealsSection } from '@/components/home/DailyDealsSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';

export default function HomePage() {
  return (
    <div className="w-full">
      <HeroBanner />
      <ServiceCategoriesGrid />
      <ShoppingCategoriesGrid />
      <FeaturedServicesSection />
      <DailyDealsSection />
      <HowItWorksSection />
      <TestimonialsSection />
    </div>
  );
}
