"use client";

import { useState } from "react";
import {
  useCreateTripMealMutation,
  useUpdateTripMealMutation,
  useDeleteTripMealMutation,
  useLazyGetTripMealByIdQuery,
} from "@/lib/services/organizer/trip/itinerary/day-details/meal";
import { mapMealToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

export function useMeal({ organizationId, tripPublicId, dayDetailId }: any) {
  const [editingMeal, setEditingMeal] = useState<any>(null);
  const [initialMealData, setInitialMealData] = useState<any>(null);

  const [getMealById] = useLazyGetTripMealByIdQuery();
  const [createMeal] = useCreateTripMealMutation();
  const [updateMeal] = useUpdateTripMealMutation();
  const [deleteMeal] = useDeleteTripMealMutation();

  /* EDIT */
  const handleMealEdit = async (itemId: number) => {
    const res = await getMealById({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(itemId),
    }).unwrap();

    const data = (res as any)?.data || res;

    const mapped = {
      id: itemId,
      name: data.name || "",
      type: data.type || "",
      description: data.description || "",
      documents: data.documents || [],
    };

    setEditingMeal({ id: itemId });
    setInitialMealData(mapped);
    return mapped;
  };

  /* SAVE */
  const handleMealSave = async (data: any, itemId?: number) => {
    const form = mapMealToFormData(data);

    if (itemId) {
      const res = await updateMeal({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
        data: form,
      }).unwrap();

      return (res as any)?.data || res;
    }

    const res = await createMeal({
      organizationId,
      tripPublicId,
      dayDetailId,
      data: form,
    }).unwrap();

    return (res as any)?.data || res;
  };

  /* DELETE */
  const handleMealDelete = async (id: number) => {
    await deleteMeal({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(id),
    }).unwrap();

    return { id };
  };

  return {
    editingMeal,
    initialMealData,
    handleMealEdit,
    handleMealSave,
    handleMealDelete,
  };
}
