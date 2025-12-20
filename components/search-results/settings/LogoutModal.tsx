"use client";

import { LogOut } from "lucide-react";

type LogoutModalProps = {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export default function LogoutModal({
  open,
  onClose,
  onLogout,
}: LogoutModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card p-6 rounded-2xl w-full max-w-sm text-center">
        <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4">
          <LogOut className="w-8 h-8 text-[#757575]" />
        </div>

        <h3 className="text-lg font-semibold mb-2">Log Out</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to log out?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-3 hover:bg-muted"
          >
            Cancel
          </button>

          <button
            onClick={onLogout}
            className="
              flex flex-1 items-center justify-center gap-2
              bg-foreground text-white py-3 rounded-lg
              text-sm font-medium
              hover:opacity-90 transition
            "
          >
            <LogOut className="w-5 h-5 text-white" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
