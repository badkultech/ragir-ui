"use client";

import { useEffect, useState } from "react";
import {
  useLazyGetAllTripActivitiesQuery,
  useCreateTripActivityMutation,
  useUpdateTripActivityMutation,
  useDeleteTripActivityMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/activity";
import { ActivityItem } from "@/lib/services/organizer/trip/itinerary/day-details/activity/types";
import { mapActivityToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

interface UseActivityProps {
  organizationId: string;
  tripPublicId: string;
  dayDetailId: string;
}

export function useActivity({
  organizationId,
  tripPublicId,
  dayDetailId,
}: UseActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [initialActivityData, setInitialActivityData] = useState<any>(null);

  const [getAllActivities] = useLazyGetAllTripActivitiesQuery();
  const [createActivity] = useCreateTripActivityMutation();
  const [updateActivity] = useUpdateTripActivityMutation();
  const [deleteActivity] = useDeleteTripActivityMutation();

  // 🔄 Fetch all Activities
  const fetchActivities = async () => {
    try {
      const response = await getAllActivities({
        organizationId,
        tripPublicId,
        dayDetailId,
      }).unwrap();

      const activityData = Array.isArray(response)
        ? response
        : (response as any)?.data || [];

      const mapped = activityData.map((item: any) => ({
        id: item.tripItemId || item.id,
        title: item.name,
        description: item.description,
        location: item.location,
        startTime: item.startTime,
        endTime: item.endTime,
        documents: item.documents || [],
      }));

      setActivities(mapped);
    } catch (error) {
      console.error("❌ Error fetching activities:", error);
    }
  };

  useEffect(() => {
    if (dayDetailId) fetchActivities();
  }, [dayDetailId]);

  // 📝 Save Activity
  const handleActivitySave = async (data: any) => {
    try {
      const formData = mapActivityToFormData(data);

      if (editingActivity) {
        await updateActivity({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(editingActivity.id),
          data: formData,
        }).unwrap();
      } else {
        await createActivity({
          organizationId,
          tripPublicId,
          dayDetailId,
          data: formData,
        }).unwrap();
      }

      await fetchActivities();
      setEditingActivity(null);
      setInitialActivityData(null);
    } catch (error) {
      console.error("❌ Error saving activity:", error);
    }
  };

  // ✏️ Edit (local)
  const handleActivityEdit = (item: ActivityItem) => {
    setEditingActivity(item);
    setInitialActivityData(item);
  };

  // 🗑️ Delete
  const handleActivityDelete = async (id: number) => {
    try {
      await deleteActivity({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(id),
      }).unwrap();

      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("❌ Error deleting activity:", error);
    }
  };

  return {
    activities,
    editingActivity,
    initialActivityData,
    setEditingActivity,
    setInitialActivityData,
    handleActivitySave,
    handleActivityEdit,
    handleActivityDelete,
  };
}
