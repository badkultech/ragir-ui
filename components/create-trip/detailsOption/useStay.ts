"use client";

import { useState } from "react";
import {
  useCreateTripStayMutation,
  useUpdateTripStayMutation,
  useDeleteTripStayMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/stay";
import { mapStayToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

export function useStay({ organizationId, tripPublicId, dayDetailId }: any) {
  const [editingStay, setEditingStay] = useState<any>(null);
  const [initialStayData, setInitialStayData] = useState<any>(null);

  const [createStay] = useCreateTripStayMutation();
  const [updateStay] = useUpdateTripStayMutation();
  const [deleteStay] = useDeleteTripStayMutation();

  const handleStaySave = async (data: any) => {
    const formData = mapStayToFormData(data);

    try {
      if (editingStay) {
        const res = await updateStay({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(editingStay.id),
          data: formData,
        }).unwrap();

        setEditingStay(null);
        setInitialStayData(null);

        return (res as any)?.data ?? res ?? { ...data, id: editingStay.id };
      } else {
        const res = await createStay({
          organizationId,
          tripPublicId,
          dayDetailId,
          data: formData,
        }).unwrap();

        return (res as any)?.data ?? res ?? {
          ...data,
          id: Math.floor(Math.random() * 100000),
        };
      }
    } catch (err) {
      console.error("Stay save error:", err);
      throw err;
    }
  };

  const handleStayEdit = (item: any) => {
    setEditingStay(item);
    setInitialStayData(item);
  };

  const handleStayDelete = async (id: number) => {
    try {
      await deleteStay({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(id),
      }).unwrap();

      return { id };
    } catch (err) {
      console.error("Stay delete error:", err);
      throw err;
    }
  };

  return {
    editingStay,
    initialStayData,
    setEditingStay,
    setInitialStayData,
    handleStaySave,
    handleStayEdit,
    handleStayDelete,
  };
}
