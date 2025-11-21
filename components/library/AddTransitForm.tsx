"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useLazyGetOrganizerTransitByIdQuery } from "@/lib/services/organizer/trip/library/transit";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import RequiredStar from "../common/RequiredStar";
import { validateRequiredFields } from "@/lib/utils/validateRequiredFields";

type AddTransitFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any, documents?: DocShape[]) => void;
  header?: string;
  initialData?: any;
  onLibrarySelect?: (item: any) => void;
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
  const [title, setTitle] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [vehicle, setVehicle] = useState<string[]>([]);
  const [customVehicleType, setCustomVehicleType] = useState("");
  const [arrangement, setArrangement] = useState<"ORGANIZER" | "SELF">(
    "ORGANIZER"
  );
  const [description, setDescription] = useState("");
  const [packingSuggestion, setPackingSuggestion] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const { toast } = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saveInLibrary, setSaveInLibrary] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  const [getTransitByIdTrigger] = useLazyGetOrganizerTransitByIdQuery();
  const { userData } = useSelector(selectAuthState);

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.name ?? initialData.title ?? "");
    setFrom(initialData.fromLocation ?? initialData.from ?? "");
    setTo(initialData.toLocation ?? initialData.to ?? "");

    const normalizeTime = (t: string | null | undefined) =>
      typeof t === "string" && t.length >= 5 ? t.slice(0, 5) : t ?? "";

    setDeparture(
      normalizeTime(initialData.startTime ?? initialData.departure ?? "")
    );
    setArrival(normalizeTime(initialData.endTime ?? initialData.arrival ?? ""));
    setDescription(initialData.description ?? "");
    setPackingSuggestion(initialData.packingSuggestion ?? "");

    // ✅ handle both single and multiple vehicle types
    setVehicle(
      Array.isArray(initialData.vehicleTypes)
        ? initialData.vehicleTypes
        : initialData.vehicleType
          ? [initialData.vehicleType]
          : []
    );

    // ✅ fix: populate custom vehicle type
    setCustomVehicleType(initialData.customVehicleType ?? "");

    setArrangement(
      (initialData.arrangedBy ?? "").toString().toUpperCase() === "SELF"
        ? "SELF"
        : "ORGANIZER"
    );

    setSaveInLibrary(!!initialData.addedToLibrary);
    setSaveAsName(initialData.name ?? initialData.title ?? "");

    // ✅ reset documents
    const mappedDocs = (
      Array.isArray(initialData.documents) ? initialData.documents : []
    ).map((d: any) => ({
      id: d.id ?? null,
      url: d.url ?? d.fileUrl ?? d.path ?? d.s3Url ?? null,
      type: d.type ?? "IMAGE",
      file: null,
      markedForDeletion: !!d.markedForDeletion,
    }));

    if (typeof docsManager.resetDocuments === "function") {
      docsManager.resetDocuments();
    } else if (typeof docsManager.setDocuments === "function") {
      docsManager.setDocuments(mappedDocs);
    } else {
      // @ts-ignore
      docsManager.documents = mappedDocs;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.id, initialData]);

  const toggleVehicle = (v: string) => {
    setVehicle((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const handleLibrarySelect = async (item: any) => {

    if (!item.id) return;

    const organizationId = userData?.organizationPublicId ?? "";

    try {
      const full = await getTransitByIdTrigger({
        organizationId,
        transitId: Number(item.id),
      }).unwrap();

      console.log("FULL TRANSIT FROM DB => ", full);

      // Now full object contains: fromLocation, toLocation, times, vehicles etc.
      setTitle(full.name ?? "");
      setFrom(full.fromLocation ?? "");
      setTo(full.toLocation ?? "");

      setDeparture(full.startTime?.slice(0, 5) ?? "");
      setArrival(full.endTime?.slice(0, 5) ?? "");

      setDescription(full.description ?? "");
      setPackingSuggestion(full.packingSuggestion ?? "");

      setVehicle(
        Array.isArray(full.vehicleTypes)
          ? full.vehicleTypes
          : full.vehicleTypes
            ? [full.vehicleTypes]
            : []
      );
      setCustomVehicleType(full.customVehicleType ?? "");

      setArrangement(
        (full.arrangedBy ?? "").toUpperCase() === "SELF"
          ? "SELF"
          : "ORGANIZER"
      );

      // Documents
      const mappedDocs = (full.documents ?? []).map((d) => ({
        id: d.id ?? null,
        url: d.url ?? null,
        type: d.type ?? "IMAGE",
        file: null,
        markedForDeletion: false,
      }));

      docsManager.setDocuments(mappedDocs);
    } catch (err) {
      console.error("Failed to load full transit", err);
    }
  };


  const handleSubmit = async () => {
    const newErrors = validateRequiredFields([
      { key: "title", label: "Title", value: title },
      { key: "from", label: "Starting point", value: from },
      { key: "to", label: "Destination", value: to },
      { key: "departure", label: "Departure time", value: departure },
      { key: "arrival", label: "Arrival time", value: arrival },
      { key: "description", label: "Description", value: description },
      { key: "customVehicleType", label: "Custom vehicle type", value: customVehicleType },
    ]);

    setErrors(newErrors);

    // if errors exist, stop execution (same behavior as before)
    if (Object.keys(newErrors).length > 0) return;


    try {
      onSave(
        {
          title,
          from,
          to,
          departure,
          arrival,
          vehicle,
          customVehicleType,
          arrangement,
          description,
          packingSuggestion,
          saveInLibrary,
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
      {/* Header */}
      {header && (
        <div className="text-lg font-semibold text-gray-800 pb-2">{header}</div>
      )}

      {/* Choose from library button */}
      {isTripMode ? (
        <ChooseFromLibraryButton onClick={() => setLibraryOpen(true)} />
      ) : (
        <div className="mt-2" />
      )}

      {/* Title */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">Title <RequiredStar /></label>
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

      {/* Route */}
      <div>
        <label
          htmlFor="transit-route"
          className="block text-[0.95rem] font-medium mb-1"
        >
          Transit Route <RequiredStar />
        </label>

        <div
          id="transit-route"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* FROM FIELD */}
          <div>
            <label
              htmlFor="route-from"
              className="sr-only"
            >
              From
            </label>
            <Input
              id="route-from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="From"
              aria-invalid={!!errors.from}
              aria-describedby={errors.from ? "route-from-error" : undefined}
            />

            {errors.from && (
              <p
                id="route-from-error"
                className="text-xs text-red-500 mt-1"
              >
                {errors.from}
              </p>
            )}
          </div>

          {/* TO FIELD */}
          <div>
            <label
              htmlFor="route-to"
              className="sr-only"
            >
              To
            </label>
            <Input
              id="route-to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="To"
              aria-invalid={!!errors.to}
              aria-describedby={errors.to ? "route-to-error" : undefined}
            />

            {errors.to && (
              <p
                id="route-to-error"
                className="text-xs text-red-500 mt-1"
              >
                {errors.to}
              </p>
            )}
          </div>
        </div>
      </div>


      {/* Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

        {/* DEPARTURE TIME */}
        <div>
          <label
            htmlFor="departure-time"
            className="block text-[0.95rem] font-medium mb-1"
          >
            Departure Time <RequiredStar />
          </label>

          <Input
            id="departure-time"
            type="time"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            aria-invalid={!!errors.departure}
            aria-describedby={errors.departure ? "departure-time-error" : undefined}
          />

          {errors.departure && (
            <p
              id="departure-time-error"
              className="text-xs text-red-500 mt-1"
            >
              {errors.departure}
            </p>
          )}
        </div>

        {/* ARRIVAL TIME */}
        <div>
          <label
            htmlFor="arrival-time"
            className="block text-[0.95rem] font-medium mb-1"
          >
            Arrival Time <RequiredStar />
          </label>

          <Input
            id="arrival-time"
            type="time"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            aria-invalid={!!errors.arrival}
            aria-describedby={errors.arrival ? "arrival-time-error" : undefined}
          />

          {errors.arrival && (
            <p
              id="arrival-time-error"
              className="text-xs text-red-500 mt-1"
            >
              {errors.arrival}
            </p>
          )}
        </div>

      </div>

      {/* Vehicle */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Vehicle <RequiredStar />
        </label>
        <div className="flex flex-wrap gap-2">
          {VEHICLES.map((v) => (
            <button
              key={v.value}
              type="button"
              onClick={() => toggleVehicle(v.value)}
              className={`px-4 py-2 rounded-lg border text-sm ${vehicle.includes(v.value)
                ? "bg-orange-500 text-white border-orange-500"
                : "border-gray-300 hover:border-orange-400"
                }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <Input
          value={customVehicleType}
          onChange={(e) => setCustomVehicleType(e.target.value)}
          placeholder="Other (Specify)"
          className="mt-2"
        />
      </div>

      {/* Arrangement */}
      <div>
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
      </div>

      {/* Description */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Description <RequiredStar />
        </label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
        />
      </div>

      {/* Packing Suggestion */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Packing Suggestions
        </label>
        <RichTextEditor
          value={packingSuggestion}
          onChange={setPackingSuggestion}
        />
      </div>

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
      {isTripMode && (
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
