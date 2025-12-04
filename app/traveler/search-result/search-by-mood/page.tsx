"use client"

import { useState } from "react"
import {
  ChevronLeft,
  Heart,
  Mountain,
  Sun,
  Umbrella,
  TreePine,
  Leaf,
  Sparkles,
  Castle,
  Compass,
  Flag,
  Car,
  Calendar,
  PartyPopper,
  GraduationCap,
  Tent,
  Moon,
  ChevronDown,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoodTag } from "@/components/search-results/mood-tag"
import { TripCard } from "@/components/search-results/trip-card"

const moods = [
  { name: "Mountain", icon: Mountain, active: false },
  { name: "Beach", icon: Umbrella, active: false },
  { name: "Jungle", icon: Leaf, active: false },
  { name: "Desert", icon: TreePine, active: false },
  { name: "Skygaze", icon: Sun, active: true },
  { name: "Wellness", icon: Sparkles, active: true },
  { name: "Heritage", icon: Castle, active: false },
  { name: "Adventure", icon: Compass, active: true },
  { name: "Trekking", icon: Flag, active: false },
  { name: "Motorsports", icon: Car, active: false },
  { name: "Weekends", icon: Calendar, active: true },
  { name: "Parties", icon: PartyPopper, active: true },
  { name: "Learning", icon: GraduationCap, active: false },
  { name: "Camping", icon: Tent, active: false },
  { name: "Spiritual", icon: Moon, active: false },
]

const months = ["July", "Aug", "Sept", "Oct", "Nov"]

const skygazeTrips = [
  {
    id: 1,
    title: "Ladakh Skygaze",
    location: "Himachal Pradesh, Leh,",
    subLocation: "Nubra Valley +2 more",
    rating: 4.8,
    days: "5D/4N",
    dates: "15 Dec - 20 Dec",
    price: 12999,
    badge: "Skygaze",
    badgeColor: "bg-[#3d5a4c]",
    image: "/hampi-ruins-temples.png",
  },
  {
    id: 2,
    title: "Ladakh Skygaze",
    location: "Himachal Pradesh, Leh,",
    subLocation: "Nubra Valley +2 more",
    rating: 4.6,
    days: "5D/4N",
    dates: "15 Dec - 20 Dec",
    price: 12999,
    badge: "Skygaze",
    badgeColor: "bg-[#3d5a4c]",
    image: "/stargazing-camping-night.jpg",
  },
  {
    id: 3,
    title: "Ladakh Skygaze",
    location: "Himachal Pradesh,",
    subLocation: "Nubra Valley +1 more",
    rating: null,
    days: "5D/4N",
    dates: "15 Dec - 20 Dec",
    price: null,
    badge: "Skygaze",
    badgeColor: "bg-[#3d5a4c]",
    image: "/mountain-night-sky-milky-way.jpg",
  },
]

const adventureTrips = [
  {
    id: 4,
    title: "Himalayan Adventure Trek",
    location: "Himachal Pradesh, Leh,",
    subLocation: "Nubra Valley +2 more",
    rating: 4.8,
    days: "5D/4N",
    dates: "15 Dec - 20 Dec",
    price: 12999,
    badge: "Adventure",
    badgeColor: "bg-[#e07a5f]",
    image: "/himalayan-trekking-adventure-mountains.jpg",
  },
  {
    id: 5,
    title: "Himalayan Adventure",
    location: "Himachal Pradesh, Leh,",
    subLocation: "Nubra Valley +2 more",
    rating: 4.6,
    days: "5D/4N",
    dates: "15 Dec - 20 Dec",
    price: 12999,
    badge: "Adventure",
    badgeColor: "bg-[#e07a5f]",
    image: "/mountain-climbing-adventure.png",
  },
  {
    id: 6,
    title: "Himalayan Adventure Trek",
    location: "Himachal Pradesh,",
    subLocation: "Nubra Valley +1 more",
    rating: null,
    days: "5D/4N",
    dates: "15 Dec - 30 Dec",
    price: null,
    badge: "Adventure",
    badgeColor: "bg-[#e07a5f]",
    image: "/adventure-camping-trekking.jpg",
  },
]

const weekendTrips = [
  {
    id: 7,
    title: "Goa Beach Getaway",
    location: "Himachal Pradesh, Leh,",
    subLocation: "Nubra Valley +2 more",
    rating: 4.8,
    days: "5D/4N",
    dates: "15 Dec - 20 Dec",
    price: 12999,
    badge: "Weekend",
    badgeColor: "bg-gradient-to-r from-[#f4a261] to-[#e07a5f]",
    image: "/goa-beach-sunset-weekend-getaway.jpg",
  },
  {
    id: 8,
    title: "Goa Beach Getaway",
    location: "Himachal Pradesh, Leh,",
    subLocation: "Nubra Valley +2 more",
    rating: 4.6,
    days: "5D/4N",
    dates: "15 Dec - 20 Dec",
    price: 12999,
    badge: "Weekend",
    badgeColor: "bg-gradient-to-r from-[#f4a261] to-[#e07a5f]",
    image: "/beach-resort-weekend-trip.jpg",
  },
  {
    id: 9,
    title: "Goa Beach Getaway",
    location: "Himachal Pradesh,",
    subLocation: "Nubra Valley +1 more",
    rating: null,
    days: "5D/4N",
    dates: "15 Dec - 20 Dec",
    price: null,
    badge: "Weekend",
    badgeColor: "bg-gradient-to-r from-[#f4a261] to-[#e07a5f]",
    image: "/weekend-beach-vacation.jpg",
  },
]

export default function SearchByMoodPage() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>(
    moods.filter((m) => m.active).map((m) => m.name),
  )
  const [selectedMonth, setSelectedMonth] = useState("Oct")
  const [selectedYear] = useState(2025)
  const router = useRouter()

  const toggleMood = (name: string) => {
    setSelectedMoods((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name],
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-[#e5e5e5]">
        <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1 hover:bg-[#f3f3f3] rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-[#2d2d2d]" />
            </button>
            <h1 className="text-base md:text-lg font-semibold text-[#2d2d2d]">
              Search by Mood
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-[#f3f3f3] rounded-full transition-colors hidden md:block">
              <Heart className="w-5 h-5 text-[#2d2d2d]" />
            </button>
            <Avatar className="w-8 h-8 md:w-9 md:h-9">
              <AvatarImage src="/woman-avatar-profile.jpg" />
              <AvatarFallback className="bg-[#e07a5f] text-white">
                U
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row max-w-[1400px] mx-auto w-full py-6 px-4 md:px-8 gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-[320px] lg:w-[360px] flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#f0f0f0] p-5">
            <h2 className="text-base font-semibold text-[#2d2d2d] mb-3 text-center">
              Search Trips
            </h2>

            {/* Mood Selection */}
            <div className="mb-6">
              <p className="text-sm text-[#191818] mb-3">
                What&apos;s your travel mood?
              </p>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <MoodTag
                    key={mood.name}
                    name={mood.name}
                    icon={mood.icon}
                    isActive={selectedMoods.includes(mood.name)}
                    onClick={() => toggleMood(mood.name)}
                  />
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <p className="text-sm text-[#6b6b6b] mb-3">
                When do you want to go?
              </p>

              {/* Year Selector */}
              <div className="flex items-center justify-between mb-4">
                <button className="p-1 rounded-full hover:bg-[#f3f3f3]">
                  <ChevronLeft className="w-4 h-4 text-[#6b6b6b]" />
                </button>
                <span className="text-sm font-medium text-[#2d2d2d]">
                  {selectedYear}
                </span>
                <button className="p-1 rounded-full hover:bg-[#f3f3f3] rotate-90">
                  <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
                </button>
              </div>

              {/* Month Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
                      selectedMonth === month
                        ? "bg-[#222222] text-white border-[#222222]"
                        : "bg-white text-[#6b6b6b] border-[#e0e0e0] hover:border-[#c0c0c0] hover:bg-[#fafafa]"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={() =>
                router.push("/traveler/search-result/search-result-with-filter")
              }
              className="w-full mt-2 py-3 rounded-full text-sm font-semibold text-white shadow-sm hover:opacity-95 transition-opacity bg-gradient-to-r from-[#fea901] via-[#fd6e34] to-[#fd401a]"
            >
              Search
            </button>
          </div>
        </aside>

        {/* Trip Results */}
        <section className="flex-1 space-y-8">
          <TripSection title="Explore Skygaze Trips" trips={skygazeTrips} />
          <TripSection title="Explore Adventure Trips" trips={adventureTrips} />
          <TripSection title="Explore Weekend Trips" trips={weekendTrips} />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

interface TripSectionProps {
  title: string
  trips: typeof skygazeTrips
}

function TripSection({ title, trips }: TripSectionProps) {
  return (
    <section className="mb-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-semibold text-[#2d2d2d]">
          {title}
        </h3>
        <button className="text-xs md:text-sm text-[#e07a5f] font-medium hover:underline">
          See More &gt;
        </button>
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 scrollbar-hide">
        {trips.map((trip) => (
          <TripCard key={trip.id} {...trip} />
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-white border-t border-[#e5e5e5] mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <h2 className="text-2xl font-bold text-[#ff6b35] italic mb-4">
              Ragir
            </h2>
            <p className="text-sm text-[#6b6b6b] leading-relaxed">
              An all-in-one platform to plan, book, and share your adventures
              effortlessly. Discover destinations, connect with your group, and
              create memories that last a lifetime.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 md:gap-16">
            <div>
              <h4 className="font-semibold text-[#2d2d2d] mb-3">Links</h4>
              <ul className="space-y-2 text-sm text-[#6b6b6b]">
                <li className="hover:text-[#2d2d2d] cursor-pointer">Home</li>
                <li className="hover:text-[#2d2d2d] cursor-pointer">About us</li>
                <li className="hover:text-[#2d2d2d] cursor-pointer">Moods</li>
                <li className="hover:text-[#2d2d2d] cursor-pointer">Trips</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#2d2d2d] mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-[#6b6b6b]">
                <li className="hover:text-[#2d2d2d] cursor-pointer">
                  Contact us
                </li>
                <li className="hover:text-[#2d2d2d] cursor-pointer">
                  Terms and Conditions
                </li>
                <li className="hover:text-[#2d2d2d] cursor-pointer">
                  Privacy Policy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-gradient-to-r from-[#fea901] via-[#fd6e34] to-[#fd401a] py-3 px-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <p className="text-xs text-white">
            © 2025 Copyright. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {/* Social icons (same as your earlier version) */}
            <a
              href="#"
              className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 2.281.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
