"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { usePathname, useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AddFromLibraryModal } from "@/components/add-from-library-modal";
import { Stepper } from "@/components/trip/stepper";
import { tripSteps } from "@/lib/common/stepperConfig";

export default function ItineraryPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [startingPoint, setStartingPoint] = useState("Mumbai");
  const [startDate, setStartDate] = useState("20/09/2025");
  const [endPoint, setEndPoint] = useState("Goa");
  const [endDate, setEndDate] = useState("20/09/2025");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const tripDays = [
    { day: 1, date: "Saturday, March 15, 2025" },
    { day: 2, date: "Sunday, March 16, 2025" },
    { day: 3, date: "Monday, March 17, 2025" },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAddEvent = (day: number) => {
    setShowAddModal(true);
  };

  const handlePrevious = () => {
    router.push("/organizer/create-trip");
  };

  const handleSaveAsDraft = () => {
    console.log("Saving itinerary as draft");
  };
  const handleSaveAndNext = () => {
    const currentIndex = tripSteps.findIndex((s) => s.path === pathname);
    if (currentIndex < tripSteps.length - 1) {
      router.push(tripSteps[currentIndex + 1].path);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Create New Trip" />

        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              <Stepper />
            </div>

            <h1 className="text-2xl font-semibold text-gray-900 mb-8">
              Itinerary
            </h1>

            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Upload PDF Itinerary (Upto 4)
                </h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <div className="mb-4">
                    <svg
                      className="w-8 h-8 mx-auto text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Choose File
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : "no file selected"}
                  </p>
                </div>
                <p className="text-center text-gray-500 mt-4">
                  Or create itinerary below
                </p>
              </div>

              <div>
                <Label className="text-lg font-medium text-gray-900 mb-4 block">
                  Start Point *
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={startingPoint}
                    onChange={(e) => setStartingPoint(e.target.value)}
                    placeholder="Enter starting location"
                    className="bg-gray-50 border-gray-200"
                  />
                  <div className="relative">
                    <Input
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="Select date"
                      className="bg-gray-50 border-gray-200 pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {tripDays.map((day) => (
                  <div
                    key={day.day}
                    className="bg-orange-50 rounded-lg p-4 border border-orange-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Day {day.day}
                        </h3>
                        <p className="text-sm text-gray-600">{day.date}</p>
                      </div>
                      <Button
                        onClick={() => handleAddEvent(day.day)}
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      >
                        + Add Event
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Label className="text-lg font-medium text-gray-900 mb-4 block">
                  End Point *
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={endPoint}
                    onChange={(e) => setEndPoint(e.target.value)}
                    placeholder="Enter ending location"
                    className="bg-gray-50 border-gray-200"
                  />
                  <div className="relative">
                    <Input
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="Select date"
                      className="bg-gray-50 border-gray-200 pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-orange-600 mt-2">
                  Tuesday, March 18, 2025
                </p>
              </div>

              <div className="flex items-center justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="px-6 py-2 border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
                >
                  ← Previous
                </Button>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handleSaveAsDraft}
                    className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={handleSaveAndNext}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    Save & Next →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add from Library Modal */}
      <AddFromLibraryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
