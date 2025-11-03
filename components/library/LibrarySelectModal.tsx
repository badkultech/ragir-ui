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
import { Skeleton } from "@/components/ui/skeleton"; // for loading state
import { useGetOrganizerFaqsQuery } from "@/lib/services/organizer/trip/library/faq";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { useGetOrganizerTransitsQuery } from "@/lib/services/organizer/trip/library/transit";
import { useGetGroupLeadersQuery } from "@/lib/services/organizer/trip/library/leader";




export type LibraryItem = {
  id: string;
  title: string;
  location?: string;
  description?: string;
  image?: string;
  answer?: string;
  imageUrl?: string;
  profileImageUrl?: string;
  tagline?: string;
  name?: string;

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

export function LibrarySelectModal({
  open,
  onClose,
  onSelect,
  category,
}: Props) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
const { userData } = useSelector(selectAuthState);
const organizationId = userData?.organizationPublicId;

const shouldSkip = !organizationId;

const {
  data: itemsData,
  isLoading,
  isError,
} =
  category === "faqs"
    ? useGetOrganizerFaqsQuery(
        { organizationId },
        { skip: shouldSkip, refetchOnMountOrArgChange: true }
      )
    : category === "transit"
    ? useGetOrganizerTransitsQuery(
        { organizationId },
        { skip: shouldSkip, refetchOnMountOrArgChange: true }
      )
    : category === "trip-leaders"
    ? useGetGroupLeadersQuery(organizationId ?? "", {
        skip: shouldSkip,
        refetchOnMountOrArgChange: true,
      })
    : { data: [], isLoading: false, isError: false };


      // : category === "stays"
      // ? useGetOrganizerStaysQuery()
      // : category === "meals"
      // ? useGetOrganizerMealsQuery()
      // : category === "transit"
      // ?
      // : category === "activities"
      // ? useGetOrganizerActivitiesQuery()
      // : category === "events"
      // ? useGetOrganizerEventsQuery()
      // : useGetOrganizerTripLeadersQuery();

  const items: LibraryItem[] =
    itemsData?.map((item: any) => ({
      id: item.id?.toString(),
      title: item.title || item.name || "Untitled",
      answer: item.answer,
      location: item.location || item.city || "",
      description: item.description || item.details || "",
      image: item.imageUrl || item.photo || "",
    })) ?? [];

  // 🔍 Search filter
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = () => {
    const item = items.find((i) => i.id === selected);
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
          {/* 🔍 Search */}
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && (
            <p className="text-sm text-red-500">Failed to load items</p>
          )}

          {/* Items list */}
          {!isLoading && !isError && (
            <>
              {category === "trip-leaders" ? (
                <div className="flex flex-col gap-4">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelected(item.id)}
                      onDoubleClick={() => {
                        setSelected(item.id);
                        onSelect(item);
                        onClose();
                      }}
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
                        <div className="font-medium text-gray-900">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-sm text-gray-600">
                            "{item.description}"
                          </div>
                        )}
                         {item.answer && (
                          <div className="text-sm text-gray-600">
                            "{item.answer}"
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelected(item.id)}
                      onDoubleClick={() => {
                        setSelected(item.id);
                        onSelect(item);
                        onClose();
                      }}
                      className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition ${
                        selected === item.id
                          ? "border-orange-500 shadow"
                          : "border-gray-200 hover:border-orange-400"
                      }`}
                    >
                      <div className="font-medium text-gray-900">
                        {item.title}
                      </div>
                      {item.location && (
                        <div className="text-sm text-gray-600">
                          {item.location}
                        </div>
                      )}
                      {item.description && (
                        <div className="text-xs text-gray-500 line-clamp-2">
                          {item.description}
                        </div>
                      )}
                       {item.answer && (
                        <div className="text-sm text-gray-600">
                          {item.answer}
                        </div>
                      )}
                    </button>
                  ))}
                  {filteredItems.length === 0 && (
                    <p className="text-sm text-gray-500">No items found</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

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
