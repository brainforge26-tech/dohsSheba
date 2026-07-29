'use client';

import React, { useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguageStore();

  useEffect(() => {
    const setCookie = (name: string, value: string) => {
      document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
      const domain = window.location.hostname;
      if (domain && domain !== 'localhost') {
        document.cookie = `${name}=${value}; path=/; domain=.${domain}; max-age=31536000; SameSite=Lax`;
      }
    };

    if (language === 'BN') {
      setCookie('googtrans', '/en/bn');
    } else {
      setCookie('googtrans', '/en/en');
    }

    // Check if Google Translate element exists or select needs change
    const updateSelect = () => {
      const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElem) {
        const targetVal = language === 'BN' ? 'bn' : 'en';
        if (selectElem.value !== targetVal) {
          selectElem.value = targetVal;
          selectElem.dispatchEvent(new Event('change'));
        }
      }
    };

    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        try {
          if (window.google?.translate?.TranslateElement) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'en,bn',
                autoDisplay: false,
              },
              'google_translate_element'
            );
            setTimeout(updateSelect, 500);
          }
        } catch (e) {
          // ignore
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      updateSelect();
    }
  }, [language]);

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }} />
      {children}
    </>
  );
}
