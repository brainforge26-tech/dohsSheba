'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FALLBACK_CATEGORIES = [
  { id: 'pcat_veg',    name: 'Vegetables & Fruits',    slug: 'vegetables',   image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80' },
  { id: 'pcat_meat',   name: 'Meat & Poultry',         slug: 'meat',         image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&auto=format&fit=crop&q=80' },
  { id: 'pcat_fish',   name: 'Seafood & Fish',         slug: 'fish',         image: 'https://images.unsplash.com/photo-1534942519507-769d4679447d?w=300&auto=format&fit=crop&q=80' },
  { id: 'pcat_dairy',  name: 'Milk & Dairy',           slug: 'dairy',        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80' },
  { id: 'pcat_bakery', name: 'Bakery & Snacks',        slug: 'bakery',       image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80' },
  { id: 'pcat_bev',    name: 'Beverages & Juices',     slug: 'beverages',    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=80' },
  { id: 'pcat_groc',   name: 'Rice, Oil & Spices',     slug: 'rice',         image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80' },
  { id: 'pcat_home',   name: 'Household Essentials',   slug: 'household',    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&auto=format&fit=crop&q=80' },
  { id: 'pcat_health', name: 'Health & Beauty',        slug: 'health-beauty',image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80' },
  { id: 'pcat_baby',   name: 'Mother & Baby',          slug: 'mother-baby',  image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&auto=format&fit=crop&q=80' },
];

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export function ShoppingCategoriesGrid() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<ProductCategory[] | null>(null); // null = loading

  // Fetch from database; use fallback only if API fails or returns empty
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/product-categories`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: ProductCategory[] = res.data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and'),
            image: cat.image || cat.imageUrl || FALLBACK_CATEGORIES[0].image,
          }));
          setCategories(mapped);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      })
      .catch(() => setCategories(FALLBACK_CATEGORIES));
  }, []);

  const scrollLeft  = () => scrollContainerRef.current?.scrollBy({ left: -260, behavior: 'smooth' });
  const scrollRight = () => scrollContainerRef.current?.scrollBy({ left:  260, behavior: 'smooth' });

  // Auto-scroll loop (pauses on hover)
  useEffect(() => {
    let isHovered = false;
    const container = scrollContainerRef.current;
    const interval = setInterval(() => {
      if (!isHovered && container) {
        const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 15;
        atEnd ? container.scrollTo({ left: 0, behavior: 'smooth' }) : container.scrollBy({ left: 240, behavior: 'smooth' });
      }
    }, 3500);
    const onEnter = () => (isHovered = true);
    const onLeave = () => (isHovered = false);
    container?.addEventListener('mouseenter', onEnter);
    container?.addEventListener('mouseleave', onLeave);
    return () => { clearInterval(interval); container?.removeEventListener('mouseenter', onEnter); container?.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <section className="py-6 px-4 bg-white select-none">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* Header Title */}
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Popular Categories
          </h2>
        </div>

        {/* Carousel with Floating Nav Arrows */}
        <div className="relative group">

          <button onClick={scrollLeft} className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-[#7eb343] transition-all cursor-pointer opacity-90 group-hover:opacity-100" title="Previous">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button onClick={scrollRight} className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-[#7eb343] transition-all cursor-pointer opacity-90 group-hover:opacity-100" title="Next">
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable Row */}
          <div ref={scrollContainerRef} className="flex items-start gap-6 sm:gap-8 overflow-x-auto py-2 px-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {categories === null
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center shrink-0 w-24 sm:w-28 animate-pulse">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-200" />
                    <div className="h-2.5 w-16 bg-slate-200 rounded mt-3" />
                  </div>
                ))
              : categories.map((cat) => (
                  <Link key={cat.id} href={`/services/shopping/${cat.slug}`} className="flex flex-col items-center group/item shrink-0 w-24 sm:w-28 text-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100/90 p-1 border border-slate-200 group-hover/item:border-[#7eb343] group-hover/item:shadow-md transition-all overflow-hidden flex items-center justify-center bg-white shrink-0">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover/item:scale-105 transition-transform duration-300" />
                    </div>
                    <h3 className="font-bold text-xs text-slate-800 group-hover/item:text-[#7eb343] transition-colors leading-tight line-clamp-2 mt-2.5 max-w-[100px]">
                      {cat.name}
                    </h3>
                  </Link>
                ))
            }
          </div>

        </div>

      </div>
    </section>
  );
}
