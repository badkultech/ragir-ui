"use client";

import { useState } from "react";
import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader";
import { Sidebar } from "@/components/organizer/sidebar";
import { AppHeader } from "@/components/app-header";
import { DetailsOptions } from "@/components/create-trip/addDetails";
import { WizardFooter } from "@/components/create-trip/wizard-footer";
import { useRouter } from "next/navigation";
import { FileUploadCard } from "@/components/create-trip/file-upload-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ItineraryPage() {
  // Mock state for demo
  const router = useRouter()
  const [days] = useState([
    { day: 1, date: "Saturday, March 15, 2025" },
    { day: 2, date: "Sunday, March 16, 2025" },
    { day: 3, date: "Monday, March 17, 2025" }
  ]);


   const [showDetails, setShowDetails] = useState([false,false,false]);

    const handleAddDetails = (idx:number) => {
    setShowDetails(prev =>
      prev.map((shown, i) => i === idx ? true : shown)
    );
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
         <Sidebar />
         <div className="flex-1">
           <AppHeader title="Create New Trip" />
           
    <div className="bg-white min-h-screen w-full flex flex-col">
      {/* Stepper (responsive) */}
      <TripStepperHeader activeStep={2} />
      {/* Main Card */}
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow p-4 sm:p-8 mb-6">
       
       <FileUploadCard/>

        {/* Days render */}
        {days.map((d, dayIdx) => (
          <div key={d.day} className="mb-4">
            <div className="rounded-lg bg-orange-50 px-4 py-2 font-semibold text-orange-700 mb-2 text-[15px]">
              Day {d.day} <span className="text-gray-400 font-normal ml-2">{d.date}</span>
            </div>

            <div className="bg-gray-50 rounded-lg px-4 py-3 mb-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Label className="text-sm block mb-1 font-medium">Start Point{dayIdx === 0 ? " *" : ""}</Label>
                <Input type="text" className="w-full border px-3 py-2 rounded outline-none text-sm" placeholder="Mumbai" />
              </div>
              <div className="flex items-center flex-1 gap-2">
                <Input type="datetime-local" className="w-full border px-3 py-2 mt-6 rounded outline-none text-sm" placeholder="02/09/2025" />
               
              </div>
            </div>
            <div>
              {!showDetails[dayIdx] && (
                  <button
                    className="rounded-full px-5 py-1.5 mt-2 text-white bg-gradient-to-r from-orange-400 to-pink-500 font-medium shadow"
                    onClick={() => handleAddDetails(dayIdx)}
                  >
                    + Add Details
                  </button>
                )}
                {showDetails[dayIdx] && (
                  <DetailsOptions />
                )}
            </div>
          </div>
        ))}

        {/* End Point (last) */}
        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4 flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <label className="text-sm block mb-1 font-medium">End Point *</label>
            <input type="text" className="w-full border px-3 py-2 rounded outline-none text-sm" placeholder="Goa" />
          </div>
          <div className="flex items-center flex-1 gap-2">
            <input type="datetime-local" className="w-full border px-3 py-2 mt-6 rounded outline-none text-sm" placeholder="02/09/2025" />

          </div>
        </div>
      </div>

      {/* Bottom buttons: always fixed on mobile */}
    <div className="pr-9">
     <WizardFooter
        onPrev={() => router.push("/organizer/create-trip")}
        onDraft={() => console.log(" Draft itinerary saved")}
        onNext={() => router.push("/organizer/create-trip/exclusions")}
        prevLabel="‹ Previous"
        />
        </div>
        </div>
        </div>
    </div>
  );
}
