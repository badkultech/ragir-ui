export default function MobilePricingBar({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-30">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">Starting from</p>
          <p className="text-2xl font-bold">₹12,999</p>
        </div>
        <button onClick={onOpen} className="bg-orange-500 text-white px-6 py-3 rounded-lg">
          View Options
        </button>
      </div>
    </div>
  )
}
