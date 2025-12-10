"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Header } from "@/components/search-results/header"

interface TripData {
    id: number
    name: string
    organiser: string
    organiserAvatar: string
    region: string
    route: string
    duration: string
    travelDates: string
    moods: string[]
    rating: number
    avgGroupSize: string
    startingPrice: number
    image: string
}

const tripsToCompare: TripData[] = [
    {
        id: 1,
        name: "Himalayan Adventure Trek",
        organiser: "Mountain Trails",
        organiserAvatar: "/man-profile.png",
        region: "Rajasthan",
        route: "Delhi → Delhi",
        duration: "5D/4N",
        travelDates: "15 Dec - 20 Dec",
        moods: ["Adventure", "Trekking"],
        rating: 4.8,
        avgGroupSize: "~15 people",
        startingPrice: 12999,
        image: "/hampi-ruins-temples.png",
    },
    {
        id: 2,
        name: "Himalayan Adventure Trek",
        organiser: "Mountain Trails",
        organiserAvatar: "/man-profile.png",
        region: "Rajasthan",
        route: "Delhi → Delhi",
        duration: "5D/4N",
        travelDates: "15 Dec - 20 Dec",
        moods: ["Adventure", "Trekking"],
        rating: 4.8,
        avgGroupSize: "~15 people",
        startingPrice: 12999,
        image: "/himalayan-trekking-adventure-mountains.jpg",
    },
    {
        id: 3,
        name: "Himalayan Adventure Trek",
        organiser: "Mountain Trails",
        organiserAvatar: "/man-profile.png",
        region: "Rajasthan",
        route: "Delhi → Delhi",
        duration: "5D/4N",
        travelDates: "15 Dec - 20 Dec",
        moods: ["Adventure", "Trekking"],
        rating: 4.8,
        avgGroupSize: "~15 people",
        startingPrice: 12999,
        image: "/himalayan-trekking-adventure-mountains.jpg",
    },
]

const attributes = [
    { key: "image", label: "" },
    { key: "name", label: "Name" },
    { key: "organiser", label: "Organiser" },
    { key: "region", label: "Region" },
    { key: "route", label: "Route" },
    { key: "duration", label: "Duration" },
    { key: "travelDates", label: "Travel Dates" },
    { key: "moods", label: "Moods" },
    { key: "rating", label: "Rating" },
    { key: "avgGroupSize", label: "Avg. Group Size" },
    { key: "startingPrice", label: "Starting Price" },
    { key: "bookNow", label: "Book Now" },
]

export default function CompareTripsPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <Header title="Compare Trips" />

            {/* Comparison Table */}
            <main className="max-w-6xl mx-auto p-4 md:p-6 overflow-x-auto">
                <div className="min-w-[600px]">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left py-4 px-4 bg-muted/30 rounded-tl-xl font-medium text-muted-foreground text-sm w-[140px]">
                                    Attribute
                                </th>
                                {tripsToCompare.map((trip) => (
                                    <th key={trip.id} className="py-4 px-4 bg-muted/30 last:rounded-tr-xl"></th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {attributes.map((attr, rowIndex) => (
                                <tr key={attr.key} className={rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                    {/* Attribute Label */}
                                    <td className="py-4 px-4 font-medium text-muted-foreground text-sm align-middle">{attr.label}</td>

                                    {/* Trip Values */}
                                    {tripsToCompare.map((trip) => (
                                        <td key={trip.id} className="py-4 px-4 text-sm text-foreground align-middle">
                                            {attr.key === "image" && (
                                                <div className="relative w-full h-32 rounded-xl overflow-hidden">
                                                    <Image src={trip.image || "/placeholder.svg"} alt={trip.name} fill className="object-cover" />
                                                </div>
                                            )}
                                            {attr.key === "name" && <span className="font-medium">{trip.name}</span>}
                                            {attr.key === "organiser" && (
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarImage src={trip.organiserAvatar || "/placeholder.svg"} />
                                                        <AvatarFallback className="bg-muted text-xs">MT</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-muted-foreground">{trip.organiser}</span>
                                                </div>
                                            )}
                                            {attr.key === "region" && trip.region}
                                            {attr.key === "route" && trip.route}
                                            {attr.key === "duration" && trip.duration}
                                            {attr.key === "travelDates" && trip.travelDates}
                                            {attr.key === "moods" && <span className="text-muted-foreground">Moods</span>}
                                            {attr.key === "rating" && (
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span>{trip.rating}</span>
                                                </div>
                                            )}
                                            {attr.key === "avgGroupSize" && trip.avgGroupSize}
                                            {attr.key === "startingPrice" && (
                                                <span className="font-bold text-base">₹{trip.startingPrice.toLocaleString()}</span>
                                            )}
                                            {attr.key === "bookNow" && (
                                                <button className="px-6 py-2.5 bg-gradient-to-r from-[#f4a261] to-[#e07a5f] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                                                    Book Now
                                                </button>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}
