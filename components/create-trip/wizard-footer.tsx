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
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end ralative  mt-4  ">
      {onPrev ? (
        <Button variant="outline"  className="px-8 py-2 rounded-full font-medium text-white bg-gradient-to-r from-orange-400 to-pink-500 shadow hover:from-orange-500 hover:to-pink-600 transition flex items-center gap-2" onClick={onPrev}>
          {prevLabel}
        </Button>
      ) : null}
      {onDraft ? (
        <Button variant="outline" className="rounded-full bg-transparent" onClick={onDraft}>
          Save as Draft
        </Button>
      ) : null}
      {onNext ? (
        <Button  className="px-8 py-2 rounded-full font-medium text-white bg-gradient-to-r from-orange-400 to-pink-500 shadow hover:from-orange-500 hover:to-pink-600 transition flex items-center gap-2" onClick={onNext}>
          {nextLabel}
        </Button>
      ) : null}
    </div>
  )
}
