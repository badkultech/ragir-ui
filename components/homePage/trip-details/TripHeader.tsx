import { Bookmark, Heart, Share2, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TripHeader({ onOpenOrganizer }: { onOpenOrganizer: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Himachal Backpacking: Manali, Kasol & Jibhi
        </h1>

        <div className="flex items-center gap-6 mb-4 pb-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-green-500 text-white">MT</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Mountain Trails</p>
              <button className="text-xs text-orange-500">More Details</button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-blue-500 text-white">AM</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Arjun Mehta</p>
              <button onClick={onOpenOrganizer} className="text-xs text-orange-500">
                View Profile
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          {["Mumbai", "Pune", "Jaipur", "Bangalore"].map((city) => (
            <span key={city} className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {city}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {[Bookmark, Heart, Share2].map((Icon, i) => (
          <button key={i} className="p-2 border rounded-lg hover:bg-gray-50">
            <Icon className="w-5 h-5 text-gray-600" />
          </button>
        ))}
      </div>
    </div>
  )
}
