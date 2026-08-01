'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProviderProfile, ServiceItem } from '@/types/service';
import { formatCurrency } from '@/utils/cn';
import { Star, ShieldCheck, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';

interface ProviderCardProps {
  provider: ProviderProfile;
  primaryService?: ServiceItem;
}

export function ProviderCard({ provider, primaryService }: ProviderCardProps) {
  const service = primaryService || provider.services[0];

  return (
    <div className="group rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-3.5 sm:p-6 shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-stretch sm:items-center w-full max-w-full overflow-hidden">
      {/* Left Avatar & Core Info */}
      <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1 w-full overflow-hidden">
        <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-secondary flex-shrink-0 border-2 border-primary/20 shadow-sm">
          <Image
            src={provider.avatar}
            alt={provider.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>

        <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <h3 className="font-extrabold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors truncate max-w-full">
              {provider.name}
            </h3>
            {provider.isVerified && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[9px] sm:text-[10px] font-bold border border-emerald-500/20 shrink-0">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 text-[11px] sm:text-xs text-muted-foreground flex-wrap leading-tight">
            <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{provider.rating}</span>
              <span className="text-muted-foreground font-normal">({provider.reviewCount})</span>
            </div>
            <span>•</span>
            <span className="shrink-0">{provider.completedJobs}+ jobs</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{provider.experienceYears} yrs exp</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground pt-0.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="truncate">{provider.address}</span>
          </div>

          {/* Service Bullet Chips */}
          <div className="flex items-center gap-1.5 pt-1 flex-wrap text-[10px] sm:text-xs overflow-hidden">
            {provider.specialties.slice(0, 3).map((spec, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-secondary text-muted-foreground font-medium text-[10px] sm:text-[11px] truncate max-w-[130px] sm:max-w-none"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Pricing & Actions */}
      <div className="w-full sm:w-auto sm:text-right border-t sm:border-t-0 sm:border-l border-border/60 pt-2.5 sm:pt-0 sm:pl-6 space-y-2 sm:space-y-3 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end flex-wrap gap-2 shrink-0">
        <div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">Starting Price</div>
          <div className="text-lg sm:text-2xl font-black text-primary">
            {service ? formatCurrency(service.price) : 'Custom'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/services/home-service/provider/${provider.id}`}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-border bg-background hover:bg-secondary text-foreground text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            Profile
          </Link>
          {service && (
            <Link
              href={`/services/home-service/book/${service.id}`}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
