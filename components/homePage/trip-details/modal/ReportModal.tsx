import { useState } from "react"
import { X } from "lucide-react"

const options = [
  "Spam or irrelevant content",
  "Inappropriate or offensive language",
  "Misleading or false information",
  "Invalid contact information",
  "Other (please specify below)",
]

export default function ReportModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const [details, setDetails] = useState("")

  const toggle = (opt: string) => {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="border-b px-6 py-4 flex justify-between">
          <h3 className="font-bold">Report this trip</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Help us understand the issue.
          </p>

          <div className="space-y-2 mb-4">
            {options.map((opt) => (
              <label
                key={opt}
                className="flex gap-3 items-center border p-3 rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggle(opt)}
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>

          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder="Additional details (optional)"
            className="w-full border rounded-lg p-3 mb-4"
          />

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border py-3 rounded-lg">
              Cancel
            </button>
            <button
              disabled={!selected.length}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg disabled:opacity-50"
            >
              Yes, Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
