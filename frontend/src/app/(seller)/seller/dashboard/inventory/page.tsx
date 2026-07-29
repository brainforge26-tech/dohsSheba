'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import {
  Search, Download, Package, AlertTriangle, X, Check,
  ChevronLeft, ChevronRight, Plus, Minus, Edit2, Save,
  Loader2, RefreshCw, BarChart2, XCircle, CheckCircle2,
  Filter, ArrowUpDown, Layers,
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category?: { name: string };
  stock: number;
  unit: string;
  price: number;
  isActive: boolean;
  lowStockAlert: number;
}

type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'ARCHIVED';

function getStockStatus(item: InventoryItem): StockStatus {
  if (!item.isActive) return 'ARCHIVED';
  if (item.stock === 0) return 'OUT_OF_STOCK';
  if (item.stock <= item.lowStockAlert) return 'LOW_STOCK';
  return 'IN_STOCK';
}

function StockBadge({ status }: { status: StockStatus }) {
  const map: Record<StockStatus, { label: string; cls: string }> = {
    IN_STOCK:     { label: 'In Stock',     cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    LOW_STOCK:    { label: 'Low Stock',    cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    OUT_OF_STOCK: { label: 'Out of Stock', cls: 'bg-red-500/20 text-red-300 border-red-500/30' },
    ARCHIVED:     { label: 'Archived',     cls: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  };
  const m = map[status];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${m.cls}`}>{m.label}</span>;
}

const PAGE_SIZE = 10;

export default function InventoryPage() {
  const [items,    setItems]    = useState<InventoryItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search,   setSearch]   = useState('');
  const [catFilter, setCat]     = useState('');
  const [statusFilter, setStatus] = useState('');
  const [sortKey,  setSort]     = useState('name_asc');
  const [page,     setPage]     = useState(1);

  // Inline editing state
  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<number>(0);
  const [saving,       setSaving]       = useState(false);

  // Quick restock modal state
  const [restockId,    setRestockId]    = useState<string | null>(null);
  const [restockQty,   setRestockQty]   = useState(10);
  const [restocking,   setRestocking]   = useState(false);

  // ── Load data ────────────────────────────────────────────────────────────────

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi<any>('/products/seller/my-products');
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map((p: any) => ({
          id:             p.id,
          name:           p.name,
          sku:            p.sku || `SKU-${p.id.slice(-6).toUpperCase()}`,
          category:       typeof p.category === 'object' ? p.category : { name: p.category || 'General' },
          stock:          p.stock ?? 0,
          unit:           p.unit || 'unit',
          price:          p.price || 0,
          isActive:       p.isActive ?? true,
          lowStockAlert:  p.lowStockAlert ?? 10,
        }));
        setItems(mapped);
      }
    } catch (err) {
      console.error('Failed to load inventory products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Computed ─────────────────────────────────────────────────────────────────

  const categories = useMemo(() => [...new Set(items.map((i) => i.category?.name).filter(Boolean))], [items]);

  const filtered = useMemo(() => {
    let list = [...items];
    if (search)       list = list.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.sku?.toLowerCase().includes(search.toLowerCase()));
    if (catFilter)    list = list.filter((i) => i.category?.name === catFilter);
    if (statusFilter === 'in_stock')     list = list.filter((i) => i.stock > i.lowStockAlert && i.isActive);
    if (statusFilter === 'low_stock')    list = list.filter((i) => i.stock > 0 && i.stock <= i.lowStockAlert && i.isActive);
    if (statusFilter === 'out_of_stock') list = list.filter((i) => i.stock === 0 && i.isActive);
    if (statusFilter === 'archived')     list = list.filter((i) => !i.isActive);
    if (sortKey === 'name_asc')   list.sort((a,b) => a.name.localeCompare(b.name));
    if (sortKey === 'stock_asc')  list.sort((a,b) => a.stock - b.stock);
    if (sortKey === 'stock_desc') list.sort((a,b) => b.stock - a.stock);
    if (sortKey === 'price_asc')  list.sort((a,b) => a.price - b.price);
    return list;
  }, [items, search, catFilter, statusFilter, sortKey]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const inStock    = items.filter((i) => i.isActive && i.stock > i.lowStockAlert).length;
  const lowStock   = items.filter((i) => i.isActive && i.stock > 0 && i.stock <= i.lowStockAlert).length;
  const outOfStock = items.filter((i) => i.isActive && i.stock === 0).length;

  // ── Actions ──────────────────────────────────────────────────────────────────

  const toggleAll = () => setSelected(selected.size === pageItems.length ? new Set() : new Set(pageItems.map((i) => i.id)));
  const toggleOne = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditingStock(item.stock);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      await fetchApi(`/products/${id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ stock: editingStock }),
      });
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, stock: editingStock } : i));
    } catch (err: any) {
      alert(err.message || 'Failed to update stock');
    } finally {
      setSaving(false);
      setEditingId(null);
    }
  };

  const doRestock = async () => {
    if (!restockId) return;
    setRestocking(true);
    try {
      await fetchApi(`/products/${restockId}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ adjustment: restockQty }),
      });
      setItems((prev) => prev.map((i) => i.id === restockId ? { ...i, stock: i.stock + restockQty } : i));
    } catch (err: any) {
      alert(err.message || 'Failed to restock product');
    } finally {
      setRestocking(false);
      setRestockId(null);
    }
  };

  const exportCSV = () => {
    const rows = [
      ['Product', 'SKU', 'Category', 'Stock', 'Unit', 'Price', 'Status'],
      ...items.map((i) => [i.name, i.sku, i.category?.name || '', i.stock, i.unit, i.price, getStockStatus(i)]),
    ];
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'inventory.csv'; a.click();
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded-xl bg-[#1f2136]" />
      <div className="grid grid-cols-4 gap-3">{Array(4).fill(0).map((_,i)=><div key={i} className="h-20 rounded-2xl bg-[#1f2136]" />)}</div>
      <div className="h-64 rounded-3xl bg-[#1f2136]" />
    </div>
  );

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Dashboard / Inventory</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" /> Inventory Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Monitor and manage stock levels for all products</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/5 transition-all">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <Link href="/seller/dashboard/products/add" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-lg">
            <Plus className="w-3.5 h-3.5" /> Add Product
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: items.length,   icon: <Package className="w-5 h-5 text-indigo-400" />, bg: 'bg-indigo-500/10', color: 'text-white' },
          { label: 'In Stock',       value: inStock,         icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-500/10', color: 'text-emerald-400' },
          { label: 'Low Stock',      value: lowStock,        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />, bg: 'bg-amber-500/10', color: 'text-amber-400' },
          { label: 'Out of Stock',   value: outOfStock,      icon: <XCircle className="w-5 h-5 text-red-400" />, bg: 'bg-red-500/10', color: 'text-red-400' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-[#1f2136] border border-white/10 flex items-center gap-3 hover:border-white/20 transition-colors">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Low Stock Alert Banner ── */}
      {lowStock > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-amber-300 text-sm">{lowStock} product{lowStock > 1 ? 's' : ''} running low on stock</p>
            <p className="text-[11px] text-amber-400/70 mt-0.5">
              {items.filter((i) => i.isActive && i.stock > 0 && i.stock <= i.lowStockAlert).map((i) => i.name).join(' · ')}
            </p>
          </div>
          <button onClick={() => setStatus('low_stock')} className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all">
            View All
          </button>
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="p-4 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by product name or SKU…" className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <select value={catFilter} onChange={(e) => { setCat(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-indigo-500 appearance-none transition-colors">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-indigo-500 appearance-none transition-colors">
            <option value="">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="archived">Archived</option>
          </select>
          <select value={sortKey} onChange={(e) => setSort(e.target.value)} className="px-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-indigo-500 appearance-none transition-colors">
            <option value="name_asc">Name A–Z</option>
            <option value="stock_asc">Stock Low–High</option>
            <option value="stock_desc">Stock High–Low</option>
            <option value="price_asc">Price Low–High</option>
          </select>
          {(search || catFilter || statusFilter) && (
            <button onClick={() => { setSearch(''); setCat(''); setStatus(''); setPage(1); }} className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all font-bold">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Bulk Action Bar ── */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/30">
          <span className="text-xs font-bold text-indigo-300">{selected.size} item{selected.size > 1 ? 's' : ''} selected</span>
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <button onClick={() => setSelected(new Set())} className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/5">Deselect</button>
          </div>
        </div>
      )}

      {/* ── Inventory Table ── */}
      <div className="rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-[#181928]/50">
                <th className="w-10 p-4">
                  <button onClick={toggleAll} className="w-4 h-4 rounded border border-white/20 flex items-center justify-center hover:border-indigo-400 transition-colors">
                    {selected.size === pageItems.length && pageItems.length > 0 && <Check className="w-2.5 h-2.5 text-indigo-400" />}
                  </button>
                </th>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left hidden sm:table-cell">Category</th>
                <th className="p-4 text-center">Current Stock</th>
                <th className="p-4 text-center hidden md:table-cell">Low Stock Alert</th>
                <th className="p-4 text-right hidden lg:table-cell">Value</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pageItems.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-slate-500">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-bold">No products match your filters</p>
                  <p className="text-[11px] mt-1">Try adjusting your search or filter criteria</p>
                </td></tr>
              ) : pageItems.map((item) => {
                const status = getStockStatus(item);
                const stockValue = item.stock * item.price;
                const isEditing  = editingId === item.id;

                return (
                  <tr key={item.id} className={`hover:bg-white/5 transition-colors ${selected.has(item.id) ? 'bg-indigo-600/5' : ''}`}>
                    <td className="p-4">
                      <button onClick={() => toggleOne(item.id)} className="w-4 h-4 rounded border border-white/20 flex items-center justify-center hover:border-indigo-400 transition-colors">
                        {selected.has(item.id) && <Check className="w-2.5 h-2.5 text-indigo-400" />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.sku}</div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-bold border border-indigo-500/20">{item.category?.name || 'General'}</span>
                    </td>
                    <td className="p-4 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setEditingStock((v) => Math.max(0, v - 1))} className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 transition-all"><Minus className="w-3 h-3" /></button>
                          <input type="number" min="0" value={editingStock} onChange={(e) => setEditingStock(Number(e.target.value))} className="w-16 text-center px-2 py-1 rounded-lg bg-[#181928] border border-indigo-500 text-white text-xs focus:outline-none" />
                          <button onClick={() => setEditingStock((v) => v + 1)} className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 transition-all"><Plus className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className={`font-black text-base ${status === 'OUT_OF_STOCK' ? 'text-red-400' : status === 'LOW_STOCK' ? 'text-amber-400' : 'text-white'}`}>{item.stock}</span>
                          <span className="text-[10px] text-slate-500">{item.unit}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center hidden md:table-cell">
                      <span className="text-slate-400">≤ {item.lowStockAlert}</span>
                    </td>
                    <td className="p-4 text-right hidden lg:table-cell">
                      <span className="font-bold text-white">{formatCurrency(stockValue)}</span>
                    </td>
                    <td className="p-4 text-center"><StockBadge status={status} /></td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {isEditing ? (
                          <>
                            <button onClick={() => saveEdit(item.id)} disabled={saving} className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center transition-all" title="Save">
                              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={cancelEdit} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 flex items-center justify-center transition-all" title="Cancel">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(item)} className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 flex items-center justify-center transition-all" title="Edit Stock">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => { setRestockId(item.id); setRestockQty(20); }} className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center transition-all" title="Quick Restock">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* ── Stock Value Footer ── */}
            <tfoot className="border-t border-white/10 bg-[#181928]/50">
              <tr>
                <td colSpan={5} className="p-4 text-xs text-slate-400 font-bold">Showing {pageItems.length} products · Total Inventory Value</td>
                <td className="p-4 text-right font-black text-indigo-400 text-sm hidden lg:table-cell">
                  {formatCurrency(filtered.reduce((s, i) => s + i.stock * i.price, 0))}
                </td>
                <td colSpan={2} className="p-4" />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/10 text-xs">
            <span className="text-slate-400">Page {page} of {totalPages} · {filtered.length} items</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page===1} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 disabled:opacity-40 transition-all"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({length:totalPages},(_,i)=>i+1).filter((p)=>p===1||p===totalPages||Math.abs(p-page)<=1).map((p,i,arr)=>(
                <React.Fragment key={p}>
                  {i>0&&arr[i-1]!==p-1&&<span className="text-slate-500">…</span>}
                  <button onClick={()=>setPage(p)} className={`w-8 h-8 rounded-lg border font-bold transition-all ${page===p?'bg-indigo-600 border-indigo-500 text-white':'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}>{p}</button>
                </React.Fragment>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p+1))} disabled={page===totalPages} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 disabled:opacity-40 transition-all"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* ── Quick Restock Modal ── */}
      {restockId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Quick Restock</h3>
              <button onClick={() => setRestockId(null)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Product</p>
              <p className="font-bold text-white text-sm">{items.find((i) => i.id === restockId)?.name}</p>
              <p className="text-[11px] text-slate-500">Current stock: {items.find((i) => i.id === restockId)?.stock} {items.find((i) => i.id === restockId)?.unit}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Add Quantity</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setRestockQty((v) => Math.max(1, v - 5))} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 transition-all text-lg font-bold"><Minus className="w-4 h-4" /></button>
                <input type="number" min="1" value={restockQty} onChange={(e) => setRestockQty(Number(e.target.value))} className="flex-1 text-center px-3 py-2.5 rounded-xl bg-[#181928] border border-indigo-500 text-white text-lg font-black focus:outline-none" />
                <button onClick={() => setRestockQty((v) => v + 5)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 transition-all"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-2 mt-2">
                {[10, 20, 50, 100].map((q) => (
                  <button key={q} onClick={() => setRestockQty(q)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${restockQty === q ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>+{q}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-white/10">
              <button onClick={() => setRestockId(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={doRestock} disabled={restocking} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60">
                {restocking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                {restocking ? 'Restocking…' : `Add ${restockQty} Units`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
