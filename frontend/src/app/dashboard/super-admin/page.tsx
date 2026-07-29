'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Users, Store, Server, ShieldCheck, Database, Key, Activity, BarChart2 } from 'lucide-react';
import { formatCurrency } from '@/utils/cn';

const SUPER_ADMIN_METRICS = [
  { label: 'Total Marketplace Revenue', value: '৳14,82,500', change: '+24.8%', icon: BarChart2, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { label: 'Active Platform Stores',      value: '42 Stores',   change: '+6 this month', icon: Store, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { label: 'System Registered Users',    value: '1,420 Users', change: '+180 this month', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { label: 'Server & API Health',        value: '99.98% Operational', change: '24ms latency', icon: Server, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
];

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-purple-400 font-semibold mb-0.5 uppercase tracking-widest">Platform Core / Governance</p>
          <h1 className="font-black text-white text-2xl flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-400" /> Super Admin Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Highest level system control, user access, infrastructure, and platform security</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" /> Super Admin Authorized
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUPER_ADMIN_METRICS.map((m) => (
          <div key={m.label} className={`rounded-2xl border ${m.bg} p-5 space-y-2`}>
            <div className="flex items-center justify-between">
              <m.icon className={`w-5 h-5 ${m.color}`} />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">{m.change}</span>
            </div>
            <p className={`font-black text-xl ${m.color}`}>{m.value}</p>
            <p className="text-xs text-slate-400">{m.label}</p>
          </div>
        ))}
      </div>

      {/* System Quick Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'User & Role Manager', desc: 'Promote, demote, or suspend platform accounts', icon: Users, href: '/admin/dashboard/users', badge: '1,420 users' },
          { title: 'Database & Migrations', desc: 'Prisma schema state, migrations, and backups', icon: Database, href: '#', badge: 'PostgreSQL' },
          { title: 'Security & Access Logs', desc: 'Audit trail, JWT secret rotation, and active sessions', icon: Key, href: '#', badge: 'Active' },
        ].map((c) => (
          <Link key={c.title} href={c.href}
            className="group rounded-2xl bg-[#1e1f32] border border-white/10 hover:border-purple-500/50 p-5 flex flex-col justify-between transition-all hover:bg-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <c.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{c.badge}</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">{c.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Demo Credentials Box */}
      <div className="rounded-2xl bg-[#1e1f32] border border-purple-500/30 p-5 space-y-3">
        <h2 className="font-bold text-white text-sm flex items-center gap-2">
          <Key className="w-4 h-4 text-purple-400" /> Active Demo Credentials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <p className="font-bold text-purple-300">SUPER ADMIN</p>
            <p className="text-white text-[11px] mt-1">superadmin@example.com</p>
            <p className="text-slate-400 text-[10px]">SuperAdmin@123</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <p className="font-bold text-indigo-300">ADMIN</p>
            <p className="text-white text-[11px] mt-1">admin@example.com</p>
            <p className="text-slate-400 text-[10px]">Admin@123</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="font-bold text-emerald-300">SELLER</p>
            <p className="text-white text-[11px] mt-1">seller@example.com</p>
            <p className="text-slate-400 text-[10px]">Seller@123</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="font-bold text-amber-300">CUSTOMER</p>
            <p className="text-white text-[11px] mt-1">customer@example.com</p>
            <p className="text-slate-400 text-[10px]">Customer@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
