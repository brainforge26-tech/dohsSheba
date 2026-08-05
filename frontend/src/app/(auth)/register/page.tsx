'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchApi } from '@/lib/api-client';
import { UserRole } from '@/types/user';
import { User, Mail, Lock, PhoneCall, ArrowRight, ShieldCheck, Store, Wrench, AlertTriangle } from 'lucide-react';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { useToast } from '@/components/ui/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { success: toastSuccess, error: toastError } = useToast();
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
        const { user, token, accessToken, refreshToken } = res.data;
        const validToken = token || accessToken;
        if (typeof window !== 'undefined' && validToken) {
          document.cookie = `token=${validToken}; path=/; max-age=604800; SameSite=Lax`;
        }
        setAuth(user, validToken, refreshToken);
        toastSuccess('Account Created!', `Welcome to DOHS Sheba, ${user.name || user.email}!`);
        if (role === 'PROVIDER') router.push('/provider/dashboard');
        else if (role === 'SELLER') router.push('/seller/dashboard');
        else if (role === 'RIDER') router.push('/rider/dashboard');
        else router.push('/dashboard');
      } else {
        const msg = res.message || 'Registration failed';
        setError(msg);
        toastError('Registration Failed', msg);
      }
    } catch (err: any) {
      const msg = err?.message || 'Registration failed. Please try again.';
      setError(msg);
      toastError('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-foreground relative overflow-hidden">
      {/* Dynamic Ambient Background Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300">
              dS
            </div>
            <div className="text-left">
              <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                dohsSheba
              </span>
              <span className="block text-[9px] font-bold text-slate-400 -mt-1 tracking-wider uppercase">
                Savar DOHS Marketplace
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white pt-2">Create Your Account</h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">Join DOHS residents, technicians & shops.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 font-medium animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Login Button */}
        <GoogleLoginButton buttonText="Sign up with Google" onError={(err) => setError(err)} />

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
            <span className="bg-slate-900/90 px-3 text-slate-400 rounded-full border border-white/5">Or register with email</span>
          </div>
        </div>

        {/* Role Picker Tabs */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block text-center">
            Select Account Role
          </label>
          <div className="grid grid-cols-3 gap-2.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                role === 'CUSTOMER'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/20 font-extrabold scale-[1.02]'
                  : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[11px]">Resident</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('PROVIDER')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                role === 'PROVIDER'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/20 font-extrabold scale-[1.02]'
                  : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span className="text-[11px]">Technician</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('SELLER')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                role === 'SELLER'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20 font-extrabold scale-[1.02]'
                  : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              <span className="text-[11px]">Shop Seller</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-300 mb-1.5 font-bold">
              {role === 'SELLER' ? 'Shop / Business Name' : role === 'PROVIDER' ? 'Company / Agency Name' : 'Full Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fresh Bazaar DOHS"
              className="w-full h-11 px-4 rounded-2xl border border-white/10 bg-slate-950/90 text-white placeholder:text-slate-500 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all shadow-inner"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1.5 font-bold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full h-11 px-4 rounded-2xl border border-white/10 bg-slate-950/90 text-white placeholder:text-slate-500 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all shadow-inner"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1.5 font-bold">Mobile Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1700-000000"
              className="w-full h-11 px-4 rounded-2xl border border-white/10 bg-slate-950/90 text-white placeholder:text-slate-500 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all shadow-inner"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1.5 font-bold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create strong password"
              className="w-full h-11 px-4 rounded-2xl border border-white/10 bg-slate-950/90 text-white placeholder:text-slate-500 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all shadow-inner"
              required
            />
          </div>

          <LoadingButton
            type="submit"
            isLoading={loading}
            loadingText="Creating Account..."
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98]"
          >
            <span>Register as {role}</span>
            <ArrowRight className="w-4 h-4" />
          </LoadingButton>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
          Already have an account?{' '}
          <Link href="/login" className="font-extrabold text-blue-400 hover:text-blue-300 underline transition-colors ml-1">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
