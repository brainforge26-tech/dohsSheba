'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FEATURED_SERVICES } from '@/constants/services';
import { ServiceItem } from '@/types/service';
import { formatCurrency } from '@/utils/cn';
import { QuickBookingModal } from '@/components/modals/QuickBookingModal';
import { Star, Clock, MapPin, Check, Zap, ShieldCheck } from 'lucide-react';

export function FeaturedServicesSection() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Most Demanded Service Packages
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Top-Rated Services in DOHS Area
          </h2>
          <p className="text-sm text-muted-foreground">
            Hand-picked certified service providers with 100% price transparency and service guarantee.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_SERVICES.map((service) => (
            <div
              key={service.id}
              className="group rounded-3xl border border-border/80 bg-card overflow-hidden shadow-card hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Image */}
              <div className="relative h-48 w-full overflow-hidden bg-secondary">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badge */}
                {service.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-md">
                    {service.badge}
                  </span>
                )}

                {/* Rating Overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-xs font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{service.rating}</span>
                  <span className="text-slate-300 font-normal">({service.reviewCount})</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">{service.categoryName}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {service.duration}
                    </span>
                  </div>
                  <h3 className="font-bold text-base leading-snug group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                    <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border border-border">
                      <Image
                        src={service.providerAvatar}
                        alt={service.providerName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="truncate">{service.providerName}</span>
                  </div>

                  {/* Feature Bullets */}
                  <ul className="space-y-1 pt-2">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Starting from</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-primary">
                        {formatCurrency(service.price)}
                      </span>
                      {service.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatCurrency(service.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedService(service)}
                    className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md hover:shadow-lg transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal render */}
        {selectedService && (
          <QuickBookingModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </div>
    </section>
  );
}
