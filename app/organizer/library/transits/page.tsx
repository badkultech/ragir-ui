"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { Bus, Pencil, Eye, Trash2, Car, MapPin, User } from "lucide-react";
import { AddNewItemModal } from "@/components/library/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useDeleteOrganizerTransitMutation,
  useGetOrganizerTransitsQuery,
  useGetOrganizerTransitByIdQuery,
} from "@/lib/services/organizer/trip/library/transit";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { ViewModal } from "@/components/library/ViewModal";
import { TransitTypeLabels } from "@/lib/services/organizer/trip/library/transit/types";
import { formatTime } from "@/lib/utils/timeUtils";

export default function TransitPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedTransitId, setSelectedTransitId] = useState<number | null>(null);
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const organizationId = useOrganizationId();

  const { data: transits = [], isLoading, refetch } = useGetOrganizerTransitsQuery(
    organizationId ? { organizationId } : skipToken
  );

  const {
    data: selectedTransit,
    isFetching: isTransitLoading,
  } = useGetOrganizerTransitByIdQuery(
    selectedTransitId && organizationId
      ? { organizationId, transitId: selectedTransitId }
      : skipToken
  );


  const [deleteTransit, { isLoading: isDeleting }] =
    useDeleteOrganizerTransitMutation();

  const handleDelete = async () => {
    if (!selectedTransit) return;
    try {
      await deleteTransit({
        organizationId,
        transitId: selectedTransit.id,
      }).unwrap();
      setConfirmOpen(false);
      setSelectedTransitId(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete Transit", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Transit" />

        <main className="flex-1 p-6 md:p-8">
          <LibraryHeader
            title="Ragir Library"
            buttonLabel="Add Transit"
            onAddClick={() => {
              setUpdateId(null);
              setModalOpen(true);
            }}
          />

          {/* Grid: 1 col on xs, 2 cols on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {isLoading ? (
              <div className="col-span-full text-center text-gray-500 py-10">
                Loading transits...
              </div>
            ) : transits.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-10">
                No transits found.
              </div>
            ) : (
              transits.map((t) => (
                <div
                  key={t.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Top strip with icon (kept minimal to match screenshot) */}
                  <div className="px-4 pt-4 pb-0">
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-lg">
                      <Car className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {t.fromLocation} → {t.toLocation}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {TransitTypeLabels[t.vehicleType]}
                        </p>
                      </div>
                    </div>

                    {/* Meta row: times on the left, actions on the right */}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Departure</span>{" "}
                        {formatTime(t.startTime)}{" "}
                        <span className="mx-2">|</span>{" "}
                        <span className="font-medium text-gray-700">Arrival</span>{" "}
                        {formatTime(t.endTime)}
                      </p>

                      <div className="flex items-center gap-3 text-gray-500">
                        <button
                          className="hover:text-orange-500"
                          aria-label={`edit-${t.id}`}
                          onClick={() => {
                            setSelectedTransitId(t.id);
                            setUpdateId(t.id);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          className="hover:text-blue-500"
                          aria-label={`view-${t.id}`}
                          onClick={() => {
                            setViewOpen(true);
                            setSelectedTransitId(t.id);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          className="hover:text-red-500"
                          aria-label={`delete-${t.id}`}
                          onClick={() => {
                            setSelectedTransitId(t.id);
                            setConfirmOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* ➕ Add / ✏ Edit Modal */}
      <AddNewItemModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setUpdateId(null);
        }}
        updateId={updateId}
        initialStep="transit"
      />

      {/* ❌ Confirm Delete Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Transit</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Are you sure you want to delete{" "}
            <strong>
              {selectedTransit?.fromLocation} → {selectedTransit?.toLocation}
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ViewModal
        step="transit"
        open={viewOpen}
        data={selectedTransit}
        onClose={() => {
          setViewOpen(false);
          setSelectedTransitId(null);
        }}
      />
    </div>
  );
}
