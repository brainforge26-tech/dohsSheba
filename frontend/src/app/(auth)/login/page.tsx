'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchApi } from '@/lib/api-client';
import { User, Lock, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetchApi<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.data) {
        const { user, token, accessToken } = res.data;
        const validToken = token || accessToken;
        if (typeof window !== 'undefined' && validToken) {
          document.cookie = `token=${validToken}; path=/; max-age=604800; SameSite=Lax`;
        }
        setAuth(user, validToken);
        const userRole = user.role;
        if (userRole === 'SUPER_ADMIN') router.push('/dashboard/super-admin');
        else if (userRole === 'ADMIN') router.push('/admin/dashboard/ecommerce');
        else if (userRole === 'PROVIDER') router.push('/provider/dashboard');
        else if (userRole === 'SELLER') router.push('/seller/dashboard');
        else if (userRole === 'RIDER') router.push('/rider/dashboard');
        else router.push('/dashboard');
      } else {
        setError(res.message || 'Invalid email or password');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please try again.');
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
          <h1 className="text-2xl font-black text-white pt-2">Welcome Back</h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">Sign in to manage your orders, services & workspace.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 font-medium animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Login Button */}
        <GoogleLoginButton onError={(err) => setError(err)} />

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
            <span className="bg-slate-900/90 px-3 text-slate-400 rounded-full border border-white/5">Or sign in with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-300 mb-1.5 font-bold">Email Address</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter.your.email@example.com"
                className="w-full h-11 pl-11 pr-4 rounded-2xl border border-white/10 bg-slate-950/90 text-white placeholder:text-slate-500 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all shadow-inner"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-bold">Password</label>
              <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300 transition-colors font-bold text-[11px]">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-11 pr-4 rounded-2xl border border-white/10 bg-slate-950/90 text-white placeholder:text-slate-500 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all shadow-inner"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In to Account</span>}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
          Don't have an account yet?{' '}
          <Link href="/register" className="font-extrabold text-blue-400 hover:text-blue-300 underline transition-colors ml-1">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
