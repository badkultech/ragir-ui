"use client";

import { useEffect, useState } from "react";
import {
  useLazyGetAllTripStaysQuery,
  useCreateTripStayMutation,
  useUpdateTripStayMutation,
  useDeleteTripStayMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/stay";
import { StayItem } from "@/lib/services/organizer/trip/itinerary/day-details/stay/types";
import { mapStayToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

interface UseStayProps {
  organizationId: string;
  tripPublicId: string;
  dayDetailId: string;
}

export function useStay({ organizationId, tripPublicId, dayDetailId }: UseStayProps) {
  const [stays, setStays] = useState<StayItem[]>([]);
  const [editingStay, setEditingStay] = useState<StayItem | null>(null);
  const [initialStayData, setInitialStayData] = useState<any>(null);

  const [getAllStays] = useLazyGetAllTripStaysQuery();
  const [createStay] = useCreateTripStayMutation();
  const [updateStay] = useUpdateTripStayMutation();
  const [deleteStay] = useDeleteTripStayMutation();

  // ✅ Fetch all stays
  const fetchStays = async () => {
    try {
      const response = await getAllStays({
        organizationId,
        tripPublicId,
        dayDetailId,
      }).unwrap();

      console.log("🚀 Raw stay response:", response);

      // Handle both shapes (array or {data: []})
      const staysData = Array.isArray(response)
        ? response
        : (response as any)?.data || [];

      const mapped = staysData.map((item: any) => ({
        id: item.tripItemId || item.id,
        title: item.name || "Untitled",
        location: item.location || "",
        description: item.description || "",
        checkInTime: item.checkInTime || "",
        checkOutTime: item.checkOutTime || "",
        packingSuggestion: item.packingSuggestion || "",
        documents: item.documents || [],
        type: item.tripType || "stay",
      }));

      setStays(mapped);
    } catch (error) {
      console.error("❌ Error fetching stays:", error);
    }
  };

  useEffect(() => {
    if (dayDetailId) fetchStays();
  }, [dayDetailId]);

  // ✅ Save (Create / Update)
  const handleStaySave = async (data: any) => {
    try {
      const formData = mapStayToFormData(data);

      if (editingStay) {
        await updateStay({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(editingStay.id),
          data: formData,
        }).unwrap();
        console.log("✏️ Stay updated successfully");
      } else {
        await createStay({
          organizationId,
          tripPublicId,
          dayDetailId,
          data: formData,
        }).unwrap();
        console.log("🆕 Stay created successfully");
      }

      await fetchStays();
      setEditingStay(null);
      setInitialStayData(null);
    } catch (error) {
      console.error("❌ Error saving stay:", error);
    }
  };

  // ✅ Edit (local only)
  const handleStayEdit = (item: StayItem) => {
    setEditingStay(item);
    setInitialStayData(item);
  };

  // ✅ Delete
  const handleStayDelete = async (id: number) => {
    try {
      await deleteStay({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(id),
      }).unwrap();
      setStays((prev) => prev.filter((stay) => stay.id !== id));
      console.log("🗑️ Stay deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting stay:", error);
    }
  };

  return {
    stays,
    editingStay,
    initialStayData,
    setEditingStay,
    setInitialStayData,
    handleStaySave,
    handleStayEdit,
    handleStayDelete,
  };
}
