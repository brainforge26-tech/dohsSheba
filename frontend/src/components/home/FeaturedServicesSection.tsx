'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FEATURED_SERVICES } from '@/constants/services';
import { ServiceItem } from '@/types/service';
import { formatCurrency } from '@/utils/cn';
import { QuickBookingModal } from '@/components/modals/QuickBookingModal';
import { Star, Clock, MapPin, Check, Zap, ShieldCheck, Sparkles, ChevronRight, Award } from 'lucide-react';

export function FeaturedServicesSection() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'ac' | 'electric' | 'clean'>('all');

  const filteredServices = FEATURED_SERVICES.filter((service) => {
    if (activeTab === 'ac') return service.categoryName.toLowerCase().includes('ac') || service.categoryName.toLowerCase().includes('appliance');
    if (activeTab === 'electric') return service.categoryName.toLowerCase().includes('electric') || service.categoryName.toLowerCase().includes('plumb');
    if (activeTab === 'clean') return service.categoryName.toLowerCase().includes('clean') || service.categoryName.toLowerCase().includes('wash');
    return true;
  });

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background via-slate-900/40 to-background border-b border-border/50">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header & Badges */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-extrabold uppercase tracking-wider text-amber-400">
              <Award className="w-3.5 h-3.5" />
              <span>Savar DOHS Highest Rated</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Top-Rated Services in Savar DOHS
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl font-normal leading-relaxed">
              Hand-picked certified service providers with 100% price transparency and guaranteed response within 30 minutes.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Packages' },
              { id: 'ac', label: '❄️ AC & Cooling' },
              { id: 'electric', label: '⚡ Electrical & Plumbing' },
              { id: 'clean', label: '✨ Deep Cleaning' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                    : 'bg-card text-muted-foreground border-border hover:border-border/80 hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid (App-Style Horizontal Cards on Mobile, Full Cards on Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative rounded-2xl sm:rounded-3xl border border-border/80 bg-card/90 hover:bg-card hover:border-blue-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-row sm:flex-col justify-between overflow-hidden p-2.5 sm:p-0"
            >
              {/* Image Container (Square Thumbnail on Mobile, Full Banner on Desktop) */}
              <div className="relative w-24 h-24 sm:w-full sm:h-48 rounded-xl sm:rounded-none overflow-hidden bg-slate-900 shrink-0">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                {/* Badge if present */}
                {service.badge && (
                  <span className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 px-2 sm:px-3 py-0.5 rounded-full text-[9px] sm:text-xs font-black bg-blue-600 text-white shadow-md">
                    {service.badge}
                  </span>
                )}

                {/* Rating Overlay */}
                <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 flex items-center gap-1 bg-black/80 backdrop-blur-md px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-white text-[10px] sm:text-xs font-bold border border-white/10">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
                  <span>{service.rating}</span>
                  <span className="text-slate-300 font-normal hidden sm:inline">({service.reviewCount})</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="pl-3 sm:p-5 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
                    <span className="font-extrabold text-blue-400 uppercase tracking-wider text-[9px] sm:text-[10px]">
                      {service.categoryName}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {service.duration}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-xs sm:text-base leading-snug group-hover:text-blue-400 transition-colors text-foreground line-clamp-2">
                    {service.title}
                  </h3>

                  {/* Provider Info */}
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground pt-0.5 sm:pt-1 sm:border-t sm:border-border/40">
                    <div className="relative w-4 h-4 sm:w-6 sm:h-6 rounded-full overflow-hidden flex-shrink-0 border border-blue-500/30">
                      <Image
                        src={service.providerAvatar}
                        alt={service.providerName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="truncate font-semibold text-slate-300 text-[10px] sm:text-xs">{service.providerName}</span>
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0 ml-auto" />
                  </div>

                  {/* Feature Bullets (Desktop Only) */}
                  <ul className="hidden sm:block space-y-1 pt-1.5">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & Booking Button */}
                <div className="pt-1 sm:pt-3 border-t border-border/40 sm:border-border/60 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-wider hidden sm:block">Starts from</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm sm:text-xl font-black text-blue-400">
                        {formatCurrency(service.price)}
                      </span>
                      {service.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                          {formatCurrency(service.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedService(service)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-sm sm:shadow-md hover:shadow-lg shadow-blue-600/30 transition-all flex items-center gap-0.5 sm:gap-1 active:scale-95 cursor-pointer"
                  >
                    <span>Book</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
