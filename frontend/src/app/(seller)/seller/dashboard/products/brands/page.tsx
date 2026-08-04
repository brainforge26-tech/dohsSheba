'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Award, Plus, Search, Edit2, Trash2, Package, Globe, Loader2, Lock, Upload, Image as ImageIcon } from 'lucide-react';
import { fetchApi, uploadSingleImageApi } from '@/lib/api-client';

interface BrandItem {
  id: string;
  name: string;
  origin: string;
  products: number;
  logo: string;
}

const STORAGE_KEY = 'dohssheba_seller_brands';

export default function BrandsPage() {
  const [brands, setBrands]         = useState<BrandItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [adding, setAdding]         = useState(false);
  const [newName, setNewName]       = useState('');
  const [newOrigin, setNewOrigin]   = useState('Bangladesh');
  const [newLogo, setNewLogo]       = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadBrands = async () => {
    setLoading(true);
    try {
      // Fetch seller's products to count occurrences
      const res = await fetchApi<any>('/products/seller/my-products').catch(() => null);
      const productList = res && res.success && Array.isArray(res.data) ? res.data : [];

      // Fetch DB Brands from API
      const apiRes = await fetchApi<any>('/brands').catch(() => null);
      const apiBrands: any[] = apiRes && apiRes.success && Array.isArray(apiRes.data) ? apiRes.data : [];

      // Check local storage for custom created brands
      const saved = localStorage.getItem(STORAGE_KEY);
      let customBrands: BrandItem[] = saved ? JSON.parse(saved) : [];

      const brandMap = new Map<string, BrandItem>();
      [...customBrands, ...apiBrands].forEach((b) => {
        if (b && b.name) {
          const clean = String(b.name).trim();
          brandMap.set(clean.toLowerCase(), {
            id: b.id || `b_${clean}`,
            name: clean,
            origin: b.origin || 'Bangladesh',
            products: b._count?.products ?? 0,
            logo: b.logo || '🏷️',
          });
        }
      });
      const combined = Array.from(brandMap.values());

      // Count live product occurrences per brand
      const brandCounts: Record<string, number> = {};
      productList.forEach((p: any) => {
        if (p.brandName || p.brand) {
          const bName = String(p.brandName || p.brand).trim();
          brandCounts[bName.toLowerCase()] = (brandCounts[bName.toLowerCase()] || 0) + 1;
        }
      });

      const merged = combined.map((b) => ({
        ...b,
        products: Math.max(b.products, brandCounts[b.name.toLowerCase()] ?? 0),
      }));

      setBrands(merged);
    } catch (_) {
      const saved = localStorage.getItem(STORAGE_KEY);
      setBrands(saved ? JSON.parse(saved) : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingLogo(true);
      const url = await uploadSingleImageApi(file);
      setNewLogo(url);
    } catch (err: any) {
      alert(err.message || 'Failed to upload brand logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const addBrand = async () => {
    if (!newName.trim()) return;
    const cleanName = newName.trim();
    const logoUrl = newLogo.trim() || null;

    try {
      await fetchApi('/brands', {
        method: 'POST',
        body: JSON.stringify({
          name: cleanName,
          logo: logoUrl,
          description: newOrigin.trim(),
        }),
      });
    } catch (_) {}

    const newBrand: BrandItem = {
      id: `b_${Date.now()}`,
      name: cleanName,
      origin: newOrigin.trim() || 'Bangladesh',
      products: 0,
      logo: logoUrl || '🏷️',
    };

    const updated = [newBrand, ...brands];
    setBrands(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setNewName('');
    setNewLogo('');
    setAdding(false);
  };

  const deleteBrand = async (brand: BrandItem) => {
    if (brand.products > 0) {
      alert(`⚠️ Deletion Blocked!\n\n"${brand.name}" is currently assigned to ${brand.products} active product(s). It cannot be deleted until those products are reassigned or deleted.`);
      return;
    }

    try {
      setDeletingId(brand.id);
      if (!brand.id.startsWith('b_')) {
        await fetchApi(`/brands/${brand.id}`, { method: 'DELETE' });
      }
      const updated = brands.filter((b) => b.id !== brand.id);
      setBrands(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err: any) {
      alert(`⚠️ Deletion Blocked!\n\n${err.message || 'Failed to delete brand'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = brands.filter((b) =>
    !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.origin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Products / Brands</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" /> Brands Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage product brands, logos, and country origins</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" /> Add Brand
        </button>
      </div>

      {adding && (
        <div className="rounded-3xl bg-[#1e1f32] border border-indigo-500/40 p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
          <h3 className="font-black text-white text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" /> Create New Brand
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Brand Name *
                </label>
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Pran, Nestlé, Fresh…"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Country of Origin
                </label>
                <input
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                  placeholder="e.g. Bangladesh, Switzerland…"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Brand Logo Upload Field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Brand Logo Image (Upload from Device or Paste URL)
                </label>
                
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>{uploadingLogo ? 'Uploading Image...' : 'Upload Logo File from Device'}</span>
                  </button>
                </div>

                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={newLogo}
                    onChange={(e) => setNewLogo(e.target.value)}
                    placeholder="Or paste logo image URL (https://...)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Logo Image Live Preview Box */}
            <div className="space-y-1.5 flex flex-col">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Logo Preview
              </label>
              <div className="flex-1 min-h-[130px] rounded-2xl bg-[#12131f] border border-dashed border-white/15 overflow-hidden flex items-center justify-center relative p-4">
                {newLogo ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={newLogo} alt="Brand Logo Preview" className="max-h-24 max-w-full object-contain rounded-lg shadow-md" />
                    <span className="text-[10px] text-emerald-400 font-bold">Logo Ready</span>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 space-y-1">
                    <ImageIcon className="w-8 h-8 mx-auto opacity-30" />
                    <p className="text-xs">No brand logo uploaded</p>
                    <p className="text-[10px] text-slate-600">Logo preview will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
            <button
              onClick={() => { setAdding(false); setNewLogo(''); }}
              className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addBrand}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              Save Brand
            </button>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brands by name or origin…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1f2136] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
        />
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 space-y-2 animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
          <p className="text-xs font-semibold">Loading product brands…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#1e1f32] border border-white/10 text-center text-slate-400 space-y-2">
          <Award className="w-10 h-10 mx-auto opacity-40 text-indigo-400" />
          <p className="font-bold text-sm">No brands found</p>
          <p className="text-xs text-slate-500">Click "Add Brand" above to create a brand.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden shadow-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-widest border-b border-white/10 bg-[#171827]">
                <th className="px-4 py-3 text-left">Brand Logo & Name</th>
                <th className="px-4 py-3 text-left">Origin</th>
                <th className="px-4 py-3 text-right">Assigned Products</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {b.logo && (b.logo.startsWith('http') || b.logo.startsWith('/') || b.logo.startsWith('data:')) ? (
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0 shadow-sm p-0.5">
                          <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <span className="text-xl">{b.logo || '🏷️'}</span>
                      )}
                      <p className="font-bold text-white">{b.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Globe className="w-3.5 h-3.5 text-indigo-400" /> {b.origin}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/5 text-slate-300 border border-white/10">
                      <Package className="w-3 h-3 text-purple-400" /> {b.products} products
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {b.products > 0 ? (
                        <button
                          type="button"
                          onClick={() => alert(`⚠️ Deletion Blocked!\n\n"${b.name}" is currently assigned to ${b.products} active product(s). It cannot be deleted until those products are reassigned or deleted.`)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-500 border border-white/5 text-xs font-bold flex items-center gap-1 cursor-not-allowed"
                          title="Cannot delete: Brand is assigned to active products"
                        >
                          <Lock className="w-3 h-3 text-slate-500" /> Locked
                        </button>
                      ) : (
                        <button
                          onClick={() => deleteBrand(b)}
                          disabled={deletingId === b.id}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete brand"
                        >
                          {deletingId === b.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
