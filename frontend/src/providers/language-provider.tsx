'use client';

import React, { useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useSiteSettingsStore } from '@/store/useSiteSettingsStore';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguageStore();

  useEffect(() => {
    useSiteSettingsStore.getState().fetchSettings();
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const targetLang = language === 'BN' ? 'bn' : 'en';
      document.documentElement.lang = targetLang;
      document.cookie = `dohssheba-lang=${language}; path=/; max-age=31536000; SameSite=Lax`;

      // Clean up legacy Google translate script if it was loaded in DOM
      const legacyScript = document.getElementById('google-translate-script');
      if (legacyScript) {
        legacyScript.remove();
      }
    }
  }, [language]);

  return <>{children}</>;
}
