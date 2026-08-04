import { create } from 'zustand';

interface SearchState {
  isOpen: boolean;
  query: string;
  category: string;
  openSearch: (initialQuery?: string) => void;
  closeSearch: () => void;
  setQuery: (q: string) => void;
  setCategory: (cat: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  query: '',
  category: 'all',
  openSearch: (initialQuery = '') => set({ isOpen: true, query: initialQuery }),
  closeSearch: () => set({ isOpen: false }),
  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
}));
