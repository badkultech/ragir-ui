import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export const ENDPOINTS = {
  GET_POST: "/posts",

  // otp
  GENERATE_OTP: "/otp/generate-otp",
  VALIDATE_OTP: "/otp/validate",

  // login
  LOGIN: "/auth/login",

  // invite and password reset
  SETUP_PASSWORD: "/public/invite/setup-password",
  RESEND_INVITE: "/public/invite/resend-invite",
  FORGOT_PASSWORD: "/public/invite/forgot-password",

  // super admin dashboard
  GET_ALL_ADMINS: (organizationId: string) =>
    `/org/${organizationId}/admin/admins`,
  GET_NEXT_NUMBER: (organizationId: string) =>
    `/org/${organizationId}/number-series/next-employee-number`,
  CREATE_SUPER_ADMIN: (organizationId: string) =>
    `/org/${organizationId}/admin/super-admin`,
  SUPER_ADMIN_ACTIVATE: (publicId: string) =>
    `/tenant/dashboard/user/${publicId}/activate`,
  SUPER_ADMIN_SUSPEND: (publicId: string) =>
    `/tenant/dashboard/user/${publicId}/suspend`,
  SUPER_ADMIN_STATS: "/tenant/tenantStats",

  // users
  USER_PROFILE: (organizationId: string, userId: string) =>
    `/org/${organizationId}/user/${userId}/profile`,

  // organization
  CREATE_ORGANIZATION: "/tenant/create-organization",
  GET_ALL_ORGANIZATIONS: (page: number, size: number) =>
    `/tenant/all-organizations?page=${page}&size=${size}`,
  ORGANIZATION_ACTIVATE: (publicId: string) => `/org/${publicId}/activate`,
  ORGANIZATION_SUSPEND: (publicId: string) => `/org/${publicId}/deactivate`,
  ORGANIZATION_RESEND_INVITE: (publicId: string) =>
    `/org/${publicId}/resend-invite`,

  // Notifications
  USER_NOTIFICATIONS: (organizationId: string, userId: string) =>
    `/org/${organizationId}/user/${userId}/user-notifications-status`,
  MARK_NOTIFICATION_SEEN: (
    organizationId: string,
    userId: string,
    id: number
  ) =>
    `/org/${organizationId}/user/${userId}/user-notifications-status/${id}/seen`,
} as const;

// utils/roles.ts (or wherever you keep these)
export const ROLES = {
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
  USER: "USER",
  ORGANIZER: "ORGANIZATION_ADMIN",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export const PublicRoutes = [
  "/",
  "/login",
  "/superadmin/login",
  "/admin/login",
  "/register",
  "/user/landing",
  "/admin/forgot-password",
  "/verify-otp",
];

// ✅ Always arrays. Use ["*"] to mean unrestricted access.
export const ROLE_ROUTE_ACCESS: Record<RoleType, string[]> = {
  [ROLES.SYSTEM_ADMIN]: ["*"],

  [ROLES.USER]: [
    "/user/dashboard",
    "/traveler/profile",
    "/user/search",
    ...PublicRoutes,
  ],

  [ROLES.ORGANIZER]: [
    "/organizer/notifications",
    "/organizer/team",
    "/organizer/settings",
    "/organizer/create-trip",
    "/organizer/trips", // base
    "/organizer/trips/*", // dynamic children
    "/organizer/queries",
    "/organizer/queries/*",
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
  if (allowedRoutes.includes("*")) return true;

  return allowedRoutes.some((pattern) => {
    if (pattern === route) return true;

    if (pattern.endsWith("/*")) {
      const base = pattern.slice(0, -2);
      // allow base and any child path
      return route === base || route.startsWith(base + "/");
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
      return "/traveler/profile"; // adjust to your actual path
    default:
      return "/user/landing";
  }
};
