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
    <div className="w-full">
      <div
        className="
          bg-card border border-border rounded-2xl 
          p-6 md:p-10 
          min-h-[70vh]
          w-full
        "
      >
        <h2 className="text-lg font-semibold md:hidden mb-6">Security</h2>
        <div className="max-w-xl space-y-6">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="
              w-full flex items-center gap-3 px-4 py-4 
              bg-white border border-border 
              rounded-xl hover:bg-muted transition
            "
          >
            <LogOut className="w-5 h-5 text-foreground" />
            <span className="text-sm font-medium text-foreground">Log Out</span>
          </button>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3">
              Account Management
            </h3>

            <div className="space-y-4">
              <div
                className="
                  flex items-center justify-between 
                  px-4 py-4 
                  rounded-xl 
                  border border-[#F6E7B5] 
                  bg-[#FFF9E6]
                "
              >
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
                  className="
                    px-4 py-2 
                    rounded-lg text-sm font-medium 
                    border border-[#E6D38B] bg-white
                    hover:bg-[#F9F0C8] transition
                  "
                >
                  Deactivate
                </button>
              </div>
              <div
                className="
                  flex items-center justify-between 
                  px-4 py-4 
                  rounded-xl 
                  border border-[#F7CBC7] 
                  bg-[#FFECEB]
                "
              >
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Delete Account
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="
                    px-4 py-2 
                    rounded-lg text-sm font-medium 
                    border border-[#E7A9A5] bg-white
                    hover:bg-[#F9D4D2] transition
                  "
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
