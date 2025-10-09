"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { AddNewItemModal } from "@/components/library/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";

const mockLeaders = [
  {
    id: 1,
    name: "Arjun Sharma",
    tagline: "Adventure Specialist",
    bio: "5+ years experience in mountain trekking and water sports. Certified wilderness first aid.",
    skills: ["Trekking"],
    image: null,
  },
  {
    id: 2,
    name: "Neha Kapoor",
    tagline: "Cultural Tour Guide",
    bio: "Expert in heritage walks and cultural exploration across India.",
    skills: ["Culture"],
    image: null,
  },
];

export default function TripLeadersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = mockLeaders.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        <AppHeader title="Trip Leaders" />
        <main className="flex-1 p-6 md:p-8">
          {/* Header */}
          <LibraryHeader
            buttonLabel="Add trip leader"
            onAddClick={() => setModalOpen(true)}
          />
          {/* Search */}
          {/* <div className="mb-6">
            <Input
              placeholder="Search leaders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div> */}

          {/* List */}
          <div className="flex flex-col gap-4">
            {filtered.map((leader) => (
              <div
                key={leader.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-start gap-4"
              >
                {/* Avatar */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {leader.image ? (
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Img</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{leader.name}</h3>
                  <p className="text-sm text-gray-600">{leader.tagline}</p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {leader.bio}
                  </p>
                  {leader.skills && (
                    <div className="mt-2 text-xs text-gray-400">
                      {leader.skills.join(", ")}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 text-gray-500">
                  <button className="hover:text-orange-500">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                No trip leaders found.
              </div>
            )}
          </div>
        </main>
      </div>
      <AddNewItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialStep="trip-leader"
      />
    </div>
  );
}
