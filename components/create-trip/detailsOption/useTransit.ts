"use client";

import { useEffect, useState } from "react";
import {
  useLazyGetAllTransitsQuery,
  useLazyGetTransitByIdQuery,
  useCreateTransitMutation,
  useUpdateTransitMutation,
  useDeleteTransitMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/transit";

import { useCreateOrganizerTransitMutation } from "@/lib/services/organizer/trip/library/transit/index";

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

  // Trip APIs
  const [getTransits] = useLazyGetAllTransitsQuery();
  const [getTransitById] = useLazyGetTransitByIdQuery();
  const [createTransit] = useCreateTransitMutation();
  const [updateTransit] = useUpdateTransitMutation();
  const [deleteTransit] = useDeleteTransitMutation();

  // Library API
  const [createLibraryTransit] = useCreateOrganizerTransitMutation();

  // Fetch all transit items
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
        id: item.tripItemId ?? item.id,
        type: "transit",
        from: item.fromLocation || "",
        to: item.toLocation || "",
        departure: item.startTime || "",
        arrival: item.endTime || "",
        description: item.description || "",
        documents: item.documents || [],
      }));

      setTransits(mapped);
    } catch (err) {
      console.error("❌ Error fetching transits:", err);
    }
  };

  useEffect(() => {
    if (dayDetailId) fetchTransits();
  }, [dayDetailId]);

  // Edit transit — fetch by ID
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
        name: data.name || `${item.from} to ${item.to} Transit`,
        fromLocation: data.fromLocation || item.from,
        toLocation: data.toLocation || item.to,
        startTime: data.startTime || item.departure,
        endTime: data.endTime || item.arrival,
        vehicleType: data.vehicleType || "",
        arrangedBy: data.arrangedBy || "",
        description: data.description || "",
        packingSuggestion: data.packingSuggestion || "",
        addToLibrary: data.addToLibrary || false,
        documents: data.documents || [],
      });
    } catch (error) {
      console.error("❌ Error fetching transit:", error);
    }
  };

  // Save transit (Trip + optional Library)
  const handleTransitSave = async (data: any) => {
    try {
      const { saveInLibrary, saveAsName, documents, ...cleanData } = data;

      // --- Trip FormData ---
      const formData = mapTransitToFormData(cleanData, documents);

      if (editingTransit) {
        await updateTransit({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(editingTransit.id),
          data: formData,
        }).unwrap();

        console.log("✏️ Transit updated");
      } else {
        await createTransit({
          organizationId,
          tripPublicId,
          dayDetailId,
          data: formData,
        }).unwrap();

        console.log("🆕 Transit created");
      }

      // --- OPTIONAL: Save in library ---
      if (saveInLibrary) {
        const libraryFD = mapTransitToFormData(
          {
            ...cleanData,
            name: saveAsName || cleanData.title,
          },
          documents
        );

        await createLibraryTransit({
          organizationId,
          data: libraryFD,
        }).unwrap();

        console.log("📚 Transit saved in library");
      }

      await fetchTransits();
    } catch (error) {
      console.error("❌ Error saving transit:", error);
    } finally {
      setEditingTransit(null);
      setInitialTransitData(null);
    }
  };

  // Delete transit
  const handleTransitDelete = async (itemId: number) => {
    try {
      await deleteTransit({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
      }).unwrap();

      console.log("🗑️ Transit deleted");
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
