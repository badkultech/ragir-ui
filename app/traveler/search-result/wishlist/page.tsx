"use client"

import { ChevronLeft, Heart, MapPin, Calendar, Clock, Users, Plane, Star, Sun } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { moodMap } from "@/components/search-results/mood-tag"

interface WishlistTrip {
    id: number
    title: string
    provider: string
    location: string
    subLocation: string
    rating: number
    days: string
    dates: string
    price: number
    badges: string[]
    image: string
    route: string
    badgeIcon?: any
}

const wishlistTrips: WishlistTrip[] = [
    {
        id: 1,
        title: "Himalayan Adventure Trek",
        provider: "Mountain Trails",
        location: "Himachal Pradesh, Leh, Nubra Valley",
        subLocation: "Pangong Lake, Khardung La",
        rating: 4.8,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: 12999,
        badges: ["Skygaze", "Skygaze"],
        image: "/himalayan-trekking-adventure-mountains.jpg",
        route: "Delhi → Delhi",
    },
    {
        id: 2,
        title: "Himalayan Adventure Trek",
        provider: "Mountain Trails",
        location: "Himachal Pradesh, Leh, Nubra Valley",
        subLocation: "Pangong Lake, Khardung La",
        rating: 4.8,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: 12999,
        badges: ["Skygaze", "Skygaze"],
        image: "/himalayan-trekking-adventure-mountains.jpg",
        route: "Delhi → Delhi",
        badgeIcon: Sun,

    },
    {
        id: 3,
        title: "Himalayan Adventure Trek",
        provider: "Mountain Trails",
        location: "Himachal Pradesh, Leh, Nubra Valley",
        subLocation: "Pangong Lake, Khardung La",
        rating: 4.8,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: 12999,
        badges: ["Skygaze", "Skygaze"],
        badgeIcon: Calendar,
        image: "/himalayan-trekking-adventure-mountains.jpg",
        route: "Delhi → Delhi",
    },
    {
        id: 4,
        title: "Himalayan Adventure Trek",
        provider: "Mountain Trails",
        location: "Himachal Pradesh, Leh, Nubra Valley",
        subLocation: "Pangong Lake, Khardung La",
        rating: 4.8,
        days: "5D/4N",
        dates: "15 Dec - 20 Dec",
        price: 12999,
        badges: ["Skygaze", "Skygaze"],
        image: "/himalayan-trekking-adventure-mountains.jpg",
        route: "Delhi → Delhi",
        badgeIcon: Calendar,
    },
]

function WishlistTripCard({ trip }: { trip: WishlistTrip }) {
    const [isFavorite, setIsFavorite] = useState(true)
    const [showMore, setShowMore] = useState(false)

    return (
        <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
            {/* Image */}
            <div className="relative h-40 md:h-44">
                <Image src={trip.image || "/placeholder.svg"} alt={trip.title} fill className="object-cover" />

                {/* Badges */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
  {trip.badges.map((badge, index) => {
    const mood = moodMap[badge] || {};
    const Icon = mood.icon;
    const GradientBG = mood.bg;

    return (
      <div
        key={index}
        className="relative px-3 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 overflow-hidden"
        style={{
          backgroundColor: "white",
          border: "1px solid #FFA77C",
          color: "#FFA77C",
        }}
      >
        {/* Optional Gradient (if available)
        {GradientBG && (
          <div className="absolute inset-0 opacity-30">
            <GradientBG width="120" height="40" />
          </div>
        )} */}

        {/* ICON */}
        {Icon && (
          <Icon
            className="w-3.5 h-3.5 relative z-10"
            fill="#FFA77C"
          />
        )}

        {/* TEXT */}
        <span className="relative z-10">{badge}</span>
      </div>
    );
  })}
</div>

                {/* Favorite Button - Always filled red for wishlist */}
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? "fill-[#e07a5f] text-[#e07a5f]" : "text-muted-foreground"}`} />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-foreground text-sm line-clamp-1">{trip.title}</h4>
                    <div className="flex items-center gap-1 bg-[#fff7ec] px-2 py-1 rounded-full border border-[#f4a261]/40">
              <Star className="w-3 h-3 text-[#f4a261] fill-[#f4a261]" />
              <span className="text-xs font-medium text-[#2d2d2d]">{trip.rating}</span>
            </div>
                </div>

                {/* Provider */}
                <div className="flex items-center gap-2 mb-3">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{trip.provider}</span>
                </div>

                {/* Location with show less/more */}
                <div className="flex items-start gap-1.5 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                        <span>{trip.location}</span>
                        {showMore && <span>, {trip.subLocation}</span>}
                        <button onClick={() => setShowMore(!showMore)} className="text-[#e07a5f] ml-1 hover:underline">
                            {showMore ? "show less" : "show more"}
                        </button>
                    </div>
                </div>

                {/* Route */}
                <div className="flex items-center gap-1.5 mb-2">
                    <Plane className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{trip.route}</span>
                </div>

                {/* Days */}
                <div className="flex items-center gap-1.5 mb-2">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{trip.days}</span>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-1.5 mb-4">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{trip.dates}</span>
                </div>

                {/* Price and Compare */}
                <div className="flex items-end justify-between pt-3 border-t border-border">
                    <div>
                        <span className="text-[10px] text-muted-foreground">Starting from</span>
                        <p className="text-lg font-bold text-foreground">₹{trip.price.toLocaleString()}</p>
                    </div>
                    <button className="px-4 py-1.5 border border-[#e07a5f] text-[#e07a5f] text-xs font-medium rounded-full hover:bg-[#e07a5f]/5 transition-colors">
                        Compare
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function WishlistPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-card border-b border-border px-4 py-3 md:px-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-1 hover:bg-[#e5e3e0] rounded-full">
                            <ChevronLeft className="w-5 h-5 text-[#3d3d3d]" />
                        </button>
                        <h1 className="text-lg font-semibold text-foreground">Wishlist</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-muted rounded-full transition-colors hidden md:block">
                            <Heart className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="/man-profile.png" />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">DR</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            {/* Wishlist Grid */}
            <main className="max-w-6xl mx-auto p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {wishlistTrips.map((trip) => (
                        <WishlistTripCard key={trip.id} trip={trip} />
                    ))}
                </div>
            </main>
        </div>
    )
}
