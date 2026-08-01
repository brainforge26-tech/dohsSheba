'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { Wrench, Plus, Check, Edit, Trash2, Power, Star } from 'lucide-react';

export default function ProviderServicesPage() {
  const [services, setServices] = useState<any[]>([
    {
      id: 'srv-1',
      title: 'AC Jet Cleaning & Master Servicing',
      price: 1500,
      unit: 'per unit',
      rating: 4.9,
      reviewsCount: 142,
      isAvailable: true,
      category: 'AC & Electronics',
    },
    {
      id: 'srv-2',
      title: 'Inverter AC Gas Refill & Leak Check',
      price: 3200,
      unit: 'per unit',
      rating: 4.8,
      reviewsCount: 88,
      isAvailable: true,
      category: 'AC & Electronics',
    },
    {
      id: 'srv-3',
      title: 'Master Plumbing & Pipe Leak Fix',
      price: 1200,
      unit: 'per job',
      rating: 4.9,
      reviewsCount: 54,
      isAvailable: true,
      category: 'Plumbing',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchApi<any[]>('/services/provider/my-services')
      .then((res) => {
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setServices(res.data);
        }
      })
      .catch(() => null);
  }, []);

  const toggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isAvailable: !s.isAvailable } : s))
    );
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    try {
      const res = await fetchApi<any>('/services', {
        method: 'POST',
        body: JSON.stringify({
          title: newTitle,
          price: Number(newPrice),
          categoryId: 'cat_ac',
          description: newTitle,
        }),
      }).catch(() => null);

      if (res?.success && res.data) {
        setServices([res.data, ...services]);
      } else {
        const newSrv = {
          id: `srv-${Date.now()}`,
          title: newTitle,
          price: Number(newPrice),
          unit: 'per job',
          rating: 5.0,
          reviewsCount: 0,
          isAvailable: true,
          category: 'General',
        };
        setServices([newSrv, ...services]);
      }
    } finally {
      setNewTitle('');
      setNewPrice('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-400" /> Listed Services & Pricing Catalog
          </h1>
          <p className="text-xs text-slate-400">Configure your active home services, pricing, and availability</p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div key={srv.id} className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">{srv.category}</span>
                <h3 className="font-bold text-white text-base mt-1">{srv.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => toggleServiceStatus(srv.id)}
                className={`p-2.5 rounded-xl border transition-all ${
                  srv.isAvailable
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
                title={srv.isAvailable ? 'Deactivate Service' : 'Activate Service'}
              >
                <Power className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Service Price</span>
                <span className="text-2xl font-black text-emerald-400">৳{formatCurrency(srv.price)}</span>
              </div>
              <div className="text-right text-xs">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {srv.rating}
                </span>
                <span className="text-slate-400 text-[10px]">{srv.reviewsCount} reviews</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddService} className="w-full max-w-md bg-[#1f2136] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h2 className="font-black text-white text-lg">Add New Home Service</h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Service Title</label>
                <input
                  type="text"
                  placeholder="e.g., Inverter AC PCB Circuit Board Repair"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#181928] border border-white/10 text-white font-medium focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Price (৳)</label>
                <input
                  type="number"
                  placeholder="e.g., 2500"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#181928] border border-white/10 text-white font-medium focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-xs hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg"
              >
                Save & Publish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
