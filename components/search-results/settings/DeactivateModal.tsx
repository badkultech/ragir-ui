"use client";

import { UserX } from "lucide-react";

export default function DeactivateModal({ open, onClose }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card p-6 rounded-2xl w-full max-w-sm text-center">
        <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <UserX className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Deactivate Account?</h3>

        <p className="text-sm text-muted-foreground mb-6">
          You can reactivate anytime by logging back in.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-3 hover:bg-muted"
          >
            Cancel
          </button>

          <button className="flex-1 bg-primary text-white py-3 rounded-lg hover:opacity-90">
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}
