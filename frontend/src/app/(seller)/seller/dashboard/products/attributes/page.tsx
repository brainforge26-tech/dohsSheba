'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Search, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

interface AttributeItem {
  id: string;
  name: string;
  values: string[];
  products: number;
}

const STORAGE_KEY = 'dohssheba_seller_attributes';

const DEFAULT_ATTRS: AttributeItem[] = [
  { id: 'a1', name: 'Size',   values: ['Small', 'Medium', 'Large', 'XL', 'XXL'], products: 12 },
  { id: 'a2', name: 'Color',  values: ['Red', 'Blue', 'Green', 'White', 'Black'], products: 18 },
  { id: 'a3', name: 'Weight', values: ['250g', '500g', '1kg', '2kg', '5kg'],     products: 24 },
  { id: 'a4', name: 'Pack',   values: ['Single', 'Pack of 6', 'Pack of 12'],     products: 8 },
];

export default function AttributesPage() {
  const [attrs, setAttrs]         = useState<AttributeItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [adding, setAdding]       = useState(false);
  const [newName, setNewName]     = useState('');
  const [newValueInput, setNewValueInput] = useState<{ [attrId: string]: string }>({});

  useEffect(() => {
    const loadAttributes = async () => {
      setLoading(true);
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        let list: AttributeItem[] = saved ? JSON.parse(saved) : DEFAULT_ATTRS;

        // Count linked seller products where available
        const res = await fetchApi<any>('/products/seller/my-products');
        if (res.success && Array.isArray(res.data)) {
          const productList = res.data;
          list = list.map((a) => {
            let count = a.products;
            if (a.name.toLowerCase() === 'weight' || a.name.toLowerCase() === 'unit') {
              count = productList.filter((p: any) => p.unit).length;
            }
            return { ...a, products: count };
          });
        }
        setAttrs(list);
      } catch (_) {
        const saved = localStorage.getItem(STORAGE_KEY);
        setAttrs(saved ? JSON.parse(saved) : DEFAULT_ATTRS);
      } finally {
        setLoading(false);
      }
    };

    loadAttributes();
  }, []);

  const saveAttributes = (newList: AttributeItem[]) => {
    setAttrs(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  const addAttribute = () => {
    if (!newName.trim()) return;
    const newAttr: AttributeItem = {
      id: `a_${Date.now()}`,
      name: newName.trim(),
      values: [],
      products: 0,
    };
    const updated = [newAttr, ...attrs];
    saveAttributes(updated);
    setNewName('');
    setAdding(false);
    setExpanded(newAttr.id);
  };

  const deleteAttribute = (id: string) => {
    const updated = attrs.filter((a) => a.id !== id);
    saveAttributes(updated);
  };

  const addValueToAttr = (attrId: string) => {
    const val = (newValueInput[attrId] || '').trim();
    if (!val) return;
    const updated = attrs.map((a) => {
      if (a.id === attrId && !a.values.includes(val)) {
        return { ...a, values: [...a.values, val] };
      }
      return a;
    });
    saveAttributes(updated);
    setNewValueInput((prev) => ({ ...prev, [attrId]: '' }));
  };

  const removeValueFromAttr = (attrId: string, valueToRemove: string) => {
    const updated = attrs.map((a) => {
      if (a.id === attrId) {
        return { ...a, values: a.values.filter((v) => v !== valueToRemove) };
      }
      return a;
    });
    saveAttributes(updated);
  };

  const filtered = attrs.filter((a) => !search || a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Products / Attributes</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" /> Product Attributes
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Define attributes like Size, Color, Weight that apply to your products</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Attribute
        </button>
      </div>

      {adding && (
        <div className="rounded-2xl bg-[#1e1f32] border border-indigo-500/40 p-4 flex gap-3">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addAttribute()}
            placeholder="Attribute name (e.g. Size, Flavor, Pack Size)…"
            className="flex-1 px-4 py-2 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={addAttribute}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            Save Attribute
          </button>
          <button
            onClick={() => setAdding(false)}
            className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search attributes…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1e1f32] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 space-y-2 animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
          <p className="text-xs font-semibold">Loading product attributes…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#1e1f32] border border-white/10 text-center text-slate-400 space-y-2">
          <Sliders className="w-10 h-10 mx-auto opacity-40 text-indigo-400" />
          <p className="font-bold text-sm">No attributes found</p>
          <p className="text-xs text-slate-500">Click "Add Attribute" above to create an attribute.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((a) => (
            <div key={a.id} className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <div>
                    <p className="font-bold text-white text-sm">{a.name}</p>
                    <p className="text-[11px] text-slate-500">{a.values.length} values · {a.products} products</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => deleteAttribute(a.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete attribute"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    {expanded === a.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {expanded === a.id && (
                <div className="px-4 pb-4 border-t border-white/5 space-y-3">
                  <p className="text-[11px] text-slate-400 uppercase tracking-widest pt-3">Attribute Values</p>
                  <div className="flex flex-wrap gap-2">
                    {a.values.map((v) => (
                      <span key={v} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-medium">
                        {v}
                        <button
                          onClick={() => removeValueFromAttr(a.id, v)}
                          className="text-slate-500 hover:text-rose-400 ml-1 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 max-w-sm pt-1">
                    <input
                      type="text"
                      value={newValueInput[a.id] || ''}
                      onChange={(e) => setNewValueInput({ ...newValueInput, [a.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && addValueToAttr(a.id)}
                      placeholder={`Add new ${a.name.toLowerCase()} value…`}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#12131f] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => addValueToAttr(a.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3 h-3" /> Add Value
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
