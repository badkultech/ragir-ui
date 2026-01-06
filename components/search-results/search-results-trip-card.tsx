"use client"

import Image from "next/image"
import { Heart, MapPin, Calendar, Clock, Users, Star } from "lucide-react"
import { useState } from "react"
import { moodMap } from "@/components/search-results/mood-tag"  
import Link from "next/link"

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
          <Users className="w-3.5 h-3.5 text-[#6b6b6b]" />
          <span className="text-xs text-[#6b6b6b]">{provider}</span>
        </div>

        {/* Location */}
        <div className="flex items-start gap-1.5 mb-2">
          <MapPin className="w-3.5 h-3.5 text-[#6b6b6b]" />
          <div className="text-xs text-[#6b6b6b]">
            {location}
            <span className="text-[#e07a5f]"> {subLocation}</span>
          </div>
        </div>

        {/* Days */}
        <div className="flex items-center gap-1.5 mb-2">
          <Clock className="w-3.5 h-3.5 text-[#6b6b6b]" />
          <span className="text-xs text-[#6b6b6b]">{days}</span>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-1.5 mb-4">
          <Calendar className="w-3.5 h-3.5 text-[#6b6b6b]" />
          <span className="text-xs text-[#6b6b6b]">{dates}</span>
        </div>

        {/* Price & Compare */}
        <div className="flex items-end justify-between pt-3 border-t border-[#e5e3e0]">
          <div>
            <span className="text-[10px] text-[#6b6b6b]">Starting from</span>
            {price ? (
              <p className="text-lg font-bold">₹{price.toLocaleString()}</p>
            ) : (
              <p className="text-sm text-[#6b6b6b]">Starting Soon</p>
            )}
          </div>

          <button className="px-4 py-1.5 border border-[#e07a5f] text-[#e07a5f] text-xs font-medium rounded-full hover:bg-[#e07a5f]/5 transition">
            Compare
          </button>
        </div>
      </div>
    </div>
    </Link>
  )
}
