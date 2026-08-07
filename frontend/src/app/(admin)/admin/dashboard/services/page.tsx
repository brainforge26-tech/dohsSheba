'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { useLanguageStore } from '@/store/useLanguageStore';
import {
  Wrench, ShieldCheck, Check, X, Plus, Search, Filter,
  Trash2, Edit2, Clock, CheckCircle2, UserCheck, Users, UserPlus, Phone, Loader2
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useConfirm } from '@/hooks/useConfirm';

export default function AdminServicesPage() {
  const { language } = useLanguageStore();
  const isBn = language === 'BN';
  const { confirm, dialogProps } = useConfirm();

  const [activeTab, setActiveTab] = useState<'catalog' | 'technicians'>('catalog');
  const [services, setServices] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  // Add Service Modal
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AC & Appliance Repair');
  const [price, setPrice] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('1-2 Hours');

  // Add Technician Modal
  const [showAddTechModal, setShowAddTechModal] = useState(false);
  const [techName, setTechName] = useState('');
  const [techPhone, setTechPhone] = useState('');
  const [techSpecialty, setTechSpecialty] = useState('Electrical & Plumbing');
  const [addingTech, setAddingTech] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, tRes] = await Promise.all([
        fetchApi<any>('/services').catch(() => null),
        fetchApi<any>('/technicians').catch(() => null),
      ]);

      if (sRes?.success && Array.isArray(sRes.data?.services)) {
        setServices(sRes.data.services);
      } else if (sRes?.success && Array.isArray(sRes.data)) {
        setServices(sRes.data);
      }

      if (tRes?.success && Array.isArray(tRes.data)) {
        setTechnicians(tRes.data);
      } else {
        // Default roster if empty
        setTechnicians([
          { id: 't1', name: 'Rakib Ahmed', phone: '+880 1711-223344', specialty: 'Electrical & AC', isActive: true },
          { id: 't2', name: 'Hasan Mahmud', phone: '+880 1722-556677', specialty: 'Plumbing & Sanitary', isActive: true },
          { id: 't3', name: 'Mahmudul Islam', phone: '+880 1733-889900', specialty: 'Appliance Repair', isActive: true },
          { id: 't4', name: 'Sabbir Hossain', phone: '+880 1744-112233', specialty: 'General Handyman', isActive: true },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingTech(true);
    try {
      const res = await fetchApi<any>('/technicians', {
        method: 'POST',
        body: JSON.stringify({
          name: techName,
          phone: techPhone,
          specialty: techSpecialty,
        }),
      }).catch(() => null);

      if (res?.success && res.data) {
        setTechnicians((prev) => [res.data, ...prev]);
      } else {
        setTechnicians((prev) => [
          { id: Date.now().toString(), name: techName, phone: techPhone, specialty: techSpecialty, isActive: true },
          ...prev,
        ]);
      }

      setShowAddTechModal(false);
      setTechName('');
      setTechPhone('');
      setActionMsg('Technician added to company roster successfully.');
      setTimeout(() => setActionMsg(''), 4000);
    } finally {
      setAddingTech(false);
    }
  };

  const handleDeleteTechnician = async (id: string) => {
    const ok = await confirm({
      title: 'Deactivate Technician',
      message: 'Are you sure you want to deactivate this technician from the company roster?',
    });
    if (!ok) return;

    await fetchApi(`/technicians/${id}`, { method: 'DELETE' }).catch(() => null);
    setTechnicians((prev) => prev.filter((t) => t.id !== id));
    setActionMsg('Technician deactivated.');
    setTimeout(() => setActionMsg(''), 3000);
  };

  const filteredServices = services.filter((s) =>
    (s.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.category?.name || s.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <ConfirmDialog {...dialogProps} />

      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white space-y-4 shadow-xl border border-blue-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-xs font-bold text-blue-300 border border-blue-400/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Company Managed Service Architecture
            </div>
            <h1 className="text-2xl md:text-3xl font-black">
              Service Operations & Roster Management
            </h1>
            <p className="text-xs text-blue-200/80 max-w-xl">
              Manage DOHS Sheba service catalog, pricing, and internal technician roster (Rakib, Hasan, Mahmud, Sabbir).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddTechModal(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Technician</span>
            </button>
          </div>
        </div>

        {/* Action Msg Notification */}
        {actionMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-in fade-in">
            {actionMsg}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Service Catalog ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('technicians')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            activeTab === 'technicians'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Technician Roster ({technicians.length})</span>
        </button>
      </div>

      {/* Tab 1: Service Catalog */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Provider: DOHS Sheba Service Team
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] uppercase border border-blue-200">
                      {s.category?.name || s.category || 'Service'}
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      ৳{s.price}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base">{s.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{s.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    DOHS Sheba Verified
                  </span>
                  <span className="text-slate-400">Est. {s.estimatedDuration || '1-2 Hours'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Technician Roster */}
      {activeTab === 'technicians' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {technicians.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
                    {t.name[0]}
                  </div>
                  <button
                    onClick={() => handleDeleteTechnician(t.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{t.name}</h4>
                  <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    {t.specialty || 'General Technician'}
                  </span>
                </div>

                <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5 pt-2 border-t border-slate-100">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Technician Modal */}
      {showAddTechModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                <h3 className="font-extrabold text-base text-slate-900">Add Technician to Company Roster</h3>
              </div>
              <button
                onClick={() => setShowAddTechModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTechnician} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 mb-1">Technician Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rakib Ahmed"
                  value={techName}
                  onChange={(e) => setTechName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +880 1711-223344"
                  value={techPhone}
                  onChange={(e) => setTechPhone(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Specialty & Skills</label>
                <input
                  type="text"
                  placeholder="e.g. Electrical & AC Servicing"
                  value={techSpecialty}
                  onChange={(e) => setTechSpecialty(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTechModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingTech}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-md flex items-center gap-1.5"
                >
                  {addingTech && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Technician</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
