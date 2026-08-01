'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Edit2, Package, Loader2, FolderTree } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function CategoriesPage() {
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [parentId, setParentId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchApi<any[]>('/product-categories').catch(() => null);
      if (res && res.success && Array.isArray(res.data)) {
        setCats(res.data);
      } else {
        setCats([]);
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
        body: JSON.stringify({
          name: newName.trim(),
          parentId: parentId || undefined,
        }),
      });
      if (res.success) {
        setNewName('');
        setParentId('');
        setAdding(false);
        await loadCategories();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const parentCategories = cats.filter((c) => !c.parentId);

  const filtered = cats.filter((c) => !search || c.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Products / Categories</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-400" /> Categories & Subcategories
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage product category hierarchies for your store catalog</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Category / Subcategory
        </button>
      </div>

      {adding && (
        <div className="rounded-2xl bg-[#1e1f32] border border-indigo-500/40 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category / Subcategory name…"
              className="flex-1 px-4 py-2 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="">Main Category (No Parent)</option>
              {parentCategories.map((p) => (
                <option key={p.id} value={p.id}>Subcategory of: {p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setAdding(false)}
              className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addCat}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Category
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
          placeholder="Search categories & subcategories…"
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
          <p className="text-xs text-slate-500">Click "Add Category / Subcategory" above to create your first category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((c) => {
            const productCount = c._count?.products ?? c.products ?? 0;
            const isSub = !!c.parentId;
            const parentCat = isSub ? cats.find((p) => p.id === c.parentId) : null;
            return (
              <div key={c.id} className="group rounded-2xl bg-[#1e1f32] border border-white/10 hover:border-indigo-500/40 p-4 transition-all space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{c.icon || (isSub ? '🏷️' : '📁')}</span>
                    {isSub && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                        <FolderTree className="w-3 h-3" /> Subcategory
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-white text-sm truncate">{c.name}</p>
                  {parentCat && (
                    <p className="text-[11px] text-indigo-300 font-semibold mt-0.5">Parent: {parentCat.name}</p>
                  )}
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{c.slug}</p>
                </div>

                <div className="flex items-center gap-1 pt-2 border-t border-white/5 text-xs text-slate-400">
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
