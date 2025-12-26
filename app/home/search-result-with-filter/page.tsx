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
import NoTripsFound from "@/components/search-results/NoTripsFound";

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
    discount: 0,
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
    discount: 10,
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
    discount: 20,
    badges: ["skygaze"],
    image: "/hampi-ruins-temples.png",
  },
];

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

    if (yearFromUrl) list.push({ id: id++, label: `Year: ${yearFromUrl}` });
    if (monthFromUrl) list.push({ id: id++, label: `Month: ${monthFromUrl}` });

    return list;
  });

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredTrips = trips.filter((trip) => {

    const tripBadges = trip.badges.map((b) => b.toLowerCase());
    if (parsedMoods.length > 0) {
      const hasAtLeastOneMood = parsedMoods.some((mood) =>
        tripBadges.includes(mood.toLowerCase())
      );
      if (!hasAtLeastOneMood) return false;
    }
    if (destinationFromUrl) {
      if (!trip.location.toLowerCase().includes(destinationFromUrl.toLowerCase())) {
        return false;
      }
    }
    if (filters.length > 0) {
      let matchFound = false;

      for (const f of filters) {
        const label = f.label.toLowerCase();

        // Destination from sidebar
        if (label.includes("destination:")) {
          const dest = label.replace("destination:", "").trim();
          if (trip.location.toLowerCase().includes(dest)) {
            matchFound = true;
          }
        }

        // Mood match
        if (trip.badges.some((b) => label.includes(b.toLowerCase()))) {
          matchFound = true;
        }
      }

      if (!matchFound) return false;
    }

    return true;
  });



  /* ---------------- ACTIONS ---------------- */
  const removeFilter = (id: number) =>
    setFilters((prev) => prev.filter((f) => f.id !== id));

  const clearAllFilters = () => setFilters([]);

  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [sortBy, setSortBy] = useState<string | null>(null);
  let sortedTrips = [...filteredTrips];

  if (sortBy === "price_low") {
    sortedTrips.sort((a, b) => a.price - b.price);
  }
  if (sortBy === "price_high") {
    sortedTrips.sort((a, b) => b.price - a.price);
  }
  if (sortBy === "discount") {
    sortedTrips.sort((a, b) => (b.discount || 0) - (a.discount || 0));
  }
  if (sortBy === "popularity") {
    sortedTrips.sort((a, b) => b.rating - a.rating);
  }
  type SortType = "price_low" | "price_high" | "discount" | "popularity";


  const sortLabelMap: Record<string, string> = {
    price_low: "Price Per Day: Lowest",
    price_high: "Price Per Day: Highest",
    discount: "Biggest Discount",
    popularity: "Popularity",
  };



  return (
    <div className="min-h-screen bg-[#f5f3f0]">
      <Header title="Search Results" />

      {/* DESKTOP FILTER BAR */}
      <DesktopFilterBar
        filters={filters}
        onRemove={removeFilter}
        onClear={clearAllFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onToggleSort={(state?: boolean) => {
          if (window.innerWidth >= 768) {
            if (typeof state === "boolean") {
              setShowSortDropdown(state);
            } else {
              setShowSortDropdown((prev) => !prev);
            }
          }
        }}

        showSortDropdown={showSortDropdown}

        onSortSelect={(type: SortType) => {
          setSortBy(type);
          setShowSortDropdown(false);
        }}
        selectedSortLabel={sortBy ? sortLabelMap[sortBy] : "Sort By"}
      />

      <main className="max-w-[1400px] bg-white mx-auto px-4 md:px-8 py-6">
        <div className="flex gap-6 ">

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
          <div className="flex-1 ">
            {/* Mobile Filter Tags */}
            <div className="md:hidden mb-3 rounded-2xl border border-[#f1eee9] bg-[#fff6f2] p-4">
              <p className="text-sm font-medium mb-2">Showing results for:</p>

              <FilterTags filters={filters} onRemove={removeFilter} />

              <div className="flex justify-between items-center mt-3">
                <p className="text-sm">
                  <span className="text-[#e07a5f] font-semibold">
                    {filteredTrips.length}
                  </span>{" "}
                  trips found
                </p>

                {filters.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[#e07a5f] underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>


            {filteredTrips.length === 0 ? (
              <NoTripsFound />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedTrips.map((trip) => (
                  <SearchResultsTripCard key={trip.id} {...trip} />
                ))}

              </div>
            )}

          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM FILTER BAR */}
      <MobileBottomBar
        onSort={() => {
          setShowFilters(false);   // Ensure no overlap
          setShowSortDropdown(true);
        }}
        onFilters={() => setShowFilters(true)}
        sortLabel={sortBy ? sortLabelMap[sortBy] : "Sort By"}
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
      {/* MOBILE SORT SHEET */}
      {showSortDropdown && (
        <div
          className="fixed inset-0 z-50 flex items-end md:hidden"
          onClick={() => setShowSortDropdown(false)}
        >

          <div
            className="bg-white w-full rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-semibold mb-3">Sort By</p>

            <button
              onClick={() => { setSortBy("price_low"); setShowSortDropdown(false); }}
              className="w-full text-left py-3 border-b"
            >
              Price Per Day: Lowest
            </button>

            <button
              onClick={() => { setSortBy("price_high"); setShowSortDropdown(false); }}
              className="w-full text-left py-3 border-b"
            >
              Price Per Day: Highest
            </button>

            <button
              onClick={() => { setSortBy("discount"); setShowSortDropdown(false); }}
              className="w-full text-left py-3 border-b"
            >
              Biggest Discount
            </button>

            <button
              onClick={() => { setSortBy("popularity"); setShowSortDropdown(false); }}
              className="w-full text-left py-3"
            >
              Popularity
            </button>
          </div>
        </div>
      )}


      <div className="h-16 md:hidden" />
    </div>
  );
}
