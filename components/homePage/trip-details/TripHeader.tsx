import { Bookmark, Heart, Share2, MapPin, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoodTag } from "@/components/search-results/mood-tag";
import { TRIP_DETAILS } from "@/lib/constants/strings";

interface TripHeaderProps {
  onOpenOrganizer: () => void;
  moods?: string[];
  tripTitle?: string;
  providerName?: string;
  organizerName?: string;
  cities?: string[];
  onOpenLeader: () => void;
}
function normalizeMood(mood: string) {
  switch (mood.toLowerCase()) {
    case "beach":
      return "Beach";
    case "wellness":
      return "Wellness";
    case "women-only":
      return "Women-Only";
    case "adventure":
      return "Adventure";
    case "camping":
      return "Camping";
    case "heritage":
      return "Heritage";
    case "weekends":
      return "Weekends";
    case "parties":
      return "Parties";
    case "learning":
      return "Learning";
    case "spiritual":
      return "Spiritual";
    case "mountain":
      return "Mountain";
    case "skygaze":
      return "Skygaze";
    case "desert":
      return "Desert";
    case "jungle":
      return "Jungle";
    case "trekking":
      return "Trekking";
    case "motorsports":
      return "Motorsports";
    case "learning":
      return "Learning";
    default:
      // fallback — capitalize first letter
      return mood.charAt(0).toUpperCase() + mood.slice(1);
  }
}

function formatCity(city: string) {
  return city
    .replace(/_/g, " ")              // underscores → spaces
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}


export default function TripHeader({
  onOpenOrganizer,
  onOpenLeader,
  moods = [],
  tripTitle = TRIP_DETAILS.HEADER.TRIP_TITLE_DEFAULT,
  providerName = TRIP_DETAILS.HEADER.PROVIDER_DEFAULT,
  organizerName = TRIP_DETAILS.HEADER.ORGANIZER_DEFAULT,
  cities = [],
}: TripHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-[#ffffff] p-4 border mb-0">

      <div className="flex-1">

        {/* moods */}
        <div className="flex flex-wrap gap-2 mb-3">
          {moods.map((mood) => {
            const normalized = normalizeMood(mood);

            return (
              <MoodTag
                key={normalized}
                name={normalized}
                icon={normalized}
                isActive
              />
            );
          })}

        </div>

        {/* title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {tripTitle}
        </h1>

        {/* organizer + leader */}
        <div className="flex items-center justify-between gap-6 mb-4 pb-4 border-b">

          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-green-500 text-white">
                {providerName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold">{providerName}</p>

              <button className="text-xs text-orange-500" onClick={onOpenOrganizer}>
                {TRIP_DETAILS.HEADER.MORE_DETAILS} <ArrowRight className="inline w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mr-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-blue-500 text-white">
                {organizerName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold">{organizerName}</p>

              <button
                onClick={onOpenLeader}
                className="text-xs text-orange-500"
              >
                {TRIP_DETAILS.HEADER.VIEW_PROFILE} <ArrowRight className="inline w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* cities */}
        <div className="flex flex-wrap gap-3 text-sm text-orange-500">
          {cities.map((city) => (
            <span
              key={city}
              className="flex bg-[#FFF7F4] rounded-full items-center gap-1 px-3 py-1.5"
            >
              <MapPin className="w-4 h-4" /> {formatCity(city)}
            </span>
          ))}

        </div>

      </div>

      {/* icons */}
      <div className="flex md:mt-12 md:mr-4 gap-2">
        {[Bookmark, Heart, Share2].map((Icon, i) => (
          <button key={i} className="p-2 hover:text-gray-600 text-black">
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>

    </div>
  );
}

