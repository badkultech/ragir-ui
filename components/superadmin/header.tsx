"use client"
import { SuperAdminProfileDropdown } from "./profileDropdown"
import { NotificationDropdown } from "./notificationDropdown"
import { selectAuthState } from "@/lib/slices/auth"
import { useSelector } from "react-redux"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
   const { userData } = useSelector(selectAuthState);
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
         <div className="flex items-center space-x-4">
          {userData?.organizationPublicId && userData?.userPublicId && (
            <NotificationDropdown
              organizationId={userData.organizationPublicId}
              userId={userData.userPublicId}
              role={userData.userType}
            />
          )}
          <SuperAdminProfileDropdown/>
        </div>
      </div>
    </header>
  )
}
