"use client"

import { useState, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload } from "lucide-react"

export type AddTransitData = {
  title: string
  fromLocation: string
  toLocation: string
  fromTime: string
  toTime: string
  vehicleType: string[]
  otherVehicle: string
  arrangedBy: "organizer" | "traveler"
  description: string
  packingSuggestions: string
  images: File[]
  saveToLibrary: boolean
}

type Props = {
  onCancel?: () => void
  onSave?: (data: AddTransitData) => void
  initial?: Partial<AddTransitData>
  maxImages?: number
}

const VEHICLE_OPTIONS = ["Traveler Van", "Car", "MotorBike", "Cruise", "Airplane", "Train", "Bus"]

export function AddTransitForm({ onCancel, onSave, initial, maxImages = 6 }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [fromLocation, setFromLocation] = useState(initial?.fromLocation ?? "")
  const [toLocation, setToLocation] = useState(initial?.toLocation ?? "")
  const [fromTime, setFromTime] = useState(initial?.fromTime ?? "")
  const [toTime, setToTime] = useState(initial?.toTime ?? "")
  const [vehicleType, setVehicleType] = useState<string[]>(initial?.vehicleType ?? [])
  const [otherVehicle, setOtherVehicle] = useState(initial?.otherVehicle ?? "")
  const [arrangedBy, setArrangedBy] = useState<"organizer" | "traveler">(initial?.arrangedBy ?? "organizer")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [packing, setPacking] = useState(initial?.packingSuggestions ?? "")
  const [images, setImages] = useState<File[]>(initial?.images ?? [])
  const [saveLibrary, setSaveLibrary] = useState<boolean>(initial?.saveToLibrary ?? false)

  const handleVehicleToggle = (vehicle: string) => {
    setVehicleType((prev) => (prev.includes(vehicle) ? prev.filter((v) => v !== vehicle) : [...prev, vehicle]))
  }

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (!files.length) return
    const combined = [...images, ...files].slice(0, maxImages)
    setImages(combined)
    e.currentTarget.value = ""
  }

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSave = () => {
    onSave?.({
      title,
      fromLocation,
      toLocation,
      fromTime,
      toTime,
      vehicleType,
      otherVehicle,
      arrangedBy,
      description,
      packingSuggestions: packing,
      images,
      saveToLibrary: saveLibrary,
    })
  }

  return (
    <div className="rounded-2xl border bg-background p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Add Transit</h3>
        <Button variant="outline" size="sm" className="rounded-full bg-transparent">
          Choose from Library
        </Button>
      </div>

      <div className="mt-4 grid gap-4">
        {/* Title */}
        <div className="grid gap-1.5">
          <Label htmlFor="transit-title">Title *</Label>
          <div className="relative">
            <Input
              id="transit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={70}
              placeholder="Enter title"
              className="pr-20"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
              {title.length}/70
            </span>
          </div>
        </div>

        {/* Transit Route */}
        <div className="grid gap-1.5">
          <Label>Transit Route *</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="from-location" className="text-xs text-muted-foreground">
                From (Starting Point)
              </Label>
              <Input
                id="from-location"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                placeholder="From location"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="to-location" className="text-xs text-muted-foreground">
                To (Destination Point)
              </Label>
              <Input
                id="to-location"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                placeholder="To location"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="from-time" className="text-xs text-muted-foreground">
                From Time
              </Label>
              <Input id="from-time" type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="to-time" className="text-xs text-muted-foreground">
                To Time
              </Label>
              <Input id="to-time" type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="grid gap-1.5">
          <Label>Vehicle *</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {VEHICLE_OPTIONS.map((vehicle) => (
              <div key={vehicle} className="flex items-center gap-2">
                <Checkbox
                  id={`vehicle-${vehicle}`}
                  checked={vehicleType.includes(vehicle)}
                  onCheckedChange={() => handleVehicleToggle(vehicle)}
                />
                <Label htmlFor={`vehicle-${vehicle}`} className="text-sm cursor-pointer">
                  {vehicle}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Other Vehicle */}
        <div className="grid gap-1.5">
          <Label htmlFor="other-vehicle">Other (Specify)</Label>
          <Input
            id="other-vehicle"
            value={otherVehicle}
            onChange={(e) => setOtherVehicle(e.target.value)}
            placeholder="Specify other vehicle type"
          />
        </div>

        {/* Arranged By */}
        <div className="grid gap-1.5">
          <Label>Arranged By</Label>
          <RadioGroup value={arrangedBy} onValueChange={(v) => setArrangedBy(v as "organizer" | "traveler")}>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="organizer" id="arranged-organizer" />
              <Label htmlFor="arranged-organizer" className="text-sm cursor-pointer">
                Arranged by the organizer
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="traveler" id="arranged-traveler" />
              <Label htmlFor="arranged-traveler" className="text-sm cursor-pointer">
                Self arranged by the traveler
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Description */}
        <div className="grid gap-1.5">
          <Label htmlFor="transit-desc">Description</Label>
          <div className="relative">
            <Textarea
              id="transit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={800}
              placeholder="Enter here"
              className="pr-20"
            />
            <span className="pointer-events-none absolute bottom-2 right-3 text-xs text-muted-foreground">
              {description.length}/800
            </span>
          </div>
        </div>

        {/* Packing Suggestions */}
        <div className="grid gap-1.5">
          <Label htmlFor="transit-packing">Packing Suggestions</Label>
          <div className="relative">
            <Textarea
              id="transit-packing"
              value={packing}
              onChange={(e) => setPacking(e.target.value)}
              rows={3}
              maxLength={800}
              placeholder="Enter here"
              className="pr-20"
            />
            <span className="pointer-events-none absolute bottom-2 right-3 text-xs text-muted-foreground">
              {packing.length}/800
            </span>
          </div>
        </div>

        {/* Images */}
        <div>
          <Label htmlFor="transit-images">Images (Max {maxImages})</Label>
          <div className="mt-2 rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <Input
                id="transit-images"
                type="file"
                accept="image/png,image/jpeg"
                multiple
                onChange={handleFiles}
                disabled={images.length >= maxImages}
                className="hidden"
              />
              <Label
                htmlFor="transit-images"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
              >
                <Upload className="size-4" />
                Upload Images
              </Label>
              <span className="text-xs text-muted-foreground">PNG, JPG up to 10MB</span>
            </div>

            {/* Previews */}
            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((file, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={`Preview ${idx + 1}`}
                      className="h-16 w-16 rounded-lg border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      aria-label="Remove image"
                      className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border bg-background text-xs text-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Save to Library */}
        <div className="flex items-center gap-2">
          <Checkbox id="transit-save" checked={saveLibrary} onCheckedChange={(v) => setSaveLibrary(Boolean(v))} />
          <Label htmlFor="transit-save" className="text-sm text-muted-foreground">
            Save in Library
          </Label>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" className="rounded-full bg-transparent" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="rounded-full" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
