import { X } from "lucide-react"
import { TRIP_DETAILS } from "@/lib/constants/strings"

export default function AskQuestionModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="border-b px-6 py-4 flex justify-between">
          <h3 className="font-bold">{TRIP_DETAILS.ASK_MODAL.TITLE}</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6">
          <textarea
            rows={4}
            placeholder={TRIP_DETAILS.ASK_MODAL.DESC as string}
            className="w-full border rounded-lg p-3"
          />

          <div className="flex gap-3 mt-4">
            <button onClick={onClose} className="flex-1 border py-3 rounded-lg">
              {TRIP_DETAILS.ASK_MODAL.CANCEL}
            </button>
            <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg">
              {TRIP_DETAILS.ASK_MODAL.SUBMIT}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
