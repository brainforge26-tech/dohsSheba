'use client';

import React, { useState } from 'react';
import { Settings, Bell, Shield, Truck, CreditCard, Moon, Save, Loader2, CheckCircle2, Globe, Eye, EyeOff } from 'lucide-react';

export default function SellerSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState('');
  const [showPass, setShowPass] = useState(false);

  const [notif, setNotif] = useState({ newOrder: true, statusUpdate: true, review: true, lowStock: true, payment: true, promo: false });
  const [privacy, setPrivacy] = useState({ storeVisible: true, showPhone: false, showEmail: true });
  const [shipping, setShipping] = useState({ freeAbove: '500', flatFee: '60', expressEnabled: true, codEnabled: true });
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' });

  React.useEffect(() => {
    try {
      const savedNotif = localStorage.getItem('dohs_seller_notif');
      if (savedNotif) setNotif(JSON.parse(savedNotif));
      const savedShipping = localStorage.getItem('dohs_seller_shipping');
      if (savedShipping) setShipping(JSON.parse(savedShipping));
    } catch {}
  }, []);

  const handleSave = (section: string) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (section === 'Notifications') localStorage.setItem('dohs_seller_notif', JSON.stringify(notif));
      if (section === 'Shipping') localStorage.setItem('dohs_seller_shipping', JSON.stringify(shipping));
      setSaved(`${section} preferences saved successfully!`);
      setTimeout(() => setSaved(''), 3000);
    }, 400);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange}
      className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-indigo-500' : 'bg-white/20'}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-500 mb-0.5">Dashboard / Settings</p>
        <h1 className="font-black text-white text-xl flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" /> Account Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage notifications, privacy, shipping, and security preferences</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
          <CheckCircle2 className="w-4 h-4" /> {saved}
        </div>
      )}

      {/* Notifications */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          <h2 className="font-bold text-white text-sm">Notification Preferences</h2>
        </div>
        <div className="divide-y divide-white/5">
          {([
            ['newOrder',     'New Order',          'Alert when a new order is placed'],
            ['statusUpdate', 'Order Status Update', 'Alert when order status changes'],
            ['review',       'New Review',          'Alert when a customer leaves a review'],
            ['lowStock',     'Low Stock Alert',     'Alert when product stock is low'],
            ['payment',      'Payment Received',    'Alert on every payment settlement'],
            ['promo',        'Promotional Emails',  'Marketing and promo announcements'],
          ] as [keyof typeof notif, string, string][]).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-[11px] text-slate-500">{desc}</p>
              </div>
              <Toggle checked={notif[key]} onChange={() => setNotif(n => ({ ...n, [key]: !n[key] }))} />
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => handleSave('Notifications')} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Preferences
          </button>
        </div>
      </div>

      {/* Privacy */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          <h2 className="font-bold text-white text-sm">Privacy & Visibility</h2>
        </div>
        <div className="divide-y divide-white/5">
          {([
            ['storeVisible', 'Store Visible on Marketplace', 'Customers can find and visit your store'],
            ['showPhone',    'Show Phone Number',            'Display phone publicly on store profile'],
            ['showEmail',    'Show Email Address',           'Display email on store profile'],
          ] as [keyof typeof privacy, string, string][]).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-[11px] text-slate-500">{desc}</p>
              </div>
              <Toggle checked={privacy[key]} onChange={() => setPrivacy(p => ({ ...p, [key]: !p[key] }))} />
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => handleSave('Privacy')} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Privacy Settings
          </button>
        </div>
      </div>

      {/* Shipping */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <Truck className="w-4 h-4 text-indigo-400" />
          <h2 className="font-bold text-white text-sm">Shipping Settings</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Free Shipping Above (৳)</label>
              <input type="number" value={shipping.freeAbove}
                onChange={(e) => setShipping(s => ({ ...s, freeAbove: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Flat Shipping Fee (৳)</label>
              <input type="number" value={shipping.flatFee}
                onChange={(e) => setShipping(s => ({ ...s, flatFee: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5">
            <div>
              <p className="text-sm font-semibold text-white">Express Delivery</p>
              <p className="text-[11px] text-slate-500">Allow customers to select express shipping</p>
            </div>
            <Toggle checked={shipping.expressEnabled} onChange={() => setShipping(s => ({ ...s, expressEnabled: !s.expressEnabled }))} />
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5">
            <div>
              <p className="text-sm font-semibold text-white">Cash on Delivery (COD)</p>
              <p className="text-[11px] text-slate-500">Accept COD payments for orders</p>
            </div>
            <Toggle checked={shipping.codEnabled} onChange={() => setShipping(s => ({ ...s, codEnabled: !s.codEnabled }))} />
          </div>
          <button onClick={() => handleSave('Shipping')} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Shipping Settings
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" />
          <h2 className="font-bold text-white text-sm">Security & Password</h2>
        </div>
        <div className="p-5 space-y-4">
          {[
            ['current', 'Current Password'],
            ['next',    'New Password'],
            ['confirm', 'Confirm New Password'],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-bold text-slate-300 mb-2">{label}</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'}
                  value={password[key as keyof typeof password]}
                  onChange={(e) => setPassword(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-4 pr-10 py-2.5 rounded-xl bg-[#12131f] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                {key === 'next' && (
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button onClick={() => handleSave('Password')} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
