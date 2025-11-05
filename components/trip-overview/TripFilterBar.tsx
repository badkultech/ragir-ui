"use client";

import * as React from "react";
import {
  CalendarDays,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addDays, format } from "date-fns";

export default function TripFilterBar({ tab }: { tab: string }) {
  const key = String(tab || "").toLowerCase().replace(/s$/, "");
  const [sortBy, setSortBy] = React.useState("Newest to Oldest");
  const [status, setStatus] = React.useState("All Status");
  const [dateRange, setDateRange] = React.useState<{
    from?: Date;
    to?: Date;
  }>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const sortOptions: Record<string, string[]> = {
    upcoming: ["First to Last Trip", "Last to First Trip"],
    past: ["Most Viewed", "Recent First"],
    draft: ["Newest to Oldest", "Oldest to Newest"],
    archived: ["Newest to Oldest", "Oldest to Newest"],
    deleted: ["Newest to Oldest", "Oldest to Newest"],
  };

  const formattedRange =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "dd MMM, yyyy")} - ${format(dateRange.to, "dd MMM, yyyy")}`
      : "Date Range";

  return (
    <div className="flex flex-wrap gap-3 items-center mt-4">
      {/* 🔍 Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search trips by name or destination.."
          className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-gray-300 focus:outline-none"
        />
      </div>

      {/* 🗓️ Date Range - only for Upcoming & Past */}
      {(key === "upcoming" || key === "past") && (
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <CalendarDays size={16} />
              {formattedRange}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <div className="p-4">
              <Calendar
                mode="range"
                selected={dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : undefined}
                onSelect={(range) => setDateRange(range ? { from: range.from, to: range.to } : { from: undefined, to: undefined })}
                numberOfMonths={1}
                className="rounded-md border"
                required={false}
                styles={{
                  day_selected: {
                    backgroundColor: "#FF6B00",
                    color: "white",
                  },
                  day_range_middle: {
                    backgroundColor: "#FFF3E9",
                    color: "#FF6B00",
                  },
                }}
              />
              <div className="flex justify-between mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-700 border-gray-300"
                  onClick={() => setDateRange({ from: undefined, to: undefined })}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  className="bg-[#FF6B00] hover:bg-[#e66000]"
                  onClick={() => setCalendarOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* 🎚️ All Status - only for Upcoming */}
      {key === "upcoming" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal size={16} />
              {status}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {["All Status", "Published", "Under Review", "Requires Modification"].map(
              (item) => (
                <DropdownMenuItem
                  key={item}
                  onClick={() => setStatus(item)}
                  className="flex items-center justify-between text-sm"
                >
                  {item}
                  {status === item && <Check className="w-4 h-4 text-orange-500" />}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* 🧭 Sort By (all tabs) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Sort By
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {sortOptions[key]?.map((item) => (
            <DropdownMenuItem
              key={item}
              onClick={() => setSortBy(item)}
              className="flex items-center justify-between text-sm"
            >
              {item}
              {sortBy === item && <Check className="w-4 h-4 text-orange-500" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
