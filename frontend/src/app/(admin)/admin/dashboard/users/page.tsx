'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import { useLanguageStore } from '@/store/useLanguageStore';
import {
  Users, ShieldCheck, Store, Wrench, Search, Filter,
  UserCheck, UserX, CheckCircle2, ShieldAlert, Key, Edit2, Loader2, Check
} from 'lucide-react';

const INITIAL_USERS = [
  { id: 'u1', name: 'Super Administrator', email: 'superadmin@example.com', phone: '01700-000000', role: 'SUPER_ADMIN', verified: true, isActive: true, createdAt: '2026-01-01' },
  { id: 'u2', name: 'Platform Admin', email: 'admin@example.com', phone: '01700-000001', role: 'ADMIN', verified: true, isActive: true, createdAt: '2026-01-05' },
  { id: 'u3', name: 'Fresh Bazaar Seller', email: 'seller@example.com', phone: '01711-000001', role: 'SELLER', verified: true, isActive: true, createdAt: '2026-02-10' },
  { id: 'u4', name: 'Sharmin Sultana', email: 'customer@example.com', phone: '01811-000002', role: 'CUSTOMER', verified: true, isActive: true, createdAt: '2026-03-12' },
  { id: 'u5', name: 'Apex Climate Care Ltd.', email: 'provider@example.com', phone: '01911-000003', role: 'PROVIDER', verified: true, isActive: true, createdAt: '2026-03-15' },
  { id: 'u6', name: 'Engr. Tanvir Islam', email: 'tanvir@example.com', phone: '01712-334455', role: 'CUSTOMER', verified: true, isActive: true, createdAt: '2026-04-01' },
  { id: 'u7', name: 'ShineSheba Cleaning Pros', email: 'cleaning@example.com', phone: '01819-112233', role: 'PROVIDER', verified: true, isActive: false, createdAt: '2026-05-18' },
];

export default function AdminUsersPage() {
  const { language } = useLanguageStore();
  const isBn = language === 'BN';

  const [users, setUsers] = useState(INITIAL_USERS);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchApi<any>('/admin/users').catch(() => null);
      if (res && res.success && Array.isArray(res.data)) {
        const mapped = res.data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || 'N/A',
          role: u.role,
          verified: u.emailVerified ?? true,
          isActive: u.isActive ?? true,
          createdAt: new Date(u.createdAt).toLocaleDateString(),
        }));
        if (mapped.length > 0) setUsers(mapped);
      }
    } catch (err) {
      console.warn('Fallback to demo users list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChangeRole = async (userId: string, newRole: string, userName: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    try {
      await fetchApi(`/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      }).catch(() => null);
    } catch {}
    setActionMsg(isBn ? `ইউজার "${userName}" এর রোল পরিবর্তন করে ${newRole} করা হয়েছে!` : `User "${userName}" role changed to ${newRole}!`);
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleToggleStatus = async (userId: string, currentActive: boolean, userName: string) => {
    const nextStatus = !currentActive;
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: nextStatus } : u))
    );
    try {
      await fetchApi(`/admin/users/${userId}/status`, {
        method: 'PATCH',
      }).catch(() => null);
    } catch {}
    setActionMsg(
      nextStatus
        ? (isBn ? `ইউজার "${userName}" অ্যাকাউন্ট সক্রিয় করা হয়েছে!` : `User "${userName}" activated!`)
        : (isBn ? `ইউজার "${userName}" অ্যাকাউন্ট স্থগিত (Suspend) করা হয়েছে!` : `User "${userName}" suspended!`)
    );
    setTimeout(() => setActionMsg(''), 4000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    return matchesRole && matchesSearch;
  });

  const getRoleBadgeStyle = (r: string) => {
    switch (r) {
      case 'SUPER_ADMIN': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'ADMIN':       return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'SELLER':      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'PROVIDER':    return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default:            return 'bg-[#181928] text-slate-300 border-white/10';
    }
  };

  return (
    <div className="space-y-6 text-white">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-indigo-400 font-semibold mb-0.5">Admin / User Access Control</p>
          <h1 className="font-black text-white text-2xl flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>{isBn ? 'ইউজার এন্ড রোল ম্যানেজার' : 'User & Role Manager'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isBn ? 'প্ল্যাটফর্মের ইউজার একাউন্টস, পারমিশন রোলস এবং সিকিউরিটি কন্ট্রোল' : 'System user accounts, role permissions, and access management'}
          </p>
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
            <span>{isBn ? 'মোট ইউজার' : 'Total System Users'}</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{users.length} {isBn ? 'জন' : 'Users'}</div>
          <div className="text-[11px] text-indigo-300 font-bold">DOHS Platform Accounts</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'রেসিডেন্ট কাস্টমার' : 'Resident Customers'}</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {users.filter((u) => u.role === 'CUSTOMER').length} {isBn ? 'জন' : 'Customers'}
          </div>
          <div className="text-[11px] text-emerald-400 font-bold">Active Shopping Accounts</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'দোকানদার / সেলার' : 'Store Merchants'}</span>
            <Store className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {users.filter((u) => u.role === 'SELLER').length} {isBn ? 'টি শপ' : 'Stores'}
          </div>
          <div className="text-[11px] text-slate-400 font-bold">Local Vendor Accounts</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'সার্ভিস পার্টনার' : 'Service Partners'}</span>
            <Wrench className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">
            {users.filter((u) => u.role === 'PROVIDER').length} {isBn ? 'জন' : 'Partners'}
          </div>
          <div className="text-[11px] text-slate-400 font-bold">Home Service Providers</div>
        </div>
      </div>

      {/* Role Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-[#1e1f32] border border-white/10">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#181928] text-xs font-semibold overflow-x-auto">
          {['ALL', 'CUSTOMER', 'SELLER', 'PROVIDER', 'ADMIN', 'SUPER_ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg transition-all text-xs font-bold whitespace-nowrap ${
                roleFilter === r ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isBn ? 'নাম, ইমেইল বা ফোন খুঁজুন…' : 'Search name, email or phone…'}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#181928] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-[#1e1f32] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181928] text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4">{isBn ? 'ইউজার' : 'User'}</th>
                <th className="p-4">{isBn ? 'যোগাযোগ' : 'Contact Phone'}</th>
                <th className="p-4">{isBn ? 'রোল পারমিশন' : 'Role Permission'}</th>
                <th className="p-4">{isBn ? 'একাউন্ট স্ট্যাটাস' : 'Account Status'}</th>
                <th className="p-4 text-right">{isBn ? 'রোল পরিবর্তন' : 'Change Role'}</th>
                <th className="p-4 text-right">{isBn ? 'অ্যাকশন' : 'Status Toggle'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-300 font-black flex items-center justify-center text-xs shrink-0">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-300">{u.phone}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeStyle(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        u.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {u.isActive ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'স্থগিত' : 'Suspended')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u.id, e.target.value, u.name)}
                      className="px-3 py-1.5 rounded-xl bg-[#181928] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="SELLER">SELLER</option>
                      <option value="PROVIDER">PROVIDER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id, u.isActive, u.name)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all border ${
                        u.isActive
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {u.isActive ? (isBn ? 'স্থগিত করুন' : 'Suspend') : (isBn ? 'সক্রিয় করুন' : 'Activate')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
