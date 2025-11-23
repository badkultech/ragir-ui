'use client';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { selectAuthState } from '@/lib/slices/auth';
import { PublicRoutes } from '@/lib/utils';

/**
 * Returns organizationId as a string.
 * - For public routes → returns ""
 * - For authenticated users without an org → returns ""
 * - Never returns null → prevents TypeScript errors everywhere
 */
export const useOrganizationId = (): string => {
  const pathname = usePathname();
  const { focusedOrganization } = useSelector(selectAuthState);

  // 1) If on a public route → allow missing org and return empty string
  const isPublic = PublicRoutes.some((r) => pathname.startsWith(r));
  if (isPublic) {
    return "";
  }

  // 2) Return org if present; otherwise return empty string
  return useMemo(() => {
    return focusedOrganization ? String(focusedOrganization) : "";
  }, [focusedOrganization]);
};

/**
 * Strict variant for pages that REQUIRE orgId (Organizer dashboard, trip creation, etc).
 * - Throws if missing
 */
export const useRequiredOrganizationId = (opts?: { message?: string }): string => {
  const orgId = useOrganizationId();
  if (!orgId) {
    const msg =
      opts?.message ?? "Organization ID is required for this section.";
    throw new Error(msg);
  }
  return orgId;
};
