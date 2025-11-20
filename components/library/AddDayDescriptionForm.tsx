"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import RichTextEditor from "../editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import { showSuccess, showApiError } from "@/lib/utils/toastHelpers";
import { MultiUploader } from "../common/UploadFieldShortcuts";
import {
  useDocumentsManager,
  Document as DocShape,
} from "@/hooks/useDocumentsManager";
import { useLazyGetDayDescriptionByIdQuery } from "@/lib/services/organizer/trip/library/day-description";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";

type AddDayDescriptionFormProps = {
  mode?: "library" | "trip";
  updateId?: number | null;
  onCancel: () => void;
  onSave: (data: any, documents?: DocShape[]) => void;
  header?: string;
  initialData?: any;
};

export function AddDayDescriptionForm({
  mode = "trip",
  onCancel,
  updateId,
  onSave,
  header,
  initialData,
}: AddDayDescriptionFormProps) {
  const docsManager = useDocumentsManager(initialData?.documents ?? [], 6);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [packing, setPacking] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [getbyid] = useLazyGetDayDescriptionByIdQuery();
    const { userData } = useSelector(selectAuthState);

  

  // ✅ Prefill when editing
  useEffect(() => {
    if (!initialData) return;
    setTitle(initialData.name || initialData.title || "");
    setDescription(initialData.description || "");
    setLocation(initialData.location || "");
    setTime(initialData.time || "");
    setPacking(initialData.packingSuggestion || initialData.packing || "");
  }, [initialData]);
  const handleLibrarySelect = async (item: any) => {
    try {
      const organizationId = userData?.organizationPublicId ?? "";

    const fd = await getbyid({
      organizationId,
      dayDescriptionId: item.id,
    }).unwrap();
    setTitle(fd.name || "");
    setLocation(fd.location || "");
    setDescription(fd.description || "");
    setTime(fd.time || "");
    setPacking(fd.packingSuggestion || "");
    const mappedDocs = (fd.documents ?? []).map((d: any) => ({
        id: d.id ?? null,
        url: d.url ?? null,
        type: d.type ?? "IMAGE",
        file: null,
        markedForDeletion: false,
      }));

      docsManager.setDocuments(mappedDocs);


  } catch (error) {
    console.error("Failed to fetch day description:", error);
  }
    setLibraryOpen(false);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (replace = false) => {
    // Run validation
    const isValid = validateForm();
    if (!isValid) return;

    //  Trigger save
    try {
      await onSave(
        { title, description, location, time, packing,saveInLibrary, mode },
        docsManager.documents
      );

      showSuccess("day description saved successfully!");
      console.log("📸 Uploaded documents:", docsManager.documents);
    } catch {
      showApiError("Failed to save day description");
    }
  };

  const isTripMode = mode === "trip";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between w-full">
        {header && (
          <div className="text-lg font-semibold text-gray-800  pb-2">
            {header}
          </div>
        )}
      </div>
      {isTripMode ? (
        <ChooseFromLibraryButton onClick={() => setLibraryOpen(true)} />
      ) : (
        <div className="mt-2" /> // ✅ Keeps consistent spacing when no button
      )}

      {/* Title */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">Title <span className="text-red-500">*</span></label>
        <div className="relative">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            maxLength={70}
            className="pr-20"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-orange-500">
            {title.length}/70 Characters
          </span>
        </div>
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          maxLength={800}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Location + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time
        </label>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      {/* Packing Suggestions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Packing Suggestions
        </label>
        {/* <Textarea
          value={packing}
          onChange={(e) => setPacking(e.target.value)}
          placeholder='Enter here'
          rows={5}
          maxLength={800}
        /> */}
        <RichTextEditor
          value={packing}
          onChange={setPacking}
          placeholder="Enter here"
          maxLength={800}
        />
      </div>

      {/* Image Upload */}
      {/* Upload area: uses MultiUploader and shares docsManager */}
      <div>
        {/* MultiUploader uses the docsManager so form can read docsManager.documents on submit */}
        <MultiUploader documentsManager={docsManager} label="Images" />

        {/* Show any manager-level error */}
        {docsManager.error && (
          <p className="text-xs text-red-500 mt-2">{docsManager.error}</p>
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
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end items-center gap-4 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit(false)}
          className="rounded-full px-6 bg-[linear-gradient(90deg,#FEA901_0%,#FD6E34_33%,#FE336A_66%,#FD401A_100%)] hover:opacity-90 text-white"
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
          category="day-description"
        />
      )}
    </div>
  );
}
