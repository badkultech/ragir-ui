"use client";


import { ChevronLeft } from "lucide-react";
import { PartnerCard } from "@/components/homePage/shared/partner-card";
import { Footer } from "@/components/homePage/sections/footer";
import { MainHeader } from "@/components/search-results/MainHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SidebarMenu } from "@/components/search-results/SidebarMenu";
import { menuItems, notificationsData, userMenuItems } from "../constants";
import { logout, selectAuthState } from "@/lib/slices/auth";
import { useDispatch, useSelector } from "react-redux";

const partners = [
  { id: "the-lalit", name: "The Lalit", logo: "/tp-logo1.jpg" },
  { id: "aishwarya", name: "Aishwarya", logo: "/tp-logo2.png" },
  { id: "kaveri-grand", name: "Kaveri Grand", logo: "/tp-logo3.png" },
  { id: "golden-tulip", name: "Golden Tulip", logo: "/tp-logo4.png" },
  { id: "kamat", name: "Kamat", logo: "/tp-logo5.png" },
  { id: "radisson", name: "Radisson", logo: "/tp-logo6.png" },
  { id: "taj", name: "Taj Hotels", logo: "/tp-logo7.png" },
  { id: "tgi", name: "TGI", logo: "/tp-logo8.png" },
  { id: "leela", name: "The Leela", logo: "/tp-logo9.png" },
];

export default function PartnersPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(notificationsData);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { accessToken, userData } = useSelector(selectAuthState);
  const isLoggedIn = Boolean(accessToken && userData);
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    setSidebarOpen(false);
    router.push("/home");
  };
  return (
    <>
      <MainHeader
        isLoggedIn={true}
        notifications={notifications}
        onUpdateNotifications={setNotifications}
        onMenuOpen={() => setSidebarOpen(true)}
      />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header with back button */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => router.back()}>
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl md:text-3xl font-barlow font-semibold italic  text-gray-900">
              Our Trusted Partners
            </h1>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((partner) => (
              <PartnerCard
                key={partner.id}
                id={partner.id}
                name={partner.name}
                logo={partner.logo}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={menuItems}
        userMenuItems={userMenuItems}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
