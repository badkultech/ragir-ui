"use client";

import { useState } from "react";
import {
  useCreateTripMealMutation,
  useUpdateTripMealMutation,
  useDeleteTripMealMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/meal";
import { mapMealToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

export function useMeal({ organizationId, tripPublicId, dayDetailId }: any) {
  const [editingMeal, setEditingMeal] = useState<any>(null);
  const [initialMealData, setInitialMealData] = useState<any>(null);

  const [createMeal] = useCreateTripMealMutation();
  const [updateMeal] = useUpdateTripMealMutation();
  const [deleteMeal] = useDeleteTripMealMutation();

  const handleMealSave = async (data: any) => {
    const formData = mapMealToFormData(data);

    try {
      if (editingMeal) {
        const res = await updateMeal({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(editingMeal.id),
          data: formData,
        }).unwrap();

        setEditingMeal(null);
        setInitialMealData(null);

        return (res as any)?.data ?? res ?? { ...data, id: editingMeal.id };
      } else {
        const res = await createMeal({
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
      console.error("Meal save error:", err);
      throw err;
    }
  };

  const handleMealEdit = (item: any) => {
    setEditingMeal(item);
    setInitialMealData(item);
  };

  const handleMealDelete = async (id: number) => {
    try {
      await deleteMeal({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(id),
      }).unwrap();
      return { id };
    } catch (err) {
      console.error("Meal delete error:", err);
      throw err;
    }
  };

  return {
    editingMeal,
    initialMealData,
    setEditingMeal,
    setInitialMealData,
    handleMealSave,
    handleMealEdit,
    handleMealDelete,
  };
}
