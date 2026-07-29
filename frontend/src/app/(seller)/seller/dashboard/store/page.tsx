'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import {
  Store, Save, Image as ImageIcon, PhoneCall, Mail, MapPin,
  Clock, CheckCircle2, Loader2, Info, Star, ShieldCheck,
} from 'lucide-react';

export default function StoreProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    shopName: 'Fresh Bazaar',
    description: 'DOHS premier grocery marketplace seller supplying fresh organic milk, seasonal fruits, fish, meat and pantry staples.',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
    banner: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1200',
    phone: '01711-000001',
    email: 'seller@example.com',
    address: 'Shop 14, Commercial Complex, DOHS Mirpur, Dhaka-1216',
    openingHours: '8:00 AM - 10:00 PM (Daily)',
  });

  useEffect(() => {
    setLoading(true);
    fetchApi<any>('/seller/store-profile')
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          setForm((prev) => ({
            ...prev,
            shopName: d.shopName || prev.shopName,
            description: d.description || prev.description,
            logo: d.logo || prev.logo,
            phone: d.user?.phone || prev.phone,
            email: d.user?.email || prev.email,
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    try {
      const res = await fetchApi<any>('/seller/store-profile', {
        method: 'PUT',
        body: JSON.stringify({
          shopName: form.shopName,
          description: form.description,
          logo: form.logo,
        }),
      });
      if (res.success) {
        setSuccess('Store profile updated successfully!');
      }
    } catch (err: any) {
      setSuccess(err.message || 'Failed to update store profile');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(''), 4000);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Dashboard / Store</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-400" /> Store Profile & Branding
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage public store information, logo, banner, and contact details</p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Banner Preview & Upload */}
        <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <h2 className="font-bold text-white text-sm">Store Banner & Logo</h2>
          
          <div className="relative h-44 rounded-2xl overflow-hidden bg-[#181928] border border-white/10">
            <img src={form.banner} alt="Store Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <div className="flex items-center gap-3">
                <img src={form.logo} alt="Logo" className="w-14 h-14 rounded-2xl border-2 border-indigo-500 object-cover shadow-xl" />
                <div>
                  <h3 className="font-black text-white text-lg flex items-center gap-1.5">{form.shopName} <ShieldCheck className="w-4 h-4 text-emerald-400" /></h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.8 Rating · Verified DOHS Seller</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Logo Image URL</label>
              <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Banner Image URL</label>
              <input value={form.banner} onChange={(e) => setForm({ ...form, banner: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>

        {/* General Info */}
        <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4 text-xs">
          <h2 className="font-bold text-white text-sm">General Information</h2>

          <div>
            <label className="block font-bold text-slate-400 uppercase mb-1">Shop Name *</label>
            <input value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} required className="w-full px-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-sm font-bold focus:outline-none focus:border-indigo-500" />
          </div>

          <div>
            <label className="block font-bold text-slate-400 uppercase mb-1">Store Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Store Phone *</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="w-full px-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Store Email *</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Physical Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Opening Hours</label>
              <input value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-lg">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save Store Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
