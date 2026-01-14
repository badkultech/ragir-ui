import { Calendar, Sparkles } from "lucide-react";
import { TRIP_DETAILS } from "@/lib/constants/strings";

interface Activity {
  time?: string;
  name?: string;
  description?: string;
  tags?: string[];
  image?: string;
}

interface Props {
  dayTabs: string[];
  activeDay: number;
  setActiveDay: (i: number) => void;
  activities: Activity[];
  onImageClick?: (index: number) => void;
}

export default function DayWiseItinerary({
  dayTabs,
  activeDay,
  setActiveDay,
  activities,
  onImageClick,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{TRIP_DETAILS.ITINERARY.TITLE}</h2>

        <button className="flex items-center gap-2 px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm">
          <Calendar className="w-4 h-4" />
          {TRIP_DETAILS.ITINERARY.VIEW_FULL}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {dayTabs.map((day, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={`px-4 py-2 rounded-full text-sm ${activeDay === i
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-600"
              }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activities.length === 0 && (
          <p className="text-sm text-gray-500">
            {TRIP_DETAILS.ITINERARY.EMPTY_DAY}
          </p>
        )}

        {activities.map((activity, i) => (
          <div key={i} className="border-l-2 border-orange-500 pl-4 space-y-2">

            {/* IMAGE */}
            {activity.image && (
              <img
                src={activity.image}
                onClick={() => onImageClick?.(i)}
                alt={activity.name || "activity image"}
                className="w-15 h-15 rounded-lg object-cover border"
              />
            )}

            <p className="text-xs text-gray-500">
              {activity.time || "--"}
            </p>

            <h3 className="font-semibold">
              {activity.name || TRIP_DETAILS.ITINERARY.ACTIVITY_DEFAULT_NAME}
            </h3>

            <p className="text-sm text-gray-600">
              {activity.description || ""}
            </p>

            {!!activity.tags?.length && (
              <div className="flex flex-wrap gap-2">
                {activity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-orange-50 text-orange-600"
                  >
                    <Sparkles className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
