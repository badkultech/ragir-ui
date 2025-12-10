import Link from "next/link"
import { TripLeaderCard } from "@/components/homePage/shared/trip-leader-card"
import { ChevronRight } from "lucide-react"

const tripLeaders = [
  { name: "Kyle May", image: "/travel-guide-portrait-professional-man.jpg" },
  { name: "Sarah Johnson", image: "/travel-guide-portrait-professional-woman.jpg" },
  { name: "Mike Chen", image: "/adventure-guide-portrait-man-outdoor.jpg" },
  { name: "Emma Wilson", image: "/travel-guide-portrait-professional-woman.jpg" },
  { name: "James Brown", image: "/travel-guide-portrait-professional-man.jpg" },
  { name: "Olivia Davis", image: "/adventure-guide-portrait-man-outdoor.jpg" },
  { name: "David Lee", image: "/travel-guide-portrait-professional-man.jpg" },
  { name: "Lisa Park", image: "/travel-guide-portrait-professional-woman.jpg" },
]

export function TripLeadersSection() {
  // Split leaders into 2 rows
  const row1 = tripLeaders.slice(0, 4)
  const row2 = tripLeaders.slice(4, 8)

  return (
    <section className="py-16 bg-gray-50/50">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">Meet Trip Leaders</h2>

      {/* Horizontally scrollable container */}
      <div className="overflow-x-auto flex flex-col items-center pb-4 scrollbar-hide">
        <div className="flex flex-col gap-8 px-4 md:px-8 ">
          {/* Row 1 */}
          <div className="flex gap-4 pl-12">
            {row1.map((leader) => (
              <TripLeaderCard key={leader.name} name={leader.name} image={leader.image} />
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex gap-4">
            {row2.map((leader) => (
              <TripLeaderCard key={leader.name} name={leader.name} image={leader.image} />
            ))}
          </div>
        </div>
      </div>

      {/* View All link */}
      <div className="flex justify-center mt-8">
        <Link
          href="/home/leaders"
          className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium text-sm"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
