"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import RichTextEditor from "../editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";

type AddTransitFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any) => void;
  header?: string;
  initialData?: any; // ✅ NEW
};


const VEHICLES = [
  { label: "Traveler Van", value: "TRAVELER_VAN" },
  { label: "Car", value: "CAR" },
  { label: "Motorbike", value: "MOTORBIKE" },
  { label: "Cruise", value: "CRUISE" },
  { label: "Airplane", value: "AIRPLANE" },
  { label: "Train", value: "TRAIN" },
  { label: "Bus", value: "BUS" },
];


export function AddTransitForm({
  mode = "trip",
  onCancel,
  onSave,
  header,
  initialData,
}: AddTransitFormProps) {
  const [title, setTitle] = useState("Mumbai To Goa Transit");
  const [from, setFrom] = useState("Mumbai");
  const [to, setTo] = useState("Goa");
  const [departure, setDeparture] = useState("13:00");
  const [arrival, setArrival] = useState("15:00");
  const [vehicle, setVehicle] = useState<string[]>(["CAR"]);
  const [otherVehicle, setOtherVehicle] = useState("");
  const [arrangement, setArrangement] = useState<"ORGANIZER" | "SELF">(
    "ORGANIZER"
  );
  const [description, setDescription] = useState("sdfsdf");
  const [packing, setPacking] = useState("sdfdsfds");
  const [images, setImages] = useState<File[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const [saveAsName, setSaveAsName] = useState('');


  useEffect(() => {
    if (!initialData) return;

    console.log("🚀 Prefilling transit form with:", initialData);

    setTitle(initialData.name || "");
    setFrom(initialData.fromLocation || "");
    setTo(initialData.toLocation || "");
    setDeparture(initialData.startTime || "");
    setArrival(initialData.endTime || "");
    setDescription(initialData.description || "");
    setPacking(initialData.packagingSuggestion || "");

    // Handle vehicle and arrangement
    setVehicle(initialData.vehicleType ? [initialData.vehicleType] : []);
    setArrangement(
      initialData.arrangedBy?.toUpperCase() === "SELF" ? "SELF" : "ORGANIZER"
    );
  }, [initialData]);

  const toggleVehicle = (v: string) => {
    setVehicle((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handleLibrarySelect = (item: any) => {
    setTitle(item.title || "");
    setFrom(item.from || "");
    setTo(item.to || "");
    setDescription(item.description || "");
  };

  const handleSubmit = () => {
    onSave({
      title,
      from,
      to,
      departure,
      arrival,
      vehicle: vehicle.length ? vehicle : otherVehicle,
      arrangement,
      description,
      packing,
      images,
      mode,
    });
  };

  const isTripMode = mode === "trip";

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "var(--font-poppins)" }}>
      <div className="flex items-center justify-between w-full">
        {header && (
          <div className="text-lg  font-semibold text-gray-800  pb-2">
            {header}
          </div>
        )}
      </div>

      {/* Top-right button */}
      {isTripMode ? (
        <ChooseFromLibraryButton onClick={() => setLibraryOpen(true)} />
      ) : (
        <div className="mt-2" /> // ✅ Keeps consistent spacing when no button
      )}

      {/* Title */}
      <div>
        <label className="block text-[0.95rem] font-medium  mb-1">
          Title *
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          maxLength={70}
        />
        <p className="text-xs text-right text-orange-500 mt-1">
          {title.length}/70 Characters
        </p>
      </div>

      {/* Transit Route */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">
          Transit Route *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From (Starting Point)"
          />
          <Input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To (Destination Point)"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Input
            type="time"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className=" "
          />
          <Input
            type="time"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
          />
        </div>
      </div>

      {/* Vehicle */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Vehicle *
        </label>

        <div className="flex flex-wrap gap-2">
          {VEHICLES.map((v) => (
            <button
              type="button"
              key={v.value}
              onClick={() => toggleVehicle(v.value)}
              className={`px-4 py-2 rounded-lg border text-sm ${vehicle.includes(v.value)
                ? "bg-orange-500 text-white border-orange-500"
                : "border-gray-300 hover:border-orange-400"
                }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <Input
          value={otherVehicle}
          onChange={(e) => setOtherVehicle(e.target.value)}
          placeholder="Other (Specify)"
          className="mt-2"
        />
      </div>


      {/* Arrangement */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Arrangement *
        </label>
        <div className="flex items-center justify-between gap-6">
          <label className="flex items-center gap-2 text-[0.85rem]">
            <input
              type="radio"
              checked={arrangement === "ORGANIZER"}
              onChange={() => setArrangement("ORGANIZER")}
            />
            Arranged by the organizer
          </label>
          <label className="flex items-center gap-2 text-[0.85rem]">
            <input
              type="radio"
              checked={arrangement === "SELF"}
              onChange={() => setArrangement("SELF")}
            />
            Self arranged by the traveler
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Description
        </label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          maxLength={800}
        />

      </div>

      {/* Packing Suggestions */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Packing Suggestions
        </label>
        <RichTextEditor
          value={packing}
          onChange={setPacking}
          placeholder="Enter here"
          maxLength={800}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images (Max 6)
        </label>
        <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-orange-400 transition">
          <Upload className="w-6 h-6 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">Upload Images</span>
          <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
          <input
            type="file"
            accept="image/png,image/jpeg"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {images.length > 0 && (
          <p className="text-sm text-orange-500 mt-2">
            {images.length} file(s) selected
          </p>
        )}
      </div>

      {isTripMode && (
        <div className="flex flex-col items-end gap-2">
          <div className="flex justify-end items-center gap-2">
            <Input
              type="checkbox"
              checked={saveInLibrary}
              onChange={(e) => setSaveInLibrary(e.target.checked)}
              className="w-[22px]"
            />
            <label className="block text-[0.95rem] font-medium">
              Save in Library
            </label>
          </div>

          <Input
            type="text"
            value={saveAsName}
            onChange={(e) => setSaveAsName(e.target.value)}
            placeholder="Save As"
            className="p-4 w-[12rem]"
          />
        </div>
      )}


      {/* Footer */}
      <div className="flex justify-end items-center gap-4 my-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="rounded-full px-6 bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FE336A] hover:bg-gradient-to-t text-white"
        >
          Save
        </Button>
      </div>

      {/* Library Modal */}
      {mode === "trip" &&
        <LibrarySelectModal
          open={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          onSelect={handleLibrarySelect}
          category="transit"
        />
      }
    </div>
  );
}
