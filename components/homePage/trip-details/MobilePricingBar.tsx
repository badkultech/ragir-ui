import { TRIP_DETAILS } from "@/lib/constants/strings";

interface MobilePricingBarProps {
  onOpen: () => void;
  pricing: any;
}

export default function MobilePricingBar({ onOpen, pricing }: MobilePricingBarProps) {
  const simple = pricing?.simplePricingRequest;
  const dynamic = pricing?.dynamicPricingRequest;
  const addOns = pricing?.addOns || [];

  const getFinal = (price: number, discount: number) =>
    price - (price * discount) / 100;

  // ---------- SIMPLE ----------
  let displayPrice = 0;
  let base = 0;
  let discount = 0;

  if (pricing?.tripPricingType === "SIMPLE" && simple) {
    base = simple.basePrice;
    discount = simple.discountPercent;
    displayPrice = getFinal(simple.basePrice, simple.discountPercent);
  }

  // ---------- DYNAMIC ----------
  if (pricing?.tripPricingType === "DYNAMIC" && dynamic) {
    let total = 0;

    dynamic.pricingCategoryDtos?.forEach((cat: any) => {
      // SINGLE → always take first
      if (cat.pricingCategoryType === "SINGLE") {
        const opt = cat.pricingCategoryOptionDTOs?.[0];
        if (opt) total += getFinal(opt.price, opt.discount);
      }

      // MULTI → take MINIMUM option as starting price
      if (cat.pricingCategoryType === "MULTI") {
        const min = cat.pricingCategoryOptionDTOs
          ?.map((o: any) => getFinal(o.price, o.discount))
          ?.sort((a: number, b: number) => a - b)?.[0];

        if (min) total += min;
      }
    });

    displayPrice = total;
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-30">
      <div className="flex justify-between items-center">

        <div>
          <p className="text-xs text-gray-500">
            {TRIP_DETAILS.MOBILE_BAR.STARTING_FROM}
          </p>

          <p className="text-2xl font-bold">
            ₹{(displayPrice || 0).toLocaleString()}
          </p>

          {pricing?.tripPricingType === "SIMPLE" && discount > 0 && (
            <p className="text-xs text-green-600">
              {discount}% {TRIP_DETAILS.MOBILE_BAR.OFF} (₹{base.toLocaleString()} {TRIP_DETAILS.MOBILE_BAR.ORIGINAL})
            </p>
          )}
        </div>

        <button
          onClick={onOpen}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg"
        >
          {TRIP_DETAILS.MOBILE_BAR.VIEW_OPTIONS}
        </button>

      </div>
    </div>
  );
}
