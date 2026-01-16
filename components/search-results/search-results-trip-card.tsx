"use client"

import Image from "next/image"
import { Heart, MapPin, Calendar, Clock, Users, Star } from "lucide-react"
import { useState } from "react"
import { moodMap } from "@/components/search-results/mood-tag"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/slices/store"
import { addToCompare, removeFromCompare } from "@/lib/slices/compareSlice"

interface SearchResultsTripCardProps {
  id: string
  title: string
  provider: string
  location: string
  subLocation?: string
  rating: number | null
  days: string
  dates: string
  price: number | null
  badges: string[]
  image: string
  isFavorite?: boolean
}

export function SearchResultsTripCard({
  title,
  provider,
  location,
  subLocation,
  rating,
  days,
  dates,
  price,
  badges,
  image,
  id,
  isFavorite = false,
}: SearchResultsTripCardProps) {

  const [favorite, setFavorite] = useState(isFavorite)
  const [showAllLocations, setShowAllLocations] = useState(false);
  const locationList = location
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  const MAX_VISIBLE = 3;

  const visibleLocations = showAllLocations
    ? locationList
    : locationList.slice(0, MAX_VISIBLE);

  const remainingCount = locationList.length - MAX_VISIBLE;
  const dispatch = useDispatch()

  const compareTripIds = useSelector(
    (state: RootState) => state.compare.tripIds
  )

  const isCompared = compareTripIds.includes(id)
  const isCompareDisabled = !isCompared && compareTripIds.length >= 3



  const handleCompare = (e: React.MouseEvent, tripId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (isCompared) {
      dispatch(removeFromCompare(tripId))
    } else {
      dispatch(addToCompare(tripId))
    }
  }



  return (
    <Link href={`/home/search-result-with-filter/trip-details/${id}`}>
      <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e3e0] hover:shadow-lg transition-shadow cursor-pointer">

        {/* Image */}
        <div className="relative h-40 md:h-44">
          <Image src={image} alt={title} fill className="object-cover" />
          {/* BADGES */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {badges.map((badge, index) => {

              const normalizedKey = Object.keys(moodMap).find(
                (key) => key.toLowerCase() === badge.toLowerCase()
              );

              const mood = normalizedKey ? moodMap[normalizedKey] : {};
              const Icon = (mood as any).icon;
              const colors = (mood as any).colors || {
                bg: "white",
                border: "#FFA77C",
                text: "#FFA77C",
              };

              const displayLabel = normalizedKey || badge;
              return (
                <span
                  key={index}
                  className="px-2 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 border leading-none"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                >
                  {Icon && (
                    <Icon
                      className="w-[11px] h-[11px]"
                      color={colors.text}
                      fill={colors.text}
                      stroke={colors.text}
                    />
                  )}
                  <span className="capitalize">{displayLabel}</span>
                </span>
              );
            })}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setFavorite(!favorite)
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${favorite ? "fill-[#FF5F5E] text-[#FF5F5E]" : "text-[#6b6b6b]"
                }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm line-clamp-1">{title}</h4>

            {rating && (
              <div className="flex items-center gap-1 bg-[#fff7ec] px-2 py-1 rounded-full border border-[#f4a261]/40">
                <Star className="w-3 h-3 text-[#f4a261] fill-[#f4a261]" />
                <span className="text-xs font-medium">{rating}</span>
              </div>
            )}
          </div>

          {/* Provider */}
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-3.5 h-3.5 text-[#FF804C]" />
            <span className="text-xs text-[#000000] font-medium">{provider}</span>
          </div>

          {/* Location */}
          <div className="flex items-start gap-1.5 mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#FF804C] mt-0.5" />

            <div className="text-xs text-[#000000] font-medium">
              {visibleLocations.join(", ")}

              {!showAllLocations && remainingCount > 0 && (
                <span
                  onClick={(e) => {
                    e.preventDefault();   // 🔑 THIS STOPS LINK NAVIGATION
                    e.stopPropagation();
                    setShowAllLocations(true);
                  }}
                  className="ml-1 text-[#e07a5f] cursor-pointer whitespace-nowrap"
                >
                  +{remainingCount} more
                </span>
              )}

              {showAllLocations && locationList.length > MAX_VISIBLE && (
                <span
                  onClick={(e) => {
                    e.preventDefault();   // 🔑 THIS STOPS LINK NAVIGATION
                    e.stopPropagation();
                    setShowAllLocations(false);
                  }}
                  className="ml-1 text-[#e07a5f] cursor-pointer whitespace-nowrap"
                >
                  show less
                </span>
              )}

              {subLocation && (
                <span className="text-[#e07a5f]"> {subLocation}</span>
              )}
            </div>
          </div>


          {/* Days */}
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5 text-[#FF804C]" />
            <span className="text-xs text-[#000000] font-medium">{days}</span>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-1.5 mb-4">
            <Calendar className="w-3.5 h-3.5 text-[#FF804C]" />
            <span className="text-xs text-[#000000] font-medium">{dates}</span>
          </div>

          {/* Price & Compare */}
          <div className="flex items-end justify-between pt-3 border-t border-[#e5e3e0]">
            <div>
              <span className="text-[10px] text-[#000000]">Starting from</span>
              {price ? (
                <p className="text-lg font-bold">₹{price.toLocaleString()}</p>
              ) : (
                <p className="text-sm text-[#000000]">Starting Soon</p>
              )}
            </div>

            <button
              onClick={(e) => handleCompare(e, id)}
              disabled={isCompareDisabled}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md transition
    ${isCompared
                  ? "bg-[#FF804C] text-white"
                  : "border border-[#FF804C] text-[#FF804C] hover:bg-[#FF804C]/5"
                }
    ${isCompareDisabled ? "opacity-50 cursor-not-allowed" : ""}
  `}
            >

              <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.5 2.66667H2.66667C2.22464 2.66667 1.80072 2.84226 1.48816 3.15482C1.17559 3.46738 1 3.89131 1 4.33333V14.3333C1 14.7754 1.17559 15.1993 1.48816 15.5118C1.80072 15.8244 2.22464 16 2.66667 16H8.5M11.8333 2.66667H12.6667C13.1087 2.66667 13.5326 2.84226 13.8452 3.15482C14.1577 3.46738 14.3333 3.89131 14.3333 4.33333V5.16667M14.3333 13.5V14.3333C14.3333 14.7754 14.1577 15.1993 13.8452 15.5118C13.5326 15.8244 13.1087 16 12.6667 16H11.8333M14.3333 8.5V10.1667M7.66667 1V17.6667"
                  stroke={isCompared ? "white" : "#FF804C"}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>

              {isCompared ? "Added" : "Compare"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
