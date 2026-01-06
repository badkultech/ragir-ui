import { X, Bike, Send, CheckCircle2 } from "lucide-react"

type SimplePricing = {
  basePrice?: number
  discountPercent?: number
  discountValidUntil?: string
}

export default function MobilePricingModal({
  options,
  onClose,
}: {
  options: any
  onClose: () => void
}) {
  const simple: SimplePricing | undefined = options?.simplePricingRequest

  const finalPrice =
    simple?.basePrice && simple?.discountPercent
      ? Math.round(simple.basePrice - (simple.basePrice * simple.discountPercent) / 100)
      : simple?.basePrice

  return (
    <div className="lg:hidden fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="border-b px-6 py-4 flex justify-between">
          <h3 className="font-bold">Pricing Options</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6 space-y-4">

          {/* -------- SIMPLE PRICING CARD -------- */}
          {options?.tripPricingType === "SIMPLE" && (
            <div className="flex justify-between border-b pb-3">
              <div className="flex gap-2">
                <Bike className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Base Package</p>

                  {simple?.discountPercent ? (
                    <p className="text-xs text-green-600">
                      {simple.discountPercent}% OFF until {simple.discountValidUntil}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Standard trip package pricing
                    </p>
                  )}
                </div>
              </div>

              <span className="font-semibold">
                ₹{finalPrice?.toLocaleString() || "--"}
              </span>
            </div>
          )}

          {/* -------- ADD-ONS IF AVAILABLE -------- */}
          {Array.isArray(options?.addOns) &&
            options.addOns.map((a: any, i: number) => (
              <div key={i} className="flex justify-between border-b pb-3">
                <div className="flex gap-2">
                  <Bike className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-gray-500">{a.description}</p>
                  </div>
                </div>

                <span className="font-semibold">
                  ₹{a.price?.toLocaleString() || "--"}
                </span>
              </div>
            ))}

          {/* WARNING */}
          <div className="bg-orange-50 p-3 rounded-lg flex gap-2">
            <CheckCircle2 className="text-orange-600" />
            <p className="text-xs text-orange-900">
              Please select an option before requesting invite.
            </p>
          </div>

          {/* BUTTON */}
          <button className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg">
            <Send className="inline w-4 h-4 mr-2" />
            Request Invite
          </button>
        </div>
      </div>
    </div>
  )
}
