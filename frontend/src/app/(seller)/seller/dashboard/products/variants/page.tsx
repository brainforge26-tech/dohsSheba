'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, Trash2, Package, Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

interface VariantItem {
  id: string;
  productId: string;
  product: string;
  sku: string;
  attrs: string;
  price: number;
  stock: number;
}

const STORAGE_KEY = 'dohssheba_seller_variants';

export default function VariantsPage() {
  const [variants, setVariants]         = useState<VariantItem[]>([]);
  const [myProducts, setMyProducts]     = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [adding, setAdding]             = useState(false);
  const [selectedProductId, setSelectedProduct] = useState('');
  const [skuInput, setSkuInput]         = useState('');
  const [attrsInput, setAttrsInput]     = useState('');
  const [priceInput, setPriceInput]     = useState('');
  const [stockInput, setStockInput]     = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchApi<any>('/products/seller/my-products').catch(() => null);
        const productList = res && res.success && Array.isArray(res.data) ? res.data : [];
        setMyProducts(productList);

        // Derive initial variants from real seller products
        const liveVariants: VariantItem[] = productList.map((p: any) => ({
          id:           `v_${p.id}`,
          productId:    p.id,
          product:      p.name,
          sku:          `SKU-${(p.id || '').slice(-6).toUpperCase()}`,
          attrs:        `${p.unit || '1 unit'} · ${p.category?.name || 'Standard'}`,
          price:        p.price || 0,
          stock:        p.stock || 0,
        }));

        // Combine with custom created variants in local storage
        const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        const customVariants: VariantItem[] = saved ? JSON.parse(saved) : [];

        setVariants([...liveVariants, ...customVariants]);
      } catch (err) {
        console.error('Failed to load seller products for variants:', err);
        const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        setVariants(saved ? JSON.parse(saved) : []);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const saveCustomVariants = (newCustomList: VariantItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCustomList));
  };

  const addVariant = () => {
    if (!selectedProductId || !skuInput.trim()) return;
    const matched = myProducts.find((p) => p.id === selectedProductId);
    const prodName = matched?.name || 'Custom Product';

    const newVar: VariantItem = {
      id: `custom_v_${Date.now()}`,
      productId: selectedProductId,
      product: prodName,
      sku: skuInput.trim().toUpperCase(),
      attrs: attrsInput.trim() || 'Standard Variant',
      price: Number(priceInput) || matched?.price || 0,
      stock: Number(stockInput) || matched?.stock || 0,
    };

    const updated = [newVar, ...variants];
    setVariants(updated);

    // Save only custom variants to localStorage
    const existingSaved = localStorage.getItem(STORAGE_KEY);
    const customList: VariantItem[] = existingSaved ? JSON.parse(existingSaved) : [];
    saveCustomVariants([newVar, ...customList]);

    // Reset inputs
    setSkuInput('');
    setAttrsInput('');
    setPriceInput('');
    setStockInput('');
    setSelectedProduct('');
    setAdding(false);
  };

  const deleteVariant = (id: string) => {
    const updated = variants.filter((v) => v.id !== id);
    setVariants(updated);

    const existingSaved = localStorage.getItem(STORAGE_KEY);
    const customList: VariantItem[] = existingSaved ? JSON.parse(existingSaved) : [];
    saveCustomVariants(customList.filter((v) => v.id !== id));
  };

  const filtered = variants.filter(
    (v) =>
      !search ||
      v.product.toLowerCase().includes(search.toLowerCase()) ||
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      v.attrs.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Products / Variants</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" /> Product Variants
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage product variants — size, weight, and SKU-level inventory</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Variant
        </button>
      </div>

      {adding && (
        <div className="rounded-2xl bg-[#1e1f32] border border-indigo-500/40 p-4 space-y-3">
          <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Create New Product Variant</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Base Product…</option>
              {myProducts.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={skuInput}
              onChange={(e) => setSkuInput(e.target.value)}
              placeholder="SKU (e.g. MLK-1L-001)…"
              className="px-3 py-2 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
            />
            <input
              type="text"
              value={attrsInput}
              onChange={(e) => setAttrsInput(e.target.value)}
              placeholder="Attributes (e.g. 1L · Full Cream)…"
              className="px-3 py-2 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
            <input
              type="number"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              placeholder="Price (৳)…"
              className="px-3 py-2 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
            <input
              type="number"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              placeholder="Stock Qty…"
              className="px-3 py-2 rounded-xl bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={() => setAdding(false)}
              className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addVariant}
              disabled={!selectedProductId || !skuInput.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all"
            >
              Save Variant
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product, SKU, or attributes…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1e1f32] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 space-y-2 animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
          <p className="text-xs font-semibold">Loading product variants…</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-widest border-b border-white/10">
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">SKU</th>
                  <th className="px-4 py-3 text-left">Attributes</th>
                  <th className="px-4 py-3 text-right">Price (৳)</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-indigo-400 shrink-0" />
                        <p className="font-semibold text-white text-sm truncate max-w-[200px]">{v.product}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">{v.sku}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">{v.attrs}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-400">৳{v.price}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs font-bold ${v.stock <= 5 ? 'text-rose-400' : v.stock <= 15 ? 'text-amber-400' : 'text-slate-300'}`}>
                        {v.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => deleteVariant(v.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete variant"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      No variants found. Click "Add Variant" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
