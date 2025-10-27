"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogoutModal } from "@/components/organizer/LogoutModal";
import { logout } from "@/lib/slices/auth";

interface LogoutButtonProps {
  variant?: "dropdown" | "button";
  className?: string;
}

/**
 * Universal Logout Button:
 * - Works in dropdowns & sidebars
 * - Shows confirmation modal
 * - Clears Redux + localStorage + redirects
 */
export const LogoutButton = ({
  variant = "button",
  className = "",
}: LogoutButtonProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleConfirmLogout = () => {
    // ✅ Clear Redux
    dispatch(logout());

    // ✅ Remove tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // ✅ Redirect to login/root
    router.push("/");

    // ✅ Close modal
    setShowLogoutModal(false);
  };

  const handleOpenModal = () => {
    // Small delay ensures dropdown closes before modal opens
    setTimeout(() => setShowLogoutModal(true), 150);
  };

  if (variant === "dropdown") {
    return (
      <>
        <DropdownMenuItem
          onClick={handleOpenModal}
          className={`text-red-600 font-medium hover:text-red-700 ${className}`}
        >
          Log out
        </DropdownMenuItem>

        <LogoutModal
          open={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleConfirmLogout}
        />
      </>
    );
  }

  // Sidebar / standalone
  return (
    <>
      <button
        onClick={() => setShowLogoutModal(true)}
        className={`flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition cursor-pointer ${className}`}
      >
        <LogOut className="w-5 h-5" />
        <span>Log Out</span>
      </button>

      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};
