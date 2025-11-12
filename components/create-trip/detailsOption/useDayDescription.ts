"use client";

import { useEffect, useState } from "react";
import {
  useCreateTripDayDescriptionMutation,
  useLazyGetTripDayDescriptionsQuery,
  useLazyGetTripDayDescriptionByIdQuery,
  useUpdateTripDayDescriptionMutation,
  useDeleteTripDayDescriptionMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/day-description";
import { useCreateDayDescriptionMutation } from "@/lib/services/organizer/trip/library/day-description";
import { mapDayDescriptionToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

export function useDayDescription({
  organizationId,
  tripPublicId,
  dayDetailId,
}: {
  organizationId: string;
  tripPublicId: string;
  dayDetailId: string;
}) {
  const [details, setDetails] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [initialData, setInitialData] = useState<any | null>(null);

  // ✅ API hooks
  const [createTripDayDescription] = useCreateTripDayDescriptionMutation();
  const [getTripDayDescriptions] = useLazyGetTripDayDescriptionsQuery();
  const [getTripDayDescriptionById] = useLazyGetTripDayDescriptionByIdQuery();
  const [updateTripDayDescription] = useUpdateTripDayDescriptionMutation();
  const [deleteTripDayDescription] = useDeleteTripDayDescriptionMutation();
  const [createLibraryDayDescription] = useCreateDayDescriptionMutation();

  // ✅ Fetch All Day Descriptions
  const fetchDayDescriptions = async () => {
    try {
      const response = await getTripDayDescriptions({
        organizationId,
        tripPublicId,
        dayDetailId,
      }).unwrap();

      const list = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];

      const mapped = list.map((item) => ({
        id: item.tripItemId ?? Date.now(),
        type: "event",
        title: item.name ?? "Untitled",
        description: item.description ?? "",
        location: item.location ?? "",
        time:
          typeof item.time === "string"
            ? item.time
            : item.time
            ? `${String(item.time.hour ?? "00").padStart(2, "0")}:${String(
                item.time.minute ?? "00"
              ).padStart(2, "0")}`
            : "",
        packingSuggestion: item.packingSuggestion ?? "",
        documents: item.documents || [],
      }));

      setDetails(mapped.length > 0 ? [mapped[mapped.length - 1]] : []);
    } catch (err) {
      console.error("❌ Error fetching day descriptions:", err);
    }
  };

  useEffect(() => {
    if (dayDetailId) fetchDayDescriptions();
  }, [dayDetailId]);

  // ✅ Save / Update
  const handleSave = async (data: any) => {
    if (!data.title?.trim() || !data.description?.trim()) return;

    const tripFormData = mapDayDescriptionToFormData(data, data.documents);

    try {
      if (editingItem) {
        await updateTripDayDescription({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(editingItem.id),
          data: tripFormData,
        }).unwrap();
        console.log("✏️ Updated Day Description:", editingItem.id);
      } else {
        await createTripDayDescription({
          organizationId,
          tripPublicId,
          dayDetailId,
          data: tripFormData,
        }).unwrap();
        console.log("🆕 Created Day Description");
      }

      if (data.saveInLibrary) {
        try {
          const libForm = mapDayDescriptionToFormData(data, data.documents);
          await createLibraryDayDescription({ organizationId, data: libForm });
          console.log("📚 Saved in Library");
        } catch (err) {
          console.warn("⚠️ Failed to save in Library:", err);
        }
      }

      await fetchDayDescriptions();
    } catch (error) {
      console.error("❌ Error saving Day Description:", error);
    } finally {
      setEditingItem(null);
      setInitialData(null);
    }
  };

  // ✅ Edit Handler
  const handleEdit = async (item: any) => {
    try {
      const res = await getTripDayDescriptionById({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(item.id),
      }).unwrap();

      const data = res?.data ?? res;
      setEditingItem(item);
      setInitialData({
        title: data?.name || "",
        description: data?.description || "",
        location: data?.location || "",
        time:
          typeof data?.time === "string"
            ? data.time
            : `${data?.time?.hour ?? "00"}:${data?.time?.minute ?? "00"}`,
        packingSuggestion: data?.packingSuggestion || "",
        documents: data?.documents || [],
      });
    } catch (err) {
      console.error("❌ Error fetching single Day Description:", err);
    }
  };

  // ✅ Delete Handler
  const handleDelete = async (id: number) => {
    try {
      await deleteTripDayDescription({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(id),
      }).unwrap();

      await fetchDayDescriptions();
    } catch (err) {
      console.error("❌ Error deleting Day Description:", err);
    }
  };

  return {
    details,
    editingItem,
    initialData,
    setEditingItem,
    setInitialData,
    fetchDayDescriptions,
    handleSave,
    handleEdit,
    handleDelete,
  };
}
