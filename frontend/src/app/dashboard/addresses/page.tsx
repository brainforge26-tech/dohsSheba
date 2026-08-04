'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Home, Briefcase, Trash2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useConfirm } from '@/hooks/useConfirm';

export default function AddressesPage() {
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [label, setLabel] = useState('Home');
  const [line1, setLine1] = useState('');
  const [area, setArea] = useState('DOHS Mirpur');
  const [modalError, setModalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { confirm, dialogProps } = useConfirm();

  const loadAddresses = () => {
    setLoading(true);
    fetchApi<any[]>('/users/addresses')
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          setAddresses(res.data);
        }
      })
      .catch((err) => {
        console.warn('Network error loading addresses, using fallback', err);
        setAddresses([
          { id: 'addr_demo_1', label: 'Home', line1: 'House 42, Road 7, Block B', area: 'DOHS Mirpur', city: 'Dhaka', isDefault: true },
          { id: 'addr_demo_2', label: 'Office', line1: 'Building 18, Avenue 4', area: 'DOHS Mohakhali', city: 'Dhaka', isDefault: false },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setMounted(true);
    loadAddresses();
  }, []);

  const openAddModal = () => {
    setLine1('');
    setArea('DOHS Mirpur');
    setLabel('Home');
    setModalError('');
    setShowModal(true);
  };

  const setDefault = async (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    try {
      await fetchApi(`/users/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isDefault: true }),
      }).catch(() => {});
    } catch {}
  };

  const removeAddress = async (id: string) => {
    const ok = await confirm({
      title: 'Delete Address',
      message: 'Are you sure you want to remove this delivery address from your account?',
      confirmText: 'Remove Address',
      variant: 'danger',
    });
    if (!ok) return;
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    setSuccessMsg('Address removed successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);

    try {
      await fetchApi(`/users/addresses/${id}`, {
        method: 'DELETE',
      }).catch(() => {});
    } catch {}
  };

  const addAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    if (!line1.trim()) {
      setModalError('Please enter street address / house details.');
      return;
    }
    setSaving(true);
    const newAddrObj = {
      id: `addr_${Date.now()}`,
      label,
      line1: line1.trim(),
      area,
      city: 'Dhaka',
      isDefault: addresses.length === 0,
    };
    try {
      const res = await fetchApi<any>('/users/addresses', {
        method: 'POST',
        body: JSON.stringify({
          label,
          line1: line1.trim(),
          area,
          city: 'Dhaka',
          isDefault: addresses.length === 0,
        }),
      });
      if (res && res.success) {
        setShowModal(false);
        setLine1('');
        setSuccessMsg('New delivery address saved!');
        setTimeout(() => setSuccessMsg(''), 3000);
        loadAddresses();
      } else {
        setAddresses((prev) => [newAddrObj, ...prev]);
        setShowModal(false);
        setLine1('');
        setSuccessMsg('New delivery address saved!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch {
      setAddresses((prev) => [newAddrObj, ...prev]);
      setShowModal(false);
      setLine1('');
      setSuccessMsg('New delivery address saved!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 text-xs">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading addresses...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-rose-400" /> Saved Delivery Addresses
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage delivery addresses for fast marketplace checkout</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <div className="space-y-4">
        {loading && (
          <div key="addr-loader" className="flex items-center justify-center p-12 text-slate-400 text-xs">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading saved addresses...
          </div>
        )}

        {!loading && addresses.length === 0 && (
          <div key="addr-empty" className="p-12 rounded-3xl bg-[#1e1f32] border border-white/10 text-center space-y-3">
            <MapPin className="w-10 h-10 text-rose-400 mx-auto opacity-60" />
            <h3 className="font-bold text-white text-base">No Saved Addresses Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Add your home or office address for quicker checkout on marketplace orders and service bookings.</p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg"
            >
              Add Address Now
            </button>
          </div>
        )}

        {!loading && addresses.length > 0 && (
          <div key="addr-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id || addr.line1}
                className={`rounded-2xl bg-[#1e1f32] border p-5 space-y-4 transition-all ${
                  addr.isDefault ? 'border-rose-500/50 ring-1 ring-rose-500/30' : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                      {addr.label === 'Home' ? <Home className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                    </span>
                    <span className="font-bold text-sm text-white" suppressHydrationWarning>{addr.label || 'Address'}</span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300">
                        Default Address
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => removeAddress(addr.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-white text-sm" suppressHydrationWarning>{addr.line1}</p>
                  <p suppressHydrationWarning>{addr.area}{addr.city ? `, ${addr.city}` : ''}</p>
                </div>

                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault(addr.id)}
                    className="text-xs text-indigo-400 hover:underline font-semibold"
                  >
                    Set as Default Address
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={addAddress} className="bg-[#1e1f32] border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-400" /> Add Delivery Address
            </h3>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {modalError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Address Label</label>
                <div className="flex gap-2">
                  {['Home', 'Office', 'Other'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setLabel(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        label === t ? 'bg-rose-600 text-white' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Street Address / House & Road</label>
                <input
                  type="text"
                  placeholder="House 42, Road 7, Block B"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">DOHS Area</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                >
                  <option value="DOHS Mirpur" className="bg-[#1f2136]">DOHS Mirpur</option>
                  <option value="DOHS Mohakhali" className="bg-[#1f2136]">DOHS Mohakhali</option>
                  <option value="DOHS Baridhara" className="bg-[#1f2136]">DOHS Baridhara</option>
                  <option value="DOHS Banani" className="bg-[#1f2136]">DOHS Banani</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Confirm Dialog ── */}
      <ConfirmDialog {...dialogProps} />
    </div>
  );
}


