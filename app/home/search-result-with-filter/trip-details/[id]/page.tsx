"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

/* Sections */
import HeroSection from "@/components/homePage/trip-details/HeroSection";
import TripHeader from "@/components/homePage/trip-details/TripHeader";
import TripInfoCards from "@/components/homePage/trip-details/TripInfoCards";
import TripHighlights from "@/components/homePage/trip-details/TripHighlights";
import DayWiseItinerary from "@/components/homePage/trip-details/DayWiseItinerary";
import IncludedSection from "@/components/homePage/trip-details/IncludedSection";
import ExcludedSection from "@/components/homePage/trip-details/ExcludedSection";
import FAQSection from "@/components/homePage/trip-details/FAQSection";
import DesktopSidebar from "@/components/homePage/trip-details/DesktopSidebar";
import MobilePricingBar from "@/components/homePage/trip-details/MobilePricingBar";

/* Modals */
import PricingDetailsModal from "@/components/homePage/trip-details/modal/PricingDetailsModal";
import ReportModal from "@/components/homePage/trip-details/modal/ReportModal";
import AskQuestionModal from "@/components/homePage/trip-details/modal/AskQuestionModal";
import LeaderProfileModal from "@/components/homePage/trip-details/modal/LeaderProfileModal";
import MobilePricingModal from "@/components/homePage/trip-details/modal/MobilePricingModal";

import { MainHeader } from "@/components/search-results/MainHeader";
import { Footer } from "@/components/search-results/footer";
import { useTripDetailsQuery } from "@/lib/services/trip-search";

import { TRIP_DETAILS } from "@/lib/constants/strings";

// ... imports ...

export default function TripDetailsPage() {
  const { id } = useParams();

  // ... state ...
  const [activeDay, setActiveDay] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [showAsk, setShowAsk] = useState(false);
  const [showOrganizer, setShowOrganizer] = useState(false);
  const [showMobilePricing, setShowMobilePricing] = useState(false);
  const [showPricingDetails, setShowPricingDetails] = useState(false);

  const { data, isLoading, error } = useTripDetailsQuery(id as string);
  if (isLoading) return <p>{TRIP_DETAILS.PAGE.LOADING}</p>;
  if (error) return <p>{TRIP_DETAILS.PAGE.ERROR}</p>;
  if (!data) return <p>{TRIP_DETAILS.PAGE.NOT_FOUND}</p>;

  // ... payload extraction ...
  const payload = data;
  const trip = payload.tripResponse;
  const itinerary = payload.tripItineraryResponse;
  const exclusions = payload.exclusionsResponse;
  const faq = payload.faqResponse;
  const pricing = payload.tripPricingDTO;
  const organizer = payload.organizerProfileResponse;

  const rawActivities = itinerary?.dayDetailResponseList?.[activeDay]?.tripItems || [];

  const activities = rawActivities.map((item: any) => ({
    time: item.time || item.startTime || item.checkInTime || "--",
    name: item.name,
    description: item.description,
    image: item.documents?.[0]?.url || "",
  }));

  const heroImage =
    payload?.images?.length ? payload.images[0].url : undefined;

  const sidebarImages = payload?.images || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MainHeader logoText={trip?.name || TRIP_DETAILS.PAGE.DEFAULT_LOGO} isLoggedIn />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">

              <HeroSection
                title={trip?.name}
                location={trip?.cityTags?.join(", ")}
                imageUrl={heroImage}
              />

              <TripHeader
                onOpenOrganizer={() => setShowOrganizer(true)}
                moods={trip?.moodTags || []}
                tripTitle={trip?.name}
                providerName={organizer?.organizerName}
                organizerName={trip?.groupLeaders?.[0]?.name}
                cities={trip?.cityTags || []}
              />


              <TripInfoCards
                startPoint={itinerary?.startPoint}
                endPoint={itinerary?.endPoint}
                startDate={trip?.startDate}
                endDate={trip?.endDate}
                minAge={trip?.minAge}
                maxAge={trip?.maxAge}
                minGroupSize={trip?.minGroupSize}
                maxGroupSize={trip?.maxGroupSize}
                totalDays={itinerary?.totalDays}
              />


              <TripHighlights highlights={trip?.highlights} />

              <DayWiseItinerary
                dayTabs={
                  itinerary?.dayDetailResponseList?.map(
                    (d: any) => `${TRIP_DETAILS.PAGE.DAY_PREFIX}${d.dayNumber}`
                  ) || []
                }
                activeDay={activeDay}
                setActiveDay={setActiveDay}
                activities={activities}
              />


              <IncludedSection
                transfers={payload.tripTransferResponseList}
                meals={payload.tripMealResponseList}
                stays={payload.tripStayResponseList}
                activities={payload.tripActivityResponseList}
              />

              <ExcludedSection items={exclusions?.details || []} />

              <FAQSection faqs={faq?.details || []} />
              <button
                onClick={() => setShowReport(true)}
                className="mx-auto block text-sm text-gray-600 hover:text-gray-900"
              >
                {TRIP_DETAILS.PAGE.REPORT_BUTTON}
              </button>
            </div>

            {/* RIGHT */}
            <DesktopSidebar
              onAsk={() => setShowAsk(true)}
              pricing={pricing}
              images={sidebarImages}
            />
          </div>
        </div>
      </main>

      <Footer />

      <MobilePricingBar
        pricing={pricing}
        onOpen={() => setShowMobilePricing(true)}
      />

      {/* MODALS */}
      {showPricingDetails && (
        <PricingDetailsModal
          pricingOptions={pricing}
          onClose={() => setShowPricingDetails(false)}
        />
      )}

      {showReport && (
        <ReportModal
          onClose={() => setShowReport(false)}
          tripPublicId={trip?.publicId}
        />
      )}

      {showAsk && <AskQuestionModal onClose={() => setShowAsk(false)} />}
      {showOrganizer && (
        <LeaderProfileModal
          onClose={() => setShowOrganizer(false)}
          leader={trip?.groupLeaders?.[0]}
        />
      )}

      {showMobilePricing && (
        <MobilePricingModal
          options={pricing}
          onClose={() => setShowMobilePricing(false)}
        />
      )}
    </div>
  );
}
