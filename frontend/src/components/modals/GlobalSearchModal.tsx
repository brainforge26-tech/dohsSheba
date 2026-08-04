'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, X, ChevronDown, Wrench, ShoppingBag, Carrot, Zap } from 'lucide-react';
import { useSearchStore } from '@/store/useSearchStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useRouter } from 'next/navigation';
import { ALL_PRODUCTS } from '@/constants/products';
import { SERVICE_CATEGORIES } from '@/constants/services';
import { ProductItem } from '@/types/shopping';

export function GlobalSearchModal() {
  const router = useRouter();
  const { isOpen, closeSearch, query, setQuery, category, setCategory } = useSearchStore();
  const { language } = useLanguageStore();
  const isBn = language === 'BN';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key press & body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeSearch]);

  if (!mounted || !isOpen) return null;

  const popularTags = [
    { label: 'FROZEN', val: 'vegetables' },
    { label: 'YOGURT', val: 'dairy' },
    { label: 'VEGAN', val: 'meat' },
    { label: 'WATER', val: 'Water Purifier' },
    { label: 'MILK', val: 'dairy' },
    { label: 'AC REPAIR', val: 'AC Repair' },
    { label: 'ELECTRICIAN', val: 'Electrician' },
  ];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    closeSearch();
    if (category === 'services') {
      router.push(`/services/home-service?search=${encodeURIComponent(query)}`);
    } else {
      router.push(`/services/shopping?search=${encodeURIComponent(query)}`);
    }
  };

  // Filter live search results if user is typing
  const isTyping = query.trim().length > 0;
  const filteredProducts = ALL_PRODUCTS.filter(
    (p: ProductItem) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(query.toLowerCase()))
  );
  const filteredServices = SERVICE_CATEGORIES.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-white/95 backdrop-blur-md animate-in fade-in duration-200 font-sans text-slate-800">
      {/* Top Close Button (Reference Image 3) */}
      <button
        onClick={closeSearch}
        className="fixed top-5 right-6 z-50 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all border border-slate-200 active:scale-90"
        title="Close Search (ESC)"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        
        {/* ── 1. Search Bar Header (Matching Woodmart Reference Screenshot 3) ── */}
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="relative flex flex-col md:flex-row items-center bg-white rounded-md border border-slate-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#7eb343] transition-all">
            {/* Main Input */}
            <div className="relative flex-1 w-full flex items-center px-4 py-3.5">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products"
                className="w-full text-base sm:text-lg font-medium text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Dropdown & Submit Button */}
            <div className="w-full md:w-auto flex items-center border-t md:border-t-0 md:border-l border-slate-200 bg-slate-50 shrink-0">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-600 px-4 py-3.5 focus:outline-none cursor-pointer uppercase tracking-wider"
              >
                <option value="all">SELECT CATEGORY</option>
                <option value="shopping">Grocery & Daily Needs</option>
                <option value="services">Home Services</option>
                <option value="vegetables">Fresh Vegetables</option>
                <option value="dairy">Milk & Dairy</option>
                <option value="meat">Meat & Poultry</option>
              </select>

              <button
                type="submit"
                className="h-full px-6 py-3.5 bg-[#7eb343] hover:bg-[#6c9c36] text-white font-extrabold flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── 2. Popular Requests Tag Chips (Reference Screenshot 3) ── */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] mr-1">
              POPULAR REQUESTS
            </span>
            {popularTags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(tag.val)}
                className={`px-3 py-1 rounded-md font-bold text-[11px] uppercase transition-all ${
                  query.toLowerCase() === tag.val.toLowerCase()
                    ? 'bg-[#7eb343] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </form>

        {/* ── 3. Live Results or 4-Column Grid Showcase (Screenshot 3) ── */}
        {isTyping ? (
          /* Live Search Results */
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                Search Results for &quot;<span className="text-[#7eb343]">{query}</span>&quot;
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                {filteredProducts.length + filteredServices.length} items found
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((prod: ProductItem) => (
                <Link
                  key={prod.id}
                  href={`/services/shopping/product/${prod.slug || prod.id}`}
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-all group shadow-2xs"
                >
                  <img src={prod.image} alt={prod.title} className="w-14 h-14 rounded-lg object-cover shrink-0 bg-slate-100" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">{prod.categoryName || 'Grocery'}</span>
                    <h4 className="font-bold text-xs text-slate-800 truncate group-hover:text-[#7eb343] transition-colors">
                      {prod.title}
                    </h4>
                    <div className="font-extrabold text-xs text-[#7eb343] mt-0.5">
                      ৳{prod.price} <span className="text-[10px] text-slate-400 font-normal">/ {prod.unit}</span>
                    </div>
                  </div>
                </Link>
              ))}

              {filteredServices.map((svc) => (
                <Link
                  key={svc.id}
                  href={`/services/home-service/${svc.slug}`}
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all group shadow-2xs"
                >
                  <div className="w-14 h-14 rounded-lg bg-[#7eb343]/10 text-[#7eb343] flex items-center justify-center font-bold shrink-0">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-[#7eb343]">Verified Service</span>
                    <h4 className="font-bold text-xs text-slate-800 truncate group-hover:text-[#7eb343] transition-colors">
                      {svc.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">{svc.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && filteredServices.length === 0 && (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="text-base font-semibold">No items match your query &quot;{query}&quot;</p>
              </div>
            )}
          </div>
        ) : (
          /* Default 4-Column Showcase (Reference Image 3 Exact Design) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            
            {/* Column 1: Popular Products */}
            <div className="space-y-4">
              <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                Popular Products
              </h4>
              <div className="space-y-3">
                <Link
                  href="/services/shopping?search=energy"
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&auto=format&fit=crop&q=80"
                    alt="Yerba Mate Energy"
                    className="w-12 h-12 rounded-md object-contain shrink-0 bg-slate-50 p-1 border border-slate-100"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors">
                      Yerba Mate Energy
                    </h5>
                    <p className="text-xs font-extrabold text-[#7eb343] mt-0.5">৳160 / each</p>
                  </div>
                </Link>

                <Link
                  href="/services/shopping?search=blackberry"
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1553279768-865429fa0078?w=150&auto=format&fit=crop&q=80"
                    alt="Yerba Mate Blackberry"
                    className="w-12 h-12 rounded-md object-contain shrink-0 bg-slate-50 p-1 border border-slate-100"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors">
                      Yerba Mate Blackberry
                    </h5>
                    <div className="flex items-center gap-1.5 text-xs mt-0.5">
                      <span className="line-through text-slate-400 font-normal">৳220</span>
                      <span className="font-extrabold text-[#7eb343]">৳150 / each</span>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/services/shopping?search=cherry"
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=150&auto=format&fit=crop&q=80"
                    alt="Yerba Mate Cherry"
                    className="w-12 h-12 rounded-md object-contain shrink-0 bg-slate-50 p-1 border border-slate-100"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors">
                      Yerba Mate Cherry
                    </h5>
                    <p className="text-xs font-extrabold text-[#7eb343] mt-0.5">৳175 / each</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Column 2: Popular Cheese / Dairy */}
            <div className="space-y-4">
              <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                Popular Cheese
              </h4>
              <div className="space-y-3">
                <Link
                  href="/services/shopping/dairy"
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&auto=format&fit=crop&q=80"
                    alt="Mature Flavour Block"
                    className="w-12 h-12 rounded-md object-contain shrink-0 bg-slate-50 p-1 border border-slate-100"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors">
                      Mature Flavour Block
                    </h5>
                    <p className="text-xs font-extrabold text-[#7eb343] mt-0.5">৳340 / each</p>
                  </div>
                </Link>

                <Link
                  href="/services/shopping/dairy"
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1582721478779-0ae163c05a60?w=150&auto=format&fit=crop&q=80"
                    alt="Cheese Slices"
                    className="w-12 h-12 rounded-md object-contain shrink-0 bg-slate-50 p-1 border border-slate-100"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors">
                      Cheese Slices
                    </h5>
                    <div className="flex items-center gap-1.5 text-xs mt-0.5">
                      <span className="line-through text-slate-400 font-normal">৳250</span>
                      <span className="font-extrabold text-[#7eb343]">৳180 / each</span>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/services/shopping/dairy"
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=150&auto=format&fit=crop&q=80"
                    alt="Mature Cheddar"
                    className="w-12 h-12 rounded-md object-contain shrink-0 bg-slate-50 p-1 border border-slate-100"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors">
                      Mature Cheddar
                    </h5>
                    <p className="text-xs font-extrabold text-[#7eb343] mt-0.5">৳290 / each</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Column 3: Popular Cookies & Brownies */}
            <div className="space-y-4">
              <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                Popular Cookies & Brownies
              </h4>
              <div className="space-y-3">
                <Link
                  href="/services/shopping/bakery"
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=150&auto=format&fit=crop&q=80"
                    alt="Choc Chunk Cookies"
                    className="w-12 h-12 rounded-md object-contain shrink-0 bg-slate-50 p-1 border border-slate-100"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors">
                      Choc Chunk Cookies
                    </h5>
                    <p className="text-xs font-extrabold text-[#7eb343] mt-0.5">৳120 / each</p>
                  </div>
                </Link>

                <Link
                  href="/services/shopping/bakery"
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80"
                    alt="Millionaire's Slice"
                    className="w-12 h-12 rounded-md object-contain shrink-0 bg-slate-50 p-1 border border-slate-100"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors">
                      Millionaire&apos;s Slice
                    </h5>
                    <div className="flex items-center gap-1.5 text-xs mt-0.5">
                      <span className="line-through text-slate-400 font-normal">৳180</span>
                      <span className="font-extrabold text-[#7eb343]">৳140 / each</span>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/services/shopping/bakery"
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&auto=format&fit=crop&q=80"
                    alt="Sugar Free Cookies"
                    className="w-12 h-12 rounded-md object-contain shrink-0 bg-slate-50 p-1 border border-slate-100"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors">
                      Sugar Free Cookies
                    </h5>
                    <p className="text-xs font-extrabold text-[#7eb343] mt-0.5">৳115 / each</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Column 4: Popular Tea */}
            <div className="space-y-4">
              <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                Popular Tea
              </h4>
              <div className="space-y-3">
                <Link
                  href="/services/shopping/beverages"
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&auto=format&fit=crop&q=80"
                    alt="Ice Mango Tea"
                    className="w-12 h-12 rounded-md object-contain shrink-0 bg-slate-50 p-1 border border-slate-100"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors">
                      Ice Mango Tea
                    </h5>
                    <div className="flex items-center gap-1.5 text-xs mt-0.5">
                      <span className="line-through text-slate-400 font-normal">৳130</span>
                      <span className="font-extrabold text-[#7eb343]">৳95 / each</span>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/services/shopping/beverages"
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150&auto=format&fit=crop&q=80"
                    alt="Japanese Kukicha Tea"
                    className="w-12 h-12 rounded-md object-contain shrink-0 bg-slate-50 p-1 border border-slate-100"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors">
                      Japanese Kukicha Tea
                    </h5>
                    <p className="text-xs font-extrabold text-[#7eb343] mt-0.5">৳380 / each</p>
                  </div>
                </Link>

                <Link
                  href="/services/shopping/beverages"
                  onClick={closeSearch}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&auto=format&fit=crop&q=80"
                    alt="Japanese Traditional Tea"
                    className="w-12 h-12 rounded-md object-contain shrink-0 bg-slate-50 p-1 border border-slate-100"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] transition-colors">
                      Japanese Traditional Tea
                    </h5>
                    <p className="text-xs font-extrabold text-[#7eb343] mt-0.5">৳340 / each</p>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
