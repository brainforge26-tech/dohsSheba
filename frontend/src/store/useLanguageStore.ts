import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'EN' | 'BN';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'BN',
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => set((state) => ({ language: state.language === 'EN' ? 'BN' : 'EN' })),
    }),
    {
      name: 'dohssheba-language',
    }
  )
);
