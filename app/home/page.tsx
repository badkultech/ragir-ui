"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectAuthState } from "@/lib/slices/auth";
import { useRouter } from "next/navigation";

import { MainHeader } from "@/components/search-results/MainHeader";
import { SidebarMenu } from "@/components/search-results/SidebarMenu";
import { HeroSection } from "@/components/homePage/sections/hero-section";
import { CategoriesSection } from "@/components/homePage/sections/categories-section";
import { PartnersSection } from "@/components/homePage/sections/partners-section";
import { RegionsSection } from "@/components/homePage/sections/regions-section";
import { TripLeadersSection } from "@/components/homePage/sections/trip-leaders-section";
import { Footer } from "@/components/homePage/sections/footer";
import { menuItems, userMenuItems, notificationsData } from "./constants";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState(notificationsData);

  const dispatch = useDispatch();
  const router = useRouter();

  const { accessToken, userData } = useSelector(selectAuthState);
  const isLoggedIn = Boolean(accessToken && userData);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    setIsMenuOpen(false);
    router.push("/login");
  };

  return (
    <main className="min-h-screen">
      <MainHeader
        isLoggedIn={isLoggedIn}
        onMenuOpen={() => setIsMenuOpen(true)}
        notifications={notificationsList}
        onUpdateNotifications={setNotificationsList}
      />

      <HeroSection />
      <CategoriesSection />
      <PartnersSection />
      <RegionsSection />
      <TripLeadersSection />
      <Footer />

      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        menuItems={menuItems}
        userMenuItems={userMenuItems}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />
    </main>
  );
}
