import Link from "next/link"
import { TripLeaderCard } from "@/components/homePage/shared/trip-leader-card"
import { ChevronRight } from "lucide-react"

const tripLeaders = [
  { name: "Kyle May", image: "/tl-pfp.jpg" },
  { name: "Sarah Johnson", image: "/tl-pfp.jpg" },
  { name: "Mike Chen", image: "/tl-pfp.jpg" },
  { name: "Emma Wilson", image: "/tl-pfp.jpg" },
  { name: "James Brown", image: "/tl-pfp.jpg" },
  { name: "Olivia Davis", image: "/tl-pfp.jpg" },
  { name: "David Lee", image: "/tl-pfp.jpg" },
  { name: "Lisa Park", image: "/tl-pfp.jpg" },
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
      <div className="overflow-x-auto flex flex-col items-center pb-4 no-scrollbar">
        <div className="flex flex-col gap-8 px-4 md:px-20 ">
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
      <div className="text-center my-8 ">
        <Link
          href="/home/leaders"
          className="text-lg text-[#ff804c] flex items-center gap-2  justify-center font-semibold font-poppins  hover:text-primary/80 transition-colors"
        >
          View All
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}
