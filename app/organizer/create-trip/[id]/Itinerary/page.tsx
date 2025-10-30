"use client";

import { useState, useEffect } from "react";
import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader";
import { AppHeader } from "@/components/app-header";
import { DetailsOptions } from "@/components/create-trip/addDetails";
import { WizardFooter } from "@/components/create-trip/wizard-footer";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FileUploadCard } from "@/components/create-trip/file-upload-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CustomDateTimePicker } from "@/components/ui/date-time-picker";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { useLazyGetTripByIdQuery } from "@/lib/services/organizer/trip/library/create-trip";

// Type for each day
interface Day {
  day: number;
  date: string;
}

export default function ItineraryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { id } = useParams()
  console.log("router prarams query====from itinerary",id)

  const startDateParam = searchParams.get("startDate") || new Date().toISOString();
  const endDateParam = searchParams.get("endDate") || new Date().toISOString();
  const totalDaysParam = parseInt(searchParams.get("totalDays") || "1", 10);

  // Normalize startDate from query param
  const normalizeDate = (value: string) => {
    if (!value) return "2025-09-20T09:00";
    // Try ISO format
    let d = new Date(value);
    if (!isNaN(d.getTime())) return value;

    // Try DD/MM/YYYY format
    const parts = value.split("/");
    if (parts.length === 3) {
      const iso = `${parts[2]}-${parts[1]}-${parts[0]}T09:00`; // default 9 AM
      d = new Date(iso);
      if (!isNaN(d.getTime())) return iso;
    }

    // fallback
    return "2025-09-20T09:00";
  };

  const startDateParamRaw = searchParams.get("startDate") || "2025-09-20T09:00";

  const [startDate, setStartDate] = useState(startDateParam);
  const [endDate, setEndDate] = useState(endDateParam);
  const [days, setDays] = useState<Day[]>([]);
  const [showDetails, setShowDetails] = useState<boolean[]>([]);
  const [startingPoint, setStartingPoint] = useState("Mumbai");
  const [endPoint, setEndPoint] = useState("Goa");
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const tripIdFromUrl = searchParams.get("tripId");
  const [triggerGetTrip, { data: tripData, isLoading, isError }] = useLazyGetTripByIdQuery();

  // 🧭 New function to fetch trip only when Prev is clicked
  const handlePrevClick = async () => {
    const storedTripId = localStorage.getItem("createdTripId");
    const organizationId = localStorage.getItem("organizationId");
    const tripId = tripIdFromUrl || storedTripId;

    if (tripId && organizationId) {
      console.log("🔄 Fetching trip before going back...");
      await triggerGetTrip({ organizationId, tripId });
    } else {
      console.log("❌ Missing tripId or organizationId");
    }

    router.push("/organizer/create-trip");
  };


  // Generate days dynamically & auto calculate endDate
  useEffect(() => {
    if (!startDate) return;
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return;

    // Generate days
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

    // Calculate endDate
    const lastDate = new Date(start);
    lastDate.setDate(start.getDate() + totalDaysParam - 1);
    setEndDate(lastDate.toISOString().slice(0, 16)); // YYYY-MM-DDTHH:mm
  }, [startDate, totalDaysParam]);

  const handleAddDetails = (idx: number) => {
    setShowDetails((prev) => prev.map((val, i) => (i === idx ? true : val)));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
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
                  <span className="text-gray-400 font-normal ml-2">
                    {d.date}
                  </span>
                </div>

                {/* First day start point & datetime */}
                {dayIdx === 0 && (
                  <div className="bg-gray-50 rounded-lg px-4 py-3 mb-2 flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <Label className="text-sm block mb-1 font-medium">
                        Start Point *
                      </Label>
                      <Input
                        type="text"
                        value={startingPoint}
                        onChange={(e) => setStartingPoint(e.target.value)}
                        placeholder="Enter starting location"
                        className="w-full border px-3 py-2 rounded-lg outline-none text-sm"
                      />
                    </div>

                    <CustomDateTimePicker
                      value={startDate}
                      onChange={setStartDate}
                      placeholder="Select start date & time"
                      className="mt-3 self-end w-full"


                    />
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

            {/* End point & endDate */}
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

              <CustomDateTimePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="Select end date & time"
                className="mt-3 self-end w-full"

              />

            </div>
          </div>

          <div className="pr-9">
            <WizardFooter
              onPrev={handlePrevClick}
              onDraft={() => console.log("Draft itinerary saved")}
              onNext={() => router.push("/organizer/create-trip/exclusions")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
