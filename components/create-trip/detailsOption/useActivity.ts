"use client";

import { useState } from "react";
import {
  useCreateTripActivityMutation,
  useUpdateTripActivityMutation,
  useDeleteTripActivityMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/activity";
import { mapActivityToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

interface UseActivityProps {
  organizationId: string;
  tripPublicId: string;
  dayDetailId: string;
}

export function useActivity({ organizationId, tripPublicId, dayDetailId }: UseActivityProps) {
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [initialActivityData, setInitialActivityData] = useState<any>(null);

  const [createActivity] = useCreateTripActivityMutation();
  const [updateActivity] = useUpdateTripActivityMutation();
  const [deleteActivity] = useDeleteTripActivityMutation();

  // create/update
  const handleActivitySave = async (data: any) => {
    const formData = mapActivityToFormData(data);

    try {
      if (editingActivity) {
        const res = await updateActivity({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(editingActivity.id),
          data: formData,
        }).unwrap();

        setEditingActivity(null);
        setInitialActivityData(null);

        return (res as any)?.data ?? res ?? { ...data, id: editingActivity.id };
      } else {
        const res = await createActivity({
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
      console.error("Activity save error:", err);
      throw err;
    }
  };

  // edit
  const handleActivityEdit = (item: any) => {
    setEditingActivity(item);
    setInitialActivityData(item);
  };

  // delete
  const handleActivityDelete = async (id: number) => {
    try {
      await deleteActivity({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(id),
      }).unwrap();

      return { id };
    } catch (err) {
      console.error("Activity delete error:", err);
      throw err;
    }
  };

  return {
    editingActivity,
    initialActivityData,
    setEditingActivity,
    setInitialActivityData,
    handleActivitySave,
    handleActivityEdit,
    handleActivityDelete,
  };
}
