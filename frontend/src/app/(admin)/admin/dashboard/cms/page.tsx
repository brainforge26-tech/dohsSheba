'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { useLanguageStore } from '@/store/useLanguageStore';
import {
  Image as ImageIcon, Tag, Plus, Search, Filter, Trash2, Edit2,
  CheckCircle2, AlertCircle, Percent, DollarSign, ExternalLink, X, Copy, Check
} from 'lucide-react';

export default function AdminCMSPage() {
  const { language } = useLanguageStore();
  const isBn = language === 'BN';

  const [activeTab, setActiveTab] = useState<'banners' | 'coupons'>('banners');
  const [banners, setBanners] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [actionMsg, setActionMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const [loading, setLoading] = useState(true);

  // Add Banner Modal
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [bTitle, setBTitle] = useState('');
  const [bSubtitle, setBSubtitle] = useState('');
  const [bCategory, setBCategory] = useState('Grocery');
  const [bLink, setBLink] = useState('/categories/grocery');

  // Add Coupon Modal
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [cCode, setCCode] = useState('');
  const [cDiscount, setCDiscount] = useState('৳100 OFF');
  const [cMinSpend, setCMinSpend] = useState('1000');

  const loadData = async () => {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([
        fetchApi<any>('/admin/banners').catch(() => null),
        fetchApi<any>('/admin/coupons').catch(() => null),
      ]);
      if (bRes && bRes.success && Array.isArray(bRes.data)) {
        setBanners(bRes.data);
      }
      if (cRes && cRes.success && Array.isArray(cRes.data)) {
        setCoupons(cRes.data);
      }
    } catch (err) {
      console.error('Error loading CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleHash = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'coupons') setActiveTab('coupons');
        else if (hash === 'banners') setActiveTab('banners');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleDeleteBanner = async (id: string) => {
    if (!confirm(isBn ? 'আপনি কি এই ব্যানারটি মুছে ফেলতে চান?' : 'Delete this banner?')) return;
    setBanners((prev) => prev.filter((b) => b.id !== id));
    await fetchApi(`/admin/banners/${id}`, { method: 'DELETE' }).catch(() => null);
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm(isBn ? 'আপনি কি এই কুপনটি মুছে ফেলতে চান?' : 'Delete this coupon?')) return;
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    await fetchApi(`/admin/coupons/${id}`, { method: 'DELETE' }).catch(() => null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  const handleAddBanner = async () => {
    if (!bTitle.trim()) return;
    try {
      const res = await fetchApi<any>('/admin/banners', {
        method: 'POST',
        body: JSON.stringify({
          title: bTitle.trim(),
          subtitle: bSubtitle.trim() || 'Exclusive DOHS Sheba offer',
          category: bCategory,
          link: bLink,
          image: '🛍️',
        }),
      });
      if (res && res.success && res.data) {
        setBanners((prev) => [res.data, ...prev]);
      } else {
        loadData();
      }
    } catch (err) {
      console.error('Error adding banner:', err);
    }
    setBTitle('');
    setBSubtitle('');
    setShowAddBanner(false);
  };

  const handleAddCoupon = async () => {
    if (!cCode.trim()) return;
    try {
      const res = await fetchApi<any>('/admin/coupons', {
        method: 'POST',
        body: JSON.stringify({
          code: cCode.trim().toUpperCase(),
          discount: cDiscount,
          minSpend: Number(cMinSpend) || 500,
        }),
      });
      if (res && res.success && res.data) {
        setCoupons((prev) => [res.data, ...prev]);
      } else {
        loadData();
      }
    } catch (err) {
      console.error('Error adding coupon:', err);
    }
    setCCode('');
    setShowAddCoupon(false);
  };

  return (
    <div className="space-y-6 text-white">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-indigo-400 font-semibold mb-0.5">Admin / Content & Promotions</p>
          <h1 className="font-black text-white text-2xl flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-indigo-400" />
            <span>{isBn ? 'ব্যানার, প্রমোশন ও কুপনস' : 'Banners, CMS & Coupons'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isBn ? 'হোমপেজ ব্যানার স্লাইডার, প্রমোশনাল অফার এবং কুপন কোড ম্যানেজমেন্ট' : 'Homepage hero banners, promotional offers, and discount coupon codes'}
          </p>
        </div>

        <div className="flex gap-2">
          {activeTab === 'banners' ? (
            <button
              onClick={() => setShowAddBanner(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? 'নতুন ব্যানার যুক্ত করুন' : 'Add New Banner'}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddCoupon(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? 'নতুন কুপন কোড তৈরি করুন' : 'Create Coupon Code'}</span>
            </button>
          )}
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {actionMsg}
        </div>
      )}

      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'সক্রিয় ব্যানার' : 'Active Hero Banners'}</span>
            <ImageIcon className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400">{banners.length} {isBn ? 'টি স্লাইডার' : 'Banners'}</div>
          <div className="text-[11px] text-indigo-300 font-bold">Homepage Carousel</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'সক্রিয় কুপন কোড' : 'Active Coupon Codes'}</span>
            <Tag className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{coupons.length} {isBn ? 'টি কুপন' : 'Coupons'}</div>
          <div className="text-[11px] text-emerald-400 font-bold">Live Redemption</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'মোট কুপন ব্যবহার' : 'Total Coupon Uses'}</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {isBn ? '৫৯৫+' : '595+'} {isBn ? 'বার ব্যবহার' : 'Times Used'}
          </div>
          <div className="text-[11px] text-slate-400 font-bold">Resident Discounts</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'ছাড়কৃত মোট অর্থ' : 'Total Discount Granted'}</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">৳{formatCurrency(18450)}</div>
          <div className="text-[11px] text-slate-400 font-bold">Saved by Residents</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[#1e1f32] border border-white/10 text-xs font-semibold w-fit">
        <button
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'banners' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{isBn ? 'হোমপেজ ব্যানার স্লাইডার' : 'Hero Banners & Sliders'}</span>
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'coupons' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>{isBn ? 'কুপন কোড ও অফার সমূহ' : 'Coupons & Offers'}</span>
        </button>
      </div>

      {/* ── BANNERS TAB ── */}
      {activeTab === 'banners' && (
        banners.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#1e1f32] border border-white/10 text-center space-y-3">
            <ImageIcon className="w-12 h-12 text-slate-500 mx-auto opacity-50" />
            <p className="text-slate-300 font-bold text-sm">{isBn ? 'কোনো হোমপেজ ব্যানার পাওয়া যায়নি' : 'No Hero Banners Found'}</p>
            <p className="text-xs text-slate-400">{isBn ? 'আপনার প্রথম ব্যানার তৈরি করুন' : 'Create your first homepage slider banner to feature promotions.'}</p>
            <button
              onClick={() => setShowAddBanner(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> <span>{isBn ? 'ব্যানার যুক্ত করুন' : 'Add Banner'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {banners.map((b) => (
              <div key={b.id} className="p-5 rounded-3xl bg-[#1e1f32] border border-white/10 space-y-3 flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-xl overflow-hidden">
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center justify-between">
                    {b.image && (b.image.startsWith('http') || b.image.startsWith('/')) ? (
                      <img src={b.image} alt="" className="w-10 h-10 rounded-2xl object-cover border border-indigo-500/30 shrink-0" />
                    ) : (
                      <span className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-xl flex items-center justify-center border border-indigo-500/30 shrink-0">
                        {b.image && b.image.length < 5 ? b.image : '🛍️'}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      {b.status || (b.isActive ? 'Active' : 'Inactive')}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug truncate">{b.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{b.subtitle || b.description}</p>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-400 truncate">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{b.link}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-bold">
                    {b.category || 'General'}
                  </span>
                  <button
                    onClick={() => handleDeleteBanner(b.id)}
                    className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── COUPONS TAB ── */}
      {activeTab === 'coupons' && (
        coupons.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#1e1f32] border border-white/10 text-center space-y-3">
            <Tag className="w-12 h-12 text-slate-500 mx-auto opacity-50" />
            <p className="text-slate-300 font-bold text-sm">{isBn ? 'কোনো কুপন কোড পাওয়া যায়নি' : 'No Coupon Codes Found'}</p>
            <p className="text-xs text-slate-400">{isBn ? 'আপনার প্রথম ডিসকাউন্ট কুপন তৈরি করুন' : 'Create your first discount coupon code to reward customers.'}</p>
            <button
              onClick={() => setShowAddCoupon(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> <span>{isBn ? 'কুপন তৈরি করুন' : 'Create Coupon'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="p-5 rounded-3xl bg-[#1e1f32] border border-white/10 space-y-3 flex flex-col justify-between hover:border-emerald-500/40 transition-all shadow-xl">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-emerald-400 text-lg tracking-wider bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                      {c.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(c.code)}
                      className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
                      title="Copy Code"
                    >
                      {copiedCode === c.code ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="font-black text-xl text-white">{c.discount || (c.discountValue ? `৳${c.discountValue} OFF` : 'Discount')}</div>
                  <div className="text-xs text-slate-400">
                    Min Spend: <strong>৳{formatCurrency(c.minSpend || c.minOrderAmount || 0)}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold">
                    Used: {c.uses || c.usedCount || 0} times
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    {c.status || (c.isActive ? 'Active' : 'Inactive')}
                  </span>
                  <button
                    onClick={() => handleDeleteCoupon(c.id)}
                    className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── ADD BANNER MODAL ── */}
      {showAddBanner && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#1f2136] border border-indigo-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">{isBn ? 'নতুন ব্যানার স্লাইডার যুক্ত করুন' : 'Add New Hero Banner'}</h3>
              <button onClick={() => setShowAddBanner(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'শিরোনাম (Title)' : 'Banner Title'}</label>
                <input
                  value={bTitle}
                  onChange={(e) => setBTitle(e.target.value)}
                  placeholder="e.g. Ramadan Super Bazaar Grocery Sale"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'উপশিরোনাম (Subtitle)' : 'Subtitle'}</label>
                <input
                  value={bSubtitle}
                  onChange={(e) => setBSubtitle(e.target.value)}
                  placeholder="e.g. Up to 30% discount on fresh fruits & spices"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'ক্যাটাগরি' : 'Category'}</label>
                  <select
                    value={bCategory}
                    onChange={(e) => setBCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Grocery">Grocery</option>
                    <option value="Services">Services</option>
                    <option value="Meat & Fish">Meat & Fish</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'টার্গেট লিংক' : 'Target Link'}</label>
                  <input
                    value={bLink}
                    onChange={(e) => setBLink(e.target.value)}
                    placeholder="/categories/grocery"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddBanner}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md"
              >
                {isBn ? 'ব্যানার সংরক্ষণ করুন' : 'Save Banner'}
              </button>
              <button
                onClick={() => setShowAddBanner(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD COUPON MODAL ── */}
      {showAddCoupon && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#1f2136] border border-emerald-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">{isBn ? 'নতুন কুপন তৈরি করুন' : 'Create New Coupon'}</h3>
              <button onClick={() => setShowAddCoupon(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'কুপন কোড' : 'Coupon Code'}</label>
                <input
                  value={cCode}
                  onChange={(e) => setCCode(e.target.value)}
                  placeholder="e.g. EID2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs font-mono font-bold uppercase focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'ছাড়ের পরিমাণ' : 'Discount'}</label>
                  <input
                    value={cDiscount}
                    onChange={(e) => setCDiscount(e.target.value)}
                    placeholder="৳150 OFF"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'সর্বনিম্ন কেনাকাটা (৳)' : 'Min Spend (৳)'}</label>
                  <input
                    type="number"
                    value={cMinSpend}
                    onChange={(e) => setCMinSpend(e.target.value)}
                    placeholder="1000"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddCoupon}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md"
              >
                {isBn ? 'কুপন সংরক্ষণ করুন' : 'Save Coupon'}
              </button>
              <button
                onClick={() => setShowAddCoupon(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
