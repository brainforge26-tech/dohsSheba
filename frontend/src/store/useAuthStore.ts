import { create } from 'zustand';
import { UserRole, UserProfile } from '@/types/user';

interface AuthState {
  user: UserProfile | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  setRole: (role: UserRole) => void;
  setUser: (user: UserProfile) => void;
  setAuth: (user: UserProfile, token?: string) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
}

function parseTokenRole(token: string | null): UserRole {
  if (!token) return 'GUEST';
  try {
    if (token.startsWith('demo-token-')) {
      const rawRole = token.replace('demo-token-', '').toUpperCase();
      return (rawRole as UserRole) || 'GUEST';
    }
    const parts = token.split('.');
    if (parts.length === 3) {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const parsed = JSON.parse(jsonPayload);
      return (parsed.role as UserRole) || 'GUEST';
    }
  } catch {
    // fallback
  }
  return 'GUEST';
}

function getInitialState() {
  if (typeof window === 'undefined') {
    return { user: null, role: 'GUEST' as UserRole, token: null, isAuthenticated: false };
  }

  const rawLsToken = localStorage.getItem('token');
  const validLsToken = rawLsToken && rawLsToken !== 'null' && rawLsToken !== 'undefined' ? rawLsToken.trim() : null;

  const rawCookieToken = document.cookie.match(/(?:^|; )token=([^;]+)/)?.[1];
  const validCookieToken = rawCookieToken ? decodeURIComponent(rawCookieToken).trim() : null;

  const storedToken = validLsToken || (validCookieToken && validCookieToken !== 'null' ? validCookieToken : null);
  const storedUserStr = localStorage.getItem('user');

  let user: UserProfile | null = null;
  if (storedUserStr && storedUserStr !== 'null') {
    try {
      user = JSON.parse(storedUserStr);
    } catch { }
  }

  const isAuthenticated = !!(storedToken && user);
  const role: UserRole = isAuthenticated && user?.role ? user.role : (isAuthenticated ? parseTokenRole(storedToken) : 'GUEST');

  return { user: isAuthenticated ? user : null, role, token: isAuthenticated ? storedToken : null, isAuthenticated };
}

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),

  setUser: (updatedUser) => {
    set((state) => {
      const mergedUser = state.user ? { ...state.user, ...updatedUser } : updatedUser;
      if (typeof window !== 'undefined' && mergedUser) {
        localStorage.setItem('user', JSON.stringify(mergedUser));
      }
      return { user: mergedUser };
    });
  },

  setRole: (role) => {
    set((state) => {
      const updatedUser = state.user ? { ...state.user, role } : null;
      if (typeof window !== 'undefined' && updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return { role, user: updatedUser };
    });
  },

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    set({ user, role: user.role, token: token || null, isAuthenticated: true });
  },

  loginAs: (role) => {
    const nameMap: Record<UserRole, string> = {
      SUPER_ADMIN: 'Super Administrator',
      ADMIN: 'Platform Administrator',
      SELLER: 'Fresh Bazaar Seller',
      PROVIDER: 'Karim Services Provider',
      CUSTOMER: 'Sharmin Sultana Customer',
      GUEST: 'Guest User',
    };
    const mockUser: UserProfile = {
      id: 'usr_101',
      name: nameMap[role] || 'John Doe',
      email: `${role.toLowerCase()}@example.com`,
      role: role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+880 1712-345678',
    };
    const demoToken = `demo-token-${role.toLowerCase()}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', demoToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      document.cookie = `token=${demoToken}; path=/; max-age=604800; SameSite=Lax`;
    }
    set({ user: mockUser, role, token: demoToken, isAuthenticated: true });
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        await fetch(`${backendUrl}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        }).catch(() => {});
      } catch {
        // ignore fetch failures
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('dohssheba-auth');

      // Thoroughly clear non-HttpOnly cookies
      const cookiesToClear = ['token', 'user', 'auth', 'refreshToken'];
      const paths = ['/', '/dashboard', '/admin', '/seller', '/provider'];
      const hostname = window.location.hostname;
      const domains = ['', hostname, `.${hostname}`];

      cookiesToClear.forEach((name) => {
        paths.forEach((path) => {
          domains.forEach((domain) => {
            const domainAttr = domain ? `; domain=${domain}` : '';
            document.cookie = `${name}=; path=${path}${domainAttr}; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`;
          });
        });
      });
    }
    set({ user: null, role: 'GUEST', token: null, isAuthenticated: false });
  },
}));
