export type ServiceCategorySlug =
  | 'electrician'
  | 'plumber'
  | 'cleaner'
  | 'carpenter'
  | 'painter'
  | 'ac-service'
  | 'cctv'
  | 'pest-control'
  | 'appliance-repair'
  | 'interior';

export interface ServiceCategory {
  id: string;
  name: string;
  slug: ServiceCategorySlug;
  iconName: string;
  description: string;
  popularCount: number;
  badge?: string;
  colorBg: string;
  colorText: string;
}

export interface ServiceAddon {
  id: string;
  title: string;
  price: number;
  description: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  categorySlug: ServiceCategorySlug;
  categoryName: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  priceUnit: string;
  duration: string;
  image: string;
  badge?: string;
  features: string[];
  location: string;
  addons?: ServiceAddon[];
  description?: string;
}

export interface ProviderReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  serviceTitle: string;
}

export interface ProviderProfile {
  id: string;
  name: string;
  categorySlug: ServiceCategorySlug;
  categoryName: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  experienceYears: number;
  isVerified: boolean;
  phone: string;
  email: string;
  address: string;
  bio: string;
  specialties: string[];
  galleryImages: string[];
  services: ServiceItem[];
  reviews: ProviderReview[];
}

export interface BookingDetails {
  serviceId: string;
  serviceTitle: string;
  categoryName: string;
  providerName: string;
  basePrice: number;
  selectedAddons: ServiceAddon[];
  date: string;
  timeSlot: string;
  address: string;
  phone: string;
  notes: string;
  paymentMethod: 'bkash' | 'nagad' | 'card' | 'cod';
  totalPrice: number;
}
