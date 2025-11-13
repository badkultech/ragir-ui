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
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/ui/ModalWrapper";

// ✅ Forms
import { AddEventForm } from "@/components/library/AddEventForm";
import { AddTransitForm } from "@/components/library/AddTransitForm";
import { AddStayForm } from "@/components/library/AddStayForm";
import { AddMealForm } from "@/components/library/AddMealForm";
import { AddActivityForm } from "@/components/library/AddActivityForm";

// ✅ Custom Hooks
import { useDayDescription } from "./useDayDescription";
import { useTransit } from "./useTransit";
import { useStay } from "./useStay";

// ✅ Props Interface
interface DetailsOptionsProps {
  organizationId: string;
  tripPublicId: string;
  dayDetailId: string;
}

// ✅ Main Component
export function DetailsOptions({
  organizationId,
  tripPublicId,
  dayDetailId,
}: DetailsOptionsProps) {
  // ✅ Hooks for different sections
  const {
    details,
    editingItem,
    initialData,
    setEditingItem,
    setInitialData,
    handleSave,
    handleEdit,
    handleDelete,
  } = useDayDescription({ organizationId, tripPublicId, dayDetailId });

  const {
    transits,
    editingTransit,
    initialTransitData,
    setEditingTransit,
    setInitialTransitData,
    handleTransitSave,
    handleTransitEdit,
    handleTransitDelete,
  } = useTransit({ organizationId, tripPublicId, dayDetailId });

  const {
    stays,
    editingStay,
    initialStayData,
    setEditingStay,
    setInitialStayData,
    handleStaySave,
    handleStayEdit,
    handleStayDelete,
  } = useStay({ organizationId, tripPublicId, dayDetailId });

  // ✅ Local modal states
  const [showDayDescription, setShowDayDescription] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [showStay, setShowStay] = useState(false);
  const [showMeal, setShowMeal] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  // ✅ Icon helper
  const getIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar size={22} className="text-orange-500" />;
      case "transit":
        return <Car size={22} className="text-blue-500" />;
      case "stay":
        return <Home size={22} className="text-green-500" />;
      case "meal":
        return <Utensils size={22} className="text-rose-500" />;
      case "activity":
        return <Activity size={22} className="text-yellow-500" />;
      default:
        return <ImageIcon size={22} />;
    }
  };

  // ✅ Config-driven sections (Dynamic setup)
  const sections = [
    {
      key: "event",
      label: "Day Description",
      color: "orange",
      icon: <Calendar size={16} />,
      items: details,
      setShow: setShowDayDescription,
      show: showDayDescription,
      editHandler: handleEdit,
      deleteHandler: handleDelete,
      form: AddEventForm,
      editing: editingItem,
      initial: initialData,
      resetEditing: () => {
        setEditingItem(null);
        setInitialData(null);
      },
      onSave: handleSave,
    },
    {
      key: "transit",
      label: "Transit",
      color: "blue",
      icon: <Car size={16} />,
      items: transits,
      setShow: setShowTransit,
      show: showTransit,
      editHandler: handleTransitEdit,
      deleteHandler: handleTransitDelete,
      form: AddTransitForm,
      editing: editingTransit,
      initial: initialTransitData,
      resetEditing: () => {
        setEditingTransit(null);
        setInitialTransitData(null);
      },
      onSave: handleTransitSave,
    },
    {
    key: "stay",
      label: "Stay",
      color: "green",
      icon: <Home size={16} />,
      items: stays,
      setShow: setShowStay,
      show: showStay,
      editHandler: handleStayEdit,
      deleteHandler: handleStayDelete,
      form: AddStayForm,
      editing: editingStay,
      initial: initialStayData,
      resetEditing: () => {
        setEditingStay(null);
        setInitialStayData(null);
      },
      onSave: handleStaySave,
    },
    {
      key: "meal",
      label: "Meal",
      color: "rose",
      icon: <Utensils size={16} />,
      items: [],
      setShow: setShowMeal,
      show: showMeal,
      form: AddMealForm,
      onSave: () => setShowMeal(false),
    },
    {
      key: "activity",
      label: "Activity",
      color: "yellow",
      icon: <Activity size={16} />,
      items: [],
      setShow: setShowActivity,
      show: showActivity,
      form: AddActivityForm,
      onSave: () => setShowActivity(false),
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* ---------- Buttons ---------- */}
      <div className="flex w-full gap-4">
        {sections.map((section) => (
          <Button
            key={section.key}
            onClick={() => section.setShow(true)}
            disabled={section.items.length > 0} // disable if already added
            className={`flex-1 border-2 rounded-xl px-6 h-auto flex flex-col items-center justify-center shadow bg-gradient-to-r from-${section.color}-50 to-white text-black font-medium ${
              section.items.length > 0
                ? "opacity-60 cursor-not-allowed border-green-500"
                : ""
            }`}
          >
            {section.icon}
            <span className="text-xs mt-1">{section.label}</span>
          </Button>
        ))}
      </div>

      {/* ---------- Dynamic Lists (Only show if data exists) ---------- */}
{sections
  .filter((section) => section.items.length > 0) // 👈 Only sections with data
  .map((section) => (
    <div key={section.key} className="mt-6 space-y-3">
      <h3 className="font-semibold text-gray-800 text-base border-b pb-1">
        {section.label}
      </h3>

      {section.items.map((item: any) => (
  <div
    key={item.id || item.tripItemId}
    className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="font-medium text-gray-800">
          {item.title || item.name || item.from || "Untitled"}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {item.description || item.location || ""}
        </p>

        {item.time || item.checkInTime || item.checkOutTime ? (
          <p className="text-xs text-gray-500 mt-1">
            {item.time ||
              `${item.checkInTime || ""} - ${item.checkOutTime || ""}`}
          </p>
        ) : null}

        {item.documents?.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {item.documents.map(
              (doc: string | File | { url?: string }, idx: number) => {
                const src =
                  typeof doc === "string"
                    ? doc
                    : doc instanceof File
                    ? URL.createObjectURL(doc)
                    : doc?.url || "";
                return (
                  <img
                    key={idx}
                    src={src}
                    alt={`doc-${idx}`}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                );
              }
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {section.editHandler && (
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full hover:bg-gray-100"
            onClick={() => {
              section.editHandler(item);
              section.setShow(true);
            }}
          >
            <Pencil size={14} className="text-gray-600" />
          </Button>
        )}
        {section.deleteHandler && (
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full text-red-500 hover:bg-red-100"
            onClick={() =>
              section.deleteHandler(item.id || item.tripItemId)
            }
          >
            <Trash2 size={14} />
          </Button>
        )}
      </div>
    </div>
  </div>
))}

    </div>
  ))}


      {/* ---------- Dynamic Modals ---------- */}
      {sections.map((section) => {
        if (!section.show) return null;
        const Form = section.form;

        return (
          <ModalWrapper key={section.key} onClose={() => section.setShow(false)}>
            <Form
              header={
                section.editing
                  ? `Edit ${section.label}`
                  : `Add ${section.label}`
              }
              initialData={section.initial || undefined}
              onCancel={() => {
                section.setShow(false);
                section.resetEditing?.();
              }}
              onSave={async (data: any) => {
                await section.onSave(data);
                section.setShow(false);
              }}
            />
          </ModalWrapper>
        );
      })}
    </div>
  );
}
