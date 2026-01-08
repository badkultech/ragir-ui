"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Send, AlertCircle, MessageCircle } from "lucide-react";
import { TRIP_DETAILS } from "@/lib/constants/strings";

interface DesktopSidebarProps {
  onAsk: () => void;
  pricing: any;
  images: { url: string }[];
  onRequestInvite: (data: {
    options: any;
    addOns: string[];
    finalPrice: number;
  }) => void;

}

export default function DesktopSidebar({
  onAsk,
  pricing,
  images,
  onRequestInvite,
}: DesktopSidebarProps) {
  const simple = pricing?.simplePricingRequest;
  const dynamic = pricing?.dynamicPricingRequest;
  const addOns = pricing?.addOns || [];

  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const getOptionFinalPrice = (price: number, discount: number) =>
    price - (price * discount) / 100;

  // SIMPLE TOTAL
  const simpleFinal = useMemo(() => {
    if (!simple) return 0;
    return getOptionFinalPrice(simple.basePrice, simple.discountPercent);
  }, [simple]);

  // DYNAMIC TOTAL
  const dynamicTotal = useMemo(() => {
    if (!dynamic) return 0;

    return dynamic.pricingCategoryDtos?.reduce((sum: number, cat: any) => {
      // SINGLE → auto include first option
      if (cat.pricingCategoryType === "SINGLE") {
        const opt = cat.pricingCategoryOptionDTOs?.[0];
        if (!opt) return sum;
        return sum + getOptionFinalPrice(opt.price, opt.discount);
      }

      // MULTI → depends on selected
      const selected = selectedOptions[cat.categoryName];
      if (!selected) return sum;

      return (
        sum +
        getOptionFinalPrice(selected.price, selected.discount)
      );
    }, 0);
  }, [dynamic, selectedOptions]);

  const addOnTotal = selectedAddOns.reduce((sum, name) => {
    const add = addOns.find((a: any) => a.name === name);
    return sum + (add?.charge || 0);
  }, 0);

  const finalPrice =
    (pricing?.tripPricingType === "SIMPLE" ? simpleFinal : dynamicTotal) +
    addOnTotal;

  // button enable
  const hasMulti =
    dynamic?.pricingCategoryDtos?.some(
      (c: any) => c.pricingCategoryType === "MULTI"
    ) ?? false;

  const isButtonEnabled =
    pricing?.tripPricingType === "SIMPLE"
      ? true
      : hasMulti
        ? Object.keys(selectedOptions).length > 0
        : true;

  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className="space-y-4">

        {/* Images */}
        <div className="grid grid-cols-2 gap-2">
          {(images?.length ? images : Array.from({ length: 6 })).map(
            (img: any, i: number) => (
              <div key={i} className="h-28 rounded-xl overflow-hidden relative">
                <Image
                  src={img?.url || "/kerala-backwaters.png"}
                  alt="Trip gallery"
                  width={200}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>
            )
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border p-5 space-y-4">
          <div>
            <p className="text-xs text-gray-500">
              {TRIP_DETAILS.SIDEBAR.STARTING_FROM}
            </p>

            <p className="text-3xl font-bold">
              ₹{(finalPrice || 0).toLocaleString()}
              <span className="text-sm text-gray-500 font-normal">
                {" "}
                {TRIP_DETAILS.SIDEBAR.PER_PERSON}
              </span>
            </p>

            {simple && simple.discountPercent > 0 && (
              <p className="text-sm text-green-600">
                {simple.discountPercent}% OFF (₹{simple.basePrice})
              </p>
            )}
          </div>

          {/* DYNAMIC ONLY */}
          {pricing?.tripPricingType === "DYNAMIC" && (
            <>
              {dynamic?.pricingCategoryDtos?.map((cat: any, i: number) => {
                // -------------- SINGLE (visible + read-only) ----------------
                if (cat.pricingCategoryType === "SINGLE") {
                  const opt = cat.pricingCategoryOptionDTOs?.[0];

                  if (!opt) return null;

                  return (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-xl p-4 space-y-2 border border-green-200"
                    >
                      <p className="font-medium text-sm flex justify-between">
                        {cat.categoryName}
                        <span className="text-green-600 text-xs">
                          Included automatically
                        </span>
                      </p>

                      <div className="flex justify-between items-center p-3 rounded-xl border bg-white">
                        <div>
                          <p className="font-semibold text-sm">{opt.name}</p>
                          <p className="text-xs text-gray-500">
                            ₹{opt.price} — {opt.discount}% OFF
                          </p>
                        </div>

                        <p className="font-semibold text-sm">
                          ₹{getOptionFinalPrice(opt.price, opt.discount)}
                        </p>
                      </div>
                    </div>
                  );
                }

                // -------------- MULTI (radio) ----------------
                return (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <p className="font-medium text-sm">{cat.categoryName}</p>

                    {cat.pricingCategoryOptionDTOs?.map(
                      (opt: any, idx: number) => {
                        const checked =
                          selectedOptions[cat.categoryName]?.name === opt.name;

                        return (
                          <label
                            key={idx}
                            className="flex justify-between items-center p-3 rounded-xl border cursor-pointer"
                          >
                            <div className="flex gap-3 items-start">
                              <input
                                type="radio"
                                name={cat.categoryName}
                                checked={checked}
                                onChange={() =>
                                  setSelectedOptions((prev: any) => ({
                                    ...prev,
                                    [cat.categoryName]: opt,
                                  }))
                                }
                              />

                              <div>
                                <p className="font-semibold text-sm">
                                  {opt.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ₹{opt.price} — {opt.discount}% OFF
                                </p>
                              </div>
                            </div>

                            <p className="font-semibold text-sm">
                              ₹{getOptionFinalPrice(
                                opt.price,
                                opt.discount
                              )}
                            </p>
                          </label>
                        );
                      }
                    )}
                  </div>
                );
              })}

              {/* Add-ons */}
              {addOns.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="font-medium text-sm">Add-ons</p>

                  {addOns.map((add: any, i: number) => (
                    <label
                      key={i}
                      className="flex justify-between items-center p-3 rounded-xl border cursor-pointer"
                    >
                      <div className="flex gap-3 items-start">
                        <input
                          type="checkbox"
                          checked={selectedAddOns.includes(add.name)}
                          onChange={() =>
                            setSelectedAddOns((prev) =>
                              prev.includes(add.name)
                                ? prev.filter((n) => n !== add.name)
                                : [...prev, add.name]
                            )
                          }
                        />
                        <p className="text-sm">{add.name}</p>
                      </div>

                      <p className="font-semibold text-sm">
                        ₹{add.charge}
                      </p>
                    </label>
                  ))}
                </div>
              )}
            </>
          )}

          {!isButtonEnabled && (
            <div className="flex gap-2 items-center text-xs text-orange-600 bg-orange-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <p>{TRIP_DETAILS.SIDEBAR.SELECT_OPTION_WARNING}</p>
            </div>
          )}

          <button
            disabled={!isButtonEnabled}
            onClick={() =>
              onRequestInvite({
                options: selectedOptions,
                addOns: selectedAddOns,
                finalPrice,
              })
            }
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium ${isButtonEnabled
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
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
