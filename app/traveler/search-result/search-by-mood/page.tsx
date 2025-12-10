"use client"

import { useState } from "react"
import { Mountain, Sun, Umbrella, TreePine, Leaf, Sparkles, Castle, Compass, Flag, Car, Calendar, PartyPopper, GraduationCap, Tent, Moon, } from "lucide-react"
import { useRouter } from "next/navigation"
import { MoodTag } from "@/components/search-results/mood-tag"
import { Footer } from "@/components/search-results/footer"
import { MonthYearSelector } from "@/components/search-results/MonthYearSelector"
import { TripSection } from "@/components/search-results/trip-section"
import { Header } from "@/components/search-results/header"

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
    badgeIcon: Sun,
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
    badgeIcon: Sun,
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
    badgeIcon: Sun,
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
    badgeIcon: Compass,
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
    badgeIcon: Compass,
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
    badgeIcon: Compass,
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
    badge: "Weekends",
    badgeColor: "bg-gradient-to-r from-[#f4a261] to-[#e07a5f]",
    badgeIcon: Calendar,
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
    badge: "Weekends",
    badgeColor: "bg-gradient-to-r from-[#f4a261] to-[#e07a5f]",
    badgeIcon: Calendar,
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
    badge: "Weekends",
    badgeIcon: Calendar,
    badgeColor: "bg-gradient-to-r from-[#f4a261] to-[#e07a5f]",
    image: "/weekend-beach-vacation.jpg",
  },
]

export default function SearchByMoodPage() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])

  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState<'Jan' | string>('Jan');
  const router = useRouter()

  const toggleMood = (name: string) => {
    setSelectedMoods((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name],
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header title="Search By Mood" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row max-w-[1400px] mx-auto w-full py-6 px-4 md:px-8 gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-[320px] lg:w-[360px] flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#f0f0f0] p-5">
            <h2 className="text-base font-semibold text-[#2d2d2d] mb-3 text-center">
              Search Trips
            </h2>
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
            <button
              onClick={() => {
                router.push(
                  `/traveler/search-result/search-result-with-filter?moods=${encodeURIComponent(
                    JSON.stringify(selectedMoods)
                  )}&year=${selectedYear}&month=${selectedMonth}`
                );
              }}
              className="w-full mt-2 py-3 rounded-full text-sm font-semibold text-white shadow-sm 
    hover:opacity-95 transition-opacity 
    bg-[linear-gradient(90deg,#fea901,#fd6e34,#FE336A,#FD401A)]"
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
      <Footer />
    </div>
  )
}


