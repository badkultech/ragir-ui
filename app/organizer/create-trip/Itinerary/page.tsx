"use client";

import { useState, useEffect } from "react";
import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader";
import { Sidebar } from "@/components/organizer/sidebar";
import { AppHeader } from "@/components/app-header";
import { DetailsOptions } from "@/components/create-trip/addDetails";
import { WizardFooter } from "@/components/create-trip/wizard-footer";
import { useRouter, useSearchParams } from "next/navigation";
import { FileUploadCard } from "@/components/create-trip/file-upload-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Type for each day
interface Day {
  day: number;
  date: string;
}

export default function ItineraryPage() {
  const searchParams = useSearchParams();
  const startDateParam = searchParams.get("startDate") || "2025-09-20T09:00";
  const totalDaysParam = parseInt(searchParams.get("totalDays") || "5", 10);

  const router = useRouter();
  const [startDate, setStartDate] = useState(startDateParam);
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState<Day[]>([]);
  const [showDetails, setShowDetails] = useState<boolean[]>([]);
  const [startingPoint, setStartingPoint] = useState("Mumbai");
  const [endPoint, setEndPoint] = useState("Goa");

  // Generate days dynamically
  useEffect(() => {
    if (!startDate) return;
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return;

    const generatedDays: Day[] = [];
    for (let i = 0; i < totalDaysParam; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const formatted = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      generatedDays.push({ day: i + 1, date: formatted });
    }

    setDays(generatedDays);
    setShowDetails(Array(generatedDays.length).fill(false));

    // Update end date automatically
    const lastDate = new Date(start);
    lastDate.setDate(start.getDate() + totalDaysParam - 1);
    setEndDate(lastDate.toISOString().slice(0, 16)); // YYYY-MM-DDTHH:MM
  }, [startDate, totalDaysParam]);

  // Fix handleAddDetails typing
  const handleAddDetails = (idx: number) => {
    setShowDetails((prev) => prev.map((val, i) => (i === idx ? true : val)));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 w-full min-h-screen flex flex-col ">
        <AppHeader title="Create New Trip" />
        <TripStepperHeader activeStep={2} />

        <div className="p-8 bg-white">
          <div className="max-w-full mx-auto bg-white shadow rounded-2xl p-8 overflow-x-hidden">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Itinerary</h2>

            <FileUploadCard />

            {days.map((d, dayIdx) => (
              <div key={d.day} className="mb-4">
                <div className="rounded-lg bg-orange-50 px-4 py-2 font-semibold text-orange-700 mb-2 text-[15px]">
                  Day {d.day}{" "}
                  <span className="text-gray-400 font-normal ml-2">{d.date}</span>
                </div>

                {/* First day start point & datetime */}
                {dayIdx === 0 && (
                  <div className="bg-gray-50 rounded-lg px-4 py-3 mb-2 flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <Label className="text-sm block mb-1 font-medium">Start Point *</Label>
                      <Input
                        type="text"
                        value={startingPoint}
                        onChange={(e) => setStartingPoint(e.target.value)}
                        placeholder="Enter starting location"
                        className="w-full border px-3 py-2 rounded outline-none text-sm"
                      />
                    </div>
                    <div className="flex items-center flex-1 gap-2">
                      <Input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border px-3 py-2 mt-6 rounded outline-none text-sm"
                      />
                    </div>
                  </div>
                )}

                {!showDetails[dayIdx] ? (
                  <button
                    className="rounded-full px-5 py-1.5 mt-2 text-white bg-gradient-to-r from-orange-400 to-pink-500 font-medium shadow"
                    onClick={() => handleAddDetails(dayIdx)}
                  >
                    + Add Details
                  </button>
                ) : (
                  <DetailsOptions />
                )}
              </div>
            ))}

            {/* End point */}
            <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4 flex flex-col sm:flex-row gap-2 max-w-full">
              <div className="flex-1 min-w-0">
                <label className="text-sm block mb-1 font-medium">End Point *</label>
                <Input
                  type="text"
                  value={endPoint}
                  onChange={(e) => setEndPoint(e.target.value)}
                  placeholder="Enter ending location"
                  className="w-full max-w-full"
                />
              </div>
              <div className="flex items-center flex-1 gap-2 min-w-0">
                <Input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full max-w-full mt-6"
                />
              </div>
            </div>
          </div>

          <div className="pr-9">
            <WizardFooter
              onPrev={() => router.push("/organizer/create-trip")}
              onDraft={() => console.log("Draft itinerary saved")}
              onNext={() => router.push("/organizer/create-trip/exclusions")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
