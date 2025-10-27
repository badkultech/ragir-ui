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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
                  <div className="h-20 flex px-5 py-2 mb-3">
                    <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-xl">
                      <Car className="w-10 h-10 text-gray-400" />
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900">
                      {t.fromLocation} → {t.toLocation}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {t.vehicleType} ({t.arrangedBy})
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {t.startTime} → {t.endTime}
                    </p>

                    <div className="mt-4 flex justify-end gap-3 text-gray-500">
                      {/* 👁 View */}
                      <button
                        className="hover:text-blue-500"
                        onClick={() => {
                          setSelectedTransitId(t.id);
                          setViewOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* ✏ Edit */}
                      <button
                        className="hover:text-orange-500"
                        onClick={() => {
                          setSelectedTransitId(t.id);
                          setUpdateId(t.id);
                          setModalOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* 🗑 Delete */}
                      <button
                        className="hover:text-red-500"
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

      <Dialog open={viewOpen} onOpenChange={(open) => {
        setViewOpen(open);
        if (!open) setSelectedTransitId(null);
      }}>
        <DialogContent className="max-w-2xl w-[90vw] rounded-2xl p-0 overflow-hidden">
          {isTransitLoading ? (
            <div className="p-10 text-center text-gray-500">
              Loading transit details...
            </div>
          ) : (
            <>
              {/* Header Image */}
              <div className="w-full h-48 bg-gray-100">
                <img
                  src={selectedTransit?.documents?.[0]?.url || "/placeholder-image.jpg"}
                  alt="Transit"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center justify-between">
                    {selectedTransit?.fromLocation} → {selectedTransit?.toLocation}
                  </DialogTitle>
                </DialogHeader>

                {/* Description */}
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {selectedTransit?.description ||
                    "Travel comfortably on this route where your journey is as relaxing as your destination."}
                </p>

                {/* Divider */}
                <div className="border-t my-4" />

                {/* Info Section */}
                <div className="space-y-3 text-sm text-gray-700">
                  {/* Vehicle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Vehicle</span>
                    </div>
                    <span className="text-gray-800">
                      {Array.isArray(selectedTransit?.vehicleType)
                        ? selectedTransit.vehicleType.join(" | ")
                        : selectedTransit?.vehicleType || "—"}
                    </span>
                  </div>

                  {/* Departure */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Departure</span>
                    </div>
                    <span className="text-gray-800">
                      {selectedTransit?.fromLocation || "—"} &nbsp; | &nbsp;
                      {selectedTransit?.startTime || "—"}
                    </span>
                  </div>

                  {/* Arrival */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Arrival</span>
                    </div>
                    <span className="text-gray-800">
                      {selectedTransit?.toLocation || "—"} &nbsp; | &nbsp;
                      {selectedTransit?.endTime || "—"}
                    </span>
                  </div>

                  {/* Mode of Arrangements */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Mode of Arrangements</span>
                    </div>
                    <span className="text-gray-800 text-right">
                      {selectedTransit?.arrangedBy
                        ? `Self Arranged by the ${selectedTransit.arrangedBy.toLowerCase()}`
                        : "—"}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t my-5" />

                {/* Packing Suggestions */}
                {selectedTransit?.packagingSuggestion && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Packing Suggestions
                    </h3>
                    <div
                      className="prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: selectedTransit.packagingSuggestion,
                      }}
                    />
                  </div>
                )}

              </div>
            </>
          )}
        </DialogContent>
      </Dialog>


    </div>
  );
}
