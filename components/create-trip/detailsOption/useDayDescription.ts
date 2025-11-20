"use client";

import { useState } from "react";
import {
  useCreateTripDayDescriptionMutation,
  useUpdateTripDayDescriptionMutation,
  useDeleteTripDayDescriptionMutation,
  useLazyGetTripDayDescriptionByIdQuery
} from "@/lib/services/organizer/trip/itinerary/day-details/day-description";

import { mapDayDescriptionToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

/* ---------------------- NORMALIZE SERVER DOCS ---------------------- */
function normalizeDocuments(docs: any[]) {
  if (!Array.isArray(docs)) return [];

  return docs
    .filter((d) => d?.url || d?.file)   // ⛔ remove empty docs
    .map((d) => ({
      id: d.id ?? null,
      url: d.url ?? null,
      type: d.type ?? "IMAGE",
      file: d.file ?? null,
      markedForDeletion: false,
    }));
}


/* ------------------------- HOOK --------------------------- */
export function useDayDescription({ organizationId, tripPublicId, dayDetailId }: any) {
  const [initialData, setInitialData] = useState<any | null>(null);

  const [getDayDescById] = useLazyGetTripDayDescriptionByIdQuery();
  const [createDesc] = useCreateTripDayDescriptionMutation();
  const [updateDesc] = useUpdateTripDayDescriptionMutation();
  const [deleteDesc] = useDeleteTripDayDescriptionMutation();

  /* ---------------------- EDIT ---------------------- */
  const handleEdit = async (item: any) => {
    const itemId = item.id || item.tripItemId;

    const res = await getDayDescById({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(itemId),
    }).unwrap();

    const data = res?.data ?? res;

    const mapped = {
      id: itemId,
      name: data.name ?? "",
      description: data.description ?? "",
      location: data.location ?? "",
      packingSuggestion: data.packingSuggestion ?? "",
      time:
        typeof data.time === "string"
          ? data.time.slice(0, 5)
          : data.time?.hour !== undefined
          ? `${String(data.time.hour).padStart(2, "0")}:${String(
              data.time.minute
            ).padStart(2, "0")}`
          : "",
      documents: normalizeDocuments(data.documents ?? []),
    };

    setInitialData(mapped);
    return mapped;
  };

  /* ---------------------- SAVE ---------------------- */
  const handleSave = async (
    data: any,
    itemId?: number,
    documents: any[] = []
  ) => {
    const form = mapDayDescriptionToFormData(
      {
        ...data,
        time: data.time,
      },
      documents
    );

    let res;

    if (itemId) {
      res = await updateDesc({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
        data: form,
      }).unwrap();
    } else {
      res = await createDesc({
        organizationId,
        tripPublicId,
        dayDetailId,
        data: form,
      }).unwrap();
    }

    const raw = res;

    return {
  ...raw,
  tripType: "DAY_DESCRIPTION",
  tripItemId:raw.tripItemId,
  id: raw.tripItemId,
  documents: normalizeDocuments(raw.documents ?? []),
};

  };

  /* ---------------------- DELETE ---------------------- */
  const handleDelete = async (id: number) => {
    await deleteDesc({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(id),
    }).unwrap();

    return { id };
  };

  return {
    initialData,
    handleEdit,
    handleSave,
    handleDelete,
  };
}
