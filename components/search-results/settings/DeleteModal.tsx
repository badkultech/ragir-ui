"use client";

import { Trash2 } from "lucide-react";

export default function DeleteModal({ open, onClose }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card p-6 rounded-2xl w-full max-w-sm text-center">
        <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Delete Account?</h3>

        <p className="text-sm text-muted-foreground mb-6">
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-3 hover:bg-muted"
          >
            Cancel
          </button>

          <button className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
