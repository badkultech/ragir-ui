"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDeleteModal({ open, onClose }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Confirm Deletion?
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600 mt-2">
          Once deleted, it will move to Trash and be permanently removed after 60 days.
        </p>

        <DialogFooter className="flex justify-end gap-3 pt-6">
          {/* Cancel button */}
          <Button
            variant="outline"
            onClick={onClose}
            className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg px-5 py-2 text-sm font-medium"
          >
            Cancel
          </Button>

          {/* Delete button */}
          <Button
            onClick={onClose}
            className="bg-[#FF3B00] hover:bg-[#e63500] text-white rounded-lg px-5 py-2 text-sm font-medium"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
