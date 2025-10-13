"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "../ui/label"

export function PillCheckboxGroup({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string[]
  onChange: (next: string[]) => void
}) {
  const toggle = (label: string) => {
    const next = value.includes(label) ? value.filter((t) => t !== label) : [...value, label]
    onChange(next)
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((label) => {
        const active = value.includes(label)
        const id = `exclusion-${label.replace(/\s+/g, "-").toLowerCase()}`
        return (
          <Label key={label} htmlFor={id} className="flex cursor-pointer items-center gap-3 rounded-md px-1 py-1">
            <Checkbox id={id} checked={active} onCheckedChange={() => toggle(label)} />
            <span className="text-sm text-foreground">{label}</span>
          </Label>
        )
      })}
    </div>
  )
}
