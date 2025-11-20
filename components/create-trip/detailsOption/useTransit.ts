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
    const res = await getTransitById({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(itemId)
    }).unwrap();

    const data = (res as any)?.data ?? res;

    const mapped = {
      id: itemId,
      name: data.name || "",
      fromLocation: data.fromLocation,
      toLocation: data.toLocation,
      startTime: data.startTime?.slice(0,5) || "",
      endTime: data.endTime?.slice(0,5) || "",
      vehicleTypes: data.vehicleTypes || [],
      customVehicleType: data.customVehicleType || "",
      arrangedBy: data.arrangedBy || "ORGANIZER",
      description: data.description || "",
      packingSuggestion: data.packingSuggestion || "",
      documents: data.documents || []
    };

    setEditingTransit({ id: itemId });
    setInitialTransitData(mapped);

    return mapped;
  };
const handleTransitSave = async (
  data: any,
  itemId?: number,
  documents: any[] = [],
  saveInLibrary?: boolean
) => {
  try {
    const form = mapTransitToFormData(
      {
        ...data,
        saveInLibrary: data.saveInLibrary ?? false,  
      },
      documents
    );

    let res;

    if (itemId) {
      res = await updateTransit({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
        data: form,
      }).unwrap();

      const updated = res;

      return {
        ...updated,
        id: updated.tripItemId,
        tripItemId: updated.tripItemId || itemId,
        tripType: "TRANSIT",
      };
    }

    res = await createTransit({
      organizationId,
      tripPublicId,
      dayDetailId,
      data: form,
    }).unwrap();

    const created = res;

    return {
      ...created,
      id: created.tripItemId,
      tripItemId: created.tripItemId ,
      tripType: "TRANSIT",
    };
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

