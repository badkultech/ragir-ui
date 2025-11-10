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
  useCreateDayDescriptionMutation,
  useGetDayDescriptionByIdQuery,
  useUpdateDayDescriptionMutation,
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
  useGetMealByIdQuery,
  useUpdateMealMutation,
} from "@/lib/services/organizer/trip/library/meal";
import {
  useCreateStayMutation,
  useGetStayByIdQuery,
  useUpdateStayMutation,
} from "@/lib/services/organizer/trip/library/stay";
import {
  useCreateActivityMutation,
  useGetActivityByIdQuery,
  useUpdateActivityMutation,
} from "@/lib/services/organizer/trip/library/activity";

import {
  mapMealToFormData,
  mapStayToFormData,
  mapTransitToFormData,
  mapActivityToFormData,
  mapDayDescriptionToFormData,
  mapTripLeaderToFormData,
} from "@/lib/services/organizer/trip/library/common/formDataMappers";
import { useGetGroupLeaderByIdQuery, useSaveGroupLeaderMutation, useUpdateGroupLeaderMutation } from "@/lib/services/organizer/trip/library/leader";
import { useOrganizationId } from "@/hooks/useOrganizationId";

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

  const organizationId = useOrganizationId();

  // RTK hooks
  const [createOrganizerDayDescription] =
    useCreateDayDescriptionMutation();
  const [updateOrganizerDayDescription] =
    useUpdateDayDescriptionMutation();

  const [createOrganizerTransit] = useCreateOrganizerTransitMutation();
  const [updateOrganizerTransit] = useUpdateOrganizerTransitMutation();

  const [createMeal] = useCreateMealMutation();
  const [updateMeal] = useUpdateMealMutation();

  const [createStay] = useCreateStayMutation();
  const [updateStay] = useUpdateStayMutation();

  const [createActivity] = useCreateActivityMutation();
  const [updateActivity] = useUpdateActivityMutation();

  const [createTripLeader] = useSaveGroupLeaderMutation();
  const [updateTripLeader] = useUpdateGroupLeaderMutation();

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
        case "trip-leader": {
          fd = mapTripLeaderToFormData(data, documents ?? []);
          if (updateId) {
            requestPromise = updateTripLeader({
              organizationId,
              LeaderId: updateId,
              data: fd,
            }).unwrap();
          } else {
            requestPromise = createTripLeader({
              organizationId,
              data: fd,
            }).unwrap();
          }
          break;
        }

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
                    className={`flex flex-col justify-center items-center p-6 h-24 rounded-xl border transition ${selected?.label === label
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
                  className={`flex flex-col justify-center items-center w-full p-6 h-20 rounded-xl border transition ${selected?.label === "FAQs"
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
              {updateId ? (
                <MealEditLoader
                  updateId={updateId}
                  onCancel={handleBack}
                  onClose={onClose}
                  onSave={(data: any, documents?: any[]) =>
                    handleSave("meal", data, documents)
                  }
                />
              ) : (
                <AddMealForm
                  mode="library"
                  onCancel={handleBack}
                  onSave={(data: any, documents?: any[]) =>
                    handleSave("meal", data, documents)
                  }
                />
              )}
            </>
          )}

          {step === "activity" && (
            <>
              <StepHeader title={updateId ? "Edit Activity" : "Add Activity"} />
              {updateId ? (
                <ActivityEditLoader
                  updateId={updateId}
                  onCancel={onClose}
                  onClose={onClose}
                  onSave={(data: any, documents?: any[]) =>
                    handleSave("activity", data, documents)
                  }
                />
              ) : (
                <AddActivityForm
                  mode="library"
                  onCancel={onClose}
                  onSave={(data: any, documents?: any[]) =>
                    handleSave("activity", data, documents)
                  }
                />
              )}
            </>
          )}


          {step === "trip-leader" && (
            <>
              <StepHeader title={updateId ? "Edit Trip Leader" : "Add Trip Leader"} />
              {updateId ? (
                <TripLeaderEditLoader
                  updateId={updateId}
                  onCancel={handleBack}
                  onClose={onClose}
                  onSave={(data: any, documents?: any[]) => handleSave("trip-leader", data, documents)}
                />
              ) : (
                <AddTripLeaderForm
                  mode="library"
                  onCancel={handleBack}
                  onSave={(data: any, documents?: any[]) => handleSave("trip-leader", data, documents)}
                />
              )}
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
  const organizationId = useOrganizationId();

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
  const organizationId = useOrganizationId();

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
  const organizationId = useOrganizationId();

  const {
    data: event,
    isLoading,
    isFetching,
    error,
  } = useGetDayDescriptionByIdQuery(
    organizationId && updateId
      ? { organizationId, dayDescriptionId: updateId }
      : skipToken
  );

  console.log("EventEditLoader state:", { updateId, isLoading, isFetching, error, event });

  if (isLoading || isFetching) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center text-gray-500 py-10">
        Unable to load event data.
      </div>
    );
  }

  // Normalize documents to Document shape
  const normalizedDocs = (Array.isArray(event.documents) ? event.documents : []).map((d: any) => {
    const url = d.url ?? d.fileUrl ?? d.path ?? d.s3Url ?? null;
    return {
      id: d.id ?? null,
      url,
      type: d.type ?? null,
      file: null,
      markedForDeletion: false,
    };
  });

  const normalizedEvent = {
    ...event,
    documents: normalizedDocs,
  };

  console.log("EventEditLoader -> normalizedEvent.documents:", normalizedDocs);

  return (
    <AddEventForm
      mode="library"
      initialData={normalizedEvent}
      onCancel={onCancel}
      onSave={onSave}
    />
  );
}


/**
 * TripLeaderEditLoader
 *
 * Fetches a leader by id, normalizes docs to Document shape and renders AddTripLeaderForm.
 */
export function TripLeaderEditLoader({
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
  const organizationId = useOrganizationId();

  const {
    data: leader,
    isLoading,
    isFetching,
    error,
  } = useGetGroupLeaderByIdQuery(
    organizationId && updateId
      ? { organizationId, leaderId: updateId }
      : skipToken
  );

  console.log("TripLeaderEditLoader state:", {
    updateId,
    isLoading,
    isFetching,
    error,
    leader,
  });

  if (isLoading || isFetching) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading leader details...
      </div>
    );
  }

  if (!leader) {
    return (
      <div className="text-center text-gray-500 py-10">
        Unable to load leader data.
      </div>
    );
  }

  const normalizedDocs = (Array.isArray(leader.documents) ? leader.documents : []).map((d: any) => {
    const url = d.url ?? d.fileUrl ?? d.path ?? d.s3Url ?? null;
    return {
      id: d.id ?? null,
      url,
      type: d.type ?? "IMAGE",
      file: null,
      markedForDeletion: !!d.markedForDeletion,
    };
  });

  const normalizedLeader = {
    ...leader,
    documents: normalizedDocs,
  };

  console.log("TripLeaderEditLoader -> normalizedLeader.documents:", normalizedDocs);

  return (
    <AddTripLeaderForm
      updateId={updateId}
      mode="library"
      initialData={normalizedLeader}
      onCancel={onCancel}
      onSave={onSave}
    />
  );
}
function MealEditLoader({
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
  const organizationId = useOrganizationId();

  const {
    data: meal,
    isLoading,
    isFetching,
    error,
  } = useGetMealByIdQuery(
    organizationId && updateId
      ? { organizationId, mealId: updateId }
      : skipToken
  );

  console.log("MealEditLoader state:", {
    updateId,
    isLoading,
    isFetching,
    error,
    meal,
  });

  if (isLoading || isFetching)
    return (
      <div className="text-center text-gray-500 py-10">
        Loading meal details...
      </div>
    );

  if (!meal)
    return (
      <div className="text-center text-gray-500 py-10">
        Unable to load meal data.
      </div>
    );

  const normalizedDocs = (Array.isArray(meal.documents) ? meal.documents : []).map((d: any) => {
    const url = d.url ?? d.fileUrl ?? d.path ?? d.s3Url ?? null;
    return {
      id: d.id ?? null,
      url,
      type: d.type ?? "IMAGE",
      file: null,
      markedForDeletion: !!d.markedForDeletion,
    };
  });

  const normalizedMeal = {
    ...meal,
    documents: normalizedDocs,
  };

  console.log("MealEditLoader -> normalizedMeal.documents:", normalizedDocs);

  return (
    <AddMealForm
      mode="library"
      initialData={normalizedMeal}
      onCancel={onCancel}
      onSave={onSave}
    />
  );
}
function ActivityEditLoader({
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
  const organizationId = useOrganizationId();

  const {
    data: activity,
    isLoading,
    isFetching,
    error,
  } = useGetActivityByIdQuery(
    organizationId && updateId
      ? { organizationId, activityId: updateId }
      : skipToken
  );

  console.log("ActivityEditLoader state:", {
    updateId,
    isLoading,
    isFetching,
    error,
    activity,
  });

  if (isLoading || isFetching)
    return (
      <div className="text-center text-gray-500 py-10">
        Loading activity details...
      </div>
    );

  if (!activity)
    return (
      <div className="text-center text-gray-500 py-10">
        Unable to load activity data.
      </div>
    );

  const normalizedDocs = (Array.isArray(activity.documents) ? activity.documents : []).map((d: any) => {
    const url = d.url ?? d.fileUrl ?? d.path ?? d.s3Url ?? null;
    return {
      id: d.id ?? null,
      url,
      type: d.type ?? "IMAGE",
      file: null,
      markedForDeletion: !!d.markedForDeletion,
    };
  });

  const normalizedActivity = {
    ...activity,
    documents: normalizedDocs,
  };

  console.log("ActivityEditLoader -> normalizedActivity.documents:", normalizedDocs);

  return (
    <AddActivityForm
      mode="library"
      initialData={normalizedActivity}
      onCancel={onCancel}
      onSave={onSave}
    />
  );
}
