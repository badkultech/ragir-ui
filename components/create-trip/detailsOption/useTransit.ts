"use client";

import { useEffect, useState } from "react";
import {
  useLazyGetAllTransitsQuery,
  useLazyGetTransitByIdQuery,
  useCreateTransitMutation,
  useUpdateTransitMutation,
  useDeleteTransitMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/transit";
import { mapTransitToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

export interface TransitItem {
  id: number;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  description: string;
  documents?: any[];
}

interface UseTransitProps {
  organizationId: string;
  tripPublicId: string;
  dayDetailId: string;
}

export function useTransit({
  organizationId,
  tripPublicId,
  dayDetailId,
}: UseTransitProps) {
  const [transits, setTransits] = useState<TransitItem[]>([]);
  const [editingTransit, setEditingTransit] = useState<TransitItem | null>(null);
  const [initialTransitData, setInitialTransitData] = useState<any>(null);

  // ✅ API hooks
  const [getTransits] = useLazyGetAllTransitsQuery();
  const [getTransitById] = useLazyGetTransitByIdQuery();
  const [createTransit] = useCreateTransitMutation();
  const [updateTransit] = useUpdateTransitMutation();
  const [deleteTransit] = useDeleteTransitMutation();

  // ✅ Fetch all transits
  const fetchTransits = async () => {
    try {
      const response = await getTransits({
        organizationId,
        tripPublicId,
        dayDetailId,
      }).unwrap();

      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      const mapped = list.map((item: any) => ({
        id: item.tripItemId ?? Date.now(),
        type: "transit" as const,
        from: item.fromLocation ?? "",
        to: item.toLocation ?? "",
        departure: item.startTime ?? "",
        arrival: item.endTime ?? "",
        description: item.description ?? "",
        documents: item.documents ?? [],
      }));

      setTransits(mapped);
    } catch (err) {
      console.error("❌ Error fetching transits:", err);
    }
  };

  useEffect(() => {
    if (dayDetailId) fetchTransits();
  }, [dayDetailId]);

  // ✅ Edit handler → fetch by id
  const handleTransitEdit = async (item: TransitItem) => {
    try {
      const response = await getTransitById({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(item.id),
      }).unwrap();

      const data = (response as any)?.data ?? response;

      setEditingTransit(item);
      setInitialTransitData({
        fromLocation: data.fromLocation || item.from,
        toLocation: data.toLocation || item.to,
        startTime: data.startTime || item.departure,
        endTime: data.endTime || item.arrival,
        vehicleType: data.vehicleType || "",
        arrangedBy: data.arrangedBy || "",
        description: data.description || "",
        packingSuggestion: data.packingSuggestion || "",
        addToLibrary: data.addToLibrary || false,
        name: data.name || `${item.from} to ${item.to} Transit`,
        documents: data.documents || [],
      });
    } catch (error) {
      console.error("❌ Error fetching single transit:", error);
    }
  };

  // ✅ Save (POST / PUT)
  const handleTransitSave = async (data: any) => {
    const formData = mapTransitToFormData(data, data.documents);
    try {
      if (editingTransit) {
        await updateTransit({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(editingTransit.id),
          data: formData,
        }).unwrap();
        console.log("✏️ Updated transit:", editingTransit.id);
      } else {
        await createTransit({
          organizationId,
          tripPublicId,
          dayDetailId,
          data: formData,
        }).unwrap();
        console.log("🆕 Created transit");
      }

      await fetchTransits();
    } catch (error) {
      console.error("❌ Error saving transit:", error);
    } finally {
      setEditingTransit(null);
      setInitialTransitData(null);
    }
  };

  // ✅ Delete handler
  const handleTransitDelete = async (itemId: number) => {
    try {
      await deleteTransit({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
      }).unwrap();

      console.log("🗑️ Deleted transit:", itemId);
      await fetchTransits();
    } catch (error) {
      console.error("❌ Error deleting transit:", error);
    }
  };

  return {
    transits,
    editingTransit,
    initialTransitData,
    setEditingTransit,
    setInitialTransitData,
    handleTransitSave,
    handleTransitEdit,
    handleTransitDelete,
  };
}
