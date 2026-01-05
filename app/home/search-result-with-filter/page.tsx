"use client";

import { useState, useEffect } from "react";
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
    title: "Himalayans Adventure Trek",
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

const calculateDuration = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return "-D/-N";
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "-D/-N";

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${nights + 1}D/${nights}N`;
};

export default function SearchResultsWithFilters() {
  const searchParams = useSearchParams();

  const moodsFromUrl = searchParams.get("moods");
  const destinationFromUrl = searchParams.get("destinationTags");
  const regionFromUrl = searchParams.get("region");
  const yearFromUrl = searchParams.get("year");
  const monthFromUrl = searchParams.get("month");

  const moodsAll = searchParams.getAll("moods");

  // ---------- INITIAL API CRITERIA ----------
  const [criteria, setCriteria] = useState<any>({
    month: monthFromUrl ? Number(monthFromUrl) : undefined,
    year: yearFromUrl ? Number(yearFromUrl) : undefined,
    destinationTags: destinationFromUrl
      ? [destinationFromUrl.toLowerCase().replace(/\s+/g, "_")]
      : [],
    moods:
      moodsAll.length > 0
        ? moodsAll.map((m) => m.replace("-", "_").toLowerCase())
        : [],
  });

  // ---------- UI FILTER TAGS ----------
  let parsedMoods: string[] = moodsAll;

  if (moodsAll.length === 0 && moodsFromUrl) {
    try {
      parsedMoods = JSON.parse(moodsFromUrl);
    } catch { }
  }

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

  // ---------- API CALL ----------
  const { data, isLoading, error } = useSearchPublicTripsQuery({
    criteria,
    pageable: { page: 0, size: 10 },
  });

  const apiTrips = data?.content || [];




  // ---------- ACTIONS ----------
  const removeFilter = (id: number) => {
    const filterToRemove = filters.find((f) => f.id === id);
    if (!filterToRemove) return;

    // Update UI filters
    setFilters((prev) => prev.filter((f) => f.id !== id));

    // Update API criteria based on which filter was removed
    setCriteria((prev: any) => {
      const newCriteria = { ...prev };
      const label = filterToRemove.label.toLowerCase();

      // Check if it's a mood filter
      const moodTypes = ['adventure', 'trekking', 'wellness', 'skygaze', 'cultural', 'wildlife', 'beach', 'spiritual'];
      if (moodTypes.some(mood => label.includes(mood))) {
        const moodToRemove = label.replace(/\s+/g, '_');
        newCriteria.moods = (prev.moods || []).filter((m: string) => m !== moodToRemove);
      }
      // Check if it's a destination filter
      else if (label.startsWith('destination:')) {
        const destination = label.replace('destination:', '').trim().toLowerCase().replace(/\s+/g, '_');
        newCriteria.destinationTags = (prev.destinationTags || []).filter((d: string) => d !== destination);
      }
      // Check if it's a region filter
      else if (label.startsWith('region:')) {
        delete newCriteria.region;
      }
      // Check if it's a year filter
      else if (label.startsWith('year:')) {
        delete newCriteria.year;
      }
      // Check if it's a month filter
      else if (label.startsWith('month:')) {
        delete newCriteria.month;
      }
      // Check if it's a duration filter
      else if (label.includes('days')) {
        delete newCriteria.minDays;
        delete newCriteria.maxDays;
      }

      return newCriteria;
    });
  };

  const clearAllFilters = () => {
    setFilters([]);
    // Reset criteria to empty state
    setCriteria({
      month: undefined,
      year: undefined,
      destinationTags: [],
      moods: [],
    });
  };

  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [sortBy, setSortBy] = useState<string | null>(null);

  const sortLabelMap: Record<string, string> = {
    price_low: "Price Per Day: Lowest",
    price_high: "Price Per Day: Highest",
    discount: "Biggest Discount",
    popularity: "Popularity",
  };

  type SortType = "price_low" | "price_high" | "discount" | "popularity";

  return (
    <>
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
              if (typeof state === "boolean") setShowSortDropdown(state);
              else setShowSortDropdown((p) => !p);
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
                setCriteria((prev: any) => ({
                  ...prev,

                  // moods - keep original case, just replace spaces
                  moods: data.moods?.map((m: string) =>
                    m.replace(/\s+/g, "_")
                  ) || [],

                  // destinations - keep original case, just replace spaces
                  destinationTags: data.destinations?.map((d: string) =>
                    d.replace(/\s+/g, "_")
                  ) || [],

                  // duration
                  ...(data.duration === "3-5 Days" && { minDays: 3, maxDays: 5 }),
                  ...(data.duration === "6-7 Days" && { minDays: 6, maxDays: 7 }),
                  ...(data.duration === "7+ Days" && { minDays: 7 }),

                  // age (if present)
                  ...(data.minAge && { minAge: Number(data.minAge) }),
                  ...(data.maxAge && { maxAge: Number(data.maxAge) }),

                  // budget -> API (only set if non-zero)
                  ...(data.minBudget && data.minBudget > 0 && { minBudget: Number(data.minBudget) }),
                  ...(data.maxBudget && data.maxBudget > 0 && { maxBudget: Number(data.maxBudget) }),
                }));

                // TAGS UI (same)
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

            {/* RESULTS */}
            <div className="flex-1 ">
              {isLoading && <p>Loading trips...</p>}

              {error && (
                <p className="text-red-500">Failed to load trips</p>
              )}

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
                      days={calculateDuration(trip.startDate, trip.endDate)}
                      dates={`${trip.startDate} — ${trip.endDate}`}
                      price={trip.startingPrice || 0}
                      image={
                        trip.bannerImageUrl ||
                        "/hampi-ruins-temples.png"
                      }
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

        {/* MOBILE BOTTOM BAR */}
        <MobileBottomBar
          onSort={() => {
            setShowFilters(false);
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
              setCriteria((prev: any) => ({
                ...prev,

                // moods - keep original case, just replace spaces
                moods: data.moods?.map((m: string) =>
                  m.replace(/\s+/g, "_")
                ) || [],

                // destinations - keep original case, just replace spaces
                destinationTags: data.destinations?.map((d: string) =>
                  d.replace(/\s+/g, "_")
                ) || [],

                ...(data.duration === "3-5 Days" && { minDays: 3, maxDays: 5 }),
                ...(data.duration === "6-7 Days" && { minDays: 6, maxDays: 7 }),
                ...(data.duration === "7+ Days" && { minDays: 7 }),

                ...(data.minAge && { minAge: Number(data.minAge) }),
                ...(data.maxAge && { maxAge: Number(data.maxAge) }),

                // budget -> API (only set if non-zero)
                ...(data.minBudget && data.minBudget > 0 && { minBudget: Number(data.minBudget) }),
                ...(data.maxBudget && data.maxBudget > 0 && { maxBudget: Number(data.maxBudget) }),
              }));

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
    </>
  );
}
