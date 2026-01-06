import { X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface LeaderProfileModalProps {
  onClose: () => void
  leader?: {
    name?: string
    bio?: string
    tagline?: string
    likes?: number
    years?: number
    trips?: number
    travelers?: number
  }
}

export default function LeaderProfileModal({
  onClose,
  leader,
}: LeaderProfileModalProps) {
  const name = leader?.name || "Arjun Sharma"
  const bio =
    leader?.bio ||
    "Hi, I'm an experienced mountain guide with multiple years of leading trips and ensuring safe adventures."
  const tagline = leader?.tagline || "Adventure Specialist"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">

        {/* Header — SAME UI */}
        <div className="border-b px-6 py-4 flex justify-between">
          <h3 className="font-bold">{name}</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Body — SAME UI */}
        <div className="p-6">
          <div className="flex gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-orange-500 text-white text-xl">
                {name?.[0]}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-bold">{name}</p>

              <p className="text-sm text-gray-500">
                {tagline}
              </p>

              <p className="text-xs text-gray-400">
                If you're seeking memorable trips • {leader?.likes || 1947} likes
              </p>
            </div>
          </div>

          <h4 className="font-semibold mb-2">FULL BIOGRAPHY</h4>

          <p className="text-sm text-gray-600 leading-relaxed">
            {bio}
          </p>

          {/* SAME UI — stats only dynamic */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl mt-6">
            <Stat value={`${leader?.years || "12+"}`} label="Years Experience" />
            <Stat value={`${leader?.trips || "300+"}`} label="Trips Organized" />
            <Stat value={`${leader?.travelers || "1947"}`} label="Happy Travelers" />
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}

const Stat = ({ value, label }: any) => (
  <div className="text-center">
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
)
