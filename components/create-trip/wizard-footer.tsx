"use client"

import { Button } from "@/components/ui/button"

export function WizardFooter({
  onPrev,
  onDraft,
  onNext,
  prevLabel = "Previous",
  nextLabel = "Save & Next",
}: {
  onPrev?: () => void
  onDraft?: () => void
  onNext?: () => void
  prevLabel?: string
  nextLabel?: string
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
      {onPrev ? (
        <div className="flex justify-center sm:justify-start">
          <Button
            variant="outline"
            className="px-8 py-2 rounded-full font-medium text-orange-500 border-orange-400 hover:bg-orange-50 transition flex items-center gap-2"
            onClick={onPrev}
          >
            {prevLabel}
          </Button>
        </div>
      ) : <div />}

      <div className="flex justify-center sm:justify-end gap-3">
        {onDraft ? (
          <Button
            variant="outline"
            className="rounded-full bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-2"
            onClick={onDraft}
          >
            Save as Draft
          </Button>
        ) : null}
        {onNext ? (
          <Button
            className="px-8 py-2 rounded-full font-medium text-white bg-gradient-to-r from-orange-400 to-pink-500 shadow hover:from-orange-500 hover:to-pink-600 transition flex items-center gap-2"
            onClick={onNext}
          >
            {nextLabel}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
