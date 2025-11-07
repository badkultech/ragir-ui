"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import { useToast } from "@/components/ui/use-toast";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import Select from "react-select";

/** ---------- Types ---------- */
type AddActivityFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any) => void;
  header?: string;
  initialData?: any; // accepts moodTags as string[] or {value,label}[]; images under images/documents/photos/assets
};

type OptionType = { value: string; label: string };

type ExistingImage = {
  id?: string;
  url: string;
};

/** ---------- Constants ---------- */
const moodOptions: OptionType[] = [
  { value: "ADVENTURE", label: "Adventure" },
  { value: "RELAXING", label: "Relaxing" },
  { value: "CULTURAL", label: "Cultural" },
  { value: "FAMILY", label: "Family" },
];

/** ---------- Component ---------- */
export function AddActivityForm({
  mode = "trip",
  onCancel,
  onSave,
  header,
  initialData,
}: AddActivityFormProps) {
  const [title, setTitle] = useState("");
  const [priceType, setPriceType] = useState<"INCLUDED" | "CHARGEABLE">("INCLUDED");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [packing, setPacking] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");

  // react-select wants objects; we store OptionType[]
  const [moodTags, setMoodTags] = useState<OptionType[]>([]);

  // Images split
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const isTripMode = mode === "trip";

  /** ---------- Helpers ---------- */
  const normalizeMoodOption = (x: any): OptionType | null => {
    if (!x) return null;
    if (typeof x === "object" && "value" in x && "label" in x) {
      const v = String((x as any).value ?? "").trim();
      const l = String((x as any).label ?? "").trim();
      if (!v || !l) return null;
      return { value: v, label: l };
    }
    const s = String(x || "").trim();
    if (!s) return null;
    const found =
      moodOptions.find((o) => o.value === s) ||
      moodOptions.find((o) => o.label.toLowerCase() === s.toLowerCase());
    if (found) return found;
    return {
      value: s.toUpperCase(),
      label: s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(),
    };
  };

  const normalizeImagesFromInitial = (data: any): ExistingImage[] => {
    const raw = data?.images ?? data?.documents ?? data?.photos ?? data?.assets ?? [];
    return (raw as any[])
      .map((img) => {
        if (!img) return null;
        if (typeof img === "string") return { url: img } as ExistingImage;
        if (img.url) return { id: img.id || img._id, url: img.url } as ExistingImage;
        if (img.path) return { id: img.id || img._id, url: img.path } as ExistingImage;
        if (img.fileUrl) return { id: img.id || img._id, url: img.fileUrl } as ExistingImage;
        return null;
      })
      .filter(Boolean) as ExistingImage[];
  };

  /** ---------- Prefill (edit mode) ---------- */
  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title || initialData.name || "");

    if (Array.isArray(initialData.moodTags)) {
      const opts = initialData.moodTags
        .map(normalizeMoodOption)
        .filter(Boolean) as OptionType[];
      setMoodTags(opts);
    } else {
      setMoodTags([]);
    }

    setPriceType(initialData.chargeable ? "CHARGEABLE" : "INCLUDED");
    setLocation(initialData.location || "");
    setTime(initialData.time || "");
    setDescription(initialData.description || "");
    setPacking(initialData.packingSuggestion || "");

    const normalizedExisting = normalizeImagesFromInitial(initialData);
    setExistingImages(normalizedExisting);
    setNewImages([]);
  }, [initialData]);

  /** ---------- Images: previews + handlers ---------- */
  const newImagePreviews = useMemo(
    () => newImages.map((f) => URL.createObjectURL(f)),
    [newImages]
  );

  useEffect(() => {
    return () => newImagePreviews.forEach((u) => URL.revokeObjectURL(u));
  }, [newImagePreviews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);

    const filtered = incoming.filter(
      (f) =>
        ["image/png", "image/jpeg", "image/webp"].includes(f.type) &&
        f.size <= 10 * 1024 * 1024
    );

    if (filtered.length !== incoming.length) {
      toast({
        title: "Some files skipped",
        description: "Only PNG/JPG/WEBP up to 10MB are allowed.",
        variant: "destructive",
      });
    }

    setNewImages((prev) => [...prev, ...filtered]);
    e.target.value = "";
  };

  const removeExisting = (img: ExistingImage) => {
    setExistingImages((prev) => prev.filter((i) => i.url !== img.url));
  };

  const removeNew = (idx: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  /** ---------- Library select ---------- */
  const handleLibrarySelect = (item: any) => {
    setTitle(item.title || "");
    setLocation(item.location || "");
    setDescription(item.description || "");
    const libImgs = normalizeImagesFromInitial(item);
    if (libImgs.length) {
      setExistingImages(libImgs.slice(0, 6));
      setNewImages([]);
    }
    if (Array.isArray(item.moodTags)) {
      const opts = item.moodTags.map(normalizeMoodOption).filter(Boolean) as OptionType[];
      setMoodTags(opts);
    }
  };

  /** ---------- Validation + Submit ---------- */
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!moodTags || moodTags.length === 0) newErrors.moodTags = "Mood Tags are required";
    if (!priceType?.trim()) newErrors.priceType = "Price Type is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!location.trim()) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // 🔒 Sanitize moods: only non-empty strings
    const moods = moodTags
      .map((t) => (t?.value ?? "").toString().trim())
      .filter((v) => v.length > 0);

    try {
      await onSave({
        title,
        moodTags: moods, // ← clean strings only
        priceType,
        location,
        time,
        description,
        packing,
        imagesToUpload: newImages,
        keepImages: existingImages,
        mode,
      });
      showSuccess("Activity saved successfully!");
    } catch {
      showApiError("Failed to save Activity");
    }
  };

  /** ---------- Render ---------- */
  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "var(--font-poppins)" }}>
      {/* Header */}
      {header && <div className="text-lg font-semibold text-gray-800 pb-2">{header}</div>}

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
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        <p className="text-xs text-right text-orange-500 mt-1">{title.length}/70 Characters</p>
      </div>

      {/* Mood Tags */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">Mood Tags *</label>
        <Select
          options={moodOptions}
          value={moodTags}
          onChange={(selected) =>
            setMoodTags(((selected ?? []) as OptionType[]).filter((o) => !!o?.value?.trim()))
          }
          isMulti
          className="text-[0.95rem]"
          classNamePrefix="react-select"
          styles={{
            multiValue: (base) => ({
              ...base,
              backgroundColor: "transparent",
              border: "1px solid #fb923c",
              borderRadius: "9999px",
              padding: "2px 8px",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "#fb923c",
              fontSize: "14px",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "#fb923c",
              ":hover": { backgroundColor: "transparent", color: "#f97316" },
            }),
          }}
        />
        {errors.moodTags && <p className="text-xs text-red-500 mt-1">{errors.moodTags}</p>}
      </div>

      {/* Price Type */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">Price Charge *</label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-[0.95rem]">
            <input
              type="radio"
              name="priceType"
              checked={priceType === "INCLUDED"}
              onChange={() => setPriceType("INCLUDED")}
            />
            Included
          </label>
          <label className="flex items-center gap-2 text-[0.85rem]">
            <input
              type="radio"
              name="priceType"
              checked={priceType === "CHARGEABLE"}
              onChange={() => setPriceType("CHARGEABLE")}
            />
            Chargeable
          </label>
        </div>
        {errors.priceType && <p className="text-xs text-red-500 mt-1">{errors.priceType}</p>}
      </div>

      {/* Location + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[0.95rem] font-medium mb-2">Location</label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
          {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
        </div>
        <div>
          <label className="block text-[0.95rem] font-medium mb-2">Time</label>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">Description</label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Enter here"
          maxLength={800}
        />
      </div>

      {/* Packing */}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images (Max 6)
        </label>

        {(existingImages.length > 0 || newImages.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {existingImages.map((img, idx) => (
              <div
                key={`ex-${img.id || img.url}-${idx}`}
                className="relative group overflow-hidden rounded-xl border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="Existing" className="w-full h-28 object-cover" />
                <button
                  type="button"
                  onClick={() => removeExisting(img)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {newImages.map((file, idx) => {
              const url = URL.createObjectURL(file);
              return (
                <div
                  key={`new-${idx}`}
                  className="relative group overflow-hidden rounded-xl border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="New upload" className="w-full h-28 object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNew(idx)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-orange-400 transition">
          <Upload className="w-6 h-6 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">Upload Images</span>
          <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {(existingImages.length + newImages.length) > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            {existingImages.length + newImages.length} image(s) selected
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
