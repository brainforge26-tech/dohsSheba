'use client';

import React from 'react';
import Link from 'next/link';
import { SERVICE_CATEGORIES } from '@/constants/services';
import {
  Zap,
  Droplet,
  Sparkles,
  Wind,
  ShieldAlert,
  Wrench,
  Hammer,
  Paintbrush,
  Camera,
  LayoutGrid,
  ArrowRight,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6" />,
  Droplet: <Droplet className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Wind: <Wind className="w-6 h-6" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
  Hammer: <Hammer className="w-6 h-6" />,
  Paintbrush: <Paintbrush className="w-6 h-6" />,
  Camera: <Camera className="w-6 h-6" />,
  LayoutGrid: <LayoutGrid className="w-6 h-6" />,
};

export function ServiceCategoriesGrid() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Zap className="w-4 h-4" />
              <span>Professional Home Services</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1">
              Explore Our Expert Service Categories
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              From instant electrical fixes to comprehensive AC servicing, book certified local technicians directly.
            </p>
          </div>
          <Link
            href="/services/home-service"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card font-bold text-xs hover:bg-secondary transition-all shadow-sm group"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 10 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {SERVICE_CATEGORIES.map((cat) => {
            const IconComponent = ICON_MAP[cat.iconName] || <Wrench className="w-6 h-6" />;

            return (
              <Link
                key={cat.id}
                href={`/services/home-service/${cat.slug}`}
                className="group relative p-5 rounded-3xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Badge if present */}
                {cat.badge && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                    {cat.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div
                    className={`w-14 h-14 rounded-2xl ${cat.colorBg} ${cat.colorText} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                  >
                    {IconComponent}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm group-hover:text-primary transition-colors leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                  <span>{cat.popularCount}+ booked</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
