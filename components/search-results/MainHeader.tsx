"use client";

import { Menu, ArrowLeft } from "lucide-react";
import { NotificationsDropdown } from "@/components/search-results/NotificationsDropdown";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function MainHeader({
  onMenuOpen = () => { },
  notifications = [],
  onUpdateNotifications = () => { },
  logoText = "",
  logoSrc = "/logo.png",
  isLoggedIn = false,
  onLoginClick = () => { },
  variant = "center",
}: {
  onMenuOpen?: () => void;
  notifications?: any[];
  onUpdateNotifications?: (list: any[]) => void;
  logoText?: string;
  logoSrc?: string;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  variant?: "center" | "edge";
}) {
  const router = useRouter();

  return (
    <header className="w-full relative z-20 bg-white border-b border-[#E5E7EB]">
      <div
        className={
          variant === "center"
            ? "max-w-[1400px] mx-auto px-4 md:px-20 py-3 flex items-center justify-between"
            : "w-full px-4 md:px-4 py-2 flex items-center justify-between"
        }
      >

        {/* LEFT SECTION */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {logoText && (
            <button
              onClick={() => router.back()}
              className="p-1 text-black/80 hover:text-black"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {!logoText && (
            <Image
              src={logoSrc}
              alt="Logo"
              width={96}
              height={37}
              className="w-[96px] h-[37px]"
            />
          )}

          {logoText && (
            <h3 className="text-xl md:text-xl font-semibold text-black leading-none">
              {logoText}
            </h3>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="ml-auto flex items-center gap-4">
          {!isLoggedIn && (
            <>
              <button
                onClick={onLoginClick}
                className="px-4 py-1.5 rounded-full text-white font-medium 
                         bg-gradient-to-r from-orange-400 to-pink-500 
                         hover:opacity-90 transition"
              >
                Log in / Register
              </button>
              <button>
                <Menu className="w-6 h-6" />
              </button>
            </>
          )}
          {isLoggedIn && (
            <>
              <button className="p-2 hidden md:block text-black/80 hover:text-black">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M18 0H2C0.897 0 0 0.897 0 2V14C0 15.103 0.897 16 2 16H5V19.767L11.277 16H18C19.103 16 20 15.103 20 14V2C20 0.897 19.103 0 18 0ZM18 14H10.723L7 16.233V14H2V2H18V14Z"
                    fill="black"
                  />
                </svg>
              </button>

              <NotificationsDropdown
                notifications={notifications}
                onUpdateNotifications={onUpdateNotifications}
              />

              <button
                onClick={onMenuOpen}
                className="p-2 text-black/80 hover:text-black"
              >
                <Menu className="w-6 h-6" />
              </button>
            </>
          )}

        </div>

      </div>
    </header>
  );
}
