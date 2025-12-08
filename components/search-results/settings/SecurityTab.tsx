"use client";

import { LogOut, UserX, Trash2 } from "lucide-react";

interface SecurityTabProps {
  setShowLogoutModal: (v: boolean) => void;
  setShowDeactivateModal: (v: boolean) => void;
  setShowDeleteModal: (v: boolean) => void;
}

export default function SecurityTab({
  setShowLogoutModal,
  setShowDeactivateModal,
  setShowDeleteModal,
}: SecurityTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold md:hidden">Security</h2>

      {/* Logout */}
      <button
        onClick={() => setShowLogoutModal(true)}
        className="w-full flex items-center gap-3 px-4 py-4 bg-card border border-border rounded-xl hover:bg-muted transition"
      >
        <LogOut className="w-5 h-5 text-foreground" />
        <span className="text-sm font-medium text-foreground">Log Out</span>
      </button>

      {/* Account Management */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">
          Account Management
        </h3>

        <div className="space-y-3">
          {/* Deactivate Account */}
          <div className="flex items-center justify-between px-4 py-4 bg-card border border-border rounded-xl">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Deactivate Account
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Temporarily disable your account. You can reactivate it anytime.
              </p>
            </div>

            <button
              onClick={() => setShowDeactivateModal(true)}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition"
            >
              Deactivate
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between px-4 py-4 bg-card border border-border rounded-xl">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Delete Account
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Permanently delete your account and all data. Cannot be undone.
              </p>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
