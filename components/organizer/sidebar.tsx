"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid3X3, User, Plane, Library, } from "lucide-react";

type SidebarProps = {
  showLogo?: boolean;
};

export function Sidebar({ showLogo = true }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: <Grid3X3  /> },
    { name: "Organizer Profile", href: "/profile", icon: <User size={18} /> },
    { name: "Trip", href: "/organizer/create-trip", icon: <Plane size={18} /> },
    { name: "Library", href: "/library", icon: <Library size={18} /> },
  ];

  return (
    <aside className=" min-h-screen bg-gray-50 border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo Section */}
      {showLogo && (
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <img src="/logo.png" alt="Ragir" className="h-8 mr-2" />
            <span className="text-lg font-semibold text-gray-800 tracking-tight">
              
            </span>
          </div>
        </div>
      )}

      {/* Navigation Section */}
      <nav className="p-4 space-y-3">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200
                ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray hover:bg-gray-900"
                }`}
            >
              <span
                className={`transition-transform duration-200 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              >
                {link.icon}
              </span>
              <span className="font-medium">{link.name}</span>
              {/* Small left indicator for active link */}
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-gray-900 rounded-r-lg"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="mt-auto p-4 border-t border-gray-100">
        <div className="text-xs text-gray-400">Organizer Panel</div>
      </div>
    </aside>
  );
}
