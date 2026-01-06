"use client";

import { useState } from "react";
import { TRIP_DETAILS } from "@/lib/constants/strings";
import Image from "next/image";
import {
  Bike,
  Send,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  MessageCircle,
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
                src="/kerala-backwaters.png"
                alt="Trip gallery"
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
            <p className="text-xs text-gray-500">{TRIP_DETAILS.SIDEBAR.STARTING_FROM}</p>

            <p className="text-3xl font-bold">
              ₹{finalPrice.toLocaleString()}
              <span className="text-sm text-gray-500 font-normal">
                {" "}{TRIP_DETAILS.SIDEBAR.PER_PERSON}
              </span>
            </p>

            {discount > 0 && (
              <p className="text-sm text-green-600">
                {discount}% {TRIP_DETAILS.SIDEBAR.OFF} (₹{base.toLocaleString()} {TRIP_DETAILS.SIDEBAR.ORIGINAL})
              </p>
            )}
          </div>

          {/* Option selector – for now single option */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="font-medium text-sm">{TRIP_DETAILS.SIDEBAR.BASE_PACKAGE_TITLE}</p>

            <button
              onClick={() => setSelected(1)}
              className={`w-full flex justify-between items-start p-4 rounded-xl border
                ${selected ? "border-orange-500 bg-white" : "border-transparent bg-white"}
              `}
            >
              <div className="flex gap-3 items-start">
                <Bike className="w-4 h-4 mt-1 text-gray-600" />
                <div>
                  <p className="font-semibold text-sm">{TRIP_DETAILS.SIDEBAR.STANDARD_PACKAGE}</p>
                  <p className="text-xs text-gray-500">{TRIP_DETAILS.SIDEBAR.STANDARD_DESC}</p>
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
              <p>{TRIP_DETAILS.SIDEBAR.SELECT_OPTION_WARNING}</p>
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
            {TRIP_DETAILS.SIDEBAR.REQUEST_INVITE}
          </button>

          <button
            onClick={onAsk}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-orange-500 text-orange-500 font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            {TRIP_DETAILS.SIDEBAR.SEND_QUERY}
          </button>
        </div>
      </div>
    </div>
  );
}
