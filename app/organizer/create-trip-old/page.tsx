"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { GroupLeaders } from "@/components/common/group-leaders";
import { DateTimePicker } from "@/components/common/date-time-picker";
import MDEditor from "@uiw/react-md-editor";
import { Stepper } from "@/components/trip/stepper";
import { usePathname, useRouter } from "next/navigation";
import { tripSteps } from "@/lib/common/stepperConfig";


const moodTags = [
  { id: "mountain", label: "Mountain", icon: "🏔️" },
  { id: "skygaze", label: "Skygaze", icon: "👁️" },
  { id: "beach", label: "Beach", icon: "🏖️" },
  { id: "desert", label: "Desert", icon: "🏜️" },
  { id: "jungle", label: "Jungle", icon: "🌲" },
  { id: "wellness", label: "Wellness", icon: "🌸" },
  { id: "heritage", label: "Heritage", icon: "🏛️" },
  { id: "adventure", label: "Adventure", icon: "🧭" },
  { id: "trekking", label: "Trekking", icon: "🥾" },
  { id: "motorsports", label: "Motorsports", icon: "🏎️" },
  { id: "weekends", label: "Weekends", icon: "📅" },
  { id: "women-only", label: "Women-Only", icon: "👥" },
  { id: "parties", label: "Parties", icon: "🎉" },
  { id: "learning", label: "Learning", icon: "🎓" },
  { id: "camping", label: "Camping", icon: "⛺" },
  { id: "spiritual", label: "Spiritual", icon: "🕉️" },
];

export default function CreateTripPage() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB");
  const pathname = usePathname();

  const [formData, setFormData] = useState({
    tripTitle: "Himalayan group",
    startDate: formattedDate,
    endDate: formattedDate,
    totalDays: 1, // default 1 day
    minGroupSize: 2,
    maxGroupSize: 20,
    minAge: 18,
    maxAge: 50,
    tripHighlights: "",
  });

  const [selectedMoodTags, setSelectedMoodTags] = useState<string[]>([
    "skygaze",
  ]);
  const [cityTags, setCityTags] = useState<string[]>([
    "Jaipur",
    "Mumbai",
    "Pune",
  ]);
  const [cityInput, setCityInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // -------------------
  // Auto-calculate totalDays whenever startDate or endDate changes
  // -------------------
  useEffect(() => {
    if (!formData.startDate || !formData.endDate) return;

    // Convert dd/MM/yyyy to yyyy-MM-dd
    const parseDate = (dateStr: string) => {
      const parts = dateStr.split("/");
      if (parts.length === 3)
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      return new Date(dateStr);
    };

    const start = parseDate(formData.startDate);
    const end = parseDate(formData.endDate);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    setFormData((prev) => ({ ...prev, totalDays: diffDays }));
  }, [formData.startDate, formData.endDate]);

  // -------------------
  // Input change handler
  // -------------------
  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field: string, increment: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: increment
        ? (prev[field as keyof typeof prev] as number) + 1
        : Math.max(0, (prev[field as keyof typeof prev] as number) - 1),
    }));
  };

  const toggleMoodTag = (tagId: string) => {
    setSelectedMoodTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const addCityTag = () => {
    if (cityInput.trim() && !cityTags.includes(cityInput.trim())) {
      setCityTags((prev) => [...prev, cityInput.trim()]);
      setCityInput("");
    }
  };

  const removeCityTag = (tagToRemove: string) => {
    setCityTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSaveAsDraft = () => {
    console.log("Saving as draft:", {
      ...formData,
      selectedMoodTags,
      cityTags,
    });
  };

  const handleSaveAndNext = () => {
    const currentIndex = tripSteps.findIndex((s) => s.path === pathname);
    if (currentIndex < tripSteps.length - 1) {
      router.push(tripSteps[currentIndex + 1].path);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar />
      <div className="flex-1 flex flex-col">
        <AppHeader title="Create New Trip" />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Steps */}
            <div className="flex items-center justify-between mb-8">
              <Stepper />
            </div>

            {/* Trip Title */}
            <div className="space-y-8">
              <div>
                <Label
                  htmlFor="tripTitle"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Trip Title <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="tripTitle"
                    value={formData.tripTitle}
                    onChange={(e) =>
                      handleInputChange("tripTitle", e.target.value)
                    }
                    className="pr-20"
                    maxLength={80}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-orange-500">
                    {formData.tripTitle.length}/80 Characters
                  </span>
                </div>
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="startDate"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Start <span className="text-red-500">*</span>
                  </Label>
                  <DateTimePicker
                    value={formData.startDate}
                    onChange={(value) => handleInputChange("startDate", value)}
                    showTime={false}
                    placeholder="Select start date"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="endDate"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    End <span className="text-red-500">*</span>
                  </Label>
                  <DateTimePicker
                    value={formData.endDate}
                    onChange={(value) => handleInputChange("endDate", value)}
                    showTime={false}
                    placeholder="Select end date"
                  />
                </div>
              </div>

              {/* Total Days */}
              <div>
                <Label
                  htmlFor="totalDays"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Total Days
                </Label>
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <span className="text-gray-500">{formData.totalDays}</span>
                  <span className="text-gray-900 font-medium">
                    {formData.totalDays} Days | {formData.totalDays - 1} Nights
                  </span>
                </div>
              </div>

              {/* Group Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Minimum Group Size <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={formData.minGroupSize.toString().padStart(2, "0")}
                      readOnly
                      className="pr-8 text-center"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                      <button
                        onClick={() => handleNumberChange("minGroupSize", true)}
                        className="h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() =>
                          handleNumberChange("minGroupSize", false)
                        }
                        className="h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Maximum Group Size <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={formData.maxGroupSize.toString()}
                      readOnly
                      className="pr-8 text-center"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                      <button
                        onClick={() => handleNumberChange("maxGroupSize", true)}
                        className="h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() =>
                          handleNumberChange("maxGroupSize", false)
                        }
                        className="h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Age Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Minimum Age (18yrs or above){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={formData.minAge.toString()}
                      readOnly
                      className="pr-8 text-center"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                      <button
                        onClick={() => handleNumberChange("minAge", true)}
                        className="h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleNumberChange("minAge", false)}
                        className="h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Maximum Age <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={formData.maxAge.toString()}
                      readOnly
                      className="pr-8 text-center"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                      <button
                        onClick={() => handleNumberChange("maxAge", true)}
                        className="h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleNumberChange("maxAge", false)}
                        className="h-3 w-3 flex items-center justify-center hover:bg-gray-100 rounded text-xs"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mood Tags */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Mood Tags <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {moodTags.map((tag) => {
                    const isSelected = selectedMoodTags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => toggleMoodTag(tag.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          isSelected
                            ? "bg-orange-50 border-orange-500 text-orange-700"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-base">{tag.icon}</span>
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="cityTags"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  City Tags <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      id="cityTags"
                      placeholder="Add cities/destinations"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addCityTag()}
                      className="flex-1"
                    />
                    <Button
                      onClick={addCityTag}
                      variant="outline"
                      className="px-4 bg-transparent"
                    >
                      Add
                    </Button>
                  </div>
                  {cityTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {cityTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => removeCityTag(tag)}
                            className="ml-1 text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="tripHighlights"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Trip Highlights
                </Label>
                <div className="border border-gray-200 rounded-lg">
                  <div className="relative">
                    <MDEditor
                      value={formData.tripHighlights}
                      onChange={(val) =>
                        handleInputChange("tripHighlights", val ?? "")
                      }
                      preview="edit" // Can be 'edit', 'live', or 'preview'
                      hideToolbar={false}
                    />
                    <span className="absolute bottom-3 right-3 text-sm text-orange-500">
                      {
                        formData.tripHighlights
                          .split(" ")
                          .filter((word) => word.length > 0).length
                      }
                      /500 Words
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <GroupLeaders />
                </div>
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handleSaveAsDraft}
                    className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={handleSaveAndNext}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    Save & Next →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
