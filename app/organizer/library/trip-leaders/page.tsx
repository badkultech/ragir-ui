"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Eye } from "lucide-react";
import { AddNewItemModal } from "@/components/library/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { useGetGroupLeaderByIdQuery, useGetGroupLeadersQuery } from "@/lib/services/organizer/trip/library/leader";
import { ViewLeaderModal } from "@/components/library/ViewLeaderModal";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { skipToken } from "@reduxjs/toolkit/query";

export default function TripLeadersPage() {
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedLeaderId, setSelectedLeaderId] = useState<number | null>(null);
  const { data: selectedLeader, isLoading: isLeaderLoading } =
    useGetGroupLeaderByIdQuery(
      selectedLeaderId && organizationId
        ? { organizationId, leaderId: selectedLeaderId }
        : skipToken // prevents running when null
    );

  const { data: leaders = [], isLoading, refetch } =
    useGetGroupLeadersQuery(organizationId);

  const filtered = leaders.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleModalClose = (shouldRefresh?: boolean) => {
    setModalOpen(false);
    if (shouldRefresh) refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading leaders from library...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Group Leader Library" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 md:p-8">
          <LibraryHeader
            buttonLabel="Add Group Leader"
            onAddClick={() => setModalOpen(true)}
          />

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search Library.."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 rounded-full border-gray-200 bg-gray-50 text-sm"
            />
          </div>

          {/* List */}
          <div className="flex flex-col gap-3">
            {filtered.length > 0 ? (
              filtered.map((leader) => (
                <div
                  key={leader.id}
                  className="flex items-start justify-between bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition"
                >
                  {/* Left section: Avatar + Content */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      {leader.documents && leader.documents[0]?.url ? (
                        <img
                          src={leader.documents[0].url}
                          alt={leader.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No Img</span>
                      )}
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col justify-center">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {leader.name}
                      </h3>
                      {leader.tagline && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          {leader.tagline}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1 max-w-xl">
                        {leader.bio}
                      </p>
                    </div>
                  </div>

                  {/* Right section: Actions */}
                  <div className="flex items-end gap-3 ml-4 self-end text-gray-400">
                    <button
                      title="Edit"
                      className="hover:text-orange-500 transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="hover:text-orange-500"
                      onClick={() => {
                        setSelectedLeaderId(leader.id);
                        setViewModalOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      title="Delete"
                      className="hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10 text-sm">
                No group leaders found in library.
              </div>
            )}
          </div>
        </main>
      </div>
      <ViewLeaderModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedLeaderId(null);
        }}
        leader={selectedLeader ?? null} // ✅ convert undefined → null
      />
      <AddNewItemModal
        open={modalOpen}
        onClose={() => handleModalClose(true)}
        initialStep="trip-leader"
      />
    </div>
  );
}
