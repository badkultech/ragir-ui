"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { StepHeader } from "./StepHeader";
import { StepSelector } from "./StepSelector";
import { useHandleSave } from "./useHandleSave";
import { categories } from "./categories";

/* === Loaders (for edit mode) === */
import { EventEditLoader } from "./loaders/EventEditLoader";
import { StayEditLoader } from "./loaders/StayEditLoader";
import { TransitEditLoader } from "./loaders/TransitEditLoader";
import { ActivityEditLoader } from "./loaders/ActivityEditLoader";

/* === Forms (for create mode) === */
import { AddEventForm } from "@/components/library/AddEventForm";
import { AddStayForm } from "@/components/library/AddStayForm";
import { AddTransitForm } from "@/components/library/AddTransitForm";
import { AddMealForm } from "@/components/library/AddMealForm";
import { AddActivityForm } from "@/components/library/AddActivityForm";
import { AddTripLeaderForm } from "@/components/library/AddTripLeaderForm";
import { AddFAQForm } from "@/components/library/AddFAQForm";

/* === RTK Service Mutations === */
import {
  useCreateOrganizerDayDescriptionMutation,
  useUpdateOrganizerDayDescriptionMutation,
} from "@/lib/services/organizer/trip/library/day-description";

import {
  useCreateOrganizerTransitMutation,
  useUpdateOrganizerTransitMutation,
} from "@/lib/services/organizer/trip/library/transit";

import {
  useCreateStayMutation,
  useUpdateStayMutation,
} from "@/lib/services/organizer/trip/library/stay";

import {
  useCreateMealMutation,
  useUpdateMealMutation,
} from "@/lib/services/organizer/trip/library/meal";

import {
  useCreateActivityMutation,
  useUpdateActivityMutation,
} from "@/lib/services/organizer/trip/library/activity";

/* === Types === */
export type Step =
  | "select"
  | "event"
  | "stay"
  | "transit"
  | "meal"
  | "activity"
  | "trip-leader"
  | "faq";

interface AddNewItemModalProps {
  open: boolean;
  onClose: () => void;
  updateId?: number | null;
  initialStep?: Step;
}

/* ==========================================================
   MAIN COMPONENT: AddNewItemModal
   ========================================================== */
export function AddNewItemModal({
  open,
  onClose,
  updateId,
  initialStep = "select",
}: AddNewItemModalProps) {
  const [step, setStep] = useState<Step>("select");
  const [selected, setSelected] = useState<any>(null);

  const { userData } = useSelector(selectAuthState);
  const organizationId = userData?.organizationPublicId;

  /* === Initialize all create/update RTK hooks === */
  const [createDayDescription] = useCreateOrganizerDayDescriptionMutation();
  const [updateDayDescription] = useUpdateOrganizerDayDescriptionMutation();

  const [createTransit] = useCreateOrganizerTransitMutation();
  const [updateTransit] = useUpdateOrganizerTransitMutation();

  const [createStay] = useCreateStayMutation();
  const [updateStay] = useUpdateStayMutation();

  const [createMeal] = useCreateMealMutation();
  const [updateMeal] = useUpdateMealMutation();

  const [createActivity] = useCreateActivityMutation();
  const [updateActivity] = useUpdateActivityMutation();

  /* === Unified save handler === */
  const handleSave = useHandleSave({
    organizationId,
    onClose,
    mutations: {
      create: {
        event: (fd: FormData) =>
          createDayDescription({ organizationId, data: fd }).unwrap(),
        stay: (fd: FormData) =>
          createStay({ organizationId, data: fd }).unwrap(),
        transit: (fd: FormData) =>
          createTransit({ organizationId, data: fd }).unwrap(),
        meal: (fd: FormData) =>
          createMeal({ organizationId, data: fd }).unwrap(),
        activity: (fd: FormData) =>
          createActivity({ organizationId, data: fd }).unwrap(),
      },
      update: {
        event: (fd: FormData) =>
          updateDayDescription({
            organizationId,
            dayDescriptionId: String(updateId),
            data: fd,
          }).unwrap(),
        stay: (fd: FormData) =>
          updateStay({ organizationId, stayId: updateId, data: fd }).unwrap(),
        transit: (fd: FormData) =>
          updateTransit({
            organizationId,
            transitId: updateId,
            data: fd,
          }).unwrap(),
        meal: (fd: FormData) =>
          updateMeal({ organizationId, mealId: updateId, data: fd }).unwrap(),
        activity: (fd: FormData) =>
          updateActivity({
            organizationId,
            activityId: updateId,
            data: fd,
          }).unwrap(),
      },
    },
  });

  /* === Step management === */
  useEffect(() => {
    if (!open) return;
    setStep(initialStep);
    setSelected(null);
  }, [open, initialStep]);

  const handleNext = () => selected && setStep(selected.step);

  const handleBack = () => {
    if (initialStep !== "select") {
      onClose();
      return;
    }
    setStep("select");
    setSelected(null);
  };

  /* ==========================================================
     RENDER
     ========================================================== */
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

        {/* === Step: Select Type === */}
        {step === "select" && (
          <>
            <StepHeader title="Add New Item" />
            <StepSelector
              selected={selected}
              setSelected={setSelected}
              onNext={handleNext}
              categories={categories}
            />
          </>
        )}

        {/* === Step: Event === */}
        {step === "event" && (
          <>
            <StepHeader
              title={updateId ? "Edit Day Description" : "Add Day Description"}
            />
            {updateId ? (
              <EventEditLoader
                updateId={updateId}
                onCancel={handleBack}
                onSave={(data, docs) => handleSave("event", data, docs)}
              />
            ) : (
              <AddEventForm
                mode="library"
                onCancel={handleBack}
                onSave={(data, docs) => handleSave("event", data, docs)}
              />
            )}
          </>
        )}

        {/* === Step: Stay === */}
        {step === "stay" && (
          <>
            <StepHeader title={updateId ? "Edit Stay" : "Add Stay"} />
            {updateId ? (
              <StayEditLoader
                updateId={updateId}
                onCancel={handleBack}
                onSave={(data, docs) => handleSave("stay", data, docs)}
              />
            ) : (
              <AddStayForm
                mode="library"
                onCancel={handleBack}
                onSave={(data, docs) => handleSave("stay", data, docs)}
              />
            )}
          </>
        )}

        {/* === Step: Transit === */}
        {step === "transit" && (
          <>
            <StepHeader title={updateId ? "Edit Transit" : "Add Transit"} />
            {updateId ? (
              <TransitEditLoader
                updateId={updateId}
                onCancel={handleBack}
                onSave={(data, docs) => handleSave("transit", data, docs)}
              />
            ) : (
              <AddTransitForm
                mode="library"
                onCancel={handleBack}
                onSave={(data, docs) => handleSave("transit", data, docs)}
              />
            )}
          </>
        )}

        {/* === Step: Meal === */}
        {step === "meal" && (
          <>
            <StepHeader title={updateId ? "Edit Meal" : "Add Meal"} />
            <AddMealForm
              mode="library"
              onCancel={handleBack}
              onSave={(data, docs) => handleSave("meal", data, docs)}
            />
          </>
        )}

        {/* === Step: Activity === */}
        {step === "activity" && (
          <>
            <StepHeader title={updateId ? "Edit Activity" : "Add Activity"} />
            {updateId ? (
              <ActivityEditLoader
                updateId={updateId}
                onCancel={handleBack}
                onSave={(data, docs) => handleSave("activity", data, docs)}
              />
            ) : (
              <AddActivityForm
                mode="library"
                onCancel={handleBack}
                onSave={(data, docs) => handleSave("activity", data, docs)}
              />
            )}
          </>
        )}

        {/* === Step: Trip Leader === */}
        {step === "trip-leader" && (
          <>
            <StepHeader
              title={updateId ? "Edit Trip Leader" : "Add Trip Leader"}
            />
            <AddTripLeaderForm
              mode="library"
              onCancel={handleBack}
              onSave={(data) => {
                console.log("Trip Leader saved:", data);
                onClose();
              }}
            />
          </>
        )}

        {/* === Step: FAQ === */}
        {step === "faq" && (
          <>
            <StepHeader title={updateId ? "Edit FAQ" : "Add FAQ"} />
            <AddFAQForm
              mode="library"
              onCancel={handleBack}
              onSave={() => onClose()}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
