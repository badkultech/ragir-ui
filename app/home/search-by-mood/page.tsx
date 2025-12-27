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
    image: "/home-page-img/d3657587fdf6bdd2dcc43f2a6c23503094168ae9.jpg",
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
    image: "/home-page-img/d3657587fdf6bdd2dcc43f2a6c23503094168ae9.jpg",
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
    image: "/home-page-img/d3657587fdf6bdd2dcc43f2a6c23503094168ae9.jpg",
  }, {
    id: 4,
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
  }, {
    id: 5,
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
  }, {
    id: 6,
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
    image: "/home-page-img/54ecd90d2735d571e1a3645d66563b5ebcb8b6b1.jpg",
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
    image: "/home-page-img/54ecd90d2735d571e1a3645d66563b5ebcb8b6b1.jpg",

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
    image: "/home-page-img/54ecd90d2735d571e1a3645d66563b5ebcb8b6b1.jpg",
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
    image: "/home-page-img/67862b478a93af55c65eb3954c6ef378d237e554.jpg",
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
    image: "/home-page-img/67862b478a93af55c65eb3954c6ef378d237e554.jpg",
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
    image: "/home-page-img/67862b478a93af55c65eb3954c6ef378d237e554.jpg",
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header title="Search By Mood" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row max-w-[1400px] mx-auto w-full py-6 px-4 md:px-8 gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-[320px] lg:w-[420px] flex-shrink-0 md:min-h-[calc(100vh-65px)] bg-white">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#f0f0f0] p-5">
            <h2 className="text-base font-semibold text-[#2d2d2d] mb-3 text-center">
              Search Trips
            </h2>
            <div className="mb-6">
              <p className="text-sm text-foreground font-semibold mb-3">
                What&apos;s your travel mood?
              </p>
              <div className="flex flex-wrap justify-center gap-2 relative z-0">
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
                  `/home/search-result-with-filter?moods=${encodeURIComponent(
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
        <section className="flex-1 min-w-0 space-y-8">
          <TripSection title="Explore Skygaze Trips" trips={skygazeTrips} />
          <TripSection title="Explore Adventure Trips" trips={adventureTrips} />
          <TripSection title="Explore Weekend Trips" trips={weekendTrips} />
        </section>
      </main>
      <Footer />
    </div>
  )
}


