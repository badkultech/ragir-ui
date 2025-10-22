"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { Bus, Pencil, Eye, Trash2 } from "lucide-react";
import { AddNewItemModal } from "@/components/library/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
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
} from "@/lib/services/organizer/trip/library/transits";

export default function TransitPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedTransit, setSelectedTransit] = useState<any>(null);
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const { data: transits = [], isLoading, refetch } = useGetOrganizerTransitsQuery(
    organizationId ? { organizationId } : skipToken
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
      setSelectedTransit(null);
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
                  <div className="h-20 bg-gray-50 flex items-center justify-center">
                    <Bus className="w-10 h-10 text-gray-400" />
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
                          setSelectedTransit(t);
                          setViewOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* ✏ Edit */}
                      <button
                        className="hover:text-orange-500"
                        onClick={() => {
                          setSelectedTransit(t);
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
                          setSelectedTransit(t);
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

      {/* 👁 View Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-2xl rounded-2xl p-6">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-lg font-bold text-gray-900">
              {selectedTransit?.fromLocation} → {selectedTransit?.toLocation}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-5 space-y-3 text-sm text-gray-700">
            <p>
              <strong>Vehicle:</strong> {selectedTransit?.vehicleType}
            </p>
            <p>
              <strong>Arranged By:</strong> {selectedTransit?.arrangedBy}
            </p>
            <p>
              <strong>Timing:</strong>{" "}
              {selectedTransit?.startTime} → {selectedTransit?.endTime}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedTransit?.description || "—"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
