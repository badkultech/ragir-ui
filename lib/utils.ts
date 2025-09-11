import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export const ENDPOINTS = {
  GET_POST: '/posts',

    // otp
  GENERATE_OTP: "/otp/generate",
  VALIDATE_OTP: "/otp/validate",

  // login
  LOGIN: "/auth/login",

  // invite and password reset
  SETUP_PASSWORD: "/public/invite/setup-password",

  // super admin dashboard
 GET_ALL_ADMINS: (organizationId : string) => `/org/${organizationId}/admin/admins`,
 GET_NEXT_NUMBER: (organizationId : string) => `/org/${organizationId}/number-series/next-employee-number`,
} as const;

// utils/roles.ts (or wherever you keep these)
export const ROLES = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  USER: 'USER',
  ORGANIZER: 'ORGANIZATION_ADMIN',


} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export const PublicRoutes = ['/user/landing'];

// ✅ Always arrays. Use ["*"] to mean unrestricted access.
export const ROLE_ROUTE_ACCESS: Record<RoleType, string[]> = {
  [ROLES.SYSTEM_ADMIN]: ['*'],

  [ROLES.USER]: [
    '/user/dashboard',
    '/user/profile',
    '/user/search',
    ...PublicRoutes,
  ],

  [ROLES.ORGANIZER]: [
    '/organizer/notifications',
    '/organizer/team',
    '/organizer/settings',
    '/organizer/create-trip',
    '/organizer/trips', // base
    '/organizer/trips/*', // dynamic children
    '/organizer/queries',
    '/organizer/queries/*',
  ],
};

/**
 * Checks if a route is allowed for a given role.
 * Supports exact matches and "/*" wildcard suffix.
 */
export function isAllowedRoutes(route: string, role?: RoleType): boolean {
  if (!role) return false;

  const allowedRoutes = ROLE_ROUTE_ACCESS[role] ?? [];

  // ✅ Unrestricted (admin) handled via wildcard presence
  if (allowedRoutes.includes('*')) return true;

  return allowedRoutes.some((pattern) => {
    if (pattern === route) return true;

    if (pattern.endsWith('/*')) {
      const base = pattern.slice(0, -2);
      // allow base and any child path
      return route === base || route.startsWith(base + '/');
    }

    return false;
  });
  
}

export const getDashboardPath = (role?: string) => {
  switch (role) {
    case ROLES.SYSTEM_ADMIN:
      return "/superadmin";
    case ROLES.ORGANIZER:
      return "/organizer";
    case ROLES.USER:
      return "/user/dashboard"; // adjust to your actual path
    default:
      return "/user/landing";
  }
};