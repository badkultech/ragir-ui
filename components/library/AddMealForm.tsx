"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import RichTextEditor from "../editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import { useToast } from "../ui/use-toast";
import { showSuccess, showApiError } from "@/lib/utils/toastHelpers";

type AddMealFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any) => void;
  header?: string;
  initialData?: any; // ✅ same as AddTransitForm
};

export function AddMealForm({
  mode = "trip",
  onCancel,
  onSave,
  header,
  initialData,
}: AddMealFormProps) {
  const [title, setTitle] = useState("My Meal");
  const [mealType, setMealType] = useState("LUNCH");
  const [mealTime, setMealTime] = useState("12:00");
  const [included, setIncluded] = useState<"included" | "chargeable">(
    "included"
  );
  const [location, setLocation] = useState("Mumbai, India");
  const [description, setDescription] = useState("");
  const [packing, setPacking] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");

  const isTripMode = mode === "trip";

  // ✅ Prefill form when editing (like AddTransitForm)
  useEffect(() => {
    if (!initialData) return;

    console.log("🚀 Prefilling meal form with:", initialData);

    setTitle(initialData.title || initialData.name || "");
    setMealType(
      typeof initialData.mealType === "string"
        ? initialData.mealType.toUpperCase()
        : "LUNCH"
    );
    setMealTime(initialData.mealTime || "12:00");
    setIncluded(initialData.chargeable ? "chargeable" : "included");
    setLocation(initialData.location || "");
    setDescription(initialData.description || "");
    setPacking(initialData.packingSuggestion || "");
  }, [initialData]);

  // ✅ File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  // ✅ Select from library
  const handleLibrarySelect = (item: any) => {
    setTitle(item.title || "");
    setLocation(item.location || "");
    setDescription(item.description || "");
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!mealTime.trim()) newErrors.title = "Meal Time is required";
    if (!mealType.trim()) newErrors.title = "Meal Type is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Save
  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;

    try {
      await onSave({
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
      showSuccess("Meal saved successfully!");
    } catch {
      showApiError("Failed to save Meal");
    }
  };

  return (
    <div
      className="flex flex-col gap-6"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        {header && (
          <div className="text-lg font-semibold text-gray-800 pb-2">
            {header}
          </div>
        )}
      </div>

      {/* Top-right button (Trip Mode Only) */}
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

      {/* Meal Type & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[0.95rem] font-medium mb-2">
            Meal Type *
          </label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm text-gray-700"
          >
            <option value="">Select</option>
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="SNACK">Snack</option>
            <option value="DINNER">Dinner</option>
          </select>

          <label className="flex items-center gap-2 my-4">
            <input
              type="radio"
              checked={included === "included"}
              onChange={() => setIncluded("included")}
            />
            Included
          </label>
          {errors.mealType && (
            <p className="text-xs text-red-500 mt-1">{errors.mealType}</p>
          )}
        </div>

        <div>
          <label className="block text-[0.95rem] font-medium mb-2">Time</label>
          <Input
            type="time"
            value={mealTime}
            onChange={(e) => setMealTime(e.target.value)}
          />

          <label className="flex items-center gap-2 my-4">
            <input
              type="radio"
              checked={included === "chargeable"}
              onChange={() => setIncluded("chargeable")}
            />
            Chargeable
          </label>
          {errors.mealTime && (
            <p className="text-xs text-red-500 mt-1">{errors.mealTime}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">
          Location
        </label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
        {errors.location && (
          <p className="text-xs text-red-500 mt-1">{errors.location}</p>
        )}
      </div>

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
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Packing Suggestions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Packing Suggestions
        </label>
        <RichTextEditor
          value={packing}
          onChange={setPacking}
          placeholder="Enter packing suggestions"
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
          className="rounded-full px-6 gap-2 bg-[linear-gradient(90deg,#FEA901_0%,#FD6E34_33%,#FE336A_66%,#FD401A_100%)]  hover:opacity-90 text-white"
        >
          Save
        </Button>
      </div>

      {/* Library Modal */}
      {mode === "trip" && (
        <LibrarySelectModal
          open={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          onSelect={handleLibrarySelect}
          category="meals"
        />
      )}
    </div>
  );
}
