'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Edit2, Trash2, Package, Loader2, FolderTree, AlertTriangle, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

const SUGGESTED_IMAGES = [
  { label: 'Vegetables & Fruits', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80' },
  { label: 'Meat & Poultry',      url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&auto=format&fit=crop&q=80' },
  { label: 'Seafood & Fish',     url: 'https://images.unsplash.com/photo-1534942519507-769d4679447d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Milk & Dairy',       url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80' },
  { label: 'Bakery & Snacks',    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80' },
  { label: 'Beverages & Juices', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80' },
  { label: 'Rice & Spices',      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80' },
  { label: 'Household',          url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=80' },
];

export default function CategoriesPage() {
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Add modal state
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [parentId, setParentId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editDesc, setEditDesc] = useState('');
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
          image: newImage.trim() || undefined,
          description: newDesc.trim() || undefined,
          parentId: parentId || undefined,
        }),
      });
      if (res.success) {
        setNewName('');
        setNewImage('');
        setNewDesc('');
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
    setEditImage(cat.image || '');
    setEditDesc(cat.description || '');
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
          image: editImage.trim() || null,
          description: editDesc.trim() || null,
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
    <div className="space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Products / Categories</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-400" /> Categories & Subcategories
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage category images, banners and hierarchies for your store catalog</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Category with Picture
        </button>
      </div>

      {/* Add Form Card */}
      {adding && (
        <div className="rounded-2xl bg-[#1e1f32] border border-indigo-500/40 p-5 space-y-4 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" /> Create New Category (Homepage Showcase)
            </h3>
            <button onClick={() => setAdding(false)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Category Name *</label>
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Fresh Meat & Poultry, Beverages..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Category Image URL *</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or paste image link"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Parent Category</label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Main Category (No Parent)</option>
                  {parentCategories.map((p) => (
                    <option key={p.id} value={p.id}>Subcategory of: {p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Description (Optional)</label>
                <input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Short tagline or summary..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Right Image Preview & Presets */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">Image Preview</label>
              <div className="h-32 rounded-2xl bg-[#12131f] border border-dashed border-white/15 overflow-hidden flex items-center justify-center relative group">
                {newImage ? (
                  <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                    <p className="text-xs text-slate-500 font-medium">Paste image URL above or pick a sample picture below</p>
                  </div>
                )}
              </div>

              {/* Sample Picture Presets */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Quick Preset Pictures:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setNewImage(img.url)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-white/10 text-[10px] font-semibold transition-all"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => setAdding(false)}
              className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addCat}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Category
            </button>
          </div>
        </div>
      )}

      {/* Edit Form Card */}
      {editingCat && (
        <div className="rounded-2xl bg-[#1e1f32] border border-amber-500/40 p-5 space-y-4 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-amber-400" /> Edit Category: {editingCat.name}
            </h3>
            <button onClick={() => setEditingCat(null)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Category Name *</label>
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Category name…"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Category Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or paste image link"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Parent Category</label>
                <select
                  value={editParentId}
                  onChange={(e) => setEditParentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="">Main Category (No Parent)</option>
                  {parentCategories
                    .filter((p) => p.id !== editingCat.id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>Subcategory of: {p.name}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Description</label>
                <input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Short tagline or summary..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Right Image Preview & Presets */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">Image Preview</label>
              <div className="h-32 rounded-2xl bg-[#12131f] border border-dashed border-white/15 overflow-hidden flex items-center justify-center relative">
                {editImage ? (
                  <img src={editImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                    <p className="text-xs text-slate-500 font-medium">No picture set for this category</p>
                  </div>
                )}
              </div>

              {/* Sample Picture Presets */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Quick Preset Pictures:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setEditImage(img.url)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-600/30 text-slate-300 hover:text-amber-200 border border-white/10 text-[10px] font-semibold transition-all"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => setEditingCat(null)}
              className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={updateCat}
              disabled={editSubmitting}
              className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition-all flex items-center gap-2 shadow-lg shadow-amber-600/20"
            >
              {editSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Update Category
            </button>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories & subcategories…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1e1f32] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Homepage-Style Category Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-[#1e1f32] border border-white/5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#1e1f32] border border-white/10 text-center text-slate-400 space-y-2">
          <Tag className="w-10 h-10 mx-auto opacity-40 text-indigo-400" />
          <p className="font-bold text-sm">No categories found</p>
          <p className="text-xs text-slate-500">Click "Add Category with Picture" above to create your first visual category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((c) => {
            const productCount = c._count?.products ?? c.products ?? 0;
            const isSub = !!c.parentId;
            const parentCat = isSub ? cats.find((p) => p.id === c.parentId) : null;
            const catImg = c.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80';

            return (
              <div
                key={c.id}
                className="group rounded-2xl bg-[#1e1f32] border border-white/10 hover:border-indigo-500/40 overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-indigo-500/10"
              >
                {/* Image Banner Header */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                  <img
                    src={catImg}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e1f32] via-[#1e1f32]/40 to-transparent" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    {isSub ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/80 text-white backdrop-blur-md border border-purple-400/40 flex items-center gap-1 shadow">
                        <FolderTree className="w-3 h-3" /> Subcategory
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/80 text-white backdrop-blur-md border border-emerald-400/40 shadow">
                        Main Category
                      </span>
                    )}

                    {/* Quick Edit/Delete icons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(c)}
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-amber-500 text-white transition-colors backdrop-blur-md"
                        title="Edit Picture & Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingCat(c)}
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-500 text-white transition-colors backdrop-blur-md"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 pt-1 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-white text-base leading-tight group-hover:text-indigo-300 transition-colors">
                      {c.name}
                    </h3>
                    {parentCat && (
                      <p className="text-[11px] text-indigo-300 font-semibold mt-0.5">Parent: {parentCat.name}</p>
                    )}
                    {c.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.description}</p>
                    )}
                    <p className="text-[10px] text-slate-500 font-mono mt-1">slug: /{c.slug}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Package className="w-3.5 h-3.5 text-indigo-400" /> {productCount} products
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(c)}
                        className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => setDeletingCat(c)}
                        className="text-[11px] font-bold text-rose-400 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
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
                Are you sure you want to delete <span className="font-bold text-white">"{deletingCat.name}"</span>? Linked products will be safely reassigned to a general category.
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
