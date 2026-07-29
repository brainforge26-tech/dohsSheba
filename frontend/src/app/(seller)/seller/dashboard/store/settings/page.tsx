'use client';

import React, { useState } from 'react';
import { Settings2, Save, Loader2, CheckCircle2, Truck, CreditCard, Clock, Moon, Bell, Palette, AlertTriangle } from 'lucide-react';

export default function StoreSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState('');

  const [general, setGeneral] = useState({
    currency: 'BDT', language: 'bn', timezone: 'Asia/Dhaka',
    minOrderAmount: '100', lowStockThreshold: '5',
  });
  const [payment, setPayment] = useState({ bkash: true, nagad: true, card: false, cod: true, banking: true });
  const [holiday, setHoliday] = useState({ enabled: false, from: '', to: '', message: 'We are on holiday. Orders will resume soon.' });

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange}
      className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-indigo-500' : 'bg-white/20'}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
    </button>
  );

  const handleSave = (section: string) => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(`${section} saved!`); setTimeout(() => setSaved(''), 3000); }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-slate-500 mb-0.5">Store / Settings</p>
        <h1 className="font-black text-white text-xl flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-indigo-400" /> Store Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Configure general, payment, and operational preferences for your store</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
          <CheckCircle2 className="w-4 h-4" /> {saved}
        </div>
      )}

      {/* General */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-indigo-400" />
          <h2 className="font-bold text-white text-sm">General Settings</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Currency</label>
              <select value={general.currency} onChange={(e) => setGeneral(g => ({ ...g, currency: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500">
                <option value="BDT">BDT (৳) — Bangladeshi Taka</option>
                <option value="USD">USD ($) — US Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Language</label>
              <select value={general.language} onChange={(e) => setGeneral(g => ({ ...g, language: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500">
                <option value="bn">বাংলা (Bengali)</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Timezone</label>
              <select value={general.timezone} onChange={(e) => setGeneral(g => ({ ...g, timezone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500">
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Minimum Order Amount (৳)</label>
              <input type="number" value={general.minOrderAmount} onChange={(e) => setGeneral(g => ({ ...g, minOrderAmount: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Low Stock Alert Threshold (units)</label>
              <input type="number" value={general.lowStockThreshold} onChange={(e) => setGeneral(g => ({ ...g, lowStockThreshold: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <button onClick={() => handleSave('General settings')} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-indigo-400" />
          <h2 className="font-bold text-white text-sm">Accepted Payment Methods</h2>
        </div>
        <div className="divide-y divide-white/5">
          {([
            ['bkash',   'bKash',          'Mobile banking — 1.5% processing fee'],
            ['nagad',   'Nagad',          'Mobile banking — 1.5% processing fee'],
            ['card',    'Credit/Debit Card', 'Visa, Mastercard — 2% fee'],
            ['cod',     'Cash on Delivery',  'No fee — available for orders under ৳5,000'],
            ['banking', 'Online Banking',    'Direct bank transfer'],
          ] as [keyof typeof payment, string, string][]).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-[11px] text-slate-500">{desc}</p>
              </div>
              <Toggle checked={payment[key]} onChange={() => setPayment(p => ({ ...p, [key]: !p[key] }))} />
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => handleSave('Payment settings')} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Payment Methods
          </button>
        </div>
      </div>

      {/* Holiday Mode */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-400" />
            <h2 className="font-bold text-white text-sm">Holiday Mode</h2>
          </div>
          <Toggle checked={holiday.enabled} onChange={() => setHoliday(h => ({ ...h, enabled: !h.enabled }))} />
        </div>
        {holiday.enabled && (
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              Holiday mode is ON. Your store will not accept new orders during this period.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">From</label>
                <input type="date" value={holiday.from} onChange={(e) => setHoliday(h => ({ ...h, from: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">To</label>
                <input type="date" value={holiday.to} onChange={(e) => setHoliday(h => ({ ...h, to: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Holiday Message</label>
              <textarea rows={2} value={holiday.message} onChange={(e) => setHoliday(h => ({ ...h, message: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>
        )}
        <div className="p-4 border-t border-white/10">
          <button onClick={() => handleSave('Holiday mode')} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Holiday Settings
          </button>
        </div>
      </div>
    </div>
  );
}
