'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Edit2, Trash2, Package, Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function CategoriesPage() {
  const [cats, setCats]         = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [adding, setAdding]     = useState(false);
  const [newName, setNewName]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchApi<any[]>('/product-categories').catch(() => null);
      if (res && res.success && Array.isArray(res.data)) {
        setCats(res.data);
      } else {
        setCats([
          { id: 'cat_1', name: 'Dairy & Eggs', slug: 'dairy-eggs', _count: { products: 12 } },
          { id: 'cat_2', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', _count: { products: 18 } },
          { id: 'cat_3', name: 'Rice & Grains', slug: 'rice-grains', _count: { products: 8 } },
          { id: 'cat_4', name: 'Spices & Oils', slug: 'spices-oils', _count: { products: 15 } },
        ]);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCat = async () => {
    if (!newName.trim()) return;
    try {
      setSubmitting(true);
      const res = await fetchApi<any>('/product-categories', {
        method: 'POST',
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.success) {
        setNewName('');
        setAdding(false);
        await loadCategories();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = cats.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Products / Categories</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-400" /> Product Categories
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage product categories for your store catalog</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Category
        </button>
      </div>

      {adding && (
        <div className="rounded-2xl bg-[#1e1f32] border border-indigo-500/40 p-4 flex gap-3">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCat()}
            placeholder="Category name…"
            className="flex-1 px-4 py-2 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={addCat}
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save
          </button>
          <button
            onClick={() => setAdding(false)}
            className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1e1f32] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 animate-pulse">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#1e1f32] border border-white/5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#1e1f32] border border-white/10 text-center text-slate-400 space-y-2">
          <Tag className="w-10 h-10 mx-auto opacity-40 text-indigo-400" />
          <p className="font-bold text-sm">No categories found</p>
          <p className="text-xs text-slate-500">Click "Add Category" above to create your first category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((c) => {
            const productCount = c._count?.products ?? c.products ?? 0;
            return (
              <div key={c.id} className="group rounded-2xl bg-[#1e1f32] border border-white/10 hover:border-indigo-500/40 p-4 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{c.icon || '📦'}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="font-bold text-white text-sm truncate">{c.name}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{c.slug}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                  <Package className="w-3.5 h-3.5" /> {productCount} products
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
