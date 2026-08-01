'use client';

import React, { useState } from 'react';
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
  Clock,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
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
  const [activeFilter, setActiveFilter] = useState<'all' | 'repairs' | 'cleaning' | 'installation'>('all');

  const filterCategories = () => {
    if (activeFilter === 'repairs') {
      return SERVICE_CATEGORIES.filter((c) =>
        ['cat_ac', 'cat_elec', 'cat_plumb', 'cat_pest', 'cat_appliance'].includes(c.id)
      );
    }
    if (activeFilter === 'cleaning') {
      return SERVICE_CATEGORIES.filter((c) =>
        ['cat_clean', 'cat_pest', 'cat_painting'].includes(c.id)
      );
    }
    if (activeFilter === 'installation') {
      return SERVICE_CATEGORIES.filter((c) =>
        ['cat_elec', 'cat_carpenter', 'cat_painting', 'cat_cctv'].includes(c.id)
      );
    }
    return SERVICE_CATEGORIES;
  };

  const displayedCategories = filterCategories();

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background via-slate-900/30 to-background border-y border-border/50">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-extrabold uppercase tracking-wider text-blue-400">
              <Wrench className="w-3.5 h-3.5" />
              <span>Verified Home Experts</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Explore Our Expert Service Categories
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl font-normal leading-relaxed">
              Book certified local technicians directly — instant electrical fixes, AC servicing, plumbing, and deep house cleaning in Savar DOHS.
            </p>
          </div>

          <Link
            href="/services/home-service"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-md hover:shadow-lg group shrink-0"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'repairs', label: '⚡ Emergency & Repairs' },
            { id: 'cleaning', label: '✨ Cleaning & Hygiene' },
            { id: 'installation', label: '🔨 Repairs & Install' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-card text-muted-foreground border-border hover:border-border/80 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {displayedCategories.map((cat) => {
            const IconComponent = ICON_MAP[cat.iconName] || <Wrench className="w-6 h-6" />;

            return (
              <Link
                key={cat.id}
                href={`/services/home-service/${cat.slug}`}
                className="group relative p-5 rounded-3xl border border-border/80 bg-card/80 hover:bg-card hover:border-blue-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle Gradient Glow Effect */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform duration-500" />

                {/* Badge if present */}
                {cat.badge && (
                  <span className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-xs">
                    {cat.badge}
                  </span>
                )}

                <div className="space-y-4">
                  {/* Icon Box */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${cat.colorBg} ${cat.colorText} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-white/5`}
                  >
                    {IconComponent}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-foreground group-hover:text-blue-400 transition-colors leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed font-medium">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Footer Info & Action */}
                <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>Arrival &lt; 30m</span>
                  </div>

                  <span className="text-xs font-bold text-blue-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    <span>Book</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Need emergency repair or custom work?</h4>
              <p className="text-xs text-slate-400">Our Savar DOHS verified technicians are available 24/7 on call.</p>
            </div>
          </div>
          <Link
            href="/services/home-service"
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shrink-0"
          >
            Call Hotline: 09612-DOHS
          </Link>
        </div>

      </div>
    </section>
  );
}
