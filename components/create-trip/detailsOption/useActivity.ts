  "use client";

  import { useRef, useState } from "react";
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
      const cacheRef = useRef<Record<string, any>>({});
    const [getActivityById] = useLazyGetTripActivityByIdQuery();
    const [createActivity] = useCreateTripActivityMutation();
    const [updateActivity] = useUpdateTripActivityMutation();
    const [deleteActivity] = useDeleteTripActivityMutation();

    const handleActivityEdit = async (itemId: number) => {
      if (cacheRef.current[itemId]) {
      setInitialActivityData(cacheRef.current[itemId]);
      return cacheRef.current[itemId];
    }
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
    cacheRef.current[itemId] = mapped;
      setInitialActivityData(mapped);
      return mapped;
    };

   const handleActivitySave = async (data : any, itemId: any, documents : any[] = []) => {
  const cleanDocs = documents.filter(doc =>
    doc.file || doc.id || doc.markedForDeletion
  );

  const normalized = cleanDocs.map(doc => ({
    ...doc,
    markedForDeletion: doc.markedForDeletion || false
  }));

  const finalDocs = documents
  .filter(doc => doc.id || doc.file || doc.markedForDeletion) 
  .map(doc => ({
    id: doc.id || "",
    file: doc.file || null,
    url: doc.url || "",
    type: doc.type || "IMAGE",
    markedForDeletion: !!doc.markedForDeletion,
  }));


  const form = mapActivityToFormData(
    {
      ...data,
      time: data.time,
    },
    finalDocs 
  );

  let res;

 if (itemId) {
  const correctId = data.tripItemId || itemId;

  res = await updateActivity({
    organizationId,
    tripPublicId,
    dayDetailId,
    itemId: String(correctId),
    data: form
  }).unwrap();
      delete cacheRef.current[String(itemId)];
}
else {
    res = await createActivity({
      organizationId,
      tripPublicId,
      dayDetailId,
      data: form,
    }).unwrap();
  }
  return {
  ...res, 
  documents: res.documents || [],
};

};


    const handleActivityDelete = async (id: number) => {
      await deleteActivity({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(id),
      }).unwrap();
      delete cacheRef.current[String(id)];
      return { id };
    };

    return {
      initialActivityData,
      handleActivityEdit,
      handleActivitySave,
      handleActivityDelete,
    };
  }
