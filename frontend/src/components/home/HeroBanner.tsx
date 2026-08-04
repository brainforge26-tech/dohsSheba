'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Menu,
  ChevronRight,
  ChevronLeft,
  Truck,
  Sparkles,
  Flame,
  Milk,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useCartStore } from '@/store/useCartStore';
import { useSearchStore } from '@/store/useSearchStore';
import { useCategoryDrawerStore } from '@/store/useCategoryDrawerStore';
import { useHomepage } from '@/hooks/useHomepage';

export function HeroBanner() {
  const { language } = useLanguageStore();
  const isBn = language === 'BN';
  const { openSearch } = useSearchStore();
  const { openDrawer } = useCategoryDrawerStore();

  const { heroSlides: apiHeroSlides, promoCards: apiPromoCards, featuredShortcuts: apiShortcuts, isLoading } = useHomepage();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback defaults if API response is empty
  const heroSlides = apiHeroSlides.length > 0 ? apiHeroSlides : [
    {
      id: 'hs_1',
      title: 'Pure Farm Milk & Organic Daily Eggs',
      subtitle: 'Pure organic dairy & daily essentials delivered straight to your door in 45 minutes.',
      buttonText: 'Order Now',
      buttonLink: '/services/shopping/dairy',
      backgroundImage: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1000&auto=format&fit=crop&q=80',
      badge: 'Daily Fresh Farm Market',
      discountPercentage: 15,
      isActive: true,
      order: 0,
    },
    {
      id: 'hs_2',
      title: 'Farm Fresh Organic Vegetables & Fruits',
      subtitle: '100% chemical-free organic produce harvested daily for DOHS residents.',
      buttonText: 'Explore Produce',
      buttonLink: '/services/shopping/vegetables',
      backgroundImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000&auto=format&fit=crop&q=80',
      badge: '100% Organic',
      discountPercentage: 20,
      isActive: true,
      order: 1,
    },
  ];

  const promoCards = apiPromoCards.length > 0 ? apiPromoCards : [
    {
      id: 'pc_1',
      title: 'Energy Drinks',
      subtitle: 'SAVE UP TO 35% ON',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
      discount: '-35%',
      buttonText: 'Shop Now',
      buttonUrl: '/services/shopping/beverages',
      backgroundColor: '#b5d8f7',
    },
    {
      id: 'pc_2',
      title: 'Plant Nuggets',
      subtitle: 'GET DISCOUNT -15% ON',
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&auto=format&fit=crop&q=80',
      discount: '-15%',
      buttonText: 'Buy Now',
      buttonUrl: '/services/shopping/meat',
      backgroundColor: '#f9da8b',
    },
  ];

  const shortcuts = apiShortcuts.length > 0 ? apiShortcuts : [
    {
      id: 'fs_1',
      title: '-35% on Energy Drinks',
      icon: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&auto=format&fit=crop&q=80',
      link: '/services/shopping/beverages',
    },
    {
      id: 'fs_2',
      title: 'New Frozen Veg',
      icon: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=80',
      link: '/services/shopping/vegetables',
    },
    {
      id: 'fs_3',
      title: 'Save up 30% on milk',
      icon: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&auto=format&fit=crop&q=80',
      link: '/services/shopping/dairy',
    },
    {
      id: 'fs_4',
      title: 'Free Delivery',
      icon: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=80',
      link: '/offers',
    },
  ];

  // Auto slide carousel loop
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="relative w-full bg-white text-slate-900 overflow-hidden font-sans">
      
      {/* ── Top Toolbar: All Categories, Live Search & Header Shortcuts ── */}
      <div className="max-w-7xl mx-auto px-4 pt-3 pb-2 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Left All Categories Button (Green Woodmart Button) */}
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <button
              onClick={openDrawer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#7eb343] hover:bg-[#6e9e38] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>All Categories</span>
            </button>

            {/* Middle Live Search Field */}
            <div
              onClick={() => openSearch(searchQuery)}
              className="flex-1 border border-slate-200 rounded-full flex items-center px-4 py-2 bg-slate-50 hover:bg-white focus-within:bg-white focus-within:border-slate-400 transition-all cursor-pointer shadow-2xs"
            >
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                readOnly
                onFocus={() => openSearch(searchQuery)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products or home services..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600">
            <Link href="/offers" className="flex items-center gap-1.5 hover:text-[#7eb343] transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Promotions</span>
            </Link>
            <Link href="/services/shopping/dairy" className="flex items-center gap-1.5 hover:text-[#7eb343] transition-colors">
              <Milk className="w-3.5 h-3.5 text-blue-500" />
              <span>Ideas For Breakfast</span>
            </Link>
            <Link href="/offers" className="flex items-center gap-1.5 hover:text-[#7eb343] transition-colors">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Weekly Discounts</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ── Dynamic Top Circular Shortcuts Row ── */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-start gap-8 overflow-x-auto no-scrollbar">
          {shortcuts.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="flex items-center gap-3 group shrink-0"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 p-0.5 group-hover:border-[#7eb343] transition-all bg-slate-100 shrink-0">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors whitespace-nowrap">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Main Hero Section (Dynamic Database Hero Slide + Promo Cards) ── */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Hero Slider (Left 50% Width = 6 cols) */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden bg-[#d7e6cd] p-6 sm:p-10 flex flex-col justify-between min-h-[380px] sm:min-h-[420px] shadow-2xs group">
            
            {/* Top Row: Icon + Pagination Dots */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ❖
              </div>
              
              {/* Slide Dots */}
              <div className="flex items-center gap-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === idx ? 'w-5 bg-slate-900' : 'w-2 bg-slate-400/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Slide Content */}
            {heroSlides[currentSlide] && (
              <div className="relative z-10 max-w-sm space-y-4 my-auto pt-4">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-snug tracking-tight">
                  {heroSlides[currentSlide].title}
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                  {heroSlides[currentSlide].discountPercentage && (
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      -{heroSlides[currentSlide].discountPercentage}%
                    </span>
                  )}
                  {heroSlides[currentSlide].badge && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0ad4e] text-slate-900 font-bold text-xs shadow-2xs">
                      <Truck className="w-3.5 h-3.5" />
                      <span>{heroSlides[currentSlide].badge}</span>
                    </span>
                  )}
                </div>

                {heroSlides[currentSlide].subtitle && (
                  <p className="text-xs text-slate-700 font-medium max-w-xs leading-relaxed">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                )}

                <div className="pt-2">
                  <Link
                    href={heroSlides[currentSlide].buttonLink || '/services/shopping'}
                    className="inline-block px-7 py-3 rounded-md bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm border border-slate-200 shadow-sm transition-all active:scale-95"
                  >
                    {heroSlides[currentSlide].buttonText || 'Order Now'}
                  </Link>
                </div>
              </div>
            )}

            {/* Slide Background Image */}
            {heroSlides[currentSlide] && (
              <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden">
                <img
                  src={heroSlides[currentSlide].backgroundImage}
                  alt={heroSlides[currentSlide].title}
                  className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700 mix-blend-multiply opacity-90"
                />
              </div>
            )}

            {/* Navigation Arrows */}
            {heroSlides.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 border border-slate-200 flex items-center justify-center shadow-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 border border-slate-200 flex items-center justify-center shadow-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Right Promotional Cards (Dynamic Database Promo Cards) */}
          {promoCards.slice(0, 2).map((card, idx) => (
            <div
              key={card.id || idx}
              style={{ backgroundColor: card.backgroundColor || (idx === 0 ? '#b5d8f7' : '#f9da8b') }}
              className="lg:col-span-3 rounded-2xl overflow-hidden p-6 flex flex-col justify-between shadow-2xs group min-h-[340px] text-center"
            >
              <div className="space-y-1 pt-2">
                {card.subtitle && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 block">
                    {card.subtitle}
                  </span>
                )}
                <h3 className="text-xl font-extrabold text-slate-950">
                  {card.title}
                </h3>
                <Link
                  href={card.buttonUrl || '/services/shopping'}
                  className="inline-block text-xs font-bold text-slate-900 underline hover:text-[#7eb343] transition-colors pt-1"
                >
                  {card.buttonText || 'Shop Now'}
                </Link>
              </div>

              <div className="relative h-44 w-full flex items-center justify-center mt-4 overflow-hidden rounded-xl">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* ── Marquee Feature Bar ── */}
      <div className="w-full bg-[#f8fafc] border-y border-slate-100 py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[
            '⚡ 45-Minute Superfast Delivery in Savar DOHS',
            '🛡️ Verified Technicians & Handymen',
            '🥬 100% Farm Fresh Organic Produce',
            '💳 Cash on Delivery & Digital Wallet Accepted',
            '⭐ Rated 4.9/5 by DOHS Residents',
          ].map((text, index) => (
            <span key={index} className="mx-6 text-xs font-bold text-slate-600 inline-flex items-center gap-2">
              {text}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
