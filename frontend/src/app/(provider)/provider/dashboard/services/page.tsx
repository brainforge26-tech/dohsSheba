'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { Wrench, Plus, Check, Edit, Trash2, Power, Star, Loader2, X } from 'lucide-react';

export default function ProviderServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        fetchApi<any>('/services').catch(() => null),
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
    if (categories.length > 0) setFormCategory(categories[0].id);
    setShowModal(true);
  };

  const handleOpenEditModal = (service: any) => {
    setEditingService(service);
    setFormTitle(service.title || '');
    setFormPrice(String(service.price || ''));
    setFormDescription(service.description || '');
    setFormCategory(service.categoryId || (categories[0]?.id || ''));
    setShowModal(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formPrice) return;

    setActionLoading('saving');
    try {
      if (editingService) {
        // Edit existing service
        const res = await fetchApi<any>(`/services/${editingService.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: formTitle,
            price: Number(formPrice),
            description: formDescription,
            categoryId: formCategory,
          }),
        }).catch(() => null);

        if (res?.success) {
          loadData();
        }
      } else {
        // Create new service
        const res = await fetchApi<any>('/services', {
          method: 'POST',
          body: JSON.stringify({
            title: formTitle,
            price: Number(formPrice),
            description: formDescription,
            categoryId: formCategory || 'cat_ac',
          }),
        }).catch(() => null);

        if (res?.success) {
          loadData();
        }
      }
      setShowModal(false);
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
            <Wrench className="w-6 h-6 text-blue-600" /> DOHS Sheba Company Managed Services Catalog
          </h1>
          <p className="text-xs text-slate-500">Create, update, and manage active home services & pricing catalog</p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

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

            return (
              <div key={srv.id} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-extrabold uppercase tracking-wider block w-fit">
                      {categoryName}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(srv)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                        title="Edit Service"
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

      {/* Add / Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveService} className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-black text-slate-900 text-base">
                {editingService ? 'Edit Home Service' : 'Add New Home Service'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
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
                  placeholder="e.g., 1500"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">Service Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe features and scope of work..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                <span>{editingService ? 'Update Service' : 'Save & Publish'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
