"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LibraryItem = {
  id: string;
  title: string;
  location?: string;
  description?: string;
  image?: string;
};

type Category =
  | "events"
  | "stays"
  | "transit"
  | "meals"
  | "activities"
  | "trip-leaders"
  | "faqs";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (item: LibraryItem) => void;
  category: Category;
};

// Mock data (replace with API calls later)
const mockData: Record<Category, LibraryItem[]> = {
  events: [
    {
      id: "1",
      title: "Rajasthan Folk Festival",
      description: "Cultural performances",
    },
  ],
  stays: [
    {
      id: "2",
      title: "Hotel Taj",
      location: "Mumbai",
      description: "Luxury 5-star hotel",
    },
    {
      id: "3",
      title: "Beach Resort",
      location: "Goa",
      description: "Sea-facing resort",
    },
  ],
  transit: [
    { id: "4", title: "Mumbai → Goa Express", description: "AC Sleeper Bus" },
  ],
  meals: [
    {
      id: "5",
      title: "Trishna Restaurant",
      location: "Mumbai",
      description: "Seafood cuisine",
    },
  ],
  activities: [
    {
      id: "6",
      title: "Scuba Diving",
      location: "Andaman",
      description: "Certified instructors",
    },
  ],
  "trip-leaders": [
    {
      id: "1",
      title: "John Does",
      description: "Adventure awaits beyond comfort zones",
      image: "/leaders/john.jpg", // mock path
    },
    {
      id: "2",
      title: "Sarah Lee",
      description: "Guiding with passion and purpose",
      image: "/leaders/sarah.jpg",
    },
  ],

  faqs: [
    {
      id: "8",
      title: "What is included?",
      description: "Accommodation, meals, transport",
    },
  ],
};

export function LibrarySelectModal({
  open,
  onClose,
  onSelect,
  category,
}: Props) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  const items = mockData[category].filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = () => {
    const item = mockData[category].find((i) => i.id === selected);
    if (item) {
      onSelect(item);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add from Library</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/* Search */}
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Items */}
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition ${
                  selected === item.id
                    ? "border-orange-500 shadow"
                    : "border-gray-200 hover:border-orange-400"
                }`}
              >
                <div className="font-medium text-gray-900">{item.title}</div>
                {item.location && (
                  <div className="text-sm text-gray-600">{item.location}</div>
                )}
                {item.description && (
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {item.description}
                  </div>
                )}
              </button>
            ))}

            {items.length === 0 && (
              <p className="text-sm text-gray-500">No items found</p>
            )}
          </div>
        </div>
        {category === "trip-leaders" &&
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                selected === item.id
                  ? "border-orange-500 shadow"
                  : "border-gray-200 hover:border-orange-400"
              }`}
            >
              <img
                src={item.image || "/default-avatar.png"}
                alt={item.title}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-medium text-gray-900">{item.title}</div>
                {item.description && (
                  <div className="text-sm text-gray-600">
                    "{item.description}"
                  </div>
                )}
              </div>
            </button>
          ))}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full px-6">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSelect}
            disabled={!selected}
            className="rounded-full px-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white"
          >
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
