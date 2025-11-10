"use client";

import { useState, useMemo } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { MapPin, Pencil, Eye, Trash2 } from "lucide-react";
import { AddNewItemModal } from "@/components/library/add-new-item/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { ViewModal } from "@/components/library/ViewModal";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useDeleteDayDescriptionMutation,
  useGetDayDescriptionByIdQuery,
  useGetDayDescriptionsQuery,
} from "@/lib/services/organizer/trip/library/day-description";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useDebounce } from "@/hooks/useDebounce";

export default function EventsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<any>(null);

  const organizationId = useOrganizationId();

  const { data: dayDescriptions } = useGetDayDescriptionsQuery(
    organizationId || skipToken
  );

  const { data: selectedDay } = useGetDayDescriptionByIdQuery(
    selectedDayId && organizationId
      ? { organizationId, dayDescriptionId: selectedDayId }
      : skipToken
  );

  const [deleteOrganizerDayDescription] = useDeleteDayDescriptionMutation();

  // ✅ Debounced search value (wait 300ms after typing stops)
  const debouncedSearch = useDebounce(search, 300);

  // ✅ Filter only when ≥3 characters entered
  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();

    // If less than 3 chars, return everything
    if (q.length < 3) return dayDescriptions || [];

    return (dayDescriptions || []).filter((d) => {
      const name = (d.name || "").toLowerCase();
      const loc = (d.location || "").toLowerCase();
      const desc = (d.description || "").toLowerCase();
      return name.includes(q) || loc.includes(q) || desc.includes(q);
    });
  }, [dayDescriptions, debouncedSearch]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        <AppHeader title="Events" />

        <main className="flex-1 p-6 md:p-4">
          {/* Header (controlled search) */}
          <LibraryHeader
            title="Ragir Library"
            buttonLabel="Add Item"
            onAddClick={() => {
              setUpdateId(null);
              setModalOpen(true);
            }}
            searchValue={search}
            onSearchChange={(v) => setSearch(v)}
            width={540}
          />

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map((dayDescription) => (
                <div
                  key={dayDescription.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 overflow-hidden flex flex-col"
                >
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    {dayDescription.documents?.[0]?.url ? (
                      <img
                        src={dayDescription.documents[0].url}
                        alt={dayDescription.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>

                  <div className="pt-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900">
                      <strong>{dayDescription.name}</strong>
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      {dayDescription.location}
                    </div>
                    <p
                      className="text-sm text-gray-500 mt-4 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: dayDescription.description || "",
                      }}
                    />

                    <div className="flex justify-end gap-3 text-gray-500 mt-3">
                      <button
                        className="hover:text-orange-500"
                        onClick={() => {
                          setSelectedDayId(dayDescription.id);
                          setViewModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        className="hover:text-orange-500"
                        onClick={() => {
                          setUpdateId(dayDescription.id);
                          setModalOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="hover:text-red-500"
                        onClick={() => {
                          deleteOrganizerDayDescription({
                            dayDescriptionId: dayDescription.id,
                            organizationId,
                          }).unwrap();
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                {debouncedSearch.length < 3
                  ? "Type at least 3 characters to search."
                  : "No events found."}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add New Item Modal */}
      <AddNewItemModal
        open={modalOpen}
        updateId={updateId}
        onClose={() => setModalOpen(false)}
        initialStep="event"
      />

      <ViewModal
        step="day-description"
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedDayId(null);
        }}
        data={selectedDay}
      />
    </div>
  );
}
