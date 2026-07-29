'use client';

import React, { useState } from 'react';
import { Wrench, ShoppingBag, Search, Sparkles, ShieldCheck, Clock, Star, MapPin } from 'lucide-react';
import Link from 'next/link';

export function HeroBanner() {
  const [activeTab, setActiveTab] = useState<'service' | 'shopping'>('service');
  const [serviceQuery, setServiceQuery] = useState('');
  const [shoppingQuery, setShoppingQuery] = useState('');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-background text-white pt-10 pb-16 px-4">
      {/* Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-emerald-500/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Highlight Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200 shadow-glass">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Dedicated All-in-One Marketplace for DOHS Residents</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15]">
            Home Services & Daily Groceries{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              At Your Doorstep
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Book verified electricians, plumbers, and AC repair technicians in 60 seconds — or order fresh vegetables, meat & daily grocery items delivered in 45 minutes.
          </p>
        </div>

        {/* Interactive Search Card Container */}
        <div className="max-w-3xl mx-auto mt-8 bg-background/95 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl text-foreground">
          {/* Tab Selector */}
          <div className="flex rounded-2xl bg-secondary p-1.5 mb-5 max-w-md mx-auto border border-border">
            <button
              onClick={() => setActiveTab('service')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'service'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Wrench className="w-4 h-4 text-blue-400" />
              <span>Book Home Service</span>
            </button>
            <button
              onClick={() => setActiveTab('shopping')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'shopping'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Shop Daily Groceries</span>
            </button>
          </div>

          {/* Tab 1: Service Search Form */}
          {activeTab === 'service' ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Wrench className="w-5 h-5 absolute left-4 top-3.5 text-blue-500" />
                  <input
                    type="text"
                    value={serviceQuery}
                    onChange={(e) => setServiceQuery(e.target.value)}
                    placeholder="Search e.g. AC Repair, Electrician, Sofa Cleaning..."
                    className="w-full h-12 pl-12 pr-4 rounded-2xl border border-input bg-background font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                  />
                </div>
                <Link
                  href={`/services/home-service?search=${encodeURIComponent(serviceQuery)}`}
                  className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Technicians</span>
                </Link>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex items-center gap-2 text-xs flex-wrap pt-1">
                <span className="text-muted-foreground font-semibold">Popular:</span>
                {['AC Jet Cleaning', 'Electrician', 'Plumbing Leak', 'Sofa Deep Wash', 'Pest Extermination'].map((chip) => (
                  <Link
                    key={chip}
                    href={`/search?q=${encodeURIComponent(chip)}`}
                    className="px-3 py-1 rounded-full bg-secondary hover:bg-primary/10 hover:text-primary border border-border text-muted-foreground transition-all"
                  >
                    {chip}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* Tab 2: Grocery Search Form */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <ShoppingBag className="w-5 h-5 absolute left-4 top-3.5 text-emerald-500" />
                  <input
                    type="text"
                    value={shoppingQuery}
                    onChange={(e) => setShoppingQuery(e.target.value)}
                    placeholder="Search e.g. Fresh Tomatoes, Mustard Oil, Milk, Mangoes..."
                    className="w-full h-12 pl-12 pr-4 rounded-2xl border border-input bg-background font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-inner"
                  />
                </div>
                <Link
                  href={`/services/shopping?search=${encodeURIComponent(shoppingQuery)}`}
                  className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Shop Market</span>
                </Link>
              </div>

              {/* Quick Grocery Chips */}
              <div className="flex items-center gap-2 text-xs flex-wrap pt-1">
                <span className="text-muted-foreground font-semibold">Categories:</span>
                {['Fresh Vegetables', 'Organic Fruits', 'Halal Meat', 'Fresh River Fish', 'Pure Milk'].map((chip) => (
                  <Link
                    key={chip}
                    href={`/services/shopping/${chip.toLowerCase().replace(/ /g, '-')}`}
                    className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 transition-all hover:bg-emerald-100"
                  >
                    {chip}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center space-y-1">
            <div className="text-2xl font-black text-blue-400">500+</div>
            <div className="text-xs text-slate-300 font-medium">Verified Technicians</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center space-y-1">
            <div className="text-2xl font-black text-emerald-400">45 Mins</div>
            <div className="text-xs text-slate-300 font-medium">Grocery Express Delivery</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center space-y-1">
            <div className="text-2xl font-black text-amber-400">4.9 ★</div>
            <div className="text-xs text-slate-300 font-medium">DOHS Resident Rating</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center space-y-1">
            <div className="text-2xl font-black text-purple-400">100%</div>
            <div className="text-xs text-slate-300 font-medium">Service Warranty</div>
          </div>
        </div>
      </div>
    </section>
  );
}
