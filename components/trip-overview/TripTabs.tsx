"use client";

import clsx from "clsx";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function TripTabs({ activeTab, setActiveTab, onCreate }: any) {
  const tabs = [
    { key: "upcoming", label: "Upcoming (3)" },
    { key: "past", label: "Past (2)" },
    { key: "drafts", label: "Drafts (2)" },
    { key: "archived", label: "Archived (2)" },
    { key: "deleted", label: "Deleted (2)" },
  ];

  return (
    <div className="w-full">
      {/* Row 1: tabs + create */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex gap-3 items-center overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={clsx(
                  "h-12 px-5 text-sm sm:text-base font-medium rounded-lg border transition-all duration-200 flex-shrink-0",
                  isActive
                    ? "bg-[#FF6B00] text-white border-[#FF6B00]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-shrink-0">
          <Link href="/organizer/create-trip">
          <button
            className={clsx(
              "flex items-center gap-2 h-12 px-5 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 border",
              activeTab === "create"
                ? "bg-[#FF6B00] text-white border-[#FF6B00]"
                : "bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00] hover:bg-[#FF6B00] hover:text-white"
            )}
          >
            <Plus className="w-4 h-4" />
            Create Trip
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
