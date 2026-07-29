'use client';

import React, { useState, useEffect } from 'react';
import { Award, Plus, Search, Edit2, Trash2, Package, Globe, Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

interface BrandItem {
  id: string;
  name: string;
  origin: string;
  products: number;
  logo: string;
}

const STORAGE_KEY = 'dohssheba_seller_brands';

export default function BrandsPage() {
  const [brands, setBrands]         = useState<BrandItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [adding, setAdding]         = useState(false);
  const [newName, setNewName]       = useState('');
  const [newOrigin, setNewOrigin]   = useState('Bangladesh');

  useEffect(() => {
    const loadBrands = async () => {
      setLoading(true);
      try {
        // Try fetching seller's products to count products per brand
        const res = await fetchApi<any>('/products/seller/my-products');
        const productList = res.success && Array.isArray(res.data) ? res.data : [];

        // Check local storage for custom created brands
        const saved = localStorage.getItem(STORAGE_KEY);
        let customBrands: BrandItem[] = saved ? JSON.parse(saved) : [];

        if (!customBrands.length) {
          customBrands = [
            { id: 'b1', name: 'Pran',        origin: 'Bangladesh', products: 0, logo: '🇧🇩' },
            { id: 'b2', name: 'BD Food',     origin: 'Bangladesh', products: 0, logo: '🏭' },
            { id: 'b3', name: 'Igloo',       origin: 'Bangladesh', products: 0, logo: '❄️' },
            { id: 'b4', name: 'Banoful',     origin: 'Bangladesh', products: 0, logo: '🎂' },
            { id: 'b5', name: 'ACI Foods',   origin: 'Bangladesh', products: 0, logo: '🍽️' },
            { id: 'b6', name: 'Fresh (BD)',   origin: 'Bangladesh', products: 0, logo: '🌿' },
          ];
        }

        // Count live product occurrences per brand
        const brandCounts: Record<string, number> = {};
        productList.forEach((p: any) => {
          if (p.brand) {
            const bName = String(p.brand).trim();
            brandCounts[bName] = (brandCounts[bName] || 0) + 1;
          }
        });

        const merged = customBrands.map((b) => ({
          ...b,
          products: brandCounts[b.name] ?? b.products ?? 0,
        }));

        setBrands(merged);
      } catch (_) {
        const saved = localStorage.getItem(STORAGE_KEY);
        setBrands(saved ? JSON.parse(saved) : []);
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  const saveBrandsToStorage = (newList: BrandItem[]) => {
    setBrands(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  const addBrand = () => {
    if (!newName.trim()) return;
    const newBrand: BrandItem = {
      id: `b_${Date.now()}`,
      name: newName.trim(),
      origin: newOrigin.trim() || 'Bangladesh',
      products: 0,
      logo: '🏷️',
    };
    const updated = [newBrand, ...brands];
    saveBrandsToStorage(updated);
    setNewName('');
    setAdding(false);
  };

  const deleteBrand = (id: string) => {
    const updated = brands.filter((b) => b.id !== id);
    saveBrandsToStorage(updated);
  };

  const filtered = brands.filter((b) =>
    !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.origin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Products / Brands</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" /> Brands
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage the brands associated with your products</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Brand
        </button>
      </div>

      {adding && (
        <div className="rounded-2xl bg-[#1e1f32] border border-indigo-500/40 p-4 space-y-3">
          <div className="flex gap-3 flex-wrap">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Brand name…"
              className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
            <input
              value={newOrigin}
              onChange={(e) => setNewOrigin(e.target.value)}
              placeholder="Country of origin (e.g. Bangladesh)…"
              className="w-64 px-4 py-2 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setAdding(false)}
              className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addBrand}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              Save Brand
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brands by name or origin…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1e1f32] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 space-y-2 animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
          <p className="text-xs font-semibold">Loading product brands…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#1e1f32] border border-white/10 text-center text-slate-400 space-y-2">
          <Award className="w-10 h-10 mx-auto opacity-40 text-indigo-400" />
          <p className="font-bold text-sm">No brands found</p>
          <p className="text-xs text-slate-500">Click "Add Brand" above to create a brand.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-widest border-b border-white/10">
                <th className="px-4 py-3 text-left">Brand</th>
                <th className="px-4 py-3 text-left">Origin</th>
                <th className="px-4 py-3 text-right">Products</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{b.logo}</span>
                      <p className="font-semibold text-white">{b.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Globe className="w-3 h-3" /> {b.origin}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="flex items-center justify-end gap-1 text-xs text-slate-300">
                      <Package className="w-3 h-3" /> {b.products}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => deleteBrand(b.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete brand"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
