"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { selectAuthState, setCredentials } from "@/lib/slices/auth";
import {
  getDashboardPath,
  PublicRoutes,
  ROLE_ROUTE_ACCESS,
  ROLES,
  RoleType,
} from "@/lib/utils";

/**
 * Utility to check if a given route is allowed for the role
 */
export function isAllowedRoutes(route: string, role?: RoleType): boolean {
  if (!role) return false;
  if (role === ROLES.SYSTEM_ADMIN) return true; // unrestricted access

  const allowedRoutes = ROLE_ROUTE_ACCESS[role];
  if (!allowedRoutes) return false;

  // ✅ exact match or prefix match (for dynamic routes)
  return allowedRoutes.some(
    (allowed) => route === allowed || route.startsWith(allowed)
  );
}

export default function HydratedAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [hydrated, setHydrated] = useState(false);

  const { accessToken, userData, isTokenExpired } =
    useSelector(selectAuthState);

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken || refreshToken) {
        dispatch(setCredentials({ accessToken, refreshToken }));
      }
    } catch (e) {
      console.error("Error reading tokens from localStorage", e);
    } finally {
      setHydrated(true);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) return;

    const isAuthenticated = !!accessToken;
    if (pathname.includes("/login")) {
      if ((accessToken || !isTokenExpired) && userData?.userType) {
        const dashboardPath = getDashboardPath(userData?.userType);
        router.replace(dashboardPath);
      }
    }
    // Allow public routes always
    if (PublicRoutes.some((route) => pathname === (route))) {
      return; // ✅ do not redirect
    }

    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    if (!userData?.userType) {
      router.replace("/");
      return;
    }

    if (!isAllowedRoutes(pathname, userData.userType)) {
      const path = getDashboardPath(userData.userType);
      router.replace(path + "/dashboard");
    }
  }, [hydrated, accessToken, userData, pathname, router]);

  if (!hydrated) return null;

  return <>{children}</>;
}
