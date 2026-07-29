import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface JwtPayload {
  id?: string;
  email?: string;
  role?: string;
  exp?: number;
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      // Fallback for demo dev tokens
      if (token.startsWith('demo-token-')) {
        const rolePart = token.replace('demo-token-', '').toUpperCase();
        return { role: rolePart, exp: Math.floor(Date.now() / 1000) + 86400 * 30 };
      }
      return null;
    }
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('token')?.value;

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isDashboardRoot = pathname === '/dashboard' || pathname === '/dashboard/';
  
  const isSuperAdminRoute = pathname.startsWith('/dashboard/super-admin');
  const isAdminRoute      = pathname.startsWith('/dashboard/admin') || (pathname.startsWith('/admin') && !pathname.startsWith('/admin/dashboard'));
  const isSellerRoute     = pathname.startsWith('/dashboard/seller') || pathname.startsWith('/seller');
  const isCustomerRoute   = pathname.startsWith('/dashboard/customer');
  const isProviderRoute   = pathname.startsWith('/dashboard/provider') || pathname.startsWith('/provider');

  let payload: JwtPayload | null = null;
  let isExpired = false;

  if (tokenCookie) {
    payload = parseJwt(tokenCookie);
    if (payload?.exp && payload.exp * 1000 < Date.now()) {
      isExpired = true;
    }
  }

  // Handle expired or invalid token
  if (tokenCookie && (isExpired || !payload)) {
    const response = isAuthPage
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }

  const role = payload?.role;

  // Helper to resolve role-based home dashboard
  const getRoleDashboard = (userRole?: string) => {
    switch (userRole) {
      case 'SUPER_ADMIN': return '/dashboard/super-admin';
      case 'ADMIN':       return '/admin/dashboard';
      case 'SELLER':      return '/seller/dashboard';
      case 'CUSTOMER':    return '/dashboard/customer';
      case 'PROVIDER':    return '/provider/dashboard';
      default:            return '/dashboard/customer';
    }
  };

  // 1. Redirect authenticated users away from Login/Register
  if (isAuthPage && tokenCookie && payload && !isExpired) {
    return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
  }

  // 2. Redirect /dashboard to the correct role dashboard
  if (isDashboardRoot) {
    if (!tokenCookie || !payload || isExpired) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
  }

  // 3. Protect Role Dashboard Routes & Prevent Unauthorized Role Access
  const isProtectedRoute = isSuperAdminRoute || isAdminRoute || isSellerRoute || isCustomerRoute || isProviderRoute;

  if (isProtectedRoute) {
    if (!tokenCookie || !payload || isExpired) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
      return NextResponse.redirect(loginUrl);
    }

    // Role Enforcement Rules
    if (isSuperAdminRoute && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
    }
    if (isAdminRoute && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
    }
    if (isSellerRoute && role !== 'SELLER' && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
    }
    if (isCustomerRoute && role !== 'CUSTOMER' && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
    }
    if (isProviderRoute && role !== 'PROVIDER' && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard',
    '/dashboard/:path*',
    '/seller/:path*',
    '/admin/:path*',
    '/provider/:path*',
  ],
};
