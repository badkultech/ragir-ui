"use client";

import { useState } from "react";
import { useAuthActions } from "@/hooks/useAuthActions";

import { MainHeader } from "@/components/search-results/MainHeader";
import { SidebarMenu } from "@/components/search-results/SidebarMenu";
import { HeroSection } from "@/components/homePage/sections/hero-section";
import { CategoriesSection } from "@/components/homePage/sections/categories-section";
import { PartnersSection } from "@/components/homePage/sections/partners-section";
import { RegionsSection } from "@/components/homePage/sections/regions-section";
import { TripLeadersSection } from "@/components/homePage/sections/trip-leaders-section";
import { Footer } from "@/components/homePage/sections/footer";
import { menuItems, userMenuItems, notificationsData } from "./constants";

import { PhoneEntryModal } from "@/components/auth/PhoneEntryModal";
import { OTPVerificationModal } from "@/components/auth/OTPVerificationModal";
import { RegisterModal } from "@/components/auth/RegisterModal";

export default function Home() {
  const { isLoggedIn, handleLogout, router } = useAuthActions();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState(notificationsData);

  const [authStep, setAuthStep] = useState<"PHONE" | "OTP" | "REGISTER" | null>(null);
  const [phone, setPhone] = useState("");

  const onLogout = () => {
    handleLogout(() => setIsMenuOpen(false));
  };

  return (
    <main className="min-h-screen relative">
      <MainHeader
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setAuthStep("PHONE")}
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
        onLogout={onLogout}
        isLoggedIn={isLoggedIn}
      />

      {/* PHONE ENTRY MODAL */}
      {authStep === "PHONE" && (
        <PhoneEntryModal
          onClose={() => setAuthStep(null)}
          onOtpSent={(p) => {
            setPhone(p);
            setAuthStep("OTP");
          }}
        />
      )}

      {/* OTP VERIFICATION MODAL */}
      {authStep === "OTP" && (
        <OTPVerificationModal
          phone={phone}
          onBack={() => setAuthStep("PHONE")}
          onClose={() => setAuthStep(null)}
          onNewUser={() => setAuthStep("REGISTER")}
        />
      )}

      {/* REGISTER MODAL */}
      {authStep === "REGISTER" && (
        <RegisterModal
          phone={phone}
          onClose={() => setAuthStep(null)}
        />
      )}
    </main>
  );
}
