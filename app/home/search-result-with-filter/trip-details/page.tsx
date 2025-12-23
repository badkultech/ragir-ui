"use client"

import { useState } from "react"

/* Sections */
import HeroSection from "@/components/homePage/trip-details/HeroSection"
import TripHeader from "@/components/homePage/trip-details/TripHeader"
import TripInfoCards from "@/components/homePage/trip-details/TripInfoCards"
import TripHighlights from "@/components/homePage/trip-details/TripHighlights"
import DayWiseItinerary from "@/components/homePage/trip-details/DayWiseItinerary"
import IncludedSection from "@/components/homePage/trip-details/IncludedSection"
import ExcludedSection from "@/components/homePage/trip-details/ExcludedSection"
import FAQSection from "@/components/homePage/trip-details/FAQSection"
import DesktopSidebar from "@/components/homePage/trip-details/DesktopSidebar"
import MobilePricingBar from "@/components/homePage/trip-details/MobilePricingBar"

/* Modals */
import PricingDetailsModal from "@/components/homePage/trip-details/modal/PricingDetailsModal"
import ReportModal from "@/components/homePage/trip-details/modal/ReportModal"
import AskQuestionModal from "@/components/homePage/trip-details/modal/AskQuestionModal"
import OrganizerProfileModal from "@/components/homePage/trip-details/modal/OrganizerProfileModal"
import MobilePricingModal from "@/components/homePage/trip-details/modal/MobilePricingModal"

/* Data */
import {
  dayTabs,
  day1Activities,
  transfers,
  mealsData,
  staysData,
  activitiesData,
  excludedItems,
  faqItems,
  pricingOptions,
  occupancyOptions,
} from "@/components/homePage/trip-details/trip-data"

import { MainHeader } from "@/components/search-results/MainHeader"
import { Footer } from "@/components/search-results/footer"

export default function TripDetailsPage() {
  const [activeDay, setActiveDay] = useState(0)

  const [showPricingDetails, setShowPricingDetails] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [showAsk, setShowAsk] = useState(false)
  const [showOrganizer, setShowOrganizer] = useState(false)
  const [showMobilePricing, setShowMobilePricing] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Header */}
      <MainHeader logoText="Trip Details" isLoggedIn />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              <HeroSection />

              <TripHeader onOpenOrganizer={() => setShowOrganizer(true)} />

              <TripInfoCards />

              <TripHighlights />

              <DayWiseItinerary
                dayTabs={dayTabs}
                activeDay={activeDay}
                setActiveDay={setActiveDay}
                activities={day1Activities}
              />

              <IncludedSection
                transfers={transfers}
                meals={mealsData}
                stays={staysData}
                activities={activitiesData}
              />

              <ExcludedSection items={excludedItems} />

              <FAQSection faqs={faqItems} />

              <button
                onClick={() => setShowReport(true)}
                className="mx-auto block text-sm text-gray-600 hover:text-gray-900"
              >
                Report this trip
              </button>
            </div>

            {/* Right */}
            <DesktopSidebar
              onPricing={() => setShowPricingDetails(true)}
              onAsk={() => setShowAsk(true)}
            />
          </div>
        </div>
      </main>

      {/* ✅ FULL WIDTH FOOTER */}
      <Footer />

      {/* Mobile Bottom Bar */}
      <MobilePricingBar onOpen={() => setShowMobilePricing(true)} />

      {/* Modals */}
      {showPricingDetails && (
        <PricingDetailsModal
          pricingOptions={pricingOptions}
          onClose={() => setShowPricingDetails(false)}
        />
      )}

      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
      {showAsk && <AskQuestionModal onClose={() => setShowAsk(false)} />}
      {showOrganizer && <OrganizerProfileModal onClose={() => setShowOrganizer(false)} />}
      {showMobilePricing && (
        <MobilePricingModal
          options={occupancyOptions}
          onClose={() => setShowMobilePricing(false)}
        />
      )}
    </div>
  )
}
