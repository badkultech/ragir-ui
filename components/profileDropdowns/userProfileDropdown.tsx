"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { selectAuthState } from "@/lib/slices/auth";
import { getDashboardPath } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCallback } from "react";

export function UserProfileDropdown() {
  const router = useRouter();
  const { userData } = useSelector(selectAuthState);

  // ✅ Safe logout handler
  const handleLogout = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      } catch (err) {
        console.error("Logout failed:", err);
      }
    }
  }, []);

  // ✅ Safe dashboard navigation
  const handleDashboardClick = useCallback(() => {
    const path = getDashboardPath(userData?.userType);
    router.push(path);
  }, [router, userData]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative w-10 h-10 group cursor-pointer">
          {/* Gradient ring */}
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#FEA901] via-[#FD6E34] to-[#FD401A] opacity-0 group-hover:opacity-100 transition-opacity" />
          {/* Avatar */}
          <div className="relative w-full h-full rounded-full bg-white overflow-hidden">
            <Avatar className="w-full h-full">
              <AvatarImage
                src="/adventure-traveler-in-nature.jpg"
                alt={userData?.name ?? "User Avatar"}
              />
              <AvatarFallback>
                {userData?.name?.slice(0, 2)?.toUpperCase() ?? "US"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel onClick={handleDashboardClick}>
          My Account
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDashboardClick}>
          My Dashboard
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
