'use client';

import React, { useState } from 'react';
import { ShieldAlert, Key, Smartphone, Laptop, Lock, CheckCircle2 } from 'lucide-react';

export default function SecurityPage() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg('Passwords do not match');
      return;
    }
    setMsg('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-indigo-400" /> Account Security
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage login security, active sessions, and password updates</p>
      </div>

      {/* Change Password Card */}
      <form onSubmit={handlePasswordChange} className="rounded-2xl bg-[#1e1f32] border border-white/10 p-6 space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-400" /> Change Password
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {msg && <p className="text-xs font-bold text-emerald-400">{msg}</p>}

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20"
        >
          Update Password
        </button>
      </form>

      {/* Two Factor Authentication Card */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" /> Two-Factor Authentication (2FA)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Secure your account with SMS verification code on login</p>
        </div>

        <button
          onClick={() => setTwoFactor(!twoFactor)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            twoFactor ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-400'
          }`}
        >
          {twoFactor ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      {/* Active Devices & Login History */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-6 space-y-4">
        <h3 className="font-bold text-white text-sm">Active Sessions & Devices</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="font-bold text-xs text-white">Windows PC · Chrome Browser</h4>
                <p className="text-[10px] text-slate-400">IP: 103.114.24.12 · Dhaka, Bangladesh (Current Session)</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-purple-400" />
              <div>
                <h4 className="font-bold text-xs text-white">iPhone 15 Pro · DOHS Resident App</h4>
                <p className="text-[10px] text-slate-400">IP: 103.114.24.18 · Dhaka, Bangladesh</p>
              </div>
            </div>
            <button className="text-[10px] font-bold text-rose-400 hover:underline">Revoke</button>
          </div>
        </div>
      </div>
    </div>
  );
}
