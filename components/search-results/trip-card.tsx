"use client"

import Image from "next/image"
import { Star, MapPin, Calendar } from "lucide-react"

interface TripCardProps {
  id: number
  title: string
  location: string
  subLocation: string
  rating: number | null
  days: string
  dates: string
  price: number | null
  badge: string
  badgeColor: string
  badgeIcon?: React.ComponentType<any>  // ⭐ Add this
  image: string
  
}

export function TripCard({
  title,
  location,
  subLocation,
  rating,
  days,
  dates,
  price,
  badge,
  badgeColor,
  badgeIcon: BadgeIcon,  // ⭐ Destructure icon
  image,
}: TripCardProps) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border min-w-[260px] md:min-w-0 flex-shrink-0 hover:shadow-lg transition cursor-pointer">
      
      {/* Image */}
      <div className="relative h-36 md:h-40">
        <Image
          src={image || "/darjeeling-tea-gardens.png"}
          alt={title}
          fill
          className="object-cover"
        />

        {/* Badge with ICON */}
        <div
          className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1 ${badgeColor}`}
        >
          {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5 text-white" />} 
          {badge}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title + Rating */}
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-foreground text-sm line-clamp-1">
            {title}
          </h4>

          {rating && (
            <div className="flex items-center gap-1 bg-[#fff7ec] px-2 py-1 rounded-full border border-[#f4a261]/40">
              <Star className="w-3 h-3 text-[#f4a261] fill-[#f4a261]" />
              <span className="text-xs font-medium text-[#2d2d2d]">{rating}</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-start gap-1.5 mb-2">
          <MapPin className="w-3.5 h-3.5 mt-0.5 text-[#d95531]" />
          <p className="text-xs text-black">
            {location}
            <span className="text-primary"> {subLocation}</span>
          </p>
        </div>

        {/* Days */}
        <div className="flex items-center gap-1.5 mb-2">
          <Calendar className="w-3.5 h-3.5 text-[#d95531]" />
          <span className="text-xs text-black">{days}</span>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-1.5 mb-3">
          <Calendar className="w-3.5 h-3.5 text-[#d95531]" />
          <span className="text-xs text-black">{dates}</span>
        </div>

        {/* Price */}
        <div className="pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Starting from</span>
          {price ? (
            <p className="text-lg font-bold text-foreground">₹{price.toLocaleString()}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Starting Soon</p>
          )}
        </div>
      </div>
    </div>
  )
}
