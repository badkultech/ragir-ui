"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { tripSteps } from "@/lib/common/stepperConfig";
import { Stepper } from "@/components/trip/stepper";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";

export default function ReviewPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [isConfirmed, setIsConfirmed] = useState(false);

  // Trip summary placeholder data
  const tripSummary = {
    name: "Himalaya",
    dates: "25-09-25 to 29-09-25",
    duration: "5 Days | 6 Nights",
    groupSize: "8 - 12 people",
    ageRange: "18 - 56 years",
    leader: "Not Assigned",
    type: "Advanced",
  };

  const handleSubmit = () => {
    if (!isConfirmed) return;
    // TODO: Call API to submit trip
    alert("Trip submitted successfully ✅");
    router.push("/dashboard"); // or wherever you want to redirect
  };

  const handlePrevious = () => {
    const currentIndex = tripSteps.findIndex((s) => s.path === pathname);
    if (currentIndex > 0) {
      router.push(tripSteps[currentIndex - 1].path);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Create New Trip" />
        <main className="flex-1 p-8">
          <Stepper />

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Review & Submit</h2>

            {/* Trip Summary */}
            <div className="border rounded-lg p-6 mb-4">
              <h3 className="font-semibold mb-4">Trip Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Trip Name:</span>
                  <span>{tripSummary.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Travel Dates:</span>
                  <span>{tripSummary.dates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Itinerary Duration:</span>
                  <span>{tripSummary.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Group Size:</span>
                  <span>{tripSummary.groupSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Age Range:</span>
                  <span>{tripSummary.ageRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Leader:</span>
                  <span>{tripSummary.leader}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Itinerary Type:</span>
                  <span>{tripSummary.type}</span>
                </div>
              </div>
            </div>

            {/* Confirmation */}
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isConfirmed}
                onCheckedChange={(checked) => setIsConfirmed(!!checked)}
              />
              <span className="text-sm">
                I confirm that all the information provided is accurate and complete
              </span>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              className="px-6 py-2 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-100"
              onClick={handlePrevious}
            >
              ← Previous
            </Button>

            <div className="space-x-3">
              <Button
                variant="outline"
                className="px-6 py-2 rounded-full border"
              >
                Save as Draft
              </Button>
              <Button
                disabled={!isConfirmed}
                className={`px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white ${
                  !isConfirmed ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSubmit}
              >
                Submit →
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
