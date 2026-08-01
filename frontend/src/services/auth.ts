import { UserProfile, UserRole } from '@/types/user';
import { fetchApi } from '@/lib/api-client';

export interface AuthSession {
  user: UserProfile;
  token: string;
}

export class AuthService {
  static async login(email: string, role: UserRole, password?: string): Promise<AuthSession> {
    try {
      const response = await fetchApi<{ user: any; accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: password || 'password123' }),
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return {
        user: {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          phone: response.data.user.phone || '',
          avatar: response.data.user.avatar || '',
        },
        token: response.data.accessToken,
      };
    } catch (error) {
      // Fallback for offline/demo mode
      const mockUser: UserProfile = {
        id: 'usr_' + Math.random().toString(36).substring(7),
        name: role === 'PROVIDER' ? 'Apex Climate Care' : role === 'SELLER' ? 'Green Harvest DOHS' : 'Lt Col (Retd) Tariq',
        email: email,
        role: role,
        phone: '+880 1711-223344',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      const token = 'jwt_mock_token_' + Date.now();
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
      return { user: mockUser, token };
    }
  }

  static async register(name: string, email: string, role: UserRole, phone: string, password?: string): Promise<AuthSession> {
    try {
      const response = await fetchApi<{ user: any; accessToken: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password: password || 'password123', phone, role }),
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return {
        user: {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          phone: response.data.user.phone || '',
          avatar: response.data.user.avatar || '',
        },
        token: response.data.accessToken,
      };
    } catch (error) {
      const newUser: UserProfile = {
        id: 'usr_' + Math.random().toString(36).substring(7),
        name,
        email,
        role,
        phone,
      };
      const token = 'jwt_mock_token_' + Date.now();
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      return { user: newUser, token };
    }
  }

  static async googleLogin(idToken: string): Promise<AuthSession> {
    const response = await fetchApi<{ user: any; accessToken: string }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential: idToken }),
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return {
      user: {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role,
        phone: response.data.user.phone || '',
        avatar: response.data.user.avatar || '',
      },
      token: response.data.accessToken,
    };
  }

  static validateRoleAccess(userRole: UserRole, requiredRole: UserRole): boolean {
    if (requiredRole === 'GUEST') return true;
    if (userRole === 'ADMIN') return true;
    return userRole === requiredRole;
  }
}
