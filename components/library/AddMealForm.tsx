"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import MDEditor from "@uiw/react-md-editor";
import RichTextEditor from "../editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";

type AddMealFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any) => void;
  header?: string;
};

export function AddMealForm({ mode = "library", onCancel, onSave, header }: AddMealFormProps) {
  const [title, setTitle] = useState("");
  const [mealType, setMealType] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [included, setIncluded] = useState<"included" | "chargeable">("included");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [packing, setPacking] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handleLibrarySelect = (item: any) => {
    setTitle(item.title || "");
    setLocation(item.location || "");
    setDescription(item.description || "");
  };

  const handleSubmit = () => {
    onSave({
      title,
      mealType,
      mealTime,
      included,
      location,
      description,
      packing,
      images,
      mode,
    });
  };

  const isTripMode = mode === 'trip';

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
        <label className="block text-[0.95rem] font-medium  mb-2">
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

      {/* Meal Type & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[0.95rem] font-medium  mb-2">
            Meal Type *
          </label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm text-gray-700"
          >
            <option value="">Select</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="snack">Snack</option>
            <option value="dinner">Dinner</option>
          </select>
          <label className="flex items-center gap-2 my-4">
            <input
              type="radio"
              checked={included === "included"}
              onChange={() => setIncluded("included")}
            />
            Included
          </label>
        </div>
        <div>
          <label className="block text-[0.95rem] font-medium  mb-2">
            Time
          </label>
          <Input
            type="time"
            value={mealTime}
            onChange={(e) => setMealTime(e.target.value)}
          />

          <label className="flex items-center gap-2 my-4">
            <input
              type="radio"
              checked={included === "chargeable"}
              onChange={() => setIncluded("chargeable")
              }
            />
            Chargeable
          </label>
        </div>
      </div>

      {/* Included / Chargeable */}

      {/* Location */}
      <div>

        <label className="block text-[0.95rem] font-medium mb-1">
          Location
        </label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <RichTextEditor
          placeholder="enter text"
          value={description}
          onChange={setDescription}
        />
      </div>

      {/* Packing Suggestions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Packing Suggestions
        </label>
        <RichTextEditor
          value={packing}
          onChange={setPacking}
          placeholder="Enter here"
          maxLength={800}
        />
        <p className="text-xs text-right text-gray-400 mt-1">
          {packing.length}/800 Words
        </p>
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
          <p className="text-sm text-gray-500 mt-2">
            {images.length} file(s) selected
          </p>
        )}
      </div>

      {isTripMode && <div className="flex flex-col items-end gap-2">
        <div className="flex justify-end items-center gap-2">
          <Input type="checkbox" value="" className=" w-[22px]" />
          <label className="block text-[0.95rem] font-medium">
            Save in Library
          </label>
        </div>

        <Input type="text" value="" id="" placeholder="Save As" className="p-4 w-[12rem] right" />
      </div>}

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

      {/* Choose from Library Modal */}
      <LibrarySelectModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={handleLibrarySelect}
        category="meals"
      />
    </div>
  );
}
