"use client";

import { useState } from "react";
import {
  useCreateTripStayMutation,
  useUpdateTripStayMutation,
  useDeleteTripStayMutation,
  useLazyGetTripStayByIdQuery,
} from "@/lib/services/organizer/trip/itinerary/day-details/stay";

import { mapStayToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

function normalizeDocuments(docs: any[]) {
  if (!Array.isArray(docs)) return [];

  return docs.map((d) => ({
    id: d.id ?? null,
    url: d.url ?? "",
    type: d.type ?? "IMAGE",
    file: null,
    markedForDeletion: false,
  }));
}

export function useStay({ organizationId, tripPublicId, dayDetailId }: any) {
  const [initialStayData, setInitialStayData] = useState<any>(null);

  const [getStayById] = useLazyGetTripStayByIdQuery();
  const [createStay] = useCreateTripStayMutation();
  const [updateStay] = useUpdateTripStayMutation();
  const [deleteStay] = useDeleteTripStayMutation();

  const handleStayEdit = async (itemId: number) => {
    const res = await getStayById({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(itemId),
    }).unwrap();

    const data = res;

    const mapped = {
      id: itemId,
      name: data.name || "",
      location: data.location || "",
      checkInTime: data.checkIn?.slice(0, 5) || "",
      checkOutTime: data.checkOut?.slice(0, 5) || "",
      description: data.description || "",
      packingSuggestion: data.packingSuggestion || "",
      sharingType: data.sharingType || "",
      documents: normalizeDocuments(data.documents ?? []),
    };

    setInitialStayData(mapped);
    return mapped;
  };

  const handleStaySave = async (data: any, itemId?: number, documents: any[] = []) => {
    const form = mapStayToFormData(data, documents);

    let res;

    if (itemId) {
      res = await updateStay({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
        data: form,
      }).unwrap();
    } else {
      res = await createStay({
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
    initialStayData,
    handleStayEdit,
    handleStaySave,
    handleStayDelete,
  };
}
