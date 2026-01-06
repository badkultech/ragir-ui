"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bike,
  Send,
  MessageCircle,
  AlertCircle,
} from "lucide-react";

interface DesktopSidebarProps {
  onAsk: () => void;
  pricing: any;
}

export default function DesktopSidebar({ onAsk, pricing }: DesktopSidebarProps) {
  const [selected, setSelected] = useState<number | null>(null);

  // --- handle simple pricing ---
  const simple = pricing?.simplePricingRequest;

  const base = simple?.basePrice || 0;
  const discount = simple?.discountPercent || 0;

  const finalPrice = base - (base * discount) / 100;

  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className=" top-24 space-y-4">

        {/* Images (for now dummy until API gives banner images) */}
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
            </div>
          ))}
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-2xl border p-5 space-y-4">

          <div>
            <p className="text-xs text-gray-500">Starting from</p>

            <p className="text-3xl font-bold">
              ₹{finalPrice.toLocaleString()}
              <span className="text-sm text-gray-500 font-normal">
                {" "}per person
              </span>
            </p>

            {discount > 0 && (
              <p className="text-sm text-green-600">
                {discount}% OFF (₹{base.toLocaleString()} original)
              </p>
            )}
          </div>

          {/* Option selector – for now single option */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="font-medium text-sm">Base Package</p>

            <button
              onClick={() => setSelected(1)}
              className={`w-full flex justify-between items-start p-4 rounded-xl border
                ${selected ? "border-orange-500 bg-white" : "border-transparent bg-white"}
              `}
            >
              <div className="flex gap-3 items-start">
                <Bike className="w-4 h-4 mt-1 text-gray-600" />
                <div>
                  <p className="font-semibold text-sm">Standard Package</p>
                  <p className="text-xs text-gray-500">Includes all base benefits</p>
                </div>
              </div>

              <p className="font-semibold text-sm">
                ₹{finalPrice.toLocaleString()}
              </p>
            </button>
          </div>

          {!selected && (
            <div className="flex gap-2 items-center text-xs text-orange-600 bg-orange-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              Please select a price option before requesting an invite.
            </div>
          )}

          <button
            disabled={!selected}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium
              ${selected
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"}
            `}
          >
            <Send className="w-4 h-4" />
            Request Invite
          </button>

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
  );
}
