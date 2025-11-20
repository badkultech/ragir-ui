"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import RichTextEditor from "../editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import { showSuccess, showApiError } from "@/lib/utils/toastHelpers";
import { MultiUploader } from "../common/UploadFieldShortcuts";
import {
  useDocumentsManager,
  Document as DocShape,
} from "@/hooks/useDocumentsManager";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { useLazyGetMealByIdQuery } from "@/lib/services/organizer/trip/library/meal";
import { slice } from "lodash";
import { boolean } from "zod";

type AddMealFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any, documents?: DocShape[]) => void;
  header?: string;
  initialData?: any;
};

export function AddMealForm({
  mode = "trip",
  onCancel,
  onSave,
  header,
  initialData,
}: AddMealFormProps) {
  const docsManager = useDocumentsManager(initialData?.documents ?? [], 6);
  const [title, setTitle] = useState("My Meal");
  const [mealType, setMealType] = useState("LUNCH");
  const [time, setTime] = useState("12:00");
  const [included, setIncluded] = useState<"included" | "chargeable">(
    "included"
  );
  const [location, setLocation] = useState("Mumbai, India");
  const [description, setDescription] = useState("");
  const [packing, setPacking] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<
    { id: number; url: string }[]
  >([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
    const { userData } = useSelector(selectAuthState);
    const [usegetbyid] = useLazyGetMealByIdQuery();
  
  const isTripMode = mode === "trip";

  useEffect(() => {
    if (!initialData) return;
    setTitle(initialData.title || initialData.name || "");
    setMealType(
      typeof initialData.mealType === "string"
        ? initialData.mealType.toUpperCase()
        : "LUNCH"
    );
    setTime(initialData.time || "12:00");
    setIncluded(initialData.chargeable ? "chargeable" : "included");
    setLocation(initialData.location || "");
    setDescription(initialData.description || "");
    setPacking(initialData.packingSuggestion || "");

    // ✅ Show existing backend images
    if (initialData.documents && Array.isArray(initialData.documents)) {
      const existing = initialData.documents
        .filter((doc: any) => doc.url)
        .map((doc: any) => ({ id: doc.id, url: doc.url }));
      setExistingImages(existing);
      setPreviewUrls(
        existing.map((img: { id: number; url: string }) => img.url)
      );
    }
  }, [initialData]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...selectedFiles]);
      const newUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };


  const handleLibrarySelect = async (item: any) => {
    const organizationId = userData?.organizationPublicId ?? "";

    try {
      const fd = await usegetbyid({
        organizationId,
        mealId: item.id,
      }).unwrap();
    setTitle(fd.name || "");
    setLocation(fd.location || "");
    setDescription(fd.description || "");
    setMealType(
      typeof fd.mealType === "string"
        ? fd.mealType
        : ""
    );
    setTime(fd.time || "12:00");
    setIncluded(fd.chargeable ? "chargeable" : "included");
    setPacking(fd.packingSuggestion || "");
    const mappedDocs = (fd.documents ?? []).map((d: any) => ({
        id: d.id ?? null,
        url: d.url ?? null,
        type: d.type ?? "IMAGE",
        file: null,
        markedForDeletion: !!d.markedForDeletion,
      }));
      docsManager.setDocuments(mappedDocs);
    } catch (error) {
      showApiError("Failed to load Meal from library");
      console.error("Failed to fetch meal:", error);
    }
    setLibraryOpen(false);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!time.trim()) newErrors.time = "Meal Time is required";
    if (!mealType.trim()) newErrors.mealType = "Meal Type is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!location.trim()) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Save handler
  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;

    try {
      await onSave(
        {
          title,
          mealType,
          time,
          included,
          location,
          description,
          packing,

          deletedImageIds,
          mode,
        },
        docsManager.documents
      );
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

      {/* Top-right button */}
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
        </div>

        <div>
          <label className="block text-[0.95rem] font-medium mb-2">Time</label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <label className="flex items-center gap-2 my-4">
            <input
              type="radio"
              checked={included === "chargeable"}
              onChange={() => setIncluded("chargeable")}
            />
            Chargeable
          </label>
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
        {/* MultiUploader uses the docsManager so form can read docsManager.documents on submit */}
        <MultiUploader documentsManager={docsManager} label="Images" />

        {/* Show any manager-level error */}
        {docsManager.error && (
          <p className="text-xs text-red-500 mt-2">{docsManager.error}</p>
        )}
      </div>

      {/* Save in Library */}
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
