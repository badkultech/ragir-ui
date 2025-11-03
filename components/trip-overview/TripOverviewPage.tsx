"use client";

import { useState } from "react";
import TripTabs from "./TripTabs";
import TripFilterBar from "./TripFilterBar";
import TripCard from "./TripCard";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
export default function TripOverviewPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [openDelete, setOpenDelete] = useState(false);

  // Example trips data (you can replace with real API data)
  const trips = [
    {
      id: 1,
      title: "Ladakh Adventure – Complete Leh Circuit with Nubra Valley",
      location: "Ladakh",
      date: "25 Oct, 2025 – 30 Oct, 2025",
      duration: "4D/3N",
      views: 300,
      queries: 300,
      leads: 300,
      queryCount: 12,
      leadCount: 12,
      status: "Published",
    },
    {
      id: 2,
      title: "Goa Beach Adventure with Water Sports",
      location: "Goa",
      date: "25 Oct, 2025 – 30 Oct, 2025",
      duration: "4D/3N",
      views: 300,
      queries: 300,
      leads: 300,
      queryCount: 12,
      leadCount: 12,
      status: "Under Review",
    },
    {
      id: 3,
      title: "Rishikesh Adventure – Rafting & Camping Experience",
      location: "Rishikesh",
      date: "25 Oct, 2025 – 30 Oct, 2025",
      duration: "4D/3N",
      views: 300,
      queries: 300,
      leads: 300,
      queryCount: 12,
      leadCount: 12,
      status: "Requires Modification",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <TripTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Deleted warning banner */}
      {activeTab === "deleted" && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
          Deleted trips will remain in the Deleted section for 60 days before
          being permanently removed.
        </div>
      )}

      {/* Filter Toolbar (dynamic) */}
      <TripFilterBar tab={activeTab} />

      {/* Trip Cards */}
      <div className="space-y-5">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            tab={activeTab}
            onDelete={() => setOpenDelete(true)}
            onArchive={() => console.log("Archive", trip.id)}
          />
        ))}
      </div>

      {/* Confirm Deletion Modal */}
      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      />
    </div>
  );
}
