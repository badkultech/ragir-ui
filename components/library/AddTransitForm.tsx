"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import RichTextEditor from "../editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import { useToast } from "@/components/ui/use-toast";
import { showSuccess, showApiError } from "@/lib/utils/toastHelpers";
import { MultiUploader } from "../common/UploadFieldShortcuts";
import {
  useDocumentsManager,
  Document as DocShape,
} from "@/hooks/useDocumentsManager";

type AddTransitFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any, documents?: DocShape[]) => void;
  header?: string;
  initialData?: any; // ✅ NEW
};

const VEHICLES = [
  { label: "Traveler Van", value: "TRAVELER_VAN" },
  { label: "Car", value: "CAR" },
  { label: "Motorbike", value: "MOTORBIKE" },
  { label: "Cruise", value: "CRUISE" },
  { label: "Airplane", value: "AIRPLANE" },
  { label: "Train", value: "TRAIN" },
  { label: "Bus", value: "BUS" },
];

export function AddTransitForm({
  mode = "trip",
  onCancel,
  onSave,
  header,
  initialData,
}: AddTransitFormProps) {
  const docsManager = useDocumentsManager(initialData?.documents ?? [], 6);
  const [title, setTitle] = useState("Mumbai To Goa Transit");
  const [from, setFrom] = useState("Mumbai");
  const [to, setTo] = useState("Goa");
  const [departure, setDeparture] = useState("13:00");
  const [arrival, setArrival] = useState("15:00");
  const [vehicle, setVehicle] = useState<string[]>(["CAR"]);
  const [otherVehicle, setOtherVehicle] = useState("");
  const [arrangement, setArrangement] = useState<"ORGANIZER" | "SELF">(
    "ORGANIZER"
  );
  const [description, setDescription] = useState("sdfsdf");
  const [packing, setPacking] = useState("sdfdsfds");
  const [images, setImages] = useState<File[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const { toast } = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<
    { id: number; url: string }[]
  >([]);

  useEffect(() => {
    if (!initialData) return;
    setTitle(initialData.name || "");
    setFrom(initialData.fromLocation || "");
    setTo(initialData.toLocation || "");
    setDeparture(initialData.startTime || "");
    setArrival(initialData.endTime || "");
    setDescription(initialData.description || "");
    setPacking(initialData.packagingSuggestion || "");
    setVehicle(initialData.vehicleType ? [initialData.vehicleType] : []);
    setArrangement(
      initialData.arrangedBy?.toUpperCase() === "SELF" ? "SELF" : "ORGANIZER"
    );

    // ✅ Load existing backend images
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

  const toggleVehicle = (v: string) => {
    setVehicle((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };
  // ✅ Remove an image (backend or new)
  const removeImage = (url: string) => {
    const existing = existingImages.find((img) => img.url === url);
    if (existing) {
      setExistingImages((prev) => prev.filter((img) => img.url !== url));
    } else {
      setImages((prev) =>
        prev.filter((_, i) => URL.createObjectURL(prev[i]) !== url)
      );
    }
    setPreviewUrls((prev) => prev.filter((item) => item !== url));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...selectedFiles]);
      const newUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const handleLibrarySelect = (item: any) => {
    setTitle(item.title || "");
    setFrom(item.from || "");
    setTo(item.to || "");
    setDescription(item.description || "");
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!from.trim()) newErrors.title = "Transit Route is required";
    if (!to.trim()) newErrors.title = "Transit Route is required";
    if (!departure.trim()) newErrors.deaparture = "Departure is required";
    if (!arrival.trim()) newErrors.arrival = "Arrival is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!vehicle) newErrors.vechicle = "Vehicle Description is required";
    if (!arrangement.trim())
      newErrors.arrangement = "Arrangement Details are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;

    try {
      onSave(
        {
          title,
          from,
          to,
          departure,
          arrival,
          vehicle: vehicle.length ? vehicle : otherVehicle,
          arrangement,
          description,
          packing,
          mode,
        },
        docsManager.documents
      );
      showSuccess("Transit saved successfully!");
    } catch {
      showApiError("Failed to save Transit");
    }
  };

  const isTripMode = mode === "trip";

  return (
    <div
      className="flex flex-col gap-6"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
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
        <label className="block text-[0.95rem] font-medium  mb-1">
          Title *
        </label>
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

      {/* Transit Route */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">
          Transit Route *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From (Starting Point)"
          />
          <Input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To (Destination Point)"
          />
        </div>
        {errors.from ||
          (errors.to && (
            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
          ))}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Input
            type="time"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className=" "
          />
          <Input
            type="time"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
          />
        </div>
        {errors.arrival ||
          (errors.departure && (
            <p className="text-xs text-red-500 mt-1">{errors.arrival}</p>
          ))}
      </div>

      {/* Vehicle */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Vehicle *
        </label>

        <div className="flex flex-wrap gap-2">
          {VEHICLES.map((v) => (
            <button
              type="button"
              key={v.value}
              onClick={() => toggleVehicle(v.value)}
              className={`px-4 py-2 rounded-lg border text-sm ${
                vehicle.includes(v.value)
                  ? "bg-orange-500 text-white border-orange-500"
                  : "border-gray-300 hover:border-orange-400"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <Input
          value={otherVehicle}
          onChange={(e) => setOtherVehicle(e.target.value)}
          placeholder="Other (Specify)"
          className="mt-2"
        />

        {errors.vechicle && (
          <p className="text-xs text-red-500 mt-1">{errors.vehicle}</p>
        )}
      </div>

      {/* Arrangement */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Arrangement *
        </label>
        <div className="flex items-center justify-between gap-6">
          <label className="flex items-center gap-2 text-[0.85rem]">
            <input
              type="radio"
              checked={arrangement === "ORGANIZER"}
              onChange={() => setArrangement("ORGANIZER")}
            />
            Arranged by the organizer
          </label>
          <label className="flex items-center gap-2 text-[0.85rem]">
            <input
              type="radio"
              checked={arrangement === "SELF"}
              onChange={() => setArrangement("SELF")}
            />
            Self arranged by the traveler
          </label>
        </div>
        {errors.arrangement && (
          <p className="text-xs text-red-500 mt-1">{errors.arrangement}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Description
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

      {/* Packing Suggestions */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
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
      {/* Upload area: uses MultiUploader and shares docsManager */}
      <div>
        {/* MultiUploader uses the docsManager so form can read docsManager.documents on submit */}
        <MultiUploader documentsManager={docsManager} label="Images" />

        {/* Show any manager-level error */}
        {docsManager.error && (
          <p className="text-xs text-red-500 mt-2">{docsManager.error}</p>
        )}
      </div>
      {/* Save in Library (Trip Mode Only) */}

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
          category="transit"
        />
      )}
    </div>
  );
}
