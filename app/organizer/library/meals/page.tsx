"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { MapPin, Pencil, Eye, Trash2 } from "lucide-react";
import { AddNewItemModal } from "@/components/library/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { Loader2 } from "lucide-react";
import {
  useDeleteMealMutation,
  useGetMealsQuery,
  useGetMealByIdQuery,
} from "@/lib/services/organizer/trip/library/meal";
import { ViewModal } from "@/components/library/ViewModal";
import { skipToken } from "@reduxjs/toolkit/query";
import { mealTypeLabels } from "@/lib/services/organizer/trip/library/meal/types";

export default function MealsPage() {
  const organizationId = useOrganizationId();

  // ✅ UI States
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);

  // ✅ API Call
  const {
    data: meals = [],
    isLoading,
    isError,
    refetch,
  } = useGetMealsQuery(organizationId);
  const { data: selectedMeal, isFetching: isTransitLoading } =
    useGetMealByIdQuery(
      selectedMealId && organizationId
        ? { organizationId, mealId: selectedMealId }
        : skipToken
    );

  const [deleteMeal] = useDeleteMealMutation();
  const [editMeal, setEditMeal] = useState<any>(null);

  // ✅ Filter search results
  const filtered = meals.filter((meal) =>
    meal.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Delete handler
  const handleDelete = async (mealId: string | number) => {
    if (!confirm("Are you sure you want to delete this meal?")) return;
    try {
      await deleteMeal({ organizationId, mealId }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
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

          {/* Loading & Error States */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading meals...
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 py-10">
              Failed to load meals.{" "}
              <button onClick={() => refetch()} className="underline">
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative px-3 pt-3">
                    <div className="h-32 w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                      {meal?.documents?.[0]?.url ? (
                        <img
                          src={meal.documents[0].url}
                          alt={meal.name}
                          className="w-[95%] h-[95%] object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col relative">
                    <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      {meal.location || "—"}
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {meal.description || "No description available."}
                    </p>

                    {/* Meal Type Tag */}
                    {meal.mealType !== undefined && (
                      <span className="absolute top-4 right-4 bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                        {mealTypeLabels[meal.mealType]}
                      </span>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex justify-end gap-3 text-gray-500">
                      <button
                        className="hover:text-orange-500"
                        onClick={() => {
                          setViewModalOpen(true);
                          setSelectedMealId(meal.id); // ✅ store selected meal ID for viewing
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="hover:text-orange-500"
                        onClick={() => {
                          setEditMeal(meal); // ✅ store meal object for editing
                          setModalOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="hover:text-red-500"
                        onClick={() => handleDelete(meal.id)}
                      >
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
          )}
        </main>
      </div>

      {/* Add New Item Modal */}
      <AddNewItemModal
        open={modalOpen || !!editMeal}
        onClose={() => {
          setModalOpen(false);
          setEditMeal(null);
          refetch();
        }}
        updateId={editMeal?.id}
        initialStep="meal"
        editData={editMeal}
      />
      <ViewModal
        step="meals"
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedMealId(null);
        }}
        data={selectedMeal}
      />
    </div>
  );
}
