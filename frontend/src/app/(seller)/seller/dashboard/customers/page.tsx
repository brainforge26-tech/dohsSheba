'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import {
  Users, Search, Download, Mail, PhoneCall, ShoppingBag,
  Award, Star, Calendar, ArrowUpDown, ChevronLeft, ChevronRight,
  Filter, Eye, CheckCircle2, ShieldCheck, UserCheck, X, Loader2,
} from 'lucide-react';

// ─── Mock Data Fallback ────────────────────────────────────────────────────────

const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Sharmin Sultana',    email: 'sharmin@email.com',  phone: '01711-234567', avatar: '', totalOrders: 14, totalSpent: 12450, lastOrderDate: '2026-07-28T10:15:00Z', status: 'Active', tier: 'VIP',       city: 'DOHS Mirpur, Dhaka' },
  { id: 'c2', name: 'Engr. Tanvir Islam', email: 'tanvir@email.com',   phone: '01811-345678', avatar: '', totalOrders: 9,  totalSpent: 8320,  lastOrderDate: '2026-07-28T09:45:00Z', status: 'Active', tier: 'Regular',   city: 'DOHS Dhaka' },
  { id: 'c3', name: 'Col. Rahim Uddin',   email: 'rahim@email.com',    phone: '01911-456789', avatar: '', totalOrders: 18, totalSpent: 24800, lastOrderDate: '2026-07-28T08:30:00Z', status: 'Active', tier: 'VIP',       city: 'DOHS Chittagong' },
  { id: 'c4', name: 'Mrs. Nusrat Jahan',  email: 'nusrat@email.com',   phone: '01611-567890', avatar: '', totalOrders: 6,  totalSpent: 5120,  lastOrderDate: '2026-07-27T15:20:00Z', status: 'Active', tier: 'Regular',   city: 'DOHS Mirpur, Dhaka' },
  { id: 'c5', name: 'Dr. Sakib Hasan',    email: 'sakib@email.com',    phone: '01511-678901', avatar: '', totalOrders: 11, totalSpent: 9640,  lastOrderDate: '2026-07-27T12:10:00Z', status: 'Active', tier: 'Regular',   city: 'DOHS Dhaka' },
  { id: 'c6', name: 'Lt. Karim Chowdhury',email: 'karim@email.com',    phone: '01411-789012', avatar: '', totalOrders: 7,  totalSpent: 6200,  lastOrderDate: '2026-07-26T09:45:00Z', status: 'Active', tier: 'Regular',   city: 'DOHS Chittagong' },
  { id: 'c7', name: 'Md. Rafiqul Islam',  email: 'rafiq@email.com',    phone: '01311-890123', avatar: '', totalOrders: 2,  totalSpent: 1150,  lastOrderDate: '2026-07-25T14:30:00Z', status: 'Active', tier: 'New',       city: 'DOHS Mirpur, Dhaka' },
  { id: 'c8', name: 'Sgt. Rubel Hossain', email: 'rubel@email.com',    phone: '01211-901234', avatar: '', totalOrders: 4,  totalSpent: 3400,  lastOrderDate: '2026-07-24T11:20:00Z', status: 'Active', tier: 'Regular',   city: 'DOHS Dhaka' },
  { id: 'c9', name: 'Brig. Farhan Ahmed',  email: 'farhan@email.com',   phone: '01111-012345', avatar: '', totalOrders: 22, totalSpent: 31200, lastOrderDate: '2026-07-28T07:50:00Z', status: 'Active', tier: 'VIP',       city: 'DOHS Dhaka' },
  { id: 'c10', name: 'Maj. Sultana Begum', email: 'sultana@email.com',  phone: '01011-234567', avatar: '', totalOrders: 15, totalSpent: 17900, lastOrderDate: '2026-07-23T16:40:00Z', status: 'Active', tier: 'VIP',       city: 'DOHS Chittagong' },
];

function CustomerTierBadge({ tier }: { tier: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    VIP:     { label: '⭐ VIP',    cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    Regular: { label: 'Regular',  cls: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    New:     { label: '🆕 New',   cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  };
  const m = map[tier] ?? { label: tier, cls: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${m.cls}`}>{m.label}</span>;
}

const PAGE_SIZE = 10;

// ─── Page Component ───────────────────────────────────────────────────────────

export default function CustomersPage() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [tierFilter, setTier]     = useState('');
  const [sortKey,   setSort]      = useState('spent_desc');
  const [page,      setPage]      = useState(1);
  const [selectedCust, setSelectedCust] = useState<typeof MOCK_CUSTOMERS[0] | null>(null);

  useEffect(() => {
    fetchApi<any>('/seller/customers')
      .then((r) => { if (r.success && r.data?.length) setCustomers(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Filters & Sorting
  const filtered = useMemo(() => {
    let list = [...customers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q));
    }
    if (tierFilter) list = list.filter((c) => c.tier === tierFilter);
    if (sortKey === 'spent_desc')  list.sort((a,b) => b.totalSpent - a.totalSpent);
    if (sortKey === 'spent_asc')   list.sort((a,b) => a.totalSpent - b.totalSpent);
    if (sortKey === 'orders_desc') list.sort((a,b) => b.totalOrders - a.totalOrders);
    if (sortKey === 'name_asc')    list.sort((a,b) => a.name.localeCompare(b.name));
    if (sortKey === 'recent')      list.sort((a,b) => b.lastOrderDate.localeCompare(a.lastOrderDate));
    return list;
  }, [customers, search, tierFilter, sortKey]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  // Metrics
  const totalSpentAll   = customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalOrdersAll  = customers.reduce((s, c) => s + c.totalOrders, 0);
  const vipCount        = customers.filter((c) => c.tier === 'VIP').length;
  const avgOrderValue   = totalOrdersAll > 0 ? totalSpentAll / totalOrdersAll : 0;

  const exportCSV = () => {
    const rows = [
      ['ID', 'Name', 'Email', 'Phone', 'City', 'Tier', 'Orders', 'Total Spent', 'Last Order'],
      ...customers.map((c) => [c.id, c.name, c.email, c.phone, c.city, c.tier, c.totalOrders, c.totalSpent, c.lastOrderDate]),
    ];
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'customers.csv'; a.click();
  };

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
          <p className="text-xs text-slate-500 mb-0.5">Dashboard / Customers</p>
          <h1 className="font-black text-white text-xl flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Customer Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">{customers.length} unique customers ordered from your store</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/5 transition-all">
          <Download className="w-3.5 h-3.5" /> Export Customers
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Customers',  value: customers.length,                  icon: <Users className="w-5 h-5 text-indigo-400" />,     bg: 'bg-indigo-500/10' },
          { label: 'VIP Customers',    value: vipCount,                          icon: <Award className="w-5 h-5 text-amber-400" />,      bg: 'bg-amber-500/10' },
          { label: 'Total Revenue',    value: formatCurrency(totalSpentAll),     icon: <ShoppingBag className="w-5 h-5 text-emerald-400" />,bg: 'bg-emerald-500/10' },
          { label: 'Avg. Order Value', value: formatCurrency(avgOrderValue),     icon: <Star className="w-5 h-5 text-cyan-400" />,        bg: 'bg-cyan-500/10' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-[#1f2136] border border-white/10 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold">{s.label}</p>
              <p className="text-lg font-black text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div className="p-4 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search customer name, email or phone…" className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <select value={tierFilter} onChange={(e) => { setTier(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-indigo-500 appearance-none transition-colors">
            <option value="">All Customer Tiers</option>
            <option value="VIP">⭐ VIP Only</option>
            <option value="Regular">Regular</option>
            <option value="New">🆕 New Customers</option>
          </select>
          <select value={sortKey} onChange={(e) => setSort(e.target.value)} className="px-3 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-indigo-500 appearance-none transition-colors">
            <option value="spent_desc">Total Spent: High to Low</option>
            <option value="spent_asc">Total Spent: Low to High</option>
            <option value="orders_desc">Most Orders</option>
            <option value="recent">Most Recent Order</option>
            <option value="name_asc">Name A–Z</option>
          </select>
          {(search || tierFilter) && (
            <button onClick={() => { setSearch(''); setTier(''); setPage(1); }} className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all font-bold">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Customers Table ── */}
      <div className="rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-[#181928]/50">
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left hidden sm:table-cell">Contact</th>
                <th className="p-4 text-left hidden md:table-cell">Location</th>
                <th className="p-4 text-center">Tier</th>
                <th className="p-4 text-center">Orders</th>
                <th className="p-4 text-right">Total Spent</th>
                <th className="p-4 text-left hidden lg:table-cell">Last Order</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pageItems.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-slate-500">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-bold">No customers found</p>
                </td></tr>
              ) : pageItems.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xs shrink-0">
                        {c.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{c.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">ID: {c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <div className="text-slate-300">{c.email}</div>
                    <div className="text-[10px] text-slate-500">{c.phone}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-slate-300">{c.city}</span>
                  </td>
                  <td className="p-4 text-center"><CustomerTierBadge tier={c.tier} /></td>
                  <td className="p-4 text-center">
                    <span className="font-black text-sm text-white">{c.totalOrders}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-black text-indigo-400 text-sm">{formatCurrency(c.totalSpent)}</span>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-slate-400 text-[11px]">
                    {new Date(c.lastOrderDate).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => setSelectedCust(c)} className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 flex items-center justify-center transition-all mx-auto" title="View Details">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/10 text-xs">
            <span className="text-slate-400">Page {page} of {totalPages} · {filtered.length} customers</span>
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

      {/* ── Customer Details Modal ── */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2"><UserCheck className="w-4 h-4 text-indigo-400" /> Customer Profile</h3>
              <button onClick={() => setSelectedCust(null)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#181928]">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xl shrink-0">
                {selectedCust.name[0]}
              </div>
              <div>
                <h4 className="font-black text-white text-base">{selectedCust.name}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5"><Mail className="w-3 h-3" />{selectedCust.email}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5"><PhoneCall className="w-3 h-3" />{selectedCust.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-slate-400 mb-0.5">Total Orders</p>
                <p className="font-black text-white text-base">{selectedCust.totalOrders}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-slate-400 mb-0.5">Total Spent</p>
                <p className="font-black text-indigo-400 text-base">{formatCurrency(selectedCust.totalSpent)}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-slate-400 mb-0.5">Tier</p>
                <CustomerTierBadge tier={selectedCust.tier} />
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-slate-400 mb-0.5">Location</p>
                <p className="font-bold text-slate-200 truncate">{selectedCust.city}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button onClick={() => setSelectedCust(null)} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
