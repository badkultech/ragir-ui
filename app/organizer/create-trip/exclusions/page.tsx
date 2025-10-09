"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { tripSteps } from "@/lib/common/stepperConfig";
import { Stepper } from "@/components/trip/stepper";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";

const defaultExclusions = [
  "Personal Expenses",
  "Travel Insurance",
  "Tips and Gratuities",
  "Visa and Passport Fees",
  "Meals Not Listed",
];

const suggestedExclusions = [
  "Optional tours & activities",
  "Entrance fees",
  "Camera / Photography",
  "Porterage Services",
];

export default function ExclusionsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [exclusions, setExclusions] = useState<string[]>([
    "Personal Expenses",
    "Travel Insurance",
    "Visa and Passport Fees",
  ]);
  const [customExclusion, setCustomExclusion] = useState("");

  const toggleExclusion = (item: string) => {
    setExclusions((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  const handleAddCustom = () => {
    if (customExclusion.trim() && !exclusions.includes(customExclusion)) {
      setExclusions([...exclusions, customExclusion]);
      setCustomExclusion("");
    }
  };

  const handleSaveAndNext = () => {
    const currentIndex = tripSteps.findIndex((s) => s.path === pathname);
    if (currentIndex < tripSteps.length - 1) {
      router.push(tripSteps[currentIndex + 1].path);
    }
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
            <h2 className="text-xl font-semibold mb-6">Exclusions</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {defaultExclusions.map((item) => (
                <label
                  key={item}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Checkbox
                    checked={exclusions.includes(item)}
                    onCheckedChange={() => toggleExclusion(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {/* Custom Exclusion */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Custom Exclusion</label>
              <div className="flex space-x-2">
                <Input
                  value={customExclusion}
                  onChange={(e) => setCustomExclusion(e.target.value)}
                  placeholder="Enter custom exclusion"
                />
                <Button variant="outline" onClick={handleAddCustom}>
                  + Add
                </Button>
              </div>
            </div>

            {/* Suggested exclusions */}
            <div className="space-y-2">
              {suggestedExclusions.map((item) => (
                <div
                  key={item}
                  className="flex justify-between items-center border rounded-lg p-2 cursor-pointer"
                  onClick={() => toggleExclusion(item)}
                >
                  <span>{item}</span>
                  <span className="text-orange-500 text-xl font-bold">+</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Navigation Buttons */}
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
                className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                onClick={handleSaveAndNext}
              >
                Save & Next →
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
