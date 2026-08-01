import { create } from 'zustand';
import { fetchApi } from '@/lib/api-client';

interface SiteSettingsState {
  siteName: string;
  tagline: string;
  supportPhone: string;
  supportEmail: string;
  address: string;
  currencySymbol: string;
  maintenanceMode: boolean;
  loaded: boolean;
  fetchSettings: () => Promise<void>;
  updateSettingsLocally: (settings: Partial<SiteSettingsState>) => void;
}

export const useSiteSettingsStore = create<SiteSettingsState>((set) => ({
  siteName: 'dohsSheba',
  tagline: 'Home Services & Express Grocery Marketplace for Savar DOHS',
  supportPhone: '01306031982',
  supportEmail: 'support@dohssheba.com',
  address: 'Savar DOHS, Dhaka, Bangladesh',
  currencySymbol: '৳',
  maintenanceMode: false,
  loaded: false,

  fetchSettings: async () => {
    try {
      const res = await fetchApi<any>('/settings').catch(() => null);
      if (res && res.success && res.data) {
        set({
          siteName: res.data.siteName || 'dohsSheba',
          tagline: res.data.tagline || 'Home Services & Express Grocery Marketplace for Savar DOHS',
          supportPhone: res.data.supportPhone || '01306031982',
          supportEmail: res.data.supportEmail || 'support@dohssheba.com',
          address: res.data.address || 'Savar DOHS, Dhaka, Bangladesh',
          currencySymbol: res.data.currencySymbol || '৳',
          maintenanceMode: Boolean(res.data.maintenanceMode),
          loaded: true,
        });
      }
    } catch (err) {
      console.error('Error fetching site settings:', err);
    }
  },

  updateSettingsLocally: (newSettings) => set(newSettings),
}));
