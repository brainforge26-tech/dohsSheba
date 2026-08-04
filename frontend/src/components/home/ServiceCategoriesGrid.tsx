'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight, Wrench } from 'lucide-react';

export function ServiceCategoriesGrid() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  // Auto-scroll loop effect (pauses on hover)
  useEffect(() => {
    let isHovered = false;
    const container = scrollContainerRef.current;

    const autoScrollInterval = setInterval(() => {
      if (!isHovered && container) {
        const isAtEnd =
          container.scrollLeft + container.clientWidth >= container.scrollWidth - 15;
        if (isAtEnd) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 240, behavior: 'smooth' });
        }
      }
    }, 3500);

    const handleMouseEnter = () => {
      isHovered = true;
    };
    const handleMouseLeave = () => {
      isHovered = false;
    };

    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      clearInterval(autoScrollInterval);
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // English service categories dataset
  const popularServicesData = [
    {
      id: 'cat_ac',
      name: 'AC Service & Repair',
      slug: 'ac-service',
      rating: '4.95',
      bookings: '1,420 Bookings',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_elec',
      name: 'Master Electrician',
      slug: 'electrician',
      rating: '4.92',
      bookings: '2,310 Bookings',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_plumb',
      name: 'Plumbing & Leaks',
      slug: 'plumber',
      rating: '4.88',
      bookings: '1,890 Bookings',
      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_clean',
      name: 'House Deep Cleaning',
      slug: 'cleaner',
      rating: '4.96',
      bookings: '3,100 Bookings',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_pest',
      name: 'Pest Control',
      slug: 'pest-control',
      rating: '4.85',
      bookings: '950 Bookings',
      image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_appliance',
      name: 'Appliance Repair',
      slug: 'appliance-repair',
      rating: '4.90',
      bookings: '1,120 Bookings',
      image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_carpenter',
      name: 'Furniture & Carpenter',
      slug: 'carpenter',
      rating: '4.82',
      bookings: '780 Bookings',
      image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_painting',
      name: 'House Painting',
      slug: 'painting',
      rating: '4.89',
      bookings: '640 Bookings',
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_cctv',
      name: 'CCTV & Security',
      slug: 'cctv-security',
      rating: '4.94',
      bookings: '520 Bookings',
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-6 px-4 bg-white">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Header Row (Clean English Title) */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#7eb343]">
              <Wrench className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Popular Services
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Left/Right Scroll Arrows */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={scrollLeft}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Green See All Button */}
            <Link
              href="/services/home-service"
              className="px-4 py-1.5 rounded-lg border border-[#7eb343] text-[#7eb343] hover:bg-[#7eb343] hover:text-white font-bold text-xs transition-colors cursor-pointer"
            >
              See All
            </Link>
          </div>
        </div>

        {/* Horizontal Scrolling Items Row (Hidden Scrollbar + Auto-Scroll Enabled) */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto py-2 px-1 scroll-smooth select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {popularServicesData.map((service) => (
            <Link
              key={service.id}
              href={`/services/home-service/${service.slug}`}
              className="flex flex-col items-center group shrink-0 w-24 sm:w-28 text-center"
            >
              {/* Circle Image Container */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-slate-200 p-1 shadow-2xs group-hover:border-[#7eb343] transition-all bg-white shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-108 transition-transform duration-300"
                />
              </div>

              {/* Rating Badge below circle */}
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-500 mt-2">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{service.rating}</span>
              </div>

              {/* Service Title */}
              <h3 className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors leading-tight line-clamp-1 mt-1 max-w-[110px]">
                {service.name}
              </h3>

              {/* Bookings / Subtitle */}
              <span className="text-[10px] text-slate-400 font-semibold mt-0.5 whitespace-nowrap">
                {service.bookings}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
