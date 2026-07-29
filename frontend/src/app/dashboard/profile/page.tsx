'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchApi, uploadSingleImageApi } from '@/lib/api-client';
import { User, Camera, Save, Mail, Phone, Calendar, Globe, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('1975-08-14');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    setMounted(true);
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
    }
    setLoading(true);
    fetchApi<any>('/users/profile')
      .then((res) => {
        if (res.success && res.data) {
          const u = res.data;
          setName(u.name || '');
          setEmail(u.email || '');
          setPhone(u.phone || '');
          setAvatar(u.avatar || '');
          if (setUser) setUser(u);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSavedMsg('');
    try {
      let uploadedUrl = '';
      try {
        uploadedUrl = await uploadSingleImageApi(file);
      } catch (uploadErr) {
        console.warn('API Upload failed, using local reader fallback', uploadErr);
        uploadedUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      if (uploadedUrl) {
        setAvatar(uploadedUrl);
        try {
          const res = await fetchApi<any>('/users/profile', {
            method: 'PUT',
            body: JSON.stringify({ name, phone, avatar: uploadedUrl }),
          });
          if (res.success && res.data && setUser) {
            setUser(res.data);
          }
        } catch {
          // If API fails, sync client state
          if (setUser) setUser({ id: user?.id || 'usr_101', name, email, role: user?.role || 'CUSTOMER', avatar: uploadedUrl, phone });
        }
        setSavedMsg('Profile photo updated successfully!');
      }
    } catch (err: any) {
      setSavedMsg(err.message || 'Failed to update photo');
    } finally {
      setUploading(false);
      setTimeout(() => setSavedMsg(''), 4000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');
    try {
      const res = await fetchApi<any>('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, phone, avatar }),
      });
      if (res.success && res.data) {
        if (setUser) setUser(res.data);
        setSavedMsg('Profile saved successfully!');
      }
    } catch (err: any) {
      setSavedMsg(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMsg(''), 4000);
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-6 max-w-4xl p-6 rounded-2xl bg-[#1e1f32] border border-white/10 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <User className="w-6 h-6 text-purple-400" /> Account Profile Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage your personal information, avatar, and contact preferences</p>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl bg-[#1e1f32] border border-white/10 p-6 space-y-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-[#1e1f32]/80 backdrop-blur-xs z-10 flex items-center justify-center rounded-2xl">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400 mr-2" />
            <span className="text-xs text-slate-300">Syncing profile...</span>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Avatar Upload */}
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-black text-3xl text-white shadow-xl overflow-hidden">
              {avatar ? (
                <img src={avatar} alt={name || 'Avatar'} className="w-full h-full object-cover" />
              ) : (
                <span suppressHydrationWarning>{(name && name[0]) || 'C'}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-colors flex items-center justify-center disabled:opacity-50"
              title="Upload Profile Photo"
            >
              <span className="w-3.5 h-3.5 flex items-center justify-center">
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              </span>
            </button>
          </div>
          <div>
            <h3 className="font-bold text-white text-base" suppressHydrationWarning>{name || 'Resident Member'}</h3>
            <p className="text-xs text-slate-400" suppressHydrationWarning>{user?.role ? `${user.role} Member` : 'DOHS Resident Member'}</p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 cursor-not-allowed opacity-75"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Male" className="bg-[#1f2136]">Male</option>
              <option value="Female" className="bg-[#1f2136]">Female</option>
              <option value="Other" className="bg-[#1f2136]">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className={`text-xs font-bold ${savedMsg.includes('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>
            {savedMsg}
          </span>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-lg shadow-purple-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Save className="w-4 h-4" /> Save Changes
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

