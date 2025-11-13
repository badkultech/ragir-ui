"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader";
import { SectionCard } from "@/components/create-trip/section-card";
import { PillCheckboxGroup } from "@/components/create-trip/pill-checkbox-group";
import { WizardFooter } from "@/components/create-trip/wizard-footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";

import {
  useCreateExclusionMutation,
  useUpdateExclusionMutation,
  useGetAllExclusionsQuery,
} from "@/lib/services/organizer/trip/exclusion";

const DEFAULT_OPTIONS = [
  "Personal Expenses",
  "Travel Insurance",
  "Tips and Gratuities",
  "Visa and Passport Fees",
  "Meals Not Listed",
];

export default function ExclusionsPage() {
  const router = useRouter();
  const params = useParams();

  const organizationId = params.organizationId as string;
  const tripPublicId = params.tripPublicId as string;

  const { data: apiExclusions } = useGetAllExclusionsQuery({
    organizationId,
    tripPublicId,
  });

  const [createExclusion] = useCreateExclusionMutation();
  const [updateExclusion] = useUpdateExclusionMutation();

  const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS);
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [backendMap, setBackendMap] = useState<Record<string, any>>({});

 useEffect(() => {
  if (apiExclusions?.data) {
    const names = apiExclusions.data.map((x) => x.name);

    setOptions((prev) => Array.from(new Set([...prev, ...names])));
    setSelected(names);

    const map: Record<string, any> = {};
    apiExclusions.data.forEach((item) => {
      map[item.name] = item; 
    });
    setBackendMap(map);
  }
}, [apiExclusions]);


  const addCustom = () => {
    const trimmed = custom.trim();
    if (!trimmed) return;

    if (!options.includes(trimmed)) setOptions((prev) => [...prev, trimmed]);
    if (!selected.includes(trimmed)) setSelected((prev) => [...prev, trimmed]);

    setCustom("");
  };

  const handleSave = async () => {
    try {
      for (const exclusionName of selected) {
        const existing = backendMap[exclusionName];

        if (existing) {
          // FULL UPDATE PAYLOAD
          await updateExclusion({
            organizationId,
            tripPublicId,
            exclusionId: existing.tripItemId,
            data: {
              requestId: existing.requestId ?? "",
              currentTimestamp: new Date().toISOString(),
              organizationId,

              name: exclusionName,
              saveToLibrary: existing.saveToLibrary ?? false,

              documents: existing.documents ?? [],

              fromLocation: existing.fromLocation ?? "",
              toLocation: existing.toLocation ?? "",

              startTime: existing.startTime ?? {
                hour: 0,
                minute: 0,
                second: 0,
                nano: 0,
              },

              endTime: existing.endTime ?? {
                hour: 0,
                minute: 0,
                second: 0,
                nano: 0,
              },

              vehicleType: existing.vehicleType ?? "CAR",
              customVehicleType: existing.customVehicleType,

              arrangedBy: existing.arrangedBy ?? "ORGANIZER",

              description: existing.description ?? "",
              packingSuggestion: existing.packingSuggestion ?? "",
            },
          }).unwrap();
        } else {
          // CREATE (POST)
          await createExclusion({
            organizationId,
            tripPublicId,
            data: {
              name: exclusionName,
              category: "GENERAL",
            },
          }).unwrap();
        }
      }

      router.push(`/organizer/create-trip/${tripPublicId}/faqs`);
    } catch (err) {
      console.error("Error saving exclusions:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 w-full min-h-screen flex flex-col">
        <AppHeader title="Create New Trip" />
        <TripStepperHeader activeStep={3} />

        <div className="p-8 bg-white min-h-screen">
          <SectionCard title="Exclusions">
            <div className="space-y-6">
              <PillCheckboxGroup
                options={options}
                value={selected}
                onChange={setSelected}
              />

              <div className="space-y-2">
                <Label htmlFor="custom-exclusion">Custom Exclusion</Label>

                <div className="flex items-center gap-2">
                  <Input
                    id="custom-exclusion"
                    placeholder="Enter custom exclusion"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="px-8 py-2 rounded-full font-medium text-orange-500 border-orange-400 hover:bg-orange-50 transition"
                    onClick={addCustom}
                  >
                    + Add
                  </Button>
                </div>
              </div>
            </div>
          </SectionCard>

          <WizardFooter
            onPrev={() =>
              router.push(`/organizer/create-trip/${tripPublicId}/Itinerary`)
            }
            onDraft={() => console.log("Draft exclusions:", selected)}
            onNext={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
