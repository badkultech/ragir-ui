import { X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function OrganizerProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4 flex justify-between">
          <h3 className="font-bold">Arjun Sharma</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-orange-500 text-white text-xl">
                AS
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-bold">Arjun Sharma</p>
              <p className="text-sm text-gray-500">Adventure Specialist</p>
              <p className="text-xs text-gray-400">
                If you're seeking memorable trips • 1947 likes
              </p>
            </div>
          </div>

          <h4 className="font-semibold mb-2">FULL BIOGRAPHY</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Hi, I'm an experienced mountain guide with 12 years of leading
            Himalayan adventure trips. I've led 300+ groups covering over
            25,000 km of terrain. Safety, experience, and community are my
            top priorities.
          </p>

          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl mt-6">
            <Stat value="12+" label="Years Experience" />
            <Stat value="300+" label="Trips Organized" />
            <Stat value="1947" label="Happy Travelers" />
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
