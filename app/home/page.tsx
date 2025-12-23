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

import {
  Bell, Bookmark, Gift, Heart, MapPin, MessageCircleQuestion,
  Scale, Search, Settings, Users
} from "lucide-react";

const menuItems = [
  { icon: Search, label: "Search by Mood", href: "/home/search-by-mood" },
  { icon: MapPin, label: "Search by Destinations", href: "/home/search-by-destinations" },
  { icon: Users, label: "About us", href: "/home/about" },
  { icon: Heart, label: "Popular Trips", href: "/home/popular-trips" },
  { icon: Gift, label: "Biggest Discounts", href: "/home/discounts" },
  { icon: Scale, label: "Compare Trips", href: "/home/compare-trips" },
  { icon: Bookmark, label: "Wishlist", href: "/home//wishlist" },
];

const userMenuItems = [
  { icon: Bell, label: "Trip Invitations Sent", href: "/home/invitations" },
  { icon: MessageCircleQuestion, label: "My Queries", href: "/home/my-queries" },
  { icon: Bookmark, label: "Saved Trips", href: "/saved" },
  { icon: Settings, label: "Settings", href: "/home/settings" },
];

const notificationsData = [
  {
    id: 1,
    type: "booking",
    title: "Booking Confirmed!",
    description: "Your booking for Ladakh Skygaze has been confirmed",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "message",
    title: "New Message",
    description: "Trip organizer replied to your query",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "reminder",
    title: "Trip Reminder",
    description: "Your Himalayan Adventure Trek starts in 3 days",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 4,
    type: "update",
    title: "Trip Update",
    description: "Itinerary updated for Goa Beach Getaway",
    time: "2 hours ago",
    read: true,
  },
];

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
