"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Hotel,
  Bus,
  Utensils,
  Activity,
  Users,
  HelpCircle,
} from "lucide-react";

import { AddStayForm } from "@/components/library/AddStayForm";
import { AddMealForm } from "@/components/library/AddMealForm";
import { AddActivityForm } from "./AddActivityForm";
import { AddTripLeaderForm } from "./AddTripLeaderForm";
import { AddEventForm } from "@/components/library/AddEventForm";
import { AddTransitForm } from "./AddTransitForm";
import { AddFAQForm } from "@/components/library/AddFAQForm";

import {
  useCreateOrganizerDayDescriptionMutation,
  useUpdateOrganizerDayDescriptionMutation,
} from "@/lib/services/organizer/trip/library/day-description";

import {
  useCreateOrganizerTransitMutation,
  useUpdateOrganizerTransitMutation,
  useGetOrganizerTransitByIdQuery,
} from "@/lib/services/organizer/trip/library/transits";

import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { Document } from "@/lib/services/organizer/trip/library/day-description/types";
import { skipToken } from "@reduxjs/toolkit/query";

/* ===== types ===== */
type Step =
  | "select"
  | "event"
  | "stay"
  | "transit"
  | "meal"
  | "activity"
  | "trip-leader"
  | "faq";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface CategoryItem {
  label: string;
  icon: IconType;
  step: Step;
}

/* ===== categories (typed) ===== */
const categories: CategoryItem[] = [
  { label: "Events", icon: Calendar, step: "event" },
  { label: "Stays", icon: Hotel, step: "stay" },
  { label: "Transit", icon: Bus, step: "transit" },
  { label: "Meals", icon: Utensils, step: "meal" },
  { label: "Activities", icon: Activity, step: "activity" },
  { label: "Trip Leaders", icon: Users, step: "trip-leader" },
  { label: "FAQs", icon: HelpCircle, step: "faq" },
];

/* small helper header */
function StepHeader({ title }: { title: string }) {
  return (
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
    </DialogHeader>
  );
}

/* ===== main component ===== */
type AddNewItemModalProps = {
  open: boolean;
  onClose: () => void;
  updateId?: number | null;
  initialStep?: Step;
};

export function AddNewItemModal({
  open,
  onClose,
  updateId,
  initialStep = "select",
}: AddNewItemModalProps) {
  const [step, setStep] = useState<Step>("select");
  const [selected, setSelected] = useState<CategoryItem | null>(null);

  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  // Day description (events) mutations
  const [createOrganizerDayDescription] =
    useCreateOrganizerDayDescriptionMutation();
  const [updateOrganizerDayDescription] =
    useUpdateOrganizerDayDescriptionMutation();

  // Transit create/update mutations
  const [createOrganizerTransit] = useCreateOrganizerTransitMutation();
  const [updateOrganizerTransit] = useUpdateOrganizerTransitMutation();

  // Set step when modal opens (respects initialStep always)
  useEffect(() => {
    if (!open) return;
    setStep(initialStep);
    setSelected(null);
  }, [open, initialStep]);

  /* ---------- Handlers ---------- */

  const handleNext = () => {
    if (selected) setStep(selected.step);
  };

  // Save handler for day description / event-like items (you had this before)
  const handleSaveEvent = (data: any) => {
    const formData = new FormData();
    formData.append("name", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("time", data.time);
    formData.append("packingSuggestion", data.packing);
    formData.append("addToLibrary", "true");

    if (data.documents) {
      data.documents.forEach((document: Document, index: number) => {
        if (document.file) formData.append(`documents[${index}].file`, document.file);
        if (document.markedForDeletion)
          formData.append(
            `documents[${index}].markedForDeletion`,
            document.markedForDeletion.toString()
          );
      });
    }

    const request = updateId
      ? updateOrganizerDayDescription({
        organizationId,
        data: formData,
        dayDescriptionId: updateId.toString(),
      })
      : createOrganizerDayDescription({ organizationId, data: formData });

    request
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((err) => {
        console.error("Failed to save event/day description:", err);
      });
  };

  // Save handler for transit (used for both add & edit)
  const handleSaveTransit = (data: any, editingId?: number | null) => {
    const formData = new FormData();
    formData.append("fromLocation", data.from);
    formData.append("toLocation", data.to);
    formData.append("startTime", data.departure);
    formData.append("endTime", data.arrival);
    formData.append(
      "vehicleType",
      Array.isArray(data.vehicle) ? data.vehicle[0] : data.vehicle || ""
    );
    formData.append("customVehicleType", data.otherVehicle || "");
    formData.append("arrangedBy", (data.arrangement || "organizer").toUpperCase());
    formData.append("description", data.description || "");
    formData.append("packagingSuggestion", data.packing || "");
    formData.append("addToLibrary", "true");
    formData.append("name", data.title || "");

    if (data.images?.length) {
      data.images.forEach((file: File, index: number) =>
        formData.append(`documents[${index}].file`, file)
      );
    }

    const request = editingId
      ? updateOrganizerTransit({
        organizationId,
        transitId: editingId,
        data: formData,
      })
      : createOrganizerTransit({
        organizationId,
        data: formData,
      });

    request
      .unwrap()
      .then(() => {
        // close modal on success
        onClose();
      })
      .catch((err) => {
        console.error("Failed to save transit:", err);
      });
  };

  const handleBack = () => {
    // If modal opened directly to a specific step (not 'select'), close on back
    if (initialStep !== "select") {
      onClose();
      return;
    }
    setStep("select");
    setSelected(null);
  };

  /* ====================== RENDER ====================== */
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setStep("select");
          setSelected(null);
          onClose();
        }
      }}
    >
      <DialogContent className="w-full max-w-3xl rounded-2xl overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto">
          {/* ---------------- Step: Select ---------------- */}
          {step === "select" && (
            <>
              <StepHeader title="Add New Item" />

              <div className="grid grid-cols-2 gap-4 mt-4">
                {categories.slice(0, 6).map(({ label, icon: Icon, step }) => (
                  <button
                    key={label}
                    onClick={() => setSelected({ label, icon: Icon, step })}
                    className={`flex flex-col justify-center items-center p-6 h-24 rounded-xl border transition ${selected?.label === label
                        ? "border-orange-500 shadow-md"
                        : "border-gray-200 hover:border-orange-400"
                      }`}
                  >
                    <Icon className="h-6 w-6 text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <button
                  onClick={() =>
                    setSelected({
                      label: "FAQs",
                      icon: HelpCircle,
                      step: "faq",
                    })
                  }
                  className={`flex flex-col justify-center items-center w-full p-6 h-20 rounded-xl border transition ${selected?.label === "FAQs"
                      ? "border-orange-500 shadow-md"
                      : "border-gray-200 hover:border-orange-400"
                    }`}
                >
                  <HelpCircle className="h-6 w-6 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">FAQs</span>
                </button>
              </div>

              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant="outline" className="rounded-full px-6">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleNext}
                  disabled={!selected}
                  className="rounded-full px-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                >
                  Next
                </Button>
              </DialogFooter>
            </>
          )}

          {/* ---------------- Step: Event ---------------- */}
          {step === "event" && (
            <>
              <StepHeader title={updateId ? "Edit Day Description" : "Add Day Description"} />
              <AddEventForm
                updateId={updateId}
                mode="library"
                onCancel={handleBack}
                onSave={handleSaveEvent}
              />
            </>
          )}

          {/* ---------------- Step: Stay ---------------- */}
          {step === "stay" && (
            <>
              <StepHeader title={updateId ? "Edit Stay" : "Add Stay"} />
              <AddStayForm
                mode="library"
                onCancel={handleBack}
                onSave={(data: any) => {
                  // You can implement create/update similar to handleSaveEvent if needed
                  console.log("Stay saved:", data);
                  onClose();
                }}
              />
            </>
          )}

          {/* ---------------- Step: Transit ---------------- */}
          {step === "transit" && (
            <>
              <StepHeader title={updateId ? "Edit Transit" : "Add Transit"} />
              {updateId ? (
                <TransitEditLoader
                  updateId={updateId}
                  onCancel={handleBack}
                  onClose={onClose}
                  onSave={(data: any) => handleSaveTransit(data, updateId)}
                />
              ) : (
                <AddTransitForm
                  mode="library"
                  onCancel={handleBack}
                  onSave={(data: any) => handleSaveTransit(data)}
                />
              )}
            </>
          )}

          {/* ---------------- Step: Meal ---------------- */}
          {step === "meal" && (
            <>
              <StepHeader title={updateId ? "Edit Meal" : "Add Meal"} />
              <AddMealForm
                mode="library"
                onCancel={handleBack}
                onSave={(data: any) => {
                  console.log("Meal saved:", data);
                  onClose();
                }}
              />
            </>
          )}

          {/* ---------------- Step: Activity ---------------- */}
          {step === "activity" && (
            <>
              <StepHeader title={updateId ? "Edit Activity" : "Add Activity"} />
              <AddActivityForm
                mode="library"
                onCancel={handleBack}
                onSave={(data: any) => {
                  console.log("Activity saved:", data);
                  onClose();
                }}
              />
            </>
          )}

          {/* ---------------- Step: Trip Leader ---------------- */}
          {step === "trip-leader" && (
            <>
              <StepHeader title={updateId ? "Edit Trip Leader" : "Add Trip Leader"} />
              <AddTripLeaderForm
                mode="library"
                onCancel={handleBack}
                onSave={(data: any) => {
                  console.log("Trip Leader saved:", data);
                  onClose();
                }}
              />
            </>
          )}

          {/* ---------------- Step: FAQ ---------------- */}
          {step === "faq" && (
            <>
              <StepHeader title={updateId ? "Edit FAQ" : "Add FAQ"} />
              <AddFAQForm
                updateId={updateId}
                mode="library"
                onCancel={handleBack}
                onSave={() => onClose()}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------------------
   TransitEditLoader component (separate)
   - Uses RTK query to fetch transit by ID
   - Prefills AddTransitForm when data is ready
---------------------------------- */
function TransitEditLoader({
  updateId,
  onCancel,
  onClose,
  onSave,
}: {
  updateId: number;
  onCancel: () => void;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const { data: transit, isLoading, isFetching, error } = useGetOrganizerTransitByIdQuery(
    organizationId && updateId ? { organizationId, transitId: updateId } : skipToken
  );

  useEffect(() => {
    console.log("Fetching transit data for ID:", updateId, "Org:", organizationId);
  }, [updateId, organizationId]);


  if (isLoading)
    return (
      <div className="text-center text-gray-500 py-10">Loading transit details...</div>
    );

  if (!transit)
    return (
      <div className="text-center text-gray-500 py-10">
        Unable to load transit data.
      </div>
    );

  return (
    <AddTransitForm
      mode="library"
      initialData={transit}
      onCancel={onCancel}
      onSave={onSave}
    />
  );
}
