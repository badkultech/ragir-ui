import Image from "next/image"
import { cn } from "@/lib/utils"

interface TripLeaderCardProps {
  name: string
  image: string
  className?: string
}

export function TripLeaderCard({ name, image, className }: TripLeaderCardProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 min-w-[200px]", className)}>
      <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <span className="font-semibold text-foreground text-center">{name}</span>
    </div>
  )
}
