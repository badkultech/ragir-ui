"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import MDEditor from "@uiw/react-md-editor";
import RichTextEditor from "../editor/RichTextEditor";

type AddTransitFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any) => void;
};

const VEHICLES = [
  "Traveler Van",
  "Car",
  "Motorbike",
  "Cruise",
  "Airplane",
  "Train",
  "Bus",
];

export function AddTransitForm({
  mode = "library",
  onCancel,
  onSave,
}: AddTransitFormProps) {
  const [title, setTitle] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [vehicle, setVehicle] = useState<string[]>([]);
  const [otherVehicle, setOtherVehicle] = useState("");
  const [arrangement, setArrangement] = useState<"organizer" | "traveler">(
    "organizer"
  );
  const [description, setDescription] = useState("");
  const [packing, setPacking] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);

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

  const isTripMode = mode==="trip";

  return (
    <div className="flex flex-col gap-6" style={{fontFamily: "var(--font-poppins)"}}>
      {/* Top-right button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="text-orange-500 border-orange-500 hover:bg-orange-50"
          onClick={() => setLibraryOpen(true)}
        >
          Choose from Library
        </Button>
      </div>

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
              key={v}
              onClick={() => toggleVehicle(v)}
              className={`px-4 py-2 rounded-lg border text-sm ${
                vehicle.includes(v)
                  ? "bg-orange-500 text-white border-orange-500"
                  : "border-gray-300 hover:border-orange-400"
              }`}
            >
              {v}
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
              checked={arrangement === "organizer"}
              onChange={() => setArrangement("organizer")}
            />
            Arranged by the organizer
          </label>
          <label className="flex items-center gap-2 text-[0.85rem]">
            <input
              type="radio"
              checked={arrangement === "traveler"}
              onChange={() => setArrangement("traveler")}
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

      { isTripMode &&  <div className="flex flex-col items-end gap-2">
          <div className="flex justify-end items-center gap-2">
        <Input type="checkbox" value="" className=" w-[22px]" />
          <label className="block text-[0.95rem] font-medium">
          Save in Library
        </label>
          </div>
          
        <Input type="text" value="" id="" placeholder="Save As" className="p-4 w-[12rem] right" />
        </div>  }

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
      <LibrarySelectModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={handleLibrarySelect}
        category="transit"
      />
    </div>
  );
}
