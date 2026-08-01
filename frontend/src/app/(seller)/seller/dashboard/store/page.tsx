'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi, uploadMultipleImagesApi } from '@/lib/api-client';
import {
  Store, Save, Image as ImageIcon, PhoneCall, Mail, MapPin,
  Clock, CheckCircle2, Loader2, Info, Star, ShieldCheck, Upload, AlertCircle
} from 'lucide-react';

export default function StoreProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
            banner: d.banner || prev.banner,
            address: d.address || prev.address,
            openingHours: d.openingHours || prev.openingHours,
            phone: d.user?.phone || prev.phone,
            email: d.user?.email || prev.email,
          }));
        }
      })
      .catch((err) => console.error('Error fetching store profile:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingLogo(true);
    try {
      const urls = await uploadMultipleImagesApi(files);
      if (urls.length > 0) setForm((prev) => ({ ...prev, logo: urls[0] }));
    } catch (err: any) {
      alert(err?.message || 'Failed to upload logo');
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingBanner(true);
    try {
      const urls = await uploadMultipleImagesApi(files);
      if (urls.length > 0) setForm((prev) => ({ ...prev, banner: urls[0] }));
    } catch (err: any) {
      alert(err?.message || 'Failed to upload banner');
    } finally {
      setUploadingBanner(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      const res = await fetchApi<any>('/seller/store-profile', {
        method: 'PUT',
        body: JSON.stringify({
          shopName: form.shopName,
          description: form.description,
          logo: form.logo,
          banner: form.banner,
          address: form.address,
          openingHours: form.openingHours,
          phone: form.phone,
          email: form.email,
        }),
      });
      if (res && res.success) {
        setSuccess('Store profile updated successfully!');
      } else {
        throw new Error(res?.message || 'Failed to update store profile');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update store profile');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(''), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

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
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Banner Preview & Upload */}
        <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <h2 className="font-bold text-white text-sm">Store Banner & Logo Branding</h2>
          
          <div className="relative h-48 rounded-2xl overflow-hidden bg-[#181928] border border-white/10">
            <img src={form.banner} alt="Store Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
              <div className="flex items-center gap-3">
                <img src={form.logo} alt="Logo" className="w-16 h-16 rounded-2xl border-2 border-indigo-500 object-cover shadow-xl bg-[#181928]" />
                <div>
                  <h3 className="font-black text-white text-lg flex items-center gap-1.5">{form.shopName || 'Store Name'} <ShieldCheck className="w-4 h-4 text-emerald-400" /></h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.9 Rating · Verified DOHS Seller</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <label className="block font-bold text-slate-400 uppercase">Logo Image (URL or Upload)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={form.logo}
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
                <label className="px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all">
                  {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-slate-400 uppercase">Banner Image (URL or Upload)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={form.banner}
                  onChange={(e) => setForm({ ...form, banner: e.target.value })}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
                <label className="px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all">
                  {uploadingBanner ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* General Info */}
        <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4 text-xs">
          <h2 className="font-bold text-white text-sm">General Information</h2>

          <div>
            <label className="block font-bold text-slate-400 uppercase mb-1">Shop Name *</label>
            <input value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-sm font-bold focus:outline-none focus:border-indigo-500" />
          </div>

          <div>
            <label className="block font-bold text-slate-400 uppercase mb-1">Store Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3.5 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none leading-relaxed" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Store Phone *</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Store Email *</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Physical Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block font-bold text-slate-400 uppercase mb-1">Opening Hours</label>
              <input value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving Changes…' : 'Save Store Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
