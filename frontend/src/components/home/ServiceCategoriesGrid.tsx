'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight, Wrench } from 'lucide-react';

const FALLBACK_SERVICES = [
  { id: 'cat_ac',        name: 'AC Service & Repair',    slug: 'ac-service',      rating: '4.95', bookings: '1,420 Bookings', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat_elec',      name: 'Master Electrician',     slug: 'electrician',     rating: '4.92', bookings: '2,310 Bookings', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat_plumb',     name: 'Plumbing & Leaks',       slug: 'plumber',         rating: '4.88', bookings: '1,890 Bookings', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat_clean',     name: 'House Deep Cleaning',    slug: 'cleaner',         rating: '4.96', bookings: '3,100 Bookings', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat_pest',      name: 'Pest Control',           slug: 'pest-control',    rating: '4.85', bookings: '950 Bookings',   image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat_appliance', name: 'Appliance Repair',       slug: 'appliance-repair',rating: '4.90', bookings: '1,120 Bookings', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat_carpenter', name: 'Furniture & Carpenter',  slug: 'carpenter',       rating: '4.82', bookings: '780 Bookings',   image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat_painting',  name: 'House Painting',         slug: 'painting',        rating: '4.89', bookings: '640 Bookings',   image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat_cctv',      name: 'CCTV & Security',        slug: 'cctv-security',   rating: '4.94', bookings: '520 Bookings',   image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&auto=format&fit=crop&q=80' },
];

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  rating: string;
  bookings: string;
  image: string;
}

export function ServiceCategoriesGrid() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<ServiceCategory[] | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch data
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/service-categories`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: ServiceCategory[] = res.data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
            rating: cat.averageRating ? Number(cat.averageRating).toFixed(2) : '4.80',
            bookings: cat._count?.services ? `${cat._count.services} Services` : cat.bookings || '—',
            image: cat.image || cat.imageUrl || FALLBACK_SERVICES[0].image,
          }));
          setServices(mapped);
        } else {
          setServices(FALLBACK_SERVICES);
        }
      })
      .catch(() => setServices(FALLBACK_SERVICES));
  }, []);

  const scrollLeft = useCallback(() => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
  }, []);

  // Smooth Auto Scroll
  useEffect(() => {
    let isPaused = false;
    const container = scrollContainerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (!isPaused && !isMouseDown && container) {
        const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 20;
        if (atEnd) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 240, behavior: 'smooth' });
        }
      }
    }, 4000);

    const onEnter = () => { isPaused = true; };
    const onLeave = () => { isPaused = false; };

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);
    container.addEventListener('touchstart', onEnter, { passive: true });
    container.addEventListener('touchend', onLeave, { passive: true });

    return () => {
      clearInterval(interval);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      container.removeEventListener('touchstart', onEnter);
      container.removeEventListener('touchend', onLeave);
    };
  }, [isMouseDown]);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsMouseDown(true);
    setIsDragging(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <section className="py-6 px-4 bg-white select-none">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* Header Row */}
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
            <Link href="/services/home-service" className="px-4 py-1.5 rounded-lg border border-[#7eb343] text-[#7eb343] hover:bg-[#7eb343] hover:text-white font-bold text-xs transition-colors cursor-pointer">
              See All
            </Link>
          </div>
        </div>

        {/* Carousel Container with Arrows & Drag */}
        <div className="relative group/carousel">

          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-[#7eb343] transition-all cursor-pointer opacity-90 group-hover/carousel:opacity-100 active:scale-95"
            title="Previous Services"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-[#7eb343] transition-all cursor-pointer opacity-90 group-hover/carousel:opacity-100 active:scale-95"
            title="Next Services"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable Row */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
            className={`flex items-center gap-6 sm:gap-8 overflow-x-auto py-3 px-4 scroll-smooth overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
              isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {services === null
              ? Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center shrink-0 w-24 sm:w-28 animate-pulse">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-200" />
                    <div className="h-2.5 w-16 bg-slate-200 rounded mt-3" />
                    <div className="h-2 w-12 bg-slate-100 rounded mt-1.5" />
                  </div>
                ))
              : services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/home-service/${service.slug}`}
                    onClick={(e) => { if (isDragging) e.preventDefault(); }}
                    className="flex flex-col items-center group shrink-0 w-24 sm:w-28 text-center transition-transform hover:-translate-y-1 duration-200"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-slate-100 p-1 shadow-xs group-hover:border-[#7eb343] group-hover:shadow-md transition-all bg-white shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover rounded-full group-hover:scale-108 transition-transform duration-300 pointer-events-none"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-500 mt-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{service.rating}</span>
                    </div>
                    <h3 className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors leading-tight line-clamp-1 mt-1 max-w-[110px]">
                      {service.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5 whitespace-nowrap">
                      {service.bookings}
                    </span>
                  </Link>
                ))
            }
          </div>

        </div>

      </div>
    </section>
  );
}
