import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'EN' | 'BN';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const syncLangCookie = (lang: Language) => {
  if (typeof document !== 'undefined') {
    document.cookie = `dohssheba-lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  }
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'EN',
      setLanguage: (lang) => {
        syncLangCookie(lang);
        set({ language: lang });
      },
      toggleLanguage: () =>
        set((state) => {
          const nextLang = state.language === 'EN' ? 'BN' : 'EN';
          syncLangCookie(nextLang);
          return { language: nextLang };
        }),
    }),
    {
      name: 'dohssheba-language',
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          syncLangCookie(state.language);
        }
      },
    }
  )
);
