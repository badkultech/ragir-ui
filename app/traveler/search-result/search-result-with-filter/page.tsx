"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Heart, ChevronDown, SlidersHorizontal, X, ArrowUpDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchResultsTripCard } from "@/components/search-results/search-results-trip-card"
import { AdvancedFilters } from "@/components/search-results/advanced-filters"
import { useRouter } from "next/navigation"

const trips = [
    {
        id: 1,
        title: "Himalayan Adventure Trek",
        provider: "Mountain Trails",
        location: "Himachal Pradesh, Leh, Nubra Valley",
        subLocation: "+2 more",
        rating: 4.8,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: 12999,
        badges: ["Skygaze", "Skygaze", "Skygaze"],
        image: "/himalayan-trekking-adventure-mountains.jpg",
        isFavorite: false,
    },
    {
        id: 2,
        title: "Himalayan Adventure Trek",
        provider: "Mountain Trails",
        location: "Himachal Pradesh, Leh, Nubra Valley",
        subLocation: "+2 more",
        rating: 4.8,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: 12999,
        badges: ["Skygaze", "Skygaze", "Skygaze"],
        image: "/himalayan-trekking-adventure-mountains.jpg",
        isFavorite: true,
    },
    {
        id: 3,
        title: "Himalayan Adventure Trek",
        provider: "Mountain Trails",
        location: "Himachal Pradesh, Leh, Nubra Valley",
        subLocation: "+2 more",
        rating: 4.8,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: 12999,
        badges: ["Skygaze", "Skygaze", "Skygaze"],
        image: "/himalayan-trekking-adventure-mountains.jpg",
        isFavorite: false,
    },
    {
        id: 4,
        title: "Himalayan Adventure Trek",
        provider: "Mountain Trails",
        location: "Himachal Pradesh, Leh, Nubra Valley",
        subLocation: "+2 more",
        rating: 4.8,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: 12999,
        badges: ["Skygaze", "Skygaze", "Skygaze"],
        image: "/himalayan-trekking-adventure-mountains.jpg",
        isFavorite: false,
    },
    {
        id: 5,
        title: "Himalayan Adventure Trek",
        provider: "Mountain Trails",
        location: "Himachal Pradesh, Leh, Nubra Valley",
        subLocation: "+2 more",
        rating: 4.8,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: 12999,
        badges: ["Skygaze", "Skygaze", "Skygaze"],
        image: "/himalayan-trekking-adventure-mountains.jpg",
        isFavorite: false,
    },
    {
        id: 6,
        title: "Himalayan Adventure Trek",
        provider: "Mountain Trails",
        location: "Himachal Pradesh, Leh, Nubra Valley",
        subLocation: "+2 more",
        rating: 4.8,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: 12999,
        badges: ["Skygaze", "Skygaze", "Skygaze"],
        image: "/himalayan-trekking-adventure-mountains.jpg",
        isFavorite: false,
    },
]

const activeFilters = [
    { id: 1, label: "Himachal Pradesh" },
    { id: 2, label: "Kerala" },
    { id: 3, label: "Adventure" },
    { id: 4, label: "Mountain" },
]

const sortOptions = [
    { value: "price_low", label: "Price Per Day: Lowest" },
    { value: "price_high", label: "Price Per Day: Highest" },
    { value: "discount", label: "Biggest Discount" },
    { value: "popularity", label: "Popularity" },
]

export default function SearchResultsWithFilters() {
    const [showFilters, setShowFilters] = useState(false)
    const [showSortDropdown, setShowSortDropdown] = useState(false)
    const [selectedSort, setSelectedSort] = useState("popularity")
    const [filters, setFilters] = useState(activeFilters)
    const router = useRouter();


    const removeFilter = (id: number) => {
        setFilters((prev) => prev.filter((f) => f.id !== id))
    }

    const clearAllFilters = () => {
        setFilters([])
    }

    return (
        <div className="min-h-screen bg-[#f5f3f0]">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-[#f5f3f0] border-b border-[#e5e3e0]">
                <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-1 hover:bg-[#e5e3e0] rounded-full">
                            <ChevronLeft className="w-5 h-5 text-[#3d3d3d]" />
                        </button>

                        <h1 className="text-base md:text-lg font-semibold text-[#2d2d2d]">Search by Mood</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-[#e5e3e0] rounded-full transition-colors hidden md:block">
                            <Heart className="w-5 h-5 text-[#3d3d3d]" />
                        </button>
                        <Avatar className="w-8 h-8 md:w-9 md:h-9">
                            <AvatarImage src="/user-avatar-woman.png" />
                            <AvatarFallback className="bg-[#e07a5f] text-white">U</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            {/* Desktop: Filter Bar */}
            <div className="hidden md:block border-b border-[#e5e3e0] bg-white">
                <div className="flex items-center gap-4 px-8 py-3 max-w-[1400px] mx-auto">
                    {/* Advanced Filters Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 border border-[#e5e3e0] rounded-lg text-sm font-medium text-[#4d4d4d] hover:bg-[#f5f3f0] transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Advanced Filters
                    </button>

                    {/* Sort By */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="flex items-center gap-2 px-4 py-2 border border-[#e5e3e0] rounded-lg text-sm font-medium text-[#4d4d4d] hover:bg-[#f5f3f0] transition-colors"
                        >
                            Sort By
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        {showSortDropdown && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e5e3e0] py-1 z-20">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setSelectedSort(option.value)
                                                setShowSortDropdown(false)
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f5f3f0] transition-colors ${selectedSort === option.value ? "text-[#e07a5f] font-medium" : "text-[#4d4d4d]"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {/* Filter Highlight Section - stays inline, not centered */}
                    <div className="flex-1 flex items-center justify-between bg-[#fff6f2] rounded-xl px-4 py-3">

                        {/* Left Side */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm text-[#6b6b6b] font-medium">
                                Showing results for:
                            </span>

                            <div className="flex items-center gap-2 flex-wrap">
                                {filters.map((filter) => (
                                    <span
                                        key={filter.id}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-[#e5e3e0] rounded-full text-xs font-medium text-[#4d4d4d]"
                                    >
                                        {filter.label}
                                        <button
                                            onClick={() => removeFilter(filter.id)}
                                            className="hover:text-[#e07a5f] transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Clear All */}
                        {filters.length > 0 && (
                            <button
                                onClick={clearAllFilters}
                                className="text-xs font-medium text-[#e07a5f] hover:underline whitespace-nowrap"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <main className="px-4 py-4 md:px-8 md:py-6 max-w-[1400px] mx-auto">
                <div className="flex gap-6">
                    {/* Desktop: Filters Sidebar */}
                    {showFilters && (
                        <aside className="hidden md:block w-72 flex-shrink-0">
                            <AdvancedFilters isOpen={showFilters} onClose={() => setShowFilters(false)} />
                        </aside>
                    )}

                    {/* Results */}
                    <div className="flex-1">
                        {/* Mobile: Filter Tags */}
                        <div className="md:hidden mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-[#6b6b6b]">Showing results for:</span>
                                {filters.length > 0 && (
                                    <button onClick={clearAllFilters} className="text-xs font-medium text-[#e07a5f]">
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {filters.map((filter) => (
                                    <span
                                        key={filter.id}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-[#e5e3e0] rounded-full text-xs font-medium text-[#4d4d4d]"
                                    >
                                        {filter.label}
                                        <button onClick={() => removeFilter(filter.id)} className="hover:text-[#e07a5f] transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Results Count */}
                        <p className="text-sm text-[#6b6b6b] mb-4">
                            <span className="text-[#e07a5f] font-semibold">{trips.length * 4}</span> trips found
                        </p>

                        {/* Trip Grid */}
                        <div className={`grid gap-4 ${showFilters ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
                            {trips.map((trip) => (
                                <SearchResultsTripCard key={trip.id} {...trip} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile: Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e3e0] z-20">
                <div className="flex">
                    {/* Sort By */}
                    <button
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="flex-1 flex items-center justify-center gap-2 py-4 border-r border-[#e5e3e0]"
                    >
                        <ArrowUpDown className="w-4 h-4 text-[#4d4d4d]" />
                        <span className="text-sm font-medium text-[#4d4d4d]">Sort By</span>
                        <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
                    </button>

                    {/* Advanced Filters */}
                    <button onClick={() => setShowFilters(true)} className="flex-1 flex items-center justify-center gap-2 py-4">
                        <SlidersHorizontal className="w-4 h-4 text-[#4d4d4d]" />
                        <span className="text-sm font-medium text-[#4d4d4d]">Advanced Filters</span>
                    </button>
                </div>

                {/* Mobile Sort Dropdown */}
                {showSortDropdown && (
                    <>
                        <div className="fixed inset-0 bg-black/40 z-30" onClick={() => setShowSortDropdown(false)} />
                        <div className="absolute bottom-full left-0 right-0 bg-white rounded-t-2xl shadow-lg z-40 p-4">
                            <div className="w-12 h-1 bg-[#e5e3e0] rounded-full mx-auto mb-4" />
                            <div className="space-y-1">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSelectedSort(option.value)
                                            setShowSortDropdown(false)
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${selectedSort === option.value
                                            ? "bg-[#f5f3f0] text-[#e07a5f] font-medium"
                                            : "text-[#4d4d4d] hover:bg-[#f5f3f0]"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {/* Mobile: Advanced Filters Panel ONLY for mobile */}
            <div className="md:hidden">
                <AdvancedFilters
                    isOpen={showFilters}
                    onClose={() => setShowFilters(false)}
                    isMobile={true}
                />
            </div>


            {/* Add bottom padding on mobile for fixed bar */}
            <div className="h-16 md:hidden" />
        </div>
    )
}
