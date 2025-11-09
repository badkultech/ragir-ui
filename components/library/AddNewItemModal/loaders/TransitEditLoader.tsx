"use client";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetOrganizerTransitByIdQuery } from "@/lib/services/organizer/trip/library/transit";
import { AddTransitForm } from "@/components/library/AddTransitForm";
import { normalizeDocuments } from "./common";

export function TransitEditLoader({ updateId, onCancel, onSave }: any) {
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const { data, isLoading, isFetching, error } =
    useGetOrganizerTransitByIdQuery(
      organizationId && updateId
        ? { organizationId, transitId: updateId }
        : skipToken
    );

  if (isLoading || isFetching)
    return <Loader text="Loading transit details…" />;
  if (error || !data)
    return <Loader text="Unable to load transit data." />;

  const normalized = {
    ...data,
    documents: normalizeDocuments(data.documents),
  };

  return (
    <AddTransitForm
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
