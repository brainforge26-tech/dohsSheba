import { create } from 'zustand';
import { ProductItem } from '@/types/shopping';

interface WishlistState {
  items: ProductItem[];
  addItem: (product: ProductItem) => void;
  removeItem: (productId: string) => void;
  toggleWishlist: (product: ProductItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  addItem: (product) => {
    set((state) => {
      if (state.items.some((item) => item.id === product.id)) return state;
      return { items: [...state.items, product] };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

  toggleWishlist: (product) => {
    if (get().isInWishlist(product.id)) {
      get().removeItem(product.id);
    } else {
      get().addItem(product);
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item.id === productId);
  },

  clearWishlist: () => set({ items: [] }),
}));
