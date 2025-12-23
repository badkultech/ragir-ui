import { X } from "lucide-react"

export default function ExcludedSection({ items }: { items: string[] }) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h2 className="text-xl font-bold mb-4">What's Excluded</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <X className="w-5 h-5 text-red-500" />
            <span className="text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
