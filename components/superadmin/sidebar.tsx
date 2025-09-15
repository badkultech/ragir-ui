"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Grid3X3,
  Plus,
  User,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  boxedPlus?: boolean;
  children?: NavItem[];
};

const nav: NavItem[] = [
  { label: "Dashboard", href: "/superadmin", icon: Grid3X3 },
  {
    label: "Admins",
    href: "/superadmin/admins",
    icon: User,
    children: [
      { label: "Add Admin", href: "/superadmin/add-admin", icon: Plus },
    ],
  },
  {
    label: "Organizers",
    href: "/superadmin/organizers",
    icon: User,
    children: [
      {
        label: "Add Organizer",
        href: "/superadmin/add-organizer",
        icon: Plus,
        boxedPlus: true,
      },
    ],
  },
];

type SidebarProps = {
  showLogo?: boolean; // 👈 new prop
};

export function Sidebar({ showLogo = true }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const isActive = (href?: string) =>
    href
      ? href === "/superadmin"
        ? pathname === href
        : pathname.startsWith(href)
      : false;

  // auto-open menu if child is active
  useEffect(() => {
    nav.forEach((item) => {
      if (item.children?.some((child) => isActive(child.href))) {
        setOpen((prev) => ({ ...prev, [item.label]: true }));
      }
    });
  }, [pathname]);

  const toggle = (label: string) => {
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo (optional) */}
      {showLogo && (
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <img src="/logo.png" alt="Ragir" className="h-8 mr-2" />
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="p-4 space-y-3">
        {nav.map(({ label, href, icon: Icon, boxedPlus, children }) => {
          const active = isActive(href);

          return (
            <div key={label}>
              {/* Top-level with link + expand arrow */}
              <div className="flex items-center justify-between">
                <Link
                  href={href || "#"}
                  className={[
                    "group relative flex flex-1 items-center gap-3 rounded-lg px-4 py-3 transition-all",
                    active
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "w-5 h-5",
                      active
                        ? "text-white"
                        : "text-gray-700 group-hover:text-gray-900",
                    ].join(" ")}
                  />
                  <span className="font-medium">{label}</span>
                </Link>
                {children && (
                  <button
                    onClick={() => toggle(label)}
                    className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {open[label] ? (
                      <ChevronDown className="w-5 h-5 text-gray-700" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                )}
              </div>

              {/* Submenu */}
              {children && open[label] && (
                <div className="ml-6 mt-1 space-y-2">
                  {children.map(
                    ({ label, href, icon: ChildIcon, boxedPlus }) => {
                      const childActive = isActive(href);
                      return (
                        <Link
                          key={href}
                          href={href || "#"}
                          className={[
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                            childActive
                              ? "bg-gray-900 text-white"
                              : "text-gray-600 hover:bg-gray-100",
                          ].join(" ")}
                        >
                          {boxedPlus ? (
                            <span
                              className={[
                                "inline-flex h-5 w-5 items-center justify-center rounded border text-xs font-semibold",
                                childActive
                                  ? "bg-white/10 border-white/20 text-white"
                                  : "border-gray-300 text-gray-600 group-hover:border-gray-400",
                              ].join(" ")}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </span>
                          ) : (
                            <ChildIcon className="w-4 h-4" />
                          )}
                          <span>{label}</span>
                        </Link>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto p-4">
        <div className="text-xs text-gray-400">Super Admin</div>
      </div>
    </aside>
  );
}
