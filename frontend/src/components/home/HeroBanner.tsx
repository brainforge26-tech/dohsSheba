'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench, ShoppingBag, Search, Sparkles, ShieldCheck, Clock, Star,
  MapPin, Zap, Flame, Carrot, ArrowRight, CheckCircle2, Headphones,
  Droplet, Tv, Home, ChevronLeft, ChevronRight, Tag, Shield, Award, Check
} from 'lucide-react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';

export function HeroBanner() {
  const [activeTab, setActiveTab] = useState<'service' | 'shopping'>('service');
  const [serviceQuery, setServiceQuery] = useState('');
  const [shoppingQuery, setShoppingQuery] = useState('');
  const [banners, setBanners] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchApi<any[]>('/banners')
      .then((res) => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setBanners(res.data);
        }
      })
      .catch((err) => console.error('Error loading hero banners:', err));
  }, []);

  // Auto-play carousel slider
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const quickServices = [
    { icon: <Wrench className="w-3.5 h-3.5 text-blue-400" />, label: 'AC Repair', href: '/services/home-service?search=AC' },
    { icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, label: 'Electrician', href: '/services/home-service?search=Electrician' },
    { icon: <Droplet className="w-3.5 h-3.5 text-cyan-400" />, label: 'Plumbing', href: '/services/home-service?search=Plumbing' },
    { icon: <Home className="w-3.5 h-3.5 text-emerald-400" />, label: 'Deep Cleaning', href: '/services/home-service?search=Cleaning' },
  ];

  const quickGroceries = [
    { icon: <Carrot className="w-3.5 h-3.5 text-emerald-400" />, label: 'Vegetables', href: '/services/shopping/vegetables' },
    { icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />, label: 'Fresh Fruits', href: '/services/shopping/fruits' },
    { icon: <Flame className="w-3.5 h-3.5 text-rose-400" />, label: 'Meat & Fish', href: '/services/shopping/meat' },
    { icon: <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />, label: 'Rice & Oil', href: '/services/shopping/rice' },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-4 pb-8 sm:pt-10 sm:pb-16 px-3 sm:px-6 lg:px-8">
      {/* Ambient background glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.2),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-blue-600/15 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-6 sm:space-y-12">
        
        {/* Split 2-Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center">
          
          {/* Left Column: Narrative & Search (Cols 7) */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-6">
            
            {/* Location & Trust Badges (Desktop/Tablet Only) */}
            <div className="hidden sm:flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-300 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Savar DOHS #1 Super-App</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-300 backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Doorstep Service</span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-1 sm:space-y-3">
              <h1 className="text-xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-snug sm:leading-[1.12]">
                Everything Your Home Needs,{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                  Delivered & Serviced Fast
                </span>
              </h1>
              <p className="hidden sm:block text-xs sm:base text-slate-300 font-normal leading-relaxed max-w-xl">
                Book background-verified technicians in 60 seconds — or order fresh daily vegetables, meat & groceries delivered to your Savar DOHS residence.
              </p>
            </div>

            {/* Glassmorphic Search Widget */}
            <div className="bg-[#121424]/90 backdrop-blur-2xl border border-white/15 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl space-y-3 sm:space-y-4">
              
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 rounded-xl sm:rounded-2xl bg-slate-950/80 p-1 border border-white/10">
                <button
                  onClick={() => setActiveTab('service')}
                  className={`py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                    activeTab === 'service'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300" />
                  <span>Book Home Service</span>
                </button>
                <button
                  onClick={() => setActiveTab('shopping')}
                  className={`py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                    activeTab === 'shopping'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />
                  <span>Express Daily Grocery</span>
                </button>
              </div>

              {/* Service Tab */}
              {activeTab === 'service' ? (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    <div className="relative flex-1 w-full">
                      <Wrench className="w-4 h-4 absolute left-4 top-3.5 text-blue-400" />
                      <input
                        type="text"
                        value={serviceQuery}
                        onChange={(e) => setServiceQuery(e.target.value)}
                        placeholder="e.g. AC Jet Repair, Electrician, Plumbing..."
                        className="w-full h-11 pl-11 pr-4 rounded-2xl bg-slate-950/90 border border-white/15 text-white font-medium text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <Link
                      href={`/services/home-service?search=${encodeURIComponent(serviceQuery)}`}
                      className="w-full sm:w-auto h-11 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/40 transition-all shrink-0 active:scale-95"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Find Experts</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-[11px] font-bold text-slate-400">Popular:</span>
                    {quickServices.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-[11px] font-semibold text-blue-200 transition-all"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                /* Shopping Tab */
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    <div className="relative flex-1 w-full">
                      <ShoppingBag className="w-4 h-4 absolute left-4 top-3.5 text-emerald-400" />
                      <input
                        type="text"
                        value={shoppingQuery}
                        onChange={(e) => setShoppingQuery(e.target.value)}
                        placeholder="Search fresh groceries e.g. Vegetables, Fish, Rice..."
                        className="w-full h-11 pl-11 pr-4 rounded-2xl bg-slate-950/90 border border-white/15 text-white font-medium text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <Link
                      href={`/services/shopping?search=${encodeURIComponent(shoppingQuery)}`}
                      className="w-full sm:w-auto h-11 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/40 transition-all shrink-0 active:scale-95"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Shop Market</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-[11px] font-bold text-slate-400">Top Groceries:</span>
                    {quickGroceries.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-[11px] font-semibold text-emerald-200 transition-all"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Hero Carousel Showcase Card (Cols 5) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-[#141629] p-2 shadow-2xl group">
              
              {banners.length > 0 ? (
                <div className="relative min-h-[340px] sm:min-h-[380px] rounded-2xl overflow-hidden flex flex-col justify-between p-6">
                  {/* Background Image & Overlays */}
                  {banners[currentSlide].image && (banners[currentSlide].image.startsWith('http') || banners[currentSlide].image.startsWith('/')) ? (
                    <>
                      <img
                        src={banners[currentSlide].image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-950" />
                  )}

                  {/* Top Pill Header */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/30 backdrop-blur-md border border-indigo-400/40 text-indigo-200 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <Tag className="w-3 h-3 text-indigo-300" />
                      <span>{banners[currentSlide].category || 'Admin Special Deal'}</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/80 font-mono text-[10px] font-bold">
                      {currentSlide + 1} / {banners.length}
                    </span>
                  </div>

                  {/* Slide Content */}
                  <div className="relative z-10 space-y-3 pt-12">
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                      {banners[currentSlide].title}
                    </h3>

                    {banners[currentSlide].subtitle && (
                      <p className="text-xs text-slate-200 font-medium line-clamp-2 leading-relaxed">
                        {banners[currentSlide].subtitle}
                      </p>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      {banners[currentSlide].link ? (
                        <Link
                          href={banners[currentSlide].link}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 shadow-indigo-600/30"
                        >
                          <span>Explore Promotion</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-4 h-4" /> Live Offer Available
                        </span>
                      )}

                      {/* Navigation Arrows */}
                      {banners.length > 1 && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
                            className="w-8 h-8 rounded-xl bg-black/60 hover:bg-black text-white border border-white/20 flex items-center justify-center transition-all"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
                            className="w-8 h-8 rounded-xl bg-black/60 hover:bg-black text-white border border-white/20 flex items-center justify-center transition-all"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Fallback Default Showcase Card when no admin banners exist */
                <div className="relative min-h-[340px] sm:min-h-[380px] rounded-2xl overflow-hidden flex flex-col justify-between p-6 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Savar DOHS Exclusive</span>
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 font-bold text-2xl flex items-center justify-center border border-indigo-500/30">
                      ⚡
                    </div>
                    <h3 className="text-xl font-black text-white">Fastest Doorstep Home Delivery & Repair Service</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Instant connection to NID-vetted electricians, plumbers, and fresh organic market suppliers in Savar DOHS.
                    </p>
                    <Link
                      href="/services/home-service"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-lg"
                    >
                      <span>Explore All Services</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Live Rating Badge */}
            <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-2xl bg-[#1e2038] border border-white/20 shadow-xl backdrop-blur-md flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <div className="text-xs font-black text-white">4.9/5 Rating</div>
                <div className="text-[10px] text-slate-400">1,420+ DOHS Residents</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-[#121424]/80 border border-white/10 backdrop-blur-md flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0 border border-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white">Verified Techs</div>
              <div className="text-[10px] text-slate-400">Background Checked</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121424]/80 border border-white/10 backdrop-blur-md flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 border border-emerald-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white">15-45 Mins Express</div>
              <div className="text-[10px] text-slate-400">Savar DOHS Delivery</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121424]/80 border border-white/10 backdrop-blur-md flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white">Transparent Price</div>
              <div className="text-[10px] text-slate-400">No Hidden Costs</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121424]/80 border border-white/10 backdrop-blur-md flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 border border-purple-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white">100% Warranty</div>
              <div className="text-[10px] text-slate-400">Free Redo Guarantee</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
