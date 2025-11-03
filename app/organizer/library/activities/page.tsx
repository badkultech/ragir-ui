"use client";

import { useState } from "react";
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

export default function ActivitiesPage() {
  const organizationId = useOrganizationId();

  // ✅ Local UI state
  const [modalOpen, setModalOpen] = useState(false);
  const [editActivity, setEditActivity] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    null
  );

  // ✅ API hooks
  const {
    data: activities = [],
    isLoading,
    isError,
    refetch,
  } = useGetActivitiesQuery(organizationId);

  const { data: selectedActivity, isFetching: isTransitLoading } =
    useGetActivityByIdQuery(
      selectedActivityId && organizationId
        ? { organizationId, activityId: selectedActivityId }
        : skipToken
    );
  const [deleteActivity] = useDeleteActivityMutation();

  // ✅ Filtering
  const filtered = activities.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Delete logic
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
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="Activities" />

        <main className="flex-1 p-6 md:p-8">
          {/* Header */}
          <LibraryHeader
            title="Ragir Library"
            buttonLabel="Add Activity"
            onAddClick={() => setModalOpen(true)}
          />

          {/* Loading / Error / Empty states */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading
              activities...
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
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="h-32 bg-gray-100 flex items-center justify-center">
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

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
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

                    {/* Actions */}
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
                          setEditActivity(activity);
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
                  No activities found.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Modal */}
      <AddNewItemModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditActivity(null);
          refetch();
        }}
        initialStep="activity"
        updateId={editActivity?.id}
        editData={editActivity}
      />
      <ViewModal
        step="activity"
        open={viewModalOpen}
        data={selectedActivity}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedActivityId(null); // Reset selected activity ID when closing modal
        }}
      />
    </div>
  );
}
