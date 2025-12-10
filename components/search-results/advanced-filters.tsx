"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
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
  Users,
  PartyPopper,
  GraduationCap,
  Tent,
  Moon,
} from "lucide-react"
import {MoodTag} from "./mood-tag"

interface AdvancedFiltersProps {
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
}

const filterSections = [
  { id: "startDate", label: "Start Date", defaultOpen: false },
  { id: "duration", label: "Duration", defaultOpen: true },
  { id: "ageGroup", label: "Age Group", defaultOpen: false },
  { id: "budgetRange", label: "Budget Range", defaultOpen: true },
  { id: "destinations", label: "Destinations", defaultOpen: true },
  { id: "departureCity", label: "Departure City", defaultOpen: true },
  { id: "occupancyType", label: "Occupancy Type", defaultOpen: true },
  { id: "groupType", label: "Group Type", defaultOpen: true },
]

const destinations = [
  { name: "Paris, France", checked: false },
  { name: "Barcelona, Spain", checked: false },
  { name: "Rome, Italy", checked: true },
  { name: "London, UK", checked: false },
  { name: "Tokyo, Japan", checked: false },
]

const departureCities = [
  { name: "London", checked: false },
  { name: "Paris", checked: false },
  { name: "Barcelona", checked: false },
  { name: "Madrid", checked: true },
  { name: "Rome", checked: false },
]

const moods = [
  { name: "Mountain", icon: Mountain },
  { name: "Skygaze", icon: Sun },
  { name: "Beach", icon: Umbrella },
  { name: "Desert", icon: TreePine },
  { name: "Jungle", icon: Leaf },
  { name: "Wellness", icon: Sparkles },
  { name: "Heritage", icon: Castle },
  { name: "Adventure", icon: Compass },
  { name: "Trekking", icon: Flag },
  { name: "Motorsports", icon: Car },
  { name: "Weekends", icon: Calendar },
  { name: "Women-Only", icon: Users },
  { name: "Parties", icon: PartyPopper },
  { name: "Learning", icon: GraduationCap },
  { name: "Camping", icon: Tent },
  { name: "Spiritual", icon: Moon },
]

export  function AdvancedFilters({ isOpen, onClose, isMobile = false }: AdvancedFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(filterSections.map((s) => [s.id, s.defaultOpen])),
  )
  const [selectedDuration, setSelectedDuration] = useState("7+ Days")
  const [budgetRange, setBudgetRange] = useState({ min: 5000, max: 50000 })
  const [selectedOccupancy, setSelectedOccupancy] = useState("Single Occupancy")
  const [selectedGroupType, setSelectedGroupType] = useState("Exclusive Group")
  const [selectedMoods, setSelectedMoods] = useState(["Skygaze"])
  const [emiAvailable, setEmiAvailable] = useState(false)

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleMood = (name: string) => {
    setSelectedMoods((prev) => (prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]))
  }

  const containerClass = isMobile
    ? `fixed inset-0 z-50 bg-white transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
    : "bg-white rounded-2xl border border-[#e5e3e0] p-5"

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {isMobile && (
          <button onClick={onClose} className="p-1">
            <ChevronDown className="w-5 h-5 text-[#6b6b6b] rotate-90" />
          </button>
        )}
        <h3 className="text-base font-semibold text-[#2d2d2d]">Advanced Filters</h3>
        {isMobile && <div className="w-6" />}
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-none">
        {/* Start Date */}
        <div className="border-b border-[#e5e3e0] pb-4">
          <button onClick={() => toggleSection("startDate")} className="w-full flex items-center justify-between">
            <span className="text-sm font-medium text-[#2d2d2d]">Start Date</span>
            {expandedSections.startDate ? (
              <ChevronUp className="w-4 h-4 text-[#6b6b6b]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
            )}
          </button>
          {expandedSections.startDate && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                className="w-full px-3 py-2 border border-[#e5e3e0] rounded-lg text-sm placeholder:text-[#a0a0a0]"
              />
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="border-b border-[#e5e3e0] pb-4">
          <button onClick={() => toggleSection("duration")} className="w-full flex items-center justify-between">
            <span className="text-sm font-medium text-[#2d2d2d]">Duration</span>
            {expandedSections.duration ? (
              <ChevronUp className="w-4 h-4 text-[#6b6b6b]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
            )}
          </button>
          {expandedSections.duration && (
            <div className="mt-3 flex flex-wrap gap-2">
              {["3-5 Days", "6-7 Days", "7+ Days"].map((duration) => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(duration)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedDuration === duration
                      ? "bg-[#e07a5f] text-white border-[#e07a5f]"
                      : "bg-white text-[#4d4d4d] border-[#e0e0e0] hover:border-[#c0c0c0]"
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Age Group */}
        <div className="border-b border-[#e5e3e0] pb-4">
          <button onClick={() => toggleSection("ageGroup")} className="w-full flex items-center justify-between">
            <span className="text-sm font-medium text-[#2d2d2d]">Age Group</span>
            {expandedSections.ageGroup ? (
              <ChevronUp className="w-4 h-4 text-[#6b6b6b]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
            )}
          </button>
          {expandedSections.ageGroup && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Enter your age"
                className="w-full px-3 py-2 border border-[#e5e3e0] rounded-lg text-sm placeholder:text-[#a0a0a0]"
              />
            </div>
          )}
        </div>

        {/* Budget Range */}
        <div className="border-b border-[#e5e3e0] pb-4">
          <button onClick={() => toggleSection("budgetRange")} className="w-full flex items-center justify-between">
            <span className="text-sm font-medium text-[#2d2d2d]">Budget Range</span>
            {expandedSections.budgetRange ? (
              <ChevronUp className="w-4 h-4 text-[#6b6b6b]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
            )}
          </button>
          {expandedSections.budgetRange && (
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[10px] text-[#6b6b6b]">₹</label>
                  <input
                    type="number"
                    value={budgetRange.min}
                    onChange={(e) => setBudgetRange({ ...budgetRange, min: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border border-[#e5e3e0] rounded-lg text-sm"
                  />
                </div>
                <span className="text-[#6b6b6b]">-</span>
                <div className="flex-1">
                  <label className="text-[10px] text-[#6b6b6b]">₹</label>
                  <input
                    type="number"
                    value={budgetRange.max}
                    onChange={(e) => setBudgetRange({ ...budgetRange, max: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border border-[#e5e3e0] rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="relative pt-2">
                <div className="h-1 bg-[#e5e3e0] rounded-full">
                  <div className="absolute h-1 bg-[#e07a5f] rounded-full" style={{ left: "10%", right: "20%" }} />
                </div>
                <div className="absolute top-0 left-[10%] w-4 h-4 bg-white border-2 border-[#e07a5f] rounded-full -translate-x-1/2" />
                <div className="absolute top-0 right-[20%] w-4 h-4 bg-white border-2 border-[#e07a5f] rounded-full translate-x-1/2" />
              </div>
              <label className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  checked={emiAvailable}
                  onChange={(e) => setEmiAvailable(e.target.checked)}
                  className="w-4 h-4 rounded border-[#e5e3e0] text-[#e07a5f] focus:ring-[#e07a5f]"
                />
                <span className="text-xs text-[#6b6b6b]">EMI Available</span>
              </label>
            </div>
          )}
        </div>

        {/* Destinations */}
        <div className="border-b border-[#e5e3e0] pb-4">
          <button onClick={() => toggleSection("destinations")} className="w-full flex items-center justify-between">
            <span className="text-sm font-medium text-[#2d2d2d]">Destinations</span>
            {expandedSections.destinations ? (
              <ChevronUp className="w-4 h-4 text-[#6b6b6b]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
            )}
          </button>
          {expandedSections.destinations && (
            <div className="mt-3 space-y-2">
              {destinations.map((dest) => (
                <label key={dest.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={dest.checked}
                    className="w-4 h-4 rounded border-[#e5e3e0] text-[#e07a5f] focus:ring-[#e07a5f]"
                  />
                  <span className="text-xs text-[#4d4d4d]">{dest.name}</span>
                </label>
              ))}
              <button className="text-xs text-[#e07a5f] font-medium mt-2">Show more</button>
            </div>
          )}
        </div>

        {/* Departure City */}
        <div className="border-b border-[#e5e3e0] pb-4">
          <button onClick={() => toggleSection("departureCity")} className="w-full flex items-center justify-between">
            <span className="text-sm font-medium text-[#2d2d2d]">Departure City</span>
            {expandedSections.departureCity ? (
              <ChevronUp className="w-4 h-4 text-[#6b6b6b]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
            )}
          </button>
          {expandedSections.departureCity && (
            <div className="mt-3 space-y-2">
              {departureCities.map((city) => (
                <label key={city.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={city.checked}
                    className="w-4 h-4 rounded border-[#e5e3e0] text-[#e07a5f] focus:ring-[#e07a5f]"
                  />
                  <span className="text-xs text-[#4d4d4d]">{city.name}</span>
                </label>
              ))}
              <button className="text-xs text-[#e07a5f] font-medium mt-2">Show more</button>
            </div>
          )}
        </div>

        {/* Occupancy Type */}
        <div className="border-b border-[#e5e3e0] pb-4">
          <button onClick={() => toggleSection("occupancyType")} className="w-full flex items-center justify-between">
            <span className="text-sm font-medium text-[#2d2d2d]">Occupancy Type</span>
            {expandedSections.occupancyType ? (
              <ChevronUp className="w-4 h-4 text-[#6b6b6b]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
            )}
          </button>
          {expandedSections.occupancyType && (
            <div className="mt-3 flex flex-wrap gap-2">
              {["Single Occupancy", "Double Occupancy", "Triple Occupancy", "Dormitory"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedOccupancy(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedOccupancy === type
                      ? "bg-[#e07a5f] text-white border-[#e07a5f]"
                      : "bg-white text-[#4d4d4d] border-[#e0e0e0] hover:border-[#c0c0c0]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Group Type */}
        <div className="border-b border-[#e5e3e0] pb-4">
          <button onClick={() => toggleSection("groupType")} className="w-full flex items-center justify-between">
            <span className="text-sm font-medium text-[#2d2d2d]">Group Type</span>
            {expandedSections.groupType ? (
              <ChevronUp className="w-4 h-4 text-[#6b6b6b]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
            )}
          </button>
          {expandedSections.groupType && (
            <div className="mt-3 flex flex-wrap gap-2">
              {["Exclusive Group", "Open for all"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedGroupType(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedGroupType === type
                      ? "bg-[#e07a5f] text-white border-[#e07a5f]"
                      : "bg-white text-[#4d4d4d] border-[#e0e0e0] hover:border-[#c0c0c0]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mood Tags */}
        <div className="pb-4">
          <span className="text-sm font-medium text-[#2d2d2d] block mb-3">Mood Tags</span>
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
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-[#e5e3e0]">
        <button className="flex-1 py-2.5 text-sm font-medium text-[#6b6b6b] border border-[#e5e3e0] rounded-full hover:bg-[#f5f3f0] transition-colors">
          Clear All
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-2.5 text-sm font-medium text-white bg-[#e07a5f] rounded-full hover:bg-[#d06a4f] transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />}
        <div className={containerClass}>
          <div className="p-5 h-full flex flex-col">{content}</div>
        </div>
      </>
    )
  }

  return <div className={containerClass}>{content}</div>
}
