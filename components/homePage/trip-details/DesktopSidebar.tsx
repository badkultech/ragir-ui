import Image from "next/image"
import { Bike, Home, Send, MessageCircle, CheckCircle2, ChevronDown } from "lucide-react"

export default function DesktopSidebar({
  onPricing,
  onAsk,
}: {
  onPricing: () => void
  onAsk: () => void
}) {
  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        {/* Images */}
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl overflow-hidden relative">
              <Image
                src="/mountain-camp.png"
                alt="Trip"
                width={200}
                height={150}
                className="w-full h-full object-cover"
              />
              {i === 5 && (
                <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                  <span className="text-white font-semibold">+5 more</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-2xl border p-6">
          <p className="text-3xl font-bold">₹12,999</p>
          <p className="text-xs text-gray-500 mb-4">Starting from</p>

          <button
            onClick={onPricing}
            className="w-full flex justify-between items-center p-3 border rounded-lg mb-4"
          >
            <div>
              <p className="text-sm font-medium">Occupancy - Double</p>
              <p className="text-xs text-gray-500">Select pricing option</p>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>

          <div className="space-y-3 mb-4">
            <Row icon={<Bike />} text="2 vehicle options" onClick={onPricing} />
            <Row icon={<Home />} text="3 accommodation types" onClick={onPricing} />
          </div>

          <div className="p-3 bg-orange-50 rounded-lg flex gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-orange-600" />
            <p className="text-xs text-orange-900">
              Select your preferred options to continue.
            </p>
          </div>

          <button onClick={onPricing} className="w-full bg-orange-500 text-white py-3 rounded-lg">
            <Send className="inline w-4 h-4 mr-2" />
            Request Invite
          </button>

          <button
            onClick={onAsk}
            className="w-full mt-3 border-2 border-orange-500 text-orange-500 py-3 rounded-lg"
          >
            <MessageCircle className="inline w-4 h-4 mr-2" />
            Send Query to Organiser
          </button>
        </div>
      </div>
    </div>
  )
}

const Row = ({ icon, text, onClick }: any) => (
  <div className="flex justify-between items-center border-b pb-3">
    <div className="flex gap-2 items-center text-sm text-gray-600">
      {icon}
      {text}
    </div>
    <button onClick={onClick} className="text-xs text-orange-500">
      View Details
    </button>
  </div>
)
