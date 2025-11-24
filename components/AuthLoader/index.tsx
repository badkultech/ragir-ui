"use client";

import React, { useEffect, useState, useMemo, useRef, startTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { selectAuthState, setCredentials } from "@/lib/slices/auth";
import { getDashboardPath, PublicRoutes, ROLE_ROUTE_ACCESS, ROLES, RoleType } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function HydratedAuth({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { getValueFromLocalStorage: getValue } = useLocalStorage();
  const authState = useSelector(selectAuthState);

  const [hydrated, setHydrated] = useState(false);
  const redirecting = useRef(false);

  const accessToken = authState?.accessToken ?? null;
  const userType = authState?.userData?.userType ?? null;

  const accessTokenExpired = useMemo(
    () => tokenExpired(accessToken),
    [accessToken]
  );

  /** STEP 1 — HYDRATE FROM LOCAL STORAGE */
  useEffect(() => {
    const lsAccess = getValue("accessToken");
    const lsRefresh = getValue("refreshToken");
    const lsFocusedOrg = getValue("focusedOrganizationId"); // ALWAYS STRING

    dispatch(
      setCredentials({
        accessToken: lsAccess ?? null,
        refreshToken: lsRefresh ?? null,
        focusedOrganizationId: lsFocusedOrg ?? null,
      })
    );

    setHydrated(true);
  }, [dispatch]); // run ONLY once

  /** STEP 2 — ROUTE GUARD */
  useEffect(() => {
    if (!hydrated) return;
    if (redirecting.current) return;

    const isAuthenticated = Boolean(accessToken) && !accessTokenExpired;
    const isLogin = pathname === "/" || pathname.includes("/login");

    // LOGIN PAGES
    if (isLogin) {
      if (isAuthenticated && userType) {
        const redirect = getDashboardPath(userType);
        if (pathname !== redirect) {
          redirecting.current = true;
          startTransition(() => router.replace(redirect));
        }
      }
      return;
    }

    // PUBLIC ROUTES
    if (PublicRoutes.some((r) => pathname.startsWith(r))) return;

    // PROTECTED
    if (!isAuthenticated || !userType) {
      redirecting.current = true;
      startTransition(() => router.replace("/"));
      return;
    }

    // ROLE ACCESS
    if (!isAllowedRoutes(pathname, userType)) {
      const redirect = getDashboardPath(userType) + "/dashboard";
      redirecting.current = true;
      startTransition(() => router.replace(redirect));
    }
  }, [hydrated, pathname, accessToken, accessTokenExpired, userType]);

  if (!hydrated) return null;
  return <>{children}</>;
}

/* Safe JWT Expiry */
function tokenExpired(token: string | null | undefined) {
  if (!token) return true;
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

/* Route Permission Checker */
function isAllowedRoutes(route: string, role: RoleType): boolean {
  if (!role) return false;
  if (role === ROLES.SYSTEM_ADMIN) return true;
  const allowed = ROLE_ROUTE_ACCESS[role] ?? [];
  return allowed.some((r) => route === r || route.startsWith(r));
}
