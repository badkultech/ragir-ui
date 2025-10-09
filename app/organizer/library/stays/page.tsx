"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, MapPin, Pencil, Eye, Trash2 } from "lucide-react";
import { AddNewItemModal } from "@/components/library/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";

const mockStays = [
  {
    id: 1,
    title: "Taj Hotel",
    location: "Mumbai, Maharashtra",
    description:
      "Luxury 5-star hotel with ocean view rooms and premium amenities",
    image: null, // or image URL if available
  },
  {
    id: 2,
    title: "Beach Resort",
    location: "Goa",
    description: "Seaside resort with private beach and spa services",
    image: null,
  },
  {
    id: 3,
    title: "Mountain Retreat",
    location: "Manali, Himachal Pradesh",
    description: "Peaceful retreat surrounded by mountains and pine forests",
    image: null,
  },
];

export default function StaysPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = mockStays.filter((stay) =>
    stay.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="Stays" />

        <main className="flex-1 p-6 md:p-8">
          {/* Header */}
          <LibraryHeader
            buttonLabel="Add stay"
            onAddClick={() => setModalOpen(true)}
            title="Ragir Library"
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
            {filtered.map((stay) => (
              <div
                key={stay.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  {stay.image ? (
                    <img
                      src={stay.image}
                      alt={stay.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900">{stay.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                    {stay.location}
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {stay.description}
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
                No stays found.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add New Item Modal */}
      <AddNewItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialStep="stay"
      />
    </div>
  );
}
