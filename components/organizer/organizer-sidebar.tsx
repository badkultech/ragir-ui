"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  User2,
  FolderOpen,
  MapPinned,
  Library as LibraryIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavItem[];
  boxedPlus?: boolean;
};

const nav: NavItem[] = [
  { label: "Organizer Profile", href: "/organizer/profile", icon: User2 },
  {
    label: "Trip",
    href: "/trip",
    icon: FolderOpen,
    children: [
      { label: "Create New Trip", href: "/organizer/create-trip", icon: MapPinned },
      { label: "Library", href: "/trip/library", icon: LibraryIcon },
    ],
  },
];

type OrganizerSidebarProps = { showLogo?: boolean };

export function OrganizerSidebar({ showLogo = true }: OrganizerSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({ Trip: true });

  const isActive = (href?: string) =>
    href ? (href === "/trip" ? pathname === href : pathname.startsWith(href)) : false;

  useEffect(() => {
    nav.forEach((item) => {
      if (item.children?.some((child) => isActive(child.href))) {
        setOpen((prev) => ({ ...prev, [item.label]: true }));
      }
    });
  }, [pathname]);

  const toggle = (label: string) => setOpen((p) => ({ ...p, [label]: !p[label] }));

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {showLogo && (
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <img src="/logo.png" alt="Ragir" className="h-8 mr-2" />
          </div>
        </div>
      )}

      <nav className="p-4 space-y-3">
        {nav.map(({ label, href, icon: Icon, children, boxedPlus }) => {
          const active = isActive(href);
          return (
            <div key={label}>
              <div className="flex items-center justify-between">
                <Link
                  href={href || "#"}
                  className={[
                    "group relative flex flex-1 items-center gap-3 rounded-lg px-4 py-3 transition-all",
                    active ? "bg-gray-900 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "w-5 h-5",
                      active ? "text-white" : "text-gray-700 group-hover:text-gray-900",
                    ].join(" ")}
                  />
                  <span className="font-medium">{label}</span>
                </Link>

                {children && (
                  <button
                    onClick={() => toggle(label)}
                    className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label={`Toggle ${label}`}
                  >
                    {open[label] ? (
                      <ChevronDown className="w-5 h-5 text-gray-700" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                )}
              </div>

              {children && open[label] && (
                <div className="ml-6 mt-1 space-y-2">
                  {children.map(({ label, href, icon: ChildIcon }) => {
                    const childActive = isActive(href);
                    return (
                      <Link
                        key={href}
                        href={href || "#"}
                        className={[
                          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                          childActive ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100",
                        ].join(" ")}
                      >
                        <ChildIcon className="w-4 h-4" />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto p-4">
        <div className="text-xs text-gray-400">Organizer</div>
      </div>
    </aside>
  );
}
