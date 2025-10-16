"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CreditOptions({
  value,
  onChange,
}: {
  value: { card: boolean; emi: boolean }
  onChange: (v: { card: boolean; emi: boolean }) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <label className="flex items-center gap-2 rounded-md border p-3  ">
        <Checkbox checked={value.card} onCheckedChange={(c) => onChange({ ...value, card: Boolean(c) })} />
        <Label className="m-0">Credit Card</Label>
      </label>
      <label className="flex items-center gap-2 rounded-md border p-3">
        <Checkbox checked={value.emi} onCheckedChange={(c) => onChange({ ...value, emi: Boolean(c) })} />
        <Label className="m-0">EMI</Label>
      </label>
    </div>
  )
}
