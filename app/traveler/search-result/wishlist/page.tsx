"use client"

import { Heart, MapPin, Calendar, Clock, Users, Plane, Star, Sun } from "lucide-react"
import { useState } from "react"
import { Header } from "@/components/search-results/header"
import { WishlistTrip, WishlistTripCard } from "@/components/search-results/wishlist-tripcard"



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
            <Header title="Wishlist" />

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
