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
import { Button } from "../ui/button";
import { ModalWrapper } from "../ui/ModalWrapper";
import { AddEventForm } from "../library/AddEventForm";
import { AddTransitForm } from "../library/AddTransitForm";
import { AddStayForm } from "../library/AddStayForm";
import { AddMealForm } from "../library/AddMealForm";
import { AddActivityForm } from "../library/AddActivityForm";

type DetailItem = {
  id: number;
  type: string;
  title?: string;
  location?: string;
  time?: string;
  activityName?: string;
  transportName?: string;
  from?: string;
  to?: string;
  departure?: string;
  arrival?: string;
  images?: File[] | string[];
};

export function DetailsOptions() {
  const [showDayDescription, setShowDayDescription] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [showStay, setShowStay] = useState(false);
  const [showMeal, setShowMeal] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [details, setDetails] = useState<DetailItem[]>([]);
  const [editingItem, setEditingItem] = useState<DetailItem | null>(null);

  // ✅ Save or Edit
  const handleSave = (type: string, data: any) => {
    if (editingItem) {
      setDetails((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...data, type } : item
        )
      );
      setEditingItem(null);
    } else {
      setDetails((prev) => [...prev, { id: Date.now(), type, ...data }]);
    }
  };

  // ✅ Delete
  const handleDelete = (id: number) => {
    setDetails((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Edit
  const handleEdit = (item: DetailItem) => {
    setEditingItem(item);
    if (item.type === "event") setShowDayDescription(true);
    if (item.type === "transit") setShowTransit(true);
    if (item.type === "stay") setShowStay(true);
    if (item.type === "meal") setShowMeal(true);
    if (item.type === "activity") setShowActivity(true);
  };

  // ✅ Icon selector
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

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* ---- BUTTONS ---- */}
      {/* ---- BUTTONS ---- */}
<div className="flex w-full gap-4">
  <Button
    onClick={() => setShowDayDescription(true)}
    className="flex-1 border-2 rounded-xl px-6 h-auto flex flex-col items-center justify-center shadow bg-gradient-to-r from-orange-50 to-white text-black font-medium"
  >
    <Calendar size={16} />
    <span className="text-xs mt-1">Day Description</span>
  </Button>

  <Button
    onClick={() => setShowTransit(true)}
    className="flex-1 border-2 rounded-xl px-6 h-auto flex flex-col items-center justify-center shadow bg-gradient-to-r from-blue-50 to-white text-black font-medium"
  >
    <Car size={16} />
    <span className="text-xs mt-1">Transit</span>
  </Button>

  <Button
    onClick={() => setShowStay(true)}
    className="flex-1 border-2 rounded-xl px-6 h-auto flex flex-col items-center justify-center shadow bg-gradient-to-r from-green-50 to-white text-black font-medium"
  >
    <Home size={16} />
    <span className="text-xs mt-1">Stay</span>
  </Button>

  <Button
    onClick={() => setShowMeal(true)}
    className="flex-1 border-2 rounded-xl px-6 h-auto flex flex-col items-center justify-center shadow bg-gradient-to-r from-rose-50 to-white text-black font-medium"
  >
    <Utensils size={16} />
    <span className="text-xs mt-1">Meal</span>
  </Button>

  <Button
    onClick={() => setShowActivity(true)}
    className="flex-1 border-2 rounded-xl px-6 h-auto flex flex-col items-center justify-center shadow bg-gradient-to-r from-yellow-50 to-white text-black font-medium"
  >
    <Activity size={16} />
    <span className="text-xs mt-1">Activity</span>
  </Button>
</div>


      {/* ---- DISPLAY SAVED ITEMS ---- */}
      <div className="mt-6 space-y-3">
        {details.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div>{getIcon(item.type)}</div>
                <div>
                  {/* Title */}
                  <h3 className="font-semibold text-gray-800">
                    {item.title ||
                      item.activityName ||
                      item.transportName ||
                      "Untitled"}
                  </h3>

                  {/* Location / Route */}
                  <p className="text-sm text-gray-600">
                    {item.type === "transit"
                      ? `${item.from || ""} ${item.to ? `→ ${item.to}` : ""}`
                      : item.location || ""}
                  </p>

                  {/* Time */}
                  {item.type === "transit" && (item.departure || item.arrival) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {item.departure ? `Departure: ${item.departure}` : ""}{" "}
                      {item.arrival ? `→ Arrival: ${item.arrival}` : ""}
                    </p>
                  )}
                  {item.type !== "transit" && item.time && (
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  )}
                </div>
              </div>

              {/* Edit/Delete Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full hover:bg-gray-100"
                  onClick={() => handleEdit(item)}
                >
                  <Pencil size={14} className="text-gray-600" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-red-500 hover:bg-red-100"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>

            {/* Images (show for all except transit if needed) */}
            {item.type !== "transit" && item.images && item.images.length > 0 && (
              <div className="flex gap-2 mt-3">
                {item.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={
                      typeof img === "string" ? img : URL.createObjectURL(img as File)
                    }
                    alt="uploaded"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ---- MODALS ---- */}
      {showDayDescription && (
        <ModalWrapper onClose={() => setShowDayDescription(false)}>
          <AddEventForm
            onCancel={() => setShowDayDescription(false)}
            onSave={(data) => {
              handleSave("event", data);
              setShowDayDescription(false);
            }}
          />
        </ModalWrapper>
      )}

      {showTransit && (
        <ModalWrapper onClose={() => setShowTransit(false)}>
          <AddTransitForm
            onCancel={() => setShowTransit(false)}
            onSave={(data) => {
              handleSave("transit", data);
              setShowTransit(false);
            }}
          />
        </ModalWrapper>
      )}

      {showStay && (
        <ModalWrapper onClose={() => setShowStay(false)}>
          <AddStayForm
            onCancel={() => setShowStay(false)}
            onSave={(data) => {
              handleSave("stay", data);
              setShowStay(false);
            }}
          />
        </ModalWrapper>
      )}

      {showMeal && (
        <ModalWrapper onClose={() => setShowMeal(false)}>
          <AddMealForm
            onCancel={() => setShowMeal(false)}
            onSave={(data) => {
              handleSave("meal", data);
              setShowMeal(false);
            }}
          />
        </ModalWrapper>
      )}

      {showActivity && (
        <ModalWrapper onClose={() => setShowActivity(false)}>
          <AddActivityForm
            onCancel={() => setShowActivity(false)}
            onSave={(data) => {
              handleSave("activity", data);
              setShowActivity(false);
            }}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
