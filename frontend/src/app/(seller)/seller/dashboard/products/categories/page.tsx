'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Edit2, Trash2, Package, Loader2, FolderTree, AlertTriangle, X } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function CategoriesPage() {
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Add modal state
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [parentId, setParentId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editParentId, setEditParentId] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete confirm state
  const [deletingCat, setDeletingCat] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleEditClick = (cat: any) => {
    setEditingCat(cat);
    setEditName(cat.name || '');
    setEditParentId(cat.parentId || '');
  };

  const updateCat = async () => {
    if (!editingCat || !editName.trim()) return;
    try {
      setEditSubmitting(true);
      const res = await fetchApi<any>(`/product-categories/${editingCat.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editName.trim(),
          parentId: editParentId || null,
        }),
      });
      if (res.success) {
        setEditingCat(null);
        await loadCategories();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update category');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCat) return;
    try {
      setDeleteLoading(true);
      const res = await fetchApi<any>(`/product-categories/${deletingCat.id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        setDeletingCat(null);
        await loadCategories();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  };

  const parentCategories = cats.filter((c) => !c.parentId);
  const filtered = cats.filter((c) => !search || c.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
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
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-3.5 h-3.5" /> Add Category / Subcategory
        </button>
      </div>

      {/* Add Form Card */}
      {adding && (
        <div className="rounded-2xl bg-[#1e1f32] border border-indigo-500/40 p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" /> Add New Category
            </h3>
            <button onClick={() => setAdding(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category / Subcategory name…"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="">Main Category (No Parent)</option>
              {parentCategories.map((p) => (
                <option key={p.id} value={p.id}>Subcategory of: {p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setAdding(false)}
              className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addCat}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Category
            </button>
          </div>
        </div>
      )}

      {/* Edit Form Card */}
      {editingCat && (
        <div className="rounded-2xl bg-[#1e1f32] border border-amber-500/40 p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="font-bold text-amber-300 text-xs flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-amber-400" /> Edit Category: {editingCat.name}
            </h3>
            <button onClick={() => setEditingCat(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Category name…"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
            />
            <select
              value={editParentId}
              onChange={(e) => setEditParentId(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="">Main Category (No Parent)</option>
              {parentCategories
                .filter((p) => p.id !== editingCat.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>Subcategory of: {p.name}</option>
                ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setEditingCat(null)}
              className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={updateCat}
              disabled={editSubmitting}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition-colors flex items-center gap-2 shadow-md"
            >
              {editSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Update Category
            </button>
          </div>
        </div>
      )}

      {/* Search Input */}
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

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 animate-pulse">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-[#1e1f32] border border-white/5" />
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
              <div key={c.id} className="group rounded-2xl bg-[#1e1f32] border border-white/10 hover:border-indigo-500/40 p-4 transition-all space-y-3 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{c.icon || (isSub ? '🏷️' : '📁')}</span>
                    <div className="flex items-center gap-1">
                      {isSub && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 mr-1">
                          <FolderTree className="w-3 h-3" /> Subcategory
                        </span>
                      )}
                      {/* Action Buttons: Edit & Delete */}
                      <button
                        onClick={() => handleEditClick(c)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingCat(c)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="font-bold text-white text-sm truncate">{c.name}</p>
                  {parentCat && (
                    <p className="text-[11px] text-indigo-300 font-semibold mt-0.5">Parent: {parentCat.name}</p>
                  )}
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{c.slug}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-indigo-400" /> {productCount} products
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditClick(c)}
                      className="text-[10px] font-bold text-amber-400 hover:underline"
                    >
                      Edit
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setDeletingCat(c)}
                      className="text-[10px] font-bold text-rose-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deletingCat && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e1f32] border border-rose-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="font-black text-white text-base">Delete Category?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-white">"{deletingCat.name}"</span>? Products linked to this category may lose their category association.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingCat(null)}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
              >
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
