"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";

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
];

type FormData = {
  tripTitle: string;
  startDate: string;
  endDate: string;
  totalDays: string;
  minGroupSize: number;
  maxGroupSize: number;
  minAge: number;
  maxAge: number;
  cityTags: string;
  tripHighlights: string;
};

function parseDDMMYYYY(v: string) {
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [_, dd, mm, yyyy] = m;
  const d = Number(dd),
    mth = Number(mm) - 1,
    y = Number(yyyy);
  const dt = new Date(y, mth, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mth || dt.getDate() !== d)
    return null;
  return dt;
}

export default function CreateTripPage() {
  const [formData, setFormData] = useState<FormData>({
    tripTitle: "Himalayan group",
    startDate: "14/09/2025",
    endDate: "20/09/2025",
    totalDays: "Auto Calculated",
    minGroupSize: 2,
    maxGroupSize: 20,
    minAge: 18,
    maxAge: 50,
    cityTags: "",
    tripHighlights: "",
  });

  const [selectedMoodTags, setSelectedMoodTags] = useState<string[]>([]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }));
  };

  const handleNumberChange = (field: keyof FormData, increment: boolean) => {
    setFormData((prev) => {
      const curr = prev[field] as unknown as number;
      const next = increment ? curr + 1 : Math.max(0, curr - 1);
      return { ...prev, [field]: next as any };
    });
  };

  const toggleMoodTag = (tagId: string) => {
    setSelectedMoodTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const computedDays = useMemo(() => {
    const s = parseDDMMYYYY(formData.startDate);
    const e = parseDDMMYYYY(formData.endDate);
    if (!s || !e) return "Auto Calculated";
    const diff =
      Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? `${diff} Days` : "Auto Calculated";
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = () => {
    console.log("Form submitted:", {
      ...formData,
      totalDays: computedDays,
      selectedMoodTags,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Create New Trip" />
        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-6xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-6 md:px-8 py-6 md:py-8">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-8">
                  Trip Overview
                </h1>

                <div className="space-y-8">
                  {/* Trip Title */}
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
                        className="pr-24"
                        maxLength={80}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs md:text-sm text-orange-500">
                        {formData.tripTitle.length}/80 Characters
                      </span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="startDate"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        Start <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="startDate"
                          value={formData.startDate}
                          onChange={(e) =>
                            handleInputChange("startDate", e.target.value)
                          }
                          className="pr-10"
                          placeholder="DD/MM/YYYY"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          📅
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="endDate"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        End <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="endDate"
                          value={formData.endDate}
                          onChange={(e) =>
                            handleInputChange("endDate", e.target.value)
                          }
                          className="pr-10"
                          placeholder="DD/MM/YYYY"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          📅
                        </span>
                      </div>
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
                    <Input
                      id="totalDays"
                      value={computedDays}
                      readOnly
                      className="bg-gray-50 text-gray-500"
                    />
                  </div>

                  {/* Group Size */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Minimum Group Size
                      </Label>
                      <div className="relative">
                        <Input
                          value={formData.minGroupSize
                            .toString()
                            .padStart(2, "0")}
                          readOnly
                          className="pr-8 text-center"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                          <button
                            onClick={() =>
                              handleNumberChange("minGroupSize", true)
                            }
                            className="h-4 w-4 flex items-center justify-center hover:bg-gray-100 rounded text-[10px] leading-none"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() =>
                              handleNumberChange("minGroupSize", false)
                            }
                            className="h-4 w-4 flex items-center justify-center hover:bg-gray-100 rounded text-[10px] leading-none"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Maximum Group Size
                      </Label>
                      <div className="relative">
                        <Input
                          value={formData.maxGroupSize.toString()}
                          readOnly
                          className="pr-8 text-center"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                          <button
                            onClick={() =>
                              handleNumberChange("maxGroupSize", true)
                            }
                            className="h-4 w-4 flex items-center justify-center hover:bg-gray-100 rounded text-[10px] leading-none"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() =>
                              handleNumberChange("maxGroupSize", false)
                            }
                            className="h-4 w-4 flex items-center justify-center hover:bg-gray-100 rounded text-[10px] leading-none"
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
                        Minimum Age (18yrs or above)
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
                            className="h-4 w-4 flex items-center justify-center hover:bg-gray-100 rounded text-[10px] leading-none"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleNumberChange("minAge", false)}
                            className="h-4 w-4 flex items-center justify-center hover:bg-gray-100 rounded text-[10px] leading-none"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Maximum Age
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
                            className="h-4 w-4 flex items-center justify-center hover:bg-gray-100 rounded text-[10px] leading-none"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleNumberChange("maxAge", false)}
                            className="h-4 w-4 flex items-center justify-center hover:bg-gray-100 rounded text-[10px] leading-none"
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
                      Mood Tags
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {moodTags.map((tag) => {
                        const isSelected = selectedMoodTags.includes(tag.id);
                        return (
                          <button
                            type="button"
                            key={tag.id}
                            onClick={() => toggleMoodTag(tag.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                              isSelected
                                ? "bg-orange-50 border-orange-200 text-orange-700"
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

                  {/* City Tags */}
                  <div>
                    <Label
                      htmlFor="cityTags"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      City Tags
                    </Label>
                    <Input
                      id="cityTags"
                      placeholder="Add cities/ destinations"
                      value={formData.cityTags}
                      onChange={(e) =>
                        handleInputChange("cityTags", e.target.value)
                      }
                    />
                  </div>

                  {/* Trip Highlights */}
                  <div>
                    <Label
                      htmlFor="tripHighlights"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      Trip Highlights
                    </Label>
                    <div className="border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-1 p-2 border-b border-gray-200">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <span className="font-bold text-sm">B</span>
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <span className="italic text-sm">I</span>
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <span className="underline text-sm">U</span>
                        </button>
                        <div className="w-px h-4 bg-gray-300 mx-1" />
                        <button className="p-1 hover:bg-gray-100 rounded text-sm">
                          •
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded text-sm">
                          1.
                        </button>
                        <div className="w-px h-4 bg-gray-300 mx-1" />
                        <button className="p-1 hover:bg-gray-100 rounded text-sm">
                          ⬅
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded text-sm">
                          ➡
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded text-sm">
                          ⬆
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded text-sm">
                          ⬇
                        </button>
                      </div>
                      <div className="relative">
                        <Textarea
                          id="tripHighlights"
                          placeholder="Type here"
                          value={formData.tripHighlights}
                          onChange={(e) =>
                            handleInputChange("tripHighlights", e.target.value)
                          }
                          className="min-h-32 border-0 resize-none focus:ring-0"
                          maxLength={500}
                        />
                        <span className="absolute bottom-3 right-3 text-sm text-orange-500">
                          {formData.tripHighlights.length}/500 Characters
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer navigation */}
                  <div className="flex justify-between pt-6">
                    <Button
                      variant="outline"
                      className="px-8 py-2 border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                      type="button"
                    >
                      ← Previous
                    </Button>
                    <button
                      onClick={handleSubmit}
                      className="px-8 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 hover:from-orange-500 hover:via-orange-600 hover:to-red-600 transition-all duration-200"
                      type="button"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
