"use client";

import { useEffect, useState } from "react";
import {
  useLazyGetAllTripMealsQuery,
  useCreateTripMealMutation,
  useUpdateTripMealMutation,
  useDeleteTripMealMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/meal";
import { MealItem } from "@/lib/services/organizer/trip/itinerary/day-details/meal/types";
import { mapMealToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

interface UseMealProps {
  organizationId: string;
  tripPublicId: string;
  dayDetailId: string;
}

export function useMeal({ organizationId, tripPublicId, dayDetailId }: UseMealProps) {
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [editingMeal, setEditingMeal] = useState<MealItem | null>(null);
  const [initialMealData, setInitialMealData] = useState<any>(null);

  const [getAllMeals] = useLazyGetAllTripMealsQuery();
  const [createMeal] = useCreateTripMealMutation();
  const [updateMeal] = useUpdateTripMealMutation();
  const [deleteMeal] = useDeleteTripMealMutation();

  // 🔄 Fetch all meals
  const fetchMeals = async () => {
    try {
      const response = await getAllMeals({
        organizationId,
        tripPublicId,
        dayDetailId,
      }).unwrap();

      const mealsData = Array.isArray(response)
        ? response
        : (response as any)?.data || [];

      const mapped = mealsData.map((item: any) => ({
        id: item.tripItemId || item.id,
        title: item.name || "Untitled",
        type: item.mealType || "",
        description: item.description || "",
        documents: item.documents || [],
      }));

      setMeals(mapped);
    } catch (error) {
      console.error("❌ Error fetching meals:", error);
    }
  };

  useEffect(() => {
    if (dayDetailId) fetchMeals();
  }, [dayDetailId]);

  // 📝 Save meal (Create or Edit)
  const handleMealSave = async (data: any) => {
    try {
      const formData = mapMealToFormData(data);

      if (editingMeal) {
        await updateMeal({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(editingMeal.id),
          data: formData,
        }).unwrap();
      } else {
        await createMeal({
          organizationId,
          tripPublicId,
          dayDetailId,
          data: formData,
        }).unwrap();
      }

      await fetchMeals();
      setEditingMeal(null);
      setInitialMealData(null);
    } catch (error) {
      console.error("❌ Error saving meal:", error);
    }
  };

  // ✏️ Edit (local)
  const handleMealEdit = (item: MealItem) => {
    setEditingMeal(item);
    setInitialMealData(item);
  };

  // 🗑️ Delete
  const handleMealDelete = async (id: number) => {
    try {
      await deleteMeal({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(id),
      }).unwrap();

      setMeals((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("❌ Error deleting meal:", error);
    }
  };

  return {
    meals,
    editingMeal,
    initialMealData,
    setEditingMeal,
    setInitialMealData,
    handleMealSave,
    handleMealEdit,
    handleMealDelete,
  };
}
