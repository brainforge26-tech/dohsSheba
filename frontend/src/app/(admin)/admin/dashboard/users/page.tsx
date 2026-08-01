'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import { useLanguageStore } from '@/store/useLanguageStore';
import {
  Users, ShieldCheck, Store, Wrench, Search, Filter,
  UserCheck, UserX, CheckCircle2, ShieldAlert, Key, Edit2, Loader2, Check, UserPlus, Bike, X
} from 'lucide-react';

export default function AdminUsersPage() {
  const { language } = useLanguageStore();
  const isBn = language === 'BN';

  const [users, setUsers] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Create User Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'password123',
    role: 'RIDER',
  });

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
        setUsers(mapped);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    try {
      setCreating(true);
      const res = await fetchApi<any>('/admin/users/create', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });
      if (res && res.success) {
        setActionMsg(isBn ? `নতুন ${newUser.role} "${newUser.name}" সফলভাবে তৈরি করা হয়েছে!` : `New ${newUser.role} "${newUser.name}" created successfully!`);
        setShowCreateModal(false);
        setNewUser({ name: '', email: '', phone: '', password: 'password123', role: 'RIDER' });
        loadUsers();
      } else {
        alert(res?.message || 'Failed to create user');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating user');
    } finally {
      setCreating(false);
    }
  };

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
      await fetchApi(`/admin/users/${userId}/toggle`, {
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
      case 'RIDER':       return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold';
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
            {isBn ? 'প্ল্যাটফর্মের ইউজার একাউন্টস, রাইডার রোলস এবং সিকিউরিটি কন্ট্রোল' : 'System user accounts, rider roles, and access management'}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isBn ? '+ নতুন ইউজার / রাইডার যুক্ত করুন' : '+ Add User / Rider'}</span>
        </button>
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
            <span>{isBn ? 'এক্সপ্রেস রাইডার্স' : 'Delivery Riders'}</span>
            <Bike className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {users.filter((u) => u.role === 'RIDER').length} {isBn ? 'জন' : 'Riders'}
          </div>
          <div className="text-[11px] text-emerald-300 font-bold">Active Fleet Partners</div>
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
          {['ALL', 'CUSTOMER', 'RIDER', 'SELLER', 'PROVIDER', 'ADMIN', 'SUPER_ADMIN'].map((r) => (
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
                      className="px-3 py-1.5 rounded-xl bg-[#181928] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                    >
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="RIDER">RIDER (Express Delivery)</option>
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

      {/* ── Create User / Rider Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1e1f32] border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-white text-base">
                  {isBn ? 'নতুন ইউজার বা রাইডার তৈরি করুন' : 'Create New User / Rider'}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahfuzur Rahman"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rider1@dohssheba.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+8801700000000"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Assign System Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white font-bold focus:outline-none focus:border-indigo-500"
                >
                  <option value="RIDER">RIDER (Express Delivery Fleet)</option>
                  <option value="CUSTOMER">CUSTOMER (Resident)</option>
                  <option value="PROVIDER">PROVIDER (Service Specialist)</option>
                  <option value="SELLER">SELLER (Grocery Store)</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  <span>{creating ? 'Creating...' : 'Create Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
