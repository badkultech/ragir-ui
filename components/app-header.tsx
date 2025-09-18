"use client";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { Menu } from "lucide-react";

// Profile dropdowns
import { SuperAdminProfileDropdown } from "./profileDropdowns/superAdminProfileDropdown";
import { UserProfileDropdown } from "./profileDropdowns/userProfileDropdown";
import { ManagerProfileDropdown } from "./profileDropdowns/managerProfileDropdown";
import { DefaultProfileDropdown } from "./profileDropdowns/defaultProfileDropdown";

// Notification dropdowns
import { SuperAdminNotificationDropdown } from "./notificationDropdowns/superAdminNotificationDropdown";
import { UserNotificationDropdown } from "./notificationDropdowns/userNotificationDropdown";
import { ManagerNotificationDropdown } from "./notificationDropdowns/managerNotificationDropdown";
import { DefaultNotificationDropdown } from "./notificationDropdowns/defaultNotificationDropdown";

type AppHeaderProps = {
  title?: string;
  showAvatar?: boolean;
  showLogo?: boolean;
  onMenuClick?: () => void; // 👈 new prop
};

export function AppHeader({
  title,
  showAvatar = true,
  showLogo = false,
  onMenuClick,
}: AppHeaderProps) {
  const { userData } = useSelector(selectAuthState);

  // choose ProfileDropdown
  let ProfileDropdown: React.FC = DefaultProfileDropdown;
  switch (userData?.userType) {
    case "SYSTEM_ADMIN":
      ProfileDropdown = SuperAdminProfileDropdown;
      break;
    case "USER":
      ProfileDropdown = UserProfileDropdown;
      break;
    case "ORGANIZATION_ADMIN":
      ProfileDropdown = ManagerProfileDropdown;
      break;
    default:
      ProfileDropdown = DefaultProfileDropdown;
  }

  // choose NotificationDropdown
  let NotificationDropdown: React.FC<any> = DefaultNotificationDropdown;
  switch (userData?.userType) {
    case "SYSTEM_ADMIN":
      NotificationDropdown = SuperAdminNotificationDropdown;
      break;
    case "USER":
      NotificationDropdown = UserNotificationDropdown;
      break;
    case "ORGANIZATION_ADMIN":
      NotificationDropdown = ManagerNotificationDropdown;
      break;
    default:
      NotificationDropdown = DefaultNotificationDropdown;
  }

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-6 py-3">
      <div className="flex items-center gap-4 flex-1">
        {/* Hamburger (mobile only) */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-gray-100 md:hidden"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* Logo (optional, shown if showLogo=true) */}
        {showLogo && (
          <div className="flex items-center">
            <img src="/logo.png" alt="Ragir" className="h-8" />
          </div>
        )}

        {/* Title */}
        {title && (
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">
            {title}
          </h1>
        )}
      </div>

      {/* Right side (Notifications + Profile) */}
      {showAvatar && (
        <div className="flex items-center space-x-4">
          {userData?.organizationPublicId && userData?.userPublicId ? (
            <NotificationDropdown
              organizationId={userData.organizationPublicId}
              userId={userData.userPublicId}
              role={userData.userType}
            />
          ) : (
            <DefaultNotificationDropdown />
          )}
          <ProfileDropdown />
        </div>
      )}
    </header>
  );
}
