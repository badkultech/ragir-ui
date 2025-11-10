"use client";

import { useState, useMemo } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { MapPin, Pencil, Eye, Trash2, Loader2 } from "lucide-react";
import { AddNewItemModal } from "@/components/library/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import {
  useDeleteStayMutation,
  useGetStaysQuery,
  useGetStayByIdQuery,
} from "@/lib/services/organizer/trip/library/stay";
import { ViewModal } from "@/components/library/ViewModal";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDebounce } from "@/hooks/useDebounce";

export default function StaysPage() {
  const organizationId = useOrganizationId();

  // Local UI state
  const [modalOpen, setModalOpen] = useState(false);
  const [editStayId, setEditStayId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStayId, setSelectedStayId] = useState<number | null>(null);

  // API
  const {
    data: stays = [],
    isLoading,
    isError,
    refetch,
  } = useGetStaysQuery(organizationId ?? skipToken);

  const { data: selectedStay, isFetching: isTransitLoading } =
    useGetStayByIdQuery(
      selectedStayId && organizationId
        ? { organizationId, stayId: selectedStayId }
        : skipToken
    );

  const [deleteStay] = useDeleteStayMutation();

  // Debounce search (300ms)
  const debouncedSearch = useDebounce(search, 300);

  // Filtered stays — only apply when debounced search has >= 3 chars
  const filtered = useMemo(() => {
    const q = (debouncedSearch || "").trim().toLowerCase();
    if (q.length < 3) return stays;
    return (stays || []).filter((stay) => {
      const name = (stay.name || "").toString().toLowerCase();
      const loc = (stay.location || "").toString().toLowerCase();
      const desc = (stay.description || "").toString().toLowerCase();
      return name.includes(q) || loc.includes(q) || desc.includes(q);
    });
  }, [stays, debouncedSearch]);

  const handleDelete = async (stayId: string | number) => {
    if (!confirm("Are you sure you want to delete this stay?")) return;
    try {
      await deleteStay({ organizationId, stayId }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error deleting stay:", error);
      alert("Failed to delete stay");
    }
  };

  const qLen = (debouncedSearch || "").trim().length;

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="Stays" />

        <main className="flex-1 p-6 md:p-8">
          {/* Header (controlled search passed down) */}
          <LibraryHeader
            buttonLabel="Add stay"
            onAddClick={() => {
              setEditStayId(null);
              setModalOpen(true);
            }}
            title="Ragir Library"
            searchValue={search}
            onSearchChange={(v) => setSearch(v)}
          />

          {/* Loading / Error / Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading stays...
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-10">
              Failed to load stays.{" "}
              <button onClick={() => refetch()} className="underline">
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((stay) => (
                <div
                  key={stay.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative px-3 pt-3">
                    <div className="h-36 w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                      {stay?.documents?.[0]?.url ? (
                        <img
                          src={stay.documents[0].url}
                          alt={stay.name}
                          className="w-[95%] h-[95%] object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900">{stay.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      {stay.location || "—"}
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {stay.description || "No description available."}
                    </p>

                    {/* Actions */}
                    <div className="mt-4 flex justify-end gap-3 text-gray-500">
                      <button
                        className="hover:text-orange-500"
                        onClick={() => {
                          setSelectedStayId(stay.id);
                          setViewModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="hover:text-orange-500"
                        onClick={() => {
                          setEditStayId(stay.id);
                          setModalOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="hover:text-red-500"
                        onClick={() => handleDelete(stay.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-10">
                  {qLen === 0 && stays.length === 0
                    ? "No stays found."
                    : qLen === 0 && stays.length > 0
                    ? "Showing all stays. Type at least 3 characters to search."
                    : qLen > 0 && qLen < 3
                    ? "Type at least 3 characters to search."
                    : "No stays found."}
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
          setEditStayId(null);
          refetch();
        }}
        initialStep="stay"
        updateId={editStayId}
      />

      <ViewModal
        step="stays"
        open={viewModalOpen}
        data={selectedStay}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedStayId(null);
        }}
      />
    </div>
  );
}
