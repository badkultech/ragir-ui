"use client";

import { useState } from "react";
import {
  Calendar,
  Pencil,
  Trash2,
  Car,
  Home,
  Utensils,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/ui/ModalWrapper";

import { AddDayDescriptionForm } from "@/components/library/AddDayDescriptionForm";
import { AddTransitForm } from "@/components/library/AddTransitForm";
import { AddStayForm } from "@/components/library/AddStayForm";
import { AddMealForm } from "@/components/library/AddMealForm";
import { AddActivityForm } from "@/components/library/AddActivityForm";

import { useDayDescription } from "./useDayDescription";
import { useTransit } from "./useTransit";
import { useStay } from "./useStay";
import { useMeal } from "./useMeal";
import { useActivity } from "./useActivity";

interface DetailsOptionsProps {
  organizationId: string;
  tripPublicId: string;
  dayDetailId: string;
  items: any[];
  onLocalChange: (op: "create" | "update" | "delete", item: any) => void;
}

export function DetailsOptions({
  organizationId,
  tripPublicId,
  dayDetailId,
  items = [],
  onLocalChange,
}: DetailsOptionsProps) {
  // -------------- Local modal controls --------------
  const [modalType, setModalType] = useState<
    "event" | "transit" | "stay" | "meal" | "activity" | null
  >(null);

  const [initialData, setInitialData] = useState<any>(null);

  // ---------------- Hooks (API only) ----------------
  const dayDesc = useDayDescription({ organizationId, tripPublicId, dayDetailId });
  const transit = useTransit({ organizationId, tripPublicId, dayDetailId });
  const stay = useStay({ organizationId, tripPublicId, dayDetailId });
  const meal = useMeal({ organizationId, tripPublicId, dayDetailId });
  const activity = useActivity({ organizationId, tripPublicId, dayDetailId });

  // ---------------- Create / Update ----------------
  const handleSave = async (formData: any) => {
    let apiResult = null;

    const isEdit = Boolean(initialData?.id || initialData?.tripItemId);

    try {
      switch (modalType) {
        case "event":
          apiResult = await dayDesc.handleSave(formData);
          break;

        case "transit":
          apiResult = await transit.handleTransitSave(formData);
          break;

        case "stay":
          apiResult = await stay.handleStaySave(formData);
          break;

        case "meal":
          apiResult = await meal.handleMealSave(formData);
          break;

        case "activity":
          apiResult = await activity.handleActivitySave(formData);
          break;
      }


      onLocalChange(isEdit ? "update" : "create", apiResult);
    } catch (err) {
      console.error("❌ Save failed:", err);
    }

    setModalType(null);
    setInitialData(null);
  };

  // ---------------- Delete ----------------
  const handleDelete = async (item: any) => {
    try {
      switch (item.tripType) {
        case "DAY_DESCRIPTION":
          await dayDesc.handleDelete(item.id);
          break;

        case "TRANSIT":
          await transit.handleTransitDelete(item.id);
          break;

        case "STAY":
          await stay.handleStayDelete(item.id);
          break;

        case "MEAL":
          await meal.handleMealDelete(item.id);
          break;

        case "ACTIVITY":
          await activity.handleActivityDelete(item.id);
          break;
      }


      onLocalChange("delete", item);
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  // ---------------- Edit ----------------
  const handleEditClick = async (item: any) => {
    setInitialData(item);

    switch (item.tripType) {
      case "DAY_DESCRIPTION":
        dayDesc.handleEdit(item);
        setInitialData(dayDesc.initialData);
        setModalType("event");
        break;

      case "TRANSIT":
        await transit.handleTransitEdit(item); // async
        setInitialData(transit.initialTransitData);
        setModalType("transit");
        break;

      case "STAY":
        stay.handleStayEdit(item);
        setInitialData(stay.initialStayData);
        setModalType("stay");
        break;

      case "MEAL":
        meal.handleMealEdit(item);
        setInitialData(meal.initialMealData);
        setModalType("meal");
        break;

      case "ACTIVITY":
        activity.handleActivityEdit(item);
        setInitialData(activity.initialActivityData);
        setModalType("activity");
        break;
    }

  };

  // ---------------- UI Render ----------------
  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* Buttons */}
      <div className="flex w-full gap-4">
        <Button className="flex-1" onClick={() => setModalType("event")}>
          Day Description
        </Button>

        <Button className="flex-1" onClick={() => setModalType("transit")}>
          Transit
        </Button>

        <Button className="flex-1" onClick={() => setModalType("stay")}>
          Stay
        </Button>

        <Button className="flex-1" onClick={() => setModalType("meal")}>
          Meal
        </Button>

        <Button className="flex-1" onClick={() => setModalType("activity")}>
          Activity
        </Button>
      </div>

      {/* List items */}
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No items added yet.</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id || item.tripItemId || `${item.tripType}`}
            className="bg-white border rounded-xl p-4 shadow-sm flex justify-between mb-3"
          >
            <div>
              <p className="font-medium">{item.title || item.name}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleEditClick(item)}>
                <Pencil size={14} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-red-500"
                onClick={() => handleDelete(item)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))
      )}

      {/* --------- MODALS --------- */}

      {modalType === "event" && (
        <ModalWrapper onClose={() => setModalType(null)}>
          <AddDayDescriptionForm
            header={initialData ? "Edit Day Description" : "Add Day Description"}
            initialData={initialData}
            onCancel={() => setModalType(null)}
            onSave={handleSave}
          />
        </ModalWrapper>
      )}

      {modalType === "transit" && (
        <ModalWrapper onClose={() => setModalType(null)}>
          <AddTransitForm
            header={initialData ? "Edit Transit" : "Add Transit"}
            initialData={initialData}
            onCancel={() => setModalType(null)}
            onSave={handleSave}
          />
        </ModalWrapper>
      )}

      {modalType === "stay" && (
        <ModalWrapper onClose={() => setModalType(null)}>
          <AddStayForm
            header={initialData ? "Edit Stay" : "Add Stay"}
            initialData={initialData}
            onCancel={() => setModalType(null)}
            onSave={handleSave}
          />
        </ModalWrapper>
      )}

      {modalType === "meal" && (
        <ModalWrapper onClose={() => setModalType(null)}>
          <AddMealForm
            header={initialData ? "Edit Meal" : "Add Meal"}
            initialData={initialData}
            onCancel={() => setModalType(null)}
            onSave={handleSave}
          />
        </ModalWrapper>
      )}

      {modalType === "activity" && (
        <ModalWrapper onClose={() => setModalType(null)}>
          <AddActivityForm
            header={initialData ? "Edit Activity" : "Add Activity"}
            initialData={initialData}
            onCancel={() => setModalType(null)}
            onSave={handleSave}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
