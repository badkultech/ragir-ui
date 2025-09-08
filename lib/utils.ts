import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export const ENDPOINTS = {
  GET_POST: "/posts",
  ORGANIZATION: "/org",
  GENERATE_OTP: "/otp/generate",
  VALIDATE_OTP: "/otp/validate",
  ONBOARDING: "/onboarding",
  EXCLUSIONS: "/master/exclusions/all",
  ADMIN_CREATE_USER: (organizationId : string) => `/org/${organizationId}/admin/user`,
  ADMIN_USERS: "/admin/users",
  CMS_PAGE: (slug: string) => `/master/cms/pages/slug/${slug}`,
  CMS_PAGES: "/master/cms/pages",
  CMS_PAGE_BY_ID: (id: number) => `master/cms/pages/${id}`,
  CMS_SECTIONS: (pageId: number) => `master/cms/pages/${pageId}/sections`,
  CMS_SECTION_BY_ID: (pageId: number, sectionId: number) =>
    `master/cms/pages/${pageId}/sections/${sectionId}`,
  TENANT: "/tenant",
  TENANT_ORG_STATS: "/tenant/dashboard/org-stats",
  CUSTOMERS_COUNTS:"/tenant/dashboard/customers/counts",
  OPEN_TICKET_COUNT:"/tenant/dashboard/tickets/open/count",
  TENANT_USERS:"/tenant/dashboard/users",
  TENANT_USER_ACTIVATE : (publicId : string )=> `/tenant/dashboard/user/${publicId}/activate`,
  TENANT_USER_SUSPEND: (publicId : string) => `/tenant/dashboard/user/${publicId}/suspend`,
  FAQ: "/master/faq/all",

  // Trip related
  TRIP: (organizationId: string) => `/org/${organizationId}/trip`,
  TRIP_BASIC_DETAILS: (organizationId: string, tripId?: number) =>
    `/org/${organizationId}/trip/basic`,
  TRIP_EXCLUSIONS: (organizationId: string, tripId: number) =>
    `/org/${organizationId}/trip/${tripId}/exclusions`,
  TRIP_INCLUSIONS: (organizationId: string, tripId: number) =>
    `/org/${organizationId}/trip/${tripId}/inclusions`,
  TRIP_ITINERARY: (organizationId: string, tripId: number) =>
    `/org/${organizationId}/trip/${tripId}/itinerary`,
  TRIP_PRICING: (organizationId: string, tripId: number) =>
    `/org/${organizationId}/trip/${tripId}/pricing`,
  TRIP_DETAILS: (organizationId: string, tripId: number) =>
    `/org/${organizationId}/trip/${tripId}`,
  TRIP_STATUS: (organizationId: string, tripId: number) =>
    `/org/${organizationId}/trip/${tripId}/status`,

  // Queries
  TRIP_QUERIES: (organizationId: string, days?: number) =>
    `/org/${organizationId}/queries${days ? `?days=${days}` : ""}`,
  RESPOND_QUERY: (organizationId: string, queryId: number) =>
    `/org/${organizationId}/queries/${queryId}/respond`,

  // Notifications
  USER_NOTIFICATIONS: (organizationId: string, userId: string) =>
    `/org/${organizationId}/user/${userId}/user-notifications-status`,
  MARK_NOTIFICATION_SEEN: (
    organizationId: string,
    userId: string,
    id: number
  ) =>
    `/org/${organizationId}/user/${userId}/user-notifications-status/${id}/seen`,

  ORGANIZATION_TICKETS: (organizationId: string) =>
    `/org/${organizationId}/tickets/all`,

  USER_TICKET: (organizationid: string, userId: string) =>
    `/org/${organizationid}/user/${userId}/ticket`,
} as const;

// utils/roles.ts (or wherever you keep these)
export const ROLES = {
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
  USER: "USER",
  ORGANIZER: "ORGANIZATION_ADMIN",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export const PublicRoutes = ["/user/landing"];

// ✅ Always arrays. Use ["*"] to mean unrestricted access.
export const ROLE_ROUTE_ACCESS: Record<RoleType, string[]> = {
  [ROLES.SYSTEM_ADMIN]: ["*"],

  [ROLES.USER]: [
    "/user/dashboard",
    "/user/profile",
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
