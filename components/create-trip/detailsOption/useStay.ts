"use client";

import { useState } from "react";
import {
  useCreateTripStayMutation,
  useUpdateTripStayMutation,
  useDeleteTripStayMutation,
  useLazyGetTripStayByIdQuery,
} from "@/lib/services/organizer/trip/itinerary/day-details/stay";
import { mapStayToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

export function useStay({ organizationId, tripPublicId, dayDetailId }: any) {
  const [editingStay, setEditingStay] = useState<any>(null);
  const [initialStayData, setInitialStayData] = useState<any>(null);

  const [getStayById] = useLazyGetTripStayByIdQuery();
  const [createStay] = useCreateTripStayMutation();
  const [updateStay] = useUpdateTripStayMutation();
  const [deleteStay] = useDeleteTripStayMutation();

  /* EDIT */
const handleStayEdit = async (itemId: number) => {
  const res = await getStayById({
    organizationId,
    tripPublicId,
    dayDetailId,
    itemId: String(itemId),
  }).unwrap();

  const data = (res as any)?.data || res;

  const mapped = {
    id: itemId,

    // CORRECT FIELDS FROM API
    name: data.name || "",
    location: data.location || "",

    checkInTime: data.checkInTime?.slice(0, 5) || "",
    checkOutTime: data.checkOutTime?.slice(0, 5) || "",

    description: data.description || "",
    packingSuggestion: data.packingSuggestion || "",
    sharingType: data.sharingType || "",

    documents: data.documents || [],
  };

  setEditingStay({ id: itemId });
  setInitialStayData(mapped);

  return mapped;
};


  /* SAVE */
  const handleStaySave = async (data: any, itemId?: number) => {
    const form = mapStayToFormData(data);

    if (itemId) {
      const res = await updateStay({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
        data: form,
      }).unwrap();

      return (res as any)?.data || res;
    }

    const res = await createStay({
      organizationId,
      tripPublicId,
      dayDetailId,
      data: form,
    }).unwrap();

    return (res as any)?.data || res;
  };

  const handleStayDelete = async (id: number) => {
    await deleteStay({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(id),
    }).unwrap();

    return { id };
  };

  return {
    editingStay,
    initialStayData,
    handleStayEdit,
    handleStaySave,
    handleStayDelete,
  };
}
