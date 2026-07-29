'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { useLanguageStore } from '@/store/useLanguageStore';
import {
  Wrench, ShieldCheck, Check, X, Plus, Search, Filter,
  Trash2, Edit2, Clock, CheckCircle2, AlertCircle, Phone, FileText
} from 'lucide-react';

const INITIAL_SERVICES = [
  { id: 's1', title: 'AC Master Servicing & Jet Cleaning', category: 'AC & Appliance Repair', price: 1200, provider: 'Apex Climate Care Ltd.', status: 'Active', rating: 4.9, bookings: 142 },
  { id: 's2', title: 'Full House Deep Cleaning & Sanitization', category: 'Cleaning & Maid', price: 4500, provider: 'ShineSheba Cleaning Pros', status: 'Active', rating: 4.8, bookings: 98 },
  { id: 's3', title: 'Electrical Wiring & Circuit Breaker Fix', category: 'Electrical & Plumbing', price: 800, provider: 'DOHS Electric Masters', status: 'Active', rating: 4.7, bookings: 76 },
  { id: 's4', title: 'Plumbing Leak Repair & Pipe Fitting', category: 'Electrical & Plumbing', price: 950, provider: 'Dhaka Pipe & Plumbing Care', status: 'Active', rating: 4.9, bookings: 110 },
  { id: 's5', title: 'CCTV Camera Setup & Security Configuration', category: 'Security & Automation', price: 2500, provider: 'DOHS SafeHome Tech', status: 'Active', rating: 5.0, bookings: 54 },
];

const INITIAL_PARTNERS = [
  { id: '#APP-901', name: 'Modern Climate Solutions', category: 'AC Service & Repair', applicant: 'Engr. Rakibul Hasan', phone: '+880 1711-554433', nid: '1992269412984', date: 'Today' },
  { id: '#APP-902', name: 'CleanSpace DOHS Specialists', category: 'House Deep Cleaning', applicant: 'Mrs. Selina Begum', phone: '+880 1819-112233', nid: '1988269123847', date: 'Yesterday' },
];

export default function AdminServicesPage() {
  const { language } = useLanguageStore();
  const isBn = language === 'BN';

  const [activeTab, setActiveTab] = useState<'catalog' | 'approvals'>('catalog');
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [partnerQueue, setPartnerQueue] = useState(INITIAL_PARTNERS);
  const [search, setSearch] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  // Add Service Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AC & Appliance Repair');
  const [price, setPrice] = useState('');
  const [provider, setProvider] = useState('DOHS Certified Provider');

  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'approvals') setActiveTab('approvals');
        else if (hash === 'catalog') setActiveTab('catalog');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleApprovePartner = (id: string, name: string) => {
    setPartnerQueue((prev) => prev.filter((p) => p.id !== id));
    setActionMsg(isBn ? `পার্টনার "${name}" অনুমোদিত হয়েছে!` : `Partner "${name}" approved successfully!`);
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleRejectPartner = (id: string, name: string) => {
    setPartnerQueue((prev) => prev.filter((p) => p.id !== id));
    setActionMsg(isBn ? `পার্টনার রিকোয়েস্ট "${name}" বাতিল করা হয়েছে।` : `Partner application "${name}" rejected.`);
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleDeleteService = (id: string) => {
    if (!confirm(isBn ? 'আপনি কি এই সার্ভিসটি মুছে ফেলতে চান?' : 'Delete this service?')) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddService = () => {
    if (!title.trim() || !price) return;
    const newS = {
      id: `s_${Date.now()}`,
      title: title.trim(),
      category,
      price: Number(price),
      provider,
      status: 'Active',
      rating: 5.0,
      bookings: 0,
    };
    setServices((prev) => [newS, ...prev]);
    setTitle('');
    setPrice('');
    setShowAddModal(false);
  };

  const filteredServices = services.filter(
    (s) =>
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      s.provider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-indigo-400 font-semibold mb-0.5">Admin / Services Command</p>
          <h1 className="font-black text-white text-2xl flex items-center gap-2">
            <Wrench className="w-6 h-6 text-indigo-400" />
            <span>{isBn ? 'সার্ভিসেস ও পার্টনার ম্যানেজমেন্ট' : 'Services & Partner Management'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isBn ? 'DOHS এলাকার অন-ডিমান্ড হোম সার্ভিস ও সার্ভিস পার্টনার অনুমোদন' : 'On-demand home services catalog, pricing, and partner approvals'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isBn ? 'নতুন সার্ভিস যোগ করুন' : 'Add New Service'}</span>
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
            <span>{isBn ? 'সক্রিয় সার্ভিসেস' : 'Active Services'}</span>
            <Wrench className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400">{services.length} {isBn ? 'টি সার্ভিস' : 'Services'}</div>
          <div className="text-[11px] text-indigo-300 font-bold">5 Main Categories</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'যাচাইকৃত পার্টনার' : 'Verified Partners'}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">৫২০ {isBn ? 'জন পার্টনার' : 'Partners'}</div>
          <div className="text-[11px] text-emerald-400 font-bold">NID & Police Vetted</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'অপেক্ষমাণ আবেদন' : 'Pending Approvals'}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{partnerQueue.length} {isBn ? 'টি আবেদন' : 'Pending'}</div>
          <div className="text-[11px] text-slate-400 font-bold">Action Required</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'মোট সম্পন্ন বুকিং' : 'Completed Bookings'}</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">৪৮০+ {isBn ? 'টি বুকিং' : 'Bookings'}</div>
          <div className="text-[11px] text-slate-400 font-bold">99.2% Satisfaction</div>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-[#1e1f32] border border-white/10">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#181928] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'catalog' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{isBn ? 'সার্ভিস ক্যাটালগ' : 'Services Catalog'}</span>
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'approvals' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isBn ? 'পার্টনার আবেদন (কিউ)' : 'Partner Approvals Queue'}</span>
            {partnerQueue.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-black">
                {partnerQueue.length}
              </span>
            )}
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isBn ? 'সার্ভিস খুঁজুন…' : 'Search services…'}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#181928] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* ── SERVICES CATALOG TAB ── */}
      {activeTab === 'catalog' && (
        <div className="rounded-3xl bg-[#1e1f32] border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181928] text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-4">{isBn ? 'সার্ভিসের নাম' : 'Service Title'}</th>
                  <th className="p-4">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
                  <th className="p-4">{isBn ? 'প্রোভাইডার কোম্পানি' : 'Provider Company'}</th>
                  <th className="p-4">{isBn ? 'বেস প্রাইস' : 'Base Price'}</th>
                  <th className="p-4">{isBn ? 'বুকিং সংখ্যা' : 'Bookings'}</th>
                  <th className="p-4">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="p-4 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredServices.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{s.title}</div>
                      <div className="text-[11px] text-amber-400">★ {s.rating} Rating</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[11px] font-bold border border-indigo-500/20">
                        {s.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-semibold">{s.provider}</td>
                    <td className="p-4 font-black text-emerald-400">৳{formatCurrency(s.price)}</td>
                    <td className="p-4 font-mono font-bold text-white">{s.bookings}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteService(s.id)}
                        className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center transition-all ml-auto"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PARTNER APPROVALS TAB ── */}
      {activeTab === 'approvals' && (
        <div className="space-y-3">
          {partnerQueue.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#1e1f32] border border-white/10 text-center text-slate-400 text-xs">
              No pending partner applications in queue. All applications reviewed!
            </div>
          ) : (
            partnerQueue.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-3xl bg-[#1e1f32] border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-500/40 transition-all shadow-xl"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-400">{app.id}</span>
                    <span className="font-bold text-white text-base">{app.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                      {app.category}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    Applicant: <strong className="text-slate-200">{app.applicant}</strong> • Phone: {app.phone} • NID: {app.nid}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                  <button
                    onClick={() => handleRejectPartner(app.id, app.name)}
                    className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold transition-all border border-red-500/20 text-xs flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4" />
                    <span>{isBn ? 'বাতিল' : 'Reject'}</span>
                  </button>
                  <button
                    onClick={() => handleApprovePartner(app.id, app.name)}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg text-xs flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isBn ? 'পার্টনার অনুমোদন করুন' : 'Approve Partner'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── ADD SERVICE MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#1f2136] border border-indigo-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">{isBn ? 'নতুন সার্ভিস যোগ করুন' : 'Add New Service'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'সার্ভিসের নাম' : 'Service Title'}</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AC Water Leakage Repair"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'বেস প্রাইস (৳)' : 'Base Price (৳)'}</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1200"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'ক্যাটাগরি' : 'Category'}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="AC & Appliance Repair">AC & Appliance Repair</option>
                    <option value="Cleaning & Maid">Cleaning & Maid</option>
                    <option value="Electrical & Plumbing">Electrical & Plumbing</option>
                    <option value="Security & Automation">Security & Automation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'পার্টনার কোম্পানি' : 'Provider Company'}</label>
                <input
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="DOHS Climate Care"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddService}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md"
              >
                {isBn ? 'সার্ভিস সংরক্ষণ করুন' : 'Save Service'}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
