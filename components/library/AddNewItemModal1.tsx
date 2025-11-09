"use client";

import React, { useEffect, useState } from "react";
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
import { AddTransitForm } from "@/components/library/AddTransitForm";
import { AddFAQForm } from "@/components/library/AddFAQForm";

import {
  useCreateOrganizerDayDescriptionMutation,
  useGetOrganizerDayDescriptionByIdQuery,
  useUpdateOrganizerDayDescriptionMutation,
} from "@/lib/services/organizer/trip/library/day-description";

import {
  useCreateOrganizerTransitMutation,
  useUpdateOrganizerTransitMutation,
  useGetOrganizerTransitByIdQuery,
} from "@/lib/services/organizer/trip/library/transit";

import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { skipToken } from "@reduxjs/toolkit/query";

import {
  useCreateMealMutation,
  useUpdateMealMutation,
} from "@/lib/services/organizer/trip/library/meal";
import {
  useCreateStayMutation,
  useGetStayByIdQuery,
  useUpdateStayMutation,
} from "@/lib/services/organizer/trip/library/stay";
import {
  useCreateActivityMutation,
  useUpdateActivityMutation,
} from "@/lib/services/organizer/trip/library/activity";

import {
  mapMealToFormData,
  mapStayToFormData,
  mapTransitToFormData,
  mapActivityToFormData,
  mapDayDescriptionToFormData,
} from "@/lib/services/organizer/trip/library/common/formDataMappers";

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

const categories: CategoryItem[] = [
  { label: "Events", icon: Calendar, step: "event" },
  { label: "Stays", icon: Hotel, step: "stay" },
  { label: "Transit", icon: Bus, step: "transit" },
  { label: "Meals", icon: Utensils, step: "meal" },
  { label: "Activities", icon: Activity, step: "activity" },
  { label: "Trip Leaders", icon: Users, step: "trip-leader" },
  { label: "FAQs", icon: HelpCircle, step: "faq" },
];

function StepHeader({ title }: { title: string }) {
  return (
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
    </DialogHeader>
  );
}

type AddNewItemModalProps = {
  open: boolean;
  onClose: () => void;
  updateId?: number | null;
  initialStep?: Step;
  editData?: any;
};

export function AddNewItemModal({
  open,
  onClose,
  updateId,
  initialStep = "select",
  editData,
}: AddNewItemModalProps) {
  const [step, setStep] = useState<Step>("select");
  const [selected, setSelected] = useState<CategoryItem | null>(null);

  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  // RTK hooks
  const [createOrganizerDayDescription] =
    useCreateOrganizerDayDescriptionMutation();
  const [updateOrganizerDayDescription] =
    useUpdateOrganizerDayDescriptionMutation();

  const [createOrganizerTransit] = useCreateOrganizerTransitMutation();
  const [updateOrganizerTransit] = useUpdateOrganizerTransitMutation();

  const [createMeal] = useCreateMealMutation();
  const [updateMeal] = useUpdateMealMutation();

  const [createStay] = useCreateStayMutation();
  const [updateStay] = useUpdateStayMutation();

  const [createActivity] = useCreateActivityMutation();
  const [updateActivity] = useUpdateActivityMutation();

  useEffect(() => {
    if (!open) return;
    setStep(initialStep);
    setSelected(null);
  }, [open, initialStep]);

  /* Unified save used by child forms:
     Note: child forms pass documents array as second arg to onSave,
     but modal-level mappers expect FormData and documents array.
     We accept both forms:
       - If child already created FormData and handled upload, it can call modal onSave to just close.
       - Here we support child calling onSave(payload, documents) where we map accordingly.
  */
  async function handleSave(stepKey: Step, data: any, documents?: any[]) {
    try {
      let fd: FormData | null = null;
      let requestPromise: Promise<any> | null = null;

      switch (stepKey) {
        case "event":
          fd = mapDayDescriptionToFormData(data, documents);
          if (updateId) {
            requestPromise = updateOrganizerDayDescription({
              organizationId,
              dayDescriptionId: String(updateId),
              data: fd,
            }).unwrap();
          } else {
            requestPromise = createOrganizerDayDescription({
              organizationId,
              data: fd,
            }).unwrap();
          }
          break;

        case "stay":
          fd = mapStayToFormData(data, documents);
          if (updateId) {
            requestPromise = updateStay({
              organizationId,
              stayId: updateId,
              data: fd,
            }).unwrap();
          } else {
            requestPromise = createStay({
              organizationId,
              data: fd,
            }).unwrap();
          }
          break;

        case "transit":
          fd = mapTransitToFormData(data, documents);
          if (updateId) {
            requestPromise = updateOrganizerTransit({
              organizationId,
              transitId: updateId,
              data: fd,
            }).unwrap();
          } else {
            requestPromise = createOrganizerTransit({
              organizationId,
              data: fd,
            }).unwrap();
          }
          break;

        case "meal":
          fd = mapMealToFormData(data, documents);
          if (updateId) {
            requestPromise = updateMeal({
              organizationId,
              mealId: updateId,
              data: fd,
            }).unwrap();
          } else {
            requestPromise = createMeal({
              organizationId,
              data: fd,
            }).unwrap();
          }
          break;

        case "activity":
          fd = mapActivityToFormData(data, documents);
          if (updateId) {
            requestPromise = updateActivity({
              organizationId,
              activityId: updateId,
              data: fd,
            }).unwrap();
          } else {
            requestPromise = createActivity({
              organizationId,
              data: fd,
            }).unwrap();
          }
          break;

        default:
          console.warn("Unhandled save step:", stepKey);
          return;
      }

      if (requestPromise) {
        await requestPromise;
        onClose();
      }
    } catch (err) {
      console.error("Failed to save", stepKey, err);
      alert("Failed to save. See console for details.");
    }
  }

  const handleNext = () => {
    if (selected) setStep(selected.step);
  };

  const handleBack = () => {
    if (initialStep !== "select") {
      onClose();
      return;
    }
    setStep("select");
    setSelected(null);
  };

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
      <DialogContent className="w-full lg:max-w-2xl rounded-2xl overflow-hidden">
        <DialogTitle className="sr-only">Add New Item</DialogTitle>
        <div className="max-h-[90vh] overflow-y-auto">
          {step === "select" && (
            <>
              <StepHeader title="Add New Item" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                {categories.slice(0, 6).map(({ label, icon: Icon, step }) => (
                  <button
                    key={label}
                    onClick={() => setSelected({ label, icon: Icon, step })}
                    className={`flex flex-col justify-center items-center p-6 h-24 rounded-xl border transition ${
                      selected?.label === label
                        ? "border-orange-500 shadow-md"
                        : "border-gray-200 hover:border-orange-400"
                    }`}
                  >
                    <Icon className="h-6 w-6 text-gray-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {label}
                    </span>
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
                  className={`flex flex-col justify-center items-center w-full p-6 h-20 rounded-xl border transition ${
                    selected?.label === "FAQs"
                      ? "border-orange-500 shadow-md"
                      : "border-gray-200 hover:border-orange-400"
                  }`}
                >
                  <HelpCircle className="h-6 w-6 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    FAQs
                  </span>
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

          {step === "event" && (
            <>
              <StepHeader
                title={
                  updateId ? "Edit Day Description" : "Add Day Description"
                }
              />
              {updateId ? (
                <EventEditLoader
                  updateId={updateId}
                  onCancel={handleBack}
                  onClose={onClose}
                  onSave={(data: any, documents?: any[]) =>
                    handleSave("event", data, documents)
                  }
                />
              ) : (
                <AddEventForm
                  mode="library"
                  onCancel={handleBack}
                  onSave={(data: any, documents?: any[]) =>
                    handleSave("event", data, documents)
                  }
                />
              )}
            </>
          )}

          {step === "stay" && (
            <>
              <StepHeader title={updateId ? "Edit Stay" : "Add Stay"} />
              {updateId ? (
                <StayEditLoader
                  updateId={updateId}
                  onCancel={handleBack}
                  onClose={onClose}
                  onSave={(data: any, documents?: any[]) =>
                    handleSave("stay", data, documents)
                  }
                />
              ) : (
                <AddStayForm
                  mode="library"
                  initialData={editData}
                  onCancel={handleBack}
                  onSave={(data: any, documents?: any[]) =>
                    handleSave("stay", data, documents)
                  }
                />
              )}
            </>
          )}

          {step === "transit" && (
            <>
              <StepHeader title={updateId ? "Edit Transit" : "Add Transit"} />
              {updateId ? (
                <TransitEditLoader
                  updateId={updateId}
                  onCancel={handleBack}
                  onClose={onClose}
                  onSave={(data: any, documents?: any[]) =>
                    handleSave("transit", data, documents)
                  }
                />
              ) : (
                <AddTransitForm
                  mode="library"
                  onCancel={handleBack}
                  onSave={(data: any, documents?: any[]) =>
                    handleSave("transit", data, documents)
                  }
                />
              )}
            </>
          )}

          {step === "meal" && (
            <>
              <StepHeader title={updateId ? "Edit Meal" : "Add Meal"} />
              <AddMealForm
                mode="library"
                initialData={editData}
                onCancel={handleBack}
                onSave={(data: any, documents?: any[]) =>
                  handleSave("meal", data, documents)
                }
              />
            </>
          )}

          {step === "activity" && (
            <>
              <StepHeader title={updateId ? "Edit Activity" : "Add Activity"} />
              <AddActivityForm
                mode="library"
                initialData={editData}
                onCancel={onClose}
                onSave={(data: any, documents?: any[]) =>
                  handleSave("activity", data, documents)
                }
              />
            </>
          )}

          {step === "trip-leader" && (
            <>
              <StepHeader
                title={updateId ? "Edit Trip Leader" : "Add Trip Leader"}
              />
              <AddTripLeaderForm
                updateId={updateId}
                mode="library"
                onCancel={handleBack}
                onSave={(data: any) => {
                  // trip leader currently doesn't use documents
                  console.log("Trip Leader saved:", data);
                  onClose();
                }}
              />
            </>
          )}

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

/* TransitEditLoader remains unchanged except it passes initialData into AddTransitForm */
function TransitEditLoader({
  updateId,
  onCancel,
  onClose,
  onSave,
}: {
  updateId: number;
  onCancel: () => void;
  onClose: () => void;
  onSave: (data: any, documents?: any[]) => void;
}) {
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const { data: transit, isLoading } = useGetOrganizerTransitByIdQuery(
    organizationId && updateId
      ? { organizationId, transitId: updateId }
      : skipToken
  );

  if (isLoading)
    return (
      <div className="text-center text-gray-500 py-10">
        Loading transit details...
      </div>
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

/**
 * StayEditLoader
 * - fetches stay by id
 * - normalizes documents into the `Document` shape the form expects
 * - waits (shows loader) until fetching finishes
 */
function StayEditLoader({
  updateId,
  onCancel,
  onClose,
  onSave,
}: {
  updateId: number;
  onCancel: () => void;
  onClose: () => void;
  onSave: (data: any, documents?: any[]) => void;
}) {
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const {
    data: stay,
    isLoading,
    isFetching,
    error,
  } = useGetStayByIdQuery(
    organizationId && updateId
      ? { organizationId, stayId: updateId }
      : skipToken
  );

  console.log("StayEditLoader state:", {
    updateId,
    isLoading,
    isFetching,
    error,
    stay,
  });

  if (isLoading || isFetching) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading stay details...
      </div>
    );
  }

  if (!stay) {
    return (
      <div className="text-center text-gray-500 py-10">
        Unable to load stay data.
      </div>
    );
  }

  // ---- Normalization: ensure documents is always an array in the shape AddStayForm expects ----
  const normalizedDocs = (
    Array.isArray(stay.documents) ? stay.documents : []
  ).map((d: any) => {
    // adapt the mapping to match actual backend keys if different
    const url = d.url ?? d.fileUrl ?? d.path ?? d.s3Url ?? null;
    return {
      id: d.id ?? null,
      url,
      type: d.type ?? null,
      file: null,
      markedForDeletion: false,
    };
  });

  const normalizedStay = {
    ...stay,
    documents: normalizedDocs,
  };

  console.log("StayEditLoader -> normalizedStay.documents:", normalizedDocs);

  return (
    <AddStayForm
      mode="library"
      initialData={normalizedStay}
      onCancel={onCancel}
      onSave={onSave}
    />
  );
}

function EventEditLoader({
  updateId,
  onCancel,
  onClose,
  onSave,
}: {
  updateId: number;
  onCancel: () => void;
  onClose: () => void;
  onSave: (data: any, documents?: any[]) => void;
}) {
  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  const {
    data: event,
    isLoading,
    isFetching,
    error,
  } = useGetOrganizerDayDescriptionByIdQuery(
    organizationId && updateId
      ? { organizationId, dayDescriptionId: updateId }
      : skipToken
  );

  if (isLoading || isFetching) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading event details…
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center text-gray-500 py-10">
        Unable to load event data.
      </div>
    );
  }

  // ✅ Normalize documents into the `useDocumentsManager` shape
  const normalizedDocs = (
    Array.isArray(event.documents) ? event.documents : []
  ).map((d: any) => ({
    id: d.id ?? null,
    url: d.url ?? d.fileUrl ?? d.path ?? d.s3Url ?? null,
    type: d.type ?? null,
    file: null,
    markedForDeletion: false,
  }));

  const normalizedEvent = {
    ...event,
    documents: normalizedDocs,
  };

  return (
    <AddEventForm
      mode="library"
      initialData={normalizedEvent}
      onCancel={onCancel}
      onSave={onSave}
    />
  );
}
