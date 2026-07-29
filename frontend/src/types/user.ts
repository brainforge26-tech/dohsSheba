export type UserRole = 'GUEST' | 'CUSTOMER' | 'PROVIDER' | 'SELLER' | 'RIDER' | 'ADMIN' | 'SUPER_ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}
