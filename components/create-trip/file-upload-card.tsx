"use client"

import { useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function FileUploadCard({
  label = "Upload PDF Itinerary",
  accept = ".pdf",
}: {
  label?: string
  accept?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState<string | null>(null)

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Label className="mb-2 block text-sm">{label}</Label>
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-6">
        <img src="/itinerary.jpg" alt="" className="h-14 w-14" />
        <div className="text-sm text-muted-foreground">{name ? `Selected: ${name}` : "No file selected"}</div>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(e) => setName(e.target.files?.[0]?.name ?? null)}
            aria-label={label}
          />
          <Button variant="outline" onClick={() => inputRef.current?.click()} className="rounded-full">
            Choose File
          </Button>
        </div>
      </div>
    </div>
  )
}
