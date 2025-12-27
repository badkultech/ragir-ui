import { X, CheckCircle2 } from "lucide-react"

export default function PricingDetailsModal({
  pricingOptions,
  onClose,
}: {
  pricingOptions: any[]
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between">
          <h3 className="font-bold">Pricing Details</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {pricingOptions.map((opt, i) => (
            <div key={i} className="flex justify-between border-b pb-3">
              <div>
                <p className="font-semibold">{opt.type}</p>
                <p className="text-sm text-gray-500">{opt.description}</p>
              </div>
              <span className="font-bold text-orange-500">{opt.price}</span>
            </div>
          ))}

          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="text-green-600" />
            EMI Options Available
          </div>

          <div className="border-t pt-4">
            <p className="font-semibold mb-2">Cancellation Policy</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 30+ days: 80% refund</li>
              <li>• 15–29 days: 50% refund</li>
              <li>• 7–14 days: 25% refund</li>
              <li>• Less than 7 days: No refund</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 border py-3 rounded-lg"
            >
              Cancel
            </button>
            <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg">
              Request Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
