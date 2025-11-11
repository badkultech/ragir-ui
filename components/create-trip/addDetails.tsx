"use client";

import { useEffect, useState } from "react";
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

// ✅ Import API mutation/query hooks
import {
  useCreateDayDescriptionMutation,
  useLazyGetDayDescriptionsQuery,
  useUpdateDayDescriptionMutation,
  useDeleteDayDescriptionMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/day-description";

import { useCreateTransitMutation } from "@/lib/services/organizer/trip/itinerary/day-details/transit";

type DetailItem = {
  id: number;
  type: string;
  title?: string;
  location?: string;
  time?: string;
  from?: string;
  to?: string;
  departure?: string;
  arrival?: string;
  description?: string;
  packingSuggestion?: string;
};

interface DetailsOptionsProps {
  organizationId: string;
  tripPublicId: string;
  dayDetailId: string;
}

export function DetailsOptions({
  organizationId,
  tripPublicId,
  dayDetailId,
}: DetailsOptionsProps) {
  const [showDayDescription, setShowDayDescription] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [showStay, setShowStay] = useState(false);
  const [showMeal, setShowMeal] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [details, setDetails] = useState<DetailItem[]>([]);
  const [editingItem, setEditingItem] = useState<DetailItem | null>(null);

  // ✅ API hooks
  const [createDayDescription] = useCreateDayDescriptionMutation();
  const [getDayDescriptions] = useLazyGetDayDescriptionsQuery();
  const [updateDayDescription] = useUpdateDayDescriptionMutation();
  const [deleteDayDescription] = useDeleteDayDescriptionMutation();
  const [createTransit] = useCreateTransitMutation();

  // ✅ Fetch all Day Descriptions
  const fetchDayDescriptions = async () => {
    try {
      const response = await getDayDescriptions({
        organizationId,
        tripPublicId,
        dayDetailId,
      }).unwrap();

      if (response?.data?.length) {
        setDetails(
          response.data.map((item) => ({
            id: item.tripItemId,
            type: "event",
            title: item.name,
            description: item.description,
            location: item.location,
            time: `${item.time.hour}:${item.time.minute}`,
            packingSuggestion: item.packingSuggestion,
          }))
        );
      } else {
        setDetails([]);
      }
    } catch (err) {
      console.error("❌ Error fetching day descriptions:", err);
    }
  };

  useEffect(() => {
    if (dayDetailId) fetchDayDescriptions();
  }, [dayDetailId]);

  // ✅ Update existing day description
  const handleUpdateDayDescription = async (itemId: number, data: any) => {
    try {
      const payload = {
        requestId: crypto.randomUUID(),
        currentTimestamp: new Date().toISOString(),
        organizationId,
        name: data.title.trim(),
        description: data.description.trim(),
        saveToLibrary: true,
        documents: [],
        location: data.location || "",
        time: {
          hour: data.time ? Number(data.time.split(":")[0]) : 0,
          minute: data.time ? Number(data.time.split(":")[1]) : 0,
          second: 0,
          nano: 0,
        },
        packingSuggestion: data.packingSuggestion || "",
      };

      await updateDayDescription({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
        data: payload,
      }).unwrap();

      console.log("✅ Day Description Updated");
      fetchDayDescriptions();
    } catch (error) {
      console.error("❌ Error updating Day Description:", error);
    }
  };

  // ✅ Delete day description
  const handleDeleteDayDescription = async (itemId: number) => {
    try {
      await deleteDayDescription({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
      }).unwrap();

      console.log("Deleted day description:", itemId);
      setDetails((prev) => prev.filter((i) => i.id !== itemId));
    } catch (error) {
      console.error("❌ Error deleting day description:", error);
    }
  };

  // ✅ Local add/edit/delete
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

  const handleEdit = (item: DetailItem) => {
    setEditingItem(item);
    if (item.type === "event") setShowDayDescription(true);
    if (item.type === "transit") setShowTransit(true);
    if (item.type === "stay") setShowStay(true);
    if (item.type === "meal") setShowMeal(true);
    if (item.type === "activity") setShowActivity(true);
  };

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
        {details.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">
            No details added yet.
          </p>
        ) : (
          details.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div>{getIcon(item.type)}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.title || "Untitled"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.location ||
                        `${item.from || ""} ${
                          item.to ? `→ ${item.to}` : ""
                        }`}
                    </p>
                    {item.time && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.time}
                      </p>
                    )}
                  </div>
                </div>

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
                    onClick={() => handleDeleteDayDescription(item.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---- MODALS ---- */}

      {/* ✅ DAY DESCRIPTION */}
      {showDayDescription && (
        <ModalWrapper onClose={() => setShowDayDescription(false)}>
          <AddEventForm
            header={editingItem ? "Edit Day Description" : "Add Day Description"}
            onCancel={() => setShowDayDescription(false)}
            onSave={async (data) => {
              if (!data.title?.trim() || !data.description?.trim()) {
                return;
              }

              if (editingItem) {
                await handleUpdateDayDescription(editingItem.id, data);
                setEditingItem(null);
              } else {
                const response = await createDayDescription({
                  organizationId,
                  tripPublicId,
                  dayDetailId,
                  data: {
                    requestId: crypto.randomUUID(),
                    currentTimestamp: new Date().toISOString(),
                    organizationId,
                    name: data.title.trim(),
                    description: data.description.trim(),
                    saveToLibrary: true,
                    documents: [],
                    location: data.location?.trim() || "",
                    time: {
                      hour: data.time
                        ? Number(data.time.split(":")[0])
                        : 0,
                      minute: data.time
                        ? Number(data.time.split(":")[1])
                        : 0,
                      second: 0,
                      nano: 0,
                    },
                    packingSuggestion:
                      data.packingSuggestion?.trim() || "",
                  },
                }).unwrap();

                handleSave("event", { ...data, id: response.tripItemId });
              }

              setShowDayDescription(false);
              fetchDayDescriptions();
            }}
          />
        </ModalWrapper>
      )}

      {/* ✅ TRANSIT */}
      {showTransit && (
        <ModalWrapper onClose={() => setShowTransit(false)}>
          <AddTransitForm
            header="Add Transit"
            onCancel={() => setShowTransit(false)}
            onSave={async (data) => {
              try {
                const payload = {
                  requestId: crypto.randomUUID(),
                  currentTimestamp: new Date().toISOString(),
                  organizationId,
                  name: data.name || "Untitled Transit",
                  saveToLibrary: true,
                  documents: [],
                  fromLocation: data.fromLocation,
                  toLocation: data.toLocation,
                  startTime: {
                    hour: data.startTime
                      ? Number(data.startTime.split(":")[0])
                      : 0,
                    minute: data.startTime
                      ? Number(data.startTime.split(":")[1])
                      : 0,
                    second: 0,
                    nano: 0,
                  },
                  endTime: {
                    hour: data.endTime
                      ? Number(data.endTime.split(":")[0])
                      : 0,
                    minute: data.endTime
                      ? Number(data.endTime.split(":")[1])
                      : 0,
                    second: 0,
                    nano: 0,
                  },
                  vehicleType: data.vehicleType || "TRAVELER_VAN",
                  customVehicleType: data.customVehicleType || "",
                  arrangedBy: data.arrangedBy || "ORGANIZER",
                  description: data.description || "",
                  packingSuggestion: data.packingSuggestion || "",
                };

                const response = await createTransit({
                  organizationId,
                  tripPublicId,
                  dayDetailId,
                  data: payload,
                }).unwrap();

                handleSave("transit", { ...data, id: response.tripItemId });
                setShowTransit(false);
              } catch (error) {
                console.error("❌ Error creating transit:", error);
              }
            }}
          />
        </ModalWrapper>
      )}

      {/* ✅ STAY */}
      {showStay && (
        <ModalWrapper onClose={() => setShowStay(false)}>
          <AddStayForm
            header="Add Stay"
            onCancel={() => setShowStay(false)}
            onSave={(data) => {
              handleSave("stay", data);
              setShowStay(false);
            }}
          />
        </ModalWrapper>
      )}

      {/* ✅ MEAL */}
      {showMeal && (
        <ModalWrapper onClose={() => setShowMeal(false)}>
          <AddMealForm
            header="Add Meal"
            onCancel={() => setShowMeal(false)}
            onSave={(data) => {
              handleSave("meal", data);
              setShowMeal(false);
            }}
          />
        </ModalWrapper>
      )}

      {/* ✅ ACTIVITY */}
      {showActivity && (
        <ModalWrapper onClose={() => setShowActivity(false)}>
          <AddActivityForm
            header="Add Activity"
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
