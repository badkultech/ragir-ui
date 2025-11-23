// components/HydratedAuth.tsx (or wherever you keep it)
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { selectAuthState, setCredentials } from '@/lib/slices/auth';
import {
  getDashboardPath,
  PublicRoutes,
  ROLE_ROUTE_ACCESS,
  ROLES,
  RoleType,
} from '@/lib/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { OrganizationDTO } from '@/lib/services/superadmin/organizations/types';

/**
 * HydratedAuth
 * - Reads tokens from localStorage and hydrates redux on client mount
 * - Performs route guards only after hydration completes
 * - Protects against SSR & token parsing issues
 */
export default function HydratedAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { getValue } = useLocalStorage();

  const [hydrated, setHydrated] = useState(false);

  // read minimal auth state from redux
  const authState = useSelector(selectAuthState);
  const accessToken = authState?.accessToken ?? null;
  const userData = authState?.userData ?? null;

  // token expiry check memoized to avoid re-decoding on every render
  const accessTokenExpired = useMemo(() => tokenExpired(accessToken), [accessToken]);

  // Hydrate redux from localStorage on first client mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // read from localStorage safely
        const accessToken = getValue('accessToken');
        const refreshToken = getValue('refreshToken');
        const focusedOrganization: OrganizationDTO | null = getValue('focusedOrganization');

        if (accessToken || refreshToken) {
          dispatch(
            setCredentials({
              accessToken: accessToken ?? null,
              refreshToken: refreshToken ?? null,
              focusedOrganization: focusedOrganization?.publicId ?? null,
            }),
          );
        }
      } catch (e) {
        // non-fatal - we log only
        // eslint-disable-next-line no-console
        console.error('Error reading tokens from localStorage', e);
      } finally {
        if (mounted) setHydrated(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [dispatch, getValue]);

  // Perform routing guards only after hydration completed
  useEffect(() => {
    if (!hydrated) return;

    const isAuthenticated = Boolean(authState?.accessToken && !accessTokenExpired);

    // Case: login pages (root or includes /login)
    const isLoginPage = pathname === '/' || pathname.includes('/login');
    if (isLoginPage) {
      if (isAuthenticated && userData?.userType) {
        const dashboardPath = getDashboardPath(userData.userType);
        router.replace(dashboardPath);
      }
      return;
    }

    // Public routes allowed without auth
    if (PublicRoutes.some((route) => pathname.startsWith(route))) {
      return;
    }

    // Protected routes must be authenticated
    if (!isAuthenticated) {
      router.replace('/');
      return;
    }

    if (!userData?.userType) {
      router.replace('/');
      return;
    }

    // Role-based route access
    if (!isAllowedRoutes(pathname, userData.userType)) {
      const dashboardPath = getDashboardPath(userData.userType);
      router.replace(dashboardPath + '/dashboard');
    }
  }, [hydrated, authState?.accessToken, accessTokenExpired, authState?.userData, pathname, router]);

  if (!hydrated) return null;

  return <>{children}</>;
}

/**
 * Safe token expiry checker.
 * Returns true if token is missing / invalid / expired.
 */
function tokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  try {
    // JWT format check
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = parts[1];
    // Browser: atob is available; ensure padding handled
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // Pad base64 string if necessary
    const pad = base64.length % 4;
    const padded = pad ? base64 + '='.repeat(4 - pad) : base64;

    const decoded = JSON.parse(atob(padded));
    if (!decoded || typeof decoded !== 'object') return true;
    if (!decoded.exp) return true;

    const expiryMs = Number(decoded.exp) * 1000;
    if (Number.isNaN(expiryMs)) return true;

    return Date.now() >= expiryMs;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse token', error);
    return true;
  }
}

/**
 * Utility to check whether a given route is allowed for the role
 * (kept here because the original component referenced it)
 */
function isAllowedRoutes(route: string, role?: RoleType): boolean {
  if (!role) return false;
  if (role === ROLES.SYSTEM_ADMIN) return true; // unrestricted access

  const allowedRoutes = ROLE_ROUTE_ACCESS[role];
  if (!allowedRoutes) return false;

  // exact match or prefix match for dynamic routes
  return allowedRoutes.some((allowed) => route === allowed || route.startsWith(allowed));
}
