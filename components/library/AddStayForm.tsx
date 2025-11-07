"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import RichTextEditor from "../editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import { useToast } from "../ui/use-toast";
import { showSuccess, showApiError } from "@/lib/utils/toastHelpers";
import Image from "next/image";

type AddStayFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any) => void;
  header?: string;
  initialData?: any;
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
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const isTripMode = mode === "trip";

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title || initialData.name || "");
    setSharingType(initialData.sharingType || "");
    setCheckIn(initialData.check_in_time || "");
    setCheckOut(initialData.check_out_time || "");
    setLocation(initialData.location || "");
    setDescription(initialData.description || "");
    setPacking(initialData.packingSuggestion || "");
  }, [initialData]);

  // ✅ File input with preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...selectedFiles]);
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...urls]);

    }
  };

  // ✅ Remove individual image
  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviewUrls(updatedPreviews);
  };

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

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;

    try {
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
        saveInLibrary,
      });
      showSuccess("Stay saved successfully!");
    } catch {
      showApiError("Failed to save Stay");
    }
  };

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "var(--font-poppins)" }}>
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        {header && <div className="text-lg font-semibold text-gray-800 pb-2">{header}</div>}
      </div>

      {/* Top-right button */}
      {isTripMode ? (
        <ChooseFromLibraryButton onClick={() => setLibraryOpen(true)} />
      ) : (
        <div className="mt-2" />
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <div className="relative">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            maxLength={70}
            className="pr-20" // 👈 space for counter text
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-orange-500">
            {title.length}/70 Characters
          </span>
        </div>
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
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

      {/* Check-in / Check-out */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time *</label>
          <Input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          {errors.checkIn && <p className="text-xs text-red-500 mt-1">{errors.checkIn}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time *</label>
          <Input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          {errors.checkOut && <p className="text-xs text-red-500 mt-1">{errors.checkOut}</p>}
        </div>
      </div>

      {/* Location */}
      <Input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
      />
      {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <RichTextEditor placeholder="Enter description" value={description} onChange={setDescription} />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
      </div>

      {/* Packing Suggestions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Packing Suggestions</label>
        <RichTextEditor
          value={packing}
          onChange={setPacking}
          placeholder="Enter here"
          maxLength={800}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Images (Max 6)</label>
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

        {/* ✅ Show image previews */}
        {previewUrls.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative w-20 h-20 border rounded-lg overflow-hidden">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-[2px]"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Save in Library (Custom Checkbox) */}
      {isTripMode && (
        <div className="flex justify-end items-center gap-2 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={saveInLibrary}
              onChange={(e) => setSaveInLibrary(e.target.checked)}
              className="appearance-none w-5 h-5 border-2 rounded-sm checked:bg-orange-500 checked:border-orange-500 flex items-center justify-center cursor-pointer"
              style={{
                backgroundImage: saveInLibrary
                  ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath d='M6.003 10.803l-2.85-2.849L1.3 9.808l4.703 4.704L14.7 5.815l-1.854-1.854z'/%3E%3C/svg%3E\")"
                  : "none",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
            <span className="text-sm font-medium text-gray-700">Save in Library</span>
          </label>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end items-center gap-4 mt-6">
        <Button variant="outline" className="rounded-full px-6" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="rounded-full px-6 gap-2 bg-[linear-gradient(90deg,#FEA901_0%,#FD6E34_33%,#FE336A_66%,#FD401A_100%)] hover:opacity-90 text-white"
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
