"use client"

import { Heart, MapPin, Calendar, Clock, Users, Plane, Star, Sun } from "lucide-react"
import { WishlistTrip, WishlistTripCard } from "@/components/search-results/wishlist-tripcard"
import { AppHeader } from "@/components/app-header"
import { SearchResultsTripCard } from "@/components/search-results/search-results-trip-card"
import { MainHeader } from "@/components/search-results/MainHeader"



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
        image: "/hampi-ruins-temples.png",
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



export default function WishlistPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <MainHeader variant="center" />

            {/* Wishlist Grid */}
            <main className="max-w-6xl mx-auto p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {wishlistTrips.map((trip) => (
                        <SearchResultsTripCard
                            key={trip.id}
                            id={String(trip.id)}
                            title={trip.title}
                            provider={trip.provider}
                            location={trip.location}
                            subLocation={trip.subLocation}
                            rating={trip.rating}
                            days={trip.days}
                            dates={trip.dates}
                            price={trip.price}
                            badges={trip.badges}
                            image={trip.image}
                            route={trip.route}
                            isFavorite={true}
                        />
                    ))}

                </div>
            </main>
        </div>
    )
}
