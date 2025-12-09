"use client"

import { useState } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Mountain,
  Umbrella,
  TreePine,
  Sun,
  Sparkles,
  Heart,
  Building,
  Compass,
  Footprints,
  Bike,
  CalendarDays,
  Users,
  PartyPopper,
  GraduationCap,
  Tent,
  Flower2,
} from "lucide-react"

const moods = [
  { name: "Mountain", icon: Mountain, selected: true },
  { name: "Beach", icon: Umbrella, selected: false },
  { name: "Jungle", icon: TreePine, selected: false },
  { name: "Desert", icon: Sun, selected: false },
  { name: "Skygaze", icon: Sparkles, selected: false },
  { name: "Wellness", icon: Heart, selected: true },
  { name: "Heritage", icon: Building, selected: false },
  { name: "Adventure", icon: Compass, selected: false },
  { name: "Trekking", icon: Footprints, selected: false },
  { name: "Motorsports", icon: Bike, selected: false },
  { name: "Weekends", icon: CalendarDays, selected: false },
  { name: "Women-Only", icon: Users, selected: true },
  { name: "Parties", icon: PartyPopper, selected: false },
  { name: "Learning", icon: GraduationCap, selected: false },
  { name: "Camping", icon: Tent, selected: false },
  { name: "Spiritual", icon: Flower2, selected: false },
]

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

export function SearchTripsCard() {
  const [activeTab, setActiveTab] = useState<"destination" | "moods">("destination")
  const [selectedMoods, setSelectedMoods] = useState<string[]>(["Mountain", "Wellness", "Women-Only"])
  const [selectedMonth, setSelectedMonth] = useState("Jan")
  const [year, setYear] = useState(2026)
  const [destination, setDestination] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<"domestic" | "international">("domestic")

  const toggleMood = (moodName: string) => {
    setSelectedMoods((prev) => (prev.includes(moodName) ? prev.filter((m) => m !== moodName) : [...prev, moodName]))
  }

  const visibleMonths = months.slice(0, 6)

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md">
      {/* Header */}
      <h2 className="text-xl font-semibold text-center mb-4">Search Trips</h2>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-full p-1 mb-6">
        <button
          onClick={() => setActiveTab("destination")}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all",
            activeTab === "destination"
              ? "bg-gradient-to-r from-primary to-orange-400 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Destination
        </button>
        <button
          onClick={() => setActiveTab("moods")}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all",
            activeTab === "moods"
              ? "bg-gradient-to-r from-primary to-orange-400 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Moods
        </button>
      </div>

      {activeTab === "destination" ? (
        <div className="space-y-4">
          {/* Destination Input */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Where do you want to travel?</p>
            <label className="text-sm font-medium text-foreground">Destination</label>
            <input
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Region Selection */}
          <div>
            <label className="text-sm font-medium text-foreground">Region</label>
            <div className="flex gap-3 mt-2">
              {/* Domestic Option */}
              <button
                onClick={() => setSelectedRegion("domestic")}
                className={cn(
                  "flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                  selectedRegion === "domestic"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                {/* India Map Silhouette */}
                <svg viewBox="0 0 100 120" className="w-16 h-16 text-gray-400">
                  <path
                    fill="currentColor"
                    d="M50 5 L55 8 L60 6 L65 10 L70 8 L75 12 L78 18 L80 25 L82 35 L80 45 L78 55 L82 65 L80 75 L75 85 L70 95 L65 105 L55 115 L45 110 L35 105 L30 95 L25 85 L22 75 L20 65 L22 55 L25 45 L28 35 L30 25 L35 15 L40 10 L45 8 Z"
                  />
                </svg>
                <span className="text-sm font-medium">Domestic</span>
              </button>

              {/* International Option */}
              <button
                onClick={() => setSelectedRegion("international")}
                className={cn(
                  "flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                  selectedRegion === "international"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                {/* World Map Silhouette */}
                <svg viewBox="0 0 120 80" className="w-16 h-16 text-gray-300">
                  {/* Americas */}
                  <path
                    fill="currentColor"
                    d="M15 20 L20 15 L25 18 L28 25 L25 35 L28 45 L25 55 L20 60 L15 55 L12 45 L15 35 L12 25 Z"
                  />
                  {/* Europe/Africa */}
                  <path
                    fill="currentColor"
                    d="M50 15 L55 12 L60 15 L58 25 L55 35 L58 45 L55 55 L50 60 L48 50 L50 40 L48 30 L50 20 Z"
                  />
                  {/* Asia */}
                  <path
                    fill="currentColor"
                    d="M70 10 L80 8 L90 12 L95 20 L92 30 L88 35 L90 40 L85 50 L78 55 L70 50 L68 40 L72 30 L68 20 Z"
                  />
                  {/* Australia */}
                  <path fill="currentColor" d="M85 55 L95 52 L100 58 L98 65 L90 68 L85 62 Z" />
                </svg>
                <span className="text-sm font-medium">International</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Moods Section */
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">What&apos;s your travel mood?</p>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => {
              const Icon = mood.icon
              const isSelected = selectedMoods.includes(mood.name)
              return (
                <button
                  key={mood.name}
                  onClick={() => toggleMood(mood.name)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                    isSelected
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-foreground border-gray-200 hover:border-primary/50",
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {mood.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Date Section */}
      <div className="mt-6 space-y-4">
        <p className="text-sm text-muted-foreground">When do you want to go?</p>

        {/* Year Selector */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setYear((y) => y - 1)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <span className="font-semibold">{year}</span>
          <button
            onClick={() => setYear((y) => y + 1)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Month Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {visibleMonths.map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium transition-all border",
                selectedMonth === month
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-foreground border-gray-200 hover:border-primary/50",
              )}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Search Button */}
      <Button className="w-full mt-6 rounded-full bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-400/90 text-white py-6">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  )
}
