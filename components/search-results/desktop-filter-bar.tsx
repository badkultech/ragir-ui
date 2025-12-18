"use client"

import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { FilterTags } from "./filter-tags";

export function DesktopFilterBar({
  filters,
  onRemove,
  onClear,
  onToggleFilters,
  onToggleSort,
  showSortDropdown,
  onSortSelect,
}: any) {
  return (
    <div className="hidden md:block border-b bg-white">
      <div className="flex items-center gap-4 px-8 py-3 max-w-[1400px] mx-auto">

        {/* Advanced Filters */}
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Advanced Filters
        </button>

        {/* Sort By */}
        <button
          onClick={onToggleSort}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
        >
          Sort By
          <ChevronDown className="w-4 h-4" />
        </button>
        {/* SORT DROPDOWN */}
        {showSortDropdown && (
          <div className="absolute mt-32 ml-[180px] bg-white shadow-xl rounded-2xl py-3 w-60 z-50 border">

            <button
              onClick={() => onSortSelect?.onSort("price_low")}
              className="w-full text-left px-5 py-2.5 text-sm hover:bg-gray-100"
            >
              Price Per Day: Lowest
            </button>

            <button
              onClick={() => onSortSelect?.onSort("price_high")}
              className="w-full text-left px-5 py-2.5 text-sm hover:bg-gray-100"
            >
              Price Per Day: Highest
            </button>

            <button
              onClick={() => onSortSelect?.onSort("discount")}
              className="w-full text-left px-5 py-2.5 text-sm hover:bg-gray-100"
            >
              Biggest Discount
            </button>

            <button
              onClick={() => onSortSelect?.onSort("popularity")}
              className="w-full text-left px-5 py-2.5 text-sm hover:bg-gray-100"
            >
              Popularity
            </button>
          </div>
        )}


        {/* Filter Tags */}
        <div className="flex-1 flex items-center justify-between bg-[#fff6f2] rounded-xl px-4 py-3">

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-[#6b6b6b]">Showing results for:</span>
            <FilterTags filters={filters} onRemove={onRemove} />
          </div>

          {filters.length > 0 && (
            <button onClick={onClear} className="text-xs font-medium text-[#e07a5f]">
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
