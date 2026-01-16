"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { AppHeader } from "@/components/app-header"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/slices/store"
import { useTripDetailsQuery } from "@/lib/services/trip-search"
import { Star } from "lucide-react"
import { useEffect } from "react"
import { addToCompare, clearCompare } from "@/lib/slices/compareSlice"
import { useRouter } from "next/navigation"

interface TripData {
    id: string
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

    const dispatch = useDispatch();
    const router = useRouter();


    useEffect(() => {
        const saved = JSON.parse(
            localStorage.getItem("compareTrips") || "[]"
        );

        saved.forEach((id: string) => {
            dispatch(addToCompare(id));
        });
    }, [dispatch]);

    // get compare trips from redux store
    const compareTripIds = useSelector(
        (state: RootState) => state.compare.tripIds
    )
    const q1 = useTripDetailsQuery(compareTripIds[0]!, {
        skip: !compareTripIds[0],
    })
    const q2 = useTripDetailsQuery(compareTripIds[1]!, {
        skip: !compareTripIds[1],
    })
    const q3 = useTripDetailsQuery(compareTripIds[2]!, {
        skip: !compareTripIds[2],
    })

    const isLoading = q1.isLoading || q2.isLoading || q3.isLoading

    const tripsFromApi = [q1.data, q2.data, q3.data].filter(Boolean)

    const tripsToCompare: TripData[] = tripsFromApi.map((payload: any) => {
        const trip = payload.tripResponse
        const itinerary = payload.tripItineraryResponse
        const organizer = payload.organizerProfileResponse

        return {
            id: trip.publicId,
            name: trip.name,
            organiser: organizer?.organizerName || "-",
            organiserAvatar: organizer?.displayPicture?.url || "",
            region: trip.cityTags?.[0] || "-",
            route: `${itinerary?.startPoint} → ${itinerary?.endPoint}`,
            duration: `${itinerary?.totalDays}D/${itinerary?.totalDays - 1}N`,
            travelDates: `${trip.startDate} - ${trip.endDate}`,
            moods: trip.moodTags || [],
            rating: trip.rating || 4.5,
            avgGroupSize: `${trip.minGroupSize}-${trip.maxGroupSize}`,
            startingPrice:
                payload.tripPricingDTO?.simplePricingRequest?.basePrice || 0,
            image: payload.images?.[0]?.url || "/placeholder.svg",
        }
    })

    return (
        <div className="min-h-screen bg-background">
            <AppHeader title="Compare Trips" showBackArrow onBack={() => {
                dispatch(clearCompare());
                router.back();
            }} />

            <main className="max-w-6xl mx-auto p-4 md:p-6 overflow-x-auto">
                {isLoading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <div className="min-w-[600px]">
                        <table className="w-full border-collapse table-fixed">
                            <thead>
                                <tr>
                                    <th className="text-left py-4 px-4 bg-[#F7F7F7] rounded-tl-xl font-medium text-black text-sm w-[160px]">
                                        Attribute
                                    </th>


                                    {tripsToCompare.map((trip) => (
                                        <th
                                            key={trip.id}
                                            className="py-4 px-4 bg-muted/30 last:rounded-tr-xl"
                                        >
                                            <div className="relative w-full h-28 rounded-xl overflow-hidden">
                                                <Image
                                                    src={trip.image}
                                                    alt={trip.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>


                            <tbody>
                                {attributes.map((attr, rowIndex) => (
                                    <tr
                                        key={attr.key}

                                    >
                                        <td
                                            className={`py-4 px-4 font-medium text-black text-sm w-[160px] bg-[#F7F7F7]
  ${rowIndex !== attributes.length - 1 ? "border-b border-gray-300" : ""}`}
                                        >
                                            {attr.label}
                                        </td>



                                        {tripsToCompare.map((trip) => (
                                            <td
                                                key={trip.id}
                                                className={`py-4 px-4 text-sm
  ${rowIndex !== attributes.length - 1 ? "border-b border-gray-200" : ""}`}
                                            >



                                                {attr.key === "name" && trip.name}
                                                {attr.key === "organiser" && (
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="w-6 h-6">
                                                            <AvatarImage src={trip.organiserAvatar} />
                                                            <AvatarFallback>OR</AvatarFallback>
                                                        </Avatar>
                                                        <span>{trip.organiser}</span>
                                                    </div>
                                                )}
                                                {attr.key === "region" && trip.region}
                                                {attr.key === "route" && trip.route}
                                                {attr.key === "duration" && trip.duration}
                                                {attr.key === "travelDates" && trip.travelDates}
                                                {attr.key === "moods" && trip.moods.join(", ")}
                                                {attr.key === "rating" && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                        <span className="font-medium">{trip.rating}</span>
                                                    </div>
                                                )}

                                                {attr.key === "avgGroupSize" && trip.avgGroupSize}
                                                {attr.key === "startingPrice" && (
                                                    <span className="font-bold">
                                                        ₹{trip.startingPrice.toLocaleString()}
                                                    </span>
                                                )}
                                                {attr.key === "bookNow" && (
                                                    <button className="w-full px-6 py-2.5 bg-[#FF804C] text-white text-sm font-medium rounded-lg hover:opacity-90 transition">
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
                )}
            </main>
        </div>
    )
}
