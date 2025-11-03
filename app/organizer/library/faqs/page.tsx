"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { Pencil, Trash2, HelpCircle, Eye } from "lucide-react";
import { AddNewItemModal } from "@/components/library/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import {
  useGetOrganizerFaqsQuery,
  useDeleteOrganizerFaqMutation,
} from "@/lib/services/organizer/trip/library/faq";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function FAQsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<any>(null);
  const [updateId, setUpdateId] = useState<number | null>(null);

  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: faqs = [], isLoading, refetch } = useGetOrganizerFaqsQuery(
    organizationId ? { organizationId } : skipToken
  );

  const [deleteFaq, { isLoading: isDeleting }] =
    useDeleteOrganizerFaqMutation();

  const handleDelete = async () => {
    if (!selectedFaq) return;
    try {
      debugger
      await deleteFaq({
        organizationId,
        faqId: selectedFaq.id,
      }).unwrap();
      setConfirmOpen(false);
      setSelectedFaq(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete FAQ", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="FAQs" />
        <main className="flex-1 p-6 md:p-8">
          <LibraryHeader
            buttonLabel="Add FAQ"
            onAddClick={() => {
              setUpdateId(null);
              setModalOpen(true);
            }}
          />

          {/* FAQ List */}
          <div className="flex flex-col gap-4 mt-4">
            {isLoading ? (
              <div className="text-center text-gray-500 py-10">
                Loading FAQs...
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No FAQs found.
              </div>
            ) : (
              faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-start gap-4"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-gray-500" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900"><strong>{faq.name}</strong></h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {faq.answer}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 text-gray-500">
                    {/* 👁 View FAQ */}
                    <button
                      className="hover:text-blue-500"
                      onClick={() => {
                        setSelectedFaq(faq);
                        setViewOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* ✏ Edit FAQ */}
                    <button
                      className="hover:text-orange-500"
                      onClick={() => {
                        setUpdateId(faq.id);
                        setModalOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* 🗑 Delete FAQ */}
                    <button
                      className="hover:text-red-500"
                      onClick={() => {
                        setSelectedFaq(faq);
                        setConfirmOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* ➕ Add / ✏ Edit FAQ Modal */}
      <AddNewItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        updateId={updateId}
        initialStep="faq"
      />

      {/* ❌ Confirm Delete Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete FAQ</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Are you sure you want to delete <br />
            <strong>“{selectedFaq?.name}”</strong>? <br />
            This action cannot be undone.
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

      {/* 👁 View FAQ Modal (your original design kept) */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-2xl rounded-2xl p-6">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-lg font-bold text-gray-900">
              <strong>{selectedFaq?.name}</strong>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-5">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Full Answer
            </h4>
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
              {selectedFaq?.answer}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
