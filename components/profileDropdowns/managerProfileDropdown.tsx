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
import { getDashboardPath, ROLES } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function ManagerProfileDropdown() {
  const router = useRouter();
  const { userData } = useSelector(selectAuthState);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative w-10 h-10 group">
          {/* Gradient ring */}
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#FEA901] via-[#FD6E34] to-[#FD401A] opacity-0 group-hover:opacity-100 transition-opacity"></div>

          {/* Avatar with white background to cover inner gradient */}
          <div className="relative w-full h-full rounded-full bg-white overflow-hidden">
            <Avatar className="w-full h-full">
              <AvatarImage
                src="/adventure-traveler-in-nature.jpg"
                alt="Alex Kumar"
              />
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel
          onClick={() => {
            const path = getDashboardPath(userData?.userType);
            router.push(path);
          }}
        >
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            const path = getDashboardPath(userData?.userType);
            router.push(path);
          }}
        >
          My Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // Optionally redirect
            window.location.href = "/admin/login";
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
