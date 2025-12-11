"use client";

import { useState } from "react";
import { MainHeader } from "@/components/search-results/MainHeader";
import { SidebarMenu } from "@/components/search-results/SidebarMenu";
import { HeroSection } from "@/components/homePage/sections/hero-section";
import { CategoriesSection } from "@/components/homePage/sections/categories-section";
import { PartnersSection } from "@/components/homePage/sections/partners-section";
import { RegionsSection } from "@/components/homePage/sections/regions-section";
import { TripLeadersSection } from "@/components/homePage/sections/trip-leaders-section";
import { Footer } from "@/components/homePage/sections/footer";

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
];

export default function Home() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState(notificationsData);

  return (
    <main className="min-h-screen">
      <MainHeader
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
      />

    </main>
  );
}
