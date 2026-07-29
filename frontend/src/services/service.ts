import { FEATURED_SERVICES, MOCK_PROVIDER_PROFILES, SERVICE_CATEGORIES } from '@/constants/services';
import { ProviderProfile, ServiceCategorySlug, ServiceItem } from '@/types/service';

export class HomeServiceService {
  static async getAllCategories() {
    return SERVICE_CATEGORIES;
  }

  static async getServicesByCategory(slug: ServiceCategorySlug | 'all'): Promise<ServiceItem[]> {
    if (slug === 'all') return FEATURED_SERVICES;
    return FEATURED_SERVICES.filter((s) => s.categorySlug === slug);
  }

  static async getProviderProfile(providerId: string): Promise<ProviderProfile | null> {
    return MOCK_PROVIDER_PROFILES[providerId] || null;
  }
}
