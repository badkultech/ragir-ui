"use client";

import { useEffect, useState, useCallback } from "react";
import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader";
import { AppHeader } from "@/components/app-header";
import { DetailsOptions } from "@/components/create-trip/detailsOption/addDetails";
import { WizardFooter } from "@/components/create-trip/wizard-footer";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FileUploadCard } from "@/components/create-trip/file-upload-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CustomDateTimePicker } from "@/components/ui/date-time-picker";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";

import {
  useLazyGetItineraryByTripIdQuery,

  useUpdateItineraryMutation,
} from "@/lib/services/organizer/trip/itinerary";
import {
  useLazyGetItineraryDayDetailsQuery,
  useUpdateItineraryDayDetailMutation
} from "@/lib/services/organizer/trip/itinerary/day-details";

type Day = { day: number; date: string };
type TripItem = any;

export default function ItineraryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id: tripId } = useParams();
  const { userData } = useSelector(selectAuthState);

  const organizationId = userData?.organizationPublicId ?? "";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [days, setDays] = useState<Day[]>([]);
  const [showDetails, setShowDetails] = useState<boolean[]>([]);
  const [startingPoint, setStartingPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || new Date().toISOString()
  );
  const [endDate, setEndDate] = useState(
    searchParams.get("endDate") || new Date().toISOString()
  );
  const [dayDetailIds, setDayDetailIds] = useState<Record<number, string>>(
    {}
  );
  const [dayItemsMap, setDayItemsMap] = useState<
    Record<number, TripItem[] | null>
  >({});

  const totalDaysParam = parseInt(searchParams.get("totalDays") || "1", 10);

  const [triggerGetItineraryByTripId] = useLazyGetItineraryByTripIdQuery();
  const [triggerGetItineraryDayDetails] = useLazyGetItineraryDayDetailsQuery();
  const [updateDayDetail] = useUpdateItineraryDayDetailMutation();
  const [updateItinerary] = useUpdateItineraryMutation();

  useEffect(() => {
    const fetch = async () => {
      if (!organizationId || !tripId) return;

      try {
        console.log("📥 Fetching itinerary (single call)...");
        // GET itinerary (main). If you already have endpoint that returns data.data or similar,
        // adapt unwrap/structure accordingly.
        const itResp = await triggerGetItineraryByTripId({
          organizationId,
          tripPublicId: tripId as string,
        }).unwrap();

        const itData = (itResp as any) ?? {};
        // the API you showed earlier had response: { status, message, data: { ... } }
        // some RTK queries might already return data.data; adjust as needed.

        const payload = itData.data ?? itData; // make tolerant
        setStartingPoint(payload.startPoint ?? "");
        setEndPoint(payload.endPoint ?? "");
        // Set start/end ISO if available
        if (payload.startDate && payload.startTime) {
          setStartDate(`${payload.startDate}T${payload.startTime}`);
        }
        if (payload.endDate && payload.endTime) {
          setEndDate(`${payload.endDate}T${payload.endTime}`);
        }

        // Generate days by totalDays or fallback to totalDaysParam
        const totalDays = payload.totalDays ?? totalDaysParam ?? 1;
        const baseDateStr = payload.startDate ?? new Date().toISOString();
        const generatedDays: Day[] = Array.from({ length: totalDays }, (_, i) => {
          const d = new Date(baseDateStr);
          d.setDate(d.getDate() + i);
          return {
            day: i + 1,
            date: d.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
          };
        });
        setDays(generatedDays);
        setShowDetails(Array(generatedDays.length).fill(false));

        // If itinerary contains dayDetailResponseList -> map them
        const idsMap: Record<number, string> = {};
        (payload.dayDetailResponseList ?? []).forEach((d: any) => {
          if (d.dayNumber && d.id) idsMap[d.dayNumber] = String(d.id);
        });
        setDayDetailIds((prev) => ({ ...prev, ...idsMap }));

        // Now fetch day-details endpoint which returns array of day details with tripItems
        const dayDetailsResp = await triggerGetItineraryDayDetails({
          organizationId,
          tripPublicId: tripId as string,
        }).unwrap();

        const ddData = (dayDetailsResp as any)?.data ?? dayDetailsResp ?? [];
        // ddData is an array of { id, dayNumber, date, tripItems }

        const map: Record<number, TripItem[] | null> = {};
        ddData.forEach((d: any) => {
          map[d.dayNumber] = Array.isArray(d.tripItems) ? d.tripItems : null;
          // ensure we also set dayDetailIds if missing
          if (d.dayNumber && d.id && !idsMap[d.dayNumber]) {
            idsMap[d.dayNumber] = String(d.id);
          }
        });

        setDayItemsMap(map);
        setDayDetailIds((prev) => ({ ...prev, ...idsMap }));

        console.log("✅ itinerary & day-details loaded", { idsMap, map });
      } catch (err) {
        console.error("❌ Failed to fetch itinerary/day-details:", err);
      }
    };

    fetch();
  }, [organizationId, tripId]);

  const applyLocalChange = useCallback(
    (op: "create" | "update" | "delete", dayNumber: number, item: any) => {
      setDayItemsMap((prev) => {
        const copy = { ...(prev ?? {}) };
        const list = Array.isArray(copy[dayNumber]) ? [...copy[dayNumber]] : [];

        if (op === "create") {
          list.unshift(item);
        }

        if (op === "update") {
          const idx = list.findIndex(
            (x) => x.id === item.id || x.tripItemId === item.id
          );
          if (idx >= 0) {
            list[idx] = { ...list[idx], ...item };
          } else {
            list.unshift(item);
          }
        }

        if (op === "delete") {
          copy[dayNumber] = list.filter(
            (x) => x.id !== item.id && x.tripItemId !== item.id
          );
          return copy;
        }

        copy[dayNumber] = list;
        return copy;
      });
    },
    []
  );

  const handleAddDetailsClick = (idx: number) => {
    const copy = [...showDetails];
    copy[idx] = true;
    setShowDetails(copy);
  };

  const handlePrevClick = async () => {
    const orgId = localStorage.getItem("organizationId");
    if (tripId && orgId) {
    }
    router.push(`/organizer/create-trip/${tripId}`);
  };
  const formatTime = (date: Date) =>
    `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

  const handleUpdateItinerary = async () => {
    if (!organizationId || !tripId) return;
    try {
      const fd = new FormData();
      fd.append("startPoint", startingPoint);
      fd.append("endPoint", endPoint);
      fd.append("startDate", startDate.split("T")[0]);
      fd.append("endDate", endDate.split("T")[0]);
      fd.append("startTime", formatTime(new Date(startDate)));
      fd.append("endTime", formatTime(new Date(endDate)));
      await updateItinerary({ organizationId, tripPublicId: tripId as string, data: fd as unknown as any }).unwrap();
      router.push(`/organizer/create-trip/${tripId}/exclusions`);
    } catch (err) {
      console.error("❌ Failed to update itinerary:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <OrganizerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 w-full min-h-screen flex flex-col">
        <AppHeader title="Create New Trip" />
        <TripStepperHeader activeStep={2} />

        <div className="p-8 bg-white">
          <div className="max-w-full mx-auto bg-white shadow rounded-2xl p-8 overflow-x-hidden">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Itinerary</h2>

            <FileUploadCard accept="application/pdf" maxSizeMB={10} initialMeta={null} onSelect={() => { }} onMetaChange={() => { }} />

            {days.map((d, dayIdx) => {
              const itemsForDay = dayItemsMap[d.day] ?? null;
              return (
                <div key={d.day} className="mb-4">
                  <div className="rounded-lg bg-orange-50 px-4 py-2 font-semibold text-orange-700 mb-2 text-[15px]">
                    Day {d.day} <span className="text-gray-400 font-normal ml-2">{d.date}</span>
                  </div>

                  {dayIdx === 0 && (
                    <div className="bg-gray-50 rounded-lg px-4 py-3 mb-2 flex flex-col sm:flex-row gap-2">
                      <div className="flex-1">
                        <Label className="text-sm block mb-1 font-medium">Start Point *</Label>
                        <Input type="text" value={startingPoint} onChange={(e) => setStartingPoint(e.target.value)} placeholder="Enter starting location" className="w-full" />
                      </div>
                      <CustomDateTimePicker value={startDate} onChange={setStartDate} placeholder="Select start date & time" className="mt-3 self-end w-full" />
                    </div>
                  )}

                  {!showDetails[dayIdx] ? (
                    <button className="rounded-full px-5 py-1.5 mt-2 text-white bg-gradient-to-r from-orange-400 to-pink-500 font-medium shadow" onClick={() => handleAddDetailsClick(dayIdx)}>
                      + Add Details
                    </button>
                  ) : (
                    <>
                      {/* If dayDetailId exists -> show DetailsOptions with items passed down */}
                      {!dayDetailIds[d.day] ? (
                        <p className="text-gray-400 text-sm italic mt-2">⏳ Loading day details for Day {d.day}...</p>
                      ) : (
                        <DetailsOptions
                          key={dayDetailIds[d.day]}
                          organizationId={organizationId || "00000000-0000-0000-0000-000000000000"}
                          tripPublicId={tripId as string}
                          dayDetailId={dayDetailIds[d.day]}
                          items={itemsForDay ?? []}
                          onLocalChange={(op, item) => {
                            applyLocalChange(op, d.day, {
                              ...item,
                              dayNumber: d.day
                            });
                          }}

                        />
                      )}
                    </>
                  )}
                </div>
              );
            })}

            <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4 flex flex-col sm:flex-row gap-2 max-w-full">
              <div className="flex-1 min-w-0">
                <label className="text-sm block mb-1 font-medium">End Point *</label>
                <Input type="text" value={endPoint} onChange={(e) => setEndPoint(e.target.value)} placeholder="Enter ending location" className="w-full max-w-full" />
              </div>
              <CustomDateTimePicker value={endDate} onChange={setEndDate} placeholder="Select end date & time" className="mt-3 self-end w-full" />
            </div>
          </div>

          <div className="pr-9">
            <WizardFooter onPrev={handlePrevClick} onDraft={() => console.log("Draft itinerary saved")} onNext={handleUpdateItinerary} />
          </div>
        </div>
      </div>
    </div>
  );
}
