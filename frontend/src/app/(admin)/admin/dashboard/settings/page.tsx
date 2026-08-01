'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import { useSiteSettingsStore } from '@/store/useSiteSettingsStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import {
  Settings, Save, Globe, PhoneCall, Mail, MapPin,
  ShieldCheck, CheckCircle2, Loader2, AlertCircle, RefreshCw,
  DollarSign, Wrench, ToggleLeft, ToggleRight, Sparkles, Bike
} from 'lucide-react';

export default function AdminWebsiteSettingsPage() {
  const { language } = useLanguageStore();
  const isBn = language === 'BN';

  const siteSettings = useSiteSettingsStore();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    siteName: siteSettings.siteName || 'dohsSheba',
    tagline: siteSettings.tagline || 'Home Services & Express Grocery Marketplace for Savar DOHS',
    supportPhone: siteSettings.supportPhone || '01306031982',
    supportEmail: siteSettings.supportEmail || 'support@dohssheba.com',
    address: siteSettings.address || 'Savar DOHS, Dhaka, Bangladesh',
    currencySymbol: siteSettings.currencySymbol || '৳',
    riderCommissionPercent: (siteSettings as any).riderCommissionPercent || 80,
    maintenanceMode: siteSettings.maintenanceMode || false,
  });

  useEffect(() => {
    setLoading(true);
    fetchApi<any>('/admin/settings')
      .then((res) => {
        if (res && res.success && res.data) {
          const d = res.data;
          setForm({
            siteName: d.siteName || 'dohsSheba',
            tagline: d.tagline || 'Home Services & Express Grocery Marketplace for Savar DOHS',
            supportPhone: d.supportPhone || '01306031982',
            supportEmail: d.supportEmail || 'support@dohssheba.com',
            address: d.address || 'Savar DOHS, Dhaka, Bangladesh',
            currencySymbol: d.currencySymbol || '৳',
            riderCommissionPercent: d.riderCommissionPercent ?? 80,
            maintenanceMode: Boolean(d.maintenanceMode),
          });
          useSiteSettingsStore.getState().updateSettingsLocally(d);
        }
      })
      .catch((err) => console.error('Error fetching admin site settings:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.siteName.trim()) {
      setError(isBn ? 'ওয়েবসাইটের নাম পূরণ করা আবশ্যক।' : 'Website name is required.');
      return;
    }

    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetchApi<any>('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(form),
      });

      if (res && res.success) {
        setSuccess(
          isBn
            ? 'ওয়েবসাইট সেটিংস ও নাম সফলভাবে আপডেট করা হয়েছে!'
            : 'Website settings and brand name updated successfully across the entire site!'
        );
        useSiteSettingsStore.getState().updateSettingsLocally(form);
      } else {
        throw new Error(res?.message || 'Failed to update site settings');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(''), 5000);
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
    <div className="space-y-6 text-white max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs text-indigo-400 font-semibold mb-0.5">Admin / Platform Configuration</p>
          <h1 className="font-black text-white text-2xl flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-400" />
            <span>{isBn ? 'ওয়েবসাইট গ্লোবাল সেটিংস অ্যান্ড নাম কাস্টমাইজেশন' : 'Website Settings & Dynamic Brand Name'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isBn
              ? 'এখানে ওয়েবসাইটের নাম ও সেটিংস পরিবর্তন করলে সম্পূর্ণ প্ল্যাটফর্মে লাইভ পরিবর্তন হবে'
              : 'Change the website brand name, tagline, and contact info to update dynamically across the whole platform'}
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-2 shadow-lg">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Brand Name & Tagline */}
        <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-white text-sm">
              {isBn ? 'ওয়েবসাইট ব্র্যান্ডিং ও নাম (Dynamic Website Brand)' : 'Global Website Identity'}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">
                {isBn ? '১. ওয়েবসাইটের ডায়নামিক নাম (Website Brand Name) *' : '1. Dynamic Website Brand Name *'}
              </label>
              <input
                type="text"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                placeholder="e.g. dohsSheba, DOHS Sheba, Smart DOHS"
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#181928] border border-white/10 text-white font-black text-sm focus:outline-none focus:border-indigo-500 transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {isBn
                  ? 'এই নামটি হেডার, ফুটার, ড্যাশবোর্ড সাইডবার, নেভবার ও সাইটের সকল টাইটেলে দেখা যাবে।'
                  : 'This name will dynamically replace the brand title in headers, footers, sidebars, and title tags everywhere.'}
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">
                {isBn ? '২. ওয়েবসাইটের স্লোগান / ট্যাগলাইন (Tagline)' : '2. Website Tagline & Slogan'}
              </label>
              <textarea
                rows={2}
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Home Services & Express Grocery Marketplace for Savar DOHS"
                className="w-full p-3.5 rounded-2xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Contact Info & Currency */}
        <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <PhoneCall className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-white text-sm">
              {isBn ? 'যোগাযোগ ও কারেন্সি ইনফরমেশন' : 'Contact & Currency Settings'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">Support Phone Number</label>
              <input
                type="text"
                value={form.supportPhone}
                onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                placeholder="01306031982"
                className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">Support Email Address</label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                placeholder="support@dohssheba.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">Physical Office Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Savar DOHS, Dhaka, Bangladesh"
                className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">Currency Symbol</label>
              <input
                type="text"
                value={form.currencySymbol}
                onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                placeholder="৳"
                className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* ── Rider Commission & Fee Share Settings ── */}
        <div className="p-6 rounded-3xl bg-[#1f2136] border border-emerald-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Bike className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-white text-sm">
                {isBn ? 'রাইডার ডেলিভারি ফি কমিশন পার্সেন্টেজ' : 'Rider Delivery Fee Share Rate'}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-black text-xs border border-emerald-500/30">
              RIDER GETS {form.riderCommissionPercent}% OF DELIVERY FEE
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300 uppercase">
                {isBn ? 'রাইডারের কমিশন পার্সেন্টেজ (Rider Fee Share)' : 'Rider Fee Share Percentage'}
              </label>
              <div className="font-mono text-emerald-400 font-black text-lg">
                {form.riderCommissionPercent}%
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={form.riderCommissionPercent}
                onChange={(e) => setForm({ ...form, riderCommissionPercent: Number(e.target.value) })}
                className="flex-1 accent-emerald-500 cursor-pointer h-2 bg-[#181928] rounded-lg"
              />
              <input
                type="number"
                min="10"
                max="100"
                value={form.riderCommissionPercent}
                onChange={(e) => setForm({ ...form, riderCommissionPercent: Number(e.target.value) })}
                className="w-20 px-3 py-2 rounded-xl bg-[#181928] border border-white/10 text-white font-mono font-bold text-center text-xs"
              />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs space-y-1.5">
              <div className="font-extrabold text-emerald-200">
                💡 {isBn ? 'হিসাব উদাহরণ (ডেলিভারি ফি ৳৫০ হলে):' : 'Earning Calculation Breakdown (Assuming ৳50 Delivery Fee):'}
              </div>
              <div className="text-[11px] text-slate-300 flex items-center justify-between">
                <span>{isBn ? 'রাইডারের ইনকাম (Rider Balance):' : 'Rider Net Earning (Credited to Wallet):'}</span>
                <span className="font-mono font-extrabold text-emerald-400">৳{Math.round(50 * (form.riderCommissionPercent / 100))} ({form.riderCommissionPercent}%)</span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center justify-between">
                <span>{isBn ? 'প্ল্যাটফর্মের কমিশন রিটেনশন (Platform Retention):' : 'Platform Retention / Admin Share:'}</span>
                <span className="font-mono font-extrabold text-indigo-400">৳{50 - Math.round(50 * (form.riderCommissionPercent / 100))} ({100 - form.riderCommissionPercent}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Maintenance Mode Toggle */}
        <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>{isBn ? 'মেইনটেন্যান্স মোড (Maintenance Mode)' : 'System Maintenance Mode'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isBn
                ? 'মেইনটেন্যান্স মোড চালু করলে সাধারণ ভিজিটরদের জন্য সাইটে রক্ষণাবেক্ষণ পেজ দেখাবে'
                : 'Enable maintenance mode to temporarily restrict public user access during system upgrades'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
            className={`p-2 rounded-2xl transition-all flex items-center gap-2 text-xs font-bold ${
              form.maintenanceMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-slate-400 border border-white/10'
            }`}
          >
            {form.maintenanceMode ? <ToggleRight className="w-6 h-6 text-amber-400" /> : <ToggleLeft className="w-6 h-6 text-slate-500" />}
            <span>{form.maintenanceMode ? 'Enabled' : 'Disabled'}</span>
          </button>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 shadow-indigo-600/30"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isBn ? 'সেটিংস ও নাম পরিবর্তন সংরক্ষণ করুন' : 'Save Website Settings & Name'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
