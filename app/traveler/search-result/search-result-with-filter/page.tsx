"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Header } from "@/components/search-results/header";
import { SearchResultsTripCard } from "@/components/search-results/search-results-trip-card";
import { AdvancedFilters } from "@/components/search-results/advanced-filters";

import { DesktopFilterBar } from "@/components/search-results/desktop-filter-bar";
import { DesktopFilterSidebar } from "@/components/search-results/desktop-filter-sidebar";
import { MobileBottomBar } from "@/components/search-results/mobile-bottom-bar";
import { FilterTags } from "@/components/search-results/filter-tags";

/* ---------------- SAMPLE TRIP DATA ---------------- */
const trips = [
  {
    id: 1,
    title: "Himalayan Adventure Trek",
    provider: "Mountain Trails",
    location: "Himachal Pradesh, Leh, Nubra Valley",
    subLocation: "+2 more",
    rating: 4.8,
    days: "5D/4N",
    dates: "15 Dec - 20 Dec",
    price: 12999,
    badges: ["Adventure"],
    image: "/hampi-ruins-temples.png",
  }, {
    id: 2,
    title: "Himalayan Adventure Trek",
    provider: "Mountain Trails",
    location: "Himachal Pradesh, Leh, Nubra Valley",
    subLocation: "+2 more",
    rating: 4.8,
    days: "5D/4N",
    dates: "15 Dec - 20 Dec",
    price: 12999,
    badges: ["trekking"],
    image: "/hampi-ruins-temples.png",
  }, {
    id: 3,
    title: "Himalayan Adventure Trek",
    provider: "Mountain Trails",
    location: "Himachal Pradesh, Leh, Nubra Valley",
    subLocation: "+2 more",
    rating: 4.8,
    days: "5D/4N",
    dates: "15 Dec - 20 Dec",
    price: 12999,
    badges: ["wellness"],
    image: "/hampi-ruins-temples.png",
  }, {
    id: 4,
    title: "Himalayan Adventure Trek",
    provider: "Mountain Trails",
    location: "Himachal Pradesh, Leh, Nubra Valley",
    subLocation: "+2 more",
    rating: 4.8,
    days: "5D/4N",
    dates: "15 Dec - 20 Dec",
    price: 12999,
    badges: ["skygaze"],
    image: "/hampi-ruins-temples.png",
  },
];

/* -------------- MAIN PAGE -------------------- */

export default function SearchResultsWithFilters() {
  const searchParams = useSearchParams();

  const moodsFromUrl = searchParams.get("moods");
  const destinationFromUrl = searchParams.get("destination");
  const regionFromUrl = searchParams.get("region");
  const yearFromUrl = searchParams.get("year");
  const monthFromUrl = searchParams.get("month");

  /* ---- Parse Mood Array ---- */
  let parsedMoods: string[] = [];
  try {
    parsedMoods = moodsFromUrl ? JSON.parse(moodsFromUrl) : [];
  } catch {
    parsedMoods = [];
  }

  /* ---- Initial Filters Build ---- */
  const [filters, setFilters] = useState(() => {
    let list: { id: number; label: string }[] = [];
    let id = 1;

    parsedMoods.forEach((m) => list.push({ id: id++, label: m }));

    if (destinationFromUrl)
      list.push({ id: id++, label: `Destination: ${destinationFromUrl}` });

    if (regionFromUrl)
      list.push({ id: id++, label: `Region: ${regionFromUrl}` });

    // if (yearFromUrl) list.push({ id: id++, label: `Year: ${yearFromUrl}` });
    // if (monthFromUrl) list.push({ id: id++, label: `Month: ${monthFromUrl}` });

    return list;
  });

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredTrips = trips.filter((trip) => {
    // 1️⃣ Destination filter
    if (destinationFromUrl) {
        if (!trip.location.toLowerCase().includes(destinationFromUrl.toLowerCase())) {
            return false;
        }
    }

    // 2️⃣ Mood filter (BADGES only)
    if (parsedMoods.length > 0) {
        const tripBadges = trip.badges.map((b) => b.toLowerCase());
        const hasMood = parsedMoods.some((mood) =>
            tripBadges.includes(mood.toLowerCase())
        );
        if (!hasMood) return false;
    }

    // 3️⃣ Year / Month (skip for now because static data)
    return true;
});


  /* ---------------- ACTIONS ---------------- */
  const removeFilter = (id: number) =>
    setFilters((prev) => prev.filter((f) => f.id !== id));

  const clearAllFilters = () => setFilters([]);

  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f3f0]">
      <Header title="Search Results" />

      {/* DESKTOP FILTER BAR */}
      <DesktopFilterBar
        filters={filters}
        onRemove={removeFilter}
        onClear={clearAllFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onToggleSort={() => setShowSortDropdown(!showSortDropdown)}
      />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
        <div className="flex gap-6">
          
          {/* DESKTOP SIDEBAR */}
          <DesktopFilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            onApply={(data: any) => {
              const selectedTags = [
                ...data.moods,
                data.duration,
                data.occupancy,
                data.groupType,
                ...data.destinations,
                ...data.departureCities,
              ].filter(Boolean);

              setFilters(
                selectedTags.map((tag: string, index: number) => ({
                  id: index + 1,
                  label: tag,
                }))
              );
            }}
          />

          {/* RESULTS SECTION */}
          <div className="flex-1">
            {/* Mobile Filter Tags */}
            <div className="md:hidden mb-3">
              <FilterTags filters={filters} onRemove={removeFilter} />
              {filters.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#e07a5f] mt-1 underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <p className="text-sm text-[#6b6b6b] mb-4">
              <span className="text-[#e07a5f] font-semibold">{filteredTrips.length}</span>{" "}
              trips found
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTrips.map((trip) => (
                <SearchResultsTripCard key={trip.id} {...trip} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM FILTER BAR */}
      <MobileBottomBar
        onSort={() => setShowSortDropdown(true)}
        onFilters={() => setShowFilters(true)}
      />

      {/* MOBILE FILTER PANEL */}
      <div className="md:hidden">
        <AdvancedFilters
          isOpen={showFilters}
          isMobile={true}
          onClose={() => setShowFilters(false)}
          onApplyFilters={(data: any) => {
            const selectedTags = [
              ...data.moods,
              data.duration,
              data.occupancy,
              data.groupType,
              ...data.destinations,
              ...data.departureCities,
            ].filter(Boolean);

            setFilters(
              selectedTags.map((tag: string, index: number) => ({
                id: index + 1,
                label: tag,
              }))
            );

            setShowFilters(false);
          }}
        />
      </div>

      <div className="h-16 md:hidden" />
    </div>
  );
}
