"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";

export function AddStayForm({ mode = "library", onCancel, onSave }) {
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

  return (
    <div className="flex flex-col gap-6">
      {/* Top-right button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="text-orange-500 border-orange-500 hover:bg-orange-50"
          onClick={() => setLibraryOpen(true)} // 🟠 open modal
        >
          Choose from Library
        </Button>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          maxLength={70}
        />
        <p className="text-xs text-right text-gray-400 mt-1">
          {title.length}/70 Characters
        </p>
      </div>

      {/* Sharing type */}
      <div>
        <select
          value={sharingType}
          onChange={(e) => setSharingType(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm text-gray-700"
        >
          <option value="">Type of Sharing</option>
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
      <Input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter here"
          rows={5}
          maxLength={800}
        />
        <p className="text-xs text-right text-gray-400 mt-1">
          {description.length}/800 Words
        </p>
      </div>

      {/* Packing Suggestions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Packing Suggestions
        </label>
        <Textarea
          value={packing}
          onChange={(e) => setPacking(e.target.value)}
          placeholder="Enter here"
          rows={5}
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

      {/* Footer */}
      <div className="flex justify-end items-center gap-4 mt-6">
        <Button variant="outline" className="rounded-full px-6" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="rounded-full px-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white"
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
