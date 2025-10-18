"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Bus, Pencil, Eye, Trash2, Library } from "lucide-react";
import { AddNewItemModal } from "@/components/library/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";

const mockTransits = [
  {
    id: 1,
    title: "Mumbai → Goa Express",
    vehicle: "Sleeper AC Bus",
    departure: "10:30 PM",
    arrival: "8:00 AM",
  },
  {
    id: 2,
    title: "Delhi → Jaipur Shatabdi",
    vehicle: "Train",
    departure: "6:00 AM",
    arrival: "10:30 AM",
  },
  {
    id: 3,
    title: "Flight AI-123",
    vehicle: "Airplane",
    departure: "2:00 PM",
    arrival: "3:30 PM",
  },
];

export default function TransitPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = mockTransits.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="Transit" />

        <main className="flex-1 p-6 md:p-8">
          {/* Header */}
          <LibraryHeader
            title="Ragir Library"
            buttonLabel="Add transit"
            onAddClick={() => setModalOpen(true)}
          />

          {/* Search */}
          {/* <div className="mb-6">
            <Input
              placeholder="Search Library..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div> */}

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
              >
                {/* Transit icon */}
                <div className="h-20 bg-gray-50 flex items-center justify-center">
                  <Bus className="w-10 h-10 text-gray-400" />
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900">{t.title}</h3>
                  <div className="text-gray-600 text-sm mt-1">{t.vehicle}</div>

                  <p className="text-sm text-gray-500 mt-2">
                    Departure: {t.departure} | Arrival: {t.arrival}
                  </p>

                  {/* Actions */}
                  <div className="mt-4 flex justify-end gap-3 text-gray-500">
                    <button className="hover:text-orange-500">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="hover:text-orange-500">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-10">
                No transit options found.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add New Item Modal */}
      <AddNewItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialStep="transit"
      />
    </div>
  );
}
