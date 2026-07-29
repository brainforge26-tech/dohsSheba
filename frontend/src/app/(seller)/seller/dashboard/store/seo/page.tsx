'use client';

import React, { useState } from 'react';
import { Globe, Save, Loader2, CheckCircle2, Info, ExternalLink, Tag, FileText } from 'lucide-react';

export default function StoreSEOPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState('');
  const [form, setForm] = useState({
    metaTitle: 'Fresh Bazaar — DOHS Organic Grocery & Fish Market',
    metaDescription: 'Buy fresh organic milk, seasonal fruits, fish, meat, rice, spices and daily essentials from Fresh Bazaar, your trusted DOHS marketplace seller.',
    slug: 'fresh-bazaar',
    keywords: 'fresh grocery, organic milk, hilsa fish, DOHS market, basmati rice',
    ogTitle: '',
    ogDescription: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved('SEO settings saved!'); setTimeout(() => setSaved(''), 3000); }, 500);
  };

  const f = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const titleLen = form.metaTitle.length;
  const descLen  = form.metaDescription.length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-slate-500 mb-0.5">Store / SEO</p>
        <h1 className="font-black text-white text-xl flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" /> Store SEO Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Optimise your store for search engines to drive organic traffic</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
          <CheckCircle2 className="w-4 h-4" /> {saved}
        </div>
      )}

      {/* SERP Preview */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5">
        <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">SERP Preview</p>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-[11px] text-green-400">https://dohs-sheba.com/store/{form.slug}</p>
          <p className="text-base font-semibold text-[#1a0dab] mt-1 truncate" style={{ color: '#8ab4f8' }}>
            {form.metaTitle || 'Your Store Title'}
          </p>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {form.metaDescription || 'Your store meta description will appear here.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-5">
          <h2 className="font-bold text-white text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" /> Basic SEO
          </h2>

          {/* Meta Title */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">Meta Title</label>
              <span className={`text-[10px] font-semibold ${titleLen > 60 ? 'text-rose-400' : 'text-slate-500'}`}>{titleLen}/60</span>
            </div>
            <input value={form.metaTitle} onChange={(e) => f('metaTitle', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
            {titleLen > 60 && <p className="text-xs text-rose-400 mt-1">Title exceeds 60 characters — may be truncated in search results.</p>}
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">Meta Description</label>
              <span className={`text-[10px] font-semibold ${descLen > 160 ? 'text-rose-400' : 'text-slate-500'}`}>{descLen}/160</span>
            </div>
            <textarea rows={3} value={form.metaDescription} onChange={(e) => f('metaDescription', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Store Slug / URL</label>
            <div className="flex items-center rounded-xl overflow-hidden border border-white/10 bg-[#12131f]">
              <span className="px-3 py-2.5 text-xs text-slate-500 border-r border-white/10 shrink-0">dohs-sheba.com/store/</span>
              <input value={form.slug} onChange={(e) => f('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                className="flex-1 px-3 py-2.5 bg-transparent text-white text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Focus Keywords
            </label>
            <input value={form.keywords} onChange={(e) => f('keywords', e.target.value)}
              placeholder="Comma-separated keywords"
              className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* OG Tags */}
        <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-4">
          <h2 className="font-bold text-white text-sm flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-indigo-400" /> Open Graph (Social Sharing)
          </h2>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">OG Title (Social)</label>
            <input value={form.ogTitle} onChange={(e) => f('ogTitle', e.target.value)}
              placeholder={form.metaTitle}
              className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">OG Description</label>
            <textarea rows={2} value={form.ogDescription} onChange={(e) => f('ogDescription', e.target.value)}
              placeholder={form.metaDescription}
              className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
          <Info className="w-4 h-4 shrink-0" />
          SEO changes may take 24–72 hours to reflect in search engine results.
        </div>

        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save SEO Settings'}
        </button>
      </form>
    </div>
  );
}
