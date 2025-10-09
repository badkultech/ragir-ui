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
  return allowedRoutes.some((allowed) => route === allowed);
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

    const isAuthenticated = accessToken && !tokenExpired(accessToken);

    // Case 1: User on a login page (root `/` or `/something/login`)
    const isLoginPage = pathname === "/" || pathname.includes("/login");
    if (isLoginPage) {
      if (isAuthenticated && userData?.userType) {
        const dashboardPath = getDashboardPath(userData.userType);
        router.replace(dashboardPath);
      }
      return; // ✅ Don't process further if already on login page
    }

    // Case 2: Always allow public routes
    if (PublicRoutes.some((route) => pathname.startsWith(route))) {
      return;
    }

    // Case 3: Guarded routes
    if (!isAuthenticated) {
      router.replace("/"); // redirect to root login
      return;
    }

    if (!userData?.userType) {
      router.replace("/");
      return;
    }

    // Case 4: Not allowed route → send to dashboard
    if (!isAllowedRoutes(pathname, userData.userType)) {
      const dashboardPath = getDashboardPath(userData.userType);
      router.replace(dashboardPath + "/dashboard");
    }
  }, [hydrated, accessToken, userData, pathname, router]);

  if (!hydrated) return null;

  return <>{children}</>;

  /**
   * Checks whether a JWT access token is expired.
   * @param token - The JWT string (access token).
   * @returns true if expired, false if still valid.
   */
   function tokenExpired(token: string | null | undefined): boolean {
    if (!token) return true;

    try {
      // JWT format: header.payload.signature
      const [, payload] = token.split(".");
      if (!payload) return true;

      // Decode base64 payload
      const decoded = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      );

      if (!decoded.exp) return true;

      // exp is in seconds → compare with current time in seconds
      const expiry = decoded.exp * 1000;
      return Date.now() >= expiry;
    } catch (error) {
      console.error("Failed to parse token", error);
      return true; // Treat invalid tokens as expired
    }
  }
}
