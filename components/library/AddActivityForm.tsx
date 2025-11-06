"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import { useToast } from "@/components/ui/use-toast";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import Select, { MultiValue } from "react-select";

type AddActivityFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any) => void;
  header?: string;
  initialData?: any; // ✅ for edit mode
};

type OptionType = { value: string; label: string };

export function AddActivityForm({
  mode = "trip",
  onCancel,
  onSave,
  header,
  initialData,
}: AddActivityFormProps) {
  const [title, setTitle] = useState("");
  const [priceType, setPriceType] = useState<"INCLUDED" | "CHARGEABLE">(
    "INCLUDED"
  );
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [packing, setPacking] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  const moodOptions = [
    { value: "ADVENTURE", label: "Adventure" },
    { value: "RELAXING", label: "Relaxing" },
    { value: "CULTURAL", label: "Cultural" },
    { value: "FAMILY", label: "Family" },
  ];
  const [moodTags, setMoodTags] = useState<readonly OptionType[]>([
    { value: "ADVENTURE", label: "Adventure" }, // ✅ default selected
  ]);

  const isTripMode = mode === "trip";

  // ✅ Prefill when editing
  useEffect(() => {
    if (!initialData) return;

    console.log("Prefilling activity form with:", initialData);

    setTitle(initialData.title || initialData.name || "");
    setMoodTags(initialData.moodTags || []);
    setPriceType(initialData.chargeable ? "CHARGEABLE" : "INCLUDED");
    setLocation(initialData.location || "");
    setTime(initialData.time || "");
    setDescription(initialData.description || "");
    setPacking(initialData.packingSuggestion || "");
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handleLibrarySelect = (item: any) => {
    setTitle(item.title || "");
    setLocation(item.location || "");
    setDescription(item.description || "");
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!moodTags) newErrors.moodTags = "Mood Tags are required";
    if (!priceType.trim()) newErrors.priceType = "Price Type is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Run validation
    const isValid = validateForm();
    if (!isValid) return;

    //  Trigger save
    try {
      await onSave({
        title,
        moodTags,
        priceType,
        location,
        time,
        description,
        packing,
        images,
        mode,
      });
      showSuccess("Activity saved successfully!");
    } catch {
      showApiError("Failed to save Activity");
    }
  };

  return (
    <div
      className="flex flex-col gap-6"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* Header */}
      {header && (
        <div className="text-lg font-semibold text-gray-800 pb-2">{header}</div>
      )}

      {/* Choose from Library */}
      {isTripMode ? (
        <ChooseFromLibraryButton onClick={() => setLibraryOpen(true)} />
      ) : (
        <div className="mt-2" />
      )}

      {/* Title */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">Title *</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          maxLength={70}
        />
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">{errors.title}</p>
        )}
        <p className="text-xs text-right text-orange-500 mt-1">
          {title.length}/70 Characters
        </p>
      </div>

      {/* Mood Tags */}
      <div>
        <div>
          <label className="block text-[0.95rem] font-medium mb-2">
            Mood Tags *
          </label>

          <Select
            options={moodOptions}
            value={moodTags}
            onChange={(selected) => setMoodTags(selected)}
            isMulti
            className="text-[0.95rem]"
          />
        </div>
        {errors.moodTags && (
          <p className="text-xs text-red-500 mt-1">{errors.moodTags}</p>
        )}
      </div>

      {/* Price Type */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Price Charge *
        </label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-[0.95rem]">
            <input
              type="radio"
              checked={priceType === "INCLUDED"}
              onChange={() => setPriceType("INCLUDED")}
            />
            Included
          </label>
          <label className="flex items-center gap-2 text-[0.85rem]">
            <input
              type="radio"
              checked={priceType === "CHARGEABLE"}
              onChange={() => setPriceType("CHARGEABLE")}
            />
            Chargeable
          </label>
        </div>
        {errors.priceType && (
          <p className="text-xs text-red-500 mt-1">{errors.priceType}</p>
        )}
      </div>

      {/* Location + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[0.95rem] font-medium mb-2">
            Location
          </label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
          {errors.location && (
            <p className="text-xs text-red-500 mt-1">{errors.location}</p>
          )}
        </div>
        <div>
          <label className="block text-[0.95rem] font-medium mb-2">Time</label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">
          Description
        </label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Enter here"
          maxLength={800}
        />
      </div>

      {/* Packing */}
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
          <p className="text-sm text-gray-500 mt-2">
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
          onClick={() => handleSubmit()}
          className="rounded-full px-6 bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FE336A] hover:bg-gradient-to-t text-white"
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
          category="activities"
        />
      )}
    </div>
  );
}
