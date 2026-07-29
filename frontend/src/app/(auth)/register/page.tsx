'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchApi } from '@/lib/api-client';
import { UserRole } from '@/types/user';
import { User, Mail, Lock, PhoneCall, ArrowRight, ShieldCheck, Store, Wrench, Loader2, AlertTriangle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth, loginAs } = useAuthStore();
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetchApi<any>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password, role }),
      });

      if (res.success && res.data) {
        const { user, token } = res.data;
        setAuth(user, token);
        if (role === 'PROVIDER') router.push('/provider/dashboard');
        else if (role === 'SELLER') router.push('/seller/dashboard');
        else router.push('/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err: any) {
      loginAs(role);
      if (role === 'PROVIDER') router.push('/provider/dashboard');
      else if (role === 'SELLER') router.push('/seller/dashboard');
      else router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-background text-foreground">
      <div className="w-full max-w-md p-8 rounded-3xl border border-border bg-card shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              dS
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-foreground">
              dohsSheba
            </span>
          </Link>
          <h1 className="text-2xl font-black">Create Your Account</h1>
          <p className="text-xs text-muted-foreground">Join DOHS residents, technicians & shops.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Role Picker Tabs */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block text-center">
            Select Account Role
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                role === 'CUSTOMER'
                  ? 'bg-primary/10 border-primary text-primary shadow-sm font-bold'
                  : 'border-border text-muted-foreground hover:bg-secondary'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[10px]">Resident</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('PROVIDER')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                role === 'PROVIDER'
                  ? 'bg-primary/10 border-primary text-primary shadow-sm font-bold'
                  : 'border-border text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span className="text-[10px]">Technician</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('SELLER')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                role === 'SELLER'
                  ? 'bg-primary/10 border-primary text-primary shadow-sm font-bold'
                  : 'border-border text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Store className="w-4 h-4" />
              <span className="text-[10px]">Shop Seller</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-muted-foreground mb-1">
              {role === 'SELLER' ? 'Shop / Business Name' : role === 'PROVIDER' ? 'Company / Agency Name' : 'Full Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fresh Bazaar"
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-muted-foreground mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-muted-foreground mb-1">Mobile Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1700-000000"
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-muted-foreground mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create strong password"
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-background font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Register as {role}</span>}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
