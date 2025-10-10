"use client";

import { useState, useRef } from "react";
import { Calendar, MapPin } from "lucide-react";
import { Sidebar } from "@/components/organizer/sidebar";
import { AppHeader } from "@/components/app-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {AddLeaderModal} from "@/components/group-leader/AddLeaderModal";
import {ChooseLeaderModal} from "@/components/group-leader/ChooseLeaderModal";
import { useRouter } from "next/navigation";
import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader";




export default function CreateTripPage() {
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const [leaderModalOpen, setLeaderModalOpen] = useState(false);
  const [chooseModalOpen, setChooseModalOpen] = useState(false);
  const router = useRouter();

  const tags = [
    "Mountain", "Skygaze", "Beach", "Desert", "Jungle",
    "Wellness", "Heritage", "Adventure", "Trekking", "Workcation",
    "Weekend", "Woman-Only", "Forest", "Learning", "Camping"
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <AppHeader title="Organizers" />
        
        <TripStepperHeader activeStep={1} />
        <div className="p-8 bg-gray-50 min-h-screen">

          <div className="max-w-4xl mx-auto bg-white shadow rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Trip Overview
            </h2>

            {/* Trip Title */}
            <div className="mb-6">
              <Label className="block text-gray-600 mb-2 font-medium">
                Trip Title
              </Label>
              <Input
                type="text"
                placeholder="Enter trip title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Start and End Dates */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label className="block text-gray-600 mb-2 font-medium">
                  Start Date
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                     placeholder="dd-mm-yyyy --:--"
                    ref={startDateRef}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                   />
                  <Calendar
                    onClick={() => startDateRef.current?.showPicker()}
                     className="absolute right-3 top-2.5 text-gray-400" size={18}
                     />
                </div>
              </div>
              <div>
                <Label className="block text-gray-600 mb-2 font-medium">
                  End Date
                </Label>  
                <div className="relative">
                   <input type="datetime-local" className="w-full border px-3 py-2  rounded-lg outline-none text-sm"  />

                </div>
              </div>
            </div>

            {/* Group Size */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label className="block text-gray-600 mb-2 font-medium">
                  Minimum Group Size
                </Label>
                <Input
                  type="number"
                  placeholder="Enter number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <Label className="block text-gray-600 mb-2 font-medium">
                  Maximum Group Size
                </Label>
                <Input
                  type="number"
                  placeholder="Enter number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Mood Tags */}
            <div className="mb-6">
              <Label className="block text-gray-600 mb-3 font-medium">
                Mood Tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${selectedTags.includes(tag)
                        ? "bg-orange-500 text-white border-orange-500"
                        : "border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="mb-6">
              <Label className="block text-gray-600 mb-2 font-medium">
                Trip Locations
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g., Mumbai, Pune"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                />
                <MapPin className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-8">
              <Label className="block text-gray-600 mb-2 font-medium">
                Trip Highlights
              </Label>
              <Textarea
                rows={4}
                placeholder="Enter trip highlights..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 resize-none"
              ></Textarea>
            </div>

            {/* Bottom Buttons */}
            <div className="rounded-xl border border-gray-200 p-6 bg-white mb-8">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xl">Group Leaders</span>
                <div className="flex gap-3">
                  <Button  onClick={() => setLeaderModalOpen(true)}
                   className="border border-orange-500 text-orange-500 px-5 py-2 rounded-md font-medium hover:bg-orange-50 transition-all flex items-center gap-2">
                    <span className="text-lg leading-none">+</span> Add Leader
                  </Button>
                  <Button  onClick={() => setChooseModalOpen(true)}
                  className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded-md font-medium shadow hover:from-orange-500 hover:to-pink-600 transition-all">
                    Choose from Library
                  </Button>
                </div>
              </div>
              <p className="text-gray-400 text-base">Select from existing leaders or add new</p>
            </div>

            <div className="flex items-center gap-4 mt-10 justify-end">
              <Button
                className="px-8 py-2 rounded-full border border-gray-300 text-gray-500 font-medium bg-white hover:bg-gray-50 transition"
              >
                Save as Draft
              </Button>
              <Button onClick={() => router.push("/organizer/create-trip/Itinerary")}
                className="px-8 py-2 rounded-full font-medium text-white bg-gradient-to-r from-orange-400 to-pink-500 shadow hover:from-orange-500 hover:to-pink-600 transition flex items-center gap-2"
              >
                Save & Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            </div>

          </div>
        </div>
         <AddLeaderModal open={leaderModalOpen} onClose={() => setLeaderModalOpen(false)} />
          <ChooseLeaderModal open={chooseModalOpen} onClose={() => setChooseModalOpen(false)} />
      {/* <ItineraryPage open={itineraryOpen} onClose={() => setItineraryOpen(false)} /> */}
      </div>
    </div>
  );
}
