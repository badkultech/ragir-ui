"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { MapPin, Pencil, Eye, Trash2, Loader2 } from "lucide-react";
import { AddNewItemModal } from "@/components/library/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useDeleteStayMutation, useGetStaysQuery } from "@/lib/services/organizer/trip/library/stay";


export default function StaysPage() {
  const organizationId = useOrganizationId();

  // ✅ API integration
  const { data: stays = [], isLoading, isError, refetch } =
    useGetStaysQuery(organizationId);

  const [deleteStay] = useDeleteStayMutation();

  // ✅ Local state
  const [modalOpen, setModalOpen] = useState(false);
  const [editStay, setEditStay] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Filtered data
  const filtered = stays.filter((stay) =>
    stay.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Delete logic
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
          {/* Header */}
          <LibraryHeader
            buttonLabel="Add stay"
            onAddClick={() => setModalOpen(true)}
            title="Ragir Library"
          />

          {/* Loading / Error States */}
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
                  <div className="h-32 bg-gray-100 flex items-center justify-center">
                    {stay.documents?.[0]?.url ? (
                      <img
                        src={stay.documents[0].url}
                        alt={stay.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900">
                      {stay.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      {stay.location || "—"}
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {stay.description || "No description available."}
                    </p>

                    {/* Actions */}
                    <div className="mt-4 flex justify-end gap-3 text-gray-500">
                      <button className="hover:text-orange-500">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="hover:text-orange-500"
                        onClick={() => {
                          setEditStay(stay);
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
                  No stays found.
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
          setEditStay(null);
          refetch();
        }}
        initialStep="stay"
        updateId={editStay?.id}
        editData={editStay}
      />
    </div>
  );
}
