"use client";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetOrganizerDayDescriptionByIdQuery } from "@/lib/services/organizer/trip/library/day-description";
import { AddEventForm } from "@/components/library/AddEventForm";
import { normalizeDocuments } from "./common";

export function EventEditLoader({ updateId, onCancel, onSave }: any) {
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const { data, isLoading, isFetching, error } =
    useGetOrganizerDayDescriptionByIdQuery(
      organizationId && updateId
        ? { organizationId, dayDescriptionId: updateId }
        : skipToken
    );

  if (isLoading || isFetching)
    return <Loader text="Loading event details…" />;
  if (error || !data)
    return <Loader text="Unable to load event data." />;

  const normalized = {
    ...data,
    documents: normalizeDocuments(data.documents),
  };

  return (
    <AddEventForm
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
