"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader";
import { SectionCard } from "@/components/create-trip/section-card";
import { TripSummaryCard } from "@/components/create-trip/trip-summary-card";
import { WizardFooter } from "@/components/create-trip/wizard-footer";
import { Sidebar } from "@/components/organizer/sidebar";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";

interface ReviewPageState {
  tripName: string;
  travelDates: string;
  duration: string;
  groupSize: string;
  ageRange: string;
  leader: string;
  itineraryType: string;
  confirmed: boolean;
}

export default function ReviewPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [state, setState] = useState<ReviewPageState>({
    tripName: "Himalaya",
    travelDates: "25-09-25 to 29-09-25",
    duration: "5 Days | 6 Nights",
    groupSize: "8 - 12 people",
    ageRange: "18 - 56 years",
    leader: "Not Assigned",
    itineraryType: "Advanced",
    confirmed: false,
  });

  const handleDraft = () => {
    console.log(" Review saved as draft:", state);
    // TODO: Persist to backend
  };

  const handleSubmit = () => {
    if (!state.confirmed) {
      alert("Please confirm the information before submitting");
      return;
    }
    alert("Trip submitted successfully ✅");
    router.push("/organizer");
  };

  const handlePrevious = () => {
    router.push("/organizer/create-trip/pricing");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 h-auto  ">
        <AppHeader title="Create New Trip" />
        <TripStepperHeader activeStep={6} />

        <SectionCard title="Review & Submit">
          <TripSummaryCard
            data={{
              tripName: state.tripName,
              travelDates: state.travelDates,
              duration: state.duration,
              groupSize: state.groupSize,
              ageRange: state.ageRange,
              leader: state.leader,
              itineraryType: state.itineraryType,
            }}
            confirmed={state.confirmed}
            onConfirmedChange={(confirmed) => setState({ ...state, confirmed })}
          />
        </SectionCard>

        <WizardFooter
          prevLabel="Previous"
          nextLabel="Submit"
          onPrev={handlePrevious}
          onDraft={handleDraft}
          onNext={handleSubmit}
        />
      </div>
    </div>
  );
}
