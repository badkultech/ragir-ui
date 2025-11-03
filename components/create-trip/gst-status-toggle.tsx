"use client"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export type GstValue = "includes" | "excludes"

export function GstStatusToggle({
  value,
  onChange,
}: {
  value: GstValue
  onChange: (v: GstValue) => void
}) {
  const options: { key: GstValue; label: string }[] = [
    { key: "includes", label: "Includes GST" },
    { key: "excludes", label: "Excludes GST" },
  ]

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {options.map((opt) => (
        <button
          type="button"
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={cn(
            "rounded-md border items-center justify-center px-3 py-2 text-left",
            value === opt.key ? "border-orange-200 bg-orange-50 ring-orange-500" : "border-border",
          )}
          aria-pressed={value === opt.key}
        >
          <div className="flex items-center gap-2 ">
            <span
              className={cn(
                "inline-block h-3 w-3 rounded-full border-2",
                value === opt.key ? "bg-orange-500 border-orange-300" : "border-muted-foreground",
              )}
              aria-hidden
            />
            <Label className="m-0 cursor-pointer">{opt.label}</Label>
          </div>
        </button>
      ))}
    </div>
  )
}
