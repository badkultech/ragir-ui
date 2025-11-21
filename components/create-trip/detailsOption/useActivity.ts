  "use client";

  import { useState } from "react";
  import {
    useLazyGetTripActivityByIdQuery,
    useCreateTripActivityMutation,
    useUpdateTripActivityMutation,
    useDeleteTripActivityMutation,
  } from "@/lib/services/organizer/trip/itinerary/day-details/activity";
  import { mapActivityToFormData } from "@/lib/services/organizer/trip/library/common/formDataMappers";

  export type ActivityDocument = {
    id: number | null;
    url: string;
    type: string;
    file: File | null;
    markedForDeletion: boolean;
  };

  function normalizeDocuments(docs: any[]): ActivityDocument[] {
    if (!Array.isArray(docs)) return [];
    return docs.map((d) => ({
      id: d.id ?? null,
      url: d.url ?? "",
      type: d.type ?? "IMAGE",
      file: null,
      markedForDeletion: false,
    }));
  }


  export function useActivity({
    organizationId,
    tripPublicId,
    dayDetailId,
  }: any) {
    const [initialActivityData, setInitialActivityData] = useState<any>(null);
    const [getActivityById] = useLazyGetTripActivityByIdQuery();
    const [createActivity] = useCreateTripActivityMutation();
    const [updateActivity] = useUpdateTripActivityMutation();
    const [deleteActivity] = useDeleteTripActivityMutation();

    const handleActivityEdit = async (itemId: number) => {
      const res = await getActivityById({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
      }).unwrap();

      const data = res;

      const mapped = {
        id: itemId,
        title: data.name ?? "",
        location: data.location ?? "",
        description: data.description ?? "",
        time: data.time ?? "",
        moodTags: data.moodTags ?? [],
        packingSuggestion :data.packingSuggestion??"",
        priceType: data.priceCharge === "CHARGEABLE" ? "CHARGEABLE" : "INCLUDED",
        documents: normalizeDocuments(data.documents ?? []),
      };

      setInitialActivityData(mapped);
      return mapped;
    };

    const handleActivitySave = async (
    data: any,
    itemId?: number,
    documents: any[] = []
  ) => {
    const form = mapActivityToFormData(
      {
        ...data,
        time: data.time,
      },
      documents
    );


      let res;

      if (itemId) {
        res = await updateActivity({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(itemId),
          data: form,
        }).unwrap();
      } else {
        res = await createActivity({
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
      initialActivityData,
      handleActivityEdit,
      handleActivitySave,
      handleActivityDelete,
    };
  }
