import { Ban } from "lucide-react"

export default function ExcludedSection({ items }: { items: string[] }) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h2 className="text-xl font-bold mb-4">What's Excluded</h2>
      <div className="grid md:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3 bg-[#F7F7F7] p-2 rounded-lg">
            <Ban className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-500">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
