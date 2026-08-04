'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchApi } from '@/lib/api-client';
import { Loader2, ShieldAlert } from 'lucide-react';

// Suppress the known FedCM AbortError that Google GSI emits when the
// One-Tap flow is cancelled by navigation / component unmount.
// This is a browser-level signal cancellation — NOT a real failure.
if (typeof window !== 'undefined') {
  const _origConsoleError = console.error.bind(console);
  console.error = (...args: any[]) => {
    const msg = args[0];
    if (
      typeof msg === 'string' &&
      (msg.includes('[GSI_LOGGER]') || msg.includes('FedCM') || msg.includes('AbortError'))
    ) {
      // Silently ignore: these are expected browser-level GSI flow cancellations
      return;
    }
    _origConsoleError(...args);
  };
}

interface GoogleLoginButtonProps {
  buttonText?: string;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

export function GoogleLoginButton({
  buttonText = 'Continue with Google',
  onSuccess,
  onError,
}: GoogleLoginButtonProps) {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [configError, setConfigError] = useState('');
  const [originError, setOriginError] = useState(false);
  const isMountedRef = useRef(true);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Dynamically load Google Identity Services (GIS) SDK
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!clientId) {
      setConfigError('NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing in .env.local');
      return;
    }

    if ((window as any).google?.accounts?.id) {
      setScriptLoaded(true);
      initializeGoogleGSI();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setScriptLoaded(true);
      initializeGoogleGSI();
    };
    script.onerror = () => {
      setConfigError('Failed to load Google Sign-In SDK script.');
    };
    document.body.appendChild(script);

    // Cleanup: cancel any pending One-Tap prompt on unmount
    return () => {
      isMountedRef.current = false;
      try {
        if ((window as any).google?.accounts?.id) {
          (window as any).google.accounts.id.cancel();
        }
      } catch (_) {}
    };
  }, [clientId]);

  const initializeGoogleGSI = () => {
    if (typeof window === 'undefined' || !(window as any).google?.accounts?.id || !clientId) return;

    try {
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    } catch (e: any) {
      console.warn('Google GIS init notice:', e);
    }
  };

  /**
   * Callback invoked by Google GIS script upon successful authentication in popup.
   * Sends raw Google ID Token (credential) to backend for verification.
   */
  const handleGoogleCallback = async (response: { credential?: string }) => {
    if (!response || !response.credential) {
      if (onError) onError('Google authentication cancelled or invalid token received.');
      return;
    }
    await executeGoogleAuth(response.credential);
  };

  const executeGoogleAuth = async (idToken: string) => {
    setLoading(true);
    setOriginError(false);
    try {
      const res = await fetchApi<any>('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential: idToken }),
      });

      if (res.success && res.data) {
        const { user, token, accessToken } = res.data;
        const validToken = token || accessToken;

        if (typeof window !== 'undefined' && validToken) {
          document.cookie = `token=${validToken}; path=/; max-age=604800; SameSite=Lax`;
        }

        setAuth(user, validToken);
        if (onSuccess) onSuccess();

        const userRole = user.role;
        if (userRole === 'SUPER_ADMIN') router.push('/dashboard/super-admin');
        else if (userRole === 'ADMIN') router.push('/admin/dashboard/ecommerce');
        else if (userRole === 'PROVIDER') router.push('/provider/dashboard');
        else if (userRole === 'SELLER') router.push('/seller/dashboard');
        else if (userRole === 'RIDER') router.push('/rider/dashboard');
        else router.push('/dashboard');
      } else {
        if (onError) onError(res.message || 'Google authentication failed');
      }
    } catch (err: any) {
      if (onError) onError(err?.message || 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    if (!clientId) {
      const msg = 'NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing. Please set it in your .env file.';
      if (onError) onError(msg);
      alert(msg);
      return;
    }

    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      initializeGoogleGSI();
      try {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (!isMountedRef.current) return;
          if (notification.isNotDisplayed()) {
            const reason = notification.getNotDisplayedReason();
            if (reason === 'origin_mismatch' || reason === 'opt_out_or_cleared_cookies') {
              setOriginError(true);
            }
          }
          if (notification.isDismissedMoment?.()) {
            // User closed the prompt — not an error
          }
        });
      } catch (e: any) {
        // Ignore AbortError — it is a normal FedCM cancellation, not a real failure
        if (e?.name === 'AbortError' || e?.message?.includes('AbortError') || e?.message?.includes('signal')) return;
        if (isMountedRef.current) setOriginError(true);
      }
    } else {
      if (onError) onError('Google Sign-In SDK is loading. Please try again in a moment.');
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className="w-full py-3.5 px-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 text-white font-extrabold text-xs transition-all duration-300 flex items-center justify-center gap-3 border border-white/15 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-400 relative z-10" />
        ) : (
          <div className="p-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform relative z-10">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
        )}
        <span className="relative z-10 tracking-wide">{loading ? 'Authenticating with Google...' : buttonText}</span>
      </button>

      {/* Google Console Setup Notice */}
      {(originError || configError) && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Google OAuth Origin Setup Required</span>
          </div>
          <p className="text-[11px] text-amber-200/90">
            Google Cloud Console requires <code className="bg-amber-950/80 px-1.5 py-0.5 rounded text-amber-300 font-mono">http://localhost:3000</code> to be added to <strong>Authorized JavaScript origins</strong>.
          </p>
        </div>
      )}
    </div>
  );
}

