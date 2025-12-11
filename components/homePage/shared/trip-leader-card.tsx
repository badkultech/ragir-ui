"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface TripLeaderCardProps {
  name: string
  image: string
  organization?: string
  quote?: string
  className?: string
  onClick?: () => void
  variant?: "compact" | "grid"
}

export function TripLeaderCard({
  name,
  image,
  organization = "Organisation Name",
  quote = "I believe the trail writes the best kind of story. Each journey leaves behind a chapter filled with footprints, laughter, and lessons from the wild.",
  className,
  onClick,
  variant = "compact",
}: TripLeaderCardProps) {
  const isGrid = variant === "grid"

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center bg-white shadow-sm border border-gray-100 transition-all",
        onClick && "cursor-pointer hover:shadow-md",
        isGrid
          ? "gap-3 rounded-2xl p-4 flex-col sm:flex-row"
          : "gap-4 rounded-full pl-2 pr-6 py-2 min-w-[340px] max-w-[480px] ",
        className,
      )}
    >
      {/* Circular profile image */}
      <div
        className={cn(
          "relative rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100",
          isGrid ? "w-16 h-16" : "w-25 h-25",
        )}
      >
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>

      {/* Text content */}
      <div className={cn("flex flex-col gap-0.5 min-w-0", isGrid && "flex-1")}>
        <span className={cn("font-medium font-poppins text-gray-900", isGrid ? "text-xs" : "text-[16px]")}>{name}</span>
        <span className={cn("text-orange-500 font-poppins", isGrid ? "text-xs" : "text-[12px]")}>{organization}</span>
        <p className={cn("text-gray-500 font-poppins leading-tight line-clamp-2 mt-1", isGrid ? "text-xs" : "text-[12px]")}>
          "{quote}"
        </p>
      </div>
    </div>
  )
}