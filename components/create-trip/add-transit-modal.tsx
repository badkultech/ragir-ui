"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {AddTransitForm, type AddTransitData } from "./add-transit-form"

type Props = {
  open: boolean,
  onClose: () => void,
  onSave?: (data: AddTransitData) => void
}

export function AddTransitModal({ open, onClose, onSave }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = (data: AddTransitData) => {
    setIsLoading(true)
    onSave?.(data)
    setTimeout(() => {
      setIsLoading(false)
      onClose()
    }, 300)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-background rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b bg-background p-4 sm:p-6">
          <h2 className="text-lg font-semibold">Add Transit</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-lg text-muted-foreground hover:text-foreground"
          >
            ×
          </Button>
        </div>

        <div className="p-4 sm:p-6">
          <AddTransitForm onCancel={onClose} onSave={handleSave} />
        </div>
      </div>
    </div>
  )
}
