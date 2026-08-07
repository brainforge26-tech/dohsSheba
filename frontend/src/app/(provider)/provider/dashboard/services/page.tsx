'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { Wrench, Plus, Check, Edit, Trash2, Power, Star, Loader2, X, Upload, Image as ImageIcon, Sparkles, Layers, Tag } from 'lucide-react';

export default function ProviderServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Service Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  
  // Service Addons State
  const [formAddons, setFormAddons] = useState<any[]>([]);
  const [newAddonTitle, setNewAddonTitle] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState('');
  const [newAddonDesc, setNewAddonDesc] = useState('');

  // Category Modal State
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('Wrench');
  const [catImage, setCatImage] = useState('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80');
  const [savingCat, setSavingCat] = useState(false);

  const CATEGORY_IMAGE_PRESETS = [
    { label: 'AC Service', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80' },
    { label: 'Electrician', url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&q=80' },
    { label: 'Plumbing', url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&q=80' },
    { label: 'Deep Cleaning', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80' },
    { label: 'Pest Control', url: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=500&q=80' },
    { label: 'Appliance Repair', url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=500&q=80' },
    { label: 'Carpenter', url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=500&q=80' },
    { label: 'Painting', url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&q=80' },
    { label: 'CCTV Security', url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=500&q=80' },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        fetchApi<any>('/services?limit=100').catch(() => null),
        fetchApi<any>('/service-categories').catch(() => null),
      ]);

      if (sRes?.success && Array.isArray(sRes.data?.services)) {
        setServices(sRes.data.services);
      } else if (sRes?.success && Array.isArray(sRes.data)) {
        setServices(sRes.data);
      }

      if (cRes?.success && Array.isArray(cRes.data)) {
        setCategories(cRes.data);
        if (cRes.data.length > 0) setFormCategory(cRes.data[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingService(null);
    setFormTitle('');
    setFormPrice('');
    setFormDescription('');
    setFormAddons([]);
    setNewAddonTitle('');
    setNewAddonPrice('');
    setNewAddonDesc('');
    if (categories.length > 0) setFormCategory(categories[0].id);
    setShowModal(true);
  };

  const handleOpenEditModal = (service: any) => {
    setEditingService(service);
    setFormTitle(service.title || '');
    setFormPrice(String(service.price || ''));
    setFormDescription(service.description || '');
    setFormCategory(service.categoryId || (categories[0]?.id || ''));
    setFormAddons(Array.isArray(service.addons) ? service.addons : []);
    setNewAddonTitle('');
    setNewAddonPrice('');
    setNewAddonDesc('');
    setShowModal(true);
  };

  const handleAddAddonItem = () => {
    if (!newAddonTitle || !newAddonPrice) return;
    const addon = {
      id: `add_${Date.now()}`,
      title: newAddonTitle,
      price: Number(newAddonPrice),
      description: newAddonDesc || '',
    };
    setFormAddons((prev) => [...prev, addon]);
    setNewAddonTitle('');
    setNewAddonPrice('');
    setNewAddonDesc('');
  };

  const handleRemoveAddonItem = (index: number) => {
    setFormAddons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenCreateCatModal = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
    setCatIcon('Wrench');
    setCatImage('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80');
    setShowCatModal(true);
  };

  const handleOpenEditCatModal = (cat: any) => {
    setEditingCategory(cat);
    setCatName(cat.name || '');
    setCatDesc(cat.description || '');
    setCatIcon(cat.icon || 'Wrench');
    setCatImage(cat.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80');
    setShowCatModal(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCatImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    setSavingCat(true);
    try {
      if (editingCategory) {
        await fetchApi<any>(`/service-categories/${editingCategory.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            name: catName,
            description: catDesc,
            icon: catIcon,
            image: catImage,
          }),
        }).catch(() => null);
      } else {
        await fetchApi<any>('/service-categories', {
          method: 'POST',
          body: JSON.stringify({
            name: catName,
            description: catDesc,
            icon: catIcon,
            image: catImage,
          }),
        }).catch(() => null);
      }

      setShowCatModal(false);
      setEditingCategory(null);
      setCatName('');
      setCatDesc('');
      loadData();
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    setActionLoading(catId);
    try {
      await fetchApi(`/service-categories/${catId}`, { method: 'DELETE' }).catch(() => null);
      setCategories((prev) => prev.filter((c) => c.id !== catId));
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formPrice) return;

    setActionLoading('saving');
    try {
      const payload = {
        title: formTitle,
        price: Number(formPrice),
        description: formDescription,
        categoryId: formCategory,
        addons: formAddons,
      };

      if (editingService) {
        await fetchApi<any>(`/services/${editingService.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }).catch(() => null);
      } else {
        await fetchApi<any>('/services', {
          method: 'POST',
          body: JSON.stringify(payload),
        }).catch(() => null);
      }
      setShowModal(false);
      loadData();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    setActionLoading(id);
    try {
      await fetchApi(`/services/${id}`, { method: 'DELETE' }).catch(() => null);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  const toggleServiceStatus = async (service: any) => {
    setActionLoading(service.id);
    try {
      const nextState = service.isActive === false ? true : false;
      await fetchApi(`/services/${service.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: nextState }),
      }).catch(() => null);
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, isActive: nextState } : s))
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-black text-slate-900 text-xl flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" /> DOHS Sheba Service Catalog & Addons Manager
          </h1>
          <p className="text-xs text-slate-500">Create, edit & manage services, service categories, and recommended service addons</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreateCatModal}
            className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Category
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Service
          </button>
        </div>
      </div>

      {/* Categories Bar with Edit & Delete Actions */}
      {categories.length > 0 && (
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Active Service Categories ({categories.length})
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2.5 p-2.5 pl-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs hover:border-emerald-300 transition-all group"
              >
                {c.image ? (
                  <img src={c.image} alt={c.name} className="w-7 h-7 rounded-xl object-cover border border-slate-200 shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                )}

                <span>{c.name}</span>

                <div className="flex items-center gap-1 border-l border-slate-200 pl-2 ml-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditCatModal(c)}
                    className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit Category"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(c.id, c.name)}
                    disabled={actionLoading === c.id}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 rounded-3xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-200 rounded-3xl bg-white space-y-2">
          <Wrench className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="font-extrabold text-lg text-slate-800">No Services Listed Yet</p>
          <p className="text-xs text-slate-500">Click "Add New Service" to list a new home maintenance service.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => {
            const categoryName = typeof srv.category === 'object' ? srv.category?.name : (srv.category || 'General Service');
            const isActive = srv.isActive !== false;
            const addonCount = Array.isArray(srv.addons) ? srv.addons.length : 0;

            return (
              <div key={srv.id} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-extrabold uppercase tracking-wider block w-fit">
                        {categoryName}
                      </span>

                      {addonCount > 0 && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-extrabold flex items-center gap-1">
                          <Layers className="w-3 h-3 text-emerald-600" /> {addonCount} Addons
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(srv)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                        title="Edit Service & Addons"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteService(srv.id)}
                        disabled={actionLoading === srv.id}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleServiceStatus(srv)}
                        disabled={actionLoading === srv.id}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}
                        title={isActive ? 'Deactivate Service' : 'Activate Service'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{srv.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{srv.description}</p>
                </div>

                {/* Addons summary preview */}
                {addonCount > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                    <span className="font-bold text-slate-500 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-blue-600" /> Recommended Addons:
                    </span>
                    <div className="space-y-0.5">
                      {srv.addons.slice(0, 2).map((a: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-slate-700 font-medium">
                          <span className="truncate max-w-[140px]">{a.title}</span>
                          <span className="font-bold text-emerald-600">+৳{a.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Starting Price</span>
                    <span className="text-2xl font-black text-slate-900">৳{formatCurrency(srv.price)}</span>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {srv.rating || 5.0}
                    </span>
                    <span className="text-slate-400 text-[10px]">Verified Service</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveCategory} className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h2 className="font-black text-slate-900 text-base">
                  {editingCategory ? 'Edit Service Category' : 'Create Service Category with Picture'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g., Solar Panel Servicing, CCTV Security"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">Description</label>
                <input
                  type="text"
                  placeholder="e.g., Professional installation & diagnostics"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Picture Uploader */}
              <div className="space-y-2">
                <label className="block text-slate-600 font-bold">Category Picture Uploader</label>

                <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                    {catImage ? (
                      <img src={catImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-400 absolute inset-0 m-auto" />
                    )}
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-slate-700 font-bold block">Picture Live Preview</span>
                    <p className="text-[11px] text-slate-400 font-medium">This photo will display on home page categories carousel.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Upload Image File from Device</span>
                    <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                  </label>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Or paste image URL (https://...)"
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-white border border-slate-300 font-normal text-[11px]"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Or Select High-Res Cover Preset:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {CATEGORY_IMAGE_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => setCatImage(preset.url)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                          catImage === preset.url
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingCat}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                {savingCat && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{editingCategory ? 'Update Category' : 'Save Category'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD / EDIT SERVICE MODAL WITH ADDONS MANAGER */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto max-h-screen">
          <form onSubmit={handleSaveService} className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-black text-slate-900 text-base">
                {editingService ? 'Edit Home Service & Addons' : 'Add New Home Service & Addons'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">Service Title</label>
                <input
                  type="text"
                  placeholder="e.g., AC Master Servicing & Jet Washing"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Starting Price (৳)</label>
                  <input
                    type="number"
                    placeholder="e.g., 1200"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">Service Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe features and scope of work..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* SERVICE ADDONS SECTION */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-slate-900 text-xs">
                      Recommended Service Addons ({formAddons.length})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Optional extra services at checkout</span>
                </div>

                {/* Existing Addons List */}
                {formAddons.length > 0 && (
                  <div className="space-y-2">
                    {formAddons.map((addon, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 text-xs block">{addon.title}</span>
                          {addon.description && <p className="text-[10px] text-slate-500">{addon.description}</p>}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-black text-xs text-emerald-600">+৳{addon.price}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAddonItem(idx)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Remove Addon"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Addon Inline Creator */}
                <div className="p-3 rounded-xl bg-white border border-dashed border-slate-300 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Add New Service Addon Item:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Addon Title (e.g. Gas Top-Up)"
                      value={newAddonTitle}
                      onChange={(e) => setNewAddonTitle(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-slate-300 bg-slate-50 text-xs font-medium"
                    />
                    <input
                      type="number"
                      placeholder="Price ৳ (e.g. 800)"
                      value={newAddonPrice}
                      onChange={(e) => setNewAddonPrice(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-slate-300 bg-slate-50 text-xs font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Desc (e.g. Up to 50% refill)"
                      value={newAddonDesc}
                      onChange={(e) => setNewAddonDesc(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-slate-300 bg-slate-50 text-xs font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAddonItem}
                    disabled={!newAddonTitle || !newAddonPrice}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Addon to Service
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading === 'saving'}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                {actionLoading === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{editingService ? 'Update Service & Addons' : 'Save Service & Addons'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
