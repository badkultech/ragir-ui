// components/library/AddNewItemModal/loaders/ActivityEditLoader.tsx
"use client";

import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetActivityByIdQuery } from "@/lib/services/organizer/trip/library/activity";
import { AddActivityForm } from "@/components/library/AddActivityForm";
import { normalizeDocuments } from "./common";

export function ActivityEditLoader({
  updateId,
  onCancel,
  onSave,
}: {
  updateId: number;
  onCancel: () => void;
  onSave: (data: any, documents?: any[]) => void;
}) {
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const { data, isLoading, isFetching, error } = useGetActivityByIdQuery(
    organizationId && updateId
      ? { organizationId, activityId: updateId }
      : skipToken
  );

  if (isLoading || isFetching)
    return <Loader text="Loading activity details…" />;

  if (error || !data)
    return <Loader text="Unable to load activity data." />;

  const normalized = {
    ...data,
    documents: normalizeDocuments(data.documents),
  };

  return (
    <AddActivityForm
      mode="library"
      initialData={normalized}
      onCancel={onCancel}
      onSave={onSave}
    />
  );
}

function Loader({ text }: { text: string }) {
  return <div className="text-center text-gray-500 py-10">{text}</div>;
}
