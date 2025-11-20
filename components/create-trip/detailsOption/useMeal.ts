"use client";

import { useState } from "react";
import {
  useCreateTripMealMutation,
  useUpdateTripMealMutation,
  useDeleteTripMealMutation,
  useLazyGetTripMealByIdQuery,
} from "@/lib/services/organizer/trip/itinerary/day-details/meal";
import { mapMealToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

function normalizeDocuments(docs: any[]) {
  if (!Array.isArray(docs)) return [];

  return docs.map((d: any) => ({
    id: d.id ?? null,
    url: d.url ?? "",
    type: d.type ?? "IMAGE",
    file: null,
    markedForDeletion: false,
  }));
}

export function useMeal({ organizationId, tripPublicId, dayDetailId }: any) {
  const [initialMealData, setInitialMealData] = useState<any>(null);

  const [getMealById] = useLazyGetTripMealByIdQuery();
  const [createMeal] = useCreateTripMealMutation();
  const [updateMeal] = useUpdateTripMealMutation();
  const [deleteMeal] = useDeleteTripMealMutation();

  /* ------------------------- EDIT -------------------------- */
  const handleMealEdit = async (itemId: number) => {
    const res = await getMealById({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(itemId),
    }).unwrap();

    const data = res;

    const mapped = {
      id: itemId,
      title: data.name ?? "",
      description: data.description ?? "",
      mealType: data.mealType ?? "",
      time: data.time ?? "",
      location: data.location ?? "",
      chargeable: data.chargeable ?? false,   
      packingSuggestion :data.packingSuggestion??"",
      documents: normalizeDocuments(data.documents ?? []),
    };

    setInitialMealData(mapped);
    return mapped;
  };

  const handleMealSave = async (data: any, itemId?: number , documents:any[]=[] ) => {
    const form = mapMealToFormData(
      {
        ...data,
        time: data.time,
      },
      documents,
    );

    let res;

    if (itemId) {
      res = await updateMeal({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
        data: form,
      }).unwrap();
    } else {
      res = await createMeal({
        organizationId,
        tripPublicId,
        dayDetailId,
        data: form,
      }).unwrap();
    }

    const raw = res;

    return {
      ...raw,
      documents: normalizeDocuments(raw.documents ?? []),
    };
  };

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
    initialMealData,
    handleMealEdit,
    handleMealSave,
    handleMealDelete,
  };
}
