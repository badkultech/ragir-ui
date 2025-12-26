import { Bookmark, Heart, Share2, MapPin, ArrowRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoodTag } from "@/components/search-results/mood-tag"

export default function TripHeader({ onOpenOrganizer }: { onOpenOrganizer: () => void }) {

  const moods = ["Mountain", "Skygaze", "Beach", "Desert"]
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-[#ffffff] p-4 border mb-0 borerb-0">
      <div className="flex-1">

        <div className="flex flex-wrap gap-2 mb-3">
          {moods.map((mood) => (
            <MoodTag
              key={mood}
              name={mood}
              icon={mood}
              isActive={true}
            />
          ))}
        </div>


        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Himachal Backpacking: Manali, Kasol & Jibhi
        </h1>

        <div className="flex items-center justify-between gap-6 mb-4 pb-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-green-500 text-white">MT</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Mountain Trails</p>
              <button className="text-xs text-orange-500">More Details <ArrowRight className="inline w-3 h-3 " /></button>
            </div>
          </div>

          <div className="flex items-center gap-3 mr-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-blue-500 text-white">AM</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Arjun Mehta</p>
              <button onClick={onOpenOrganizer} className="text-xs text-orange-500">
                View Profile <ArrowRight className="inline w-3 h-3 " />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-orange-500">
          {["Mumbai", "Pune", "Jaipur", "Bangalore"].map((city) => (
            <span key={city} className="flex bg-[#FFF7F4] rounded-full items-center gap-1 px-3 py-1.5">
              <MapPin className="w-4 h-4" /> {city}
            </span>
          ))}
        </div>
      </div>

      <div className="flex md:mt-12 md:mr-4 gap-2">
        {[Bookmark, Heart, Share2].map((Icon, i) => (
          <button key={i} className="p-2 hover:text-gray-600 text-black">
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  )
}
