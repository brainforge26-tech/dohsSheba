'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchApi } from '@/lib/api-client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, token, user } = useAuthStore();

  useEffect(() => {
    // If we have a token (or cookie) but no full user profile in state or on mount, sync with backend /me
    const hasTokenCookie = typeof document !== 'undefined' && document.cookie.includes('token=');

    if (hasTokenCookie || token) {
      async function restoreSession() {
        try {
          const res = await fetchApi<any>('/auth/me');
          if (res.success && res.data) {
            setAuth(res.data, token || undefined);
          }
        } catch (err: any) {
          if (err?.status === 401) {
            useAuthStore.getState().logout();
          }
        }
      }
      restoreSession();
    }
  }, [setAuth, token]);

  return <>{children}</>;
}
