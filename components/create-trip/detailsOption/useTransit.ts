"use client";

import { useState } from "react";
import {
  useLazyGetTransitByIdQuery,
  useCreateTransitMutation,
  useUpdateTransitMutation,
  useDeleteTransitMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/transit";

import { useCreateOrganizerTransitMutation } from "@/lib/services/organizer/trip/library/transit";
import { mapTransitToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

export function useTransit({ organizationId, tripPublicId, dayDetailId }: any) {
  const [editingTransit, setEditingTransit] = useState<any>(null);
  const [initialTransitData, setInitialTransitData] = useState<any>(null);

  const [getTransitById] = useLazyGetTransitByIdQuery();
  const [createTransit] = useCreateTransitMutation();
  const [updateTransit] = useUpdateTransitMutation();
  const [deleteTransit] = useDeleteTransitMutation();

  const [createLibraryTransit] = useCreateOrganizerTransitMutation();

 const handleTransitEdit = async (itemId: string | number) => {
  try {
    const res = await getTransitById({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(itemId),
    }).unwrap();

    const data = (res as any)?.data ?? res;

    setEditingTransit({ id: itemId });

    setInitialTransitData({
      id: itemId,          // <-- MOST IMPORTANT
      name: data.name || "",
      fromLocation: data.fromLocation,
      toLocation: data.toLocation,
      startTime: data.startTime,
      endTime: data.endTime,
      vehicleTypes: data.vehicleTypes,
      customVehicleType: data.customVehicleType,
      arrangedBy: data.arrangedBy,
      description: data.description,
      packingSuggestion: data.packingSuggestion,
      documents: data.documents || [],
    });

  } catch (err) {
    console.error("Transit edit error:", err);
  }
};


  const handleTransitSave = async (data: any) => {
    try {
      const { saveInLibrary, documents, ...pureData } = data;
      const form = mapTransitToFormData(pureData, documents);

      if (editingTransit) {
        const res = await updateTransit({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(editingTransit.id),
          data: form,
        }).unwrap();

        const updated =
          (res as any)?.data ?? res ?? { ...data, id: editingTransit.id };

        setEditingTransit(null);
        setInitialTransitData(null);

        return updated;
      } else {
        const res = await createTransit({
          organizationId,
          tripPublicId,
          dayDetailId,
          data: form,
        }).unwrap();

        const created =
          (res as any)?.data ?? res ?? {
            ...data,
            id: Math.floor(Math.random() * 100000),
          };

        // save to library
        if (saveInLibrary) {
          const libFD = mapTransitToFormData(pureData, documents);
          await createLibraryTransit({ organizationId, data: libFD });
        }

        return created;
      }
    } catch (err) {
      console.error("Transit save error:", err);
      throw err;
    }
  };

  const handleTransitDelete = async (id: number) => {
    try {
      await deleteTransit({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(id),
      }).unwrap();

      return { id };
    } catch (err) {
      console.error("Transit delete error:", err);
      throw err;
    }
  };

  return {
    editingTransit,
    initialTransitData,
    setEditingTransit,
    setInitialTransitData,
    handleTransitSave,
    handleTransitEdit,
    handleTransitDelete,
  };
}
