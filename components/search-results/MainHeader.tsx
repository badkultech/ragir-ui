"use client";

import { Menu, ArrowLeft } from "lucide-react";
import { NotificationsDropdown } from "@/components/search-results/NotificationsDropdown";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function MainHeader({
  onMenuOpen = () => {},
  notifications = [],
  onUpdateNotifications = () => {},
  logoText = "",
  logoSrc = "/logo.png",
}: {
  onMenuOpen?: () => void;
  notifications?: any[];
  onUpdateNotifications?: (list: any[]) => void;
  logoText?: string;
  logoSrc?: string;
}) {
  const router = useRouter();

  return (
    <header className="relative z-20 bg-white border-b border-[#E5E7EB]">
      <div className="flex items-center justify-between w-full px-4 md:px-10 lg:px-20 py-3">

        {/* LEFT SECTION (Perfect left alignment) */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Arrow if text mode */}
          {logoText && (
            <button
              onClick={() => router.back()}
              className="p-1 text-black/80 hover:text-black"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Logo if NO text */}
          {!logoText && (
            <Image
              src={logoSrc}
              alt="Logo"
              width={96}
              height={37}
              className="w-[96px] h-[37px]"
            />
          )}

          {/* Text (auto left aligned) */}
          {logoText && (
            <h1 className="text-xl md:text-2xl font-semibold text-black leading-none">
              {logoText}
            </h1>
          )}
        </div>

        {/* RIGHT SECTION (perfect right alignment always) */}
        <div className="ml-auto flex items-center gap-4">

          {/* Compare icon */}
          <button className="p-2 hidden md:block text-black/80 hover:text-black">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M18 0H2C0.897 0 0 0.897 0 2V14C0 15.103 0.897 16 2 16H5V19.767L11.277 16H18C19.103 16 20 15.103 20 14V2C20 0.897 19.103 0 18 0ZM18 14H10.723L7 16.233V14H2V2H18V14Z"
                fill="black"
              />
            </svg>
          </button>

          {/* Notifications */}
          <NotificationsDropdown
            notifications={notifications}
            onUpdateNotifications={onUpdateNotifications}
          />

          {/* Menu Icon */}
          <button
            onClick={onMenuOpen}
            className="p-2 text-black/80 hover:text-black"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

      </div>
    </header>
  );
}
