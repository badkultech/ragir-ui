"use client";

import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { selectAuthState } from "@/lib/slices/auth";
import { PublicRoutes } from "@/lib/utils";

/**
 * Returns organizationId:
 * - Public routes → ""
 * - logged in but not selected → ""
 * - Always returns a string
 */
export const useOrganizationId = (): string => {
  const pathname = usePathname();
  const { focusedOrganization } = useSelector(selectAuthState);

  const isPublic = PublicRoutes.some((r) => pathname.startsWith(r));
  if (isPublic) return "";

  return focusedOrganization ? String(focusedOrganization) : "";
};

/**
 * Strict variant for pages that MUST have orgId.
 * Throws early instead of rendering invalid UI.
 */
export const useRequiredOrganizationId = (
  opts?: { message?: string }
): string => {
  const orgId = useOrganizationId();
  if (!orgId) {
    throw new Error(opts?.message ?? "Organization ID is required.");
  }
  return orgId;
};
