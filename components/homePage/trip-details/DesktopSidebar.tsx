"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Bike,
  Send,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  AlertCircle,
} from "lucide-react"

const pricingOptions = [
  {
    id: 1,
    title: "Enfield 350cc",
    subtitle: "Solo Rider",
    price: "₹ 47,000",
  },
  {
    id: 2,
    title: "Himalayan 411cc",
    subtitle: "Dual Rider",
    price: "₹ 35,000",
  },
  {
    id: 3,
    title: "Himalayan 411cc",
    subtitle: "Solo Rider",
    price: "₹ 52,000",
  },
]

export default function DesktopSidebar({
  onAsk,
}: {
  onAsk: () => void
}) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className=" space-y-4 mt-4">

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
        <div className="bg-white rounded-2xl border p-5 mt-4 space-y-4">

          {/* Price Header */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Starting from</p>
              <p className="text-3xl font-bold">
                ₹12,999{" "}
                <span className="text-sm font-normal text-gray-500">
                  per person
                </span>
              </p>
            </div>
          </div>

          {/* Expanded Content */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="font-medium text-sm">Occupancy – Double</p>

            {pricingOptions.map((opt) => {
              const active = selected === opt.id

              return (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  className={`w-full flex justify-between items-start p-4 rounded-xl border transition
                      ${active
                      ? "border-orange-500 bg-white"
                      : "border-transparent bg-white"
                    }
                    `}
                >
                  <div className="flex gap-3 items-start">
                    <Bike className="w-4 h-4 mt-1 text-gray-600" />
                    <div className="text-left">
                      <p className="font-semibold text-sm">
                        {opt.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {opt.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold text-sm">
                    {opt.price}
                  </p>
                </button>
              )
            })}
          </div>


          {/* Warning */}
          {!selected && (
            <div className="flex gap-2 items-center text-xs text-orange-600 bg-orange-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              Please select a price option before requesting an invite.
            </div>
          )}

          {/* Request Invite */}
          <button
            disabled={!selected}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition
              ${selected
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            <Send className="w-4 h-4" />
            Request Invite
          </button>

          {/* Send Query */}
          <button
            onClick={onAsk}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-orange-500 text-orange-500 font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            Send Query to Organiser
          </button>
        </div>
      </div>
    </div>
  )
}
