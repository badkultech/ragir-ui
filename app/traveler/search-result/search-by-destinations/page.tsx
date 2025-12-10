"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, Heart, ChevronDown, AlertCircle, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TripCard } from "@/components/search-results/trip-card"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/search-results/footer"
import { MonthYearSelector } from "@/components/search-results/MonthYearSelector"
import { TripSection } from "@/components/search-results/trip-section"
import { Header } from "@/components/search-results/header"


const popularDestinations = [
    {
        name: "Himachal Pradesh",
        trips: "10 Trips",
        image: "/himachal-pradesh-mountains-snow.jpg",
        color: "from-[#3d5a4c]/80",
    },
    {
        name: "Rajasthan",
        trips: "12 Trips",
        image: "/rajasthan-palace-desert-india.jpg",
        color: "from-[#e07a5f]/80",
    },
    {
        name: "Kerala",
        trips: "12 Trips",
        image: "/kerala-backwaters-tropical-green.jpg",
        color: "from-[#3d5a4c]/80",
    },
    {
        name: "Goa",
        trips: "8 Trips",
        image: "/goa-beach-sunset-india.jpg",
        color: "from-[#f4a261]/80",
    },
]

const goaTrips = [
    {
        id: 1,
        title: "South Goa Serenity",
        location: "Himachal Pradesh, Leh,",
        subLocation: "Nubra Valley +2 more",
        rating: 4.8,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: 12999,
        badge: "Beach",
        badgeColor: "bg-[#3d5a4c]",
        image: "/goa-beach-sunset-weekend-getaway.jpg",
    },
    {
        id: 2,
        title: "South Goa Serenity",
        location: "Himachal Pradesh, Leh,",
        subLocation: "Nubra Valley +2 more",
        rating: 4.6,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: 12999,
        badge: "Beach",
        badgeColor: "bg-[#3d5a4c]",
        image: "/beach-resort-weekend-trip.jpg",
    },
    {
        id: 3,
        title: "South Goa Serenity",
        location: "Himachal Pradesh,",
        subLocation: "Nubra Valley +1 more",
        rating: null,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: null,
        badge: "Beach",
        badgeColor: "bg-[#3d5a4c]",
        image: "/weekend-beach-vacation.jpg",
    },
]

const himachalTrips = [
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

const keralaTrips = [
    {
        id: 7,
        title: "Alleppey Houseboat Experience",
        location: "Himachal Pradesh, Leh,",
        subLocation: "Nubra Valley +2 more",
        rating: 4.8,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: 15999,
        badge: "Backwaters",
        badgeColor: "bg-[#3d5a4c]",
        image: "/kerala-backwaters-tropical-green.jpg",
    },
    {
        id: 8,
        title: "Alleppey Houseboat Experience",
        location: "Himachal Pradesh, Leh,",
        subLocation: "Nubra Valley +2 more",
        rating: 4.6,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: 12999,
        badge: "Backwaters",
        badgeColor: "bg-[#3d5a4c]",
        image: "/tropical-beach-palm-trees.png",
    },
    {
        id: 9,
        title: "Alleppey Houseboat Experience",
        location: "Himachal Pradesh,",
        subLocation: "Nubra Valley +1 more",
        rating: null,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: null,
        badge: "Backwaters",
        badgeColor: "bg-[#3d5a4c]",
        image: "/mountain-landscape-scenic.jpg",
    },
]

export default function SearchByDestinationPage() {
    const [destination, setDestination] = useState("")
    const [region, setRegion] = useState<"domestic" | "international">("domestic")
    const [selectedYear, setSelectedYear] = useState(2026);
    const [selectedMonth, setSelectedMonth] = useState<'Jan' | string>('Jan');
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <Header title="Search By Destinations" />

            {/* Main Content */}
            <main className="flex-1 flex flex-col md:flex-row max-w-[1400px] mx-auto w-full">
                {/* Sidebar - Left on desktop, top on mobile */}
                <aside className="w-full md:w-[320px] lg:w-[360px] md:min-h-[calc(100vh-65px)] bg-card md:border-r border-border p-4 md:p-6 flex-shrink-0">
                    {/* Attention Banner - Mobile */}
                    <div className="md:hidden mb-4 bg-[#fff8f5] border border-[#f4a261]/30 rounded-xl p-3 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-[#e07a5f] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-foreground">Must-seen Destination Reached!</p>
                            <p className="text-xs text-muted-foreground">
                                We found trips based on your travel search for 3 destinations with 12 incredible trips.
                            </p>
                        </div>
                    </div>

                    <div className="bg-card md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border md:border-0 border-border">
                        <h2 className="text-base font-semibold text-foreground mb-3">Search Trips</h2>

                        {/* Destination Input */}
                        <div className="mb-5">
                            <p className="text-sm text-muted-foreground mb-2">Where do you want to travel?</p>
                            <label className="text-sm font-medium text-foreground mb-2 block">Destination</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Enter destination"
                                    className="w-full px-4 py-3 bg-muted rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <p className="text-center text-xs text-muted-foreground my-3">OR</p>
                        </div>

                        {/* Region Selection Figma Style */}
                        <div className="mb-5">
                            <label className="text-sm font-medium text-foreground mb-3 block">Region</label>

                            <div className="flex items-center justify-between gap-3">
                                {/* Domestic */}
                                <button
                                    onClick={() => setRegion("domestic")}
                                    className={`
        flex-1 flex flex-col items-center justify-center rounded-xl border p-4 transition-all
        ${region === "domestic"
                                            ? "border-[#e07a5f] bg-[#fff8f5] shadow-sm"
                                            : "border-[#e0e0e0] bg-white hover:bg-muted/70"}
      `}
                                >
                                    <Image
                                        src="/images/india-map.png"
                                        alt="Domestic"
                                        width={50}
                                        height={50}
                                        className="opacity-80"
                                    />
                                    <span className="mt-2 text-sm font-medium text-[#3d3d3d]">Domestic</span>
                                </button>

                                {/* International */}
                                <button
                                    onClick={() => setRegion("international")}
                                    className={`
                                     flex-1 flex flex-col items-center justify-center rounded-xl border p-4 transition-all
                                       ${region === "international"
                                            ? "border-[#e07a5f] bg-[#fff8f5] shadow-sm"
                                            : "border-[#e0e0e0] bg-white hover:bg-muted/70"}
                                       `}
                                >
                                    <Image
                                        src="/images/world-map.png"
                                        alt="International"
                                        width={50}
                                        height={50}
                                        className="opacity-80"
                                    />
                                    <span className="mt-2 text-sm font-medium text-[#3d3d3d]">International</span>
                                </button>
                            </div>
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

                        {/* Search Button */}
                        <button
                            onClick={() =>
                                router.push(
                                    `/traveler/search-result/search-result-with-filter?destination=${encodeURIComponent(
                                        destination
                                    )}&region=${region}&year=${selectedYear}&month=${selectedMonth}`
                                )
                            }
                          className="w-full py-3  bg-[linear-gradient(90deg,#fea901,#fd6e34,#FE336A,#FD401A)] text-white font-semibold rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </button>

                    </div>
                </aside>

                {/* Trip Results - Right side on desktop */}
                <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                    {/* Popular Destinations */}
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base md:text-lg font-semibold text-foreground">Popular Destinations</h3>
                            <button className="text-sm text-primary font-medium hover:underline hidden md:block">
                                See More &gt;
                            </button>
                        </div>

                        {/* Horizontal scroll on mobile, grid on desktop */}
                        <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-4 scrollbar-hide">
                            {popularDestinations.map((dest) => (
                                <div
                                    key={dest.name}
                                    className="relative min-w-[140px] md:min-w-0 h-24 md:h-28 rounded-2xl overflow-hidden cursor-pointer group"
                                >
                                    <Image
                                        src={dest.image || "/placeholder.svg"}
                                        alt={dest.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} to-transparent`} />
                                    <div className="absolute bottom-3 left-3 text-white">
                                        <p className="font-semibold text-sm">{dest.name}</p>
                                        <p className="text-xs opacity-90">{dest.trips}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <TripSection title="Goa Beach Escape" trips={goaTrips} />
                    <TripSection title="Himachal Pradesh Adventure" trips={himachalTrips} />
                    <TripSection title="Kerala Backwaters & More" trips={keralaTrips} />
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    )
}

