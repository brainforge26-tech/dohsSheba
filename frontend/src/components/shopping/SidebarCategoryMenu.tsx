'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api-client';
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  Ticket,
  Percent,
  Heart,
  Flame,
  Star,
  Layers,
  ShoppingBag,
  Award
} from 'lucide-react';

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  children?: SubCategory[];
  _count?: { products: number; children: number };
}

interface SidebarCategoryMenuProps {
  currentCategorySlug?: string;
  currentSubCategorySlug?: string;
  basePath?: string;
}

export function SidebarCategoryMenu({
  currentCategorySlug,
  currentSubCategorySlug,
  basePath = '/category',
}: SidebarCategoryMenuProps) {
  const pathname = usePathname();
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const API = getApiBaseUrl();
    fetch(`${API}/product-categories`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) {
          // Filter to top-level parent categories (no parentId or matching parent structure)
          const parents = res.data.filter((c: any) => !c.parentId);
          setCategories(parents);

          // Auto-expand current active parent category
          if (currentCategorySlug) {
            const activeParent = parents.find(
              (p: any) => p.slug.toLowerCase() === currentCategorySlug.toLowerCase()
            );
            if (activeParent) {
              setExpandedCats((prev) => ({ ...prev, [activeParent.id]: true }));
            }
          }
        }
      })
      .catch(() => {});
  }, [currentCategorySlug]);

  const toggleExpand = (catId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCats((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  return (
    <aside className="w-full lg:w-64 bg-white border border-slate-200/80 rounded-2xl p-4 space-y-5 shadow-xs shrink-0 font-sans">
      {/* ── Top Rewards Banner (Matches Chaldal Loyalty Card) ── */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 border border-amber-200/80 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500 text-white shadow-xs">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-black text-amber-950 text-xs">Sheba Rewards</h4>
            <p className="text-[10px] text-amber-700 font-bold">0 Points</p>
          </div>
        </div>
        <span className="px-2 py-1 rounded-md bg-amber-600 text-white font-extrabold text-[9px] uppercase tracking-wider">
          Perks
        </span>
      </div>

      {/* ── Quick Nav Items (Matches Chaldal Left Menu) ── */}
      <div className="space-y-1 pb-3 border-b border-slate-100 text-xs font-bold">
        <Link
          href="/services/shopping/coupons"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-purple-700 transition-colors"
        >
          <Percent className="w-4 h-4 text-emerald-600" />
          <span>Coupons & Offers</span>
        </Link>
        <Link
          href="/dashboard/wishlist"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-purple-700 transition-colors"
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Favourites</span>
        </Link>
        <Link
          href="/services/shopping?sort=popular"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-purple-700 transition-colors"
        >
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Popular Items</span>
        </Link>
        <Link
          href="/services/shopping?flashSale=true"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-purple-700 transition-colors"
        >
          <Flame className="w-4 h-4 text-orange-500" />
          <span>Flash Sales</span>
        </Link>
      </div>

      {/* ── Categories Tree Header ── */}
      <div className="space-y-2">
        <div className="px-3 text-[11px] font-black uppercase tracking-wider text-slate-400">
          Categories
        </div>

        <nav className="space-y-1">
          {categories.map((parent) => {
            const isParentActive =
              currentCategorySlug?.toLowerCase() === parent.slug.toLowerCase();
            const isExpanded = !!expandedCats[parent.id];
            const hasChildren = parent.children && parent.children.length > 0;

            return (
              <div key={parent.id} className="space-y-1">
                {/* Parent Row */}
                <div
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isParentActive && !currentSubCategorySlug
                      ? 'bg-purple-50 text-purple-700 font-extrabold shadow-2xs border-l-4 border-purple-600'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-purple-600'
                  }`}
                >
                  <Link
                    href={`${basePath}/${parent.slug}`}
                    className="flex-1 truncate flex items-center gap-2"
                  >
                    <Layers className={`w-3.5 h-3.5 ${isParentActive ? 'text-purple-600' : 'text-slate-400 group-hover:text-purple-600'}`} />
                    <span className="truncate">{parent.name}</span>
                  </Link>

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(parent.id, e)}
                      className="p-1 rounded hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-purple-600" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Subcategories List (Indented under parent) */}
                {hasChildren && isExpanded && (
                  <div className="pl-6 space-y-1 border-l-2 border-slate-100 ml-3">
                    {parent.children!.map((sub) => {
                      const isSubActive =
                        currentSubCategorySlug?.toLowerCase() === sub.slug.toLowerCase();
                      return (
                        <Link
                          key={sub.id}
                          href={`${basePath}/${parent.slug}/${sub.slug}`}
                          className={`block px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isSubActive
                              ? 'bg-purple-100/70 text-purple-800 font-extrabold shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-purple-700'
                          }`}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
