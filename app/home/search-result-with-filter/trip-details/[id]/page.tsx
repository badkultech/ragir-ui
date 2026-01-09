"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HeroSection from "@/components/homePage/trip-details/HeroSection";
import TripHeader from "@/components/homePage/trip-details/TripHeader";
import TripInfoCards from "@/components/homePage/trip-details/TripInfoCards";
import TripHighlights from "@/components/homePage/trip-details/TripHighlights";
import DayWiseItinerary from "@/components/homePage/trip-details/DayWiseItinerary";
import ExcludedSection from "@/components/homePage/trip-details/ExcludedSection";
import FAQSection from "@/components/homePage/trip-details/FAQSection";
import DesktopSidebar from "@/components/homePage/trip-details/DesktopSidebar";
import MobilePricingBar from "@/components/homePage/trip-details/MobilePricingBar";
import PricingDetailsModal from "@/components/homePage/trip-details/modal/PricingDetailsModal";
import ReportModal from "@/components/homePage/trip-details/modal/ReportModal";
import AskQuestionModal from "@/components/homePage/trip-details/modal/AskQuestionModal";
import LeaderProfileModal from "@/components/homePage/trip-details/modal/LeaderProfileModal";
import MobilePricingModal from "@/components/homePage/trip-details/modal/MobilePricingModal";
import { MainHeader } from "@/components/search-results/MainHeader";
import { Footer } from "@/components/search-results/footer";
import { useTripDetailsQuery } from "@/lib/services/trip-search";
import { TRIP_DETAILS } from "@/lib/constants/strings";
import OrganizerProfileModal from "@/components/homePage/trip-details/modal/OrganizerProfileModal";

export default function TripDetailsPage() {
  const { id } = useParams();

  type SelectedPricing = {
    options: Record<string, any>;
    addOns: string[];
    finalPrice: number;
  };
  const [activeDay, setActiveDay] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [showAsk, setShowAsk] = useState(false);
  const [showLeader, setShowLeader] = useState(false);
  const [showOrganizer, setShowOrganizer] = useState(false);
  const [showMobilePricing, setShowMobilePricing] = useState(false);
  const [showPricingDetails, setShowPricingDetails] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<SelectedPricing>({
    options: {},
    addOns: [],
    finalPrice: 0,
  });

  const { data, isLoading, error } = useTripDetailsQuery(id as string);
  if (isLoading) return <p>{TRIP_DETAILS.PAGE.LOADING}</p>;
  if (error) return <p>{TRIP_DETAILS.PAGE.ERROR}</p>;
  if (!data) return <p>{TRIP_DETAILS.PAGE.NOT_FOUND}</p>;

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

const tripName = trip?.name;
const duration = itinerary?.totalDays
    ? `${itinerary?.totalDays} Days`
    : "";
const dates =
  trip?.startDate && trip?.endDate
    ? `${trip.startDate} → ${trip.endDate}`
    : "";
let price = "";

if (pricing?.tripPricingType === "SIMPLE") {
  const base = pricing.simplePricingRequest?.basePrice || 0;
  const discount = pricing.simplePricingRequest?.discountPercent || 0;
  const final = base - (base * discount) / 100;
  price = `₹${Math.round(final).toLocaleString()} / person`;
}

if (pricing?.tripPricingType === "DYNAMIC") {
  price = "Dynamic pricing (based on options)";
}


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MainHeader isLoggedIn />

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
                onOpenLeader={() => setShowLeader(true)}
                moods={trip?.moodTags || []}
                tripTitle={trip?.name}
                providerName={organizer?.organizerName}
                providerImage={organizer?.displayPicture?.url || null}
                organizerName={trip?.groupLeaders?.[0]?.name}
                organizerImage={trip?.groupLeaders?.[0]?.documents?.[0]?.url || null}
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
              onRequestInvite={(data) => {
                setSelectedPricing(data);
                setShowPricingDetails(true);
              }}
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
          pricing={pricing}
          selectedPricing={selectedPricing}
          onClose={() => setShowPricingDetails(false)}
        />
      )}

      {showAsk && (
  <AskQuestionModal
    onClose={() => setShowAsk(false)}
    tripPublicId={trip?.publicId}
    tripName={tripName}
    duration={duration}
    dates={dates}
    price={price}
  />
)}

      {showReport && (
        <ReportModal
          onClose={() => setShowReport(false)}
          tripPublicId={trip?.publicId}
        />
      )}
      {showLeader && (
        <LeaderProfileModal
          onClose={() => setShowLeader(false)}
          leader={{
            name: trip?.groupLeaders?.[0]?.name,
            bio: trip?.groupLeaders?.[0]?.bio,
            tagline: trip?.groupLeaders?.[0]?.tagline,
            imageUrl: trip?.groupLeaders?.[0]?.documents?.[0]?.url,
            likes: 1947,
            years: 12,
            trips: 300,
            travelers: 1947,
          }}
        />
      )}


      {showMobilePricing && (
        <MobilePricingModal
          onAsk={() => setShowAsk(true)}
          options={pricing}
          onClose={() => setShowMobilePricing(false)}
          onRequestInvite={(data) => {
            setSelectedPricing(data);
            setShowMobilePricing(false);
            setShowPricingDetails(true);
          }}
        />

      )}
      {showOrganizer && (
        <OrganizerProfileModal
          organizer={organizer}
          onClose={() => setShowOrganizer(false)}
        />
      )}

    </div>
  );
}
