"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Menu,
  X,
  Search,
  MapPin,
  Bell,
  Bookmark,
  Settings,
  LogOut,
  Users,
  Gift,
  Scale,
  Heart,
  Check,
  MessageSquare,
  Clock,
  Calendar,
  MessageCircleQuestion,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MonthYearSelector } from "@/components/search-results/MonthYearSelector"
import { NotificationsDropdown } from "@/components/search-results/NotificationsDropdown"

const menuItems = [
  { icon: Search, label: "Search by Mood", href: "search-result/search-by-mood" },
  { icon: MapPin, label: "Search by Destinations", href: "search-result/search-by-destinations" },
  { icon: Users, label: "About us", href: "search-result/about" },
  { icon: Heart, label: "Popular Trips", href: "search-result/popular-trips" },
  { icon: Gift, label: "Biggest Discounts", href: "search-result/discounts" },
  { icon: Scale, label: "Compare Trips", href: "search-result/compare-trips" },
  { icon: Bookmark, label: "Wishlist", href: "search-result/wishlist" },
]

const userMenuItems = [
  { icon: Bell, label: "Trip Invitations Sent", href: "search-result/invitations" },
  { icon: MessageCircleQuestion, label: "My Queries", href: "search-result/my-queries" },
  { icon: Bookmark, label: "Saved Trips", href: "/saved" },
  { icon: Settings, label: "Settings", href: "search-result/settings" },
]

const notifications = [
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
]

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notificationsList, setNotificationsList] = useState(notifications)
  const notificationsRef = useRef<HTMLDivElement>(null)

  const unreadCount = notificationsList.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotificationsList(notificationsList.map((n) => ({ ...n, read: true })))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Check className="w-4 h-4 text-white" />
      case "message":
        return <MessageSquare className="w-4 h-4 text-white" />
      case "reminder":
        return <Clock className="w-4 h-4 text-white" />
      case "update":
        return <Calendar className="w-4 h-4 text-white" />
      default:
        return <Bell className="w-4 h-4 text-white" />
    }
  }
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState<'Jan' | string>('Jan');

  return (
    <div className="min-h-screen bg-[#3d5a4c] relative overflow-hidden">
      {/* Header */}
      <header className="relative z-20 px-6 py-4 md:px-12 lg:px-20">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white italic">Ragir</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-white/80 hover:text-white transition-colors hidden md:block">
              <Scale className="w-5 h-5" />
            </button>
            <NotificationsDropdown
              notifications={notificationsList}
              onUpdateNotifications={setNotificationsList}
            />
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-12 lg:px-20 py-8 md:py-16">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
              Join Group Trips. Meet Like Minded Travelers. Around the World!
            </h2>
            <p className="text-white/70 text-sm md:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 mb-10">
              An all-in-one platform to discover the most incredible group trips, connect with like-minded travelers and
              be part of a thriving community that shares your passion for exploration and connection.
            </p>

            {/* Circular Images Grid */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 max-w-md mx-auto lg:mx-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/20">
                <Image
                  src="/traveler-woman-smiling-beach.jpg"
                  alt="Traveler"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/20">
                <Image
                  src="/images/northern-lights.png"
                  alt="Northern Lights"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/20">
                <Image
                  src="/mountain-landscape-scenic.jpg"
                  alt="Mountain"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white/20">
                <Image
                  src="/tropical-beach-palm-trees.png"
                  alt="Beach"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/20">
                <Image
                  src="/train-bridge-viaduct-scenic.jpg"
                  alt="Train Bridge"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/20">
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

          {/* Right Content - Phone Mockup */}
          <div className="flex-shrink-0 relative">
            <div className="relative w-[280px] md:w-[320px] lg:w-[340px]">
              {/* Phone Frame */}
              <div className="bg-white rounded-[40px] p-3 shadow-2xl">
                <div className="bg-background rounded-[32px] overflow-hidden">
                  {/* Phone Header */}
                  <div className="bg-card px-4 py-3 flex items-center justify-between border-b border-border">
                    <span className="text-xs font-medium text-foreground">Se...</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted rounded-full"></div>
                      <div className="w-2 h-2 bg-muted rounded-full"></div>
                    </div>
                  </div>

                  {/* Search Tabs */}
                  <div className="p-4">
                    <div className="flex gap-2 mb-4">
                      <button className="flex-1 py-2.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        Destination
                      </button>
                      <button className="flex-1 py-2.5 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                        Mood
                      </button>
                    </div>

                    {/* Search Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Where do you want to travel?</label>
                        <p className="text-xs font-medium text-foreground">Destination</p>
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground block mb-2">Destination</label>
                        <input
                          type="text"
                          placeholder="Enter destination"
                          className="w-full px-3 py-2 bg-muted rounded-lg text-xs placeholder:text-muted-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground block mb-2">Region</label>
                        <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg flex items-center justify-center gap-1">
                            <span>Domestic</span>
                          </button>
                          <button className="flex-1 py-2 bg-muted text-muted-foreground text-xs font-medium rounded-lg flex items-center justify-center gap-1">
                            <span>International</span>
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

      {/* Slide-out Navigation Menu */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" onClick={() => setIsMenuOpen(false)} />

        {/* Menu Panel */}
        {/* Menu Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-card shadow-2xl transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-end p-4 border-b border-border">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* ⭐ Scrollable Menu Content */}
          <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-70px)]">
            {/* Main Menu Items */}
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors group"
              >
                <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </Link>
            ))}

            {/* Divider */}
            <div className="my-4 border-t border-border" />

            {/* User Profile */}
            <div className="flex items-center gap-3 px-4 py-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/man-profile.png" />
                <AvatarFallback className="bg-primary text-primary-foreground">DR</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">Dirk Russell</p>
                <p className="text-xs text-muted-foreground">dirk@gmail.com</p>
              </div>
            </div>

            {/* User Menu Items */}
            {userMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors group"
              >
                <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </Link>
            ))}

            {/* Divider */}
            <div className="my-4 border-t border-border" />

            {/* Logout Button */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-primary text-primary rounded-full hover:bg-primary/5 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
