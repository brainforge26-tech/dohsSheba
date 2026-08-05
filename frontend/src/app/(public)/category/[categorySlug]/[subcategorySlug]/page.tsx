'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api-client';
import { SidebarCategoryMenu, MobileCategoryBar } from '@/components/shopping/SidebarCategoryMenu';
import { BreadcrumbNav } from '@/components/common/BreadcrumbNav';
import { ProductCard } from '@/components/common/ProductCard';
import { ShoppingBag, Package, ArrowUpDown } from 'lucide-react';

export default function SubCategoryProductPage() {
  const params = useParams();
  const categorySlug = (params?.categorySlug as string) || '';
  const subcategorySlug = (params?.subcategorySlug as string) || '';

  const [parentCat, setParentCat] = useState<any>(null);
  const [subCat, setSubCat] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    if (!subcategorySlug) return;
    setLoading(true);
    const API = getApiBaseUrl();

    // Fetch parent category, subcategory details & products in parallel
    Promise.all([
      fetch(`${API}/product-categories/slug/${encodeURIComponent(categorySlug)}`).then((r) => r.json()).catch(() => null),
      fetch(`${API}/product-categories/slug/${encodeURIComponent(subcategorySlug)}`).then((r) => r.json()).catch(() => null),
      fetch(`${API}/products?category=${encodeURIComponent(subcategorySlug)}&limit=100`).then((r) => r.json()).catch(() => null),
    ]).then(([parentRes, subRes, prodRes]) => {
      if (parentRes?.success && parentRes.data) {
        setParentCat(parentRes.data);
      }
      if (subRes?.success && subRes.data) {
        setSubCat(subRes.data);
      }
      if (prodRes?.success && Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
      } else if (prodRes?.success && Array.isArray(prodRes.data?.products)) {
        setProducts(prodRes.data.products);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });
  }, [categorySlug, subcategorySlug]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (inStockOnly) list = list.filter((p) => Number(p.stock) > 0);

    if (sortBy === 'price_asc') list.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === 'price_desc') list.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sortBy === 'rating') list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    else list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return list;
  }, [products, sortBy, inStockOnly]);

  const parentName = parentCat?.name || categorySlug.replace(/-/g, ' ').toUpperCase();
  const subName = subCat?.name || subcategorySlug.replace(/-/g, ' ').toUpperCase();
  const subcategories = parentCat?.children || [];

  return (
    <div className="py-6 px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 w-full max-w-[1720px] mx-auto space-y-6 font-sans text-slate-800">
      {/* Breadcrumb Navigation (e.g. Home > Food > Cooking > Spices) */}
      <BreadcrumbNav
        items={[
          { label: 'Shopping Market', href: '/services/shopping' },
          { label: parentName, href: `/category/${categorySlug}` },
          { label: subName },
        ]}
      />

      {/* Top Mobile Subcategories Chips & Menu Drawer Toggle Bar */}
      <MobileCategoryBar
        currentCategorySlug={categorySlug}
        currentSubCategorySlug={subcategorySlug}
        subcategories={subcategories}
        basePath="/category"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden lg:block shrink-0 w-64">
          <SidebarCategoryMenu
            currentCategorySlug={categorySlug}
            currentSubCategorySlug={subcategorySlug}
            basePath="/category"
          />
        </div>

        {/* Main Product Content Area */}
        <main className="flex-1 space-y-6 min-w-0">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-950 text-white space-y-2 shadow-lg border border-purple-500/20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-xs font-bold text-purple-300 border border-purple-400/30">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Subcategory Listing</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight capitalize">
              {subName}
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl">
              {subCat?.description || `Fresh & authentic ${subName} items available in DOHS Sheba.`}
            </p>
          </div>

          {/* Product Listing Header & Filters Bar */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="font-bold text-xs text-slate-700">
                Found <span className="text-purple-700 font-extrabold">{filteredProducts.length}</span> Products in {subName}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Stock Toggle */}
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>In Stock Only</span>
                </label>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold focus:outline-none focus:border-purple-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-3/4 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
                <Package className="w-10 h-10 mx-auto text-slate-400 opacity-60" />
                <h3 className="font-extrabold text-slate-800 text-sm">No products found in {subName}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  New stock items are added regularly by local DOHS sellers. Please check back soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
                {filteredProducts.map((p: any) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    title={p.name || p.title}
                    slug={p.slug || p.id}
                    price={Number(p.price || 0)}
                    originalPrice={p.discount > 0 ? Math.round(Number(p.price) / (1 - Number(p.discount) / 100)) : undefined}
                    unit={p.unit || 'unit'}
                    unitAmount={p.unitAmount ?? p.amount}
                    image={Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (p.image || undefined)}
                    rating={Number(p.rating || 4.5)}
                    categorySlug={subcategorySlug}
                    categoryName={subName}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
