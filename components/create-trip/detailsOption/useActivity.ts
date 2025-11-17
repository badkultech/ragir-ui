"use client";

import { useState } from "react";
import {
  useLazyGetTripActivityByIdQuery,
  useCreateTripActivityMutation,
  useUpdateTripActivityMutation,
  useDeleteTripActivityMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/activity";
import { mapActivityToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

export function useActivity({ organizationId, tripPublicId, dayDetailId }: any) {
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [initialActivityData, setInitialActivityData] = useState<any>(null);

  const [getActivityById] = useLazyGetTripActivityByIdQuery();
  const [createActivity] = useCreateTripActivityMutation();
  const [updateActivity] = useUpdateTripActivityMutation();
  const [deleteActivity] = useDeleteTripActivityMutation();

  /* EDIT */
  const handleActivityEdit = async (itemId: number) => {
    const res = await getActivityById({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(itemId),
    }).unwrap();

    const data = (res as any)?.data || res;

    const mapped = {
      id: itemId,
      name: data.name || "",
      location: data.location || "",
      startTime: data.startTime?.slice(0, 5) || "",
      endTime: data.endTime?.slice(0, 5) || "",
      description: data.description || "",
      documents: data.documents || [],
    };

    setEditingActivity({ id: itemId });
    setInitialActivityData(mapped);
    return mapped;
  };

  /* SAVE */
  const handleActivitySave = async (data: any, itemId?: number) => {
    const form = mapActivityToFormData(data);

    if (itemId) {
      const res = await updateActivity({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
        data: form,
      }).unwrap();

      return (res as any)?.data || res;
    }

    const res = await createActivity({
      organizationId,
      tripPublicId,
      dayDetailId,
      data: form,
    }).unwrap();

    return (res as any)?.data || res;
  };

  /* DELETE */
  const handleActivityDelete = async (id: number) => {
    await deleteActivity({
      organizationId,
      tripPublicId,
      dayDetailId,
      itemId: String(id),
    }).unwrap();

    return { id };
  };

  return {
    editingActivity,
    initialActivityData,
    handleActivityEdit,
    handleActivitySave,
    handleActivityDelete,
  };
}
