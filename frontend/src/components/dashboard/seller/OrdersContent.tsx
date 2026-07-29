'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import {
  Search, Download, Eye, Loader2, ChevronLeft, ChevronRight,
  X, ShoppingBag, Check, Clock, RefreshCw, Archive, Truck,
  CheckCircle2, XCircle, AlertTriangle, RotateCcw, Package,
  Calendar, User, Filter, ArrowUpDown, Banknote,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export const ALL_STATUSES = ['PENDING', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'] as const;
export type OrderStatus = typeof ALL_STATUSES[number];

const STATUS_META: Record<OrderStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Pending', cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: <Clock className="w-3 h-3" /> },
  PROCESSING: { label: 'Processing', cls: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: <RefreshCw className="w-3 h-3" /> },
  PACKED: { label: 'Packed', cls: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: <Package className="w-3 h-3" /> },
  SHIPPED: { label: 'Shipped', cls: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', icon: <Truck className="w-3 h-3" /> },
  DELIVERED: { label: 'Delivered', cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: <CheckCircle2 className="w-3 h-3" /> },
  CANCELLED: { label: 'Cancelled', cls: 'bg-red-500/20 text-red-300 border-red-500/30', icon: <XCircle className="w-3 h-3" /> },
  RETURNED: { label: 'Returned', cls: 'bg-orange-500/20 text-orange-300 border-orange-500/30', icon: <RotateCcw className="w-3 h-3" /> },
};

export function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status as OrderStatus] ?? { label: status, cls: 'bg-slate-500/20 text-slate-300 border-slate-500/30', icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${m.cls}`}>
      {m.icon}{m.label}
    </span>
  );
}


import { useOrderStore } from '@/store/useOrderStore';

// ─── Order List Component ─────────────────────────────────────────────────────

interface OrdersContentProps {
  defaultStatus?: string;
  title?: string;
}

const PAGE_SIZE = 10;

export function OrdersContent({ defaultStatus, title }: OrdersContentProps) {
  const [apiOrders, setApiOrders] = useState<any[]>([]);
  const { orders: storeOrders, updateOrderStatus } = useOrderStore();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(defaultStatus || '');
  const [sortKey, setSortKey] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: '1', limit: '100' });
    if (defaultStatus) params.set('status', defaultStatus);
    fetchApi<any>(`/orders?${params}`)
      .then((r) => {
        if (r.success && Array.isArray(r.data)) {
          const mapped = r.data.map((o: any) => ({
            ...o,
            total: o.totalAmount ?? o.total ?? 0,
            createdAt: o.createdAt || new Date().toISOString(),
          }));
          setApiOrders(mapped);
        }
      })
      .catch((err) => console.error('Orders fetch failed:', err))
      .finally(() => setLoading(false));
  }, [defaultStatus]);

  const mappedStoreOrders = useMemo(() => {
    return storeOrders.map((o) => {
      // Parse date safely — handle both ISO strings and legacy formatted dates
      let createdAt: string;
      try {
        const d = new Date(o.date);
        createdAt = isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
      } catch {
        createdAt = new Date().toISOString();
      }

      return {
        id: o.id,
        customer: {
          name:  (o as any).customerName  || 'Customer',
          email: (o as any).customerEmail || '—',
          phone: (o as any).customerPhone || '—',
        },
        items: o.items.map((i) => ({
          product: { name: i.name },
          quantity: i.qty,
          price: i.price,
        })),
        total: o.total,
        totalAmount: o.total,
        status: o.status,
        createdAt,
        payment: { method: o.paymentMethod || 'N/A' },
        paymentMethod: o.paymentMethod || 'N/A',
        deliveryAddress: o.deliveryAddress,
        seller: (o as any).seller || 'DOHS Market',
        estDelivery: (o as any).estDelivery || '—',
      };
    });
  }, [storeOrders]);

  const allCombinedOrders = useMemo(() => {
    const combined = [...mappedStoreOrders, ...apiOrders];
    const uniqueMap = new Map();
    combined.forEach((o) => uniqueMap.set(String(o.id).toUpperCase(), o));
    return Array.from(uniqueMap.values());
  }, [mappedStoreOrders, apiOrders]);

  const filtered = useMemo(() => {
    let list = [...allCombinedOrders];
    if (status) list = list.filter((o) => o.status === status);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.email?.toLowerCase().includes(q)
      );
    }
    if (sortKey === 'newest') list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sortKey === 'oldest') list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    if (sortKey === 'amount_desc') list.sort((a, b) => b.total - a.total);
    if (sortKey === 'amount_asc') list.sort((a, b) => a.total - b.total);
    return list;
  }, [allCombinedOrders, status, search, sortKey]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Stats per status
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    allCombinedOrders.forEach((o) => { c[o.status] = (c[o.status] || 0) + 1; });
    return c;
  }, [allCombinedOrders]);

  // Helpers
  const toggleAll = () => setSelected(selected.size === pageItems.length ? new Set() : new Set(pageItems.map((o) => o.id)));
  const toggleOne = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const exportCSV = () => {
    const rows = [
      ['Order ID', 'Customer', 'Total', 'Status', 'Date'],
      ...allCombinedOrders.map((o) => [o.id, o.customer?.name, o.total, o.status, new Date(o.createdAt).toLocaleDateString()]),
    ];
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'orders.csv'; a.click();
  };

  // ─── Next status map ─────────────────────────────────────────────────────────
  const NEXT_STATUS: Record<string, string | null> = {
    PENDING:    'PROCESSING',
    PROCESSING: 'PACKED',
    PACKED:     'SHIPPED',
    SHIPPED:    'DELIVERED',
    DELIVERED:  null,
    CANCELLED:  null,
    RETURNED:   null,
  };

  const NEXT_LABEL: Record<string, string> = {
    PROCESSING: 'Mark as Packed',
    PACKED:     'Mark as Shipped',
    SHIPPED:    'Mark as Delivered',
    PENDING:    'Mark as Processing',
    DELIVERED:  '',
    CANCELLED:  '',
    RETURNED:   '',
  };

  const NEXT_COLOR: Record<string, string> = {
    PENDING:    'bg-amber-500/20 border-amber-500/30 text-amber-300 hover:bg-amber-500/30',
    PROCESSING: 'bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30',
    PACKED:     'bg-cyan-500/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30',
    SHIPPED:    'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30',
  };

  const handleQuickStatus = async (orderId: string, currentStatus: string) => {
    const next = NEXT_STATUS[currentStatus];
    if (!next || updatingId) return;
    setUpdatingId(orderId);
    try {
      await fetchApi(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: next }),
      }).catch(() => {});
    } finally {
      updateOrderStatus(orderId, next as any);
      // Also update apiOrders local state for non-store orders
      setApiOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: next } : o));
      setUpdatingId(null);
    }
  };

  const handleBulkStatus = async () => {
    const ids = Array.from(selected);
    for (const id of ids) {
      const order = allCombinedOrders.find((o) => o.id === id);
      if (order && NEXT_STATUS[order.status]) {
        await handleQuickStatus(id, order.status);
      }
    }
    setSelected(new Set());
  };

  const pageLabel = title || (defaultStatus ? `${defaultStatus.charAt(0) + defaultStatus.slice(1).toLowerCase()} Orders` : 'All Orders');

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-black text-white text-xl">{pageLabel}</h1>
          <p className="text-xs text-slate-400">{filtered.length} order{filtered.length !== 1 ? 's' : ''} {defaultStatus ? `with status ${defaultStatus}` : 'total'}</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/5 transition-all">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* ── Status Tab Strip (only on All Orders page) ── */}
      {!defaultStatus && (
        <div className="flex items-center gap-2 flex-wrap">
          {[{ key: '', label: 'All', count: allCombinedOrders.length }, ...ALL_STATUSES.map((s) => ({ key: s, label: STATUS_META[s].label, count: counts[s] || 0 }))].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => { setStatus(key); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${status === key ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
            >
              {label}
              {count > 0 && <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${status === key ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-300'}`}>{count}</span>}
            </button>
          ))}
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="p-4 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search order ID, customer name or email…" className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="px-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-indigo-500 appearance-none transition-colors">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount_desc">Amount High–Low</option>
            <option value="amount_asc">Amount Low–High</option>
          </select>
          {search && (
            <button onClick={() => { setSearch(''); setPage(1); }} className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all font-bold">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Bulk Action Bar ── */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/30">
          <span className="text-xs font-bold text-indigo-300">{selected.size} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => setSelected(new Set())} className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/5 transition-all">Deselect</button>
            <button onClick={handleBulkStatus} className="px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold hover:bg-indigo-500/30 transition-all flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3" /> Advance Status
            </button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
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
                <th className="p-4 text-left">Order</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left hidden md:table-cell">Items</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-left hidden lg:table-cell">Date</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-bold">No orders found</p>
                  </td>
                </tr>
              )}
              {pageItems.map((o) => (
                <tr key={o.id} className={`hover:bg-white/5 transition-colors ${selected.has(o.id) ? 'bg-indigo-600/5' : ''}`}>
                  <td className="p-4">
                    <button onClick={() => toggleOne(o.id)} className="w-4 h-4 rounded border border-white/20 flex items-center justify-center hover:border-indigo-400 transition-colors">
                      {selected.has(o.id) && <Check className="w-2.5 h-2.5 text-indigo-400" />}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-indigo-400 font-mono">#{o.id.toUpperCase()}</div>
                    <div className="text-[10px] text-slate-500">{o.payment?.method ?? 'bKash'}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{o.customer?.name}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[160px]">{o.customer?.email}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="text-slate-300">{o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{o.items?.map((i: any) => i.product?.name).join(', ')}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-black text-white">{formatCurrency(o.total)}</div>
                    {o.discount > 0 && <div className="text-[10px] text-emerald-400">-{formatCurrency(o.discount)}</div>}
                  </td>
                  <td className="p-4 text-center"><StatusBadge status={o.status} /></td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="text-slate-300">{new Date(o.createdAt).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    <div className="text-[10px] text-slate-500">{new Date(o.createdAt).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {!!NEXT_STATUS[o.status] && (
                        <button
                          onClick={() => handleQuickStatus(o.id, o.status)}
                          disabled={updatingId === o.id}
                          title={NEXT_LABEL[o.status]}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold transition-all disabled:opacity-50 ${NEXT_COLOR[o.status] ?? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                        >
                          {updatingId === o.id
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <ChevronRight className="w-3 h-3" />
                          }
                          <span>{updatingId === o.id ? 'Updating…' : NEXT_LABEL[o.status]}</span>
                        </button>
                      )}
                      <Link href={`/seller/dashboard/orders/${o.id}`} className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 flex items-center justify-center transition-all" title="View Order">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/10 text-xs">
            <span className="text-slate-400">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 disabled:opacity-40 transition-all"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1).map((p, i, arr) => (
                <React.Fragment key={p}>
                  {(i > 0 && arr[i - 1] !== p - 1) ? <span className="text-slate-500">…</span> : null}
                  <button onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg border font-bold transition-all ${page === p ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}>{p}</button>
                </React.Fragment>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 disabled:opacity-40 transition-all"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
