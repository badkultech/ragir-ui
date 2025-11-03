"use client";

import clsx from "clsx";

export default function TripTabs({ activeTab, setActiveTab }: any) {
  const tabs = [
    { key: "upcoming", label: "Upcoming (3)" },
    { key: "past", label: "Past (2)" },
    { key: "drafts", label: "Drafts (2)" },
    { key: "archived", label: "Archived (2)" },
    { key: "deleted", label: "Deleted (2)" },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "px-5 py-2 text-sm sm:text-base font-medium rounded-lg border transition-all duration-200",
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
  );
}
