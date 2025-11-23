// hooks/useOrganizationId.ts
'use client';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/lib/slices/auth';

/**
 * Safe hook to read focusedOrganization from redux.
 * - Returns string | null
 * - Does NOT throw. Components that require orgId should use useRequiredOrganizationId.
 */
export const useOrganizationId = (): string | null => {
  // Keep selector usage minimal and return a stable reference
  const { focusedOrganization } = useSelector(selectAuthState);

  // Ensure we always return either a string or null (avoid undefined)
  return useMemo(() => (focusedOrganization ?? null), [focusedOrganization]);
};

/**
 * Strict variant that throws when orgId is not present.
 * Use this only inside components that truly require the organization ID
 * (and only after client hydration checks).
 */
export const useRequiredOrganizationId = (opts?: { message?: string }): string => {
  const orgId = useOrganizationId();
  if (!orgId) {
    const msg = opts?.message ?? 'Organization ID not available — make sure user has selected an organization.';
    // Throwing here is explicit and intentional, but should only be used after hydration.
    throw new Error(msg);
  }
  return orgId;
};
