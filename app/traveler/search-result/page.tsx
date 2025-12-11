"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, Bookmark, Gift, Heart, MapPin, Menu, MessageCircleQuestion, Scale, Search, Settings, Users } from "lucide-react";

import { MonthYearSelector } from "@/components/search-results/MonthYearSelector";
import { SidebarMenu } from "@/components/search-results/SidebarMenu";
import { MainHeader } from "@/components/search-results/MainHeader";

const menuItems = [
  { icon: Search, label: "Search by Mood", href: "/traveler/search-result/search-by-mood" },
  { icon: MapPin, label: "Search by Destinations", href: "/traveler/search-result/search-by-destinations" },
  { icon: Users, label: "About us", href: "/traveler/search-result/about" },
  { icon: Heart, label: "Popular Trips", href: "/traveler/search-result/popular-trips" },
  { icon: Gift, label: "Biggest Discounts", href: "/traveler/search-result/discounts" },
  { icon: Scale, label: "Compare Trips", href: "/traveler/search-result/compare-trips" },
  { icon: Bookmark, label: "Wishlist", href: "/traveler/search-result/wishlist" },
];


const userMenuItems = [
  { icon: Bell, label: "Trip Invitations Sent", href: "/traveler/search-result/invitations" },
  { icon: MessageCircleQuestion, label: "My Queries", href: "/traveler/search-result/my-queries" },
  { icon: Bookmark, label: "Saved Trips", href: "/saved" },
  { icon: Settings, label: "Settings", href: "/traveler/search-result/settings" },
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
    read: false,
  },
];

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState(notificationsData);

  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState<"Jan" | string>("Jan");

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* ------------ HEADER (imported component) ------------ */}
      <MainHeader
        onMenuOpen={() => setIsMenuOpen(true)}
        notifications={notificationsList}
        onUpdateNotifications={setNotificationsList}
      />

      {/* ------------ MAIN SECTION ------------ */}
      <main className="relative z-10 px-6 md:px-12 lg:px-20 py-8 md:py-16">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* LEFT Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black leading-tight mb-6">
              Join Group Trips. Meet Like Minded Travelers. Around the World!
            </h2>

            <p className="text-black/70 text-sm md:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 mb-10">
              Discover incredible group trips & connect with a thriving travel community worldwide.
            </p>

            {/* Images Grid */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 max-w-md mx-auto lg:mx-0">
              {[
                "/traveler-woman-smiling-beach.jpg",
                "/images/northern-lights.png",
                "/mountain-landscape-scenic.jpg",
                "/tropical-beach-palm-trees.png",
                "/train-bridge-viaduct-scenic.jpg",
                "/sunset-ocean-view.png",
              ].map((src, i) => (
                <div
                  key={i}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-gray-200"
                >
                  <Image
                    src={src}
                    alt="Travel"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side (Phone Mockup) */}
          <div className="flex-shrink-0 relative">
            <div className="relative w-[280px] md:w-[320px] lg:w-[340px]">
              <div className="bg-white rounded-[40px] p-3 shadow-2xl">
                <div className="bg-background rounded-[32px] overflow-hidden">
                  <div className="p-4">

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4">
                      <button className="flex-1 py-2.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        Destination
                      </button>
                      <button className="flex-1 py-2.5 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                        Mood
                      </button>
                    </div>

                    <MonthYearSelector
                      year={selectedYear}
                      month={selectedMonth}
                      minYear={2024}
                      maxYear={2030}
                      onChange={({ year, month }) => {
                        setSelectedYear(year);
                        setSelectedMonth(month);
                      }}
                    />

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ------------ SIDEBAR MENU ------------ */}
      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        menuItems={menuItems}
        userMenuItems={userMenuItems}
      />

    </div>
  );
}
