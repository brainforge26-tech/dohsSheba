'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, X, Wrench, Loader2 } from 'lucide-react';
import { useSearchStore } from '@/store/useSearchStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useRouter } from 'next/navigation';

export function GlobalSearchModal() {
  const router = useRouter();
  const { isOpen, closeSearch, query, setQuery, category, setCategory } = useSearchStore();
  const { language } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

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

  // Dynamic live search API call when query changes
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setProducts([]);
      setServices([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    const timer = setTimeout(() => {
      Promise.all([
        fetch(`${API}/products?search=${encodeURIComponent(trimmed)}&limit=8`).then((r) => r.json()).catch(() => null),
        fetch(`${API}/services?search=${encodeURIComponent(trimmed)}&limit=6`).then((r) => r.json()).catch(() => null),
      ]).then(([prodRes, svcRes]) => {
        if (prodRes?.success && Array.isArray(prodRes.data)) {
          setProducts(prodRes.data);
        } else {
          setProducts([]);
        }

        if (svcRes?.success && Array.isArray(svcRes.data)) {
          setServices(svcRes.data);
        } else {
          setServices([]);
        }
        setSearching(false);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!mounted || !isOpen) return null;

  const popularTags = [
    { label: 'FROZEN', val: 'frozen' },
    { label: 'MILK', val: 'milk' },
    { label: 'MANGO', val: 'mango' },
    { label: 'RICE', val: 'rice' },
    { label: 'AC REPAIR', val: 'ac' },
    { label: 'ELECTRICIAN', val: 'electrician' },
    { label: 'PLUMBING', val: 'plumbing' },
  ];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    closeSearch();
    router.push(`/search?q=${encodeURIComponent(query.trim())}&cat=${category}`);
  };

  const isTyping = query.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-white/95 backdrop-blur-md animate-in fade-in duration-200 font-sans text-slate-800">
      {/* Top Close Button */}
      <button
        onClick={closeSearch}
        className="fixed top-5 right-6 z-50 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all border border-slate-200 active:scale-90 cursor-pointer"
        title="Close Search (ESC)"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        
        {/* Search Bar Header */}
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="relative flex flex-col md:flex-row items-center bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden focus-within:ring-2 focus-within:ring-[#7eb343] transition-all">
            <div className="relative flex-1 w-full flex items-center px-4 py-3.5">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products or services..."
                className="w-full text-base sm:text-lg font-medium text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {searching && <Loader2 className="w-4 h-4 text-[#7eb343] animate-spin mr-2" />}
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
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
                <option value="all">ALL MARKET</option>
                <option value="shopping">Groceries</option>
                <option value="services">Home Services</option>
              </select>

              <button
                type="submit"
                className="h-full px-6 py-3.5 bg-[#7eb343] hover:bg-[#6c9c36] text-white font-extrabold flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Popular Tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Popular:</span>
            {popularTags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(tag.val)}
                className={`px-3 py-1 rounded-md font-bold text-[11px] uppercase transition-all cursor-pointer ${
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

        {/* Live Search Results */}
        {isTyping ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                Search Results for &quot;<span className="text-[#7eb343]">{query}</span>&quot;
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                {searching ? 'Searching...' : `${products.length + services.length} items found`}
              </span>
            </div>

            {searching ? (
              <div className="py-12 flex justify-center items-center text-[#7eb343] gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm font-semibold">Searching database...</span>
              </div>
            ) : products.length === 0 && services.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="text-base font-semibold">No items match your search &quot;{query}&quot;</p>
                <p className="text-xs text-slate-400">Try searching for &quot;milk&quot;, &quot;chicken&quot;, &quot;mango&quot;, or &quot;ac service&quot;</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/services/shopping/product/${prod.slug || prod.id}`}
                    onClick={closeSearch}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-all group shadow-2xs"
                  >
                    <img
                      src={Array.isArray(prod.images) && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
                      alt={prod.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0 bg-slate-100"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">{prod.category?.name || 'Grocery'}</span>
                      <h4 className="font-bold text-xs text-slate-800 truncate group-hover:text-[#7eb343] transition-colors">
                        {prod.name}
                      </h4>
                      <div className="font-extrabold text-xs text-[#7eb343] mt-0.5">
                        ৳{prod.price} <span className="text-[10px] text-slate-400 font-normal">/ {prod.unit || 'unit'}</span>
                      </div>
                    </div>
                  </Link>
                ))}

                {services.map((svc) => (
                  <Link
                    key={svc.id}
                    href={`/services/home-service/${svc.slug || svc.id}`}
                    onClick={closeSearch}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all group shadow-2xs"
                  >
                    <div className="w-14 h-14 rounded-lg bg-[#7eb343]/10 text-[#7eb343] flex items-center justify-center font-bold shrink-0">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-[#7eb343]">Home Service</span>
                      <h4 className="font-bold text-xs text-slate-800 truncate group-hover:text-[#7eb343] transition-colors">
                        {svc.title || svc.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{svc.description || 'Verified Technician'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            Type anything above to search products, groceries, or home services across DOHS.
          </div>
        )}

      </div>
    </div>
  );
}
