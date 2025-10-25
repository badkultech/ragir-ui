"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Plus,
  CircleUser,
  MapPinned,
  Images,
  ChevronDown,
  ChevronRight,
  X,
  BookOpen,
  Calendar,
  Hotel,
  Car,
  UtensilsCrossed,
  PersonStanding,
  Users,
  HelpCircle,
  Award,
  UserRoundPlus,
  Headphones,
  Settings,
  Briefcase,
  CreditCard,
  House,
  UserRoundCog,
  MessageCircleQuestion,
  LogOut,
} from "lucide-react";
import {
  LibraryIcon,
  TripIcon,
} from "@/components/library/SvgComponents/Icons";
import { useState, useEffect } from "react";
import { LogoutModal } from "./LogoutModal";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ComponentType<any>;
  boxedPlus?: boolean;
  children?: NavItem[];
};

const nav: NavItem[] = [
  { label: "Dashboard", href: "/organizer/dashboard", icon: LayoutGrid },
  {
    label: "Organizer Profile",
    href: "/organizer/profile",
    icon: CircleUser,
  },
  { label: "Trip", href: "/organizer/create-trip", icon: TripIcon },
  {
    label: "Library",
    href: "/organizer/library",
    icon: LibraryIcon,
    children: [
      {
        label: "Day Description",
        href: "/organizer/library/events",
        icon: Calendar,
      },
      { label: "Stays", href: "/organizer/library/stays", icon: House },
      { label: "Transit", href: "/organizer/library/transits", icon: Car },
      {
        label: "Meals",
        href: "/organizer/library/meals",
        icon: UtensilsCrossed,
      },
      {
        label: "Activities",
        href: "/organizer/library/activities",
        icon: PersonStanding,
      },
      {
        label: "Trip Leaders",
        href: "/organizer/library/trip-leaders",
        icon: UserRoundCog,
      },
      { label: "FAQs", href: "/organizer/library/faqs", icon: MessageCircleQuestion },
    ],
  },
  { label: "Team Members", href: "/organizer/team", icon: UserRoundPlus },
  { label: "Support Center", href: "/organizer/support", icon: Headphones },
  { label: "Billing", href: "/organizer/billing", icon: CreditCard },
  { label: "Settings", href: "/organizer/settings", icon: Settings },
];

type OrganizerSidebarProps = {
  showLogo?: boolean;
  isOpen: boolean; // for mobile
  onClose: () => void;
};



export function OrganizerSidebar({
  showLogo = true,
  isOpen,
  onClose,
}: OrganizerSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({ ["Library"]: false });
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ✅ modal state

  const isActive = (href?: string) =>
    href
      ? href === "/organizer"
        ? pathname === href
        : pathname.startsWith(href)
      : false;

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

  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Optionally redirect
    window.location.href = "/superadmin/login";
    // Add your logout logic here
    console.log("User logged out");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`bg-[#F3F3F3] fixed md:static top-0 left-0 z-50 min-h-screen md:w-[18.2%] max-w-[320px] border-r border-gray-200 flex flex-col transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 md:hidden">
          {showLogo && <img src="/logo.png" alt="Ragir" className="h-8" />}
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Logo (desktop) */}
        {showLogo && (
          <div className="hidden md:block p-6 border-b border-gray-100">
            <img src="/logo.png" alt="Ragir" className="h-8" />
          </div>
        )}

        {/* Navigation */}
        <nav className="p-3 space-y-3 overflow-y-auto">
          {nav.map(({ label, href, icon: Icon, boxedPlus, children }) => {
            const active = isActive(href);

            return (
              <div key={label}>
                <div
                  className={[
                    "flex items-center justify-between rounded-[8px]",
                    active
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <Link
                    href={href || "#"}
                    className="group relative flex flex-1 items-center gap-3 rounded-lg px-4 py-3 transition-all"
                  >
                    <Icon
                      className={[
                        "w-5 h-5",
                        active
                          ? "text-white"
                          : "text-gray-700 group-hover:text-gray-900",
                      ].join(" ")}
                    />
                    <span className="font-medium text-[1rem]">{label}</span>
                  </Link>
                  {children && (
                    <button
                      onClick={() => toggle(label)}
                      className="flex items-center justify-center w-6 h-6 rounded-full transition-colors pr-1"
                    >
                      {open[label] ? (
                        <ChevronDown
                          className={[
                            "w-5 h-5 ",
                            active ? "text-white" : "text-gray-700",
                          ].join(" ")}
                        />
                      ) : (
                        <ChevronRight
                          className={[
                            "w-5 h-5 ",
                            active ? "text-white" : "text-gray-700",
                          ].join(" ")}
                        />
                      )}
                    </button>
                  )}
                </div>

                {/* Submenu */}
                {children && open[label] && (
                  <div className=" bg-gray-100 rounded-[8px]">
                    <div className="mx-2 py-2 space-y-2">
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
                                  ? "bg-gray-50 text-gray-600"
                                  : "text-gray-600 hover:bg-gray-50",
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
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mt-auto p-6">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
      {/* Logout Modal */}
      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
