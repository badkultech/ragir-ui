"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { OrganizerShell } from "@/components/layouts/organizer-shell"
import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader"
import { SectionCard } from "@/components/create-trip/section-card"
import { PillCheckboxGroup } from "@/components/create-trip/pill-checkbox-group"
import { WizardFooter } from "@/components/create-trip/wizard-footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/organizer/sidebar"

const DEFAULT_OPTIONS = [
  "Personal Expenses",
  "Travel Insurance",
  "Tips and Gratuities",
  "Visa and Passport Fees",
  "Meals Not Listed",
]

export default function ExclusionsPage() {
  const router = useRouter()
  const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS)
  const [selected, setSelected] = useState<string[]>([
    "Personal Expenses",
    "Travel Insurance",
    "Visa and Passport Fees",
  ])
  const [custom, setCustom] = useState("")

  const addCustom = () => {
    const trimmed = custom.trim()
    if (!trimmed) return
    if (!options.includes(trimmed)) setOptions((prev) => [...prev, trimmed])
    if (!selected.includes(trimmed)) setSelected((prev) => [...prev, trimmed])
    setCustom("")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">      
              <Sidebar />
         <div className="flex-1 w-full min-h-screen flex flex-col">
    <OrganizerShell title="Create New Trip">
      <TripStepperHeader activeStep={3} />
      
      <SectionCard title="Exclusions" >
        <div className="space-y-6">
          <PillCheckboxGroup options={options} value={selected} onChange={setSelected} />
          <div className="space-y-2">
            <Label htmlFor="custom-exclusion">Custom Exclusion</Label>
            <div className="flex items-center gap-2">
              <Input
                id="custom-exclusion"
                placeholder="Enter custom exclusion"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
              />
              <Button type="button" variant="outline" className="rounded-full bg-transparent" onClick={addCustom}>
                + Add
              </Button>
            </div>
          </div>
        </div>
      </SectionCard>

      <WizardFooter
        onPrev={() => router.push("/organizer/create-trip/Itinerary")}
        onDraft={() => console.log("[v0] Draft exclusions:", selected)}
        onNext={() => router.push("/organizer/create-trip/faqs")} 
        prevLabel="‹ Previous"
      />
    </OrganizerShell>
    </div>
    </div>
  )
}
