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

type AddStayFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any, replace?: boolean) => void;
};

export function AddStayForm({ mode = "library", onCancel, onSave }: AddStayFormProps) {
  const [title, setTitle] = useState("");
  const [sharingType, setSharingType] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [packing, setPacking] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    onSave({
      title,
      sharingType,
      checkIn,
      checkOut,
      location,
      description,
      packing,
      images,
      mode,
    });
  };

  // 🟠 Callback when user picks item from Library
  const handleLibrarySelect = (item: any) => {
    setTitle(item.title || "");
    setLocation(item.location || "");
    setDescription(item.description || "");
  };

  const isTripMode = mode === "trip";

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "var(--font-poppins)" }}>
      {/* Top-right button */}
      {isTripMode ? (
        <ChooseFromLibraryButton onClick={() => setLibraryOpen(true)} />
      ) : (
        <div className="mt-2" /> // ✅ Keeps consistent spacing when no button
      )}

      {/* Title */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">
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

      {/* Sharing type */}
      <div>
        <select
          value={sharingType}
          onChange={(e) => setSharingType(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm text-gray-500"
        >
          <option value="" className="hover:bg-gray-900">Type of Sharing</option>
          <option value="single">Single Occupancy</option>
          <option value="double">Double Occupancy</option>
          <option value="triple">Triple Occupancy</option>
        </select>
      </div>

      {/* Check-in/out + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Time *
          </label>
          <Input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out Time *
          </label>
          <Input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">
          Location *
        </label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />
      </div>


      {/* Description */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">
          Description
        </label>

        <RichTextEditor
          value={description}
          onChange={setPacking}
          placeholder="Enter here"
          maxLength={800}
        />

      </div>

      {/* Packing Suggestions */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">
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
        <Button variant="outline" className="rounded-full px-6" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="rounded-full px-6 bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FE336A] hover:bg-gradient-to-t text-white"
        >
          Save
        </Button>
      </div>

      {/* 🟠 Library Modal (category-specific) */}
      <LibrarySelectModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={handleLibrarySelect}
        category="stays"
      />
    </div>
  );
}
