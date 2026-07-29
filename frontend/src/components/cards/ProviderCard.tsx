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
    <div className="group rounded-3xl border border-border/80 bg-card p-6 shadow-card hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
      {/* Left Avatar & Core Info */}
      <div className="flex items-start gap-4">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-secondary flex-shrink-0 border-2 border-primary/20 shadow-sm">
          <Image
            src={provider.avatar}
            alt={provider.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors">
              {provider.name}
            </h3>
            {provider.isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Verified Partner
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{provider.rating}</span>
              <span className="text-muted-foreground font-normal">({provider.reviewCount})</span>
            </div>
            <span>•</span>
            <span>{provider.completedJobs}+ jobs done</span>
            <span>•</span>
            <span>{provider.experienceYears} yrs experience</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="truncate max-w-xs">{provider.address}</span>
          </div>

          {/* Service Bullet Chips */}
          <div className="flex items-center gap-2 pt-2 flex-wrap text-xs">
            {provider.specialties.slice(0, 3).map((spec, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground font-medium text-[11px]"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Pricing & Actions */}
      <div className="w-full sm:w-auto sm:text-right border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6 space-y-3 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
        <div>
          <div className="text-xs text-muted-foreground">Starting Service Price</div>
          <div className="text-2xl font-black text-primary">
            {service ? formatCurrency(service.price) : 'Custom'}
          </div>
          {service?.priceUnit && (
            <div className="text-[10px] text-muted-foreground">/ {service.priceUnit}</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/services/home-service/provider/${provider.id}`}
            className="px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-secondary text-foreground text-xs font-bold transition-all shadow-sm"
          >
            View Profile
          </Link>
          {service && (
            <Link
              href={`/services/home-service/book/${service.id}`}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
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
