"use client";

import { useState, useMemo } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { MapPin, Pencil, Eye, Trash2, Loader2 } from "lucide-react";
import { AddNewItemModal } from "@/components/library/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import {
  useDeleteActivityMutation,
  useGetActivitiesQuery,
  useGetActivityByIdQuery,
} from "@/lib/services/organizer/trip/library/activity";
import { ViewModal } from "@/components/library/ViewModal";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDebounce } from "@/hooks/useDebounce";

export default function ActivitiesPage() {
  const organizationId = useOrganizationId();

  const [modalOpen, setModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);

  const {
    data: activities = [],
    isLoading,
    isError,
    refetch,
  } = useGetActivitiesQuery(organizationId ?? skipToken);

  const { data: selectedActivity, isFetching } = useGetActivityByIdQuery(
    selectedActivityId && organizationId
      ? { organizationId, activityId: selectedActivityId }
      : skipToken
  );

  const [deleteActivity] = useDeleteActivityMutation();

  // Debounce search (300ms)
  const debouncedSearch = useDebounce(search, 300);

  // Filtered activities — only apply when debounced search length >= 3
  const filtered = useMemo(() => {
    const q = (debouncedSearch || "").trim().toLowerCase();
    if (q.length < 3) return activities || [];
    return (activities || []).filter((a) => {
      const name = (a.name || "").toString().toLowerCase();
      const loc = (a.location || "").toString().toLowerCase();
      const desc = (a.description || "").toString().toLowerCase();
      return name.includes(q) || loc.includes(q) || desc.includes(q);
    });
  }, [activities, debouncedSearch]);

  const qLen = (debouncedSearch || "").trim().length;

  const handleDelete = async (activityId: string | number) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    try {
      await deleteActivity({ organizationId, activityId }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Failed to delete activity");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Activities" />

        <main className="flex-1 p-6 md:p-8">
          <LibraryHeader
            title="Ragir Library"
            buttonLabel="Add Item"
            onAddClick={() => {
              setUpdateId(null);
              setModalOpen(true);
            }}
            // controlled search props
            searchValue={search}
            onSearchChange={(v) => setSearch(v)}
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading activities...
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-10">
              Failed to load activities.{" "}
              <button onClick={() => refetch()} className="underline">
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-4 flex flex-col"
                >
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    {activity?.documents?.[0]?.url ? (
                      <img
                        src={activity.documents[0].url}
                        alt={activity.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>

                  <div className="py-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900">
                      {activity.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      {activity.location || "—"}
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {activity.description || "No description available."}
                    </p>

                    <div className="mt-4 flex justify-end gap-3 text-gray-500">
                      <button
                        className="hover:text-orange-500"
                        onClick={() => {
                          setSelectedActivityId(activity.id);
                          setViewModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="hover:text-orange-500"
                        onClick={() => {
                          setUpdateId(activity.id);
                          setModalOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="hover:text-red-500"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-10">
                  {qLen === 0 && activities.length === 0
                    ? "No activities found."
                    : qLen === 0 && activities.length > 0
                    ? "Showing all activities. Type at least 3 characters to search."
                    : qLen > 0 && qLen < 3
                    ? "Type at least 3 characters to search."
                    : "No activities found."}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ✅ Add / Edit Modal */}
      <AddNewItemModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setTimeout(() => refetch(), 400);
        }}
        updateId={updateId}
        initialStep="activity"
      />

      {/* ✅ View Modal */}
      <ViewModal
        step="activity"
        open={viewModalOpen}
        data={selectedActivity}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedActivityId(null);
        }}
      />
    </div>
  );
}