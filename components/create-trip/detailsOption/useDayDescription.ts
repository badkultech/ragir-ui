"use client";

import { useState } from "react";
import {
  useCreateTripDayDescriptionMutation,
  useUpdateTripDayDescriptionMutation,
  useDeleteTripDayDescriptionMutation,
  useLazyGetTripDayDescriptionByIdQuery
} from "@/lib/services/organizer/trip/itinerary/day-details/day-description";

import { mapDayDescriptionToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

export function useDayDescription({ organizationId, tripPublicId, dayDetailId }: any) {
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [initialData, setInitialData] = useState<any | null>(null);

  const [getDayDescById] = useLazyGetTripDayDescriptionByIdQuery();
  const [createDesc] = useCreateTripDayDescriptionMutation();
  const [updateDesc] = useUpdateTripDayDescriptionMutation();
  const [deleteDesc] = useDeleteTripDayDescriptionMutation();

  // ------- EDIT (WITH GET API) -------
  const handleEdit = async (item: any) => {
    const itemId = item.id || item.tripItemId;
    if (!itemId) {
      console.error("❌ Edit failed: No valid ID", item);
      return;
    }

    const res = await getDayDescById({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(itemId)
    }).unwrap();

    const data = (res as any)?.data ?? res;

    const mapped = {
  id: itemId,
  name: data.name || "",
  description: data.description || "",
  location: data.location || "",
  packingSuggestion: data.packingSuggestion || "",
  time:
    typeof data.time === "string"
      ? data.time.slice(0, 5)
      : data.time?.hour !== undefined
      ? `${String(data.time.hour).padStart(2, "0")}:${String(
          data.time.minute
        ).padStart(2, "0")}`
      : "",
  documents: data.documents || []
};


    setEditingItem({ id: itemId });
    setInitialData(mapped);

    return mapped;
  };

  // ------- SAVE -------
  const handleSave = async (data: any, itemId?: number) => {
    const form = mapDayDescriptionToFormData(data, data.documents || []);

    if (itemId) {
      const res = await updateDesc({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
        data: form
      }).unwrap();

      return (res as any)?.data ?? res;
    }

    const res = await createDesc({
      organizationId,
      tripPublicId,
      dayDetailId,
      data: form
    }).unwrap();

    return (res as any)?.data ?? res;
  };

  // ------- DELETE -------
  const handleDelete = async (itemId: number) => {
    await deleteDesc({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(itemId)
    }).unwrap();

    return { id: itemId };
  };

  return {
    editingItem,
    initialData,
    handleEdit,
    handleSave,
    handleDelete
  };
}
