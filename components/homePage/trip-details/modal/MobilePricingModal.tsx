"use client";

import { useState, useMemo } from "react";
import { X, Bike, Send, CheckCircle2 } from "lucide-react";
import { TRIP_DETAILS } from "@/lib/constants/strings";

export default function MobilePricingModal({
  options,
  onClose,
  onRequestInvite,
}: {
  options: any;
  onClose: () => void;
  onRequestInvite: () => void;
}) {
  const simple = options?.simplePricingRequest;
  const dynamic = options?.dynamicPricingRequest;
  const addOns = options?.addOns || [];

  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const getFinal = (price: number, discount: number) =>
    price - (price * discount) / 100;

  // -------- SIMPLE TOTAL --------
  const simpleTotal = useMemo(() => {
    if (!simple) return 0;
    return getFinal(simple.basePrice, simple.discountPercent);
  }, [simple]);

  // -------- DYNAMIC TOTAL --------
  const dynamicTotal = useMemo(() => {
    if (!dynamic) return 0;

    return dynamic.pricingCategoryDtos?.reduce((sum: number, cat: any) => {
      // SINGLE → auto included (first option)
      if (cat.pricingCategoryType === "SINGLE") {
        const opt = cat.pricingCategoryOptionDTOs?.[0];
        if (!opt) return sum;
        return sum + getFinal(opt.price, opt.discount);
      }

      // MULTI → based on selected
      const selected = selectedOptions[cat.categoryName];
      if (!selected) return sum;

      return sum + getFinal(selected.price, selected.discount);
    }, 0);
  }, [dynamic, selectedOptions]);

  // -------- ADD ONS TOTAL --------
  const addOnTotal = selectedAddOns.reduce((sum, n) => {
    const add = addOns.find((a: any) => a.name === n);
    return sum + (add?.charge || add?.price || 0);
  }, 0);

  const finalPrice =
    (options?.tripPricingType === "SIMPLE" ? simpleTotal : dynamicTotal) +
    addOnTotal;

  // button enable logic
  const hasMulti =
    dynamic?.pricingCategoryDtos?.some(
      (c: any) => c.pricingCategoryType === "MULTI"
    ) ?? false;

  const isButtonEnabled =
    options?.tripPricingType === "SIMPLE"
      ? true
      : hasMulti
        ? Object.keys(selectedOptions).length > 0
        : true;

  return (
    <div className="lg:hidden fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="border-b px-6 py-4 flex justify-between">
          <h3 className="font-bold">
            {TRIP_DETAILS.PRICING_MODAL.TITLE}
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* TOTAL DISPLAY */}
          <div className="flex justify-between border-b pb-3">
            <p className="font-medium text-sm">
              Total
            </p>

            <span className="font-bold text-orange-500">
              ₹{(finalPrice || 0).toLocaleString()}
            </span>
          </div>


          {/* -------- SIMPLE -------- */}
          {options?.tripPricingType === "SIMPLE" && (
            <div className="flex justify-between border-b pb-3">
              <div className="flex gap-2">
                <Bike className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium">
                    {TRIP_DETAILS.PRICING_MODAL.BASE_PACKAGE}
                  </p>

                  {simple?.discountPercent ? (
                    <p className="text-xs text-green-600">
                      {simple.discountPercent}% {TRIP_DETAILS.PRICING_MODAL.OFF} —{" "}
                      {simple.discountValidUntil}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      {TRIP_DETAILS.PRICING_MODAL.STANDARD_PRICING}
                    </p>
                  )}
                </div>
              </div>

              <span className="font-semibold">
                ₹{simpleTotal.toLocaleString()}
              </span>
            </div>
          )}

          {/* -------- DYNAMIC -------- */}
          {options?.tripPricingType === "DYNAMIC" &&
            dynamic?.pricingCategoryDtos?.map((cat: any, i: number) => {
              // SINGLE visible
              if (cat.pricingCategoryType === "SINGLE") {
                const opt = cat.pricingCategoryOptionDTOs?.[0];
                if (!opt) return null;

                return (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-xl p-4 border space-y-2"
                  >
                    <p className="text-sm font-medium flex justify-between">
                      {cat.categoryName}
                      <span className="text-green-600 text-xs">
                        Auto included
                      </span>
                    </p>

                    <div className="flex justify-between">
                      <p className="text-sm">{opt.name}</p>
                      <span className="font-semibold">
                        ₹{getFinal(opt.price, opt.discount)}
                      </span>
                    </div>
                  </div>
                );
              }

              // MULTI radio
              return (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl p-4 border space-y-3"
                >
                  <p className="text-sm font-medium">{cat.categoryName}</p>

                  {cat.pricingCategoryOptionDTOs?.map(
                    (opt: any, idx: number) => {
                      const checked =
                        selectedOptions[cat.categoryName]?.name === opt.name;

                      return (
                        <label
                          key={idx}
                          className="flex justify-between items-center border rounded-xl p-3"
                        >
                          <div className="flex gap-3">
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
                              <p className="text-sm font-medium">{opt.name}</p>
                              <p className="text-xs text-gray-500">
                                ₹{opt.price} — {opt.discount}% OFF
                              </p>
                            </div>
                          </div>

                          <span className="font-semibold">
                            ₹{getFinal(opt.price, opt.discount)}
                          </span>
                        </label>
                      );
                    }
                  )}
                </div>
              );
            })}

          {/* -------- ADD ONS -------- */}
          {addOns.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 border space-y-3">
              <p className="text-sm font-medium">Add-ons</p>

              {addOns.map((a: any, i: number) => (
                <label
                  key={i}
                  className="flex justify-between items-center border rounded-xl p-3"
                >
                  <div className="flex gap-3">
                    <input
                      type="checkbox"
                      checked={selectedAddOns.includes(a.name)}
                      onChange={() =>
                        setSelectedAddOns((prev) =>
                          prev.includes(a.name)
                            ? prev.filter((n) => n !== a.name)
                            : [...prev, a.name]
                        )
                      }
                    />

                    <div>
                      <p className="text-sm">{a.name}</p>
                      <p className="text-xs text-gray-500">
                        {a.description || ""}
                      </p>
                    </div>
                  </div>

                  <span className="font-semibold">
                    ₹{(a.charge || a.price || 0).toLocaleString()}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* INFO */}
          <div className="bg-orange-50 p-3 rounded-lg flex gap-2">
            <CheckCircle2 className="text-orange-600" />
            <p className="text-xs text-orange-900">
              {TRIP_DETAILS.PRICING_MODAL.WARNING}
            </p>
          </div>

          {/* BUTTON */}
          <button
            disabled={!isButtonEnabled}
            onClick={onRequestInvite}
            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${isButtonEnabled
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-400"
              }`}
          >
            <Send className="w-4 h-4" />
            {TRIP_DETAILS.PRICING_MODAL.REQUEST_INVITE}
          </button>
        </div>
      </div>
    </div>
  );
}
