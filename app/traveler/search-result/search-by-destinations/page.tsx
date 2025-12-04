"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Heart, ChevronDown, AlertCircle, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TripCard } from "@/components/search-results/trip-card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import SearchResultsWithFilters from "../search-result-with-filter/page"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

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
    const [selectedMonth, setSelectedMonth] = useState("Jan")
    const [selectedYear] = useState(2026)
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background border-b border-border">
                <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-1 hover:bg-[#e5e3e0] rounded-full">
                            <ChevronLeft className="w-5 h-5 text-[#3d3d3d]" />
                        </button>
                        <h1 className="text-base md:text-lg font-semibold text-foreground">Search by Destination</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-muted rounded-full transition-colors hidden md:block">
                            <Heart className="w-5 h-5 text-foreground" />
                        </button>
                        <Avatar className="w-8 h-8 md:w-9 md:h-9">
                            <AvatarImage src="/woman-avatar-profile.jpg" />
                            <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

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


                        {/* Date Selection */}
                        <div className="mb-6">
                            <p className="text-sm text-muted-foreground mb-3">When do you want to go?</p>

                            {/* Year Selector */}
                            <div className="flex items-center gap-2 mb-4">
                                <ChevronLeft className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                                <span className="text-sm font-medium text-foreground">{selectedYear}</span>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </div>

                            {/* Month Pills */}
                            <div className="flex flex-wrap gap-2">
                                {months.slice(0, 4).map((month) => (
                                    <button
                                        key={month}
                                        onClick={() => setSelectedMonth(month)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedMonth === month
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                                            }`}
                                    >
                                        {month}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Button */}
                        <button onClick={() => router.push("/traveler/search-result/search-result-with-filter")}
                            className="w-full py-3 bg-gradient-to-r from-[#f4a261] to-[#e07a5f] text-white font-semibold rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
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

                    {/* Goa Beach Escape */}
                    <TripSection title="Goa Beach Escape" trips={goaTrips} />

                    {/* Himachal Pradesh Adventure */}
                    <TripSection title="Himachal Pradesh Adventure" trips={himachalTrips} />

                    {/* Kerala Backwaters & More */}
                    <TripSection title="Kerala Backwaters & More" trips={keralaTrips} />
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    )
}

interface TripSectionProps {
    title: string
    trips: typeof goaTrips
}

function TripSection({ title, trips }: TripSectionProps) {
    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base md:text-lg font-semibold text-foreground">{title}</h3>
                <button className="text-sm text-primary font-medium hover:underline">See More &gt;</button>
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
        <footer className="bg-card border-t border-border mt-auto">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="flex flex-col md:flex-row md:justify-between gap-8">
                    {/* Brand */}
                    <div className="max-w-xs">
                        <h2 className="text-2xl font-bold text-primary italic mb-4">Ragir</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            An all-in-one platform to plan, book, and share your adventures effortlessly. Discover destinations,
                            connect with your group, and create memories that last a lifetime.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-12 md:gap-16">
                        <div>
                            <h4 className="font-semibold text-foreground mb-3">Links</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="hover:text-foreground cursor-pointer">Home</li>
                                <li className="hover:text-foreground cursor-pointer">About us</li>
                                <li className="hover:text-foreground cursor-pointer">Moods</li>
                                <li className="hover:text-foreground cursor-pointer">Trips</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-3">Support</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="hover:text-foreground cursor-pointer">Contact us</li>
                                <li className="hover:text-foreground cursor-pointer">Terms and Conditions</li>
                                <li className="hover:text-foreground cursor-pointer">Privacy Policy</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="bg-gradient-to-r from-[#f4a261] to-[#e07a5f] py-3 px-4">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <p className="text-xs text-white">© 2025 Copyright. All rights reserved.</p>
                    <div className="flex items-center gap-3">
                        <a
                            href="#"
                            className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </a>
                        <a
                            href="#"
                            className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                        </a>
                        <a
                            href="#"
                            className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 2.281.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
