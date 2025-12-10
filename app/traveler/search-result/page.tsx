"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search, MapPin, Bell, Bookmark, Settings, LogOut, Users, Gift, Scale, Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MonthYearSelector } from "@/components/search-results/MonthYearSelector"

const menuItems = [
  { icon: Search, label: "Search by Mood", href: "search-result/search-by-mood" },
  { icon: MapPin, label: "Search by Destinations", href: "search-result/search-by-destinations" },
  { icon: Users, label: "About us", href: "/about" },
  { icon: Heart, label: "Popular Trips", href: "search-result/wishlist" },
  { icon: Gift, label: "Biggest Discounts", href: "/discounts" },
  { icon: Scale, label: "Compare Trips", href: "search-result/compare-trips" },
]

const userMenuItems = [
  { icon: Bell, label: "Trip Invitations Sent", href: "/invitations" },
  { icon: Bookmark, label: "Saved Trips", href: "/saved" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState<'Jan' | string>('Jan');

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Header */}
      <header className="relative z-20 px-6 py-4 md:px-12 lg:px-20 bg-white">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-black italic">Ragir</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-black/80 hover:text-black transition-colors hidden md:block">
              <Scale className="w-5 h-5" />
            </button>
            <button className="p-2 text-black/80 hover:text-black transition-colors hidden md:block">
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-black/80 hover:text-black transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-12 lg:px-20 py-8 md:py-16 bg-white">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black leading-tight mb-6">
              Join Group Trips. Meet Like Minded Travelers. Around the World!
            </h2>
            <p className="text-black/70 text-sm md:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 mb-10">
              An all-in-one platform to discover the most incredible group trips, connect with like-minded travelers and
              be part of a thriving community that shares your passion for exploration and connection.
            </p>

            {/* Circular Images Grid */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 max-w-md mx-auto lg:mx-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-black/10">
                <Image
                  src="/traveler-woman-smiling-beach.jpg"
                  alt="Traveler"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-black/10">
                <Image
                  src="/images/northern-lights.png"
                  alt="Northern Lights"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-black/10">
                <Image
                  src="/mountain-landscape-scenic.jpg"
                  alt="Mountain"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-black/10">
                <Image
                  src="/tropical-beach-palm-trees.png"
                  alt="Beach"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-black/10">
                <Image
                  src="/train-bridge-viaduct-scenic.jpg"
                  alt="Train Bridge"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-black/10">
                <Image
                  src="/sunset-ocean-view.png"
                  alt="Sunset"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="flex-shrink-0 relative">
            <div className="relative w-[280px] md:w-[320px] lg:w-[340px]">
              {/* Phone Frame */}
              <div className="bg-black rounded-[40px] p-3 shadow-2xl">
                <div className="bg-white rounded-[32px] overflow-hidden border">
                  {/* Header */}
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
                    <span className="text-xs font-medium text-black">Se...</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                  </div>

                  {/* Search Tabs */}
                  <div className="p-4 bg-white">
                    <div className="flex gap-2 mb-4">
                      <button className="flex-1 py-2.5 bg-black text-white text-xs font-medium rounded-full">
                        Destination
                      </button>
                      <button className="flex-1 py-2.5 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                        Mood
                      </button>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Where do you want to travel?</label>
                        <p className="text-xs font-medium text-black">Destination</p>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 block mb-2">Destination</label>
                        <input
                          type="text"
                          placeholder="Enter destination"
                          className="w-full px-3 py-2 bg-gray-200 rounded-lg text-xs placeholder:text-gray-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 block mb-2">Region</label>
                        <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-black text-white text-xs font-medium rounded-lg">
                            Domestic
                          </button>
                          <button className="flex-1 py-2 bg-gray-200 text-gray-600 text-xs font-medium rounded-lg">
                            International
                          </button>
                        </div>
                      </div>

                      <div className="p-6">
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
          </div>
        </div>
      </main>

      {/* Slide Menu */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" onClick={() => setIsMenuOpen(false)} />

        {/* Menu Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-end p-4 border-b border-gray-200">
            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <item.icon className="w-5 h-5 text-gray-500 group-hover:text-black" />
                <span className="text-sm font-medium text-black">{item.label}</span>
              </Link>
            ))}

            <div className="my-4 border-t border-gray-300" />

            {/* User Profile */}
            <div className="flex items-center gap-3 px-4 py-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/man-profile.png" />
                <AvatarFallback className="bg-black text-white">DR</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-black">Dirk Russell</p>
                <p className="text-xs text-gray-600">dirk@gmail.com</p>
              </div>
            </div>

            {userMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <item.icon className="w-5 h-5 text-gray-500 group-hover:text-black" />
                <span className="text-sm font-medium text-black">{item.label}</span>
              </Link>
            ))}

            <div className="my-4 border-t border-gray-300" />

            {/* Logout */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-black text-black rounded-full hover:bg-gray-100 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
