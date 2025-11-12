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

// ✅ API imports
import {
  useCreateDayDescriptionMutation,
  useLazyGetDayDescriptionsQuery,
  useLazyGetDayDescriptionByIdQuery,
  useUpdateDayDescriptionMutation,
  useDeleteDayDescriptionMutation,
} from "@/lib/services/organizer/trip/itinerary/day-details/day-description";

import { useCreateTransitMutation } from "@/lib/services/organizer/trip/itinerary/day-details/transit";

// ✅ Common mappers
import {
  mapDayDescriptionToFormData,
  mapTransitToFormData,
} from "@/lib/services/organizer/trip/library/common/formDataMappers";

type DetailItem = {
  id: number;
  type: string;
  title?: string;
  location?: string;
  time?: string;
  description?: string;
  packingSuggestion?: string;
  documents?: File[] | string[];
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
  const [initialData, setInitialData] = useState<any>(null);

  // ✅ API hooks
  const [createDayDescription] = useCreateDayDescriptionMutation();
  const [getDayDescriptions] = useLazyGetDayDescriptionsQuery();
  const [getDayDescriptionById] = useLazyGetDayDescriptionByIdQuery();
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

      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      const mapped = list.map((item) => ({
        id: item.tripItemId ?? Date.now(),
        type: "event",
        title: item.name ?? "Untitled",
        description: item.description ?? "",
        location: item.location ?? "",
        time:
          typeof item.time === "string"
            ? item.time
            : item.time
            ? `${String(item.time.hour ?? "00").padStart(2, "0")}:${String(
                item.time.minute ?? "00"
              ).padStart(2, "0")}`
            : "",
        packingSuggestion: item.packingSuggestion ?? "",
        documents: Array.isArray(item.documents)
          ? item.documents.map((doc: any) =>
              typeof doc === "string"
                ? doc
                : doc.url || doc.path || ""
            )
          : [],
      }));

      // ✅ Only one record (latest)
      setDetails(mapped.length > 0 ? [mapped[mapped.length - 1]] : []);
    } catch (err) {
      console.error("❌ Error fetching day descriptions:", err);
    }
  };

  useEffect(() => {
    if (dayDetailId) fetchDayDescriptions();
  }, [dayDetailId]);

  // ✅ Edit handler (GET by id)
  const handleEdit = async (item: DetailItem) => {
    try {
      const response = await getDayDescriptionById({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(item.id),
      }).unwrap();

      const data = response?.data ?? response;
      setEditingItem(item);
      setInitialData({
        title: data?.name || "",
        description: data?.description || "",
        location: data?.location || "",
        time:
          typeof data?.time === "string"
            ? data.time
            : `${data?.time?.hour ?? "00"}:${data?.time?.minute ?? "00"}`,
        packingSuggestion: data?.packingSuggestion || "",
        documents: data?.documents || [],
      });
      setShowDayDescription(true);
    } catch (error) {
      console.error("❌ Error fetching single Day Description:", error);
    }
  };

  // ✅ Delete API
  const handleDeleteDayDescription = async (itemId: number) => {
    try {
      await deleteDayDescription({
        organizationId,
        tripPublicId,
        dayDetailId,
        itemId: String(itemId),
      }).unwrap();

      setDetails([]);
      console.log("🗑️ Deleted Day Description:", itemId);
    } catch (error) {
      console.error("❌ Error deleting day description:", error);
    }
  };

  // ✅ Save API (Create / Update)
  const handleSave = async (data: any) => {
    if (!data.title?.trim() || !data.description?.trim()) return;
    const formData = mapDayDescriptionToFormData(data, data.documents);

    try {
      if (editingItem) {
        // PUT (Update)
        await updateDayDescription({
          organizationId,
          tripPublicId,
          dayDetailId,
          itemId: String(editingItem.id),
          data: formData,
        }).unwrap();
        console.log("✏️ Updated Day Description:", editingItem.id);
      } else {
        // POST (Create)
        await createDayDescription({
          organizationId,
          tripPublicId,
          dayDetailId,
          data: formData,
        }).unwrap();
        console.log("🆕 Created Day Description");
      }

      await fetchDayDescriptions();
    } catch (error) {
      console.error("❌ Error saving Day Description:", error);
    } finally {
      setShowDayDescription(false);
      setEditingItem(null);
      setInitialData(null);
    }
  };

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

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* ---------- Buttons ---------- */}
      <div className="flex w-full gap-4">
        {[
          { label: "Day Description", icon: <Calendar size={16} />, color: "orange", set: setShowDayDescription },
          { label: "Transit", icon: <Car size={16} />, color: "blue", set: setShowTransit },
          { label: "Stay", icon: <Home size={16} />, color: "green", set: setShowStay },
          { label: "Meal", icon: <Utensils size={16} />, color: "rose", set: setShowMeal },
          { label: "Activity", icon: <Activity size={16} />, color: "yellow", set: setShowActivity },
        ].map((btn) => (
          <Button
            key={btn.label}
            onClick={() => btn.set(true)}
            className={`flex-1 border-2 rounded-xl px-6 h-auto flex flex-col items-center justify-center shadow bg-gradient-to-r from-${btn.color}-50 to-white text-black font-medium`}
          >
            {btn.icon}
            <span className="text-xs mt-1">{btn.label}</span>
          </Button>
        ))}
      </div>

      {/* ---------- Day Description ---------- */}
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
                      {item.location || ""}
                    </p>
                    {item.time && (
                      <p className="text-xs text-gray-500 mt-1">{item.time}</p>
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

      {/* ---------- Modals ---------- */}
      {showDayDescription && (
        <ModalWrapper onClose={() => setShowDayDescription(false)}>
          <AddEventForm
            header={editingItem ? "Edit Day Description" : "Add Day Description"}
            initialData={initialData || undefined}
            onCancel={() => {
              setShowDayDescription(false);
              setEditingItem(null);
              setInitialData(null);
            }}
            onSave={handleSave}
          />
        </ModalWrapper>
      )}

      {showTransit && (
        <ModalWrapper onClose={() => setShowTransit(false)}>
          <AddTransitForm
            header="Add Transit"
            onCancel={() => setShowTransit(false)}
            onSave={async (data) => {
              try {
                const formData = mapTransitToFormData(data, data.documents);
                const response = await createTransit({
                  organizationId,
                  tripPublicId,
                  dayDetailId,
                  data: formData,
                }).unwrap();

                setShowTransit(false);
                console.log("✅ Transit created:", response);
              } catch (error) {
                console.error("❌ Error creating transit:", error);
              }
            }}
          />
        </ModalWrapper>
      )}

      {showStay && (
        <ModalWrapper onClose={() => setShowStay(false)}>
          <AddStayForm
            header="Add Stay"
            onCancel={() => setShowStay(false)}
            onSave={() => setShowStay(false)}
          />
        </ModalWrapper>
      )}

      {showMeal && (
        <ModalWrapper onClose={() => setShowMeal(false)}>
          <AddMealForm
            header="Add Meal"
            onCancel={() => setShowMeal(false)}
            onSave={() => setShowMeal(false)}
          />
        </ModalWrapper>
      )}

      {showActivity && (
        <ModalWrapper onClose={() => setShowActivity(false)}>
          <AddActivityForm
            header="Add Activity"
            onCancel={() => setShowActivity(false)}
            onSave={() => setShowActivity(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
