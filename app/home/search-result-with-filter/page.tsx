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
import { useSearchPublicTripsQuery } from "@/lib/services/trip-search";

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

  const criteria: any = {
    month: monthFromUrl ? Number(monthFromUrl) : undefined,
    year: yearFromUrl ? Number(yearFromUrl) : undefined,
    destinationTags: [],
    moods: []
  };

  // destination
  if (destinationFromUrl) {
    criteria.destinationTags.push(
      destinationFromUrl.toLowerCase().replace(/\s+/g, "_")
    );
  }

  // moods
  const moodsAll = searchParams.getAll("moods");

if (moodsAll.length > 0) {
  criteria.moods = moodsAll.map(m =>
    m.replace("-", "_").toLowerCase()
  );
}

let parsedMoods: string[] = moodsAll;

if (moodsAll.length > 0) {
  parsedMoods = moodsAll;
} else if (moodsFromUrl) {
  try {
    parsedMoods = JSON.parse(moodsFromUrl);
  } catch {}
}


  /* ---- Initial Filters Build ---- */
  const [filters, setFilters] = useState(() => {
    let list: { id: number; label: string }[] = [];
    let id = 1;

    parsedMoods.forEach((m) => list.push({ id: id++, label: m }));

    if (destinationFromUrl)
      list.push({ id: id++, label: `DestinationTags: ${destinationFromUrl}` });
    if (regionFromUrl)
      list.push({ id: id++, label: `Region: ${regionFromUrl}` });

    if (yearFromUrl) list.push({ id: id++, label: `Year: ${yearFromUrl}` });
    if (monthFromUrl) list.push({ id: id++, label: `Month: ${monthFromUrl}` });

    return list;
  });

  /* ---------------- FILTER LOGIC ---------------- */
  const { data, isLoading, error } = useSearchPublicTripsQuery({
    criteria,
    pageable: { page: 0, size: 10 }
  });
  const apiTrips = data?.content || [];




  /* ---------------- ACTIONS ---------------- */
  const removeFilter = (id: number) =>
    setFilters((prev) => prev.filter((f) => f.id !== id));

  const clearAllFilters = () => setFilters([]);

  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [sortBy, setSortBy] = useState<string | null>(null);
  let sortedTrips = [...apiTrips];

  if (sortBy === "price_low") {
    sortedTrips.sort((a, b) => (a.price || 0) - (b.price || 0));
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
                    {apiTrips.length}
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


            {isLoading && <p>Loading trips...</p>}

            {error && <p className="text-red-500">Failed to load trips</p>}

            {!isLoading && apiTrips.length === 0 && <NoTripsFound />}

           {apiTrips.length > 0 && (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {apiTrips.map((trip: any) => (
      <SearchResultsTripCard
        key={trip.publicId}
        id={trip.publicId}
        title={trip.name}
        provider={trip.providerName || "—"}
        location={
          trip.cityTags?.join(", ") ||
          trip.destinationTags?.join(", ") ||
          "—"
        }
        rating={trip.rating || 4.5}
        days={`${trip.totalDays || "-"}D/${trip.totalNights || "-"}N`}
        dates={`${trip.startDate} — ${trip.endDate}`}
        price={trip.startingPrice || 0}
        image={trip.bannerImageUrl || "/hampi-ruins-temples.png"}
        badges={[
          ...(trip.moodTags || []),
          ...(trip.destinationTags || []),
        ]}
      />
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
