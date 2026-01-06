interface MobilePricingBarProps {
  onOpen: () => void;
  pricing: any;
}

export default function MobilePricingBar({ onOpen, pricing }: MobilePricingBarProps) {
  const simple = pricing?.simplePricingRequest;

  const base = simple?.basePrice || 0;
  const discount = simple?.discountPercent || 0;

  const finalPrice = base - (base * discount) / 100;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-30">
      <div className="flex justify-between items-center">

        <div>
          <p className="text-xs text-gray-500">Starting from</p>

          <p className="text-2xl font-bold">
            ₹{finalPrice.toLocaleString()}
          </p>

          {discount > 0 && (
            <p className="text-xs text-green-600">
              {discount}% OFF (₹{base.toLocaleString()} original)
            </p>
          )}
        </div>

        <button
          onClick={onOpen}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg"
        >
          View Options
        </button>

      </div>
    </div>
  );
}
