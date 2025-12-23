import { X, Bike, Send, CheckCircle2 } from "lucide-react"

export default function MobilePricingModal({
  options,
  onClose,
}: {
  options: any[]
  onClose: () => void
}) {
  return (
    <div className="lg:hidden fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4 flex justify-between">
          <h3 className="font-bold">Select Options</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {options.map((opt, i) => (
            <div key={i} className="flex justify-between border-b pb-3">
              <div className="flex gap-2">
                <Bike className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium">{opt.type}</p>
                  <p className="text-xs text-gray-500">{opt.description}</p>
                </div>
              </div>
              <span className="font-semibold">{opt.price}</span>
            </div>
          ))}

          <div className="bg-orange-50 p-3 rounded-lg flex gap-2">
            <CheckCircle2 className="text-orange-600" />
            <p className="text-xs text-orange-900">
              Please select an option before requesting invite.
            </p>
          </div>

          <button className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg">
            <Send className="inline w-4 h-4 mr-2" />
            Request Invite
          </button>
        </div>
      </div>
    </div>
  )
}
