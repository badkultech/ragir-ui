"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import RichTextEditor from "../editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import { useToast } from "../ui/use-toast";

type AddStayFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any) => void;
  header?: string;
  initialData?: any; // ✅ NEW for edit prefill
};

export function AddStayForm({
  mode = "trip",
  onCancel,
  onSave,
  header,
  initialData,
}: AddStayFormProps) {
  const [title, setTitle] = useState("");
  const [sharingType, setSharingType] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [packing, setPacking] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const [saveAsName, setSaveAsName] = useState('');
  const isTripMode = mode === "trip";

  // ✅ Prefill form when editing existing stay
  useEffect(() => {
    if (!initialData) return;

    console.log("Prefilling stay form with:", initialData);

    setTitle(initialData.title || initialData.name || "");
    setSharingType(initialData.sharingType || "");
    setCheckIn(initialData.checkIn || "");
    setCheckOut(initialData.checkOut || "");
    setLocation(initialData.location || "");
    setDescription(initialData.description || "");
    setPacking(initialData.packingSuggestion || "");
  }, [initialData]);

  // ✅ Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  // ✅ Handle "Choose from Library"
  const handleLibrarySelect = (item: any) => {
    setTitle(item.title || "");
    setLocation(item.location || "");
    setDescription(item.description || "");
  };


const validateForm = () => {
  const newErrors: { [key: string]: string } = {};

  if (!title.trim()) newErrors.title = "Title is required";
  if (!sharingType.trim()) newErrors.sharingType = "Sharing Type is required";
  if (!checkIn.trim()) newErrors.checkIn = "Check In Time is required";
  if (!checkOut.trim()) newErrors.checkOut = "Check Out Time is required";
  if (!description.trim()) newErrors.description = "Description is required";
  if (!location.trim()) newErrors.location = "Location is required";

  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // ✅ Submit data to parent
  const handleSubmit = async () => {

    const isValid = validateForm();
  if (!isValid) return;
  
  try{
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
     toast({ title: "Success", description: "Stay saved successfully!" });
  }
  catch{
    toast({ title: "Error", description: "Failed to save Stay", variant: "destructive" });
  }
  };

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "var(--font-poppins)" }}>
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        {header && (
          <div className="text-lg font-semibold text-gray-800 pb-2">
            {header}
          </div>
        )}
      </div>

      {/* Top-right button */}
      {isTripMode ? (
        <ChooseFromLibraryButton onClick={() => setLibraryOpen(true)} />
      ) : (
        <div className="mt-2" />
      )}

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
         {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        <p className="text-xs text-right text-orange-500 mt-1">
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
          <option value="SINGLE">Single Occupancy</option>
          <option value="DOUBLE">Double Occupancy</option>
          <option value="TRIPLE">Triple Occupancy</option>
        </select>
         {errors.sharingType && <p className="text-xs text-red-500 mt-1">{errors.sharingType}</p>}
      </div>

      {/* Check-in / Check-out + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Time *
          </label>
          <Input
            type="time"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
           {errors.checkIn && <p className="text-xs text-red-500 mt-1">{errors.checkIn}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out Time *
          </label>
          <Input
            type="time"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
          {errors.checkOut && <p className="text-xs text-red-500 mt-1">{errors.checkOut}</p>}
        </div>
      </div>

      <Input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
      />
      {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <RichTextEditor
          placeholder="Enter description"
          value={description}
          onChange={setDescription}
        />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
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
      <div className="flex justify-end items-center gap-4 mt-6">
        <Button variant="outline" className="rounded-full px-6" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="rounded-full px-6 bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FE336A] text-white"
        >
          Save
        </Button>
      </div>

      {/* Library Modal */}
      {isTripMode && (
        <LibrarySelectModal
          open={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          onSelect={handleLibrarySelect}
          category="stays"
        />
      )}
    </div>
  );
}
