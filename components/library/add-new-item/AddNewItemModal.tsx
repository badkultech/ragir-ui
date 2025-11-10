"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Hotel, Bus, Utensils, Activity, Users, HelpCircle } from "lucide-react";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { CategorySelectStep } from "./components/CategorySelectStep";
import { StepRenderer } from "./components/StepRenderer";
import { useSaveHandler } from "./hooks/useSaveHandler";
import {
  mapMealToFormData,
  mapStayToFormData,
  mapTransitToFormData,
  mapActivityToFormData,
  mapDayDescriptionToFormData,
  mapTripLeaderToFormData,
  DocumentItem,
} from "@/lib/services/organizer/trip/library/common/formDataMappers";
import { FormDataShape } from "./modules/types";

// === RTK Hooks ===
import {
  useCreateDayDescriptionMutation,
  useUpdateDayDescriptionMutation,
} from "@/lib/services/organizer/trip/library/day-description";
import {
  useCreateOrganizerTransitMutation,
  useUpdateOrganizerTransitMutation,
} from "@/lib/services/organizer/trip/library/transit";
import { useCreateMealMutation, useUpdateMealMutation } from "@/lib/services/organizer/trip/library/meal";
import { useCreateStayMutation, useUpdateStayMutation } from "@/lib/services/organizer/trip/library/stay";
import { useCreateActivityMutation, useUpdateActivityMutation } from "@/lib/services/organizer/trip/library/activity";
import { useSaveGroupLeaderMutation, useUpdateGroupLeaderMutation } from "@/lib/services/organizer/trip/library/leader";

type Step =
  | "select"
  | "event"
  | "stay"
  | "transit"
  | "meal"
  | "activity"
  | "trip-leader"
  | "faq";

export function AddNewItemModal({
  open,
  onClose,
  updateId,
  initialStep = "select",
}: {
  open: boolean;
  onClose: () => void;
  updateId?: number | null;
  initialStep?: Step;
}) {
  const [step, setStep] = useState<Step>("select");
  const [selected, setSelected] = useState<any>(null);
  const organizationId = useOrganizationId();

  const { saving, handleSave } = useSaveHandler(onClose);

  const [createEvent] = useCreateDayDescriptionMutation();
  const [updateEvent] = useUpdateDayDescriptionMutation();
  const [createTransit] = useCreateOrganizerTransitMutation();
  const [updateTransit] = useUpdateOrganizerTransitMutation();
  const [createMeal] = useCreateMealMutation();
  const [updateMeal] = useUpdateMealMutation();
  const [createStay] = useCreateStayMutation();
  const [updateStay] = useUpdateStayMutation();
  const [createActivity] = useCreateActivityMutation();
  const [updateActivity] = useUpdateActivityMutation();
  const [createLeader] = useSaveGroupLeaderMutation();
  const [updateLeader] = useUpdateGroupLeaderMutation();

  useEffect(() => {
    if (!open) return;
    setStep(initialStep);
    setSelected(null);
  }, [open, initialStep]);

  async function onSave(stepKey: Step, data: FormDataShape, documents?: DocumentItem[]) {
    const fdMappers: Record<Step, any> = {
      event: mapDayDescriptionToFormData,
      stay: mapStayToFormData,
      transit: mapTransitToFormData,
      meal: mapMealToFormData,
      activity: mapActivityToFormData,
      "trip-leader": mapTripLeaderToFormData,
      faq: null,
      select: null,
    };

    const fd = fdMappers[stepKey]?.(data, documents);
    if (!fd) return;

    const actions: Record<Step, any> = {
      event: updateId
        ? () => updateEvent({ organizationId, dayDescriptionId: String(updateId), data: fd }).unwrap()
        : () => createEvent({ organizationId, data: fd }).unwrap(),
      stay: updateId
        ? () => updateStay({ organizationId, stayId: updateId, data: fd }).unwrap()
        : () => createStay({ organizationId, data: fd }).unwrap(),
      transit: updateId
        ? () => updateTransit({ organizationId, transitId: updateId, data: fd }).unwrap()
        : () => createTransit({ organizationId, data: fd }).unwrap(),
      meal: updateId
        ? () => updateMeal({ organizationId, mealId: updateId, data: fd }).unwrap()
        : () => createMeal({ organizationId, data: fd }).unwrap(),
      activity: updateId
        ? () => updateActivity({ organizationId, activityId: updateId, data: fd }).unwrap()
        : () => createActivity({ organizationId, data: fd }).unwrap(),
      "trip-leader": updateId
        ? () => updateLeader({ organizationId, LeaderId: updateId, data: fd }).unwrap()
        : () => createLeader({ organizationId, data: fd }).unwrap(),
      faq: () => Promise.resolve(),
      select: () => Promise.resolve(),
    };

    await handleSave(stepKey, actions[stepKey]);
  }

  const handleNext = () => selected && setStep(selected.step);
  const handleBack = () => {
    if (initialStep !== "select") return onClose();
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
          {step === "select" ? (
            <CategorySelectStep
              categories={[
                { label: "Events", icon: Calendar, step: "event" },
                { label: "Stays", icon: Hotel, step: "stay" },
                { label: "Transit", icon: Bus, step: "transit" },
                { label: "Meals", icon: Utensils, step: "meal" },
                { label: "Activities", icon: Activity, step: "activity" },
                { label: "Trip Leaders", icon: Users, step: "trip-leader" },
                { label: "FAQs", icon: HelpCircle, step: "faq" },
              ]}
              selected={selected}
              setSelected={setSelected}
              handleNext={handleNext}
            />
          ) : (
            <StepRenderer
              step={step}
              updateId={updateId}
              onBack={handleBack}
              onClose={onClose}
              onSave={onSave}
            />
          )}
        </div>

        {saving && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="text-sm text-gray-500">Saving...</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
