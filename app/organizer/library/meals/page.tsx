"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, MapPin, Pencil, Eye, Trash2 } from "lucide-react";
import { AddNewItemModal } from "@/components/library/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";

const mockMeals = [
  {
    id: 1,
    title: "Trishna Restaurant",
    location: "Mumbai, Maharashtra",
    mealType: "Breakfast",
    description:
      "Contemporary Indian seafood cuisine with innovative preparations",
    image: null,
  },
  {
    id: 2,
    title: "Bademiya",
    location: "Mumbai, Maharashtra",
    mealType: "Dinner",
    description: "Famous for kebabs and late-night street food experience",
    image: null,
  },
  {
    id: 3,
    title: "Anand Stall",
    location: "Mumbai, Maharashtra",
    mealType: "Lunch",
    description: "Popular for vada pav and quick local bites",
    image: null,
  },
];

export default function MealsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = mockMeals.filter((meal) =>
    meal.title.toLowerCase().includes(search.toLowerCase())
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
        <AppHeader title="Meals" />

        <main className="flex-1 p-6 md:p-8">
          {/* Header */}
          <LibraryHeader
            buttonLabel="Add meal"
            onAddClick={() => setModalOpen(true)}
          />

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search Library..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((meal) => (
              <div
                key={meal.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  {meal.image ? (
                    <img
                      src={meal.image}
                      alt={meal.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col relative">
                  <h3 className="font-semibold text-gray-900">{meal.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                    {meal.location}
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {meal.description}
                  </p>

                  {/* Meal Type Tag */}
                  <span className="absolute top-4 right-4 bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                    {meal.mealType}
                  </span>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end gap-3 text-gray-500">
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
                No meals found.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add New Item Modal */}
      <AddNewItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialStep="meal"
      />
    </div>
  );
}
