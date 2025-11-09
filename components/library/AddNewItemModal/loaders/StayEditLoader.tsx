"use client";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetStayByIdQuery } from "@/lib/services/organizer/trip/library/stay";
import { AddStayForm } from "@/components/library/AddStayForm";
import { normalizeDocuments } from "./common";

export function StayEditLoader({ updateId, onCancel, onSave }: any) {
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const { data, isLoading, isFetching, error } = useGetStayByIdQuery(
    organizationId && updateId ? { organizationId, stayId: updateId } : skipToken
  );

  if (isLoading || isFetching)
    return <Loader text="Loading stay details…" />;
  if (error || !data)
    return <Loader text="Unable to load stay data." />;

  const normalized = {
    ...data,
    documents: normalizeDocuments(data.documents),
  };

  return (
    <AddStayForm
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
