"use client";

import { useState } from "react";
import {
  useCreateTripDayDescriptionMutation,
  useUpdateTripDayDescriptionMutation,
  useDeleteTripDayDescriptionMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/day-description";
import { useCreateDayDescriptionMutation } from "@/lib/services/organizer/trip/library/day-description";
import { mapDayDescriptionToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

export function useDayDescription({
  organizationId,
  tripPublicId,
  dayDetailId,
}: {
  organizationId: string;
  tripPublicId: string;
  dayDetailId: string;
}) {
  const [details, setDetails] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [initialData, setInitialData] = useState<any | null>(null);

  const [createTripDayDescription] = useCreateTripDayDescriptionMutation();
  const [updateTripDayDescription] = useUpdateTripDayDescriptionMutation();
  const [deleteTripDayDescription] = useDeleteTripDayDescriptionMutation();
  const [createLibraryDayDescription] = useCreateDayDescriptionMutation();

  // returns created/updated item so parent can insert into local state
  const handleSave = async (data: any) => {
    if (!data) return null;
    const form = mapDayDescriptionToFormData(data, data.documents);

    try {
      if (editingItem) {
        const res = await updateTripDayDescription({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(editingItem.id),
          data: form,
        }).unwrap();
        // assume API returns updated item in res.data or res
        const updated = (res as any)?.data ?? res ?? { ...data, id: editingItem.id };
        setEditingItem(null);
        setInitialData(null);
        return updated;
      } else {
        const res = await createTripDayDescription({
          organizationId,
          tripPublicId,
          dayDetailId,
          data: form,
        }).unwrap();
        const created = (res as any)?.data ?? res ?? { ...data, id: (res as any)?.id ?? Math.floor(Math.random() * 1000000) };
        // optionally save to library
        if (data.saveInLibrary) {
          try {
            const libForm = mapDayDescriptionToFormData(data, data.documents);
            await createLibraryDayDescription({ organizationId, data: libForm });
          } catch (err) {
            console.warn("Failed saving to library", err);
          }
        }
        return created;
      }
    } catch (err) {
      console.error("Error saving day description", err);
      throw err;
    }
  };

  const handleEdit = async (item: any) => {
    // if you want to fetch single by id you can, but not required — parent already has item details
    setEditingItem(item);
    setInitialData(item);
    return item;
  };

  const handleDelete = async (itemId: number | string) => {
    try {
      const res = await deleteTripDayDescription({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
      }).unwrap();
      return res;
    } catch (err) {
      console.error("Error deleting", err);
      throw err;
    }
  };

  return {
    details,
    editingItem,
    initialData,
    setEditingItem,
    setInitialData,
    handleSave,
    handleEdit,
    handleDelete,
  };
}
