"use client"

import { Heart, MapPin, Calendar, Clock, Users, Plane, Star, Sun } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { SearchResultsTripCard } from "@/components/search-results/search-results-trip-card"
import { MainHeader } from "@/components/search-results/MainHeader"
import { useGetWishlistTripsQuery, useRemoveTripFromWishlistMutation } from "@/lib/services/wishlist"
import { useState } from "react"
import { WishlistTrip } from "@/lib/services/wishlist/types"


export default function WishlistPage() {
    const { data, isLoading, error } = useGetWishlistTripsQuery();
    const [removeTrip] = useRemoveTripFromWishlistMutation();

    const handleRemoveFromWishlist = async (tripId: string) => {
        try {
            await removeTrip({ tripId }).unwrap();
        } catch (err) {
            console.error("Failed to remove trip from wishlist:", err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <MainHeader variant="center" />
                <main className="max-w-6xl mx-auto p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[20px] overflow-hidden border border-[#eaeaea] animate-pulse">
                                <div className="h-52 bg-gray-200" />
                                <div className="p-4 space-y-3">
                                    <div className="h-6 bg-gray-200 rounded" />
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <MainHeader variant="center" />
                <main className="max-w-6xl mx-auto p-4 md:p-6">
                    <p className="text-red-500 text-center">Failed to load wishlist</p>
                </main>
            </div>
        );
    }

    const wishlistTrips = data?.content || [];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <MainHeader variant="center" />

            {/* Wishlist Grid */}
            <main className="max-w-6xl mx-auto p-4 md:p-6">
                {wishlistTrips.length === 0 ? (
                    <div className="text-center py-12">
                        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500">Start adding trips to your wishlist to see them here!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {wishlistTrips.map((trip: WishlistTrip) => (
                            <SearchResultsTripCard
                                key={trip.id}
                                id={trip.tripPublicId}
                                title={trip.name}
                                provider={trip.organizerName || "—"}
                                location={trip.location}
                                rating={null}
                                days={trip.duration}
                                dates={`${trip.startDate} — ${trip.endDate}`}
                                price={trip.price || null}
                                badges={[]}
                                image={trip.imageUrl || "/hampi-ruins-temples.png"}
                                route={undefined}
                                isFavorite={true}
                                onRemoveFromWishlist={() => handleRemoveFromWishlist(trip.tripPublicId)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
